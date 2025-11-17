"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import { EXAM_TYPES, SCHOOL_LEVELS } from "@/lib/constants";

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

  const { data: subscriptionData, refetch: refetchSubscription } =
    trpc.payments.getSubscriptionWithDetails.useQuery(undefined, {
      enabled: !!session,
    });

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      alert("프로필이 업데이트되었습니다!");
    },
  });

  const createBillingPortalMutation = trpc.payments.createBillingPortalSession.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const cancelSubscriptionMutation = trpc.payments.cancelSubscription.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      refetchSubscription();
    },
  });

  const reactivateSubscriptionMutation = trpc.payments.reactivateSubscription.useMutation({
    onSuccess: (data) => {
      alert(data.message);
      refetchSubscription();
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

          {/* 구독 관리 */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>구독 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 현재 플랜 */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">현재 플랜</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xl font-bold text-gray-900">
                        {subscriptionData?.plan?.name || "무료"}
                      </p>
                      {subscriptionData?.subscription && (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscriptionData.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subscriptionData.isActive ? "활성" : "비활성"}
                        </span>
                      )}
                    </div>
                    {subscriptionData?.plan?.price &&
                      subscriptionData.plan.price > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          월 ₩{subscriptionData.plan.price.toLocaleString()}
                        </p>
                      )}
                  </div>

                  {!subscriptionData?.isActive && (
                    <Button
                      variant="primary"
                      onClick={() => router.push("/pricing")}
                    >
                      업그레이드
                    </Button>
                  )}
                </div>

                {/* 구독 상세 정보 */}
                {subscriptionData?.subscription && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">구독 시작일</span>
                      <span className="font-medium">
                        {new Date(
                          subscriptionData.subscription.createdAt
                        ).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    {subscriptionData.subscription.currentPeriodEnd && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">다음 결제일</span>
                        <span className="font-medium">
                          {new Date(
                            subscriptionData.subscription.currentPeriodEnd
                          ).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    )}
                    {subscriptionData.subscription.cancelAtPeriodEnd && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ 구독이 취소 예정입니다.{" "}
                          {subscriptionData.subscription.currentPeriodEnd &&
                            new Date(
                              subscriptionData.subscription.currentPeriodEnd
                            ).toLocaleDateString("ko-KR")}{" "}
                          까지 이용 가능합니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 구독 관리 버튼 */}
                {subscriptionData?.isActive && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => createBillingPortalMutation.mutate()}
                      isLoading={createBillingPortalMutation.isPending}
                      className="flex-1"
                    >
                      결제 수단 관리
                    </Button>

                    {subscriptionData.subscription &&
                    !subscriptionData.subscription.cancelAtPeriodEnd ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (
                            confirm(
                              "구독을 취소하시겠습니까? 현재 기간이 끝날 때까지 서비스를 이용할 수 있습니다."
                            )
                          ) {
                            cancelSubscriptionMutation.mutate();
                          }
                        }}
                        isLoading={cancelSubscriptionMutation.isPending}
                        className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        구독 취소
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => reactivateSubscriptionMutation.mutate()}
                        isLoading={reactivateSubscriptionMutation.isPending}
                        className="flex-1"
                      >
                        구독 재활성화
                      </Button>
                    )}
                  </div>
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
