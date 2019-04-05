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
        v-if="buysAndSellsList"
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
                  {{ $t('M.comm_price_metre') }}({{$middleTopData_S_X.area}})
                </span><span class="amount text-align-c">
                  <!--数量-->
                  {{ $t('M.comm_count') }}
                  <span class="uppercase">({{$middleTopData_S_X.sellsymbol}})</span>
                </span><span class="total text-align-r">
                  <!--总计-->
                  {{ $t('M.comm_aggregate') }}
                  <span class="uppercase">({{$middleTopData_S_X.area}})</span>
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
                        height:(20-sellsListLength)*30+'px'
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
                        {{$scientificToNumber(item.price)}}
                      </span><span class="amount text-align-r">
                        {{$scientificToNumber($cutOutPointLength(item.amount, $middleTopData_S_X.countExchange))}}
                      </span><span class="total text-align-r">
                        {{$scientificToNumber($cutOutPointLength(item.total, $middleTopData_S_X.priceExchange))}}
                      </span><!--宽度条--><i
                          class="color-sell-bg"
                          :style="`width:${item.amount/buysAndSellsList.sells.highestAmount*100}%`"
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
                        {{$scientificToNumber(item.price)}}
                      </span><span class="amount text-align-r">
                        {{$scientificToNumber(item.amount)}}
                      </span><span class="total text-align-r">
                        {{$scientificToNumber(item.total)}}
                      </span><!--宽度条--><i
                          class="color-buy-bg"
                          :style="`width:${item.amount/buysAndSellsList.buys.highestAmount*100}%`"
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
import {getNestedData} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    TradeNewPrice
  },
  // props,
  data () {
    return {
      // buysAndSellsList: [], // 过滤过的渲染列表
      contentShowStatus: true,
      reflashCount: 0, // 买卖单数据刷新次数
      // 显示顺序(buys,middle,sells)
      listOrder: 'middle' // 切换显示顺序
    }
  },
  created () {
  },
  mounted () {
  },
  activated () {},
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
      buysAndSellsListByAjax: state => state.common.klineAjaxData.buyAndSellData,
      buysAndSellsListBySocket: state => state.common.socketData.buyAndSellData
    }),
    buysAndSellsList () {
      return !this.reflashCount ? this.buysAndSellsListByAjax : this.buysAndSellsListBySocket
    },
    sellsListLength () {
      return (getNestedData(this.buysAndSellsList, 'sells.list') || []).length
    }
  },
  watch: {
    $activeSymbol_S_X () {
      this.reflashCount = 0
    },
    $middleTopData_S_X (newVal) {
      console.log(newVal)
    },
    buysAndSellsList (newVal) {
      // console.log(newVal)
    },
    buysAndSellsListByAjax (newVal) {
      // console.log(newVal)
    },
    buysAndSellsListBySocket: {
      handler (newVal) {
        // console.log(newVal)
        if (!this.reflashCount && newVal) {
          this.CHANGE_ACTIVE_PRICE_ITEM(newVal.latestDone.price)
          this.reflashCount += 1
        }
      },
      deep: true
    },
    reflashCount (newVal) {
      // console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';
@import '../../../static/css/scss/Trade/TradeCenter.scss';

.buys-and-sells-box {
  /* width:433px; */
  > .inner-box {
    > .title {
      display: flex;
      height: 34px;
      padding: 0 4.5%;
      margin-bottom: 1px;
      line-height: 34px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .1);

      > .text {
        /* font-weight: 700; */
        display: inline-block;
        flex: 1;
        height: 100%;

        > span {
          display: inline-block;
          height: 100%;
          border-bottom: 2px solid $mainColor;
          font-size: 14px;
          color: $mainColor;
        }
      }

      /* 买卖单顺序操作按钮 */
      > .right {
        flex: 1;
        text-align: right;

        > button {
          width: 28px;
          height: 20px;
          margin: 8px 0 0;
          background: url(../../assets/develop/middle.png) no-repeat center right;
          -webkit-background-size: 28px 20px;
          background-size: 16px 12px;
          cursor: pointer;
        }

        > .bottom {
          background-image: url(../../assets/develop/buys.png);
        }

        > .top {
          background-image: url(../../assets/develop/sells.png);
        }
      }
    }

    > .content {
      > .inner-box {
        /* 表头 */
        > .title-box {
          position: relative;
          z-index: 2;
          height: 30px;
          padding: 0 4.5%;
          line-height: 30px;

          .header {
            /* display:flex; */
            > span {
              /* border:1px solid red; */
              display: inline-block;
              box-sizing: border-box;

              /* flex:1; */
              width: 29%;
              text-align: right;
              white-space: nowrap;

              &:nth-of-type(1) {
                width: 13%;
                text-align: left;
                white-space: nowrap;
              }

              &.buy-and-sell-index {
                font-size: 0;
                color: transparent;
              }
            }
          }
        }

        > .outer-box {
          height: 650px;
          overflow: hidden;

          > .content-box {
            height: 650px;
            margin-top: -300px;

            /* background-color: pink; */
            transition: all .5s;

            > .buys-list,
            .sells-list {
              /* padding:0 20px; */
              height: 600px;
              font-size: 12px;

              > dd {
                height: 30px;
                line-height: 30px;

                > .inner {
                  position: relative;
                  z-index: 1;
                  padding: 0 4.5%;

                  > .buy-bg {
                    color: $upColor;
                  }

                  > .sell-bg {
                    color: $downColor;
                  }

                  > span {
                    /* border:1px solid red; */
                    display: inline-block;
                    box-sizing: border-box;
                    width: 29%;
                    text-align: right;

                    &:nth-of-type(1) {
                      width: 13%;
                      text-align: left;
                      white-space: nowrap;
                    }
                  }

                  > .amount {
                    /* padding-right:18%; */
                  }

                  > .color-buy-bg,
                  > .color-sell-bg {
                    position: absolute;
                    z-index: 0;
                    top: 0;
                    right: 0;
                    max-width: 100%;
                    height: 30px;
                    opacity: .5;
                    transition: all 1.5s;
                  }

                  > .color-buy-bg {
                    background-color: rgba(212, 88, 88, .4);
                  }

                  > .color-sell-bg {
                    background-color: rgba(0, 128, 105, .4);
                  }
                }
              }
            }

            /* 最新价 */
            .new-price {
              height: 50px;
              line-height: 50px;
            }

            /* 买入表 */
            > .buys-list {
              &.height22 {
                overflow: hidden;
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
        box-shadow: 2px 0 3px rgba(27, 35, 49, 1);
      }

      > .content {
        background-color: $mainContentNightBgColor;

        > .inner-box {
          /* 表头 */
          > .title-box {
            .header {
              color: $mainNightTitleColor;
            }
          }

          > .outer-box {
            > .content-box {
              > .buys-list,
              .sells-list {
                > .item {
                  &.odd,
                  &.even {
                    background-color: #1a1d2f;
                  }

                  &:hover {
                    background-color: rgba(255, 255, 255, .2);
                  }
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
        box-shadow: 2px 0 3px rgba(239, 239, 239, 1);
      }

      > .content {
        background-color: #fff;

        > .inner-box {
          > .outer-box {
            > .content-box {
              > .buys-list,
              .sells-list {
                > dd {
                  &.odd,
                  &.even,
                  &:hover {
                    background-color: #f2f2f2;
                  }

                  > .inner {
                    > .color-buy-bg {
                      background-color: rgba(212, 88, 88, .8);
                    }

                    > .color-sell-bg {
                      background-color: rgba(0, 128, 105, .8);
                    }
                  }
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
