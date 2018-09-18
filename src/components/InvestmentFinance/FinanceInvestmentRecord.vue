<template>
  <div
    class="finance-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  <!-- 导航 -->
    <HeaderCommon/>
    <!-- banner -->
    <div class="inner-box">
      <div class="finance-inner">
      <!-- 投资 -->
      <div class="invest-list">
         <div class="nvest-list-body">
          <div class="gobackInvest">
            <IconFontCommon class='blue' iconName="icon-fanhui" style="font-size:12px" />
            <router-link class="blue" to="/FinanceCenter">查看全部</router-link>
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
              <el-pagination
                  background
                  v-if="investList.length"
                  layout="prev, pager, next"
                  page-size='10'
                  @current-change='changeInvestPage'
                  :total='investTotalPages'>
              </el-pagination>
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
            <el-pagination
                background
                v-if="userInterestRecord.length"
                layout="prev, pager, next"
                @current-change='changeInterestPage'
                :total='interestTotalPages'>
            </el-pagination>
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
import IconFontCommon from '../Common/IconFontCommon'
import {mapState} from 'vuex'
import {timeFilter} from '../../utils'
import {getFinancialManagement, cancleInvestment} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
    HeaderCommon,
    FooterCommon,
    FinanceBrokenLine,
    FinanceBrokenPie,
    IconFontCommon
  },
  data () {
    return {
      investCurrnetPage: '1',
      investTotalPages: '1',
      interestCurrnetPage: '1',
      interestTotalPages: '1',
      activeName: '1',
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
      ],
      // 收益列表
      userInterestRecord: []
    }
  },
  created () {
    require('../../../static/css/list/InvestmentFinance/FinanceCenter.css')
    require('../../../static/css/theme/day/InvestmentFinance/FinanceCenter.css')
    require('../../../static/css/theme/night/InvestmentFinance/FinanceCenter.css')
    this.getFinancialManagementList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    timeFormatting (data) {
      return timeFilter(data, 'data')
    },
    // 点击投资记录列表下一页查寻
    changeInvestPage (pageNum) {
      this.investCurrnetPage = pageNum
      // 重新获取列表
      this.getFinancialManagementList(this.investCurrnetPage)
    },
    // 点击收益记录下一页查询
    changeInterestPage (pageNum) {
      this.interestCurrnetPage = pageNum
      this.getFinancialManagementList(this.interestCurrnetPage)
    },
    async getFinancialManagementList (pageNum) {
      const data = await getFinancialManagement({
        pageNum: pageNum,
        pageSize: this.pageSize,
        partnerId: this.partnerId
      })
      console.log('投资理财页面查询')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 投资记录列表赋值
        this.investList = data.data.data.userFinancialManagementRecord.list
        // 投资记录总页数
        this.investTotalPages = data.data.data.userFinancialManagementRecord.total
        // 投资记录列表
        this.userInterestRecord = data.data.data.userInterestRecord.list
        // 收益记录总页数
        this.interestTotalPages = data.data.data.userInterestRecord.total
      }
    },
    // 点击取消按钮执行
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
    cancleInvest (id) {
      // 用户点击取消按钮需要请求接口
      this.clickCancleInvestment(id)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
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
  @import "../../../static/css/scss/InvestmentFinance/FinanceCenter";
  .finance-box{
    min-width:1300px;
    width:100%;
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
             top:25px;
             right: 0px;
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
        >div{
          /*background-color: $dayMainBgColor;*/
        }
      }
      .invest{
      color: #338FF5;
      background:linear-gradient(left,rgba(51,143,245,0.5),transparent);
    }
    }
    .goback-icon{
      font-size: 16px;
      margin-right:5px;
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
