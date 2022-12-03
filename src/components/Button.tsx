import { mouse } from '@styles/media';
import { styled } from '@styles/stitches.config';
import type { ComponentPropsWithoutRef } from 'react';
import Text from './Text';

const OldButton = styled('button', {
  fontSize: '2rem',
  fontWeight: '500',
  backgroundColor: 'hsla(0, 0%, 100%, 0.85)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.25rem 0.5rem',
  height: 'fit-content',
  boxShadow: '0 0.5rem 0 0 hsla(0, 0%, 100%, 0.5)',
  width: 'fit-content',

  [mouse]: {
    '&:hover': {
      translate: '0 0.25rem',
      boxShadow: '0 0.25rem 0 0 hsla(0, 0%, 100%, 0.5)',
    },
  },

  svg: {
    color: 'black',
    fontSize: '2rem',
  },
});

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon: JSX.Element;
  label: string;
}

const Button = ({ icon, label, ...rest }: ButtonProps) => {
  return (
    <OldButton {...rest}>
      {icon}
      <Text css={{ color: 'black' }}>{label}</Text>
    </OldButton>
  );
};

export default Button;
