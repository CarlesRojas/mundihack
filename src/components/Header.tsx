import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import { trpc } from '@utils/trpc';
import { RiGithubFill } from 'react-icons/ri';
import Button from './Button';

const Container = styled('header', {
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between'
});

const Main = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
});

const Logo = styled('div', {
  display: 'flex'
});

const LogoText = styled('p', {
  fontSize: '2rem',
  fontWeight: '500',

  variants: {
    red: {
      true: {
        color: '$red'
      }
    }
  }
});

const Header = () => {
  const { data } = trpc.public.getSession.useQuery();

  console.log(data);
  const handleClick = () => {
    console.log('click');
  };

  return (
    <Container>
      <Main>
        <Logo>
          <LogoText red>{'<mundi>'}</LogoText>
          <LogoText>{'hack'}</LogoText>
        </Logo>

        <Text>{'welcome to the first mundimoto hackathon!'}</Text>
      </Main>

      <Button icon={<RiGithubFill />} label={'log in with GitHub'} onClick={handleClick} />
    </Container>
  );
};

export default Header;
