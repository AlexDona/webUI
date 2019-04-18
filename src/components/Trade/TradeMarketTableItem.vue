<template>
  <div
    class="coin-table font-size12"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--表格头部-->
    <dl class="coin-thead">
      <dt></dt>
      <dd class="coin-unit">
        <span
          class="title coin-type"
        >
          <!--交易对-->
          <!-- {{ $t('M.comm_deal') }}{{ $t('M.comm_pair') }} -->
          {{ $t('M.common_counterparty') }}
        </span>
        <span
          class="title price cursor-pointer"
        >
          <!--最新价-->
            <span
              :data-text="$t('M.trade_latest_price')"
              @click="sortByUser('price',list)"
            >
              <!--最新价-->
              {{ $t('M.trade_latest_price') }}
            </span>
            <i class="sort-box">
              <i
                class="el-icon-caret-top"
                :class="{active:sortBy=='price-asc'}"
                @click="sortByUser('price-asc',list)"
              >
              </i>
              <i
                class="el-icon-caret-bottom"
                :class="{active:sortBy=='price-desc'}"
                @click="sortByUser('price-desc',list)"
              >
              </i>
            </i>
        </span>
        <span
          class="title rose cursor-pointer"
          @click="sortByUser('rose',list)"
        >
          <!--涨幅-->
          <!-- {{ $t('M.trade_market_amount_increase') }} -->
          {{ $t('M.trade_ups_and_downs') }}
          <i class="sort-box">
            <i
              class="el-icon-caret-top"
              :class="{active:sortBy=='rose-asc'}"
              @click="sortByUser('rose-asc',list)"
            ></i>
            <i
              class="el-icon-caret-bottom"
              :class="{active:sortBy=='rose-desc'}"
              @click="sortByUser('rose-desc',list)"
            ></i>
          </i>
        </span>
      </dd>
    </dl>
    <div class="coin-list">
      <div
        class="market-cate-wrap"
        v-for="(item,index) in plateList"
        :key="index"
      >
        <div
          class="market-category"
        >
          {{item.plateName.replace(/\+/g,' ')}}
        </div>
        <dl
          class="coin-item "
        >
          <dt></dt>
          <dd
            class="coin-item"
            :class="{
              'cursor-pointer': !clickDalay
            }"
            v-for="(innerItem,innerIndex) in item.content"
            v-if="(activeName==collectArea.area) || innerItem.visible || (!innerItem.visible&&searchKeyWord)"
            :key="innerIndex"
            @click=changeActiveSymbol(innerItem)
          >
            <span
              class="coin-name"
            >
              <!--收藏按钮-->
              <!--自选区-->
              <span v-show="activeName==collectArea.area">
                <i
                  class="click-button cursor-pointer"
                  @click.stop="toggleCollect(innerItem.id,0,innerItem,item.plateId)"
                >
                  <i
                    class="el-icon-star-on  collected font-size16"
                  ></i>
                </i>
              </span>
              <!--非自选区-->
              <span v-show="activeName!=collectArea.area">
                <i
                  class="click-button cursor-pointer"
                  v-show="!collectSymbol[innerItem.id]"
                  @click.stop="toggleCollect(innerItem.id,1,innerItem,item.plateId)"
                >
                  <i
                    class="el-icon-star-off  font-size16"
                  ></i>
                </i>
                <i
                  class="click-button cursor-pointer"
                  v-show="collectSymbol[innerItem.id]"
                  @click.stop="toggleCollect(innerItem.id,0,innerItem,item.plateId)"
                >
                  <i
                    class="el-icon-star-on  collected font-size16"
                  ></i>
                </i>
              </span>
              <span class="base-currency">{{innerItem.sellsymbol}}</span>
              <!--币中文名-->
              <span
                class="currency-chn-name"
                v-show="language === 'zh_CN'"
              >{{innerItem.sellname.replace('+', ' ')}}</span>
              <span
                class="area"
                v-show="language !== 'zh_CN'"
              >/ {{innerItem.area}}</span>
            </span>
            <span
              class="price text-align-r"
              :class="{
                'up':innerItem.chg>0,
                'down':innerItem.chg<0
              }"
              >
              {{$scientificToNumber(innerItem.last)}}
            </span>
            <span
              class="rose text-align-r"
              :class="{
                'up':innerItem.chg>0,
                'down':innerItem.chg<0
              }"
            >
              {{$keep2Num(innerItem.chg)}}%
            </span>
          </dd>
        </dl>
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
  props: [
    'sortBy',
    'plateList',
    'collectSymbol',
    'activeName',
    'collectArea',
    'list',
    'searchKeyWord'
  ],
  data () {
    return {
      clickDalay: true
    }
  },
  created () {
    // setTimeout(() => {
    this.clickDalay = false
    // }, 1500)
  },
  mounted () {
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    sortByUser (sortMethod, list) {
      this.$emit('sortByUser', {
        sortMethod,
        list
      })
    },
    changeActiveSymbol (activeSymbol) {
      if (this.clickDalay) {
        return false
      }
      console.log(this.isKlineDataReady)
      if (this.isKlineDataReady) {
        this.$emit('changeActiveSymbol', {
          activeSymbol
        })
      }
    },
    toggleCollect (id, status, row, plateId) {
      this.$emit('toggleCollect', {
        id,
        status,
        row,
        plateId
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 语言
      isKlineDataReady: state => state.trade.isKlineDataReady // K线数据是否准备好
    })
  },
  watch: {
    language () {
      this.$forceUpdate()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';

.coin-table {
  /* padding:0 5px; */
  > .coin-thead {
    height: 30px;
    line-height: 30px;

    > .coin-unit {
      display: flex;

      /* 表头 */
      > .title {
        flex: 1;
        color: $mainNightTitleColor;

        &:nth-of-type(1) {
          margin-left: 20px;
        }

        &.price {
          margin-right: 20px;
          text-align: right;
        }

        &.rose {
          margin-right: 30px;
          text-align: right;
        }

        .sort-box {
          position: relative;

          > i {
            position: absolute;
            left: 0;

            &.active {
              color: $mainColor;
            }

            &.el-icon-caret-top {
              top: -2px;
            }

            &.el-icon-caret-bottom {
              bottom: -2px;
            }
          }
        }
      }
    }
  }

  /* 币种列表 */
  > .coin-list {
    > .market-cate-wrap {
      /* 板块头部 */
      > .market-category {
        position: relative;
        height: 30px;
        padding: 0 4.5%;
        margin: 0 16px;

        /* padding-left: 10px; */

        /* padding: 0 20px; */
        border-top: 1px solid #39424d;
        border-bottom: 1px solid #39424d;
        line-height: 30px;
        color: $mainColor;

        &::before {
          position: absolute;
          top: 50%;
          left: 0;
          width: 2px;
          height: 14px;
          background-color: $mainColor;
          transform: translateY(-50%);
          content: '';
        }
      }

      > .coin-item {
        > .coin-item {
          height: 30px;
          padding: 0 10px;
          line-height: 30px;

          .click-button {
            display: inline-block;
            width: 18px;
            height: 30px;
          }

          &:hover {
            // background-color: pink;
          }

          > span {
            display: inline-block;
            box-sizing: border-box;
            width: 96px;
            white-space: nowrap;
          }
        }
      }
    }
  }

  &.night {
    > .coin-thead {
      > .coin-unit {
        display: flex;
      }
    }

    /* 币种列表 */
    > .coin-list {
      > .market-cate-wrap {
        > .coin-item {
          white-space: nowrap;

          > .coin-item {
            .click-button {
              color: $nightFontColor;
            }

            &:hover {
              background-color: rgba(255, 255, 255, .2);
            }

            > span {
              > .base-currency {
                color: $nightFontColor;
              }

              > .currency-chn-name {
                color: #b0b2b6;
              }

              &.price,
              &.rose {
                color: $nightFontColor;
              }

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
    }
  }

  &.day {
    > .coin-thead {
      > .coin-unit {
        display: flex;
      }
    }

    /* 币种列表 */
    > .coin-list {
      > .market-cate-wrap {
        > .market-category {
          border-top: 1px solid #e1e2e4;
          border-bottom: 1px solid #e1e2e4;
        }

        > .coin-item {
          > .coin-item {
            &:hover {
              background-color: #eaf2fa;
            }

            > span {
              > .currency-chn-name {
                color: #b0b2b6;
              }

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
    }
  }
}
</style>
