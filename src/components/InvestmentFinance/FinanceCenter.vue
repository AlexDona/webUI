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
              <p class="newnestPriceColor">{{newnestPrice}}<span>{{selecteCoindName}}</span></p>
              最新价钱
            </li>
            <li>
              <p class="green">{{dayAmountIncrease}}</p>
              当日涨幅
            </li>
            <li v-if = 'this.historyAmountIncrease'>
              <p class="red">{{historyAmountIncrease}}</p>
              历史涨幅
            </li>
          </ul>
      </div>
      <FinanceBrokenLine
       :selecte-coind-infor="selecteCoindInfor"
      />
      </div>
      <!-- 投资 -->
      <div class="finance-inner-box">
        <div class="left">
          <div class="nav-header">
            <div class="invest">投资</div>
            <div class="balance">可用余额&nbsp;:&emsp; <div>{{availableBalance}}<span>{{selecteCoindName}}</span></div></div>
          </div>
          <div class="left-body">
            <label for="">
              投资类型:
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
              投资数量:
              <div class='invest-mounte'>
                <input v-model="investMounte" placeholder="请输入数量"/>
                <span>{{selecteCoindName}}</span>
              </div>
            </label>
            <label for="">
              <div class='submitBtn'>
                <el-button
                 plain
                 @click="getInvestEarnings"
                 :disabled='!selectedInvestTypeDiscri && !investMounte'
                >立刻投资</el-button>
              </div>
            </label>
            <button></button>
          </div>
        </div>
        <div class="right">
          <div class="nav-header">
            <div class="invest">我的投资</div>
          </div>
          <div class="pieCharts-box">
              <div class="right-infor">
              <div>投资估值
                <p class="green">
                  <span>{{InvestmentValue}}</span>
                  {{selecteCoindName}}
                </p>
              </div>
              <div>历史收溢
                <p class="red">
                  <span>{{getMoneyValue}}</span>
                    {{selecteCoindName}}
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
            <router-link class="blue" to="/FinanceInvestmentRecord">查看全部</router-link>
          </div>
          <!-- 投资记录 -->
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="投资记录" name="1">
              <el-table
                :data="investList"
                style="width: 100%"
                empty-text="暂无数据"
                >
                <el-table-column
                  prop="coinShortName"
                  label="投资币种"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="typeDescription"
                  label="投资类型"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="number"
                  width="100"
                  label="数量"
                  >
                </el-table-column>
                <el-table-column
                  prop="expectedEarning"
                  label="预计收益">
                </el-table-column>
                <el-table-column
                  prop="expectedTime"
                  width="180"
                  label="预计发放时间">
                </el-table-column>
                <el-table-column
                  prop="state"
                  label="状态">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  width="180"
                  label="创建时间">
                </el-table-column>
                <el-table-column
                  prop="operations"
                  label="操作">
                  <template slot-scope = "data">
                    <div
                    v-if="data.row.state == '活期'"
                    class="blue"
                    @click="cancleInvest(data.row.id)"
                    >取消</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <!-- 收益记录 -->
            <el-tab-pane label="收益记录" name="2">
              <el-table
                :data="userInterestRecord"
                style="width: 100%"
                empty-text="暂无数据"
                >
                <el-table-column
                  prop="coinShortName"
                  label="投资币种"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="description"
                  label="投资类型"
                  width="230">
                </el-table-column>
                <el-table-column
                  prop="number"
                  width="180"
                  label="数量"
                  >
                </el-table-column>
                <el-table-column
                  prop="expected_earning"
                  width="180"
                  label="预计收益">
                </el-table-column>
                <el-table-column
                  prop="interest"
                  width="180"
                  label="发放收益">
                </el-table-column>
                <el-table-column
                  prop="createTime"
                  width="180"
                  label="预计发放时间">
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
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import FinanceBrokenLine from './FinanceBrokenLine'
import FinanceBrokenPie from './FinanceBrokenPie'
import {timeFilter} from '../../utils'
import {getFinancialManagement, imediateInvestment, cancleInvestment} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('Finance')
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
      // 向线性走势图传值
      selecteCoindInfor: {},
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
      // 是否可以点击立刻投资
      isClick: false,
      // 投资估值
      InvestmentValue: '',
      // 历史收益值
      getMoneyValue: '',
      // 取消投资id
      cancleInvestId: ''
    }
  },
  created () {
    // 对element ui样式重置
    require('../../../static/css/list/InvestmentFinance/FinanceCenter.css')
    // 白样式
    require('../../../static/css/theme/day/InvestmentFinance/FinanceCenter.css')
    // 黑样式
    require('../../../static/css/theme/night/InvestmentFinance/FinanceCenter.css')
    // 页面创建完成请求币种接口
    this.getFinancialManagementList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'FINANCE_LINE_SELECT_COIDINFOR',
      'FINANCE_PIE_INVESTMENT_VALUE',
      'FINANCE_PIE_GET_MONEY_VALUE'
    ]),
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 点击立刻投资按钮执行
    getInvestEarnings () {
      // 执行投资按钮
      this.clickImmediateInvestment()
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
      console.log('你好世界投资理财页面查询')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 设置可用币种数组
        this.traderCoinList = data.data.data.idNameDtoList
        this.traderCoinList.forEach(item => {
          if (data.data.data.idNameDtoList.id == item.id) {
            this.selectedCoinId = item.id
          }
        })
        // 设置每次返回回来的币种id
        this.selectedCoinId = data.data.data.tickerPriceResult.coinId
        // 设置每次返回地币种名称
        this.selecteCoindName = data.data.data.tickerPriceResult.coinName
        // 最新价钱
        this.newnestPrice = data.data.data.tickerPriceResult.price
        // 当日涨幅
        this.dayAmountIncrease = data.data.data.tickerPriceResult.chg
        // 历史涨幅
        this.historyAmountIncrease = data.data.data.tickerPriceResult.historyAmountIncrease
        // 理财类型数组
        this.investTypeList = data.data.data.managementList
        // 设置投资类型默认值
        this.selectedInvestTypeId = data.data.data.managementList[0] ? data.data.data.managementList[0].id : ''
        // 设置可用余额
        this.availableBalance = data.data.data.userTotal
        // 投资估计值
        this.InvestmentValue = data.data.data.userNumber
        // 历史收益
        this.getMoneyValue = data.data.data.userInterest
        // 投资记录列表赋值
        this.investList = data.data.data.userFinancialManagementRecord.list
        // 收益记录列表
        this.userInterestRecord = data.data.data.userInterestRecord.list
        // 获取走势图所需数据
        this.selecteCoindInfor = data.data.data.tickerPriceResult
        // 取消投资传递id
        this.cancleInvestId = data.data.data.tickerPriceResult.renderPriceList
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
      partnerId: state => state.common.partnerId
    }),
    screenWidth () {
      return window.innerWidth / 3
    }
  },
  watch: {}
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
        background-attachment: fixed;
        background-size: cover;
        -webkit-background-size: cover;
        // background:url('../../assets/finance/banner-jpg.jpg') no-repeat center center;
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
                -webkit-box-reflect: below 0 -webkit-linear-gradient(top,rgba(124,184,250,0),rgba(124,184,250,0.2));
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
                margin-left: 10px;
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
                  margin-left: 70px;
                  text-align: center;
                  border: 1px solid #fff;
                  border-image: -webkit-linear-gradient(top,#2B396E,#2A5082);
                  background: -webkit-linear-gradient(left,#2B396E,#2A5082);
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
        background-color: $dayInnerBoxBg;
        >.finance-inner{
          >.container{
          >.finance-form-header{
            >.newnestPrice{
              flex: 1;
              height: 48px;
              display:flex;
              >li{
                border-right:1px solid rgba(30,38,54,0.3);
                color:#666;
                >p{
                  font-size:22px;
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
        >.left{
          color:#666;
          >.nav-header{
            >.balance{
              color:#666;
              >div{
                color:#338FF5;
                >span{
                }
              }
            }
          }
          .left-body{
            >label{
              >.invest-mounte{
                >input{
                  width: 380px;
                  color:#666;
                  vertical-align: center;
                }
              }
              .submitBtn{
                >button{
                }
              }
            }
          }
        }
        >.right{
          >.pieCharts-box{
          >.right-infor{
            >div{
              >p{
              >span{
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
        >.invest-list-header{
          a{
          }
        }
      }
      }
      }
      .invest{
      color: #338FF5;
      background:linear-gradient(left,rgba(51,143,245,0.5),transparent);
    }
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
      background:linear-gradient(left,rgba(34,80,135,1),transparent);
    }
 }
 .el-select-dropdown{
      min-width: 408px!important;
      left:169px!important;
  }
</style>
