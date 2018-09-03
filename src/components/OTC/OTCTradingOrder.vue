<template>
  <div class="otc-trading-order-box otc">
    <!-- 交易中订单 -->
    <div class="otc-trading-order-content">
      <!-- 订单列表 ：1.0 买单 -->
      <div
        class="order-list"
        v-for="(item, index) in tradingOrderList"
        :key="index"
        v-if="item.orderType === 'BUY'"
      >
        <!-- 1.1 表头 -->
        <div class="order-list-head">
          <!-- 买卖家 -->
          <div class="buyer-seller">
            卖家：{{item.sellName}}
          </div>
          <!-- 订单号 -->
          <div class="order-id">
            订单号：{{item.orderSequence}}
          </div>
          <!-- 成交时间 -->
          <div class="deal-time">
            挂单时间：{{item.createTime}}
          </div>
          <div class="order-list-head-icon buy-icon">
            <!-- <img src="../../assets/develop/buy.png" alt=""> -->
          </div>
          <div class="buy-sell-icon">
            买
          </div>
        </div>
        <!-- 1.2 表身体 -->
        <div class="order-list-body">
          <!-- 1.2.1 表左侧 -->
          <div class="order-list-body-left">
            <!-- logo图标和名字 -->
            <div class="logo">
              <!-- src="../../assets/develop/bi.png" -->
              <img
                :src="item.coinUrl"
                width="30"
                class="logo-icon"
              >
              <p class="logo-name">{{item.coinName}}</p>
            </div>
            <div class="left-info">
              <!-- 金额 -->
              <p class="trade-info">
                <span>金额：</span>
                <span class="money">{{item.symbol}}{{item.payAmount}}</span>
              </p>
              <!-- 单价 -->
              <p class="trade-info">
                <span>单价：{{item.price}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>数量：{{item.pickCount}}</span>
              </p>
              <!-- 卖家手机号 -->
              <!-- 付款前不显示 -->
              <p
                class="trade-info"
              >
                卖家手机号：{{item.sellPhone}}
              </p>
            </div>
          </div>
          <!-- 1.2.2 表中部 -->
          <div class="order-list-body-middle">
            <!-- 付款前 -->
            <div
              class="middle-content"
              v-if="item.status == 'PICKED'"
            >
              <div class="trader-info display-inline-block">
                <!-- 选择支付方式 -->
                <div class="pay-style">
                  <div class="qiandai-icon">
                    <IconFontCommon
                      iconName="icon-qiandai-tianchong"
                    />
                  </div>
                  <el-select
                    placeholder="选择支付方式"
                    v-model="activePayModeList[index]"
                    @change="changeUserBankInfo(index)"
                  >
                    <el-option
                      v-for="item1 in item.userBankList"
                      :key="item1.id"
                      :label="item1.bankName"
                      :value="item1.cardNo"
                    >
                    </el-option>
                  </el-select>
                </div>
                <!-- 收款人 -->
                <p class="bank-info">
                  <span>收款人: {{item.sellName}}</span>
                </p>
                <!-- 开户行 -->
                <p
                  class="bank-info"
                  v-if="activeBankType[index] === 'bank'"
                >
                  <span>开户行: </span>
                  <span>{{activeBankProv[index]}}{{activeBankCity[index]}}{{activeBankArea[index]}}{{activeBankName[index]}}{{activeBankDetailAddress[index]}}</span>
                </p>
                <!-- 账户 -->
                <p
                  class="bank-info"
                  v-if="activeBankType[index] === 'bank'"
                >
                  <span>
                    账&nbsp;&nbsp;&nbsp;户: {{activePayModeList[index]}}
                  </span>
                </p>
                <p
                  class="bank-info"
                  v-if="activeBankType[index] === 'alipay'"
                >
                  <span>支付宝账户:</span>
                  <span>{{activePayModeList[index]}}</span>
                </p>
                <p
                  class="bank-info"
                  v-if="activeBankType[index] === 'wx'"
                >
                  <span>微信账户:</span>
                  <span>{{activePayModeList[index]}}</span>
                </p>
              </div>
              <div class="bank-info-picture display-inline-block">
                <div class="picture-box">
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <img
                      width="140"
                      height="200"
                      src="../../assets/develop/weixin.png"
                    >
                    <el-button slot="reference">扫码支付</el-button>
                  </el-popover>
                </div>
              </div>
            </div>
            <!-- 付款后 -->
            <div
              class="middle-content"
              v-if="item.status == 'PAYED'"
            >
              <div class="trader-info display-inline-block">
                <p class="bankMoneyInfo">
                  <span
                    v-if="item.payType === 'bank'"
                  >
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                    />
                    银行卡已付款
                  </span>
                  <span
                    v-if="item.payType === 'alipay'"
                  >
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                    />
                    支付宝已付款
                  </span>
                  <span
                    v-if="item.payType === 'wx'"
                  >
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                    />
                    微信已付款
                  </span>
                  <span
                    v-if="item.payType === 'xilian'"
                  >
                    <img src="../../assets/user/xilian.png" alt="" class="xilian">
                    西联汇款已付款
                  </span>
                  <span
                    v-if="item.payType === 'paypal'"
                  >
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                    />
                    PAYPAL已付款
                  </span>
                </p>
                <p class="bankMoneyInfo">
                  <span>转账金额: </span><span>{{item.symbol}}{{item.payAmount}}</span>
                </p>
                <p class="bankMoneyInfo">
                  <span>
                    账&nbsp;&nbsp;&nbsp;户: </span>
                    <span>{{item.payAcctount}}</span>
                </p>
              </div>
              <div class="bank-info-picture display-inline-block">
                <div class="picture-box">
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <img
                      width="140"
                      height="200"
                      src="../../assets/develop/weixin.png"
                    >
                    <el-button slot="reference">扫码支付</el-button>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <!-- 1.2.3 表右部 -->
          <div class="order-list-body-right">
            <!-- 付款前 -->
            <div
              class="right-content"
              v-if="item.status == 'PICKED'"
            >
              <!-- 等待付款确认付款按钮 -->
              <p class="action-tips">
                <span class="wait-pay">等待付款</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="comfirmPayMoney"
                >
                <!-- :disabled="payForButtondisabledStatus" -->
                  确认付款
                </el-button>
              </p>
              <!-- 注意 -->
              <p class="action-tips">
                注意！计时结束前未手动转账并点击"确认付款"，您的订单将自动取消，若上述情况累计出现3次，您的账户将被冻结24小时。
              </p>
            </div>
            <!-- 付款后 -->
            <div
              class="right-content"
              v-if="item.status == 'PAYED'"
            >
              <p class="action-tips submitted-confirm-payment">已提交确认付款</p>
              <p class="action-tips">
                注意！请联系卖家确认收款并确认订单，如果卖家12小时内未确认订单，系统自动成交。
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单列表 ：2.0 卖单 -->
      <div
        class="order-list"
        v-for="(item, index) in tradingOrderList"
        :key="index"
        v-if="item.orderType === 'SELL'"
      >
        <!-- 2.1 表头 -->
        <div class="order-list-head">
          <!-- 买家 -->
          <div class="buyer-seller">
            买家：{{item.buyName}}
          </div>
          <!-- 订单号 -->
          <div class="order-id">
            订单号：{{item.orderSequence}}
          </div>
          <!-- 成交时间 -->
          <div class="deal-time">
            成交时间：{{item.createTime}}
          </div>
          <div class="order-list-head-icon sell-icon">
            <!-- <img src="../../assets/develop/sell.png" alt=""> -->
          </div>
          <div class="buy-sell-icon">
            卖
          </div>
        </div>
        <!-- 2.2 表身体 -->
        <div class="order-list-body">
          <!-- 2.2.1 表左侧 -->
          <div class="order-list-body-left">
            <div class="logo">
              <!-- src="../../assets/develop/bi.png" -->
              <img
                :src="item.coinUrl"
                width="30"
                class="logo-icon"
              >
              <p class="logo-name">{{item.coinName}}</p>
            </div>
            <div class="left-info">
              <!-- 金额 -->
              <p class="trade-info">
                <span>金额：</span>
                <span class="money">{{item.symbol}}{{item.payAmount}}</span>
              </p>
              <!-- 单价 -->
              <p class="trade-info">
                <span>单价：{{item.price}}</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>数量：{{item.pickCount}}</span>
              </p>
              <!-- 卖家手机号 -->
              <p class="trade-info">
                买家手机号：{{item.buyPhone}}
              </p>
            </div>
          </div>
          <!-- 2.2.2 表中部 -->
          <div class="order-list-body-middle">
            <!-- 付款前 -->
            <div
              class="middle-content"
              v-if = "sellerConfirmGatherMoney"
            >
              <div class="trader-info display-inline-block">
                <p class="order-cancle-tips">
                  订单生成后N分钟内对方未确认收款，订单将自动取消
                </p>
              </div>
              <div class="bank-info-picture display-inline-block">
                <div class="picture-box">
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <img
                      width="140"
                      height="200"
                      src="../../assets/develop/weixin.png"
                    >
                    <el-button slot="reference">扫码支付</el-button>
                  </el-popover>
                </div>
              </div>
            </div>
            <!-- 付款后 -->
            <div class="middle-content"
              v-else
            >
              <div class="trader-info display-inline-block">
                <p class="bankMoneyInfo">
                  <IconFontCommon
                    iconName="icon-yinhangqia"
                  />
                  <span>银行卡已付款22</span>
                </p>
                <p class="bankMoneyInfo">
                  <span>转账金额:</span><span>￥688.00</span>
                </p>
                <p class="bankMoneyInfo">
                  <span>
                    账&nbsp;&nbsp;&nbsp;户:</span>
                    <span>612799999999999999</span>
                </p>
              </div>
              <div class="bank-info-picture display-inline-block">
                <div class="picture-box">
                  <el-popover
                    placement="bottom"
                    trigger="click"
                  >
                    <img
                      width="140"
                      height="200"
                      src="../../assets/develop/weixin.png"
                    >
                    <el-button slot="reference">扫码支付</el-button>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <!-- 2.2.3 表右部 -->
          <div class="order-list-body-right">
            <div
              class="right-content"
              v-if = "sellerConfirmGatherMoney"
            >
              <p class="action-explain">
              <el-button
                type="primary"
                size="mini"
                @click="comfirmGatherMoney"
              >
                确认收款
              </el-button>
              </p>
              <p class="action-explain">等待买家付款。</p>
            </div>
            <div class="right-content" v-else>
              <p class="action-explain">
                <el-button
                  type="primary"
                  size="mini"
                >
                  确认收款
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                >
                  订单申诉
                </el-button>
              </p>
              <p class="action-explain">
                买家付款已付款
              </p>
              <p class="action-explain count-down-time">
                <span>剩余时间：</span>
                <span class="remaining-time">
                  11小时12分钟25秒
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 3.0 订单申诉 -->
      <div class="otc-order-appeal order-list">
        <!-- 申诉表头 -->
        <div class="appeal-head">
          订单申诉
        </div>
        <!-- 申诉表身体 -->
        <div class="appeal-body">
          <div class="appeal-body-content">
            <!-- 文本域部分 -->
            <div class="appeal-textarea">
              <span class="appeal-reason">*申诉原因</span>
              <el-input
                type="textarea"
                v-model="appealTextareaValue">
              </el-input>
            </div>
            <!-- 按钮部分 -->
            <div class="appeal-button">
              <el-button
                type="primary"
                size="mini"
                @click="comfirmPayMoney"
              >
                提交申诉
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="comfirmPayMoney"
              >
                取消申诉
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 4.0 弹出交易密码框 -->
      <div class="password-dialog">
        <el-dialog
          title="交易密码"
          :visible.sync="dialogVisible"
          top="25vh"
          width="470"
        >
          <div>请输入交易密码</div>
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
            >
          </div>
          <div class="error-info">
            <!-- 错误提示 -->
            <div class="tips">错误提示</div>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
              <el-button
                type="primary"
                @click="submitButton"
              >
                提 交
              </el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getOTCTradingOrders, buyerPayForOrder} from '../../utils/api/apiDoc'
import {timeFilter} from '../../utils'
import IconFontCommon from '../Common/IconFontCommon'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
    IconFontCommon //  字体图标组件
  },
  // props,
  data () {
    return {
      // orderStatus: '', // 订单状态:（已创建，已付款，已完成，已取消，已冻结 PICKED PAYED COMPLETED CANCELED FROZEN）
      // payForButtondisabledStatus: true, // 确认付款按钮禁用状态
      dialogVisible: false, // 交易密码框
      appealTextareaValue: '', // 订单申诉原因文本域内容
      sellerConfirmGatherMoney: true, // 卖家确认收款按钮状态
      activitedPayStyle: '', //  选中的支付方式
      activitedPayStyleId: '', //  选中的支付方式id-往后台传送的参数
      // 交易中订单列表
      tradingOrderList: [],
      // 选中的订单id
      activedTradingOrderId: '',
      // ren测试支付方式
      activePayModeList: [], // 当前选中支付方式中的哪一个
      activeBankFidList: [], // 当前选中支付方式的id
      activeBankProv: [], // 当前选中支付银行所在省
      activeBankCity: [], // 当前选中支付银行所在市
      activeBankArea: [], // 当前选中支付银行所在区
      activeBankName: [], // 当前选中支付银行名字
      activeBankDetailAddress: [], // 当前选中支付银行具体地址
      activeBankType: [], // 当前选中支付方式类型（银行卡、支付宝等）
      activeBankCode: [], // 支付码
      tradePassword: '' // 交易密码
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCTradingOrder.css')
    require('../../../static/css/theme/day/OTC/OTCTradingOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCTradingOrderNight.css')
    // 1.0 请求交易中订单列表
    this.getOTCTradingOrdersList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.0 请求交易中订单列表
    async getOTCTradingOrdersList () {
      const data = await getOTCTradingOrders({
        status: 'TRADING' // 状态 (交易中 TRADING 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        // pageNum: '1',
        // pageSize: '10'
      })
      console.log('交易中订单列表')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.tradingOrderList = data.data.data.list
        console.log('交易中订单')
        console.log(this.tradingOrderList)
        // 订单状态
        // this.orderStatus = data.data.data.status
        // console.log(this.orderStatus)
      }
    },
    // 3.0 改变交易方式
    changeUserBankInfo (index) {
      console.log('选中订单的订单号')
      console.log(this.tradingOrderList[index].id)
      this.activedTradingOrderId = this.tradingOrderList[index].id
      this.tradingOrderList[index].userBankList.forEach((item) => {
        if (item.cardNo == this.activePayModeList[index]) {
          this.activeBankFidList[index] = item.id
          console.log('选中的支付方式id')
          console.log(this.activeBankFidList[index])
          this.activitedPayStyleId = this.activeBankFidList[index]
          // 省
          this.activeBankProv[index] = item.prov
          // 市
          this.activeBankCity[index] = item.city
          // 区
          this.activeBankArea[index] = item.area
          // 银行名字
          this.activeBankName[index] = item.bankName
          // 具体地址
          this.activeBankDetailAddress[index] = item.address
          // 支付类型
          this.activeBankType[index] = item.bankType
          // console.log(this.activeBankType[index])
          // 支付码
          this.activeBankCode[index] = item.qrcode
          // console.log(this.activeBankCode[index])
        }
        // this.payForButtondisabledStatus = false
      })
      // 遍历订单取到支付方式数组
      // this.tradingOrderList.forEach(item => {
      //   if (item.id === orderId) {
      //     this.payWayArr = item.userBankList
      //   }
      // })
    },
    // 4.0 买家点击确认付款按钮
    comfirmPayMoney () {
      // 弹出交易密码框
      this.dialogVisible = true
    },
    // 5.0 点击交易密码框中的提交按钮
    async submitButton () {
      const data = await buyerPayForOrder({
        orderId: this.activedTradingOrderId, // 订单id
        payId: this.activitedPayStyleId, // 支付账户id
        tradePassword: this.tradePassword // 交易密码
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 先判断status订单状态（已创建，已付款，已完成，已取消，已冻结 PICKED PAYED COMPLETED CANCELED FROZEN）
        // 付款成功后，根据返回的状态再渲染
        // 付款成功后逻辑
        // 1关闭交易密码框
        this.dialogVisible = false
        // 2再次调用接口刷新列表
        this.getOTCTradingOrdersList()
        // 3再次渲染页面:根据返回的订单状态
      }
    },
    // 卖家点击确认收款按钮
    comfirmGatherMoney () {
      this.sellerConfirmGatherMoney = false
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCTradingOrder.scss);
.otc-trading-order-box{
  >.otc-trading-order-content{
    >.order-list{
      width: 1045px;
      height: 170px;
      font-size: 12px;
      margin-bottom: 15px;
      box-sizing: border-box;
      border-radius: 5px;
      background-color: #202A33;
      border: 1px solid #262F38;
      >.order-list-head{
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        padding: 0 77px 0 25px;
        color: #9DA5B3;
        border-bottom: 1px solid #262F38;
        display: flex;
        justify-content: space-between;
        position: relative;
        >.buyer-seller{}
        >.order-id{
          padding-left: 300px;
        }
        >.deal-time{}
        >.order-list-head-icon{
          width:0;
          height:0;
          border-radius: 5px;
          border-left:18px solid transparent;
          border-bottom:18px solid transparent;
          position: absolute;
          right: 0;
          top: 0;
        }
        >.buy-icon{
          border-right:18px solid #D45858;
          border-top:18px solid #D45858;
        }
        >.sell-icon{
          border-right:18px solid #008069;
          border-top:18px solid #008069;
        }
        >.buy-sell-icon{
          color: #fff;
          position: absolute;
          right: 4px;
          top: -8px;
        }
      }
      >.order-list-body{
        color: #9DA5B3;
        padding: 15px 20px 15px 20px;
        display: flex;
        flex: 7;
        >.order-list-body-left{
          flex: 2;
          border-right: 1px solid #262F38;
          >.logo{
            display: inline-block;
            margin-right: 20px;
            >.logo-icon{

            }
            >.logo-name{
              margin-top: 10px;
            }
          }
          >.left-info{
            display: inline-block;
            >.trade-info{
              // line-height: 1.5rem;
              line-height: 20px;
              >.money{
                color: #5E95EC;
              }
            }
          }
        }
        >.order-list-body-middle{
          box-sizing: border-box;
          flex: 2;
          border-right: 1px solid #262F38;
          >.middle-content{
            // display: flex;
            // flex: 2;
            .trader-info{
              width: 190px;
              // flex: 1;
              >.pay-style{
                margin-left: 20px;
                margin-bottom: 8px;
                position: relative;
                >.qiandai-icon{
                  >.icon{
                    width: 14px;
                    height: 14px;
                    position: absolute;
                    left: 10px;
                    top: 5px;
                    z-index: 2;
                  }
                }
              }
              >.bank-info{
                margin-left: 20px;
                // line-height: 1.4rem;
                line-height: 20px;
              }
              >.order-cancle-tips{
                margin-left: 20px;
                // line-height: 1.5rem;
                line-height: 20px;
              }
              >.bankMoneyInfo{
                margin-left: 20px;
                // line-height: 1.5rem;
                line-height: 20px;
                .icon{
                  width: 16px;
                  height: 14px;
                }
                .xilian{
                  vertical-align: middle;
                }
              }
            }
            >.bank-info-picture{
              vertical-align: top;
              padding-left: 10px;
              >.picture-box{
              }
            }
          }
        }
        >.order-list-body-right{
          flex: 3;
          >.right-content{
            >.action-tips{
              margin-left: 20px;
              margin-bottom: 10px;
              >.wait-pay{
                color: #E8554F;
                margin-right: 10px;
              }
            }
            >.submitted-confirm-payment{
              color: #5E95EC;
            }
            >.action-explain{
              margin-left: 20px;
              // line-height: 2rem;
              line-height: 20px;
              >.remaining-time{
                color: #D45858;
              }
            }
            >.count-down-time{
              // line-height: 1rem;
              line-height: 20px;
            }
          }
        }
      }
    }
    >.otc-order-appeal{
      height: 170px;
      >.appeal-head{
        height: 36px;
        line-height: 36px;
        box-sizing: border-box;
        padding: 0 77px 0 25px;
        color: #FFFFFF;
        border-bottom: 1px solid #262F38;
      }
      >.appeal-body{
        >.appeal-body-content{
          display: flex;
          flex: 3;
          >.appeal-textarea{
            margin-top: 15px;
            margin-left: 20px;
            flex: 2;
            display: flex;
            justify-content: flex-start;
            >.appeal-reason{
              margin-right: 10px;
              color: #338FF5;
            }
          }
          >.appeal-button{
            flex: 1;
            // background-color: red;
            padding-top: 80px;
          }
        }
      }
    }
  }
}
</style>
