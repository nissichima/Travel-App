const path = require('path')
const common = require("./webpack.config.js")
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    entry: './src/client/index.js',
    devtool: 'source-map',
    stats: 'verbose',
                module: {
                    rules: [
                        {
                            test: '/\.js$/',
                            exclude: /node_modules/,
                            loader: "babel-loader"
                        },
                        {
                            test: /\.(sa|sc|c)ss$/,
                            use: [ 'style-loader', 'css-loader', 'sass-loader' ]
                        },
                        {
                            test: /\.(png|jpg|gif)$/i,
                            loader: "file-loader",
                            options: {
                                publicPath: "img",
                                outputPath: "img",
                            },
                        },  
                    ]
                },    
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        })
    ],
    output: {
        libraryTarget: 'var',
        library: 'Client'
    }
};
