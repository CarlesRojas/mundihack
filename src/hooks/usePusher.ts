import type { Channel } from 'pusher-js';
import Pusher from 'pusher-js';
import { useRef } from 'react';
import usePageUnload from './usePageUnload';

export interface PusherSubscription {
  connect: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sub: (event: string, callback: (data: any) => void) => void;
  unsub: (event: string) => void;
}

const usePusher = () => {
  const pusher = useRef<Pusher | null>(null);
  const channel = useRef<Channel | null>(null);

  const connect = () => {
    if (pusher.current) return;
    console.log('Connect to pusher');

    pusher.current = new Pusher('fa91eb2044bab8a4d3d9', { cluster: 'eu' });
    channel.current = pusher.current.subscribe('mundihackChannel');
  };

  const disconnect = () => {
    console.log('Disconnect from pusher');
    pusher.current?.disconnect();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = (event: string, callback: (data: any) => void) => {
    if (!channel.current) return;
    channel.current.bind(event, callback);
  };

  const unsub = (event: string) => {
    if (!channel.current) return;

    channel.current?.unbind(event);
  };

  usePageUnload(disconnect);

  const pusherSubscription: PusherSubscription = { connect, sub, unsub };
  return pusherSubscription;
};

export default usePusher;
