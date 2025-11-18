import nodemailer from "nodemailer";
import { env } from "./env";

// SMTP 전송기 생성
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * 이메일 전송 함수
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    // SMTP 설정이 없으면 콘솔에만 출력
    if (!env.SMTP_USER || !env.SMTP_PASSWORD) {
      console.log("📧 이메일 전송 (SMTP 미설정):");
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      return { success: true, messageId: "dev-mode" };
    }

    const info = await transporter.sendMail({
      from: env.EMAIL_FROM || '"PrepTap" <noreply@preptap.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("✅ 이메일 전송 성공:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ 이메일 전송 실패:", error);
    return { success: false, error };
  }
}

/**
 * 회원가입 환영 이메일
 */
export async function sendWelcomeEmail(to: string, name: string) {
  const subject = "PrepTap에 오신 것을 환영합니다! 🎉";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">PrepTap</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">AI 기반 적응형 학습 플랫폼</p>
          </div>
          <div class="content">
            <h2>안녕하세요, ${name || "회원"}님! 👋</h2>
            <p>PrepTap 회원이 되신 것을 진심으로 환영합니다.</p>
            <p>PrepTap은 AI 기반 적응형 학습 시스템으로 여러분의 약점을 정확히 분석하고, 맞춤형 학습 경로를 제공합니다.</p>

            <h3>🎯 시작하기</h3>
            <ol>
              <li><strong>진단 평가</strong>: 현재 실력을 정확히 파악합니다</li>
              <li><strong>맞춤 학습</strong>: AI가 추천하는 문제를 풀어보세요</li>
              <li><strong>약점 보완</strong>: 틀린 문제를 복습하고 완벽하게 이해하세요</li>
              <li><strong>실력 향상</strong>: 꾸준한 학습으로 목표를 달성하세요</li>
            </ol>

            <div style="text-align: center;">
              <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                대시보드로 이동
              </a>
            </div>

            <h3>💡 도움이 필요하신가요?</h3>
            <ul>
              <li><a href="${env.NEXT_PUBLIC_APP_URL}/faq">자주 묻는 질문</a></li>
              <li><a href="${env.NEXT_PUBLIC_APP_URL}/contact">문의하기</a></li>
              <li>이메일: support@preptap.com</li>
            </ul>

            <p>PrepTap과 함께 목표를 달성하시길 바랍니다!</p>
            <p>감사합니다.<br>PrepTap 팀 드림</p>
          </div>
          <div class="footer">
            <p>이 이메일은 PrepTap 회원가입 시 자동으로 발송되었습니다.</p>
            <p>© 2025 PrepTap. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
안녕하세요, ${name || "회원"}님!

PrepTap 회원이 되신 것을 진심으로 환영합니다.

PrepTap은 AI 기반 적응형 학습 시스템으로 여러분의 약점을 정확히 분석하고, 맞춤형 학습 경로를 제공합니다.

시작하기:
1. 진단 평가: 현재 실력을 정확히 파악합니다
2. 맞춤 학습: AI가 추천하는 문제를 풀어보세요
3. 약점 보완: 틀린 문제를 복습하고 완벽하게 이해하세요
4. 실력 향상: 꾸준한 학습으로 목표를 달성하세요

대시보드: ${env.NEXT_PUBLIC_APP_URL}/dashboard

도움이 필요하신가요?
- FAQ: ${env.NEXT_PUBLIC_APP_URL}/faq
- 문의: ${env.NEXT_PUBLIC_APP_URL}/contact
- 이메일: support@preptap.com

감사합니다.
PrepTap 팀 드림
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * 결제 성공 이메일
 */
export async function sendPaymentSuccessEmail(
  to: string,
  name: string,
  plan: string,
  amount: number
) {
  const planNames: Record<string, string> = {
    BASIC: "베이직",
    PRO: "프로",
    PREMIUM: "프리미엄",
  };

  const subject = `${planNames[plan] || plan} 구독이 시작되었습니다 🎉`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .receipt { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <h1 style="margin: 0; font-size: 28px;">결제가 완료되었습니다</h1>
          </div>
          <div class="content">
            <h2>안녕하세요, ${name || "회원"}님!</h2>
            <p>${planNames[plan] || plan} 플랜 구독이 정상적으로 완료되었습니다.</p>

            <div class="receipt">
              <h3 style="margin-top: 0;">결제 내역</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>플랜</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${planNames[plan] || plan}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>금액</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">₩${amount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>결제 주기</strong></td>
                  <td style="padding: 8px 0; text-align: right;">월간 구독</td>
                </tr>
              </table>
            </div>

            <p><strong>이제 ${planNames[plan]} 플랜의 모든 기능을 사용하실 수 있습니다!</strong></p>

            <div style="text-align: center;">
              <a href="${env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">
                학습 시작하기
              </a>
            </div>

            <h3>📋 구독 관리</h3>
            <p>구독을 관리하시려면 계정 설정에서 구독 정보를 확인하실 수 있습니다.</p>
            <ul>
              <li>구독 취소 및 재활성화</li>
              <li>결제 수단 변경</li>
              <li>영수증 다운로드</li>
            </ul>

            <p>문의사항이 있으시면 언제든지 <a href="${env.NEXT_PUBLIC_APP_URL}/contact">문의하기</a>를 이용해주세요.</p>

            <p>감사합니다.<br>PrepTap 팀 드림</p>
          </div>
          <div class="footer">
            <p>이 이메일은 결제 완료 시 자동으로 발송되었습니다.</p>
            <p>© 2025 PrepTap. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
안녕하세요, ${name || "회원"}님!

${planNames[plan] || plan} 플랜 구독이 정상적으로 완료되었습니다.

결제 내역:
- 플랜: ${planNames[plan] || plan}
- 금액: ₩${amount.toLocaleString()}
- 결제 주기: 월간 구독

이제 ${planNames[plan]} 플랜의 모든 기능을 사용하실 수 있습니다!

대시보드: ${env.NEXT_PUBLIC_APP_URL}/dashboard

구독 관리는 계정 설정에서 가능합니다.

감사합니다.
PrepTap 팀 드림
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * 비밀번호 재설정 이메일
 */
export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  const subject = "비밀번호 재설정 요청";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">비밀번호 재설정</h1>
          </div>
          <div class="content">
            <p>비밀번호 재설정을 요청하셨습니다.</p>
            <p>아래 버튼을 클릭하여 새로운 비밀번호를 설정해주세요:</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">
                비밀번호 재설정하기
              </a>
            </div>

            <div class="alert">
              <strong>⚠️ 보안 안내</strong><br>
              이 링크는 1시간 동안만 유효합니다.<br>
              본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              버튼이 작동하지 않는 경우, 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br>
              <a href="${resetUrl}" style="word-break: break-all;">${resetUrl}</a>
            </p>

            <p>감사합니다.<br>PrepTap 팀 드림</p>
          </div>
          <div class="footer">
            <p>이 이메일은 비밀번호 재설정 요청 시 자동으로 발송되었습니다.</p>
            <p>© 2025 PrepTap. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
비밀번호 재설정

비밀번호 재설정을 요청하셨습니다.

아래 링크를 클릭하여 새로운 비밀번호를 설정해주세요:
${resetUrl}

⚠️ 보안 안내
- 이 링크는 1시간 동안만 유효합니다.
- 본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.

감사합니다.
PrepTap 팀 드림
  `;

  return sendEmail({ to, subject, html, text });
}

/**
 * 문의 접수 확인 이메일
 */
export async function sendContactConfirmationEmail(
  to: string,
  name: string,
  subject: string
) {
  const emailSubject = "문의가 접수되었습니다";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">문의 접수 완료</h1>
          </div>
          <div class="content">
            <h2>안녕하세요, ${name}님!</h2>
            <p>문의가 정상적으로 접수되었습니다.</p>

            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>문의 제목:</strong></p>
              <p style="margin: 10px 0 0 0;">${subject}</p>
            </div>

            <p>영업일 기준 24시간 이내에 담당자가 확인 후 답변드리겠습니다.</p>

            <p style="color: #6b7280;">
              긴급한 문의사항은 support@preptap.com으로 직접 연락주시기 바랍니다.
            </p>

            <p>감사합니다.<br>PrepTap 고객지원팀 드림</p>
          </div>
          <div class="footer">
            <p>© 2025 PrepTap. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
안녕하세요, ${name}님!

문의가 정상적으로 접수되었습니다.

문의 제목: ${subject}

영업일 기준 24시간 이내에 담당자가 확인 후 답변드리겠습니다.

감사합니다.
PrepTap 고객지원팀 드림
  `;

  return sendEmail({ to, subject: emailSubject, html, text });
}
