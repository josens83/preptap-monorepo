# PrepTap 아키텍처 문서

## 시스템 개요

PrepTap은 Turborepo 기반 모노레포로, 웹(Next.js)과 모바일(Expo) 앱이 동일한 백엔드 API(tRPC)와 데이터베이스를 공유합니다.

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
├─────────────────────┬───────────────────────────────────────┤
│   Web App           │        Mobile App                     │
│   (Next.js 14)      │        (Expo React Native)            │
│   - App Router      │        - expo-router                  │
│   - React 18        │        - React Navigation             │
│   - Tailwind CSS    │        - Native Components            │
└──────────┬──────────┴──────────┬────────────────────────────┘
           │                     │
           └──────────┬──────────┘
                      │ HTTP/tRPC
┌─────────────────────┴─────────────────────────────────────┐
│                     API Layer (tRPC)                      │
├───────────────────────────────────────────────────────────┤
│  Routers:                                                 │
│  - auth      (인증, 회원가입, 프로필)                       │
│  - exam      (온보딩, 진단평가)                            │
│  - practice  (적응형 세션, 문제 풀이)                       │
│  - notebook  (오답노트, Spaced Repetition)                 │
│  - report    (학습 리포트, 통계)                           │
│  - payments  (Stripe 결제, 구독)                          │
└─────────────────────┬─────────────────────────────────────┘
                      │
┌─────────────────────┴─────────────────────────────────────┐
│                    Business Logic                         │
├───────────────────────────────────────────────────────────┤
│  - Adaptive Engine   (적응형 알고리즘)                      │
│  - Spaced Repetition (SM-2 알고리즘)                       │
│  - NextAuth          (인증)                                │
│  - Stripe            (결제)                                │
└─────────────────────┬─────────────────────────────────────┘
                      │
┌─────────────────────┴─────────────────────────────────────┐
│                   Data Access Layer                       │
├───────────────────────────────────────────────────────────┤
│                  Prisma ORM                               │
└─────────────────────┬─────────────────────────────────────┘
                      │
┌─────────────────────┴─────────────────────────────────────┐
│                     Database                              │
├───────────────────────────────────────────────────────────┤
│                   PostgreSQL                              │
│  - Users, Profiles                                        │
│  - Questions, Choices, Explanations                       │
│  - Sessions, SessionItems                                 │
│  - Weaknesses, SpacedItems                                │
│  - Subscriptions, Payments                                │
└───────────────────────────────────────────────────────────┘
```

## 핵심 컴포넌트

### 1. 적응형 학습 엔진

**위치**: `apps/web/src/lib/adaptive-engine.ts`

**목적**: 사용자의 취약점과 학습 패턴을 분석하여 최적의 문제를 선택

**알고리즘**:

```typescript
// 문제 출제 확률 계산
P(question) = α * weakness_score + β * difficulty_bias + γ * recent_wrong_rate

where:
  - α = 0.5 (취약도 가중치)
  - β = 0.3 (난이도 가중치)
  - γ = 0.2 (최근 오답률 가중치)
  - weakness_score: 태그별 취약도 (0=약함, 1=강함)
  - difficulty_bias: 적정 난이도 선호 (0.5 근처)
  - recent_wrong_rate: 최근 오답률
```

**주요 함수**:

- `calculateQuestionProbabilities()`: 각 문제의 출제 확률 계산
- `sampleQuestions()`: 확률에 따라 문제 샘플링
- `updateWeaknessScores()`: 세션 결과 기반 취약도 업데이트

### 2. Spaced Repetition 시스템

**위치**: `apps/web/src/lib/spaced-repetition.ts`

**목적**: 장기 기억을 위한 최적의 복습 주기 계산

**알고리즘**: SM-2 (SuperMemo 2) 단순화 버전

```typescript
// 다음 복습 간격 계산
if (quality < 3) {
  // 실패
  interval = 1 day
  repetition = 0
} else {
  // 성공
  if (repetition === 1) interval = 1 day
  else if (repetition === 2) interval = 6 days
  else interval = interval * easinessFactor

  repetition += 1
}

// EF (Easiness Factor) 업데이트
EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
EF' = max(1.3, EF')
```

**주요 함수**:

- `calculateNextReview()`: 다음 복습일 계산
- `performanceToQuality()`: 사용자 성능 → 품질 점수 변환
- `getNextReviewDate()`: 날짜 계산

### 3. 인증 시스템

**위치**: `apps/web/src/lib/auth.ts`

**기술**: NextAuth.js

**지원 Provider**:
- Credentials (이메일/비밀번호)
- OAuth (확장 가능)

**세션 전략**: JWT

**보안**:
- bcrypt 해싱
- CSRF 보호
- Secure cookies (production)

### 4. 결제 시스템

**위치**: `apps/web/src/lib/stripe.ts`, `apps/web/src/server/routers/payments.ts`

**기술**: Stripe

**지원 기능**:
- 월간/연간 구독
- 코스 단품 구매
- Billing Portal
- Webhook 처리

**Webhook 이벤트**:
- `checkout.session.completed`: 결제 완료
- `customer.subscription.created/updated`: 구독 생성/업데이트
- `invoice.payment_succeeded/failed`: 청구 성공/실패

## 데이터 모델

### 핵심 엔티티

#### User

```typescript
User {
  id: String (CUID)
  email: String (unique)
  password: String? (nullable for OAuth)
  role: UserRole (STUDENT | TEACHER | ADMIN)
  locale: String (default: "ko-KR")

  // Relations
  profile: Profile?
  subscriptions: Subscription[]
  practiceSessions: PracticeSession[]
  weaknesses: Weakness[]
  spacedItems: SpacedItem[]
}
```

#### Question

```typescript
Question {
  id: String
  examType: ExamType (SUNEUNG | TEPS | TOEIC | TOEFL)
  part: String? (e.g., "Part 5", "독해")
  type: QuestionType (MCQ | SHORT | AUDIO | READING)
  stem: Text (문제 지문)
  passage: Text? (지문)
  audioUrl: String?
  imageUrl: String?
  difficulty: Float (0.0 - 1.0)
  tags: String[] (["grammar", "tense"])

  // Relations
  choices: Choice[]
  explanation: Explanation?
}
```

#### PracticeSession

```typescript
PracticeSession {
  id: String
  userId: String
  mode: SessionMode (ADAPTIVE | MOCK | CUSTOM | NOTEBOOK)
  configJson: Json (세션 설정)
  startedAt: DateTime
  finishedAt: DateTime?
  score: Float? (백분율)

  // Relations
  items: SessionItem[]
}
```

#### Weakness

```typescript
Weakness {
  userId: String
  tag: String
  score: Float (0.0 = weak, 1.0 = strong)
  totalAttempts: Int
  correctCount: Int
  lastUpdated: DateTime

  @@unique([userId, tag])
}
```

#### SpacedItem

```typescript
SpacedItem {
  userId: String
  questionId: String
  nextReviewAt: DateTime
  ef: Float (Easiness Factor, default: 2.5)
  interval: Int (days)
  repetition: Int

  @@unique([userId, questionId])
}
```

## API 설계 (tRPC)

### 명명 규칙

- Query: `get`, `list`
- Mutation: `create`, `update`, `delete`, `submit`

### 주요 프로시저

#### auth 라우터

```typescript
auth.register(input: { email, password, displayName? })
  → { id, email }

auth.getProfile()
  → User + Profile + Subscriptions

auth.updateProfile(input: { displayName?, schoolLevel?, ... })
  → Profile
```

#### exam 라우터

```typescript
exam.startOnboarding(input: { targetExam, targetScore?, ... })
  → PracticeSession (진단 세션)

exam.finishOnboarding(input: { sessionId })
  → { weaknesses: { tag, score, total, correct }[] }
```

#### practice 라우터

```typescript
practice.generateAdaptive(input: { examType?, questionCount })
  → PracticeSession + Questions

practice.submit(input: { sessionId, answers[] })
  → { score, correctCount, totalCount }

practice.getSession(input: { sessionId })
  → PracticeSession (with explanations)
```

#### notebook 라우터

```typescript
notebook.get(input: { limit?, tags? })
  → SessionItem[] (wrong answers)

notebook.generateSimilar(input: { queueSize })
  → PracticeSession (review session)

notebook.getStats()
  → { totalDue, totalReviewing, wrongAnswerCount }
```

#### report 라우터

```typescript
report.getOverview()
  → { totalSessions, accuracy, avgScore, weaknesses[], recentTrend[] }

report.getWeaknessDetail(input: { tag })
  → { weakness, recentAttempts[] }
```

#### payments 라우터

```typescript
payments.createCheckoutSession(input: { plan })
  → { sessionId, url }

payments.createBillingPortalSession()
  → { url }

payments.getSubscription()
  → Subscription?
```

## 보안

### 인증 & 인가

- JWT 기반 세션
- Role-based access control (STUDENT | TEACHER | ADMIN)
- Protected procedures: `protectedProcedure`, `adminProcedure`

### 데이터 검증

- Zod 스키마로 입력 검증
- 타입 안정성 보장

### 민감 정보 보호

- 비밀번호: bcrypt 해싱
- API 키: 환경 변수로 관리
- HTTPS only (production)

## 성능 최적화

### 데이터베이스

- 인덱스:
  - `Question(examType, tags, difficulty)`
  - `SessionItem(sessionId)`
  - `Weakness(userId, tag)`
  - `SpacedItem(userId, nextReviewAt)`

### 캐싱

- React Query 캐싱 (5분)
- Prisma 커넥션 풀링

### 최적화 전략

- Lazy loading (문제 이미지/오디오)
- Pagination (리포트, 세션 리스트)
- Eager loading (include relations)

## 확장성 고려사항

### 수평 확장

- Stateless API (JWT)
- Read replicas (PostgreSQL)
- CDN for static assets

### 마이크로서비스 분리 (향후)

- Auth Service
- Practice Service
- Payment Service
- Analytics Service

### 국제화

- next-intl 사용
- 데이터베이스에 locale 저장
- 다국어 지원 확장 가능

## 배포 아키텍처

```
┌──────────────┐
│   Vercel     │  ← Next.js Web App
└──────┬───────┘
       │
┌──────┴───────┐
│  Railway/    │  ← PostgreSQL Database
│  Fly.io      │
└──────────────┘

┌──────────────┐
│    Stripe    │  ← Payment Processing
└──────────────┘

┌──────────────┐
│     EAS      │  ← Mobile App Build/Deploy
└──────────────┘
```

## 모니터링 & 로깅

### 이벤트 로깅

`EventLog` 테이블로 주요 이벤트 추적:
- USER_SIGNUP
- SESSION_START / SESSION_FINISH
- PAYMENT_SUCCEEDED
- SUBSCRIPTION_UPDATED

### 메트릭 (향후)

- Sentry: 에러 추적
- OpenTelemetry: 성능 모니터링
- Custom analytics: 학습 패턴 분석

## 데이터 흐름 예시

### 적응형 세션 생성 & 제출

```
1. Client → practice.generateAdaptive({ examType: "TOEIC" })
2. Server:
   - 사용자 Weakness 조회
   - 후보 Question 조회 (examType, tags 필터)
   - 적응형 알고리즘으로 확률 계산
   - 문제 샘플링
   - PracticeSession + SessionItem 생성
3. Server → Client: { session, items, questions }

4. User solves questions...

5. Client → practice.submit({ sessionId, answers })
6. Server:
   - 답안 채점
   - SessionItem 업데이트 (isCorrect, elapsedMs)
   - Weakness 업데이트 (learning rate 적용)
   - SpacedItem 생성/업데이트 (SM-2)
   - EventLog 기록
7. Server → Client: { score, correctCount }
```

## 참고 자료

- [Prisma 스키마](../packages/db/prisma/schema.prisma)
- [tRPC 라우터](../apps/web/src/server/routers/)
- [적응형 엔진](../apps/web/src/lib/adaptive-engine.ts)
- [Spaced Repetition](../apps/web/src/lib/spaced-repetition.ts)
