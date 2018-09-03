<template>
  <div class="otc-report-form-statistics-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 -->
    <div class="report-form-statistics-content">
      <!-- 2.1 报表统计标题 -->
      <div class="report-form-title font-size20 padding-l15 font-weight700">
        报表统计
      </div>
      <!-- 2.2 筛选条件 -->
      <div class="report-form-filtrate">
        <span class="filtrate-text font-size14">
          交易币种
        </span>
        <span class="currency-input">
          <el-select
            v-model="activitedTraderCoinId"
            @change="changeCoinId"
          >
            <el-option
              v-for="(item,index) in traderCoinList"
              :key="index"
              :value="item.coinId"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </span>
        <span class="filtrate-text font-size14">
          交易法币
        </span>
        <span class="legal-tender-input">
          <el-select
            v-model="activitedtraderCurrencyCoinsId"
            @change="changeCurrencyCoinsId"
          >
            <el-option
              v-for="(item,index) in traderCurrencyCoinsList"
              :key="index"
              :value="item.coinId"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </span>
      </div>
      <!-- 2.3 资产配置 -->
      <div class="report-form-asset">
        <div class="title padding-l15 border-radius5">
          资产配置
        </div>
        <div class="content font-size18">
          <span>总资产≈</span>
          <span>0.00</span>
          <span>{{activitedtraderCurrencyCoinsName}}</span>
        </div>
      </div>
      <!-- 2.4 购买和销售 -->
      <div class="report-form-buy-sell">
        <div class="common buy">
          <div class="head padding-l15 border-radius5">
            购买
          </div>
          <div class="body">
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  当日<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  上周<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  上月<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  历史<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="common sell">
          <div class="head padding-l15 border-radius5">
            销售
          </div>
          <div class="body">
            <div class="together border-radius5 day">
              <div class="left">
                <span class="round font-size12">
                  当日<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 week">
              <div class="left">
                <span class="round font-size12">
                  上周<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 month">
              <div class="left">
                <span class="round font-size12">
                  上月<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
            <div class="together border-radius5 history">
              <div class="left">
                <span class="round font-size12">
                  历史<br />交易
                </span>
              </div>
              <div class="right">
                <p>
                  <span>购买数量:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>购买均价:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>支出金额:</span><span class="data"> 45645646BTC</span>
                </p>
                <p>
                  <span>成交订单:</span><span class="data"> 45645646笔</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 2.5 订单详情 -->
      <div class="report-form-details">
        <!-- 2.5.1 标题 -->
        <div class="title padding-l15 border-radius5">
          订单详情
        </div>
        <!-- 主要内容 -->
        <div class="content">
          <!-- 2.5.2 选择日期 -->
          <div class="date">
            <!-- 左侧日历 -->
            <div class="select-date">
              <span class="text">日期</span>
              <span class="date-picker">
                <!--开始日期-->
                <el-date-picker
                  placeholder="选择日期"
                  v-model="value1"
                  type="date"
                  value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <span class="date-short-line">-</span>
                <!--结束日期-->
                <el-date-picker
                  placeholder="选择日期"
                  v-model="value2"
                  value-format="yyyy-MM-dd"
                  type="date"
                >
                </el-date-picker>
              </span>
            </div>
            <!-- 右侧单选日期按钮 -->
            <div class="radio-date">
              <el-radio-group v-model="radio2">
                <el-radio :label="1">当日</el-radio>
                <el-radio :label="2">上周</el-radio>
                <el-radio :label="3">上月</el-radio>
                <el-radio :label="4">历史</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 2.5.3 订单表格详情 -->
          <div class="order-table">
            <el-table
              :data = "orderInfoList"
              style = "width: 100%"
              empty-text="暂无数据"
            >
              <!-- 交易日期 -->
              <el-table-column
                label = "交易日期"
                width="180"
              >
                <template slot-scope = "scope">
                    <div>{{timeFormatting(scope.row.time)}}</div>
                </template>
              </el-table-column>
              <!-- 订单号 -->
              <el-table-column
                label = "订单号"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.orderID}}</div>
                </template>
              </el-table-column>
              <!-- 交易类型 -->
              <el-table-column
                label = "交易类型"
              >
                <template slot-scope = "scope">
                  <div
                    v-if="scope.row.buySellStatus === 1"
                    :class="{red:scope.row.buySellStatus === 1}"
                  >
                    购买
                  </div>
                  <div
                    v-if="scope.row.buySellStatus === 2"
                    :class="{green:scope.row.buySellStatus === 2}"
                  >
                    出售
                  </div>
                </template>
              </el-table-column>
              <!-- 资金类型 -->
              <el-table-column
                label = "资金类型"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.monenyStyle}}</div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                label = "数量"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.sum}}</div>
                </template>
              </el-table-column>
              <!-- 单价 -->
              <el-table-column
                label = "单价"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.price}}</div>
                </template>
              </el-table-column>
              <!-- 总金额 -->
              <el-table-column
                label = "总金额"
              >
                <template slot-scope = "scope">
                  <div>{{scope.row.totalMoney}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 1.0 广告管理筛选下拉框数组--交易币种
      traderCoinList: [
        {
          coinId: '1',
          name: 'BTC'
        },
        {
          coinId: '2',
          name: 'fuc'
        }
      ],
      activitedTraderCoinId: '', // 选中的交易币种id
      activitedTraderCoinName: '', // 选中的交易币种name
      // 2.0 广告管理筛选下拉框数组--交易法币
      traderCurrencyCoinsList: [
        {
          coinId: '123',
          name: '人民币',
          shortName: 'CNY'
        },
        {
          coinId: '456',
          name: '美元',
          shortName: 'USD'
        }
      ],
      activitedtraderCurrencyCoinsId: '', // 选中的交易法币id
      activitedtraderCurrencyCoinsName: '', // 选中的交易法币name
      value1: '', // 默认开始时间
      value2: '', // 默认结束时间
      radio2: 1, // 单选按钮时间
      // 订单详情
      orderInfoList: [
        {
          id: 1,
          time: 1302486032000,
          orderID: '20180818001',
          buySellStatus: 1, // 1:买 2：卖
          monenyStyle: 'CNY',
          sum: '2.7869',
          price: '67812.21',
          totalMoney: '0.00123'
        },
        {
          id: 2,
          time: 1302486032000,
          orderID: '20180818002',
          buySellStatus: 2, // 1:买 2：卖
          monenyStyle: 'CNY',
          sum: '3.3869',
          price: '63312.21',
          totalMoney: '0.0033323'
        },
        {
          id: 3,
          time: 1302486032000,
          orderID: '20180818002',
          buySellStatus: 1, // 1:买 2：卖
          monenyStyle: 'CNY',
          sum: '3.3869',
          price: '63312.21',
          totalMoney: '0.0033323'
        },
        {
          id: 4,
          time: 1302486032000,
          orderID: '20180818002',
          buySellStatus: 2, // 1:买 2：卖
          monenyStyle: 'CNY',
          sum: '3.3869',
          price: '63312.21',
          totalMoney: '0.0033323'
        },
        {
          id: 5,
          time: 1302486032000,
          orderID: '20180818002',
          buySellStatus: 1, // 1:买 2：卖
          monenyStyle: 'CNY',
          sum: '3.3869',
          price: '63312.21',
          totalMoney: '0.0033323'
        }
      ]
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCReportFormStatistics.css')
    require('../../../static/css/theme/day/OTC/OTCReportFormStatisticsDay.css')
    require('../../../static/css/theme/night/OTC/OTCReportFormStatisticsNight.css')
    // 1.0 otc可用币种查询
    this.getOTCAvailableCurrencyList()
    // 2.0 查询可用法币币种列表
    this.getMerchantAvailablelegalTenderList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 'CHANGE_OTC_MERCHANT_AND_COMMON_MINCOUNT'
    ]),
    // 1.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    //  2.0 otc可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.partnerId
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.traderCoinList = data.data.data
      }
    },
    //  2.1 改变可用币种类型
    changeCoinId (e) {
      // console.log(e)
      this.activitedTraderCoinId = e
      console.log(this.activitedTraderCoinId)
      this.traderCoinList.forEach(item => {
        // console.log(item)
        // console.log(item.coinId)
        if (e === item.coinId) {
          // console.log(item.name)
          this.activitedTraderCoinName = item.name
          console.log(this.activitedTraderCoinName)
        }
      })
    },
    //  3.0 查询 可用法币 币种列表
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.partnerId
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.traderCurrencyCoinsList = data.data.data
      }
    },
    //  3.1 改变 可用法币 币种类型
    changeCurrencyCoinsId (e) {
      // console.log(e)
      this.activitedtraderCurrencyCoinsId = e
      console.log(this.activitedtraderCurrencyCoinsId)
      this.traderCurrencyCoinsList.forEach(item => {
        // console.log(item)
        // console.log(item.coinId)
        if (e === item.coinId) {
          // console.log(item.shortName)
          this.activitedtraderCurrencyCoinsName = item.shortName
          console.log(this.activitedtraderCurrencyCoinsName)
        }
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 商户id
      partnerId: state => state.common.partnerId,
      // 测试拿到userinfo
      userInfo: state => state.personal.userInfo
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCReportFormStatistics.scss);
.otc-report-form-statistics-box{
  background-color: #1D2331;
  >.report-form-statistics-content{
    width: 1150px;
    margin: 70px auto;
    /*background-color: #2B2B2B;*/
    padding-top: 50px;
    >.report-form-title{
      height: 30px;
      line-height: 30px;
      color: #338FF5;
      border-left: 3px solid #338FF5;
      margin-bottom: 30px;
    }
    >.report-form-filtrate{
      >.filtrate-text{
        color: #9DA5B3;
        margin-right: 20px;
      }
      >.currency-input{
        margin-right: 50px;
      }
      >.legal-tender-input{
      }
    }
    >.report-form-asset{
      color: #338FF5;
      background-color: #202A33;
      margin-top: 20px;
      >.title{
        height: 40px;
        line-height: 40px;
        border: 1px solid #262F38;
        box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        text-align: center;
        height: 160px;
        line-height: 160px;
        border: 1px solid #262F38;
        border-top: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
      }
    }
    >.report-form-buy-sell{
      display: flex;
      flex: 2;
      margin-top: 20px;
      >.common{
        background-color: #202A33;
        >.head{
          width: 570px;
          height: 40px;
          color: #338FF5;
          line-height: 40px;
          border: 1px solid #262F38;
          box-shadow: 0px 4px 6px #191E28;
        }
        >.body{
          width: 570px;
          height: 420px;
          padding: 20px 18px 0 18px;
          border: 1px solid #262F38;
          border-top: 0;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          >.together{
            width: 250px;
            height: 164px;
            border: 1px solid #262F38;
            display: flex;
            /*padding: 10px 5px 0px 5px;*/
            padding-top: 10px;
            >.left{
              flex: 1;
              box-sizing: border-box;
              text-align: center;
              position: relative;
              color: #D45858;
              >.round{
                box-sizing: border-box;
                display: inline-block;
                padding-top: 9px;
                width: 50px;
                height: 50px;
                background-color: #3B3139;
                border-radius: 50px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
              }
            }
            >.right{
              flex: 2;
              // line-height: 2rem;
              line-height: 35px;
              color: #9DA5B3;
              .data{
                color: #D45858;
              }
            }
          }
        }
      }
      >.buy{
        flex: 1;
        margin-right: 10px;
      }
      >.sell{
        flex: 1;
        >.body{
          .together{
            >.left{
              color: #008069;
              >.round{
                background-color: #28403D;
              }
            }
            >.right{
              .data{
                color: #008069 !important;
              }
            }
          }
        }
      }
    }
    >.report-form-details{
      background-color: #202A33;
      margin-top: 20px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      >.title{
        height: 40px;
        line-height: 40px;
        color: #338FF5;
        box-shadow: 0px 4px 6px #191E28;
      }
      >.content{
        height: 344px;
        >.date{
          height: 50px;
          line-height: 50px;
          margin-top: 30px;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          >.select-date{
            >.text{
              color: #9DA5B3;
              margin-right: 10px;
            }
            >.date-picker{
              >.date-short-line{
                margin: 0 7px;
              }
            }
          }
          >.radio-date{
            color: #46505F;
          }
        }
        >.order-table{
          margin-top: 20px;
          padding: 0 55px 0 43px;
          .red{
            color: #D45858;
          }
          .green{
            color: #008069;
          }
        }
      }
    }
  }
}
</style>
