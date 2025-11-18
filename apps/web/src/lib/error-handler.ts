/**
 * Production Error Handler
 *
 * 프로덕션 환경에서 에러를 안전하게 처리하고 로깅
 * - Sentry 통합 준비
 * - 사용자에게 친화적인 에러 메시지
 * - 민감한 정보 숨김
 */

import { logger } from "./logger";

export enum ErrorCode {
  // 인증 에러
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INVALID_TOKEN = "INVALID_TOKEN",

  // 데이터 에러
  NOT_FOUND = "NOT_FOUND",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",

  // 결제 에러
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SUBSCRIPTION_EXPIRED = "SUBSCRIPTION_EXPIRED",
  INSUFFICIENT_CREDITS = "INSUFFICIENT_CREDITS",

  // 시스템 에러
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export interface AppError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  isOperational: boolean; // true면 예상된 에러, false면 예상치 못한 에러
}

export class ApplicationError extends Error implements AppError {
  code: ErrorCode;
  statusCode: number;
  details?: Record<string, unknown>;
  isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details?: Record<string, unknown>,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = "ApplicationError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    // TypeScript에서 Error를 상속할 때 필요
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

/**
 * 사용자 친화적 에러 메시지 매핑
 */
const userFriendlyMessages: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: "로그인이 필요합니다.",
  [ErrorCode.FORBIDDEN]: "이 작업을 수행할 권한이 없습니다.",
  [ErrorCode.INVALID_TOKEN]: "인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
  [ErrorCode.NOT_FOUND]: "요청하신 정보를 찾을 수 없습니다.",
  [ErrorCode.VALIDATION_ERROR]: "입력하신 정보가 올바르지 않습니다.",
  [ErrorCode.DUPLICATE_ENTRY]: "이미 존재하는 정보입니다.",
  [ErrorCode.PAYMENT_FAILED]: "결제 처리 중 오류가 발생했습니다.",
  [ErrorCode.SUBSCRIPTION_EXPIRED]: "구독이 만료되었습니다. 구독을 갱신해주세요.",
  [ErrorCode.INSUFFICIENT_CREDITS]: "크레딧이 부족합니다.",
  [ErrorCode.DATABASE_ERROR]: "데이터 처리 중 오류가 발생했습니다.",
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: "외부 서비스 연결 중 오류가 발생했습니다.",
  [ErrorCode.RATE_LIMIT_EXCEEDED]: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  [ErrorCode.INTERNAL_SERVER_ERROR]: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
};

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (error instanceof ApplicationError) {
    return userFriendlyMessages[error.code] || error.message;
  }

  if (error instanceof Error) {
    // 프로덕션에서는 기술적 에러 메시지를 숨김
    if (process.env.NODE_ENV === "production") {
      return "요청을 처리하는 중 오류가 발생했습니다.";
    }
    return error.message;
  }

  return "알 수 없는 오류가 발생했습니다.";
}

/**
 * 에러 로깅 및 Sentry 전송
 */
export function handleError(error: unknown, context?: {
  userId?: string;
  path?: string;
  method?: string;
}): AppError {
  // ApplicationError인 경우
  if (error instanceof ApplicationError) {
    logger.error(
      `Application Error: ${error.code}`,
      error,
      context,
      error.details
    );

    return error;
  }

  // 일반 Error인 경우
  if (error instanceof Error) {
    logger.error(
      "Unexpected Error",
      error,
      context
    );

    return new ApplicationError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      error.message,
      500,
      undefined,
      false // 예상치 못한 에러
    );
  }

  // 알 수 없는 에러
  logger.error(
    "Unknown Error",
    undefined,
    context,
    { error: String(error) }
  );

  return new ApplicationError(
    ErrorCode.INTERNAL_SERVER_ERROR,
    "An unknown error occurred",
    500,
    undefined,
    false
  );
}

/**
 * Prisma 에러를 ApplicationError로 변환
 */
export function handlePrismaError(error: unknown): ApplicationError {
  if (typeof error === "object" && error !== null && "code" in error) {
    const prismaError = error as { code: string; meta?: Record<string, unknown> };

    switch (prismaError.code) {
      case "P2002": // Unique constraint violation
        return new ApplicationError(
          ErrorCode.DUPLICATE_ENTRY,
          "중복된 데이터입니다.",
          409,
          prismaError.meta
        );
      case "P2025": // Record not found
        return new ApplicationError(
          ErrorCode.NOT_FOUND,
          "데이터를 찾을 수 없습니다.",
          404
        );
      case "P2003": // Foreign key constraint violation
        return new ApplicationError(
          ErrorCode.VALIDATION_ERROR,
          "잘못된 참조입니다.",
          400
        );
      default:
        return new ApplicationError(
          ErrorCode.DATABASE_ERROR,
          "데이터베이스 오류가 발생했습니다.",
          500,
          { code: prismaError.code }
        );
    }
  }

  return new ApplicationError(
    ErrorCode.DATABASE_ERROR,
    "데이터베이스 오류가 발생했습니다.",
    500
  );
}

/**
 * Stripe 에러를 ApplicationError로 변환
 */
export function handleStripeError(error: unknown): ApplicationError {
  if (typeof error === "object" && error !== null && "type" in error) {
    const stripeError = error as { type: string; message?: string };

    switch (stripeError.type) {
      case "StripeCardError":
        return new ApplicationError(
          ErrorCode.PAYMENT_FAILED,
          "카드 결제에 실패했습니다.",
          402
        );
      case "StripeRateLimitError":
        return new ApplicationError(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          "너무 많은 요청이 발생했습니다.",
          429
        );
      case "StripeInvalidRequestError":
        return new ApplicationError(
          ErrorCode.VALIDATION_ERROR,
          "잘못된 결제 요청입니다.",
          400
        );
      default:
        return new ApplicationError(
          ErrorCode.EXTERNAL_SERVICE_ERROR,
          "결제 서비스 오류가 발생했습니다.",
          503
        );
    }
  }

  return new ApplicationError(
    ErrorCode.PAYMENT_FAILED,
    "결제 처리 중 오류가 발생했습니다.",
    500
  );
}

/**
 * API 응답용 에러 포맷
 */
export function formatErrorResponse(error: AppError) {
  const response: {
    error: {
      code: string;
      message: string;
      details?: Record<string, unknown>;
    };
  } = {
    error: {
      code: error.code,
      message: getUserFriendlyMessage(error),
    },
  };

  // 개발 환경에서는 상세 정보 포함
  if (process.env.NODE_ENV !== "production" && error.details) {
    response.error.details = error.details;
  }

  return response;
}
