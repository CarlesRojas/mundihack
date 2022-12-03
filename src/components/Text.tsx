import { styled } from '@styles/stitches.config';

const Text = styled('p', {
  fontSize: '1.1rem',

  variants: {
    red: {
      true: {
        color: '$red',
      },
    },
  },
});

export default Text;
