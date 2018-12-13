<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 1.0 banner -->
    <div class="banner-box">
      <img src="../../assets/finance/banner.png">
      <div class="banner-title">
        <!-- 存币收益 -->
        {{$t('M.comm_finance_center')}}
      </div>
    </div>
    <div
      class="inner-box"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0,0,0,0.6)"
    >
      <!-- 2.0 币种类型 -->
      <div class="finance-inner">
        <div class="container">
        <div class="finance-form-header">
          <el-select
            :placeholder="$t('M.comm_please_choose')"
            :no-data-text="$t('M.comm_no_data')"
            v-model="selectedCoinId"
            @change="changeTraderCoin"
          >
            <el-option
              v-for="(item,index) in traderCoinList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <ul class="newnestPrice">
            <li>
              <p class="newnestPriceColor">
                {{newnestPrice}}<span>USDT</span>
              </p>
              <!-- 最新价钱 -->
              {{$t('M.finance_newestPrice')}}
            </li>
            <li>
              <p class="green">
                {{dayAmountIncrease}}<span>USDT</span>
              </p>
              <!-- 当日涨幅 -->
              {{$t('M.finance_date')}}{{$t('M.finance_increase')}}
            </li>
            <li v-if='this.historyAmountIncrease'>
              <p class="red">{{historyAmountIncrease}}</p>
              <!-- 历史涨幅 -->
              {{$t('M.finance_history')}}{{$t('M.finance_increase')}}
            </li>
          </ul>
        </div>
        <!-- 3.0 中间图表 -->
        <FinanceBrokenLine ref="childLineCharts"/>
        </div>
        <!-- 4.0 存币 -->
        <div class="finance-inner-box">
          <div class="left">
            <div class="nav-header">
              <!-- 存币 -->
              <div class="invest">{{$t('M.finance_invest')}}</div>
              <!-- 可用余额 -->
              <div class="balance">
                {{$t('M.finance_useBalance')}}&nbsp;:&emsp;
                <div>{{isLogin ? availableBalance : '--'}}
                  <span> {{selecteCoindName}}</span>
                </div>
              </div>
            </div>
            <div class="left-body">
              <label for="">
                <!-- 存币类型 -->
                <span class="label-title">{{$t('M.finance_invest_style')}}:&nbsp;</span>
                <el-select
                  :placeholder="$t('M.comm_please_choose')"
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="selectedInvestTypeId"
                  @change="electedInvestTypeDisc"
                >
                  <el-option
                    v-for="(item,index) in investTypeList"
                    :key="index"
                    :label="language === 'zh_CN' || language === 'zh_TW'? item.typeDescription : item.typeEnglishDescription"
                    :value="item.id"
                  >
                  <!-- 任增加存币类型国际化 -->
                  <!-- :label="language === 'zh_CN' || language === 'zh_TW'? item.typeDescription : item.typeEnglishDescription" -->
                  </el-option>
                </el-select>
              </label>
              <label for="">
                <!-- 存币数量 -->
                <span class="label-title">{{$t('M.finance_invest')}}{{$t('M.comm_count')}}:&nbsp;</span>
                <div class='invest-mounte'>
                  <!-- 请输入数量 -->
                  <input
                    v-model="investMounte"
                    :placeholder="$t('M.finance_input_sum')"
                    @keyup="changeInvestMounte"
                    onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                    onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                  >
                  <strong>{{selecteCoindName}}</strong>
                </div>
              </label>
              <!-- 您存币的币种数量已超过该币种的总资产 -->
              <div
                class="totalTipsPositon"
                v-if="isShow"
              >
                {{$t('M.finance_errorTips')}}
              </div>
              <label for=" ">
                <div class='submitBtn'>
                  <el-button
                  plain
                  @click="getInvestEarnings"
                  >
                  <!-- 立刻存币 -->
                  {{$t('M.finance_at_once_save')}}
                  </el-button>
                </div>
              </label>
              <!-- 存币详情 -->
              <el-dialog
                :title="$t('M.finance_save_moneydetail')"
                :visible.sync="dialogVisible"
                width="440px"
                class='dialogStyle'
                :before-close="handleClose"
              >
                <el-form
                  :label-position="right"
                  label-width="90px"
                  :model="formLabelAlign"
                >
                  <!-- 存币时长 -->
                  <el-form-item
                    :label="$t('M.finance_timeLong')"
                    class='saveTime'
                  >
                    {{getDate(-2)}} {{$t('M.finance_leit')}} {{getDate(formLabelAlign.day)}}
                    <span class="blue">({{formLabelAlign.day}}{{$t('M.finance_day')}})</span>
                    <!-- {{formLabelAlign.createTime}} 至 {{formLabelAlign.endDate}}<span class="blue">({{formLabelAlign.day}}天)</span> -->
                  </el-form-item>
                  <!-- 存币数量 -->
                  <el-form-item
                    :label="$t('M.comm_count')"
                  >
                    <div class='invest-mounte'>
                      <el-input
                        v-model="formLabelAlign.number"
                        class="red"
                        @input="changeAlignNumber"
                      >
                      </el-input>
                      <strong>{{selecteCoindName}}</strong>
                    </div>
                  </el-form-item>
                  <!-- 利率 -->
                  <el-form-item
                    :label="$t('M.news_year') + $t('M.finance_interestRate') + '(%)'"
                  >
                    <div class='invest-mounte'>
                      <el-input
                        v-model="interestRateValue"
                        disabled
                      >
                      </el-input>
                    </div>
                  </el-form-item>
                  <!-- 预计总收益 -->
                  <el-form-item
                    :label="$t('M.finance_total_income')"
                  >
                    <div class='invest-mounte'>
                      <el-input
                        v-model="formLabelAlign.expectedEarning"
                        disabled
                      >
                      </el-input>
                      <strong>{{selecteCoindName}}</strong>
                    </div>
                  </el-form-item>
                  <!-- 收益发放 -->
                  <el-form-item
                  :label="$t('M.finance_earnings') + $t('M.finance_grant')"
                  >
                    <div class='invest-mounte'>
                      <!-- 先息后本 -->
                      <el-input
                        :value="$t('M.finance_xiAndben')"
                        disabled
                      >
                      </el-input>
                      <span
                        class='dividend-tips'
                        @click="showDividendTime = !showDividendTime"
                      >
                      !
                      </span>
                    </div>
                  </el-form-item>
                </el-form>
                <div class="show-dividend-time-list">
                  <transition name="el-fade-in-linear">
                    <ul v-show='showDividendTime'>
                      <li
                        v-for="(item,index) in formLabelAlign.jsonTimeline"
                        :key="index"
                      >
                        <span>{{item.date}}</span>
                        <span class="blue">{{item.amount}}</span>
                        <span class='blue'>{{selecteCoindName}}</span>
                        <span>
                          ({{index == formLabelAlign.jsonTimeline.length - 1 ? $t('M.finance_capital') + '+' + $t('M.finance_accrual') : $t('M.finance_accrual')}})
                        </span>
                      </li>
                    </ul>
                  </transition>
                </div>
                <span
                  slot="footer"
                  class="dialog-footer"
                >
                  <!-- 取消 -->
                  <el-button @click="dialogCancel">
                    {{$t('M.comm_cancel')}}
                  </el-button>
                  <!-- 确定 -->
                  <el-button
                    type="primary"
                    :disabled="stopClick"
                    @click="dialogSuer"
                  >
                    {{$t('M.comm_affirm')}}
                  </el-button>
                </span>
              </el-dialog>
              <button></button>
            </div>
          </div>
          <!-- 我的存币 -->
          <div class="right">
            <div class="nav-header">
              <!-- 我的存币 -->
              <div class="invest">
                {{$t('M.finance_mine')}}{{$t('M.finance_invest')}}
              </div>
            </div>
            <div class="pieCharts-box">
                <div class="right-infor">
                  <!-- 存币估值 -->
                <div>
                  {{$t('M.finance_invest_estimatedValue')}}
                  <p class="green">
                    <span>{{isLogin ? InvestmentValue : '--'}}</span>
                    USDT
                  </p>
                </div>
                <!-- 历史收益 -->
                <div>
                  {{$t('M.finance_history')}}{{$t('M.finance_earnings')}}
                  <p class="red2">
                    <span>{{isLogin ? getMoneyValue : '--'}}</span>
                    USDT
                  </p>
                </div>
            </div>
            <div class="pieCharts">
              <FinanceBrokenPie
                :investment-value = 'InvestmentValue'
                :get-money-value = 'getMoneyValue'
              />
            </div>
          </div>
          </div>
        </div>
        <!-- 5.0 存币记录和收益记录 -->
        <div class="invest-list">
          <div class="nvest-list-body">
            <div class='showAll'>
              <router-link
                class="blue"
                :to="{path: isLogin ? '/FinanceInvestmentRecord' : '/login', query:{coinId:selectedCoinId,coinName:selecteCoindName}}"
              >
                <!--查看全部-->
                {{ $t('M.investment_look_all') }}
              </router-link>
            </div>
            <el-tabs
              v-model="activeName"
              @tab-click="handleClick"
            >
              <!-- 5.1 存币记录 -->
              <el-tab-pane
                :label="$t('M.finance_save_coin_record')"
                name="1"
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
                  <!-- 存币类型 -->
                  <!-- 任增加存币类型国际化 -->
                  <!-- :prop="language === 'zh_CN' || language === 'zh_TW'? typeDescription : typeEnglishDescription" -->
                  <el-table-column
                    :label="$t('M.finance_invest_style')"
                  >
                    <template slot-scope="s">
                      <div v-if="language === 'zh_CN' || language === 'zh_TW'">{{s.row.typeDescription}}</div>
                      <div v-else>{{s.row.typeEnglishDescription}}</div>
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
                    :label="$t('M.finance_predict_earnings')"
                  >
                  </el-table-column>
                  <!-- 预计发放时间 -->
                  <el-table-column
                    prop="expectedTime"
                    width="135"
                    :label="$t('M.finance_predict_send_time')"
                  >
                  </el-table-column>
                  <!-- 已发放收益-->
                  <el-table-column
                    prop="profit"
                    :label="$t('M.finance_paid_income')"
                  >
                  </el-table-column>
                  <!-- 状态 prop="state" width="80"-->
                  <el-table-column
                    width="144"
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
                        <span v-else style="word-wrap:normal;">Regular monthly return</span>
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
                    width="135"
                    :label="$t('M.finance_createTime')"
                  >
                  </el-table-column>
                  <!-- 操作 -->
                  <el-table-column
                    prop="operations"
                    width="80"
                    :label="$t('M.otc_index_operate')"
                  >
                    <!-- 活期 -->
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
              </el-tab-pane>
              <!-- 5.2 收益记录 -->
              <el-tab-pane
                :label="$t('M.finance_get_money_record')"
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
                    width="150">
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
import {timeFilter} from '../../utils'
import {
  getFinancialManagement,
  imediateInvestment,
  cancleInvestment,
  getFinancialRecord
} from '../../utils/api/OTC'
import {getPushTotalByCoinId} from '../../utils/api/personal'
import {returnAjaxMsg, getNestedData} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('finance')
export default {
  components: {
    FinanceBrokenLine,
    FinanceBrokenPie
  },
  data () {
    return {
      newArrinvestTypeList: [],
      fullscreenLoading: false,
      // 选中币种的id
      selectedCoinId: '',
      // 选中币种的名称
      selecteCoindName: '',
      // 币种数组
      traderCoinList: [],
      // 存币数量
      investMounte: '',
      // 存币类型
      selectedInvestTypeId: '',
      selectedInvestTypeDiscri: '',
      // 存币类型列表
      investTypeList: [],
      // 默认显示存币记录
      activeName: '1',
      // 存币列表
      investList: [],
      // 收益列表
      userInterestRecord: [],
      // 默认数据条数
      pageSize: '10',
      // 当前页码
      currentPage: '1',
      // 总页数
      totalPages: '0',
      // 最新价钱
      newnestPrice: '',
      // 当日涨幅
      dayAmountIncrease: '',
      // 历史涨幅
      historyAmountIncrease: '',
      // 可用余额
      availableBalance: '',
      // 是否立刻存币显示立即存币错误提示
      isShow: false,
      // 存币估值
      InvestmentValue: 0,
      // 历史收益值
      getMoneyValue: 0,
      // 获取用户总资产
      userCoindTotal: '',
      // 走势图x轴数组
      renderTimeList: '',
      // 走势图y轴数组
      renderPriceList: '',
      // 点击立即存币弹窗默认隐藏
      dialogVisible: false,
      // 表单对象
      formLabelAlign: {
        // 数量
        amount: '',
        // 利率
        rate: '',
        // 总收益
        totalEarn: '',
        // 发放收益
        dividend: ''
      },
      // 收益时间列表隐藏
      showDividendTime: false,
      showDividendTimeList: [
        {
          time: '2018-10-15',
          interest: 2
        },
        {
          time: '2018-05-15',
          interest: 3
        },
        {
          time: '2018-6-15',
          interest: 3
        },
        {
          time: '2018-05-15',
          interest: 3
        },
        {
          time: '2018-6-15',
          interest: 3
        },
        {
          time: '2018-6-15',
          interest: 3
        }
      ],
      // n天后的时间
      brforeNtime: '',
      interestRateValue: '', // 年利率
      stopClick: false
    }
  },
  created () {
    // 页面创建完成请求币种接口
    this.getFinancialManagementList()
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'FINANCE_LINE_RENDER_TIME_LIST',
      'FINANCE_LINE_RENDER_PRICE_LIST',
      'FINANCE_LINE_STATUS'
    ]),
    // 将返回来的天数转换成日期
    getDate (n) {
      let ss = 24 * 60 * 60 * 1000
      let timeSteps = new Date().getTime() // 当前时间撮
      let date1 = new Date(timeSteps + (n + 2) * ss) // n天前的时间撮
      let newtime = date1.toLocaleString() // 将n天前的时间撮转换成当前日期
      let arr = newtime.split(' ') // 将精确到日的日期摘出来
      let arr1 = arr[0].split('/') // 将日期格式改变
      let arr2 = arr1[0] + (-arr1[1]) + (-arr1[2])
      return arr2
    },
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 键盘弹起时时触发
    changeInvestMounte (e) {
      if (this.isLogin) {
        if (e.target.value > this.userCoindTotal) {
          this.isShow = true
        } else {
          this.isShow = false
        }
      } else {
        this.isShow = false
        // this.$router.push({path: '/login'})
      }
    },
    // 输入金额改变时检测用户输入的币种总金额
    async getUserCoindTotal () {
      const data = await getPushTotalByCoinId({
        coinId: this.selectedCoinId
      })
      console.log('获取币种总资产')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 重新掉一次币种接口刷新列表
        // this.userCoindTotal = data.data.data.total
        this.userCoindTotal = getNestedData(data, 'data.data.total')
      }
    },
    // 点击立刻存币按钮执行
    getInvestEarnings () {
      // console.log(111.00)
      if (this.isLogin) {
        if (this.selectedInvestTypeId && this.investMounte) {
          if (this.isShow === false) {
            // 显示理财详情模态框前请求数据渲染模态框
            this.clickGetInvestEarnings()
            // 显示模态框
            this.dialogVisible = true
          } else {
            return false
          }
        } else {
          this.$message({
            // 存币类型或存币数量不能为空
            message: this.$t('M.finance_noemptyTips'),
            type: 'error'
          })
        }
      } else {
        this.$router.push({path: '/login'})
        return false
      }
    },
    // 点击取消按钮模态框关闭
    dialogCancel () {
      this.dialogVisible = false
    },
    // 点击确定按钮模态框关闭
    dialogSuer () {
      this.stopClick = true
      this.dialogVisible = false
      // 执行存币按钮
      this.clickImmediateInvestment()
    },
    // 模态框数字发生变化时需要执行的方法
    changeAlignNumber (e) {
      this.investMounte = e
      this.clickGetInvestEarnings()
    },
    // 理财记录模态框显示
    async clickGetInvestEarnings () {
      const data = await getFinancialRecord({
        financialManagementId: this.selectedInvestTypeId,
        number: this.investMounte
      })
      console.log('存币理财类型')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // this.formLabelAlign = data.data.data
        this.formLabelAlign = getNestedData(data, 'data.data')
        this.interestRateValue = (this.formLabelAlign.interestRate - 0) * 100
      }
    },
    // 添加理财记录
    async clickImmediateInvestment () {
      const data = await imediateInvestment({
        financialManagementId: this.selectedInvestTypeId,
        number: this.investMounte
      })
      console.log('存币理财类型')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 重新调一次币种接口刷新列表
        this.getFinancialManagementList()
        // 请求回来时将按钮解除禁用
        this.stopClick = false
        // 存币成功
        this.$message({
          message: this.$t('M.finance_invest') + this.$t('M.comm_success'),
          type: 'success'
        })
      }
    },
    // 存币理财页面币种查询
    async getFinancialManagementList () {
      // 任重写
      this.newArrinvestTypeList = []
      this.investTypeList = []
      this.selectedInvestTypeId = ''
      this.fullscreenLoading = true
      const data = await getFinancialManagement({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        coinId: this.selectedCoinId,
        coinName: this.selecteCoindName
      })
      console.log('存币理财页面查询')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        this.fullscreenLoading = false
        return false
      } else {
        // console.log(data)
        this.fullscreenLoading = false
        // let getData = Object.assign({}, data.data.data)
        // let getData = data.data.data
        let getData = getNestedData(data, 'data.data')
        // let getData = JSON.parse(JSON.stringify(data.data.data))
        // 设置可用币种数组
        this.traderCoinList = getData.idNameDtoList
        this.traderCoinList.forEach(item => {
          if (getData.idNameDtoList.id == item.id) {
            this.selectedCoinId = item.id
          }
        })
        // 设置每次返回回来的币种id
        if (!getData.tickerPriceResult.coinId) {
          this.selectedCoinId = ''
        } else {
          this.selectedCoinId = getData.tickerPriceResult.coinId
        }
        // 设置每次返回地币种名称
        this.selecteCoindName = getData.tickerPriceResult.coinName
        // 最新价钱
        this.newnestPrice = getData.tickerPriceResult.price
        // 当日涨幅
        this.dayAmountIncrease = getData.tickerPriceResult.chg
        // 历史涨幅
        this.historyAmountIncrease = getData.tickerPriceResult.historyAmountIncrease
        // 理财类型数组
        this.investTypeList = getData.managementList
        // 设置存币类型默认值
        // 任重写
        if (getData.managementList.length) {
          getData.managementList.forEach((item, index) => {
            if (item.state === 'ENABLED') {
              this.newArrinvestTypeList.push(item)
            }
          })
          this.investTypeList = this.newArrinvestTypeList
          this.selectedInvestTypeId = this.investTypeList[0].id
        }
        // 设置可用余额
        this.availableBalance = getData.userTotal
        // 存币估计值
        this.InvestmentValue = getData.userNumber
        // 历史收益
        this.getMoneyValue = getData.userInterest
        // 存币记录列表赋值
        this.investList = this.isLogin ? getData.userFinancialManagementRecord.list : ''
        // 收益记录列表
        this.userInterestRecord = this.isLogin ? getData.userInterestRecord.list : ''
        // 每次换一种币种就获取该币种的总资产
        if (this.isLogin) {
          this.getUserCoindTotal()
        }
        // 走势图x轴赋值
        this.FINANCE_LINE_RENDER_PRICE_LIST(getData.tickerPriceResult.renderPriceList)
        // 走势图y轴赋值
        this.FINANCE_LINE_RENDER_TIME_LIST(getData.tickerPriceResult.renderTimeList)
        // 设置状态只要发生请求就让状态改变
        this.FINANCE_LINE_STATUS(1)
        // 将存币数量输入框清空
        this.investMounte = ''
      }
    },
    // 用户取消存币接口
    async clickCancleInvestment (id) {
      const data = await cancleInvestment(id)
      console.log('用户取消按钮')
      console.log(data)
      if (!(returnAjaxMsg(data, this, 1))) {
        return false
      } else {
        // 重新请求币种接口刷新列表
        this.getFinancialManagementList()
      }
    },
    // 币种选择变化时赋值币种名称
    changeTraderCoin (e) {
      this.selectedCoinId = e
      this.traderCoinList.forEach(item => {
        if (item.id == e) {
          this.selecteCoindName = item.name
        }
      })
      // 改变币种重新请求接口
      this.getFinancialManagementList()
    },
    // 交易类型改变时执行
    electedInvestTypeDisc (e) {
      console.log(e)
      this.selectedInvestTypeId = e
      this.traderCoinList.forEach(item => {
        if (item.id == e) {
          // this.selectedInvestTypeDiscri = item.typeDescription
          // 任增加存币类型国际化
          if (this.language === 'zh_TW' || this.language === 'zh_CN') {
            this.selectedInvestTypeDiscri = item.typeDescription
          } else {
            this.selectedInvestTypeDiscri = item.typeEnglishDescription
          }
        }
      })
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
      financeLineRenderTimeList: state => state.finance.financeLineRenderTimeList,
      financeLineRenderPriceList: state => state.finance.financeLineRenderPriceList,
      // 获取当前语言
      language: state => state.common.language,
      status: state => state.finance.status
    }),
    screenWidth () {
      return window.innerWidth
    }
  },
  watch: {
    InvestmentValue (newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    language (newVal) {
      console.log('当前选中语言')
      console.log(newVal)
      this.getFinancialManagementList()
    }
  },
  destroyed () {
    this.$store.status = 0
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  /* 公共scss样式 */
  @import "../../../static/css/scss/InvestmentFinance/FinanceCenter";

  @media screen and (min-width: 768px) and (max-width: 1336px) {
    .banner-title {
      position: absolute;
      top: 50%;
      right: 25%;
      width: 400px;
      font-size: 40px;
      text-align: center;
      color: #fff;
    }
  }

  @media screen and (min-width: 1337px) and (max-width: 1920px) {
    .banner-title {
      position: absolute;
      top: 50%;
      right: 29%;
      width: 400px;
      font-size: 40px;
      text-align: center;
      color: #fff;
    }
  }

  @media screen and (min-width: 1921px) and (max-width: 2560px) {
    .banner-title {
      position: absolute;
      top: 50%;
      right: 32%;
      width: 400px;
      font-size: 40px;
      text-align: center;
      color: #fff;
    }
  }

  .finance-box {
    width: 100%;
    min-width: 1300px;
    margin-top: 66px;

    > .banner-box {
      position: relative;
      width: 100%;
      margin: 0 auto;

      img {
        width: 100%;
      }
    }

    > .inner-box {
      display: flex;
      width: 100%;

      > .finance-inner {
        width: 1100px;
        margin: 0 auto;

        > .container {
          padding: 100px 145px 0;

          > .finance-form-header {
            display: flex;
            width: 100%;

            > .newnestPrice {
              display: flex;
              flex: 1;
              height: 48px;

              > li {
                flex: 1;
                text-align: center;
                color: #a9bed4;
                border-right: 1px solid #1b2231;

                > p {
                  font-weight: bolder;
                  font-size: 22px;

                  > span {
                    font-size: 12px;
                  }
                }

                &:last-child {
                  border: none;
                }
              }
            }
          }
        }

        .finance-inner-box {
          display: flex;
          justify-content: space-between;

          > .left {
            width: 516px;
            color: #a9bed4;

            > .nav-header {
              > .balance {
                display: flex;
                padding-top: 10px;
                line-height: 30px;

                > div {
                  height: 24px;
                  font-weight: 600;
                  font-size: 24px;
                  color: #7cb8fa;
                  -webkit-box-reflect: below 0 -webkit-linear-gradient(-90deg, rgba(124, 184, 250, 0), rgba(124, 184, 250, .2));

                  > span {
                    font-size: 12px;
                  }
                }
              }
            }

            .left-body {
              padding-top: 58px;

              > label {
                display: flex;
                margin: 44px 0;
                line-height: 50px;

                > .label-title {
                  display: inline-block;
                  width: 120px;
                }

                > .invest-mounte {
                  display: flex;
                  justify-content: space-between;
                  width: 407px;
                  height: 48px;
                  padding: 13px 11px;
                  border: 1px solid rgba(169, 190, 212, 1);
                  border-radius: 2px;
                  line-height: 24px;

                  > input {
                    width: 380px;
                    vertical-align: center;
                    color: #fff;
                  }
                }

                .submitBtn {
                  > button {
                    width: 407px;
                    height: 48px;
                    margin-left: 110px;
                    border: 2px solid -webkit-linear-gradient(135deg, #2b396e, #2a5082);
                    text-align: center;
                    color: #fff;
                    background: -webkit-linear-gradient(45deg, #2b396e, #2a5082);
                  }
                }
              }
            }
          }

          > .right {
            width: 482px;
            color: #a9bed4;

            > .pieCharts-box {
              display: flex;

              > .right-infor {
                width: 245px;
                padding-top: 100px;
                overflow: hidden;

                > div {
                  margin-bottom: 30px;
                  line-height: 30px;

                  > p {
                    font-size: 12px;

                    > span {
                      font-weight: bolder;
                      font-size: 22px;
                    }
                  }
                }
              }

              > .pieCharts {
                width: 282px;
                padding-top: 50px;
              }
            }
          }
        }

        > .invest-list {
          margin-bottom: 200px;

          > .nvest-list-body {
            position: relative;

            > .showAll {
              position: absolute;
              z-index: 10;
              top: 25px;
              right: 0;
            }

            .finance-tips-box {
              position: absolute;
              z-index: 10;
              top: 55px;
              left: 0;
              width: 100%;
              height: 100%;
              line-height: 200px;
              text-align: center;

              > a {
                color: #338ff5;
              }
            }
          }
        }
      }
    }

    /deep/ {
      .finance-form-header {
        .el-input__inner {
          width: 168px;
          height: 48px;
          border: 1px solid #338ff5;
          border-radius: 2px;
          font-size: 20px;
          color: #338ff5;
          background: linear-gradient(180deg, rgba(51, 143, 245, .1) 0%);
          box-shadow: 0 2px 2px rgba(13, 17, 25, 1);
        }
      }

      .el-tabs__active-bar {
        background: none !important;
      }

      .el-tabs__nav {
        width: 300px;
        padding: 9px 0 9px 26px;
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
        font-size: 22px;
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

      .finance-inner-box {
        .left {
          .left-body {
            .el-input__inner {
              width: 407px;
              height: 48px;
              border: 1px solid #464e5f;
              border-radius: 2px;
              background: #1e2636;
            }
          }
        }

        .dialogStyle {
          .el-input__inner {
            width: 250px !important;
            height: 38px !important;
            border: none !important;
            line-height: 38px;
            background: transparent !important;
          }

          .el-input {
            width: 240px;
          }

          .invest-mounte {
            display: flex;
            justify-content: space-between;
            width: 280px;
            height: 38px;
            padding-right: 5px;
            border-radius: 5px;
            background: #20273d;

            &:focus {
              border: 1px solid #ccc;
            }
          }

          .el-button {
            width: 110px;
            height: 40px;
            border: 1px solid #338ff5;
            border-radius: 4px;
            color: #fff;
            background: none;
          }

          .el-dialog__footer {
            text-align: center;
          }

          .el-button--primary {
            margin-left: 40px;
            border: none;
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .el-dialog__wrapper {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, .5);
        }
      }

      .nvest-list-body {
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

      .el-button {
        border: none;
      }

      .el-table__empty-block {
        height: 480px;
        line-height: 480px;
      }

      .el-dialog {
        background: #28334a;
      }

      .el-dialog__header {
        background: #20293c;
        box-shadow: 0 1px 2px 0 rgba(29, 33, 49, 1);
      }

      .el-dialog__title {
        color: #fff;
      }

      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }

      .dialogStyle {
        .el-dialog__body {
          height: 380px;
          overflow: auto;
        }
      }

      .el-dialog__body {
        color: #8c99b4 !important;
      }

      .el-form-item__label {
        color: #8c99b4 !important;
      }
    }

    &.night {
      > .banner-box {
        background: #272b41;
      }

      > .inner-box {
        background-color: $nightInnerBoxBg;
      }

      /deep/ {
        .nvest-list-body {
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
          }
        }

        .el-table__header {
          box-shadow: 4px 0 4px 4px rgba(25, 30, 40, 1);
        }

        > .inner-box {
          > .finance-inner {
            > .invest-list {
              > .nvest-list-body {
                .finance-tips-box {
                  color: #617499;
                  background-color: #121824;
                }
              }
            }
          }
        }
      }
    }

    &.day {
      > .banner-box {
        background: #fff;
      }

      /deep/ {
        .inner-box {
          .finance-inner {
            .container {
              .finance-form-header {
                .el-input__inner {
                  background: #fff !important;
                  box-shadow: inset 1px 0 3px rgba(51, 143, 245, 1);
                }

                .newnestPrice {
                  display: flex;
                  flex: 1;
                  height: 48px;

                  .newnestPriceColor {
                    color: #000;
                  }

                  li {
                    border-right: 1px solid rgba(30, 38, 54, .3);
                    color: #666;

                    p {
                      font-size: 22px;

                      &:last-child {
                        border: none;
                      }

                      span {
                        font-size: 12px;
                      }
                    }
                  }
                }
              }
            }

            .finance-inner-box {
              .left {
                color: #666;

                .nav-header {
                  .balance {
                    color: #666;

                    div {
                      color: #338ff5;
                    }
                  }
                }

                .left-body {
                  .invest-mounte {
                    input {
                      width: 380px;
                      vertical-align: center;
                      color: #666;
                    }
                  }

                  > label {
                    > .invest-mounte {
                      > input {
                        color: #666;
                      }
                    }
                  }
                }
              }

              .right {
                .pieCharts {
                  width: 282px;
                  padding-top: 50px;
                }
              }
            }

            .invest-list {
              > .nvest-list-body {
                .finance-tips-box {
                  background-color: #fff;
                }
              }
            }
          }
        }

        .finance-inner-box {
          .left {
            .left-body {
              .el-input__inner {
                border: 1px solid #338ff5;
                background: #eaf4fe;
              }
            }
          }

          .dialogStyle {
            .invest-mounte {
              border: 1px solid rgba(236, 241, 248, 1);
              background: #fff;
            }

            .el-button {
              color: #338ff5;
            }

            .el-button--primary {
              color: #fff;
            }

            .saveTime {
              color: #333;
            }
          }
        }

        .el-table__header {
          margin-top: 2px;
          box-shadow: 0 0 4px rgba(51, 143, 245, .5);
        }

        .nvest-list-body {
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
            padding: 9px 0 9px 26px;
            font-weight: bold;
            color: #617499;
            background: linear-gradient(90deg, rgba(51, 143, 245, .8), transparent);
          }
        }

        .invest {
          color: #338ff5;
          background: linear-gradient(90deg, rgba(51, 143, 245, .8), transparent);
        }

        .el-tabs__item {
          &.is-active {
            color: #338ff5;
          }
        }

        .el-dialog {
          background: #fff;
        }

        .el-dialog__header {
          background: #eaf4fe;
          box-shadow: 0 1px 2px 0 rgba(29, 33, 49, .1);
        }

        .el-dialog__title {
          color: #333;
        }

        .el-dialog__headerbtn {
          .el-dialog__close {
            color: #333;
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

    .green {
      color: #008069;
    }

    .red {
      color: #d45858;
    }

    .red2 {
      color: #b73c36;
    }

    .saveTime {
      color: #fff;
    }

    .nav-header {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #fff;
    }

    .invest {
      width: 166px;
      padding: 14px 0 14px 26px;
      font-size: 22px;
      color: #fff;
      background: linear-gradient(90deg, rgba(34, 80, 135, 1), transparent);
    }

    .totalTipsPositon {
      margin: -36px 0 -20px 110px;
      color: #d45858;
    }
  }

  .dividend-tips {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-top: 10px;
    border-radius: 50%;
    line-height: 16px;
    text-align: center;
    color: #fff;
    background: #338ff5;
    cursor: pointer;
  }

  .el-select-dropdown {
    left: 169px !important;
    min-width: 408px !important;
  }

  .show-dividend-time-list {
    > ul {
      min-width: 300px;
      margin-left: 60px;
      border-left: 4px solid #338ff5;
      font-weight: 600;
      color: #fff;

      > li {
        position: relative;
        padding-left: 5px;
        margin-bottom: 20px;
        font-size: 10px;
        line-height: 12px;

        span:nth-child(1) {
          padding: 0 0 0 10px;
        }

        span:nth-child(2) {
          padding-right: 10px;
        }

        &::before {
          position: absolute;
          top: 0;
          left: -8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #338ff5;
          content: '';
        }
      }
    }
  }
</style>
