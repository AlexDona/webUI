<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 关注拉黑 组件
-->
<template lang="pug">
  .focus-black-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
  )
    .inner-box
      el-tabs(
        v-model="activeName"
      )
        <!--@tab-click="handleClick"-->
        <!--我的关注-->
        el-tab-pane(
          :label="$t('M.focus_black_table1')"
          name="first"
        )
          FocusList
        <!--我的黑名单-->
        el-tab-pane(
          :label="$t('M.focus_black_table2')"
          name="second"
        )
          BlackList
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import FocusList from './FocusList'
import BlackList from './BlackList'
export default {
  components: {
    FocusList,
    BlackList
  },
  // props,
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    if (this.blackTabsStatus) {
      this.activeName = 'second'
      // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
      this.CHANGE_BLACK_TABS_STATUS_M(false)
    } else {
      this.activeName = 'first'
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_BLACK_TABS_STATUS_M'
    ])
    // handleClick (tab, event) {
    // }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
      blackTabsStatus: state => state.OTC.blackTabsStatus
    })
  }
  // watch: {},
  // destroyed () {}
}
</script>
<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .focus-black-box
    width 1105px
    height 758px
    > .inner-box
      width 1105px
      /deep/
        .el-tabs
          .el-tabs__header
            padding-left 30px !important
            .el-tabs__item
              padding 0
              margin 2px 0 !important
            .el-tabs__item.is-top
              &:last-child
                margin-left 30px !important
    &.night
      background-color S_night_main_bg
      /deep/
        .el-tabs
          .el-tabs__header
            box-shadow 0 2px 2px 0 rgba(20, 23, 37, 1)
          .el-tabs__item
            border-left 0 solid transparent
          .el-tabs__item.is-active
            border-bottom 2px solid S_main_color
            border-left 0 solid transparent
            color S_main_color
            background-color S_night_main_bg
          .el-tabs__item:hover
            border-left 0 solid transparent
            color S_main_color
            background-color S_night_main_bg
    &.day
      background-color S_day_bg
      /deep/
        .el-tabs
          .el-tabs__header
            border-bottom 1px solid rgba(57, 66, 77, .1)
            .el-tabs__nav
              background-color: transparent
            .el-tabs__item
              border-left: 0 solid transparent
            .el-tabs__item.is-active
              border-bottom 2px solid S_main_color
              border-left 0 solid transparent
              color S_main_color
              background-color S_day_bg
            .el-tabs__item:hover
              border-left 0 solid transparent
              color S_main_color
              background-color S_day_bg
</style>
