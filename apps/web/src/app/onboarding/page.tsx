"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import { EXAM_TYPES, SCHOOL_LEVELS } from "@/lib/constants";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const router = useRouter();

  // Filter school levels for onboarding (skip elementary and middle)
  const onboardingLevels = SCHOOL_LEVELS.filter((level) =>
    ["HIGH", "UNIVERSITY", "ADULT"].includes(level.id)
  );

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const handleComplete = () => {
    updateProfileMutation.mutate({
      schoolLevel: selectedLevel as any,
      targetExam: selectedExam as any,
      targetScore: targetScore ? parseInt(targetScore) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-2xl shadow-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">환영합니다! 🎉</h1>
          <p className="text-gray-600">PrepTap과 함께 영어 실력을 향상시켜보세요</p>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full ${
                  s <= step ? "bg-primary-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">현재 학력 단계를 선택해주세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {onboardingLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setSelectedLevel(level.id);
                    setStep(2);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 ${
                    selectedLevel === level.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-lg font-medium">{level.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">준비하고 있는 시험을 선택해주세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXAM_TYPES.filter((exam) => exam.id !== "CUSTOM").map((exam) => (
                <button
                  key={exam.id}
                  onClick={() => {
                    setSelectedExam(exam.id);
                    setStep(3);
                  }}
                  className={`p-6 rounded-lg border-2 transition-all hover:border-primary-500 hover:bg-primary-50 text-left ${
                    selectedExam === exam.id
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-lg font-medium mb-1">{exam.name}</div>
                  <div className="text-sm text-gray-600">{exam.fullName}</div>
                </button>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                이전
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">목표 점수를 입력해주세요 (선택사항)</h2>
            <input
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              placeholder="예: 900"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="mt-6 flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                이전
              </Button>
              <Button
                variant="primary"
                onClick={handleComplete}
                isLoading={updateProfileMutation.isPending}
                className="flex-1"
              >
                시작하기
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
