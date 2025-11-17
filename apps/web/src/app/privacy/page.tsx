import Link from "next/link";
import { Button } from "@preptap/ui";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">개인정보처리방침</h1>
          <p className="text-gray-600 mb-8">최종 업데이트: 2024년 11월</p>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              PrepTap(이하 "회사")은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다.
              회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. 수집하는 개인정보 항목 및 수집방법</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">가. 수집항목</h3>
            <p className="text-gray-700 leading-relaxed mb-4">회사는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다:</p>

            <p className="font-semibold text-gray-900 mb-2">필수항목:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>이메일 주소</li>
              <li>비밀번호 (암호화 저장)</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">선택항목:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>이름</li>
              <li>학력 단계</li>
              <li>목표 시험 유형</li>
              <li>목표 점수</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">자동 수집 정보:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>서비스 이용 기록</li>
              <li>접속 로그, IP 주소</li>
              <li>쿠키</li>
              <li>기기 정보</li>
              <li>학습 데이터 (문제 풀이 기록, 정답률, 학습 시간 등)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">나. 수집방법</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>웹사이트 및 모바일 앱을 통한 회원가입</li>
              <li>서비스 이용 과정에서 자동으로 생성되어 수집</li>
              <li>제휴 서비스로부터의 제공</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. 개인정보의 수집 및 이용목적</h2>
            <p className="text-gray-700 leading-relaxed mb-4">회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>

            <p className="font-semibold text-gray-900 mb-2">가. 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>콘텐츠 제공, 특정 맞춤 서비스 제공</li>
              <li>학습 진도 관리 및 분석</li>
              <li>AI 기반 맞춤형 문제 추천</li>
              <li>구매 및 요금 결제, 요금 추심</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">나. 회원관리:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>회원제 서비스 이용에 따른 본인확인</li>
              <li>개인식별, 불량회원의 부정 이용 방지와 비인가 사용 방지</li>
              <li>가입 의사 확인, 연령확인</li>
              <li>불만처리 등 민원처리, 고지사항 전달</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">다. 마케팅 및 광고에 활용:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
              <li>이벤트 및 광고성 정보 제공 및 참여기회 제공</li>
              <li>인구통계학적 특성에 따른 서비스 제공 및 광고 게재</li>
              <li>서비스의 유효성 확인, 접속빈도 파악</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:
            </p>

            <p className="font-semibold text-gray-900 mb-2">가. 회사 내부 방침에 의한 정보보유:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>부정이용기록: 1년 (부정이용 방지)</li>
            </ul>

            <p className="font-semibold text-gray-900 mb-2">나. 관련법령에 의한 정보보유:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
              <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
              <li>표시/광고에 관한 기록: 6개월 (전자상거래법)</li>
              <li>웹사이트 방문기록: 3개월 (통신비밀보호법)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. 개인정보의 파기절차 및 방법</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 파기절차 및 방법은 다음과 같습니다:
            </p>

            <p className="font-semibold text-gray-900 mb-2">가. 파기절차:</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져 내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후 파기됩니다.
            </p>

            <p className="font-semibold text-gray-900 mb-2">나. 파기방법:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>전자적 파일형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.</li>
              <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. 개인정보 제3자 제공</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>이용자들이 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. 개인정보 처리위탁</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>결제 처리: Stripe (결제 처리 및 관리)</li>
              <li>클라우드 서비스: Vercel, AWS (서비스 호스팅 및 데이터 저장)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. 이용자의 권리와 그 행사방법</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며 가입해지를 요청할 수도 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>개인정보 조회/수정: 설정 페이지에서 가능</li>
              <li>회원 탈퇴: 설정 페이지에서 탈퇴 신청</li>
              <li>개인정보 열람 요구: 고객지원 이메일을 통한 요청</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. 개인정보 자동수집 장치의 설치, 운영 및 거부</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 이용자에게 특화된 맞춤서비스를 제공하기 위해서 이용자들의 정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>쿠키의 사용 목적: 이용자의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악</li>
              <li>쿠키 설정 거부 방법: 웹브라우저 상단의 도구 → 인터넷 옵션 → 개인정보에서 설정 가능</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. 개인정보보호책임자</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2"><strong>개인정보보호책임자</strong></p>
              <p className="text-gray-700">이메일: privacy@preptap.com</p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. 개인정보처리방침 변경</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              이 개인정보처리방침은 2024년 11월 17일부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/">
              <Button variant="primary">홈으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
