<template>
  <!--币币交易-买卖单-->
  <div
    class="buys-and-sells-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="inner-box"
    >
      <div
        class="title font-size16 cursor-pointer"
      >
        <span
          class="text"
          @click="toggleShowContent">
          <span>
            <!--买卖单-->
            {{ $t('M.trade_coin_buying_and_sell') }}
          </span>
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
      <div
        class="content"
        v-if="buysAndSellsList&&buysAndSellsList.buys.list"
      >
        <el-collapse-transition>
          <div
            v-show="contentShowStatus"
            class="inner-box"
          >
            <dl class="title-box">
              <dt class="header">
                <span class="buy-and-sell-index">
                  index
                </span><span class="price text-align-l">
                  <!--价格-->
                  {{ $t('M.comm_price_metre') }}({{activeSymbol.area}})
                </span><span class="amount text-align-c">
                  <!--数量-->
                  {{ $t('M.comm_count') }}
                  <span class="uppercase">（{{activeSymbol.sellsymbol}}）</span>
                </span><span class="total text-align-r">
                  <!--总计-->
                  {{ $t('M.comm_aggregate') }}
                  <span class="uppercase">({{activeSymbol.area}})</span>
                </span>
              </dt>
            </dl>
            <!--buys、sells-->
              <div class="outer-box">
                <div
                  ref="buy-box"
                  class="middle-box content-box"
                >
                  <!--卖出-->
                  <dl
                    class="buys-list"
                  >
                    <dd
                      :style="{
                        height:(20-buysAndSellsList.sells.list.length || 0)*30+'px'
                      }"
                      v-if="listOrder==='middle'"
                    ></dd>
                    <dd
                      class="buys-item cursor-pointer item"
                      v-for="(item,index) in buysAndSellsList.sells.list||[]"
                      :key="index"
                      :class="{'odd':index%2!==0}"
                      @click="changeActivePriceItem(item)"
                    >
                      <div class="inner">
                        <span class="price sell-bg">
                          <!--卖-->
                          {{ $t('M.comm_ask') }} {{item.index}}
                        </span><span
                        class="price text-align-l sell-bg"
                      >
                        {{item.price}}
                      </span><span class="amount text-align-r">
                        {{item.amount}}
                      </span><span class="total text-align-r">
                        {{item.total}}
                      </span><!--宽度条--><i
                          class="color-sell-bg"
                          :style="'width:'+ item.amount/buysAndSellsList.sells.highestAmount*100+'%'"
                        >
                        </i>
                      </div>
                    </dd>
                  </dl>
                  <!--最新价-->
                  <TradeNewPrice/>
                  <!--买入-->
                  <dl
                  class="sells-list"
                >
                  <dd
                    class="sells-item cursor-pointer item"
                    v-for="(item,index) in buysAndSellsList.buys.list"
                    :key="index"
                    :class="{'even':index%2==0}"
                    @click="changeActivePriceItem(item)"
                  >
                    <div class="inner">
                      <span class="price buy-bg">
                        <!--买-->
                        {{ $t('M.comm_bid') }} {{item.index}}
                      </span><span class="price text-align-l buy-bg">
                        {{item.price}}
                      </span><span class="amount text-align-r">
                        {{item.amount}}
                      </span><span class="total text-align-r">
                        {{item.total}}
                      </span><!--宽度条--><i
                          class="color-buy-bg"
                          :style="'width:'+ item.amount/buysAndSellsList.buys.highestAmount*100+'%'"
                        >
                        </i>
                    </div>
                  </dd>
                </dl>
                </div>
              </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import TradeNewPrice from './TradeNewPrice'
import {
  createNamespacedHelpers,
  mapState
} from 'vuex'
const { mapMutations } = createNamespacedHelpers('trade')
export default {
  components: {
    TradeNewPrice
  },
  // props,
  data () {
    return {
      // buysAndSellsList: [], // 过滤过的渲染列表
      contentShowStatus: true,
      // 买卖数据列表
      buysAndsells: {},
      reflashCount: 0, // 买卖单数据刷新次数
      // 显示顺序(buys,middle,sells)
      listOrder: 'middle' // 切换显示顺序
    }
  },
  created () {
  },
  mounted () {
    // console.log(this.buysAndSellsList)
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVE_PRICE_ITEM'
    ]),
    // 选中某一个买卖单价格
    changeActivePriceItem (item) {
      this.CHANGE_ACTIVE_PRICE_ITEM(item.price)
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 切换显示顺序
    changeListOrder (firstName) {
      // console.log(this.$refs['buy-box'].style.marginTop = '200px')
      let targetMarginTop = 0
      switch (firstName) {
        case 'middle':
          this.listOrder = 'middle'
          targetMarginTop = -300
          break
        case 'sells':
          this.listOrder = 'buys'
          targetMarginTop = 0
          break
        case 'buys':
          this.listOrder = 'sells'
          targetMarginTop = -600
          break
      }
      this.$refs['buy-box'].style.marginTop = `${targetMarginTop}px`
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      socketData: state => state.common.socketData,
      middleTopData: state => state.trade.middleTopData,
      klineAjaxData: state => state.common.klineAjaxData,
      depthData: state => state.common.klineAjaxData.depthData,
      buysAndSellsListByAjax: state => state.common.klineAjaxData.buyAndSellData,
      buysAndSellsListBySocket: state => state.common.socketData.buyAndSellData,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id
    }),
    buysAndSellsList () {
      // console.log(this.buysAndSellsListByAjax)
      // console.log(this.buysAndSellsListBySocket)
      return !this.reflashCount ? this.buysAndSellsListByAjax : this.buysAndSellsListBySocket
    }
  },
  watch: {
    klineAjaxData (newVal) {
      // console.log(newVal)
    },
    socketData (newVal) {
      // console.log(newVal)
    },
    middleTopData (newVal) {
      // console.log(newVal)
    },
    activeSymbolId (newVal) {
      // console.log(newVal)
      this.reflashCount = 0
    },
    buysAndSellsList (newVal) {
      // console.log(newVal)
    },
    buysAndSellsListByAjax (newVal) {
      // console.log(newVal)
      // console.log(this.reflashCount)
      // this.buysAndSellsListByAjax = this.buysAndSellsList
    },
    buysAndSellsListBySocket: {
      handler (newVal) {
        console.log(newVal)
        if (!this.reflashCount && newVal) {
          // console.log(newVal)
          this.CHANGE_ACTIVE_PRICE_ITEM(newVal.latestDone.price)
          this.reflashCount++
        }
      },
      deep: true
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
        margin-bottom: 1px;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        display: flex;
        padding:0 4.5%;
        > .text {
          flex:1;
          /*font-weight: 700;*/
          display: inline-block;
          height: 100%;
          >span{
            text-indent: 4px;
            display: inline-block;
            height: 100%;
            border-bottom: 2px solid $mainColor;
            color:$mainColor;
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
            height:30px;
            line-height:30px;
            padding:0 4.5%;
            position: relative;
            z-index: 2;
            .header{
              /*display:flex;*/
              >span{
                /*flex:1;*/
                width:29%;
                white-space:nowrap;
                &:nth-of-type(1){
                  width:13%;
                  text-align: left;
                  white-space:nowrap;
                }
                text-align: right;
                /*border:1px solid red;*/
                display:inline-block;
                box-sizing: border-box;
                &.buy-and-sell-index{
                  color: transparent;
                }
              }
            }
          }
          >.outer-box{
            overflow: hidden;
            height:650px;
            >.content-box{
              height:650px;
              /*background-color: pink;*/
              transition: all 0.5s;
              margin-top:-300px;
              >.buys-list,.sells-list{
                font-size: 12px;
                /*padding:0 20px;*/
                height:600px;
                >dd{
                  height: 30px;
                  line-height: 30px;
                  >.inner{
                    padding:0 4.5%;
                    position: relative;
                    z-index: 1;
                    >.buy-bg{
                      color:$upColor;
                    }
                    >.sell-bg{
                      color:$downColor;
                    }
                    >span{
                      width:29%;
                      &:nth-of-type(1){
                        width:13%;
                        white-space:nowrap;
                        text-align: left;
                      }
                      text-align: right;
                      /*border:1px solid red;*/
                      display:inline-block;
                      box-sizing: border-box;
                    }
                    >.amount{
                      /*padding-right:18%;*/
                    }
                    >.color-buy-bg,>.color-sell-bg{
                      max-width:100%;
                      position: absolute;
                      right:0;
                      top:0;
                      height:30px;
                      z-index: 0;
                      opacity: 0.5;
                      transition: all 1.5s;
                    }
                    >.color-buy-bg{
                      background-color:rgba(212,88,88,0.4);
                    }
                    >.color-sell-bg{
                      background-color:rgba(0,128,105,0.4);
                    }
                  }
                }
              }
              /*最新价*/
              .new-price{
                height:50px;
                line-height:50px;
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
    }
    &.night {
      color: $nightFontColor;
      > .inner-box {
        > .title {
          background-color: $mainContentNightBgColor;
          box-shadow:2px 0px 3px rgba(27,35,49,1);
          > .text {
            >span{
            }
          }
          /*买卖单顺序操作按钮*/
          >.right{
            >button{
            }
            >.middle{
            }
            >.bottom{
            }
            >.top{
            }
          }
        }
        >.content {
          background-color: $mainContentNightBgColor;
          >.inner-box{
            /*表头*/
            >.title-box{
              .header{
                color:$mainNightTitleColor;
                >span{
                }
              }
            }
            >.outer-box{
              >.content-box{
                >.buys-list,.sells-list{
                  >.item{
                    &.odd,&.even{
                      background-color: #1a1d2f;
                    }
                    &:hover{
                      background-color:rgba(255, 255, 255, 0.2);
                    }
                    >.inner{
                      >span{
                      }
                      >.amount{
                      }
                      >.color-buy-bg,>.color-sell-bg{
                      }
                      >.color-buy-bg{
                      }
                      >.color-sell-bg{
                      }
                    }
                  }
                }
                /*最新价*/
                .new-price{
                }
                /*买入表*/
                >.buys-list{
                  &.height22{
                  }
                  >.buys-item{
                  }
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
          box-shadow:2px 0px 3px rgba(239,239,239,1);
          > .text {
            >span{
            }
          }
          /*买卖单顺序操作按钮*/
          >.right{
            >button{
            }
            >.middle{
            }
            >.bottom{
            }
            >.top{
            }
          }
        }
        >.content {
          background-color: #fff;
          >.inner-box{
            /*表头*/
            >.title-box{
              .header{
                >span{
                }
              }
            }
            >.outer-box {
              >.content-box{
                >.buys-list,.sells-list{
                  >dd{
                    &.odd,&.even,&:hover{
                      background-color: #f2f2f2;
                    }
                    >.inner{
                      >span{
                      }
                      >.amount{
                      }
                      >.color-buy-bg,>.color-sell-bg{
                      }
                      >.color-buy-bg{
                        background-color:rgba(212,88,88,0.8);
                      }
                      >.color-sell-bg{
                        background-color:rgba(0,128,105,0.8);
                      }
                    }
                  }
                }
                /*最新价*/
                .new-price{
                }
                /*买入表*/
                >.buys-list{
                  &.height22{
                  }
                  >.buys-item{
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
