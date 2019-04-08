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
        <div class="kline-container">
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
          <ul class="newestPrice">
            <li>
              <p class="newestPriceColor">
                {{newestPrice}}<span>{{convertCurrency}}</span>
              </p>
              <!-- 最新价钱 -->
              <span>{{$t('M.finance_newestPrice')}}</span>
            </li>
            <li>
              <p class="green">
                {{dayAmountIncrease}}<span>{{convertCurrency}}</span>
              </p>
              <!-- 当日涨幅 -->
              <span>{{$t('M.finance_date')}}{{$t('M.finance_increase')}}</span>
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
                  <span> {{selectedCoinName}}</span>
                </div>
              </div>
            </div>
            <div class="left-body">
              <div class="left-label">
                <!-- 存币方案 -->
                <span class="label-title display-inline-block text-align-r">{{$t('M.finance_invest_style')}}:&nbsp;</span>
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
                  </el-option>
                </el-select>
              </div>
              <div class="left-label">
                <!-- 存币数量 -->
                <span class="label-title display-inline-block text-align-r">{{$t('M.finance_invest')}}{{$t('M.comm_count')}}:&nbsp;</span>
                <div class='invest-amount float-right'>
                  <!-- 请输入数量 -->
                  <input
                    type="text"
                    ref="investAmountRef"
                    :placeholder="$t('M.finance_input_sum')"
                    @keyup="investNumLimit('investAmountRef', 2)"
                    @input="investNumLimit('investAmountRef', 2)"
                  >
                  <strong>{{selectedCoinName}}</strong>
                </div>
              </div>
              <!-- 您存币的币种数量已超过该币种的总资产 -->
              <div
                class="totalTipsPositon"
                v-if="isShow"
              >
                {{$t('M.finance_errorTips')}}
              </div>
              <div class="left-label">
                <div class='submitBtn'>
                  <el-button
                    plain
                    @click="getInvestEarnings"
                  >
                  <!-- 立刻存币 -->
                  {{$t('M.finance_at_once_save')}}
                  </el-button>
                </div>
              </div>
              <!--存币说明-->
              <div class="investExplain">
                {{$t('M.finance_invest_read')}}
                <span class="blue" @click="investExplain">《{{$t('M.finance_invest_explain')}}》</span>
              </div>
              <!-- 存币详情 -->
              <el-dialog
                :title="$t('M.finance_save_moneydetail')"
                :visible.sync="dialogVisible"
                width="470px"
                :close-on-click-modal="false"
                class='dialogStyle'
              >
                <el-form
                  label-position="right"
                  label-width="115px"
                  :model="formLabelAlign"
                >
                  <!-- 存币时长 -->
                  <el-form-item
                    :label="$t('M.finance_timeLong')"
                    class='saveTime'
                  >
                    {{getDate(-2)}} {{$t('M.finance_leit')}} {{getDate(formLabelAlign.day ? formLabelAlign.day : 0)}}
                    <span class="blue">({{formLabelAlign.day}}{{$t('M.finance_day')}})</span>
                    <!-- {{formLabelAlign.createTime}} 至 {{formLabelAlign.endDate}}<span class="blue">({{formLabelAlign.day}}天)</span> -->
                  </el-form-item>
                  <!-- 存币数量 -->
                  <el-form-item
                    :label="$t('M.comm_count')"
                  >
                    <div class='invest-amount'>
                      <!--<input-->
                        <!--class="red text-indent"-->
                        <!--type='text'-->
                        <!--ref='changeAlignNum'-->
                        <!--@input="changeAlignNumber('changeAlignNum', 'investAmountRef', $event)"-->
                      <!--&gt;-->
                      <input
                        class="red text-indent"
                        type='text'
                        ref='changeAlignNum'
                        disabled
                      >
                      <strong>{{selectedCoinName}}</strong>
                    </div>
                  </el-form-item>
                  <!-- 利率 -->
                  <el-form-item
                    :label="$t('M.news_year') + $t('M.finance_interestRate') + '(%)'"
                  >
                    <div class='invest-amount'>
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
                    <div class='invest-amount'>
                      <el-input
                        v-model="formLabelAlign.expectedEarning"
                        disabled
                      >
                      </el-input>
                      <strong>{{selectedCoinName}}</strong>
                    </div>
                  </el-form-item>
                  <!-- 收益发放 -->
                  <el-form-item
                  :label="$t('M.finance_earnings') + $t('M.finance_grant')"
                  >
                    <div class='invest-amount'>
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
                        <span class="black">{{item.date}}</span>
                        <span class="blue">{{item.amount}}</span>
                        <span class='blue'>{{selectedCoinName}}</span>
                        <span class="black">
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
                    @click="dialogSuer"
                  >
                    {{$t('M.comm_affirm')}}
                  </el-button>
                </span>
              </el-dialog>
              <!--交易密码-->
              <el-dialog
                :title="$t('M.comm_password')"
                :visible.sync="isShowPasswordDialog"
                width="340px"
                top="42vh"
                :close-on-click-modal="false"
                class='passwordDialog'
              >
                <input
                  v-model="passwords"
                  type="password"
                  class="password"
                  @input="deleteErrorTips"
                  @keyup.enter="submitPassword"
                >
                <p
                  v-if="isShowErrorTips"
                  class="errorTips"
                >
                  {{$t('M.otc_publishAD_pleaseInput') + $t('M.comm_password') }}
                </p>
                <div
                  slot="footer"
                  class="dialog-footer"
                >
                  <el-button
                    type="primary"
                    @click="submitPassword"
                    :disabled="isDisable"
                  >
                    {{$t('M.comm_confirm')}}
                  </el-button>
                  <router-link
                    to="/TransactionPassword"
                    append
                    class="blue forgetPass"
                    >
                    {{$t('M.user_payPassword')}}
                  </router-link>
                </div>
              </el-dialog>
              <!--存币说明-->
              <el-dialog
                :title="$t('M.finance_invest') + $t('M.comm_description')"
                :visible.sync="isShowInvestExplain"
                width="50%"
                class="explainBox"
              >
                <div v-html="argumentContent" class="plainText"></div>
              </el-dialog>
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
                    {{convertCurrency}}
                  </p>
                </div>
                <!-- 历史收益 -->
                <div>
                  {{$t('M.finance_history')}}{{$t('M.finance_earnings')}}
                  <p class="red2">
                    <span>{{isLogin ? getMoneyValue : '--'}}</span>
                    {{convertCurrency}}
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
          <div class="invest-list-body">
            <div class='showAll'>
              <router-link
                class="blue"
                :to="{path: isLogin ? '/FinanceInvestmentRecord' : '/login', query:{coinId:selectedCoinId,coinName:selectedCoinName}}"
              >
                <!--查看全部-->
                {{ $t('M.investment_look_all') }}
              </router-link>
            </div>
            <el-tabs
              v-model="activeName"
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
                  :empty-text=this.noData
                >
                  <!--:empty-text="$t('M.comm_no_data')"-->
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                  >
                  </el-table-column>
                  <!-- 存币类型 -->
                  <el-table-column
                    :label="$t('M.finance_invest_style')"
                    width="150"
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
                  <el-table-column
                    width="144"
                    :label="$t('M.comm_state')"
                  >
                    <template slot-scope="s">
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
                        @click="cancelInvest(s.row.id)"
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
                  :empty-text=this.noData
                >
                  <!--:empty-text="$t('M.comm_no_data')"-->
                  <!-- 存币币种 -->
                  <el-table-column
                    prop="coinShortName"
                    :label="$t('M.finance_invest_coin1')"
                    width="150">
                  </el-table-column>
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
import {timeFilter, formatNumberInput} from '../../utils'
import {
  getFinancialManagement,
  imediateInvestment,
  cancelInvestment,
  getFinancialRecord
} from '../../utils/api/investmentFinance'
import {getPushTotalByCoinId} from '../../utils/api/personal'
import {argumentBusinessApply} from '../../utils/api/OTC'
import {getNestedData} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  components: {
    FinanceBrokenLine,
    FinanceBrokenPie
  },
  data () {
    return {
      noData: '', // 记录列表暂无数据
      newArrInvestTypeList: [],
      fullscreenLoading: false,
      // 选中币种的id
      selectedCoinId: '',
      // 选中币种的名称
      selectedCoinName: '',
      // 币种数组
      traderCoinList: [],
      // 存币数量
      investAmount: '',
      // 存币类型
      selectedInvestTypeId: '',
      selectedInvestTypeDescription: '',
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
      newestPrice: '',
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
      userCoinTotal: '',
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
      interestRateValue: '',
      // 交易密码确定按钮是否禁用
      isDisable: false,
      // 输入交易框是否弹出
      isShowPasswordDialog: false,
      // 交易密码
      passwords: '',
      // 是否显示交易密码为空的提示
      isShowErrorTips: false,
      // 是否显示存币说明框
      isShowInvestExplain: false,
      // 存币说明富文本
      argumentContent: '',
      // 折算货币
      convertCurrency: localStorage.convertCurrency
    }
  },
  created () {
    // 页面创建完成请求币种接口
    this.getFinancialManagementList()
  },
  mounted () {
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_AJAX_READY_STATUS', // 改变接口返回loading状态
      'FINANCE_LINE_RENDER_TIME_LIST',
      'FINANCE_LINE_RENDER_PRICE_LIST',
      'FINANCE_LINE_STATUS',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    // 将返回来的天数转换成日期
    getDate (n) {
      let ss = 24 * 60 * 60 * 1000
      let timeSteps = new Date().getTime() // 当前时间撮
      let date1 = new Date(timeSteps + (n + 2) * ss) // n天前的时间撮
      let newTime = date1.toLocaleString() // 将n天前的时间撮转换成当前日期
      let arr = newTime.split(' ') // 将精确到日的日期摘出来
      let arr1 = arr[0].split('/') // 将日期格式改变
      let arr2 = arr1[0] + (-arr1[1]) + (-arr1[2])
      return arr2
    },
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 点击存币说明弹出存币说明弹窗
    investExplain () {
      this.argumentBusinessApplyRequest()
      this.isShowInvestExplain = true
    },
    // 商家申请界面用户协议
    async argumentBusinessApplyRequest () {
      this.CHANGE_AJAX_READY_STATUS(true) // 接口返回loading
      const data = await argumentBusinessApply({
        termsTypeIds: 13,
        language: this.language
      })
      // 正确逻辑
      this.CHANGE_AJAX_READY_STATUS(false) // 关闭接口返回loading
      if (!data) return false
      if (data.data) {
        this.argumentContent = getNestedData(data, 'data[0].content')
      }
    },
    // 判断是否出现错误提示
    deleteErrorTips () {
      if (this.passwords.length) {
        this.isShowErrorTips = false
      }
    },
    // 提交交易密码
    async submitPassword () {
      if (this.passwords && !this.isShowErrorTips) {
        // 输入密码框关闭
        this.isShowPasswordDialog = false
        // 请求理财记录列表
        this.clickImmediateInvestment()
      } else {
        this.isShowErrorTips = true
      }
    },
    // 点击取消按钮存币详情模态框关闭
    dialogCancel () {
      this.dialogVisible = false
    },
    // 点击确定按钮存币详情模态框关闭
    async dialogSuer () {
      // 添加全局loading
      this.fullscreenLoading = true
      // 判断输入密码框是否显示
      await this.REFRESH_USER_INFO_ACTION()
      this.fullscreenLoading = false
      // 关闭模态框
      this.dialogVisible = false
      // 交易密码是否被锁定
      let isLockedPassword = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isLockedPassword)
      if (this.isLockedPayPassword) return false
      // 设置交易密码弹窗为显示
      this.isShowPasswordDialog = true
      // 让交易密码为空的提示隐藏
      this.isShowErrorTips = false
      // 输入密码input框清空
      this.passwords = ''
    },
    // 改写存币数量只能输入小数点后两位20190103该写
    investNumLimit (ref, pointLength) {
      // console.log(this.$refs.investAmountRef.value)
      // 限制输入数字和位数
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      if (this.isLogin) {
        if (this.$refs.investAmountRef.value - this.userCoinTotal > 0) {
          this.isShow = true
        } else {
          this.isShow = false
        }
      } else {
        this.isShow = false
      }
    },
    // 输入金额改变时检测用户输入的币种总金额
    async getUserCoinTotal () {
      const data = await getPushTotalByCoinId({
        coinId: this.selectedCoinId
      })
      if (!data) return false
      // 重新掉一次币种接口刷新列表
      this.userCoinTotal = getNestedData(data, 'data.total')
    },
    // 点击立刻存币按钮执行
    getInvestEarnings () {
      console.log(this.$refs.investAmountRef.value)
      if (this.isLogin) {
        if ((this.$refs.investAmountRef.value - 0) === 0) {
          this.$message({
            // 存币数量不能为0
            message: this.$t('M.finance_invest_number'),
            type: 'error'
          })
          return false
        }
        if (this.selectedInvestTypeId && this.$refs.investAmountRef.value) {
          if (this.isShow === false) {
            // 添加全局loading
            this.fullscreenLoading = true
            // 显示理财详情模态框前请求数据渲染模态框
            this.clickGetInvestEarnings()
            // 添加全局loading
            this.fullscreenLoading = false
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
        this.$goToPage('/login')
        return false
      }
    },
    // 模态框数字发生变化时需要执行的方法
    // changeAlignNumber (ref1, ref2, e) {
    //   let arr = e.target.value.split('')
    //   let str = ''
    //   _.forEach(arr, (item, index) => {
    //     if (index == 0 && item == '0') {
    //       str = ''
    //     } else {
    //       if (item - 0 || item == '0') {
    //         str += item
    //       }
    //     }
    //   })
    //   this.investAmount = str
    //   // 将本身赋值
    //   this.$refs[ref1].value = str
    //   // 主理财页面赋值
    //   this.$refs[ref2].value = str
    //   if (str) {
    //     this.clickGetInvestEarnings()
    //   }
    // },
    // 理财记录模态框显示
    async clickGetInvestEarnings () {
      const data = await getFinancialRecord({
        financialManagementId: this.selectedInvestTypeId,
        number: this.$refs.investAmountRef.value
      })
      if (!data) return false
      this.formLabelAlign = getNestedData(data, 'data')
      this.$refs.changeAlignNum.value = this.formLabelAlign.number
      this.interestRateValue = (this.formLabelAlign.interestRate - 0) * 100
    },
    // 添加理财记录
    async clickImmediateInvestment () {
      // 请求回来时将按钮解除禁用
      this.isDisable = true
      const data = await imediateInvestment({
        financialManagementId: this.selectedInvestTypeId,
        payPassword: this.passwords,
        number: this.$refs.investAmountRef.value
      })
      this.isDisable = false
      if (!data) return false
      // 请求回来时将按钮解除禁用
      // 重新调一次币种接口刷新列表
      this.getFinancialManagementList()
      // 存币成功
      this.$message({
        message: this.$t('M.finance_invest') + this.$t('M.comm_success'),
        type: 'success'
      })
      // 清空交易密码
      this.passwords = ''
    },
    // 存币理财页面币种查询
    async getFinancialManagementList () {
      this.newArrInvestTypeList = []
      this.investTypeList = []
      this.selectedInvestTypeId = ''
      this.fullscreenLoading = true
      const data = await getFinancialManagement({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        coinId: this.selectedCoinId,
        coinName: this.selectedCoinName,
        currency: this.convertCurrency
      })
      this.fullscreenLoading = false
      // 返回数据正确的逻辑
      if (!data) return false
      let getData = getNestedData(data, 'data')
      // 设置可用币种数组
      this.traderCoinList = getNestedData(getData, 'idNameDtoList')
      // 设置每次返回回来的币种id
      this.selectedCoinId = getNestedData(getData, 'tickerPriceResult.coinId') ? getNestedData(getData, 'tickerPriceResult.coinId') : ''
      // 设置每次返回地币种名称
      this.selectedCoinName = getNestedData(getData, 'tickerPriceResult.coinName')
      // 最新价钱
      this.newestPrice = getNestedData(getData, 'tickerPriceResult.price')
      // 当日涨幅
      this.dayAmountIncrease = getNestedData(getData, 'tickerPriceResult.chg')
      // 历史涨幅
      this.historyAmountIncrease = getNestedData(getData, 'tickerPriceResult.historyAmountIncrease')
      // 理财类型数组
      this.investTypeList = getNestedData(getData, 'managementList')
      // 设置存币类型默认值
      if (this.investTypeList.length) {
        _.forEach(this.investTypeList, (item) => {
          // 描述不能为空
          if (item.state === 'ENABLED' && item.typeDescription && item.typeEnglishDescription) {
            this.newArrInvestTypeList.push(item)
          }
        })
        this.investTypeList = this.newArrInvestTypeList
        this.selectedInvestTypeId = this.investTypeList.length ? this.investTypeList[0].id : ''
      }
      // 设置可用余额
      this.availableBalance = getNestedData(getData, 'userTotal')
      // 存币估计值
      this.InvestmentValue = getNestedData(getData, 'userNumber')
      // 历史收益
      this.getMoneyValue = getNestedData(getData, 'userInterest')
      if (this.isLogin) {
        // 存币记录列表赋值
        this.investList = getNestedData(getData, 'userFinancialManagementRecord.list')
        // 收益记录列表
        this.userInterestRecord = getNestedData(getData, 'userInterestRecord.list')
        if (!this.investList.length || !this.userInterestRecord.length) {
          // this.noData = '暂无数据'
          this.noData = this.$t('M.comm_no_data')
        } else {
          this.noData = ''
        }
        // 每次换一种币种就获取该币种的总资产
        this.getUserCoinTotal()
      } else {
        this.noData = ' '
      }
      // 走势图x轴赋值
      this.FINANCE_LINE_RENDER_PRICE_LIST(getNestedData(getData, 'tickerPriceResult.renderPriceList'))
      // 走势图y轴赋值
      this.FINANCE_LINE_RENDER_TIME_LIST(getNestedData(getData, 'tickerPriceResult.renderTimeList'))
      // 设置状态只要发生请求就让状态改变
      this.FINANCE_LINE_STATUS(1 + this.status)
      // 将存币数量输入框清空
      // this.investAmount = ''
      this.$refs.investAmountRef.value = ''
    },
    // 用户取消存币接口
    async clickCancelInvestment (id) {
      const data = await cancelInvestment(id)
      if (!data) return false
      this.getFinancialManagementList()
    },
    // 币种选择变化时赋值币种名称
    changeTraderCoin (e) {
      this.selectedCoinId = e
      _.forEach(this.traderCoinList, item => {
        if (item.id === e) {
          this.selectedCoinName = item.name
        }
      })
      // 改变币种重新请求接口
      this.getFinancialManagementList()
    },
    // 交易类型改变时执行
    electedInvestTypeDisc (e) {
      this.selectedInvestTypeId = e
      _.forEach(this.traderCoinList, item => {
        if (item.id === e) {
          if (this.language === 'zh_TW' || this.language === 'zh_CN') {
            this.selectedInvestTypeDescription = item.typeDescription
          } else {
            this.selectedInvestTypeDescription = item.typeEnglishDescription
          }
        }
      })
    },
    cancelInvest (id) {
      // 增加二次确认弹出框
      this.$confirm(this.$t('M.finance_tipsContentOne'), {
        confirmButtonText: this.$t('M.comm_confirm'), // 确定
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        // 用户点击取消按钮需要请求接口
        this.clickCancelInvestment(id)
      }).catch(() => {
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
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      status: state => state.finance.status,
      clientWidth: state => state.common.clientWidth,
      loginStep1Info: state => state.user.loginStep1Info,
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj // 目标货币
    }),
    screenWidth () {
      return this.clientWidth
    }
  },
  watch: {
    activeConvertCurrencyObj (newVal, oldVal) {
      if (getNestedData(oldVal, 'shortName')) {
        this.convertCurrency = newVal.shortName
        this.getFinancialManagementList()
      }
    },
    language (newVal) {
      this.getFinancialManagementList()
    }
  },
  destroyed () {
    this.FINANCE_LINE_STATUS(0)
  }
}
</script>
<style scoped lang="scss" type="text/scss">
/* 公共scss样式 */
@import "../../../static/css/scss/InvestmentFinance/FinanceCenter";

.finance-box {
  width: 100%;
  min-width: 1300px;
  margin-top: 50px;

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

      > .kline-container {
        padding: 100px 145px 0;

        > .finance-form-header {
          display: flex;
          width: 100%;

          > .newestPrice {
            display: flex;
            flex: 1;
            align-items: center;
            height: 48px;

            > li {
              flex: 1;
              text-align: center;
              color: #a9bed4;
              border-right: 1px solid #1b2231;

              > p {
                font-weight: bolder;
                font-size: 16px;

                > span {
                  font-size: 14px;
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
                -webkit-box-reflect: below 0 -webkit-linear-gradient(-90deg, rgba(124, 184, 250, 0), rgba(124, 184, 250, .2) 200%);

                > span {
                  font-size: 12px;
                }
              }
            }
          }

          .left-body {
            padding-top: 58px;

            > .left-label {
              margin: 32px 0;
              line-height: 50px;

              > .label-title {
                width: 130px;
              }

              > .invest-amount {
                display: flex;
                justify-content: space-between;
                width: 400px;
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
                  width: 400px;
                  height: 50px;
                  margin-left: 134px;
                  border-radius: 4px;
                  text-align: center;
                  color: #fff;
                  background: -webkit-linear-gradient(45deg, #2b396e, #2a5082);
                }
              }
            }

            .investExplain {
              font-size: 12px;
              line-height: 0;
              text-align: right;

              span:hover {
                cursor: pointer;
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
              margin-right: 50px;
            }
          }
        }
      }

      > .invest-list {
        margin: 96px 0 200px;

        > .invest-list-body {
          position: relative;

          > .showAll {
            position: absolute;
            z-index: 10;
            top: 7px;
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
        height: 40px;
        border: 1px solid #338ff5;
        border-radius: 2px;
        font-size: 15px;
        color: #338ff5;
        background: linear-gradient(180deg, rgba(51, 143, 245, .1) 0%, rgba(51, 143, 245, .1) 100%);
        box-shadow: 0 2px 2px rgba(13, 17, 25, 1);
      }
    }

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

    .finance-inner-box {
      .left {
        .left-body {
          .el-input__inner {
            width: 400px;
            height: 50px;
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

        .invest-amount {
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

      .passwordDialog {
        .password {
          box-sizing: border-box;
          width: 300px;
          height: 36px;
          padding: 0 10px;
          border: 1px solid #485776;
          color: #fff;
          background-color: #1a2233;
        }

        .el-dialog__body {
          padding: 30px 20px 5px;
        }

        .el-dialog__footer {
          overflow: hidden;
        }

        .errorTips {
          line-height: 36px;
          color: #d45858;
        }

        .el-button.el-button--primary {
          width: 300px;
          height: 36px;
          margin-bottom: 15px;
          border: 0;
          line-height: 0;
          background: linear-gradient(81deg, #2b396e 0%, #2a5082 100%);
        }

        .forgetPass:hover {
          cursor: pointer;
        }
      }

      .el-dialog__wrapper {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
      }
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

    .el-dialog {
      background: #28334a;
    }

    .el-dialog__header {
      padding: 13px 20px;
      background: #20293c;
      box-shadow: 0 1px 2px 0 rgba(29, 33, 49, 1);
    }

    .el-dialog__title {
      color: #fff;
    }

    .el-dialog__headerbtn {
      top: 17px;

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

    .explainBox {
      .el-dialog {
        > .el-dialog__body {
          height: 700px;
          padding: 0;
          overflow: scroll;

          .plainText {
            padding: 30px 20px;
            color: #8ba0ca;
          }
        }
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
        }
      }

      .el-table__header {
        box-shadow: 4px 0 4px 4px rgba(25, 30, 40, 1);
      }

      > .inner-box {
        > .finance-inner {
          > .invest-list {
            > .invest-list-body {
              .finance-tips-box {
                color: #617499;

                /* background-color: #121824; */
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
          .kline-container {
            .finance-form-header {
              .el-input__inner {
                background: #fff !important;
                box-shadow: inset 1px 0 3px rgba(51, 143, 245, 1);
              }

              .newestPrice {
                display: flex;
                flex: 1;
                height: 48px;

                .newestPriceColor {
                  color: #000;
                }

                li {
                  border-right: 1px solid rgba(30, 38, 54, .3);
                  color: #666;

                  p {
                    font-size: 16px;

                    &:last-child {
                      border: none;
                    }

                    span {
                      font-size: 14px;
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
                .invest-amount {
                  input {
                    width: 380px;
                    vertical-align: center;
                    color: #666;
                  }
                }

                > label {
                  > .invest-amount {
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
            > .invest-list-body {
              .finance-tips-box {
                background-color: #fff;
              }
            }
          }
        }

        .explainBox {
          .el-dialog {
            > .el-dialog__body {
              .plainText {
                color: #666;
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
          .invest-amount {
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

        .passwordDialog {
          .password {
            border: 1px solid #ecf1f8;
            color: #333;
            background-color: #fff;
          }
        }
      }

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

    .black {
      color: #333;
    }
  }

  .cancelBtn {
    cursor: pointer;
  }

  .blue {
    font-size: 12px;
    color: #338ff5;
  }

  .green {
    color: #008069;
  }

  .red {
    color: #d45858;
  }

  .text-indent {
    text-indent: 10px;
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
    padding: 10px 0 10px 26px;
    font-size: 16px;
    color: #fff;
    background: linear-gradient(90deg, rgba(34, 80, 135, 1), transparent);
  }

  .totalTipsPositon {
    margin: -20px 0 -20px 134px;
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
</style>
