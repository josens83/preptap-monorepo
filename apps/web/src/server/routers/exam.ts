import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ExamType, SchoolLevel } from "@preptap/db";

export const examRouter = createTRPCRouter({
  /**
   * Start onboarding diagnostic test
   */
  startOnboarding: protectedProcedure
    .input(
      z.object({
        targetExam: z.nativeEnum(ExamType),
        schoolLevel: z.nativeEnum(SchoolLevel).optional(),
        targetScore: z.number().int().positive().optional(),
        examDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Update profile with target exam info
      await ctx.prisma.profile.upsert({
        where: { userId: ctx.session.user.id },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
        update: input,
      });

      // Get 15-20 diagnostic questions across different tags
      const questions = await ctx.prisma.question.findMany({
        where: {
          examType: input.targetExam,
          difficulty: { gte: 0.4, lte: 0.7 }, // Medium difficulty for diagnostic
        },
        include: {
          choices: true,
        },
        take: 20,
        orderBy: { createdAt: "desc" },
      });

      if (questions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "진단 문제를 찾을 수 없습니다. 나중에 다시 시도해주세요.",
        });
      }

      // Create a diagnostic session
      const session = await ctx.prisma.practiceSession.create({
        data: {
          userId: ctx.session.user.id,
          mode: "ADAPTIVE",
          configJson: {
            type: "diagnostic",
            examType: input.targetExam,
          },
          items: {
            create: questions.map((q, idx) => ({
              questionId: q.id,
              orderIndex: idx,
            })),
          },
        },
        include: {
          items: {
            include: {
              question: {
                include: {
                  choices: true,
                },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      return session;
    }),

  /**
   * Finish onboarding and calculate initial weaknesses
   */
  finishOnboarding: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.practiceSession.findUnique({
        where: { id: input.sessionId },
        include: {
          items: {
            include: {
              question: true,
            },
          },
        },
      });

      if (!session || session.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "세션을 찾을 수 없습니다." });
      }

      // Calculate weaknesses by tag
      const tagStats = new Map<
        string,
        { total: number; correct: number }
      >();

      for (const item of session.items) {
        if (item.isCorrect === null) continue;

        for (const tag of item.question.tags) {
          const stats = tagStats.get(tag) || { total: 0, correct: 0 };
          stats.total += 1;
          if (item.isCorrect) stats.correct += 1;
          tagStats.set(tag, stats);
        }
      }

      // Create weakness records
      const weaknesses = [];
      for (const [tag, stats] of tagStats.entries()) {
        const score = stats.correct / stats.total;
        weaknesses.push({
          userId: ctx.session.user.id,
          tag,
          score,
          totalAttempts: stats.total,
          correctCount: stats.correct,
        });
      }

      await ctx.prisma.weakness.createMany({
        data: weaknesses,
        skipDuplicates: true,
      });

      // Mark session as finished
      await ctx.prisma.practiceSession.update({
        where: { id: session.id },
        data: {
          finishedAt: new Date(),
          score: (session.items.filter((i) => i.isCorrect).length / session.items.length) * 100,
        },
      });

      return {
        weaknesses: Array.from(tagStats.entries()).map(([tag, stats]) => ({
          tag,
          score: stats.correct / stats.total,
          total: stats.total,
          correct: stats.correct,
        })),
      };
    }),
});
