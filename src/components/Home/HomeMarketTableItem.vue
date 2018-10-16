<template>
  <div
    class="table-item-box"
    v-show="item.content.length||searchKeyWord"
  >
    <div
      class="left"
    >
      <!--正面-->
      <!--<transition enter-active-class="animated fadeIn">-->
      <transition
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          class="right-side animate"
          v-show="toggleSideList[item.id]"
        >
          <div class="top">
            <span>{{item.area}}</span>
            <span v-show="item.id!=collectAreaId&&item.id!=searchAreaId">
              <!--交易区-->
              {{ $t('M.home_market_trade_sector') }}
            </span>
          </div>
        </div>
      </transition>
      <!--反面-->
      <!--<transition enter-active-class="animated fadeIn">-->
      <transition
        @before-enter="beforeEnterReverse"
        @enter="enterDownReverse"
        @leave="leaveReverse"
      >
        <div
          class="reverse-side animate"
          v-show="!toggleSideList[item.id]"
        >
          <div class="top">
            <span>
              <!--最热交易对-->
              {{ $t('M.home_market_hottest_trading') }}
            </span>
          </div>
          <div class="bottom">
            <ul class="hot-list">
              <li
                class="hot-item"
                v-for="(innerItem,innerIndex) in item.content"
                :key="innerIndex"
              >
                <!--<router-link-->
                  <!--to="/"-->
                  <!--v-if="innerItem.hot"-->
                <!--&gt;-->
                  <!--<span class="left font-size16">-->
                    <!--<span>-->
                      <!--{{innerItem.sellsymbol}} / {{item.area}}-->
                    <!--</span>-->
                  <!--</span>-->
                  <!--<span class="right">-->
                    <!--<span-->
                      <!--class="top font-size14"-->
                      <!--:class="{up:innerItem.chg>=0,down:innerItem.chg<0}"-->
                    <!--&gt;-->
                      <!--{{innerItem.last}}-->
                    <!--</span>-->
                    <!--&lt;!&ndash;货币兑换&ndash;&gt;-->
                      <!--<span class="bottom font-size12">-->
                        <!--≈-->
                        <!--<span></span>-->
                        <!--{{currencyRateList[innerItem.area]*innerItem.last}}-->
                      <!--</span>-->
                    <!--</span>-->
                <!--</router-link>-->
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--表格内容-->
    <div
      class="right"
      :style="'height:'+(50*(item.content.length||1)+108)+'px'"
    >
      <el-table
        class="cursor-pointer"
        :data="item.content"
        @row-click="changeActiveSymbol"
        height="547"
      >
        <!--交易对-->
        <el-table-column
          :label="$t('M.comm_deal') + $t('M.comm_pair')"
          width="132px"
        >
          <template slot-scope="s">
            <div style="padding-left:14px;display:flex;width: 132px !important;box-sizing: border-box;">
              <div class="left" style="border-radius: 50%;">
                <img
                  style="width:22px;vertical-align: middle;
                                display:inline-block;
                                margin:14px 0;"
                  :src="s.row.image"/>
              </div>
              <div class="right"
                   style="height:30px;margin:10px 4px;"
              >
                <div class="top"
                     style="height:15px;"
                     :class="{
                                'line-height15':language=='zh_CN',
                                'line-height30':language!=='zh_CN'
                             }"
                >
                  <span class="symbol">{{s.row.sellsymbol}}</span>
                  <span
                    class="area"
                  >/{{s.row.area}}</span>
                </div>
                <div
                  class="bottom sellname"
                  style="height:20px;line-height: 20px"
                  v-if="language=='zh_CN'"
                >
                  {{s.row.sellname}}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <!--最新价格-->
        <el-table-column
          prop="last"
          :label="$t('M.home_market_recent_quotation')"
          width="160px"
          sortable
        >
          <template slot-scope="s">
            <div
              style="
                      padding-left:10px;
                      width:160px;
                      height:30px;
                      margin:10px auto;
                  ">
              <div class="top"
                   style="height:15px;line-height: 15px"
              >
                <span
                  v-show="s.row.chg>=0"
                  style="color:#D45858;"
                >
                  {{s.row.last}}
                </span>
                <span
                  v-show="s.row.chg<0"
                  style="color:#008069;"
                >
                          {{s.row.last}}
                        </span>
              </div>
              <!--货币转换-->
              <div
                class="bottom"
                style="height:15px;line-height: 15px"
                v-show="currencyRateList[s.row.area]&&activeConvertCurrencyObj.symbol"
              >
                ≈ {{activeConvertCurrencyObj.symbol}}{{keep2Num((currencyRateList[s.row.area]-0)*(s.row.last-0))}}
              </div>
            </div>
          </template>
        </el-table-column>
        <!--最高价-->
        <el-table-column
          prop="high"
          :label="$t('M.home_market_ceiling_price')"
          width="145px"
          sortable
        >
          <template slot-scope="s">
            <div
              style="
                      padding-left:10px;
                      height:30px;
                      width:140px;
                      line-height: 30px;
                      margin:10px auto;
                    ">
              {{s.row.high}}
            </div>
          </template>
        </el-table-column>
        <!--最低价-->
        <el-table-column
          prop="low"
          :label="$t('M.home_market_minimum_price')"
          width="145px"
          sortable
        >
          <template slot-scope="s">
            <div
              style="
                      width:140px;
                      height:30px;
                      padding-left:12px;
                      line-height: 30px;
                      margin:10px auto;
                    ">
              {{s.row.low}}
            </div>
          </template>
        </el-table-column>
        <!--24H交易量-->
        <el-table-column
          prop="volume"
          :label="'24H' + $t('M.home_market_volume')"
          width="120px"
          sortable
        >
          <template slot-scope="s">
            <div
              style="
                      width: 120px;
                      padding-left:10px;
                      height:30px;
                      line-height: 30px;
                      margin:10px auto;
                    ">
              {{s.row.vol24hour}}
            </div>
          </template>
        </el-table-column>
        <!--涨跌-->
        <el-table-column
          prop="rose"
          :label="$t('M.trade_ups_and_downs')"
          width="80px"
          sortable
        >
          <template slot-scope="s">
            <div
              style="
                      width:74px;
                      padding-left:8px;
                      height:30px;
                      line-height: 30px;
                      margin:10px auto;
                    "
            >
              <span
                v-show="s.row.chg>0"
                style="color:#D45858;"
              >
                {{s.row.chg}}
              </span>
              <span
                v-show="s.row.chg==0"
              >
                {{s.row.chg}}
              </span>
              <span
                v-show="s.row.chg<0"
                style="color:#008069;"
              >
               {{s.row.chg}}
              </span>
            </div>
          </template>
        </el-table-column>
        <!--价格趋势(3日)-->
        <el-table-column
          prop="tendency"
          :label="$t('M.home_market_price_tendency')"
          width="120px"
        >
          <template slot-scope="s">
            <EchartsLineCommon
              :id="s.row.id + Math.random()"
              :data="s.row.triduumSampling"/>
          </template>
        </el-table-column>
        <!--收藏-->
        <el-table-column
          prop="collect"
          label=" "
          width="36px"
        >
          <template slot-scope="s">
            <!--非自选区-->
            <div
              class="collect-box"
              v-show="item.id!=collectAreaId"
            >
              <i
                class="el-icon-star-on collected collect font-size16 cursor-pointer"
                @click.stop="toggleCollect(s.row.id,0,s.row)"
                v-show="!!collectSymbol[s.row.id]"
              ></i>
              <i
                class="el-icon-star-off collect font-size16 cursor-pointer"
                @click.stop="toggleCollect(s.row.id,1,s.row)"
                v-show="!collectSymbol[s.row.id]"
              ></i>
            </div>
            <!--自选区-->
            <div
              class="collect-box"
              v-show="item.id==collectAreaId"
            >
              <i
                class="el-icon-star-on collected collect font-size16 cursor-pointer"
                @click.stop="toggleCollect(s.row.id,0,s.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {keep2Num} from '../../utils'
// import {returnAjaxMessage} from '../../utils/commonFunc'
import EchartsLineCommon from '../Common/EchartsLineCommon'
export default {
  components: {
    EchartsLineCommon
  },
  props: [
    'searchKeyWord',
    'toggleSideList',
    'collectAreaId',
    'searchAreaId',
    'collectStatusList',
    'collectSymbol',
    'item'
  ],
  data () {
    return {}
  },
  created () {
    // console.log(this.toggleSideList)
    // console.log(this.collectAreaId)
    // console.log(this.searchAreaId)
  },
  mounted () {
    console.log(this.item)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    toggleCollect (id, status, row) {
      this.$emit('toggleCollect', {
        id,
        status,
        row
      })
    },
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    changeActiveSymbol (e) {
      // console.log(e)
      this.$store.commit('trade/SET_JUMP_STATUS', true)
      this.$store.commit('trade/SET_JUMP_SYMBOL', e)
      // console.log(this.activeSymbol)
      // 设置当前交易区
      const id = e.areaId
      const name = e.area
      this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', {
        id,
        name
      })
      this.$router.push({'path': '/TradeCenter'})
    },
    // 正面动画
    beforeEnter (el) {
      el.style = 'opacity:0'
      // el.style = 'transform: rotateY(90deg);'
    },
    enter (el, done) {
      el.offsetWidth
      // el.style.paddingTop = '5px'
      el.style.opacity = 1
      // el.style = 'transform: rotateY(0deg);'
      done()
    },
    leave (el, done) {
      el.offsetWidth
      el.style.opacity = 0
      // el.style = 'transform: rotateY(90deg);'
      done()
    },
    // 反面动画
    beforeEnterReverse (el) {
      el.style = 'opacity:0'
      // el.style = 'transform: rotateY(90deg);'
    },
    enterDownReverse (el, done) {
      el.offsetWidth
      // el.style.paddingTop = '5px'
      el.style.opacity = 1
      // el.style = 'transform: rotateY(0deg);'
      done()
    },
    leaveReverse (el, done) {
      el.offsetWidth
      el.style.opacity = 0
      // el.style = 'transform: rotateY(90deg);'
      done()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language, // 语言
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
    item (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index.scss";
  @import "../../../static/css/scss/Home/MarketListHome.scss";
  .table-item-box{
    width:100%;
    height:100%;
    display:flex;
    margin-bottom:20px;
    /*侧边栏*/
    >.left{
      width:210px;
      /*min-height:560px;*/
      /*background-color: #f40;*/
      position: relative;
      text-align: center;
      &:before{
        content:'';
        position: absolute;
        top:1px;
        right:-26px;
        width:0px;
        border: 13px solid transparent;
        border-left-color: #526e90;
        height:0px;
      }
      >div{
        position: absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
      }
      >.right-side,>.reverse-side{
        &.animate {
          transition-property: all;
          transition-duration: 2s;
          /*transition-timing-function: linear;*/
          transition-timing-function: ease-in-out;
        }
        >.top{
          margin-top:30px;
          font-size: 30px;
          color:#fff;
          padding:20px 0;
          background: url(../../assets/develop/market-list-border.png) no-repeat center bottom;
        }
      }
      /*正面*/
      >.right-side{
        background:linear-gradient(#1D3862,#305FA7);
        position: relative;
        top:-30px;
        >.bottom{
          position: absolute;
          left:50%;
          transform: translateX(-50%);
          bottom:20px;
        }
      }
      /*反面*/
      >.reverse-side{
        background:linear-gradient(#2F398C,#3D4E8D);
        position: relative;
        top:-30px;
        >.bottom{
          margin-top:30px;
          >.hot-list{
            min-height:330px;
            box-sizing: border-box;
            >.hot-item{
              box-sizing: border-box;
              >a{
                color:#fff;
                height:60px;
                display: inline-block;
                width:100%;
                >.left,>.right{
                  width:48%;
                  height:60px;
                  display: inline-block;
                  vertical-align: middle;
                }
                >.left{
                  line-height: 60px;
                }
                >.right{
                  >.top{
                    &.up{
                      color:$upColor;
                    }
                    &.down{
                      color:$downColor;
                    }
                  }
                  text-align: left;
                  padding-top:10px;
                  .collect-box{
                    text-align: center;
                  }
                  >.top,>.bottom{
                    line-height: 20px;
                    display: inline-block;
                    height:20px;
                    width:100%;
                  }
                }
              }
            }
          }
        }
        >.more-btn{
          position: absolute;
          left:50%;
          transform: translateX(-50%);
          bottom:20px;
        }
      }
    }
    /*主要内容*/
    >.right{
      margin:13px 0 0 0;
      /*height:547px;*/
      width:986px;
      background-color: transparent;
      overflow: hidden;

    }
  }
</style>
