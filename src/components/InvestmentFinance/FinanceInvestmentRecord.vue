<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  <!-- 导航 -->
    <!-- banner -->
    <div class="inner-box">
      <div class="finance-inner">
        <!-- 存币 -->
        <div class="invest-list">
          <div class="invest-list-body">
            <div class="goBackInvest">
              <IconFontCommon
                class='blue'
                iconName="icon-fanhui"
                style="font-size:12px;"
              />
              <router-link
                class="blue"
                :to="!isLogin ? 'login' : '/FinanceCenter'"
              >
                <!--返回存币-->
                {{ $t('M.investment_return_investment') }}
              </router-link>
            </div>
            <el-tabs
              v-model="activeName"
              @tab-click='changeTab'
            >
              <!-- @您还没有登陆,请登录或者注册之后查看！ -->
              <div
                v-if = "!isLogin"
                class = 'finance-tips-box'
              >
                {{$t('M.finance_loginTips')}}
                <router-link to='/login'>
                  {{$t('M.comm_login')}}
                </router-link>
                {{$t('M.finance_or')}}
                <router-link to = '/register'>
                  {{$t('M.comm_register_time')}}
                </router-link>
                {{$t('M.finance_loginTipsTwo')}}
              </div>
              <!-- 存币记录 -->
              <el-tab-pane
                :label="$t('M.finance_invest') + $t('M.finance_recode')"
                name="1"
              >
                <!-- 暂无数据 -->
                <el-table
                  :data="investList"
                  style="width: 100%;"
                  :empty-text="$t('M.comm_no_data')"
                >
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                  >
                  </el-table-column>
                  <!--存币方案-->
                  <el-table-column
                    :label="$t('M.finance_invest_style')"
                  >
                    <template slot-scope="s">
                      <div v-if="language === 'zh_CN' || language === 'zh_TW'" :title="s.row.typeDescription">{{s.row.typeDescription}}</div>
                      <div v-else :title="s.row.typeDescription">{{s.row.typeEnglishDescription}}</div>
                    </template>
                  </el-table-column>
                  <!-- 类型 -->
                  <el-table-column
                    :label="$t('M.otc_cancelOrder_type')"
                  >
                    <template slot-scope="s">
                      <div v-show="s.row.financialState == 'CURRENT'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">活期</span>
                        <span v-else>Current</span>
                      </div>
                      <div v-show="s.row.financialState == 'PERIODICAL'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">定期</span>
                        <span v-else>Regular</span>
                      </div>
                      <div v-show="s.row.financialState == 'REGULARMONTHLYRETURN'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">定期月返</span>
                        <span v-else title="Regular monthly return">Regular monthly return</span>
                      </div>
                      <div v-show="s.row.financialState == 'EQUAL_PRINCIPAL'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">等额本金</span>
                        <span v-else title="Equivalent principal">Equivalent principal</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 数量 -->
                  <el-table-column
                    prop="number"
                    :label="$t('M.comm_count')"
                  >
                  </el-table-column>
                  <!-- 已返还本金 -->
                  <el-table-column
                    :label="$t('M.finance_return_principal')"
                  >
                    <template slot-scope="s">
                      <div>
                        {{s.row.sendBackPrincipal ? (s.row.sendBackPrincipal-0).toFixed(4) : '/' }}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 预计收益 -->
                  <el-table-column
                    width="100"
                    :label="$t('M.finance_predict') + $t('M.finance_earnings')"
                  >
                    <template slot-scope="s">
                      <div>
                        {{(s.row.expectedEarning-0).toFixed(4)}}
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 预计发放时间 -->
                  <el-table-column
                    prop="expectedTime"
                    width="150"
                    :label="$t('M.finance_predict_send_time')"
                  >
                  </el-table-column>
                  <!-- 状态 prop="state" width="80"-->
                  <el-table-column
                    :label="$t('M.comm_state')"
                  >
                    <template slot-scope="s">
                      <!-- <div>{{s.row.state}}</div> -->
                      <div v-show="s.row.state === 'FREEZE'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">冻结</span>
                        <span v-else>Freeze</span>
                      </div>
                      <div v-show="s.row.state === 'FINISHED'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">已完成</span>
                        <span v-else>Finished</span>
                      </div>
                      <div v-show="s.row.state === 'CANCEL'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">已取消</span>
                        <span v-else>Cancel</span>
                      </div>
                      <!--违约结算-->
                      <div v-show="s.row.state === 'DEFAULT_CLEARING'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">违约结算</span>
                        <span v-else title="Default clearing">Default clearing</span>
                      </div>
                    </template>
                  </el-table-column>
                  <!-- 创建时间 -->
                  <el-table-column
                    prop="createTime"
                    width="150"
                    :label="$t('M.finance_createTime')"
                  >
                  </el-table-column>
                  <!-- 操作 -->
                  <el-table-column
                    prop="operations"
                    :label="$t('M.otc_index_operate')"
                  >
                    <template slot-scope = "s">
                      <div
                        v-if="s.row.financialState === 'CURRENT' && s.row.state !== 'CANCEL' && s.row.state != 'DEFAULT_CLEARING'"
                        class="blue cancelBtn"
                        @click="cancelInvest(s.row.id)"
                      >
                        <!-- 取消 -->
                        {{$t('M.comm_cancel')}}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination
                  background
                  v-if="investTotal > 10 && this.activeName == '1'"
                  layout="prev, pager, next"
                  @current-change='changeInvestPage'
                  :current-page = 'investCurrentPage'
                  :page-count.sync = 'investTotalPages'
                >
                </el-pagination>
              </el-tab-pane>
              <!-- 收益记录 -->
              <el-tab-pane
                :label="$t('M.finance_earnings') + $t('M.finance_recode')"
                name="2"
              >
                <!-- @您还没有登陆,请登录或者注册之后查看！ -->
                <div
                  v-if = "!isLogin"
                  class = 'finance-tips-box'
                >
                  {{$t('M.finance_loginTips')}}
                  <router-link to='/login'>
                    {{$t('M.comm_login')}}
                  </router-link>
                  {{$t('M.finance_or')}}
                  <router-link to = '/register'>
                    {{$t('M.comm_register_time')}}
                  </router-link>
                  {{$t('M.finance_loginTipsTwo')}}
                </div>
                <!-- 暂无数据 -->
                <el-table
                  :data="userInterestRecord"
                  style="width: 100%;"
                  :empty-text="$t('M.comm_no_data')"
                >
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                  >
                  </el-table-column>
                  <!-- 存币类型 prop="description" :prop="language === 'zh_CN' || language === 'zh_TW'? typeDescription : typeEnglishDescription"-->
                  <!--存币类型-->
                  <el-table-column
                    :label="$t('M.finance_invest') + $t('M.otc_cancelOrder_type')"
                  >
                    <template slot-scope="s">
                      <div v-if="language === 'zh_CN' || language === 'zh_TW'" :title="s.row.typeDescription">{{s.row.typeDescription}}</div>
                      <div v-else :title="s.row.typeEnglishDescription">{{s.row.typeEnglishDescription}}</div>
                    </template>
                  </el-table-column>
                  <!-- 数量 -->
                  <el-table-column
                    prop="number"
                    :label="$t('M.comm_count')"
                  >
                  </el-table-column>
                  <!-- 预计收益 -->
                  <el-table-column
                    prop="expectedEarning"
                    :label="$t('M.finance_predict') + $t('M.finance_earnings') + '(' + $t('M.finance_capital') + '/' + $t('M.finance_accrual') + ')'"
                  >
                  </el-table-column>
                  <!-- 发放收益 -->
                  <el-table-column
                    prop="interest"
                    :label="$t('M.finance_grant') + $t('M.finance_earnings') + '(' + $t('M.finance_capital') + '/' + $t('M.finance_accrual') + ')'"
                  >
                  </el-table-column>
                  <!-- 发放时间 -->
                  <el-table-column
                    prop="createTime"
                    :label="$t('M.finance_releaseTime')"
                  >
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <!-- 分页 -->
              <el-pagination
                background
                v-if="interestTotal > 10 && this.activeName == '2'"
                layout="prev, pager, next"
                @current-change='changeInterestPage'
                :current-page.sync = "interestCurrentPage"
                :page-count='interestTotalPages'
              >
              </el-pagination>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import FinanceBrokenLine from './FinanceBrokenLine'
import FinanceBrokenPie from './FinanceBrokenPie'
import IconFontCommon from '../Common/IconFontCommon'
import {mapState} from 'vuex'
import {timeFilter} from '../../utils'
import {getFinancialManagement, cancelInvestment} from '../../utils/api/investmentFinance'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
export default {
  components: {
    FinanceBrokenLine,
    FinanceBrokenPie,
    IconFontCommon
  },
  data () {
    return {
      // 设置存币记录当前页码
      investCurrentPage: 1,
      // 设置存币记录总页数
      investTotalPages: '',
      // 设置存币记录总条数
      investTotal: '',
      // 设置收益列表当前页码
      interestCurrentPage: 1,
      // 设置收益总页数
      interestTotalPages: '1',
      // 设置收益列表总条数
      interestTotal: '',
      // 默认显示存币列表
      activeName: '1',
      investList: [],
      // 收益列表
      userInterestRecord: [],
      coinId: this.$route.query.coinId,
      coinName: this.$route.query.coinName
    }
  },
  created () {
    this.getFinancialManagementList()
    // if (activeName == 1) {
    //   let historyPage = this.investCurrentPage
    //   this.changeInvestPage(historyPage)
    // } else {
    //   let historyPage = this.interestCurrentPage
    //   this.changeInterestPage(historyPage)
    // }
    console.log(this.$route.query)
  },
  mounted () {},
  activated () {},
  updated () {},
  methods: {
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 切换tab面板
    changeTab (e) {
      console.log(e.name)
      this.activeName = e.name
      if (this.activeName === '1') {
        this.getFinancialManagementList(this.investCurrentPage)
      }
      if (this.activeName === '2') {
        this.getFinancialManagementList(this.interestCurrentPage)
      }
    },
    // 点击存币记录列表下一页查寻
    changeInvestPage (pageNum) {
      this.investCurrentPage = pageNum
      // 重新获取列表
      this.getFinancialManagementList(this.investCurrentPage)
    },
    // 点击收益记录下一页查询
    changeInterestPage (pageNum) {
      this.interestCurrentPage = pageNum
      this.getFinancialManagementList(this.interestCurrentPage)
    },
    async getFinancialManagementList (pageNum) {
      const data = await getFinancialManagement({
        pageNum: pageNum,
        pageSize: 10,
        coinId: this.coinId,
        coinName: this.coinName
      })
      if (!data) return false
      let getData = getNestedData(data, 'data')
      if (this.activeName === '1') {
        // 存币记录列表赋值
        this.investList = getNestedData(getData, 'userFinancialManagementRecord.list')
        // 存币记录总页数
        this.investTotalPages = getNestedData(getData, 'userFinancialManagementRecord.pages')
        // 存币记录总条数
        this.investTotal = getNestedData(getData, 'userFinancialManagementRecord.total')
        // 从新赋值页码为当前页
        // this.investCurrentPage = pageNum
      } else if (this.activeName === '2') {
        // 收益记录列表
        this.userInterestRecord = getNestedData(getData, 'userInterestRecord.list')
        _.forEach(this.userInterestRecord, item => {
          let newArr = item.expectedEarning.split('/')
          let newInterest = item.interest.split('/')
          item.expectedEarning = (newArr[0] - 0).toFixed(4) + '/' + (newArr[1] - 0).toFixed(4)
          item.interest = (newInterest[0] - 0).toFixed(4) + '/' + (newInterest[1] - 0).toFixed(4)
        })
        // 收益记录总页数
        this.interestTotalPages = getNestedData(getData, 'userInterestRecord.pages')
        // 收益记录总条数
        this.interestTotal = getNestedData(getData, 'userInterestRecord.total')
        // 重新赋值收益列表在当前页
        // this.interestCurrentPage = pageNum
      }
    },
    // 点击取消按钮执行
    async clickCancelInvestment (id) {
      const data = await cancelInvestment(id)
      if (!data) return false
      this.getFinancialManagementList(this.investCurrentPage)
    },
    cancelInvest (id) {
      // 用户点击取消按钮需要请求接口
      // this.clickCancelInvestment(id)
      // 增加二次确认弹出框
      this.$confirm(this.$t('M.finance_tipsContentOne'), {
        confirmButtonText: this.$t('M.comm_confirm'), // 确定
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.clickCancelInvestment(id)
        // this.$message({
        //   type: 'success',
        //   message: '下架成功!'
        // })
      }).catch(() => {
        // this.$message({
        //   type: 'success',
        //   message: this.$t('M.comm_already') + this.$t('M.comm_cancel') + this.$t('M.otc_adMange_adverting') // 已取消下架
        // })
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin,
      // 当前选中语言
      language: state => state.common.language,
      clientWidth: state => state.common.clientWidth
    }),
    screenWidth () {
      return this.clientWidth / 3
    }
  },
  watch: {
    language (newVal) {
      console.log('当前选中语言')
      console.log(newVal)
      this.getFinancialManagementList()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .finance-box {
    width: 100%;
    min-width: 1300px;
    height: 100%;

    > .inner-box {
      display: flex;
      width: 100%;

      > .finance-inner {
        width: 1100px;
        margin: 0 auto;

        > .invest-list {
          margin-top: 100px;
          margin-bottom: 200px;

          > .invest-list-body {
            position: relative;

            > .goBackInvest {
              position: absolute;
              z-index: 10;
              top: 7px;
              right: 0;
              font-size: 14px;
            }
          }
        }
      }
    }

    /deep/ {
      .el-tabs__active-bar {
        background: none !important;
      }

      .el-tabs__nav {
        width: 300px;
        padding: 0 0 0 26px;
        font-weight: bold;
        color: rgba(97, 116, 153, 1);
        background: linear-gradient(90deg, rgba(34, 80, 135, 1), transparent);
      }

      .el-tabs__nav-wrap {
        &::after {
          height: 0;
          content: "";
        }
      }

      .el-tabs__item {
        font-size: 16px;
        color: #617499;

        &.is-active {
          color: #fff;
        }

        &:hover {
          color: #fff;
        }
      }

      .el-tabs__header {
        margin-bottom: 0;
      }

      .invest-list-body {
        .el-table {
          font-size: 12px;
          color: #a9bed4;
          background: #1c1f32;
          box-shadow: 0 4px 6px rgba(25, 30, 40, .5);

          th {
            border-top: 1px solid #a9bed4;
            color: #617499;
            background: #1c1f32;
            box-shadow: 0 4px 6px rgba(25, 30, 40, .5);

            &.is-leaf {
              &:first-of-type {
                border-bottom-left-radius: 4px;
              }

              &:last-of-type {
                border-bottom-right-radius: 4px;
              }
            }
          }

          tr {
            background: transparent;
          }

          td {
            background: transparent;
          }
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background: #1e2636;
                }
              }
            }
          }
        }
      }

      .el-table__body-wrapper {
        min-height: 480px;
      }

      .el-table__header {
        margin-bottom: 10px;
      }

      .el-table th {
        padding: 8px 0;
      }

      .el-button {
        border: none;
      }

      .el-table__empty-block {
        height: 480px;
        line-height: 480px;
      }

      .el-form-item__label {
        color: #8c99b4 !important;
      }
    }

    &.night {
      > .inner-box {
        background-color: $mainNightBgColor;
      }

      /deep/ {
        .invest-list-body {
          .el-table {
            th {
              &.is-leaf {
                border-bottom: 1px solid #1d2531;

                &:first-of-type {
                  border-bottom-left-radius: 4px;
                }

                &:nth-last-of-type(2) {
                  border-bottom-right-radius: 4px;
                }
              }
            }

            td {
              border-bottom: 1px solid #1d2531;
            }

            td div {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }

        .el-table__header {
          box-shadow: 4px 0 4px 4px rgba(25, 30, 40, 1);
        }
      }
    }

    &.day {
      > .inner-box {
        background-color: #fff;
      }

      /deep/ {
        .el-table__header {
          margin-top: 2px;
          box-shadow: 0 0 4px rgba(51, 143, 245, .5);
        }

        .invest-list-body {
          .el-table {
            color: #666;
            background: transparent;
            box-shadow: 0 0 0 rgba(25, 30, 40, .5);

            td {
              border-top: 1px solid #fff;
              border-bottom: 1px solid rgba(169, 190, 212, .2);
              box-shadow: none;
            }

            th {
              border-top: 1px solid rgba(234, 244, 254, 1);
              border-bottom: 1px solid rgba(234, 244, 254, 1);
              color: #617499;
              background: #eaf4fe;
              box-shadow: 0 0 0 rgba(25, 30, 40, .5);

              &.is-leaf {
                border-top: 1px solid #fff;
                border-bottom: 1px solid rgba(169, 190, 212, .2);
                box-shadow: none;

                &:first-of-type {
                  border-left: 1px solid rgba(51, 143, 245, .1);
                  border-bottom-left-radius: 4px;
                }

                &:nth-last-of-type(2) {
                  border-bottom-right-radius: 4px;
                  border-right: 1px solid rgba(51, 143, 245, .1);
                }
              }
            }
          }

          .el-table--enable-row-hover {
            .el-table__body {
              tr {
                &:hover {
                  > td {
                    background: #eaf4fe;
                  }
                }
              }
            }
          }

          .el-tabs__nav {
            width: 300px;
            font-weight: bold;
            color: #617499;
            background: linear-gradient(90deg, rgba(51, 143, 245, .8), transparent);
          }
        }

        .el-tabs__item {
          &.is-active {
            color: #338ff5;
          }
        }
      }
    }

    .cancelBtn {
      cursor: pointer;
    }

    .blue {
      color: #338ff5;
    }
  }
</style>
