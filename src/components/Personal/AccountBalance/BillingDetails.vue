<template>
  <div
    class="billing-details personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="billing-details-header personal-height40 line-height40 background-color padding-left23">
      <span
        class="header-content display-inline-block font-size16 cursor-pointer"
      >
        <!--账单明细-->
        {{ $t('M.user_asset_title2') }}
      </span>
    </header>
    <div class="billing-details-main paddinglr20 margin-top9">
      <el-tabs
        v-model="activeName"
        @tab-click = "coinMoneyOrders"
      >
        <!--查询条件-->
        <div class="billing-details-query">
          <div class="float-left cursor-pointer">
          <span class="demonstration display-inline-block font-size12">
            <!--币种-->
            {{ $t('M.comm_currency') }}
          </span>
            <el-select
              v-model="defaultCurrencyId"
              :placeholder="$t('M.comm_please_choose')"
              :no-data-text="$t('M.comm_no_data')"
            >
              <el-option
                :placeholder="$t('M.comm_please_choose')"
                v-for="(item, index) in currencyList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <!--充提记录类型-->
          <div
            v-if="activeName === 'current-entrust'"
            class="float-left margin-left50 cursor-pointer"
          >
          <span class="demonstration font-size12">
            <!--类型-->
            {{ $t('M.comm_type') }}
          </span>
            <el-select
              v-model="currencyTypeValue"
              :no-data-text="$t('M.comm_no_data')"
            >
              <el-option
                v-for="item in currencyType"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <!--其他记录类型-->
          <div
            v-else
            class="float-left margin-left50 cursor-pointer"
          >
            <!--类型-->
            <span class="demonstration">
              {{ $t('M.comm_type') }}
            </span>
            <el-select
              v-model="otherRecordsValue"
            >
              <el-option
                v-for="item in otherRecordsType"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="float-left margin-left58 cursor-pointer">
            <div class="block">
            <span class="demonstration font-size12">
              <!--日期-->
              {{ $t('M.comm_data') }}
            </span>
              <!--开始日期-->
              <el-date-picker
                v-model="startTime"
                type="date"
                value-format="yyyy-MM-dd HH:mm:ss"
                :placeholder="$t('M.comm_select') + $t('M.comm_data')"
                @change="changeStartTime"
              >
              </el-date-picker>
              &nbsp;&nbsp;-&nbsp;&nbsp;
              <!-- 结束日期 -->
              <el-date-picker
                v-model="endTime"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="$t('M.comm_select') + $t('M.comm_data')"
                @change="changeEndTime"
              >
              </el-date-picker>
            </div>
          </div>
          <div
            class="search-button float-right border-radius2 text-align-c cursor-pointer font-size12"
            @click.prevent="stateSearchButton(activeName)"
          >
            <!--搜索-->
            {{ $t('M.comm_search') }}
          </div>
        </div>
        <!--充提记录-->
        <el-tab-pane
          :label="$t('M.user_assets_Transaction_History')"
          name="current-entrust"
        >
          <div class="inner-box">
            <!--查询结果-->
            <div class="result-box">
              <!--暂无记录-->
              <el-table
                :data="chargeRecordList"
                style="width: 100%;"
                :empty-text="$t('M.comm_no_data')"
                v-loading="partLoading"
                element-loading-background="rgba(0, 0, 0, 0.6)"
              >
                <!--币种-->
                <el-table-column
                  :label="$t('M.comm_currency')"
                  width="100"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.coinName }}</div>
                  </template>
                </el-table-column>
                <!--类型-->
                <el-table-column
                  :label="$t('M.comm_type')"
                  width="110"
                >
                  <template slot-scope = "s">
                    <div>{{ $t(`M.${s.row.i18nTypeName}`)}}</div>
                  </template>
                </el-table-column>
                <!--数量-->
                <el-table-column
                  :label="$t('M.comm_count')"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.amount }}</div>
                  </template>
                </el-table-column>
                <!--提交时间-->
                <el-table-column
                  :label="$t('M.comm_sub_time') + $t('M.comm_time')"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.createTime }}</div>
                  </template>
                </el-table-column>
                <!--更新时间-->
                <el-table-column
                  :label="$t('M.comm_update') + $t('M.comm_time')"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.updateTime }}</div>
                  </template>
                </el-table-column>
                <!--状态-->
                <el-table-column
                  prop="address"
                  :label="$t('M.comm_state')"
                >
                  <template slot-scope = "s">
                    <div>{{ $t(`M.${s.row.i18nStatusName}`)}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

        </el-tab-pane>
        <!--综合记录-->
        <el-tab-pane
          :label="$t('M.comprehensive_records')"
          name="other-records"
        >
          <el-table
            :data="otherRecordsList"
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
          >
            <!--时间-->
            <el-table-column
              :label="$t('M.comm_time')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.time }}</div>
              </template>
            </el-table-column>
            <!--币种-->
            <el-table-column
              :label="$t('M.comm_currency')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.coinName }}</div>
              </template>
            </el-table-column>
            <!--类型-->
            <el-table-column
              :label="$t('M.comm_type')"
            >
              <template slot-scope = "s">
                <!--<div>{{ s.row.type }}</div>-->
                <div v-if="s.row.type == 'OTC_TRADE'">
                  <!--otc交易-->
                  {{ $t('M.otc_user_trade') }}
                </div>
                <div v-if="s.row.type == 'OTC_FEE'">
                  <!--otc手续费-->
                  {{ $t('M.otc_fee') }}
                </div>
                <div v-if="s.row.type == 'CTC_TRADE'">
                  <!--币币交易-->
                  {{ $t('M.ctc_trade') }}
                </div>
                <div v-if="s.row.type == 'CTC_FEE'">
                  <!--币币手续费-->
                  {{ $t('M.ctc_fee') }}
                </div>
                <div v-if="s.row.type == 'FINANCIAL_EXPENDITURE'">
                  <!--理财支出-->
                  {{ $t('M.financial_expenditure') }}
                </div>
                <div v-if="s.row.type == 'FINANCIAL_INCOME'">
                  <!--理财收入-->
                  {{ $t('M.financial_income') }}
                </div>
                <div v-if="s.row.type == 'INVITATION_REWARD'">
                  <!--邀请有礼-->
                  {{ $t('M.invitation_reward') }}
                </div>
              </template>
            </el-table-column>
            <!--数量-->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.count }}</div>
              </template>
            </el-table-column>
            <!--备注-->
            <el-table-column
              :label="$t('M.comm_remark')"
            >
              <template slot-scope = "s">
                <div>{{ $t(`M.${s.row.desc}`)}}</div>
              </template>
            </el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <!--分页-->
      <el-pagination
        background
        v-show="activeName === 'current-entrust' && chargeRecordList.length"
        layout="prev, pager, next"
        :page-count="recordTotalPageNumber"
        @current-change="changeCurrentPage('current-entrust',$event)"
      >
      </el-pagination>
    </div>
    <div>
      <!--分页-->
      <el-pagination
        background
        v-show="activeName === 'other-records' && otherRecordsList.length"
        layout="prev, pager, next"
        :page-count="totalPagesOtherRecords"
        @current-change="changeCurrentPage('other-records',$event)"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {
  statusRushedToRecordList,
  getMerchantCurrencyList,
  getComprehensiveRecordsList
} from '../../../utils/api/personal'
import {
  returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
import {
  timeFilter
} from '../../../utils'
export default {
  components: {},
  data () {
    return {
      chargeRecordList: [], // 充提记录列表
      activeName: 'current-entrust', // 充提记录
      recordPageNumber: 1, // 充提记录页码
      recordTotalPageNumber: 1, // 充提记录总页数
      startTime: '', // 开始起止时间
      endTime: '', // 结束起止时间
      // 币种名称
      defaultCurrencyId: '', // 默认币种id
      currencyList: [], // 币种列表
      // 充提记录类型
      currencyTypeValue: '', // 默认类型
      pageSize: 10, // 条数
      // 全部 充币 提币
      currencyType: [
        {
          value: '',
          label: 'M.comm_all'
        }, {
          value: 'RECHARGE',
          label: 'M.comm_charge_money'
        }, {
          value: 'WITHDRAW',
          label: 'M.comm_mention_money'
        }
      ], // 默认类型
      // 其他记录
      otherRecordsList: [],
      otherRecordPageNumbers: 1, // 其他记录页码
      totalPagesOtherRecords: 1, // 其他记录总页数
      otherRecordsValue: 'OTC_TRADE', // 其他记录类型
      // otc交易 otc手续费 币币交易 币币手续费 理财支出 理财收入 邀请有礼
      otherRecordsType: [
        {
          value: 'OTC_TRADE',
          label: 'M.otc_user_trade'
        }, {
          value: 'OTC_FEE',
          label: 'M.otc_fee'
        }, {
          value: 'CTC_TRADE',
          label: 'M.ctc_trade'
        }, {
          value: 'CTC_FEE',
          label: 'M.ctc_fee'
        }, {
          value: 'FINANCIAL_EXPENDITURE',
          label: 'M.financial_expenditure'
        }, {
          value: 'FINANCIAL_INCOME',
          label: 'M.financial_income'
        }, {
          value: 'INVITATION_REWARD',
          label: 'M.invitation_reward'
        }
      ],
      partLoading: true // 局部loading
    }
  },
  async created () {
    await this.inquireCurrencyList()
    await this.getChargeMentionList('current-entrust')
  },
  methods: {
    // tab 切换
    async coinMoneyOrders (e) {
      if (e.name == 'current-entrust') {
        this.startTime = ''
        this.endTime = ''
      } else {
        this.startTime = timeFilter(new Date().setHours(0, 0, 0, 0), 'normal')
        this.endTime = timeFilter(new Date().getTime(), 'normal')
        console.log(this.startTime)
      }
      await this.inquireCurrencyList(e.name)
      this.getChargeMentionList(e.name)
    },
    // 获取商户币种列表
    async inquireCurrencyList () {
      let data
      let param = {
      }
      data = await getMerchantCurrencyList(param)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        this.currencyList = getNestedData(data, 'data.data')
        this.defaultCurrencyId = getNestedData(data, 'data.data')[0].id
        console.log(this.currencyList)
      }
    },
    // 搜索按钮
    stateSearchButton (entrustType) {
      this.partLoading = true
      this.getChargeMentionList(entrustType)
    },
    /**
     * 刚进页面时候 冲提记录列表展示
     */
    /* 类型 OTC_TRADE：otc交易 OTC_FEE：otc手续费
         CTC_TRADE：币币交易 CTC_FEE：币币手续费
         FINANCIAL_EXPENDITURE：理财支出
         FINANCIAL_INCOME：理财收入
         INVITATION_REWARD：邀请有礼 */
    async getChargeMentionList (entrustType1) {
      const entrustType = entrustType1 || 'current-entrust'
      this.chargeRecordList = []
      this.otherRecordsList = []
      let params = {
        pageSize: this.pageSize, // 每页显示条数
        userId: this.userInfo.userId, // 用户ID
        coinId: this.defaultCurrencyId, // 币种ID
        type: this.otherRecordsValue, // 类型（RECHARGE:充值 WITHDRAW:提现 / 其他记录类型
        startTime: this.startTime === '' ? '' : timeFilter(this.startTime, 'normal'), // 开始起止时间
        endTime: this.endTime === '' ? '' : timeFilter(this.endTime, 'normal') // 结束起止时间
      }
      let data
      let data1
      console.log(entrustType)
      switch (entrustType) {
        case 'current-entrust':
          params.currentPage = this.recordPageNumber
          params.type = this.currencyTypeValue
          data = await statusRushedToRecordList(params)
          console.log(data)
          if (!returnAjaxMsg(data, this, 0)) {
            // 接口失败清除局部loading
            this.partLoading = false
            return false
          } else {
            // 接口成功清除局部loading
            this.partLoading = false
            // 返回冲提记录列表展示
            let detailData = getNestedData(data, 'data.data')
            // 充提记录
            this.chargeRecordList = getNestedData(detailData, 'list')
            this.recordTotalPageNumber = getNestedData(detailData, 'pages') - 0
          }
          break
        case 'other-records':
          console.log(2)
          console.log(this.startTime)
          params.pageNum = this.otherRecordPageNumbers
          params.startTime = this.startTime === '' ? '' : timeFilter(this.startTime, 'normal') // 开始起止时间
          params.endTime = this.endTime === '' ? '' : timeFilter(this.endTime, 'normal') // 结束起止时间
          params.type = this.otherRecordsValue
          console.log(params)
          console.log(this.startTime)
          data1 = await getComprehensiveRecordsList(params)
          // console.log(data1)
          if (!returnAjaxMsg(data1, this, 0)) {
            // 接口失败清除局部loading
            this.partLoading = false
            return false
          } else {
            // 接口成功清除局部loading
            this.partLoading = false
            console.log(data1)
            if (data1.data.data.list) {
              this.otherRecordsList = getNestedData(data1, 'data.data.list')
              this.totalPagesOtherRecords = getNestedData(data1, 'data.data.pages') - 0
            }
          }
          break
      }
    },
    /**
     * 切换页码
     * @entrustType: 记录类型： 0：充提记录 1： 其他记录
     */
    changeCurrentPage (entrustType, pageNum) {
      // console.log(pageNum)
      switch (entrustType) {
        case 'current-entrust':
          // console.log(pageNum)
          this.partLoading = true
          this.recordPageNumber = pageNum
          this.getChargeMentionList(entrustType)
          break
        case 'other-records':
          // console.log(pageNum)
          this.partLoading = true
          this.otherRecordPageNumbers = pageNum
          this.getChargeMentionList(entrustType)
          break
      }
    },
    // 时间日期插件日期选择change事件验证事件开始和结束时间
    // 开始时间赋值
    changeStartTime (e) {
      this.startTime = e
      console.log(e)
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
    // 结束时间赋值
    changeEndTime (e) {
      this.endTime = e
      console.log(e)
      if (this.startTime) {
        if (this.startTime > this.endTime) {
          this.$message({ // message: '开始时间不能大于结束时间',
            message: this.$t('M.otc_time_limit'),
            type: 'error'
          })
          return false
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    startTime (newVal) {
      console.log(newVal)
      if (!newVal) {
        this.startTime = ''
      }
    },
    endTime (newVal) {
      if (!newVal) {
        this.endTime = ''
      }
    },
    userCenterActiveName (newVal) {
      if (newVal === 'billing-details') {
        this.getChargeMentionList()
        this.inquireCurrencyList()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .billing-details {
    > .billing-details-main {
      min-height: 650px;

      .billing-details-content {
        > .tab-list {
          height: 520px;
        }
      }

      .billing-details-query {
        height: 57px;
        line-height: 57px;

        .search-button {
          width: 50px;
          height: 30px;
          margin-top: 15px;
          line-height: 29px;
        }

        .demonstration {
          margin-right: 5px;
        }
      }
    }

    > .billing-details-header {
      margin-bottom: 2px;

      > .header-content {
        width: 300px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .billing-details-main {
        background-color: $nightMainBgColor;

        .billing-details-query {
          border-bottom: 1px solid #39424d;

          > .search-button {
            color: #fff;
            background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }
      }

      > .billing-details-header {
        background-color: $nightMainBgColor;
        box-shadow: 0 5px 50px #181e2a;
      }

      /deep/ {
        .el-table__body-wrapper {
          height: 470px;
          background-color: #1c1f32;
        }

        .el-input--suffix {
          .el-input__inner {
            padding-right: 25px;
          }
        }

        .el-table {
          th,
          tr {
            background-color: #1c1f32;
          }

          thead {
            color: #617499;
          }

          th {
            &.is-leaf {
              border-bottom: 0;
            }

            & > .cell {
              color: #a9bed4;
            }
          }

          td {
            border-bottom: 0;
            color: #ccc;
            background-color: #1c1f32;
          }
        }

        .el-input__inner {
          width: 110px;
          color: #fff;
          background-color: #2d3651;
        }

        .el-table__empty-block {
          color: #fff;
          background-color: #1c1f32;
        }

        .el-loading-mask {
          background-color: rgba(0, 0, 0, .6);
        }

        .el-tabs__item {
          padding: 0;
          margin-right: 30px;
          border-left: 0;
          text-align: center;

          &.is-active {
            border-bottom: 2px solid #0079fe;
            border-left: 0;
            color: #0079fe;
            background: transparent;
          }

          &:hover {
            border-left: 0;
            text-align: center;
            color: #0079fe;
            background: transparent;
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .billing-details-main {
        border: 1px solid #ecf1f8;
        background-color: $dayBgColor;

        .billing-details-query {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          > .search-button {
            color: #fff;
            background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }

          .demonstration {
            color: #7d90ac;
          }
        }
      }

      > .billing-details-header {
        border: 1px solid rgb(236, 241, 248);
        border-radius: 2px;
        background: rgb(255, 255, 255);
        box-shadow: 1px 0 3px rgb(236, 236, 236);
      }

      /deep/ {
        .el-table__body-wrapper {
          height: 470px;
          background-color: #fff;
        }

        .el-table {
          th,
          tr {
            background-color: #fff;
          }

          thead {
            color: #617499;
          }

          th {
            &.is-leaf {
              border-bottom: 0;
            }

            & > .cell {
              color: #333;
            }
          }

          td {
            border-bottom: 0;
            color: #ccc;
            background-color: #fff;
          }

          .cell {
            color: #7d90ac;
          }
        }

        .el-input__inner {
          border: 1px solid #ecf1f8;
          color: #ccc;
          background-color: rgba(255, 255, 255, 1);
        }

        .el-table__empty-block {
          background-color: #fff;
        }

        .el-loading-mask {
          background-color: rgba(0, 0, 0, .6);
        }

        .el-tabs__item {
          padding: 0;
          margin-right: 30px;
          border-left: 0;
          text-align: center;

          &.is-active {
            border-bottom: 2px solid #0079fe;
            border-left: 0;
            color: #0079fe;
            background: transparent;
          }

          &:hover {
            border-left: 0;
            text-align: center;
            color: #0079fe;
            background: transparent;
          }
        }
      }
    }

    /deep/ {
      .el-input__inner {
        height: 30px;
        border: 0;
        font-size: 12px;
      }

      .el-date-editor {
        &.el-input {
          width: 120px;
          height: 30px;
        }

        .el-input__inner {
          width: 120px;
          height: 30px;
        }
      }

      .el-table {
        .cell {
          font-size: 12px;
          text-align: center;
        }

        th {
          & > .cell {
            font-size: 12px;
            text-align: center;
          }

          &.is-leaf {
            border-top: 0;
          }
        }
      }

      .el-tabs__content {
        width: 930px;
      }
    }
  }
</style>
