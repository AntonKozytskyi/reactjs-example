// start.js

import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';
import run from './run';
import bundle from './bundle';
import serve from './serve';

global.WATCH = true;
const webpackAppConfig = webpackConfig[0]; // Client-side bundle configuration
const bundler = webpack(webpackAppConfig);

/**
 * Launches a development web server with "live reload" functionality -
 * synchronizing URLs, interactions and code changes across multiple devices.
 */
async function start() {
  await run(bundle);
  await run(serve);

  browserSync({
    proxy: {
      target: 'localhost:5000',
      middleware: [
        webpackDevMiddleware(bundler, {
          // IMPORTANT: dev middleware can't access config, so we should
          // provide publicPath by ourselves
          publicPath: webpackAppConfig.output.publicPath,

          // Pretty colored output
          stats: webpackAppConfig.stats

          // For other settings see
          // http://webpack.github.io/docs/webpack-dev-middleware.html
        }),

        // bundler should be the same as above
        webpackHotMiddleware(bundler)
      ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
      'src/public/css/*.css',
      'src/views/**/*.hbs'
    ]
  });
}

export default start;
