import { mouse } from '@styles/media';
import { styled } from '@styles/stitches.config';

const Text = styled('p', {
  fontSize: '1.1rem',
  fontWeight: '500',

  variants: {
    red: {
      true: {
        color: '$red',
        opacity: '1 !important',
      },
    },
    yellow: {
      true: {
        color: '$yellow',
        opacity: '1 !important',
      },
    },
    pre: {
      true: {
        whiteSpace: 'pre',
      },
    },
    disabled: {
      true: {
        pointerEvents: 'none',
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
    low: {
      true: {
        opacity: 0.5,
      },
    },
    inputCursor: {
      true: {
        [mouse]: {
          cursor: 'text',
        },
      },
    },
  },
});

export default Text;
