import { keyframes } from '@stitches/react';
import { styled } from '@styles/stitches.config';

const skewAnimation = keyframes({
  '0%': { transform: 'skew(0deg)' },
  '3%': { transform: 'skew(0.5deg)' },
  '6%': { transform: 'skew(0deg)' },
  '69%': { transform: 'skew(0deg)' },
  '63%': { transform: 'skew(-0.5deg)' },
  '66%': { transform: 'skew(0deg)' },
  '100%': { transform: 'skew(0deg)' },
});

const scanAnimation = keyframes({
  '0%': { transform: 'translateY(0)' },
  '30%': { transform: 'translateY(100vh)' },
  '100%': { transform: 'translateY(100vh)' },
});

const Skew = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  animation: `${skewAnimation} 8s linear infinite`,
  touchAction: 'none',
});

const Lines = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(#888 50%, #000 0)',
  backgroundRepeat: 'repeat-y',
  backgroundSize: '100% 4px',
  zIndex: 10,
  opacity: 0.15,
  pointerEvents: 'none',
});

const ScanLine = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '2rem',
  zIndex: 10,
  pointerEvents: 'none',
  opacity: 0.05,
  background: 'linear-gradient(to bottom, transparent 0%, #888888 50%, transparent 100%)',
  animation: `${scanAnimation} 5s linear infinite`,
});

interface EffectsProps {
  children: JSX.Element;
  disabled?: boolean;
}

const Effects = ({ children, disabled }: EffectsProps) => {
  if (disabled) return children;

  return (
    <>
      <Skew>{children}</Skew>
      <Lines />
      <ScanLine />
    </>
  );
};
export default Effects;
