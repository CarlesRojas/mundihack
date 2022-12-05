import { publicProcedure, router } from '@server/trpc/trpc';
import { MAX_TEAM_SIZE } from '@utils/constants';
import { z } from 'zod';

export const publicRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getUsers: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: { id: true, email: true, name: true, projectId: true, votedProjectId: true },
      orderBy: { name: 'asc' },
    });
  }),

  getProjects: publicProcedure.query(async ({ ctx }) => {
    const numberOfUsers = await ctx.prisma.user.count();
    const expectedNumberOfProjects = Math.ceil(numberOfUsers / MAX_TEAM_SIZE);
    const numberOfProjectsToCreate = expectedNumberOfProjects - (await ctx.prisma.project.count());

    if (numberOfProjectsToCreate > 0)
      await ctx.prisma.project.createMany({
        data: Array.from({ length: numberOfProjectsToCreate }).map(() => ({})),
      });
    else if (numberOfProjectsToCreate < 0) {
      const projects = (await ctx.prisma.project.findMany({ select: { id: true }, orderBy: { createdAt: 'desc' } }))
        .slice(numberOfProjectsToCreate)
        .map(({ id }) => id);

      await ctx.prisma.project.deleteMany({ where: { id: { in: projects } } });
    }

    return ctx.prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        githubLink: true,
        projectLink: true,
        users: { select: { id: true, name: true } },
        votes: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }),

  getAction: publicProcedure.input(z.object({ name: z.string() })).query(async ({ ctx, input }) => {
    const actions = await ctx.prisma.action.findMany({ where: { name: input.name } });
    if (actions.length === 0) return await ctx.prisma.action.create({ data: { name: input.name, allowed: false } });
    return actions[0];
  }),
});
