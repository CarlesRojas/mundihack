import { env } from '@env/server.mjs';
import { protectedProcedure, router } from '@server/trpc/trpc';
import Pusher from 'pusher';

export const privateRouter = router({
  emitEvent: protectedProcedure.mutation(() => {
    const pusher = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_APP_KEY,
      secret: env.PUSHER_APP_SECRET,
      cluster: env.PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    console.log(pusher);

    pusher.trigger('mundihackChannel', 'testEvent', {
      message: 'hello world',
    });
  }),
});
