<!--
  author: yuxia
  createTime: 20190605
  description: 当前页面为 众筹 存币记录 页面
-->
<template lang="pug">
  .crowd-funding(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .inner-box
      .banner
        .inner-box
          h3 {{$t(title1)}}
          p {{$t(title2)}}
      .container
        // 存币记录
        .header
          .left {{$t('M.crowd_funding_deposit_record')}}
          .right
            TheCrowdFundingGoBack
        .content
          el-table(
          :data="dataList"
          :empty-text="$t('M.comm_no_data')"
          )
            el-table-column(
              :label="$t(tableHeader[0])"
              prop="time"
              width="90"
            )
              template(slot-scope="s")
                p {{s.row.time | timerFormat1_F_X('date')}}
                p {{s.row.time | timerFormat1_F_X('time')}}
            el-table-column(
            :label="$t(tableHeader[1])"
            prop="name"
            )
            el-table-column(
            :label="$t(tableHeader[2])"
            prop="incomeType"
            )
            el-table-column(
            :label="$t(tableHeader[3])"
            prop="interestRate"
            )
            el-table-column(
            :label="$t(tableHeader[4])"
            prop="interestPeriod"
            )
            el-table-column(
              :label="$t(tableHeader[5])"
              prop="amount"
              width="90"
            )
            el-table-column(
            :label="$t(tableHeader[6])"
            prop="interestExpected"
            )
            el-table-column(
              :label="$t(tableHeader[7])"
              prop="timeSpace"
            )
            el-table-column(
              :label="$t(tableHeader[8])"
              prop="status"
              width="90"
            )
        el-pagination(
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="prev, pager, next"
        :total="totalPage - 0"
        )
</template>
<script>
import {mapState} from 'vuex'
import { timeFilter } from '../../utils'
import {getCrowdFundingRecordAJAX} from '../../utils/api/activityCenter'
import mixins from '../../mixins/crowdFunding'
import TheCrowdFundingGoBack from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingGoBack'
export default {
  components: {
    TheCrowdFundingGoBack
  },
  mixins: [mixins],
  // props,
  data () {
    return {
      tableHeader: [
        // 时间
        'M.crowd_funding_time',
        // 项目名称
        'M.crowd_funding_project_name',
        // 收益方式
        'M.crowd_funding_way_of_income',
        // 年华收益率
        'M.crowd_funding_interest_rate',
        // '存币周期（天）',
        'M.crowd_funding_deposit_cycle',
        // '存币数量',
        'M.crowd_funding_deposit_quantity',
        // 到期收益
        'M.crowd_funding_yield_to_maturity',
        // '计息时间/解锁时间',
        'M.crowd_funding_interest_time_unlock_time',
        // 状态
        'M.crowd_funding_state'
      ],
      // 存币记录
      dataList: [],
      // 当前页面
      currentPage: 1,
      // 每页数据条数
      pageSize: '20',
      // 网站当前语言
      currentLanguage: '',
      // 总页数
      totalPage: '',
      title1: 'M.crowd_funding_title1',
      title2: 'M.crowd_funding_title2'
    }
  },
  async created () {
    await this.getCrowdFundingRecord()
  },
  // mounted () {},
  // activated () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    async getCrowdFundingRecord () {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        language: this.language
      }
      const data = await getCrowdFundingRecordAJAX(params)
      this.dataList = []
      if (!data) return false
      console.log(data)
      _.forEach(_.get(data, 'data.list'), item => {
        let newItem = {
          time: this.computedTimeFilter(item.applyDate, 'normal'),
          name: item.projectName,
          incomeType: item.interestReturnWay,
          interestRate: item.interestRate,
          interestPeriod: item.lockPeriod,
          amount: item.applyAmount,
          interestExpected: item.interestAmountExpected,
          timeSpace: this.computedTimeFilter(item.interestStartTime, 'date') + '~' + this.computedTimeFilter(item.interestEndTime, 'date'),
          status: this.language === 'zh_CN' || this.language === 'zh_TW' ? item.statusName : item.statusCode
        }
        this.dataList.push(newItem)
      })
      this.totalPage = _.get(data, 'data.total')
    },
    computedTimeFilter (timeData, type) {
      let dateArr = timeFilter(timeData, type).split('-')
      let newData = dateArr[0] + '/' + dateArr[1] + '/' + dateArr[2]
      return newData
    },
    handleCurrentChange (e) {
      console.log(e)
      this.currentPage = e
      this.getCrowdFundingRecord()
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language
    })
  },
  watch: {
    language (newVal) {
      console.log(newVal)
      this.currentLanguage = newVal
      this.getCrowdFundingRecord()
    }
  }
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .crowd-funding
    padding-bottom 100px
    > .inner-box
      > .banner
        height 400px
        background url('../../assets/images/crowd-funding-bg.png') no-repeat center center / cover
        position relative
        >.inner-box
          position absolute
          left 30%
          top 19%
          >h3
            font-size 44px
            color #fff
            line-height 80px
          >p
            font-size 30px
            color #fff
      > .container
        width S_main_content_width
        margin -107px auto 0
        background-color #1C1F32
        min-height 1050px
        position relative
        padding-bottom 30px
        > .header
          height 50px
          line-height 50px
          box-sizing border-box
          padding-left 49px
          background-color #282c49
          color S_main_color
          display flex
          justify-content space-between
          .right
            margin-right 20px
          /deep/
            .el-breadcrumb
              line-height 50px
              .el-breadcrumb__inner
                color S_font_color
              .is-link
                color S_main_color
                font-weight 400
        > .content
          box-sizing border-box
          padding 0 20px
          min-height 1050px
      /deep/
        .el-table, .el-table__body-wrapper
          background-color #1c1f32 !important
        .el-table th, .el-table tr
         background-color #1C1F32
        .el-table td, .el-table th.is-leaf
         border none
        .el-table th
          border-bottom 1px solid #313857 !important
        .el-table th>.cell
          font-size 12px
          color #949BB6
        .el-table__body tr:hover>td
          background-color #242840
        .el-table__body tr td
          color #fff
          font-size 12px
    &.day
      > .inner-box
        > .banner
          margin-top 50px
          height 400px
          background url('../../assets/images/crowd-funding-bg.png') no-repeat center center / cover
        > .container
          width S_main_content_width
          margin -107px auto 0
          background-color #1C1F32
          min-height 1000px
          > .header
            height 50px
            line-height 50px
            box-sizing border-box
            padding-left 49px
            background-color #e7eefc
            color S_main_color
          > .content
            box-sizing border-box
            padding 0 20px
      /deep/
        .el-table
          background-color #fff !important
          tr,th,.el-table__empty-block
            background-color #fff
          th
            border-bottom 1px solid #D6D7D9 !important
          td
            color #333 !important
          .el-table__body
            tr
              &:hover
                >td
                    background-color #f3f6fd
</style>
