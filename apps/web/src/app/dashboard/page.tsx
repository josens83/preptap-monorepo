"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Progress, Badge } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!session,
  });

  const { data: overview } = trpc.report.getOverview.useQuery(undefined, {
    enabled: !!session,
  });

  const { data: notebookStats } = trpc.notebook.getStats.useQuery(undefined, {
    enabled: !!session,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  const hasActiveSubscription = profile?.subscriptions?.[0]?.status === "ACTIVE";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
            PrepTap
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/practice" className="text-gray-700 hover:text-primary-600">
              연습하기
            </Link>
            <Link href="/notebook" className="text-gray-700 hover:text-primary-600">
              오답노트
            </Link>
            <Link href="/dashboard/report" className="text-gray-700 hover:text-primary-600">
              리포트
            </Link>
            {!hasActiveSubscription && (
              <Link href="/pricing">
                <Button size="sm">Pro 구독</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {profile?.profile?.displayName || "학생"}님!
          </h1>
          <p className="text-gray-600">
            {profile?.profile?.targetExam
              ? `${profile.profile.targetExam} 시험을 준비하고 있어요.`
              : "시험 목표를 설정하세요."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary-600">
                {overview?.totalSessions || 0}
              </div>
              <p className="text-sm text-gray-600">완료한 세션</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {overview?.accuracy.toFixed(1) || 0}%
              </div>
              <p className="text-sm text-gray-600">정답률</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor((overview?.totalStudyTimeMs || 0) / 60000)}분
              </div>
              <p className="text-sm text-gray-600">학습 시간</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {notebookStats?.totalDue || 0}
              </div>
              <p className="text-sm text-gray-600">복습 대기</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/practice/adaptive">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>적응형 연습</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">내 취약점에 맞춘 문제로 학습하세요</p>
                <Button className="w-full">시작하기</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notebook">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>오답노트 복습</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">틀린 문제를 다시 풀어보세요</p>
                <Button variant="secondary" className="w-full">
                  복습하기
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/practice/mock">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>모의고사</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">실전과 동일한 환경에서 연습하세요</p>
                <Button variant="outline" className="w-full">
                  응시하기
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Weaknesses */}
        {overview?.weaknesses && overview.weaknesses.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>취약 영역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.weaknesses.slice(0, 5).map((weakness) => (
                  <div key={weakness.tag}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{weakness.tag}</span>
                      <span className="text-sm text-gray-600">{weakness.accuracy.toFixed(0)}%</span>
                    </div>
                    <Progress
                      value={weakness.accuracy}
                      variant={weakness.accuracy < 50 ? "danger" : weakness.accuracy < 70 ? "warning" : "success"}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
