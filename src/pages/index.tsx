import Footer from '@components/Footer';
import Header from '@components/Header';
import { desktop, tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { type NextPage } from 'next';

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
  backgroundColor: 'hsla(0, 0%, 100%, 0.1)',
  overflow: 'auto',
});

const Home: NextPage = () => {
  return (
    <App>
      <Header />
      <Main />
      <Footer />
    </App>
  );
};

export default Home;
