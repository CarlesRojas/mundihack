import BracketText from '@components/BracketText';
import Button from '@components/Button';
import useAutoResetState from '@hooks/useAutoResetState';
import { tablet } from '@styles/media';
import { styled } from '@styles/stitches.config';
import { AUTH_STATUS, ROUTE } from '@utils/constants';
import parseName from '@utils/parseName';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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

  const [clickedLink, setClickedLink] = useState<ROUTE | null>(null);

  const handleLinkClick = (link: ROUTE) => {
    setClickedLink(link);
    router.push(link);
  };

  const currentActive = clickedLink ? clickedLink : router.pathname;

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
          <BracketText
            onClick={() => handleLinkClick(ROUTE.CALENDAR)}
            text="calendar"
            red={currentActive === ROUTE.CALENDAR}
            selected={currentActive === ROUTE.CALENDAR}
            hover
          />

          <BracketText
            onClick={() => handleLinkClick(ROUTE.TEAMS)}
            text="teams"
            red={currentActive === ROUTE.TEAMS}
            selected={currentActive === ROUTE.TEAMS}
            hover
          />

          <BracketText
            onClick={() => handleLinkClick(ROUTE.PROJECTS)}
            text="projects"
            red={currentActive === ROUTE.PROJECTS}
            selected={currentActive === ROUTE.PROJECTS}
            hover
          />

          {status === AUTH_STATUS.AUTHENTICATED && (
            <BracketText
              onClick={() => handleLinkClick(ROUTE.YOUR_PROJECT)}
              text="your project"
              red={currentActive === ROUTE.YOUR_PROJECT}
              selected={currentActive === ROUTE.YOUR_PROJECT}
              hover
            />
          )}

          {status === AUTH_STATUS.AUTHENTICATED && sessionData?.user?.isAdmin && (
            <BracketText
              onClick={() => handleLinkClick(ROUTE.ADMIN)}
              text="admin"
              red={currentActive === ROUTE.ADMIN}
              selected={currentActive === ROUTE.ADMIN}
              hover
            />
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
