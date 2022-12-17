import { publicProcedure, router } from '@server/trpc/trpc';
import { ACTION, MIN_TEAM_SIZE } from '@utils/constants';
import { z } from 'zod';

export const publicRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: { id: true, email: true, name: true, projectId: true },
      orderBy: { name: 'asc' },
    });
  }),

  getProjects: publicProcedure.query(async ({ ctx }) => {
    const teamBuildingAction = await ctx.prisma.action.findFirst({ where: { name: ACTION.TEAM } });
    const teamBuildingAllowed = teamBuildingAction?.allowed ?? false;

    if (teamBuildingAllowed) {
      const numberOfUsers = await ctx.prisma.user.count();
      const minNumberOfProjects = Math.ceil(numberOfUsers / MIN_TEAM_SIZE);
      const numberOfProjectsToCreate = minNumberOfProjects - (await ctx.prisma.project.count());

      if (numberOfProjectsToCreate > 0)
        await ctx.prisma.project.createMany({
          data: Array.from({ length: numberOfProjectsToCreate }).map(() => ({})),
        });
    } else await ctx.prisma.project.deleteMany({ where: { users: { none: {} } } });

    return ctx.prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        githubLink: true,
        projectLink: true,
        winner: true,
        users: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }),

  getAction: publicProcedure.input(z.object({ name: z.string() })).query(async ({ ctx, input }) => {
    const action = await ctx.prisma.action.findFirst({ where: { name: input.name } });
    if (!action) return await ctx.prisma.action.create({ data: { name: input.name, allowed: false } });
    return action;
  }),
});
