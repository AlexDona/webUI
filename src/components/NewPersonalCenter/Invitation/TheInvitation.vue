<!--
  author: zhaoxinlei
  create: 20190626
  description: 当前组件为 个人中心 邀请推广 组件
-->
<template lang="pug">
  .the-invitation(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    // 邀请推广
    .header {{$t('M.comm_user_invite_generalize')}}
    // 邀请推广
    TheInvitationCode
    // 邀请统计
    TheInvitationStatistics(@getUserPromotionList="getUserPromotionList")
    // 奖励记录
    TheInvitationRecord
</template>
<script>
import TheInvitationCode from './TheInvitationCode'
import TheInvitationStatistics from './TheInvitationStatistics'
import TheInvitationRecord from './TheInvitationRecord'
import {userPromotionList} from '../../../utils/api/personal'
import {mapMutations} from 'vuex'
export default {
  name: 'the-invitation',
  // mixins: [],
  components: {
    TheInvitationCode,
    TheInvitationStatistics,
    TheInvitationRecord
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
      pageSize: 10
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
    }
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
    min-height 1000px
    >.header
      height 40px
      line-height 40px
      background-color #1c1f32
      padding 0 20px
      font-size 16px
      color S_main_color
    &.night
      background-color transparent
    &.day
      >.header
        background-color: #fff
        box-shadow 0 0 6px #cfd5df
</style>
