/**
 * Sentry Integration Setup
 *
 * To enable Sentry error tracking:
 * 1. Install: pnpm add @sentry/nextjs
 * 2. Set NEXT_PUBLIC_SENTRY_DSN in environment variables
 * 3. Run: npx @sentry/wizard@latest -i nextjs
 * 4. Uncomment the initialization code below
 */

import { logger } from "./logger";

interface SentryConfig {
  dsn: string;
  environment: string;
  tracesSampleRate: number;
  debug: boolean;
}

/**
 * Initialize Sentry (placeholder)
 */
export function initializeSentry(): void {
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!sentryDsn) {
    logger.info("Sentry not configured (NEXT_PUBLIC_SENTRY_DSN not set)");
    return;
  }

  // Uncomment when @sentry/nextjs is installed:
  /*
  import * as Sentry from '@sentry/nextjs';

  const config: SentryConfig = {
    dsn: sentryDsn,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    debug: process.env.NODE_ENV !== 'production',
  };

  Sentry.init({
    dsn: config.dsn,
    environment: config.environment,
    tracesSampleRate: config.tracesSampleRate,
    debug: config.debug,

    // Performance monitoring
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ['localhost', /^\//],
      }),
    ],

    // Error filtering
    beforeSend(event, hint) {
      // Filter out low-priority errors
      const error = hint.originalException;

      if (error instanceof Error) {
        // Ignore network errors
        if (error.message.includes('NetworkError')) {
          return null;
        }

        // Ignore authentication errors (user-facing)
        if (error.message.includes('UNAUTHORIZED')) {
          return null;
        }
      }

      return event;
    },

    // Attach user context
    beforeSendTransaction(event) {
      // Add custom context
      return event;
    },
  });

  logger.info('Sentry initialized', undefined, { environment: config.environment });
  */

  logger.info("Sentry initialization skipped (package not installed)");
}

/**
 * Capture exception (placeholder)
 */
export function captureException(
  error: Error,
  context?: {
    userId?: string;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): void {
  // Log to our logging system
  logger.error(error.message, error, { userId: context?.userId }, context?.extra);

  // Uncomment when Sentry is installed:
  /*
  import * as Sentry from '@sentry/nextjs';

  Sentry.withScope((scope) => {
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      scope.setContext('extra', context.extra);
    }

    Sentry.captureException(error);
  });
  */
}

/**
 * Capture message (placeholder)
 */
export function captureMessage(
  message: string,
  level: "debug" | "info" | "warning" | "error" = "info",
  context?: {
    userId?: string;
    tags?: Record<string, string>;
    extra?: Record<string, unknown>;
  }
): void {
  // Log to our logging system
  logger.info(message, { userId: context?.userId }, context?.extra);

  // Uncomment when Sentry is installed:
  /*
  import * as Sentry from '@sentry/nextjs';

  Sentry.withScope((scope) => {
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }

    if (context?.tags) {
      Object.entries(context.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }

    if (context?.extra) {
      scope.setContext('extra', context.extra);
    }

    Sentry.captureMessage(message, level);
  });
  */
}

/**
 * Set user context (placeholder)
 */
export function setUserContext(user: {
  id: string;
  email?: string;
  displayName?: string;
}): void {
  // Uncomment when Sentry is installed:
  /*
  import * as Sentry from '@sentry/nextjs';

  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.displayName,
  });
  */

  logger.info("User context set", { userId: user.id });
}

/**
 * Clear user context (placeholder)
 */
export function clearUserContext(): void {
  // Uncomment when Sentry is installed:
  /*
  import * as Sentry from '@sentry/nextjs';
  Sentry.setUser(null);
  */

  logger.info("User context cleared");
}
