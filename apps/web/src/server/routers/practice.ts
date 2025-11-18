import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { SessionMode, ExamType } from "@preptap/db";
import {
  buildAdaptiveQuery,
  calculateQuestionProbabilities,
  sampleQuestions,
  updateWeaknessScores,
} from "@/lib/adaptive-engine";
import {
  calculateNextReview,
  getInitialSRData,
  getNextReviewDate,
  performanceToQuality,
} from "@/lib/spaced-repetition";

export const practiceRouter = createTRPCRouter({
  /**
   * Generate adaptive practice session
   */
  generateAdaptive: protectedProcedure
    .input(
      z.object({
        examType: z.nativeEnum(ExamType).optional(),
        questionCount: z.number().int().min(5).max(50).default(20),
        focusTags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's profile to determine exam type
      const profile = await ctx.prisma.profile.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const examType = input.examType || profile?.targetExam;
      if (!examType) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "시험 유형을 선택해주세요.",
        });
      }

      // Get user's weaknesses
      const weaknesses = await ctx.prisma.weakness.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { score: "asc" },
        take: 10,
      });

      const weakTags = weaknesses.map((w) => w.tag);
      const weaknessMap = new Map(weaknesses.map((w) => [w.tag, w.score]));

      // Build query for candidate questions
      const candidateQuestions = await ctx.prisma.question.findMany(
        buildAdaptiveQuery(ctx.session.user.id, examType, weakTags, input.questionCount)
      );

      if (candidateQuestions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "문제를 찾을 수 없습니다.",
        });
      }

      // Calculate probabilities and sample questions
      const recentWrongRate = new Map<string, number>(); // TODO: Calculate from recent sessions
      const probabilities = calculateQuestionProbabilities(
        candidateQuestions,
        weaknessMap,
        recentWrongRate
      );

      const selectedQuestions = sampleQuestions(
        candidateQuestions,
        probabilities,
        input.questionCount
      );

      // Create practice session
      const session = await ctx.prisma.practiceSession.create({
        data: {
          userId: ctx.session.user.id,
          mode: SessionMode.ADAPTIVE,
          configJson: {
            examType,
            questionCount: input.questionCount,
            focusTags: input.focusTags,
          },
          items: {
            create: selectedQuestions.map((q, idx) => ({
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
   * Submit practice session answers
   */
  submit: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        answers: z.array(
          z.object({
            itemId: z.string(),
            userAnswer: z.string(),
            elapsedMs: z.number().int(),
            flagged: z.boolean().optional(),
            skipped: z.boolean().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.prisma.practiceSession.findUnique({
        where: { id: input.sessionId },
        include: {
          items: {
            include: {
              question: {
                include: {
                  choices: true,
                },
              },
            },
          },
        },
      });

      if (!session || session.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "세션을 찾을 수 없습니다." });
      }

      // Grade answers
      const results = [];
      for (const answer of input.answers) {
        const item = session.items.find((i) => i.id === answer.itemId);
        if (!item) continue;

        const correctChoice = item.question.choices.find((c) => c.isCorrect);
        const isCorrect = correctChoice?.label === answer.userAnswer;

        await ctx.prisma.sessionItem.update({
          where: { id: item.id },
          data: {
            userAnswer: answer.userAnswer,
            isCorrect,
            elapsedMs: answer.elapsedMs,
            flagged: answer.flagged,
            skipped: answer.skipped,
          },
        });

        results.push({
          questionId: item.questionId,
          tags: item.question.tags,
          isCorrect,
        });

        // Update spaced repetition if wrong
        if (!isCorrect) {
          const existingItem = await ctx.prisma.spacedItem.findUnique({
            where: {
              userId_questionId: {
                userId: ctx.session.user.id,
                questionId: item.questionId,
              },
            },
          });

          const srData = existingItem || {
            ...getInitialSRData(),
            nextReviewAt: new Date(),
          };

          const quality = performanceToQuality(isCorrect, answer.elapsedMs, 60000); // 60s expected
          const updated = calculateNextReview(
            {
              easinessFactor: existingItem?.ef ?? srData.easinessFactor,
              interval: existingItem?.interval ?? srData.interval,
              repetition: existingItem?.repetition ?? srData.repetition,
            },
            quality
          );

          await ctx.prisma.spacedItem.upsert({
            where: {
              userId_questionId: {
                userId: ctx.session.user.id,
                questionId: item.questionId,
              },
            },
            create: {
              userId: ctx.session.user.id,
              questionId: item.questionId,
              ef: updated.easinessFactor,
              interval: updated.interval,
              repetition: updated.repetition,
              nextReviewAt: getNextReviewDate(new Date(), updated.interval),
            },
            update: {
              ef: updated.easinessFactor,
              interval: updated.interval,
              repetition: updated.repetition,
              nextReviewAt: getNextReviewDate(new Date(), updated.interval),
            },
          });
        }
      }

      // Update weaknesses
      const currentWeaknesses = await ctx.prisma.weakness.findMany({
        where: { userId: ctx.session.user.id },
      });

      const weaknessMap = new Map(
        currentWeaknesses.map((w) => [
          w.tag,
          {
            score: w.score,
            totalAttempts: w.totalAttempts,
            correctCount: w.correctCount,
          },
        ])
      );

      const updatedWeaknesses = updateWeaknessScores(weaknessMap, results);

      for (const [tag, data] of updatedWeaknesses.entries()) {
        await ctx.prisma.weakness.upsert({
          where: {
            userId_tag: {
              userId: ctx.session.user.id,
              tag,
            },
          },
          create: {
            userId: ctx.session.user.id,
            tag,
            ...data,
          },
          update: data,
        });
      }

      // Finalize session
      const correctCount = results.filter((r) => r.isCorrect).length;
      const score = (correctCount / results.length) * 100;

      await ctx.prisma.practiceSession.update({
        where: { id: session.id },
        data: {
          finishedAt: new Date(),
          score,
        },
      });

      // Log event
      await ctx.prisma.eventLog.create({
        data: {
          userId: ctx.session.user.id,
          eventType: "SESSION_FINISH",
          payloadJson: {
            sessionId: session.id,
            score,
            correctCount,
            totalCount: results.length,
          },
        },
      });

      return {
        score,
        correctCount,
        totalCount: results.length,
      };
    }),

  /**
   * Get session for review
   */
  getSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.prisma.practiceSession.findUnique({
        where: { id: input.sessionId },
        include: {
          items: {
            include: {
              question: {
                include: {
                  choices: true,
                  explanation: true,
                },
              },
            },
            orderBy: { orderIndex: "asc" },
          },
        },
      });

      if (!session || session.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return session;
    }),

  /**
   * Get user's recent sessions
   */
  getRecentSessions: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(50).default(10),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const sessions = await ctx.prisma.practiceSession.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 10,
        include: {
          _count: {
            select: { items: true },
          },
        },
      });

      return sessions;
    }),

  /**
   * Get today's completed session count
   * (for subscription limits)
   */
  getTodayCount: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await ctx.prisma.practiceSession.count({
      where: {
        userId: ctx.session.user.id,
        createdAt: {
          gte: today,
        },
        completedAt: {
          not: null,
        },
      },
    });

    return count;
  }),
});
