const blacklist = require('metro-config/src/defaults/blacklist');
const { mergeConfig } = require("metro-config");
const path = require('path');
const pkg = require('./package.json');
const _ = require('lodash');
const configB = require('../metro.config') || {};

const config = {
    resolver: {
        providesModuleNodeModules: Object.keys(pkg.dependencies)
    },
    watchFolders: [path.resolve(__dirname, '..')],
};

module.exports = mergeConfig(config, configB);