/* config-overrides.js */
const {
  override,
  addBabelPlugins,
  addWebpackAlias,
  fixBabelImports,
  addLessLoader,
} = require('customize-cra');
const path = require('path');

module.exports = override(
  ...addBabelPlugins('@babel/plugin-proposal-optional-chaining', 'emotion'),
  addWebpackAlias({
    '@components': path.resolve(__dirname, 'src/components'),
    '@utilities': path.resolve(__dirname, 'src/utilities'),
    '@scenes': path.resolve(__dirname, 'src/scenes'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@images': path.resolve(__dirname, 'src/images'),
  }),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    // eg for modifying variables. refer to https://ant.design/docs/react/customize-theme#header
    // modifyVars: { '@primary-color': '#ff0000' },
  })
);
