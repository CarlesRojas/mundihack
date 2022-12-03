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

  [tablet]: {
    padding: '3rem 4rem',
  },

  [desktop]: {
    padding: '5rem 8em',
    flexDirection: 'column',
  },
});

const Home: NextPage = () => {
  return (
    <App>
      <Header />
      <Footer />
    </App>
  );
};

export default Home;
