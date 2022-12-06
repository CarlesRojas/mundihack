import Button from '@components/Button';
import Text from '@components/Text';
import { env } from '@env/client.mjs';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import { ROUTE } from '@utils/constants';
import type { GetServerSideProps, NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  console.log(session);

  if (session) return { redirect: { destination: ROUTE.CALENDAR, permanent: false } };
  return { props: {} };
};

const Projects: NextPage = () => {
  useEffect(() => {
    signOut({ redirect: false });
  }, []);

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
