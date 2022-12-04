import { protectedProcedure, router } from '@server/trpc/trpc';

export const privateRouter = router({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: { id: true, email: true, name: true, projectId: true, votedProjectId: true },
    });
  }),
});
