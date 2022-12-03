import { router } from '../trpc';
import { privateRouter } from './private';
import { publicRouter } from './public';

export const appRouter = router({
  public: publicRouter,
  private: privateRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
