const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const root = (...segments) => path.resolve(__dirname, ...segments)

module.exports = {
  entry: root('src', 'index.ts'),
  mode: 'production',
  output: {
    filename: 'index.js',
    path: root('dist'),
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: ['.ts', '.json', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'module.json' },
        { from: 'LICENSE' },
        { from: 'README.md' },
        { from: 'templates', to: 'templates' },
      ],
    }),
    new CleanPlugin(),
    new MiniCssExtractPlugin(),
  ],
}
