<template>
  <div
    class="otc-entrust-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 委托订单表格 -->
    <div class="otc-entrust-order-table">
      <!-- 表头 -->
      <div class="entrust-table-head">
        <!--广告id-->
        <span class="item AD-ID">
          {{$t('M.otc_AD_ID')}}
        </span>
        <!-- 类型 -->
        <span class="item first-style">
          {{$t('M.comm_type')}}
        </span>
        <!-- 币种 -->
        <span class="item second-coin">
          {{$t('M.comm_currency')}}
        </span>
        <!-- 价格 -->
        <span class="item third-price">
          {{$t('M.otc_index_price')}}
        </span>
        <!-- 挂单数量 -->
        <span class="item fourth-entrust-count">
          {{$t('M.otc_entrust_number')}}
        </span>
        <!-- 已成交数量 -->
        <span class="item fifth-match-count">
          {{$t('M.otc_entrust_matching')}}
        </span>
        <!-- 总金额 -->
        <span class="item sixth-total-amount">
          {{$t('M.otc_canceled_total')}}
        </span>
        <!-- 挂单时间 -->
        <span class="item senventh-create-time">
          {{$t('M.otc_entrust_time')}}
        </span>
        <!-- 操作 -->
        <span class="item eighth-action">
          {{$t('M.otc_index_operate')}}
        </span>
      </div>
      <!-- 表身体 -->
      <div class="entrust-table-body border-radius4">
        <div
          class="no-data text-align-c"
          v-show="!OTCEntrustOrderList.length"
        >
          <!-- 暂无数据 -->
          {{$t('M.comm_no_data')}}
        </div>
        <div
          class="entrust-list-content"
          v-for="(item,index) in OTCEntrustOrderList"
          :key="index"
          v-show="OTCEntrustOrderList.length"
        >
          <!--广告id-->
          <span class="item AD-ID">
            {{item.entrustSequence}}
          </span>
          <!-- 1 类型 -->
          <!-- 买入 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'BUY'"
            :class="{ red: item.entrustType === 'BUY' }"
          >
            <!-- 买入 -->
            {{$t('M.comm_buy')}}
          </span>
          <!-- 卖出 -->
          <span
            class="item first-style"
            v-if="item.entrustType === 'SELL'"
            :class="{ green: item.entrustType === 'SELL' }"
          >
            <!-- 卖出 -->
            {{$t('M.comm_sell')}}
          </span>
          <!-- 2 币种 -->
          <span class="item second-coin">
            {{item.coinName}}
          </span>
          <!-- 3 价格 -->
          <span class="item third-price">
            {{$scientificToNumber(item.price)}}({{item.currencyName}})
          </span>
          <!-- 4 挂单数量 -->
          <span class="item fourth-entrust-count">
            {{$scientificToNumber(item.entrustCount)}}({{item.coinName}})
          </span>
          <!-- 5 已成交数量 -->
          <span class="item fifth-match-count">
            {{$scientificToNumber(item.matchCount)}}({{item.coinName}})
          </span>
          <!-- 6 总金额 -->
          <span class="item sixth-total-amount">
            {{$scientificToNumber(item.totalAmount)}}({{item.currencyName}})
          </span>
          <!-- 7 挂单时间 -->
          <span class="item senventh-create-time">
            {{item.createTime}}
          </span>
          <!-- 8 操作 -->
          <span class="item eighth-action">
            <el-button
              type="text"
              @click="revocationOrder(item.id)"
            >
              <!-- 撤单 -->
            {{$t('M.otc_entrust_cancellations')}}
            </el-button>
          </span>
        </div>
      </div>
      <div class="cancel-order-dialog">
        <el-dialog
          :title="$t('M.otc_prompt')"
          :visible.sync="cancelOrderDialogStatus"
          top="35vh"
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
    <!--分页-->
    <div class="page text-align-c">
      <el-pagination
        background
        v-show="OTCEntrustOrderList.length"
        layout="prev, pager, next"
        :page-count="totalPages"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {getOTCEntrustingOrders, querySelectedOrdersRevocation} from '../../utils/api/OTC'
import {
  getNestedData
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
      // 每页展示的条数
      pageSize: 10,
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // OTC委托订单列表
      OTCEntrustOrderList: [],
      // 撤单弹窗显示隐藏状态
      cancelOrderDialogStatus: false,
      // 委单id
      orderID: ''
    }
  },
  created () {
    // 1.0 刚进页面调取接口获取委托中的订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCEntrustingOrdersList()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'UPDATE_OTC_HOME_LIST_STATUS'
    ]),
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersList()
    },
    // 2.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 3.0 请求委托中订单列表
    async getOTCEntrustingOrdersList () {
      const data = await getOTCEntrustingOrders({
        status: 'ENTRUSTED', // 状态（ENTRUSTED 挂单中 HISTORY 历史挂单）
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // console.log('委托中订单列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        let OTCEntrustOrderListData = getNestedData(data, 'data')
        this.OTCEntrustOrderList = getNestedData(OTCEntrustOrderListData, 'list')
        // 分页
        this.totalPages = getNestedData(OTCEntrustOrderListData, 'pages') - 0
      }
    },
    // 4.0 点击撤单按钮:打开撤单二次弹窗
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
    // 5.0 提交撤单
    getOTCEntrustingOrdersRevocation: _.debounce(async function (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 返回数据正确的逻辑
      if (!data) return false
      this.getOTCEntrustingOrdersList()
      // 改变全局 委托定单撤单后，更新首页挂单列表状态
      this.UPDATE_OTC_HOME_LIST_STATUS(true)
    }, 500)
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin // 是否登录
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .otc-entrust-order-box {
    .otc-entrust-order-table {
      > .entrust-table-head {
        z-index: 200;
        display: flex;
        justify-content: space-around;
        box-sizing: border-box;
        width: 1189px;
        height: 35px;
        padding: 0 20px;
        margin: 2px 2px 15px;
        border-radius: 5px;
        line-height: 35px;

        > .first-style,
        .second-coin,
        .AD-ID {
          width: 110px;
        }

        > .third-price,
        .fourth-entrust-count,
        .fifth-match-count,
        .sixth-total-amount,
        .senventh-create-time {
          width: 150px;
        }

        > .eighth-action {
          width: 110px;
          text-align: right;
        }
      }

      > .entrust-table-body {
        width: 1189px;
        height: 432px;
        margin: 4px 2px;
        border-top: none;

        > .no-data {
          height: 432px;
          line-height: 432px;
        }

        > .entrust-list-content {
          display: flex;
          justify-content: space-around;
          height: 40px;
          padding: 0 20px;
          line-height: 40px;

          .red {
            color: $upColor;
          }

          .green {
            color: $otcGreen;
          }

          > .first-style,
          .second-coin,
          .AD-ID {
            width: 110px;
          }

          > .third-price,
          .fourth-entrust-count,
          .fifth-match-count,
          .sixth-total-amount,
          .senventh-create-time {
            width: 150px;
          }

          > .eighth-action {
            width: 110px;
            text-align: right;
          }
        }
      }
    }

    /deep/ {
      .otc-entrust-order-table {
        > .entrust-table-body {
          .entrust-list-content {
            .eighth-action {
              .el-button--text {
                color: $mainColor;
              }
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
      .otc-entrust-order-table {
        > .entrust-table-head {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: $mainContentNightBgColor;
          box-shadow: -2px 3px 5px 1px #191e28;
        }

        > .entrust-table-body {
          border: 1px solid #262f38;
          color: #9da5b3;
          background-color: $mainContentNightBgColor;

          > .no-data {
            color: rgba(255, 255, 255, .8);
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
                    background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      .otc-entrust-order-table {
        > .entrust-table-head {
          color: $fontColorSecondaryOfDay;
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px $boxShadowColorOfDay;
        }

        > .entrust-table-body {
          color: $dayMainTitleColor;
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px $boxShadowColorOfDay;

          > .no-data {
            color: $dayMainTitleColor;
          }
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
                    background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
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
