"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@preptap/ui";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      // Auto sign in after registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/onboarding");
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    registerMutation.mutate({
      email,
      password,
      displayName: displayName || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">PrepTap</h1>
          <p className="text-gray-600">새 계정을 만드세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="이름"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
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
            type="password"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            helperText="최소 8자 이상"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" isLoading={registerMutation.isPending} variant="primary">
            회원가입
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/auth/signin" className="text-primary-600 hover:underline font-medium">
            로그인
          </Link>
        </div>

        <div className="mt-4 text-xs text-center text-gray-500">
          가입하시면{" "}
          <Link href="/terms" className="underline">이용약관</Link>
          {" "}및{" "}
          <Link href="/privacy" className="underline">개인정보처리방침</Link>
          에 동의하는 것으로 간주됩니다.
        </div>
      </Card>
    </div>
  );
}
