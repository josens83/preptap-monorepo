/**
 * Subscription Middleware
 *
 * tRPC 미들웨어로 구독 기능 제한 적용
 */

import { TRPCError } from "@trpc/server";
import { middleware, publicProcedure } from "../trpc";
import { SubscriptionPlan, canAccessExamType, hasFeatureAccess, canStartNewSession, getUpgradeRecommendation } from "@/lib/subscription-limits";
import { db } from "@preptap/db";

/**
 * 구독 플랜 확인 미들웨어
 */
export const subscriptionMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "로그인이 필요합니다",
    });
  }

  // 사용자 구독 정보 조회
  const user = await db.user.findUnique({
    where: { id: ctx.session.user.id },
    include: {
      subscription: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "사용자를 찾을 수 없습니다",
    });
  }

  // 활성 구독 확인
  const activeSubscription = user.subscription[0];
  const plan = (activeSubscription?.planName as SubscriptionPlan) || SubscriptionPlan.FREE;

  return next({
    ctx: {
      ...ctx,
      user,
      subscriptionPlan: plan,
    },
  });
});

/**
 * 구독 보호 프로시저 (로그인 + 구독 필수)
 */
export const protectedProcedure = publicProcedure.use(subscriptionMiddleware);

/**
 * 특정 플랜 이상 필요한 프로시저
 */
export function requirePlan(minPlan: SubscriptionPlan) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const planOrder = [
      SubscriptionPlan.FREE,
      SubscriptionPlan.BASIC,
      SubscriptionPlan.PRO,
      SubscriptionPlan.PREMIUM,
    ];

    const userPlanIndex = planOrder.indexOf(ctx.subscriptionPlan);
    const requiredPlanIndex = planOrder.indexOf(minPlan);

    if (userPlanIndex < requiredPlanIndex) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `이 기능은 ${minPlan} 플랜 이상부터 이용 가능합니다`,
      });
    }

    return next();
  });
}

/**
 * 특정 기능 접근 권한 확인
 */
export function requireFeature(feature: string) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const hasAccess = hasFeatureAccess(ctx.subscriptionPlan, feature as any);

    if (!hasAccess) {
      const recommendation = getUpgradeRecommendation(ctx.subscriptionPlan, {
        dailySessionsUsed: 0,
        requestedFeature: feature as any,
      });

      throw new TRPCError({
        code: "FORBIDDEN",
        message: recommendation.reason || `이 기능은 유료 플랜에서 이용 가능합니다`,
        cause: {
          recommendedPlan: recommendation.recommendedPlan,
          benefits: recommendation.benefits,
        },
      });
    }

    return next();
  });
}

/**
 * 일일 세션 제한 확인
 */
export const checkDailySessionLimit = protectedProcedure.use(async ({ ctx, next }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 완료한 세션 수 확인
  const todaySessionCount = await db.session.count({
    where: {
      userId: ctx.user.id,
      createdAt: {
        gte: today,
      },
      completedAt: {
        not: null,
      },
    },
  });

  const sessionCheck = canStartNewSession(ctx.subscriptionPlan, todaySessionCount);

  if (!sessionCheck.allowed) {
    const recommendation = getUpgradeRecommendation(ctx.subscriptionPlan, {
      dailySessionsUsed: todaySessionCount,
    });

    throw new TRPCError({
      code: "FORBIDDEN",
      message: sessionCheck.reason || "일일 세션 제한에 도달했습니다",
      cause: {
        limit: sessionCheck.limit,
        used: todaySessionCount,
        recommendedPlan: recommendation.recommendedPlan,
        benefits: recommendation.benefits,
      },
    });
  }

  return next({
    ctx: {
      ...ctx,
      todaySessionCount,
    },
  });
});

/**
 * 시험 유형 접근 권한 확인
 */
export function requireExamType(examType: string) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const hasAccess = canAccessExamType(ctx.subscriptionPlan, examType);

    if (!hasAccess) {
      const recommendation = getUpgradeRecommendation(ctx.subscriptionPlan, {
        dailySessionsUsed: 0,
        requestedExamType: examType,
      });

      throw new TRPCError({
        code: "FORBIDDEN",
        message: `${examType} 시험은 유료 플랜에서 이용 가능합니다`,
        cause: {
          recommendedPlan: recommendation.recommendedPlan,
          benefits: recommendation.benefits,
        },
      });
    }

    return next();
  });
}
