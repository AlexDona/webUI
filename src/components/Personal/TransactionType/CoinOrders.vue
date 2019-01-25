<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color personal-height40 line-height40 font-size16">
      <span class="padding-left15 font-weight600 coin-color">
        <!--币币订单-->
        {{ $t('M.user_coin_order7') }}
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
              {{ $t('M.comm_deal_pair') }}
            </span>
            <!--币种-->
            <!--币种名称-->
            <input
              type="text"
              :placeholder="$t('M.comm_currency_name')"
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
              :no-data-text="$t('M.comm_no_data')"
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
              :no-data-text="$t('M.comm_no_data')"
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
              {{ $t('M.user_coin_appoint_single_stle') }}
            </span>
            <!--请选择-->
            <el-select
              clearable
              v-model="activeType"
              :placeholder="$t('M.comm_please_choose')"
              :no-data-text="$t('M.comm_no_data')"
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
              {{ $t('M.user_coin_order4') }}
            </span>
            <!--选择日期-->
            <el-date-picker
              clearable
              v-model="startTime"
              type="datetime"
              :placeholder="$t('M.comm_select') + $t('M.comm_data')"
              @change="startDate"
            >
            </el-date-picker>
            <span class="middle-line"> - </span>
            <!--选择日期-->
            <el-date-picker
              clearable
              v-model="endTime"
              type="datetime"
              :placeholder="$t('M.comm_select') + $t('M.comm_data')"
              @change="endDate"
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
          :label="$t('M.user_coin_order1')"
          name="current-entrust"
        >
          <div class="inner-box">
            <!--查询结果-->
            <div class="result-box">
              <el-table
                :data="currentEntrustList"
                :empty-text="$t('M.comm_no_data')"
                v-loading="partLoading"
                element-loading-background="rgba(0, 0, 0, 0.6)"
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
                  :label="$t('M.comm_deal_pair')"
                  width="70"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.tradeName }}</span>
                  </template>
                </el-table-column>
                <!--撮合类型-->
                <el-table-column
                  :label="$t('M.user_coin_bring_together') + $t('M.comm_type')"
                  width="80"
                >
                  <template slot-scope="s">
                    <span>{{ $t(`M.${s.row.i18nMatchTypeName}`) }}</span>
                    <!--<span>{{ s.row.matchTypeName }}</span>-->
                  </template>
                </el-table-column>
                <!--委单类型-->
                <el-table-column
                  :label="$t('M.user_coin_appoint_single_stle')"
                  width="80"
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
                    <!--<span>{{ s.row.count-0 }}</span>-->
                    <span>{{ parseFloat($scientificToNumber(s.row.count)) }}</span>
                  </template>
                </el-table-column>
                <!--委托总额-->
                <el-table-column
                  :label="$t('M.user_coin_order5')"
                  width="120"
                >
                  <template slot-scope="s">
                    <!--<span>{{ s.row.amount-0}}</span>-->
                    <span>{{ parseFloat($scientificToNumber(s.row.amount)) }}</span>
                  </template>
                </el-table-column>
                <!--已成交-->
                <el-table-column
                  :label="$t('M.user_coin_order6')"
                  width="120"
                >
                  <template slot-scope="s">
                    <!--<span>{{s.row.completeCount-0}}</span>-->
                    <span>{{ parseFloat($scientificToNumber(s.row.completeCount)) }}</span>
                  </template>
                </el-table-column>
                <!--未成交-->
                <el-table-column
                  :label="$t('M.comm_not_make_bargain')"
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
          :label="$t('M.user_coin_order2')"
          name="history-entrust"
        >
          <el-table
            :data="historyEntrustList"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
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
              :label="$t('M.comm_deal_pair')"
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
              :label="$t('M.user_coin_appoint_single_stle')"
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
                <span>{{ s.row.price-0 }}</span>
              </template>
            </el-table-column>
            <!--委托量-->
            <el-table-column
              :label="$t('M.user_coin_entrust') + $t('M.comm_quantity')"
              width="120"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.count }}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.count)) }}</span>
              </template>
            </el-table-column>
            <!--成交量-->
            <el-table-column
              :label="$t('M.comm_make_bargain') + $t('M.comm_quantity')"
              width="120"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.completeCount-0}}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.completeCount)) }}</span>
              </template>
            </el-table-column>
            <!--成交价-->
            <el-table-column
              :label="$t('M.comm_make_bargain') + $t('M.comm_price')"
              width="120"
            >
              <template slot-scope="s">
                <!--<span>{{s.row.completeCount-0}}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.completePrice)) }}</span>
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
          :label="$t('M.user_coin_order3')"
          name="make-detail"
        >
          <el-table
            :data="currentMakeDetailList"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
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
              :label="$t('M.comm_deal_pair')"
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
              :label="$t('M.user_coin_appoint_single_stle')"
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
                <span>{{ s.row.price-0 }}</span>
              </template>
            </el-table-column>
            <!--数量-->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.count-0 }}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.count)) }}</span>
              </template>
            </el-table-column>
            <!--成交额-->
            <el-table-column
              :label="$t('M.user_coin_volume')"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.amount-0}}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.amount)) }}</span>
              </template>
            </el-table-column>
            <!--手续费-->
            <el-table-column
              :label="$t('M.comm_service_charge')"
            >
              <template slot-scope="s">
                <!--<span>{{ s.row.fees - 0 }}</span>-->
                <span>{{ parseFloat($scientificToNumber(s.row.fees)) }}</span>
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
  returnAjaxMsg,
  repealMyEntrustCommon,
  getNestedData
} from '../../../utils/commonFunc'
import {
  timeFilter
} from '../../../utils'
export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'current-entrust', // 当前委托
      activeHistory: 'history-entrust', // 历史委托
      activeMake: 'make-detail', // 成交明细
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      currentEntrustList: [], // 我的委托订单
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      historyEntrustList: [], // 我的历史订单
      currentPageForHistoryEntrust: 1, // 历史委托页码
      totalPageForHistoryEntrust: 1, // 历史委托总页数
      currentMakeDetailList: [], // 我的成交明细
      currentPageMakeDetailEntrust: 1, // 成交明细页码
      totalPageForMakeDetailEntrust: 1, // 成交明细总页数
      pageSize: 10, // 条数
      entrustSelectList: [], // 交易区下拉列表
      typeList: [], // 类型列表
      matchTypeList: [], // 撮合类型列表
      activeExchangeArea: '', // 当前选中交易区
      activeMatchType: '', // 当前撮合类型
      activeSymbol: '', // 用户输入币种名称
      activeType: '', // 当前选中方向(类型)
      cancellationOfOrder: false, // 撤销当前委单
      cancelHistoricalOrder: false, // 删除历史订单
      partLoading: true, // 局部列表loading
      end: '' // 占位
    }
  },
  async created () {
    await this.getEntrustSelectBox()
    await this.commissionList('current-entrust')
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    coinMoneyOrders (tab) {
      this.emptyData()
      console.log(tab.name)
      this.partLoading = true
      this.commissionList(tab.name)
    },
    // 查询列表
    searchWithCondition (entrustType) {
      this.partLoading = true
      this.commissionList(entrustType)
    },
    /**
     * 交易区列表查询
     */
    async getEntrustSelectBox () {
      let params = {
      }
      this.partLoading = true
      const data = await getEntrustSelectBox(params)
      if (!returnAjaxMsg(data, this)) {
        // 接口失败清除局部loading
        this.partLoading = false
        return false
      } else {
        // 接口成功清除局部loading
        this.partLoading = false
        // console.log(data)
        let detailData = getNestedData(data, 'data.data')
        this.entrustSelectList = getNestedData(detailData, 'coinList')
        this.typeList = getNestedData(detailData, 'typeList')
        this.matchTypeList = getNestedData(detailData, 'matchTypeList')
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
          this.partLoading = true
          this.currentPageForMyEntrust = pageNum
          this.commissionList(entrustType)
          break
        case 'history-entrust':
          this.partLoading = true
          this.currentPageForHistoryEntrust = pageNum
          this.commissionList(entrustType)
          break
        case 'make-detail':
          this.partLoading = true
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
        repealMyEntrustCommon(params, () => {
          this.commissionList()
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
          params.currentPage = this.currentPageForMyEntrust
          data = await getMyEntrust(params)
          this.partLoading = false
          if (!data) return false
          this.currentEntrustList = getNestedData(data, 'data.list') || []
          this.totalPageForMyEntrust = getNestedData(data, 'data.pages') - 0
          break
        case 'history-entrust':
          params.currentPage = this.currentPageForHistoryEntrust
          data1 = await getHistoryEntrust(params)
          this.partLoading = false
          if (!data1) return false
          if (data1.data.list) {
            this.historyEntrustList = getNestedData(data1, 'data.list') || []
            this.totalPageForHistoryEntrust = getNestedData(data1, 'data.pages') - 0
          }
          break
        case 'make-detail':
          params.currentPage = this.currentPageMakeDetailEntrust
          data2 = await getMakeDetail(params)
          this.partLoading = false
          if (!data2) return false
          if (data2.data.list) {
            this.currentMakeDetailList = getNestedData(data2, 'data.list') || []
            this.totalPageForMakeDetailEntrust = getNestedData(data2, 'data.pages') - 0
          }
          break
      }
    },
    /**
     *时间选择器change事件
     */
    startDate () {
      if (this.endTime) {
        if (this.startTime > this.endTime) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
    },
    endDate () {
      if (this.startTime) {
        if (this.startTime > this.endTime) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
    },
    // 数据清空
    emptyData () {
      // 用户币种名称
      this.activeSymbol = ''
      // 当前交易区
      this.activeExchangeArea = ''
      // 当前撮合类型
      this.activeMatchType = ''
      // 当前方向(类型)
      this.activeType = ''
      // 开始时间
      this.startTime = ''
      // 结束时间
      this.endTime = ''
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
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
      this.emptyData()
      if (newVal === 'coin-orders') {
        this.getEntrustSelectBox()
        this.commissionList()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .coin-orders {
    .search-condition-box {
      width: 100%;
      padding: 20px;

      > .condition-item {
        display: inline-block;
        height: 34px;
        margin: 0 56px 20px 0;
        line-height: 34px;

        > .middle-line {
          display: inline-block;
          width: 20px;
          height: 30px;
          text-align: center;
        }

        &:last-of-type {
          margin-right: 0;
        }

        > .currency-span {
          display: inline-block;
          font-size: 12px;
          vertical-align: top;
        }

        > .currency-input {
          box-sizing: border-box;
          width: 80px;
          height: 30px;
          padding: 5px;
          margin: 2px;
          border: 1px solid rgba(72, 87, 118, 1);
          border-radius: 2px;
          vertical-align: top;
          color: #fff;
        }

        > .search-btn {
          width: 60px;
          height: 34px;
          border-radius: 4px;
          color: #fff;
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }
    }

    .repeal-btn {
      color: #338ff5;
    }

    .height500 {
      height: 545px;
    }

    /deep/ {
      /* 点击切换时背景色和字体颜色 */
      .el-tabs__item {
        width: 105px;
        padding: 0;
        border-left: 4px solid transparent !important;
        text-align: center;
        background-color: transparent !important;
      }

      .el-input__inner {
        width: 80px;
        height: 30px;
        border: none;
        border-radius: 2px;
        background: rgba(25, 32, 46, 1);
      }

      .el-date-editor.el-input {
        width: 170px;
      }

      .el-date-editor {
        .el-input__inner {
          width: 170px;
        }
      }

      .el-input--suffix {
        .el-input__inner {
          padding-right: 0;
          font-size: 12px;
        }
      }

      .el-input__icon {
        line-height: 1;
      }

      td,
      th {
        height: 30px;
        padding: 0;
        line-height: 30px;
      }

      .el-table {
        width: 970px !important;
        font-size: 12px;

        th {
          &.is-leaf {
            border-top: 0;
          }
        }
      }

      .el-table--scrollable-x {
        .el-table__body-wrapper {
          overflow-x: hidden;
        }
      }

      .cell {
        padding: 12px 0;
        text-align: center;
      }

      .cell,
      th div {
        padding-right: 0;
      }

      td {
        border-bottom: none;
      }

      .el-pagination {
        text-align: right;
      }

      .el-table__empty-block {
        width: 964px !important;
        min-height: 280px;
        margin-left: 2px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .background-color {
        background-color: $nightMainBgColor;

        > .coin-color {
          color: #338ff5;
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */

        /* tabs切换 */
        .el-tabs__item.is-active {
          border-bottom: 2px solid #0079fe;
          border-left: none;
          color: #ccc;
          background-color: transparent;
        }

        .el-tabs__item {
          &:hover {
            border-left: none !important;
            color: #fff !important;
            background-color: transparent !important;
          }
        }

        th,
        tr {
          background-color: #1c1f32;
        }

        .el-table {
          thead {
            color: #617499;
          }
        }

        .el-input--suffix {
          .el-input__inner {
            border: 0;
            color: #fff;
            background: #2d3651;
          }
        }

        .cell {
          color: #a9bed4;
        }

        td {
          color: #ccc;
        }

        .el-table--enable-row-hover {
          .el-table__body {
            tr:hover > td {
              background-color: #1c1f32;
            }
          }
        }

        .el-table__empty-block {
          color: #fff;
          background-color: #1c1f32;
        }

        .el-pagination {
          text-align: right;
          background-color: transparent;
        }

        .el-table__body-wrapper {
          background-color: #1c1f32;
        }

        th.is-leaf {
          border-bottom: 1px solid rgba(57, 66, 77, .1);
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .background-color {
        border: 1px solid rgba(236, 241, 248, 1);
        background: rgba(255, 255, 255, 1);

        > .coin-color {
          color: #338ff5;
        }
      }

      .search-condition-box {
        .condition-item {
          .currency-input {
            border: 1px solid #ecf1f8;
            color: #333;
            background: #fff;
          }
        }
      }

      .currency-span {
        color: #7d90ac;
      }

      /deep/ {
        /* 个人中心（白色主题） */

        /* tabs切换 */
        .el-tabs__item.is-active {
          border-bottom: 2px solid #338ff5;
          border-left: 0;
          color: #338ff5;
          background-color: transparent;
        }

        .el-tabs__item {
          &:hover {
            border-left: 0 solid #fff;
            color: #338ff5;
            background: rgba(51, 143, 245, .1);
          }
        }

        .el-input--suffix {
          .el-input__inner {
            border: 1px solid #ecf1f8;
            color: #333;
            background: #fff;
          }
        }

        .cell {
          color: #333;
        }
      }
    }
  }
</style>
