import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import { type NextPage } from 'next';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Separator = styled('div', {
  width: '100%',
  height: '2rem',
});

const Calendar: NextPage = () => {
  return (
    <Container>
      <Text>{'26-27 Jan 2023'}</Text>
      <Separator />

      <Text>{'___day 1_____________________'}</Text>
      <Text css={{ marginLeft: '2rem' }}>{'10h inauguration'}</Text>
      <Text css={{ marginLeft: '2rem' }}>{'21h pizzas'}</Text>
      <Separator />

      <Text>{'___day 2_____________________'}</Text>
      <Text css={{ marginLeft: '2rem' }}>{'16h demos'}</Text>
      <Text css={{ marginLeft: '2rem' }}>{'18h voting and winners'}</Text>
    </Container>
  );
};

export default Calendar;
