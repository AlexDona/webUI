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
      a.more-nav-btn.text-align-l(v-show="$navigators_S_X.length > 5")
        TheMoreNavsButton(:isActive="isShowSubNav")
      // 自定义导航列表
      ul.more-nav-list(v-show="isShowSubNav")
        li(
          v-for="(navItem, navIndex) in $navigators_S_X.slice(5)"
          :key="navIndex"
          class="nav-item"
          :class="{'active': $activeLinkIndex_S_X == navItem.name}"
          @mouseenter="changeMoreActiveNavIndex(navIndex)"
          @mouseleave="changeMoreActiveNavIndex(-1)"
        )
          a(
            href="javascript:void(0);"
            @click="navToJump(navItem,'more')"
          )
            span {{navItem.name}}
          ul.sub-nav-list(
            v-if="navItem.children"
            v-show="activeMoreNavIndex === navIndex"
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
    li.nav-item(
      v-for="(navigationItem, index) in $navigators_S_X.slice(0, 5)"
      :key="index"
      :class="{'active': $activeLinkIndex_S_X == navigationItem.index}"
      @mouseenter="changeActiveNavIndex(index)"
      @mouseleave="changeActiveNavIndex(-1)"
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
      ul.sub-nav-list(
        v-if="navigationItem.children"
        v-show="index === activeNavIndex"
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
  props: {
    navigation: {
    }
  },
  data () {
    return {
      isShowSubNav: false,
      MAX_SHOW_COUNT: 5,
      // 当前导航选中项 索引
      activeNavIndex: -1,
      // 当前 更多导航选中项索引
      activeMoreNavIndex: -1,
      // 当前选中链接
      activeLink: {
        outer: '',
        inner: ''
      }
    }
  },
  created () {
    // console.log(this.$route)
    const { path } = this.$route
    this.activeLink = path
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_LANGUAGE',
      'SET_NOTICE_ID',
      'SET_ACTIVE_LINK_NAME_M'
    ]),
    gotoHome () {
      this.$goToPage(`/${this.$routes_X.home}`)
      this.activeNavIndex = -1
      this.activeMoreNavIndex = -1
      this.SET_ACTIVE_LINK_NAME_M(-1)
    },
    /**
     * type: normal: 正常导航; more: 更多导航
     * @param navigation
     * @param type
     */
    navToJump (navigation, type = 'normal') {
      console.log(navigation, type, this.activeLink)
      switch (type) {
        case 'normal':
          const { link, name, index } = navigation
          const targetRoute = this.$navigators_S_X[this.activeNavIndex]
          // console.log(link, targetRoute, this.activeNavIndex, this.navigation, this.activeMoreNavIndex)
          const isChildLink = _.some(targetRoute.children, itemLink => itemLink.link == link)
          if (targetRoute.link == link) {
            this.activeLink = name
            this.SET_ACTIVE_LINK_NAME_M(index)
          } else if (isChildLink) {
            this.activeLink = targetRoute.index
            this.SET_ACTIVE_LINK_NAME_M(targetRoute.index)
          }
          break
        case 'more':
          break
      }

      this.$emit('navToJump', navigation)
    },
    // 切换子导航显示
    toggleMoreNavs (status) {
      this.isShowSubNav = status
    },
    // 切换当前激活导航
    changeActiveNavIndex (index) {
      this.activeNavIndex = index
    },
    // 切换当前更多激活导航
    changeMoreActiveNavIndex (index) {
      this.activeMoreNavIndex = index
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      logoSrc: state => state.common.logoSrc
    })
  },
  watch: {
    $route (to) {
      console.log(to)
      // 重置导航
      this.activeNavIndex = -1
    }
  }
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
      padding 0 2%
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
          width 100%
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

          &:hover
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
