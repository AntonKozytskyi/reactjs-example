// build.js

var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

var WATCH = global.WATCH;

/**
 * Bundles JavaScript, CSS and images into one or more packages
 * ready to be used in a browser.
 */
function bundle() {
  return new Promise(function(resolve, reject) {
    var bundler = webpack(webpackConfig);
    var bundlerRunCount = 0;

    function onComplete(err, stats) {
      if (err) {
        return reject(err);
      }

      console.log(stats.toString(webpackConfig[0].stats));

      if (++bundlerRunCount === (WATCH ? webpackConfig.length : 1)) {
        return resolve();
      }
    }

    if (WATCH) {
      bundler.watch(200, onComplete);
    } else {
      bundler.run(onComplete);
    }
  });
}

module.exports = bundle;
