<!--
  author: zhaoxinlei
  create: 20190621
  description: 当前组件为 公共顶部 自定义导航 组件
-->
<template lang="pug">
  ul.nav-list
    li.nav-item
      a.logo(
        href="javascript:void(0);"
        @click="gotoHome"
      )
        img.img(:src="logoSrc")
    // 更多导航（自动收起）
    li.more-btn(
      @mouseenter="toggleMoreNavs(true)"
      @mouseleave="toggleMoreNavs(false)"
    )
      a.more-nav-btn.text-align-l(v-show="$navigators_S_X.length > MAX_SHOW_COUNT")
        TheMoreNavsButton(:isActive="isShowSubNav")
      // 自定义导航列表
      ul.more-nav-list(v-show="isShowSubNav")
        li(
          v-for="(navItem, navIndex) in $navigators_S_X.slice(5)"
          :key="navIndex"
          class="nav-item"
          :class="{active: navIndex + MAX_SHOW_COUNT == activeLink_S_parentIndex}"
          @mouseenter="updateShowParentNavIndex(navIndex + MAX_SHOW_COUNT)"
          @mouseleave="updateShowParentNavIndex"
        )
          a(
            href="javascript:void(0);"
            @click="navToJump(navItem,'more')"
          )
            span {{navItem.name}}
          ul.sub-nav-list(
            v-if="navItem.children"
            v-show="showParentNavIndex == navIndex + MAX_SHOW_COUNT"
            :style="{top: `${40 * navIndex}px`}"
          )
            li.sub-nav-item(
              v-for="(subNav, subIndex) in navItem.children"
              :key="subIndex"
            )
              a(
                href="javascript:void(0);"
                @click="navToJump(subNav, 'more')"
              )
                span {{subNav.name}}
    // 父导航(正常显示导航)
    li.nav-item(
      v-for="(navigationItem, index) in $navigators_S_X.slice(0, MAX_SHOW_COUNT)"
      :class="{active: index == activeLink_S_parentIndex}"
      :key="index"
      @mouseenter="updateShowParentNavIndex(index)"
      @mouseleave="updateShowParentNavIndex"
    )
      a(
        href="javascript:void(0);"
        @click="navToJump(navigationItem)"
      )
        span {{navigationItem.name}}
        Iconfont.iconfont(
          v-show="navigationItem.children.length"
          icon-name="icon-xiala"
        )
      // 子导航列表
      ul.sub-nav-list(
        v-if="navigationItem.children"
        v-show="showParentNavIndex == index"
      )
        li.sub-nav-item(
          v-for="(subNav, subIndex) in navigationItem.children"
          :key="subIndex"
        )
          a(
            href="javascript:void(0);"
            @click="navToJump(subNav)"
          )
            span {{subNav.name}}
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import TheMoreNavsButton from '../Home/TheMoreNavsButton'
export default {
  name: 'the-custom-navs',
  // mixins: [],
  components: {
    TheMoreNavsButton
  },
  // props: {},
  data () {
    return {
      isShowSubNav: false,
      // isShowSubNav: true,
      MAX_SHOW_COUNT: 5,
      showParentNavIndex: -1
      // 当前导航选中项 索引
      // activeNavIndex: -1,
      // 当前 更多导航选中项索引
      // activeMoreNavIndex: -1
    }
  },
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_LANGUAGE',
      'SET_NOTICE_ID',
      'UPDATE_ACTIVE_LINK_M'
    ]),
    updateShowParentNavIndex (index = -1) {
      this.showParentNavIndex = index
    },
    gotoHome () {
      this.$goToPage(`/${this.$routes_X.home}`)
    },
    /**
     * type: normal: 正常导航; more: 更多导航
     * @param navigation
     * @param type
     */
    navToJump (navigation, type = 'normal') {
      this.UPDATE_ACTIVE_LINK_M(navigation)
      const {link} = navigation
      if (!link) return
      this.$emit('navToJump', navigation)
    },
    // 切换子导航显示
    toggleMoreNavs (status) {
      this.isShowSubNav = status
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc,
      // 当前激活链接
      activeLink_S: state => state.common.activeLink_S,
      navigators_S: state => state.common.navigators_S
    }),
    activeLink_S_Index () {
      return _.get(this.activeLink_S, 'index')
    },
    // 父索引
    activeLink_S_parentIndex () {
      return (this.activeLink_S_Index || '/').split('/')[0]
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .nav-list
    height 100%
    > .nav-item
      position relative
      left -20px
      display inline-block
      height 100%
      padding 0 20px
      text-align center
      vertical-align top
      white-space nowrap
      transition all .5s
      &.active
        >a
          color S_main_color
      > .sub-nav-list
        position absolute
        top 50px
        left 46%
        border-radius 2px
        background-color #2c314d
        box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)
        transform translateX(-50%)

        > .sub-nav-item
          height 40px
          padding 0 20px
          line-height 40px
          text-align left

          &:hover
            background-color #21243a

            > a
              color S_main_color
          > a
            color S_font_color
      /* 自定义导航 */
      &:hover
        > a
          color S_main_color
          > .iconfont
            transform rotate(180deg)
      > a
        display inline-block
        width 100%
        height 100%
        white-space nowrap
        color S_font_color

        > .iconfont
          margin-top -1px
          margin-left -2px
          transition all .2s

        &.active
          color S_main_color
      > .logo
        display inline-block
        width 100px
        height 50px

        > .img
          width 80%
          vertical-align middle
    > .more-btn
      position relative
      left -20px
      display inline-block
      height 100%
      text-align center
      vertical-align top
      white-space nowrap
      transition all .5s

      > .more-nav-btn
        display inline-block
        width 30px
        height 30px
        margin 10px 0

      > .more-nav-list
        position absolute
        top 50px
        min-width 200%
        border-radius 2px
        text-align left
        background-color #2c314d
        box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)

        > .nav-item
          height 40px
          padding 0 20px
          line-height 40px

          &:hover,&.active
            background-color #21243a

            > a
              color S_main_color

          > a
            color S_font_color

          > .sub-nav-list
            position absolute
            top 0
            left 100%
            background-color #2c314d
            box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)

            > .sub-nav-item
              height 40px
              padding 0 20px
              line-height 40px
              text-align left

              &:hover
                background-color #21243a

                > a
                  color S_main_color

              > a
                color S_font_color
</style>
