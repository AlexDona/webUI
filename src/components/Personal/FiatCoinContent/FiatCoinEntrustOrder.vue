<template>
  <div
    class="fiat-entrust-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 委托订单表格 -->
    <div class="fiat-entrust-order-table">
      <!-- 表头 -->
      <div class="entrust-table-head font-size12 box-sizing">
        <div class="item nine-AD-ID">
          <!--广告id-->
          {{$t('M.otc_AD_ID')}}
        </div>
        <div class="item first-style">
          <!--类型-->
          {{$t('M.comm_type')}}
        </div>
        <div class="item second-coin">
          <!--币种-->
          {{$t('M.otc_AD_token')}}
        </div>
        <div class="item third-price">
          <!--价格-->
          {{$t('M.otc_index_price')}}
        </div>
        <div class="item fourth-entrust-count">
          <!--挂单数量-->
          {{$t('M.otc_entrust_number')}}
        </div>
        <div class="item fifth-match-count">
          <!--已成交数量-->
          {{$t('M.otc_entrust_matching')}}
        </div>
        <div class="item sixth-total-amount">
          <!--总金额-->
          {{$t('M.otc_canceled_total')}}
        </div>
        <div class="item seventh-create-time">
          <!--挂单时间-->
          {{$t('M.otc_entrust_time')}}
        </div>
        <div class="item eighth-action text-align-r">
          <!--操作-->
          {{$t('M.otc_index_operate')}}
        </div>
      </div>
      <!-- 表身体 -->
      <div class="entrust-table-body font-size12">
        <!--委单列表-->
        <div
          class="entrust-list-content"
          v-for="(item,index) in OTCEntrustOrderList"
          :key="index"
          v-if="OTCEntrustOrderList.length"
        >
          <!--广告id-->
          <div class="item nine-AD-ID">
            {{item.entrustSequence}}
          </div>
          <!-- 1 类型 -->
          <!-- 买入 -->
          <div
            class="item first-style"
            v-if="item.entrustType === 'BUY'"
            :class="{ red: item.entrustType === 'BUY' }"
          >
            <!--买入-->
            {{$t('M.comm_buy')}}
          </div>
          <!-- 卖出 -->
          <div
            class="item first-style"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            <!--卖出-->
            {{$t('M.comm_sell')}}
          </div>
          <!-- 2 币种 -->
          <div class="item second-coin">
            {{item.coinName}}
          </div>
          <!-- 3 价格 -->
          <div class="item third-price">
            {{item.price}}({{item.currencyName}})
          </div>
          <!-- 4 挂单数量 -->
          <div class="item fourth-entrust-count">
            {{item.entrustCount}}({{item.coinName}})
          </div>
          <!-- 5 已匹配数量 -->
          <div class="item fifth-match-count">
            {{item.matchCount}}({{item.coinName}})
          </div>
          <!-- 6 总金额 -->
          <div class="item sixth-total-amount">
            {{item.totalAmount}}({{item.currencyName}})
          </div>
          <!-- 7 挂单时间 -->
          <div class="item seventh-create-time1">
            {{item.createTime}}
          </div>
          <!-- 8 操作 -->
          <div class="item eighth-action text-align-r">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
            >
              <!--撤单-->
              {{$t('M.otc_entrust_cancellations')}}
            </el-button>
          </div>
        </div>
        <!--暂无数据-->
        <div
          class="no-data text-align-c"
          v-if="!OTCEntrustOrderList.length"
        >
          {{$t('M.comm_no_data')}}
        </div>
        <!--分页-->
        <div class="pages">
          <el-pagination
            background
            v-show="OTCEntrustOrderList.length"
            layout="prev, pager, next"
            :current-page="legalTradePageNum"
            :page-count="legalTradePageTotals"
            @current-change="changeCurrentPage"
          >
          </el-pagination>
        </div>
      </div>
      <div class="cancel-order-dialog">
        <el-dialog
          :title="$t('M.otc_prompt')"
          :visible.sync="cancelOrderDialogStatus"
          top="25vh"
        >
          <div class="content">
            {{$t('M.otc_revoke')}}
          </div>
          <span slot="footer">
          <div class="button-group">
            <button class="cancel item" @click="closeDialog">
              {{$t('M.comm_cancel')}}
            </button>
            <button class="confirm item" @click="confirmDialog">
              {{$t('M.comm_confirm')}}
            </button>
          </div>
        </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../../utils'
import {
  querySelectedOrdersRevocation
} from '../../../utils/api/OTC'
import {
  // returnAjaxMsg,
  changeCurrentPageForLegalTrader
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      dialogVisible: false,
      // OTC委托订单列表
      // OTCEntrustOrderList: []
      // 撤单弹窗显示隐藏状态
      cancelOrderDialogStatus: false,
      // 委单id
      orderID: ''
    }
  },
  created () {},
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_LEGAL_PAGE',
      'SET_LEGAL_TENDER_REFLASH_STATUS'
    ]),
    // 分页
    changeCurrentPage (e) {
      changeCurrentPageForLegalTrader(e, 'ENTRUSTED', this)
    },
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3.0 点击撤单按钮
    revocationOrder (id) {
      this.orderID = id
      this.cancelOrderDialogStatus = true
    },
    // 关闭弹窗
    closeDialog () {
      this.cancelOrderDialogStatus = false
    },
    // 点击弹窗确定按钮
    confirmDialog () {
      this.getOTCEntrustingOrdersRevocation(this.orderID)
      this.closeDialog()
    },
    // 4.0 提交撤单
    getOTCEntrustingOrdersRevocation: _.debounce(async function (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 返回数据正确的逻辑
      if (!data) return false
      this.SET_LEGAL_TENDER_REFLASH_STATUS({
        type: 'ENTRUSTED',
        status: true
      })
    }, 500)
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      legalTraderEntrustList: state => state.personal.legalTraderEntrustList,
      legalTraderEntrustReflashStatus: state => state.personal.legalTraderEntrustReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum
    }),
    OTCEntrustOrderList () {
      return this.legalTraderEntrustList
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .fiat-entrust-order-box {
    margin-top: -10px;

    .fiat-entrust-order-table {
      padding: 0 10px;

      > .entrust-table-head {
        display: flex;
        height: 35px;
        padding: 0 10px;
        margin-bottom: 10px;
        line-height: 35px;

        > .item {
          width: 130px;
        }

        > .first-style,
        .second-coin,
        .eighth-action,
        .nine-AD-ID {
          width: 100px;
        }
      }

      > .entrust-table-body {
        position: relative;
        min-height: 549px;
        padding: 0 0 35px;
        margin-top: -10px;

        > .entrust-list-content {
          display: flex;
          height: 46px;
          padding: 0 10px;
          line-height: 46px;

          > .item {
            width: 130px;
          }

          > .first-style,
          .second-coin,
          .eighth-action,
          .nine-AD-ID {
            width: 100px;
          }

          .red {
            color: $upColor;
          }

          .green {
            color: $otcGreen;
          }
        }

        > .no-data {
          height: 371px;
          line-height: 431px;
        }

        > .pages {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }

    /deep/ {
      .fiat-entrust-order-table {
        > .entrust-table-body {
          .eighth-action {
            .el-button {
              height: 34px;
              line-height: 0;
              color: $mainColor;
              background: none;
            }
          }
        }

        > .cancel-order-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              width: 350px;
              height: 180px;
              border-radius: 4px;

              .el-dialog__header {
                padding: 6px 18px;
                border-radius: 4px 4px 0 0;

                .el-dialog__title {
                  font-size: 14px;
                }

                .el-dialog__headerbtn {
                  top: 10px;
                  right: 10px;
                }
              }

              .el-dialog__body {
                height: 84px;
                padding: 35px 18px;
                font-size: 14px;
                text-align: center;
              }

              .el-dialog__footer {
                padding: 0 18px;

                .button-group {
                  .item {
                    height: 30px;
                    padding: 0 28px;
                    border-radius: 2px;
                    font-size: 12px;
                    line-height: 30px;
                    cursor: pointer;
                  }

                  .confirm {
                    margin-left: 20px;
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

      > .fiat-entrust-order-table {
        background-color: $mainContentNightBgColor;

        > .entrust-table-head {
          border-bottom: 1px solid $dialogColor6;
          text-align: left;
          color: #617499;
        }

        > .entrust-table-body {
          color: #9da5b3;

          .no-data {
            background-color: $mainContentNightBgColor;
          }
        }
      }

      /deep/ {
        .cancel-order-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              background-color: $dialogColor1;

              .el-dialog__header {
                background-color: $dialogColor2;

                .el-dialog__title {
                  color: $dialogColor4;
                }
              }

              .el-dialog__body {
                color: $dialogColor5;
              }

              .el-dialog__footer {
                .button-group {
                  .cancel {
                    border: 1px solid $mainColor;
                    color: $mainColorOfWhite;
                    background-color: $dialogColor1;
                  }

                  .confirm {
                    color: $mainColorOfWhite;
                    background: $nightButtonBgColor1;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .fiat-entrust-order-table {
        background-color: $mainDayBgColor;

        > .entrust-table-head {
          border-bottom: 1px solid $borderColorOfDay;
          color: $fontColorSecondaryOfDay;
        }

        > .entrust-table-body {
          color: $dayMainTitleColor;

          .entrust-list-content {
            &:hover {
              background-color: #f4f4f5;
            }
          }
        }

        .no-data {
          color: $fontColorSecondaryOfDay;
        }
      }

      /deep/ {
        .cancel-order-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              background-color: $mainColorOfWhite;

              .el-dialog__header {
                background-color: $dialogColor7;

                .el-dialog__title {
                  color: $dayMainTitleColor;
                }
              }

              .el-dialog__body {
                color: $dayMainTitleColor;
              }

              .el-dialog__footer {
                .button-group {
                  .cancel {
                    border: 1px solid $mainColor;
                    color: $mainColor;
                    background-color: $mainColorOfWhite;
                  }

                  .confirm {
                    color: $mainColorOfWhite;
                    background: $dayButtonBgColor2;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
