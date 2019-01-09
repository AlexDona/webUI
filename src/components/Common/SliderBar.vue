<template>
  <div class="slider-box clearfloat cursor-pointer">
    <!-- 限价买-->
    <div
      class="inner-box"
      v-if="className ==='limit-buy'"
    >
      <div class="slider">
        <section
          data-title="Custom Label"
          :class="className"
        >
          <Slider
            v-model="slider.limitBuySliderValue"
            v-bind="slider"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @callback="dragCallback"
            v-if="!isSymbolChanged"
          >
            <template
              slot="label"
              slot-scope="{ label, active }"
            >
              <span
                :class="['custom-label', { active }]"
                v-if="label % 25 === 0"
              >
                {{ label }}
              </span>
            </template>
          </Slider>
        </section>
      </div><span class="rate">{{slider.limitBuySliderValue}}%</span>
    </div>
    <!--限价卖-->
    <div
      class="inner-box"
      v-if="className ==='limit-sell'"
    >
      <div class="slider">
        <section
          data-title="Custom Label"
          :class="className"
        >
          <Slider
            v-model="slider.limitSellSliderValue"
            v-bind="slider"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @callback="dragCallback"
            v-if="!isSymbolChanged"
          >
            <template
              slot="label"
              slot-scope="{ label, active }"
            >
              <span
                :class="['custom-label', { active }]"
                v-if="label % 25 === 0"
              >
                {{ label }}
              </span>
            </template>
          </Slider>
        </section>
      </div><span class="rate">{{slider.limitSellSliderValue}}%</span>
    </div>
    <!--市价买-->
    <div
      class="inner-box"
      v-if="className ==='market-buy'"
    >
      <div class="slider">
        <section
          data-title="Custom Label"
          :class="className"
        >
          <Slider
            v-model="slider.marketBuySliderValue"
            v-bind="slider"
            @drag-start="dragStart"
            @drag-end="dragEnd"
            @callback="dragCallback"
            v-if="!isSymbolChanged"
          >
            <template
              slot="label"
              slot-scope="{ label, active }"
            >
              <span
                :class="['custom-label', { active }]"
                v-if="label % 25 === 0"
              >
                {{ label }}
              </span>
            </template>
          </Slider>
        </section>
      </div><span class="rate">{{slider.marketBuySliderValue}}%</span>
    </div>
    <!--市价卖-->
    <div
      class="inner-box"
      v-if="className ==='market-sell'"
    >
      <div class="slider">
        <section
          data-title="Custom Label"
          :class="className"
        >
          <Slider
            v-model="slider.marketSellSliderValue"
            v-bind="slider"
            @drag-start="dragStart"
            @callback="dragCallback"
            v-if="!isSymbolChanged"
          >
            <template
              slot="label"
              slot-scope="{ label, active }"
            >
              <span
                :class="['custom-label', { active }]"
                v-if="label % 25 === 0"
              >
                {{ label }}
              </span>
            </template>
          </Slider>
        </section>
      </div><span class="rate">{{slider.marketSellSliderValue}}%</span>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import Slider from 'vue-slider-component'
import {mapState} from 'vuex'
import SliderBarTemplate from './SliderBarTemplate'
import {
  cutOutPointLength
} from '../../utils'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
    Slider,
    SliderBarTemplate
  },
  props: [
    'className',
    'disabled',
    // 用户买方币种总额
    'buyTotal',
    // 用户卖方币种总额
    'sellTotal'
  ],
  data () {
    return {
      // 滑动条
      slider: {
        width: '100%',
        show: true,
        value: 0,
        min: 0,
        max: 100,
        debug: false,
        piecewiseLabel: true,
        tooltip: false,
        disabled: this.disabled,
        limitBuySliderValue: 0,
        limitSellSliderValue: 0,
        marketBuySliderValue: 0,
        marketSellSliderValue: 0
      }
    }
  },
  created () {
  },
  mounted () {
  },
  activated () {
  },
  updated () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    setValue (name, newVal) {
      this.slider[name] = newVal
      console.log(this.slider)
    },
    dragStart () {
      this.$emit('dragStart')
    },
    dragEnd () {
      this.$emit('dragEnd')
    },
    dragCallback () {
      let newVal
      switch (this.className) {
        case 'limit-buy':
          newVal = this.slider.limitBuySliderValue
          break
        case 'limit-sell':
          newVal = this.slider.limitSellSliderValue
          break
        case 'market-buy':
          newVal = this.slider.marketBuySliderValue
          break
        case 'market-sell':
          newVal = this.slider.marketSellSliderValue
          break
      }
      this.$emit('dragCallback', {
        target: this.className,
        newVal
      })
    },
    setNewRateByUserLimitBuy (newPrice, newCount) {
      let rate
      let currentAmount = newCount * newPrice
      rate = this.buyTotal < currentAmount ? 100 : (currentAmount / this.buyTotal) * 100
      console.log(rate)
      // 买单价
      this.setValue('limitBuySliderValue', cutOutPointLength(rate, 2))
    },
    setNewRateByUserMarket (type, newAmount) {
      let total = type == 'buy' ? this.buyTotal : this.sellTotal
      if (newAmount && total) {
        let rate = newAmount < total ? (newAmount / total) * 100 : 100
        console.log(rate)
        switch (type) {
          case 'buy':
            this.setValue('marketBuySliderValue', cutOutPointLength(rate, 2))
            break
          case 'sell':
            this.setValue('marketSellSliderValue', cutOutPointLength(rate, 2))
            break
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      isSymbolChanged: state => state.common.isSymbolChanged,
      limitBuyPrice: state => state.trade.limitExchange.buyPrice,
      limitBuyCount: state => state.trade.limitExchange.buyCount,
      limitSellCount: state => state.trade.limitExchange.sellCount,
      marketSellCount: state => state.trade.marketExchange.sellCount,
      marketBuyAmount: state => state.trade.marketExchange.buyAmount
    })
  },
  watch: {
    // 用户设置买价格
    limitBuyPrice (newVal) {
      console.log(newVal)
      if (newVal && this.buyTotal) {
        this.setNewRateByUserLimitBuy(newVal, this.limitBuyCount)
      }
    },
    // 用户设置买数量
    limitBuyCount (newVal) {
      if (newVal && this.buyTotal) {
        this.setNewRateByUserLimitBuy(this.limitBuyPrice, newVal)
      }
    },
    // 用户设置限价卖数量
    limitSellCount (newVal) {
      console.log(newVal)
      if (newVal && this.sellTotal) {
        let rate = newVal < this.sellTotal ? (newVal / this.sellTotal) * 100 : 100
        console.log(rate)
        this.setValue('limitSellSliderValue', cutOutPointLength(rate, 2))
      }
    },
    // 用户设置限价卖数量
    marketSellCount (newVal) {
      console.log(newVal)
      this.setNewRateByUserMarket('sell', newVal)
    },
    marketBuyAmount (newVal) {
      console.log(newVal)
      this.setNewRateByUserMarket('buy', newVal)
    },
    'slider.limitBuySliderValue' (newVal) {
      this.$emit('sliderBarValueChange', {
        newVal,
        'target': this.className
      })
    },
    'slider.limitSellSliderValue' (newVal) {
      this.$emit('sliderBarValueChange', {
        newVal,
        'target': this.className
      })
    },
    'slider.marketBuySliderValue' (newVal) {
      this.$emit('sliderBarValueChange', {
        newVal,
        'target': this.className
      })
    },
    'slider.marketSellSliderValue' (newVal) {
      this.$emit('sliderBarValueChange', {
        newVal,
        'target': this.className
      })
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';

  .slider-box {
    .slider {
      float: left;
      width: 85%;

      section {
        background-color: transparent;
        box-shadow: none;

        /deep/ {
          .vue-slider-component {
            margin: 0 0 10px;

            .vue-slider {
              height: 2px !important;
              background-color: #a9bed4;
            }

            .vue-slider-dot {
              top: -5px !important;
              left: 2px !important;
              width: 12px !important;
              height: 12px !important;

              > .vue-slider-dot-handle {
                width: 12px;
                height: 12px;
              }
            }

            .custom-label {
              color: transparent;

              &::after {
                bottom: -12px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #a9bed4;
              }

              &.active {
                &::after {
                  bottom: -13px;
                  width: 10px;
                  height: 10px;
                }
              }
            }

            .vue-slider-process {
              background-color: #a9bed4;
            }
          }

          &.market-buy,
          &.limit-buy {
            .vue-slider-component {
              .vue-slider-dot {
                > .vue-slider-dot-handle {
                  background-color: $upColor;
                }
              }

              .custom-label {
                &::after {
                  background-color: #a9bed4;
                }

                &.active {
                  &::after {
                    background-color: $upColor;
                  }
                }
              }

              .vue-slider-process {
                background-color: $upColor;
              }
            }
          }

          &.market-sell,
          &.limit-sell {
            .vue-slider-component {
              .vue-slider-dot {
                > .vue-slider-dot-handle {
                  background-color: $downColor;
                }
              }

              .custom-label {
                &::after {
                  background-color: #a9bed4;
                }

                &.active {
                  &::after {
                    background-color: $downColor;
                  }
                }
              }

              .vue-slider-process {
                background-color: $downColor;
              }
            }
          }
        }
      }
    }

    .rate {
      float: right;
      display: inline-block;
      height: 20px;
      line-height: 20px;
    }
  }
</style>
<style scope lang="scss">
  .container {
    width: 100%;
    overflow: hidden;
    background-color: #f4f4f4;

    h1 {
      font-size: 50px;
      text-align: center;
      color: #2980b9;
    }

    code {
      display: block;
      padding: 10px 20px;
      margin: 0;
      border-radius: 5px;
      overflow-x: auto;
      font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Type, Writer, Ubuntu;
      white-space: pre-line;
      color: #fff;
      background-color: #333;
    }
  }

  section {
    position: relative;
    max-width: 800px;
    background-color: #fff;
    box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, .36);
  }

  .btn-group {
    margin: 10px 0;
  }

  .btn-group button,
  .upload-group label {
    display: inline-block;
    padding: 8px 12px;
    margin: 5px 10px 5px 0;
    border: none;
    border-radius: 3px;
    background-color: #ccc;
  }

  .red {
    color: #d93a49;
  }

  .green {
    color: #2ecc71;
  }

  .yellow {
    color: #ffd400;
  }

  .gray {
    color: #d3dce6;
  }

  .preWrap {
    white-space: pre-wrap;
  }

  .ml-sm {
    margin-left: 5px;
  }

  .star-slider {
    .vue-slider {
      .vue-slider-dot {
        border-radius: 0;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAABdElEQVRIS63VXU6DQBQF4HOwJia2yA6sK7CvxkjpTroD6wqkK9AdqCvpjzG+4grEFYilTZqa9hogVGQQhmpfmfv1cO/MQGj+5PmgjeUyYA+BTgl1FskIFgzzFRSPdtjTqdGDJ6YL4joGuenxYj6uwivh77SwEkzGOqmr4WzaNKZG6lJYTZvK1anL4aK0mqljON5Kn41jiNGBAQsiDoQWiE75kCQaYgDSw0Z8UHys5y/RlqRMWx7A06op13x+FcF9gHc1C39fLvhAY+0krfgvPEXPF952eH/GM2h8jrLvtDOeQxV4p7YUoMVwdOHsme/6w5QJ7dDJr1cOiDw2HYgx0ocB2jPFUeGpOQBwUwfG/uqEZ0s/W6PCk+YtaFzWggsupYLErTHAbg5+A8SFsA1gAOLox3PBkN2ZW5HYDDKFMUg7vN/ea8nXJGpX5g/kgXbYL4enpgBQwHxrkiu16SZtU3eG2oqnww5WC1/3oxnfjNFJyw3vC/6grFUpX2dVAAAAAElFTkSuQmCC') no-repeat;
        background-size: contain;
        box-shadow: none;
      }
    }
  }

  #pretty-slider {
    .vue-slider-process {
      background-image: -webkit-linear-gradient(left, #f05b72, #3498db);
    }
  }

  .custom-tooltip {
    text-align: center;

    img {
      display: block;
    }
  }

  .custom-label {
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-left: 3px;
    transform: translate(-50%, -12px);

    &::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 1px;
      height: 5px;
      background-color: #000;
      transform: translate(-50%, 5px);
      content: '';
    }

    &.active {
      font-weight: bold;
      color: #2980b9;

      &::after {
        width: 2px;
        background-color: #2980b9;
      }
    }
  }
</style>
