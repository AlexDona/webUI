<!--
  author: zhaoxinlei
  create: 20190910
  description: 当前页面为 闪兑专区 详情 信息里 的富文本通用 组件
-->
<template lang="pug">
  .the-shopping-spree-detail-rich-text(v-if="content")
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
import '../../../../static/css/rich-text/quill.snow.min.css'
export default {
  name: 'the-shopping-spree-detail-rich-text',
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
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree-detail-rich-text
    margin 0 0 30px 0
    .title
      font-size 18px
      color #D9E1F1
      font-weight 400
    .split
      height 1px
      width 100%
      background-color rgba(102,113,143,.3)
      margin 30px 0
      position relative
      &:before
        bottom 0
        left 0
        background linear-gradient(215deg,rgba(252,76,28,1) 0%,rgba(245,122,57,1) 100%)
        position absolute
        content ''
        width 30px
        height 6px
        transform skew(-45deg)
    .content
      color #66718F
      padding 0
      box-sizing border-box
</style>
