/**
 * author: zhaoxinlei
 * create: 20190703
 * description: 当前文件为 node 脚本调用接口
 */

const request = require('request')
const handleRequest = async (options, callback) => {
  return await request({
    headers: {
      'x-domain': 'fubt.co'
    },
    ...options
  }, function (err, res, body) {
    if (!err && callback) callback(JSON.parse(body))
  })
}

module.exports = {
  handleRequest
}
