<!-- 服务条款 - 费率 -->
<template>
  <div
    class="rate-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <div
            class="content"
          >
            <el-tabs
              v-model="activeName"
            >
              <!-- 交易对费率-->
              <el-tab-pane
                :label="$t('M.comm_deal_pair') + $t('M.otc_index_rate')"
                name="rateOfSymbol"
              >
                <el-table
                  :data="symbolRateList"
                  class="symbol-rate-table"
                >
                  <!-- 交易对 -->
                  <el-table-column
                    :label="$t('M.comm_deal_pair')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.name }}</div>
                    </template>
                  </el-table-column>
                  <!-- 买单 -->
                  <el-table-column
                    :label="$t('M.entrust_msg_type_002')"
                    align="center"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.buyFee*100 }}%</div>
                    </template>
                  </el-table-column>
                  <!-- 卖单 -->
                  <el-table-column
                    :label="$t('M.entrust_msg_type_001')"
                    align="right"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.sellFee*100 }}%</div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!-- 币种费率 -->
              <el-tab-pane
                :label="$t('M.rate_withdraw_rate')"
                name="rateOfCurrency"
              >
                <el-table
                  :data="currencyRateList"
                  class="currency-rate-table"
                >
                  <el-table-column
                    :label="$t('M.otc_AD_token')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.coinName }}</div>
                    </template>
                  </el-table-column>
                  <!-- 提现手续费 -->
                  <el-table-column
                    :label="$t('M.rate_withdraw')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.withdrawRate }}</div>
                    </template>
                  </el-table-column>
                  <!-- 单笔最小提现 -->
                  <el-table-column
                    :label="$t('M.rate_withdraw_min')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.withdrawMin }}</div>
                    </template>
                  </el-table-column>
                  <!-- 单笔最大提现 -->
                  <el-table-column
                    :label="$t('M.rate_withdraw_max')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.withdrawMax }}</div>
                    </template>
                  </el-table-column>
                  <!-- 每日提现额度 -->
                  <el-table-column
                    :label="$t('M.rate_withdraw_amount')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.withdrawAmount }}</div>
                    </template>
                  </el-table-column>
                  <!-- 每日提现次数 -->
                  <el-table-column
                    :label="$t('M.rate_withdraw_times')"
                  >
                    <template slot-scope="s">
                      <div>{{ s.row.withdrawTimes }}</div>
                    </template>
                  </el-table-column>

                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import {
  getSymbolRate,
  getCurrencyRate
} from '../../utils/api/common'
import {
  getNestedData
} from '../../utils/commonFunc'

export default {
  components: {},
  // props,
  data () {
    return {
      symbolRateList: [],
      currencyRateList: [],
      activeName: 'rateOfSymbol'
    }
  },
  async created () {
    await this.getSymbolRateData()
    await this.getCurrencyRate()
  },
  mounted () {
  },
  activated () {
  },
  updated () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    async getCurrencyRate () {
      const DATA = await getCurrencyRate()
      this.currencyRateList = getNestedData(DATA, 'data') || []
    },
    async getSymbolRateData () {
      const DATA = await getSymbolRate()
      this.symbolRateList = getNestedData(DATA, 'data') || []
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .rate-box {
    width: 100%;
    height: 100%;

    > .content {
      width: 100%;

      > .content {
        overflow: hidden;

        > .inner-box {
          width: 1100px;
          height: 1100px;
          padding: 20px 50px;
          margin: 0 auto;
          overflow: auto;

          > h2 {
            line-height: 70px;
            text-align: center;
          }
        }
      }
    }

    /deep/ {
      .symbol-rate-table,
      .currency-rate-table {
        background-color: transparent;

        td,
        th,
        tr {
          height: 40px;
          padding: 0;
          font-size: 12px;
          line-height: 40px;
        }

        td,
        th.is-leaf {
          padding: 0 20px;
        }

        th {
          background-color: #33425f;
        }
      }

      .el-tabs__header {
        top: 0;
      }

      .el-tabs__nav-scroll {
        margin-bottom: 40px;
      }

      .el-tabs__item {
        width: 150px;
        height: 34px;
        font-weight: 400;
        line-height: 34px;
        text-align: center;
        background-color: #33425f;

        &.is-active {
          height: 34px;
          line-height: 34px;
          background: rgb(51, 143, 245);
        }
      }
    }

    &.night {
      > .content {
        > .content {
          background-color: #1e2636;

          > .inner-box {
            color: #8ba0ca;
            background-color: #1e2636;
          }
        }
      }

      /deep/ {
        .el-table {
          background-color: transparent;

          td,
          th,
          tr {
            color: #f9fafc;
            background-color: transparent;
          }

          td,
          th.is-leaf {
            border: none;
            border-bottom: 1px solid #283143;
          }

          th {
            background-color: #33425f;
          }

          .el-tabs__nav-scroll {
            border-bottom: 1px solid #33425f;
          }
        }
      }
    }

    &.day {
      > .content {
        > .content {
          background-color: #fff;

          > .inner-box {
            border: 1px solid rgba(234, 235, 236, 1);
            color: #666;
            background-color: #fff;
          }
        }
      }

      /deep/ {
        th {
          color: #fff;
          background-color: #33425f;
        }

        .el-tabs__nav-scroll {
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
  }
</style>
