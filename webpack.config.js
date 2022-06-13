const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webPackage = require('./package.json');

module.exports = {
  name: 'core',
  mode: 'production',
  entry: {
    index: './analytics.js',
  },
  devtool: 'source-map',
  output: {
    filename: 'rudder-analytics.min.js',
    path: path.resolve(__dirname, 'dist/webpack'),
    iife: true,
    library: {
      name: 'rudderanalytics',
      type: 'var',
    },
    clean: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'process.browser',
          replace: `${process.env.NODE_ENV !== 'true'}`,
          flags: 'g',
        },
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'process.package_version',
          replace: `${webPackage.version}`,
          flags: 'g',
        },
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          search: 'process.module_type',
          replace: 'web',
          flags: 'g',
        },
      },
    ],
  },
};
