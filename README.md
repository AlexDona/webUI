### 提交注意

 提交项目之前请先检查 js 、 css 语法规范

 如提交失败，请根据提示确定 js、css或 git commit message 规范错误

 message 规范如下：

 git commit -m `<type>[optional scope]: <description>`

type:

  用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档

  可取值:

 1. docs：文档更新
 2. feat：新增功能
 3. fix：bug 修复
 4. perf：性能优化
 5. refactor：重构代码(既没有新增功能，也没有修复 bug)
 6. style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
 7. test：新增测试用例或是更新现有测试
 8. revert：回滚某个更早之前的提交
 9. chore：不属于以上类型的其他类型

optional scope：

  一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。根据项目实际情况填写即可，最好在项目中规定好模块列表，保持一致性。
