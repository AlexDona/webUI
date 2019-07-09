/**
 * author: zhaoxinlei
 * create: 20190703
 * description: 当前文件为 导出本地国际化脚本
 */
require('babel-register')({presets: ['env']})

let xlsx = require('node-xlsx')
let fs = require('fs')
let path = require('path')
let originPath = path.join(__dirname, '../static/lang')

//输出目录
let targetPath = path.join(__dirname, `../../exportI18n/i18n.xlsx`)
// 目标语言
// 获取 国际化文件 ，写入 excel
const zh_CNObject = require(path.join(originPath, `zh_CN`)).M
const zh_TWObject = require(path.join(originPath, `zh_TW`)).M
const en_USObject = require(path.join(originPath, `en_US`)).M
const ko_KRObject = require(path.join(originPath, `ko_KR`)).M
const ja_JPObject = require(path.join(originPath, `ja_JP`)).M
const viObject = require(path.join(originPath, `vi`)).M
let i18nS = [[
  'system',
  'code',
  'zh_CN',
  'zh_TW',
  'en_US',
  'ko_KR',
  'ja_JP',
  'vi'
]]
Object.keys(zh_CNObject).forEach((key) => {
  i18nS.push([
    `web-ui`,
    `${key}`,
    `${zh_CNObject[key]}`,
    `${zh_TWObject[key]}`,
    `${en_USObject[key]}`,
    `${ko_KRObject[key]}`,
    `${ja_JPObject[key]}`,
    `${viObject[key]}`
  ])
})

let xlsxData = [{
  name: 'sheet1',
  data: i18nS
}]
let buffer = xlsx.build(xlsxData)
fs.writeFile(targetPath, buffer, function (err) {
  if (err) throw err
  console.log(`国际化导出成功！`)
})
