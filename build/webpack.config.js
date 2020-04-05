const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const rules = require("./rules");

const cwd = process.cwd();
const entry = path.resolve(cwd, 'app');
const outputPath = path.resolve(cwd, 'docs');
const mode = String.prototype.trim.call(process.env.NODE_ENV) === 'development' ? 'development' : 'production';

module.exports = {
  entry,
  mode,
  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: './'
  },
  module: {
      rules: [rules.md, rules.tsx, rules.img, rules.css, rules.scss]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx', '.md'],
    alias: {
      "@sources": path.resolve(cwd, 'sources'),
      "@templates": path.resolve(cwd, 'templates'),
      "@static": path.resolve(cwd, 'static'),
      "@components": path.resolve(cwd, 'components'),
      "@scss": path.resolve(cwd, 'scss'),
      "@app": path.resolve(cwd, 'app'),
      "@plug": path.resolve(cwd, 'plug-in'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
      hash: true,
      path: outputPath
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}