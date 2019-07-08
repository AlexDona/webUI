<!--
  author: zhaoxinlei
  create: 20190704
  description: 当前页面为 个人中心 我的资产组件 充提币 组件内的  USDT 多链选择组件
-->
<template lang="pug">
  //  链名称（USDT 多链）
  .link-name-box(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    // 链名称
    p.link-name {{$t('M.user_link_name')}}
    el-button.link-name-button(
      v-for="(linkName,index) in linkNames_S"
      :key="index"
      :disabled="linkName.disabled"
      @click="toggleLinkName(linkName.value, index)"
      :class="{active: activeLinkIndex == index}"
      ) {{linkName.label}}
</template>
<script>
import {mapState, mapMutations} from 'vuex'
export default {
  name: 'link-name-box',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      activeLinkIndex: 0
    }
  },
  // async created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_ACTIVE_LINK_NAMES_M'
    ]),
    // 针对 USDT 多链 切换链名称
    toggleLinkName (linkName, index) {
      this.activeLinkIndex = index
      this.UPDATE_ACTIVE_LINK_NAMES_M(linkName)
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      linkNames_S: state => state.personal.linkNames_S
    })
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  /*链名称*/
  .link-name-box
    >.link-name
      line-height 20px
      color S_main_color
    /deep/
      .link-name-button
        max-width 110px
        height 30px
        margin-right 26px
        border 1px solid #6f7a86
        border-radius 2px
        font-size 12px
        line-height 30px
        color #6f7a86
        &.el-button
          background transparent
        &.active
          border-color S_main_color
          color S_main_color
        &.is-disabled
          border-color #20273d
          color #6f7a86
          background-color #20273d
    &.day
      /deep/
        .link-name-button
          border-color #6f7a86
          &.active
            border-color S_main_color
            color S_main_color
          &.is-disabled
            border-color #ebeced
            background-color #ebeced
</style>
