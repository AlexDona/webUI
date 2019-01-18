<template>
  <div
    class="entrust-order-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">

      <!--查看更多委单记录-->
      <div class="view-more">
        <button
          class="cancel-all-entrust"
          :class="{
            'disabled': !currentEntrustList.length
          }"
          :disabled="!currentEntrustList.length"
          @click="cancelAllEntrust"
        >
          {{$t(cancelEntrustBtnText)}}
        </button>
        <a
          href="#"
          @click="jumpToPersonal"
        >
          <span>
            <!--查看更多-->
            {{ $t('M.comm_view_more') }}
          </span>
          <i class="el-icon-d-arrow-right"></i>
        </a>
      </div>
      <el-tabs
        v-model="activeName"
      >
        <!--当前委托-->
        <el-tab-pane
          :label="$t('M.trade_coin_commissioned_current')"
          name="current-entrust"
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
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th count">
                <!--数量-->
                {{ $t('M.comm_count') }}
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
              <li class="th entrust">
                <!--委托金额-->
                {{ $t('M.trade_coin_entrust_money1') }}
                <span>（{{activeSymbol.area}}）</span>
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
              <!--未登录-->
              <div
                class="not-login content"
                v-if="!isLogin"
              >
                <!--您还没有登录，请 登录 或 注册 后查看-->
                {{ $t('M.trade_coin_text1') }} <router-link to="/login"> {{ $t('M.comm_login') }}</router-link> {{ $t('M.trade_coin_text2') }} <router-link to="/register">{{ $t('M.comm_register_time') }}</router-link> {{ $t('M.trade_coin_text3') }}

              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else-if="currentEntrustList.length!=0"
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
                    <span v-if="language == 'zh_CN' || language == 'zh_TW'">{{item.typeName}}</span>
                    <span v-else>{{item.type}}</span>
                  </li>
                  <!--价格-->
                  <li class="td price">
                    {{scientificToNumber(item.price-0)}}
                  </li>
                  <!--数量-->
                  <li class="td count">
                    {{scientificToNumber(item.count-0)}}
                  </li>
                  <!--委托总额-->
                  <li class="td entrust">
                    {{scientificToNumber(item.amount-0)}}
                  </li>
                  <!--已成交量-->
                  <li class="td already">
                    {{scientificToNumber(item.completeCount-0)}}
                  </li>
                  <!--未成交量-->
                  <li class="td already">
                    {{scientificToNumber(item.leftCount-0)}}
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
            v-show="activeName === 'current-entrust' && currentEntrustList.length && isLogin"
            layout="prev, pager, next"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage(0,$event)"
          >
          </el-pagination>
        </el-tab-pane>
        <!--历史委托-->
        <el-tab-pane
          :label="$t('M.trade_coin_history_entrust1')"
          name="history-entrust"
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
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th count">
                <!--委托量-->
                {{ $t('M.trade_coin_entrusted_amount') }}
              </li>
              <li class="th price">
                <!--已成交量-->
                {{ $t('M.trade_coin_has_traded_amount') }}
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
              <li class="th price">
                <!--成交均价-->
                {{ $t('M.common_average_price') }}
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th status">
                <!--状态-->
                {{ $t('M.comm_state') }}
              </li>
            </ul>
            <div class="tbody">
              <!--未登录-->
              <div
                class="not-login content"
                v-if="!isLogin"
              >
                <!--您还没有登录，请 登录 或 注册 后查看-->
                {{ $t('M.trade_coin_text1') }} <router-link to="/login"> {{ $t('M.comm_login') }}</router-link> {{ $t('M.trade_coin_text2') }} <router-link to="/register">{{ $t('M.comm_register_time') }}</router-link> {{ $t('M.trade_coin_text3') }}
              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else-if="historyEntrustList.length!=0"
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
                    <span v-if="language == 'zh_CN' || language == 'zh_TW'">{{item.typeName}}</span>
                    <span v-else>{{item.type}}</span>
                  </li>
                  <!--价格-->
                  <li class="td price">
                    {{scientificToNumber(item.price-0)}}
                  </li>
                  <!--委托量-->
                  <li class="td count">
                    {{scientificToNumber(item.count-0)}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{scientificToNumber(item.completeCount-0)}}
                  </li>
                  <!--成交均价-->
                  <li class="td price">
                    {{scientificToNumber(item.completePrice-0)}}
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
        </el-tab-pane>
        <!--分页-->
        <el-pagination
          background
          v-show="activeName === 'history-entrust' && historyEntrustList.length && isLogin"
          layout="prev, pager, next"
          :page-count="totalPageForHistoryEntrust"
          @current-change="changeCurrentPage(1,$event)"
        >
        </el-pagination>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  // timeFilter,
  scientificToNumber
} from '../../utils'
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
      pageSize: 10
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
    // 撤销所有委单
    cancelAllEntrust () {
      // 确定撤销所有委托？ 取消  删除
      this.$confirm(this.$t('M.trade_determine_cancel_all_entrust'), {
        cancelButtonText: this.$t('M.comm_cancel'), // 取消
        confirmButtonText: this.$t('M.comm_confirm') // 确定
      }).then(async () => {
        let params = {
          tradeId: this.middleTopData.partnerTradeId
        }

        const data = await cancelAllEntrustAjax(params)
        if (!data) return false
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
      }).catch(() => {
      })
    },
    getEntrustData () {
      if (this.isLogin) {
        // 获取我的当前委托
        this.getMyCurrentEntrust()
        // 获取历史委托
        this.getHistoryEntrust()
      }
    },
    scientificToNumber (num) {
      return scientificToNumber(num)
    },
    // 跳转到个人中心
    jumpToPersonal () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('coin-orders')
      this.$router.push({path: '/PersonalCenter'})
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
    async getHistoryEntrust () {
      let params = {
        userId: this.userInfo.userId,
        currentPage: this.currentPageForHistoryEntrust,
        pageSize: this.pageSize,
        tradeId: this.middleTopData.partnerTradeId
      }
      const data = await getHistoryEntrust(params)
      if (!data) return false
      this.historyEntrustList = getNestedData(data, 'data.list') || []
      this.totalPageForHistoryEntrust = getNestedData(data, 'data.pages') - 0
    },
    // 获取我的当前委单
    async getMyCurrentEntrust () {
      let params = {
        userId: this.userInfo.userId,
        currentPage: this.currentPageForMyEntrust,
        pageSize: this.pageSize,
        tradeId: this.middleTopData.partnerTradeId
      }
      const data = await getMyEntrust(params)
      if (!data) return false
      this.currentEntrustList = getNestedData(data, 'data.list') || []
      this.totalPageForMyEntrust = getNestedData(data, 'data.pages') - 0
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      isLogin: state => state.user.isLogin,
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus,
      userInfo: state => state.user.loginStep1Info,
      activeSymbol: state => state.common.activeSymbol,
      middleTopData: state => state.trade.middleTopData
    })
  },
  watch: {
    activeName (newVal) {
      if (!this.isLogin) return false
      switch (newVal) {
        case 'current-entrust':
          this.getMyCurrentEntrust()
          break
        case 'history-entrust':
          this.getHistoryEntrust()
          break
      }
    },
    refreshEntrustStatus (newVal) {
      if (newVal) {
        this.getMyCurrentEntrust()
        this.getHistoryEntrust()
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(false)
      }
    },
    middleTopData (newVal) {
      this.getEntrustData()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';

.entrust-order-box {
  width: 100%;
  height: 416px;
  font-size: 12px;

  > .inner-box {
    position: relative;

    > .view-more {
      position: absolute;
      z-index: 2000;
      top: 0;
      right: 0;
      height: 34px;
      padding-right: 27px;
      line-height: 34px;
      text-align: right;

      > .cancel-all-entrust {
        padding-right: 10px;
        border-radius: 5px;
        font-size: 12px;
        color: #d45858;
        cursor: pointer;

        &.disabled {
          color: rgba(255, 255, 255, .4);
        }
      }

      > a {
        color: $mainColor;
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
          font-size: 12px;

          > .th {
            white-space: nowrap;

            &.time {
              width: 16%;
            }

            &.price {
              width: 15%;
            }

            &.count {
              width: 13%;
            }

            &.direction {
              width: 8%;
            }

            &.status {
              width: 7%;
            }
          }
        }

        > .tbody {
          > .content {
            > .tr {
              white-space: nowrap;

              > .td {
                font-size: 12px;
                white-space: nowrap;

                &.time {
                  width: 16%;
                  font-size: 12px;
                }

                &.price {
                  width: 15%;
                }

                &.count {
                  width: 13%;
                }

                &.direction {
                  width: 8%;
                }

                &.status {
                  width: 7%;
                }
              }
            }
          }
        }
      }

      /* 表头 */
      > .thead {
        height: 30px;
        line-height: 30px;

        > .th {
          display: inline-block;
          font-size: 12px;
          white-space: nowrap;

          &.time {
            width: 17%;
          }

          &.direction {
            width: 8%;
          }

          &.price {
            width: 13%;
          }

          &.count {
            width: 13%;
          }

          &.entrust {
            width: 17%;
          }

          &.already {
            width: 10%;
          }

          &.type {
            width: 7%;
          }
        }
      }

      /* 表格内容 */
      > .tbody {
        .content {
          min-height: 310px;

          /* 未登录 */
          &.not-login {
            line-height: 310px;
            text-align: center;

            > a {
              color: $mainColor;
            }
          }

          &.empty {
            > p {
              line-height: 310px;
              text-align: center;
            }
          }

          > .tr {
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            white-space: nowrap;

            > .td {
              display: inline-block;
              font-size: 12px;

              &.time {
                width: 17%;
              }

              &.direction {
                width: 8%;
              }

              &.price {
                width: 14%;
              }

              &.count {
                width: 13%;
              }

              &.entrust {
                width: 16%;
              }

              &.already {
                width: 10%;
              }

              &.type {
                width: 7%;
              }

              &.todos {
                > button {
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
      /* 主要内容 */
      .content-box {
        /* 表格内容 */
        > .tbody {
          .content {
            > .tr {
              /* border-bottom:1px solid red; */
              border-color: rgba(57, 66, 77, .2);
            }
          }
        }
      }
    }
  }

  &.day {
    color: $dayFontColor;
    background-color: $mainDayBgColor;

    > .inner-box {
      /* 主要内容 */
      .content-box {
        /* 表格内容 */
        > .tbody {
          .content {
            > .tr {
              border-color: rgba(57, 66, 77, .1);
            }
          }
        }
      }
    }
  }
}
</style>
