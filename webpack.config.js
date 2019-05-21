const path = require('path');
const webpack = require('webpack');
const mode = process.argv[2] === '--watch' ? 'development' : 'production';
const base = path.resolve(__dirname, 'MathJaxProvider');
module.exports = {
    mode,        //'production'|'development'
    entry: path.resolve(base, 'index.tsx'),
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(base, 'dist'),
        globalObject: 'this'
    }
};
