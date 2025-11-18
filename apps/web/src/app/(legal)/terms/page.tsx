export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">이용약관</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="text-gray-700">
              본 약관은 PrepTap(이하 "회사")가 제공하는 온라인 학습 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제2조 (정의)</h2>
            <p className="text-gray-700 mb-2">본 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>"서비스"라 함은 회사가 제공하는 모든 온라인 학습 콘텐츠 및 관련 서비스를 의미합니다.</li>
              <li>"이용자"라 함은 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
              <li>"회원"이라 함은 회사와 서비스 이용계약을 체결하고 회원 아이디(ID)를 부여받은 자를 말합니다.</li>
              <li>"아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 선정하고 회사가 승인하는 이메일 주소를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
              <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있습니다.</li>
              <li>약관이 변경되는 경우 회사는 변경사항을 시행일자 7일 전부터 서비스 화면에 게시합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제4조 (서비스의 제공)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회사는 다음과 같은 서비스를 제공합니다:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>적응형 학습 문제 제공</li>
                  <li>학습 진도 관리 및 리포팅</li>
                  <li>오답노트 및 복습 기능</li>
                  <li>기타 회사가 추가 개발하거나 제휴 계약 등을 통해 제공하는 일체의 서비스</li>
                </ul>
              </li>
              <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</li>
              <li>회사는 시스템 정기점검, 증설 및 교체 등 불가피한 사유로 서비스가 일시 중단될 수 있으며, 이 경우 사전에 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제5조 (회원가입)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 회원가입 신청을 거부할 수 있습니다:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>타인의 명의를 사용하여 신청한 경우</li>
                  <li>회원정보를 허위로 기재한 경우</li>
                  <li>사회의 안녕과 질서 또는 미풍양속을 저해할 목적으로 신청한 경우</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제6조 (유료서비스)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회사가 제공하는 유료서비스를 이용하는 경우 이용자는 서비스에 대한 이용요금을 납부해야 합니다.</li>
              <li>결제 방법은 신용카드, 계좌이체 등 회사가 제공하는 방법 중에서 선택할 수 있습니다.</li>
              <li>이용요금은 서비스 페이지에 명시된 금액으로 하며, 회사는 이를 사전에 공지한 후 변경할 수 있습니다.</li>
              <li>회원은 구독 중인 서비스를 언제든지 해지할 수 있으며, 이 경우 현재 결제 기간 종료 시까지 서비스를 이용할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제7조 (환불정책)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>구독 서비스는 결제일로부터 7일 이내, 서비스 이용이 없는 경우에 한하여 전액 환불이 가능합니다.</li>
              <li>서비스를 이용한 경우, 남은 기간에 대해 일할 계산하여 환불합니다.</li>
              <li>환불은 결제 수단과 동일한 방법으로 처리되며, 영업일 기준 3~5일 소요됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제8조 (회원의 의무)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회원은 다음 행위를 하여서는 안 됩니다:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>타인의 정보 도용</li>
                  <li>회사가 게시한 정보의 변경</li>
                  <li>회사가 금지한 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                  <li>회사의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위</li>
                  <li>공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형, 음향, 동영상을 전송, 게시, 전자우편 또는 기타의 방법으로 타인에게 유포하는 행위</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제9조 (저작권)</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>회사가 작성한 저작물에 대한 저작권 기타 지적재산권은 회사에 귀속합니다.</li>
              <li>이용자는 서비스를 이용함으로써 얻은 정보 중 회사에게 지적재산권이 귀속된 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">제10조 (분쟁 해결)</h2>
            <p className="text-gray-700">
              서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.
            </p>
          </section>

          <div className="pt-8 border-t mt-8">
            <p className="text-gray-600 text-sm">시행일: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
