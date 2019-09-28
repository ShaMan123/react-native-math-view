/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */


const blacklist = require('metro-config/src/defaults/blacklist');
const { mergeConfig } = require("metro-config");
const path = require('path');
const pkg = require('./package.json');

module.exports = {
    resolver: {
        sourceExts: ['ts', 'tsx', 'js'],
        blacklistRE: blacklist([
            path.resolve(__dirname, '../node_modules/react'),
            path.resolve(__dirname, '../node_modules/react-native'),
        ]),
        providesModuleNodeModules: Object.keys(pkg.dependencies),
        extraNodeModules: {
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            'lodash': path.resolve(__dirname, 'node_modules/lodash'),
            'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
            'events': path.resolve(__dirname, 'node_modules/events'),
            'mathjax-full': path.resolve(__dirname, '../node_modules/mathjax-full'),
            'transformation-matrix': path.resolve(__dirname, '../node_modules/transformation-matrix'),
            //'@react-native-community/async-storage': path.resolve(__dirname, '../node_modules/@react-native-community/async-storage'),
            //'react-native-webview': path.resolve(__dirname, '../node_modules/react-native-webview'),
        }
    },
    watchFolders: [path.resolve(__dirname, '..')],
    transformer: {
        babelTransformerPath: require.resolve('react-native-typescript-transformer'),
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false,
            },
        }),
    },
};
