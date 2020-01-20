/**
 * Generate variations of fontface.
 *
 * @param {string} name
 * @param {string} src
 * @param {integer || string} fontWeight
 * @param {string} fontStyle
 *
 */
export const fontFace = (
  name,
  src,
  fontWeight = 'normal',
  fontStyle = 'normal'
) => {
  return `
    @font-face {
      font-family: '${name}';
      src: url(${require('../fonts/' + src + '.woff')});
      src:
        url(${require('../fonts/' + src + '.woff')}) format('woff'),
        url(${require('../fonts/' + src + '.ttf')}) format('truetype'),
        url(${require('../fonts/' + src + '.ttf')}) format('woff2'),
      font-style: ${fontStyle};
      font-weight: ${fontWeight};
      font-display: fallback;
    }
  `;
};
