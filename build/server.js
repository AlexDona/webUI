/**
 * author: zhaoxinlei
 * create: 20190703
 * description: 当前文件为 node 脚本调用接口
 */
const request = require('request')
const {atob} = require('abab')
const pako = require('pako')
const XDomin = {
  testing: 'web.test.com',
  development210: 'me.com',
  production: 'fubt.co'
}
const handleRequest = async (options, callback) => {
  return await request({
    headers: {
      // 'x-domain': 'fubt.co'
      'x-domain': XDomin[process.env.NODE_ENV]
    },
    ...options
  }, function (err, res, body) {
    if (!err && callback) callback(JSON.parse(body))
  })
}

const unzip = b64Data => {
  // console.log(b64Data)
  if (!b64Data) return false
  var strData = atob(b64Data)
  // Convert binary string to character-number array
  var charData = strData.split('').map(function (x) {
    return x.charCodeAt(0)
  })
  // Turn number array into byte-array
  var binData = new Uint8Array(charData)
  // // unzip
  var data = pako.inflate(binData)
  // Convert gunzipped byteArray back to ascii string:
  strData = String.fromCharCode.apply(null, new Uint16Array(data))
  return decodeURIComponent(strData)
}
module.exports = {
  handleRequest,
  unzip
}
