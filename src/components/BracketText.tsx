import Text from '@components/Text';
import { styled } from '@styles/stitches.config';
import type { ComponentPropsWithoutRef } from 'react';

const Container = styled('div', {
  display: 'flex',
  gap: '0.5rem',

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
      },
    },
    hover: {
      true: {
        cursor: 'pointer',
      },
    },
  },
});

interface BracketTextProps extends ComponentPropsWithoutRef<'div'> {
  text: string;
  red?: boolean;
  selected?: boolean;
  disabled?: boolean;
  hover?: boolean;
  as?: string;
}

const BracketText = ({ text, red, selected, disabled, hover, ...rest }: BracketTextProps) => {
  return (
    <Container disabled={disabled} {...rest} hover>
      <Text red={red}>{'['}</Text>

      <Text red={red} underlined={selected} disabled={disabled} hover={hover}>
        {text}
      </Text>

      <Text red={red}>{']'}</Text>
    </Container>
  );
};

export default BracketText;
