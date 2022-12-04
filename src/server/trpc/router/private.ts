// import { env } from '@env/server.mjs';
import { protectedProcedure, router } from '@server/trpc/trpc';

export const privateRouter = router({
  emitEvent: protectedProcedure.mutation(() => {}),
});
