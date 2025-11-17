import { NextResponse } from "next/server";
import { db } from "@preptap/db";

/**
 * Health Check Endpoint
 *
 * 프로덕션 환경에서 서비스 상태를 모니터링하기 위한 엔드포인트
 * - 로드 밸런서의 health check
 * - 모니터링 시스템의 uptime check
 * - 데이터베이스 연결 상태 확인
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // 1. 데이터베이스 연결 확인
    await db.$queryRaw`SELECT 1`;

    // 2. 데이터베이스 응답 시간 측정
    const dbResponseTime = Date.now() - startTime;

    // 3. 환경 변수 검증
    const requiredEnvVars = [
      "DATABASE_URL",
      "NEXTAUTH_SECRET",
      "NEXT_PUBLIC_APP_URL",
    ];

    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error: "Missing required environment variables",
          missing: missingEnvVars,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    // 4. 데이터베이스 응답 시간이 너무 느린 경우 경고
    const isDbSlow = dbResponseTime > 1000; // 1초 이상

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      checks: {
        database: {
          status: isDbSlow ? "slow" : "healthy",
          responseTime: `${dbResponseTime}ms`,
        },
        environment: {
          status: "healthy",
          variables: "all_present",
        },
      },
      version: process.env.VERCEL_GIT_COMMIT_SHA || "development",
    });
  } catch (error) {
    // 데이터베이스 연결 실패
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        checks: {
          database: {
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Connection failed",
          },
        },
      },
      { status: 503 }
    );
  }
}
