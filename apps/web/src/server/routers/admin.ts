import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const adminRouter = createTRPCRouter({
  /**
   * 모든 문의 조회 (관리자만)
   */
  getAllContacts: protectedProcedure
    .input(
      z.object({
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // 관리자 권한 확인
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "관리자 권한이 필요합니다.",
        });
      }

      const where = input.status ? { status: input.status } : {};

      const [contacts, total] = await Promise.all([
        ctx.prisma.contactMessage.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.contactMessage.count({ where }),
      ]);

      return {
        contacts,
        total,
        hasMore: total > input.offset + input.limit,
      };
    }),

  /**
   * 문의 상태 업데이트 (관리자만)
   */
  updateContactStatus: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        status: z.enum(["NEW", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // 관리자 권한 확인
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (user?.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "관리자 권한이 필요합니다.",
        });
      }

      const updated = await ctx.prisma.contactMessage.update({
        where: { id: input.contactId },
        data: { status: input.status },
      });

      return {
        success: true,
        contact: updated,
      };
    }),

  /**
   * 전체 사용자 통계 (관리자만)
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    // 관리자 권한 확인
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    if (user?.role !== "ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "관리자 권한이 필요합니다.",
      });
    }

    const [
      totalUsers,
      activeSubscriptions,
      totalSessions,
      totalQuestions,
      newContactsCount,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.subscription.count({ where: { status: "ACTIVE" } }),
      ctx.prisma.practiceSession.count(),
      ctx.prisma.sessionItem.count(),
      ctx.prisma.contactMessage.count({ where: { status: "NEW" } }),
    ]);

    // 최근 7일 신규 가입자
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersLast7Days = await ctx.prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // 구독 플랜별 통계
    const subscriptionsByPlan = await ctx.prisma.subscription.groupBy({
      by: ["plan"],
      where: { status: "ACTIVE" },
      _count: true,
    });

    return {
      totalUsers,
      activeSubscriptions,
      totalSessions,
      totalQuestions,
      newContactsCount,
      newUsersLast7Days,
      subscriptionsByPlan: subscriptionsByPlan.map((item) => ({
        plan: item.plan || "FREE",
        count: item._count,
      })),
    };
  }),
});
