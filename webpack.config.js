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
      },
      { test: /\.css$/, loader: "style-loader!css-loader" },
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
      { from: 'src/game.html'},
      { from: 'src/css', to: 'css/'},
      { from: 'src/templates', to: 'templates/'},
      { from: 'static'}
    ]),
  ],
  devtool: 'source-map',
  devServer: {
    hot: false,
    inline: false,
    proxy: {
      "/api": {
          "target": "http://localhost:9393/",
          "pathRewrite": {
                  "^/api" : ""
          },
          "changeOrigin": true
      }
    }
  }
};
