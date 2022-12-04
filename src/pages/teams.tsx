import Button from '@components/Button';
import type { PusherSubscription } from '@hooks/usePusher';
import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import { useEffect, useState } from 'react';
import { RiAddFill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Teams = ({ pusher }: { pusher: PusherSubscription }) => {
  const { sub, unsub } = pusher;

  const { mutate } = trpc.private.emitEvent.useMutation();

  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    sub('testEvent', ({ message }: { message: string }) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      unsub('testEvent');
    };
  }, [sub, unsub]);

  return (
    <Container>
      <Button icon={<RiAddFill />} label={'Send event'} onClick={() => mutate()} />
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </Container>
  );
};

export default Teams;
