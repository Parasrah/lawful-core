const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin: CleanPlugin } = require('clean-webpack-plugin')

const root = (...segments) => path.resolve(__dirname, ...segments)

module.exports = {
  entry: root('src', 'index.js'),
  mode: 'production',
  output: {
    filename: 'index.js',
    path: root('dist'),
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'module.json' },
        { from: 'LICENSE' },
        { from: 'README.md' },
      ],
    }),
    new CleanPlugin(),
  ],
}
