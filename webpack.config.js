const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const DIST = path.resolve(__dirname, 'dist')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: DIST,
    publicPath: DIST,
  },
  devServer: {
    contentBase: DIST,
    port: 9012,
    writeToDisk: true,
    public: 'mitzsuki.io'
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),

    new CopyWebpackPlugin({
      patterns: [
        { from: './src/images', to: './images' }
      ]
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          flatten: true,
          from: './src/*',
          globOptions: {
            ignore: ['**/*.js'],
          },
        },
      ],
    }),
  ],
}
