import { styled } from '@styles/stitches.config';
import { type NextPage } from 'next';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Teams: NextPage = () => {
  return <Container></Container>;
};

export default Teams;
