const blacklist = require('metro-config/src/defaults/blacklist');
const { mergeConfig } = require("metro-config");
const path = require('path');
const pkg = require('./package.json');
const _ = require('lodash');

const config = {
    resolver: {
        providesModuleNodeModules: Object.keys(pkg.dependencies),
        extraNodeModules: {
            '@babel/runtime': path.resolve(__dirname, 'node_modules/@babel/runtime')
        }
    },
    watchFolders: [path.resolve(__dirname, '..')]
};

module.exports = config;