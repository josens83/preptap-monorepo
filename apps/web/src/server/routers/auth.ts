import { z } from "zod";
import { hash } from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { UserRole } from "@preptap/db";
import { sendWelcomeEmail } from "@/lib/email";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다."),
        displayName: z.string().min(2).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "이미 사용 중인 이메일입니다.",
        });
      }

      const hashedPassword = await hash(input.password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          role: UserRole.STUDENT,
          profile: {
            create: {
              displayName: input.displayName,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Log the event
      await ctx.prisma.eventLog.create({
        data: {
          userId: user.id,
          eventType: "USER_SIGNUP",
          payloadJson: { email: user.email },
        },
      });

      // Send welcome email (non-blocking)
      sendWelcomeEmail(user.email, input.displayName || "회원").catch((err) => {
        console.error("환영 이메일 전송 실패:", err);
      });

      return {
        id: user.id,
        email: user.email,
      };
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        profile: true,
        subscriptions: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "사용자를 찾을 수 없습니다." });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(2).optional(),
        schoolLevel: z.enum(["ELEMENTARY", "MIDDLE", "HIGH", "UNIVERSITY", "ADULT"]).optional(),
        targetExam: z.enum(["SUNEUNG", "TEPS", "TOEIC", "TOEFL", "IELTS", "CUSTOM"]).optional(),
        targetScore: z.number().int().positive().optional(),
        examDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.upsert({
        where: { userId: ctx.session.user.id },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
        update: input,
      });

      return profile;
    }),
});
