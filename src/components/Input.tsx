import useDidMount from '@hooks/useDidMount';
import useFocus from '@hooks/useFocus';
import { mouse } from '@styles/media';
import { styled } from '@styles/stitches.config';
import type { ComponentPropsWithoutRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import Text from './Text';

const Container = styled('div', {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: '0.5rem',

  [mouse]: {
    '&:hover': {
      cursor: 'text',
    },
  },
});

const Inline = styled('div', {
  display: 'flex',
  gap: '0.5rem',
});

const Tab = styled('div', {
  width: '1rem',
});

const StyledInput = styled('input', {
  width: '100%',
  backgroundColor: 'transparent',
  padding: '0 1rem',
  outline: 'none !important',
  border: 'none',
  fontSize: '1.1rem',
  fontWeight: '500',
  color: '$white',
  pointerEvents: 'none',
  opacity: '0.5',

  variants: {
    active: {
      true: {
        pointerEvents: 'all',
        opacity: '1',
      },
    },
  },
});

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  id: string;
  label: string;
  error?: string;
  register?: UseFormRegisterReturn;
  isLoading?: boolean;
  isDisabled?: boolean;
  focusOnMount?: boolean;
}

const Input = ({ id, label, error, register, isLoading, isDisabled, focusOnMount, ...rest }: InputProps) => {
  const { focusRef, isFocused } = useFocus(focusOnMount);

  useDidMount(() => {
    focusRef.current = document.getElementById(id) as HTMLInputElement;
  });

  return (
    <Container>
      <Inline>
        <Text low red={isFocused} as="label" htmlFor={id} inputCursor>
          {label}
        </Text>
        <Text yellow as="label" htmlFor={id} inputCursor>
          {error || ''}
        </Text>
      </Inline>

      <Inline>
        <Tab />
        <Text red={isFocused} inputCursor>
          {'>'}
        </Text>
        <StyledInput
          id={id}
          type="text"
          disabled={isLoading || isDisabled}
          active={!isLoading && !isDisabled}
          autoComplete="off"
          {...register}
          {...rest}
        />
      </Inline>
    </Container>
  );
};

export default Input;
