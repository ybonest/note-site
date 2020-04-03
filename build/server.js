const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');
const compiler = webpack(webpackConfig);

new WebpackDevServer(compiler, {
  compress: true,
  open: true,
  stats: {
    colors: true,
  },
  disableHostCheck: true,
  historyApiFallback: {
    index: '/assets/index.html'
  },
  watchContentBase: true,
  hot: true
}).listen(8080);
