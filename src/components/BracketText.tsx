import Text from '@components/Text';
import { styled } from '@styles/stitches.config';

const Container = styled('div', {
  display: 'flex',
  gap: '0.5rem',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

interface BracketTextProps {
  text: string;
  red?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hover?: boolean;
}

const BracketText = ({ text, red, selected, disabled, hover }: BracketTextProps) => {
  return (
    <Container disabled={disabled}>
      <Text red={red}>{'['}</Text>

      <Text red={red} underlined={selected} disabled={disabled} hover={hover}>
        {text}
      </Text>

      <Text red={red}>{']'}</Text>
    </Container>
  );
};

export default BracketText;
