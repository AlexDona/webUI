<template>
  <div
    class="middle-header-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="item logo">
          <img
            class="logo"
            :src="activeSymbol.image"
          >
      </div>
      <div class="item symbol">
        <div class="top">
          <span>{{activeSymbol.sellsymbol}}</span>
          /
          <span>{{activeSymbol.area}}</span>
        </div>
        <div class="bottom font-size12">
          <span>{{activeSymbol.sellname}}</span>
        </div>
      </div>
      <!--最新价-->
      <div class="item latest-price">
        <div class="top font-size12">
          <span>最新价</span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':activeSymbol.rose>0,
              'down':activeSymbol.rose<0
            }"
          >{{activeSymbol.price}}</span>
          <span class="font-size12 theme-color">≈ 0.25</span>
        </div>
      </div>
      <!--涨跌-->
      <div class="item">
        <div class="top font-size12">
          <span>涨跌</span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':activeSymbol.rose>0,
              'down':activeSymbol.rose<0
            }"
          >{{activeSymbol.rose}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>最高</span>
        </div>
        <div class="bottom">
          <span
            class="font-size14"
            :class="{
              'up':activeSymbol.rose>0,
              'down':activeSymbol.rose<0
            }"
          >{{activeSymbol.high}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>最低</span>
        </div>
        <div class="bottom">
          <span
            class="font-size14 theme-color"
          >{{activeSymbol.low}}</span>
        </div>
      </div>
      <div class="item">
        <div class="top font-size12">
          <span>24hr成交量</span>
        </div>
        <div class="bottom">
            <span
              class="font-size14 theme-color"
            >
              {{activeSymbol.volume}}
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
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      activeSymbol: state => state.common.activeSymbol
    })
  },
  watch: {
    activeSymbol (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter';
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
      background-color: $nightMainTitleBgColor;
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
