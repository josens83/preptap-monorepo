# PrepTap 배포 체크리스트

## 배포 전 준비사항

### 1. 코드 준비
- [x] 모든 변경사항 커밋
- [x] 최신 브랜치로 푸시
- [x] 빌드 에러 확인 및 수정
- [x] 테스트 통과 확인

### 2. 환경 변수 준비

필수 환경 변수 (Vercel에 설정 필요):

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-here-use-openssl-rand-base64-32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"

# Prisma
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING="1"
```

선택적 환경 변수:

```bash
# OAuth (Google)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (결제)
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID="G-XXXXXXXXXX"

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN="https://..."
```

### 3. 데이터베이스 준비

#### Option 1: Vercel Postgres (추천)
1. Vercel 대시보드 → Storage → Create Database → Postgres
2. DATABASE_URL 복사
3. 환경 변수에 추가

#### Option 2: Supabase
1. https://supabase.com 회원가입
2. New Project 생성
3. Settings → Database → Connection String 복사 (Transaction mode)
4. 환경 변수에 추가

#### Option 3: Railway
1. https://railway.app 회원가입
2. New Project → Provision PostgreSQL
3. DATABASE_URL 복사
4. 환경 변수에 추가

### 4. Vercel 배포 단계

#### A. GitHub 연동 (권장)
1. GitHub에 저장소 푸시
2. https://vercel.com 로그인
3. "Import Project" 클릭
4. GitHub 저장소 선택
5. Root Directory: 비워두기 (모노레포 자동 감지)
6. Framework: Next.js
7. Build Command: `pnpm vercel-build`
8. Output Directory: `apps/web/.next`
9. Install Command: `pnpm install`
10. 환경 변수 추가
11. Deploy 클릭

#### B. Vercel CLI (대안)
```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 프로젝트 연결
vercel link

# 환경 변수 설정
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production

# 배포
vercel --prod
```

### 5. 배포 후 확인사항

- [ ] 사이트 접속 확인
- [ ] 회원가입/로그인 테스트
- [ ] 데이터베이스 연결 확인
- [ ] API 엔드포인트 테스트
- [ ] 이미지 로딩 확인
- [ ] 모바일 반응형 확인
- [ ] 성능 측정 (Lighthouse)
- [ ] 에러 로그 확인
- [ ] Web Vitals 확인

### 6. 프로덕션 설정

#### 데이터베이스 마이그레이션
```bash
# 로컬에서 실행 (프로덕션 DB 연결)
DATABASE_URL="postgresql://..." pnpm db:migrate:deploy
```

#### 시드 데이터 (선택)
```bash
# 프로덕션에 샘플 데이터가 필요한 경우
DATABASE_URL="postgresql://..." pnpm db:seed
```

#### 도메인 설정
1. Vercel Dashboard → Settings → Domains
2. 커스텀 도메인 추가
3. DNS 설정 (A 레코드 또는 CNAME)
4. SSL 자동 활성화 확인

### 7. 모니터링 설정

#### Vercel Analytics
- 자동 활성화됨 (별도 설정 불필요)

#### Google Analytics
1. GA4 계정 생성
2. Measurement ID 복사 (G-XXXXXXXXXX)
3. Vercel 환경 변수에 `NEXT_PUBLIC_GA_TRACKING_ID` 추가
4. 재배포

#### Sentry (선택)
1. https://sentry.io 계정 생성
2. New Project → Next.js
3. DSN 복사
4. 환경 변수에 `NEXT_PUBLIC_SENTRY_DSN` 추가
5. 재배포

### 8. 보안 체크리스트

- [x] HTTPS 활성화 (Vercel 자동)
- [x] 보안 헤더 설정 완료
- [x] Rate limiting 활성화
- [x] CORS 설정 완료
- [ ] 환경 변수 암호화 확인
- [ ] Secret 키 강력도 확인
- [ ] OAuth 리디렉션 URL 설정

### 9. 성능 체크리스트

- [x] 이미지 최적화 활성화
- [x] Gzip/Brotli 압력 활성화
- [x] 번들 크기 최적화
- [x] 캐싱 전략 설정
- [ ] CDN 활성화 (Vercel 자동)
- [ ] Database 쿼리 최적화

### 10. 문제 해결

#### 빌드 실패 시
```bash
# 로컬에서 프로덕션 빌드 테스트
pnpm build

# 로그 확인
vercel logs
```

#### 데이터베이스 연결 실패 시
- DATABASE_URL 형식 확인
- IP 화이트리스트 확인 (Vercel IP 추가)
- SSL 모드 확인 (`?sslmode=require`)

#### 환경 변수 누락 시
- Vercel Dashboard → Settings → Environment Variables
- 모든 필수 변수 확인
- 재배포 (자동 또는 수동)

## 배포 완료!

배포가 성공적으로 완료되었다면:

1. 팀에 공유
2. 사용자 피드백 수집
3. 모니터링 대시보드 확인
4. 정기적인 업데이트 계획

---

**도움이 필요하신가요?**
- DEPLOYMENT.md 참고
- Vercel 문서: https://vercel.com/docs
- 이슈 리포트: https://github.com/josens83/preptap-monorepo/issues
