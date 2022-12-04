import Pusher from 'pusher';
import { protectedProcedure, router } from '../trpc';

let pusherInstance: Pusher | null = null;

const getPusher = () => {
  if (pusherInstance) return pusherInstance;

  pusherInstance = new Pusher({
    appId: '1519645',
    key: 'fa91eb2044bab8a4d3d9',
    secret: '83d33d7eebf0230665b8',
    cluster: 'eu',
    useTLS: true,
  });

  return pusherInstance;
};

export const privateRouter = router({
  emitEvent: protectedProcedure.mutation(() => {
    const pusher = getPusher();
    if (!pusher) return;

    pusher.trigger('mundihackChannel', 'testEvent', {
      message: 'hello world',
    });
  }),
});
