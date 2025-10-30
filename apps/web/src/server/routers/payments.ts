import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { stripe, STRIPE_PLANS } from "@/lib/stripe";
import { env } from "@/lib/env";

export const paymentsRouter = createTRPCRouter({
  /**
   * Create Stripe Checkout Session for subscription
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        plan: z.enum(["MONTHLY", "YEARLY"]),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { profile: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const planConfig = STRIPE_PLANS[input.plan];

      const session = await stripe.checkout.sessions.create({
        customer_email: user.email,
        client_reference_id: user.id,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        success_url: input.successUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
        cancel_url: input.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/pricing`,
        metadata: {
          userId: user.id,
          plan: input.plan,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
          },
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  /**
   * Create checkout session for course purchase
   */
  createCourseCheckout: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        successUrl: z.string().optional(),
        cancelUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const course = await ctx.prisma.course.findUnique({
        where: { id: input.courseId },
      });

      if (!course || !course.isPublished) {
        throw new TRPCError({ code: "NOT_FOUND", message: "코스를 찾을 수 없습니다." });
      }

      // Check if already enrolled
      const existingEnrollment = await ctx.prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.session.user.id,
            courseId: input.courseId,
          },
        },
      });

      if (existingEnrollment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "이미 구매한 코스입니다.",
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer_email: ctx.session.user.email,
        client_reference_id: ctx.session.user.id,
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "krw",
              product_data: {
                name: course.title,
                description: course.description || undefined,
              },
              unit_amount: course.price,
            },
            quantity: 1,
          },
        ],
        success_url:
          input.successUrl || `${env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}?success=true`,
        cancel_url: input.cancelUrl || `${env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
        metadata: {
          userId: ctx.session.user.id,
          courseId: course.id,
          type: "course_purchase",
        },
      });

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
      // Get user's Stripe customer ID from subscription
      const subscription = await ctx.prisma.subscription.findFirst({
        where: {
          userId: ctx.session.user.id,
          provider: "STRIPE",
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!subscription || !subscription.providerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "구독 정보를 찾을 수 없습니다.",
        });
      }

      // Get customer ID from Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.providerId);

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeSubscription.customer as string,
        return_url: input.returnUrl || `${env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
      });

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
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return subscription;
  }),

  /**
   * Get user's enrolled courses
   */
  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    const enrollments = await ctx.prisma.enrollment.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return enrollments;
  }),
});
