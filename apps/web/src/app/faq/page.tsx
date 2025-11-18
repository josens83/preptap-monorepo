"use client";

import { useState } from "react";
import { Card, CardContent } from "@preptap/ui";

const faqs = [
  {
    category: "서비스 이용",
    items: [
      {
        q: "PrepTap은 어떤 서비스인가요?",
        a: "PrepTap은 AI 기반 적응형 학습 플랫폼으로, 수능, TOEIC, TEPS, TOEFL, IELTS 등 다양한 시험을 준비하는 학습자를 위한 맞춤형 문제 풀이 서비스입니다. 각 학습자의 수준과 약점을 분석하여 가장 효과적인 학습 경로를 제시합니다.",
      },
      {
        q: "어떤 시험을 지원하나요?",
        a: "현재 수능(대학수학능력시험), TOEIC, TEPS, TOEFL, IELTS를 지원합니다. 각 시험별로 최신 기출문제와 예상문제를 지속적으로 업데이트하고 있습니다.",
      },
      {
        q: "무료 플랜으로 어떤 기능을 사용할 수 있나요?",
        a: "무료 플랜에서는 하루 5문제 풀이, 기본 리포트, 오답노트 기능을 이용하실 수 있습니다. 서비스를 체험해보시고 유료 플랜으로 업그레이드하시면 더 많은 기능을 이용하실 수 있습니다.",
      },
    ],
  },
  {
    category: "결제 및 구독",
    items: [
      {
        q: "요금제는 어떻게 되나요?",
        a: "무료 플랜 외에 베이직(월 9,900원), 프로(월 19,900원), 프리미엄(월 39,900원) 플랜이 있습니다. 각 플랜별로 제공되는 기능과 문제 풀이 횟수가 다르니 요금제 페이지에서 자세히 확인해주세요.",
      },
      {
        q: "언제든지 구독을 취소할 수 있나요?",
        a: "네, 언제든지 구독을 취소하실 수 있습니다. 구독을 취소하셔도 현재 결제 기간이 끝날 때까지는 계속 서비스를 이용하실 수 있습니다.",
      },
      {
        q: "환불 정책은 어떻게 되나요?",
        a: "구독 서비스는 결제일로부터 7일 이내, 서비스 이용이 없는 경우에 한하여 전액 환불이 가능합니다. 서비스를 이용한 경우에는 남은 기간에 대해 일할 계산하여 환불해드립니다.",
      },
      {
        q: "결제 방법은 무엇이 있나요?",
        a: "신용카드, 체크카드로 결제하실 수 있습니다. 모든 결제는 Stripe를 통해 안전하게 처리됩니다.",
      },
    ],
  },
  {
    category: "학습 기능",
    items: [
      {
        q: "적응형 학습은 어떻게 작동하나요?",
        a: "AI가 학습자의 문제 풀이 패턴, 정답률, 취약 영역을 분석하여 가장 적합한 난이도와 유형의 문제를 추천합니다. 계속 학습하실수록 더 정확한 맞춤형 학습이 가능합니다.",
      },
      {
        q: "오답노트는 어떻게 활용하나요?",
        a: "틀린 문제들이 자동으로 오답노트에 저장되며, 간격 반복 학습(Spaced Repetition) 알고리즘에 따라 최적의 시점에 복습 알림을 받으실 수 있습니다.",
      },
      {
        q: "학습 진도는 어떻게 확인하나요?",
        a: "대시보드와 리포트 페이지에서 학습 진도, 정답률, 취약 영역, 학습 시간 등 다양한 통계를 확인하실 수 있습니다.",
      },
    ],
  },
  {
    category: "계정 및 보안",
    items: [
      {
        q: "계정 정보를 어떻게 변경하나요?",
        a: "설정 페이지에서 이름, 학년, 목표 시험 등의 정보를 변경하실 수 있습니다. 이메일 주소 변경을 원하시면 고객지원으로 문의해주세요.",
      },
      {
        q: "비밀번호를 잊어버렸어요.",
        a: "로그인 페이지에서 '비밀번호 찾기'를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.",
      },
      {
        q: "개인정보는 안전하게 보호되나요?",
        a: "네, PrepTap은 개인정보 보호법을 준수하며, 모든 개인정보는 암호화되어 안전하게 보관됩니다. 자세한 내용은 개인정보처리방침을 참고해주세요.",
      },
    ],
  },
  {
    category: "기술 지원",
    items: [
      {
        q: "모바일에서도 사용할 수 있나요?",
        a: "네, PrepTap은 모바일, 태블릿, PC 등 모든 기기에서 최적화되어 작동합니다. 별도의 앱 설치 없이 웹 브라우저에서 바로 이용하실 수 있습니다.",
      },
      {
        q: "오프라인에서도 사용할 수 있나요?",
        a: "현재는 인터넷 연결이 필요합니다. 향후 오프라인 모드 지원을 계획하고 있습니다.",
      },
      {
        q: "문제가 발생했을 때 어디로 문의하나요?",
        a: "support@preptap.com으로 이메일을 보내주시거나, 설정 페이지의 '문의하기'를 통해 문의하실 수 있습니다. 영업일 기준 24시간 이내에 답변드립니다.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<{ [key: string]: number | null }>({});

  const toggleItem = (category: string, index: number) => {
    setOpenIndex((prev) => ({
      ...prev,
      [category]: prev[category] === index ? null : index,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">자주 묻는 질문</h1>
          <p className="text-xl text-gray-600">
            PrepTap 이용에 대한 궁금증을 해결해드립니다
          </p>
        </div>

        <div className="space-y-8">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => toggleItem(section.category, index)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900 flex-1">
                          {item.q}
                        </h3>
                        <span className="text-gray-400 ml-4">
                          {openIndex[section.category] === index ? "−" : "+"}
                        </span>
                      </div>
                      {openIndex[section.category] === index && (
                        <p className="mt-3 text-gray-600 leading-relaxed">
                          {item.a}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            더 궁금한 점이 있으신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            언제든지 문의해주세요. 최대한 빠르게 답변드리겠습니다.
          </p>
          <a
            href="mailto:support@preptap.com"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
