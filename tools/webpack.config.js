// webpack.config.js

import webpack from 'webpack';
import merge from 'lodash.merge';
import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');
const WATCH = global.WATCH === undefined ? false : global.WATCH;
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  __DEV__: DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------
const config = {
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
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../node_modules/react-routing/src'),
          path.resolve(__dirname, '../src')
        ],
        loader: 'babel-loader'
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.txt$/,
        loader: 'raw-loader'
      }, {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }, {
        test: /\.scss$/,
        loader: 'style-loader/useable!css-loader'
      }
    ]
  }
};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------
const appConfig = merge({}, config, {
  name: 'client',
  target: 'web',

  entry: {
    app: [
      ...(WATCH ? ['webpack-hot-middleware/client'] : []),
      './src/app.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../src/public/js'),
    filename: DEBUG ? '[name].js?[hash]' : '[name].[hash].js'
  },

  devtool: DEBUG ? 'cheap-module-eval-source-map' : false,
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new AssetsPlugin({
      path: path.join(__dirname, '../src/public'),
      filename: 'assets.json'
    }),
    ...(!DEBUG ? [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: VERBOSE
        }
      }),
      new webpack.optimize.AggressiveMergingPlugin()
    ] : []),
    ...(WATCH ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : [])
  ]
});

// Enable React Transform in the "watch" mode
appConfig.module.loaders
  .filter(x => WATCH && x.loader === 'babel-loader')
  .forEach(x => x.query = {
    // Wraps all React components into arbitrary transforms
    // https://github.com/gaearon/babel-plugin-react-transform
    plugins: ['react-transform'],
    extra: {
      'react-transform': {
        transforms: [
          {
            transform: 'react-transform-hmr',
            imports: ['react'],
            locals: ['module']
          }, {
            transform: 'react-transform-catch-errors',
            imports: ['react', 'redbox-react']
          }
        ]
      }
    }
  });

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------
const serverConfig = merge({}, config, {
  name: 'server',
  target: 'node',

  entry: './src/server.js',
  output: {
    path: './src',
    filename: 'server.dist.js',
    libraryTarget: 'commonjs2'
  },

  externals: [
    /^\.\/assets\.json$/,
    function filter(context, request, cb) {
      const isExternal =
        request.match(/^[@a-z][a-z\/\.\-0-9]*$/i) &&
        !request.match(/^react-routing/) &&
        !context.match(/[\\/]react-routing/);
      cb(null, Boolean(isExternal));
    }
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false })
  ]
});

// Remove `style-loader` from the server-side bundle configuration
serverConfig.module.loaders
  .filter(x => x.loader.startsWith('style-loader/useable!'))
  .forEach(x => x.loader = x.loader.substr(21));

export default [appConfig, serverConfig];
