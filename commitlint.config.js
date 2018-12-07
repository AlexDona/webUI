module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules:{
    'type-enum':[
      2,
      'always',
      [
        'br', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'feat', //新功能（feature）
        'fix', //修补bug
        'docs', //文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'refactor', //重构（即不是新增功能，也不是修改bug的代码变动）
        'test', //新增测试用例或是更新现有测试
        'chore', //构建过程或辅助工具的变动
        'revert', // 回滚某个更早之前的提交
      ]
    ]
  }
};
