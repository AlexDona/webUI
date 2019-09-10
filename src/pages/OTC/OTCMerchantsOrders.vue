<template>
  <div
    class="otc-merchants-orders-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 2.0 商家订单 -->
    <div
      class="otc-merchants-orders-content"
      :style="{ 'min-height': windowHeight - footerHeight - 50 - 60 + 'px'}"
    >
      <!-- 2.1 大标题商家订单 -->
      <div class="merchants-title font-size18 padding-l15 font-weight700">
        <!-- 商家订单 -->
        {{$t('M.otc_MerchantsOrders')}}
      </div>
      <!-- 2.2 商家订单主体内容 -->
      <div class="merchants-orders-main">
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <!-- 交易类型 -->
          <div>
            <span class="filtrate-text font-size12">
              {{$t('M.otc_type_ransaction')}}
            </span>
              <span class="status-input">
              <el-select
                v-model="activatedMerchantsOrdersTraderStyleList"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeSelectValue('changeMerchantsOrdersTraderStyleList', $event)"
                clearable
                :placeholder="$t('M.comm_all')"
              >
                <el-option
                  v-for="item in merchantsOrdersTraderStyleList"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 币种 -->
          <div>
            <span class="filtrate-text font-size12">
              {{$t('M.otc_AD_token')}}
            </span>
              <span class="status-input">
              <el-select
                v-model="activatedMerchantsOrdersCoin"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeSelectValue('changeMerchantsOrdersCoin', $event)"
                clearable
                :placeholder="$t('M.comm_all')"
              >
                <el-option
                  v-for="(item,index) in merchantsOrdersCoinList"
                  :key="index"
                  :label="item.name"
                  :value="item.coinId"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 货币 -->
          <div>
            <span class="filtrate-text font-size12">
              {{$t('M.otc_MerchantsOrders_currecy')}}
            </span>
              <span class="status-input">
              <el-select
                v-model="activatedMerchantsOrdersCurrency"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeSelectValue('changeMerchantsOrdersCurrency', $event)"
                clearable
                :placeholder="$t('M.comm_all')"
              >
                <el-option
                  v-for="(item,index) in merchantsOrdersCurrencyList"
                  :key="index"
                  :label="language == 'zh_CN'? item.name : item.shortName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 状态 -->
          <div>
            <span class="filtrate-text font-size12">
              {{$t('M.comm_state')}}
            </span>
              <span class="status-input">
              <el-select
                v-model="activatedMerchantsOrdersStatusList"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeSelectValue('changeMerchantsOrdersStatusList', $event)"
                clearable
                :placeholder="$t('M.comm_all')"
              >
                <el-option
                  v-for="item in merchantsOrdersStatusList"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 日期 -->
          <div>
            <span class="filtrate-text font-size12">
              {{$t('M.otc_MerchantsOrders_date')}}
            </span>
            <span class="date-picker">
              <el-date-picker
                v-model="checkedTime"
                type="daterange"
                range-separator="-"
                :start-placeholder="$t('M.comm_begin') + $t('M.comm_data')"
                :end-placeholder="$t('M.comm_end') + $t('M.comm_data')"
                :editable="false"
                :picker-options="pickerOptionsTime"
                @change="changeSelectValue('date', $event)"
                value-format="yyyy-MM-dd"
                :clearable="false"
              >
              </el-date-picker>
            </span>
          </div>
        </div>
        <div class="second-line">
          <span class="inquire-button">
            <!-- 查询 -->
            <el-button
              type="primary"
              @click="findFilter"
            >
              {{$t('M.otc_inquiries')}}
            </el-button>
            <!-- 重置 -->
            <el-button
              type="primary"
              @click="resetCondition"
            >
              {{$t('M.otc_MerchantsOrders_reset')}}
            </el-button>
          </span>
        </div>
        <!-- 下部分表格内容 -->
        <div class="orders-main-bottom">
          <!--1 表格-->
          <div class="table-box">
            <el-table
              :data = "merchantsOrdersList"
              style = "width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 交易日期 -->
              <el-table-column
                :label = "$t('M.otc_transaction_data')"
                width="95px"
              >
                <template slot-scope = "s">
                  <div>{{timeFormatting(s.row.createTime)}}</div>
                </template>
              </el-table-column>
              <!-- 广告id -->
              <el-table-column
                :label = "$t('M.otc_AD_ID')"
                width="100"
              >
                <template slot-scope = "s">
                  <div>{{s.row.entrustSequence}}</div>
                </template>
              </el-table-column>
              <!-- 订单号 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_orderNum')"
                width="129"
              >
                <template slot-scope = "s">
                  <div>{{s.row.orderSequence}}</div>
                </template>
              </el-table-column>
              <!-- 币种 -->
              <el-table-column
                :label = "$t('M.otc_Merchants_Orders_market')"
                width="80"
              >
                <template slot-scope = "s">
                  <div>{{s.row.coinName}}</div>
                </template>
              </el-table-column>
              <!-- 交易类型 -->
              <el-table-column
                :label = "$t('M.otc_type_ransaction')"
                width="90"
              >
                <template slot-scope = "s">
                  <div
                    v-if="s.row.orderType === 'BUY'"
                    :class="{red:s.row.orderType === 'BUY'}"
                  >
                    <!-- 购买 -->
                    {{$t('M.comm_buying')}}
                  </div>
                  <div
                    v-if="s.row.orderType === 'SELL'"
                    :class="{green:s.row.orderType === 'SELL'}"
                  >
                    <!-- 出售 -->
                    {{$t('M.comm_offering')}}
                  </div>
                </template>
              </el-table-column>
              <!-- 订单状态 -->
              <!-- 状态 (未付款 PICKED 已付款 PAYED 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN) -->
              <el-table-column
                :label = "$t('M.otc_order_status')"
                width="110"
              >
                <template slot-scope = "s">
                  <div v-show="s.row.status === 'PICKED'">
                    {{$t('M.otc_enum_status_weifukuan')}}
                  </div>
                  <div v-show="s.row.status === 'PAYED'">
                    {{$t('M.otc_enum_status_yifukuan')}}
                  </div>
                  <div v-show="s.row.status === 'COMPLETED'">
                    {{$t('M.otc_enum_status_yiwancheng')}}
                  </div>
                  <div v-show="s.row.status === 'CANCELED'">
                    {{$t('M.otc_enum_status_yiquxiao')}}
                  </div>
                  <div v-show="s.row.status === 'FROZEN'">
                    {{$t('M.otc_freezing')}}
                  </div>
                </template>
              </el-table-column>
              <!-- 货币 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_currecy')"
                width="83"
              >
                <template slot-scope = "s">
                  <div>{{s.row.currencyName}}</div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label = "$t('M.otc_index_Payment_method')"
                width="123"
              >
                <template slot-scope = "s">
                  <div>
                    <!-- 支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-show="s.row.payType === 'Alipay'"
                    />
                    <!-- 微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-show="s.row.payType === 'Wechat'"
                    />
                    <!-- 银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-show="s.row.payType === 'Bankcard'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payType === 'WestUnion'">
                    <img
                      src="../../assets/user/xilian.png"
                      class="xilian"
                    >
                  </span>
                    <!--  5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-show="s.row.payType === 'PAYPAL'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 成交价 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_transaction_price')"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.price) }}</div>
                </template>
              </el-table-column>
              <!-- 成交量 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_transaction_mount')"
                width="100"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.pickCount) }}</div>
                </template>
              </el-table-column>
              <!-- 总金额 -->
              <el-table-column
                :label = "$t('M.otc_canceled_total')"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.payAmount) }}</div>
                </template>
              </el-table-column>
              <!-- 对方姓名 -->
              <el-table-column
                :label = "$t('M.otc_name_other')"
                width="96"
              >
                <template slot-scope = "s">
                  <div>{{s.row.otherName}}</div>
                </template>
              </el-table-column>
              <!-- 申诉记录 -->
              <el-table-column
                :label = "$t('M.otc_record_complaint')"
                width="120"
                align="right"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.appeal == 'YES'? $t('M.otc_MerchantsOrders_seller_appeal') : $t('M.otc_MerchantsOrders_no')}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--2 分页-->
          <div class="page text-align-c">
            <el-pagination
              background
              v-show="merchantsOrdersList.length && totalPages -1 > 0"
              layout="prev, pager, next"
              :page-count="totalPages"
              @current-change="changeCurrentPage"
              :current-page="currentPage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../components/Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {
  getOTCAvailableCurrency,
  getMerchantAvailableLegalTender,
  getOTCMerchantsOrdersList
} from '../../utils/api/OTC'
import {
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 商家订单内容的高度
      height: '',
      // 每页显示的条数
      pageSize: 10,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 1.0 商家订单筛选下拉框数组--交易类型
      // 选中的筛选项
      activatedMerchantsOrdersTraderStyleList: '',
      merchantsOrdersTraderStyleList: [
        {
          value: 'BUY',
          label: 'M.comm_buying'
        },
        {
          value: 'SELL',
          label: 'M.comm_offering'
        }
      ],
      // 商家订单筛选下拉框 币种
      activatedMerchantsOrdersCoin: '',
      merchantsOrdersCoinList: [],
      // 商家订单筛选下拉框 法币
      activatedMerchantsOrdersCurrency: '',
      merchantsOrdersCurrencyList: [],
      // 2.0 商家订单筛选下拉框数组--状态
      // 选中的筛选项
      activatedMerchantsOrdersStatusList: '',
      merchantsOrdersStatusList: [
        // 已付款
        {
          value: 'PAYED',
          label: 'M.otc_enum_status_yifukuan'
        },
        // 未付款
        {
          value: 'PICKED',
          label: 'M.otc_enum_status_weifukuan'
        },
        // 已完成
        {
          value: 'COMPLETED ',
          label: 'M.otc_enum_status_yiwancheng'
        },
        // 已取消
        {
          value: 'CANCELED',
          label: 'M.otc_enum_status_yiquxiao'
        },
        // 已冻结
        {
          value: 'FROZEN',
          label: 'M.otc_enum_status_yidongjie'
        }
      ],
      // 商家订单列表
      merchantsOrdersList: [],
      // 时间选择器
      checkedTime: [], // 时间选择器选中的时间
      pickerOptionsTime: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  created () {
    // 动态获取商家订单内容的高度
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailableLegalTenderList()
    // 3.0 加载列表
    this.getOTCEntrustingOrdersRevocation()
  },
  mounted () {
    this.setDateWidth(this.language)
  },
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    // 1分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersRevocation()
    },
    // 设置日期选择组件的宽度
    setDateWidth (val) {
      if (val === 'vi_VN') {
        document.querySelector('.el-date-editor--daterange').style.width = '285px'
      } else {
        document.querySelector('.el-date-editor--daterange').style.width = '180px'
      }
    },
    // 2时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3页面加载时 可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
      })
      // console.log('可用币种列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.merchantsOrdersCoinList = getNestedData(data, 'data')
      }
    },
    // 4页面加载时 可用法币查询
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender({
      })
      // console.log('可用法币')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.merchantsOrdersCurrencyList = getNestedData(data, 'data')
      }
    },
    // 5 change事件改变时赋值
    changeSelectValue (type, targetValue) {
      switch (type) {
        // 选中交易 类型 赋值
        case 'changeMerchantsOrdersTraderStyleList':
          this.activatedMerchantsOrdersTraderStyleList = targetValue
          break
        // 选中 币种 状态赋值
        case 'changeMerchantsOrdersCoin':
          this.activatedMerchantsOrdersCoin = targetValue
          break
        // 选中 货币 状态赋值
        case 'changeMerchantsOrdersCurrency':
          this.activatedMerchantsOrdersCurrency = targetValue
          break
        // 选中 状态 赋值
        case 'changeMerchantsOrdersStatusList':
          this.activatedMerchantsOrdersStatusList = targetValue
          break
        case 'date':
          console.log(targetValue)
          this.checkedTime = targetValue
          console.log(this.checkedTime[0], this.checkedTime[1])
          break
      }
    },
    // 6 点击查询按钮
    findFilter () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.getOTCEntrustingOrdersRevocation()
    },
    // 7 重置
    resetCondition () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.activatedMerchantsOrdersTraderStyleList = ''
      this.activatedMerchantsOrdersCoin = ''
      this.activatedMerchantsOrdersCurrency = ''
      this.activatedMerchantsOrdersStatusList = ''
      this.checkedTime = []
      this.getOTCEntrustingOrdersRevocation()
    },
    // 8 页面加载时请求接口渲染列表
    getOTCEntrustingOrdersRevocation: _.debounce(async function () {
      let data = await getOTCMerchantsOrdersList({
        // 当前页数
        pageNum: this.currentPage,
        // 每页条数
        pageSize: this.pageSize,
        // 币种
        coinId: this.activatedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activatedMerchantsOrdersCurrency,
        // 状态 状态 (未付款 PICKED 已付款 PAYED 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        status: this.activatedMerchantsOrdersStatusList,
        // 开始时间
        startTime: this.checkedTime[0] ? this.checkedTime[0] : '',
        // 结束时间
        endTime: this.checkedTime[1] ? this.checkedTime[1] : '',
        // 类型
        tradeType: this.activatedMerchantsOrdersTraderStyleList
      })
      // 返回数据正确的逻辑 重新渲染列表
      // console.log('商家订单列表')
      // console.log(data)
      if (!data) return false
      if (data.data) {
        let merchantsOrdersListData = getNestedData(data, 'data')
        this.merchantsOrdersList = getNestedData(merchantsOrdersListData, 'list')
        this.totalPages = getNestedData(merchantsOrdersListData, 'pages') - 0 // 分页
      }
    }, 500)
  },
  // filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme,
      footerHeight: state => state.common.footerHeight
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    language (val) {
      this.setDateWidth(val)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .otc-merchants-orders-box {
    margin-top: 50px;
    overflow: hidden;

    > .otc-merchants-orders-content {
      width: 1300px;
      padding-top: 20px;
      margin: 50px auto 10px;

      > .merchants-title {
        height: 20px;
        margin-bottom: 30px;
        line-height: 20px;
      }

      > .merchants-orders-main {
        > .orders-main-top {
          display: flex;
          justify-content: space-between;
          height: 60px;
          line-height: 60px;

          .filtrate-text {
            margin-right: 5px;
          }

          .status-input {
            margin-right: 46px;
          }

          .inquire-button {
            float: right;
          }
        }

        > .second-line {
          display: flex;
          justify-content: flex-end;
          height: 60px;
          line-height: 40px;
        }

        > .orders-main-bottom {
          > .table-box {
            height: 450px;
          }

          > .page {
            padding: 10px 0;
          }

          .xilian {
            vertical-align: middle;
          }
        }
      }
    }

    /deep/ {
      .style-input {
        .el-select {
          width: 100px;
        }
      }

      .status-input {
        .el-select {
          width: 100px;
        }
      }

      /* 日期插件 */
      .date-picker {
        .el-range-editor.el-input__inner {
          padding: 3px 5px;
        }

        .el-date-editor--daterange.el-input__inner {
          width: 180px;
        }

        .el-date-editor {
          .el-range-separator {
            line-height: 26px;
          }

          .el-range__close-icon {
            width: 0;
          }

          .el-range-input {
            font-size: 12px;
          }
        }
      }

      .el-input__inner {
        height: 34px;
        border: 0;
        font-size: 12px;
      }

      .el-input__icon {
        height: 34px;
        line-height: 34px;
      }

      .inquire-button {
        .el-button {
          padding: 10px 16px;
          border: 0;
          font-size: 12px;
        }
      }

      .orders-main-bottom {
        .el-table {
          padding-bottom: 15px;
          font-size: 12px;

          tr {
            height: 40px;
          }

          th {
            padding: 5px 0;

            &.is-leaf {
              &:first-of-type {
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
              }

              &:nth-last-of-type(2) {
                border-top-right-radius: 5px;
                border-bottom-right-radius: 5px;
              }
            }
          }

          td {
            padding: 0;
            border-bottom: 0;
          }

          .el-table__header {
            margin-bottom: 10px;
          }

          .el-table__body {
            tr {
              &:last-of-type {
                td {
                  &:first-of-type {
                    border-bottom-left-radius: 5px;
                  }

                  &:last-of-type {
                    border-bottom-right-radius: 5px;
                  }
                }
              }
            }
          }

          .el-table__empty-block {
            height: 400px;
          }
        }
      }
    }

    &.night {
      background-color: $mainNightBgColor;

      > .otc-merchants-orders-content {
        > .merchants-title {
          border-left: 3px solid $mainColor;
          color: $mainColor;
        }

        > .merchants-orders-main {
          > .orders-main-top {
            .filtrate-text {
              color: #9da5b3;
            }
          }

          > .orders-main-bottom {
            background-color: $mainContentNightBgColor;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }
        }
      }

      /deep/ {
        .el-input--suffix .el-input__inner {
          color: #fff;
        }

        .el-input__inner {
          background-color: $mainContentNightBgColor;
        }

        .inquire-button {
          .el-button {
            background: $nightButtonBgColor1;
          }
        }

        .orders-main-bottom {
          .el-table {
            color: #9da5b3;
            background-color: $mainContentNightBgColor;

            thead {
              color: $mainNightTitleColor;
            }

            tr {
              background-color: $mainContentNightBgColor;
            }

            th {
              background-color: $mainContentNightBgColor;
              box-shadow: 4px 4px 6px #191e28;

              &.is-leaf {
                border-top: 1px solid $mainContentNightBgColor;
                border-bottom: 1px solid $mainContentNightBgColor;

                &:first-of-type {
                  border-left: 1px solid $mainContentNightBgColor;
                }

                :nth-last-of-type(2) {
                  border-right: 1px solid $mainContentNightBgColor;
                }
              }
            }

            .el-table__body {
              tr {
                &:last-of-type {
                  td {
                    border-bottom: 1px solid $mainContentNightBgColor;
                  }
                }

                td {
                  &:first-of-type {
                    border-left: 1px solid $mainContentNightBgColor;
                  }

                  &:last-of-type {
                    border-right: 1px solid $mainContentNightBgColor;
                  }
                }
              }
            }
          }
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                td {
                  background-color: #1e2636;
                }
              }
            }
          }
        }

        /* 日期插件 */
        .date-picker {
          .el-range-input {
            color: $mainBgColorOfDay;
          }

          .el-range-separator {
            color: $mainBgColorOfDay;
          }
        }
      }
    }

    &.day {
      background-color: $mainBgColorOfDay;

      > .otc-merchants-orders-content {
        > .merchants-title {
          border-left: 3px solid $mainColor;
          color: $mainColor;
        }

        > .merchants-orders-main {
          > .orders-main-top {
            .filtrate-text {
              color: $fontColorSecondaryOfDay;
            }
          }

          > .orders-main-bottom {
            background-color: $mainColorOfWhite;
            box-shadow: 0 0 6px $boxShadowColorOfDay;

            .red {
              color: $upColor;
            }

            .green {
              color: $otcGreen;
            }
          }
        }
      }

      /deep/ {
        .el-input--suffix .el-input__inner {
          color: $dayMainTitleColor;
        }

        .el-input__inner {
          border: 1px solid $borderColorOfDay;
          color: $dayMainTitleColor !important;
          background-color: $mainDayBgColor;
        }

        .otc-merchants-orders-content {
          > .merchants-orders-main {
            > .orders-main-top {
              > .filtrate-text[data-v-3d7faed3] {
                color: $fontColorSecondaryOfDay;
              }
            }
          }
        }

        .inquire-button {
          .el-button {
            background: $dayButtonBgColor2;
          }
        }

        .el-input {
          .el-input--suffix {
            > input {
              &::-webkit-input-placeholder {
                color: $fontColorSecondaryOfDay;
              }
            }
          }
        }

        .orders-main-bottom {
          .el-table {
            color: $dayMainTitleColor;
            background-color: $mainDayBgColor;

            thead {
              color: $fontColorSecondaryOfDay;
            }

            th {
              background-color: $mainDayBgColor;
              box-shadow: none;
              border-right: 0;

              &.is-leaf {
                border-bottom: 1px solid #ecf1f8;

                &:first-of-type {
                  border-left: 0 solid #ecf1f8;
                  border-radius: 0;
                }

                &:nth-last-of-type(2) {
                  border-right: 0 solid #ecf1f8;
                  border-radius: 0;
                }
              }
            }
          }
        }

        .el-button--primary {
          border: none;
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        /* 日期插件 */
        .date-picker {
          .el-range-input {
            color: $dayMainTitleColor;
          }

          .el-range-separator {
            color: $dayMainTitleColor;
          }
        }
      }
    }
  }
</style>
