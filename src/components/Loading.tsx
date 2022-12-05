import { keyframes } from '@stitches/react';
import { styled } from '@styles/stitches.config';
import { RiLoaderFill } from 'react-icons/ri';

const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

const Spinner = styled('div', {
  animation: `${spin} 2s linear infinite`,
});

const Loading = () => {
  return (
    <Spinner>
      <RiLoaderFill />
    </Spinner>
  );
};

export default Loading;
