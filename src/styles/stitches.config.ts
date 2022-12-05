import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, getCssText } = createStitches({
  theme: {
    colors: {
      background: '#393939', //'#171717',
      text: 'white',
      red: '#ED0022',
      yellow: '#F9D71C',
    },
    fontSizes: {
      main: '16px',
    },
    fonts: {
      main: "'Fira Mono', monospace",
    },
  },
});
