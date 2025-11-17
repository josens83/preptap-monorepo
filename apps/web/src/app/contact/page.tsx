"use client";

import { useState } from "react";
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from "@preptap/ui";
import { trpc } from "@/lib/trpc/client";
import Link from "next/link";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.contact.submitContactForm.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name,
      email,
      subject,
      message,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            PrepTap
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              대시보드
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">문의하기</h1>
            <p className="text-xl text-gray-600">
              궁금한 점이 있으신가요? 언제든지 문의해주세요.
            </p>
          </div>

          {submitted ? (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-green-600 text-5xl mb-4">✓</div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    문의가 접수되었습니다
                  </h2>
                  <p className="text-gray-600 mb-6">
                    영업일 기준 24시간 이내에 답변드리겠습니다.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>
                    추가 문의하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Contact Form */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>문의 양식</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      label="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="홍길동"
                    />

                    <Input
                      type="email"
                      label="이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                    />

                    <Input
                      type="text"
                      label="제목"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="문의 제목을 입력해주세요"
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        메시지
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="문의 내용을 자세히 입력해주세요 (최소 10자)"
                      />
                    </div>

                    {contactMutation.error && (
                      <p className="text-sm text-red-600">
                        {contactMutation.error.message}
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      isLoading={contactMutation.isPending}
                    >
                      문의 보내기
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">이메일</h3>
                        <a
                          href="mailto:support@preptap.com"
                          className="text-primary-600 hover:underline"
                        >
                          support@preptap.com
                        </a>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">운영 시간</h3>
                        <p className="text-gray-600 text-sm">
                          평일 09:00 - 18:00
                          <br />
                          (주말 및 공휴일 제외)
                        </p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">응답 시간</h3>
                        <p className="text-gray-600 text-sm">
                          영업일 기준 24시간 이내
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">자주 묻는 질문</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      빠른 답변을 원하시나요? FAQ 페이지를 먼저 확인해보세요.
                    </p>
                    <Link href="/faq">
                      <Button variant="outline" size="sm" className="w-full">
                        FAQ 보기
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
