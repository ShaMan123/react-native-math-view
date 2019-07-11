//  https://github.com/react-native-community/cli/blob/5199d6af1aa6dc5d8dfb4a98e675987272d68998/docs/configuration.md

const cwd = process.cwd();
const path = require('path');
const root = path.resolve(__dirname, '..');
const config = require('../react-native.config');

module.exports = {
    dependencies: {
        'react-native-math-view': {
            root,
            ...config.dependency
        }
    },
};