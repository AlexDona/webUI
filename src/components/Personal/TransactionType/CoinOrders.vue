<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color personal-height40 line-height40 font-size16">
      <span class="padding-left15 font-weight600 coin-color">
        <!--币币订单-->
        {{ $t('M.user_coin') }}{{ $t('M.comm_order') }}
      </span>
    </header>
    <div class="height500 background-color margin-top9">
      <el-tabs
        v-model="activeName"
        @tab-click = "coinMoneyOrders"
      >
        <!--查询条件-->
        <div class="search-condition-box">
          <div class="symbol-box condition-item">
            <span class="currency-span">
              <!--交易对-->
              {{ $t('M.comm_deal') }}{{ $t('M.comm_pair') }}
            </span>
            <!--币种-->
            <!--币种名称-->
            <input
              type="text"
              :placeholder="$t('M.comm_currency') + $t('M.user_account_name')"
              class="currency-input"
              v-model="activeSymbol"
            />
            <span class="currency-span">/</span>
            <!--交易区下拉-->
            <!--请选择-->
            <el-select
              clearable
              v-model="activeExchangeArea"
              :placeholder="$t('M.comm_please_choose')"
            >
              <el-option
                v-for="item in entrustSelectList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </div>
          <!--撮合类型-->
          <div class="match-type-box condition-item">
            <span class="currency-span">
              <!--撮合类型-->
              {{ $t('M.user_coin_bring_together') }}{{ $t('M.comm_type') }}
            </span>
            <!--请选择-->
            <el-select
              clearable
              v-model="activeMatchType"
              :placeholder="$t('M.comm_please_choose')"
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
            <span class="currency-span">
              <!--委单类型-->
              {{ $t('M.user_coin_appoint_single') }}{{ $t('M.comm_type') }}
            </span>
            <!--请选择-->
            <el-select
              clearable
              v-model="activeType"
              :placeholder="$t('M.comm_please_choose')"
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
            <span class="currency-span">
              <!--起止时间-->
              {{ $t('M.user_coin_start_stop') }}{{ $t('M.comm_data') }}
            </span>
            <!--选择日期-->
            <el-date-picker
              clearable
              v-model="startTime"
              type="datetime"
              :placeholder="$t('M.comm_select') + $t('M.comm_data')"
            >
            </el-date-picker>
            <span class="middle-line"> - </span>
            <!--选择日期-->
            <el-date-picker
              clearable
              v-model="endTime"
              type="datetime"
              :placeholder="$t('M.comm_select') + $t('M.comm_data')"
            >
            </el-date-picker>
          </div>
          <div class="search-box condition-item">
            <button
              class="search-btn cursor-pointer"
              @click.prevent="searchWithCondition(activeName)"
            >
              <!--查询-->
              {{ $t('M.comm_query') }}
            </button>
          </div>
        </div>
        <!--当前委托-->
        <el-tab-pane
          :label="$t('M.user_coin_commissioned_current')"
          name="current-entrust"
        >
          <div class="inner-box">
            <!--查询结果-->
            <div class="result-box">
              <el-table
                :data="currentEntrustList"
                :empty-text="$t('M.comm_no_data')"
              >
                <!--时间-->
                <el-table-column
                  :label="$t('M.comm_time')"
                  width="135"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.createTime }}</span>
                  </template>
                </el-table-column>
                <!--交易对-->
                <el-table-column
                  :label="$t('M.comm_deal') + $t('M.comm_pair')"
                  width="80"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.tradeName }}</span>
                  </template>
                </el-table-column>
                <!--撮合类型-->
                <el-table-column
                  :label="$t('M.user_coin_bring_together') + $t('M.comm_type')"
                  width="70"
                >
                  <template slot-scope="s">
                    <span>{{ $t(`M.${s.row.i18nMatchTypeName}`) }}</span>
                    <!--<span>{{ s.row.matchTypeName }}</span>-->
                  </template>
                </el-table-column>
                <!--委单类型-->
                <el-table-column
                  :label="$t('M.user_coin_appoint_single') + $t('M.comm_type')"
                  width="70"
                >
                  <template slot-scope="s">
                    <span v-show="language !== 'zh_CN'">{{s.row.type}}</span>
                    <span v-show="language === 'zh_CN'">{{s.row.typeName}}</span>
                  </template>
                </el-table-column>
                <!--数量-->
                <el-table-column
                  :label="$t('M.comm_count')"
                  width="110"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.count-0 }}</span>
                  </template>
                </el-table-column>
                <!--委托总额-->
                <el-table-column
                  :label="$t('M.user_coin_appoint_single') + $t('M.user_coin_rental')"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.amount-0}}</span>
                  </template>
                </el-table-column>
                <!--已成交-->
                <el-table-column
                  :label="$t('M.comm_already') + $t('M.comm_make_bargain')"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{s.row.completeCount-0}}</span>
                  </template>
                </el-table-column>
                <!--未成交-->
                <el-table-column
                  :label="$t('M.comm_not') + $t('M.comm_make_bargain')"
                  width="120"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.leftCount-0}}</span>
                  </template>
                </el-table-column>
                <!--状态-->
                <el-table-column
                  :label="$t('M.comm_state')"
                  width="60"
                >
                  <template slot-scope="s">
                    <span>{{ $t(`M.${s.row.i18nStatusName}`) }}</span>
                  </template>
                </el-table-column>
                <!--操作-->
                <el-table-column
                  :label="$t('M.comm_operation')"
                  width="85"
                >
                  <template slot-scope="s">
                    <button
                      class="cursor-pointer repeal-btn"
                      @click.prevent="repealMyEntrust(s.row.id,s.row.version)"
                    >
                      <!--撤销-->
                      {{ $t('M.user_push_revocation') }}
                    </button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页-->
              <el-pagination
                background
                v-show="activeName === 'current-entrust' && currentEntrustList.length"
                layout="prev, pager, next"
                :page-count="totalPageForMyEntrust"
                @current-change="changeCurrentPage('current-entrust',$event)"
              >
              </el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!--历史委托-->
        <el-tab-pane
          :label="$t('M.user_coin_commissioned_history')"
          name="history-entrust"
        >
          <el-table
            :data="historyEntrustList"
            :empty-text="$t('M.comm_no_data')"
          >
            <!--时间-->
            <el-table-column
              :label="$t('M.comm_time')"
              width="135"
            >
              <template slot-scope="s">
                <span>{{ s.row.createTime }}</span>
              </template>
            </el-table-column>
            <!--交易对-->
            <el-table-column
              :label="$t('M.comm_deal') + $t('M.comm_pair')"
              width="80"
            >
              <template slot-scope="s">
                <span>{{ s.row.tradeName }}</span>
              </template>
            </el-table-column>
            <!--撮合类型-->
            <el-table-column
              :label="$t('M.user_coin_bring_together') + $t('M.comm_type')"
            >
              <template slot-scope="s">
                <span>{{ $t(`M.${s.row.i18nMatchTypeName}`) }}</span>
                <!--<span>{{ s.row.matchTypeName }}</span>-->
              </template>
            </el-table-column>
            <!--委单类型-->
            <el-table-column
              :label="$t('M.user_coin_appoint_single') + $t('M.comm_type')"
            >
              <template slot-scope="s">
                <span v-show="language !== 'zh_CN'">{{s.row.type}}</span>
                <span v-show="language === 'zh_CN'">{{s.row.typeName}}</span>
              </template>
            </el-table-column>
            <!--价格-->
            <el-table-column
              :label="$t('M.comm_price_metre')"
              width="110"
            >
              <template slot-scope="s">
                <span>{{ s.row.price }}</span>
              </template>
            </el-table-column>
            <!--委托量-->
            <el-table-column
              :label="$t('M.user_coin_entrust') + $t('M.comm_quantity')"
              width="120"
            >
              <template slot-scope="s">
                <span>{{ s.row.count }}</span>
              </template>
            </el-table-column>
            <!--成交量-->
            <el-table-column
              :label="$t('M.comm_make_bargain') + $t('M.comm_quantity')"
              width="120"
            >
              <template slot-scope="s">
                <span>{{ s.row.completeCount-0}}</span>
              </template>
            </el-table-column>
            <!--成交价-->
            <el-table-column
              :label="$t('M.comm_make_bargain') + $t('M.comm_price')"
              width="120"
            >
              <template slot-scope="s">
                <span>{{s.row.completeCount-0}}</span>
              </template>
            </el-table-column>
            <!--状态-->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope="s">
                <span>{{ s.row.statusName }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'history-entrust' && historyEntrustList.length"
            layout="prev, pager, next"
            :page-count="totalPageForHistoryEntrust"
            @current-change="changeCurrentPage('history-entrust',$event)"
          >
          </el-pagination>
        </el-tab-pane>
        <!--成交明细-->
        <el-tab-pane
          :label="$t('M.user_coin_clinch_deal_detail')"
          name="make-detail"
        >
          <el-table
            :data="currentMakeDetailList"
            :empty-text="$t('M.comm_no_data')"
          >
            <!--时间-->
            <el-table-column
              :label="$t('M.comm_time')"
              width="125"
            >
              <template slot-scope="s">
                <span>{{ s.row.createTime }}</span>
              </template>
            </el-table-column>
            <!--交易对-->
            <el-table-column
              :label="$t('M.comm_deal') + $t('M.comm_pair')"
            >
              <template slot-scope="s">
                <span>{{ s.row.tradeName }}</span>
              </template>
            </el-table-column>
            <!--撮合类型-->
            <el-table-column
              :label="$t('M.user_coin_bring_together') + $t('M.comm_type')"
            >
              <template slot-scope="s">
                <span>{{ $t(`M.${s.row.i18nMatchTypeName}`) }}</span>
                <!--<span>{{ s.row.matchTypeName }}</span>-->
              </template>
            </el-table-column>
            <!--委托类型-->
            <el-table-column
              :label="$t('M.user_coin_appoint_single') + $t('M.comm_type')"
              width="110"
            >
              <template slot-scope="s">
                <span v-show="language !== 'zh_CN'">{{s.row.type}}</span>
                <span v-show="language === 'zh_CN'">{{s.row.typeName}}</span>
              </template>
            </el-table-column>
            <!--价格-->
            <el-table-column
              :label="$t('M.comm_price_metre')"
            >
              <template slot-scope="s">
                <span>{{ s.row.count-0 }}</span>
              </template>
            </el-table-column>
            <!--数量-->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="s">
                <span>{{ s.row.count-0 }}</span>
              </template>
            </el-table-column>
            <!--成交额-->
            <el-table-column
              :label="$t('M.user_coin_volume')"
            >
              <template slot-scope="s">
                <span>{{ s.row.amount-0}}</span>
              </template>
            </el-table-column>
            <!--手续费-->
            <el-table-column
              :label="$t('M.comm_service_charge')"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.fees - 0 }}</span>-->
                <span>{{ parseFloat(filterNumber(s.row.fees)) }}</span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'make-detail' && currentMakeDetailList.length"
            layout="prev, pager, next"
            :page-count="totalPageForMakeDetailEntrust"
            @current-change="changeCurrentPage('make-detail',$event)"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {
  getMyEntrust,
  getHistoryEntrust,
  getMakeDetail
} from '../../../utils/api/trade'
import {
  getEntrustSelectBox
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  repealMyEntrustCommon
} from '../../../utils/commonFunc'
import {
  timeFilter,
  scientificToNumber
} from '../../../utils'

export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'current-entrust',
      activeHistory: 'history-entrust',
      activeMake: 'make-detail',
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
      historyEntrustList: [], // 我的历史订单
      currentPageForHistoryEntrust: 1, // 历史委托页码
      totalPageForHistoryEntrust: 1, // 历史委托总页数
      currentMakeDetailList: [], // 我的成交明细
      currentPageMakeDetailEntrust: 1, // 成交明细页码
      totalPageForMakeDetailEntrust: 1, // 成交明细总页数
      pageSize: 10,
      entrustSelectList: [], // 交易区下拉列表
      typeList: [], // 类型列表
      matchTypeList: [], // 撮合类型列表
      activeExchangeArea: '', // 当前选中交易区
      activeStatus: '', // 当前选中状态
      activeMatchType: '', // 当前撮合类型
      activeSymbol: '', // 用户输入币种名称
      activeType: '', // 当前选中方向
      cancellationOfOrder: false, // 撤销当前委单
      cancelHistoricalOrder: false, // 删除历史订单
      end: '' // 占位
    }
  },
  async created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/CoinOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/CoinOrdersNight.css')
    await this.getEntrustSelectBox()
    await this.commissionList('current-entrust')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    coinMoneyOrders (tab) {
      console.log(tab.name)
      this.commissionList(tab.name)
    },
    // 查询列表
    searchWithCondition (entrustType) {
      this.commissionList(entrustType)
    },
    // 科学计数法转换
    filterNumber (num) {
      return scientificToNumber(num)
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
        this.typeList = data.data.data.typeList
        this.matchTypeList = data.data.data.matchTypeList
        console.log(this.matchTypeList)
      }
    },
    /**
     * 切换页码
     * @entrustType: 订单类型： 0：当前委托 1： 历史委托 2:  成交明细
     */
    changeCurrentPage (entrustType, pageNum) {
      console.log(pageNum)
      switch (entrustType) {
        case 'current-entrust':
          this.currentPageForMyEntrust = pageNum
          this.commissionList(entrustType)
          break
        case 'history-entrust':
          this.currentPageForHistoryEntrust = pageNum
          this.commissionList(entrustType)
          break
        case 'make-detail':
          this.currentPageMakeDetailEntrust = pageNum
          this.commissionList(entrustType)
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

      // 确定撤销委托单？  取消  确定
      this.$confirm(this.$t('M.otc_revoke'), {
        // 取消
        cancelButtonText: this.$t('M.comm_cancel'),
        // 确定
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        repealMyEntrustCommon(params, (res) => {
          if (!returnAjaxMessage(res, this, 1)) {
            return false
          } else {
            this.commissionList()
          }
        })
      }).catch(() => {
      })
    },
    async commissionList (entrustType1) {
      const entrustType = entrustType1 || 'current-entrust'
      this.currentEntrustList = []
      this.historyEntrustList = []
      this.currentMakeDetailList = []
      let params = {
        userId: this.userInfo.userId,
        currentPage: '',
        pageSize: this.pageSize,
        buyCoinName: this.activeExchangeArea,
        matchType: this.activeMatchType,
        type: this.activeType,
        sellCoinName: this.activeSymbol,
        startTime: this.startTime === '' ? '' : timeFilter(this.startTime, 'normal'),
        endTime: this.endTime === '' ? '' : timeFilter(this.endTime, 'normal')
      }
      let data
      let data1
      let data2
      console.log(params)
      switch (entrustType) {
        case 'current-entrust':
          console.log(1)
          params.currentPage = this.currentPageForMyEntrust
          data = await getMyEntrust(params)
          console.log(data)
          if (!returnAjaxMessage(data, this, 0)) {
            return false
          } else {
            if (data.data.data.list) {
              this.currentEntrustList = data.data.data.list
              this.totalPageForMyEntrust = data.data.data.pages - 0
            }
          }
          break
        case 'history-entrust':
          params.currentPage = this.currentPageForHistoryEntrust
          data1 = await getHistoryEntrust(params)
          console.log(data1)
          if (!returnAjaxMessage(data1, this, 0)) {
            return false
          } else {
            if (data1.data.data.list) {
              this.historyEntrustList = data1.data.data.list
              this.totalPageForHistoryEntrust = data1.data.data.pages - 0
            }
          }
          break
        case 'make-detail':
          params.currentPage = this.currentPageMakeDetailEntrust
          data2 = await getMakeDetail(params)
          console.log(data2)
          if (!returnAjaxMessage(data2, this, 0)) {
            return false
          } else {
            if (data2.data.data.list) {
              this.currentMakeDetailList = data2.data.data.list
              this.totalPageForMakeDetailEntrust = data2.data.data.pages - 0
            }
          }
          break
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      partnerId: state => state.common.partnerId,
      userInfo: state => state.user.loginStep1Info,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    startTime (newVal) {
      if (!newVal) {
        this.startTime = ''
      }
    },
    endTime (newVal) {
      if (!newVal) {
        this.endTime = ''
      }
    },
    activeMatchType (newVal) {
      console.log(newVal)
    },
    userCenterActiveName (newVal) {
      if (newVal === 'coin-orders') {
        this.getEntrustSelectBox()
        this.commissionList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .coin-orders{
    .search-condition-box{
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
    .repeal-btn{
      color:#338ff5;
    }
    .height500 {
      height: 545px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: $nightMainBgColor;
        >.coin-color{
          color: #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background:rgba(255,255,255,1);
        border:1px solid rgba(236,241,248,1);
        >.coin-color{
          color: #338FF5;
        }
      }
      .search-condition-box{
        .condition-item{
          .currency-input {
            background: #fff;
            border: 1px solid #ecf1f8;
            color: #333;
          }
        }
      }
      .currency-span {
        color: #7D90AC;
      }

    }
  }
</style>
