import type { ComponentProps } from '@stitches/react';
import { keyframes } from '@stitches/react';
import { styled } from '@styles/stitches.config';
import { RiLoaderFill } from 'react-icons/ri';
import Text from './Text';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const Spinner = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',

  svg: {
    fontSize: '1.5rem',
    animation: `${spin} 2s linear infinite`,
  },
});

interface LoadingProps extends ComponentProps<typeof Spinner> {
  showLabel?: boolean;
}

const Loading = ({ showLabel, ...rest }: LoadingProps) => {
  return (
    <Spinner {...rest}>
      <RiLoaderFill />
      {showLabel && <Text>loading...</Text>}
    </Spinner>
  );
};

export default Loading;
