import Button from '@components/Button';
import usePusher from '@hooks/usePusher';
import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import { type NextPage } from 'next';
import { useEffect } from 'react';
import { RiAddFill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Teams: NextPage = () => {
  const { sub, unsub } = usePusher();

  const { mutate } = trpc.private.emitEvent.useMutation();

  useEffect(() => {
    sub('testEvent', ({ message }: { message: string }) => {
      console.log('team created + ', message);
    });

    return () => {
      unsub('testEvent');
    };
  }, [sub, unsub]);

  return (
    <Container>
      <Button icon={<RiAddFill />} label={'Send event'} onClick={() => mutate()} />
    </Container>
  );
};

export default Teams;
