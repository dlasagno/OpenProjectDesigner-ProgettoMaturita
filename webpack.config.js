const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  target: 'electron-renderer',
  entry: './src/scripts/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.pug$/,
        use: 'pug-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './app/index.pug'
    })
  ],
  resolve: {
    extensions: [ '.ts', '.js' ]
  }
};