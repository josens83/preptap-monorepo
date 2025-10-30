# PrepTap - 영어 시험 대비 플랫폼 MVP

기출·예상문제 기반 적응형 학습 플랫폼. 수능, TEPS, TOEIC, TOEFL 대비.

## 🚀 빠른 시작

### 필수 요구사항

- Node.js 18+
- pnpm 8+
- PostgreSQL 14+

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필요한 값 입력

# 데이터베이스 설정
cd packages/db
pnpm db:push
pnpm db:seed

# 개발 서버 시작
cd ../..
pnpm dev
```

웹 앱이 http://localhost:3000 에서 실행됩니다.

## 📁 프로젝트 구조

```
preptap-monorepo/
├── apps/
│   ├── web/              # Next.js 14 웹 애플리케이션
│   │   ├── src/
│   │   │   ├── app/      # App Router 페이지
│   │   │   ├── components/
│   │   │   ├── lib/      # 유틸리티 & 설정
│   │   │   └── server/   # tRPC 라우터
│   │   └── package.json
│   └── mobile/           # Expo React Native 모바일 앱
│       ├── src/
│       └── package.json
├── packages/
│   ├── db/               # Prisma 스키마 & 시드
│   │   ├── prisma/
│   │   └── src/
│   ├── ui/               # 공유 UI 컴포넌트
│   │   └── src/
│   └── config/           # 공유 설정 (ESLint, TS, Tailwind)
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
├── docs/                 # 문서
├── .env.example
├── package.json
├── turbo.json
└── pnpm-workspace.yaml
```

## 🔑 환경 변수 설정

`.env` 파일에 다음 값을 설정하세요:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/preptap_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"

# Stripe (테스트 모드)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Stripe 설정

1. [Stripe Dashboard](https://dashboard.stripe.com)에서 테스트 모드 활성화
2. API 키 복사 (Developers > API keys)
3. 월간 구독 상품 생성 (Products > Add product)
4. Price ID 복사하여 환경 변수에 추가
5. Webhook 설정 (Developers > Webhooks)
   - Endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

## 🎯 주요 기능

### 1. 온보딩 & 진단평가

- 시험 유형 선택 (수능/TEPS/TOEIC/TOEFL)
- 10-20문항 진단 테스트
- 취약 태그/스킬 자동 분석

### 2. 적응형 학습 엔진

- 개인 취약도 기반 문제 출제
- 난이도 자동 조절
- 실시간 학습 패턴 분석

### 3. 오답노트 & Spaced Repetition

- 틀린 문제 자동 수집
- SM-2 알고리즘 기반 복습 스케줄링
- 유사 문제 자동 추천

### 4. 대시보드 & 리포트

- 학습 시간, 정답률, 예상 점수
- 파트별 취약도 시각화
- 주간/누적 통계

### 5. 구독 & 결제

- Stripe 통합 월/연간 구독
- 코스 단품 판매
- Billing Portal

## 🛠 개발 가이드

### 데이터베이스

```bash
# Prisma Studio 실행
pnpm db:studio

# 마이그레이션 생성
cd packages/db
pnpm db:migrate

# 스키마 푸시 (개발용)
pnpm db:push

# 시드 데이터 재생성
pnpm db:seed
```

### 테스트 계정

시드 스크립트는 다음 테스트 계정을 생성합니다:

- 학생: `student@preptap.com` / `password123`
- 선생님: `teacher@preptap.com` / `password123`
- 관리자: `admin@preptap.com` / `password123`

### API 개발 (tRPC)

tRPC 라우터는 `apps/web/src/server/routers/`에 있습니다:

- `auth.ts` - 인증 & 프로필
- `exam.ts` - 온보딩 & 진단
- `practice.ts` - 연습 세션
- `notebook.ts` - 오답노트
- `report.ts` - 리포트
- `payments.ts` - 결제

## 📱 모바일 앱 개발

```bash
cd apps/mobile

# iOS 시뮬레이터
pnpm ios

# Android 에뮬레이터
pnpm android

# 웹 미리보기
pnpm web
```

## 🚀 배포

### Vercel (웹)

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
cd apps/web
vercel
```

환경 변수를 Vercel 대시보드에 추가하세요.

### Railway/Fly.io (데이터베이스)

PostgreSQL 인스턴스를 생성하고 `DATABASE_URL`을 업데이트하세요.

## 📊 아키텍처

### 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Mobile**: Expo React Native, expo-router
- **Backend**: tRPC, NextAuth, Prisma
- **Database**: PostgreSQL
- **Payment**: Stripe
- **Monorepo**: Turborepo, pnpm workspaces

### 적응형 학습 알고리즘

```
1. 사용자 취약도 분석 (Weakness 테이블)
2. 문제 출제 확률 계산:
   P(question) ∝ α·weakness + β·difficulty + γ·recentWrongRate
3. 확률적 샘플링으로 문제 선택
4. 결과 기반 취약도 업데이트 (learning rate η)
```

### Spaced Repetition (SM-2)

```
1. 초기 EF = 2.5, interval = 1
2. 성공 시: interval *= EF, repetition++
3. 실패 시: interval = 1, repetition = 0
4. EF 업데이트: EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
```

## 📄 라이선스

MIT License

---

**Built with ❤️ using Next.js, Expo, Prisma, and tRPC**