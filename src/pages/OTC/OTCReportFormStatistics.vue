<template>
  <div
    class="otc-report-form-statistics-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 2.0 -->
    <div class="report-form-statistics-content">
      <!-- 2.1 报表统计标题 -->
      <div class="report-form-title font-size18 padding-l15 font-weight700">
        <!-- 报表统计 -->
        {{$t('M.otc_formStatistics')}}
      </div>
      <!-- 2.2 筛选条件 -->
      <div class="report-form-filtrate">
        <!-- 交易币种 -->
        <span class="filtrate-text font-size14">
          {{$t('M.otc_trade')}}{{$t('M.otc_AD_token')}}
        </span>
        <span class="currency-input">
          <el-select
            v-model="activatedTraderCoinId"
            :no-data-text="$t('M.comm_no_data')"
            @change="changeCoinId"
          >
            <el-option
              v-for="(item,index) in traderCoinList"
              :key="index"
              :value="item.coinId"
              :label="item.name"
            >
            </el-option>
          </el-select>
        </span>
        <!-- 交易法币 -->
        <span class="filtrate-text font-size14">
          {{$t('M.otc_trade')}}{{$t('M.comm_coin')}}
        </span>
        <span class="legal-tender-input">
          <el-select
            v-model="activatedTraderCurrencyCoinsId"
            :no-data-text="$t('M.comm_no_data')"
            @change="changeCurrencyCoinsId"
          >
            <el-option
              v-for="(item,index) in traderCurrencyCoinsList"
              :key="index"
              :value="item.id"
              :label="language == 'zh_CN'? item.name : item.shortName"
            >
            </el-option>
          </el-select>
        </span>
      </div>
      <!-- 2.3 资产配置 -->
      <div
        class="report-form-asset"
      >
        <div class="title padding-l15 border-radius5">
          {{$t('M.otc_formStatistics_asset')}}
        </div>
        <div
          class="content font-size18"
        >
          <!-- 币种总资产 -->
          <span>{{$scientificToNumber(total)}}&nbsp;{{activatedTraderCoinName}}</span>
          <!-- 法币总资产 -->
          <span v-show="totalAssets">≈&nbsp;{{$scientificToNumber(totalAssets)}}&nbsp;{{activatedTraderCurrencyCoinsName}}</span>
        </div>
      </div>
      <!-- 2.4 购买和销售 -->
      <div
        class="report-form-buy-sell"
      >
        <!-- 购买 -->
        <div class="common buy">
          <!-- 头 -->
          <div class="head padding-l15 border-radius5">
            {{$t('M.comm_buying')}}
          </div>
          <!-- 内容 -->
          <div class="body">
            <!-- 当日 -->
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_date')}}
                  <br />
                  {{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">
                    {{ $scientificToNumber(buyDayMap.count) || '--' }}{{ activatedTraderCoinName }}
                  </span>
                </p>
                <!--购买均价-->
                <p>
                  <span>
                    {{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:
                  </span>
                  <span class="data">
                    {{ $scientificToNumber(buyDayMap.average) || '--' }}{{ activatedTraderCurrencyCoinsName }}
                  </span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">
                    {{ $scientificToNumber(buyDayMap.amount) || '--' }}{{ activatedTraderCurrencyCoinsName }}
                  </span>
                </p>
                <!--成交订单-->
                <p>
                  <span>
                    {{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:
                  </span>
                  <span class="data">
                    {{ $scientificToNumber(buyDayMap.num) || '--' }}{{$t('M.comm_stock')}}
                  </span>
                </p>
              </div>
            </div>
            <!-- 当周 -->
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_week')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyWeekMap.count) || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyWeekMap.average) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyWeekMap.amount) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyWeekMap.num) || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当月 -->
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_mouth')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyMonthMap.count) || '--' || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyMonthMap.average) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyMonthMap.amount) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyMonthMap.num) || '--' || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 历史 -->
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_history')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyHistoryMap.count) || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_buying')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyHistoryMap.average) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_amount_paid')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyHistoryMap.amount) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(buyHistoryMap.num) || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 销售 -->
        <div class="common sell">
          <!-- 头 -->
          <div class="head padding-l15 border-radius5">
            {{$t('M.otc_sell')}}
          </div>
          <!-- 内容 -->
          <div class="body">
            <!-- 当日 -->
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_date')}}
                  <br />
                  {{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellDayMap.count) || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellDayMap.average) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_income_money')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellDayMap.amount) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellDayMap.num) || '--' || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当周 -->
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                 {{$t('M.otc_formStatistics_week')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellWeekMap.count) || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellWeekMap.average) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_income_money')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellWeekMap.amount) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellWeekMap.num) || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 当月 -->
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_mouth')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellMonthMap.count) || '--' || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellMonthMap.average) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_income_money')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellMonthMap.amount) || '--' || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellMonthMap.num) || '--' || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
            <!-- 历史 -->
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  {{$t('M.otc_formStatistics_history')}}<br />{{$t('M.otc_trade')}}
                </span>
              </div>
              <div class="right">
                <!--购买数量-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.comm_count')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellHistoryMap.count) || '--' }}{{ activatedTraderCoinName }}</span>
                </p>
                <!--购买均价-->
                <p>
                  <span>{{$t('M.comm_offering')}}{{$t('M.otc_formStatistics_average')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellHistoryMap.average) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--支出金额-->
                <p>
                  <span>{{$t('M.otc_formStatistics_income_money')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellHistoryMap.amount) || '--' }}{{ activatedTraderCurrencyCoinsName }}</span>
                </p>
                <!--成交订单-->
                <p>
                  <span>{{$t('M.otc_formStatistics_turnover')}}{{$t('M.comm_order')}}:</span>
                  <span class="data">{{ $scientificToNumber(sellHistoryMap.num) || '--' }}{{$t('M.comm_stock')}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 2.5 订单详情 -->
      <div class="report-form-details">
        <!-- 2.5.1 标题 -->
        <div class="title padding-l15 border-radius5">
          {{$t('M.otc_formStatistics_orderDeatil')}}
        </div>
        <!-- 主要内容 -->
        <div class="content">
          <!-- 2.5.2 选择日期 -->
          <div class="date">
            <!-- 左侧日历 -->
            <div class="select-date">
              <span class="text">{{$t('M.otc_MerchantsOrders_date')}}</span>
              <span class="date-picker">
                <!--开始日期-->
                <el-date-picker
                  :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
                  v-model="startTimeValue"
                  type="date"
                  value-format="yyyy-MM-dd"
                  @change="startTime"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <span class="date-short-line">-</span>
                <!--结束日期-->
                <el-date-picker
                  :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_MerchantsOrders_date')"
                  v-model="endTimeValue"
                  value-format="yyyy-MM-dd"
                  type="date"
                  @change="endTime"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </span>
            </div>
            <!-- 右侧单选日期按钮 -->
            <div class="radio-date">
              <el-radio-group
                v-model="activatedRadioId"
                @change="radioChoose"
              >
                <el-radio :label="1">
                  {{$t('M.otc_formStatistics_date')}}
                </el-radio>
                <el-radio :label="2">
                  {{$t('M.otc_formStatistics_week')}}
                </el-radio>
                <el-radio :label="3">
                  {{$t('M.otc_formStatistics_mouth')}}
                </el-radio>
                <el-radio :label="4">
                  {{$t('M.otc_formStatistics_history')}}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 2.5.3 订单表格详情 -->
          <div class="order-table">
            <el-table
              :data = "orderInfoList"
              style = "width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 交易日期 -->
              <el-table-column
                :label = "$t('M.otc_transaction_data')"
                width="210"
              >
                <template slot-scope = "s">
                  <div>{{timeFormatting(s.row.createTime)}}</div>
                </template>
              </el-table-column>
              <!-- 订单号 -->
              <el-table-column
                :label = "$t('M.otc_MerchantsOrders_orderNum')"
                width="210"
              >
                <template slot-scope = "s">
                  <div>{{s.row.orderSequence}}</div>
                </template>
              </el-table-column>
              <!-- 交易类型 -->
              <el-table-column
                :label = "$t('M.otc_type_ransaction')"
                width="170"
              >
                <template slot-scope = "s">
                  <div
                    v-if="s.row.orderType === 'BUY'"
                    :class="{red:s.row.orderType === 'BUY'}"
                  >
                    {{$t('M.comm_buying')}}
                  </div>
                  <div
                    v-if="s.row.orderType === 'SELL'"
                    :class="{green:s.row.orderType === 'SELL'}"
                  >
                    {{$t('M.comm_offering')}}
                  </div>
                </template>
              </el-table-column>
              <!-- 资金类型 -->
              <el-table-column
                :label = "$t('M.otc_type_capital')"
                width="170"
              >
                <template slot-scope = "s">
                  <div>{{s.row.currencyName}}</div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label = "$t('M.comm_count')"
                width="180"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.pickCount) }}</div>
                </template>
              </el-table-column>
              <!-- 单价 -->
              <el-table-column
                :label= "$t('M.otc_index_UnitPrice')"
                width="140"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.price) }}</div>
                </template>
              </el-table-column>
              <!-- 总金额 -->
              <el-table-column
                :label="$t('M.otc_canceled_total')"
                align="right"
                width="140"
              >
                <template slot-scope = "s">
                  <div>{{ $scientificToNumber(s.row.payAmount) }}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--分页-->
          <div class="page text-align-c">
            <el-pagination
              background
              v-show="orderInfoList.length"
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
import {
  getOTCAvailableCurrency,
  getMerchantAvailableLegalTender,
  getOTCMerchantsOrdersList,
  getOTCReportFormStatisticsData
} from '../../utils/api/OTC'
import IconFontCommon from '../../components/Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 分页
      pageSize: 10,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 1.0 广告管理筛选下拉框数组--交易币种
      traderCoinList: [],
      activatedTraderCoinId: '', // 选中的交易币种id
      activatedTraderCoinName: '', // 选中的交易币种name
      // 2.0 广告管理筛选下拉框数组--交易法币
      traderCurrencyCoinsList: [],
      activatedTraderCurrencyCoinsId: '', // 选中的交易法币id
      activatedTraderCurrencyCoinsName: '', // 选中的交易法币name
      // 默认开始时间
      startTimeValue: '',
      // 默认结束时间
      endTimeValue: '',
      // 单选按钮时间
      activatedRadioId: '',
      // 法币总资产
      totalAssets: '',
      // 币种总资产
      total: '',
      // 订单详情
      orderInfoList: [],
      // 购买当日交易
      buyDayMap: {},
      // 购买历史交易
      buyHistoryMap: {},
      // 购买当月交易
      buyMonthMap: {},
      // 购买本周交易
      buyWeekMap: {},
      // 出售当日交易
      sellDayMap: {},
      // 出售历史交易
      sellHistoryMap: {},
      // 出售本月交易
      sellMonthMap: {},
      // 出售本周交易
      sellWeekMap: {},
      // 日期插件增加日期限制:只能选择当天及当前以前的日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  async created () {
    // 1.0 otc可用币种查询
    await this.getOTCAvailableCurrencyList()
    // 2.0 查询可用法币币种列表
    await this.getMerchantAvailableLegalTenderList()
    // 订单详情列表
    this.getOTCEntrustingOrdersRevocation()
    // 报表统计主页
    this.getOTCReportFormStatistics()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersRevocation()
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    //  2.0 otc可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({})
      // console.log('otc可用币种查询')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.traderCoinList = getNestedData(data, 'data')
        // 设置币种默认选中值
        this.activatedTraderCoinId = getNestedData(this.traderCoinList[0], 'coinId')
        // 设置币种默认选中值的名称
        this.activatedTraderCoinName = getNestedData(this.traderCoinList[0], 'name')
      }
    },
    //  2.1 改变可用币种类型
    changeCoinId (e) {
      this.activatedTraderCoinId = e
      this.traderCoinList.forEach(item => {
        if (e === item.coinId) {
          this.activatedTraderCoinName = item.name
          // console.log(this.activatedTraderCoinName)
        }
      })
      this.getOTCReportFormStatistics()
      this.getOTCEntrustingOrdersRevocation()
    },
    //  3.0 查询 可用法币 币种列表
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender({})
      // console.log('查询可用法币币种列表')
      // console.log(data)
      // 返回数据正确的逻辑 将币种列表赋值
      if (!data) return false
      if (data.data) {
        this.traderCurrencyCoinsList = getNestedData(data, 'data')
        // 设置法币默认选中值
        this.activatedTraderCurrencyCoinsId = getNestedData(this.traderCurrencyCoinsList[0], 'id')
        // 设置法币默认选中值的name
        this.activatedTraderCurrencyCoinsName = getNestedData(this.traderCurrencyCoinsList[0], 'shortName')
      }
    },
    //  3.1 改变 可用法币 币种类型
    changeCurrencyCoinsId (e) {
      this.activatedTraderCurrencyCoinsId = e
      this.traderCurrencyCoinsList.forEach(item => {
        if (e === item.id) {
          this.activatedTraderCurrencyCoinsName = item.shortName
        }
      })
      this.getOTCReportFormStatistics()
      this.getOTCEntrustingOrdersRevocation()
    },
    // 开始时间赋值
    startTime (e) {
      this.startTimeValue = e
      this.activatedRadioId = ''
      if (this.endTimeValue) {
        if (this.startTimeValue > this.endTimeValue) {
          // message: '开始时间不能大于结束时间',
          this.$message({
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
      this.getOTCEntrustingOrdersRevocation()
    },
    // 结束时间赋值
    endTime (e) {
      this.endTimeValue = e
      this.activatedRadioId = ''
      if (this.startTimeValue) {
        if (this.startTimeValue > this.endTimeValue) {
          // message: '开始时间不能大于结束时间',
          this.$message({
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
      this.getOTCEntrustingOrdersRevocation()
    },
    // 右侧单选日期按钮change事件
    radioChoose (e) {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.activatedRadioId = e
      if (e == '4') {
        this.startTimeValue = ''
        this.endTimeValue = ''
      }
      this.getOTCEntrustingOrdersRevocation()
    },
    // 报表统计的主页面
    async getOTCReportFormStatistics () {
      let data = await getOTCReportFormStatisticsData({
        // 币种
        coinId: this.activatedTraderCoinId,
        // 法币
        currencyId: this.activatedTraderCurrencyCoinsId
      })
      // 提示信息
      // console.log('报表统计的主页面资产信息')
      // console.log(data)
      if (!data) return false
      let getData = getNestedData(data, 'data')
      // 法币总资产
      this.totalAssets = getNestedData(getData, 'totalAssets')
      // 币种总资产
      this.total = getNestedData(getData, 'total')
      // 当天交易
      this.buyDayMap = getNestedData(getData, 'buyDayMap')
      // 购买历史交易赋值
      this.buyHistoryMap = getNestedData(getData, 'buyHistoryMap')
      // 购买本月赋值
      this.buyMonthMap = getNestedData(getData, 'buyMonthMap')
      // 购买本周赋值
      this.buyWeekMap = getNestedData(getData, 'buyWeekMap')
      // 出售当天赋值
      this.sellDayMap = getNestedData(getData, 'sellDayMap')
      // 出售历史赋值
      this.sellHistoryMap = getNestedData(getData, 'sellHistoryMap')
      // 出售当月赋值
      this.sellMonthMap = getNestedData(getData, 'sellMonthMap')
      // 出售本周赋值
      this.sellWeekMap = getNestedData(getData, 'sellWeekMap')
    },
    // 页面加载时请求接口渲染订单详情列表
    getOTCEntrustingOrdersRevocation: _.debounce(async function () {
      let data = await getOTCMerchantsOrdersList({
        // 当前页数
        pageNum: this.currentPage,
        // 每页条数
        pageSize: this.pageSize,
        // 币种
        coinId: this.activatedTraderCoinId,
        // 法币
        currencyId: this.activatedTraderCurrencyCoinsId,
        // 开始时间
        startTime: this.startTimeValue,
        // 结束时间
        endTime: this.endTimeValue,
        // 日期类型
        dateType: this.activatedRadioId
      })
      // 返回数据正确的逻辑 重新渲染列表
      // console.log('报表列表')
      // console.log(data)
      if (!data) return false
      if (data.data) {
        let ordersRevocationData = getNestedData(data, 'data')
        this.orderInfoList = getNestedData(ordersRevocationData, 'list')
        this.totalPages = getNestedData(ordersRevocationData, 'pages') - 0 // 分页
      }
    }, 500)
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
@import "../../assets/CSS/index";

.otc-report-form-statistics-box {
  margin-top: 50px;
  overflow: hidden;

  > .report-form-statistics-content {
    width: 1300px;
    padding: 20px 0 200px;
    margin: 50px auto 10px;

    > .report-form-title {
      height: 20px;
      margin-bottom: 30px;
      line-height: 20px;
    }

    > .report-form-filtrate {
      > .filtrate-text {
        margin-right: 20px;
      }

      > .currency-input {
        margin-right: 50px;
      }
    }

    > .report-form-asset {
      margin-top: 20px;

      > .title {
        height: 40px;
        line-height: 40px;
      }

      > .content {
        height: 160px;
        border-top: 0;
        border-bottom-right-radius: 5px;
        border-bottom-left-radius: 5px;
        line-height: 160px;
        text-align: center;
      }
    }

    > .report-form-buy-sell {
      display: flex;
      flex: 2;
      margin-top: 20px;

      > .common {
        border-radius: 5px;

        > .head {
          width: 645px;
          height: 40px;
          line-height: 40px;
        }

        > .body {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 645px;
          height: 420px;
          padding: 7px 5px 0;
          border-top: 0;
          border-bottom-right-radius: 5px;
          border-bottom-left-radius: 5px;

          > .together {
            display: flex;
            align-items: center;
            width: 310px;
            height: 197px;

            > .left {
              position: relative;
              flex: 1;
              box-sizing: border-box;
              text-align: center;

              > .round {
                position: absolute;
                top: 50%;
                left: 50%;
                display: inline-block;
                box-sizing: border-box;
                width: 50px;
                height: 50px;
                padding-top: 9px;
                border-radius: 50px;
                transform: translate(-50%, -50%);
              }
            }

            > .right {
              flex: 3;
              line-height: 40px;
            }
          }
        }
      }

      > .buy {
        flex: 1;
        margin-right: 10px;
      }

      > .sell {
        flex: 1;
      }
    }

    > .report-form-details {
      margin-top: 20px;
      border-bottom-right-radius: 5px;
      border-bottom-left-radius: 5px;

      > .title {
        height: 40px;
        line-height: 40px;
      }

      > .content {
        > .date {
          display: flex;
          justify-content: space-between;
          height: 50px;
          padding: 0 50px;
          margin-top: 30px;
          line-height: 50px;

          > .select-date {
            > .text {
              margin-right: 10px;
            }

            > .date-picker {
              > .date-short-line {
                margin: 0 7px;
              }
            }
          }
        }

        > .order-table {
          padding: 0 40px;
          margin-top: 20px;
        }

        .page {
          padding: 10px 0;
        }
      }
    }
  }

  /deep/ {
    .el-input__icon {
      line-height: 34px;
    }

    .currency-input {
      .el-select {
        width: 120px;
      }
    }

    .legal-tender-input {
      .el-select {
        width: 140px;
      }
    }

    .report-form-filtrate {
      .el-input__inner {
        height: 34px;
        border: 0;
      }
    }

    .date {
      .select-date {
        .el-date-editor {
          &.el-input {
            width: 134px;
          }
        }

        .el-input__inner {
          height: 34px;
          border: 0;
        }
      }

      .radio-date {
        .el-radio__label {
          font-size: 12px;
        }

        .el-radio__inner {
          &::after {
            width: 7px;
            height: 7px;
          }
        }
      }
    }

    .order-table {
      .el-table {
        tr {
          height: 40px;
        }

        td {
          padding: 0;
          border-bottom: 0;
        }
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .report-form-statistics-content {
      > .report-form-title {
        border-left: 3px solid $mainColor;
        color: $mainColor;
      }

      > .report-form-filtrate {
        > .filtrate-text {
          color: #9da5b3;
        }
      }

      > .report-form-asset {
        color: $mainColor;
        background-color: #1c1f32;

        > .title {
          border: 1px solid #1c1f32;
          box-shadow: 0 4px 6px #191e28;
        }

        > .content {
          border: 1px solid #1c1f32;
        }
      }

      > .report-form-buy-sell {
        > .common {
          background-color: #1c1f32;

          > .head {
            color: $mainColor;
            box-shadow: 0 4px 6px #191e28;
          }

          > .body {
            border: 1px solid #23263c;

            > .together {
              border: 1px solid #23263c;

              > .left {
                color: #d45858;

                > .round {
                  background-color: #3b3139;
                }
              }

              > .right {
                color: #9da5b3;

                .data {
                  color: #d45858;
                }
              }
            }
          }
        }

        > .sell {
          flex: 1;

          > .body {
            .together {
              > .left {
                color: #008069;

                > .round {
                  background-color: #28403d;
                }
              }

              > .right {
                .data {
                  color: #008069 !important;
                }
              }
            }
          }
        }
      }

      > .report-form-details {
        background-color: #1c1f32;

        > .title {
          color: $mainColor;
        }

        > .content {
          > .date {
            > .select-date {
              > .text {
                color: #9da5b3;
              }
            }

            > .radio-date {
              color: #46505f;
            }
          }

          > .order-table {
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

    /deep/ {
      .el-input--suffix .el-input__inner {
        color: #fff;
      }

      .report-form-filtrate {
        .el-input__inner {
          background-color: #1c1f32;
        }
      }

      .date {
        .select-date {
          .el-date-editor {
            &.el-input {
              width: 134px;
            }
          }

          .el-input__inner {
            background-color: rgba(255, 255, 255, .1);
          }
        }

        .radio-date {
          &.el-radio {
            color: #46505f;
          }

          .el-radio__label {
            color: #fff;
          }

          .el-radio__inner {
            border: 1px solid #b3b3b3;
            background-color: #1c1f32;

            &::after {
              background-color: $mainColor;
            }
          }

          .el-radio__input.is-checked + .el-radio__label {
            color: $mainColor;
          }
        }
      }

      .order-table {
        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: #1e2636;
                }
              }
            }
          }
        }

        .el-table {
          color: #9da5b3;
          background-color: #1c1f32;

          thead {
            color: #a9bed4;
          }

          tr {
            background-color: #1c1f32;
          }

          th {
            background-color: #1c1f32;

            &.is-leaf {
              border-bottom: 1px solid #262f38;
            }
          }
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .report-form-statistics-content {
      > .report-form-title {
        border-left: 3px solid $mainColor;
        color: $mainColor;
      }

      > .report-form-filtrate {
        > .filtrate-text {
          color: #9da5b3;
        }
      }

      > .report-form-asset {
        color: $mainColor;
        background-color: #fff;

        > .title {
          border: 1px solid #ecf1f8;
          box-shadow: 0 4px 6px #f3f3f3;
        }

        > .content {
          border: 1px solid #ecf1f8;
        }
      }

      > .report-form-buy-sell {
        > .common {
          background-color: #fff;

          > .head {
            border: 1px solid #ecf1f8;
            color: $mainColor;
            box-shadow: 0 4px 6px #f3f3f3;
          }

          > .body {
            border: 1px solid #ecf1f8;

            > .together {
              border: 1px solid #ecf1f8;

              > .left {
                color: #d45858;

                > .round {
                  background: rgba(212, 88, 88, .1);
                }
              }

              > .right {
                color: #7d90ac;

                .data {
                  color: #d45858;
                }
              }
            }
          }
        }

        > .sell {
          flex: 1;

          > .body {
            .together {
              > .left {
                color: #008069;

                > .round {
                  background: rgba(84, 189, 116, .1);
                }
              }

              > .right {
                .data {
                  color: #008069 !important;
                }
              }
            }
          }
        }
      }

      > .report-form-details {
        border: 1px solid rgba(38, 47, 56, .1);
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: #fff;

        > .title {
          border-bottom: 1px solid rgba(38, 47, 56, .1);
          color: $mainColor;
        }

        > .content {
          > .date {
            > .select-date {
              > .text {
                color: #9da5b3;
              }
            }

            > .radio-date {
              color: #46505f;
            }
          }

          > .order-table {
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

    /deep/ {
      .el-input--suffix .el-input__inner {
        color: #7d90ac;
      }

      .report-form-filtrate {
        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          border-radius: 2px;
          background-color: #fff;
        }
      }

      .date {
        .radio-date {
          .el-radio__input.is-checked + .el-radio__label {
            color: $mainColor;
          }

          .el-radio__label {
            color: #7d90ac;
          }

          .el-radio__inner {
            border: 1px solid rgba(38, 47, 56, .1);
            background-color: #fff;

            &::after {
              background-color: $mainColor;
            }
          }
        }

        .select-date {
          .el-input__inner {
            border: 1px solid rgba(38, 47, 56, .1);
            background-color: #fff;
          }
        }
      }

      .border-radius5 {
        border-radius: 0;
      }

      > .report-form-statistics-content {
        > .report-form-details {
          > .title[data-v-e69a84f0] {
            border: 1px solid rgba(38, 47, 56, .1);
            border-left: none;
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            box-shadow: 0 0 0 #191e28;
            border-right: none;
          }
        }

        > .report-form-details[data-v-e69a84f0] {
          border: 1px solid rgba(38, 47, 56, .1);
          border-top: 0 solid #000;
          border-top-right-radius: 5px;
          border-top-left-radius: 5px;
          background-color: #fff;
        }

        > .report-form-asset {
          margin-top: 20px;
          border: 1px solid rgba(38, 47, 56, .1);
          border-radius: 0;
          background-color: #fff;

          > .title[data-v-e69a84f0] {
            border: none;
            border-bottom: 1px solid rgba(38, 47, 56, .1);
            box-shadow: 0 0 0 #191e28;
          }

          > .content[data-v-e69a84f0] {
            border: 0 solid rgba(38, 47, 56, .1);
          }
        }

        > .report-form-buy-sell {
          > .sell {
            > .body {
              .together {
                > .left {
                  > .round[data-v-e69a84f0] {
                    background: rgba(84, 189, 116, .15);
                  }
                }
              }
            }
          }

          > .common[data-v-e69a84f0] {
            background-color: #fff;
          }

          > .common {
            > .body {
              > .together[data-v-e69a84f0] {
                border: 1px solid rgba(38, 47, 56, .1);
              }

              > .together {
                > .left {
                  > .round[data-v-e69a84f0] {
                    background-color: rgba(212, 88, 88, .15);
                  }
                }
              }
            }

            > .body[data-v-e69a84f0] {
              border: 1px solid rgba(38, 47, 56, .1);
            }

            > .head[data-v-e69a84f0] {
              border: 1px solid rgba(38, 47, 56, .1);
              border-bottom: none;
              border-bottom-right-radius: 0;
              border-bottom-left-radius: 0;
              box-shadow: inset 0 2px 4px rgba(236, 241, 248, 1);
            }
          }
        }

        > .report-form-filtrate {
          > .filtrate-text[data-v-e69a84f0] {
            color: #7d90ac;
          }
        }
      }

      .el-radio__input {
        &.is-checked {
          .el-radio__inner {
            border-color: rgb(64, 158, 255);
            background: #fff;
          }
        }
      }

      .order-table {
        .el-table {
          background-color: #fff;

          th {
            color: #999;
            background-color: #fff;

            &.is-leaf {
              border-bottom: 0 solid #262f38;
            }
          }
        }
      }

      .el-input__inner {
        color: #7d90ac;
      }

      .nav-box {
        > .inner-box {
          > .top {
            > .left {
              > .nav-list {
                > .nav-item {
                  > .sub-nav-list[data-v-346cd49c] {
                    background-color: #fff;

                    &::before {
                      border-bottom-color: #fff;
                    }
                  }

                  > .sub-nav-list {
                    > .sub-nav-item {
                      > a[data-v-346cd49c] {
                        color: #000;
                      }
                    }

                    > .sub-nav-item[data-v-346cd49c] {
                      &:hover {
                        background-color: #fff;

                        > a {
                          color: $mainColor;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          > .bottom[data-v-346cd49c] {
            background-color: #fff;
            box-shadow: 4px 4px 4px rgba(3, 14, 32, .1);
          }
        }
      }
    }
  }
}
</style>
