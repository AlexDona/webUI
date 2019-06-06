<template>
  <!--币币交易-买卖单-->
  <div
    class="buys-and-sells-box trade"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div
      class="inner-box"
    >
      <div
        class="title font-size16 cursor-pointer"
      >
        <span
          class="text"
          @click="toggleShowContent"
        >
          <span>
            <!--买卖单-->
            {{ $t('M.trade_coin_buying_and_sell') }}
          </span>
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
                  <!--累计-->
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
                  >
                  </dd>
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
                      {{$scientificToNumber($cutOutPointLength(item.progressiveTotal, $middleTopData_S_X.priceExchange))}}
                    </span><!--宽度条--><i
                        class="color-sell-bg"
                        :style="`width:${item.progressiveTotal/buysAndSellsList.sells.list[0].progressiveTotal * 100}%`"
                      >
                      </i>
                      <!--:style="`width:${item.amount/buysAndSellsList.sells.highestAmount*100}%`"-->
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
                        {{$scientificToNumber(item.progressiveTotal)}}
                      </span><!--宽度条--><i
                          class="color-buy-bg"
                          :style="`width:${item.progressiveTotal/buysAndSellsList.buys.list[buysAndSellsList.buys.list.length - 1].progressiveTotal * 100}%`"
                        >
                        </i>
                      <!--:style="`width:${item.amount/buysAndSellsList.buys.highestAmount*100}%`"-->
                    </div>
                  </dd>
              </dl>
              </div>
            </div>
            <!--小数位选择-->
            <div class="bits">
              <div class="left-select">
                <div class="parent">
                  <select
                    v-model="checkedBits"
                    @change="changeBits"
                    class="select-bits"
                  >
                    <option
                      disabled
                      value=""
                      selected
                      v-if="bitsData.length == 0"
                    >
                      --
                    </option>
                    <option
                      v-for="(item, index) in bitsData"
                      :key="index"
                      :label="currentLanguage? item.chineseName : item.englishName"
                      :value="item.id"
                    >
                    </option>
                  </select>
                  <!--改写小三角-->
                  <div class="triangle"></div>
                </div>
              </div>
              <div class="right-filter">
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
      listOrder: 'middle', // 切换显示顺序
      // 交易对深度小数位下拉框展示数组
      bitsData: [],
      // 买卖单部分选中的小数位
      checkedBits: '',
      // 国家语言类型
      languageStyle: ['zh_CN', 'zh_TW']
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
      'CHANGE_ACTIVE_PRICE_ITEM',
      // 改变全局存储的选中的小数位值的方法
      'CHANGE_CHECKED_BITS'
    ]),
    // 切换小数位下拉框
    changeBits (e) {
      // console.log(e.target.value)
      // 将选中的小数位值放全局
      this.CHANGE_CHECKED_BITS(e.target.value)
    },
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
      buysAndSellsListByAjax: state => state.common.klineAjaxData.buyAndSellData,
      buysAndSellsListBySocket: state => state.common.socketData.buyAndSellData,
      socketSymbol: state => state.common.socketData.symbol,
      // 监控接口中返回的小数位数据对象
      depthDecimalByAjax: state => state.common.klineAjaxData.depthDecimal,
      // 获取当前语言
      language: state => state.common.language
    }),
    buysAndSellsList () {
      return !this.isSameSymbol || !this.reflashCount ? this.buysAndSellsListByAjax : this.buysAndSellsListBySocket
    },
    sellsListLength () {
      return (getNestedData(this.buysAndSellsList, 'sells.list') || []).length
    },
    isSameSymbol () {
      const {id} = this.$middleTopData_S_X
      return this.socketSymbol === id
    },
    // 当前语言判断是否中文或者繁体
    currentLanguage () {
      return this.language == this.languageStyle[0] || this.language == this.languageStyle[1]
    }
  },
  watch: {
    // 监控小数位数据对象
    depthDecimalByAjax (newVal) {
      this.bitsData = []
      this.bitsData = newVal.list
      this.bitsData.forEach(item => {
        if (item.englishName.indexOf('+') !== -1) {
          item.englishName = item.englishName.replace('+', ' ')
        }
      })
      this.bitsData.forEach((item, index) => {
        if (newVal.defaultIndex === index) {
          this.checkedBits = item.id
        }
      })
    },
    $activeSymbol_S_X () {
      this.reflashCount = 0
    },
    buysAndSellsListBySocket: {
      handler (newVal) {
        // console.log(this.isSameSymbol, newVal)
        if (this.isSameSymbol && !this.reflashCount && newVal) {
          this.CHANGE_ACTIVE_PRICE_ITEM(newVal.latestDone.price)
          this.reflashCount += 1
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';
@import '../../../static/css/scss/Trade/TradeCenter.scss';

.buys-and-sells-box {
  > .inner-box {
    > .title {
      display: flex;
      height: 34px;
      padding: 0 4.5%;
      margin-bottom: 1px;
      line-height: 34px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, .1);

      > .text {
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
            > span {
              display: inline-block;
              box-sizing: border-box;
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
            transition: all .5s;

            > .buys-list,
            .sells-list {
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

        > .bits {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 36px;
          padding: 0 10px;

          .left-select {
            .select-bits {
              -moz-appearance: none;
              -webkit-appearance: none;
              appearance: none;
              box-sizing: border-box;
              width: 82px;
              height: 22px;
              padding-left: 10px;
              outline: none;
              font-size: 12px;
            }

            .parent {
              position: relative;
              display: inline-block;

              .triangle {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 0;
                height: 0;
                border-width: 4px;
                border-style: solid dashed dashed;
                overflow: hidden;
                font-size: 0;
                line-height: 0;
              }
            }
          }

          .right-filter {
            /* 买卖单顺序操作按钮 */
            > .right {
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

          > .bits {
            .left-select {
              .select-bits {
                border: 1px solid #464c5e;
                color: #848a9d;
                background-color: #1c1f32;
              }

              .parent {
                .triangle {
                  border-color: #848a9d transparent transparent;
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

          > .bits {
            .left-select {
              .select-bits {
                border: 1px solid #c4c4c4;
                color: #848a9d;
                background-color: #fff;
              }

              .parent {
                .triangle {
                  border-color: #848a9d transparent transparent;
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
