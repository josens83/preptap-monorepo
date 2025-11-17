/**
 * Production-ready Logger
 *
 * 프로덕션 환경에서 구조화된 로깅을 위한 유틸리티
 * - JSON 형식으로 로그 출력 (Vercel, Datadog 등과 호환)
 * - 로그 레벨 지원 (debug, info, warn, error)
 * - 컨텍스트 정보 자동 추가 (timestamp, environment, user)
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, unknown>;
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    const currentEnv = process.env.NODE_ENV;

    // 프로덕션에서는 DEBUG 로그 비활성화
    if (currentEnv === "production" && level === LogLevel.DEBUG) {
      return false;
    }

    return true;
  }

  private formatLog(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, unknown>
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    if (context) {
      entry.context = context;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }

    if (metadata) {
      entry.metadata = metadata;
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    const jsonLog = JSON.stringify(entry);

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(jsonLog);
        break;
      case LogLevel.WARN:
        console.warn(jsonLog);
        break;
      case LogLevel.INFO:
        console.info(jsonLog);
        break;
      case LogLevel.DEBUG:
        console.debug(jsonLog);
        break;
    }
  }

  debug(
    message: string,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const entry = this.formatLog(LogLevel.DEBUG, message, context, undefined, metadata);
    this.output(entry);
  }

  info(
    message: string,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const entry = this.formatLog(LogLevel.INFO, message, context, undefined, metadata);
    this.output(entry);
  }

  warn(
    message: string,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const entry = this.formatLog(LogLevel.WARN, message, context, undefined, metadata);
    this.output(entry);
  }

  error(
    message: string,
    error?: Error,
    context?: LogContext,
    metadata?: Record<string, unknown>
  ): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const entry = this.formatLog(LogLevel.ERROR, message, context, error, metadata);
    this.output(entry);
  }

  /**
   * HTTP 요청 로깅
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    this.info("HTTP Request", context, {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    });
  }

  /**
   * 데이터베이스 쿼리 로깅 (느린 쿼리 감지)
   */
  logQuery(
    query: string,
    duration: number,
    context?: LogContext
  ): void {
    const isSlowQuery = duration > 1000; // 1초 이상

    if (isSlowQuery) {
      this.warn("Slow database query detected", context, {
        query,
        duration: `${duration}ms`,
      });
    } else {
      this.debug("Database query executed", context, {
        query,
        duration: `${duration}ms`,
      });
    }
  }

  /**
   * 사용자 이벤트 로깅 (분석용)
   */
  logEvent(
    eventName: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ): void {
    this.info("User Event", { userId }, {
      eventName,
      ...metadata,
    });
  }

  /**
   * 결제 이벤트 로깅 (중요 이벤트)
   */
  logPayment(
    event: string,
    userId: string,
    amount: number,
    metadata?: Record<string, unknown>
  ): void {
    this.info("Payment Event", { userId }, {
      event,
      amount,
      currency: "KRW",
      ...metadata,
    });
  }
}

// Singleton 인스턴스
export const logger = new Logger();

/**
 * 성능 측정 유틸리티
 */
export class PerformanceMonitor {
  private startTime: number;
  private label: string;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
  }

  end(context?: LogContext, metadata?: Record<string, unknown>): void {
    const duration = Date.now() - this.startTime;

    logger.debug(`Performance: ${this.label}`, context, {
      duration: `${duration}ms`,
      ...metadata,
    });
  }
}

/**
 * 에러 로깅 헬퍼
 */
export function logError(error: unknown, context?: LogContext): void {
  if (error instanceof Error) {
    logger.error(error.message, error, context);
  } else {
    logger.error("Unknown error occurred", undefined, context, {
      error: String(error),
    });
  }
}

/**
 * 프로덕션 환경에서만 실행되는 로깅
 */
export function logProduction(
  message: string,
  metadata?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") {
    logger.info(message, undefined, metadata);
  }
}
