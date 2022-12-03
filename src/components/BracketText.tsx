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
  selected?: boolean;
  disabled?: boolean;
  hover?: boolean;
}

const BracketText = ({ text, selected, disabled, hover }: BracketTextProps) => {
  return (
    <Container disabled={disabled}>
      <Text red={selected}>{'['}</Text>

      <Text red={selected} underlined={selected} disabled={disabled} hover={hover}>
        {text}
      </Text>

      <Text red={selected}>{']'}</Text>
    </Container>
  );
};

export default BracketText;
