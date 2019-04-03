const fs = require('fs')
const path = require('path')
const originContent = require('./common/zh_TW')
// 要转换的内容路径
// const targetPath = path.join(__dirname, '/finance', 'vi.js')

// fs.readFile(targetPath, 'utf8', (err, data) => {
//   if (err) {
//     console.log('文件读取失败')
//     console.log(err)
//   }
//   console.log(data)
//   // eslint-disable-next-line
// // let originContent = data
// //
// //   let newContent = {}
// //   for (let k in originContent) {
// //     newContent[k] = `${originContent[k]}`.trim()
// //   }
// //   console.log(newContent)
// //   fs.writeFile(path.join(__dirname, '../newContent.js'), JSON.stringify(newContent), (error) => {
// //     console.log(error)
// //     if (!error) console.log('内容生成成功')
// //   })
// })

let newContent = {}
for (let k in originContent) {
  newContent[k] = `${originContent[k]}`.trim()
}
console.log(newContent)
fs.writeFile(path.join(__dirname, '../newContent.js'), JSON.stringify(newContent), (error) => {
  console.log(error)
  if (!error) console.log('内容生成成功')
})
