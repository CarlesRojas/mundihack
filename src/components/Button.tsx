import Text from '@components/Text';
import { mouse } from '@styles/media';
import { styled } from '@styles/stitches.config';
import type { ComponentPropsWithoutRef } from 'react';
import Loading from './Loading';

const OldButton = styled('button', {
  fontSize: '2rem',
  fontWeight: '500',
  backgroundColor: 'hsla(0, 0%, 100%, 0.85)',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.25rem 0.5rem 0.85rem',
  height: 'fit-content',
  boxShadow: 'inset 0 -0.6rem 0 0 hsla(0, 0%, 0%, 0.5)',
  width: 'fit-content',

  [mouse]: {
    '&:hover': {
      marginTop: '0.2rem',
      padding: '0.25rem 0.5rem 0.65rem',
      boxShadow: 'inset 0 -0.4rem 0 0 hsla(0, 0%, 0%, 0.5)',
    },
  },

  '&:active': {
    marginTop: '0.4rem',
    padding: '0.25rem 0.5rem 0.45rem',
    boxShadow: 'inset 0 -0.2rem 0 0 hsla(0, 0%, 0%, 0.5)',
  },

  svg: {
    color: 'black',
    fontSize: '1.5rem',
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },
});

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  icon: JSX.Element;
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const Button = ({ icon, label, isDisabled, isLoading, ...rest }: ButtonProps) => {
  return (
    <OldButton disabled={isDisabled} {...rest}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {icon}
          <Text css={{ color: 'black' }}>{label}</Text>
        </>
      )}
    </OldButton>
  );
};

export default Button;
