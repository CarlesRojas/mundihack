import { createStitches } from '@stitches/react';

export const { styled, css, globalCss, getCssText } = createStitches({
  theme: {
    colors: {
      background: '#171717',
      text: 'white',
      red: '#ED0022'
    },
    fontSizes: {
      main: '16px'
    },
    fonts: {
      main: 'Montserrat, sans-serif'
    }
  }
});
