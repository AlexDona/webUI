<!--
  author: zhaoxinlei
  create: 20190626
  description: 当前组件为 个人中心 邀请推广 组件 内的 奖励记录 组件
-->
<template lang="pug">
  .the-invitation-record(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    // 奖励记录
    .header {{ $t('M.user_invite_award') }}{{ $t('M.comm_record') }}
    .content
      el-table.award-record-table(
        :data="awards"
        style="width: 100%;"
        :empty-text="$t('M.comm_no_data')"
      )
        el-table-column(
          :label="`${$t('M.user_invite_award')}${$t('M.comm_type')}`"
        )
          template(slot-scope="s")
            // 直接奖励 间接奖励 注册奖励
            div {{ s.row.type === 'first'? $t('M.user_direct_reward'): (s.row.type === 'second'? $t('M.user_indirect_reward'): $t('M.user_invite_registration')) }}
        el-table-column(
          :label="$t('M.comm_currency')"
        )
          template(slot-scope="s")
            div {{s.row.source}}
        el-table-column(
          :label="$t('M.comm_count')"
        )
          template(slot-scope="s")
            div {{s.row.content - 0}}
        el-table-column(
          :label="$t('M.comm_time')"
        )
          template(slot-scope="s")
            div {{s.row.operateTime}}
      el-pagination(
        background
        v-show="awards.length"
        layout="prev, pager, next"
        :current-page="currentNum"
        :page-count="total"
        @current-change="updatePageNum"
      )
</template>
<script>
import {getRecommendUserPromotionList} from '../../../utils/api/personal'

export default {
  name: 'the-invitation-record',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      coinName: '',
      total: 0,
      awards: [],
      currentNum: 1
    }
  },
  async created () {
    this.getRecommendUserPromotion()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    async getRecommendUserPromotion () {
      let data = await getRecommendUserPromotionList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentNum // 当前页码
      })
      if (!data) return false
      let responseData = _.get(data, 'data')
      // 返回展示
      this.awards = _.get(responseData, 'data.list')
      // this.coinName = _.get(responseData, 'coinName')
      this.total = _.get(responseData, 'data.pages') - 0
    },
    async updatePageNum (e) {
      this.currentNum = e
      await this.getRecommendUserPromotion()
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
  .the-invitation-record
    background-color #1c1f32
    margin-top 10px
    .header
      height 40px
      line-height 40px
      padding 0 29px
      font-size 16px
      color S_main_color
    .content
      padding 0 29px
      /deep/
        .award-record-table
          &.el-table
            background-color #1c1f32
            th
              background-color #1c1f32
              color #A9BED4
              &.is-leaf
                border-bottom 1px solid #2D3651
            tr
              background-color transparent
              &:hover
                td
                  background-color transparent
              td
                border-bottom none
                color #A9BED4
                font-size 12px
            .el-table__body-wrapper
               min-height 72px
    &.night
      .header
        color S_main_color
        .content
          /deep/
          .award-record-table
            &.el-table
              background-color #1c1f32
              th
                background-color #1c1f32
                color #A9BED4
                &.is-leaf
                  border-bottom 1px solid #2D3651
              tr
                background-color transparent
                &:hover
                  td
                    background-color transparent
                td
                  border-bottom none
                  color #A9BED4
                  font-size 12px
    &.day
      background-color #fff
      box-shadow 0 0 6px #cfd5df
      .header
      .content
        /deep/
          .award-record-table
            &.el-table
              background-color #fff
              th
                background-color #fff
                color #6F798A
                &.is-leaf
                  border-bottom 1px solid #CFD5DF
              tr
                background-color transparent
                &:hover
                  td
                    background-color transparent
                td
                  border-bottom none
                  color #333
</style>
