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
        <div class="invest-list-header">
          <div class='invest'>投资记录</div>
          <router-link class="blue" to="/FinanceCenter">
          <IconFontCommon class="blue goback-icon" iconName='icon-fanhui'/>返回投资</router-link>
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
        <el-pagination
            background
            v-if="investList.length"
            layout="prev, pager, next"
            page-size='10'
            @current-change='changePage'
            :total='totalPages'>
        </el-pagination>
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
      currnetPage: 1,
      totalPages: 1,
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
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    changePage (pageNum) {
      this.currnetPage = pageNum
      // 重新获取列表
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
