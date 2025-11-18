import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { verifyWebhookSignature } from "@/lib/stripe";
import { db } from "@preptap/db";
import { logger } from "@/lib/logger";
import Stripe from "stripe";

/**
 * Stripe Webhook Handler
 *
 * Handles subscription lifecycle events:
 * - checkout.session.completed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_succeeded
 * - invoice.payment_failed
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      logger.error("Missing stripe-signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (err) {
      logger.error("Webhook signature verification failed", { error: err });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    logger.info("Stripe webhook received", { type: event.type, id: event.id });

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        logger.info(\`Unhandled webhook event: \${event.type}\`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook handler error", { error });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId || session.client_reference_id;
  const planId = session.metadata?.planId;

  if (!userId) {
    logger.error("Missing userId in checkout session", { sessionId: session.id });
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  logger.info("Checkout session completed", {
    userId,
    planId,
    customerId,
    subscriptionId,
  });

  // Get or create subscription record
  if (subscriptionId) {
    // Fetch full subscription details from Stripe
    const stripe = await import("@/lib/stripe").then((m) => m.stripe);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await handleSubscriptionUpdate(subscription);
  }

  // Log payment event
  await db.eventLog.create({
    data: {
      userId,
      eventType: "PAYMENT_SUCCEEDED",
      payloadJson: {
        sessionId: session.id,
        customerId,
        subscriptionId,
        planId,
      },
    },
  });
}

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  const planId = subscription.metadata.planId || "BASIC";

  if (!userId) {
    logger.error("Missing userId in subscription metadata", {
      subscriptionId: subscription.id,
    });
    return;
  }

  const status = mapStripeStatus(subscription.status);

  // Upsert subscription in database
  const dbSubscription = await db.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    create: {
      userId,
      provider: "STRIPE",
      providerId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status,
      plan: planId,
      planName: planId,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      status,
      plan: planId,
      planName: planId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  logger.info("Subscription updated", {
    subscriptionId: dbSubscription.id,
    userId,
    status,
    planId,
  });

  // Log subscription event
  await db.eventLog.create({
    data: {
      userId,
      eventType: subscription.id
        ? "SUBSCRIPTION_UPDATED"
        : "SUBSCRIPTION_CREATED",
      payloadJson: {
        subscriptionId: subscription.id,
        planId,
        status,
      },
    },
  });
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    logger.error("Missing userId in subscription metadata", {
      subscriptionId: subscription.id,
    });
    return;
  }

  // Update subscription status to CANCELED
  await db.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id,
    },
    data: {
      status: "CANCELED",
      cancelAtPeriodEnd: false,
    },
  });

  logger.info("Subscription deleted", {
    subscriptionId: subscription.id,
    userId,
  });

  // Log event
  await db.eventLog.create({
    data: {
      userId,
      eventType: "SUBSCRIPTION_UPDATED",
      payloadJson: {
        subscriptionId: subscription.id,
        status: "CANCELED",
        reason: "deleted",
      },
    },
  });
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;
  const customerId = invoice.customer as string;

  if (!subscriptionId) {
    logger.info("Invoice payment succeeded (non-subscription)", {
      invoiceId: invoice.id,
    });
    return;
  }

  // Get subscription to find userId
  const subscription = await db.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
  });

  if (!subscription) {
    logger.error("Subscription not found for payment", { subscriptionId });
    return;
  }

  // Record payment
  await db.payment.create({
    data: {
      userId: subscription.userId,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      provider: "STRIPE",
      providerRef: invoice.payment_intent as string,
      status: "SUCCEEDED",
      metadata: {
        invoiceId: invoice.id,
        subscriptionId,
      },
    },
  });

  logger.info("Payment succeeded", {
    userId: subscription.userId,
    amount: invoice.amount_paid,
    invoiceId: invoice.id,
  });

  // Log event
  await db.eventLog.create({
    data: {
      userId: subscription.userId,
      eventType: "PAYMENT_SUCCEEDED",
      payloadJson: {
        invoiceId: invoice.id,
        amount: invoice.amount_paid,
        subscriptionId,
      },
    },
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) {
    logger.info("Invoice payment failed (non-subscription)", {
      invoiceId: invoice.id,
    });
    return;
  }

  // Get subscription to find userId
  const subscription = await db.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscriptionId,
    },
  });

  if (!subscription) {
    logger.error("Subscription not found for failed payment", {
      subscriptionId,
    });
    return;
  }

  // Update subscription status to PAST_DUE
  await db.subscription.update({
    where: {
      id: subscription.id,
    },
    data: {
      status: "PAST_DUE",
    },
  });

  // Record failed payment
  await db.payment.create({
    data: {
      userId: subscription.userId,
      amount: invoice.amount_due,
      currency: invoice.currency.toUpperCase(),
      provider: "STRIPE",
      providerRef: invoice.payment_intent as string,
      status: "FAILED",
      metadata: {
        invoiceId: invoice.id,
        subscriptionId,
        error: invoice.last_finalization_error?.message,
      },
    },
  });

  logger.error("Payment failed", {
    userId: subscription.userId,
    amount: invoice.amount_due,
    invoiceId: invoice.id,
  });

  // Log event
  await db.eventLog.create({
    data: {
      userId: subscription.userId,
      eventType: "PAYMENT_SUCCEEDED",
      payloadJson: {
        invoiceId: invoice.id,
        amount: invoice.amount_due,
        subscriptionId,
        status: "failed",
      },
    },
  });
}

/**
 * Map Stripe subscription status to our SubscriptionStatus enum
 */
function mapStripeStatus(
  stripeStatus: Stripe.Subscription.Status
): "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE" {
  switch (stripeStatus) {
    case "active":
      return "ACTIVE";
    case "canceled":
      return "CANCELED";
    case "past_due":
      return "PAST_DUE";
    case "trialing":
      return "TRIALING";
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
      return "INCOMPLETE";
    default:
      return "ACTIVE";
  }
}
