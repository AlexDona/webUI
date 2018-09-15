<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  <!-- 导航 -->
    <HeaderCommon/>
    <!-- banner -->
    <div
      class="banner-box"
      :style="{
        width:screenWidth*3+'px',
        height:screenWidth*0.81875+'px'
      }"
    ></div>
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
              :value="item.coinId">
            </el-option>
          </el-select>
          <ul class="newnestPrice">
            <li>
              <p>5.231<span>{{selecteCoindName}}</span></p>
              最新价钱
            </li>
            <li>
              <p class="green">-456%</p>
              当日涨幅
            </li>
            <li>
              <p class="red">+300%</p>
              历史涨幅
            </li>
          </ul>
      </div>
      <FinanceBrokenLine/>
      </div>
      <!-- 投资 -->
      <div class="finance-inner-box">
        <div class="left">
          <div class="nav-header">
            <div class="invest">投资</div>
            <div class="balance">可用余额&nbsp;:&emsp; <div>10000.00<span>{{selecteCoindName}}</span></div></div>
          </div>
          <div class="left-body">
            <label for="">
              投资类型:
              <el-select v-model="selectedInvestTypeValue">
                <el-option
                  v-for="(item,index) in investTypeList"
                  :key="index"
                  :label="item.text"
                  :value="item.id">
                </el-option>
              </el-select>
            </label>
            <label for="">
              投资数量:
              <div class='invest-mounte'>
                <input v-model="input" placeholder="请输入内容"/>
                <span>{{selecteCoindName}}</span>
              </div>
            </label>
            <label for="">
              <div class='submitBtn'>
                <input type="button" value="投资领收益" disabled/>
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
                  <span>11111.00</span>
                  {{selecteCoindName}}
                </p>
              </div>
              <div>历史收溢
                <p class="red">
                  <span>00000.123</span>
                    {{selecteCoindName}}
                </p>
              </div>
          </div>
          <div class="pieCharts">
            <FinanceBrokenPie/>
          </div>
        </div>
        </div>
      </div>
      <div class="invest-list">
        <div class="invest-list-header">
          <div class='invest'>投资记录</div>
          <router-link class="blue" to="/FinanceInvestmentRecord">查看全部</router-link>
        </div>
        <div class="nvest-list-body">
          <el-table
            :data="investList"
            style="width: 100%"
            empty-text="暂无数据"
            >
            <el-table-column
              prop="coinName"
              label="投资币种"
              width="100">
            </el-table-column>
            <el-table-column
              prop="investType"
              label="投资类型"
              width="180">
            </el-table-column>
            <el-table-column
              prop="count"
              width="100"
              label="数量"
              >
            </el-table-column>
            <el-table-column
              prop="prospectiveEarning"
              label="预计收益">
            </el-table-column>
            <el-table-column
              prop="gaveOutTime"
              width="180"
              label="预计发放时间">
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope = "data">
                <div v-if="data.row.status == 'COMPLETED'">已完成</div>
                <div v-if="data.row.status == 'GAVEOUT'">已发放</div>
                <div v-if="data.row.status == 'FROZENED'">冻结</div>
                <div v-if="data.row.status == 'CANCELED'">取消</div>
                <div v-if="data.row.status == 'REDEMPTIONED'">已赎回</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="createdTime"
              width="180"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="operations"
              label="操作">
              <template slot-scope = "data">
                <div v-if="data.row.operations == 'CANCELED'" class="blue">取消</div>
              </template>
            </el-table-column>
          </el-table>
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
// import {businessApply, firstEnterBusinessApply} from '../../utils/api/OTC'
// import {returnAjaxMessage} from '../../utils/commonFunc'
// import {createNamespacedHelpers, mapState} from 'vuex'
import {mapState} from 'vuex'
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
      selectedCoinId: 'BTC',
      // 选中币种的名称
      selecteCoindName: '',
      traderCoinList: [
        {
          coinId: '1',
          name: 'BTC'
        },
        {
          coinId: '2',
          name: 'USBT'
        },
        {
          coinId: '3',
          name: 'FTH'
        },
        {
          coinId: '4',
          name: 'ETH'
        }
      ],
      selectedInvestTypeValue: '',
      investTypeList: [
        {
          id: '1',
          text: '【定期不可提前取回】90天收益3.075% 收益合年化15%'
        },
        {
          id: '2',
          text: '【定期不可提前取回】80天收益3.075% 收益合年化15%'
        },
        {
          id: '3',
          text: '【定期不可提前取回】70天收益3.075% 收益合年化15%'
        },
        {
          id: '4',
          text: '【定期不可提前取回】60天收益3.075% 收益合年化15%'
        }
      ],
      investList: [
        {
          coinid: '00000',
          coinName: 'BTC',
          investType: '定期不可取回',
          count: '100',
          prospectiveEarning: '200',
          gaveOutTime: '2015-07-15 12:12:12',
          status: 'COMPLETED',
          createdTime: '2015-07-28 15:15:15',
          operations: 'CANCELED'
        },
        {
          coinid: '00000',
          coinName: 'BTF',
          investType: '定期不可取回',
          count: '100',
          prospectiveEarning: '200',
          gaveOutTime: '2015-07-15 12:12:12',
          status: 'GAVEOUT',
          createdTime: '2015-07-28 15:15:15',
          operations: ''
        },
        {
          coinid: '00000',
          coinName: 'BTT',
          investType: '定期不可取回',
          count: '100',
          prospectiveEarning: '200',
          gaveOutTime: '2015-07-15 12:12:12',
          status: 'FROZENED',
          createdTime: '2015-07-28 15:15:15',
          operations: 'CANCELED'
        },
        {
          coinid: '00000',
          coinName: 'BTCD',
          investType: '定期不可取回',
          count: '100',
          prospectiveEarning: '200',
          gaveOutTime: '2015-07-15 12:12:12',
          status: 'CANCELED',
          createdTime: '2015-07-28 15:15:15',
          operations: ''
        },
        {
          coinid: '00000',
          coinName: 'BTCD',
          investType: '定期不可取回',
          count: '100',
          prospectiveEarning: '200',
          gaveOutTime: '2015-07-15 12:12:12',
          status: 'REDEMPTIONED',
          createdTime: '2015-07-28 15:15:15',
          operations: 'CANCELED'
        }
      ]
    }
  },
  created () {
    require('../../../static/css/list/InvestmentFinance/FinanceCenter.css')
    require('../../../static/css/theme/day/InvestmentFinance/FinanceCenter.css')
    require('../../../static/css/theme/night/InvestmentFinance/FinanceCenter.css')
    // 页面创建完成请求币种接口
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 币种选择变化时赋值币种名称
    changeTraderCoin (e) {
      this.selectedValue = e
      this.traderCoinList.forEach(item => {
        if (item.coinId == e) {
          this.selecteCoindName = item.name
        }
      })
      // 发送请求不同币种对应的数据
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    }),
    screenWidth () {
      return window.innerWidth / 3
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/InvestmentFinance/FinanceCenter";
  .finance-box{
    min-width:1300px;
    width:100%;
    height:100%;
      >.banner-box{
          background:url('../../assets/finance/banner-jpg.jpg') no-repeat center center/100% 100%;
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
                border-radius: 4px;
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
                width: 407px;
                height: 48px;
                margin-left: 70px;
                text-align: center;
                border: 1px solid #fff;
                border-image: -webkit-linear-gradient(left,#2B396E,#2A5082);
                background: -webkit-linear-gradient(left,#2B396E,#2A5082);
                >input{
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
            width: 200px;
            overflow: hidden;
            >div{
              line-height: 30px;
              margin-bottom:30px;
              >p{
              font-size:12px;
              >span{
                font-size: 22px;
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
        >.invest-list-header{
          display: flex;
          justify-content: space-between;
          router-link{
            line-height: 57px;
            cursor: pointer;
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
        >div{
          /*background-color: $dayMainBgColor;*/
        }
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
</style>
