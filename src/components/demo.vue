<!--
  author: xiaoming(模板文件，请在创建是删除括号内内容)
  create: 20190327
  description: 当前页面为 demo 组件，功能为提供开发模板
-->
<template lang="pug">
  .demo-box
    .inner-box {{$t('meessage')}}
</template>
<script>
// import { getLanguagesAJAX } from '../utils/API/common'
export default {
  // !!! 注意 !!! 如需要相关声明周期或方法，请放开注释(默认处于注释状态)
  // name 为必填项
  // name: '',
  // mixins: [],
  // components: {},
  // props,
  // data () {
  //   return {}
  // }
  // async created () {
  // 接口请求 demo
  // const data = await getLanguagesAJAX()
  // 数据处理
  // console.log(data)
  // },
  // mounted () {}
  // !!! 注意!!!  新版页面的路由模式会在生产环境调为 `history` 模式，activated、deactivated 声明周期将不再提供使用
  // activated () {},
  // deactivated () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
