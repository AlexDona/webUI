<template>
  <div
    class="fiat-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--法币订单-->
    <!--<header class="personal-height background-color line-height40 personal-height40 font-size16">
      <span class="padding-left15 fiat-color font-weight400">
        {{ $t('M.comm_coin') }}{{ $t('M.comm_order') }}
      </span>
    </header>-->
    <div class="fiat-main">
      <el-tabs
        v-model="activeName"
        :tab-position = "tabPosition"
        @tab-click = "toggleTabPane"
      >
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <div class="top-condition">
            <!--类型-->
            <div class="main-top-type">
              <span class="filtrate-text font-size14">
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
            <!--币种-->
            <div class="main-top-type">
             <span class="filtrate-text font-size14">
               {{ $t('M.otc_Merchants_Orders_market') }}
             </span>
              <span class="status-input">
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
            <!--货币-->
            <div class="main-top-type">
              <span class="filtrate-text font-size14">
                {{ $t('M.user_coin_currency') }}
              </span>
              <span class="status-input">
                <el-select
                  v-model="activatedMerchantsOrdersCurrency"
                  :no-data-text="$t('M.comm_no_data')"
                  @change="changeMerchantsOrdersCurrency"
                  clearable
                  :placeholder="$t('M.comm_all')"
                >
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
            <!--起止日期-->
            <div class="main-top-type ">
              <span class="filtrate-text font-size14">
                {{ $t('M.user_coin_order4') }}
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
                  :clearable="true"
                >
                </el-date-picker>
              </span>
            </div>
          </div>
          <div class="bottom-button">
            <!--查询-->
            <span class="inquire-button">
              <el-button
                type="primary"
                @click.prevent="findFilter(activeName)"
              >
                {{ $t('M.comm_query') }}
              </el-button>
            </span>
          </div>
        </div>
        <!--交易中-->
        <el-tab-pane
          :label="$t('M.legal_tender_order_trading')"
          name="TRADING"
        >
          <FiatCoinTradingOrder
            ref = "tradeOrder"
            @fatherMethod="getOTCEntrustingOrdersRevocation"
            :OTC_IM_TOP="OTC_IM_TOPS.trading"
          />
        </el-tab-pane>
        <!--已完成-->
        <el-tab-pane
          :label="$t('M.legal_tender_order_had_finished')"
          name="COMPLETED"
        >
          <FiatCoinCompletedOrder
            ref = "cancelledOrder"
            :OTC_IM_TOP="OTC_IM_TOPS.completed"
          />
        </el-tab-pane>
        <!--已取消-->
        <el-tab-pane
          :label="$t('M.legal_tender_order_had_canceled')"
          name="CANCELED"
        >
          <FiatCoinCanceledOrder
            ref = "completedOrder"
            :OTC_IM_TOP="OTC_IM_TOPS.canceled"
          />
        </el-tab-pane>
        <!--申诉中-->
        <el-tab-pane
          :label="$t('M.legal_tender_order_appealing')"
          name="FROZEN"
        >
          <FiatCoinFreezingOrder
            ref = "pendingOrder"
            :OTC_IM_TOP="OTC_IM_TOPS.frozen"
          />
        </el-tab-pane>
        <!--委托单-->
        <el-tab-pane
          :label="$t('M.legal_tender_order_entrust_order')"
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
import Socket from '../../../utils/datafeeds/socket'
import {OTCIMSocketUrl} from '../../../utils/env'
import mixins from '../../../mixins/user'
export default {
  mixins: [mixins],
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
      // 商家订单列表
      merchantsOrdersList: [],
      // 时间选择器
      checkedTime: [], // 时间选择器选中的时间
      pickerOptionsTime: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      socket: '',
      OTC_IM_TOPS: {
        trading: `170px`,
        completed: `166px`,
        canceled: `166px`,
        frozen: `166px`
      },
      // OTC 心跳发送次数
      OTCSocketHeartCount: 0,
      socketTimer: null,
      // 心跳间隔
      heartDuration: 50000
    }
  },
  async created () {
    this.initSocket()
    await this.getOTCAvailableCurrencyList()
    await this.getMerchantAvailableLegalTenderList()
    await this.getOTCEntrustingOrdersRevocation()
  },
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearTimeout(this.socketTimer)
  },
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_LIST',
      'CHANGE_LEGAL_PAGE',
      // 更改重新渲染交易中订单列表状态
      'CHANGE_RE_RENDER_TRADING_LIST_STATUS',
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'UPDATE_IM_SOCKET_M',
      // 改变清除交易中数据方法的状态
      'CHANGE_CLEAR_DATA_STATUS_M',
      'UPDATE_OTC_IM_SOCKET_STATUS_M',
      'UPDATE_OTC_IM_SOCKET_HEART_M',
      'UPDATE_IM_BOX_SHOW_STATUS_M'
    ]),
    initSocket () {
      const {id} = this.$userInfo_X
      // this.socket = new Socket(this.url = `${OTCIMSocketUrl}/web/${id}`)
      this.socket = new Socket(this.url = `${OTCIMSocketUrl}`)

      this.UPDATE_IM_SOCKET_M(this.socket)
      this.socket.doOpen()
      this.socket.on('open', () => {
        this.UPDATE_OTC_IM_SOCKET_STATUS_M(false)
        this.socket.send({
          // 当前用户id
          'userId': id,
          // 请求的动作:“toConnect”建立socket连接;“sendMessage”发送聊天内容
          'action': 'toConnect',
          'source': 'web'
        })
        this.checkHeart()
      })
    },
    checkHeart () {
      this.socket.on('message', (e) => {
        if (e.action == 'checkHeart') {
          this.socket.send(e)
          // 非心跳之外 duration 内 无消息，客户端主动断开连接
        }
      })
    },
    // 时间选择
    changeSelectValue (type, targetValue) {
      switch (type) {
        case 'date':
          this.checkedTime = targetValue
          break
      }
    },
    // 切换tab时将全局当前页码改为1加载第一页的数据
    toggleTabPane () {
      this.resetCondition()
      this.CHANGE_LEGAL_PAGE({
        legalTradePageNum: 1
      })
      this.UPDATE_IM_BOX_SHOW_STATUS_M({
        orderId: 'default',
        status: false
      })
    },
    // 页面加载时 可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
      })
      // 返回数据正确的逻辑
      if (!data) return false
      if (data) {
        this.merchantsOrdersCoinList = getNestedData(data, 'data')
      }
    },
    // 页面加载时 可用法币查询
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender()
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
      // this.startTime = ''
      // this.endTime = ''
      this.checkedTime = []
      // this.getOTCEntrustingOrdersRevocation()
    },
    // 页面加载时请求接口渲染列表
    async getOTCEntrustingOrdersRevocation () {
      let params = {
        // 币种
        coinId: this.activatedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activatedMerchantsOrdersCurrency,
        // 状态
        status: this.activeName,
        // 开始时间
        // startTime: this.startTime,
        startTime: this.checkedTime && this.checkedTime[0] ? this.checkedTime[0] : '',
        // 结束时间
        // endTime: this.endTime,
        endTime: this.checkedTime && this.checkedTime[1] ? this.checkedTime[1] : '',
        // 类型
        // tradeType: this.activatedMerchantsOrdersTraderStyleList,
        pageNum: this.legalTradePageNum
        // pageSize: this.legalTradePageSize
      }
      // 20190218 增加委单和其他状态交易类型字段判断 委托订单用entrustType字段其他用tradeType字段
      if (this.activeName == 'ENTRUSTED') {
        params.entrustType = this.activatedMerchantsOrdersTraderStyleList
        params.pageSize = 10 // 委托订单每页显示10条
      } else {
        params.tradeType = this.activatedMerchantsOrdersTraderStyleList
        params.pageSize = this.legalTradePageSize // 每页显示5条
      }
      if (this.activeName == 'ENTRUSTED') {
        const data = await getOTCEntrustingOrders(params)
        if (!data) return false
        let OTCEntrustingOrdersData = getNestedData(data, 'data')
        // 返回数据正确的逻辑 重新渲染列表
        this.SET_LEGAL_TENDER_LIST({
          type: this.activeName,
          data: OTCEntrustingOrdersData.list
        })
        this.CHANGE_LEGAL_PAGE({
          legalTradePageNum: OTCEntrustingOrdersData.pageNum,
          legalTradePageTotals: OTCEntrustingOrdersData.pages
        })
      } else {
        getMerchantsOrdersList(params, (data) => {
          if (!(returnAjaxMsg(data, this, 0))) {
            return false
          } else {
            // 请求接口之前，调用子组件（交易中订单组件）方法，清空定义的数组数据
            this.CHANGE_CLEAR_DATA_STATUS_M(true)
            let merchantsOrdersListData = getNestedData(data, 'data.data')
            // 返回数据正确的逻辑 重新渲染列表
            this.SET_LEGAL_TENDER_LIST({
              type: this.activeName,
              data: merchantsOrdersListData.list
            })
            // 刷新列表之后将重新渲染交易中订单列表状态改为false
            this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(false)
            this.CHANGE_LEGAL_PAGE({
              legalTradePageNum: merchantsOrdersListData.pageNum,
              legalTradePageTotals: merchantsOrdersListData.pages
            })
          }
        })
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
      legalTraderCancelReflashStatus: state => state.personal.legalTraderCancelReflashStatus,
      legalTraderTradingReflashStatus: state => state.personal.legalTraderTradingReflashStatus,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName,
      // fiatMoneyOrdersName: state => state.personal.fiatMoneyOrdersName
      reRenderTradingListStatus: state => state.personal.reRenderTradingListStatus, // 从全局获得的重新渲染交易中订单列表状态
      isOTCIMSocketNeedReconnect_S: state => state.OTC.isOTCIMSocketNeedReconnect_S,
      hasNewOTCHart_S: state => state.OTC.hasNewOTCHart_S,
      newIMMessage_S: state => state.OTC.newIMMessage_S
    }),
    activeNameAndLegalTradePageNum () {
      return `${this.activeName}/${this.legalTradePageNum}`
    }
  },
  watch: {
    newIMMessage_S (New) {
      const e = New
      if (e.action == 'checkHeart') {
        this.socket.send(e)
        // 非心跳之外 duration 内 无消息，客户端主动断开连接
      } else if (e.action !== 'checkHeart') {
        clearTimeout(this.socketTimer)
        this.heartDuration = e.duration + 1000
        this.socketTimer = setTimeout(() => {
          this.socket.doClose()
        }, this.heartDuration)
      }
    },
    hasNewOTCHart_S (New) {
      if (New) {
        this.UPDATE_OTC_IM_SOCKET_HEART_M(false)
      }
    },
    isOTCIMSocketNeedReconnect_S (New) {
      if (New) {
        this.initSocket()
      }
    },
    activeNameAndLegalTradePageNum () {
      this.getOTCEntrustingOrdersRevocation()
    },
    legalTraderCompletedReflashStatus (New) {
      if (New) {
        this.getOTCEntrustingOrdersRevocation()
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'COMPLETED',
          status: false
        })
      }
    },
    legalTraderTradingReflashStatus (New) {
      if (New) {
        this.getOTCEntrustingOrdersRevocation()
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'TRADING',
          status: false
        })
      }
    },
    legalTraderCancelReflashStatus (New) {
      if (New) {
        this.getOTCEntrustingOrdersRevocation()
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'CANCELED',
          status: false
        })
      }
    },
    legalTraderEntrustReflashStatus (newVal) {
      if (newVal) {
        this.getOTCEntrustingOrdersRevocation()
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: 'ENTRUSTED',
          status: false
        })
      }
    },
    userCenterActiveName (newVal) {
      this.resetCondition()
      if (newVal === 'fiat-orders') {
        this.getOTCEntrustingOrdersRevocation()
      }
    },
    //  监控重新渲染交易中订单列表状态:当为true时调用重新刷新列表方法
    reRenderTradingListStatus () {
      if (this.reRenderTradingListStatus) {
        this.getOTCEntrustingOrdersRevocation()
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
        padding: 25px 10px 0;
        margin: 10px 0;

        > .top-condition {
          display: flex;
          justify-content: space-between;
        }

        > .bottom-button {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }
      }
    }

    /deep/ {
      .el-tabs__content {
        min-height: 776px;
      }

      /* 点击切换时背景色和字体颜色 */
      .el-tabs__item {
        width: 105px;
        padding: 0;
        margin: 6px 0 0;
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

      .cell {
        text-align: center;
      }

      .el-tabs__header {
        margin: 0;
      }

      .orders-main-top {
        .top-condition {
          .el-input__icon {
            line-height: 0;
          }

          .el-input__inner {
            width: 100px;
            height: 30px;
            border: 0;
          }

          .date-picker {
            .el-input__inner {
              width: 240px;
            }

            .el-date-editor {
              .el-range-separator {
                line-height: 23px;
              }
            }
          }
        }

        .bottom-button {
          .el-button {
            width: 60px;
            height: 30px;
            padding: 0;
            border: 0;
            font-size: 12px;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .background-color {
        background-color: $mainContentNightBgColor;

        > .fiat-color {
          color: $mainColor;
        }
      }

      .fiat-main {
        .orders-main-top {
          background-color: $mainContentNightBgColor;
        }
      }

      /deep/ {
        /* tabs切换 */
        .el-tabs__item {
          &.is-active {
            border-bottom: 2px solid $mainColor !important;
            border-left: 0;
            color: rgba(0, 121, 254, 1) !important;
            background-color: #1c1f32 !important;
          }

          &:hover {
            background-color: #1c1f32 !important;
          }
        }

        .orders-main-top {
          .top-condition {
            .el-input__inner {
              color: $mainColorOfWhite;
              background-color: #2d3651;
            }

            .date-picker {
              .el-date-editor {
                .el-range-separator {
                  color: $mainColorOfWhite;
                }

                .el-range-input {
                  color: $mainColorOfWhite;
                }
              }
            }
          }

          .bottom-button {
            .inquire-button {
              .el-button {
                color: $mainColorOfWhite;
                background: $nightButtonBgColor1;
              }
            }
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > header {
        background-color: $mainColorOfWhite;
        box-shadow: 0 0 6px #cfd5df;

        > span {
          color: $mainColor;
        }
      }

      > div {
        background-color: $mainColorOfWhite;
        box-shadow: 0 0 6px #cfd5df;
      }

      .fiat-main {
        .orders-main-top {
          background-color: $mainColorOfWhite;
        }
      }

      /deep/ {
        /* tabs切换 */
        .el-tabs__item {
          color: #7d90ac;

          &:hover {
            border-left: none;
            color: $mainColor;
          }

          &.is-active {
            border-bottom: 2px solid $mainColor;
            border-left: none;
            color: $mainColor;
            background-color: transparent;
          }
        }

        .el-tabs__header {
          padding: 0;
        }

        .orders-main-top {
          .top-condition {
            .el-input__inner {
              border: 1px solid #ccc;
            }
          }

          .bottom-button {
            .inquire-button {
              .el-button {
                background: $dayButtonBgColor2;
              }
            }
          }
        }
      }
    }
  }
</style>
