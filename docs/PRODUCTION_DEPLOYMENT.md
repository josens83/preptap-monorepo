# PrepTap 프로덕션 배포 가이드

**상용 서비스 런칭을 위한 완전한 체크리스트**

---

## 목차

1. [배포 전 준비사항](#1-배포-전-준비사항)
2. [인프라 설정](#2-인프라-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [데이터베이스 설정](#4-데이터베이스-설정)
5. [결제 시스템 설정](#5-결제-시스템-설정)
6. [이메일 설정](#6-이메일-설정)
7. [도메인 및 SSL](#7-도메인-및-ssl)
8. [모니터링 설정](#8-모니터링-설정)
9. [배포 실행](#9-배포-실행)
10. [배포 후 검증](#10-배포-후-검증)

---

## 1. 배포 전 준비사항

### 필수 계정 생성

- [ ] Vercel 계정 (프로덕션 플랜 권장)
- [ ] PostgreSQL 호스팅 (Vercel Postgres 또는 Supabase)
- [ ] Stripe 계정 (라이브 모드 활성화)
- [ ] SMTP 서비스 (Gmail, SendGrid, 또는 AWS SES)
- [ ] 도메인 등록 (예: preptap.com)

### 선택사항 (강력 권장)

- [ ] Google OAuth 클라이언트
- [ ] Sentry 계정 (에러 추적)
- [ ] Google Analytics 계정
- [ ] Redis 호스팅 (Upstash 또는 Vercel KV)

---

## 2. 인프라 설정

### 2.1 Vercel 프로젝트 생성

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 프로젝트 연결
cd apps/web
vercel link

# 프로덕션 설정
vercel env pull .env.production
```

### 2.2 PostgreSQL 데이터베이스

**옵션 A: Vercel Postgres (추천)**

1. Vercel 대시보드 → Storage → Create Database → Postgres
2. 데이터베이스 생성 후 `DATABASE_URL` 복사
3. 환경 변수에 추가

**옵션 B: Supabase**

1. [Supabase](https://supabase.com) 프로젝트 생성
2. Settings → Database → Connection string 복사
3. `?pgbouncer=true` 추가 (Connection pooling)

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres?pgbouncer=true"
```

### 2.3 Redis (선택사항, Rate Limiting용)

**옵션 A: Vercel KV (추천)**

```bash
vercel kv create preptap-cache
```

**옵션 B: Upstash**

1. [Upstash](https://upstash.com) Redis 데이터베이스 생성
2. `REDIS_URL` 복사

---

## 3. 환경 변수 설정

### 3.1 필수 환경 변수

Vercel 대시보드 → Settings → Environment Variables에서 설정:

```bash
# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://preptap.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Authentication
NEXTAUTH_URL=https://preptap.com
NEXTAUTH_SECRET=[생성: openssl rand -base64 32]

# Stripe (Live Keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...

# SMTP (Gmail 또는 SendGrid)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=[앱 비밀번호]
EMAIL_FROM=noreply@preptap.com
```

### 3.2 선택적 환경 변수

```bash
# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Redis
REDIS_URL=redis://...

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Google Analytics
NEXT_PUBLIC_GA_ID=G-...

# CORS (모바일 앱이 있는 경우)
ALLOWED_ORIGINS=https://preptap.com,https://app.preptap.com
```

---

## 4. 데이터베이스 설정

### 4.1 스키마 마이그레이션

```bash
# 프로덕션 DATABASE_URL 설정 확인
echo $DATABASE_URL

# Prisma 클라이언트 생성
cd packages/db
pnpm prisma generate

# 마이그레이션 실행
pnpm prisma migrate deploy

# 초기 데이터 시드 (선택사항)
pnpm prisma db seed
```

### 4.2 데이터베이스 백업 설정

**Vercel Postgres:**
- 자동 백업 활성화 (Settings → Backups)
- Point-in-time recovery 활성화

**Supabase:**
- 자동 백업 활성화 (Settings → Database → Backups)

---

## 5. 결제 시스템 설정

### 5.1 Stripe 상품 및 가격 생성

Stripe Dashboard → Products에서 생성:

1. **BASIC 플랜**
   - 이름: "BASIC"
   - 가격: ₩9,900 / 월
   - Recurring: Monthly
   - Price ID 복사 → `NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID`

2. **PRO 플랜**
   - 이름: "PRO"
   - 가격: ₩19,900 / 월
   - Price ID 복사 → `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`

3. **PREMIUM 플랜**
   - 이름: "PREMIUM"
   - 가격: ₩39,900 / 월
   - Price ID 복사 → `NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID`

### 5.2 Webhook 설정

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://preptap.com/api/webhooks/stripe`
3. 이벤트 선택:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Webhook signing secret 복사 → `STRIPE_WEBHOOK_SECRET`

### 5.3 결제 테스트

```bash
# 테스트 카드 사용 (라이브 모드 전환 전)
카드 번호: 4242 4242 4242 4242
만료일: 미래 날짜
CVC: 아무 3자리
```

---

## 6. 이메일 설정

### 옵션 A: Gmail (소규모, 하루 500건 제한)

1. Google 계정 → 보안 → 2단계 인증 활성화
2. 앱 비밀번호 생성 → "메일" 선택
3. 생성된 16자리 비밀번호를 `SMTP_PASSWORD`에 설정

### 옵션 B: SendGrid (대규모, 추천)

1. [SendGrid](https://sendgrid.com) 계정 생성
2. Settings → API Keys → Create API Key
3. 환경 변수 설정:

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=[SendGrid API Key]
EMAIL_FROM=noreply@preptap.com
```

4. Sender Authentication 설정 (도메인 인증)

### 옵션 C: AWS SES (가장 저렴, 기술적)

```bash
SMTP_HOST=email-smtp.ap-northeast-2.amazonaws.com
SMTP_PORT=587
SMTP_USER=[AWS SES SMTP Username]
SMTP_PASSWORD=[AWS SES SMTP Password]
```

### 이메일 테스트

```bash
# 로컬에서 테스트 메일 발송
curl -X POST https://preptap.com/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com"}'
```

---

## 7. 도메인 및 SSL

### 7.1 도메인 등록

추천 등록대행사:
- [가비아](https://gabia.com) (한국)
- [Namecheap](https://namecheap.com)
- [Google Domains](https://domains.google)

### 7.2 Vercel에 도메인 연결

1. Vercel 대시보드 → Settings → Domains
2. Add Domain → `preptap.com` 입력
3. DNS 레코드 추가 (도메인 등록대행사에서):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

4. SSL 인증서 자동 발급 확인 (Let's Encrypt)

### 7.3 이메일 도메인 인증 (SendGrid/SES 사용 시)

SPF 레코드:
```
Type: TXT
Name: @
Value: v=spf1 include:sendgrid.net ~all
```

DKIM 레코드 (SendGrid에서 제공):
```
Type: CNAME
Name: s1._domainkey
Value: s1.domainkey.u[숫자].wl[숫자].sendgrid.net
```

---

## 8. 모니터링 설정

### 8.1 Vercel Analytics (기본 제공)

- Vercel 대시보드 → Analytics에서 자동 활성화
- Web Vitals, 페이지뷰, 응답 시간 모니터링

### 8.2 Sentry 설정 (선택사항, 강력 권장)

```bash
# Sentry 설치
pnpm add @sentry/nextjs

# Wizard 실행
npx @sentry/wizard@latest -i nextjs

# 환경 변수 설정
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 8.3 Google Analytics 설정

1. [Google Analytics](https://analytics.google.com) 계정 생성
2. 새 속성 생성 → GA4 선택
3. 측정 ID 복사 → `NEXT_PUBLIC_GA_ID`
4. `apps/web/src/app/layout.tsx`에 스크립트 추가:

```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <Script
    src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
    strategy="afterInteractive"
  />
)}
```

### 8.4 Uptime 모니터링

추천 서비스:
- [UptimeRobot](https://uptimerobot.com) (무료)
- [Pingdom](https://pingdom.com)
- [Better Uptime](https://betteruptime.com)

Health check URL: `https://preptap.com/api/health`

---

## 9. 배포 실행

### 9.1 로컬 빌드 테스트

```bash
# 프로덕션 빌드
cd apps/web
pnpm build

# 프로덕션 서버 실행
pnpm start

# 브라우저에서 http://localhost:3000 확인
```

### 9.2 Vercel 배포

```bash
# 프로덕션 배포
vercel --prod

# 또는 GitHub 연동으로 자동 배포
# main 브랜치에 push하면 자동 배포됨
```

### 9.3 배포 확인

```bash
# Health check
curl https://preptap.com/api/health

# 예상 응답:
# {
#   "status": "healthy",
#   "timestamp": "2025-11-17T...",
#   "checks": {
#     "database": { "status": "healthy", "responseTime": "45ms" },
#     "environment": { "status": "healthy" }
#   }
# }
```

---

## 10. 배포 후 검증

### 10.1 기능 테스트 체크리스트

- [ ] **회원가입**
  - [ ] 이메일 회원가입
  - [ ] Google 소셜 로그인
  - [ ] 환영 이메일 수신

- [ ] **온보딩**
  - [ ] 3단계 온보딩 완료
  - [ ] 프로필 정보 저장

- [ ] **학습 기능**
  - [ ] 적응형 연습 세션 시작
  - [ ] 문제 풀이 및 제출
  - [ ] 결과 확인 및 오답노트 추가

- [ ] **결제**
  - [ ] 가격 페이지 확인
  - [ ] Stripe Checkout 진행
  - [ ] 결제 완료 후 구독 활성화
  - [ ] 영수증 이메일 수신
  - [ ] 구독 관리 페이지 접근

- [ ] **관리자**
  - [ ] 관리자 대시보드 접근
  - [ ] 통계 확인
  - [ ] 문의 관리

- [ ] **이메일**
  - [ ] 회원가입 환영 이메일
  - [ ] 비밀번호 재설정 이메일
  - [ ] 결제 영수증 이메일
  - [ ] 문의 접수 확인 이메일

### 10.2 성능 테스트

```bash
# Lighthouse 테스트
npx lighthouse https://preptap.com --view

# 목표:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 95+
```

### 10.3 보안 테스트

```bash
# Security headers 확인
curl -I https://preptap.com

# 확인할 헤더:
# - Strict-Transport-Security
# - Content-Security-Policy
# - X-Frame-Options
# - X-Content-Type-Options
```

### 10.4 모니터링 확인

- [ ] Vercel Analytics 데이터 수집 확인
- [ ] Sentry 에러 로깅 확인 (테스트 에러 발생)
- [ ] Google Analytics 이벤트 추적 확인
- [ ] Health check 응답 확인

---

## 11. 런칭 체크리스트

### 최종 확인사항

- [ ] 모든 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 완료
- [ ] Stripe 라이브 모드 활성화 및 테스트
- [ ] 이메일 발송 테스트 완료
- [ ] 도메인 연결 및 SSL 인증서 발급
- [ ] 모니터링 시스템 활성화
- [ ] 전체 사용자 플로우 테스트 완료
- [ ] 법적 페이지 검토 (이용약관, 개인정보처리방침)
- [ ] 고객 지원 이메일 설정
- [ ] 백업 시스템 확인

### 런칭 후 모니터링

- [ ] 첫 24시간: 매 시간 Health check 확인
- [ ] 첫 주: 매일 에러 로그 확인
- [ ] 사용자 피드백 수집 채널 오픈
- [ ] 성능 지표 추적 (응답 시간, 에러율)

---

## 12. 문제 해결

### 데이터베이스 연결 오류

```bash
# 연결 문자열 확인
echo $DATABASE_URL

# Prisma Studio로 연결 테스트
pnpm prisma studio
```

### Stripe Webhook 실패

1. Stripe Dashboard → Webhooks → 실패한 이벤트 확인
2. 로그 확인: Vercel Functions → Logs
3. Webhook secret 재생성 및 재설정

### 이메일 발송 실패

```bash
# SMTP 연결 테스트
telnet smtp.gmail.com 587

# 로그 확인
Vercel Functions → Logs → 이메일 발송 함수
```

### 성능 이슈

1. Vercel Analytics → Function Performance 확인
2. 느린 데이터베이스 쿼리 최적화
3. 이미지 최적화 (Next.js Image 컴포넌트 사용)
4. Redis 캐싱 활성화

---

## 13. 지속적인 개선

### 주간 체크리스트

- [ ] Sentry 에러 로그 검토
- [ ] Vercel Analytics 성능 지표 확인
- [ ] 사용자 피드백 검토
- [ ] 데이터베이스 백업 확인

### 월간 체크리스트

- [ ] 보안 업데이트 적용
- [ ] 의존성 패키지 업데이트
- [ ] 성능 최적화 검토
- [ ] 사용자 데이터 분석

---

## 14. 지원 및 문의

- **기술 문의**: dev@preptap.com
- **Vercel 문서**: https://vercel.com/docs
- **Stripe 문서**: https://stripe.com/docs
- **Prisma 문서**: https://www.prisma.io/docs

---

**축하합니다! 🎉 PrepTap이 상용 서비스로 런칭되었습니다.**

이 가이드를 따라 안전하고 안정적인 프로덕션 환경을 구축하셨습니다.
