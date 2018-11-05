<template>
  <div
    class="rate-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <!-- <h2>{{rateData.termsTypeName}}</h2> -->
          <div
            class="content"
            v-html="rateData.content"
          >

          </div>
        </div>
        <!--<div class="inner-box">-->
          <!--<ul class="table">-->
            <!--<li class="th">-->
              <!--<span class="td">交易对</span>-->
              <!--<span class="td">买单</span>-->
              <!--<span class="td">卖单</span>-->
              <!--<span class="td">提币</span>-->
            <!--</li>-->
            <!--<li-->
              <!--class="tr"-->
              <!--v-for="(item,index) in rateList"-->
              <!--:key="index"-->
            <!--&gt;-->
              <!--<span class="td">-->
                <!--{{item.symbol}}-->
              <!--</span>-->
              <!--<span class="td">-->
                <!--{{item.buyRate}}-->
              <!--</span>-->
              <!--<span class="td">-->
                <!--{{item.sellRate}}-->
              <!--</span>-->
              <!--<span class="td">-->
                <!--{{item.withdrawCurrency}}-->
              <!--</span>-->
            <!--</li>-->
          <!--</ul>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {
      rateList: [
        {
          symbol: '交易对',
          buyRate: '1',
          sellRate: '1',
          withdrawCurrency: '1'
        },
        {
          symbol: '交易对',
          buyRate: '1',
          sellRate: '1',
          withdrawCurrency: '1'
        },
        {
          symbol: '交易对',
          buyRate: '1',
          sellRate: '1',
          withdrawCurrency: '1'
        }
      ]
    }
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
      rateData: state => state.footerInfo.serviceProtocolData.rateData

    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .rate-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.content{
        background-color: green;
        /*overflow: hidden;*/
        >.inner-box{
          margin:0;
          height:1069px;
          width:1000px;
          box-sizing: border-box;
          padding:0px 50px;
          line-height: 26px;
          >h2{
            text-align: center;
            line-height: 70px;
          }
        }
      }
    }
    &.night{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #121824;
          >.inner-box{
            background-color: #1e2636;
            /*color: #fff;*/
          }
        }
      }
    }
    &.day{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #fff;
          >.inner-box{
            border:1px solid rgba(234,235,236,1);
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
