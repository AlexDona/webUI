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
      .tab-header
        ul
          li.item(
            @click="toggleTab('first')"
            :class="{isChecked: showFirstStatus}"
          ) {{$t('M.focus_black_table1')}}
          li.item(
            @click="toggleTab('second')"
            :class="{isChecked: showSecondStatus}"
          ) {{$t('M.focus_black_table2')}}
      .tab-content
        .first(
          v-if="showFirstStatus"
        )
          FocusList
        .second(
          v-if="showSecondStatus"
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
      showFirstStatus: true,
      showSecondStatus: false
    }
  },
  created () {
    if (this.blackTabsStatus) {
      this.showSecondStatus = true
      this.showFirstStatus = false
      // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
      this.CHANGE_BLACK_TABS_STATUS_M(false)
    } else {
      this.showFirstStatus = true
      this.showSecondStatus = false
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_BLACK_TABS_STATUS_M'
    ]),
    toggleTab (data) {
      switch (data) {
        case 'first':
          this.showFirstStatus = true
          this.showSecondStatus = false
          break
        case 'second':
          this.showFirstStatus = false
          this.showSecondStatus = true
          break
      }
    }
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
      > .tab-header
        height 40px
        line-height 40px
        padding-left 30px
        > ul
          display flex
          .item
            height 38px
            font-size 16px
            cursor pointer
            &:first-child
              margin-right 30px
          .isChecked
            color S_main_color !important
            border-bottom 2px solid S_main_color
      > .tab-content
        > .first
          margin-top 10px
        > .second
          margin-top 5px
    &.night
      background-color S_night_main_bg
      .tab-header
        box-shadow 0 2px 2px 0 rgba(20, 23, 37, 1)
        > ul
          .item
            color S_night_main_text_color
    &.day
      background-color S_day_bg
      .tab-header
        border-bottom 1px solid rgba(57, 66, 77, .1)
        > ul
          .item
            color #6F798A
</style>
