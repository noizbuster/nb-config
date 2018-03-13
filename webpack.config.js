/* global __dirname, require, module*/

const MinifyPlugin = require('babel-minify-webpack-plugin');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');

let libraryName = pkg.name;

let plugins = [], outputFile;

if (env === 'build') {
    plugins.push(new MinifyPlugin());
    outputFile = libraryName + '.min.js';
} else {
    outputFile = libraryName + '.js';
}

const config = {
    target: 'node',
    entry: __dirname + '/src/index.js',
    devtool: 'cheap-source-map',
    output: {
        path: __dirname + '/lib',
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components|test)/,
                options: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015', 'stage-0'],
                }
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'eslint-loader',
                exclude: /node_modules|test/
            }
        ]
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./src')],
        extensions: ['.json', '.js']
    },
    plugins: plugins
};

module.exports = config;
