import { desktop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import Footer from '@components/Footer';
import Header from '@components/Header';
import globalStyles from '@styles/global';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const App = styled('div', {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  gap: '1rem',

  [tablet]: {
    padding: '3rem 4rem',
  },

  [desktop]: {
    padding: '5rem 8em',
    flexDirection: 'column',
  },
});

const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  padding: '5rem 0',
});

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  globalStyles();

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
          <Header />

          <Main>
            <Component {...pageProps} />
          </Main>

          <Footer />
        </App>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
