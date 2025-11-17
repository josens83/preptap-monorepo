import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sendContactConfirmationEmail } from "@/lib/email";

export const contactRouter = createTRPCRouter({
  /**
   * Submit contact form
   */
  submitContactForm: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "이름을 입력해주세요"),
        email: z.string().email("유효한 이메일을 입력해주세요"),
        subject: z.string().min(1, "제목을 입력해주세요"),
        message: z.string().min(10, "메시지는 최소 10자 이상이어야 합니다"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Store contact form submission in database
        const contact = await ctx.prisma.contactMessage.create({
          data: {
            name: input.name,
            email: input.email,
            subject: input.subject,
            message: input.message,
            status: "NEW",
          },
        });

        // Send confirmation email to user (non-blocking)
        sendContactConfirmationEmail(input.email, input.name, input.subject).catch(
          (err) => {
            console.error("문의 확인 이메일 전송 실패:", err);
          }
        );

        return {
          success: true,
          message: "문의가 성공적으로 접수되었습니다. 영업일 기준 24시간 이내에 답변드리겠습니다.",
          contactId: contact.id,
        };
      } catch (error) {
        console.error("Contact form submission error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        });
      }
    }),
});
