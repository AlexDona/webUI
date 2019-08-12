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
    <div class="billing-details-main padding-lr20 margin-top9">
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
                    filterable
                    :placeholder="$t('M.comm_please_choose')"
                    :no-data-text="$t('M.comm_no_data')"
                    :disabled="currencyValueStatus"
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
                  class="float-left margin-left150 cursor-pointer"
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
                  class="float-left margin-left150 cursor-pointer"
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
          <div class="float-left margin-left150 cursor-pointer">
            <div
                    class="block"
                    v-if="activeName === 'current-entrust'"
            >
              <span class="demonstration font-size12">
                <!--日期-->
                {{ $t('M.user_coin_order4') }}
              </span>
              <el-date-picker
                      v-model="startTime"
                      type="datetimerange"
                      align="right"
                      :editable="false"
                      range-separator="~"
                      @change="changeTime"
                      :start-placeholder="$t('M.otc_no1')"
                      :end-placeholder="$t('M.otc_no2')"
                      :default-time="['00:00:00', '23:59:59']"
                      :picker-options="pickerOptionsTime"
              >
              </el-date-picker>
            </div>
            <div
                    class="block"
                    v-else
            >
              <span class="demonstration font-size12">
                <!--日期-->
                {{ $t('M.user_coin_order4') }}
              </span>
              <el-date-picker
                      v-model="startTime"
                      type="datetimerange"
                      align="right"
                      :editable="false"
                      :clearable="false"
                      range-separator="~"
                      @change="changeTime"
                      :start-placeholder="$t('M.otc_no1')"
                      :end-placeholder="$t('M.otc_no2')"
                      :default-time="['00:00:00', '23:59:59']"
                      :picker-options="pickerOptionsTime"
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
              >
                <!--币种-->
                <el-table-column
                        :label="$t('M.comm_currency')"
                >
                  <template slot-scope = "s" style="background: red">
                    <div>{{ s.row.coinName }}</div>
                  </template>
                </el-table-column>
                <!--类型-->
                <el-table-column
                        :label="$t('M.comm_type')"
                >
                  <template slot-scope = "s">
                    <div class="coin-type">{{ $t(`M.${s.row.i18nTypeName}`)}}</div>
                  </template>
                </el-table-column>
                <!--提币地址-->
                <el-table-column
                        :label="$t('M.comm_mention_money') + $t('M.comm_site')"
                        v-if="withdrawSite"
                        width="150"
                >
                  <template slot-scope = "s">
                    <div
                            :title="s.row.withdrawAddress"
                            class="white-space cursor-pointer"
                            v-clipboard:copy="s.row.withdrawAddress"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                    >
                      {{s.row.withdrawAddress}}
                    </div>
                  </template>
                </el-table-column>
                <!--充值类型 USER("USER", "普通用户充值"), MANUAL("MANUAL", "手工充值")-->
                <el-table-column
                        :label="$t('M.comprehensive_manual1')"
                        v-if="rechargeSite"
                        width="140"
                >
                  <template slot-scope = "s">
                    <!--系统充值-->
                    <div
                            v-if="s.row.rechargeType === 'MANUAL'"
                    >
                      {{ $t('M.comprehensive_manual')}}
                    </div>
                    <!--充值地址-->
                    <div
                            v-else
                            :title="s.row.rechargeAddress"
                            class="white-space cursor-pointer"
                            v-clipboard:copy="s.row.rechargeAddress"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                    >
                      {{s.row.rechargeAddress}}
                    </div>
                  </template>
                </el-table-column>
                <!--当前余额-->
                <el-table-column
                        :label="$t('M.comm_balance_current')"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.totalMassage}}</div>
                  </template>
                </el-table-column>
                <!--数量-->
                <el-table-column
                        :label="$t('M.comm_count')"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.amount - 0 }}</div>
                  </template>
                </el-table-column>
                <!--提交时间-->
                <el-table-column
                        :label="$t('M.comm_sub_time') + $t('M.comm_time')"
                        width="150"
                >
                  <template slot-scope = "s">
                    <div>{{ s.row.createTime }}</div>
                  </template>
                </el-table-column>
                <!--状态-->
                <el-table-column
                        prop="address"
                        :label="$t('M.comm_state')"
                        width="140"
                >
                  <template slot-scope = "s">
                    <div>{{ $t(`M.${s.row.i18nStatusName}`)}}</div>
                  </template>
                </el-table-column>
                <!--操作-->
                <el-table-column
                        :label="$t('M.comm_operation')"
                        v-if="withdrawSite"
                >
                  <template slot-scope = "s">
                    <div
                            class="cursor-pointer state-status"
                            @click.prevent="confirmCancelWithdraw(s.row.id, s.row.version)"
                            :id="s.row.id"
                    >
                      <!--撤销-->
                      {{ s.row.status === 'WAIT-WITHDRAW'? $t('M.user_push_revocation') : ''}}
                    </div>
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
                <div v-if="s.row.type == 'CTC_TRADE' || s.row.type == 'CTC_FEE'">
                  {{ s.row.tradeName}}{{ $t(`M.${s.row.desc}`)}}
                </div>
                <div v-else-if="s.row.type == 'FINANCIAL_EXPENDITURE' && s.row.des !== ''">
                  {{ $t(`M.${s.row.desc}`) }}{{ $t(`M.${s.row.des}`) }}
                </div>
                <div v-else>{{ $t(`M.${s.row.desc}`)}}</div>
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
              :current-page="recordPageNumber"
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
              :current-page="otherRecordPageNumbers"
              :page-count="totalPagesOtherRecords"
              @current-change="changeCurrentPage('other-records',$event)"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState, mapMutations} from 'vuex'
import {
  statusRushedToRecordList,
  getMerchantCurrencyList,
  getComprehensiveRecordsList,
  deleteCancelWithdraw
} from '../../../utils/api/personal'
import {
  getNestedData
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils'
export default {
  components: {},
  data () {
    return {
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      date: new Date().getDate(),
      hours: new Date().getHours(),
      minutes: new Date().getMinutes(),
      seconds: new Date().getSeconds(),
      pickerOptionsTime: {},
      chargeRecordList: [], // 充提记录列表
      activeName: 'current-entrust', // 充提记录
      recordPageNumber: 1, // 充提记录页码
      recordTotalPageNumber: 1, // 充提记录总页数
      currencyValueStatus: true, // 币种列表状态
      startTime: [], // 开始时间
      endTime: '', // 结束时间
      // 币种名称
      defaultCurrencyId: '', // 默认币种id
      currencyList: [], // 币种列表
      // 充提记录类型
      currencyTypeValue: '', // 默认类型
      pageSize: 10, // 条数
      // 全部 充币 提币
      currencyType: [
        {
          value: 'RECHARGE',
          label: 'M.comm_charge_money'
        }, {
          value: 'WITHDRAW',
          label: 'M.comm_mention_money'
        }
      ], // 默认类型
      // 提现记录默认隐藏提币地址 true显示 false隐藏
      withdrawSite: false,
      // 提现记录默认隐藏充值来源 true显示 false隐藏
      rechargeSite: false,
      otherRecordsList: [], // 综合记录
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
      id: ''
    }
  },
  async created () {
    await this.inquireCurrencyList('current-entrust')
    this.changeTime()
  },
  methods: {
    ...mapMutations([
      'SET_NEW_WITHDRAW_RECORD'
    ]),
    /**
     * 1.静态方法封装
     */
    // 1.1 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    //  1.2 点击复制
    onCopy (e) {
      // 已拷贝
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    // 1.3 时间赋值
    changeTime () {
      console.log(1)
      this.pickerOptionsTime = Object.assign({}, this.pickerOptionsTime, {
        disabledDate: (time) => {
          let curDate = (new Date()).getTime()
          let three = 90 * 24 * 3600 * 1000
          let threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      })
    },
    /**
     * 2.tab 切换赋值展示
     */
    // 2.1 tab 切换
    async coinMoneyOrders (e) {
      if (this.activeName === 'current-entrust') {
        this.startTime = ''
      }
      if (this.activeName === 'other-records') {
        this.startTime = [
          new Date(this.year, this.month, this.date, 0, 0, 0),
          new Date()
        ]
      }
      await this.inquireCurrencyList(e.name)
    },
    /**
     * 撤销提币记录
     */
    confirmCancelWithdraw (id, version) {
      // 确定删撤销提现记录?
      this.$confirm(this.$t('M.comm_sure_withdraw'), {
        // 取消
        cancelButtonText: this.$t('M.comm_cancel'),
        // 确定
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        this.cancelWithdrawal(id, version)
      }).catch(() => {
      })
    },
    // 确认撤销提现
    async cancelWithdrawal (orderId, version) {
      console.log(orderId, version)
      let data = await deleteCancelWithdraw({
        orderId,
        version
      })
      if (!data) return false
      // 调用刷新提币列表接口
      this.getChargeMentionList()
    },
    /**
     * 2.获取商户币种列表
     */
    async inquireCurrencyList (entrustType) {
      let data
      let param = {
      }
      data = await getMerchantCurrencyList(param)
      if (!data) return false
      this.currencyList = getNestedData(data, 'data')
      // 判断全局币种id是否为空 如果为空 把币种第一项赋值给defaultCurrencyId
      // 如果不为空则把全局我的资产带回的币种id赋值给defaultCurrencyId 进行展示
      if (this.assetJumpStatementDetails === '') {
        this.defaultCurrencyId = getNestedData(data, 'data')[0] ? getNestedData(data, 'data')[0].id : ''
      } else {
        this.defaultCurrencyId = getNestedData(data, 'data')[0] ? this.assetJumpStatementDetails || getNestedData(data, 'data')[0].id : ''
      }
      // 对充提类型进行赋值
      this.currencyTypeValue = this.assetJumpStatementDetailsType
      this.getChargeMentionList(entrustType)
      // 接口回来之后把select状态改为可用
      this.currencyValueStatus = false
    },
    /**
     * 3.搜索按钮
     */
    // 3.1 点击搜索按钮
    stateSearchButton (entrustType) {
      this.recordPageNumber = 1
      this.otherRecordPageNumbers = 1
      this.getChargeMentionList(entrustType)
    },
    /**
     * 4.刚进页面时候 冲提记录列表展示
     */
    /* 类型 OTC_TRADE：otc交易 OTC_FEE：otc手续费
         CTC_TRADE：币币交易 CTC_FEE：币币手续费
         FINANCIAL_EXPENDITURE：理财支出
         FINANCIAL_INCOME：理财收入
         INVITATION_REWARD：邀请有礼 */
    async getChargeMentionList (entrustType1) {
      console.log(this.currencyTypeValue)
      // 判断是否显示提币地址 充币不显示，提币或者为空显示
      if (this.currencyTypeValue === 'WITHDRAW') {
        this.withdrawSite = true
        this.rechargeSite = false
      } else {
        this.rechargeSite = true
        this.withdrawSite = false
      }
      console.log(this.withdrawSite)
      const entrustType = entrustType1 || 'current-entrust'
      this.chargeRecordList = []
      this.otherRecordsList = []
      let params = {
        pageSize: this.pageSize, // 每页显示条数
        userId: getNestedData(this.userInfo, 'userId'), // 用户ID
        coinId: this.defaultCurrencyId, // 币种ID
        type: this.otherRecordsValue, // 类型（RECHARGE:充值 WITHDRAW:提现 / 其他记录类型
        startTime: '', // 开始起止时间
        endTime: '' // 结束起止时间
      }
      let data
      let data1
      // console.log(entrustType)
      switch (entrustType) {
        case 'current-entrust':
          params.currentPage = this.recordPageNumber
          params.type = this.currencyTypeValue
          params.startTime = this.startTime[0] == null ? '' : timeFilter(this.startTime[0], 'normal') // 开始起止时间
          params.endTime = this.startTime[1] == null ? '' : timeFilter(this.startTime[1], 'normal') // 结束起止时间
          data = await statusRushedToRecordList(params)
          // console.log(data)
          if (!data) return false
          // 返回冲提记录列表展示
          let detailData = getNestedData(data, 'data')
          console.log(detailData)
          // 充提记录
          this.chargeRecordList = getNestedData(detailData, 'list') || []
          this.recordTotalPageNumber = getNestedData(detailData, 'pages') - 0
          break
        case 'other-records':
          params.pageNum = this.otherRecordPageNumbers
          params.startTime = this.startTime[0] == null ? '' : timeFilter(this.startTime[0], 'normal') // 开始起止时间
          params.endTime = this.startTime[1] == null ? '' : timeFilter(this.startTime[1], 'normal') // 结束起止时间
          params.type = this.otherRecordsValue
          // console.log(params)
          // console.log(this.startTime)
          data1 = await getComprehensiveRecordsList(params)
          console.log(data1)
          if (!data1) return false
          this.otherRecordsList = getNestedData(data1, 'data.list') || []
          this.totalPagesOtherRecords = getNestedData(data1, 'data.pages') - 0
          break
      }
    },
    /**
     * 4.1切换页码
     * @entrustType: 记录类型： 0：充提记录 1： 其他记录
     */
    changeCurrentPage (entrustType, pageNum) {
      // console.log(pageNum)
      switch (entrustType) {
        case 'current-entrust':
          // console.log(pageNum)
          this.recordPageNumber = pageNum
          this.getChargeMentionList(entrustType)
          break
        case 'other-records':
          // console.log(pageNum)
          this.otherRecordPageNumbers = pageNum
          this.getChargeMentionList(entrustType)
          break
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      userCenterActiveName: state => state.personal.userCenterActiveName,
      assetJumpStatementDetails: state => state.personal.assetJumpStatementDetails, // 跳转到的账单明细
      assetJumpStatementDetailsType: state => state.personal.assetJumpStatementDetailsType // 我的资产跳转到账单明细提币携带提币类型
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .billing-details {
    > .billing-details-main {
      min-height: 709px;

      .state-status {
        color: $mainColor;
      }

      .white-space {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .billing-details-content {
        > .tab-list {
          height: 520px;
        }
      }

      .billing-details-query {
        height: 57px;
        line-height: 57px;

        .margin-left150 {
          margin-left: 150px;
        }

        .search-button {
          min-width: 50px;
          height: 30px;
          padding: 0 5px;
          margin-top: 15px;
          line-height: 29px;
        }

        .demonstration {
          margin-right: 5px;
          font-size: 12px;
        }
      }
    }

    > .billing-details-header {
      margin-bottom: 2px;

      > .header-content {
        width: 300px;
        color: #338ff5;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .billing-details-main {
        background-color: $mainContentNightBgColor;

        .billing-details-query {
          border-bottom: 1px solid #39424d;

          > .search-button {
            color: #fff;
            background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
          }
        }
      }

      > .billing-details-header {
        background-color: $mainContentNightBgColor;
        box-shadow: 0 5px 50px #181e2a;
      }

      /deep/ {
        .el-date-range-picker__content.is-left {
          border-right: 1px solid #6666;
        }

        .el-table__body-wrapper {
          height: 470px;
          background-color: #1c1f32;
        }

        .el-input--suffix {
          .el-input__inner {
            padding-right: 25px;
          }
        }

        .el-date-editor {
          .el-range-input,
          .el-range-separator {
            color: #fff;
          }

          .el-range-input {
            font-size: 12px;
          }
        }

        .el-table {
          background-color: $mainContentNightBgColor;

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

            &.prev-month {
              color: #666;
            }
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

        .el-tabs__item {
          padding: 0;
          margin-right: 30px;
          border-left: 0 !important;
          text-align: center;

          &.is-active {
            border-bottom: 2px solid #0079fe;
            border-left: 0 !important;
            color: #0079fe;
            background: transparent !important;
          }

          &:hover {
            border-left: 0 !important;
            text-align: center;
            color: #0079fe;
            background: transparent !important;
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .billing-details-main {
        background-color: $mainDayBgColor;
        box-shadow: 0 0 6px #cfd5df;

        .billing-details-query {
          border-bottom: 1px solid rgba(57, 66, 77, .1);

          > .search-button {
            color: #fff;
            background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
          }

          .demonstration {
            color: #7d90ac;
          }
        }
      }

      > .billing-details-header {
        border-radius: 2px;
        background: #fff;
        box-shadow: 0 0 6px #cfd5df;
      }

      /deep/ {
        .el-table__body-wrapper {
          height: 470px;
          background-color: #fff;
        }

        .el-table {
          background-color: $mainColorOfWhite;

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

        .el-tabs__item {
          padding: 0;
          margin-right: 30px;
          border-left: 0 !important;
          text-align: center;
          background: transparent !important;

          .el-tabs__item &.is-active {
            border-bottom: 2px solid #0079fe;
            border-left: 0 !important;
            color: #0079fe;
            background: transparent !important;
          }

          &:hover {
            border-left: 0 !important;
            text-align: center;
            color: #0079fe;
            background: transparent !important;
          }
        }
      }
    }

    /deep/ {
      .el-input__inner {
        width: 110px;
        height: 30px !important;
        border: 0;
        font-size: 12px;
      }

      .el-date-editor .el-range__close-icon {
        width: 16px;
        line-height: 25px;
      }

      .el-date-editor {
        &.el-input__inner {
          width: 310px;
        }

        &.el-input {
          width: 120px;
          height: 30px;
        }

        .el-input__inner {
          width: 120px;
          height: 30px;
        }

        .el-range__icon {
          line-height: 25px;
        }

        .el-range-separator {
          line-height: 26px;
        }

        .el-range-input {
          font-size: 12px;
        }
      }

      .el-table {
        .cell {
          font-size: 12px;
        }

        th {
          &:nth-child(1) {
            text-align: left;
          }

          &:nth-of-type(4) {
            text-align: center;
          }

          &:nth-of-type(5) {
            text-align: right;
          }

          &:nth-of-type(6) {
            text-align: right;
          }

          &:nth-of-type(7) {
            text-align: right;
          }

          & > .cell {
            font-size: 12px;
          }

          &.is-leaf {
            border-top: 0;
          }
        }

        td {
          &:nth-child(1) {
            text-align: left;
          }

          &:nth-of-type(4) {
            text-align: center;
          }

          &:nth-of-type(5) {
            text-align: right;
          }

          &:nth-of-type(6) {
            text-align: right;
          }

          &:nth-of-type(7) {
            text-align: right;
          }
        }
      }

      .billing-details-main {
        .el-tabs {
          .el-tabs__content {
            width: 100% !important;
          }
        }
      }
    }

    .el-pagination {
      position: relative;
      top: -62px;
    }
  }
</style>
