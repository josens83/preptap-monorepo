"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Progress } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";
import { DashboardSkeleton } from "@/components/LoadingSkeletons";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!session,
  });

  const { data: recentSessions } = trpc.practice.getRecentSessions.useQuery(
    { limit: 5 },
    { enabled: !!session }
  );

  const { data: overview } = trpc.report.getOverview.useQuery(
    { days: 7 },
    { enabled: !!session }
  );

  const { data: notebookStats } = trpc.notebook.getStats.useQuery(undefined, {
    enabled: !!session,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return <DashboardSkeleton />;
  }

  const stats = overview?.stats || {
    totalSessions: 0,
    totalQuestions: 0,
    averageAccuracy: 0,
    totalStudyMinutes: 0,
  };

  const weaknesses = overview?.weaknesses?.slice(0, 5) || [];

  const hasActiveSubscription = profile?.subscriptions?.[0]?.status === "ACTIVE";
  const displayName = profile?.profile?.displayName || session.user?.email?.split("@")[0] || "학생";
  const targetExam = profile?.profile?.targetExam;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            안녕하세요, {displayName}님! 👋
          </h1>
          <p className="text-lg text-gray-600">
            {targetExam
              ? `${targetExam} 시험을 준비하고 있어요. 오늘도 함께 화이팅!`
              : "시험 목표를 설정하고 학습을 시작해보세요."}
          </p>
        </div>

        {/* Pro Upgrade Banner */}
        {!hasActiveSubscription && (
          <div className="mb-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Pro로 업그레이드하고 더 많은 기능을!</h2>
                <p className="text-primary-100">
                  무제한 문제 풀이 · 적응형 학습 · 상세 리포트
                </p>
              </div>
              <Link href="/pricing">
                <Button variant="outline" className="bg-white text-primary-600 hover:bg-gray-100">
                  자세히 보기
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="bordered" className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">완료한 세션</p>
                  <div className="text-3xl font-bold text-primary-600">
                    {stats.totalSessions}
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">최근 7일</p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">평균 정답률</p>
                  <div className="text-3xl font-bold text-green-600">
                    {Math.round(stats.averageAccuracy)}%
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stats.totalQuestions}문제 풀이
              </p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">학습 시간</p>
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.floor(stats.totalStudyMinutes / 60)}h{" "}
                    <span className="text-xl">{stats.totalStudyMinutes % 60}m</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">최근 7일</p>
            </CardContent>
          </Card>

          <Card variant="bordered" className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">복습 대기</p>
                  <div className="text-3xl font-bold text-orange-600">
                    {notebookStats?.reviewDue || 0}
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                오답노트 {notebookStats?.totalWrong || 0}개
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/practice/new">
            <Card variant="bordered" className="hover:shadow-lg transition-all cursor-pointer h-full border-2 hover:border-primary-300">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">✏️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">적응형 연습</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI가 내 수준에 맞는 문제를 추천해드려요
                </p>
                <Button variant="primary" className="w-full">
                  시작하기
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/notebook">
            <Card variant="bordered" className="hover:shadow-lg transition-all cursor-pointer h-full border-2 hover:border-primary-300">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">오답노트 복습</h3>
                <p className="text-sm text-gray-600 mb-4">
                  틀린 문제를 완벽하게 마스터하세요
                </p>
                <Button variant="outline" className="w-full">
                  복습하기
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card variant="bordered" className="hover:shadow-lg transition-all cursor-pointer h-full border-2 hover:border-primary-300">
              <CardContent className="pt-6">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">학습 리포트</h3>
                <p className="text-sm text-gray-600 mb-4">
                  내 성장을 한눈에 확인하세요
                </p>
                <Button variant="outline" className="w-full">
                  보러가기
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>최근 연습</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSessions && recentSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentSessions.map((session) => {
                    const config = session.configJson;
                    const totalItems = session._count?.items || 0;
                    const correctItems =
                      session.items?.filter((item) => item.isCorrect).length || 0;
                    const accuracy =
                      totalItems > 0 ? Math.round((correctItems / totalItems) * 100) : 0;

                    return (
                      <Link
                        key={session.id}
                        href={`/practice/${session.id}/result`}
                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-sm font-medium text-primary-600">
                              {config.examType || "ADAPTIVE"}
                            </span>
                            <p className="text-xs text-gray-500">
                              {new Date(session.createdAt).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">{accuracy}%</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {correctItems}/{totalItems} 정답 · {totalItems}문제
                        </p>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">아직 연습 기록이 없습니다</p>
                  <Link href="/practice/new">
                    <Button variant="primary" size="sm">
                      첫 연습 시작하기
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>💡 집중 필요 영역</CardTitle>
            </CardHeader>
            <CardContent>
              {weaknesses && weaknesses.length > 0 ? (
                <div className="space-y-4">
                  {weaknesses.map((weakness) => {
                    const accuracyPercent = Math.round((1 - weakness.score) * 100);
                    return (
                      <div key={weakness.tag}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {weakness.tag}
                          </span>
                          <span className="text-sm text-gray-600">{accuracyPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              accuracyPercent >= 80
                                ? "bg-green-500"
                                : accuracyPercent >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${accuracyPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <Link href="/reports">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      전체 분석 보기
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>데이터를 수집하는 중입니다</p>
                  <p className="text-sm mt-2">문제를 풀면 약점 분석이 표시됩니다</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
