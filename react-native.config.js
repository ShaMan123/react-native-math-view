
//  https://github.com/react-native-community/cli/blob/5199d6af1aa6dc5d8dfb4a98e675987272d68998/docs/configuration.md

module.exports = {
    // config for a library is scoped under "dependency" key
    dependency: {
        platforms: {
            //ios: {},
            android: {
                packageImportPath: 'import com.autodidact.rnmathview'
            }, // projects are grouped into "platforms"
        },
        assets: [
            "MathJaxProvider/index.html",
            "MathJaxProvider/dist"
        ],
        // hooks are considered anti-pattern, please avoid them
        hooks: {
            //prelink: './path-to-a-prelink-hook',
        },
    },
};