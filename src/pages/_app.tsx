import { configureAbly } from '@ably-labs/react-hooks';
import Effects from '@components/Effects';
import Footer from '@components/Footer';
import Header from '@components/Header';
import { env } from '@env/client.mjs';
import useAbly from '@hooks/useAbly';
import globalStyles from '@styles/global';
import { desktop, laptop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { ABLY_EVENT } from '@utils/constants';
import { trpc } from '@utils/trpc';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { useCallback } from 'react';

configureAbly({ authUrl: `${env.NEXT_PUBLIC_HOSTNAME}/api/ably/createToken` });

const App = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: '1rem',
  background: 'radial-gradient(transparent, rgba(0, 0, 0, 0.8))',
  backgroundSize: 'cover',
  touchAction: 'none',

  [tablet]: { padding: '3rem 4rem' },
  [laptop]: { padding: '6rem 10rem', flexDirection: 'column' },
  [desktop]: { padding: '8rem 16rem' },
});

const Container = styled('div', {
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: '3rem',
});

const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  touchAction: 'pan-y',
  minHeight: '100%',
  maxHeight: '100%',
  padding: '1rem 0',

  [tablet]: { padding: '3rem 0' },
  [laptop]: { padding: '5rem 0' },
});

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  globalStyles();
  const { private: privateRouter, public: publicRouter } = trpc.useContext();
  const { getUser, getProject } = privateRouter;
  const { getProjects, getUsers, getAction } = publicRouter;

  const invalidateQueries = useCallback(() => {
    getUsers.invalidate();
    getProjects.invalidate();
    getUser.invalidate();
    getAction.invalidate();
    getProject.invalidate();
  }, [getUsers, getProjects, getUser, getAction, getProject]);

  useAbly({
    [ABLY_EVENT.UPDATE_TEAMS]: invalidateQueries,
    [ABLY_EVENT.UPDATE_ACTIONS]: invalidateQueries,
    [ABLY_EVENT.UPDATE_TEAM_PROJECT]: invalidateQueries,
  });

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <title>mundihack</title>
      </Head>

      <SessionProvider session={session}>
        <App>
          <Effects disabled={process.env.NODE_ENV === 'development'}>
            <Container>
              <Header />

              <Main>
                <Component {...pageProps} />
              </Main>

              <Footer />
            </Container>
          </Effects>
        </App>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
