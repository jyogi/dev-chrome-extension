const webpack = require('webpack');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.jsx',
    content: './src/content.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'lib',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /.(js|jsx)$/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
