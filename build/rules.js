const path = require('path');

module.exports.md =   {
  test: /\.md$/,
  use: [
    { loader: "html-loader" },
    {
      loader: "markdown-loader",
      options: {
        pedantic: true,
      }
    }
    // { loader: path.resolve(__dirname, 'markdown-loader') }
  ]
}

module.exports.css = {}

module.exports.tsx = {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  loader: "babel-loader" 
}

module.exports.img = {
  test: /\.(png|jpg|gif)$/,
  use: [
    {
      loader: 'file-loader',
      options: {},
    },
  ]
}