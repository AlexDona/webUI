
### 提交注意

 提交项目之前请先检查 js 、 css 语法规范

 如提交失败，请根据提示确定 js、css或 git commit message 规范错误

 message 规范如下：

 git commit -m `<type>[optional scope]: <description>`

type:

  用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档

  可取值:

   * bug: 此项特别针对bug号，用于向测试反馈bug列表的bug修复
   * feature: 新功能（feature）
   * fix: 修补bug
   * docs: 文档（documentation）
   * style: 格式（不影响代码运行的变动）
   * refactor: 重构（既不是新增功能，也不是修改bug的bug变动）
   * test: 增加测试
   * chore: 构建过程或辅助工具的变动
   * revert: feat(pencil): add 'graphiteWidth' options(撤销之前的commit)
   * merge: 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址

  一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。根据项目实际情况填写即可，最好在项目中规定好模块列表，保持一致性。
