/*import path from 'path';
import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
*/

const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            { 
                test: /\.(sa|sc|c)ss$/,
                use: ["style-loader", "css-loader"]
        
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
        new WorkboxPlugin.GenerateSW()
    ],
    output: {
        libraryTarget: 'var',
        library: 'Client'
    }
}
