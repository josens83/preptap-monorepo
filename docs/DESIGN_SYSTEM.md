# PrepTap 디자인 시스템 가이드

**현대 고급 웹사이트 수준의 디자인 시스템**

Linear, Stripe, Vercel 스타일의 세련된 UI/UX 구현

---

## 📐 디자인 철학

### 핵심 원칙

1. **미니멀리즘** - Less is More
2. **일관성** - 모든 요소가 조화롭게
3. **접근성** - 모든 사용자를 위한 디자인
4. **성능** - 빠르고 부드러운 인터랙션

---

## 🎨 컬러 시스템

### 디자인 토큰 (CSS 변수 기반)

모든 색상은 CSS 변수로 정의되어 라이트/다크 모드를 자동 지원합니다.

#### 라이트 모드

```css
--background: 0 0% 100%;          /* #FFFFFF - 메인 배경 */
--foreground: 240 10% 4%;         /* #0A0B0D - 메인 텍스트 */
--primary: 217 91% 60%;           /* #3B82F6 - 브랜드 파란색 */
--accent: 142 76% 36%;            /* #16A34A - 강조 초록색 */
--border: 240 6% 90%;             /* #E3E4E8 - 얇은 테두리 */
```

#### 다크 모드

```css
--background: 240 10% 4%;         /* #09090B - 깊은 검정 */
--foreground: 0 0% 98%;           /* #FAFAFA - 거의 흰색 */
--primary: 217 91% 60%;           /* 동일 */
--accent: 142 76% 36%;            /* 동일 */
--border: 240 4% 16%;             /* #27272A - 극세 테두리 */
```

### 사용법

```tsx
// Tailwind 클래스 사용
<div className="bg-background text-foreground border border-border">
  <h1 className="text-primary">제목</h1>
  <p className="text-foreground-secondary">설명</p>
</div>
```

---

## 🔤 타이포그래피

### 폰트 패밀리

- **산세리프**: Inter (본문)
- **모노스페이스**: JetBrains Mono (코드)

### 폰트 스케일

| 크기 | 용도 | Tailwind 클래스 | 크기/라인하이트 |
|------|------|-----------------|----------------|
| **H1** | 메인 제목 | `text-4xl` | 2.25rem / 2.5rem |
| **H2** | 섹션 제목 | `text-3xl` | 1.875rem / 2.25rem |
| **H3** | 서브 제목 | `text-2xl` | 1.5rem / 2rem |
| **본문** | 일반 텍스트 | `text-base` | 1rem / 1.5rem |
| **작은 글씨** | 보조 정보 | `text-sm` | 0.875rem / 1.25rem |

### 타이포그래피 예시

```tsx
<h1 className="text-4xl font-bold text-foreground">
  대제목
</h1>
<h2 className="text-3xl font-semibold text-foreground">
  중제목
</h2>
<p className="text-base text-foreground-secondary leading-relaxed">
  본문 텍스트입니다.
</p>
```

---

## 🧩 핵심 컴포넌트

### 1. GlassCard (글래스모피즘)

반투명 배경과 블러 효과의 카드

```tsx
import { GlassCard } from "@preptap/ui";

<GlassCard variant="default" hover>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</GlassCard>
```

**Variants:**
- `default` - 표준 글래스 효과
- `subtle` - 미세한 효과
- `strong` - 강한 효과

### 2. BentoGrid (Apple 스타일 격자)

다양한 크기의 카드를 아름답게 배치

```tsx
import { BentoGrid, BentoCard } from "@preptap/ui";

<BentoGrid columns={3}>
  <BentoCard span="wide">
    <h3>와이드 카드</h3>
  </BentoCard>

  <BentoCard span="default">
    <h3>기본 카드</h3>
  </BentoCard>

  <BentoCard span="tall" gradient>
    <h3>세로로 긴 카드</h3>
  </BentoCard>
</BentoGrid>
```

**Span 옵션:**
- `default` - 1x1
- `wide` - 2x1 (가로로 넓음)
- `tall` - 1x2 (세로로 김)
- `large` - 2x2 (크게)

### 3. GradientBackground (Linear 스타일)

그라데이션 배경 효과

```tsx
import { GradientBackground } from "@preptap/ui";

<div className="relative min-h-screen">
  <GradientBackground variant="blue" intensity="medium" />

  <div className="relative z-10">
    {/* 콘텐츠 */}
  </div>
</div>
```

**Variants:**
- `blue` - 파란색 그라데이션
- `purple` - 보라색 그라데이션
- `green` - 초록색 그라데이션
- `multi` - 다중 색상

### 4. SpotlightCard (Vercel 스타일)

마우스를 따라다니는 조명 효과

```tsx
import { SpotlightCard } from "@preptap/ui";

<SpotlightCard spotlightColor="rgba(59, 130, 246, 0.15)">
  <h3>마우스를 올려보세요</h3>
  <p>빛이 따라다닙니다</p>
</SpotlightCard>
```

### 5. Shimmer (Stripe 스타일 로딩)

부드러운 로딩 애니메이션

```tsx
import { Shimmer } from "@preptap/ui";

<Shimmer show={isLoading}>
  <div className="h-20 bg-surface rounded" />
</Shimmer>
```

---

## 🎭 다크 모드

### ThemeToggle 사용

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

// 헤더나 네비게이션에 추가
<ThemeToggle />
```

### 수동 테마 전환

```tsx
// 다크 모드 활성화
document.documentElement.classList.add("dark");

// 라이트 모드 활성화
document.documentElement.classList.remove("dark");
```

---

## ✨ 유틸리티 클래스

### 글래스모피즘

```tsx
<div className="glass">
  {/* 글래스 효과 */}
</div>
```

### 호버 리프트 (Stripe 스타일)

```tsx
<button className="hover-lift shadow-elegant">
  클릭하세요
</button>
```

### 그라데이션 글로우 (Linear 스타일)

```tsx
<div className="gradient-glow">
  {/* 호버 시 그라데이션 글로우 */}
</div>
```

### 극세 테두리

```tsx
<div className="border-fine border-border">
  {/* 0.5px 테두리 */}
</div>
```

### 스크롤바 스타일링

```tsx
<div className="scrollbar-thin overflow-auto">
  {/* 얇고 세련된 스크롤바 */}
</div>
```

---

## 🎬 애니메이션

### 기본 애니메이션

```tsx
// 페이드 인
<div className="animate-fade-in">콘텐츠</div>

// 슬라이드 업
<div className="animate-slide-up">콘텐츠</div>

// 스케일 인
<div className="animate-scale-in">콘텐츠</div>

// 심머 (로딩)
<div className="animate-shimmer">콘텐츠</div>
```

### 커스텀 트랜지션

```tsx
<div className="transition-all duration-300 ease-out">
  {/* 부드러운 전환 */}
</div>
```

---

## 📏 레이아웃

### Container

```tsx
<div className="container mx-auto px-4">
  {/* 중앙 정렬된 최대 너비 콘텐츠 */}
</div>
```

### Grid 시스템

```tsx
// 반응형 그리드
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>카드 1</div>
  <div>카드 2</div>
  <div>카드 3</div>
</div>
```

### Flexbox

```tsx
// 수평 정렬
<div className="flex items-center gap-4">
  <div>항목 1</div>
  <div>항목 2</div>
</div>

// 수직 정렬
<div className="flex flex-col gap-4">
  <div>항목 1</div>
  <div>항목 2</div>
</div>
```

---

## 🎯 Best Practices

### 1. 일관성 유지

**DO:**
```tsx
<Button className="bg-primary text-primary-foreground">
  버튼
</Button>
```

**DON'T:**
```tsx
<Button className="bg-blue-500 text-white">
  버튼
</Button>
```

### 2. 시맨틱 컬러 사용

**DO:**
```tsx
<div className="bg-destructive text-destructive-foreground">
  에러 메시지
</div>
```

**DON'T:**
```tsx
<div className="bg-red-500 text-white">
  에러 메시지
</div>
```

### 3. 반응형 디자인

**DO:**
```tsx
<div className="text-base md:text-lg lg:text-xl">
  반응형 텍스트
</div>
```

**DON'T:**
```tsx
<div className="text-xl">
  고정 크기 텍스트
</div>
```

### 4. 접근성

```tsx
// 키보드 포커스 표시
<button className="focus:ring-2 focus:ring-primary">
  버튼
</button>

// ARIA 레이블
<button aria-label="메뉴 열기">
  <MenuIcon />
</button>

// 모션 감소 옵션 자동 지원
// prefers-reduced-motion이 자동으로 적용됨
```

---

## 🚀 사용 예시

### 히어로 섹션

```tsx
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
  <GradientBackground variant="blue" intensity="medium" />

  <div className="container relative z-10 text-center">
    <h1 className="text-6xl font-bold text-foreground mb-6 animate-fade-in">
      PrepTap으로 시작하세요
    </h1>

    <p className="text-xl text-foreground-secondary mb-8 animate-slide-up">
      AI 기반 학습 플랫폼
    </p>

    <button className="bg-primary text-primary-foreground px-8 py-4 rounded-lg hover-lift shadow-elegant">
      시작하기
    </button>
  </div>
</section>
```

### 기능 섹션

```tsx
<section className="py-20">
  <div className="container">
    <h2 className="text-4xl font-bold text-center mb-12">
      주요 기능
    </h2>

    <BentoGrid columns={3}>
      <BentoCard span="wide" gradient hover>
        <h3 className="text-2xl font-semibold mb-4">적응형 학습</h3>
        <p className="text-foreground-secondary">
          AI가 당신의 약점을 분석합니다
        </p>
      </BentoCard>

      <SpotlightCard>
        <h3 className="text-2xl font-semibold mb-4">오답노트</h3>
        <p className="text-foreground-secondary">
          틀린 문제를 자동으로 정리
        </p>
      </SpotlightCard>

      <GlassCard hover>
        <h3 className="text-2xl font-semibold mb-4">상세 분석</h3>
        <p className="text-foreground-secondary">
          학습 패턴을 시각화
        </p>
      </GlassCard>
    </BentoGrid>
  </div>
</section>
```

---

## 📦 패키지 구성

### @preptap/ui

```
packages/ui/src/components/
├── Button.tsx              # 기본 버튼
├── Card.tsx                # 기본 카드
├── GlassCard.tsx          # 글래스모피즘 카드
├── BentoGrid.tsx          # Bento 그리드
├── GradientBackground.tsx  # 그라데이션 배경
├── SpotlightCard.tsx      # 스포트라이트 카드
├── Shimmer.tsx            # 로딩 효과
└── ...
```

---

## 🎨 디자인 리소스

### 참고 사이트

- [Linear](https://linear.app) - 다크 모드, 그라데이션
- [Stripe](https://stripe.com) - 타이포그래피, 애니메이션
- [Vercel](https://vercel.com) - 스포트라이트 효과
- [Notion](https://notion.so) - 미니멀 디자인

### 도구

- **Figma** - 디자인 시안
- **Tailwind CSS** - 유틸리티 CSS
- **Radix UI** - 접근성 컴포넌트

---

## 📝 업데이트 로그

### v2.0.0 (2025-11-18)

- ✨ 디자인 토큰 시스템 구축
- ✨ 다크 모드 완전 지원
- ✨ Linear/Stripe 스타일 컴포넌트 추가
- ✨ 애니메이션 시스템 구축
- ✨ 타이포그래피 고도화
- ✨ 접근성 개선

---

**PrepTap 디자인 시스템**은 지속적으로 발전합니다.

피드백과 제안은 언제나 환영합니다! 🚀
