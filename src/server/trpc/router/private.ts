import { protectedProcedure, router } from '@server/trpc/trpc';
import { MAX_TEAM_SIZE } from '@utils/constants';
import { z } from 'zod';
export const privateRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user) throw new Error("can't find the user");
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    return user;
  }),

  joinOrLeaveProject: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
    const projectUsers = await ctx.prisma.user.findMany({ where: { projectId: input.projectId } });
    if (!user) throw new Error("can't find the user");

    const join = user.projectId !== input.projectId;
    const isProjectFull = projectUsers.length >= MAX_TEAM_SIZE;

    if (user.projectId) await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: null } });
    if (join && !isProjectFull)
      await ctx.prisma.user.update({ where: { id: user.id }, data: { projectId: input.projectId } });

    const newProjectUsers = await ctx.prisma.user.findMany({
      where: { projectId: input.projectId },
      orderBy: { updatedAt: 'desc' },
    });

    if (newProjectUsers.length === 0)
      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: { name: null, description: null, githubLink: null, projectLink: null },
      });

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

  getProject: protectedProcedure
    .input(z.object({ projectId: z.string().nullish().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.projectId) throw new Error("can't find the project");
      return await ctx.prisma.project.findUnique({ where: { id: input.projectId } });
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().nullish().optional(),
        name: z.string(),
        description: z.string(),
        githubLink: z.string(),
        projectLink: z.string().optional().nullish(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.projectId) throw new Error("can't find the project");
      await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          name: input.name,
          description: input.description,
          githubLink: input.githubLink,
          projectLink: input.projectLink,
        },
      });
    }),

  toggleWinner: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    if (ctx.session.user.isAdmin) {
      const currentValue = (await ctx.prisma.project.findUnique({ where: { id: input.projectId } }))?.winner;
      if (typeof currentValue !== 'boolean') return;

      if (!currentValue) await ctx.prisma.project.updateMany({ where: {}, data: { winner: false } });
      await ctx.prisma.project.update({ where: { id: input.projectId }, data: { winner: !currentValue } });
    }
  }),
});
