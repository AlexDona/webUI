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
          <div class="nvest-list-body">
            <div class="gobackInvest">
              <IconFontCommon
                class='blue'
                iconName="icon-fanhui"
                style="font-size:12px"
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
                class = 'financeTsipsBox'
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
                  style="width: 100%"
                  :empty-text="$t('M.comm_no_data')"
                  v-loading="loading"
                  element-loading-background="rgba(0, 0, 0, 0.6)"
                >
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                    width="110"
                  >
                  </el-table-column>
                  <!-- 存币类型 prop="typeDescription" :prop="language === 'zh_CN' || language === 'zh_TW'? typeDescription : typeEnglishDescription"-->
                  <el-table-column
                    :label="$t('M.finance_invest') + $t('M.otc_cancelOrder_type')"
                  >
                    <template slot-scope="s">
                      <div v-if="language === 'zh_CN' || language === 'zh_TW'">{{s.row.typeDescription}}</div>
                      <div v-else>{{s.row.typeEnglishDescription}}</div>
                    </template>
                  </el-table-column>
                  <!-- 数量 -->
                  <el-table-column
                    prop="number"
                    width="100"
                    :label="$t('M.comm_count')"
                  >
                  </el-table-column>
                  <!-- 预计收益 -->
                  <el-table-column
                    prop="expectedEarning"
                    :label="$t('M.finance_predict') + $t('M.finance_earnings')"
                  >
                  </el-table-column>
                  <!-- 预计发放时间 -->
                  <el-table-column
                    prop="expectedTime"
                    width="150"
                    :label="$t('M.finance_predict') + $t('M.finance_releaseTime')"
                  >
                  </el-table-column>
                  <!-- 已发放收益-->
                  <el-table-column
                    prop="profit"
                    width="150"
                    :label="$t('M.finance_paid_income')"
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
                      <div v-show="s.row.state === 'CURRENT'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">活期</span>
                        <span v-else>Current</span>
                      </div>
                      <div v-show="s.row.state === 'REGULARMONTHLYRETURN'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">定期月返</span>
                        <span v-else>Regular monthly return</span>
                      </div>
                      <div v-show="s.row.state === 'PERIODICAL'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">定期</span>
                        <span v-else>Regular</span>
                      </div>
                      <div v-show="s.row.state === 'IS_DISTRIBUTE'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">发放收益</span>
                        <span v-else>Distribute</span>
                      </div>
                      <div v-show="s.row.state === 'UNDISTRIBUTE'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">未发放收益</span>
                        <span v-else>Undistribute</span>
                      </div>
                      <div v-show="s.row.state === 'FINISHED'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">已完成</span>
                        <span v-else>Finished</span>
                      </div>
                      <div v-show="s.row.state === 'CANCEL'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">已取消</span>
                        <span v-else>Cancel</span>
                      </div>
                      <div v-show="s.row.state === 'AUTHENTICATION'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">已认证</span>
                        <span v-else>Authentication</span>
                      </div>
                      <div v-show="s.row.state === 'UNAUTHENTICATION'">
                        <span v-if="language === 'zh_CN' || language === 'zh_TW'">未认证</span>
                        <span v-else>Unauthentication</span>
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
                    width="80"
                    prop="operations"
                    :label="$t('M.otc_index_operate')"
                  >
                    <template slot-scope = "s">
                      <div
                        v-if="s.row.state == 'CURRENT'"
                        class="blue cancelBtn"
                        @click="cancleInvest(s.row.id)"
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
                  page-size='10'
                  @current-change='changeInvestPage'
                  :current-page = 'investCurrnetPage'
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
                  class = 'financeTsipsBox'
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
                  style="width: 100%"
                  :empty-text="$t('M.comm_no_data')"
                  v-loading="loading"
                  element-loading-background="rgba(0, 0, 0, 0.6)"
                >
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                    width="150"
                  >
                  </el-table-column>
                  <!-- 存币类型 prop="description" :prop="language === 'zh_CN' || language === 'zh_TW'? typeDescription : typeEnglishDescription"-->
                  <el-table-column
                    :label="$t('M.finance_invest') + $t('M.otc_cancelOrder_type')"
                  >
                    <template slot-scope="s">
                      <div v-if="language === 'zh_CN' || language === 'zh_TW'">{{s.row.typeDescription}}</div>
                      <div v-else>{{s.row.typeEnglishDescription}}</div>
                    </template>
                  </el-table-column>
                  <!-- 数量 -->
                  <el-table-column
                    prop="number"
                    width="100"
                    :label="$t('M.comm_count')"
                  >
                  </el-table-column>
                  <!-- 预计收益 -->
                  <el-table-column
                    prop="expectedEarning"
                    :label="$t('M.finance_predict') + $t('M.finance_earnings')"
                  >
                  </el-table-column>
                  <!-- 发放收益 -->
                  <el-table-column
                    prop="interest"
                    :label="$t('M.finance_grant') + $t('M.finance_earnings')"
                  >
                  </el-table-column>
                  <!-- 发放时间 -->
                  <el-table-column
                    prop="createTime"
                    width="150"
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
                :current-page.sync = 'interestCurrnetPage'
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
import {getFinancialManagement, cancleInvestment} from '../../utils/api/OTC'
import {returnAjaxMsg, getNestedData} from '../../utils/commonFunc'
export default {
  components: {
    FinanceBrokenLine,
    FinanceBrokenPie,
    IconFontCommon
  },
  data () {
    return {
      loading: true,
      // 设置存币记录当前页码
      investCurrnetPage: '1',
      // 设置存币记录总页数
      investTotalPages: '',
      // 设置存币记录总条数
      investTotal: '',
      // 设置收益列表当前页码
      interestCurrnetPage: '1',
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
    require('../../../static/css/list/InvestmentFinance/FinanceCenter.css')
    require('../../../static/css/theme/day/InvestmentFinance/FinanceCenterDay.css')
    require('../../../static/css/theme/night/InvestmentFinance/FinanceCenterNight.css')
    this.getFinancialManagementList()
    // if (activeName == 1) {
    //   let historyPage = this.investCurrnetPage
    //   this.changeInvestPage(historyPage)
    // } else {
    //   let historyPage = this.interestCurrnetPage
    //   this.changeInterestPage(historyPage)
    // }
    console.log(this.$route.query)
  },
  mounted () {},
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
  aftereRouteUpdate () {
    window.scrollTo(0, 0)
  },
  methods: {
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 切换tab面板
    changeTab (e) {
      console.log(e.name)
      this.activeName = e.name
      if (this.activeName == '1') {
        this.getFinancialManagementList(this.investCurrnetPage)
      }
      if (this.activeName == '2') {
        this.getFinancialManagementList(this.interestCurrnetPage)
      }
    },
    // 点击存币记录列表下一页查寻
    changeInvestPage (pageNum) {
      console.log(pageNum)
      this.investCurrnetPage = pageNum
      console.log(this.investCurrnetPage)
      // 重新获取列表
      this.getFinancialManagementList(this.investCurrnetPage)
    },
    // 点击收益记录下一页查询
    changeInterestPage (pageNum) {
      console.log(pageNum)
      this.interestCurrnetPage = pageNum
      this.getFinancialManagementList(this.interestCurrnetPage)
    },
    async getFinancialManagementList (pageNum) {
      this.loading = true
      const data = await getFinancialManagement({
        pageNum: pageNum,
        pageSize: 10,
        coinId: this.coinId,
        coinName: this.coinName
      })
      console.log('存币理财页面查询')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        this.loading = false
        return false
      } else {
        this.loading = false
        // let getData = data.data.data
        let getData = getNestedData(data, 'data.data')
        if (this.activeName == '1') {
          // 存币记录列表赋值
          this.investList = getData.userFinancialManagementRecord.list
          // 存币记录总页数
          this.investTotalPages = getData.userFinancialManagementRecord.pages
          // 存币记录总条数
          this.investTotal = getData.userFinancialManagementRecord.total
          // 从新赋值页码为当前页
          // this.investCurrnetPage = pageNum
        } else if (this.activeName == '2') {
          // 收益记录列表
          this.userInterestRecord = getData.userInterestRecord.list
          // 收益记录总页数
          this.interestTotalPages = getData.userInterestRecord.pages
          // 收益记录总条数
          this.interestTotal = getData.userInterestRecord.total
          // 重新赋值收益列表在当前页
          // this.interestCurrnetPage = pageNum
        }
      }
    },
    // 点击取消按钮执行
    async clickCancleInvestment (id) {
      const data = await cancleInvestment(id)
      console.log('用户取消按钮')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 重新请求币种接口刷新列表 把当前页码传过去
        this.getFinancialManagementList(this.investCurrnetPage)
      }
    },
    cancleInvest (id) {
      // 用户点击取消按钮需要请求接口
      // this.clickCancleInvestment(id)
      // 增加二次确认弹出框-任付伟
      this.$confirm(this.$t('M.finance_tipsContentOne'), {
        confirmButtonText: this.$t('M.comm_confirm'), // 确定
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.clickCancleInvestment(id)
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
      language: state => state.common.language // 当前选中语言
    }),
    screenWidth () {
      return window.innerWidth / 3
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
<style scoped lang="scss">
  @import "../../../static/css/scss/InvestmentFinance/FinanceCenter";

  .finance-box{
    width:100%;
    min-width:1300px;
    height:100%;

    >.banner-box{
      background:#121824 url('../../assets/finance/banner.png') no-repeat center center/100% 100%;
    }

    >.inner-box{
      display:flex;
      width:100%;

      >.finance-inner{
        width: 1100px;
        margin: 0 auto;

        >.invest-list{
          margin-top:100px;
          margin-bottom:200px;

          >.invest-list-header{
            display: flex;
            justify-content: space-between;

            a{
              line-height: 57px;
              cursor: pointer;
            }
          }

          >.nvest-list-body{
            position: relative;

            >.gobackInvest{
              position: absolute;
              z-index: 10;
              top:25px;
              right: 0;
            }

            .financeTsipsBox{
              position: absolute;
              z-index: 10;
              top: 55px;
              left: 0;
              width: 100%;
              height: 100%;
              line-height:200px;
              text-align: center;

              >a{
                color: #338ff5;
              }
            }
          }
        }
      }
    }

    &.night{
      >.inner-box{
        background-color: $nightInnerBoxBg;
      }
    }

    &.day{
      >.inner-box{
        background-color: #fff;
      }

      .invest{
        color: #338ff5;
        background:linear-gradient(left,rgba(51,143,245,.5),transparent);
      }
    }

    .goback-icon{
      margin-right:5px;
      font-size: 16px;
    }

    .cancelBtn{
      cursor: pointer;
    }

    .blue{
      color: #338ff5;
    }

    .green{
      color: #008069;
    }

    .red{
      color:#d45858;
    }

    .nav-header{
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color:#fff;
    }

    .invest{
      width: 150px;
      padding:14px 0 14px 26px;
      font-size: 22px;
      color: #fff;
      background:linear-gradient(left,rgba(34,80,135,1),transparent);
    }
  }
</style>
