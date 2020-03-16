const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    'pocket-lib': path.resolve(__dirname, 'src/index.js'),
    'tracker': path.resolve(__dirname, 'src/tracker.js'),
    'Evaluator': path.resolve(__dirname, 'src/Evaluator.js'),
    'base64': path.resolve(__dirname, 'src/base64.js'),
    'useTracker': path.resolve(__dirname, 'src/hooks/useTracker.js'),
    'useScrollToTopOnNewLocation': path.resolve(__dirname, 'src/hooks/useScrollToTopOnNewLocation.js'),
    'useQueryString': path.resolve(__dirname, 'src/hooks/useQueryString.js')
  },
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'commonjs2'
  },
  devtool: 'none',
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src/'),
      hooks: path.resolve(__dirname, 'src/hooks')
    }
  },
  module: {
    rules: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  externals: {
    'esprima': 'esprima', // Note that esprima must be imported as commonjs and NOT commonjs2!!!
    'react': 'react',
    'react-dom': 'react-dom',
    'react-router-dom': 'react-router-dom'
  }
};
