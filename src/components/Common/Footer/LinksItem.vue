<!--
  author: zhaoxinlei
  create: 20190822
  description: 当前组件为 底部 链接 组件
-->
<template lang="pug">
  .the-links-item
    .inner-box
      .left
        span {{title}}
      .right
        ul.links
          li.link-item(v-for="link in links")
            a
              img(
                :src="link.logo"
                v-if="isShowLogo"
              )
              span.text(v-else) {{link.name}}
</template>
<script>
export default {
  name: 'the-links-item',
  // mixins: [],
  // components: {},
  props: {
    title: {
      type: String
    },
    links: {
    },
    isShowLogo: {
      type: Boolean
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
  .the-links-item
    width 100%
    margin-bottom 22px
    overflow hidden
    >.inner-box
      display flex
      >.left
        /*min-width 100px*/
        height 28px
        line-height 28px
        margin-right 15px
      >.right
        flex 1
        >.links
          display flex
          flex-wrap wrap
          justify-content flex-start
          >.link-item
            height 28px
            margin-right 40px
            >a
              width 100%
              height 28px
              line-height 28px
              display inline-block
              cursor pointer
              >img
                height 28px
                vertical-align middle
              >.text
                white-space nowrap
                display inline-block
                height 28px
                line-height 28px
                &:hover
                  color #fff
</style>
