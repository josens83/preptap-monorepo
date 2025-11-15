# API Reference

PrepTap API는 tRPC를 사용하여 타입 안전성을 보장합니다.

## Base URL

```
Development: http://localhost:3000/api/trpc
Production: https://your-domain.com/api/trpc
```

## 인증

모든 protected 프로시저는 NextAuth 세션이 필요합니다.

**헤더**:
```
Cookie: next-auth.session-token=...
```

## 라우터

### auth

사용자 인증 및 프로필 관리

#### `auth.register`

새 사용자 등록

**Type**: Mutation

**Input**:
```typescript
{
  email: string;
  password: string; // min 8 chars
  displayName?: string;
}
```

**Output**:
```typescript
{
  id: string;
  email: string;
}
```

**Errors**:
- `CONFLICT`: 이메일 이미 사용 중

---

#### `auth.getProfile`

현재 사용자 프로필 조회 (Protected)

**Type**: Query

**Output**:
```typescript
{
  id: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  profile: {
    displayName: string | null;
    schoolLevel: "ELEMENTARY" | "MIDDLE" | "HIGH" | "UNIVERSITY" | "ADULT" | null;
    targetExam: "SUNEUNG" | "TEPS" | "TOEIC" | "TOEFL" | "IELTS" | null;
    targetScore: number | null;
    examDate: Date | null;
  } | null;
  subscriptions: Subscription[];
}
```

---

#### `auth.updateProfile`

프로필 업데이트 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  displayName?: string;
  schoolLevel?: "ELEMENTARY" | "MIDDLE" | "HIGH" | "UNIVERSITY" | "ADULT";
  targetExam?: "SUNEUNG" | "TEPS" | "TOEIC" | "TOEFL" | "IELTS";
  targetScore?: number;
  examDate?: Date;
}
```

---

### exam

온보딩 및 진단평가

#### `exam.startOnboarding`

온보딩 진단 시작 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  targetExam: "SUNEUNG" | "TEPS" | "TOEIC" | "TOEFL";
  schoolLevel?: "ELEMENTARY" | "MIDDLE" | "HIGH" | "UNIVERSITY" | "ADULT";
  targetScore?: number;
  examDate?: Date;
}
```

**Output**:
```typescript
{
  id: string;
  mode: "ADAPTIVE";
  items: Array<{
    id: string;
    orderIndex: number;
    question: {
      id: string;
      stem: string;
      passage?: string;
      type: "MCQ" | "SHORT" | "AUDIO" | "READING";
      choices: Array<{
        id: string;
        label: string; // A, B, C, D
        text: string;
      }>;
    };
  }>;
}
```

---

#### `exam.finishOnboarding`

진단 완료 및 취약점 분석 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  sessionId: string;
}
```

**Output**:
```typescript
{
  weaknesses: Array<{
    tag: string;
    score: number; // 0.0 - 1.0
    total: number;
    correct: number;
  }>;
}
```

---

### practice

연습 세션 관리

#### `practice.generateAdaptive`

적응형 세션 생성 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  examType?: "SUNEUNG" | "TEPS" | "TOEIC" | "TOEFL";
  questionCount?: number; // 5-50, default: 20
  focusTags?: string[];
}
```

**Output**: PracticeSession with items and questions

---

#### `practice.submit`

세션 답안 제출 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  sessionId: string;
  answers: Array<{
    itemId: string;
    userAnswer: string;
    elapsedMs: number;
    flagged?: boolean;
    skipped?: boolean;
  }>;
}
```

**Output**:
```typescript
{
  score: number; // percentage
  correctCount: number;
  totalCount: number;
}
```

---

#### `practice.getSession`

세션 상세 조회 (Protected)

**Type**: Query

**Input**:
```typescript
{
  sessionId: string;
}
```

**Output**: PracticeSession with items, questions, and explanations

---

#### `practice.getRecentSessions`

최근 세션 목록 (Protected)

**Type**: Query

**Input**:
```typescript
{
  limit?: number; // 1-50, default: 10
}
```

**Output**: Array of PracticeSession

---

### notebook

오답노트 관리

#### `notebook.get`

오답 목록 조회 (Protected)

**Type**: Query

**Input**:
```typescript
{
  limit?: number; // 1-100, default: 50
  tags?: string[];
}
```

**Output**:
```typescript
Array<{
  id: string;
  question: Question;
  userAnswer: string;
  isCorrect: false;
  session: {
    id: string;
    mode: string;
    startedAt: Date;
  };
}>
```

---

#### `notebook.generateSimilar`

복습 세션 생성 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  queueSize?: number; // 5-30, default: 10
}
```

**Output**:
```typescript
{
  message: string;
  session: PracticeSession | null;
}
```

---

#### `notebook.getStats`

복습 통계 (Protected)

**Type**: Query

**Output**:
```typescript
{
  totalDue: number; // 복습 대기 중
  totalReviewing: number; // 복습 중
  wrongAnswerCount: number; // 총 오답 수
}
```

---

### report

학습 리포트

#### `report.getOverview`

전체 학습 리포트 (Protected)

**Type**: Query

**Output**:
```typescript
{
  totalSessions: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // percentage
  avgScore: number;
  totalStudyTimeMs: number;
  weaknesses: Array<{
    tag: string;
    score: number;
    accuracy: number;
  }>;
  recentTrend: Array<{
    date: Date;
    score: number;
  }>;
}
```

---

#### `report.getWeaknessDetail`

특정 취약점 상세 (Protected)

**Type**: Query

**Input**:
```typescript
{
  tag: string;
}
```

**Output**:
```typescript
{
  weakness: Weakness;
  recentAttempts: Array<SessionItem>;
}
```

---

#### `report.getPerformanceByExam`

시험별 성과 (Protected)

**Type**: Query

**Output**:
```typescript
Array<{
  examType: string;
  accuracy: number;
  totalQuestions: number;
  sessions: number;
}>
```

---

### payments

결제 및 구독

#### `payments.createCheckoutSession`

구독 결제 세션 생성 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  plan: "MONTHLY" | "YEARLY";
  successUrl?: string;
  cancelUrl?: string;
}
```

**Output**:
```typescript
{
  sessionId: string;
  url: string; // Stripe checkout URL
}
```

---

#### `payments.createCourseCheckout`

코스 구매 세션 생성 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
}
```

**Output**:
```typescript
{
  sessionId: string;
  url: string;
}
```

---

#### `payments.createBillingPortalSession`

Billing Portal 세션 생성 (Protected)

**Type**: Mutation

**Input**:
```typescript
{
  returnUrl?: string;
}
```

**Output**:
```typescript
{
  url: string; // Stripe Billing Portal URL
}
```

---

#### `payments.getSubscription`

현재 구독 조회 (Protected)

**Type**: Query

**Output**: Subscription | null

---

#### `payments.getEnrollments`

등록 코스 목록 (Protected)

**Type**: Query

**Output**: Array of Enrollment with Course

---

## Webhooks

### Stripe Webhook

**Endpoint**: `POST /api/webhooks/stripe`

**Headers**:
```
stripe-signature: t=...,v1=...
```

**Supported Events**:
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Error Codes

tRPC uses standard HTTP-like error codes:

- `BAD_REQUEST` (400): Invalid input
- `UNAUTHORIZED` (401): Not authenticated
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource conflict (e.g., duplicate email)
- `INTERNAL_SERVER_ERROR` (500): Server error

## Rate Limiting

Currently no rate limiting. Production should implement:
- 100 requests/minute per user
- 1000 requests/hour per IP

## Pagination

Use `limit` and `offset` for pagination:

```typescript
{
  limit: 20,
  offset: 40, // Skip first 40
}
```

## Examples

### Register and Login

```typescript
// 1. Register
const { id } = await trpc.auth.register.mutate({
  email: "user@example.com",
  password: "password123",
  displayName: "김학생",
});

// 2. Login (NextAuth)
await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
});

// 3. Get profile
const profile = await trpc.auth.getProfile.query();
```

### Create and Submit Practice Session

```typescript
// 1. Generate adaptive session
const session = await trpc.practice.generateAdaptive.mutate({
  examType: "TOEIC",
  questionCount: 20,
});

// 2. User solves questions...

// 3. Submit answers
const result = await trpc.practice.submit.mutate({
  sessionId: session.id,
  answers: session.items.map((item, idx) => ({
    itemId: item.id,
    userAnswer: "A", // User's answer
    elapsedMs: 30000, // 30 seconds
  })),
});

console.log(`Score: ${result.score}%`);
```

### Subscribe to Pro

```typescript
// 1. Create checkout session
const { url } = await trpc.payments.createCheckoutSession.mutate({
  plan: "MONTHLY",
});

// 2. Redirect to Stripe
window.location.href = url;

// 3. After successful payment, webhook updates subscription

// 4. Check subscription status
const subscription = await trpc.payments.getSubscription.query();
if (subscription?.status === "ACTIVE") {
  console.log("Pro user!");
}
```
