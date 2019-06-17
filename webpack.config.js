const path = require('path');
const webpack = require('webpack');
const isDebug = process.argv.some((arg) => arg === '--debug' || arg === '--dev');
const mode = isDebug ? 'development' : 'production';
const base = path.resolve(__dirname, 'MathJaxProvider');
module.exports = {
    mode,        //'production'|'development'
    entry: path.resolve(base, 'index.web.tsx'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.web.tsx?$/,
                use: ['ts-loader',/*'babel-loader'*/],
                exclude:/node_modules/
                //exclude: [path.resolve('./node_modules'), path.resolve('./RNMathExample')],
                //include: [path.resolve('./MathJaxProvider')]
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'node_modules': path.join(__dirname, 'node_modules'),
            'mathjax': path.join(__dirname, 'node_modules/mathjax/unpacked/MathJax.js'),
            'bower_modules': path.join(__dirname, 'bower_modules'),
        }
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(base, 'dist'),
        globalObject: 'this'
    },
    plugins: [
        new webpack.DefinePlugin({
            //'process.env.NODE_ENV': mode,
            'process.env.BROWSER': true,
            __DEV__: isDebug,
        })
    ],
};
