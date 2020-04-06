const path = require('path');

module.exports.md =   {
  test: /\.md$/,
  use: [
    { loader: "html-loader" },
    { loader: path.resolve(__dirname, 'markdown-loader') }
  ]
}

module.exports.css =  {
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

module.exports.scss = {
  test: /\.scss$/,
  use: [
    "style-loader",
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