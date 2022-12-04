import Effects from '@components/Effects';
import Footer from '@components/Footer';
import Header from '@components/Header';
import usePusher from '@hooks/usePusher';
import globalStyles from '@styles/global';
import { desktop, laptop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';

const App = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  padding: '1rem',
  background: 'radial-gradient(transparent, rgba(0, 0, 0, 0.8))',
  backgroundSize: 'cover',
  touchAction: 'none',

  [tablet]: { padding: '3rem 4rem' },
  [laptop]: { padding: '6rem 10em', flexDirection: 'column' },
  [desktop]: { padding: '8rem 16em' },
});

const Container = styled('div', {
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'auto minmax(0, 1fr) auto',
  gridTemplateColumns: 'minmax(0, 1fr)',
  rowGap: '1rem',
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
  const pusher = usePusher();

  useEffect(() => {
    pusher.connect();
  }, [pusher]);

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
          <Effects disabled>
            <Container>
              <Header />

              <Main>
                <Component {...pageProps} pusher={pusher} />
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
