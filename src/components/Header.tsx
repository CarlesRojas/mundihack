import Text from '@components/Text';
import { styled } from '@styles/stitches.config';

const Container = styled('header', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
});

const Logo = styled('div', {
  display: 'flex'
});

const LogoText = styled('header', {
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
  return (
    <Container>
      <Logo>
        <LogoText red>{'<mundi>'}</LogoText>
        <LogoText>{'hack'}</LogoText>
      </Logo>

      <Text>{'welcome to the first mundimoto hackathon!'}</Text>
    </Container>
  );
};

export default Header;
