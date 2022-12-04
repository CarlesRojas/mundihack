import Pusher from 'pusher-js';
import { useRef } from 'react';

const usePusher = () => {
  const pusher = useRef(new Pusher('fa91eb2044bab8a4d3d9', { cluster: 'eu' }));
  const channel = useRef(pusher.current.subscribe('mundihackChannel'));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = (event: string, callback: (data: any) => void) => {
    channel.current.bind(event, callback);
  };

  const unsub = (event: string) => {
    channel.current.unbind(event);
  };

  return { sub, unsub };
};

export default usePusher;
