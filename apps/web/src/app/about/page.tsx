import Link from "next/link";
import { Button, Card } from "@preptap/ui";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            PrepTap 소개
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            AI 기술로 누구나 효율적으로 목표를 달성할 수 있도록 돕습니다
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🎯
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">우리의 미션</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                PrepTap은 <strong>모든 학습자가 자신의 목표를 효율적으로 달성</strong>할 수 있도록 돕습니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                전통적인 학습 방법은 모든 학생에게 동일한 콘텐츠를 제공합니다.
                하지만 우리는 AI 기술을 활용하여 각 학습자의 수준과 약점을 실시간으로 분석하고,
                가장 필요한 문제만을 제공합니다. 이를 통해 학습 시간은 줄이고 성과는 높입니다.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                🚀
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">우리의 비전</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                <strong>데이터 기반 맞춤형 학습</strong>이 당연한 세상을 만듭니다.
              </p>
              <p className="text-gray-600 leading-relaxed">
                우리는 AI와 학습 과학을 결합하여, 모든 사람이 자신만의 최적화된 학습 경로를
                가질 수 있는 미래를 그립니다. PrepTap은 단순한 문제 풀이 플랫폼을 넘어,
                학습자의 성장을 데이터로 추적하고 지속적으로 개선하는 스마트 학습 파트너가 되고자 합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              PrepTap의 시작
            </h2>
            <p className="text-xl text-gray-600">
              왜 PrepTap을 만들었을까요?
            </p>
          </div>

          <Card variant="elevated" className="p-8 md:p-12">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                PrepTap은 <strong>"왜 똑같은 시간을 공부해도 결과는 다를까?"</strong>라는
                질문에서 시작되었습니다.
              </p>
              <p>
                많은 학생들이 같은 교재로, 같은 시간을 공부하지만 결과는 천차만별입니다.
                그 이유는 각자의 <strong>약점이 다르고</strong>, <strong>학습 패턴이 다르기</strong> 때문입니다.
                하지만 기존의 학습 도구들은 이를 고려하지 않고 모두에게 동일한 콘텐츠를 제공했습니다.
              </p>
              <p>
                우리는 이 문제를 AI 기술로 해결하고자 했습니다.
                학습자의 모든 풀이 기록을 분석하여, <strong>가장 약한 영역</strong>을 찾아내고,
                <strong>최적의 난이도</strong>로 문제를 추천합니다.
                마치 개인 과외 선생님처럼 말이죠.
              </p>
              <p>
                2024년, 수많은 학습자와 교육 전문가들의 피드백을 받아 PrepTap을 탄생시켰습니다.
                지금도 우리는 매일 데이터를 분석하며, 더 나은 학습 경험을 만들기 위해 노력하고 있습니다.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              핵심 가치
            </h2>
            <p className="text-xl text-gray-600">
              PrepTap이 지키는 원칙들
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                📊
              </div>
              <h3 className="text-xl font-semibold mb-3">데이터 기반 의사결정</h3>
              <p className="text-gray-600 leading-relaxed">
                모든 기능은 실제 학습 데이터와 과학적 연구를 기반으로 설계됩니다.
                추측이 아닌 증거로 학습 경험을 개선합니다.
              </p>
            </Card>

            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-3">학습자 중심</h3>
              <p className="text-gray-600 leading-relaxed">
                화려한 기능보다 학습자에게 실질적인 도움이 되는지를 최우선으로 고려합니다.
                사용자의 성장이 우리의 성공입니다.
              </p>
            </Card>

            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🔄
              </div>
              <h3 className="text-xl font-semibold mb-3">지속적인 개선</h3>
              <p className="text-gray-600 leading-relaxed">
                완벽한 제품은 없습니다. 사용자 피드백을 수집하고,
                빠르게 실험하며, 매일 조금씩 더 나은 서비스를 만듭니다.
              </p>
            </Card>

            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🤝
              </div>
              <h3 className="text-xl font-semibold mb-3">투명성과 신뢰</h3>
              <p className="text-gray-600 leading-relaxed">
                AI가 어떻게 작동하는지, 데이터가 어떻게 사용되는지 투명하게 공개합니다.
                신뢰는 모든 관계의 기초입니다.
              </p>
            </Card>

            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-3">효율성</h3>
              <p className="text-gray-600 leading-relaxed">
                학습 시간은 유한합니다. 불필요한 반복을 줄이고,
                가장 효과적인 방법으로 목표에 도달하도록 돕습니다.
              </p>
            </Card>

            <Card variant="bordered" className="text-center p-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                🌍
              </div>
              <h3 className="text-xl font-semibold mb-3">접근성</h3>
              <p className="text-gray-600 leading-relaxed">
                누구나 언제 어디서든 양질의 학습 경험을 누릴 수 있어야 합니다.
                기술의 혜택은 모두에게 평등해야 합니다.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              기술 스택
            </h2>
            <p className="text-xl text-gray-600">
              최신 기술로 최고의 학습 경험을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="bordered">
              <h3 className="text-lg font-semibold mb-3">🤖 AI & Machine Learning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                적응형 알고리즘으로 실시간 난이도 조절,
                협업 필터링으로 유사 학습자 패턴 분석,
                자연어 처리로 문제 자동 태깅
              </p>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold mb-3">🧠 Learning Science</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                SM-2 알고리즘 기반 간격 반복 학습,
                망각 곡선을 고려한 복습 스케줄링,
                인지 부하 이론 기반 UI/UX 설계
              </p>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold mb-3">⚡ Modern Web Stack</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Next.js 14 App Router로 빠른 페이지 로딩,
                TypeScript로 안정적인 코드베이스,
                Tailwind CSS로 일관된 디자인
              </p>
            </Card>

            <Card variant="bordered">
              <h3 className="text-lg font-semibold mb-3">🔒 Security & Privacy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                OAuth 2.0 기반 안전한 인증,
                개인정보 암호화 저장,
                PIPA/GDPR 준수
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            PrepTap과 함께 성장하세요
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            지금 바로 시작하고, 효율적인 학습의 차이를 경험해보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
              >
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                문의하기
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
