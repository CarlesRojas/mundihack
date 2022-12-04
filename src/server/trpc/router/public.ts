import { publicProcedure, router } from '@server/trpc/trpc';

export const publicRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
});
