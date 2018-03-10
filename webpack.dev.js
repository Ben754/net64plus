const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CheckerPlugin } = require('awesome-typescript-loader')

const [ major, minor, patch ] = process.env.npm_package_compatVersion.split('.')

module.exports = [
  {
    target: 'electron-renderer',
    entry: {
      renderer: path.join(__dirname, 'src/renderer/index.tsx')
    },
    output: {
      filename: 'renderer.js',
      path: path.join(__dirname, 'build')
    },
    devtool: 'source-map',
    node: {
      __dirname: true,
      __filename: false,
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        VERSION: process.env.npm_package_version.slice(-2) === '.0' ? process.env.npm_package_version.slice(0, process.env.npm_package_version.length - 2) : process.env.npm_package_version,
        MAJOR: major,
        MINOR: minor,
        PATCH: patch
      }),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/renderer/template.html'
      }),
      new CheckerPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin()
    ],
    resolve: {
      extensions: [ '.ts', '.tsx', '.js', '.jsx', '.json' ]
    },
    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(png|jpg)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
            prefix: path.join(__dirname, 'build')
          }
        },
        {
          test: /\.(woff|ttf)$/,
          loader: 'url-loader',
          options: {
            limit: 25000,
            prefix: path.join(__dirname, 'build')
          }
        }
      ]
    }
  },
  {
    target: 'electron',
    entry: path.join(__dirname, 'src/main/index.ts'),
    output: {
      filename: 'index.js',
      path: path.join(__dirname, 'build')
    },
    devtool: 'inline-source-map',
    node: {
      __dirname: false,
      __filename: false
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: 'development',
        VERSION: process.env.npm_package_version.slice(-2) === '.0' ? process.env.npm_package_version.slice(0, process.env.npm_package_version.length - 2) : process.env.npm_package_version,
        MAJOR: major,
        MINOR: minor,
        PATCH: patch
      })
    ],
    externals: {
      winprocess: 'require(require("path").resolve(__dirname, "winprocess"))'
    },
    resolve: {
      extensions: [ '.ts', '.js', '.json' ]
    },
    module: {
      loaders: [
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader'
        }
      ]
    }
  }
]
