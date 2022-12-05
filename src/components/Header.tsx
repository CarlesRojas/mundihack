import BracketText from '@components/BracketText';
import Button from '@components/Button';
import NextLink from '@components/NextLink';
import useSessionUser from '@server/hooks/useSessionUser';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { ROUTE } from '@utils/constants';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { RiGoogleFill } from 'react-icons/ri';
import Text from './Text';

const Container = styled('header', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1rem',
  touchAction: 'none',

  [tablet]: {
    flexDirection: 'row',
  },
});

const Main = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
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

const Links = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem 1rem',
});

const User = styled('div', {
  height: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
});

const Header = () => {
  const user = useSessionUser();
  const router = useRouter();

  return (
    <Container>
      <Main>
        <Logo>
          <LogoText red>{'<mundi>'}</LogoText>
          <LogoText>{'hack'}</LogoText>
        </Logo>

        <Links>
          <NextLink href={ROUTE.CALENDAR}>
            <BracketText
              text="calendar"
              red={router.pathname === ROUTE.CALENDAR}
              selected={router.pathname === ROUTE.CALENDAR}
              hover
            />
          </NextLink>

          <NextLink href={ROUTE.TEAMS}>
            <BracketText
              text="teams"
              red={router.pathname === ROUTE.TEAMS}
              selected={router.pathname === ROUTE.TEAMS}
              hover
            />
          </NextLink>

          <NextLink href={ROUTE.PROJECTS}>
            <BracketText
              text="projects"
              red={router.pathname === ROUTE.PROJECTS}
              selected={router.pathname === ROUTE.PROJECTS}
              hover
            />
          </NextLink>

          {user && (
            <NextLink href={ROUTE.YOUR_PROJECT}>
              <BracketText
                text="your project"
                red={router.pathname === ROUTE.YOUR_PROJECT}
                selected={router.pathname === ROUTE.YOUR_PROJECT}
                hover
              />
            </NextLink>
          )}

          {user && user.isAdmin && (
            <NextLink href={ROUTE.ADMIN}>
              <BracketText
                text="admin"
                red={router.pathname === ROUTE.ADMIN}
                selected={router.pathname === ROUTE.ADMIN}
                hover
              />
            </NextLink>
          )}
        </Links>
      </Main>

      {!user && <Button icon={<RiGoogleFill />} label={'log in with google'} onClick={() => signIn('google')} />}
      {user && (
        <User>
          <Button icon={<RiGoogleFill />} label={'log out'} onClick={() => signOut()} />
          <Text>{user.fullName ?? ''}</Text>
        </User>
      )}
    </Container>
  );
};

export default Header;
