<template>
  <div
    class="otc-merchants-orders-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 2.0 商家订单 -->
    <div
      class="otc-merchants-orders-content"
      :style="{'min-height':(height-305)+'px'}"
    >
      <!-- 2.1 大标题商家订单 -->
      <div class="merchants-title font-size20 padding-l15 font-weight700">
        <!-- 商家订单 -->
        {{$t('M.otc_MerchantsOrders')}}
      </div>
      <!-- 2.2 商家订单主体内容 -->
      <div class="merchants-orders-main">
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <!-- 交易类型 -->
          <span class="filtrate-text font-size14">
            {{$t('M.otc_type_ransaction')}}
          </span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersTraderStyleList"
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
          <!-- 币种 -->
          <span class="filtrate-text font-size14">
            {{$t('M.otc_AD_token')}}
          </span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersCoin"
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
          <!-- 货币 -->
          <span class="filtrate-text font-size14">
            {{$t('M.otc_MerchantsOrders_currecy')}}
          </span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersCurrency"
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
          <!-- 状态 -->
          <span class="filtrate-text font-size14">
            {{$t('M.comm_state')}}
          </span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersStatusList"
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
          <!-- 日期 -->
          <span class="filtrate-text font-size14">
            {{$t('M.otc_MerchantsOrders_date')}}
          </span>
          <span class="date-picker">
            <!--开始日期-->
            <el-date-picker
              :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
              v-model="startTimeValue"
              type="date"
              value-format="yyyy-MM-dd"
              @change="changeSelectValue('startDate' , $event)"
              clearable
            >
            </el-date-picker>
            <span class="date-short-line">-</span>
            <!--结束日期-->
            <el-date-picker
              :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
              v-model="endTimeValue"
              value-format="yyyy-MM-dd"
              type="date"
              @change="changeSelectValue('endDate', $event)"
              clearable
            >
            </el-date-picker>
          </span>
          <br>
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
          <el-table
            :data = "merchantsOrdersList"
            style = "width: 100%;"
            :empty-text="$t('M.comm_no_data')"
            v-loading="loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <!-- 交易日期 -->
            <el-table-column
              :label = "$t('M.otc_transaction_data')"
            >
              <template slot-scope = "s">
                <div>{{timeFormatting(s.row.createTime)}}</div>
              </template>
            </el-table-column>
            <!-- 订单号 -->
            <el-table-column
              :label = "$t('M.otc_MerchantsOrders_orderNum')"
              width="130"
            >
              <template slot-scope = "s">
                <div>{{s.row.orderSequence}}</div>
              </template>
            </el-table-column>
            <!-- 币种 -->
            <el-table-column
              :label = "$t('M.otc_Merchants_Orders_market')"
            >
              <template slot-scope = "s">
                <div>{{s.row.coinName}}</div>
              </template>
            </el-table-column>
            <!-- 交易类型 -->
            <el-table-column
              :label = "$t('M.otc_type_ransaction')"
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
            >
              <template slot-scope = "s">
                <div>{{s.row.currencyName}}</div>
              </template>
            </el-table-column>
            <!-- 支付方式 -->
            <el-table-column
              :label = "$t('M.otc_index_Payment_method')"
              width="106"
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
                <div>{{s.row.price}}</div>
              </template>
            </el-table-column>
            <!-- 成交量 -->
            <el-table-column
              :label = "$t('M.otc_MerchantsOrders_transaction_mount')"
            >
              <template slot-scope = "s">
                <div>{{s.row.pickCount}}</div>
              </template>
            </el-table-column>
            <!-- 总金额 -->
            <el-table-column
              :label = "$t('M.otc_canceled_total')"
            >
              <template slot-scope = "s">
                <div>{{s.row.payAmount}}</div>
              </template>
            </el-table-column>
            <!-- 对方姓名 -->
            <el-table-column
              :label = "$t('M.otc_name_other')"
            >
              <template slot-scope = "s">
                <div>{{s.row.otherName}}</div>
              </template>
            </el-table-column>
            <!-- 申诉记录 -->
            <el-table-column
              :label = "$t('M.otc_record_complaint')"
            >
              <template slot-scope = "s">
                <div>
                  {{s.row.appeal == 'YES'? $t('M.otc_MerchantsOrders_seller_appeal') : $t('M.otc_MerchantsOrders_no')}}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="merchantsOrdersList.length"
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
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../components/Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {
  getOTCAvailableCurrency,
  getMerchantAvailablelegalTender,
  getOTCMerchantsOrdersList
} from '../../utils/api/OTC'
import {returnAjaxMsg, getNestedData} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      loading: true, // loading加载
      height: '', // 商家订单内容的高度
      // 分页
      pageSize: 10, // 每页显示的条数
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 1.0 商家订单筛选下拉框数组--交易类型
      activitedMerchantsOrdersTraderStyleList: '', // 选中的筛选项
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
      activitedMerchantsOrdersCoin: '',
      merchantsOrdersCoinList: [],
      // 商家订单筛选下拉框 法币
      activitedMerchantsOrdersCurrency: '',
      merchantsOrdersCurrencyList: [],
      // 2.0 商家订单筛选下拉框数组--状态
      activitedMerchantsOrdersStatusList: '', // 选中的筛选项
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
      startTimeValue: '', // 默认开始时间
      endTimeValue: '', // 默认结束时间
      merchantsOrdersList: [] // 商家订单列表
    }
  },
  created () {
    // 动态获取商家订单内容的高度
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    require('../../../static/css/list/OTC/OTCMerchantsOrders.css')
    require('../../../static/css/theme/day/OTC/OTCMerchantsOrdersDay.css')
    require('../../../static/css/theme/night/OTC/OTCMerchantsOrdersNight.css')
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailablelegalTenderList()
    // 3.0 加载列表
    this.getOTCEntrustingOrdersRevocation()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.loading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 2时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3页面加载时 可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
      })
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.merchantsOrdersCoinList = data.data.data
        this.merchantsOrdersCoinList = getNestedData(data, 'data.data')
      }
    },
    // 4页面加载时 可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
      })
      console.log('可用法币')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.merchantsOrdersCurrencyList = data.data.data
        this.merchantsOrdersCurrencyList = getNestedData(data, 'data.data')
      }
    },
    // 5 change事件改变时赋值
    changeSelectValue (type, targetValue) {
      console.log('11111', type, targetValue)
      switch (type) {
        // 选中交易 类型 赋值
        case 'changeMerchantsOrdersTraderStyleList':
          this.activitedMerchantsOrdersTraderStyleList = targetValue
          break
        // 选中 币种 状态赋值
        case 'changeMerchantsOrdersCoin':
          this.activitedMerchantsOrdersCoin = targetValue
          break
        // 选中 货币 状态赋值
        case 'changeMerchantsOrdersCurrency':
          this.activitedMerchantsOrdersCurrency = targetValue
          break
        // 选中 状态 赋值
        case 'changeMerchantsOrdersStatusList':
          this.activitedMerchantsOrdersStatusList = targetValue
          break
        // 初始 日期赋值
        case 'startDate':
          this.startTimeValue = targetValue
          if (this.endTimeValue) {
            if (this.startTimeValue > this.endTimeValue) {
              this.$message({ // message: '开始时间不能大于结束时间',
                message: this.$t('M.otc_time_limit'),
                type: 'error'
              })
              return false
            }
          }
          break
        // 结束 日期赋值
        case 'endDate':
          this.endTimeValue = targetValue
          if (this.startTimeValue) {
            if (this.startTimeValue > this.endTimeValue) {
              this.$message({ // message: '开始时间不能大于结束时间',
                message: this.$t('M.otc_time_limit'),
                type: 'error'
              })
              return false
            }
          }
          break
      }
    },
    // 6点击查询按钮
    findFilter () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.loading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 7重置
    resetCondition () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.activitedMerchantsOrdersTraderStyleList = ''
      this.activitedMerchantsOrdersCoin = ''
      this.activitedMerchantsOrdersCurrency = ''
      this.activitedMerchantsOrdersStatusList = ''
      this.startTimeValue = ''
      this.endTimeValue = ''
      this.loading = true
      this.getOTCEntrustingOrdersRevocation()
    },
    // 8页面加载时请求接口渲染列表
    async getOTCEntrustingOrdersRevocation () {
      let data = await getOTCMerchantsOrdersList({
        // 当前页数
        pageNum: this.currentPage,
        // 每页条数
        pageSize: this.pageSize,
        // 币种
        coinId: this.activitedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activitedMerchantsOrdersCurrency,
        // 状态 状态 (未付款 PICKED 已付款 PAYED 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        status: this.activitedMerchantsOrdersStatusList,
        // 开始时间
        startTime: this.startTimeValue,
        // 结束时间
        endTime: this.endTimeValue,
        // 类型
        tradeType: this.activitedMerchantsOrdersTraderStyleList
      })
      // 提示信息
      console.log('商家订单列表')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        this.loading = false
        return false
      } else {
        this.loading = false
        // 返回数据正确的逻辑 重新渲染列表
        // let merchantsOrdersListData = data.data.data
        let merchantsOrdersListData = getNestedData(data, 'data.data')
        this.merchantsOrdersList = merchantsOrdersListData.list
        // 分页
        this.totalPages = merchantsOrdersListData.pages - 0
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";

  .otc-merchants-orders-box {
    margin-top: 66px;
    overflow: hidden;

    > .otc-merchants-orders-content {
      width: 1150px;
      padding-top: 50px;
      margin: 70px auto 10px;

      > .merchants-title {
        height: 30px;
        margin-bottom: 30px;
        line-height: 30px;
      }

      > .merchants-orders-main {
        > .orders-main-top {
          min-height: 60px;
          margin-bottom: 25px;
          line-height: 60px;

          > .filtrate-text {
            margin-right: 5px;
          }

          > .status-input {
            margin-right: 40px;
          }

          > .date-picker {
            > .date-short-line {
              margin: 0 3px;
            }
          }

          > .inquire-button {
            float: right;
          }
        }

        > .orders-main-bottom {
          min-height: 440px;

          .xilian {
            vertical-align: middle;
          }
        }

        .page {
          padding: 10px 0;
          text-align: center;
        }
      }
    }

    &.night {
      background-color: $mainNightBgColor;

      > .otc-merchants-orders-content {
        > .merchants-title {
          border-left: 3px solid #338ff5;
          color: #338ff5;
        }

        > .merchants-orders-main {
          > .orders-main-top {
            > .filtrate-text {
              color: #9da5b3;
            }

            > .all-clear {
              color: #338ff5;
            }
          }

          > .orders-main-bottom {
            min-height: 440px;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }
        }
      }
    }

    &.day {
      background-color: $mainDayBgColor;

      > .otc-merchants-orders-content {
        > .merchants-title {
          border-left: 3px solid #338ff5;
          color: #338ff5;
        }

        > .merchants-orders-main {
          > .orders-main-top {
            > .filtrate-text {
              color: #9da5b3;
            }

            > .all-clear {
              color: #338ff5;
            }
          }

          > .orders-main-bottom {
            min-height: 440px;

            .red {
              color: #d45858;
            }

            .green {
              color: #008069;
            }
          }
        }
      }
    }
  }
</style>
