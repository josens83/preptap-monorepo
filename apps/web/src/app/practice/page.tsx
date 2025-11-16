"use client";

import { Button, Card } from "@preptap/ui";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function PracticePage() {
  const router = useRouter();
  const { data: sessions, isLoading } = trpc.practice.getRecentSessions.useQuery({ limit: 10 });

  const handleStartPractice = () => {
    router.push("/practice/new");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">연습하기</h1>
            <p className="text-gray-600 mt-2">AI가 추천하는 맞춤형 문제로 실력을 향상시키세요</p>
          </div>
          <Button variant="primary" size="lg" onClick={handleStartPractice}>
            새 연습 시작
          </Button>
        </div>

        {/* 최근 연습 세션 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">최근 연습</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} variant="bordered" className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : sessions && sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((session) => {
                const config = session.configJson as any;
                const totalItems = session._count?.items || 0;
                const correctItems = session.items?.filter((item) => item.isCorrect).length || 0;
                const accuracy = totalItems > 0 ? Math.round((correctItems / totalItems) * 100) : 0;

                return (
                  <Card key={session.id} variant="bordered" className="hover:shadow-md transition-shadow">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="text-sm font-medium text-primary-600">
                            {config.examType || "ADAPTIVE"}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.createdAt).toLocaleDateString("ko-KR")}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            session.finishedAt
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {session.finishedAt ? "완료" : "진행중"}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">{accuracy}%</span>
                          <span className="text-sm text-gray-600">
                            ({correctItems}/{totalItems})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          소요 시간:{" "}
                          {session.finishedAt
                            ? Math.round(
                                (new Date(session.finishedAt).getTime() -
                                  new Date(session.createdAt).getTime()) /
                                  60000
                              ) + "분"
                            : "-"}
                        </p>
                      </div>

                      <Link
                        href={
                          session.finishedAt
                            ? `/practice/${session.id}/result`
                            : `/practice/${session.id}`
                        }
                        className="mt-4"
                      >
                        <Button variant="outline" className="w-full">
                          {session.finishedAt ? "결과 보기" : "이어서 풀기"}
                        </Button>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card variant="bordered" className="text-center py-12">
              <p className="text-gray-500 mb-4">아직 연습 기록이 없습니다</p>
              <Button variant="primary" onClick={handleStartPractice}>
                첫 연습 시작하기
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
