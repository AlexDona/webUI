<template>
  <div
    class="table-item-box"
    v-show="item.content.length || (searchKeyWord && isSearchArea)"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="left"
    >
        <div
          class="right-side animate"
        >
          <div class="top">
            <span>{{item.area}}</span>
            <span v-show="!isSearchAreaOrCollectionArea">
              <!--交易区-->
              {{ $t('M.home_market_trade_sector') }}
            </span>
          </div>
        </div>
    </div>
    <!--表格内容-->
    <div
      class="right"
      :style="{
        'height': isSearchAreaOrCollectionArea ? `${+(50*((isGetMore ? (item.content.length + 1) : item.content.length) || 1) + 108)}px` : '',
        'max-height':'701px'
      }"
    >
      <el-table
        class="cursor-pointer"
        :class="{
          'has-data': item.content.length
        }"
        :data="isCollectionArea || searchKeyWord ? item.content: item.content.filter(item => item.visible)"
        @row-click="changeActiveSymbol"
        :height="isGetMore ? 651: 701"
      >
        <!--交易对:label="$t('M.comm_deal') + $t('M.comm_pair')"-->
        <el-table-column
          :label="$t('M.comm_deal_pair')"
          align="left"
          header-align="left"
        >
          <template slot-scope="s">
            <div
              style="
              display:flex;
              box-sizing: border-box;
              padding-left:14px;"
            >
              <div
                class="left"
                style="border-radius: 50%;"
              >
                <img
                  style="
                    display:inline-block;
                    width:22px;
                    margin:14px 0;
                    vertical-align: middle;"
                  :src="$http2https(s.row.image)"/>
              </div>
              <div class="right"
                   style="height:30px;
                      margin:10px 4px;"
              >
                <div
                  class="top"
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
                  style="height:20px;
                    line-height: 20px;"
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
          sortable
          align="right"
          header-align="right"
        >
          <template slot-scope="s">
            <div
              style="
                height:30px;
                margin:10px auto; "
            >
              <div class="top"
                   style="height:15px;
                      line-height: 15px;"
              >
                <span
                  v-show="s.row.chg>=0"
                  style="color:#d45858;"
                >
                  {{$scientificToNumber(s.row.last)}}
                </span>
                <span
                  v-show="s.row.chg<0"
                  style="color:#008069;"
                >
                          {{$scientificToNumber(s.row.last)}}
                        </span>
              </div>
              <!--货币转换-->
              <div
                class="bottom"
                style="height:15px;
                  line-height: 15px;"
                v-show="currencyRateList[s.row.area]&&activeConvertCurrencyObj"
              >
                ≈ {{activeConvertCurrencyObj.symbol}}{{$keepCurrentNum((currencyRateList[s.row.area]-0)*(s.row.last-0), s.row.legalCurrencyDecimal)}}
              </div>
            </div>
          </template>
        </el-table-column>
        <!--最高价-->
        <el-table-column
          prop="high"
          :label="$t('M.home_market_ceiling_price')"
          sortable
          width="160"
          align="right"
          header-align="right"
        >
          <template slot-scope="s">
            <div
              style="
                height:30px;
                margin:10px auto;
                line-height: 30px; "
            >
              {{$scientificToNumber(s.row.high)}}
            </div>
          </template>
        </el-table-column>
        <!--最低价-->
        <el-table-column
          prop="low"
          :label="$t('M.home_market_minimum_price')"
          sortable
          width="166"
          align="right"
          header-align="right"
        >
          <template slot-scope="s">
            <div
              style="
                height:30px;
                margin:10px auto;
                line-height: 30px; ">
              {{$scientificToNumber(s.row.low)}}
            </div>
          </template>
        </el-table-column>
        <!--24H交易量-->
        <el-table-column
          prop="vol24hour"
          :label="'24H' + $t('M.home_market_volume')"
          width="170"
          align="right"
          header-align="right"
          sortable
        >
          <template slot-scope="s">
            <div
              v-show="String($formatCount(s.row.vol24hour))!='NaN'"
              style="
                height:30px;
                padding-right: 10px;
                margin:10px auto;
                line-height: 30px; ">
              {{$formatCount(s.row.vol24hour)}}
            </div>
          </template>
        </el-table-column>
        <!--涨跌-->
        <el-table-column
          prop="chg"
          :label="$t('M.trade_ups_and_downs')"
          sortable
          width="148"
          align="right"
          header-align="center"
        >
          <template slot-scope="s">
            <div
              style="
                height:30px;
                padding-right: 50px;
                margin:10px auto;
                line-height: 30px;
                white-space:nowrap; "
            >
              <span
                v-show="s.row.chg>0"
                style="color:#d45858;"
              >
                {{$keep2Num(s.row.chg)}}%
              </span>
              <span
                v-show="s.row.chg==0"
              >
                {{$keep2Num(s.row.chg)}}%
              </span>
              <span
                v-show="s.row.chg<0"
                style="color:#008069;"
              >
               {{$keep2Num(s.row.chg)}}%
              </span>
            </div>
          </template>
        </el-table-column>
        <!--价格趋势(3日)-->
        <el-table-column
          prop="tendency"
          :label="$t('M.home_market_price_tendency')"
          width="132"
          align="center"
          heaer-align="center"
        >
          <template slot-scope="s">
            <EchartsLineCommon
              :id="s.row.id + Math.random()"
              :data="s.row.triduumSampling"
            />
          </template>
        </el-table-column>
        <!--收藏-->
        <el-table-column
          prop="collect"
          label=" "
          width="30px"
        >
          <template slot-scope="s">
            <!--非自选区-->
            <div
              class="collect-box"
              v-show="!isCollectionArea"
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
              v-show="isCollectionArea"
            >
              <i
                class="el-icon-star-on collected collect font-size16 cursor-pointer"
                @click.stop="toggleCollect(s.row.id,0,s.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 查看更多-->
      <button
        v-show="isGetMore"
        @click="getMoreSymbols({plateId:activeName,areaId:item.id})"
        class="more-btn"
      >{{$t('M.comm_view_more')}}</button>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import EchartsLineCommon from '../Common/EchartsLineCommon'
export default {
  components: {
    EchartsLineCommon
  },
  props: [
    'searchKeyWord',
    'collectAreaId',
    'searchAreaId',
    'collectStatusList',
    'collectSymbol',
    'item',
    'hasMoreSymbols',
    'activeName'
  ],
  data () {
    return {
      more: false
    }
  },
  created () {
    console.log(this.item)
    this.more = this.item.more
    console.log(this.item, this.more)
  },
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_JUMP_STATUS',
      'SET_JUMP_SYMBOL',
      'CHANGE_ACTIVE_TRADE_AREA'
    ]),
    toggleCollect (id, status, row) {
      this.$emit('toggleCollect', {
        id,
        status,
        row
      })
    },
    // 获取更多交易对
    getMoreSymbols ({plateId = this.activeName, more = true, areaId}) {
      this.$emit('getMoreSymbols', {
        plateId,
        more,
        areaId
      })
      this.more = false
    },
    changeActiveSymbol (e) {
      // console.log(e)
      this.SET_JUMP_STATUS(true)
      this.SET_JUMP_SYMBOL(e)
      // 设置当前交易区
      const {areaId, name, id} = e
      this.CHANGE_ACTIVE_TRADE_AREA({
        id: areaId,
        name
      })
      this.$goToPage(`/TradeCenter/${id}`)
      // this.$navigators_S_X()
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
      theme: state => state.common.theme,
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    }),
    isGetMore () {
      return this.more && this.item.more
    },
    isSearchAreaOrCollectionArea () {
      return this.isSearchArea || this.isCollectionArea
    },
    isSearchArea () {
      return this.item.id == this.searchAreaId
    },
    isCollectionArea () {
      return this.item.id == this.collectAreaId
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../assets/CSS/index";

.table-item-box {
  display: flex;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;

  /* 侧边栏 */
  > .left {
    position: relative;
    width: 210px;
    max-width: 210px;
    max-height: 714px;
    text-align: center;

    &::before {
      position: absolute;
      top: 1px;
      right: -26px;
      width: 0;
      height: 0;
      border: 13px solid transparent;
      border-left-color: #526e90;
      content: '';
    }

    > div {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    > .right-side,
    > .reverse-side {
      &.animate {
        transition-property: all;
        transition-duration: 2s;

        /* transition-timing-function: linear; */
        transition-timing-function: ease-in-out;
      }

      > .top {
        padding: 20px 0;
        margin-top: 30px;
        font-size: 24px;
        color: #fff;
        background: url(../../assets/develop/market-list-border.png) no-repeat center bottom;
      }
    }

    /* 正面 */
    > .right-side {
      position: relative;
      z-index: 100;
      top: -30px;
      background: linear-gradient(#1d3862, #305fa7);

      > .bottom {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    /* 反面 */
    > .reverse-side {
      position: relative;
      top: -30px;
      background: linear-gradient(#2f398c, #3d4e8d);

      > .bottom {
        margin-top: 30px;

        > .hot-list {
          box-sizing: border-box;
          min-height: 330px;

          > .hot-item {
            box-sizing: border-box;

            > a {
              display: inline-block;
              width: 100%;
              height: 60px;
              color: #fff;

              > .left,
              > .right {
                display: inline-block;
                width: 48%;
                height: 60px;
                vertical-align: middle;
              }

              > .left {
                line-height: 60px;
              }

              > .right {
                padding-top: 10px;
                text-align: left;

                > .top {
                  &.up {
                    color: $upColor;
                  }

                  &.down {
                    color: $downColor;
                  }
                }

                .collect-box {
                  text-align: center;
                }

                > .top,
                > .bottom {
                  display: inline-block;
                  width: 100%;
                  height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
        }
      }

      > .more-btn {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  /* 主要内容 */
  > .right {
    /* height:547px; */
    width: 1086px;
    margin: 13px 0 0;
    overflow: hidden;

    > .more-btn {
      box-sizing: border-box;
      width: 100%;
      height: 50px;
      font-size: 14px;
      color: $mainColor;
      background-color: #1c1f32;
      cursor: pointer;

      &:hover {
        background-color: #282a3c;
      }
    }

    /deep/ {
      .el-table {
        width: 1095px;

        .caret-wrapper {
          width: 15px;
        }

        .sort-caret.descending {
          bottom: 8px;
        }

        .el-table__row {
          td {
            padding: 0;

            .cell {
              overflow: unset;
              white-space: nowrap;
            }

            div {
              height: 50px;

              .collect-box {
                line-height: 50px;
              }
            }
          }
        }
      }
    }
  }

  &.day {
    > .right {
      background-color: transparent;
      box-shadow: 0 1px 5px 0 lightgrey;

      > .more-btn {
        background-color: #fff;

        &:hover {
          background-color: #eaf2fa;
        }
      }
    }
  }
}
</style>
