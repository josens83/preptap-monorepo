/**
 * Production Readiness Check Script
 *
 * 프로덕션 배포 전 필수 항목 검증
 */

interface CheckResult {
  name: string;
  status: "✓" | "✗" | "⚠";
  message: string;
  critical: boolean;
}

const results: CheckResult[] = [];

function addCheck(
  name: string,
  condition: boolean,
  successMsg: string,
  failMsg: string,
  critical: boolean = true
): void {
  results.push({
    name,
    status: condition ? "✓" : critical ? "✗" : "⚠",
    message: condition ? successMsg : failMsg,
    critical,
  });
}

async function checkEnvironmentVariables(): Promise<void> {
  console.log("\n📋 환경 변수 검증...\n");

  // Critical variables
  addCheck(
    "DATABASE_URL",
    !!process.env.DATABASE_URL,
    "데이터베이스 URL 설정됨",
    "DATABASE_URL이 설정되지 않았습니다"
  );

  addCheck(
    "NEXTAUTH_SECRET",
    !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length >= 32,
    "NEXTAUTH_SECRET 설정됨 (32자 이상)",
    "NEXTAUTH_SECRET이 설정되지 않았거나 너무 짧습니다 (최소 32자)"
  );

  addCheck(
    "NEXTAUTH_URL",
    !!process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.startsWith("https://"),
    "NEXTAUTH_URL 설정됨 (HTTPS)",
    "NEXTAUTH_URL이 설정되지 않았거나 HTTPS가 아닙니다"
  );

  addCheck(
    "NEXT_PUBLIC_APP_URL",
    !!process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.startsWith("https://"),
    "앱 URL 설정됨 (HTTPS)",
    "NEXT_PUBLIC_APP_URL이 설정되지 않았거나 HTTPS가 아닙니다"
  );

  addCheck(
    "STRIPE_SECRET_KEY",
    !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_"),
    "Stripe 비밀 키 설정됨",
    "STRIPE_SECRET_KEY가 설정되지 않았습니다"
  );

  addCheck(
    "STRIPE_LIVE_MODE",
    !!process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith("sk_live_"),
    "Stripe 라이브 모드 활성화",
    "Stripe 테스트 모드입니다 (프로덕션에는 라이브 키 필요)",
    process.env.NODE_ENV === "production"
  );

  addCheck(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith("pk_"),
    "Stripe 공개 키 설정됨",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY가 설정되지 않았습니다"
  );

  // Optional but recommended
  addCheck(
    "STRIPE_WEBHOOK_SECRET",
    !!process.env.STRIPE_WEBHOOK_SECRET,
    "Stripe Webhook 비밀 키 설정됨",
    "STRIPE_WEBHOOK_SECRET 권장 (웹훅 보안을 위해)",
    false
  );

  addCheck(
    "GOOGLE_CLIENT_ID",
    !!process.env.GOOGLE_CLIENT_ID,
    "Google OAuth 설정됨",
    "Google OAuth 미설정 (소셜 로그인 비활성화)",
    false
  );

  addCheck(
    "SMTP_HOST",
    !!process.env.SMTP_HOST,
    "SMTP 설정됨",
    "SMTP 미설정 (이메일 발송 비활성화)",
    false
  );

  addCheck(
    "REDIS_URL",
    !!process.env.REDIS_URL,
    "Redis 설정됨 (캐싱 및 Rate Limiting)",
    "Redis 미설정 (메모리 캐싱 사용, 다중 인스턴스 환경 부적합)",
    false
  );

  addCheck(
    "NEXT_PUBLIC_SENTRY_DSN",
    !!process.env.NEXT_PUBLIC_SENTRY_DSN,
    "Sentry 설정됨 (에러 추적)",
    "Sentry 미설정 (에러 추적 비활성화)",
    false
  );
}

async function checkDatabaseConnection(): Promise<void> {
  console.log("\n🗄️  데이터베이스 연결 확인...\n");

  try {
    const { db } = await import("@preptap/db");

    const start = Date.now();
    await db.$queryRaw`SELECT 1`;
    const duration = Date.now() - start;

    addCheck(
      "Database Connection",
      true,
      `데이터베이스 연결 성공 (${duration}ms)`,
      "데이터베이스 연결 실패"
    );

    addCheck(
      "Database Response Time",
      duration < 500,
      `응답 시간 양호 (${duration}ms)`,
      `응답 시간 느림 (${duration}ms, 500ms 이상)`,
      false
    );

    // Check if tables exist
    const tables = await db.$queryRaw<Array<{ table_name: string }>>`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;

    addCheck(
      "Database Schema",
      tables.length > 0,
      `${tables.length}개 테이블 확인됨`,
      "테이블이 없습니다 (마이그레이션 필요)"
    );
  } catch (error) {
    addCheck(
      "Database Connection",
      false,
      "데이터베이스 연결 성공",
      `데이터베이스 연결 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function checkStripeConnection(): Promise<void> {
  console.log("\n💳 Stripe 연결 확인...\n");

  if (!process.env.STRIPE_SECRET_KEY) {
    addCheck(
      "Stripe Connection",
      false,
      "Stripe 연결 성공",
      "STRIPE_SECRET_KEY가 설정되지 않았습니다"
    );
    return;
  }

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const account = await stripe.accounts.retrieve();

    addCheck(
      "Stripe Connection",
      true,
      `Stripe 계정 연결 성공 (${account.business_profile?.name || "Unknown"})`,
      "Stripe 연결 실패"
    );

    // Check if in live mode
    const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith("sk_live_");

    addCheck(
      "Stripe Mode",
      isLiveMode || process.env.NODE_ENV !== "production",
      isLiveMode ? "라이브 모드 활성화" : "테스트 모드 (개발용)",
      "프로덕션 환경에서 테스트 모드 사용 중",
      process.env.NODE_ENV === "production"
    );

    // Check if price IDs are set
    const priceIds = [
      process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
    ];

    addCheck(
      "Stripe Price IDs",
      priceIds.every((id) => !!id && id.startsWith("price_")),
      "모든 Price ID 설정됨",
      "일부 Price ID가 설정되지 않았습니다",
      false
    );
  } catch (error) {
    addCheck(
      "Stripe Connection",
      false,
      "Stripe 연결 성공",
      `Stripe 연결 실패: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

async function checkSMTPConnection(): Promise<void> {
  console.log("\n📧 SMTP 연결 확인...\n");

  if (!process.env.SMTP_HOST) {
    addCheck(
      "SMTP Configuration",
      false,
      "SMTP 설정됨",
      "SMTP가 설정되지 않았습니다 (이메일 발송 불가)",
      false
    );
    return;
  }

  addCheck(
    "SMTP Configuration",
    !!(
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD &&
      process.env.EMAIL_FROM
    ),
    "SMTP 설정 완료",
    "SMTP 설정이 불완전합니다",
    false
  );
}

function printResults(): void {
  console.log("\n" + "=".repeat(80));
  console.log("🚀 프로덕션 준비 상태 체크 결과");
  console.log("=".repeat(80) + "\n");

  const criticalFailures = results.filter((r) => r.status === "✗" && r.critical);
  const warnings = results.filter((r) => r.status === "⚠" || (r.status === "✗" && !r.critical));
  const successes = results.filter((r) => r.status === "✓");

  // Print results
  results.forEach((result) => {
    const icon = result.status;
    const color =
      result.status === "✓" ? "\x1b[32m" : result.status === "✗" ? "\x1b[31m" : "\x1b[33m";
    const reset = "\x1b[0m";

    console.log(`${color}${icon} ${result.name}${reset}`);
    console.log(`  ${result.message}\n`);
  });

  // Summary
  console.log("=".repeat(80));
  console.log("\n📊 요약:\n");
  console.log(`✓ 성공: ${successes.length}`);
  console.log(`⚠ 경고: ${warnings.length}`);
  console.log(`✗ 실패: ${criticalFailures.length}\n`);

  if (criticalFailures.length > 0) {
    console.log("\x1b[31m❌ 프로덕션 배포 불가\x1b[0m");
    console.log("위의 치명적 오류를 먼저 수정해주세요.\n");
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log("\x1b[33m⚠️  경고 사항 있음\x1b[0m");
    console.log("프로덕션 배포 가능하지만, 권장 설정을 완료하면 더 좋습니다.\n");
  } else {
    console.log("\x1b[32m✅ 프로덕션 배포 준비 완료!\x1b[0m\n");
  }

  console.log("=".repeat(80) + "\n");
}

async function main(): Promise<void> {
  console.log("\x1b[36m");
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║                                                               ║");
  console.log("║        PrepTap 프로덕션 준비 상태 체크                        ║");
  console.log("║                                                               ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  console.log("\x1b[0m");

  await checkEnvironmentVariables();
  await checkDatabaseConnection();
  await checkStripeConnection();
  await checkSMTPConnection();

  printResults();
}

main().catch((error) => {
  console.error("\n\x1b[31m❌ 체크 스크립트 실행 중 오류 발생:\x1b[0m\n");
  console.error(error);
  process.exit(1);
});
