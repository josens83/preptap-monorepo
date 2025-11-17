import Link from "next/link";
import { Button } from "@preptap/ui";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
              ✨ AI 적응형 학습으로 최단기 목표 달성
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              기출로 실전감각,
              <br />
              <span className="text-primary-600">AI로 약점보완</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              수능·TEPS·TOEIC·TOEFL까지, 매일 내게 맞는 문제만.
              <br />
              적응형 학습으로 빠르게 목표 점수 달성하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signup">
                <Button size="lg" variant="primary" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
                  무료로 시작하기 →
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  요금제 보기
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              💳 신용카드 등록 없이 무료로 시작 · 언제든 취소 가능
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <p className="text-gray-600">누적 학습자</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">50,000+</div>
              <p className="text-gray-600">기출·예상문제</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <p className="text-gray-600">학습 만족도</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <p className="text-gray-600">언제든 학습 가능</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              PrepTap이 특별한 이유
            </h2>
            <p className="text-xl text-gray-600">
              단순히 문제만 푸는 것이 아닙니다. 과학적인 학습 방법론을 적용합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📚
              </div>
              <h3 className="text-xl font-semibold mb-3">실전과 동일한 기출문제</h3>
              <p className="text-gray-600 leading-relaxed">
                실제 시험과 동일한 형식의 기출문제와 최신 출제 경향을 반영한 예상문제로 실전 감각을 키워보세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-3">AI 적응형 학습</h3>
              <p className="text-gray-600 leading-relaxed">
                AI가 실시간으로 분석한 취약점을 기반으로 나에게 꼭 필요한 문제만 제공하여 효율적으로 학습하세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📝
              </div>
              <h3 className="text-xl font-semibold mb-3">스마트 오답노트</h3>
              <p className="text-gray-600 leading-relaxed">
                틀린 문제를 자동으로 수집하고, 유사한 문제로 반복 학습하여 완벽하게 마스터할 수 있습니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🔄
              </div>
              <h3 className="text-xl font-semibold mb-3">간격 반복 학습</h3>
              <p className="text-gray-600 leading-relaxed">
                과학적으로 입증된 SM-2 알고리즘으로 최적의 복습 시기를 알려드려 장기 기억으로 정착시킵니다.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-3">상세한 학습 분석</h3>
              <p className="text-gray-600 leading-relaxed">
                내 학습 패턴과 성취도를 한눈에 파악하고, 데이터 기반의 개선 방향을 제시받으세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-3xl mb-4">
                🎓
              </div>
              <h3 className="text-xl font-semibold mb-3">모든 시험 대비</h3>
              <p className="text-gray-600 leading-relaxed">
                수능, TEPS, TOEIC, TOEFL, IELTS 등 주요 영어 시험을 한 곳에서 준비할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              3단계로 시작하는 맞춤형 학습
            </h2>
            <p className="text-xl text-gray-600">
              복잡한 설정 없이 바로 시작할 수 있습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">진단 평가</h3>
              <p className="text-gray-600">
                간단한 진단 평가로 현재 실력과 목표를 설정합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI 문제 추천</h3>
              <p className="text-gray-600">
                AI가 내 수준과 약점에 맞는 문제를 자동으로 선별합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">지속적인 성장</h3>
              <p className="text-gray-600">
                실시간 피드백과 분석으로 꾸준히 실력을 향상시킵니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              실제 사용자들의 생생한 후기
            </h2>
            <p className="text-xl text-gray-600">
              PrepTap으로 목표를 달성한 학습자들의 이야기
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👨‍🎓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">김준호</div>
                  <div className="text-sm text-gray-600">TEPS 500 → 730</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "AI가 내 약점을 정확히 찾아내고 필요한 문제만 추천해줘서 3개월 만에 230점이나 올랐어요.
                특히 오답노트 기능이 정말 유용했습니다!"
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👩‍💼
                </div>
                <div>
                  <div className="font-semibold text-gray-900">이서연</div>
                  <div className="text-sm text-gray-600">TOEIC 650 → 900</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "직장인이라 시간이 부족했는데, PrepTap은 짧은 시간에도 효율적으로 학습할 수 있어서 좋았어요.
                출퇴근 시간에만 풀어도 점수가 확 올랐습니다."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👨‍🏫
                </div>
                <div>
                  <div className="font-semibold text-gray-900">박민수</div>
                  <div className="text-sm text-gray-600">수능 영어 3등급 → 1등급</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "문제만 많이 푸는 게 아니라 내가 약한 부분을 집중적으로 학습할 수 있어서 좋았어요.
                학습 리포트로 진척도를 확인하니 동기부여도 됐습니다."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👩‍🎓
                </div>
                <div>
                  <div className="font-semibold text-gray-900">최지은</div>
                  <div className="text-sm text-gray-600">TOEFL 70 → 95</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "유학 준비하면서 여러 앱을 써봤는데 PrepTap이 가장 체계적이었어요.
                간격 반복 학습 덕분에 한번 공부한 내용이 오래 기억에 남았습니다."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👨‍💻
                </div>
                <div>
                  <div className="font-semibold text-gray-900">정현우</div>
                  <div className="text-sm text-gray-600">TOEIC 800 → 950</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "개발자라서 데이터 기반 접근이 마음에 들었어요.
                내 학습 패턴을 분석해서 최적화된 문제를 주는 게 신기하고 효과적이었습니다."
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-xl mr-3">
                  👩‍🔬
                </div>
                <div>
                  <div className="font-semibold text-gray-900">강수진</div>
                  <div className="text-sm text-gray-600">IELTS 6.0 → 7.5</div>
                </div>
              </div>
              <div className="text-yellow-500 mb-3">★★★★★</div>
              <p className="text-gray-700 leading-relaxed">
                "IELTS 준비하면서 가장 힘들었던 게 약점 파악이었는데,
                PrepTap이 자동으로 분석해줘서 집중해야 할 부분이 명확했어요. 목표 점수 달성했습니다!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            무료 플랜으로 PrepTap의 모든 기능을 체험해보세요.
            <br />
            신용카드 등록 없이 바로 시작할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                요금제 보기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">PrepTap</h3>
              <p className="text-sm leading-relaxed">
                AI 기반 적응형 학습으로 영어 시험을 효율적으로 준비하세요.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/practice" className="hover:text-white">연습하기</Link></li>
                <li><Link href="/notebook" className="hover:text-white">오답노트</Link></li>
                <li><Link href="/reports" className="hover:text-white">리포트</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">정보</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/pricing" className="hover:text-white">요금제</Link></li>
                <li><Link href="/about" className="hover:text-white">소개</Link></li>
                <li><Link href="/blog" className="hover:text-white">블로그</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">법적 정보</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 PrepTap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
