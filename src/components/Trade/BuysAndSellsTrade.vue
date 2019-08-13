<!--
  author: zhaoxinlei
  update: 20190801
  description: 当前页面为 币币交易 买卖单列表页面 主页面
-->
<template lang="pug">
  .buys-and-sells-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .inner-box
      .title.font-size16
        span.text
          // 买卖单
          span {{$t('M.trade_coin_buying_and_sell')}}
      .content(v-if="buysAndSellsList")
        .inner-box
          dl.title-box
            // 表头
            dt.header.font-size12
              span.buy-and-sell-index index
              // 价格
              span.price.text-align-l  {{ $t('M.comm_price_metre') }}({{$middleTopData_S_X.area}})
              // 数量
              span.amount.text-align-c {{ $t('M.comm_count') }}
                span.uppercase ({{$middleTopData_S_X.sellsymbol}})
              // 累计:合计改为累计后，括号中的单位要和前面的数量保持一致
              span.total.text-align-r {{ $t('M.comm_aggregate') }}
                span.uppercase ({{$middleTopData_S_X.sellsymbol}})
          //buys、sells
          .outer-box
            .middle-box.content-box(:style="{marginTop: `${targetMarginTop}px`}")
              //  卖出
              dl.buys-list
                dd(
                  :style="{height:(20-sellsListLength)*22+'px'}"
                  v-if="listOrder==='middle'"
                )
                dd.buys-item.cursor-pointer.item(
                  v-for="(item,index) in buysAndSellsList.sells.list||[]"
                  :class="{'odd':index%2!==0}"
                  @click="changeActivePriceItem(item)"
                )
                  .inner
                    // 卖
                    span.price.sell-bg {{ $t('M.comm_ask') }} {{item.index}}
                    span.price.text-align-l.sell-bg {{$scientificToNumber(item.price)}}
                    span.amount.text-align-r {{$scientificToNumber($cutOutPointLength(item.amount, $middleTopData_S_X.countExchange))}}
                    span.total.text-align-r {{$scientificToNumber($cutOutPointLength(item.progressiveTotal, $middleTopData_S_X.priceExchange))}}
                    i.color-sell-bg(:style="`width:${item.progressiveTotal/buysAndSellsList.sells.list[0].progressiveTotal * 100}%`")
              // 最新价
              TradeNewPrice
              dl.sells-list
                dd.sells-item.cursor-pointer.item(
                  v-for="(item,index) in buysAndSellsList.buys.list"
                  :class="{'even':index%2==0}"
                  @click="changeActivePriceItem(item)"
                )
                  .inner
                    // 买
                    span.price.buy-bg {{ $t('M.comm_bid') }} {{item.index}}
                    span.price.text-align-l.buy-bg {{$scientificToNumber(item.price)}}
                    span.amount.text-align-r {{$scientificToNumber(item.amount)}}
                    span.total.text-align-r {{$scientificToNumber(item.progressiveTotal)}}
                    i.color-buy-bg(:style="`width:${item.progressiveTotal/buysAndSellsList.buys.list[buysAndSellsList.buys.list.length - 1].progressiveTotal * 100}%`")
          // 小数位选择
          .bits
            .left-select
              .parent
                span.active-bit.cursor-pointer(
                  @click="toggleShowBits"
                  :ref="activeBitsRef"
                ) {{currentLanguage ? activeBits.chineseName : activeBits.englishName}}
                ul.select-bits(v-show="isShowBits")
                  li.option-item(
                    v-for="(item, index) in bitsData"
                    :label="currentLanguage? item.chineseName : item.englishName"
                    :value="item.id"
                    @click.stop="changeBits(item)"
                  )
                    span {{currentLanguage? item.chineseName : item.englishName}}
                // 改写小三角
                .triangle
            .right-filter
              span.right
                button.middle(@click="changeListOrder('middle')")
                button.bottom(@click="changeListOrder('buys')")
                button.top(@click="changeListOrder('sells')")
</template>
<script>
import TradeNewPrice from './TheTradeNewPrice'
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
      reflashCount: 0, // 买卖单数据刷新次数
      // 显示顺序(buys,middle,sells)
      listOrder: 'middle', // 切换显示顺序
      // 交易对深度小数位下拉框展示数组
      bitsData: [],
      // 买卖单部分选中的小数位
      checkedBits: '',
      // 当前选中小数位
      activeBits: {},
      // 国家语言类型
      languageStyle: ['zh_CN', 'zh_TW'],
      // 买单margin-top
      targetMarginTop: -220,
      isShowBits: false,
      activeBitsRef: 'active-bits-ref'
    }
  },
  // created () {
  // },
  mounted () {
    document.addEventListener('click', (e) => {
      if (e.target == this.$refs[this.activeBitsRef]) return
      this.isShowBits = false
    })
  },
  // activated () {},
  // update () {
  // },
  // beforeRouteUpdate () {
  // },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVE_PRICE_ITEM',
      // 改变全局存储的选中的小数位值的方法
      'CHANGE_CHECKED_BITS'
    ]),
    toggleShowBits () {
      this.isShowBits = !this.isShowBits
    },
    // 切换小数位下拉框
    changeBits (item) {
      this.activeBits = item
      // 将选中的小数位值放全局
      this.CHANGE_CHECKED_BITS(item.id)
      this.isShowBits = false
    },
    // 选中某一个买卖单价格
    changeActivePriceItem (item) {
      this.CHANGE_ACTIVE_PRICE_ITEM(item.price)
    },
    // 切换显示顺序
    changeListOrder (firstName) {
      // console.log(this.$refs['buy-box'].style.marginTop = '200px')
      this.targetMarginTop = 0
      switch (firstName) {
        case 'middle':
          this.listOrder = 'middle'
          this.targetMarginTop = -220
          break
        case 'sells':
          this.listOrder = 'buys'
          this.targetMarginTop = 0
          break
        case 'buys':
          this.listOrder = 'sells'
          this.targetMarginTop = -440
          break
      }
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
          this.activeBits = item
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
@import '../../assets/CSS/index';

.buys-and-sells-box {
  > .inner-box {
    > .title {
      display: flex;
      height: 34px;
      padding: 0 8px;
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
          font-size: 14px;
          color: #fff;
        }
      }
    }

    > .content {
      > .inner-box {
        /* 表头 */
        > .title-box {
          position: relative;
          z-index: 2;
          height: 28px;
          padding: 0 8px;
          line-height: 28px;

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
          height: 470px;
          overflow: hidden;

          > .content-box {
            height: 440px;
            margin-top: -340px;
            transition: all .5s;

            > .buys-list,
            .sells-list {
              height: 440px;
              font-size: 12px;

              > dd {
                height: 22px;
                line-height: 22px;

                > .inner {
                  position: relative;
                  z-index: 1;
                  padding: 0 8px;
                  color: #d9e1f1;

                  > .buy-bg {
                    color: #f03e3e;
                  }

                  > .sell-bg {
                    color: #41b37d;
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
                    height: 22px;
                    opacity: .5;
                    transition: all 1.5s;
                  }

                  > .color-buy-bg {
                    background: rgba(212, 88, 88, .3);
                  }

                  > .color-sell-bg {
                    background: rgba(0, 128, 105, .3);
                  }
                }
              }
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
          height: 28px;
          padding: 0 10px;

          .left-select {
            .select-bits {
              position: absolute;
              z-index: 9999;
              top: 19px;
              left: 0;
              box-sizing: border-box;
              min-width: 76px;
              height: 22px;
              border-radius: 2px;
              font-size: 12px;

              .option-item {
                box-sizing: border-box;
                height: 20px;
                padding-left: 10px;
                font-size: 12px;
                line-height: 20px;
                cursor: pointer;
              }
            }

            .parent {
              position: relative;
              display: inline-block;

              .active-bit {
                display: inline-block;
                box-sizing: border-box;
                min-width: 76px;
                height: 18px;
                padding: 0 10px;
                border: 1px solid rgba(62, 65, 84, 1);
                font-size: 12px;
              }

              .triangle {
                position: absolute;
                top: 8px;
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
      background-color: #1c1f32;

      > .title {
        background-color: #23273c;
      }

      > .content {
        background-color: #1c1f32;

        > .inner-box {
          /* 表头 */
          > .title-box {
            .header {
              color: #66718f;
            }
          }

          > .outer-box {
            > .content-box {
              > .buys-list,
              .sells-list {
                > .item {
                  &:hover {
                    background-color: rgba(255, 255, 255, .1);
                  }
                }
              }
            }
          }

          > .bits {
            .left-select {
              .active-bit {
                border: 1px solid #3e4154;
                color: #fff;
              }

              .select-bits {
                color: #d9e1f1;
                background-color: #1c1f32;
                box-shadow: 0 0 6px 0 rgba(20, 22, 35, 1);

                .option-item {
                  color: #fff;
                  background: #23273c;

                  &:hover {
                    color: $mainColor;
                    background-color: #2c3046;
                  }
                }
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
        background-color: #f2f6fa;

        > .text {
          > span {
            color: #333;
          }
        }
      }

      > .content {
        background-color: #fff;

        > .inner-box {
          /* 表头 */
          > .title-box {
            .header {
              color: #66718f;
            }
          }

          > .outer-box {
            > .content-box {
              > .buys-list,
              .sells-list {
                > dd {
                  &:hover {
                    background-color: #f2f2f2;
                  }

                  > .inner {
                    color: #66718f;

                    > .color-buy-bg {
                      background-color: rgba(212, 88, 88, .8);
                    }

                    > .color-sell-bg {
                      background: rgba(0, 128, 105, .3);
                    }
                  }
                }
              }
            }
          }

          > .bits {
            .left-select {
              .active-bit {
                border: 1px solid #cfd5df;
                color: #596a7a;
              }

              .select-bits {
                color: #596a7a;
                background-color: #fff;
                box-shadow: 0 0 6px 0 rgba(198, 206, 220, 1);

                .option-item {
                  color: #596a7a;
                  background: #fff;

                  &:hover {
                    color: $mainColor;
                    background-color: #e5ecf4;
                  }
                }
              }

              .parent {
                .triangle {
                  border-color: #596a7a transparent transparent;
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
