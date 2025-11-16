"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card } from "@preptap/ui";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">PrepTap</h1>
          <p className="text-gray-600">계정에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" isLoading={isLoading} variant="primary">
            로그인
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="text-primary-600 hover:underline font-medium">
            회원가입
          </Link>
        </div>
      </Card>
    </div>
  );
}
