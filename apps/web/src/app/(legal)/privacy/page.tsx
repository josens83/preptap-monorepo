export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <p className="text-gray-700 mb-4">
              PrepTap(이하 "회사")는 이용자의 개인정보를 중요시하며, "개인정보 보호법", "정보통신망 이용촉진 및 정보보호 등에 관한 법률" 등 관련 법규를 준수하고 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. 수집하는 개인정보 항목</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2">가. 회원가입 시 수집항목</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>필수항목: 이메일 주소, 비밀번호, 이름</li>
                  <li>선택항목: 학년, 목표 시험, 연락처</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">나. 서비스 이용 시 수집항목</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>학습 기록 (문제 풀이 내역, 정답률, 학습 시간 등)</li>
                  <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                  <li>기기 정보 (OS, 브라우저 종류 등)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">다. 결제 시 수집항목</h3>
                <ul className="list-disc list-inside ml-4">
                  <li>신용카드 정보 (카드번호, 유효기간 등은 PG사에서 처리)</li>
                  <li>결제 내역, 영수증 정보</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. 개인정보의 수집 및 이용목적</h2>
            <div className="space-y-3 text-gray-700">
              <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>회원 관리
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>회원제 서비스 제공, 개인 식별, 불량회원 부정 이용 방지</li>
                    <li>가입 의사 확인, 연령 확인, 분쟁 조정을 위한 기록 보존</li>
                  </ul>
                </li>
                <li>서비스 제공
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>학습 콘텐츠 제공, 맞춤형 학습 서비스</li>
                    <li>학습 진도 관리 및 통계 분석</li>
                    <li>청구서 발송, 요금 결제</li>
                  </ul>
                </li>
                <li>마케팅 및 광고 활용
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                    <li>이벤트 및 광고성 정보 제공 (동의한 경우에 한함)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <div className="space-y-3 text-gray-700">
              <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>회원 탈퇴 시
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>보존 항목: 이메일, 이름, 학습 기록</li>
                    <li>보존 근거: 서비스 부정이용 방지</li>
                    <li>보존 기간: 탈퇴일로부터 30일</li>
                  </ul>
                </li>
                <li>관련 법령에 의한 정보보유
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래법)</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래법)</li>
                    <li>접속에 관한 기록: 3개월 (통신비밀보호법)</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
            <p className="text-gray-700">
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ol className="list-decimal list-inside ml-4 mt-3 space-y-2 text-gray-700">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. 개인정보 처리위탁</h2>
            <p className="text-gray-700 mb-3">
              회사는 서비스 향상을 위해 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라 위탁계약 시 개인정보가 안전하게 관리될 수 있도록 규정하고 있습니다:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">수탁업체</th>
                    <th className="py-2">위탁 업무 내용</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b">
                    <td className="py-2">Vercel</td>
                    <td className="py-2">서비스 호스팅 및 운영</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Stripe</td>
                    <td className="py-2">결제 처리</td>
                  </tr>
                  <tr>
                    <td className="py-2">AWS/Supabase</td>
                    <td className="py-2">데이터 저장 및 관리</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. 이용자의 권리</h2>
            <div className="space-y-3 text-gray-700">
              <p>이용자 및 법정대리인은 언제든지 다음의 권리를 행사할 수 있습니다:</p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정, 삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>회원 탈퇴 (동의 철회)</li>
              </ol>
              <p className="mt-3">
                위 권리 행사는 설정 페이지를 통해 직접 하실 수 있으며, 서면, 전화, 이메일 등을 통해서도 가능합니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. 개인정보 자동 수집 장치의 설치·운영 및 거부</h2>
            <div className="space-y-3 text-gray-700">
              <p>회사는 이용자에게 특화된 맞춤서비스를 제공하기 위해 쿠키(Cookie)를 사용합니다.</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>쿠키의 사용 목적: 이용자의 접속 빈도나 방문 시간 등을 분석, 이용자의 취향과 관심분야를 파악하여 서비스 개선</li>
                <li>쿠키 설정 거부 방법: 웹 브라우저 옵션 설정을 통해 쿠키 허용/차단 가능</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. 개인정보 보호책임자</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다:</p>
              <div className="mt-4 space-y-1 text-gray-700">
                <p><span className="font-semibold">성명:</span> 개인정보보호책임자</p>
                <p><span className="font-semibold">직책:</span> CTO</p>
                <p><span className="font-semibold">이메일:</span> privacy@preptap.com</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. 개인정보 처리방침 변경</h2>
            <p className="text-gray-700">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
          </section>

          <div className="pt-8 border-t mt-8">
            <p className="text-gray-600 text-sm">공고일자: 2024년 1월 1일</p>
            <p className="text-gray-600 text-sm">시행일자: 2024년 1월 1일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
