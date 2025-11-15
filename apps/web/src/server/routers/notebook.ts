import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const notebookRouter = createTRPCRouter({
  /**
   * Get wrong answers (notebook)
   */
  get: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(50),
          tags: z.array(z.string()).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const wrongItems = await ctx.prisma.sessionItem.findMany({
        where: {
          session: {
            userId: ctx.session.user.id,
          },
          isCorrect: false,
          question: input?.tags
            ? {
                tags: {
                  hasSome: input.tags,
                },
              }
            : undefined,
        },
        include: {
          question: {
            include: {
              choices: true,
              explanation: true,
            },
          },
          session: {
            select: {
              id: true,
              mode: true,
              startedAt: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input?.limit ?? 50,
        distinct: ["questionId"], // Only show unique questions
      });

      return wrongItems;
    }),

  /**
   * Generate similar questions for review (spaced repetition queue)
   */
  generateSimilar: protectedProcedure
    .input(
      z.object({
        queueSize: z.number().int().min(5).max(30).default(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get questions due for review
      const dueItems = await ctx.prisma.spacedItem.findMany({
        where: {
          userId: ctx.session.user.id,
          nextReviewAt: {
            lte: new Date(),
          },
        },
        include: {
          question: {
            include: {
              choices: true,
            },
          },
        },
        orderBy: {
          nextReviewAt: "asc",
        },
        take: input.queueSize,
      });

      if (dueItems.length === 0) {
        return { message: "복습할 문제가 없습니다!", questions: [] };
      }

      // Create a review session
      const session = await ctx.prisma.practiceSession.create({
        data: {
          userId: ctx.session.user.id,
          mode: "NOTEBOOK",
          configJson: {
            type: "spaced-repetition-review",
          },
          items: {
            create: dueItems.map((item, idx) => ({
              questionId: item.questionId,
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

      return {
        message: `${dueItems.length}개의 복습 문제가 준비되었습니다.`,
        session,
      };
    }),

  /**
   * Get spaced repetition statistics
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const totalDue = await ctx.prisma.spacedItem.count({
      where: {
        userId: ctx.session.user.id,
        nextReviewAt: {
          lte: new Date(),
        },
      },
    });

    const totalReviewing = await ctx.prisma.spacedItem.count({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const wrongAnswerCount = await ctx.prisma.sessionItem.count({
      where: {
        session: {
          userId: ctx.session.user.id,
        },
        isCorrect: false,
      },
    });

    return {
      totalDue,
      totalReviewing,
      wrongAnswerCount,
    };
  }),
});
