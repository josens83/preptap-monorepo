import Link from "next/link";
import { Button } from "@preptap/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/practice">
            <Button variant="outline" size="lg">
              연습하기
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <Link href="/practice" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">✏️</div>
            <h3 className="font-semibold text-gray-900 mb-1">연습하기</h3>
            <p className="text-sm text-gray-600">AI 맞춤 문제로 학습하세요</p>
          </Link>
          <Link href="/notebook" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📖</div>
            <h3 className="font-semibold text-gray-900 mb-1">오답노트</h3>
            <p className="text-sm text-gray-600">틀린 문제를 복습하세요</p>
          </Link>
          <Link href="/reports" className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">리포트</h3>
            <p className="text-sm text-gray-600">학습 현황을 확인하세요</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
