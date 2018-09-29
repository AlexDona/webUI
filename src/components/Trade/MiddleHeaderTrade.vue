<template>
  <div
    class="middle-header-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="item logo">
          <img
            class="logo"
            :src="middleTopData.image"
          >
      </div>
      <div class="item symbol">
        <div class="top">
          <span>{{middleTopData.sellsymbol}}</span>
          /
          <span>{{middleTopData.area}}</span>
        </div>
        <div class="bottom font-size12">
          <span>{{middleTopData.sellname}}</span>
        </div>
      </div>
      <!--最新价-->
      <div class="item latest-price">
        <div class="top font-size12">
          <span>
            {{ $t('M.trade_latest_price') }}
          </span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':middleTopData.rose>0,
              'down':middleTopData.rose<0
            }"
          >{{middleTopData.price}}</span>
          <span
            class="font-size12 theme-color"
            v-show="middleTopData.price&&activeConvertCurrencyObj.symbol&&currencyRateList[middleTopData.area]"
          >≈ {{activeConvertCurrencyObj.symbol}}{{keep2Num((currencyRateList[middleTopData.area]-0)*(middleTopData.price-0))}}</span>
        </div>
      </div>
      <!--涨跌-->
      <div class="item">
        <div class="top font-size12">
          <span>
            <!--涨跌-->
            {{ $t('M.trade_ups_and_downs') }}
          </span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':middleTopData.rose>0,
              'down':middleTopData.rose<0
            }"
          >{{middleTopData.rose}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>
            <!--最高-->
            {{ $t('M.trade_highest') }}
          </span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':middleTopData.rose>0,
              'down':middleTopData.rose<0
            }"
          >{{middleTopData.high}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>
            <!--最低-->
            {{ $t('M.trade_minimum') }}
          </span>
        </div>
        <div class="bottom">
          <span
            class="font-size14 theme-color"
          >{{middleTopData.low}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>
            <!--24hr成交量-->
            24hr{{ $t('M.comm_make_bargain') }}{{ $t('M.comm_quantity') }}
          </span>
        </div>
        <div class="bottom">
            <span
              class="font-size14 theme-color"
            >
              {{middleTopData.amount24h}}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {keep2Num} from '../../utils'

export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      activeSymbol: state => state.common.activeSymbol,
      middleTopData: state => state.trade.middleTopData,
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj // 目标货币
    })
  },
  watch: {
    activeSymbol (newVal) {
      console.log(newVal)
    },
    activeConvertCurrencyObj (newVal) {
      console.log(newVal)
    },
    currencyRateList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  .middle-header-box{
    margin-bottom:10px;
    /*width:986px;*/
    height:60px;
    line-height:60px;
    >.inner-box{
      display:flex;
      height:100%;
      .item{
        flex:1;
        padding:10px 0;
        >.top,>.bottom{
          height:20px;
          line-height:20px;
        }
        &.logo{
          text-align: center;
          flex:0.5;
          >.logo{
            width:30px;
          }
        }
        &.symbol{
          >.top{
            font-weight: 700;
          }
        }
        &.latest-price{
          flex:1.5;
          >.top{
          }
        }
        >.bottom{
          >span{
            margin-right:10px;
            display: inline-block;
            &.up{
              color:$upColor;
            }
            &.down{
              color: $downColor;
            }
          }
        }
      }
    }
    &.night{
      background-color: $mainContentNightBgColor;
      box-shadow:2px 0px 3px rgba(27,35,49,1);
      >.inner-box{
        .item{
          >.top,>.bottom{
          }
          &.logo{
            >.logo{
            }
          }
          &.symbol{
            color:#fff;
            >.top{
            }
          }
          &.latest-price{
            >.top{
            }
          }
          >.bottom{
            >span{
              &.up{
              }
              &.down{
              }
            }
            >.theme-color{
              color:#fff;
            }
          }
        }
      }
    }
    &.day{
      background-color: #fff;
      box-shadow:2px 0px 3px rgba(239,239,239,1);
      >.inner-box{
        .item{
          >.top,>.bottom{
          }
          &.logo{
            >.logo{
            }
          }
          &.symbol{
            color:#333;
            >.top{
            }
          }
          &.latest-price{
            >.top{
            }
          }
          >.bottom{
            >span{
              &.up{
              }
              &.down{
              }
            }
            >.theme-color{
              color:#333;
            }
          }
        }
      }
    }
  }
</style>
