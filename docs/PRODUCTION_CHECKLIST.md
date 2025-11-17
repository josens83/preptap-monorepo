# 프로덕션 배포 체크리스트

**상용 서비스 런칭 전 필수 확인 사항**

---

## 🔴 Phase 1: 배포 전 필수 설정 (Critical)

### 인프라

- [ ] Vercel 프로덕션 플랜 계정 생성
- [ ] PostgreSQL 데이터베이스 설정 (Vercel Postgres 또는 Supabase)
- [ ] 도메인 구매 및 연결
- [ ] SSL 인증서 자동 발급 확인

### 환경 변수 (필수)

- [ ] `DATABASE_URL` - PostgreSQL 연결 문자열
- [ ] `NEXTAUTH_SECRET` - 32자 이상 랜덤 문자열
- [ ] `NEXTAUTH_URL` - https://도메인.com
- [ ] `NEXT_PUBLIC_APP_URL` - https://도메인.com
- [ ] `STRIPE_SECRET_KEY` - **sk_live_** 로 시작 (라이브 키)
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe Webhook 시크릿
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - **pk_live_** 로 시작

### Stripe 설정

- [ ] Stripe 계정 라이브 모드 활성화
- [ ] 상품 생성 (BASIC, PRO, PREMIUM)
- [ ] 가격 생성 및 Price ID 복사
- [ ] Webhook 엔드포인트 등록: `https://도메인.com/api/webhooks/stripe`
- [ ] 6개 Webhook 이벤트 활성화
- [ ] 테스트 결제 완료 (테스트 모드)

### 데이터베이스

- [ ] Prisma 마이그레이션 실행: `pnpm db:migrate`
- [ ] 초기 데이터 시드 (선택사항): `pnpm db:seed`
- [ ] 데이터베이스 백업 설정

---

## 🟡 Phase 2: 권장 설정 (Recommended)

### 인증

- [ ] Google OAuth 클라이언트 생성
- [ ] `GOOGLE_CLIENT_ID` 설정
- [ ] `GOOGLE_CLIENT_SECRET` 설정

### 이메일

- [ ] SMTP 서비스 선택 (Gmail / SendGrid / AWS SES)
- [ ] `SMTP_HOST` 설정
- [ ] `SMTP_PORT` 설정
- [ ] `SMTP_USER` 설정
- [ ] `SMTP_PASSWORD` 설정
- [ ] `EMAIL_FROM` 설정
- [ ] 테스트 이메일 발송 확인

### 모니터링

- [ ] Sentry 계정 생성 및 프로젝트 설정
- [ ] `NEXT_PUBLIC_SENTRY_DSN` 설정
- [ ] Google Analytics 계정 생성
- [ ] `NEXT_PUBLIC_GA_ID` 설정
- [ ] Uptime 모니터링 설정 (UptimeRobot 등)

### 성능

- [ ] Redis 설정 (Vercel KV 또는 Upstash)
- [ ] `REDIS_URL` 설정
- [ ] CDN 설정 확인 (Vercel 자동 제공)

---

## 🟢 Phase 3: 배포 전 테스트 (Testing)

### 로컬 프로덕션 빌드

- [ ] `pnpm prod:check` 실행 - 모든 항목 통과
- [ ] `pnpm build` 실행 - 빌드 성공
- [ ] `pnpm start` 실행 - 프로덕션 서버 시작
- [ ] http://localhost:3000 에서 전체 기능 테스트

### 기능 테스트

- [ ] 회원가입 (이메일)
- [ ] 회원가입 (Google)
- [ ] 로그인 / 로그아웃
- [ ] 비밀번호 재설정
- [ ] 온보딩 3단계 완료
- [ ] 적응형 연습 세션
- [ ] 문제 풀이 및 제출
- [ ] 결과 확인
- [ ] 오답노트 추가
- [ ] 리포트 페이지
- [ ] 가격 페이지
- [ ] Stripe Checkout (테스트 모드)
- [ ] 구독 활성화 확인
- [ ] 구독 관리 (취소/재개)
- [ ] 관리자 대시보드
- [ ] 문의하기 폼

### 이메일 테스트

- [ ] 회원가입 환영 이메일
- [ ] 비밀번호 재설정 이메일
- [ ] 결제 영수증 이메일
- [ ] 문의 접수 확인 이메일

---

## 🔵 Phase 4: 배포 실행 (Deployment)

### Vercel 배포

- [ ] GitHub 저장소 연결
- [ ] 환경 변수 모두 Vercel에 설정
- [ ] 프로덕션 배포 실행
- [ ] 배포 성공 확인

### 배포 후 즉시 확인

- [ ] Health check: `https://도메인.com/api/health`
- [ ] 메인 페이지 로딩 확인
- [ ] 회원가입 테스트 (실제 계정)
- [ ] 실제 카드로 결제 테스트 (소액)
- [ ] 결제 완료 후 구독 활성화 확인
- [ ] 이메일 수신 확인

---

## 🟣 Phase 5: 배포 후 검증 (Post-Deployment)

### 성능 테스트

- [ ] Lighthouse 점수 (모바일)
  - [ ] Performance: 90+
  - [ ] Accessibility: 95+
  - [ ] Best Practices: 95+
  - [ ] SEO: 95+
- [ ] Lighthouse 점수 (데스크톱)
- [ ] Web Vitals 확인 (Vercel Analytics)

### 보안 확인

- [ ] Security headers 확인:
  - [ ] Strict-Transport-Security
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
- [ ] HTTPS 강제 리디렉션 확인
- [ ] Stripe Webhook 서명 검증 작동 확인

### 모니터링 확인

- [ ] Vercel Analytics 데이터 수집 시작
- [ ] Sentry 에러 로깅 작동 (테스트 에러 발생)
- [ ] Google Analytics 이벤트 수신
- [ ] Uptime 모니터링 활성화

---

## ⚫ Phase 6: 최종 검토 (Final Review)

### 법적 요구사항

- [ ] 이용약관 검토 및 업데이트
- [ ] 개인정보처리방침 검토 및 업데이트
- [ ] 쿠키 정책 검토
- [ ] 환불 정책 명시

### 사용자 지원

- [ ] 고객 지원 이메일 설정
- [ ] FAQ 페이지 검토
- [ ] 문의하기 폼 테스트
- [ ] 응답 템플릿 준비

### 콘텐츠

- [ ] About 페이지 검토
- [ ] Blog 포스트 검토 (샘플 → 실제 콘텐츠)
- [ ] Testimonials 검토 (샘플 → 실제 후기)
- [ ] 문제 데이터 검토 (18개 샘플 → 실제 문제)

### 마케팅

- [ ] SEO 메타 태그 확인
- [ ] Open Graph 이미지 설정
- [ ] sitemap.xml 생성 확인
- [ ] robots.txt 확인
- [ ] Google Search Console 등록
- [ ] Naver 검색 등록

---

## 📊 Phase 7: 런칭 후 모니터링 (Post-Launch)

### 첫 24시간

- [ ] 매 시간 Health check 확인
- [ ] 에러 로그 모니터링 (Sentry)
- [ ] 성능 지표 확인 (Vercel Analytics)
- [ ] 사용자 피드백 수집

### 첫 주

- [ ] 매일 에러 로그 검토
- [ ] 사용자 행동 분석 (Google Analytics)
- [ ] 전환율 추적 (회원가입, 결제)
- [ ] 성능 최적화 기회 발견

### 첫 달

- [ ] 주간 성능 리포트 작성
- [ ] 사용자 피드백 분석 및 우선순위 설정
- [ ] 버그 수정 및 개선 사항 반영
- [ ] 마케팅 캠페인 효과 측정

---

## 🚨 긴급 대응 계획

### 장애 대응

- [ ] Rollback 계획 수립
- [ ] 긴급 연락처 리스트
- [ ] Vercel Support 연락 방법
- [ ] Stripe Support 연락 방법
- [ ] 데이터베이스 복구 계획

### 백업

- [ ] 데이터베이스 자동 백업 확인
- [ ] 백업 복구 테스트
- [ ] 중요 데이터 정기 백업 스케줄

---

## ✅ 최종 승인

**모든 항목이 체크되었나요?**

- [ ] Phase 1 (Critical): 모든 필수 항목 완료
- [ ] Phase 2 (Recommended): 권장 항목 대부분 완료
- [ ] Phase 3 (Testing): 모든 기능 테스트 통과
- [ ] Phase 4 (Deployment): 배포 성공 및 즉시 확인 완료
- [ ] Phase 5 (Post-Deployment): 성능, 보안, 모니터링 검증
- [ ] Phase 6 (Final Review): 법적, 콘텐츠, 마케팅 검토 완료
- [ ] Phase 7 (Post-Launch): 모니터링 계획 수립

**축하합니다! 🎉 PrepTap 상용 서비스 런칭 준비 완료!**

---

## 📞 문의

- **기술 지원**: dev@preptap.com
- **Vercel 문서**: https://vercel.com/docs
- **Stripe 문서**: https://stripe.com/docs
