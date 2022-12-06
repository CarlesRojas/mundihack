import Button from '@components/Button';
import Text from '@components/Text';
import { env } from '@env/client.mjs';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import { styled } from '@styles/stitches.config';
import { ROUTE } from '@utils/constants';
import type { GetServerSideProps, NextPage } from 'next';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
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

  if (session) return { redirect: { destination: ROUTE.CALENDAR, permanent: false } };
  return { props: {} };
};

const AuthError: NextPage = () => {
  const { query } = useRouter();
  const { error } = query;

  useEffect(() => {
    signOut({ redirect: false });
  }, []);

  const accessDenied = error === 'AccessDenied';

  if (accessDenied)
    return (
      <Container>
        <Text>you can only log in with a mundimoto account</Text>
      </Container>
    );

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

export default AuthError;
