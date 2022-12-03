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
    },
    media: {
      tablet: '(min-width: 768px)',
      desktop: '(min-width: 1280px)',
      hover: '(any-hover: hover)',
      dark: '(prefers-color-scheme: dark)',
      light: '(prefers-color-scheme: light)'
    }
  }
});

// @mixin for-phone {
//   @media (orientation: portrait) and (max-width: 768px), (orientation: landscape) and (max-width: 950px) {
//       @content;
//   }
// }

// @mixin for-tablet {
//   @media (orientation: portrait) and (min-width: 768px), (orientation: landscape) and (min-width: 950px) {
//       @content;
//   }
// }

// @mixin for-desktop {
//   @media (orientation: portrait) and (min-width: 950px), (orientation: landscape) and (min-width: 1200px) {
//       @content;
//   }
// }

// @mixin for-mouse {
//   @media (hover: hover) {
//       @content;
//   }
// }

// @mixin for-landscape {
//   @media (orientation: landscape) {
//       @content;
//   }
// }
