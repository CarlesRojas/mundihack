import Text from '@components/Text';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { signIn, signOut, useSession } from 'next-auth/react';
import { RiGithubFill } from 'react-icons/ri';
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
  const { data: sessionData } = useSession();

  return (
    <Container>
      <Main>
        <Logo>
          <LogoText red>{'<mundi>'}</LogoText>
          <LogoText>{'hack'}</LogoText>
        </Logo>

        <Text>{'welcome to the first mundimoto hackathon!'}</Text>
      </Main>

      {!sessionData && (
        <Button
          icon={<RiGithubFill />}
          label={'log in with GitHub'}
          onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000' })}
        />
      )}
      {sessionData && <Button icon={<RiGithubFill />} label={'log out'} onClick={() => signOut()} />}
    </Container>
  );
};

export default Header;
