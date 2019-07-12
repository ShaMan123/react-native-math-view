
//  https://github.com/react-native-community/cli/blob/5199d6af1aa6dc5d8dfb4a98e675987272d68998/docs/configuration.md

const path = require('path');
const root = __dirname; //path.resolve(process.cwd(), 'node_modules/react-native-math-view');

module.exports = {
    // config for a library is scoped under "dependency" key
    dependency: {
        platforms: {
            android: {
                sourceDir: path.resolve(root, 'android'),
                //folder: root,
                packageImportPath: "import io.autodidact.rnmathview.RNMathViewPackage;",
                packageInstance: "new RNMathViewPackage()"
            },
        },
        assets: [
            "MathJaxProvider/index.html",
            "MathJaxProvider/dist"
        ],
    },
};