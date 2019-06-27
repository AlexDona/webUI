<!--
  author: zhaoxinlei
  create: 20190621
  description: 当前组件为 公共顶部 下拉消息 组件
-->
<template lang="pug">
  li.notice-li.li-item(
    @mouseenter="toggleBox(true)"
    @mouseleave="toggleBox(false)"
  )
    button.notice-btn
      Iconfont.font-size24(icon-name="icon-xiaoxi")
    el-collapse-transition
      ul.notice-list(
        :style="{height: `${homeNoticeList.length * 40}px`}"
        v-show="isShowNotices"
        )
        li.notice-item(
          v-for="noticeItem in homeNoticeList.length < MAX_SHOW_COUNT ? homeNoticeList : homeNoticeList.slice(0, MAX_SHOW_COUNT)"
          :key="noticeItem.id"
          :track-by="noticeItem.id"
        )
          a.cursor-pointer(
            @click.stop="jumpToNewsItem(noticeItem.id)"
          ) {{noticeItem.title}}
        li.notice-item.view-more(v-show="homeNoticeList.length >= MAX_SHOW_COUNT")
          // 查看全部
          router-link.view-more-link(
            to="/NewsAndNoticeCenter"
          ) {{$t('M.investment_look_all')}}
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
  props: {
    isNoticeReady: {
      type: Boolean
    }
  },
  data () {
    return {
      isShowNotices: false,
      MAX_SHOW_COUNT: 5
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
      'CHANGE_LANGUAGE',
      'SET_NOTICE_ID'
    ]),
    toggleBox (status) {
      this.isShowNotices = status
    },
    jumpToNewsItem (noticeId) {
      if (!this.isNoticeReady) return false
      let currentRoute = this.$route.path
      if (!currentRoute.startsWith('/NewsAndNoticeItem')) {
        this.$goToPage(`/NewsAndNoticeItem/${noticeId}`)
      } else {
        this.SET_NOTICE_ID(noticeId)
      }
    }
  },
  // filters: {},
  computed: {
    ...mapState(
      {
        homeNoticeList: state => state.home.noticeList
      }
    )
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .notice-li
    position relative

    > .notice-btn
      padding 0
      color S_main_color
      cursor pointer

    .notice-list
      position absolute
      z-index 2
      top 50px
      left -150%
      width 300px
      max-height 240px
      border-radius 2px
      overflow hidden
      box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)

      > .notice-item
        box-sizing border-box
        height 40px
        border-bottom 1px solid #292c42
        font-size 12px
        line-height 40px
        text-align left
        background-color #2c314d

        > a
          display block
          height 100%
          padding 0 14px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          color S_font_color

          &:hover
            color S_main_color
            background-color #21243a
        &.view-more
          background-color #2c3047
        .view-more-link
          display inline-block
          width 100%
          text-align center
          color S_main_color
          cursor pointer
</style>
