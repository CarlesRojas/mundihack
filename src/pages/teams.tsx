import { useChannel } from '@ably-labs/react-hooks';
import Button from '@components/Button';
import Participants from '@components/Participants';
import { styled } from '@styles/stitches.config';
import { ABLY_CHANNEL } from '@utils/constants';
import { useState } from 'react';
import { RiAddFill } from 'react-icons/ri';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Teams = () => {
  const [messages, setMessages] = useState<string[]>([]);

  const [, ably] = useChannel(ABLY_CHANNEL, () => {
    setMessages((messages) => [...messages, 'Hello from Ably!']);
  });

  return (
    <Container>
      <Button
        icon={<RiAddFill />}
        label={'Send event'}
        onClick={async () => {
          await fetch('/api/ably/updateTeams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author: ably.auth.clientId }),
          });
        }}
      />

      {messages.map((message, i) => (
        <p key={i}>{message}</p>
      ))}

      <Participants />
    </Container>
  );
};

export default Teams;
