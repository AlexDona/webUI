<!--
  author: zhaoxinlei
  create: 20190612
  description: 当前页面为 众筹页面 详情 信息里 的常见问题组件
-->
<template lang="pug">
  .the-crowd-funding-rich-text(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    h3.title {{title}}
    .split
    .content
      .faq-item(v-for="item in FAQ")
        p.ques {{$t(item.ques)}}?
        p.answer {{$t(item.answer)}}
</template>
<script>
export default {
  name: 'the-crowd-funding-rich-faq',
  // mixins: [],
  // components: {},
  props: {
    title: {
      type: String
    }
  },
  data () {
    return {
      FAQ: [
        {
          ques: 'M.crowd_funding_faq_1',
          answer: 'M.crowd_funding_faq_answer_1'
        },
        {
          ques: 'M.crowd_funding_faq_2',
          answer: 'M.crowd_funding_faq_answer_2'
        },
        {
          ques: 'M.crowd_funding_faq_3',
          answer: 'M.crowd_funding_faq_answer_3'
        },
        {
          ques: 'M.crowd_funding_faq_4',
          answer: 'M.crowd_funding_faq_answer_4'
        }
      ]
    }
  }
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
      .faq-item
        .ques,.answer
          line-height 30px
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
