<template>
  <div class="otc-online-trader-buy-sell-box otc">
    <!-- otc在线交易买卖样式重置 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 otc在线交易买卖 -->
    <div class="online-trader-buy-sell-content">
        <div class="online-trader">
            <!-- 交易左边 -->
            <div class="online-trader-left">
                <!-- 左上部分商家信息部分 -->
                <div class="shoper-info">
                    <!-- 商家名字 -->
                    <div class="shoper-name">
                      <img
                        src="../../assets/develop/shangjia.png"
                        alt=""
                        class="shang-icon"
                      >
                      <span class="name">诚信商贸</span>
                    </div>
                    <!-- 商家交易统计 -->
                    <div class="shoper-statistics">
                      <div class="trader-total">
                        <p class="blue">524</p>
                        <p class="text">交易次数</p>
                      </div>
                      <div class="failed">
                        <p class="blue">5</p>
                        <p class="text">失败次数</p>
                      </div>
                      <div class="freeze">
                        <p class="blue">4</p>
                        <p class="text">冻结次数</p>
                      </div>
                    </div>
                </div>
                <!-- 左下部分商家备注部分 -->
                <div class="shoper-remark">
                  <p class="remark-title">备注：</p>
                  <p class="remark-content">
                    认证商家 安全可靠，广告在人就在！下单后5分钟之内未响应，直接短信 15500022200
                  </p>
                </div>
            </div>
            <!-- 交易右边 -->
            <div class="online-trader-right">
                <!-- 右上交易部分 -->
                <div class="trader-details">
                  <!--前四个展示部分-->
                  <div class="details-row">
                    <span class="details-tip">
                        报价：
                    </span>
                    <span class="details-data">
                        0.09CNY
                    </span>
                  </div>
                  <div class="details-row">
                    <span class="details-tip">
                        最小交易量：
                    </span>
                    <span class="details-data">
                        ≥20BTC
                    </span>
                  </div>
                  <div class="details-row">
                    <span class="details-tip">
                        付款方式：
                    </span>
                    <IconFontCommon
                      iconName="icon-zhifubao1"
                    />
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                    />
                    <IconFontCommon
                      iconName="icon-yinhangqia"
                    />
                  </div>
                  <div class="details-row">
                    <span class="details-tip">
                        付款期限：
                    </span>
                    <span class="details-data">
                        30分钟
                    </span>
                  </div>
                  <!--表单部分-->
                  <div class="form">
                    <el-form
                        :label-position="labelPosition"
                        label-width="80px"
                        :model="formLabelAlign"
                    >
                      <el-form-item>
                        <div class="want">
                          <span
                            class="want-text"
                            v-show="onlineTraderStatus === 'onlineSell'"
                          >
                              您想出售多少
                          </span>
                          <span
                            class="want-text"
                            v-show="onlineTraderStatus === 'onlineBuy'"
                          >
                              您想购买多少
                          </span>
                          <span
                            class="charge-money"
                            v-show="onlineTraderStatus === 'onlineSell'"
                          >
                            <el-button
                              type="primary"
                              size="mini"
                            >
                              充币
                            </el-button>
                          </span>
                        </div>
                        <div class="sell-buy-input">
                          <!--出售-->
                          <input
                            type="text"
                            placeholder="最大可卖1.58"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineSell'"
                          >
                          <!--购买-->
                          <input
                            type="text"
                            placeholder="买入量"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                          >
                          <span class="unit">BTC</span>
                          <!--出售-->
                          <input
                            type="text"
                            placeholder="最大可卖32580"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineSell'"
                          >
                          <!--购买-->
                          <input
                            type="text"
                            placeholder="金额"
                            class="sell-sum"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                          >
                          <span class="unit">CNY</span>
                        </div>
                        <div class="trader-submit">
                          <button
                            class="trader-submit-button trader-submit-sell"
                            v-if="onlineTraderStatus === 'onlineSell'"
                          >
                            确定出售
                          </button>
                          <!-- 这个注释的按钮不能删除需要来根据状态显示切换的 -->
                          <button
                            class="trader-submit-button trader-submit-buy"
                            v-if="onlineTraderStatus === 'onlineBuy'"
                          >
                            确定购买
                          </button>
                        </div>
                      </el-form-item>
                    </el-form>
                  </div>
                  <!--最下右边手续费-->
                  <div class="service-charge ">
                    <span>手续费：</span>
                    <span>0.0 CNY</span>
                    <span>( 费率 <span>0.12%</span> )</span>
                  </div>
                </div>
                <!-- 右下交易须知 -->
                <div class="trading-notes">
                  <div class="notes">
                    <h4 class="title">*交易须知：</h4>
                    <p class="tip">
                        1. 订单匹配后若未按时付款，累积<span class="warning">3次</span>，您的账户将被冻结。
                    </p>
                    <p class="tip">
                        2. 付款前请仔细覈实对方信息。
                    </p>
                    <p class="tip">
                        3. 交易请勿脱离平台，一旦脱离，您将失去FUBT.top的保护；
                    </p>
                    <p class="tip">
                        4. 遇到纠纷，请保留好包括聊天记录在内的证据，立即联系我们。
                    </p>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标组件
  },
  data () {
    return {
      labelPosition: 'top', //  表单label放置的位置
      onlineTraderStatus: '' //  在线买卖的类型状态 购买（onlineBuy）和 出售（onlineSell)
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCOnlineTraderBuySell.css')
    require('../../../static/css/theme/day/OTC/OTCOnlineTraderBuySellDay.css')
    require('../../../static/css/theme/night/OTC/OTCOnlineTraderBuySellNight.css')
    console.log(this.$route.params.styleId) //  从OTCCenter传过来的URL中获取的在线买卖的类型 购买（onlineBuy）和 出售（onlineSell)
    this.onlineTraderStatus = this.$route.params.styleId
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCPublishBuyAndSell.scss);
.otc-online-trader-buy-sell-box{
    background-color: #1D2331;
    >.online-trader-buy-sell-content{
        width: 1150px;
        margin: 0 auto;
        margin-top: 50px;
        margin-bottom: 150px;
        >.online-trader{
            display: flex;
            flex: 10;
            >.online-trader-left{
                flex: 3;
                >.shoper-info{
                    width: 320px;
                    height: 180px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    border-radius: 5px;
                    padding: 40px 40px 0 40px;
                  >.shoper-name{
                    height: 20px;
                    line-height: 20px;
                    >.shang-icon{
                      display: inline-block;
                      width: 14px;
                      height: 19px;
                      vertical-align: top;
                    }
                    >.name{
                      display: inline-block;
                      color: #FFFFFF;
                      font-size: 16px;
                      margin-left: 10px;
                    }
                  }
                  >.shoper-statistics{
                    display: flex;
                    flex: 3;
                    text-align: center;
                    margin-top: 40px;
                    .blue{
                      color: #3E79D6;
                      font-size:14px;
                    }
                    .text{
                      font-size: 12px;
                      color: #9DA5B3;
                      margin-top: 5px;
                    }
                    >.trader-total{
                      flex: 3;
                    }
                    >.failed{
                      flex: 3;
                    }
                    >.freeze{
                      flex: 3;
                    }
                  }
                }
                >.shoper-remark{
                    width: 320px;
                    height: 130px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    margin-top: 20px;
                    border-radius: 5px;
                    padding: 30px 49px 0 39px;
                  >.remark-title{
                    color: #7D90AC;
                    font-size: 14px;
                  }
                  >.remark-content{
                    color: #9DA5B3;
                    font-size: 12px;
                    margin-top: 5px;
                    line-height: 1.2rem;
                  }
                }
            }
            >.online-trader-right{
                flex: 7;
                box-sizing: border-box;
                >.trader-details{
                    width: 760px;
                    height: 440px;
                    box-sizing: border-box;
                    background-color: #202A33;
                    border-radius: 5px;
                    padding: 35px 0 0 48px;
                    >.details-row{
                      height: 30px;
                      line-height: 30px;
                      >.details-tip{
                        color: #9DA5B3;
                        font-size: 12px;
                        width: 75px;
                        display: inline-block;
                      }
                      >.details-data{
                        color: #fff;
                        font-size: 12px;
                      }
                    }
                    >.form{
                      .want{
                        margin-top: 40px;
                        >.want-text{
                          color: #3E79D6;
                          font-size: 20px;
                          margin-right: 20px;
                        }
                        >.charge-money{

                        }
                      }
                      .sell-buy-input{
                        padding: 10px 0 10px 0;
                        >.sell-sum{
                          width: 190px;
                          height: 36px;
                          background-color: #333A41;
                          padding-left: 10px;
                          color: #9DA5B3;
                        }
                        >.unit{
                          width: 70px;
                          height: 36px;
                          color: #338FF5;
                          font-size: 16px;
                          background-color: #414951;
                          display: inline-block;
                          vertical-align: middle;
                          margin-left: -4px;
                          line-height: 36px;
                          text-align: center;
                          margin-right: 50px;
                        }
                      }
                      .trader-submit{
                        >.trader-submit-button{
                          width: 602px;
                          height: 40px;
                          color: #FFFFFF;
                          font-size: 14px;
                          border-radius:4px;
                          margin-top: 20px;
                          cursor: pointer;
                        }
                        >.trader-submit-sell{
                          background-color: #008069;
                        }
                        >.trader-submit-buy{
                          background-color: #D45858;
                        }
                      }
                    }
                    >.service-charge{
                      width: 602px;
                      color: #9DA5B3;
                      font-size: 14px;
                      text-align: right;
                    }
                }
                >.trading-notes{
                    width: 760px;
                    height: 122px;
                    box-sizing: border-box;
                    padding: 35px 0 0 48px;
                  >.notes{
                    >.title{
                      color: #B43B3B;
                      font-size: 14px;
                      margin-bottom: 15px;
                    }
                    >.tip{
                      color: #7D90AC;
                      font-size: 14px;
                      line-height: 1.3rem;
                      >.warning{
                        color: #B43B3B;
                        font-size: 14px;
                      }
                    }
                  }
                }
            }
        }
    }
}
</style>
