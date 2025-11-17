"use client";

import { useEffect } from "react";
import { Button } from "@preptap/ui";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            앗! 문제가 발생했습니다
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            일시적인 오류가 발생했습니다.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            문제가 계속되면 고객 지원팀에 문의해주세요.
          </p>

          {error.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-mono">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            다시 시도
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
