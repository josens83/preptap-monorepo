# 성능 최적화 가이드

**PrepTap 서비스 속도 향상을 위한 최적화 전략**

---

## 현재 적용된 최적화

### 1. Next.js 14 App Router

- ✅ **Server Components** - 기본적으로 서버 컴포넌트 사용
- ✅ **Streaming** - 페이지 일부를 먼저 렌더링
- ✅ **Automatic Code Splitting** - 페이지별 자동 코드 분할
- ✅ **Image Optimization** - Next.js Image 컴포넌트 사용

### 2. 데이터 페칭

- ✅ **tRPC** - 타입 안전한 API 호출
- ✅ **React Query** - 자동 캐싱 및 재검증
- ✅ **Deduplication** - 중복 요청 제거

### 3. 빌드 최적화

- ✅ **Tree Shaking** - 사용하지 않는 코드 제거
- ✅ **Minification** - 코드 압축
- ✅ **Compression** - Gzip/Brotli 압축 (Vercel 자동)

---

## 추가 최적화 전략

### 1. 이미지 최적화

#### 현재 상태
- Next.js Image 컴포넌트 사용 중
- 자동 WebP 변환
- Lazy loading 적용

#### 개선 사항

```tsx
// 우선순위 이미지 (Above the fold)
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // LCP 개선
/>

// 일반 이미지
<Image
  src="/feature.jpg"
  alt="Feature"
  width={800}
  height={400}
  loading="lazy"
  placeholder="blur" // 블러 효과
  blurDataURL="data:..." // 저해상도 placeholder
/>
```

#### CDN 최적화
- Vercel Image Optimization 자동 적용
- 디바이스별 최적화된 크기 제공
- AVIF 포맷 지원 (WebP보다 20% 작음)

### 2. 폰트 최적화

#### 현재 상태
- 시스템 폰트 사용 중 (빠른 렌더링)

#### 개선 사항 (웹폰트 사용 시)

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOIT 방지
  preload: true,
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. 코드 스플리팅 강화

#### Dynamic Import

```tsx
// 무거운 컴포넌트 동적 로드
import dynamic from 'next/dynamic';

const ChartComponent = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // 클라이언트에서만 렌더링
});

const RichTextEditor = dynamic(() => import('@/components/Editor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,
});
```

#### Route Prefetching

```tsx
// 링크 프리페칭 (사용자가 클릭하기 전에 로드)
<Link href="/dashboard" prefetch>
  대시보드
</Link>

// 프리페칭 비활성화 (덜 중요한 페이지)
<Link href="/archive" prefetch={false}>
  보관함
</Link>
```

### 4. 데이터베이스 쿼리 최적화

#### 인덱스 추가

```prisma
// packages/db/prisma/schema.prisma

model Session {
  id String @id @default(cuid())
  userId String
  user User @relation(fields: [userId], references: [id])

  @@index([userId]) // 사용자별 세션 조회 최적화
  @@index([createdAt]) // 날짜별 조회 최적화
}

model Question {
  id String @id @default(cuid())
  examType ExamType

  @@index([examType]) // 시험 유형별 조회 최적화
}
```

#### Connection Pooling

```typescript
// packages/db/src/index.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

#### 쿼리 최적화

```typescript
// ❌ N+1 문제
const sessions = await db.session.findMany();
for (const session of sessions) {
  const user = await db.user.findUnique({ where: { id: session.userId } });
}

// ✅ Include로 한 번에 조회
const sessions = await db.session.findMany({
  include: {
    user: {
      select: {
        id: true,
        displayName: true,
      },
    },
  },
});

// ✅ Select로 필요한 필드만 조회
const users = await db.user.findMany({
  select: {
    id: true,
    email: true,
    displayName: true,
    // password는 제외
  },
});
```

### 5. 캐싱 전략

#### React Query 캐싱

```typescript
// apps/web/src/lib/trpc.ts
export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

// 컴포넌트에서
const { data: user } = trpc.user.me.useQuery(undefined, {
  staleTime: 5 * 60 * 1000, // 5분간 캐시
  cacheTime: 10 * 60 * 1000, // 10분간 유지
});
```

#### Redis 캐싱 (선택사항)

```typescript
import { getCache, CacheKeys, CacheTTL } from '@/lib/cache';

async function getUser(userId: string) {
  const cache = getCache();

  return cache.getOrSet(
    CacheKeys.user(userId),
    async () => {
      return db.user.findUnique({ where: { id: userId } });
    },
    { ttl: CacheTTL.fifteenMinutes }
  );
}
```

### 6. API 응답 최적화

#### Compression

```typescript
// middleware에서 자동 압축 (Vercel)
// 추가 설정 불필요
```

#### Response Streaming

```typescript
// app/api/stream/route.ts
export async function GET() {
  const stream = new ReadableStream({
    async start(controller) {
      const data = await fetchLargeData();

      for (const chunk of data) {
        controller.enqueue(JSON.stringify(chunk) + '\n');
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson',
      'Transfer-Encoding': 'chunked',
    },
  });
}
```

### 7. 번들 크기 최적화

#### 패키지 분석

```bash
# 번들 크기 분석
pnpm add -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... 기존 설정
});

# 실행
ANALYZE=true pnpm build
```

#### 무거운 라이브러리 대체

```typescript
// ❌ 무거운 라이브러리
import moment from 'moment'; // 288KB

// ✅ 가벼운 대안
import { formatDistance } from 'date-fns'; // 13KB
```

### 8. Lighthouse 최적화 목표

#### 데스크톱

- Performance: **95+**
- Accessibility: **95+**
- Best Practices: **95+**
- SEO: **95+**

#### 모바일

- Performance: **90+**
- Accessibility: **95+**
- Best Practices: **95+**
- SEO: **95+**

---

## 측정 및 모니터링

### 1. Web Vitals

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### 2. 성능 지표 추적

- **LCP (Largest Contentful Paint)**: < 2.5초
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### 3. 로딩 상태 개선

```tsx
// Skeleton 로딩 상태
export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
      <div className="h-32 bg-gray-200 rounded mb-4" />
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}

// Suspense 경계
<Suspense fallback={<DashboardSkeleton />}>
  <DashboardContent />
</Suspense>
```

---

## 성능 체크리스트

### 이미지
- [ ] Next.js Image 컴포넌트 사용
- [ ] Priority 이미지에 `priority` 속성
- [ ] Lazy loading 적용
- [ ] WebP/AVIF 포맷 사용

### 폰트
- [ ] 시스템 폰트 또는 최적화된 웹폰트
- [ ] `font-display: swap` 사용
- [ ] Preload 적용

### JavaScript
- [ ] 코드 스플리팅 (Dynamic Import)
- [ ] Tree shaking 확인
- [ ] 번들 크기 분석
- [ ] 무거운 라이브러리 제거/대체

### 데이터베이스
- [ ] 적절한 인덱스 추가
- [ ] N+1 쿼리 제거
- [ ] Connection pooling
- [ ] 필요한 필드만 조회 (Select)

### 캐싱
- [ ] React Query 캐싱 설정
- [ ] Redis 캐싱 (프로덕션)
- [ ] HTTP 캐시 헤더
- [ ] Static Generation 활용

### 모니터링
- [ ] Vercel Analytics 활성화
- [ ] Lighthouse 정기 테스트
- [ ] Web Vitals 추적
- [ ] 느린 쿼리 로깅

---

## 예상 성능 개선

### Before
- LCP: 3.2초
- FID: 150ms
- CLS: 0.15
- 번들 크기: 500KB

### After
- LCP: **1.8초** (↓ 44%)
- FID: **80ms** (↓ 47%)
- CLS: **0.05** (↓ 67%)
- 번들 크기: **350KB** (↓ 30%)

---

**성능 최적화는 지속적인 프로세스입니다. 정기적으로 측정하고 개선하세요!**
