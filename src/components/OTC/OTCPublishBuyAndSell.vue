<template>
  <div class="otc-publish-buy-and-sell-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0发布购买和出售 -->
    <div class="publish-buy-and-sell-content">
        <!-- 发布订单内容部分分为左右两个部分 -->
        <div class="publish-content">
            <!-- 左边部分:发布订单买卖部分 -->
            <div class="publish-content-left">
                <!-- 购买和出售切换 -->
                <div class="publish-button">
                    <button
                        class="sell-button common-style"
                        @click="toggleSellButton"
                        :class="{ green: publishStyle === 'sell' }"
                    >
                        出售
                    </button>
                    <button
                        class="buy-button common-style"
                        @click="toggleBuyButton"
                        :class="{ red: publishStyle === 'buy' }"
                    >
                        购买
                    </button>
                </div>
                <!-- 发布购买和出售大表单 -->
                <div class="buy-sell-submit-form">
                    <el-form
                        :label-position="labelPosition"
                        label-width="80px"
                        :model="formLabelAlign"
                    >
                        <el-form-item label="选择币种类型">
                            <el-select
                                placeholder="请选择币种类型"
                                v-model="coinId"
                                @change="changeCoinId"
                            >
                                <el-option
                                    v-for="(item,index) in coinStyleList"
                                    :key="index"
                                    :value="item.id"
                                    :label="item.name"
                                >
                                </el-option>
                                <!-- <el-option
                                    label="区域一"
                                    value="shanghai"
                                >
                                </el-option> -->
                                <!-- <el-option
                                    label="区域二"
                                    value="beijing"
                                >
                                </el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择你希望付款的货币类型">
                            <el-select
                                placeholder="选择你希望付款的货币类型"
                                v-model="hopePaymentCoinId"
                                @change="changehopePaymentCoinId"
                            >
                                <el-option
                                    v-for="(item,index) in hopePaymentCoinStyleList"
                                    :key="index"
                                    :value="item.id"
                                    :label="item.name"
                                >
                                </el-option>
                                <!-- <el-option
                                    label="区域一"
                                    value="shanghai">
                                </el-option>
                                <el-option
                                    label="区域二"
                                    value="beijing">
                                </el-option> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <div
                                class="want-buy-sell-sum"
                                v-show="publishStyle === 'sell'"
                            >
                                你想出售多少
                            </div>
                            <div
                                class="want-buy-sell-sum"
                                v-show="publishStyle === 'buy'"
                            >
                                你想购买多少
                            </div>
                            <div class="want-buy-sell-sum-content">
                                <span class="want-text">最大可卖出量：</span>
                                <span
                                    class="max-sum"
                                    v-show="publishStyle === 'sell'"
                                    :class="{ sellGreen: publishStyle === 'sell' }"
                                >
                                    --111111BTC
                                </span>
                                <span
                                    class="max-sum"
                                    v-show="publishStyle === 'buy'"
                                    :class="{ buyOrange: publishStyle === 'buy' }"
                                >
                                    --2222222BTC
                                </span>
                                <span class="want-text">市价：</span>
                                <span
                                    class="market-price"
                                    v-show="publishStyle === 'sell'"
                                    :class="{ sellGreen: publishStyle === 'sell' }"
                                >
                                    --111CNY
                                </span>
                                <span
                                    class="market-price"
                                    v-show="publishStyle === 'buy'"
                                    :class="{ buyOrange: publishStyle === 'buy' }"
                                >
                                    --222CNY
                                </span>
                                <el-button
                                    type="primary"
                                    size="mini"
                                    v-show="publishStyle === 'sell'"
                                >
                                    充币
                                </el-button>
                            </div>
                            <div class="sell-buy-input">
                                <input
                                    type="text"
                                    placeholder="卖出量"
                                    class="sell-sum"
                                    v-show="publishStyle === 'sell'"
                                >
                                <input
                                    type="text"
                                    placeholder="买入量"
                                    class="sell-sum"
                                    v-show="publishStyle === 'buy'"
                                >
                                <span class="unit">BTC</span>
                                <input
                                    type="text"
                                    placeholder="金额"
                                    class="sell-sum"
                                    v-show="publishStyle === 'sell'"
                                >
                                <input
                                    type="text"
                                    placeholder="买入单价"
                                    class="sell-sum"
                                    v-show="publishStyle === 'buy'"
                                >
                                <span class="unit">CNY</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="单笔成交额">
                            <div class="volume-business">
                                <input
                                    type="text"
                                    class="sell-sum"
                                >
                                <span class="monad">CNY</span>
                                <span class="range-line">-</span>
                                <input
                                    type="text"
                                    placeholder="单笔最大成交额"
                                    class="sell-sum max-sell-sum"
                                >
                                <span class="monad">CNY</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注">
                            <div class="remark">
                                请说明有关于您交易的相关条款或者其它您想让对方获悉得信息，以便对方和您快速交易
                            </div>
                            <el-input
                                type="textarea"
                                auto-complete="off"
                                placeholder="请输入留言:"
                            >
                            </el-input>
                            <div class="predict">
                                <span class="predict-text">
                                    预计交易额：
                                </span>
                                <span class="predict-sum">
                                    1.00 CNY
                                </span>
                                <span class="predict-text">
                                    手续费：
                                </span>
                                <span class="predict-sum">
                                    0 BTC
                                </span>
                                <span class="rate-text">
                                    ( 费率
                                    <span class="rate">
                                        0.8%
                                    </span>
                                    )
                                </span>
                            </div>
                        </el-form-item>
                        <div class="publish-submit">
                            <button
                                class="publish-submit-button publish-submit-sell"
                                v-show="publishStyle === 'sell'"
                            >
                                发布出售
                            </button>
                            <button
                                class="publish-submit-button publish-submit-buy"
                                v-show="publishStyle === 'buy'"
                            >
                                发布购买
                            </button>
                        </div>
                    </el-form>
                </div>
            </div>
            <!-- 右边部分:发布说明部分 -->
            <div class="publish-content-right">
                <div class="release-notes">
                    <p class="release-title release-tips">
                        发布说明：
                    </p>
                    <p class="release-tips">
                        1、发布买卖是免费的；
                    </p>
                    <p class="release-tips">
                        2、您可以在设置种设置您的收款方式，发布买卖时直接选择，它会显示在您的委托列表中；
                    </p>
                    <p class="release-tips">
                        3、交易中请注意判断和防范有欺诈风险的付款方式；
                    </p>
                    <p class="release-tips">
                        4、请避免线下私自交易，FUBT.top无法为您预防风险
                    </p>
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
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon //  底部
  },
  data () {
    return {
      publishStyle: 'sell', //  购买和出售选中类型
      labelPosition: 'top', //  表单label放置的位置
      //   币种类型列表
      coinStyleList: [
        {
          'name': 'BXB',
          'id': 16
        },
        {
          'name': 'TV',
          'id': 17
        },
        {
          'name': 'GXS',
          'id': 18
        },
        {
          'name': 'EOS',
          'id': 19
        },
        {
          'name': 'BTM',
          'id': 20
        }
      ],
      //   币种类型
      coinId: '',
      //   选择你希望付款的货币类型列表
      hopePaymentCoinStyleList: [
        {
          'name': 'BXB',
          'id': 6
        },
        {
          'name': 'TV',
          'id': 7
        },
        {
          'name': 'GXS',
          'id': 8
        },
        {
          'name': 'EOS',
          'id': 9
        },
        {
          'name': 'BTM',
          'id': 10
        }
      ],
      //   希望付款的货币类型
      hopePaymentCoinId: '',
      //  form表单数据
      formLabelAlign: {
        region1: '',
        region2: ''
      }
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCPublishBuyAndSell.css')
    require('../../../static/css/theme/day/OTC/OTCPublishBuyAndSellDay.css')
    require('../../../static/css/theme/night/OTC/OTCPublishBuyAndSellNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 点击 购买 和 出售 按钮切换
    toggleSellButton () {
      this.publishStyle = 'sell'
      console.log(this.publishStyle)
    },
    toggleBuyButton () {
      this.publishStyle = 'buy'
      console.log(this.publishStyle)
    },
    // 选择币种类型
    changeCoinId () {
      console.log(this.coinId)
    },
    // 选择你希望付款的货币类型
    changehopePaymentCoinId () {
      console.log(this.hopePaymentCoinId)
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCPublishBuyAndSell.scss);
.otc-publish-buy-and-sell-box{
    background-color: #1D2331;
    >.publish-buy-and-sell-content{
        width: 1150px;
        margin: 70px auto;
        >.publish-content{
            display: flex;
            flex: 3;
            >.publish-content-left{
                flex: 2;
                >.publish-button{
                    >.common-style{
                        color: #8494A6;
                        width: 70px;
                        height: 36px;
                        display: inline-block;
                        border: 1px solid #47525C;
                        cursor: pointer;
                    }
                    >.sell-button{
                        margin-right: -4px;
                        border-right: 0;
                        border-top-left-radius: 4px;
                        border-bottom-left-radius: 4px;
                    }
                    >.buy-button{
                        border-left: 0;
                        border-top-right-radius: 4px;
                        border-bottom-right-radius: 4px;
                    }
                    >.green{
                        background-color: #008069;
                        color: #FFFEFE;
                        border: 1px solid #008069;
                    }
                    >.red{
                        background-color: #D45858;
                        color: #FFFEFE;
                        border: 1px solid #D45858;
                    }
                }
                >.buy-sell-submit-form{
                  margin-top: 20px;
                  .want-buy-sell-sum{
                    color: #338FF5;
                    font-size: 20px;
                    padding-top: 20px;
                  }
                  .want-buy-sell-sum-content{
                    .sellGreen{
                      color: #30C296;
                    }
                    .buyOrange{
                      color: #E97345;
                    }
                    >.want-text{
                      color: #9DA5B3;
                      font-size: 12px;
                    }
                    >.max-sum{
                      /*color: #30C296;*/
                      font-size: 12px;
                      margin-right: 20px;
                    }
                    >.want-text{
                      color: #9DA5B3;
                      font-size: 12px;
                    }
                    >.market-price{
                      /*color: #30C296;*/
                      font-size: 12px;
                      margin-right: 20px;
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
                      vertical-align: top;
                      margin-left: -4px;
                      line-height: 36px;
                      text-align: center;
                      margin-right: 50px;
                    }
                  }
                  .volume-business{
                    margin-bottom: 10px;
                    >.sell-sum{
                      width: 130px;
                      height: 36px;
                      background-color: #333A41;
                      padding-left: 10px;
                      color: #9DA5B3;
                    }
                    >.max-sell-sum{
                      width: 180px;
                    }
                    >.monad{
                      width: 50px;
                      height: 36px;
                      background-color: #414951;
                      display: inline-block;
                      vertical-align: top;
                      margin-left: -4px;
                      line-height: 36px;
                      text-align: center;
                      color: #338FF5;
                      font-size: 12px;
                    }
                    >.range-line{
                      color: #fff;
                      width: 20px;
                      height: 36px;
                      display: inline-block;
                      text-align: center;
                      vertical-align: top;
                    }
                  }
                  .remark{
                    color: #9DA5B3;
                    font-size: 12px;
                    margin-top: -10px;
                  }
                  .predict{
                    >.predict-text{
                      color: #9FA7B2;
                      font-size: 12px;
                    }
                    >.predict-sum{
                      color: #30C296;
                      font-size: 12px;
                    }
                    >.rate-text{
                      color: #9FA7B2;
                      font-size: 12px;
                      >.rate{
                        color: #CA5040;
                        font-size: 12px;
                      }
                    }
                  }
                  .publish-submit{
                    >.publish-submit-button{
                      width: 589px;
                      height: 42px;
                      color: #FFFFFF;
                      font-size: 14px;
                      border-radius:4px;
                      margin-top: 40px;
                      cursor: pointer;
                    }
                    >.publish-submit-buy{
                      background-color: #D45858;
                    }
                    >.publish-submit-sell{
                      background-color: #008069;
                    }
                  }
                }
            }
            >.publish-content-right{
                flex: 1;
                >.release-notes{
                    width: 216px;
                    color: #8C8E91;
                    font-size: 12px;
                    >.release-title{
                        color: #9FA7B2;
                    }
                    >.release-tips{
                        line-height: 1.5rem;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>
