import { privateRouter } from '@server/trpc/router/private';
import { publicRouter } from '@server/trpc/router/public';
import { router } from '@server/trpc/trpc';

export const appRouter = router({
  public: publicRouter,
  private: privateRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
