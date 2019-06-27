<template>
  <div
    class="fiat-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height40 personal-height40 font-size16">
      <span class="padding-left15 fiat-color font-weight400">
        <!--法币订单-->
        {{ $t('M.comm_coin') }}{{ $t('M.comm_order') }}
      </span>
    </header>
    <div class="fiat-main margin-top9">
      <el-tabs
        v-model="activeName"
        :tab-position = "tabPosition"
        @tab-click = "toggleTabPane"
      >
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <div class="main-top-type trade-type float-left">
            <span class="filtrate-text font-size14">
              <!--类型-->
              {{ $t('M.comm_type') }}
            </span>
            <span class="style-input">
              <!--全部-->
              <el-select
                v-model="activatedMerchantsOrdersTraderStyleList"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeMerchantsOrdersTraderStyleList"
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
          <div class="main-top-type trade-type float-left">
           <span class="filtrate-text font-size14">
             <!--币种-->
             {{ $t('M.otc_Merchants_Orders_market') }}
           </span>
            <span class="status-input">
             <!--全部-->
           <el-select
             v-model="activatedMerchantsOrdersCoin"
             :no-data-text="$t('M.comm_no_data')"
             @change="changeMerchantsOrdersCoin"
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
          <div class="main-top-type">
            <span class="filtrate-text font-size14">
              <!--货币-->
              {{ $t('M.user_coin_currency') }}
            </span>
            <span class="status-input">
              <!--全部-->
              <el-select
                v-model="activatedMerchantsOrdersCurrency"
                :no-data-text="$t('M.comm_no_data')"
                @change="changeMerchantsOrdersCurrency"
                clearable
                :placeholder="$t('M.comm_all')"
              >
                <!--:label="$t(`M.${item.i18nName}`)"-->
                <el-option
                  v-for="(item,index) in merchantsOrdersCurrencyList"
                  :key="index"
                  :label="language === 'zh_CN'? item.name : item.shortName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <div class="main-top-type trade-data float-left">
            <span class="filtrate-text font-size14">
              <!--起止日期-->
                {{ $t('M.user_coin_order4') }}
            </span>
            <span class="date-picker">
              <!--开始日期-->
              <el-date-picker
                :placeholder="$t('M.comm_begin') + $t('M.comm_data')"
                v-model="startTime"
                type="date"
                value-format="yyyy-MM-dd"
                @change="startDate"
                clearable
              >
              </el-date-picker>
              <span class="date-short-line">-</span>
              <!--结束日期-->
              <el-date-picker
                :placeholder="$t('M.comm_end') + $t('M.comm_data')"
                v-model="endTime"
                value-format="yyyy-MM-dd"
                type="date"
                @change="endDate"
                clearable
              >
              </el-date-picker>
            </span>
          </div>
          <div class="main-top-type float-left">
             <span class="inquire-button">
              <el-button
                type="primary"
                @click.prevent="findFilter(activeName)"
              >
                <!--查询-->
                {{ $t('M.comm_query') }}
              </el-button>
               <!--<el-button type="primary" @click.prevent="resetCondition">重置</el-button>-->
            </span>
          </div>
        </div>
        <!--交易中的订单-->
        <el-tab-pane
          :label="$t('M.otc_trading')"
          name="TRADING"
        >
          <FiatCoinTradingOrder
            ref = "tradeOrder"
            @fatherMethod="getOTCEntrustingOrdersRevocation"
          />
        </el-tab-pane>
        <!--已完成订单-->
        <el-tab-pane
          :label="$t('M.otc_stocks')"
          name="COMPLETED"
        >
          <FiatCoinCompletedOrder ref = "cancelledOrder"/>
        </el-tab-pane>
        <!--已取消订单-->
        <el-tab-pane
          :label="$t('M.otc_canceled')"
          name="CANCELED"
        >
          <FiatCoinCanceledOrder ref = "completedOrder"/>
        </el-tab-pane>
        <!--冻结中订单-->
        <el-tab-pane
          :label="$t('M.otc_freezingOrder')"
          name="FROZEN"
        >
          <FiatCoinFreezingOrder ref = "pendingOrder"/>
        </el-tab-pane>
        <!--委托订单-->
        <el-tab-pane
          :label="$t('M.otc_entrust')"
          name="ENTRUSTED"
        >
          <FiatCoinEntrustOrder ref = "entrustOrders"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import FiatCoinTradingOrder from '../FiatCoinContent/FiatCoinTradingOrder'
import FiatCoinCanceledOrder from '../FiatCoinContent/FiatCoinCanceledOrder'
import FiatCoinCompletedOrder from '../FiatCoinContent/FiatCoinCompletedOrder'
import FiatCoinFreezingOrder from '../FiatCoinContent/FiatCoinFreezingOrder'
import FiatCoinEntrustOrder from '../FiatCoinContent/FiatCoinEntrustOrder'
import IconFontCommon from '../../Common/IconFontCommon'
// import {
//   getOTCEntrustingOrders
// } from '../../../utils/api/personal'
import {
  getMerchantAvailableLegalTender,
  getOTCAvailableCurrency,
  getOTCEntrustingOrders
} from '../../../utils/api/OTC'
import {
  returnAjaxMsg,
  getMerchantsOrdersList,
  getNestedData
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon, //  字体图标
    FiatCoinTradingOrder, //  交易中订单
    FiatCoinCanceledOrder, //  已完成订单
    FiatCoinCompletedOrder, //  已取消订单
    FiatCoinFreezingOrder, //  冻结中订单
    FiatCoinEntrustOrder //  委托订单
  },
  // props,
  data () {
    return {
      tabPosition: 'top', //  面板标签方向状态
      activeName: 'TRADING',
      // 1.0 商家订单筛选下拉框数组--交易类型
      activatedMerchantsOrdersTraderStyleList: '', // 选中的筛选项
      merchantsOrdersTraderStyleList: [
        {
          value: 'BUY',
          label: 'M.comm_buying' // 购买
        },
        {
          value: 'SELL',
          label: 'M.comm_offering' // 出售
        }
      ],
      // 商家订单筛选下拉框 币种
      activatedMerchantsOrdersCoin: '',
      merchantsOrdersCoinList: [],
      // 商家订单筛选下拉框 法币
      activatedMerchantsOrdersCurrency: '',
      merchantsOrdersCurrencyList: [],
      // 2.0 商家订单筛选下拉框数组--状态
      activatedMerchantsOrdersStatusList: '', // 选中的筛选项
      merchantsOrdersStatusList: [
        {
          value: 'PAYED',
          label: 'M.otc_enum_status_yifukuan' // 已付款
        },
        {
          value: 'PICKED',
          label: 'M.otc_enum_status_weifukuan' // 未付款
        },
        {
          value: 'COMPLETED ',
          label: 'M.otc_enum_status_yiwancheng' // 已完成
        },
        {
          value: 'CANCELED',
          label: 'M.otc_enum_status_yiquxiao' // 已取消
        },
        {
          value: 'FROZEN',
          label: 'M.otc_enum_status_yidongjie' // 已冻结
        }
      ],
      startTime: '', // 默认开始时间
      endTime: '', // 默认结束时间
      // 商家订单列表
      merchantsOrdersList: []
    }
  },
  async created () {
    await this.getOTCAvailableCurrencyList()
    await this.getMerchantAvailableLegalTenderList()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_LIST',
      'CHANGE_LEGAL_PAGE',
      // 更改重新渲染交易中订单列表状态
      'CHANGE_RE_RENDER_TRADING_LIST_STATUS',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
    // 切换tab时将全局当前页码改为1加载第一页的数据
    toggleTabPane () {
      this.resetCondition()
      this.CHANGE_LEGAL_PAGE({
        legalTradePageNum: 1
      })
    },
    // 页面加载时 可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
      })
      // console.log('可用币种列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data) {
        this.merchantsOrdersCoinList = getNestedData(data, 'data')
      }
    },
    // 页面加载时 可用法币查询
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender()
      // console.log('可用法币')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data) {
        this.merchantsOrdersCurrencyList = getNestedData(data, 'data')
      }
    },
    // 选中交易 类型 赋值
    changeMerchantsOrdersTraderStyleList (e) {
      this.activatedMerchantsOrdersTraderStyleList = e
    },
    // 选中 币种 状态赋值
    changeMerchantsOrdersCoin (e) {
      this.activatedMerchantsOrdersCoin = e
    },
    // 选中 货币 状态赋值
    changeMerchantsOrdersCurrency (e) {
      this.activatedMerchantsOrdersCurrency = e
    },
    // 选中 状态 赋值
    changeMerchantsOrdersStatusList (e) {
      this.activatedMerchantsOrdersStatusList = e
    },
    // 点击查询按钮
    findFilter (activeName) {
      // console.log(activeName)
      this.CHANGE_LEGAL_PAGE({
        legalTradePageNum: 1
      })
      this.getOTCEntrustingOrdersRevocation(activeName)
    },
    resetCondition () {
      this.activatedMerchantsOrdersTraderStyleList = ''
      this.activatedMerchantsOrdersCoin = ''
      this.activatedMerchantsOrdersCurrency = ''
      this.activatedMerchantsOrdersStatusList = ''
      this.startTime = ''
      this.endTime = ''
      // this.getOTCEntrustingOrdersRevocation()
    },
    // 页面加载时请求接口渲染列表
    async getOTCEntrustingOrdersRevocation (activeName) {
      // console.log(activeName)
      let params = {
        // 币种
        coinId: this.activatedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activatedMerchantsOrdersCurrency,
        // 状态
        status: activeName,
        // 开始时间
        startTime: this.startTime,
        // 结束时间
        endTime: this.endTime,
        // 类型
        // tradeType: this.activatedMerchantsOrdersTraderStyleList,
        pageNum: this.legalTradePageNum,
        pageSize: this.legalTradePageSize
      }
      // 20190218 增加委单和其他状态交易类型字段判断 委托订单用entrustType字段其他用tradeType字段
      if (activeName == 'ENTRUSTED') {
        params.entrustType = this.activatedMerchantsOrdersTraderStyleList
      } else {
        params.tradeType = this.activatedMerchantsOrdersTraderStyleList
      }
      if (activeName == 'ENTRUSTED') {
        const data = await getOTCEntrustingOrders(params)
        if (!data) return false
        let OTCEntrustingOrdersData = getNestedData(data, 'data')
        // 返回数据正确的逻辑 重新渲染列表
        this.SET_LEGAL_TENDER_LIST({
          type: activeName,
          data: OTCEntrustingOrdersData.list
        })
        // console.log(data)
        this.CHANGE_LEGAL_PAGE({
          legalTradePageNum: OTCEntrustingOrdersData.pageNum,
          legalTradePageTotals: OTCEntrustingOrdersData.pages
        })
      } else {
        getMerchantsOrdersList(params, (data) => {
          if (!(returnAjaxMsg(data, this, 0))) {
            return false
          } else {
            let merchantsOrdersListData = getNestedData(data, 'data.data')
            // 返回数据正确的逻辑 重新渲染列表
            this.SET_LEGAL_TENDER_LIST({
              type: activeName,
              data: merchantsOrdersListData.list
            })
            // 刷新列表之后将重新渲染交易中订单列表状态改为false
            this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(false)
            // console.log(data)
            this.CHANGE_LEGAL_PAGE({
              legalTradePageNum: merchantsOrdersListData.pageNum,
              legalTradePageTotals: merchantsOrdersListData.pages
            })
          }
        })
      }
    },
    // 时间选择器change事件：
    // 开始时间
    startDate () {
      if (this.endTime) {
        if (this.startTime > this.endTime) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
    },
    // 结束时间
    endDate () {
      if (this.startTime) {
        if (this.startTime > this.endTime) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 当前选中语言
      language: state => state.common.language,
      theme: state => state.common.theme,
      withdrawDepositList: state => state.common.withdrawDepositList,
      legalTradePageNum: state => state.personal.legalTradePageNum,
      legalTradePageSize: state => state.personal.legalTradePageSize,
      legalTraderCompletedReflashStatus: state => state.personal.legalTraderCompletedReflashStatus,
      legalTraderEntrustReflashStatus: state => state.personal.legalTraderEntrustReflashStatus,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName,
      // fiatMoneyOrdersName: state => state.personal.fiatMoneyOrdersName
      reRenderTradingListStatus: state => state.personal.reRenderTradingListStatus // 从全局获得的重新渲染交易中订单列表状态
    })
  },
  watch: {
    activeName () {
      this.getOTCEntrustingOrdersRevocation(this.activeName)
    },
    legalTradePageNum () {
      this.getOTCEntrustingOrdersRevocation(this.activeName)
    },
    legalTraderCompletedReflashStatus () {
      this.getOTCEntrustingOrdersRevocation(this.activeName)
    },
    legalTraderEntrustReflashStatus (newVal) {
      this.getOTCEntrustingOrdersRevocation(this.activeName)
      if (newVal) {
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'ENTRUSTED',
          status: false
        })
      }
    },
    userCenterActiveName (newVal) {
      this.resetCondition()
      if (newVal === 'fiat-orders') {
        this.getOTCEntrustingOrdersRevocation(this.activeName)
      }
    },
    //  监控重新渲染交易中订单列表状态:当为true时调用重新刷新列表方法
    reRenderTradingListStatus () {
      console.log('重新渲染交易中订单列表状态')
      console.log(this.reRenderTradingListStatus)
      if (this.reRenderTradingListStatus) {
        this.getOTCEntrustingOrdersRevocation(this.activeName)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .fiat-orders {
    .fiat-main {
      .orders-main-top {
        height: 125px;
        padding: 0 25px;
        margin: 10px 0;

        .trade-type {
          width: 250px;
        }

        .trade-data {
          width: 535px;
        }

        .main-top-type {
          height: 50px;
          line-height: 50px;

          > .filtrate-text {
            margin-right: 5px;
          }

          .date-short-line {
            margin: 0 8px;
          }
        }

        > .date-picker {
          > .date-short-line {
            margin: 0 3px;
          }
        }

        > .all-clear {
          color: #338ff5;
        }
      }
    }

    /deep/ {
      /* 覆盖Elenent样式 */
      .el-input__icon {
        line-height: 0;
      }

      /* 点击切换时背景色和字体颜色 */
      .el-tabs__item {
        width: 105px;
        padding: 0;
        margin-left: 4px;
        border-left: 0 solid transparent !important;
        text-align: center;
        background-color: transparent !important;
      }

      .el-tabs__item.is-active {
        border-left: 0;
      }

      .el-tabs__item:hover {
        border-left: 0;
      }

      /* 覆盖element样式 */
      .el-input__inner {
        width: 100px;
        height: 30px;
        border: 0;
      }

      .el-date-editor.el-input {
        width: 180px;
        height: 30px;
      }

      .el-date-editor .el-input__inner {
        width: 180px;
        height: 30px;
      }

      .cell {
        text-align: center;
      }

      .main-top-type .el-button {
        width: 60px;
        height: 30px;
        padding: 0;
        margin-left: 77px;
        border: 0;
      }

      .el-tabs__header {
        margin: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .background-color {
        background-color: $mainContentNightBgColor;

        > .fiat-color {
          color: #338ff5;
        }
      }

      .fiat-main {
        .orders-main-top {
          background-color: #1c1f32;
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */

        /* tabs切换 */
        .el-tabs__item {
          &.is-active {
            border-bottom: 2px solid #338ff5 !important;
            border-left: 0;
            color: rgba(0, 121, 254, 1) !important;
            background-color: #1c1f32 !important;
          }

          &:hover {
            background-color: #1c1f32 !important;
          }
        }

        .el-input__inner {
          background-color: #2d3651;
        }

        .el-button {
          color: #fff;
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > header {
        background-color: #fff;
        box-shadow: 0 0 6px #cfd5df;

        > span {
          color: #338ff5;
        }
      }

      > div {
        background-color: #fff;
        box-shadow: 0 0 6px #cfd5df;
      }

      .fiat-main {
        .orders-main-top {
          background-color: #fff;
          box-shadow: 0 0 6px #cfd5df;
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */

        /* tabs切换 */
        .el-tabs__item {
          border-bottom: 1px solid #ecf1f8;
          color: #7d90ac;

          &:hover {
            border-left: none;
            color: #338ff5;
          }

          &.is-active {
            border-bottom: 2px solid #338ff5;
            border-left: none;
            color: #338ff5;
            background-color: transparent;
          }
        }

        .el-tabs__header {
          padding: 0;
        }

        .el-input__inner {
          border: 1px solid #ccc;
        }
      }
    }
  }
</style>
