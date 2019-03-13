const path = require('path')
const webpack = require('webpack')
// const package = require('../package.json')
const AssetsPlugin = require('assets-webpack-plugin')
//读取package.json里的依赖，normalize.css除外，打包会报错
const package = require('../package.json')
let dependencies = Object.keys(package.dependencies) || []
//如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
dependencies = dependencies.length > 0 ? dependencies.filter(item => item !== 'vue') : []

module.exports = {
  entry: {
    vendor: dependencies
  },
  output: {
    path: path.join(__dirname, '../static'),
    filename: 'dll.[name]_[hash:6].js',
    library: '[name]_[hash:6]'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-manifest.json'),
      name: '[name]_[hash:6]'
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './'
    })
  ]
}
