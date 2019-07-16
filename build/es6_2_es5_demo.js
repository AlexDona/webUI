/**
 * author: zhaoxinlei
 * create: 20190703
 * description: 当前文件为 babel 转换文件
 */
require('babel-register')({
  presets: ['env']
})

module.exports = require('./server.js')
