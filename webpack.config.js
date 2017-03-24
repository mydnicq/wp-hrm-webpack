const { PATHS, HOST, PORT, THEME_NAME } = require('./env.config');
const utils = require('./scripts/utils');
const webpack = require('webpack');
const path = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = utils.getEnv();
const WATCH = global.watch || false;

module.exports = {
  entry: getEntry(),

  output: {
    path: PATHS.compiled(),
    publicPath: ENV === 'production' ? '/' : `http://${HOST}:${PORT}/wp-content/themes/${THEME_NAME}/`,
    filename: 'js/[name].js',
    sourceMapFilename: '[file].map',
  },

  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: PATHS.src()
      },
      {
        test: /\.css$/,
        loader: getCssLoader()
      },
    ]
  },

  devtool: ENV === 'production' ? 'source-map' : 'inline-source-map',

  plugins: getPlugins(ENV),

  target: 'web',

  watch: WATCH
};

/*
  CONFIG ENV DEFINITIONS
 */

function getEntry() {
  const entry = {};
  entry.main = [PATHS.src('js', 'main.js')];
  if (ENV === 'development') entry.main.push('webpack-hot-middleware/client');
  return entry;
}


function getPlugins(env) {
  const plugins = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(env) }),
  ];

  switch (env) {

    case 'production':
      plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }));
      plugins.push(new ExtractTextPlugin('main.css'));
      break;

    case 'development':
      plugins.push(new webpack.HotModuleReplacementPlugin());
      plugins.push(new webpack.NoErrorsPlugin());
      plugins.push(new WriteFilePlugin());
      break;
  }

  return plugins;
}

function getCssLoader() {
  if (ENV === 'production') {
    return ExtractTextPlugin.extract({
      fallbackLoader: "style-loader",
      loader: "css-loader?importLoaders=1!postcss-loader"
    });
  } else {
    return 'style-loader!css-loader?importLoaders=1!postcss-loader';
  }
}
