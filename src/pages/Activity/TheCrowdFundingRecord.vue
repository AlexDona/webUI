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
      .container
        .header 存币记录
        .content
          el-table(
          :data="dataList"
          :empty-text="$t('M.comm_no_data')"
          )
            el-table-column(
            :label="tableHeader[0]"
            :width= "150"
            prop="time"
            )
            el-table-column(
            :label="tableHeader[1]"
            :width= "180"
            prop="name"
            )
            el-table-column(
            :label="tableHeader[2]"
            prop="incomeType"
            )
            el-table-column(
            :label="tableHeader[3]"
            prop="interestRate"
            )
            el-table-column(
            :label="tableHeader[4]"
            prop="interestPeriod"
            )
            el-table-column(
            :label="tableHeader[5]"
            prop="amount"
            )
            el-table-column(
            :label="tableHeader[6]"
            prop="interestExpected"
            )
            el-table-column(
            :label="tableHeader[7]"
            :width= "180"
            prop="timeSpace"
            )
            el-table-column(
            :label="tableHeader[8]"
            prop="status"
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
export default {
  components: {},
  // props,
  data () {
    return {
      tableHeader: ['时间', '项目名称', '收益方式', '年华收益率', '存币周期（天）', '存币数量', '到期收益', '计息时间/解锁时间', '状态'],
      // 存币记录
      dataList: [],
      // 当前页面
      currentPage: 1,
      // 每页数据条数
      pageSize: '20',
      // 网站当前语言
      currentLanguage: '',
      // 总页数
      totalPage: ''
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
    }
  }
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .crowd-funding
    > .inner-box
      > .banner
        height 600px
        background url('../../assets/images/crowd-funding-bg.png') no-repeat center center / cover
      > .container
        width S_main_content_width
        margin -200px auto 0
        background-color #1C1F32
        min-height 1000px
        > .header
          height 70px
          line-height 70px
          box-sizing border-box
          padding-left 49px
          background-color #282c49
          color S_main_color
        > .content
          box-sizing border-box
          padding 30px
    /deep/
       .el-table th, .el-table tr
         background-color #1C1F32
       .el-table td, .el-table th.is-leaf
         border none
       .el-table th>.cell
          color #949BB6
       .el-table--enable-row-hover,.el-table__body tr:hover>td
         background-color #242840
       .el-table__body tr td
         color #fff
</style>
