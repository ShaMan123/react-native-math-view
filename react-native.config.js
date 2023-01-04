//  https://github.com/react-native-community/cli/blob/5199d6af1aa6dc5d8dfb4a98e675987272d68998/docs/configuration.md

//const path = require('path');
//const root = __dirname;

module.exports = {
    dependency: {
        platforms: {
            android: {
                packageImportPath: "import io.autodidact.rnmathview.RNMathViewPackage;",
                packageInstance: "new RNMathViewPackage()"
            },
            ios: {}
        },
    },
};