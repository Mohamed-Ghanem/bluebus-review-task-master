/** @jsx jsx */
import { jsx, Global, css } from '@emotion/core';
import { fontFace } from './font-generation-helper';

export const GlobalStyles = () => {
  return (
    <Global
      styles={css`
        ${fontFace('GE SS Two', 'GESSTwoLight-Light', 300)};
        ${fontFace('GE SS Two', 'GESSTwoMedium-Medium', 500)};
        html {
          direction: ltr;
          box-sizing: border-box;
          font-family: 'GE SS Two', sans-serif;
        }
        *,
        ::before,
        ::after {
          box-sizing: inherit;
        }
        html,
        body {
          scroll-behavior: smooth;
          padding: 0;
          margin: 0;
          line-height: 1.6;
        }
        body {
          background: #fff;
        }
      `}
    />
  );
};
