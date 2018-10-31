<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- banner -->
    <div class="banner-box">
      <img src="../../assets/finance/banner.png">
    </div>
    <div
      class="inner-box"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0,0,0,0.6)"
    >
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
              :value="item.id">
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
      <FinanceBrokenLine ref="childLineCharts"/>
      </div>
      <!-- 存币 -->
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
              {{$t('M.finance_invest')}}{{$t('M.comm_type')}}:&nbsp;
              <el-select
                :placeholder="$t('M.comm_please_choose')"
                :no-data-text="$t('M.comm_no_data')"
                v-model="selectedInvestTypeId"
                @change="electedInvestTypeDisc"
              >
                <el-option
                  v-for="(item,index) in investTypeList"
                  :key="index"
                  :label="item.typeDescription"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </label>
            <label for="">
              <!-- 存币数量 -->
              {{$t('M.finance_invest')}}{{$t('M.comm_count')}}:&nbsp;
              <div class='invest-mounte'>
                <!-- 请输入数量 -->
                <input
                  v-model="investMounte"
                  :placeholder="$t('M.otc_publishAD_pleaseInput') + $t('M.comm_count')"
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
                {{$t('M.finance_mast')}}{{$t('M.finance_invest')}}
                </el-button>
              </div>
            </label>
            <el-dialog
              title="存币详情"
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
                  :label="$t('M.finance_invest') + $t('M.finance_timeLong')"
                  class='saveTime'
                >
                  {{getDate(-2)}} {{$t('M.finance_leit')}} {{getDate(formLabelAlign.day)}}
                  <span class="blue">({{formLabelAlign.day}}{{$t('M.finance_day')}})</span>
                  <!-- {{formLabelAlign.createTime}} 至 {{formLabelAlign.endDate}}<span class="blue">({{formLabelAlign.day}}天)</span> -->
                </el-form-item>
                <!-- 存币数量 -->
                <el-form-item
                  :label="$t('M.finance_invest') + $t('M.comm_count')"
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
                  :label="$t('M.finance_interestRate')"
                >
                   <div class='invest-mounte'>
                    <el-input
                      v-model="formLabelAlign.interestRate"
                      disabled
                    >
                    </el-input>
                  </div>
                </el-form-item>
                <!-- 预计总收益 -->
                <el-form-item
                  :label="$t('M.finance_predict') + $t('M.comm_total_sum') + $t('M.finance_earnings')"
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
                        ({{formLabelAlign.jsonTimeline[formLabelAlign.jsonTimeline.length-1].length == 1 ? $t('M.finance_accrual') :$t('M.finance_capital') + '+' + $t('M.finance_accrual')}})
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
            <button></button>
          </div>
        </div>
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
                {{$t('M.finance_invest')}}{{$t('M.finance_estimatedValue')}}
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
      <div class="invest-list">
        <!-- <div class="invest-list-header">
          <div class='invest'>存币记录</div>
        </div> -->
        <!-- 存币记录和收益记录 -->
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
          <!-- 存币记录 -->
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick"
          >
            <!-- 存币记录 -->
            <el-tab-pane
              :label="$t('M.finance_invest') + $t('M.finance_recode')"
              name="1"
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
                :data="investList"
                style="width: 100%"
                :empty-text="$t('M.comm_no_data')"
              >
                <!-- 存币币种 -->
                <el-table-column
                  prop="coinShortName"
                  :label="$t('M.finance_invest_coin1')"
                  width="100"
                >
                </el-table-column>
                <!-- 存币类型 -->
                <el-table-column
                  prop="typeDescription"
                  :label="$t('M.finance_invest') + $t('M.otc_cancelOrder_type')"
                  width="180">
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
                <!-- 状态 -->
                <el-table-column
                  prop="state"
                  width="80"
                  :label="$t('M.comm_state')"
                >
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
                  width="80"
                  :label="$t('M.otc_index_operate')"
                >
                  <!-- 活期 -->
                  <template slot-scope = "s">
                    <div
                      v-if="s.row.state == $t('M.finance_huoqi')"
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
              >
                <!-- 存币币种 -->
                <el-table-column
                  prop="coinShortName"
                  :label="$t('M.finance_invest_coin1')"
                  width="150">
                </el-table-column>
                <!-- 存币类型 -->
                <el-table-column
                  prop="description"
                  :label="$t('M.finance_invest') + $t('M.otc_cancelOrder_type')"
                  >
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
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
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
import {returnAjaxMessage} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('finance')
export default {
  components: {
    HeaderCommon,
    FooterCommon,
    FinanceBrokenLine,
    FinanceBrokenPie
  },
  data () {
    return {
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
      brforeNtime: ''
    }
  },
  created () {
    // 对element ui样式重置
    require('../../../static/css/list/InvestmentFinance/FinanceCenter.css')
    // 白样式
    require('../../../static/css/theme/day/InvestmentFinance/FinanceCenterDay.css')
    // 黑样式
    require('../../../static/css/theme/night/InvestmentFinance/FinanceCenterNight.css')
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
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 重新掉一次币种接口刷新列表
        this.userCoindTotal = data.data.data.total
      }
    },
    // 点击立刻存币按钮执行
    getInvestEarnings () {
      // console.log(111.00)
      if (this.isLogin) {
        if (this.selectedInvestTypeId && this.investMounte && this.isShow === false) {
          // 显示理财详情模态框前请求数据渲染模态框
          this.clickGetInvestEarnings()
          // 显示模态框
          this.dialogVisible = true
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
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.formLabelAlign = data.data.data
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
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 重新调一次币种接口刷新列表
        this.getFinancialManagementList()
        // 存币成功
        this.$message({
          message: this.$t('M.finance_invest') + this.$t('M.comm_success'),
          type: 'success'
        })
      }
    },
    // 存币理财页面币种查询
    async getFinancialManagementList () {
      this.fullscreenLoading = true
      const data = await getFinancialManagement({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        coinId: this.selectedCoinId,
        coinName: this.selecteCoindName
      })
      console.log('存币理财页面查询')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        this.fullscreenLoading = false
        return false
      } else {
        console.log(data)
        this.fullscreenLoading = false
        // let getData = Object.assign({}, data.data.data)
        let getData = data.data.data
        // let getData = JSON.parse(JSON.stringify(data.data.data))
        // 设置可用币种数组
        this.traderCoinList = getData.idNameDtoList
        this.traderCoinList.forEach(item => {
          if (getData.idNameDtoList.id == item.id) {
            this.selectedCoinId = item.id
          }
        })
        // 设置每次返回回来的币种id
        this.selectedCoinId = getData.tickerPriceResult.coinId
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
        console.log(11111111111111111111111111)
        console.log(this.investTypeList)
        // 设置存币类型默认值
        this.selectedInvestTypeId = getData.managementList[0] ? getData.managementList[0].id : ''
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
      if (!(returnAjaxMessage(data, this, 1))) {
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
          this.selectedInvestTypeDiscri = item.typeDescription
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
      status: state => state.finance.status
    }),
    screenWidth () {
      return window.innerWidth / 3
    }
  },
  watch: {
    InvestmentValue (newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  destroyed () {
    this.$store.status = 0
  }
}
</script>
<style scoped lang="scss">
 // 公共scss样式
  @import "../../../static/css/scss/InvestmentFinance/FinanceCenter";
  .finance-box{
    min-width:1300px;
    width:100%;
    height:100%;
      >.banner-box{
        height: 459px;
        background: #272b41;
        >img{
          width: 100%;
          height: 100%;
        }
        }
      >.inner-box{
        display:flex;
        width:100%;
        >.finance-inner{
          width: 1100px;
          margin: 0 auto;
          >.container{
          padding: 100px 145px 0px 145px;
          >.finance-form-header{
            width: 100%;
            display:flex;
            >.newnestPrice{
              flex: 1;
              height: 48px;
              display:flex;
              >li{
                flex: 1;
                border-right:1px solid #1b2231;
                color:#a9bed4;
                text-align: center;
                >p{
                  font-size:22px;
                  font-weight: bolder;
                  >span{
                    font-size:12px;
                  }
                }
                &:last-child{
                  border: none;
                }
              }
          }
          }
        }
        .finance-inner-box{
        display: flex;
        justify-content: space-between;
        >.left{
          width: 516px;
          color:#A9BED4;
          >.nav-header{
            >.balance{
              padding-top:10px;
              display: flex;
              line-height: 30px;
              >div{
                font-size: 24px;
                color:#7CB8FA;
                height: 24px;
                font-weight:600;
                -webkit-box-reflect: below 0 -webkit-linear-gradient(-90deg,rgba(124,184,250,0),rgba(124,184,250,0.2));
                >span{
                  font-size: 12px;
                }
              }
            }
          }
          .left-body{
            padding-top:58px;
            >label{
              display: block;
              margin:44px 0px;
              display: flex;
              line-height: 50px;
              >.invest-mounte{
                display: flex;
                justify-content: space-between;
                padding: 13px 11px;
                border-radius: 2px;
                border:1px solid rgba(169,190,212,1);
                width: 407px;
                height: 48px;
                line-height: 24px;
                >input{
                  width: 380px;
                  color:#fff;
                  vertical-align: center;
                }
              }
              .submitBtn{
                >button{
                  width: 407px;
                  height: 48px;
                  margin-left: 72px;
                  text-align: center;
                  border: 2px solid -webkit-linear-gradient(135deg,#2B396E,#2A5082);
                  background: -webkit-linear-gradient(45deg,#2B396E,#2A5082);
                  color:#fff;
                }
              }
            }
          }
        }
        >.right{
          width: 482px;
          color:#A9BED4;
          >.pieCharts-box{
            display: flex;
          >.right-infor{
            padding-top:100px;
            width: 245px;
            overflow: hidden;
            >div{
              line-height: 30px;
              margin-bottom:30px;
              >p{
              font-size:12px;
              >span{
                font-size: 22px;
                font-weight: bolder;
              }
              }
            }
          }
          >.pieCharts{
            padding-top: 50px;
            width: 282px;
          }
          }
        }
      }
      >.invest-list{
        margin-bottom:200px;
        >.nvest-list-body{
          position: relative;
          >.showAll{
            position:absolute;
            right: 0;
            top:25px;
            z-index: 10;
          }
          .financeTsipsBox{
            position: absolute;
            top: 55px;
            left: 0px;
            text-align: center;
            z-index: 10;
            width: 100%;
            height: 100%;
            line-height:200px;
            >a{
              color: #338FF5;
            }
          }
        }
      }
      }
    }
    &.night{
      >.inner-box{
        background-color: $nightInnerBoxBg;
        >div{
          /*<!--background-color: $nightMainTitleBgColor;-->*/
        }
      }
    }
    &.day{
      >.inner-box{
      }
    }
    .cancelBtn{
       cursor: pointer;
    }
    .blue{
      color: #338FF5;
    }
    .green{
      color: #008069;
    }
    .red{
      color:#D45858;
    }
    .red2{
      color:#B73C36;
    }
    .saveTime{
      color: #fff;
    }
    .nav-header{
      color:#fff;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
    }
    .invest{
      font-size: 22px;
      width: 150px;
      color: #fff;
      padding:14px 0px 14px 26px;
      background:linear-gradient(90deg,rgba(34,80,135,1),transparent);
    }
    .totalTipsPositon{
      margin:-36px 0px -20px 72px;
      color: #D45858;
    }
 }
  .dividend-tips{
    width: 16px;
    height: 16px;
    display: inline-block;
    border-radius: 50%;
    color: #fff;
    line-height: 16px;
    text-align: center;
    background: #338FF5;
    cursor: pointer;
    margin-top:10px ;
  }
 .el-select-dropdown{
      min-width: 408px!important;
      left:169px!important;
  }
  .show-dividend-time-list{
    >ul{
      min-width: 300px;
      margin-left:60px;
      color: #fff;
      font-weight: 600;
      border-left: 4px solid #338FF5;
      >li{
        position: relative;
        padding-left: 5px;
        font-size: 10px;
        margin-bottom:20px;
        line-height: 12px;
        span:nth-child(1){
          padding:0px 0px 0px 10px;
        }
        span:nth-child(2){
          padding-right:10px;
        }
        &::before{
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          top:0px;
          left:-8px;
          background: #338FF5;
          border-radius: 50%;
        }
      }
    }
  }
</style>
