import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const reportRouter = createTRPCRouter({
  /**
   * Get overall performance overview
   */
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Total sessions
    const totalSessions = await ctx.prisma.practiceSession.count({
      where: { userId, finishedAt: { not: null } },
    });

    // Total questions answered
    const totalQuestions = await ctx.prisma.sessionItem.count({
      where: {
        session: { userId },
        isCorrect: { not: null },
      },
    });

    // Correct answers
    const correctAnswers = await ctx.prisma.sessionItem.count({
      where: {
        session: { userId },
        isCorrect: true,
      },
    });

    // Average score
    const sessions = await ctx.prisma.practiceSession.findMany({
      where: { userId, finishedAt: { not: null }, score: { not: null } },
      select: { score: true },
    });

    const avgScore =
      sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.score ?? 0), 0) / sessions.length
        : 0;

    // Study time (rough estimate based on sessions)
    const totalStudyTimeMs = await ctx.prisma.sessionItem.aggregate({
      where: {
        session: { userId },
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

    // Recent sessions trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await ctx.prisma.practiceSession.findMany({
      where: {
        userId,
        finishedAt: { not: null, gte: sevenDaysAgo },
        score: { not: null },
      },
      orderBy: { finishedAt: "asc" },
      select: {
        finishedAt: true,
        score: true,
      },
    });

    return {
      totalSessions,
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0,
      avgScore,
      totalStudyTimeMs: totalStudyTimeMs._sum.elapsedMs || 0,
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
        take: 20,
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
