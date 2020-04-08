const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const mode = String.prototype.trim.call(process.env.NODE_ENV || '') === 'development' ? 'development' : 'production';
const devMode = mode !== 'production';

module.exports.md = {
  test: /\.md$/,
  use: [
    { loader: "html-loader" },
    { loader: path.resolve(__dirname, 'markdown-loader') }
  ]
}

module.exports.css =  {
  test: /\.css$/,
  use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader']
}

module.exports.scss = {
  test: /\.scss$/,
  use: [
    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader"
  ]
}

module.exports.tsx = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: "babel-loader" 
}

module.exports.img = {
  test: /\.(png|jpg|gif)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 8192,
        // outputPath: path.resolve(process.cwd(), 'docs')
      }
    },
  ]
}