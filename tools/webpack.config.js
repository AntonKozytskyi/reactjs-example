// webpack.config.js

var webpack = require('webpack');
var merge = require('lodash.merge');
var path = require('path');
var fs = require('fs');
var nodeModules = {};

var DEBUG = global.DEBUG;
var VERBOSE = global.VERBOSE;

fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var config = {
  output: {
    publicPath: '/',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json']
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
};

var clientConfig = merge({}, config, {
  name: 'client',
  target: 'web',

  entry: [
    'webpack-hot-middleware/client',
    './src/app.js'
  ],
  output: {
    path: './src/public/js',
    filename: 'app.dist.js'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
});

var serverConfig = merge({}, config, {
  name: 'server',
  target: 'node',
  externals: nodeModules,
  debug: true,

  entry: './src/server.js',
  output: {
    path: './src',
    filename: 'server.dist.js',
    libraryTarget: 'commonjs2'
  }
});

module.exports = [clientConfig, serverConfig];
