<!--
  author: zhaoxinlei
  create: 20190621
  description: 当前页面为 公共顶部 语言选择 组件
-->
<template lang="pug">
  li.the-languages.li-item
    dl.lang-box(
      @mouseenter="toggleBox(true)"
      @mouseleave="toggleBox(false)"
    )
      dt.lang-selected
        span.language-text {{activeLanguage.name}}
          Iconfont.iconfont.font-size20(icon-name="icon-xiala")
      el-collapse-transition
        dd.lang-list(
          v-show="langSelecting"
        )
          button.lang-item(
            class="lang-item"
            @click="changeLanguage(item)"
            v-for="(item,index) in languages"
            :key="index"
          ) {{item.name}}
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'the-languages',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      langSelecting: false
    }
  },
  // async created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_LANGUAGE'
    ]),
    // 切换语言
    changeLanguage (e) {
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e.shortName
    },
    toggleBox (status) {
      this.langSelecting = status
    }
  },
  // filters: {},
  computed: {
    ...mapState(
      {
        activeLanguage: state => state.common.activeLanguage,
        languages: state => state.common.languages_S
      }
    )
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-languages.li-item
    > .lang-box
      position relative
      text-align left
      transition all 1s
      cursor pointer

      /* 当前语言 dt */
      > .lang-selected
        position relative
        top 1px
        display inline-block
        box-sizing border-box
        width 100%
        min-width 90px
        height 30px
        line-height 0
        color S_font_color
        padding 0 4px

        > .icon
          margin-right 5px

        > .language-text
          display inline-block

          > .iconfont
            margin-top -1px
            margin-left -2px
            transition all .2s
      &:hover
        .iconfont
          transform rotate(180deg)
      > .lang-list
        position absolute
        z-index 2
        top 50px
        left 44%
        min-width 90px
        transform translateX(-50%)
        border-radius 2px
        background-color #2c314d
        box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)

        > .lang-item
          display block
          width 100%
          height 30px
          padding 0 12px
          line-height 30px
          text-align left
          color S_font_color
          cursor pointer

          &:hover
            color S_main_color
            background-color #21243a

          > .icon
            margin-right 5px
</style>
