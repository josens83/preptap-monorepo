/**
 * Subscription Hooks
 *
 * 클라이언트에서 구독 상태 확인
 */

"use client";

import { useMemo } from "react";
import { trpc } from "@/lib/trpc";
import {
  SubscriptionPlan,
  getPlanLimits,
  hasFeatureAccess,
  canAccessExamType,
  canStartNewSession,
  getUpgradeRecommendation,
  getPlanDisplayName,
} from "@/lib/subscription-limits";

export function useSubscription() {
  const { data: user, isLoading } = trpc.user.me.useQuery();

  const plan = useMemo(() => {
    if (!user?.subscription?.[0]) {
      return SubscriptionPlan.FREE;
    }

    return (user.subscription[0].planName as SubscriptionPlan) || SubscriptionPlan.FREE;
  }, [user]);

  const limits = useMemo(() => getPlanLimits(plan), [plan]);

  const isActive = useMemo(() => {
    if (plan === SubscriptionPlan.FREE) return true;
    return user?.subscription?.[0]?.status === "ACTIVE";
  }, [plan, user]);

  const isPaid = plan !== SubscriptionPlan.FREE;

  const planDisplayName = getPlanDisplayName(plan);

  return {
    plan,
    limits,
    isActive,
    isPaid,
    isLoading,
    planDisplayName,
    subscription: user?.subscription?.[0],
  };
}

/**
 * 기능 접근 권한 확인
 */
export function useFeatureAccess(feature: keyof PlanLimits) {
  const { plan, isLoading } = useSubscription();

  const hasAccess = useMemo(() => {
    if (isLoading) return false;
    return hasFeatureAccess(plan, feature);
  }, [plan, feature, isLoading]);

  const recommendation = useMemo(() => {
    if (hasAccess) return null;

    return getUpgradeRecommendation(plan, {
      dailySessionsUsed: 0,
      requestedFeature: feature,
    });
  }, [plan, feature, hasAccess]);

  return {
    hasAccess,
    isLoading,
    recommendation,
  };
}

/**
 * 시험 유형 접근 권한 확인
 */
export function useExamTypeAccess(examType: string) {
  const { plan, isLoading } = useSubscription();

  const hasAccess = useMemo(() => {
    if (isLoading) return false;
    return canAccessExamType(plan, examType);
  }, [plan, examType, isLoading]);

  const recommendation = useMemo(() => {
    if (hasAccess) return null;

    return getUpgradeRecommendation(plan, {
      dailySessionsUsed: 0,
      requestedExamType: examType,
    });
  }, [plan, examType, hasAccess]);

  return {
    hasAccess,
    isLoading,
    recommendation,
  };
}

/**
 * 일일 세션 제한 확인
 */
export function useDailySessionLimit() {
  const { plan, isLoading: planLoading } = useSubscription();
  const { data: todaySessions, isLoading: sessionsLoading} = trpc.practice.getTodayCount.useQuery();

  const todayCount = todaySessions || 0;

  const sessionCheck = useMemo(() => {
    if (planLoading || sessionsLoading) {
      return { allowed: false, loading: true };
    }

    return canStartNewSession(plan, todayCount);
  }, [plan, todayCount, planLoading, sessionsLoading]);

  const recommendation = useMemo(() => {
    if (sessionCheck.allowed) return null;

    return getUpgradeRecommendation(plan, {
      dailySessionsUsed: todayCount,
    });
  }, [plan, todayCount, sessionCheck.allowed]);

  const remaining = useMemo(() => {
    if (!sessionCheck.limit || sessionCheck.limit === -1) {
      return -1; // 무제한
    }

    return Math.max(0, sessionCheck.limit - todayCount);
  }, [sessionCheck.limit, todayCount]);

  return {
    allowed: sessionCheck.allowed,
    limit: sessionCheck.limit,
    used: todayCount,
    remaining,
    isLoading: planLoading || sessionsLoading,
    recommendation,
  };
}

/**
 * 업그레이드 필요 여부 확인
 */
export function useUpgradeCheck() {
  const { plan, isPaid } = useSubscription();

  const shouldUpgradeForSessions = useMemo(() => {
    return plan === SubscriptionPlan.FREE;
  }, [plan]);

  const shouldUpgradeForFeatures = useMemo(() => {
    return plan === SubscriptionPlan.FREE || plan === SubscriptionPlan.BASIC;
  }, [plan]);

  return {
    shouldUpgradeForSessions,
    shouldUpgradeForFeatures,
    isPaid,
  };
}
