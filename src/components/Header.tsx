import Text from '@components/Text';
import useUser from '@hooks/useUser';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { signIn, signOut } from 'next-auth/react';
import { RiGoogleFill } from 'react-icons/ri';
import Button from './Button';

const Container = styled('header', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '0.5rem',

  [tablet]: {
    flexDirection: 'row',
  },
});

const Main = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const Logo = styled('div', {
  display: 'flex',
});

const LogoText = styled('p', {
  fontSize: '2rem',
  fontWeight: '500',

  variants: {
    red: {
      true: {
        color: '$red',
      },
    },
  },
});

const Header = () => {
  const user = useUser();

  const greeting = user
    ? `welcome to the first mundimoto hackathon, ${user.firstName}!`
    : 'welcome to the first mundimoto hackathon!';

  return (
    <Container>
      <Main>
        <Logo>
          <LogoText red>{'<mundi>'}</LogoText>
          <LogoText>{'hack'}</LogoText>
        </Logo>

        <Text>{greeting}</Text>
      </Main>

      {!user && <Button icon={<RiGoogleFill />} label={'log in with google'} onClick={() => signIn('google')} />}
      {user && <Button icon={<RiGoogleFill />} label={'log out'} onClick={() => signOut()} />}
    </Container>
  );
};

export default Header;
