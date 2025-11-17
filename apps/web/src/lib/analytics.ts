/**
 * Production Analytics & Event Tracking
 *
 * - User behavior tracking
 * - Conversion funnel analysis
 * - Custom event tracking
 * - Integration with Google Analytics, Mixpanel, etc.
 */

import { logger } from "./logger";

export enum AnalyticsEvent {
  // User lifecycle
  USER_SIGNED_UP = "user_signed_up",
  USER_LOGGED_IN = "user_logged_in",
  USER_LOGGED_OUT = "user_logged_out",
  USER_PROFILE_UPDATED = "user_profile_updated",

  // Onboarding
  ONBOARDING_STARTED = "onboarding_started",
  ONBOARDING_STEP_COMPLETED = "onboarding_step_completed",
  ONBOARDING_COMPLETED = "onboarding_completed",
  ONBOARDING_ABANDONED = "onboarding_abandoned",

  // Practice sessions
  PRACTICE_SESSION_STARTED = "practice_session_started",
  PRACTICE_SESSION_COMPLETED = "practice_session_completed",
  PRACTICE_SESSION_ABANDONED = "practice_session_abandoned",
  PROBLEM_ANSWERED = "problem_answered",
  PROBLEM_SKIPPED = "problem_skipped",

  // Results & Review
  RESULTS_VIEWED = "results_viewed",
  ANSWER_REVIEWED = "answer_reviewed",
  MISTAKE_ADDED_TO_NOTEBOOK = "mistake_added_to_notebook",

  // Reports & Analytics
  REPORT_VIEWED = "report_viewed",
  WEAKNESS_ANALYZED = "weakness_analyzed",
  PROGRESS_CHART_VIEWED = "progress_chart_viewed",

  // Subscription & Payment
  PRICING_PAGE_VIEWED = "pricing_page_viewed",
  PLAN_SELECTED = "plan_selected",
  CHECKOUT_STARTED = "checkout_started",
  CHECKOUT_COMPLETED = "checkout_completed",
  CHECKOUT_FAILED = "checkout_failed",
  SUBSCRIPTION_UPGRADED = "subscription_upgraded",
  SUBSCRIPTION_DOWNGRADED = "subscription_downgraded",
  SUBSCRIPTION_CANCELED = "subscription_canceled",

  // Content engagement
  FAQ_VIEWED = "faq_viewed",
  FAQ_ITEM_EXPANDED = "faq_item_expanded",
  BLOG_POST_VIEWED = "blog_post_viewed",
  BLOG_POST_SHARED = "blog_post_shared",
  CONTACT_FORM_SUBMITTED = "contact_form_submitted",

  // Feature usage
  FEATURE_USED = "feature_used",
  ERROR_ENCOUNTERED = "error_encountered",
}

interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

interface UserIdentity {
  userId?: string;
  email?: string;
  displayName?: string;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    // Only enable analytics in production
    this.isEnabled = process.env.NODE_ENV === "production";

    if (this.isEnabled) {
      logger.info("Analytics initialized");
    }
  }

  /**
   * Track an event
   */
  track(
    eventName: AnalyticsEvent | string,
    properties?: AnalyticsProperties,
    userId?: string
  ): void {
    if (!this.isEnabled) {
      return;
    }

    // Log event
    logger.logEvent(eventName, userId, properties);

    // Send to analytics providers (Google Analytics, Mixpanel, etc.)
    this.sendToGoogleAnalytics(eventName, properties);
  }

  /**
   * Identify a user
   */
  identify(user: UserIdentity): void {
    if (!this.isEnabled) {
      return;
    }

    logger.info("User identified", { userId: user.userId }, {
      email: user.email,
      displayName: user.displayName,
    });

    // Send to analytics providers
    // Example: mixpanel.identify(user.userId);
  }

  /**
   * Track a page view
   */
  pageView(path: string, userId?: string): void {
    if (!this.isEnabled) {
      return;
    }

    this.track("page_view", { path }, userId);
  }

  /**
   * Track conversion
   */
  conversion(
    conversionType: string,
    value: number,
    currency: string = "KRW",
    userId?: string
  ): void {
    if (!this.isEnabled) {
      return;
    }

    this.track("conversion", {
      conversionType,
      value,
      currency,
    }, userId);

    // Send to Google Ads conversion tracking
    // Example: gtag('event', 'conversion', {...});
  }

  /**
   * Track error
   */
  trackError(
    error: Error,
    context?: {
      userId?: string;
      path?: string;
      component?: string;
    }
  ): void {
    if (!this.isEnabled) {
      return;
    }

    this.track(AnalyticsEvent.ERROR_ENCOUNTERED, {
      errorName: error.name,
      errorMessage: error.message,
      path: context?.path,
      component: context?.component,
    }, context?.userId);
  }

  /**
   * Send to Google Analytics (GA4)
   */
  private sendToGoogleAnalytics(
    eventName: string,
    properties?: AnalyticsProperties
  ): void {
    // Client-side only - use gtag.js or Google Tag Manager
    if (typeof window === "undefined") {
      return;
    }

    // Check if gtag is available
    if (typeof (window as typeof window & { gtag?: unknown }).gtag === "function") {
      const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag;
      gtag("event", eventName, properties);
    }
  }
}

// Singleton instance
let globalAnalytics: Analytics | null = null;

export function getAnalytics(): Analytics {
  if (!globalAnalytics) {
    globalAnalytics = new Analytics();
  }
  return globalAnalytics;
}

/**
 * Helper functions for common events
 */

export function trackUserSignup(userId: string, method: "email" | "google"): void {
  const analytics = getAnalytics();
  analytics.track(AnalyticsEvent.USER_SIGNED_UP, { method }, userId);
  analytics.conversion("signup", 1, "KRW", userId);
}

export function trackPracticeSession(
  userId: string,
  sessionType: string,
  examType: string,
  questionCount: number,
  duration: number
): void {
  const analytics = getAnalytics();
  analytics.track(AnalyticsEvent.PRACTICE_SESSION_COMPLETED, {
    sessionType,
    examType,
    questionCount,
    duration,
  }, userId);
}

export function trackSubscription(
  userId: string,
  planName: string,
  amount: number,
  isUpgrade: boolean
): void {
  const analytics = getAnalytics();

  const eventName = isUpgrade
    ? AnalyticsEvent.SUBSCRIPTION_UPGRADED
    : AnalyticsEvent.CHECKOUT_COMPLETED;

  analytics.track(eventName, {
    planName,
    amount,
  }, userId);

  analytics.conversion("subscription", amount, "KRW", userId);
}

export function trackCheckoutStarted(
  userId: string,
  planName: string,
  amount: number
): void {
  const analytics = getAnalytics();
  analytics.track(AnalyticsEvent.CHECKOUT_STARTED, {
    planName,
    amount,
  }, userId);
}

export function trackPageView(path: string, userId?: string): void {
  const analytics = getAnalytics();
  analytics.pageView(path, userId);
}
