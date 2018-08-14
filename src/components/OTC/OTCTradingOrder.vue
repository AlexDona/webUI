<template>
  <div class="otc-trading-order-box otc">
    <!-- 交易中订单 -->
    <div class="otc-trading-order-content">
      <!-- 订单列表 ：1.0 买单 -->
      <div class="order-list">
        <!-- 表头 -->
        <div class="order-list-head">
          <!-- 买卖家 -->
          <div class="buyer-seller">
            卖家：王先生
          </div>
          <!-- 订单号 -->
          <div class="order-id">
            订单号：123456789525874
          </div>
          <!-- 成交时间 -->
          <div class="deal-time">
            成交时间：2018-08-12 12:00:00
          </div>
          <div class="order-list-head-icon buy-icon">
            <!-- <img src="../../assets/develop/buy.png" alt=""> -->
          </div>
          <div class="buy-sell-icon">
            买
          </div>
        </div>
        <!-- 表身体 -->
        <div class="order-list-body">
          <!-- 表左侧 -->
          <div class="order-list-body-left">
            <div class="logo">
              <img
                src="../../assets/develop/bi.png"
                width="30"
                class="logo-icon"
              >
              <p class="logo-name">BTC</p>
            </div>
            <div class="left-info">
              <!-- 金额 -->
              <p class="trade-info">
                <span>金额：</span>
                <span class="money">￥688.00</span>
              </p>
              <!-- 单价 -->
              <p class="trade-info">
                <span>单价：88</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>数量：188</span>
              </p>
              <!-- 卖家手机号 -->
              <p
                class="trade-info"
                v-if="buyerConfirmPayMoney"
              >
                卖家手机号：**********
              </p>
              <p
                class="trade-info"
                v-else
              >
                卖家手机号：15738818082
              </p>
            </div>
          </div>
          <!-- 表中部 -->
          <div class="order-list-body-middle">
            <div
              class="middle-content"
              v-if = "buyerConfirmPayMoney"
            >
              <!-- 选择支付方式 -->
              <div class="pay-style">
                <div class="qiandai-icon">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-qiandai-tianchong"></use>
                  </svg>
                </div>
                <el-select
                  v-model="activitedPayStyle"
                  placeholder="选择支付方式"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <!-- 收款人 -->
              <p class="bank-info">
                <span>收款人：王先生</span>
              </p>
              <!-- 开户行 -->
              <p class="bank-info">
                <span>开户行：中国建设银行</span>
              </p>
              <!-- 账户 -->
              <p class="bank-info">
                <span>
                  账&nbsp;&nbsp;&nbsp;户：621788888888888888
                </span>
              </p>
            </div>
            <div
              class="middle-content"
              v-else
            >
              <p class="bankMoneyInfo">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yinhangqia"></use>
                  </svg>
                </span>
                <span>银行卡已付款</span>
              </p>
              <p class="bankMoneyInfo">
                <span>转账金额：</span><span>￥688.00</span>
              </p>
              <p class="bankMoneyInfo">
                <span>
                  账&nbsp;&nbsp;&nbsp;户：</span>
                  <span>61271111111111111111</span>
              </p>
            </div>
          </div>
          <!-- 表右部 -->
          <div class="order-list-body-right">
            <div
              class="right-content"
              v-if = "buyerConfirmPayMoney"
            >
              <!-- 等待付款确认付款按钮 -->
              <p class="action-tips">
                <span class="wait-pay">等待付款</span>
                <el-button
                  type="primary"
                  size="mini"
                  @click="comfirmPayMoney"
                >
                  确认付款
                </el-button>
              </p>
              <!-- 注意 -->
              <p class="action-tips">
                注意！计时结束前未手动转账并点击"确认付款"，您的订单将自动取消，若上述情况累计出现3次，您的账户将被冻结24小时。
              </p>
            </div>
            <div
              class="right-content"
              v-else
            >
              <p class="action-tips submitted-confirme-payment">已提交确认付款</p>
              <p class="action-tips">
                注意！请联系卖家确认收款并确认订单，如果卖家12小时内未确认订单，系统自动成交。
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- 订单列表 ：2.0 卖单 -->
      <div class="order-list">
        <!-- 表头 -->
        <div class="order-list-head">
          <!-- 买卖家 -->
          <div class="buyer-seller">
            买家：刘女士
          </div>
          <!-- 订单号 -->
          <div class="order-id">
            订单号：666666666666
          </div>
          <!-- 成交时间 -->
          <div class="deal-time">
            成交时间：2018-08-10 12:00:00
          </div>
          <div class="order-list-head-icon sell-icon">
            <!-- <img src="../../assets/develop/sell.png" alt=""> -->
          </div>
          <div class="buy-sell-icon">
            卖
          </div>
        </div>
        <!-- 表身体 -->
        <div class="order-list-body">
          <!-- 表左侧 -->
          <div class="order-list-body-left">
            <div class="logo">
              <img
                src="../../assets/develop/bi.png"
                width="30"
                class="logo-icon"
              >
              <p class="logo-name">BTC</p>
            </div>
            <div class="left-info">
              <!-- 金额 -->
              <p class="trade-info">
                <span>金额：</span>
                <span class="money">￥688.00</span>
              </p>
              <!-- 单价 -->
              <p class="trade-info">
                <span>单价：88</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>数量：188</span>
              </p>
              <!-- 卖家手机号 -->
              <p class="trade-info">
                卖家手机号：1589657458
              </p>
            </div>
          </div>
          <!-- 表中部 -->
          <div class="order-list-body-middle">
            <div
              class="middle-content"
              v-if = "sellerConfirmGatherMoney"
            >
              <p class="order-cancle-tips">
                订单生成后N分钟内对方未确认收款，订单将自动取消
              </p>
            </div>
            <div class="middle-content" v-else>
              <p class="bankMoneyInfo">
                <span>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yinhangqia"></use>
                  </svg>
                </span>
                <span>银行卡已付款</span>
              </p>
              <p class="bankMoneyInfo">
                <span>转账金额：</span><span>￥688.00</span>
              </p>
              <p class="bankMoneyInfo">
                <span>
                  账&nbsp;&nbsp;&nbsp;户：</span>
                  <span>61271111111111111111</span>
              </p>
            </div>
          </div>
          <!-- 表右部 -->
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
      <!-- 订单申诉 -->
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
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
export default {
  components: {},
  // props,
  data () {
    return {
      appealTextareaValue: '', // 订单申诉原因文本域内容
      buyerConfirmPayMoney: true, // 买家确认付款按钮状态
      sellerConfirmGatherMoney: true, // 卖家确认收款按钮状态
      // 支付方式
      options: [{
        value: '选项1',
        label: '银行卡'
      }, {
        value: '选项2',
        label: '支付宝'
      }, {
        value: '选项3',
        label: '微信'
      }],
      activitedPayStyle: '' //  选中的支付方式
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCTradingOrder.css')
    require('../../../static/css/theme/day/OTC/OTCTradingOrderDay.css')
    require('../../../static/css/theme/night/OTC/OTCTradingOrderNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 买家点击确认付款按钮
    comfirmPayMoney () {
      this.buyerConfirmPayMoney = false
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
              line-height: 1.5rem;
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
            >.pay-style{
              margin-left: 40px;
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
              margin-left: 40px;
              line-height: 1.4rem;
            }
            >.order-cancle-tips{
              margin-left: 40px;
              line-height: 2rem;
            }
            >.bankMoneyInfo{
              margin-left: 40px;
              line-height: 1.5rem;
              .icon{
                width: 16px;
                height: 14px;
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
            >.submitted-confirme-payment{
              color: #5E95EC;
            }
            >.action-explain{
              margin-left: 20px;
              line-height: 2rem;
              >.remaining-time{
                color: #D45858;
              }
            }
            >.count-down-time{
              line-height: 1rem;
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
