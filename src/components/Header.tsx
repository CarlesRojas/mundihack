import BracketText from '@components/BracketText';
import Button from '@components/Button';
import NextLink from '@components/NextLink';
import useAutoResetState from '@hooks/useAutoResetState';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { AUTH_STATUS, ROUTE } from '@utils/constants';
import parseName from '@utils/parseName';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { RiGoogleFill } from 'react-icons/ri';
import Loading from './Loading';
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
    clickable: {
      true: {
        cursor: 'pointer',
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
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  const [showEasterEgg, setShowEasterEgg] = useAutoResetState(false, 5000);
  const [clicks, setClicks] = useAutoResetState(0, 500);
  const handleLogoClick = () => {
    setClicks((prev: number) => prev + 1);
  };

  useEffect(() => {
    if (clicks >= 5) setShowEasterEgg(true);
  }, [clicks, setShowEasterEgg]);

  const parsedName = parseName(sessionData?.user?.name);

  return (
    <Container>
      <Main>
        <Logo>
          <LogoText red>{'<mundi>'}</LogoText>
          <LogoText clickable onClick={handleLogoClick}>
            {showEasterEgg ? 'paco' : 'hack'}
          </LogoText>
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

          {status === AUTH_STATUS.AUTHENTICATED && (
            <NextLink href={ROUTE.YOUR_PROJECT}>
              <BracketText
                text="your project"
                red={router.pathname === ROUTE.YOUR_PROJECT}
                selected={router.pathname === ROUTE.YOUR_PROJECT}
                hover
              />
            </NextLink>
          )}

          {status === AUTH_STATUS.AUTHENTICATED && sessionData?.user?.isAdmin && (
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

      {status === AUTH_STATUS.LOADING && <Loading />}

      {status === AUTH_STATUS.UNAUTHENTICATED && (
        <Button icon={<RiGoogleFill />} label={'log in with google'} onClick={() => signIn('google')} />
      )}

      {status === AUTH_STATUS.AUTHENTICATED && (
        <User>
          <Button icon={<RiGoogleFill />} label={'log out'} onClick={() => signOut()} />
          <Text>{parsedName.fullName ?? ''}</Text>
        </User>
      )}
    </Container>
  );
};

export default Header;
