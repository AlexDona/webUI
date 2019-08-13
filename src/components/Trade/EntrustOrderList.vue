<!--
  author: zhaoxinlei
  update: 20190803
  description: 当前页面为 币币交易 委单（历史委单、当前委单） 组件
-->
<template>
  <div
    class="entrust-order-box trade"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div class="inner-box">
      <!-- 表头 -->
      <div class="title">
        <ul class="t-left">
          <li
            class="item cursor-pointer"
            v-for="(entrust,index) in entrusts"
            :key="index"
            @click="toggleEntrustType(entrust.name)"
            :class="{active: activeName === entrust.name}"
          >
            {{$t(entrust.label)}}
          </li>
        </ul>
        <!-- 查看更多委单记录、取消所有订单 -->
        <div class="t-right">
          <!-- 取消所有委单 -->
          <button
            v-if="isCurrentOrHistory"
            class="cancel-all-entrust"
            :class="{
            'disabled': !currentEntrustList.length
          }"
            :disabled="!currentEntrustList.length"
            @click="cancelAllEntrust"
          >
            {{$t(cancelEntrustBtnText)}}
          </button>
          <!-- 查看更多委单 -->
          <a
            href="javascript:void(0);"
            @click="jumpToPersonal"
          >
          <span>
            <!--查看更多-->
            {{ $t('M.comm_view_more') }}
          </span>
            <i class="el-icon-d-arrow-right"></i>
          </a>
        </div>
      </div>
      <div class="content">
        <div
          class="current-entrust"
          v-if="isCurrentOrHistory"
        >
          <!--主要内容-->
          <div class="content-box">
            <ul class="thead">
              <li class="th time">
                <!--时间-->
                {{ $t('M.comm_time') }}
              </li>
              <li class="th direction">
                <!--方向-->
                {{ $t('M.common_direction') }}
              </li>
              <li class="th price">
                <!--价格-->
                {{ $t('M.comm_price_metre') }}
                <span>（{{$middleTopData_S_X.area}}）</span>
              </li>
              <li class="th count">
                <!--数量-->
                {{ $t('M.comm_count') }}
                <span>（{{$middleTopData_S_X.sellsymbol}}）</span>
              </li>
              <li class="th entrust">
                <!--委托金额-->
                {{ $t('M.trade_coin_entrust_money1') }}
                <span>（{{$middleTopData_S_X.area}}）</span>
              </li>
              <li class="th already">
                <!--已成交-->
                {{ $t('M.trade_coin_had_traded') }}
              </li>
              <li class="th already">
                <!--未成交-->
                {{ $t('M.trade_coin_not_had_traded') }}
              </li>
              <li class="th">
                <!--操作-->
                {{ $t('M.comm_operation') }}
              </li>
            </ul>
            <div class="tbody">
              <!--已登录-->
              <div
                class="logined content"
                v-if="currentEntrustList.length!=0"
              >
                <ul
                  class="tr"
                  v-for="(item,index) in currentEntrustList"
                  :key="index"
                >
                  <!--时间-->
                  <li class="td time">
                    {{item.createTime}}
                  </li>
                  <!--方向 中文和繁体展示中文其他国家语言展示英语-->
                  <li class="td direction">
                    <span v-if="$language_S_X == 'zh_CN' || $language_S_X == 'zh_TW'">{{item.typeName}}</span>
                    <span v-else>{{item.type}}</span>
                  </li>
                  <!--价格-->
                  <li class="td price">
                    {{$scientificToNumber(item.price-0)}}
                  </li>
                  <!--数量-->
                  <li class="td count">
                    {{$scientificToNumber(item.count-0)}}
                  </li>
                  <!--委托总额-->
                  <li class="td entrust">
                    {{$scientificToNumber(item.amount-0)}}
                  </li>
                  <!--已成交量-->
                  <li class="td already">
                    {{$scientificToNumber(item.completeCount-0)}}
                  </li>
                  <!--未成交量-->
                  <li class="td already">
                    {{$scientificToNumber(item.leftCount-0)}}
                  </li>
                  <!--操作-->
                  <li class="td todos">
                    <button
                      class="cursor-pointer"
                      @click="repealMyEntrust(item.id,item.version)"
                    >
                      <!--撤销-->
                      {{ $t('M.trade_coin_revocation') }}
                    </button>
                  </li>
                </ul>
              </div>
              <div
                class="content empty"
                v-else
              >
                <p>
                  <!--暂无数据-->
                  {{ $t('M.comm_no_data') }}
                </p>
              </div>
            </div>
          </div>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'current-entrust' && currentEntrustList.length && $isLogin_S_X"
            layout="prev, pager, next"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage(0,$event)"
          >
          </el-pagination>
        </div>
        <!-- 历史委托-->
        <div
          class="history-entrust"
          v-else
        >
          <!--主要内容-->
          <div class="content-box history">
            <ul class="thead">
              <li class="th time">
                <!--时间-->
                {{ $t('M.comm_time') }}
              </li>
              <li class="th direction">
                <!--方向-->
                {{ $t('M.common_direction') }}
              </li>
              <li class="th price">
                <!--价格-->
                {{ $t('M.comm_price_metre') }}
                <span>（{{$middleTopData_S_X.area}}）</span>
              </li>
              <li class="th count">
                <!--委托量-->
                {{ $t('M.trade_coin_entrusted_amount') }}
                <span>（{{$middleTopData_S_X.sellsymbol}}）</span>
              </li>
              <li class="th price">
                <!--已成交量-->
                {{ $t('M.trade_coin_has_traded_amount') }}
                <span>（{{$middleTopData_S_X.sellsymbol}}）</span>
              </li>
              <li class="th price">
                <!--成交均价-->
                {{ $t('M.common_average_price') }}
                <span>（{{$middleTopData_S_X.area}}）</span>
              </li>
              <li class="th status">
                <!--状态-->
                {{ $t('M.comm_state') }}
              </li>
            </ul>
            <div class="tbody">
              <!--已登录-->
              <div
                class="logined content"
                v-if="historyEntrustList.length!=0"
              >
                <ul
                  class="tr"
                  v-for="(item,index) in historyEntrustList"
                  :key="index"
                >
                  <!--时间-->
                  <li class="td time">
                    {{item.completeTime}}
                  </li>
                  <!--方向-->
                  <li class="td direction">
                    <span v-if="$language_S_X == 'zh_CN' || $language_S_X == 'zh_TW'">{{item.typeName}}</span>
                    <span v-else>{{item.type}}</span>
                  </li>
                  <!--价格-->
                  <li class="td price">
                    {{$scientificToNumber(item.price-0)}}
                  </li>
                  <!--委托量-->
                  <li class="td count">
                    {{$scientificToNumber(item.count-0)}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{$scientificToNumber(item.completeCount-0)}}
                  </li>
                  <!--成交均价-->
                  <li class="td price">
                    {{$scientificToNumber(item.completePrice-0)}}
                  </li>
                  <!--状态-->
                  <li class="td status">
                    {{$t(`M.${item.i18nStatusName}`)}}
                  </li>
                </ul>
              </div>
              <div
                class="content empty"
                v-else
              >
                <p>
                  <!--暂无数据-->
                  {{ $t('M.comm_no_data') }}
                </p>
              </div>
            </div>
          </div>
          <el-pagination
            background
            v-show="activeName === 'history-entrust' && historyEntrustList.length && $isLogin_S_X"
            layout="prev, pager, next"
            :page-count="totalPageForHistoryEntrust"
            @current-change="changeCurrentPage(1,$event)"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getMyEntrust,
  getHistoryEntrust,
  cancelAllEntrustAjax
} from '../../utils/api/trade'
import {
  getNestedData,
  repealMyEntrustCommon
} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'

export default {
  components: {},
  // props,
  data () {
    return {
      // 撤销所有委单
      cancelEntrustBtnText: 'M.trade_cancel_all_entrust',
      // 当前委托，历史委托切换（current、history）
      activeName: 'current-entrust',
      // 当前委托列表
      currentEntrustList: [],
      // 当前委托列表
      historyEntrustList: [],
      // 当前委托页码
      currentPageForMyEntrust: 1,
      // 当前委托总页数
      totalPageForMyEntrust: 1,
      // 历史委托页码
      currentPageForHistoryEntrust: 1,
      // 历史委托总页数
      totalPageForHistoryEntrust: 1,
      pageSize: 5,
      entrusts: [
        // 当前委托
        {
          label: 'M.trade_coin_commissioned_current',
          name: 'current-entrust'
        },
        // 历史委托
        {
          label: 'M.trade_coin_history_entrust1',
          name: 'history-entrust'
        }
      ]
    }
  },
  created () {
    this.getEntrustData()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    toggleEntrustType (name) {
      this.activeName = name
    },
    // 撤销所有委单
    cancelAllEntrust () {
      // 确定撤销所有委托？ 取消  删除
      this.$confirm(this.$t('M.trade_determine_cancel_all_entrust'), {
        cancelButtonText: this.$t('M.comm_cancel'), // 取消
        confirmButtonText: this.$t('M.comm_confirm') // 确定
      }).then(async () => {
        const {partnerTradeId} = this.$middleTopData_S_X
        let params = {
          tradeId: partnerTradeId
        }

        const data = await cancelAllEntrustAjax(params)
        if (!data) return false
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
      }).catch(() => {
      })
    },
    getEntrustData () {
      if (!this.$isLogin_S_X) return false
      switch (this.activeName) {
        case 'current-entrust':
          this.getMyCurrentEntrust()
          break
        case 'history-entrust':
          this.getHistoryEntrust()
          break
      }
    },
    // 跳转到个人中心
    jumpToPersonal () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('coin-orders')
      this.$goToPage('/PersonalCenter')
    },
    /**
     *撤销委单
     */
    repealMyEntrust (id, version) {
      // 您确定要撤销此单吗, 是否继续?
      this.$confirm(this.$t('M.otc_revoke'), {
        // 确定
        confirmButtonText: this.$t('M.comm_confirm'),
        // 取消
        cancelButtonText: this.$t('M.comm_cancel')
      }).then(async () => {
        let params = {
          id,
          version
        }
        repealMyEntrustCommon(params, () => {
          this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
        })
      }).catch(() => {
      })
    },
    /**
      * 切换页码
      * @entrustType: 订单类型： 0：当前委托 1： 历史委托
      */
    changeCurrentPage (entrustType, pageNum) {
      switch (entrustType) {
        case 0:
          this.currentPageForMyEntrust = pageNum
          this.getMyCurrentEntrust()
          break
        case 1:
          this.currentPageForHistoryEntrust = pageNum
          this.getHistoryEntrust()
      }
    },
    // 获取历史委托
    getHistoryEntrust: _.debounce(async function () {
      const {partnerTradeId} = this.$middleTopData_S_X
      let params = {
        currentPage: this.currentPageForHistoryEntrust,
        pageSize: this.pageSize,
        tradeId: partnerTradeId
      }
      const data = await getHistoryEntrust(params)
      if (!data) return false
      this.historyEntrustList = getNestedData(data, 'data.list') || []
      this.totalPageForHistoryEntrust = getNestedData(data, 'data.pages') - 0
    }, 500),
    // 获取我的当前委单
    getMyCurrentEntrust: _.debounce(async function () {
      const {partnerTradeId} = this.$middleTopData_S_X
      let params = {
        currentPage: this.currentPageForMyEntrust,
        pageSize: this.pageSize,
        tradeId: partnerTradeId
      }
      if (!getNestedData(params, 'tradeId')) return false
      const data = await getMyEntrust(params)
      if (!data) return false
      this.currentEntrustList = getNestedData(data, 'data.list') || []
      this.totalPageForMyEntrust = getNestedData(data, 'data.pages') - 0
    }, 500)
  },
  // filter: {},
  computed: {
    ...mapState({
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus
    }),
    isCurrentOrHistory () {
      return this.activeName == 'current-entrust'
    }
  },
  watch: {
    activeName () {
      this.getEntrustData()
    },
    refreshEntrustStatus (newVal) {
      if (newVal) {
        this.getEntrustData()
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(false)
      }
    },
    $middleTopData_S_X () {
      this.getEntrustData()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../assets/CSS/index';

.entrust-order-box {
  width: 100%;
  height: 250px;
  font-size: 12px;

  > .inner-box {
    position: relative;

    /* 表头 */
    > .title {
      display: flex;
      justify-content: space-between;
      height: 34px;
      padding: 0 10px;
      line-height: 34px;

      > .t-left {
        display: flex;

        > .item {
          margin: 0 10px;
          font-size: 12px;

          &.active {
            border-bottom: 2px solid $mainColor;
          }
        }
      }

      > .t-right {
        font-size: 12px;
        color: $mainColor;

        > .cancel-all-entrust {
          padding-right: 10px;
          border-radius: 5px;
          font-size: 12px;
          color: #f03e3e;
          cursor: pointer;

          &.disabled {
            color: rgba(255, 255, 255, .4);
            cursor: not-allowed;
          }
        }

        > a {
          color: $mainColor;
        }
      }
    }

    /* 主要内容 */
    .content-box {
      /* min-width:1000px; */
      width: 100%;
      padding: 0 20px;

      &.history {
        > .thead {
          width: 100%;

          > .th {
            display: inline-block;
            width: 16%;
            font-size: 12px;
            white-space: nowrap;

            &.direction {
              width: 4%;
            }

            &.status {
              box-sizing: border-box;
              padding-right: 20px;
              text-align: right;
            }
          }
        }

        > .tbody {
          > .content {
            > .tr {
              white-space: nowrap;

              > .td {
                display: inline-block;
                width: 16%;
                padding-right: 10px;
                font-size: 12px;

                &.direction {
                  width: 4%;
                }

                &.status {
                  box-sizing: border-box;
                  padding-right: 20px;
                  text-align: right;
                }
              }
            }
          }
        }
      }

      /* 表头 */
      > .thead {
        width: 100%;
        height: 34px;
        line-height: 34px;
        white-space: nowrap;

        > .th {
          display: inline-block;
          width: 13.8%;
          font-size: 12px;
          text-align: right;
          white-space: nowrap;

          &:last-of-type {
            box-sizing: border-box;
            padding-right: 20px;
            text-align: right;
          }

          &.time {
            text-align: left;
          }

          &.direction {
            width: 3.4%;
            text-align: left;
          }
        }
      }

      /* 表格内容 */
      > .tbody {
        .content {
          min-height: 140px;

          /* 未登录 */
          &.not-login {
            line-height: 180px;
            text-align: center;

            > a {
              color: $mainColor;
            }
          }

          &.empty {
            > p {
              line-height: 180px;
              text-align: center;
            }
          }

          > .tr {
            height: 25px;
            font-size: 14px;
            line-height: 25px;
            white-space: nowrap;

            > .td {
              display: inline-block;
              box-sizing: border-box;
              width: 13.8%;
              padding-right: 10px;
              font-size: 12px;
              text-align: right;

              &.time {
                text-align: left;
              }

              &.direction {
                width: 3.4%;
                text-align: left;
              }

              &.todos {
                box-sizing: border-box;
                padding-right: 20px;
                text-align: right;

                > button {
                  font-size: 12px;
                  color: $mainColor;
                }
              }
            }
          }
        }
      }
    }
  }

  &.night {
    color: $nightFontColor;
    background-color: $mainContentNightBgColor;

    > .inner-box {
      > .title {
        background-color: #23273c;

        > .t-left {
          > .item {
            color: #66718f;

            &.active {
              color: #d9e1f1;
            }
          }
        }

        > .t-right {
          > .cancel-all-entrust {
            color: #f03e3e;

            &.disabled {
              color: rgba(255, 255, 255, .4);
              cursor: not-allowed;
            }
          }

          > a {
            color: $mainColor;
          }
        }
      }

      /* 主要内容 */
      .content-box {
        /* 表格内容 */
        > .tbody {
          .content {
            > .tr {
              /* border-bottom:1px solid red; */
              border-color: rgba(57, 66, 77, .2);
              color: #d9e1f1;
            }
          }
        }
      }
    }
  }

  &.day {
    color: $dayMainTitleColor;
    background-color: $mainDayBgColor;

    > .inner-box {
      > .title {
        background-color: #f2f6fa;

        > .t-left {
          > .item {
            color: #66718f;

            &.active {
              color: #333;
            }
          }
        }

        > .t-right {
          > .cancel-all-entrust {
            color: #f03e3e;

            &.disabled {
              color: rgba(255, 255, 255, .4);
              cursor: not-allowed;
            }
          }

          > a {
            color: $mainColor;
          }
        }
      }

      /* 主要内容 */
      .content-box {
        /* 表格内容 */
        > .tbody {
          .content {
            > .tr {
              border-color: rgba(57, 66, 77, .1);
              color: #596a7a;
            }
          }
        }
      }
    }
  }
}
</style>
