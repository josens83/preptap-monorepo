"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";

const EXAM_TYPES = [
  { id: "SUNEUNG", name: "수능" },
  { id: "TOEIC", name: "TOEIC" },
  { id: "TEPS", name: "TEPS" },
  { id: "TOEFL", name: "TOEFL" },
  { id: "IELTS", name: "IELTS" },
];

const SCHOOL_LEVELS = [
  { id: "HIGH", name: "고등학생" },
  { id: "UNIVERSITY", name: "대학생" },
  { id: "GRADUATE", name: "직장인/일반" },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [targetExam, setTargetExam] = useState("");
  const [level, setLevel] = useState("");
  const [targetScore, setTargetScore] = useState("");

  const { data: profile } = trpc.auth.getProfile.useQuery(undefined, {
    enabled: !!session,
  });

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      alert("프로필이 업데이트되었습니다!");
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (profile?.profile) {
      setDisplayName(profile.profile.displayName || "");
      setTargetExam(profile.profile.targetExam || "");
      setLevel(profile.profile.schoolLevel || "");
      setTargetScore(profile.profile.targetScore?.toString() || "");
    }
  }, [profile]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfileMutation.mutate({
      displayName: displayName || undefined,
      targetExam: targetExam as any,
      schoolLevel: level as any,
      targetScore: targetScore ? parseInt(targetScore) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">계정 및 학습 설정을 관리하세요</p>
        </div>

        <div className="space-y-6">
          {/* 계정 정보 */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>계정 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <Input
                    type="email"
                    value={session.user?.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    이메일은 변경할 수 없습니다
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름
                  </label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="홍길동"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 학습 설정 */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>학습 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학력 단계
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {SCHOOL_LEVELS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setLevel(item.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          level === item.id
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{item.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 시험
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXAM_TYPES.map((exam) => (
                      <button
                        key={exam.id}
                        onClick={() => setTargetExam(exam.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          targetExam === exam.id
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <div className="text-sm font-medium">{exam.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목표 점수 (선택사항)
                  </label>
                  <Input
                    type="number"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    placeholder="예: 900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 구독 정보 */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>구독 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {profile?.subscriptions?.[0]?.status === "ACTIVE"
                      ? "Pro 플랜"
                      : "Free 플랜"}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {profile?.subscriptions?.[0]?.status === "ACTIVE"
                      ? "무제한 문제 풀이 및 모든 기능 이용 가능"
                      : "하루 10문제 제한"}
                  </p>
                </div>
                {profile?.subscriptions?.[0]?.status !== "ACTIVE" && (
                  <Button
                    variant="primary"
                    onClick={() => router.push("/pricing")}
                  >
                    업그레이드
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 저장 버튼 */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              isLoading={updateProfileMutation.isPending}
            >
              변경사항 저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
