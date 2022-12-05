import Button from '@components/Button';
import Text from '@components/Text';
import { env } from '@env/client.mjs';
import { styled } from '@styles/stitches.config';
import type { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { RiGoogleFill } from 'react-icons/ri';

const Container = styled('div', {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '1rem',
});

const Projects: NextPage = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) signOut({ redirect: false });
  }, [session]);

  return (
    <Container>
      <Text>there was an error logging in</Text>
      <Button
        icon={<RiGoogleFill />}
        label={'try again'}
        onClick={() => signIn('google', { callbackUrl: env.NEXT_PUBLIC_HOSTNAME })}
      />
    </Container>
  );
};

export default Projects;
