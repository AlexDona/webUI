<template>
  <!--币币交易-买卖单-->
  <div
    class="buys-and-sells-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div
        class="title font-size16 cursor-pointer"
      >
        <span
          class="text"
          @click="toggleShowContent">
          <span>买卖单</span>
        </span>
        <span class="right">
          <button
            class="middle"
            @click="changeListOrder('middle')"
          ></button>
          <button
            class="bottom"
            @click="changeListOrder('buys')"
          ></button>
          <button
            class="top"
            @click="changeListOrder('sells')"
          ></button>
        </span>
      </div>
      <div class="content">
          <div
            v-show="contentShowStatus"
            class="inner-box"
          >
            <dl class="title-box">
              <dt class="header">
                <span class="price text-align-l">
                  价格(USDT)
                </span>
                <span class="amount text-align-c">
                  数量
                  <span class="uppercase">(btc)</span>
                </span>
                <span class="total text-align-r">
                  总计
                  <span class="uppercase">(btc)</span>
                </span>
              </dt>
            </dl>
            <!--buys、sells-->
            <div
              class="mibble-box content-box"
              v-if="listOrder==='middle'"
            >
              <!--买入-->
              <dl
                class="buys-list"
              >
                <dd
                  class="buys-item"
                  v-for="(item,index) in buysAndSellsList.buys.list.slice(0,9)"
                  :key="index"
                  :class="{'odd':index%2!==0}"
                >
                  <div class="inner">
                  <span class="price text-align-l">
                    {{item.price}}
                  </span>
                    <span class="amount text-align-r">
                    {{item.amount}}
                  </span>
                    <span class="total text-align-r">
                    {{item.total}}
                  </span>
                    <!--宽度条-->
                    <i
                      class="color-buy-bg"
                      :style="'width:'+ item.amount/buysAndSellsList.buys.highestAmount*100+'%'"
                    >
                    </i>
                  </div>
                </dd>
              </dl>
              <!--最新价-->
              <dl class="new-price">
                <dt class="text-align-c font-size16">
                  <span>{{buysAndSellsList.latestDone.price}}</span>
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose>0"
                    iconName="icon-down"
                  />
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose<0"
                    iconName="icon-up"
                  />
                </dt>
              </dl>
              <!--卖出-->
              <dl
                class="sells-list"
              >
                <dd
                  class="sells-item"
                  v-for="(item,index) in buysAndSellsList.sells.list.slice(0,9)"
                  :key="index"
                  :class="{'even':index%2==0}"
                >
                  <div class="inner">
                  <span class="price text-align-l">
                    {{item.price}}
                  </span>
                    <span class="amount text-align-r">
                    {{item.amount}}
                  </span>
                    <span class="total text-align-r">
                    {{item.total}}
                  </span>
                    <!--宽度条-->
                    <i
                      class="color-sell-bg"
                      :style="'width:'+ item.amount/buysAndSellsList.buys.highestAmount*100+'%'"
                    >
                    </i>
                  </div>
                </dd>
              </dl>
            </div>
            <!--buys-->
            <div
              class="mibble-box content-box"
              v-if="listOrder==='buys'"
            >
              <!--最新价-->
              <dl class="new-price">
                <dt class="text-align-c font-size16">
                  <span>{{buysAndSellsList.latestDone.price}}</span>
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose>0"
                    iconName="icon-down"
                  />
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose<0"
                    iconName="icon-up"
                  />
                </dt>
              </dl>
              <!--买入-->
              <dl
                class="buys-list"
              >
                <dd
                  class="buys-item"
                  v-for="(item,index) in buysAndSellsList.buys.list.slice(0,19)"
                  :key="index"
                  :class="{'odd':index%2!==0}"
                >
                  <div class="inner">
                  <span class="price text-align-l">
                    {{item.price}}
                  </span>
                    <span class="amount text-align-r">
                    {{item.amount}}
                  </span>
                    <span class="total text-align-r">
                    {{item.total}}
                  </span>
                    <!--宽度条-->
                    <i
                      class="color-buy-bg"
                      :style="'width:'+ item.amount/buysAndSellsList.buys.highestAmount*100+'%'"
                    >
                    </i>
                  </div>
                </dd>
              </dl>
            </div>
            <!--sells-->
            <!--<el-collapse-transition>-->
              <div
              class="mibble-box content-box"
              v-if="listOrder==='sells'"
            >
              <!--最新价-->
              <dl class="new-price">
                <dt class="text-align-c font-size16">
                  <span>{{buysAndSellsList.latestDone.price}}</span>
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose>0"
                    iconName="icon-down"
                  />
                  <IconFontCommon
                    v-show="buysAndSellsList.latestDone.rose<0"
                    iconName="icon-up"
                  />
                </dt>
              </dl>
              <!--卖出-->
              <dl
                class="sells-list"
              >
                <dd
                  class="sells-item"
                  v-for="(item,index) in buysAndSellsList.sells.list.slice(0,19)"
                  :key="index"
                  :class="{'even':index%2==0}"
                >
                  <div class="inner">
                  <span class="price text-align-l">
                    {{item.price}}
                  </span>
                    <span class="amount text-align-r">
                    {{item.amount}}
                  </span>
                    <span class="total text-align-r">
                    {{item.total}}
                  </span>
                    <!--宽度条-->
                    <i
                      class="color-sell-bg"
                      :style="'width:'+ item.amount/buysAndSellsList.buys.highestAmount*100+'%'"
                    >
                    </i>
                  </div>
                </dd>
              </dl>
            </div>
            <!--</el-collapse-transition>-->
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import IconFontCommon from '../Common/IconFontCommon'
import {
  // createNamespacedHelpers,
  mapState
} from 'vuex'
// const { mapMutations } = createNamespacedHelpers('common')
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // buysAndSellsList: [], // 过滤过的渲染列表
      contentShowStatus: true,
      // 买卖数据列表
      buysAndsells: {},
      // 显示顺序(buys,middle,sells)
      listOrder: 'middle' // 切换显示顺序
    }
  },
  created () {
    // this.buysAndSellsList = {
    //   buys: {
    //     highestAmount: 0.1560, // 最高量
    //     list: [
    //       {
    //         id: 0,
    //         price: 6303.57,
    //         amount: 0.1560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 1,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 2,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 3,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 4,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 5,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 6,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 7,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 8,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 9,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       }
    //     ]
    //   },
    //   sells: {
    //     highestAmount: 0.0923,
    //     list: [
    //       {
    //         id: 0,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 1,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 2,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 3,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 4,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 5,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 6,
    //         price: 1309.57,
    //         amount: 0.0923,
    //         total: 4.2123
    //       },
    //       {
    //         id: 7,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 8,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       },
    //       {
    //         id: 9,
    //         price: 6303.57,
    //         amount: 0.0560,
    //         total: 1.2617
    //       }
    //     ]
    //   },
    //   // 最新成交
    //   latestDone: {
    //     price: 0.4423415, // 价格
    //     rose: 1.5 // 涨跌
    //   }
    // }
  },
  mounted () {
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 切换显示顺序
    changeListOrder (firstName) {
      switch (firstName) {
        case 'middle':
          this.listOrder = 'middle'
          break
        case 'buys':
          this.listOrder = 'buys'
          break
        case 'sells':
          this.listOrder = 'sells'
          break
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      socketData: state => state.common.socketData,
      depthData: state => state.common.socketData.depthData,
      buysAndSellsList: state => state.common.socketData.buyAndSellData
    })
  },
  watch: {
    depthData (newVal) {
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter.scss';
  .buys-and-sells-box {
    /*width:433px;*/
    > .inner-box {
      > .title {
        height: 34px;
        line-height: 34px;
        margin-bottom: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        display: flex;
        > .text {
          flex:1;
          font-weight: 700;
          display: inline-block;
          height: 100%;
          >span{
            text-indent: 4px;
            display: inline-block;
            height: 100%;
            border-bottom: 2px solid $mainColor;
          }
        }
        /*买卖单顺序操作按钮*/
        >.right{
          flex:1;
          text-align: right;
          >button{
            cursor:pointer;
            width:28px;
            height:20px;
            margin:8px 8px 0 0;
            -webkit-background-size: 28px 20px;
            background-size: 28px 20px;
            background: url(../../assets/develop/middle.png) no-repeat center center;
          }
          >.middle{
          }
          >.bottom{
            background-image: url(../../assets/develop/buys.png);
          }
          >.top{
            background-image: url(../../assets/develop/sells.png);
          }
        }
      }
      >.content {
        >.inner-box{
          /*表头*/
          >.title-box{
            height:36px;
            line-height:36px;
            padding:0 4px;
            position: relative;
            z-index: 2;
            .header{
              display:flex;
              >span{
                flex:1;
              }
            }
          }
          >.content-box{
            >.buys-list,.sells-list{
              font-size: 12px;
              padding:0 4px;
              >dd{
                height: 24px;
                line-height: 24px;
                >.inner{
                  display: flex;
                  >span{
                    flex:1;
                  }
                  >.amount{
                    padding-right:18%;
                  }
                  position: relative;
                  z-index: 1;
                  >.color-buy-bg,>.color-sell-bg{
                    max-width:100%;
                    position: absolute;
                    right:0;
                    top:1px;
                    height:22px;
                    z-index: 0;
                    opacity: .1;
                  }
                  >.color-buy-bg{
                    background-color:$upColor;
                  }
                  >.color-sell-bg{
                    background-color:$downColor;
                  }
                }
              }
            }
            /*最新价*/
            .new-price{
              height:38px;
              line-height:38px;
            }
            /*买入表*/
            >.buys-list{
              &.height22{
                overflow: hidden;
              }
              >.buys-item{
              }
            }
          }
        }
      }
    }
    &.night {
      > .inner-box {
        > .title {
          color: $nightMainTitleColor;
          background-color: $nightMainTitleBgColor;
        }
        > .content {
          background-color: $nightMainContentBgColor;
          >.inner-box{
            /*表头*/
            >.title-box{
              .header{
                >span{
                }
              }
            }
            >.buys-list,.sells-list{
              >dd{
                >.inner{
                  >span{
                  }
                }
              }
            }
            /*最新价*/
            .new-price{
            }
            /*买入表*/
            >.buys-list{
              >.buys-item{
                &.odd{
                  background-color: #182128;
                }
              }
            }
            >.sells-list{
              >.sells-item{
                &.even{
                  background-color: #182128;
                }
              }
            }
          }
        }
      }
    }
    &.day {
      > .inner-box {
        > .title {
          color: $dayMainTitleColor;
          background-color: $dayMainBgColor;
        }
        > .content {
          background-color: #fff;
          >.inner-box{
            /*表头*/
            >.title-box{
              .header{
                >span{
                }
              }
            }
            >.buys-list,.sells-list{
              >dd{
                >.inner{
                  >span{
                  }
                }
              }
            }
            /*最新价*/
            .new-price{
            }
            /*买入表*/
            >.buys-list{
              >.buys-item{
                &.odd{
                  background-color: #f2f2f2;
                }
              }
            }
            >.sells-list{
              >.sells-item{
                &.even{
                  background-color: #f2f2f2;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
