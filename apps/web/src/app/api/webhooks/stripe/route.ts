import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { prisma } from "@preptap/db";
import { sendPaymentSuccessEmail } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET || "whsec_test"
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
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
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) return;

  // Handle subscription checkout
  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await handleSubscriptionUpdate(subscription);
  }

  // Handle course purchase
  if (session.mode === "payment" && session.metadata?.type === "course_purchase") {
    const courseId = session.metadata.courseId;
    if (!courseId) return;

    await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        status: "ACTIVE",
      },
    });

    await prisma.eventLog.create({
      data: {
        userId,
        eventType: "COURSE_ENROLLED",
        payloadJson: { courseId, sessionId: session.id },
      },
    });
  }

  // Record payment
  await prisma.payment.create({
    data: {
      userId,
      amount: session.amount_total || 0,
      currency: session.currency?.toUpperCase() || "KRW",
      provider: "STRIPE",
      providerRef: session.id,
      status: "SUCCEEDED",
      metadata: session.metadata,
    },
  });

  await prisma.eventLog.create({
    data: {
      userId,
      eventType: "PAYMENT_SUCCEEDED",
      payloadJson: { sessionId: session.id, amount: session.amount_total },
    },
  });
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  const planId = subscription.metadata?.planId;
  if (!userId) return;

  const status = mapStripeStatus(subscription.status);
  const isNewSubscription = subscription.status === "active" && !subscription.cancel_at_period_end;

  const sub = await prisma.subscription.upsert({
    where: {
      providerId: subscription.id,
    },
    create: {
      userId,
      provider: "STRIPE",
      providerId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status,
      plan: planId || null,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    update: {
      status,
      plan: planId || undefined,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  await prisma.eventLog.create({
    data: {
      userId,
      eventType: status === "ACTIVE" ? "SUBSCRIPTION_CREATED" : "SUBSCRIPTION_UPDATED",
      payloadJson: { subscriptionId: subscription.id, status, planId },
    },
  });

  // 신규 활성 구독 시 결제 성공 이메일 발송
  if (isNewSubscription && planId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (user) {
      const amount = subscription.items.data[0]?.price.unit_amount || 0;
      await sendPaymentSuccessEmail(
        user.email,
        user.profile?.displayName || "회원",
        planId,
        amount / 100
      ).catch((err) => {
        console.error("결제 성공 이메일 발송 실패:", err);
      });

      console.log(`✅ 결제 성공 이메일 발송: ${user.email}, 플랜: ${planId}`);
    }
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  await prisma.subscription.updateMany({
    where: {
      providerId: subscription.id,
    },
    data: {
      status: "CANCELED",
    },
  });
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  await handleSubscriptionUpdate(subscription);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  await prisma.subscription.updateMany({
    where: {
      providerId: invoice.subscription as string,
    },
    data: {
      status: "PAST_DUE",
    },
  });
}

function mapStripeStatus(status: Stripe.Subscription.Status): "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIALING" | "INCOMPLETE" {
  switch (status) {
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
      return "INCOMPLETE";
  }
}
