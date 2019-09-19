<!--
  author: renfuwei
  create: 20190924周期增加
  description: 当前组件为 邀请推广 合伙人返佣排行榜(前三条) 组件
-->
<template lang="pug">
  .the-ranking-list-box(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    v-if="rankingListArr.length"
  )
    .rank-box
      .title-text.font-size16 {{$t('M.partner_ranking_title')}}
      .table-content
        .table-header.font-size12
          .bar.text-align-l {{$t('M.partner_ranking_table_title1')}}
          .bar.text-align-c {{$t('M.partner_ranking_table_title2')}}
          .bar.text-align-c {{$t('M.partner_ranking_table_title3')}}
          .bar.text-align-r {{$t('M.partner_ranking_table_title4')}}
        .table-body(
          v-for="(item,index) in rankingListArr"
        )
          .item.text-align-l {{index + 1}}
            img.land-mark(
              src="../../../assets/partner/first.png"
              v-if="index + 1 == 1"
            )
            img.land-mark(
              src="../../../assets/partner/second.png"
              v-if="index + 1 == 2"
            )
            img.land-mark(
              src="../../../assets/partner/third.png"
              v-if="index + 1 == 3"
            )
          .item.text-align-c {{hiddenLoginNameShow(item.loginName)}}
          .item.text-align-c {{item.teamNumber}}
          .item.text-align-r {{item.rebateFee}}{{item.coinName}}
      .rank-jump.text-align-c.font-size14
        span.cursor-pointer(
          @click="jumpFullList"
        ) {{$t('M.partner_ranking_text1')}}
</template>
<script>
import {
  getNestedData,
  hiddenLoginName
} from '../../../utils/commonFunc'
import {
  getPartnerRebateTopListAJAX
} from '../../../utils/api/personal'
export default {
  // name: '',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      // 合伙人返佣排行榜数组
      rankingListArr: []
    }
  },
  async created () {
    await this.getPartnerRebateTopList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    // 合伙人排行榜列表
    async getPartnerRebateTopList () {
      const data = await getPartnerRebateTopListAJAX()
      if (!data) return
      this.rankingListArr = getNestedData(data, 'data.rebateTopList').slice(0, 3)
    },
    // 显示邮箱前三位和@之后的 显示手机前三位和后四位
    hiddenLoginNameShow (val) {
      return hiddenLoginName(val)
    },
    // 查看完整榜单跳转
    jumpFullList () {
      this.$goToPage(`/${this.$routes_X.RebateRankList}`)
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-ranking-list-box
    margin-top 10px
    padding 0 29px
    > .rank-box
      > .title-text
        height 47px
        line-height 47px
      > .table-content
        .table-header
          display flex
          box-sizing border-box
          height 52px
          line-height 52px
          padding 0 20px
          .bar
            flex 1
        .table-body
          padding 0 20px
          display flex
          box-sizing border-box
          height 58px
          line-height 58px
          .item
            flex 1
            position relative
            .land-mark
              position absolute
              left -5px
              top 50%
              transform translateY(-50%)
      > .rank-jump
        height 54px
        line-height 54px
    &.night
      background-color S_night_main_bg
      > .rank-box
        > .title-text
          color S_main_color
          border-bottom 1px solid S_color1
        > .table-content
          .table-header
            color #A9BED4
            border-bottom 1px solid S_color1
          .table-body
            color #D9E1F1
            border-bottom 1px solid S_color1
        > .rank-jump
          color S_main_color
    &.day
      background-color S_day_bg
      box-shadow 0 0 6px S_color4
      > .rank-box
        > .title-text
          color S_main_color
          border-bottom 1px solid S_color4
        > .table-content
          .table-header
            color #6F798A
            border-bottom 1px solid S_color4
          .table-body
            color S_day_main_text_color
            border-bottom 1px solid S_color4
        > .rank-jump
          color S_main_color
</style>
