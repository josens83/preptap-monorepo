"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<
    "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | undefined
  >(undefined);

  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!session,
    retry: false,
  });

  const { data: contactsData, refetch: refetchContacts } = trpc.admin.getAllContacts.useQuery(
    { status: selectedStatus, limit: 50, offset: 0 },
    { enabled: !!session, retry: false }
  );

  const updateStatusMutation = trpc.admin.updateContactStatus.useMutation({
    onSuccess: () => {
      refetchContacts();
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // 관리자 권한이 없는 경우
  if (!stats && contactsData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">접근 권한 없음</h2>
              <p className="text-gray-600 mb-6">관리자 권한이 필요한 페이지입니다.</p>
              <Button onClick={() => router.push("/dashboard")}>대시보드로 돌아가기</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    RESOLVED: "bg-green-100 text-green-800",
    CLOSED: "bg-gray-100 text-gray-800",
  };

  const statusLabels: Record<string, string> = {
    NEW: "신규",
    IN_PROGRESS: "처리중",
    RESOLVED: "해결됨",
    CLOSED: "종료",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
          <p className="text-lg text-gray-600">서비스 통계 및 문의 관리</p>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card variant="bordered">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">전체 사용자</p>
                    <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  최근 7일: +{stats.newUsersLast7Days}명
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">활성 구독</p>
                    <div className="text-3xl font-bold text-green-600">
                      {stats.activeSubscriptions}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">유료 사용자</p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">총 연습 세션</p>
                    <div className="text-3xl font-bold text-purple-600">{stats.totalSessions}</div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{stats.totalQuestions}개 문제 풀이</p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">신규 문의</p>
                    <div className="text-3xl font-bold text-orange-600">
                      {stats.newContactsCount}
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">처리 대기 중</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 문의 관리 */}
        <Card variant="bordered">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>문의 관리</CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={selectedStatus === undefined ? "primary" : "outline"}
                  onClick={() => setSelectedStatus(undefined)}
                >
                  전체
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === "NEW" ? "primary" : "outline"}
                  onClick={() => setSelectedStatus("NEW")}
                >
                  신규
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === "IN_PROGRESS" ? "primary" : "outline"}
                  onClick={() => setSelectedStatus("IN_PROGRESS")}
                >
                  처리중
                </Button>
                <Button
                  size="sm"
                  variant={selectedStatus === "RESOLVED" ? "primary" : "outline"}
                  onClick={() => setSelectedStatus("RESOLVED")}
                >
                  해결됨
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {contactsData && contactsData.contacts.length > 0 ? (
              <div className="space-y-4">
                {contactsData.contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.subject}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {contact.name} ({contact.email})
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
                        {statusLabels[contact.status]}
                      </span>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{contact.message}</p>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        {new Date(contact.createdAt).toLocaleString("ko-KR")}
                      </p>
                      <div className="flex gap-2">
                        {contact.status === "NEW" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                contactId: contact.id,
                                status: "IN_PROGRESS",
                              })
                            }
                            isLoading={updateStatusMutation.isPending}
                          >
                            처리 시작
                          </Button>
                        )}
                        {contact.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                contactId: contact.id,
                                status: "RESOLVED",
                              })
                            }
                            isLoading={updateStatusMutation.isPending}
                          >
                            해결 완료
                          </Button>
                        )}
                        {contact.status === "RESOLVED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                contactId: contact.id,
                                status: "CLOSED",
                              })
                            }
                            isLoading={updateStatusMutation.isPending}
                          >
                            종료
                          </Button>
                        )}
                        <a href={`mailto:${contact.email}`}>
                          <Button size="sm" variant="outline">
                            답변하기
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                <p className="text-sm text-gray-500 text-center mt-4">
                  총 {contactsData.total}개의 문의
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>문의가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
