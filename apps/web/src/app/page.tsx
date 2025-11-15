import Link from "next/link";
import { Button } from "@preptap/ui";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-600">PrepTap</div>
        <nav className="flex gap-4">
          <Link href="/pricing" className="text-gray-700 hover:text-primary-600">
            가격
          </Link>
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">
              로그인
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">시작하기</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          기출로 실전감각,
          <br />
          AI로 약점보완.
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          수능·TEPS·TOEIC·TOEFL까지, 매일 내게 맞는 문제만.
          <br />
          적응형 학습으로 빠르게 목표 점수 달성하세요.
        </p>
        <Link href="/onboarding">
          <Button size="lg" className="text-lg px-8 py-4">
            3분 진단 후 시작하기 (무료)
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">기출·예상문제</h3>
            <p className="text-gray-600">
              실제 시험과 동일한 형식의 기출문제와 최신 출제 경향을 반영한 예상문제
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">적응형 학습</h3>
            <p className="text-gray-600">
              AI가 실시간으로 분석한 취약점을 기반으로 나에게 꼭 필요한 문제만 제공
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">오답노트</h3>
            <p className="text-gray-600">
              틀린 문제를 자동으로 수집하고, 유사한 문제로 반복 학습하여 완벽히 이해
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-lg mb-8 opacity-90">
            3분 진단으로 내 실력을 정확히 파악하고, 맞춤형 학습을 시작하세요.
          </p>
          <Link href="/onboarding">
            <Button variant="secondary" size="lg">
              무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 PrepTap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
