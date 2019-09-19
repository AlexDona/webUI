<!--
  author: renfuwei
  create: 20190924周期增加
  description: 当前组件为个人中心邀请推广组内的 返佣记录 组件
-->
<template lang="pug">
  .the-invitation-record(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .content
      el-table.award-record-table(
        :data="commissionList"
        style="width: 100%;"
        :empty-text="$t('M.comm_no_data')"
      )
        el-table-column(
          :label="$t('M.partner_rebate_table_title1')"
        )
          template(slot-scope="s")
            div {{ s.row.uid }}
        el-table-column(
          :label="$t('M.partner_rebate_table_title2')"
        )
          template(slot-scope="s")
            div(
              v-show="s.row.isPay == 0"
            ) {{$t('M.partner_rebate_table_title5')}}
            div(
              v-show="s.row.isPay == 1"
            ) {{$t('M.partner_rebate_table_title6')}}
        el-table-column(
          :label="$t('M.partner_rebate_table_title3')"
        )
          template(slot-scope="s")
            div {{s.row.childShowFee }}{{ coinNameObj[s.row.coinId] }}
        el-table-column(
          :label="$t('M.partner_rebate_table_title4')"
        )
          template(slot-scope="s")
            div {{s.row.createTime}}
      el-pagination(
        background
        v-show="commissionList.length"
        layout="prev, pager, next"
        :current-page="currentNum"
        :page-count="totalPages"
        @current-change="updatePageNum"
      )
</template>
<script>
import {
  // 合伙人返佣记录列表
  getPartnerCommissionRecordListAJAX,
  // 获取商户币种列表
  getMerchantCurrencyList
} from '../../../utils/api/personal'
import {
  getNestedData
} from '../../../utils/commonFunc'

export default {
  name: 'rebate-record',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      // 当前页
      currentNum: 1,
      // 每页显示的条数
      pageSize: 10,
      // 总页数
      totalPages: 1,
      // 返佣列表
      commissionList: [],
      // 商户币种列表
      merchantCoinList: [],
      // 币种名称对象表
      coinNameObj: {}
    }
  },
  async created () {
    // 获取商户币种列表
    await this.getTradeTypeCoinList()
    // 合伙人返佣记录列表
    await this.getPartnerCommissionRecordList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    // 获取商户币种列表
    async getTradeTypeCoinList () {
      const data = await getMerchantCurrencyList()
      if (!data) return false
      this.merchantCoinList = getNestedData(data, 'data')
      this.merchantCoinList.forEach(item => {
        this.coinNameObj[item.id] = item.name
      })
    },
    // 合伙人返佣记录列表
    async getPartnerCommissionRecordList () {
      const data = await getPartnerCommissionRecordListAJAX({
        pageSize: this.pageSize, // 每页显示条数
        pageNum: this.currentNum // 当前页码
      })
      if (!data) return false
      this.commissionList = getNestedData(data, 'data.list')
      this.totalPages = getNestedData(data, 'data.pages') - 0
    },
    // 改变页码
    async updatePageNum (e) {
      this.currentNum = e
      await this.getPartnerCommissionRecordList()
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
      // padding 0 29px
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
    .el-pagination
      padding-bottom 36px
</style>
