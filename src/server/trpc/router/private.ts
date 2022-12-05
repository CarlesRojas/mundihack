import { protectedProcedure, router } from '@server/trpc/trpc';
import { MAX_TEAM_SIZE } from '@utils/constants';
import { z } from 'zod';
export const privateRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) return null;
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    return user;
  }),
  joinOrLeaveProject: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    const projectUsers = await ctx.prisma.user.findMany({ where: { projectId: input.projectId } });
    if (!user) return;

    const join = user.projectId !== input.projectId;
    const isProjectFull = projectUsers.length >= MAX_TEAM_SIZE;

    if (user.projectId) await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: null } });
    if (join && !isProjectFull)
      await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: input.projectId } });

    const newProjectUsers = await ctx.prisma.user.findMany({
      where: { projectId: input.projectId },
      orderBy: { updatedAt: 'desc' },
    });

    // const newProjectUsers = await ctx.prisma.user.findMany({ where: { projectId: input.projectId } });
    const numberOfUsersToKick = newProjectUsers.length > MAX_TEAM_SIZE ? newProjectUsers.length - MAX_TEAM_SIZE : 0;
    if (numberOfUsersToKick === 0) return;

    const usersToKick = newProjectUsers.slice(0, numberOfUsersToKick).map((user) => user.id);
    await ctx.prisma.user.updateMany({ where: { id: { in: usersToKick } }, data: { projectId: null } });
  }),

  setAction: protectedProcedure
    .input(z.object({ action: z.string(), allowed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.isAdmin)
        await ctx.prisma.action.updateMany({ where: { name: input.action }, data: { allowed: input.allowed } });
    }),
});
