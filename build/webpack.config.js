const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const rules = require("./rules");

const cwd = process.cwd();
const entry = path.resolve(cwd, 'app');
const outputPath = path.resolve(cwd, 'docs');
const mode = String.prototype.trim.call(process.env.NODE_ENV || '') === 'development' ? 'development' : 'production';
const optimization = {};

if (mode === 'production') {
  Object.assign(optimization, {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  })
}

module.exports = {
  entry,
  mode,
  optimization,
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    publicPath: './'
  },
  module: {
      rules: [rules.md, rules.tsx, rules.img, rules.css, rules.scss]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'jsx', '.md', '.jpg'],
    alias: {
      "@sources": path.resolve(cwd, 'sources'),
      "@templates": path.resolve(cwd, 'templates'),
      "@static": path.resolve(cwd, 'static'),
      "@components": path.resolve(cwd, 'components'),
      "@scss": path.resolve(cwd, 'scss'),
      "@app": path.resolve(cwd, 'app'),
      "@plug": path.resolve(cwd, 'plug-in'),
      "@comments": path.resolve(cwd, 'comments'),
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