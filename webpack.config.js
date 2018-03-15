// /* global __dirname, require, module*/
//
// // const MinifyPlugin = require('babel-minify-webpack-plugin');
// const path = require('path');
// const env = require('yargs').argv.env; // use --env with webpack 2
// const pkg = require('./package.json');
// const webpack = require('webpack');
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// let libraryName = pkg.name;
//
// let plugins = [], outputFile;
//
// // plugins.push(new webpack.LoaderOptionsPlugin({ options: {} }));
// plugins.push(new webpack.DefinePlugin({
//     'process.env.NODE_ENV': 'process.env.NODE_ENV'
// }));
//
//
// if (env === 'build') {
//     plugins.push( new UglifyJSPlugin({
//         uglifyOptions: {
//             compress: {
//                 drop_console: true
//             }
//         }
//     }));
//     outputFile = libraryName + '.min.js';
// } else {
//     plugins.push( new UglifyJSPlugin({
//         uglifyOptions: {
//             // sourceMap: true,
//             compress: {
//                 drop_console: true
//             },
//             output: {
//                 // comments: true,
//                 beautify: true,
//             },
//             extractComments: true
//         }
//     }));
//     outputFile = libraryName + '.js';
// }
//
// const config = {
//     target: 'node',
//     entry: __dirname + '/src/index.js',
//     devtool: 'source-map',
//     output: {
//         path: __dirname + '/lib',
//         filename: outputFile,
//         library: libraryName,
//         libraryTarget: 'umd',
//         umdNamedDefine: true
//     },
//     module: {
//         rules: [
//             // {
//             //     test: /(\.js)$/,
//             //     loader: 'babel-loader',
//             //     exclude: /(node_modules|test|\.spec\.js)/,
//             //     options: {
//             //         // plugins: ['transform-runtime'],
//             //         presets: ['es2015', 'stage-0'],
//             //     }
//             // },
//             {
//                 test: /(\.js)$/,
//                 loader: 'eslint-loader',
//                 exclude: /node_modules|test/
//             }
//         ]
//     },
//     // resolve: {
//     //     modules: [path.resolve('./node_modules'), path.resolve('./src')],
//     //     extensions: ['.json', '.js']
//     // },
//     plugins: plugins
// };
//
// module.exports = config;

module.exports = {
    target: 'node',
    entry: __dirname + '/src/index.js',
    output:{
        filename: './lib/lib.js'
    }
}