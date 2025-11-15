import Stripe from "stripe";
import { env } from "./env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const STRIPE_PLANS = {
  MONTHLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY || "price_monthly",
    amount: 29000, // 29,000 KRW
    interval: "month" as const,
  },
  YEARLY: {
    priceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY || "price_yearly",
    amount: 290000, // 290,000 KRW (2 months free)
    interval: "year" as const,
  },
};
