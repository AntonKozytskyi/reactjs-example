// start.js

var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('./webpack.config')[0]; // Client-side bundle configuration
var build = require('./build');
var serve = require('./serve');

var bundler = webpack(webpackConfig);

global.DEBUG = true;
global.VERBOSE = true;
global.WATCH = true;

module.exports = function() {
  build();
  serve();

  browserSync({
    proxy: {
      target: 'localhost:3000',
      middleware: [
        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackConfig.output.publicPath,

          // Pretty colored output
          stats: webpackConfig.stats

          // For other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler)
      ]
    },
    files: [
      'src/public/css/*.css',
      'src/views/**/*.hbs'
    ]
  });
};
