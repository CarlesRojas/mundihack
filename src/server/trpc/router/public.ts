import { publicProcedure, router } from '../trpc';

export const publicRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  })
});
