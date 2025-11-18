# Backend Setup Guide

이 가이드는 PrepTap의 백엔드 인프라를 설정하고 production 환경에 배포하는 방법을 설명합니다.

## 📋 목차

1. [Backend 아키텍처 개요](#backend-아키텍처-개요)
2. [Database Setup](#database-setup)
3. [환경 변수 설정](#환경-변수-설정)
4. [Stripe Webhook 설정](#stripe-webhook-설정)
5. [Production 배포 체크리스트](#production-배포-체크리스트)

---

## Backend 아키텍처 개요

PrepTap의 백엔드는 다음과 같은 구성 요소로 이루어져 있습니다:

### 핵심 기술 스택

- **Database ORM**: Prisma
- **API Layer**: tRPC (End-to-end type-safe API)
- **Authentication**: NextAuth.js
- **Payment**: Stripe
- **Email**: Resend
- **Monitoring**: Sentry (optional)
- **Caching**: Redis (optional)

### Database 모델

```
✅ User & Authentication
  - User, Account, Session, VerificationToken, Profile

✅ Subscription & Payment
  - Subscription (Stripe 통합)
  - Payment (결제 내역)

✅ Learning Content
  - Question (문제 은행)
  - Choice (선택지)
  - Explanation (해설)
  - Course (코스)
  - Enrollment (수강)

✅ Practice System
  - PracticeSession (학습 세션)
  - SessionItem (세션 문제)

✅ Adaptive Learning
  - Weakness (약점 분석)
  - SpacedItem (간격 반복 학습 - SM-2 알고리즘)

✅ Study Group
  - StudyGroup, GroupMember

✅ Analytics & Support
  - EventLog (이벤트 로그)
  - ContactMessage (문의사항)
```

---

## Database Setup

### 1. Development 환경 (SQLite)

개발 환경에서는 SQLite를 사용합니다.

```bash
# packages/db 디렉토리로 이동
cd packages/db

# .env 파일 생성
cp .env.example .env

# DATABASE_URL 확인 (SQLite)
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env

# Prisma migration 생성 및 적용
npx prisma migrate dev --name init

# Seed 데이터 생성
npx prisma db seed
```

이제 다음 데모 계정을 사용할 수 있습니다:
- **학생**: student@preptap.com / password123
- **선생님**: teacher@preptap.com / password123
- **관리자**: admin@preptap.com / password123

### 2. Production 환경 (PostgreSQL)

Production에서는 PostgreSQL을 사용합니다.

#### PostgreSQL 설치 (Ubuntu/Debian)

```bash
# PostgreSQL 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# PostgreSQL 서비스 시작
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 데이터베이스 및 사용자 생성
sudo -u postgres psql

postgres=# CREATE DATABASE preptap;
postgres=# CREATE USER preptap_user WITH ENCRYPTED PASSWORD 'your-secure-password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE preptap TO preptap_user;
postgres=# \q
```

#### PostgreSQL 설치 (Docker)

```bash
# Docker Compose 사용
docker run -d \
  --name preptap-postgres \
  -e POSTGRES_DB=preptap \
  -e POSTGRES_USER=preptap_user \
  -e POSTGRES_PASSWORD=your-secure-password \
  -p 5432:5432 \
  postgres:15-alpine
```

#### Migration 적용

```bash
# packages/db/.env 파일 수정
DATABASE_URL="postgresql://preptap_user:your-secure-password@localhost:5432/preptap?schema=public"

# Migration 적용
cd packages/db
npx prisma migrate deploy

# Seed 데이터 생성 (선택사항)
npx prisma db seed
```

### 3. Database 백업

Production 데이터를 정기적으로 백업하세요.

```bash
# PostgreSQL 백업
pg_dump -U preptap_user -h localhost preptap > backup-$(date +%Y%m%d).sql

# 복원
psql -U preptap_user -h localhost preptap < backup-20250118.sql
```

---

## 환경 변수 설정

### 1. 환경 변수 파일 생성

```bash
# apps/web/.env 파일 생성
cd apps/web
cp .env.example .env
```

### 2. 필수 환경 변수

**Database**
```env
DATABASE_URL="postgresql://preptap_user:password@localhost:5432/preptap?schema=public"
```

**NextAuth.js**
```env
NEXTAUTH_URL="https://preptap.com"
NEXTAUTH_SECRET="generate-random-secret-key"  # openssl rand -base64 32
```

**Stripe**
```env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID="price_..."
```

**Email (Resend)**
```env
RESEND_API_KEY="re_..."
EMAIL_FROM="PrepTap <noreply@preptap.com>"
```

**App Configuration**
```env
NEXT_PUBLIC_APP_URL="https://preptap.com"
NEXT_PUBLIC_APP_NAME="PrepTap"
NODE_ENV="production"
```

### 3. Stripe Price ID 생성

Stripe Dashboard에서 구독 상품을 생성하고 Price ID를 발급받으세요:

1. https://dashboard.stripe.com/products 접속
2. **베이직 플랜** 생성: ₩9,900/월 → `price_basic_...`
3. **프로 플랜** 생성: ₩19,900/월 → `price_pro_...`
4. **프리미엄 플랜** 생성: ₩39,900/월 → `price_premium_...`

---

## Stripe Webhook 설정

### 1. Webhook Endpoint 등록

Stripe Dashboard에서 webhook을 등록하세요:

1. https://dashboard.stripe.com/webhooks 접속
2. **Add endpoint** 클릭
3. **Endpoint URL**: `https://preptap.com/api/webhooks/stripe`
4. **Events to send** 선택:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Webhook signing secret 복사: `whsec_...`
6. `.env` 파일에 추가:
   ```env
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

### 2. Webhook 테스트

로컬에서 Stripe CLI를 사용하여 webhook을 테스트하세요:

```bash
# Stripe CLI 설치
brew install stripe/stripe-cli/stripe

# Stripe에 로그인
stripe login

# Webhook 포워딩 시작
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 테스트 이벤트 전송
stripe trigger checkout.session.completed
```

---

## Production 배포 체크리스트

### 데이터베이스

- [ ] PostgreSQL 설치 및 설정 완료
- [ ] Database URL 환경 변수 설정
- [ ] `npx prisma migrate deploy` 실행
- [ ] 백업 스크립트 설정 (cron job)

### 환경 변수

- [ ] `.env.example` 참고하여 모든 필수 환경 변수 설정
- [ ] `NEXTAUTH_SECRET` 랜덤 키 생성
- [ ] Stripe API 키 설정 (live mode)
- [ ] Stripe Price ID 설정
- [ ] Resend API 키 설정

### Stripe

- [ ] Stripe 계정 활성화 (본인 인증 완료)
- [ ] 구독 상품 생성 (BASIC, PRO, PREMIUM)
- [ ] Webhook endpoint 등록
- [ ] Webhook 테스트 완료

### 보안

- [ ] HTTPS 인증서 설정 (Let's Encrypt)
- [ ] CSP 헤더 확인 (`middleware.ts`)
- [ ] Rate limiting 활성화 (Redis 권장)
- [ ] CORS 설정 확인

### 모니터링

- [ ] Sentry 설정 (선택사항)
- [ ] Health check endpoint 테스트: `/api/health`
- [ ] 로그 수집 시스템 설정

### 성능

- [ ] Redis 캐시 설정 (선택사항)
- [ ] Database 인덱스 확인
- [ ] CDN 설정 (Vercel/Cloudflare)

---

## 문제 해결

### Migration 실패

```bash
# Migration 상태 확인
npx prisma migrate status

# Migration 리셋 (개발 환경에서만!)
npx prisma migrate reset

# Production에서는 수동으로 migration 적용
npx prisma migrate deploy
```

### Database 연결 실패

```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 연결 테스트
psql -U preptap_user -h localhost -d preptap

# Prisma 연결 테스트
npx prisma db pull
```

### Stripe Webhook 오류

- Webhook secret이 올바른지 확인
- Endpoint URL이 HTTPS인지 확인
- 로그에서 상세 에러 확인: `apps/web/src/app/api/webhooks/stripe/route.ts`

---

## 추가 리소스

- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Stripe Documentation](https://stripe.com/docs)
- [Resend Documentation](https://resend.com/docs)
