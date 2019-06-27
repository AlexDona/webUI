<!--
  author: zhaoxinlei
  create: 20190606
  description: 当前页面为 众筹页面 详情 信息里 的富文本通用 组件
-->
<template lang="pug">
  .the-crowd-funding-rich-text(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    v-if="content"
  )
    h3.title {{title}}
    .split
    .content.ql-editor(
      v-html="content"
      v-if="isRichTxt"
    )
    .content.ql-editor(
      v-else
    ) {{content}}
</template>
<script>
import '../../../../../static/css/rich-text/quill.snow.min.css'
export default {
  name: 'the-crowd-funding-rich-text',
  // mixins: [],
  // components: {},
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    isRichTxt: {
      type: Boolean,
      default: true
    }
  }
  // data () {
  //   return {}
  // }
  // async created () {
  // },
  // mounted () {}
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
  @import '../../../../assets/CSS/index.styl'
  .the-crowd-funding-rich-text
    margin 30px 0
    .title
      /*background-color pink*/
      font-size 18px
      color S_main_color
      font-weight 400
      /*line-height 55px*/
    .split
      height 1px
      width 100%
      background-color #35587E
      margin 20px 0
    .content
      background-color #151b30
      padding 40px
      box-sizing border-box
      box-shadow 0 4px 4px 0 rgba(30,33,51,1)
    &.day
      .title
        color S_main_color
      .split
        background-color #E6E6EB
      .content
        background-color #fff
        box-shadow 0 4px 6px 0 rgba(214,215,217,1)
        color #2F363D
</style>
