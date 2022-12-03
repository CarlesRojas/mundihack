import Footer from '@components/Footer';
import Header from '@components/Header';
import { styled } from '@styles/stitches.config';
import { type NextPage } from 'next';

const App = styled('main', {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '6rem 10rem'
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
