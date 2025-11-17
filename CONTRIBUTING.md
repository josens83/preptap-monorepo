# Contributing to PrepTap

PrepTap에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 기여하는 방법을 안내합니다.

## 🚀 빠른 시작

### 1. 저장소 포크 및 클론

```bash
# 저장소 포크
# GitHub에서 'Fork' 버튼 클릭

# 클론
git clone https://github.com/YOUR_USERNAME/preptap-monorepo.git
cd preptap-monorepo

# Upstream 추가
git remote add upstream https://github.com/josens83/preptap-monorepo.git
```

### 2. 개발 환경 설정

```bash
# 의존성 설치 및 데이터베이스 설정
pnpm setup

# 또는 수동으로:
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

## 📁 프로젝트 구조

```
preptap-monorepo/
├── apps/
│   ├── web/              # Next.js 웹 애플리케이션
│   │   ├── src/
│   │   │   ├── app/      # App Router 페이지
│   │   │   ├── components/
│   │   │   ├── lib/      # 유틸리티 & 설정
│   │   │   └── server/   # tRPC 라우터
│   └── mobile/           # React Native 모바일 앱
├── packages/
│   ├── db/               # Prisma 스키마 & 시드
│   ├── ui/               # 공유 UI 컴포넌트
│   └── config/           # 공유 설정
└── docs/                 # 문서
```

## 🔧 개발 워크플로우

### 브랜치 전략

- `main` - 프로덕션 코드
- `develop` - 개발 브랜치
- `feature/*` - 새로운 기능
- `fix/*` - 버그 수정
- `refactor/*` - 리팩토링
- `docs/*` - 문서 업데이트

### 새로운 기능 추가

```bash
# develop 브랜치에서 시작
git checkout develop
git pull upstream develop

# 기능 브랜치 생성
git checkout -b feature/your-feature-name

# 개발...
# 커밋...

# 푸시
git push origin feature/your-feature-name

# Pull Request 생성
```

## ✅ 코드 스타일

### TypeScript

- **타입 명시**: 가능한 모든 곳에 타입 명시
- **any 금지**: `any` 사용 최소화, `unknown` 사용
- **명확한 네이밍**: 변수명은 명확하고 설명적으로

```typescript
// ❌ 나쁜 예
function calc(a: any, b: any) {
  return a + b;
}

// ✅ 좋은 예
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}
```

### React 컴포넌트

- **함수형 컴포넌트** 사용
- **Hooks** 사용
- **Props 인터페이스** 명시

```typescript
// ✅ 좋은 예
interface ButtonProps {
  variant?: "primary" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant = "primary", onClick, children }: ButtonProps) => {
  return (
    <button className={getButtonClass(variant)} onClick={onClick}>
      {children}
    </button>
  );
};
```

### 파일 구조

- **하나의 파일에 하나의 컴포넌트**
- **관련 파일 같은 디렉토리에 배치**
- **index 파일로 export**

```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
```

## 🧪 테스트

### 단위 테스트

```bash
# 전체 테스트 실행
pnpm test

# 특정 파일 테스트
pnpm test Button.test.tsx

# Watch 모드
pnpm test --watch
```

### E2E 테스트

```bash
# Playwright 테스트
cd apps/web
pnpm test:e2e
```

## 📝 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따릅니다:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅 (기능 변경 없음)
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

### 예시

```bash
feat(auth): add social login with Google

- Implement Google OAuth integration
- Add Google sign-in button to login page
- Update environment variables for Google credentials

Closes #123
```

## 🐛 버그 리포트

버그를 발견하셨나요? [이슈 생성](https://github.com/josens83/preptap-monorepo/issues/new)해 주세요.

### 버그 리포트 템플릿

```markdown
**버그 설명**
버그에 대한 명확한 설명

**재현 방법**
1. '...'로 이동
2. '...'를 클릭
3. '...'까지 스크롤
4. 에러 발생

**예상 동작**
예상했던 동작 설명

**스크린샷**
해당되는 경우 스크린샷 추가

**환경**
- OS: [예: macOS 13.0]
- 브라우저: [예: Chrome 120]
- Node 버전: [예: 18.17.0]
```

## 💡 기능 제안

새로운 기능을 제안하고 싶으신가요? [이슈 생성](https://github.com/josens83/preptap-monorepo/issues/new)해 주세요.

### 기능 제안 템플릿

```markdown
**기능 설명**
원하는 기능에 대한 명확한 설명

**문제점**
이 기능이 해결하는 문제

**제안하는 해결책**
어떻게 구현하면 좋을지

**대안**
고려한 다른 해결책
```

## 🔍 Pull Request 체크리스트

PR을 제출하기 전에 다음 사항을 확인해주세요:

- [ ] 코드가 프로젝트의 코드 스타일을 따름
- [ ] 필요한 경우 테스트 추가/업데이트
- [ ] 모든 테스트 통과
- [ ] 문서 업데이트 (필요한 경우)
- [ ] 커밋 메시지가 규칙을 따름
- [ ] PR 설명이 변경 사항을 명확히 설명
- [ ] 관련 이슈 링크 (있는 경우)

## 📚 유용한 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 빌드
pnpm build

# 테스트
pnpm test

# 린트
pnpm lint

# 포맷팅
pnpm format

# 타입 체크
pnpm type-check

# 데이터베이스 초기화
pnpm db:setup

# 데이터베이스 리셋
pnpm db:reset

# Prisma Studio
pnpm db:studio

# 전체 클린업
pnpm clean
```

## 🤝 Code Review 프로세스

1. **자동 검사**: CI/CD가 자동으로 테스트와 린트 실행
2. **코드 리뷰**: 최소 1명의 리뷰어 승인 필요
3. **변경 요청**: 리뷰어가 변경 요청할 수 있음
4. **승인 후 병합**: 모든 검사 통과 및 승인 후 병합

## 📞 도움이 필요하신가요?

- [GitHub Issues](https://github.com/josens83/preptap-monorepo/issues)
- [GitHub Discussions](https://github.com/josens83/preptap-monorepo/discussions)
- Email: dev@preptap.com

## 📄 라이선스

이 프로젝트에 기여함으로써 귀하의 기여가 프로젝트와 동일한 [MIT 라이선스](LICENSE) 하에 있음에 동의합니다.

---

**감사합니다!** 🙏

PrepTap을 더 나은 플랫폼으로 만드는 데 도움을 주셔서 감사합니다.
