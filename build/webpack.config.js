const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const rules = require("./rules");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const cwd = process.cwd();
const entry = path.resolve(cwd, 'app');
const outputPath = path.resolve(cwd, 'docs');
const mode = String.prototype.trim.call(process.env.NODE_ENV || '') === 'development' ? 'development' : 'production';
const devMode = mode !== 'production';
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
      cacheGroups: {
        react: {
          test:  /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          chunks: "all",
          priority: 0
        },
        antd: {
          test:  /[\\/]node_modules[\\/](antd|styled-components)[\\/]/,
          name: 'antd',
          chunks: "all",
          priority: -1
        },
        'async-commons': { // 异步加载公共包、组件等
          chunks: 'async',
          minChunks: 2,
          name: 'async-commons',
          priority: -2,
         },
        commons: {
          name: 'common',
          chunks: 'initial',
          priority: -3,
          minChunks: 2,
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
  devtool: devMode ? 'cheap-module-eval-source-map' : 'eval',
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
    extensions: ['.tsx', '.ts', '.js', 'jsx', '.md', '.jpg', '.png'],
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
      favicon: './static/favicon.jpg',
      inject: true,
      hash: true,
      path: outputPath
    }),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new OptimizeCSSAssetsPlugin({})
  ]
}