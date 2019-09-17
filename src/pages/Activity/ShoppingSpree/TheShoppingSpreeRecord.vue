<!--
  author: zxl
  create: 20190911
  description: 当前页面为 "闪兑专区" 抢购记录页面
-->
<template lang="pug">
  .the-shopping-spree-record(:style="{height: innerContentHeight}")
    .inner
      .header
        // 抢购记录
        span.title {{labelOBJ.shopping_spree_record}}
        router-link(:to="`/${$routes_X.shoppingSpree}`")
          span {{labelOBJ.goBack}}
          Iconfont.iconfont(icon-name="icon-fanhui")
      .content
        // 搜索
        .search-area
          // 抢购时间
          span.label {{labelOBJ.recordLabel.purchaseTime}}
          el-date-picker.the-shopping-spree-record-date-picker(
            v-model="timeRange"
            type="datetimerange"
            format='yyyy-MM-dd HH:mm'
            value-format='yyyy-MM-dd HH:mm:ss'
            range-separator="~"
            :start-placeholder="labelOBJ.startTime"
            :end-placeholder="labelOBJ.endTime"
            popper-class="the-shopping-spree-record-date-picker-popper"
            @change="dateChange"
          )
        //  表格
        el-table.shopping-spree-record-table(
          :data="records"
          height="475"
          style="width: 100%"
          :empty-text="$t('M.comm_no_data')"
        )
          // 单号
          el-table-column(
            :label="labelOBJ.recordLabel.orderId"
          )
            template(slot-scope="s")
              .val {{s.row.orderSn}}
          // 活动名称
          el-table-column(
            :label="labelOBJ.recordLabel.projectName"
            width="220px"
          )
            template(slot-scope="s")
              el-popover(
                placement="top"
                trigger="hover"
                popper-class="project-name-popover"
                :open-delay="500"
              )
                .val.project-name {{s.row.projectName}}
                .val.project-name(slot="reference") {{s.row.projectName}}
          // 活动币种
          el-table-column(
            :label="labelOBJ.recordLabel.coinName"
          )
            template(slot-scope="s")
              .val {{s.row.coinName}}
          // 价格
          el-table-column(
            :label="labelOBJ.recordLabel.price"
            width="184px"
          )
            template(slot-scope="s")
              el-popover(
              placement="top"
              trigger="hover"
              popper-class="project-name-popover"
              )
                .val
                  span {{s.row.priceCoinNum | priceFilter(s.row)}}
                .val(slot="reference")
                  span {{s.row.priceCoinNum | priceFilter(s.row)}}
          // 数量
          el-table-column(
            :label="labelOBJ.recordLabel.count"
            width="138px"
          )
            template(slot-scope="s")
              el-popover(
              placement="top"
              trigger="hover"
              popper-class="project-name-popover"
              :open-delay="500"
              )
                .val {{s.row.coinNum}} {{s.row.coinName}}
                .val(slot="reference") {{s.row.coinNum}} {{s.row.coinName}}
          // 金额
          el-table-column(
            :label="labelOBJ.recordLabel.amount"
            width="144px"
          )
            template(slot-scope="s")
              el-popover(
              placement="top"
              trigger="hover"
              popper-class="project-name-popover"
              :open-delay="500"
              )
                .val {{s.row.priceCoinNum}} {{s.row.priceCoinName}}
                .val(slot="reference") {{s.row.priceCoinNum}} {{s.row.priceCoinName}}
          // 抢购时间
          el-table-column(
            :label="labelOBJ.recordLabel.purchaseTime"
          )
            template(slot-scope="s")
              .val {{s.row.createTime | timeFilter}}
          // 到账时间
          el-table-column(
            align="right"
            :label="labelOBJ.recordLabel.accountingTime"
          )
            template(slot-scope="s")
              .val {{accountTimeFilter(s.row)}}
        el-pagination.pagination(
          background
          v-show="records.length"
          layout="prev, pager, next"
          :total="total"
          @current-change="changeCurrentPage"
          :current-page="currentPage"
        )
</template>
<script>
import {
  mapState
} from 'vuex'
import mixins from '../../../mixins/shoppingSpree'
import {getShoppingSpreeRecordAJAX} from '../../../utils/api/shoppingSpree'
export default {
  name: 'the-shopping-spree-record',
  mixins: [mixins],
  // components: {},
  // props,
  data () {
    return {
      pageSize: 10,
      currentPage: 1,
      timeRange: [],
      total: 0,
      records: []
    }
  },
  created () {
    this.getShoppingSpreeRecord()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    dateChange () {
      this.getShoppingSpreeRecord()
    },
    accountTimeFilter (row) {
      // 是否到账
      const {isIssue, accountTime} = row
      if (isIssue) {
        return this.$options.filters['timeFilter'](accountTime)
      } else {
        return this.labelOBJ.recordLabel.notAccount
      }
    },
    initPage () {
      this.currentPage = 1
      this.getShoppingSpreeRecord()
    },
    changeCurrentPage (e) {
      this.currentPage = e
      this.getShoppingSpreeRecord()
    },
    getShoppingSpreeRecord: _.debounce(async function () {
      const params = {
        // 下单开始时间
        createStartTime: this.startTimeComp,
        // 下单结束时间
        createEndTime: this.endTimeComp,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      const data = await getShoppingSpreeRecordAJAX(params)
      if (!data) return
      this.records = _.get(data, 'data.list')
      this.total = _.get(data, 'data.total') - 0
      this.currentPage = _.get(data, 'data.pageNum')
    }, 500)
  },
  filters: {
    timeFilter (val) {
      const times = val.split(':')
      times.pop()
      return times.join(':')
    },
    // 价格filter
    priceFilter (val, row) {
      const { coinName, priceCoinNum, priceCoinName, coinNum } = row
      // 1 FUC = 1.5 FBT
      return `1 ${coinName} = ${priceCoinNum / coinNum} ${priceCoinName}`
    }
  },
  computed: {
    ...mapState({
      footerHeight: state => state.common.footerHeight
    }),
    // 列表内容高度
    innerContentHeight () {
      const headerHeight = 50
      return `${window.innerHeight - headerHeight - this.footerHeight}px`
    },
    startTimeComp () {
      return _.get(this.timeRange, '[0]') || ''
    },
    endTimeComp () {
      return _.get(this.timeRange, '[1]') || ''
    },
    timeRangeAnd$isChineseLanguage () {
      return `${this.startTimeComp}/${this.endTimeComp}/${this.$isChineseLanguage_G_X}`
    }
  },
  watch: {
    timeRangeAnd$isChineseLanguage () {
      this.initPage()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree-record
    padding-top 92px
    box-sizing border-box
    min-height 830px
    background #0f132e url("../../../assets/ShoppingSpree/shopping-spree-content-bg.png") no-repeat center bottom
    >.inner
      background-color #1A1D2D
      height 630px
      width S_main_content_width
      margin 0 auto
      border-radius 4px
      overflow hidden
      >.header
        height 50px
        line-height 50px
        background-color #222638
        padding 0 38px
        color #fff
        display flex
        justify-content space-between
        >.title
          font-size 20px
        >a
          color S_main_color
          font-size 12px
          >.iconfont
            font-size 12px
      >.content
        height 580px
        background-color #1A1D2D
        padding 0 38px
        >.search-area
          text-align right
          height 50px
          line-height 50px
          box-sizing border-box
          >.label
            margin-right 10px
            font-size 12px
            color #66718F
        /deep/
          /* 日期选择器 */
          .the-shopping-spree-record-date-picker
            height 30px
            width 300px
            vertical-align middle
            line-height 30px
            background-color #222638
            border-color S_main_color
            >.el-range__icon
              color #66718F
            >.el-range-input,.el-input__inner
              font-size 12px
              color #E0E4EE
              &::-webkit-input-placeholder
                color #66718F
              &::-moz-placeholder
                color #66718F
              &::-ms-input-placeholder
                color #66718F
            &.el-input__inner
              padding 0 10px
          /* 搜索按钮 */
          .search-button
            margin-left 15px
            height 30px
            line-height 30px
            padding 0 10px
            font-size 12px
            background linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%)
            border-radius 2px
            border none
            color #fff
            vertical-align middle
          .shopping-spree-record-table
            background-color transparent
            // 表头
            >.el-table__header-wrapper
              background-color transparent
              box-sizing border-box
              >.el-table__header
                background-color transparent
                height 50px
                line-height 50px
                >thead
                  >tr
                    background-color transparent
                    >th
                      padding 0
                      font-size 12px
                      border-bottom 1px solid #222638
                      background-color transparent
                      color #66718F
            // 表体
            >.el-table__body-wrapper
              >.el-table__body
                >tbody
                  >tr
                    background-color transparent
                    &:hover
                      >td
                        background-color #222638
                    >td
                      padding 0
                      height 42px
                      line-height 42px
                      font-size 12px
                      border-bottom none
                      color #fff
                      >.cell
                        >span
                          >.val
                            &.project-name
                              white-space nowrap
                              text-overflow ellipsis
                              overflow hidden
                              width 160px
          /* 分页样式，防止白色主题变化 */
          .pagination
            background-color transparent
            .btn-prev,.btn-next
              background-color rgba(43, 54, 64, 1) !important
              background rgba(43, 54, 64, 1) !important
              box-shadow none !important
              color #fff !important
            .el-pager
              li
                background-color rgba(43, 54, 64, 1)  !important
                color #fff !important
                &.active
                  background-color S_main_color !important
</style>
<style lang="scss">
  .project-name-popover {
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, .7) !important;
    border: none !important;

    > .val {
      color: #fff;
      font-size: 12px;
    }

    > .popper__arrow {
      &::after {
        border-top-color: rgba(0, 0, 0, .7) !important;
      }
    }
  }

  .the-shopping-spree-record-date-picker-popper {
    .el-date-range-picker__time-header {
      border-bottom: 1px solid #39424d;
    }

    .el-time-panel__content {
      .el-time-spinner__wrapper {
        overflow-x: hidden;
      }

      &::before,
      &::after {
        border-top: 1px solid #39424d;
        border-bottom: 1px solid #39424d;
        margin-top: -13px;
      }
    }

    .el-time-panel__btn {
      color: #338FF5;
    }
  }

  /* 日期选择器 */
  .night {
    .the-shopping-spree-record-date-picker-popper {
      .el-input__inner {
        color: #fff;
      }
    }
  }
</style>
