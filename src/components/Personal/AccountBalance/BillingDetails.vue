<template>
  <div
    class="billing-details personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="billing-details-header personal-height40 line-height40 background-color padding-left23">
      <span
        class="header-content display-inline-block font-size16 cursor-pointer"
      >
        充提记录
        <!--@click.prevent.prevent="clickTableCut(1)"-->
      </span>
      <!--<span-->
        <!--class="header-content display-inline-block font-size16 cursor-pointer"-->
        <!--@click.prevent.prevent="clickTableCut(2)"-->
      <!--&gt;-->
        <!--其他记录-->
      <!--</span>-->
    </header>
    <div class="billing-details-main paddinglr20">
      <div class="billing-details-query">
        <div class="float-left cursor-pointer">
          <span class="demonstration display-inline-block font-size12">币种</span>
          <el-select
            v-model="currencyListValue"
            clearable
            @change="changeId"
          >
            <el-option
              v-for="(item, index) in currencyList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <!--充提记录-->
        <div class="float-left margin-left50 cursor-pointer">
          <span class="demonstration font-size12">类型</span>
          <el-select
            v-model="currencyTypeValue"
          >
            <el-option
              v-for="item in currencyType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <!--其他记录-->
        <!--<div class="float-left margin-left50 cursor-pointer">-->
          <!--<span class="demonstration">类型</span>-->
          <!--<el-select-->
            <!--v-model="otherRecordsValue"-->
          <!--&gt;-->
            <!--<el-option-->
              <!--v-for="item in otherRecordsType"-->
              <!--:key="item.value"-->
              <!--:label="item.label"-->
              <!--:value="item.value"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</div>-->
        <div class="float-left margin-left58 cursor-pointer">
          <div class="block">
            <span class="demonstration font-size12">日期</span>
            <el-date-picker
              v-model="startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            &nbsp;&nbsp;-&nbsp;&nbsp;
            <el-date-picker
              v-model="endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </div>
        </div>
        <div
          class="search-button float-right border-radius2 text-align-c cursor-pointer font-size12"
          @click.prevent="stateSearchButton"
        >
          搜索
        </div>
      </div>
      <!--充提记录-->
      <div
        v-show="showStatusRecordList"
        class="billing-details-content"
      >
        <el-table
          :data="chargeRecordList"
          style="width: 100%"
          empty-text="暂无充提记录"
        >
          <el-table-column
            label="币种"
            width="100"
          >
            <template slot-scope = "s">
              <div>{{ s.row.coinName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            width="100"
          >
            <template slot-scope = "s">
              <div>{{ s.row.typeName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
          >
            <template slot-scope = "s">
              <div>{{ s.row.amount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="提交时间"
          >
            <template slot-scope = "s">
              <div>{{ s.row.createTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="更新时间"
          >
            <template slot-scope = "s">
              <div>{{ s.row.updateTime }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态"
          >
            <template slot-scope = "s">
              <div>{{ s.row.statusName }}</div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          background
          v-show="activeName === 'current-entrust' && chargeRecordList.length"
          layout="prev, pager, next"
          :page-count="totalPageForMyEntrust"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
      </div>
      <!--其他记录-->
      <div
        v-show="hiddenStatusRecordList"
        class="billing-details-content"
      >
        <el-table
          :data="otherRecordsList"
          style="width: 100%"
          empty-text="暂无其他记录"
        >
          <el-table-column
            label="时间"
          >
            <template slot-scope = "s">
              <div>{{ s.row.time }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="币种"
          >
            <template slot-scope = "s">
              <div>{{ s.row.coinName }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
          >
            <template slot-scope = "s">
              <div>{{ s.row.type }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="数量"
          >
            <template slot-scope = "s">
              <div>{{ s.row.amount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态"
          >
            <template slot-scope = "s">
              <div>{{ s.row.status }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {
  statusRushedToRecordList,
  getMerchantCurrencyList
} from '../../../utils/api/personal'
import {returnAjaxMessage} from '../../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // 充提记录
      showStatusRecordList: true, // 充提记录
      chargeRecordList: [],
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      startTime: '', // 开始起止时间
      endTime: '', // 结束起止时间
      // 币种名称
      currencyListValue: '', // 默认币种
      currencyList: [], // 币种列表
      // 充提记录类型
      currencyTypeValue: '', // 默认类型
      currencyType: [
        {
          value: '',
          label: '全部'
        }, {
          value: 'RECHARGE',
          label: '充币'
        }, {
          value: 'WITHDRAW',
          label: '提币'
        }
      ], // 默认类型
      // 其他记录
      otherRecordsList: [
        {
          time: '2016-05-02 10:30:30',
          coinName: 'BTC',
          type: '全部',
          amount: '12312',
          status: '已完成'
        }, {
          time: '2016-05-02 10:30:30',
          coinName: 'BTC',
          type: '全部',
          amount: '12312',
          status: '已完成'
        }, {
          time: '2016-05-02 10:30:30',
          coinName: 'BTC',
          type: '全部',
          amount: '12312',
          status: '已完成'
        }, {
          time: '2016-05-02 10:30:30',
          coinName: 'BTC',
          type: '全部',
          amount: '12312',
          status: '已完成'
        }
      ],
      hiddenStatusRecordList: false, // 其他记录
      // 其他记录类型
      otherRecordsValue: '',
      otherRecordsType: [
        {
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '活动奖励'
        }, {
          value: '3',
          label: '糖果奖励'
        }, {
          value: '4',
          label: '系统赠送'
        }, {
          value: '5',
          label: '邀请奖励'
        }
      ],
      otherRecordTypes: false
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/BillingDetails.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/BillingDetailsDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/BillingDetailsNight.css')
    // console.log(this.inquireCurrencyList)
    // this.inquireCurrencyList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // table切换
    clickTableCut (val) {
      if (val == 1) {
        this.hiddenStatusRecordList = false
        this.showStatusRecordList = true
        this.getPushRecordList()
      } else if (val == 2) {
        this.showStatusRecordList = false
        this.hiddenStatusRecordList = true
      }
    },
    // 搜索按钮
    stateSearchButton () {
      this.getChargeMentionList()
    },
    /**
     * 刚进页面时候 冲提记录列表展示
     */
    async getChargeMentionList () {
      let data = await statusRushedToRecordList({
        currentPage: this.currentPageForMyEntrust, // 当前委托页码
        pageSize: this.pageSize, // 每页显示条数
        userId: this.userInfo.userInfo.userId, // 用户ID
        coinId: this.currencyListValue, // 币种ID
        type: this.currencyTypeValue, // 类型（RECHARGE:充值 WITHDRAW:提现）
        startTime: this.startTime, // 开始起止时间
        endTime: this.endTime // 结束起止时间
      })
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回冲提记录列表展示
        this.chargeRecordList = data.data.data.list
        this.totalPageForMyEntrust = data.data.data.pages - 0
        console.log(this.chargeRecordList)
      }
    },
    // 资产币种下拉
    changeId (e) {
      console.log(e)
      this.currencyList.forEach(item => {
        if (e === item.id) {
          console.log(e)
          this.inquireCurrencyList(e)
        }
      })
      // this.currencyList.forEach(item => {
      //   if (id === item.coinId) {
      //     this.currencyListValue = id
      //     this.inquireCurrencyList(id)
      //     console.log(id)
      //   }
      // })
    },
    // 获取商户币种列表
    async inquireCurrencyList () {
      let data
      let param = {
        partnerId: this.partnerId // 商户id
      }
      data = await getMerchantCurrencyList(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.currencyList = data.data.data
        console.log(this.currencyList)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getChargeMentionList()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      partnerId: state => state.common.partnerId, // 商户id
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'billing-details') {
        this.getChargeMentionList()
        this.inquireCurrencyList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .billing-details{
    >.billing-details-main{
      min-height: 500px;
      >.billing-details-query {
        height: 57px;
        line-height: 57px;
        >.search-button {
          width: 50px;
          height: 30px;
          margin-top: 15px;
          line-height: 29px;
        }
        /*display: flex;*/
        /*>.search-condition {*/
          /*width*/
        /*}*/
        .demonstration {
          margin-right: 5px;
        }
      }
    }
    >.billing-details-header {
      margin-bottom: 2px;
      >.header-content {
        width: 100px;
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.billing-details-main {
        background-color: #1e2636;
        >.billing-details-query {
          border-bottom: 1px solid #39424D;
          >.search-button {
            background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            color: #fff;
          }
        }
      }
      >.billing-details-header{
        background-color: #1e2636;
        box-shadow: 0px 5px 50px #181e2a;
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.billing-details-main {
        background-color: $dayBgColor;
        >.billing-details-query {
          border-bottom: 1px solid rgba(57,66,77,0.1);
          >.search-button {
            background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            color: #fff;
          }
          .demonstration {
            color: #7D90AC;
          }
        }
      }
      >.billing-details-header{
        background: rgb(255,255,255);
        border: 1px solid rgb(236,241,248);
        border-radius: 2px;
        box-shadow: 1px 0px 3px rgb(236,236,236);
      }
    }
  }
</style>
