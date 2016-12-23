const webpack = require('webpack');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    content: './src/content.js',
    options: './src/options.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: 'lib',
    filename: '[name].js',
    publicPath: '/lib/'
  },
  eslint: {
    // @see https://github.com/MoOx/eslint-loader/tree/1.3.0#quiet-default-false
    quiet: true,
    emitError: true
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|es6|jsx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /.(js|jsx)$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /.css$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(ttf|eot|svg|woff[2]?)$/,
        loader: 'file'
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url',
        query: {
          limit: 4096
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};
