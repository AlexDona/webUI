/**
 * author: zhaoxinlei
 * create: 20190703
 * description: 当前文件为 读取 国际化 JSON 文件 脚本
 */

const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const BaseURL = {
  test: 'http://192.168.2.200:8888/',
  development: 'http://192.168.2.210:8888/',
  production: 'https://s.fubt.co/'
}
const baseUrl = BaseURL.development

let {handleRequest} = require('./server')

// 接口url
let url = 'lan/selectList'
let targetPath = path.join(__dirname, '../static/lang')

// 获取语言列表
handleRequest({
  url: `${baseUrl}lan/selectList`
}, (res) => {
  const {data, meta: {success, code}} = res

  if (!success) {
    console.error(`接口调用失败，请排查原因), 失败码： ${code}`)
    throw code
  }
  // 语言列表 ，根据语言列表循环创建文件
  const langs = data

  // 调用国际化更新数据接口
  handleRequest({
    url: `${baseUrl}${url}`
  }, (res) => {
    const {data, meta: {success, code}} = res

    if (!success) {
      console.error(`接口调用失败，请排查原因), 失败码： ${code}`)
      throw code
    }
    _.forEach(langs, (lang, index) => {
      // 获取每种语言对应的国际化数据
      const writeData = `export default M = ${JSON.stringify(data[index])}`
      fs.writeFile(path.join(targetPath, `${lang.shortName}.js`), writeData, function (err) {
        if (err) throw err
        console.log(`${lang.name} 写入完成!`)
        if (index == langs.length - 1) console.log('国际化更新完成')
      })
    })
  })
})
