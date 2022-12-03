import { protectedProcedure, router } from '../trpc';

export const privateRouter = router({
  getSecretMessage: protectedProcedure.query(() => {
    return 'you can now see this secret message!';
  })
});
