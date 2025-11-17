"use client";

import { useParams, useRouter } from "next/navigation";
import { Button, Card } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

export default function PracticeResultPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const { data: session, isLoading } = trpc.practice.getSession.useQuery({ sessionId });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card variant="elevated" className="max-w-md">
          <p className="text-center text-gray-600">세션을 찾을 수 없습니다.</p>
          <Button
            variant="primary"
            onClick={() => router.push("/practice")}
            className="w-full mt-4"
          >
            연습 목록으로 돌아가기
          </Button>
        </Card>
      </div>
    );
  }

  const items = session.items || [];
  const totalQuestions = items.length;
  const correctCount = items.filter((item) => item.isCorrect).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const timeSpent = session.finishedAt
    ? Math.round(
        (new Date(session.finishedAt).getTime() - new Date(session.createdAt).getTime()) / 60000
      )
    : 0;

  const config = session.configJson;

  // 태그별 정답률 계산
  const tagStats = new Map<string, { correct: number; total: number }>();
  items.forEach((item) => {
    const question = item.question;
    if (question?.tags) {
      question.tags.forEach((tag) => {
        if (!tagStats.has(tag)) {
          tagStats.set(tag, { correct: 0, total: 0 });
        }
        const stats = tagStats.get(tag)!;
        stats.total++;
        if (item.isCorrect) {
          stats.correct++;
        }
      });
    }
  });

  const weakTags = Array.from(tagStats.entries())
    .map(([tag, stats]) => ({
      tag,
      accuracy: Math.round((stats.correct / stats.total) * 100),
      total: stats.total,
    }))
    .filter((t) => t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - 결과 요약 */}
        <Card variant="elevated" className="mb-6 text-center shadow-xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">연습 완료!</h1>
            <p className="text-gray-600">{config.examType || "ADAPTIVE"} · {totalQuestions}문제</p>
          </div>

          <div className="flex justify-center items-center gap-12 mb-6">
            <div>
              <div className="text-6xl font-bold text-primary-600 mb-2">{accuracy}%</div>
              <div className="text-sm text-gray-600">정답률</div>
            </div>
            <div className="h-24 w-px bg-gray-200"></div>
            <div>
              <div className="text-6xl font-bold text-gray-900 mb-2">
                {correctCount}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-600">맞은 문제</div>
            </div>
            <div className="h-24 w-px bg-gray-200"></div>
            <div>
              <div className="text-6xl font-bold text-gray-900 mb-2">{timeSpent}분</div>
              <div className="text-sm text-gray-600">소요 시간</div>
            </div>
          </div>

          {/* 성과 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              {accuracy >= 80
                ? "🎉 훌륭합니다! 매우 좋은 성적이에요!"
                : accuracy >= 60
                ? "👍 잘하셨어요! 조금만 더 노력하면 완벽해요!"
                : "💪 포기하지 마세요! 꾸준히 연습하면 실력이 늘어요!"}
            </p>
          </div>
        </Card>

        {/* 약점 분석 */}
        {weakTags.length > 0 && (
          <Card variant="elevated" className="mb-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">💡 집중해야 할 영역</h2>
            <div className="space-y-3">
              {weakTags.map((item) => (
                <div key={item.tag} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.tag}</span>
                      <span className="text-xs text-gray-500">({item.total}문제)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.accuracy < 40
                            ? "bg-red-500"
                            : item.accuracy < 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${item.accuracy}%` }}
                      />
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <span className="text-lg font-bold text-gray-900">{item.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/notebook">
              <Button variant="outline" className="w-full mt-4">
                오답노트에서 복습하기
              </Button>
            </Link>
          </Card>
        )}

        {/* 문제별 상세 결과 */}
        <Card variant="elevated" className="mb-6 shadow-xl">
          <h2 className="text-xl font-semibold mb-4">문제별 결과</h2>
          <div className="space-y-2">
            {items.map((item, index: number) => {
              const question = item.question;
              const selectedChoice = question?.choices?.find((c) => c.id === item.selectedChoiceId);
              const correctChoice = question?.choices?.find((c) => c.isCorrect);

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 ${
                    item.isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">문제 {index + 1}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {item.isCorrect ? "정답" : "오답"}
                        </span>
                        {question?.tags && question.tags.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {question.tags.join(", ")}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{question?.stem}</p>
                      {!item.isCorrect && (
                        <div className="text-sm">
                          <p className="text-red-700">
                            ❌ 선택: {selectedChoice?.text || "-"}
                          </p>
                          <p className="text-green-700 mt-1">
                            ✅ 정답: {correctChoice?.text || "-"}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      {item.isCorrect ? (
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push("/practice")} className="flex-1">
            연습 목록
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex-1">
            대시보드
          </Button>
          <Button variant="primary" onClick={() => router.push("/practice/new")} className="flex-1">
            다시 연습하기
          </Button>
        </div>
      </div>
    </div>
  );
}
