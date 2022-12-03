import { desktop, laptop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import Footer from '@components/Footer';
import Header from '@components/Header';
import { keyframes } from '@stitches/react';
import globalStyles from '@styles/global';
import Head from 'next/head';
import { trpc } from '../utils/trpc';

const skewAnimation = keyframes({
  '0%': { transform: 'skew(0deg)' },
  '5%': { transform: 'skew(0.5deg)' },
  '10%': { transform: 'skew(0deg)' },
  '100%': { transform: 'skew(0deg)' },
});

const scanAnimation = keyframes({
  '0%': { transform: 'translateY(0)' },
  '30%': { transform: 'translateY(100vh)' },
  '100%': { transform: 'translateY(100vh)' },
});

const App = styled('div', {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  padding: '1rem',

  background: 'radial-gradient(transparent, rgba(0, 0, 0, 0.8))',
  backgroundSize: 'cover',

  [tablet]: {
    padding: '3rem 4rem',
  },

  [laptop]: {
    padding: '6rem 10em',
    flexDirection: 'column',
  },

  [desktop]: {
    padding: '8rem 16em',
    flexDirection: 'column',
  },
});

const Skew = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  animation: `${skewAnimation} 8s linear infinite`,
});

const Main = styled('main', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto',
  padding: '5rem 0',
});

const Lines = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(#888 50%, #000 0)',
  backgroundRepeat: 'repeat-y',
  backgroundSize: '100% 4px',
  zIndex: 10,
  opacity: 0.15,
  pointerEvents: 'none',
});

const ScanLine = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '2rem',
  zIndex: 10,
  pointerEvents: 'none',
  opacity: 0.05,
  background: 'linear-gradient(to bottom, transparent 0%, #888888 50%, transparent 100%)',
  animation: `${scanAnimation} 5s linear infinite`,
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
          <Skew>
            <Header />

            <Main>
              <Component {...pageProps} />
            </Main>

            <Footer />
          </Skew>

          <Lines />
          <ScanLine />
        </App>
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
