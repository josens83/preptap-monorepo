"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Progress } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());

  const { data: session, isLoading } = trpc.practice.getSession.useQuery({ sessionId });
  const submitMutation = trpc.practice.submit.useMutation({
    onSuccess: () => {
      router.push(`/practice/${sessionId}/result`);
    },
  });

  const items = session?.items || [];
  const currentItem = items[currentQuestionIndex];
  const question = currentItem?.question;
  const totalQuestions = items.length;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  useEffect(() => {
    // 세션이 이미 완료된 경우 결과 페이지로 리다이렉트
    if (session?.finishedAt) {
      router.push(`/practice/${sessionId}/result`);
    }
  }, [session, sessionId, router]);

  const handleAnswerSelect = (choiceId: string) => {
    setSelectedAnswer(choiceId);
  };

  const handleNext = () => {
    if (selectedAnswer && currentItem) {
      // 답안 저장
      const newAnswers = new Map(answers);
      newAnswers.set(currentItem.id, selectedAnswer);
      setAnswers(newAnswers);

      // 다음 문제로 이동 또는 제출
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        // 다음 문제에 이미 답한 경우 해당 답을 선택 상태로 설정
        const nextItem = items[currentQuestionIndex + 1];
        setSelectedAnswer(newAnswers.get(nextItem.id) || null);
      } else {
        // 모든 문제 완료 - 제출
        handleSubmit(newAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevItem = items[currentQuestionIndex - 1];
      setSelectedAnswer(answers.get(prevItem.id) || null);
    }
  };

  const handleSubmit = (finalAnswers: Map<string, string>) => {
    const submissions = Array.from(finalAnswers.entries()).map(([itemId, choiceId]) => ({
      itemId,
      selectedChoiceId: choiceId,
    }));

    submitMutation.mutate({
      sessionId,
      submissions,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">문제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!session || !question) {
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

  const choices = question.choices || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (confirm("연습을 종료하시겠습니까? 진행 상황은 저장되지 않습니다.")) {
                    router.push("/practice");
                  }
                }}
              >
                나가기
              </Button>
              <span className="text-sm font-medium text-gray-700">
                문제 {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-600">
                {Math.floor((Date.now() - new Date(session.createdAt).getTime()) / 60000)}분 경과
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card variant="elevated" className="mb-6">
          {/* Question Type & Difficulty */}
          <div className="flex justify-between items-center mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {question.type}
            </span>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.floor(question.difficulty * 5) ? "bg-yellow-400" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            {question.passage && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.passage}</p>
              </div>
            )}
            <p className="text-lg font-medium text-gray-900 whitespace-pre-wrap">
              {question.stem}
            </p>
          </div>

          {/* Image/Audio if applicable */}
          {question.imageUrl && (
            <div className="mb-6">
              <img
                src={question.imageUrl}
                alt="Question"
                className="max-w-full rounded-lg border border-gray-200"
              />
            </div>
          )}

          {question.audioUrl && (
            <div className="mb-6">
              <audio controls className="w-full">
                <source src={question.audioUrl} />
              </audio>
            </div>
          )}

          {/* Answer Choices */}
          <div className="space-y-3">
            {choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleAnswerSelect(choice.id)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  selectedAnswer === choice.id
                    ? "border-primary-600 bg-primary-50 ring-2 ring-primary-200"
                    : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === choice.id
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswer === choice.id && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">
                      {String.fromCharCode(65 + index)}.
                    </span>{" "}
                    <span className="text-gray-900">{choice.text}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex-1"
          >
            이전
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!selectedAnswer}
            isLoading={submitMutation.isPending}
            className="flex-1"
          >
            {currentQuestionIndex === totalQuestions - 1 ? "제출하기" : "다음"}
          </Button>
        </div>

        {submitMutation.error && (
          <p className="text-sm text-red-600 mt-4 text-center">
            {submitMutation.error.message}
          </p>
        )}
      </div>
    </div>
  );
}
