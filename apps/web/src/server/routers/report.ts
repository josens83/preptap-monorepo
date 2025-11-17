import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportRouter = createTRPCRouter({
  /**
   * Get overall performance overview
   */
  getOverview: protectedProcedure
    .input(
      z.object({
        days: z.number().optional().default(7),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Calculate date range
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      // Total sessions in date range
      const totalSessions = await ctx.prisma.practiceSession.count({
        where: {
          userId,
          finishedAt: { not: null, gte: startDate }
        },
      });

      // Total questions answered in date range
      const totalQuestions = await ctx.prisma.sessionItem.count({
        where: {
          session: {
            userId,
            finishedAt: { not: null, gte: startDate }
          },
          isCorrect: { not: null },
        },
      });

      // Correct answers in date range
      const correctAnswers = await ctx.prisma.sessionItem.count({
        where: {
          session: {
            userId,
            finishedAt: { not: null, gte: startDate }
          },
          isCorrect: true,
        },
      });

      // Average score in date range
      const sessions = await ctx.prisma.practiceSession.findMany({
        where: {
          userId,
          finishedAt: { not: null, gte: startDate },
          score: { not: null }
        },
        select: { score: true },
      });

    const avgScore =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / sessions.length
        : 0;

      // Study time in date range
      const totalStudyTimeMs = await ctx.prisma.sessionItem.aggregate({
        where: {
          session: {
            userId,
            finishedAt: { not: null, gte: startDate }
          },
          elapsedMs: { not: null },
        },
        _sum: {
          elapsedMs: true,
        },
      });

      // Weaknesses
      const weaknesses = await ctx.prisma.weakness.findMany({
        where: { userId },
        orderBy: { score: "asc" },
        take: 10,
      });

      // Recent sessions trend
      const recentSessions = await ctx.prisma.practiceSession.findMany({
        where: {
          userId,
          finishedAt: { not: null, gte: startDate },
          score: { not: null },
        },
        orderBy: { finishedAt: "asc" },
        select: {
          finishedAt: true,
          score: true,
        },
      });

      return {
        stats: {
          totalSessions,
          totalQuestions,
          averageAccuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
          totalStudyMinutes: Math.floor((totalStudyTimeMs._sum.elapsedMs || 0) / 60000),
        },
        weaknesses: weaknesses.map((w) => ({
          tag: w.tag,
          score: w.score,
          accuracy: w.totalAttempts > 0 ? (w.correctCount / w.totalAttempts) * 100 : 0,
        })),
        recentTrend: recentSessions.map((s) => ({
          date: s.finishedAt,
          score: s.score,
        })),
      };
    }),

  /**
   * Get detailed weakness analysis for a specific tag
   */
  getWeaknessDetail: protectedProcedure
    .input(
      z.object({
        tag: z.string(),
        limit: z.number().optional().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const weakness = await ctx.prisma.weakness.findUnique({
        where: {
          userId_tag: {
            userId,
            tag: input.tag,
          },
        },
      });

      if (!weakness) {
        return null;
      }

      // Get recent attempts on this tag
      const recentAttempts = await ctx.prisma.sessionItem.findMany({
        where: {
          session: { userId },
          question: {
            tags: {
              has: input.tag,
            },
          },
          isCorrect: { not: null },
        },
        include: {
          question: {
            select: {
              id: true,
              stem: true,
              difficulty: true,
            },
          },
          session: {
            select: {
              finishedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
      });

      return {
        weakness,
        recentAttempts,
      };
    }),

  /**
   * Get performance by exam type
   */
  getPerformanceByExam: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const sessions = await ctx.prisma.practiceSession.findMany({
      where: {
        userId,
        finishedAt: { not: null },
      },
      include: {
        items: {
          include: {
            question: {
              select: {
                examType: true,
              },
            },
          },
        },
      },
    });

    // Group by exam type
    const examStats = new Map<
      string,
      { total: number; correct: number; sessions: number }
    >();

    for (const session of sessions) {
      for (const item of session.items) {
        const examType = item.question.examType;
        const stats = examStats.get(examType) || { total: 0, correct: 0, sessions: 0 };

        stats.total += 1;
        if (item.isCorrect) stats.correct += 1;

        examStats.set(examType, stats);
      }

      // Count sessions per exam type (assuming one exam type per session)
      if (session.items.length > 0) {
        const examType = session.items[0].question.examType;
        const stats = examStats.get(examType) || { total: 0, correct: 0, sessions: 0 };
        stats.sessions += 1;
        examStats.set(examType, stats);
      }
    }

    return Array.from(examStats.entries()).map(([examType, stats]) => ({
      examType,
      accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      totalQuestions: stats.total,
      sessions: stats.sessions,
    }));
  }),
});
