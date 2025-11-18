import { middleware } from "../../trpc";
import { TRPCError } from "@trpc/server";

/**
 * Admin-only middleware
 * 
 * Verifies that the authenticated user has ADMIN role.
 * Use this for any procedures that require admin privileges.
 * 
 * @example
 * ```typescript
 * export const getAllUsers = adminProcedure
 *   .query(async ({ ctx }) => {
 *     // User is guaranteed to be admin here
 *     return await ctx.prisma.user.findMany();
 *   });
 * ```
 */
export const adminMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "인증이 필요합니다.",
    });
  }

  const user = await ctx.prisma.user.findUnique({
    where: { id: ctx.session.user.id },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "관리자 권한이 필요합니다.",
    });
  }

  return next({
    ctx: {
      ...ctx,
      // Extend context with admin-verified user
      isAdmin: true,
    },
  });
});
