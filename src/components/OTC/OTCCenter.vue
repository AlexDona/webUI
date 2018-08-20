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
              <!-- 我要购买的选项数组 -->
              <div
                class="otc-filtrate-style"
                v-if="OTCBuySellStyle === 'onlineBuy'"
              >
                <span
                  v-for="(item, index) in IWantToBuyArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus }"
                  @click="selectCurrencyName(index)"
                >
                  {{item}}
                </span>
              </div>
              <!-- 我要出售的选项数组 -->
              <div
                class="otc-filtrate-style"
                v-if="OTCBuySellStyle === 'onlineSell'"
              >
                <span
                  v-for="(item, index) in IWantToSellArr"
                  :key="index"
                  class="otc-filtrate-currency-name"
                  :class="{ currencyNameActived: selectCurrencyNameStatus }"
                  @click="selectCurrencyName(index)"
                >
                  {{item}}
                </span>
              </div>
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
              @filter-change="one"
            >
              <el-table-column
                prop="merchant"
                label="商户"
                width="180">
              </el-table-column>
              <el-table-column
                prop="credit"
                label="信用"
                width="180">
              </el-table-column>
              <el-table-column
                prop="total"
                label="数量">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                prop="payStyle"
                label="支付方式"
              >
                <template slot-scope="scope">
                  <div>
                    {{scope.row.payStyle}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="limit"
                label="限额">
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注">
              </el-table-column>
              <el-table-column
                prop="action"
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
                v-if="activeName === 'first'">
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
                v-if="activeName === 'second'">
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
                v-if="activeName === 'third'">
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
                v-if="activeName === 'fourth'">
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
                v-if="activeName === 'fifth'">
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
      // arrowRightStatus: 'tab-first', // tab面板小箭头显示状态
      activeName: 'first', // 选中的tab面板的序号
      tabPosition: 'left', //  订单管理面板标签方向状态
      OTCBuySellStyle: 'onlineBuy', //  在线购买和在线出售选中类型
      selectCurrencyNameStatus: false, //  选中我要购买或者出售的币种名称
      // 在线购买和在线出售表格列表
      onlineBuySellTableList: [
        {
          merchant: '2016-05-02',
          credit: '王小虎',
          total: '上海市普陀区金沙江路 1518 弄',
          price: '12312312',
          payStyle: '支付宝',
          limit: '2000--5000',
          remark: '我是备注'
        },
        {
          merchant: '2016-05-04',
          credit: '王小虎',
          total: '上海市普陀区金沙江路 1517 弄',
          price: '12312312',
          payStyle: '银行卡',
          limit: '2000--5000',
          remark: '我是备注'
        }
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
          label: '其他'
        }
      ],
      activedPayWayBankinfoItem: '支付方式', // 选中的支付方式
      // 我要购买币种数组
      IWantToBuyArr: ['HAF', 'JHG', 'JYEK', 'ASDF', 'FUBT'],
      // 我要出售币种数组
      IWantToSellArr: ['AHAF', 'DJHG', 'DJYEK', 'DASDF', 'DFUBT']
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCCenter.css')
    require('../../../static/css/theme/day/OTC/OTCCenterDay.css')
    require('../../../static/css/theme/night/OTC/OTCCenterNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 改变支付方式下拉框的选中值
    payWayChangeValue (e) {
      console.log(e)
    },
    //  选中我想购买和出售币种名称
    selectCurrencyName (index) {
      console.log(index)
      this.selectCurrencyNameStatus = true
    },
    //  切换在线购买和在线售出状态
    toggleBuyOrSellStyle (e) {
      // console.log(e)
      this.OTCBuySellStyle = e
      console.log(this.OTCBuySellStyle)
    },
    // 切换tab面板
    toggleTabPane (tab, event) {
      console.log(this.activeName)
      // console.log(event)
      // console.log(event.target.getAttribute('id')) // 获取到当前tab栏元素的id
      // this.arrowRightStatus = event.target.getAttribute('id')
    },
    // 点击发布订单按钮跳转到发布订单页面
    toPublishOrder () {
      this.$router.push({path: '/OTCPublishBuyAndSell'})
    },
    // 点击购买按钮跳转到在线购买页面
    toOnlineBuy () {
      // console.log("买")
      this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle})
    },
    // 点击出售按钮跳转到在线出售页面
    toOnlineSell () {
      // console.log("卖")
      this.$router.push({path: '/OTCOnlineTraderBuySell/' + this.OTCBuySellStyle})
    }
  },
  filter: {},
  computed: {},
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
