<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height70 font-size16">
      <span class="padding-left15">币币订单</span>
    </header>
    <div class="min-height500 background-color margin-top5">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="当前委托"
          name="current-entrust"
        >
          <div class="inner-box">
            <!--查询条件-->
            <div class="search-condition-box">
              <div class="symbol-box condition-item">
                <span class="currency-span">交易对</span>
                <!--币种-->
                <input
                  type="text"
                  placeholder="币种名称"
                  class="currency-input"
                  v-model="activeSymbol"
                />
                <span class="currency-span">/</span>
                <!--交易区下拉-->
                <el-select
                  clearable
                  v-model="activeExchangeArea"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in entrustSelectList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </div>
              <!--撮合类型-->
              <div class="match-type-box condition-item">
                <span class="currency-span">撮合类型</span>
                <el-select
                  clearable
                  v-model="activeMatchType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in matchTypeList"
                    :key="item.code"
                    :label="$t(`M.${item.i18nName}`)"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </div>
              <!--方向（买入，卖出）-->
              <div class="trade-type-box condition-item">
                <span class="currency-span">方向</span>
                <el-select
                  clearable
                  v-model="activeType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in typeList"
                    :key="item.code"
                    :label="$t(`M.${item.i18nName}`)"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </div>
              <!--起止时间-->
              <div class="start-end-time-box condition-item">
                <span class="currency-span">起止时间</span>
                <el-date-picker
                  clearable
                  v-model="startTime"
                  type="datetime"
                  placeholder="选择日期">
                </el-date-picker>
                <span class="middle-line"> - </span>
                <el-date-picker
                  clearable
                  v-model="endTime"
                  type="datetime"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="search-box condition-item">
                <button
                  class="search-btn cursor-pointer"
                  @click="searchWithCondition('current-entrust')"
                >查询</button>
              </div>
            </div>
            <!--查询结果-->
            <div class="result-box">
              <el-table
                :data="currentEntrustList"
              >
                <el-table-column
                  label="时间"
                  width="125"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.createTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易对"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.tradeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="撮合类型"
                  width="70"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.matchTypeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="方向"
                  width="50"
                >
                  <template slot-scope="s">
                    <span v-show="language !== 'zh_CN'">{{s.row.type}}</span>
                    <span v-show="language === 'zh_CN'">{{s.row.typeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                  width="110"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.count-0 }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托总额"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.amount-0}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="已成交"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{s.row.completeCount-0}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="未成交"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.leftCount-0}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                  width="60"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.statusName }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                  width="60"
                >
                  <template slot-scope="s">
                    <button
                      class="cursor-pointer repeal-btn"
                      @click="repealMyEntrust(s.row.id,s.row.version)"
                    >撤销</button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-pagination
                background
                v-show="activeName === 'current-entrust' && currentEntrustList.length"
                layout="prev, pager, next"
                :page-count="totalPageForMyEntrust"
                @current-change="changeCurrentPage(0,$event)"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {
  getMyEntrust
} from '../../../utils/api/trade'
import {
  getEntrustSelectBox
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  repealMyEntrustCommon
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils'

export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'current-entrust',
      options: [
        {
          value: 'BTC',
          label: 'BTC'
        },
        {
          value: 'ETH',
          label: 'ETH'
        },
        {
          value: 'FBT',
          label: 'FBT'
        }
      ],
      value: '',
      startTime: '',
      endTime: '',
      currentEntrustList: [], // 我的委托订单
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      currentPageForHistoryEntrust: 1, // 历史委托页码
      totalPageForHistoryEntrust: 1, // 历史委托总页数
      pageSize: 10,
      entrustSelectList: [], // 交易区下拉列表
      typeList: [], // 类型列表
      matchTypeList: [], // 撮合类型列表
      activeExchangeArea: '', // 当前选中交易区
      activeStatus: '', // 当前选中状态
      activeMatchType: '', // 当前撮合类型
      activeSymbol: '', // 用户输入币种名称
      activeType: '', // 当前选中方向
      end: '' // 占位
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/CoinOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/CoinOrdersNight.css')
    this.getEntrustSelectBox()
    this.getMyCurrentEntrust()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 查询列表
    async searchWithCondition (entrustType) {
      console.log(this.activeStatus)
      switch (entrustType) {
        case 'current-entrust':
          this.getMyCurrentEntrust()
          break
        case 'history-entrust':
          break
      }
    },
    /**
     * 交易区列表查询
     */
    async getEntrustSelectBox () {
      let params = {
        partnerId: this.partnerId
      }
      const data = await getEntrustSelectBox(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        // console.log(data)
        this.entrustSelectList = data.data.data.coinList
        // this.statusList = data.data.data.statusList
        this.typeList = data.data.data.typeList
        this.matchTypeList = data.data.data.matchTypeList
      }
    },
    /**
     * 切换页码
     * @entrustType: 订单类型： 0：当前委托 1： 历史委托
     */
    changeCurrentPage (entrustType, pageNum) {
      switch (entrustType) {
        case 0:
          this.currentPageForMyEntrust = pageNum
          this.getMyCurrentEntrust()
          break
        case 1:
          this.currentPageForHistoryEntrust = pageNum
          this.getHistoryEntrust()
      }
    },
    /**
     *撤销委单
     */
    repealMyEntrust (id, version) {
      console.log(id)
      let params = {
        id,
        version
      }
      repealMyEntrustCommon(params, (res) => {
        if (!returnAjaxMessage(res, this, 1)) {
          return false
        } else {
          this.getMyCurrentEntrust()
        }
      })
    },
    // 查询当前委单
    async getMyCurrentEntrust () {
      this.currentEntrustList = []
      let params = {
        userId: this.userInfo.userId,
        currentPage: this.currentPageForMyEntrust,
        pageSize: this.pageSize,
        buyCoinName: this.activeSymbol,
        type: this.activeType,
        sellCoinName: this.activeExchangeArea,
        startTime: this.startTime === '' ? '' : timeFilter(this.startTime, 'normal'),
        endTime: this.endTime === '' ? '' : timeFilter(this.endTime, 'normal')
      }
      const data = await getMyEntrust(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        // console.log(data.data.data.list)
        if (data.data.data.list) {
          this.currentEntrustList = data.data.data.list
          this.totalPageForMyEntrust = data.data.data.pages - 0
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      partnerId: state => state.common.partnerId,
      userInfo: state => state.user.loginStep1Info
    })
  },
  watch: {
    startTime (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/TransactionType/CoinOrders";
  .coin-orders{
    .inner-box{
      >.search-condition-box{
        width:100%;
        padding:20px;
        >.condition-item{
          height:34px;
          line-height:34px;
          display:inline-block;
          margin:0 56px 20px 0;
          >.middle-line{
            display:inline-block;
            width:20px;
            height:30px;
            text-align: center;
          }
          &:last-of-type{
            margin-right:0;
          }
          >.currency-span{
            display:inline-block;
            vertical-align: top;
            font-size: 12px;
          }
          >.currency-input{
            color:#fff;
            height:30px;
            vertical-align: top;
            width:80px;
            border:1px solid rgba(72,87,118,1);
            border-radius:2px;
            box-sizing: border-box;
            padding:5px;
            margin:2px;
          }
          >.search-btn{
            width:60px;
            height:34px;
            background:linear-gradient(90deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
            border-radius:4px;
            color: #fff;
          }
        }
      }
      >.result-box{
        .repeal-btn{
          color:$mainColor;
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: rgba(37, 46, 63, 1);
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background-color: #CCCCCC;
      }
    }
  }
</style>
