import Text from '@components/Text';
import { getServerAuthSession } from '@server/common/get-server-auth-session';
import useSessionUser from '@server/hooks/useSessionUser';
import { styled } from '@styles/stitches.config';
import { ROUTE } from '@utils/constants';
import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) return { redirect: { destination: ROUTE.CALENDAR, permanent: false } };
  return { props: {} };
};

const YourProject: NextPage = () => {
  const sessionUser = useSessionUser();
  console.log(sessionUser);

  return (
    <Container>
      <Text></Text>
    </Container>
  );
};

export default YourProject;
