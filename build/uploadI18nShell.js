/**
 * author: zhaoxinlei
 * create: 20190813
 * description: 当前文件为 执行 更新 dist 文件夹的 shell 脚本 文件
 */

const exec = require('child_process').execSync

exec('bash ./uploadProjectToTest.sh')
