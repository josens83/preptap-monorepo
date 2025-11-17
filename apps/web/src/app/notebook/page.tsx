"use client";

import { useState } from "react";
import { Button, Card, Badge } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function NotebookPage() {
  const router = useRouter();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const { data: notebookData, isLoading } = trpc.notebook.get.useQuery({
    tags: selectedTag ? [selectedTag] : undefined,
    limit: 50,
  });

  const { data: stats } = trpc.notebook.getStats.useQuery();

  const generateSimilarMutation = trpc.notebook.generateSimilar.useMutation({
    onSuccess: (session) => {
      router.push(`/practice/${session.id}`);
    },
  });

  const items = notebookData?.items || [];
  const totalWrong = stats?.totalWrong || 0;
  const reviewDueCount = stats?.reviewDue || 0;

  // 태그별 그룹화
  const tagGroups = new Map<string, typeof items>();
  items.forEach((item) => {
    item.question.tags?.forEach((tag) => {
      if (!tagGroups.has(tag)) {
        tagGroups.set(tag, []);
      }
      tagGroups.get(tag)!.push(item);
    });
  });

  const topTags = Array.from(tagGroups.entries())
    .map(([tag, items]) => ({ tag, count: items.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const handleReviewSimilar = () => {
    generateSimilarMutation.mutate({ queueSize: 10 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header & Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">오답노트</h1>
          <p className="text-gray-600">틀린 문제를 복습하고 약점을 보완하세요</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card variant="bordered">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">총 오답 문제</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalWrong}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="bordered">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">복습 필요</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">{reviewDueCount}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            <Card variant="bordered">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">약점 영역</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{topTags.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Tag Filter */}
        {topTags.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">영역별 필터</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === null
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"
                }`}
              >
                전체 ({totalWrong})
              </button>
              {topTags.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag
                      ? "bg-primary-600 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"
                  }`}
                >
                  {tag} ({count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Wrong Questions List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} variant="bordered" className="animate-pulse">
                <div className="h-32 bg-gray-200 rounded"></div>
              </Card>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => {
              const question = item.question;
              const selectedChoice = question.choices?.find((c) => c.id === item.selectedChoiceId);
              const correctChoice = question.choices?.find((c) => c.isCorrect);
              const wrongCount = item.wrongCount || 1;
              const nextReview = item.spacedItem?.nextReview
                ? new Date(item.spacedItem.nextReview)
                : null;
              const isDueForReview =
                nextReview && nextReview.getTime() <= Date.now();

              return (
                <Card key={item.id} variant="bordered" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      {/* Tags & Metadata */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {question.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-xs text-gray-500">
                          {wrongCount}회 오답
                        </span>
                        {isDueForReview && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            복습 필요
                          </span>
                        )}
                      </div>

                      {/* Question */}
                      <p className="text-gray-900 font-medium mb-3">{question.stem}</p>

                      {/* Answer Comparison */}
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-red-700">내 답안</p>
                            <p className="text-sm text-gray-700">{selectedChoice?.text || "-"}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-green-700">정답</p>
                            <p className="text-sm text-gray-700">{correctChoice?.text || "-"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm font-medium text-gray-700 mb-1">📖 해설</p>
                          <p className="text-sm text-gray-600">{question.explanation.text}</p>
                        </div>
                      )}

                      {/* Next Review Date */}
                      {nextReview && !isDueForReview && (
                        <p className="text-xs text-gray-500 mt-3">
                          다음 복습: {nextReview.toLocaleDateString("ko-KR")}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReviewSimilar}
                        isLoading={generateSimilarMutation.isPending}
                      >
                        복습 문제 시작
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card variant="bordered" className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium mb-2">오답이 없습니다!</p>
              <p className="text-gray-600 text-sm mb-4">
                {selectedTag
                  ? `"${selectedTag}" 영역에서 틀린 문제가 없습니다.`
                  : "아직 틀린 문제가 없습니다. 연습을 시작해보세요!"}
              </p>
              <Button variant="primary" onClick={() => router.push("/practice/new")}>
                연습 시작하기
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
