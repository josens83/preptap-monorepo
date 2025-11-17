"use client";

import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@preptap/ui";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const createCheckoutMutation = trpc.payments.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
  });

  const handleSubscribe = (plan: "BASIC" | "PRO" | "PREMIUM") => {
    if (!session) {
      router.push("/auth/signup");
      return;
    }

    createCheckoutMutation.mutate({ plan });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            PrepTap
          </Link>
          <Link href={session ? "/dashboard" : "/auth/signin"}>
            <Button variant="outline" size="sm">
              {session ? "대시보드" : "로그인"}
            </Button>
          </Link>
        </div>
      </header>

      {/* Pricing */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">요금제</h1>
          <p className="text-xl text-gray-600">
            목표에 맞는 플랜을 선택하세요
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Free */}
          <Card>
            <CardHeader>
              <CardTitle>무료</CardTitle>
              <div className="text-3xl font-bold mt-4">₩0</div>
              <p className="text-gray-600">영원히 무료</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>일 5문제 풀이</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>기본 리포트</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>오답노트</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" className="w-full">
                  시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Basic */}
          <Card>
            <CardHeader>
              <CardTitle>베이직</CardTitle>
              <div className="text-3xl font-bold mt-4">₩9,900</div>
              <p className="text-gray-600">월 구독</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>일 30문제 풀이</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>상세 리포트</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>오답노트 무제한</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>약점 분석</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("BASIC")}
                isLoading={createCheckoutMutation.isPending}
              >
                구독하기
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-2 border-primary-500">
            <div className="absolute top-0 right-0 m-4">
              <Badge variant="info">인기</Badge>
            </div>
            <CardHeader>
              <CardTitle>프로</CardTitle>
              <div className="text-3xl font-bold mt-4">₩19,900</div>
              <p className="text-gray-600">월 구독</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>무제한 문제 풀이</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>고급 리포트</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>AI 약점 보완</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>적응형 학습</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>스터디 그룹</span>
                </li>
              </ul>
              <Button
                className="w-full"
                onClick={() => handleSubscribe("PRO")}
                isLoading={createCheckoutMutation.isPending}
              >
                구독하기
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card>
            <div className="absolute top-0 right-0 m-4">
              <Badge variant="success">최고급</Badge>
            </div>
            <CardHeader>
              <CardTitle>프리미엄</CardTitle>
              <div className="text-3xl font-bold mt-4">₩39,900</div>
              <p className="text-gray-600">월 구독</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Pro의 모든 기능</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>1:1 멘토링 (월 2회)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>모의고사 무제한</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>우선 지원</span>
                </li>
              </ul>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => handleSubscribe("PREMIUM")}
                isLoading={createCheckoutMutation.isPending}
              >
                구독하기
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">자주 묻는 질문</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">언제든 구독을 취소할 수 있나요?</h3>
                <p className="text-gray-600">
                  네, 언제든지 구독을 취소할 수 있습니다. 현재 결제 기간이 끝날 때까지 서비스를 이용할 수 있습니다.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">어떤 시험을 지원하나요?</h3>
                <p className="text-gray-600">
                  수능, TEPS, TOEIC, TOEFL, IELTS를 지원합니다. 각 시험별로 최신 기출 및 예상문제를 제공합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
