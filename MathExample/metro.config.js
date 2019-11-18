/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  resolver: {
    sourceExts: ['ts', 'tsx', 'js'],
    blacklistRE: blacklist([
      path.resolve(__dirname, '../node_modules/react'),
      path.resolve(__dirname, '../node_modules/react-native'),
      path.resolve(__dirname, '../node_modules/react-native-svg'),
      path.resolve(__dirname, '../MathExampl1e'),
    ]),
    extraNodeModules: {
      '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
      'lodash': path.resolve(__dirname, 'node_modules/lodash'),
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-svg': path.resolve(__dirname, 'node_modules/react-native-svg')
    }
  },
  watchFolders: [path.resolve(__dirname, '..')],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
