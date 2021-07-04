const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./src/public/index.js",

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          publicPath: "img",
          outputPath: "img",
        },
      },
      {
        test: /\.scss$/,
        use: [ 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
        options: {
          partialDirs: path.join(__dirname, "src/public/views/layout"),
          helperDirs: path.join(__dirname, "./src/public/views/helpers"),
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/public/views/index.handlebars",
      title: "Travel App",
    }),
    new Dotenv({ path: "./config/.env", systemvars: true }),
  ],
  output: {
    chunkFilename: "[name].bundle.js",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  optimization: {
    usedExports: true,
  },
};