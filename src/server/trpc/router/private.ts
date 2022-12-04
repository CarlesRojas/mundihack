import Pusher from 'pusher';
import { protectedProcedure, router } from '../trpc';

export const privateRouter = router({
  emitEvent: protectedProcedure.mutation(() => {
    const pusher = new Pusher({
      appId: '1519645',
      key: 'fa91eb2044bab8a4d3d9',
      secret: '83d33d7eebf0230665b8',
      cluster: 'eu',
      useTLS: true,
    });

    pusher.trigger('mundihackChannel', 'testEvent', {
      message: 'hello world',
    });

    return;
  }),
});
