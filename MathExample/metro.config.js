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
        blacklistRE: blacklist([
            path.resolve(__dirname, '../node_modules'),
        ]),
        providesModuleNodeModules: Object.keys(pkg.dependencies),
        extraNodeModules: {
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime'),
            'lodash': path.resolve(__dirname, 'node_modules/lodash'),
            'prop-types': path.resolve(__dirname, 'node_modules/prop-types'),
            'events': path.resolve(__dirname, 'node_modules/events')
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
