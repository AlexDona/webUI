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
            class="font-size14 font-weight700"
            :class="{
              'up':middleTopData.chg>0,
              'down':middleTopData.chg<0
            }"
          >{{middleTopData.last}}</span>
          <span
            class="font-size12 theme-color"
            v-show="middleTopData.last&&activeConvertCurrencyObj.symbol&&currencyRateList[middleTopData.area]"
          >≈ {{activeConvertCurrencyObj.symbol}}{{keep2Num((currencyRateList[middleTopData.area]-0)*(middleTopData.last-0))}}</span>
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
              'up':middleTopData.chg>0,
              'down':middleTopData.chg<0
            }"
          >{{middleTopData.chg}}%</span>
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
              'up':middleTopData.chg>0,
              'down':middleTopData.chg<0
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
            24H{{ $t('M.comm_trading_volume2') }}
          </span>
        </div>
        <div class="bottom">
            <span
              class="font-size14 theme-color"
              v-show="middleTopData.vol24hour"
            >
              {{formatCount(middleTopData.vol24hour)}}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {keep2Num} from '../../utils'
import {formatCount} from '../../utils/commonFunc'

export default {
  components: {},
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    // 成交量格式化
    formatCount (targetNum) {
      return formatCount(targetNum)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      middleTopData: state => state.trade.middleTopData,
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj // 目标货币
    })
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';

.middle-header-box {
  /* width:986px; */
  height: 60px;
  margin-bottom: 1px;
  line-height: 60px;
  box-shadow: 0 0 0 rgba(239, 239, 239, 1);

  > .inner-box {
    display: flex;
    height: 100%;

    .item {
      flex: 1;
      padding: 10px 0;

      > .top,
      > .bottom {
        height: 20px;
        line-height: 20px;
      }

      &.logo {
        flex: .5;
        text-align: center;

        > .logo {
          width: 30px;
        }
      }

      &.symbol {
        > .top {
          font-weight: 700;
        }
      }

      &.latest-price {
        flex: 1.5;
      }

      > .bottom {
        white-space: nowrap;

        > span {
          display: inline-block;
          margin-right: 10px;

          &.up {
            color: $upColor;
          }

          &.down {
            color: $downColor;
          }
        }
      }
    }
  }

  &.night {
    color: #a9bed4;
    background-color: $mainContentNightBgColor;
    box-shadow: 2px 0 3px rgba(27, 35, 49, 1);

    > .inner-box {
      .item {
        > .top,
        &.symbol {
          color: #fff;
        }

        > .bottom {
          > .theme-color {
            color: #fff;
          }
        }
      }
    }
  }

  &.day {
    background-color: #fff;
    box-shadow: 2px 0 3px rgba(239, 239, 239, 1);

    > .inner-box {
      .item {
        &.symbol {
          color: #333;
        }

        > .bottom {
          > .theme-color {
            color: #333;
          }
        }
      }
    }
  }
}
</style>
