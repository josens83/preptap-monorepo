"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";

const EXAM_TYPES = [
  { id: "SUNEUNG", name: "수능", icon: "📚" },
  { id: "TOEIC", name: "TOEIC", icon: "💼" },
  { id: "TEPS", name: "TEPS", icon: "🎓" },
  { id: "TOEFL", name: "TOEFL", icon: "🌎" },
  { id: "IELTS", name: "IELTS", icon: "🇬🇧" },
];

const QUESTION_COUNTS = [10, 20, 30, 50];

export default function NewPracticePage() {
  const router = useRouter();
  const [examType, setExamType] = useState("");
  const [questionCount, setQuestionCount] = useState(20);

  const generateMutation = trpc.practice.generateAdaptive.useMutation({
    onSuccess: (data) => {
      router.push(`/practice/${data.id}`);
    },
  });

  const handleStart = () => {
    generateMutation.mutate({
      examType: examType as any,
      questionCount,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-3xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 연습 시작</h1>
          <p className="text-gray-600">AI가 당신의 실력에 맞는 문제를 추천합니다</p>
        </div>

        {/* 시험 유형 선택 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">시험 유형</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {EXAM_TYPES.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setExamType(exam.id)}
                className={`p-4 rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                  examType === exam.id
                    ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                    : "border-gray-200"
                }`}
              >
                <div className="text-3xl mb-2">{exam.icon}</div>
                <div className="text-sm font-medium">{exam.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 문제 수 선택 */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            문제 수: <span className="text-primary-600 font-bold">{questionCount}문제</span>
          </label>
          <div className="flex gap-2">
            {QUESTION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3 rounded-lg border-2 transition-all hover:border-primary-500 ${
                  questionCount === count
                    ? "border-primary-600 bg-primary-50 text-primary-700 font-semibold"
                    : "border-gray-200 text-gray-700"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            추천: 처음에는 10-20문제로 시작해보세요
          </p>
        </div>

        {/* 예상 소요 시간 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-medium">
              예상 소요 시간: 약 {Math.ceil(questionCount * 1.5)}분
            </span>
          </div>
        </div>

        {/* 시작 버튼 */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/practice")}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={!examType || generateMutation.isPending}
            isLoading={generateMutation.isPending}
            className="flex-1"
          >
            연습 시작
          </Button>
        </div>

        {generateMutation.error && (
          <p className="text-sm text-red-600 mt-4 text-center">
            {generateMutation.error.message}
          </p>
        )}
      </Card>
    </div>
  );
}
