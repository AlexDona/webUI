<template>
  <div
    class="middle-header-box trade"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div class="inner-box">
      <div class="item logo">
          <img
            class="logo"
            :src="$middleTopData_S_X.image"
          >
      </div>
      <div class="item symbol">
        <div class="top">
          <span>{{$middleTopData_S_X.sellsymbol}}</span>
          /
          <span>{{$middleTopData_S_X.area}}</span>
        </div>
        <div class="bottom font-size12">
          <span>{{($middleTopData_S_X.sellname||' ').replace(/\+/g,' ')}}</span>
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
              'up':$middleTopData_S_X.chg>0,
              'down':$middleTopData_S_X.chg<0
            }"
          >{{$scientificToNumber($middleTopData_S_X.last)}}</span>
          <span
            class="font-size12 theme-color"
            v-show="$middleTopData_S_X.last&&activeConvertCurrencyObj.symbol&&currencyRateList[$middleTopData_S_X.area]"
          >≈ {{activeConvertCurrencyObj.symbol}}{{$keepCurrentNum((currencyRateList[$middleTopData_S_X.area]-0)*($middleTopData_S_X.last-0), $middleTopData_S_X.legalCurrencyDecimal)}}</span>
        </div>
      </div>
      <!--涨跌-->
      <div class="item rate">
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
              'up':$middleTopData_S_X.chg>0,
              'down':$middleTopData_S_X.chg<0
            }"
            v-show="String($keep2Num($middleTopData_S_X.chg))!='NaN'"
          >{{$keep2Num($middleTopData_S_X.chg)}}%</span>
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
              'up':$middleTopData_S_X.chg>0,
              'down':$middleTopData_S_X.chg<0
            }"
          >{{$scientificToNumber($middleTopData_S_X.high)}}</span>
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
          >{{$scientificToNumber($middleTopData_S_X.low)}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>
            <!--24hr成交量-->
            {{ $t('M.comm_trading_volume3') }}
          </span>
        </div>
        <div class="bottom">
            <span
              class="font-size14 theme-color"
              v-show="String($formatCount($middleTopData_S_X.vol24hour))!='NaN'"
            >
              {{$formatCount($middleTopData_S_X.vol24hour)}}
            </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'

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
  },
  filter: {},
  computed: {
    ...mapState({
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
      padding: 10px 20px;

      > .top,
      > .bottom {
        height: 20px;
        line-height: 20px;
      }

      &.logo {
        width: 60px;
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
