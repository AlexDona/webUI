<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  <!-- 导航 -->
    <HeaderCommon/>
    <!-- banner -->
    <div class="banner-box">
      <img src="../../assets/finance/banner.png" alt="">
    </div>
    <div class="inner-box">
      <div class="finance-inner">
        <div class="container">
         <div class="finance-form-header">
          <el-select
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
              <p class="newnestPriceColor">{{newnestPrice}}<span>USDT</span></p>
              <!-- 最新价钱 -->
              {{$t('M.finance_newestPrice')}}
            </li>
            <li>
              <p class="green">{{dayAmountIncrease}}<span>USDT</span></p>
              <!-- 当日涨幅 -->
              {{$t('M.finance_date')}}{{$t('M.finance_increase')}}
            </li>
            <li v-if = 'this.historyAmountIncrease'>
              <p class="red">{{historyAmountIncrease}}</p>
              <!-- 历史涨幅 -->
              {{$t('M.finance_history')}}{{$t('M.finance_increase')}}
            </li>
          </ul>
      </div>
      <FinanceBrokenLine ref="childLineCharts"/>
      </div>
      <!-- 投资 -->
      <div class="finance-inner-box">
        <div class="left">
          <div class="nav-header">
            <!-- 投资 -->
            <div class="invest">{{$t('M.finance_invest')}}</div>
            <!-- 可用余额 -->
            <div class="balance">{{$t('M.finance_useBalance')}}&nbsp;:&emsp; <div>{{isLogin ? availableBalance : '--'}}<span> {{selecteCoindName}}</span></div></div>
          </div>
          <div class="left-body">
            <label for="">
              <!-- 投资类型 -->
              {{$t('M.finance_invest')}}{{$t('M.comm_type')}}:&nbsp;&nbsp;&nbsp;
              <el-select
              v-model="selectedInvestTypeId"
              @change="electedInvestTypeDisc"
              >
                <el-option
                  v-for="(item,index) in investTypeList"
                  :key="index"
                  :label="item.typeDescription"
                  :value="item.id">
                </el-option>
              </el-select>
            </label>
            <label for="">
              <!-- 投资数量 -->
              {{$t('M.finance_invest')}}{{$t('M.comm_count')}}:&nbsp;&nbsp;&nbsp;
              <div class='invest-mounte'>
                <!-- 请输入数量 -->
                <input
                v-model="investMounte"
                :placeholder="$t('M.otc_publishAD_pleaseInput') + $t('M.comm_count')"
                @keyup="changeInvestMounte"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}">
                <strong>{{selecteCoindName}}</strong>
              </div>
            </label>
            <!-- 您投资的币种数量已超过该币种的总资产 -->
            <div  class="totalTipsPositon" v-if="isShow">{{$t('M.finance_errorTips')}}</div>
            <label for=" ">
              <div class='submitBtn'>
                <el-button
                 plain
                 @click="getInvestEarnings"
                >
                <!-- 立刻投资 -->
                {{$t('M.finance_mast')}}{{$t('M.finance_invest')}}
                </el-button>
              </div>
            </label>
            <button></button>
          </div>
        </div>
        <div class="right">
          <div class="nav-header">
            <!-- 我的投资 -->
            <div class="invest">{{$t('M.finance_mine')}}{{$t('M.finance_invest')}}</div>
          </div>
          <div class="pieCharts-box">
              <div class="right-infor">
                <!-- 投资估值 -->
              <div>{{$t('M.finance_invest')}}{{$t('M.finance_estimatedValue')}}
                <p class="green">
                  <span>{{isLogin ? InvestmentValue : '--'}}</span>
                  USDT
                </p>
              </div>
              <!-- 历史收益 -->
              <div>{{$t('M.finance_history')}}{{$t('M.finance_earnings')}}
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
          <div class='invest'>投资记录</div>
        </div> -->
        <!-- 投资记录和收益记录 -->
        <div class="nvest-list-body">
          <div class='showAll'>
            <router-link class="blue" :to="{path: isLogin ? '/FinanceInvestmentRecord' : '/login', query:{coinId:selectedCoinId,coinName:selecteCoindName}}">查看全部</router-link>
          </div>
          <!-- 投资记录 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- 投资记录 -->
            <el-tab-pane
            :label="$t('M.finance_invest') + $t('M.finance_recode')"
            name="1">
             <!-- @您还没有登陆,请登录或者注册之后查看！ -->
              <div v-if = "!isLogin" class = 'financeTsipsBox'>
                {{$t('M.finance_loginTips')}}
                <router-link to='/login'>
                  {{$t('M.comm_login')}}
                </router-link>
                {{$t('M.finance_or')}}
                <router-link to = '/Register'>
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
                <!-- 投资币种 -->
                <el-table-column
                  prop="coinShortName"
                  :label="$t('M.finance_invest') + $t('M.comm_currency')"
                  width="100">
                </el-table-column>
                <!-- 投资类型 -->
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
                  width="185"
                  :label="$t('M.finance_predict') + $t('M.finance_releaseTime')"
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
                  <template slot-scope = "data">
                    <div
                    v-if="data.row.state == $t('M.finance_huoqi')"
                    class="blue cancelBtn"
                    @click="cancleInvest(data.row.id)"
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
              <div v-if = "!isLogin" class = 'financeTsipsBox'>
                {{$t('M.finance_loginTips')}}
                <router-link to='/login'>
                  {{$t('M.comm_login')}}
                </router-link>
                {{$t('M.finance_or')}}
                <router-link to = '/Register'>
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
                <!-- 投资币种 -->
                <el-table-column
                  prop="coinShortName"
                  :label="$t('M.finance_invest') + $t('M.comm_currency')"
                  width="150">
                </el-table-column>
                <!-- 投资类型 -->
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
                  prop="expected_earning"
                  :label="$t('M.finance_predict') + $t('M.finance_earnings')"
                  >
                </el-table-column>
                <!-- 发放收益 -->
                <el-table-column
                  prop="interest"
                  :label="$t('M.finance_grant') + $t('M.finance_earnings')"
                  >
                </el-table-column>
                <!-- 预计发放时间 -->
                <el-table-column
                  prop="createTime"
                  width="150"
                  :label="$t('M.finance_predict') + $t('M.finance_releaseTime')"
                  >
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      </div>
    </div>
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import FinanceBrokenLine from './FinanceBrokenLine'
import FinanceBrokenPie from './FinanceBrokenPie'
import {timeFilter} from '../../utils'
import {getFinancialManagement, imediateInvestment, cancleInvestment} from '../../utils/api/OTC'
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
      // 选中币种的id
      selectedCoinId: '',
      // 选中币种的名称
      selecteCoindName: '',
      // 币种数组
      traderCoinList: [],
      // 投资数量
      investMounte: '',
      // 投资类型
      selectedInvestTypeId: '',
      selectedInvestTypeDiscri: '',
      // 投资类型列表
      investTypeList: [],
      // 默认显示投资记录
      activeName: '1',
      // 投资列表
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
      // 是否立刻投资显示立即投资错误提示
      isShow: false,
      // 投资估值
      InvestmentValue: 0,
      // 历史收益值
      getMoneyValue: 0,
      // 获取用户总资产
      userCoindTotal: '',
      // 走势图x轴数组
      renderTimeList: '',
      // 走势图y轴数组
      renderPriceList: ''
    }
  },
  created () {
    // this.InvestmentValue = '3'
    // setTimeout(()=>{
    // this.InvestmentValue = '4'
    // },1000)
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
      'FINANCE_LINE_RENDER_PRICE_LIST'
    ]),
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
    // 点击立刻投资按钮执行
    getInvestEarnings () {
      if (this.isLogin) {
        if (this.selectedInvestTypeId && this.investMounte && this.isShow === false) {
        // 执行投资按钮
          this.clickImmediateInvestment()
        } else {
          this.$message({
            // 投资类型或投资数量不能为空
            message: this.$t('M.finance_noemptyTips'),
            type: 'error'
          })
        }
      } else {
        this.$router.push({path: '/login'})
        return false
      }
    },
    // 添加理财记录
    async clickImmediateInvestment () {
      const data = await imediateInvestment({
        financialManagementId: this.selectedInvestTypeId,
        number: this.investMounte
      })
      console.log('投资理财类型')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 重新掉一次币种接口刷新列表
        this.getFinancialManagementList()
        // 投资成功
        this.$message({
          message: this.$t('M.finance_invest') + this.$t('M.comm_success'),
          type: 'success'
        })
      }
    },
    // 投资理财页面币种查询
    async getFinancialManagementList () {
      const data = await getFinancialManagement({
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        partnerId: this.partnerId,
        coinId: this.selectedCoinId,
        coinName: this.selecteCoindName
      })
      console.log('投资理财页面查询')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        let getData = data.data.data
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
        // 设置投资类型默认值
        this.selectedInvestTypeId = getData.managementList[0] ? getData.managementList[0].id : ''
        // 设置可用余额
        this.availableBalance = getData.userTotal
        // 投资估计值
        this.InvestmentValue = getData.userNumber
        // 历史收益
        this.getMoneyValue = getData.userInterest
        // 投资记录列表赋值
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
        this.$refs.childLineCharts.resetOptions()
        this.$refs.childLineCharts.resetChart(this.options)
        // 将投资数量输入输入框清空
        this.investMounte = ''
      }
    },
    // 用户取消投资接口
    async clickCancleInvestment (id) {
      const data = await cancleInvestment(id)
      console.log('用户取消按钮')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
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
      this.clickCancleInvestment(id)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.user.isLogin,
      partnerId: state => state.common.partnerId,
      financeLineRenderTimeList: state => state.finance.financeLineRenderTimeList,
      financeLineRenderPriceList: state => state.finance.financeLineRenderPriceList
    }),
    screenWidth () {
      return window.innerWidth / 3
    }
  },
  watch: {
    InvestmentValue (newVal, oldVal) {
      console.log(newVal, oldVal)
    }
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
        background: #121824;
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
          width: 482px;
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
 .el-select-dropdown{
      min-width: 408px!important;
      left:169px!important;
  }
</style>
