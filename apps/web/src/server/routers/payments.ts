import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { stripe, SUBSCRIPTION_PLANS, PlanId, createCheckoutSession, createBillingPortalSession } from "@/lib/stripe";
import { env } from "@/lib/env";

export const paymentsRouter = createTRPCRouter({
  /**
   * Create Stripe Checkout Session for subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["BASIC", "PRO", "PREMIUM"]),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { profile: true },
      });

      if (!user || !user.email) {
        throw new TRPCError({ code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다." });
      }

      const planConfig = SUBSCRIPTION_PLANS[input.plan];

      if (!planConfig.priceId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "유효하지 않은 플랜입니다." });
      }

      const successUrl = input.successUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`;
      const cancelUrl = input.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/pricing`;

      const session = await createCheckoutSession(
        user.id,
        planConfig.priceId,
        input.plan,
        successUrl,
        cancelUrl
      );

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Create Billing Portal session
   */
  createBillingPortalSession: protectedProcedure
    .input(
      z.object({
        returnUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's subscription
      const subscription = await ctx.prisma.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!subscription || !subscription.stripeCustomerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "구독 정보를 찾을 수 없습니다. 먼저 구독을 진행해주세요.",
        });
      }

      const returnUrl = input.returnUrl || `${env.NEXT_PUBLIC_APP_URL}/settings`;

      const session = await createBillingPortalSession(
        subscription.stripeCustomerId,
        returnUrl
      );

      return {
        url: session.url,
      };
    }),

  /**
   * Get user's subscription status
   */
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscription;
  }),

  /**
   * Get user's subscription with plan details
   */
  getSubscriptionWithDetails: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findFirst({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!subscription) {
      return {
        subscription: null,
        plan: SUBSCRIPTION_PLANS.FREE,
        isActive: false,
      };
    }

    const planId = (subscription.plan || 'FREE') as PlanId;
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.FREE;
    const isActive = subscription.status === 'ACTIVE';

    return {
      subscription,
      plan,
      isActive,
    };
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findFirst({
      where: {
        userId: ctx.session.user.id,
        status: "ACTIVE",
      },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "활성 구독을 찾을 수 없습니다.",
      });
    }

    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Update in database
    await ctx.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
      },
    });

    return {
      success: true,
      message: "구독이 취소되었습니다. 현재 기간이 끝날 때까지 서비스를 이용하실 수 있습니다.",
    };
  }),

  /**
   * Reactivate subscription
   */
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const subscription = await ctx.prisma.subscription.findFirst({
      where: {
        userId: ctx.session.user.id,
        cancelAtPeriodEnd: true,
      },
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "취소된 구독을 찾을 수 없습니다.",
      });
    }

    // Reactivate in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update in database
    await ctx.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: false,
      },
    });

    return {
      success: true,
      message: "구독이 재활성화되었습니다.",
    };
  }),

  /**
   * Get available plans
   */
  getAvailablePlans: protectedProcedure.query(async () => {
    return Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => ({
      id,
      ...plan,
    }));
  }),
});
