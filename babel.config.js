module.exports = function (api) {
  api.cache(true)
    return {
        "presets": ["module:metro-react-native-babel-preset"],
        "plugins": [
            ["module-resolver", {
                "root": ["./src"],
                "extensions": [".js", ".ts", ".tsx", ".ios.js", ".android.js"]
            }],
            ["babel-plugin-inline-import", {
                "extensions": [
                    ".svg"
                ]
            }]
        ],
        "env": {
            "production": {
                "plugins": ["transform-remove-console"]
            }
        }
    };
}

//  https://github.com/facebook/react-native/issues/21475#issuecomment-432509636
