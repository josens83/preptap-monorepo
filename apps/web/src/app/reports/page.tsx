"use client";

import { useState } from "react";
import { Card } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";

type TimeRange = "week" | "month" | "all";

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");

  const { data: overview } = trpc.report.getOverview.useQuery({ days: timeRange === "week" ? 7 : timeRange === "month" ? 30 : 365 });
  const { data: weaknesses } = trpc.report.getWeaknessDetail.useQuery({ limit: 10 });
  const { data: performance } = trpc.report.getPerformanceByExam.useQuery();

  const stats = overview?.stats || { totalSessions: 0, totalQuestions: 0, averageAccuracy: 0, totalStudyMinutes: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">학습 리포트</h1>
            <p className="text-gray-600 mt-2">나의 학습 진척도와 약점을 분석해보세요</p>
          </div>
          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(["week", "month", "all"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-primary-300"
                }`}
              >
                {range === "week" ? "최근 7일" : range === "month" ? "최근 30일" : "전체"}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card variant="bordered">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">총 연습 세션</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </Card>
          <Card variant="bordered">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">푼 문제</p>
              <p className="text-4xl font-bold text-gray-900">{stats.totalQuestions}</p>
            </div>
          </Card>
          <Card variant="bordered">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">평균 정답률</p>
              <p className="text-4xl font-bold text-primary-600">{Math.round(stats.averageAccuracy)}%</p>
            </div>
          </Card>
          <Card variant="bordered">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">총 학습 시간</p>
              <p className="text-4xl font-bold text-gray-900">
                {Math.floor(stats.totalStudyMinutes / 60)}h{" "}
                <span className="text-2xl">{stats.totalStudyMinutes % 60}m</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Performance by Exam Type */}
        {performance && performance.length > 0 && (
          <Card variant="bordered" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">시험 유형별 성적</h2>
            <div className="space-y-4">
              {performance.map((exam) => (
                <div key={exam.examType}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{exam.examType}</span>
                    <span className="text-sm text-gray-600">
                      {exam.totalQuestions}문제 · 평균 {Math.round(exam.averageAccuracy)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        exam.averageAccuracy >= 80
                          ? "bg-green-500"
                          : exam.averageAccuracy >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${exam.averageAccuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weaknesses Analysis */}
        {weaknesses && weaknesses.length > 0 && (
          <Card variant="bordered" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">💡 약점 분석</h2>
            <p className="text-sm text-gray-600 mb-4">
              집중적으로 학습이 필요한 영역입니다
            </p>
            <div className="space-y-4">
              {weaknesses.map((weakness) => {
                const accuracyPercent = Math.round((1 - weakness.score) * 100);
                return (
                  <div key={weakness.tag} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{weakness.tag}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              weakness.score > 0.6
                                ? "bg-red-100 text-red-800"
                                : weakness.score > 0.3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {weakness.score > 0.6 ? "매우 약함" : weakness.score > 0.3 ? "보통" : "양호"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
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
                        <p className="text-xs text-gray-500">
                          예상 정답률: {accuracyPercent}% (최근 업데이트:{" "}
                          {new Date(weakness.updatedAt).toLocaleDateString("ko-KR")})
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-gray-900">{accuracyPercent}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Progress Trend */}
        {overview?.trends && overview.trends.length > 0 && (
          <Card variant="bordered">
            <h2 className="text-xl font-semibold mb-4">📈 학습 추이</h2>
            <div className="space-y-2">
              {overview.trends.map((trend) => (
                <div key={trend.date} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-24">
                    {new Date(trend.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${trend.accuracy}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {Math.round(trend.accuracy)}%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-20 text-right">
                    {trend.questionCount}문제
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {stats.totalSessions === 0 && (
          <Card variant="bordered" className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <p className="text-gray-900 font-medium mb-2">아직 학습 데이터가 없습니다</p>
              <p className="text-gray-600 text-sm">
                연습을 시작하면 여기에 학습 통계가 표시됩니다.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
