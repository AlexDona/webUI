<!--
  author: zhaoxinlei
  create: 20190626
  description: 当前组件为个人中心 邀请推广 组件
-->
<template lang="pug">
  .the-invitation(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    // 头部标题邀请推广
    .header {{$t('M.comm_user_invite_generalize')}}
    // 推广信息
    TheInvitationCode
    // 合伙人返佣排行榜
    RankingList
    // 推广统计
    TheInvitationStatistics(@getUserPromotionList="getUserPromotionList")
    // 奖励记录 返佣记录
    // 20190924周期增加-返佣记录
    .record-box
      .record-header
        li.tab(
          v-for="tab in tabs"
          :class="{active:activeName == tab.value}"
          @click="toggleTab(tab.value)"
        )
          span {{$t(`${tab.name}`)}}
      .record-body
        // 奖励记录
        TheInvitationRecord(
          v-show="activeName === tabs[0].value"
        )
        // 返佣记录
        RebateRecord(
          v-show="activeName === tabs[1].value"
        )
</template>
<script>
import TheInvitationCode from './TheInvitationCode'
import TheInvitationStatistics from './TheInvitationStatistics'
import TheInvitationRecord from './TheInvitationRecord'
import RebateRecord from './RebateRecord'
import RankingList from './RankingList'
import {userPromotionList} from '../../../utils/api/personal'
import {mapMutations} from 'vuex'
export default {
  name: 'the-invitation',
  // mixins: [],
  components: {
    TheInvitationCode,
    TheInvitationStatistics,
    TheInvitationRecord,
    RebateRecord,
    RankingList
  },
  // props,
  data () {
    return {
      // 推广统计列表
      statistics: [],
      // 当前委托页码
      currentNum: 1,
      // 当前委托总页数
      total: 1,
      // 筛选类型 first: 直接推广、second ： 简介推广
      generalizeValue: 'first',
      pageSize: 10,
      tabs: [
        // 奖励记录
        {
          value: 'award',
          name: 'M.person_invite_award_record'
        },
        // 返佣记录
        {
          value: 'rebate',
          name: 'M.partner_rebate_record'
        }
      ],
      // 奖励记录和返佣记录选中项
      activeName: 'award'
    }
  },
  async created () {
    this.getUserPromotionList({})
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_INVITATIONS_M'
    ]),
    async getUserPromotionList ({currentNum = 0, type = 'first'}) {
      if (currentNum) this.currentNum = currentNum
      if (type) this.generalizeValue = type
      let data = await userPromotionList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentNum, // 当前页码
        type: this.generalizeValue // 筛选类型
      })
      if (!data) return false
      this.UPDATE_INVITATIONS_M(_.get(data, 'data'))
    },
    toggleTab: _.debounce(function (name) {
      this.activeName = name
    }, 500)
  }
  // filters: {},
  // computed: {
  // ...mapState({})
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-invitation
    margin-bottom 56px
    min-height 760px
    >.header
      height 40px
      line-height 40px
      background-color S_night_main_bg
      padding 0 20px
      font-size 16px
      color S_main_color
    > .record-box
      padding 10px 29px 0
      margin-top 10px
      > .record-header
        display flex
        > .tab
          height 26px
          font-size 16px
          cursor pointer
          margin-right 20px
          &.active
            color S_main_color
            border-bottom 2px solid S_main_color
    &.night
      background-color transparent
      > .record-box
        background-color S_night_main_bg
    &.day
      >.header
        background-color S_day_bg
        box-shadow 0 0 6px S_color4
      > .record-box
        background-color S_day_bg
</style>
