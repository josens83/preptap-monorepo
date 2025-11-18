import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

/**
 * Subscription plans with features
 */
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'FREE',
    name: '무료',
    price: 0,
    priceId: null,
    interval: null,
    features: [
      '일 5문제 풀이',
      '기본 리포트',
      '오답노트',
    ],
    limits: {
      dailyQuestions: 5,
      monthlyQuestions: 150,
    },
  },
  BASIC: {
    id: 'BASIC',
    name: '베이직',
    price: 9900,
    priceId: env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || 'price_basic',
    interval: 'month' as const,
    features: [
      '일 30문제 풀이',
      '상세 리포트',
      '오답노트 무제한',
      '약점 분석',
    ],
    limits: {
      dailyQuestions: 30,
      monthlyQuestions: 900,
    },
  },
  PRO: {
    id: 'PRO',
    name: '프로',
    price: 19900,
    priceId: env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
    interval: 'month' as const,
    features: [
      '무제한 문제 풀이',
      '고급 리포트',
      'AI 약점 보완',
      '적응형 학습',
      '스터디 그룹',
    ],
    limits: {
      dailyQuestions: Infinity,
      monthlyQuestions: Infinity,
    },
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: '프리미엄',
    price: 39900,
    priceId: env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    interval: 'month' as const,
    features: [
      'Pro의 모든 기능',
      '1:1 멘토링 (월 2회)',
      '모의고사 무제한',
      '우선 지원',
    ],
    limits: {
      dailyQuestions: Infinity,
      monthlyQuestions: Infinity,
      mentoringHours: 2,
    },
  },
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  planId: PlanId,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userId,
    metadata: {
      userId,
      planId,
    },
    subscription_data: {
      metadata: {
        userId,
        planId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  });

  return session;
}

/**
 * Create a billing portal session
 */
export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });
  return subscription;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

/**
 * Reactivate subscription
 */
export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
  return subscription;
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({
    email,
    limit: 1,
  });

  return customers.data[0] || null;
}

/**
 * Create customer
 */
export async function createCustomer(email: string, userId: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId,
    },
  });

  return customer;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * Format amount for display (KRW)
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}
