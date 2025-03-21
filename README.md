# NextJS 스타트킷 프로젝트 가이드 - Cursor 특화 에디션

## 프로젝트 개요

이 프로젝트는 "nextjs-start-kit"이라는 이름의 NextJS 15.2.3 기반 스타터 템플릿으로, Cursor IDE에 최적화되어 있습니다. 현대적인 웹 애플리케이션 개발에 필요한 다양한 도구와 라이브러리를 포함하고 있으며, Cursor의 AI 코딩 지원 기능과 함께 사용할 때 최상의 개발 경험을 제공합니다.

## 주요 기술 스택

- **프레임워크**: Next.js 15.2.3 (React 19)
- **데이터베이스**: Drizzle ORM + NeonDB (Serverless PostgreSQL)
- **인증**: NextAuth v5 (Auth.js)
- **API**: tRPC
- **상태 관리**: TanStack Query (React Query)
- **폼 관리**: React Hook Form + Zod 유효성 검증
- **UI 컴포넌트**: shadcn/ui (Radix UI 기반) + Tailwind CSS
- **패키지 관리자**: Bun (npm 대체)
- **기타**: TypeScript, ESLint, NextThemes

## 시작하기

### Bun 설치

```bash
# macOS 또는 Linux에 Bun 설치
curl -fsSL https://bun.sh/install | bash

# 또는 npm으로 설치
npm install -g bun
```

### 의존성 설치

```bash
# 의존성 패키지 설치
bun install
```

### 개발 서버 실행

```bash
# 개발 서버 실행 (Next.js + Webhook)
bun dev

# 데이터베이스 스튜디오 실행 (데이터 확인/편집)
bun db:studio
```

### 데이터베이스 관리

```bash
# 데이터베이스 스키마 푸시
bun db:push
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
bun run build

# 프로덕션 서버 실행
bun start
```

## Ngrok 설정 가이드

이 프로젝트는 웹훅 테스트를 위해 ngrok을 사용합니다. ngrok을 통해 로컬 개발 환경을 인터넷에 노출시켜 외부 서비스(예: 결제 게이트웨이, 소셜 로그인 등)의 웹훅을 테스트할 수 있습니다.

### 1. Ngrok 설치 및 계정 설정

1. [Ngrok 공식 사이트](https://ngrok.com/)에서 계정 가입
2. 인증 토큰 확인: 대시보드 > Your Authtoken
3. 터미널에서 다음 명령어로 ngrok 설치 (Mac 기준):
   ```bash
   brew install ngrok
   ```
4. 인증 토큰 설정:
   ```bash
   ngrok config add-authtoken YOUR_AUTHTOKEN
   ```

### 2. 프로젝트에서 Ngrok 설정

1. package.json의 개발 스크립트를 확인하세요:

   ```json
   "dev:webhook": "ngrok http --url=your-ngrok-url 3000"
   ```

2. 위 스크립트에서 `your-ngrok-url`을 여러분의 ngrok 도메인으로 변경하세요.
   (ngrok 계정에서 고정 도메인을 사용하는 경우) 또는 `--url` 옵션을 제거하세요.

3. `.env.development` 파일에 ngrok URL 설정:
   ```
   NEXT_PUBLIC_APP_URL="https://your-subdomain.ngrok.io" # 웹훅 테스트용 ngrok 주소
   ```

### 3. Ngrok 실행 및 사용

1. `bun dev` 명령을 실행하면 concurrently를 통해 Next.js 개발 서버와 ngrok이 함께 실행됩니다.
2. 터미널에서 ngrok의 포워딩 URL을 확인하세요 (예: `https://xxxx-xxxx-xxxx.ngrok.io`).
3. 이 URL을 외부 서비스의 웹훅 설정에 사용하세요.

### 주의사항

- 무료 ngrok 계정은 세션이 8시간 후 만료되어 URL이 변경됩니다.
- 유료 계정을 사용하면 고정 하위 도메인을 사용할 수 있습니다.
- 개발 목적으로만 사용하고, 프로덕션 환경에서는 사용하지 마세요.

## 프로젝트 핵심 기능

### 1. 데이터베이스 (Drizzle ORM)

Drizzle ORM을 사용하여 NeonDB(Serverless PostgreSQL)에 연결합니다. 이는 다음과 같은 기능을 제공합니다:

- 타입 안전한 스키마 정의 및 마이그레이션
- `db:push` 명령을 통한 스키마 업데이트
- `db:studio` 명령으로 데이터 시각화 및 관리

### 2. 인증 시스템 (NextAuth v5)

최신 버전의 NextAuth를 사용하여 인증 시스템을 구현합니다:

- Drizzle 어댑터를 통한 데이터베이스 연결
- 다양한 인증 제공자 지원 가능
- 세션 관리 및 보안 기능

### 3. API (tRPC)

타입 안전한 API를 위해 tRPC가 구현되어 있습니다:

- 프론트엔드-백엔드 간 타입 안전한 통신
- TanStack Query와의 통합으로 데이터 캐싱 및 관리
- 서버-클라이언트 간 타입 정의 공유

### 4. UI 컴포넌트 (shadcn/ui)

shadcn/ui는 Radix UI 컴포넌트와 Tailwind CSS를 기반으로 한 재사용 가능한 컴포넌트 모음입니다:

- 접근성이 뛰어난 컴포넌트 시스템
- 다크/라이트 테마 지원 (next-themes)
- 반응형 디자인 지원
- 사용자 정의 가능한 스타일링

## Cursor IDE 통합 기능

이 스타트킷은 Cursor IDE와 특별히 최적화되어 있습니다:

- **AI 지원 개발**: Cursor의 AI 코드 완성 및 제안 기능과 완벽하게 호환
- **프로젝트 구조**: Cursor의 코드 내비게이션과 검색 기능을 최대한 활용할 수 있는 구조
- **타입스크립트 통합**: Cursor의 타입 추론 및 자동 완성 기능 강화
- **스니펫 최적화**: Cursor에서 제공하는 스니펫과 호환되는 코드 패턴

## 컴포넌트 구조

### 컴포넌트 구성 방식

이 프로젝트는 다음과 같은 컴포넌트 구조를 가지고 있습니다:

1. **전역 컴포넌트 (Global Components)**

   - `src/components/` 폴더에 위치
   - 애플리케이션 전체에서 재사용 가능한 공통 컴포넌트
   - 예: UI 컴포넌트 (`src/components/ui/`) - 버튼, 모달, 폼 요소 등

2. **로컬 컴포넌트 (Local Components)**
   - 각 라우트 폴더 내의 `_components/` 폴더에 위치
   - 해당 라우트나 기능에 특화된 컴포넌트
   - 예: `src/app/(main)/_components/header.tsx`, `src/app/(main)/_components/hero.tsx`

이 구조는 관심사 분리와 코드 재사용성을 최적화하는 데 도움이 됩니다. 전역적으로 사용되는 컴포넌트는 `components` 폴더에 놓고, 특정 페이지나 기능에서만 사용되는 로컬 컴포넌트는 해당 라우트의 `_components` 폴더에 배치합니다.

## 폴더 구조

```
nextjs-start-kit/
├── src/
│   ├── app/                  # Next.js 애플리케이션 라우트
│   │   ├── (main)/           # 메인 라우트 그룹
│   │   │   ├── _components/  # 메인 라우트 로컬 컴포넌트
│   │   │   │   ├── header.tsx
│   │   │   │   └── hero.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── (auth)/           # 인증 관련 라우트 그룹
│   │   │   ├── _components/  # 인증 관련 로컬 컴포넌트
│   │   │   ├── layout.tsx
│   │   │   └── ...
│   │   ├── (protected)/      # 인증 보호된 라우트 그룹
│   │   │   ├── _components/  # 보호된 라우트 로컬 컴포넌트
│   │   │   └── ...
│   │   ├── api/              # API 라우트
│   │   └── layout.tsx        # 루트 레이아웃
│   ├── components/           # 전역 컴포넌트
│   │   └── ui/               # UI 컴포넌트 (shadcn/ui)
│   ├── server/               # 서버 관련 코드
│   │   └── trpc/             # tRPC 설정
│   ├── db/                   # 데이터베이스 관련
│   ├── auth/                 # 인증 관련 설정
│   ├── lib/                  # 유틸리티 및 헬퍼 함수
│   └── hooks/                # 커스텀 훅
├── public/                   # 정적 파일
├── drizzle.config.ts         # Drizzle ORM 설정
├── next.config.ts            # Next.js 설정
├── package.json              # 프로젝트 종속성 및 스크립트
└── tsconfig.json             # TypeScript 설정
```

## shadcn/ui 사용하기

shadcn/ui는 컴포넌트 라이브러리가 아닌 컴포넌트 모음으로, 필요한 컴포넌트를 직접 프로젝트에 통합하여 사용합니다. 이는 다음과 같은 이점이 있습니다:

- 필요한 컴포넌트만 사용하여 번들 크기 최적화
- 컴포넌트 코드를 직접 소유하여 자유롭게 수정 가능
- Tailwind CSS를 활용한 유연한 스타일링

### 컴포넌트 사용 예시

```tsx
// 버튼 컴포넌트 사용 예시
import { Button } from "@/components/ui/button";

export function MyComponent() {
  return (
    <Button variant="outline" size="lg">
      버튼 텍스트
    </Button>
  );
}
```

## 컴포넌트 예시

### 전역 컴포넌트 사용

```tsx
// src/app/(main)/_components/header.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Header = () => {
  return (
    <header>
      <Link href="/">Logo</Link>
      <nav>
        <Link href="/hello">
          <Button variant="ghost">Hello</Button>
        </Link>
      </nav>
    </header>
  );
};
```

### 로컬 컴포넌트 사용

```tsx
// src/app/(main)/page.tsx
import { Hero } from "./_components/hero";

const HomePage = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};
```

## 그 외 주요 기능

- **S3 통합**: AWS S3 클라이언트 라이브러리가 포함되어 파일 업로드 기능 구현 가능
- **Webhook 지원**: ngrok을 통한 웹훅 테스트 환경 제공
- **차트 시각화**: Recharts 라이브러리로 데이터 시각화 가능
- **토스트 알림**: Sonner 라이브러리로 알림 UI 구현 가능

## 결론

이 NextJS 스타트킷은 Cursor IDE를 사용하는 개발자들을 위해 최적화되어 있으며, 현대적인 웹 애플리케이션 개발에 필요한 대부분의 도구와 라이브러리를 포함하고 있습니다. Bun을 패키지 관리자로 사용하여 더 빠른 설치 및 개발 경험을 제공하며, 컴포넌트 구조는 전역 컴포넌트(`src/components/`)와 로컬 컴포넌트(`_components/`)로 명확하게 구분되어 있어 효율적인 개발 워크플로우를 지원합니다. shadcn/ui를 통한 고품질 UI 컴포넌트, 타입스크립트 기반의 안전한 개발 환경, Drizzle ORM을 통한 데이터베이스 관리, tRPC를 통한 타입 안전한 API 등을 제공하여 빠르게 프로젝트를 시작할 수 있게 해줍니다.
