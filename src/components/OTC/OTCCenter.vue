1<template>
  <div class="otc-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!--2.0 在线交易和订单管理-->
    <div class="otc-center-content">
      <!--2.1 在线交易-->
      <div class="otc-online-trading">
        <!-- 2.1.1 在线购买和在线出售按钮-->
        <div class="otc-online-buy-and-sell-button">
          <el-radio-group
            v-model="OTCBuySellStyle"
            @change="toggleBuyOrSellStyle"
          >
            <el-radio-button label="onlineBuy">
              在线购买
            </el-radio-button>
            <el-radio-button label="onlineSell">
              在线出售
            </el-radio-button>
          </el-radio-group>
        </div>
        <!-- 2.1.2 我要购买和商户列表内容-->
        <div class="otc-merchant-content">
          <!--我要购买和发布订单按钮-->
          <div class="otc-filtrate-publish">
            <div class="otc-filtrate-box">
              <!-- 我要购买 -->
              <span
                class="otc-i-wan"
                v-show="OTCBuySellStyle === 'onlineBuy'"
              >
                我要购买 ：
              </span>
              <!-- 我要出售 -->
              <span
                class="otc-i-wan"
                v-show="OTCBuySellStyle === 'onlineSell'"
              >
                我要出售 ：
              </span>
              <div
                class="otc-filtrate-style"
              >
                <span
                  v-for="(item, index) in IWantToBuySellArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus === index }"
                  @click="selectCurrencyName(index)"
                >
                  {{item.shortName}}
                </span>
              </div>
              <!-- 我要购买的选项数组 -->
              <!-- <div
                class="otc-filtrate-style"
                v-if="OTCBuySellStyle === 'onlineBuy'"
              >
                <span
                  v-for="(item, index) in IWantToBuySellArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus === index }"
                  @click="selectCurrencyName(index)"
                >
                  {{item.shortName}}
                </span>
              </div> -->
              <!-- 我要出售的选项数组 -->
              <!-- <div
                class="otc-filtrate-style"
                v-if="OTCBuySellStyle === 'onlineSell'"
              >
                <span
                  v-for="(item, index) in IWantToBuySellArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus === index }"
                  @click="selectCurrencyName(index)"
                >
                  {{item.shortName}}
                </span>
              </div> -->
            </div>
            <div class="otc-publish-box">
              <el-button
                type="primary"
                @click="toPublishOrder"
              >
                发布订单
              </el-button>
            </div>
          </div>
          <!--商户列表表格部分-->
          <div class="otc-merchant-list">
            <!-- 支付方式 -->
            <div class="pay-way">
              <el-select
                v-model="activedPayWayBankinfoItem"
                @change="payWayChangeValue"
              >
                <el-option
                  v-for="item in payWayBankinfoList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div class="shade-pay-way">支付方式</div>
            <!-- 表格信息 -->
            <el-table
              :data="onlineBuySellTableList"
              style="width: 100%"
              empty-text="暂无数据"
            >
              <el-table-column
                label="商户"
                width="180"
              >
                <template slot-scope = "s">
                  <div>{{s.row.userName}}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="信用"
                width="180"
              >
                <template slot-scope = "s">
                  <div>成功率{{((s.row.successOrderTimes/(s.row.tradeTimes)) * 100).toFixed(2)}}%</div>
                </template>
              </el-table-column>
              <el-table-column
                label="数量"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.entrustCount}}{{selectedOTCAvailableCurrencyName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="价格"
              >
                <template slot-scope = "s">
                  <!-- 此处的单位根据设置中的法币类型来变化：为人民币时候显示CNY，为美元时候显示$ 此处需要从全局拿到设置中的法币类型来渲染页面-->
                  <div class="red">{{s.row.price}}CNY</div>
                  <!-- <div>{{s.row.price}}$</div> -->
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                label="支付方式"
              >
                <template slot-scope="scope">
                  <div>
                    <!-- {{scope.row.payType}} -->
                    <!-- 支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="payWay[0] === 1"
                    />
                    <!-- 微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="payWay[1] === 1"
                    />
                    <!-- 银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="payWay[2] === 1"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                label="限额"
              >
                <template slot-scope = "s">
                  <div>{{s.row.minCount}}~{{s.row.maxCount}}CNY</div>
                </template>
              </el-table-column>
              <el-table-column
                label="备注"
              >
                <template slot-scope = "s">
                  <div>{{s.row.remark}}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineBuy'"
                    @click="toOnlineBuy"
                  >
                    购买
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineSell'"
                    @click="toOnlineSell"
                  >
                    出售
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--2.2 订单管理-->
      <div class="otc-order-manage">
        <el-tabs
          :tab-position = "tabPosition"
          @tab-click = "toggleTabPane"
          v-model = "activeName"
        >
          <!-- 2.2.1 交易中的订单 -->
          <el-tab-pane name = "first">
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'first'">
              </i>
              <IconFontCommon
                iconName="icon-shalou"
              />
              交易中订单
            </span>
            <OTCTradingOrder></OTCTradingOrder>
          </el-tab-pane>
          <!-- 2.2.2 已完成订单 -->
          <el-tab-pane name = "second">
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'second'">
              </i>
              <IconFontCommon
                iconName="icon-msnui-task-complete"
              />
              已完成订单
            </span>
            <OTCCompletedOrder></OTCCompletedOrder>
          </el-tab-pane>
          <!-- 2.2.3 已取消订单 -->
          <el-tab-pane name = "third">
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'third'">
              </i>
              <IconFontCommon
                iconName="icon-cancel_order"
              />
              已取消订单
            </span>
            <OTCCanceledOrder></OTCCanceledOrder>
          </el-tab-pane>
          <!-- 2.2.4 冻结中订单 -->
          <el-tab-pane name = "fourth">
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'fourth'">
              </i>
              <IconFontCommon
                iconName="icon-dongjie"
              />
              冻结中订单
            </span>
            <OTCFreezingOrder></OTCFreezingOrder>
          </el-tab-pane>
          <!-- 2.2.5 委托订单 -->
          <el-tab-pane name = "fifth">
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-show="activeName === 'fifth'">
              </i>
              <IconFontCommon
                iconName="icon-daohang2"
              />
              委托订单
            </span>
            <OTCEntrustOrder></OTCEntrustOrder>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!-- 4.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState, mapMutations} from 'vuex'
import {getOTCAvailableCurrency, getOTCPutUpOrders} from '../../utils/api/apiDoc'
import IconFontCommon from '../Common/IconFontCommon'
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import OTCTradingOrder from './OTCTradingOrder'
import OTCCompletedOrder from './OTCCompletedOrder'
import OTCCanceledOrder from './OTCCanceledOrder'
import OTCFreezingOrder from './OTCFreezingOrder'
import OTCEntrustOrder from './OTCEntrustOrder'
// import OTCPublishBuyAndSell from './OTCPublishBuyAndSell'
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    OTCTradingOrder, //  交易中订单
    OTCCompletedOrder, //  已完成订单
    OTCCanceledOrder, //  已取消订单
    OTCFreezingOrder, //  冻结中订单
    OTCEntrustOrder, //  委托订单
    IconFontCommon //  字体图标
    // OTCPublishBuyAndSell // 发布购买和卖出组件
  },
  // props,
  data () {
    return {
      activeName: 'first', // 选中的tab面板的序号
      tabPosition: 'left', //  订单管理面板标签方向状态
      OTCBuySellStyle: 'onlineBuy', //  在线购买和在线出售选中类型
      selectCurrencyNameStatus: 0, //  选中我要购买或者出售的币种名称
      // 在线购买和在线出售表格列表
      onlineBuySellTableList: [
        // {
        //   'coinId': '123',
        //   'coinName': 'BTC',
        //   'createTime': '2018-08-04 11:07:48',
        //   'currencyId': '123',
        //   'currencyName': 'CNY',
        //   'entrustCount': 2.5000000000,
        //   'entrustLimitId': '123',
        //   'entrustType': 'SELL',
        //   'failOrderTimes': 2,
        //   'floatPriceId': 0,
        //   'freezeTimes': 0,
        //   'id': '123',
        //   'matchAmount': 0E-10,
        //   'matchCount': 0E-10,
        //   'maxCount': 0E-10,
        //   'minCount': 60000.0000000000,
        //   'partnerId': '474629374641963008',
        //   'payType': 'paypal,xilian',
        //   'price': 60000.0000000000,
        //   'priceSetType': 'DINGJIA',
        //   'rateId': '123',
        //   'remark': '本人电话xxxxx,男女老幼概不欺骗。',
        //   'source': 'web',
        //   'status': 'ENTRUSTED',
        //   'successOrderTimes': 10,
        //   'totalAmount': 150000.0000000000,
        //   'updateTime': '2018-08-04 11:07:56',
        //   'userAcct': '13966666666',
        //   'userId': '132',
        //   'userName': '张三',
        //   'userNick': '',
        //   'userType': 'COMMON',
        //   'userUid': 10001,
        //   'userVipId': 0,
        //   'version': 1
        // }
      ],
      // 支付方式下拉框数据
      payWayBankinfoList: [
        {
          value: '支付方式1',
          label: '全部'
        },
        {
          value: '支付方式2',
          label: '支付宝'
        },
        {
          value: '支付方式3',
          label: '银行卡'
        },
        {
          value: '支付方式4',
          label: '微信'
        },
        {
          value: '支付方式5',
          label: '西联汇款'
        },
        {
          value: '支付方式6',
          label: 'PAYPAL'
        }
      ],
      // 支付方式
      payWay: [1, 0, 1, 0, 0],
      activedPayWayBankinfoItem: '支付方式', // 选中的支付方式
      // 我要购买出售币种数组
      IWantToBuySellArr: [
      ]
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCenter.css')
    require('../../../static/css/theme/day/OTC/OTCCenterDay.css')
    require('../../../static/css/theme/night/OTC/OTCCenterNight.css')
    // 1.0 otc可用币种查询：我要购买/我要出售的币种列表
    this.getOTCAvailableCurrencyList()
    // console.log(this.selectedOTCAvailableCurrencyName)
    // console.log(this.selectedOTCAvailableCurrencyCoinID)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID'
    ]),
    // 0.1 改变支付方式下拉框的选中值
    payWayChangeValue (e) {
      console.log(e)
    },
    // 0.2 切换tab面板
    toggleTabPane (tab, event) {
      console.log(this.activeName)
    },
    // 0.3 点击发布订单按钮跳转到发布订单页面
    toPublishOrder () {
      this.$router.push({path: '/OTCPublishBuyAndSell'})
    },
    // 0.4 点击购买按钮跳转到在线购买页面
    toOnlineBuy () {
      // console.log("买")
      this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle})
    },
    // 0.5 点击出售按钮跳转到在线出售页面
    toOnlineSell () {
      // console.log("卖")
      this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle})
    },
    //  1.0 otc可用币种查询：我要购买/我要出售的币种列表
    async getOTCAvailableCurrencyList () {
      let data
      data = await getOTCAvailableCurrency({
        partnerId: this.merchantID
      })
      // console.log(data)
      if (data.data.meta.code !== 200) {
        this.$message({
          message: data.data.meta.message,
          type: 'error',
          center: true
        })
        return false
      }
      // 返回数据正确的逻辑
      this.IWantToBuySellArr = data.data.data
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[0].shortName)
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[0].coinId)
      // console.log(this.selectedOTCAvailableCurrencyName)
      // console.log(this.selectedOTCAvailableCurrencyCoinID)
      // 在得到可用币种之后再调用方法根据币种的第一项的币种id来渲染表格数据
      // 2.0 otc主页面查询挂单列表:
      this.getOTCPutUpOrdersList()
    },
    //  2.0 刚进页面时候 otc主页面查询挂单列表
    async getOTCPutUpOrdersList () {
      let data
      data = await getOTCPutUpOrders({
        partnerId: this.merchantID, // 商户id
        // 刚进页面默认显示可用币种的第一个
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: '123', // 法币id
        entrustType: 'BUY' // 挂单类型（BUY SELL）默认第一次进来渲染买单的
        // entrustType: 'SELL' // 挂单类型（BUY SELL）
      })
      // console.log(data)
      if (data.data.meta.code !== 200) {
        this.$message({
          message: data.data.meta.message,
          type: 'error',
          center: true
        })
        return false
      }
      // 返回数据正确的逻辑
      this.onlineBuySellTableList = data.data.data.list
    },
    //  3.0 选中我想购买和出售币种名称
    selectCurrencyName (index) {
      // console.log(index)
      this.selectCurrencyNameStatus = index
      // this.IWantToBuySellArr[index].coinId
      // this.IWantToBuySellArr[index].shortName
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[index].shortName)
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[index].coinId)
      // console.log(this.selectedOTCAvailableCurrencyName)
      // console.log(this.selectedOTCAvailableCurrencyCoinID)
      // 请求接口数据渲染表格
      this.getSelectCurrencyNametOTCPutUpOrdersList()
    },
    //  3.01 切换我要购买和出售时候调取接口获得数据渲染列表
    async getSelectCurrencyNametOTCPutUpOrdersList () {
      let data
      let param = {
        partnerId: this.merchantID, // 商户id
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: '123' // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      data = await getOTCPutUpOrders(param)
      // console.log(data)
      if (data.data.meta.code !== 200) {
        this.$message({
          message: data.data.meta.message,
          type: 'error',
          center: true
        })
        return false
      }
      // 返回数据正确的逻辑
      this.onlineBuySellTableList = data.data.data.list
    },
    //  4.0 切换在线购买和在线售出状态
    async toggleBuyOrSellStyle (e) {
      // console.log(e)
      this.OTCBuySellStyle = e
      // console.log(this.OTCBuySellStyle)
      let data
      let param = {
        partnerId: this.merchantID, // 商户id
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: '123' // 法币id
      }
      if (this.OTCBuySellStyle === 'onlineBuy') {
        param.entrustType = 'BUY' // 挂单类型（BUY SELL）
      }
      if (this.OTCBuySellStyle === 'onlineSell') {
        param.entrustType = 'SELL' // 挂单类型（BUY SELL）
      }
      data = await getOTCPutUpOrders(param)
      // console.log(data)
      if (data.data.meta.code !== 200) {
        this.$message({
          message: data.data.meta.message,
          type: 'error',
          center: true
        })
        return false
      }
      // 返回数据正确的逻辑
      this.onlineBuySellTableList = data.data.data.list
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'selectedOTCAvailableCurrencyName',
      'selectedOTCAvailableCurrencyCoinID',
      'merchantID'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCCenter.scss);
.otc-box{
  background-color: #1D2331;
  >.otc-center-content{
    width: 1150px;
    margin: 0 auto;
    margin-top: 80px;
    >.otc-online-trading{
      >.otc-online-buy-and-sell-button{
        height: 45px;
        line-height: 45px;
        text-align: center;
        padding-bottom: 20px;
        background-color: #1D2331;
      }
      >.otc-merchant-content{
        height: 800px;
        background-color: #202A33;
        margin-top: 30px;
        >.otc-filtrate-publish{
          display: flex;
          justify-content: space-between;
          padding: 25px 20px 0 20px;
          >.otc-filtrate-box{
            display: flex;
            align-items: center;
            >.otc-i-wan{
              color: #fff;
            }
            >.otc-filtrate-style{
              color: #838EA6;
              .currencyNameActived{
                color: #338FF5;
                // font-weight: 700;
              }
              >.otc-filtrate-currency-name{
                margin: 0 10px;
                cursor: pointer;
              }
            }
          }
          >.otc-publish-box{
            // background-color: pink;
            // asdfasdfasdfasdfasfd
          }
        }
        >.otc-merchant-list{
          margin-top: 30px;
          .red{
            color: #D45858;
          }
          // 测试
          position: relative;
          >.pay-way{
            // 测试
            display: inline-block;
            top: 10px;
            left: 616px;
            position: absolute;
            z-index: 1;
          }
          >.shade-pay-way{
            // 测试
            color: #617499;
            display: inline-block;
            top: 15px;
            left: 631px;
            position: absolute;
            z-index: 2;
          }
        }
      }
    }
    >.otc-order-manage{
      height: 1200px;
      margin-top: 56px;
      .otc-tab-pane-arrow-right{
        position: absolute;
        right: -12px;
        top: 27px;
        font-size: 20px;
        color: #338FF5;
      }
      .icon{
        position: absolute;
        left: 35px;
        top: 22px;
      }
    }
  }
}
</style>
