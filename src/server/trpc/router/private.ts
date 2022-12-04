import { protectedProcedure, router } from '@server/trpc/trpc';
import { z } from 'zod';
export const privateRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return null;
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    return user;
  }),
  joinOrLeaveProject: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    if (!user) return;

    const remove = user.projectId === input.projectId;
    if (user.projectId) await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: null } });
    if (!remove) await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: input.projectId } });
  }),
});
