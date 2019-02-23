const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  devtool: "cheap-module-eval-source-map",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "bundle.css",
      chunkFilename: "whatever.css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }
      }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
};
