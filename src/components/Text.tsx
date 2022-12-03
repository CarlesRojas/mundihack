import { mouse } from '@styles/media';
import { styled } from '@styles/stitches.config';

const Text = styled('p', {
  fontSize: '1.1rem',

  variants: {
    red: {
      true: {
        color: '$red',
      },
    },
    disabled: {
      true: {
        textDecoration: 'line-through',
      },
    },
    underlined: {
      true: {
        textDecoration: 'underline',
      },
    },
    hover: {
      true: {
        [mouse]: {
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default Text;
