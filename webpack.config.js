const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/js/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/index.html'},
      { from: 'src/css', to: 'css/'},
      { from: 'static'}
    ]),
  ],
  devtool: 'source-map'
};
