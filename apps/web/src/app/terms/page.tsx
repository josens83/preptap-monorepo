import Link from "next/link";
import { Button } from "@preptap/ui";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">이용약관</h1>
          <p className="text-gray-600 mb-8">최종 업데이트: 2024년 11월</p>

          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              본 약관은 PrepTap(이하 "회사")이 제공하는 영어 학습 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제2조 (정의)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>"서비스"라 함은 회사가 제공하는 AI 기반 적응형 영어 학습 플랫폼을 의미합니다.</li>
              <li>"이용자"라 함은 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이라 함은 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 정보를 지속적으로 제공받으며, 회사가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.<br />
              2. 회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 회사는 변경사항을 서비스 내 공지사항을 통해 공지합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제4조 (회원가입)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.<br />
              2. 회사는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
              <li>기타 회원으로 등록하는 것이 회사의 기술상 현저히 지장이 있다고 판단되는 경우</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제5조 (서비스의 제공 및 변경)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 회사는 다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>AI 기반 적응형 문제 추천</li>
              <li>기출 및 예상 문제 제공</li>
              <li>오답노트 및 복습 기능</li>
              <li>학습 분석 및 리포트</li>
              <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴 계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제6조 (서비스 이용 시간)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 서비스의 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다.<br />
              2. 회사는 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에 서비스를 일시 중단할 수 있으며, 예정된 작업으로 인한 서비스 일시 중단은 서비스를 통해 사전에 공지합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제7조 (유료서비스)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 회사가 제공하는 유료서비스를 이용하는 경우 이용자는 해당 서비스에 대한 이용요금을 납부하여야 합니다.<br />
              2. 유료서비스의 요금 및 결제 방법은 서비스 내에서 별도로 안내합니다.<br />
              3. 환불 정책은 관련 법령에 따라 별도로 정합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제8조 (개인정보보호)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              회사는 이용자의 개인정보를 보호하기 위하여 정보통신망법 및 개인정보 보호법 등 관계 법령에서 정하는 바를 준수하며, 개인정보 처리방침을 통하여 이용자가 제공하는 개인정보의 수집, 이용 및 제공에 관한 사항을 고지합니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제9조 (회원 탈퇴 및 자격 상실)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 회원은 언제든지 서비스 내 설정을 통해 이용계약 해지 신청을 할 수 있으며, 회사는 관련 법령 등이 정하는 바에 따라 이를 처리합니다.<br />
              2. 회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원 자격을 제한 또는 정지시킬 수 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>가입 신청 시에 허위 내용을 등록한 경우</li>
              <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 질서를 위협하는 경우</li>
              <li>서비스를 이용하여 법령과 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제10조 (면책조항)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.<br />
              2. 회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.<br />
              3. 회사는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖의 서비스를 통하여 얻은 자료로 인한 손해 등에 대하여도 책임을 지지 않습니다.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">제11조 (준거법 및 재판관할)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              1. 회사와 이용자 간 제기된 소송은 대한민국법을 준거법으로 합니다.<br />
              2. 회사와 이용자 간 발생한 분쟁에 관한 소송은 민사소송법 상의 관할법원에 제소합니다.
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
