import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/Navbar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "PrepTap - AI 기반 적응형 학습 플랫폼",
    template: "%s | PrepTap",
  },
  description:
    "수능, TEPS, TOEIC, TOEFL, IELTS 시험 준비를 위한 AI 기반 적응형 학습 플랫폼. 개인 맞춤형 문제 추천, 실시간 약점 분석, 효율적인 학습 관리로 목표 점수를 달성하세요.",
  keywords: [
    "수능",
    "TEPS",
    "TOEIC",
    "TOEFL",
    "IELTS",
    "영어 시험",
    "적응형 학습",
    "AI 학습",
    "온라인 학습",
    "시험 대비",
    "문제 풀이",
    "영어 공부",
  ],
  authors: [{ name: "PrepTap" }],
  creator: "PrepTap",
  publisher: "PrepTap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PrepTap",
    title: "PrepTap - AI 기반 적응형 학습 플랫폼",
    description:
      "수능, TEPS, TOEIC, TOEFL, IELTS 시험 준비를 위한 AI 기반 적응형 학습 플랫폼",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrepTap - AI 기반 적응형 학습 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepTap - AI 기반 적응형 학습 플랫폼",
    description:
      "수능, TEPS, TOEIC, TOEFL, IELTS 시험 준비를 위한 AI 기반 적응형 학습 플랫폼",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // naver: "your-naver-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
