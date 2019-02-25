<template>
  <div
    class="otc-AD-manage-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 2.0 广告管理 -->
    <div class="otc-AD-manage-content" :style="{'min-height':(height-305)+'px'}">
      <!-- 2.1 大标题广告管理 -->
      <div class="AD-title font-size18 padding-l15 font-weight700">
        <!-- 广告管理 -->
        {{$t('M.otc_adMange')}}
      </div>
      <!-- 2.2 广告管理主体内容 -->
      <div class="AD-manage-main">
        <!-- 上部分筛选条件 -->
        <div class="manage-main-top">
          <!-- 交易类型 -->
          <div class="one-filter-condition">
            <span class="filtrate-text font-size14">
              {{$t('M.otc_type_ransaction')}}
            </span>
            <span class="style-input">
              <el-select
                :placeholder="$t('M.comm_please_choose')"
                :no-data-text="$t('M.comm_no_data')"
                v-model="activatedADManageTraderStyleList"
                @change="changeSelectValue('changeADManageTraderStyleList', $event)"
                clearable
              >
                <el-option
                  v-for="item in ADManageTraderStyleList"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 交易币种 -->
          <div class="two-filter-condition">
            <span class="filtrate-text font-size14">
              {{$t('M.otc_AD_trade_token')}}
            </span>
            <span class="market-input">
              <el-select
                :no-data-text="$t('M.comm_no_data')"
                :placeholder="$t('M.comm_please_choose')"
                v-model="activatedADManageMarketList"
                @change="changeSelectValue('changeADManageMarketList', $event)"
                clearable
              >
                <el-option
                  v-for="(item,index) in ADManageMarketList"
                  :key="index"
                  :label="item.name"
                  :value="item.coinId"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 交易法币 -->
          <div class="three-filter-condition">
            <span class="filtrate-text font-size14">
              {{$t('M.otc_AD_trade_currency')}}
            </span>
            <span class="market-input">
              <el-select
                :no-data-text="$t('M.comm_no_data')"
                :placeholder="$t('M.comm_please_choose')"
                v-model="activatedADManageCurrencyId"
                @change="changeSelectValue('changeADManageCurrencyId', $event)"
                clearable
              >
                <el-option
                  v-for="(item,index) in ADManageCurrencyId"
                  :key="index"
                  :label="language == 'zh_CN'? item.name : item.shortName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 状态 -->
          <div class="four-filter-condition">
            <span class="filtrate-text font-size14">
              {{$t('M.comm_state')}}
            </span>
            <span class="status-input">
              <el-select
                :no-data-text="$t('M.comm_no_data')"
                :placeholder="$t('M.comm_please_choose')"
                v-model="activatedADManageStatusList"
                @change="changeSelectValue('changeADManageStatusList', $event)"
                clearable
              >
                <el-option
                  v-for="item in ADManageStatusList"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </span>
          </div>
          <!-- 按钮 -->
          <div class="five-filter-condition">
            <span class="inquire-button">
              <!-- 查询 -->
              <el-button
                type="primary"
                @click="findFilter"
              >
                {{$t('M.comm_query')}}
              </el-button>
              <!-- 重置 -->
              <el-button
                type="primary"
                @click="resetCondition"
                class="second-button"
              >
                {{$t('M.otc_MerchantsOrders_reset')}}
              </el-button>
            </span>
          </div>
        </div>
        <div class="manage-main-middle">
          <!-- 一键下架所有广告 -->
          <span
            class="all-unShelve cursor-pointer"
            @click="cancelAllOneKey"
          >
            <IconFontCommon
              class="font-size22"
              iconName="icon-xiajia5"
            />
            <span>
              {{$t('M.otc_adMange_advertingAD')}}
            </span>
          </span>
        </div>
        <!-- 下部分表格内容 -->
        <div
          class="manage-main-bottom"
          v-loading="loading"
          element-loading-background="rgba(0, 0, 0, 0.6)"
        >
          <el-table
            :data="ADList"
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
          >
            <!-- 时间 -->
            <el-table-column
              :label="$t('M.comm_time')"
              width="180"
            >
              <template slot-scope="s">
                <div>{{timeFormatting(s.row.createTime)}}</div>
              </template>
            </el-table-column>
            <!-- 交易类型 -->
            <el-table-column
              :label="$t('M.otc_type_ransaction')"
            >
              <template slot-scope="s">
                <div
                  v-show="s.row.entrustType === 'BUY'"
                  :class="{red:s.row.entrustType === 'BUY'}"
                >
                  <!-- 购买 -->
                  {{$t('M.otc_index_buy')}}
                </div>
                <div
                  v-show="s.row.entrustType === 'SELL'"
                  :class="{green:s.row.entrustType === 'SELL'}"
                >
                  <!-- 出售 -->
                  {{$t('M.otc_index_sell')}}
                </div>
              </template>
            </el-table-column>
            <!-- 币种 -->
            <el-table-column
              :label="$t('M.otc_AD_token')"
            >
              <template slot-scope="s">
                <div>{{s.row.coinName}}</div>
              </template>
            </el-table-column>
            <!-- 法币 -->
            <el-table-column
              :label="$t('M.comm_coin')"
            >
              <template slot-scope="s">
                <div>{{s.row.currencyName}}</div>
              </template>
            </el-table-column>
            <!-- 单价 -->
            <el-table-column
              :label="$t('M.otc_index_UnitPrice')"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.price) }}</div>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.entrustCount) }}</div>
              </template>
            </el-table-column>
            <!-- 剩余数量 -->
            <el-table-column
              :label="$t('M.comm_balance_completed1')"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.remainCount) }}</div>
              </template>
            </el-table-column>
            <!-- 已完成数量 -->
            <el-table-column
              :label="$t('M.otc_enum_status_yiwancheng_sum')"
              width="120px"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.matchCount) }}</div>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope="s">
                <!-- 已上架 -->
                <div v-show="s.row.status === 'ENTRUSTED'">
                  {{$t('M.otc_adMange_already_getting')}}
                </div>
                <!-- 已完成 -->
                <div v-show="s.row.status === 'COMPLETED'">
                  {{$t('M.otc_adMange_already_accomplish')}}
                </div>
                <!-- 已下架 -->
                <div v-show="s.row.status === 'CANCELED'">
                  {{$t('M.otc_adMange_already_adverting')}}
                </div>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              :label="$t('M.otc_index_operate')"
            >
              <template slot-scope="s">
                <!-- 下架 -->
                <el-button
                  type="text"
                  v-if="s.row.status === 'ENTRUSTED'"
                  @click="updateADUnShelve(s.row.id)"
                >
                  {{$t('M.otc_adMange_adverting')}}
                </el-button>
                <!-- 修改 -->
                <!--20190222修改：后台增加字段币种是否可用来动态显示隐藏修改按钮s.row.coinStatus === 'ENABLE'-->
                <!--也可以用禁用按钮方法：:disabled="s.row.coinStatus === 'DISABLE'"-->
                <el-button
                  type="text"
                  v-if="s.row.status === 'CANCELED' && s.row.coinStatus === 'ENABLE'"
                  @click="modifyAD(s.row.id)"
                >
                  {{$t('M.otc_adMange_change')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="ADList.length"
            layout="prev, pager, next"
            :page-count="totalPages"
            @current-change="changeCurrentPage"
            :current-page="currentPage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  cancelAllOrdersOnekey,
  getOTCAvailableCurrency,
  getMerchantAvailableLegalTender,
  getOTCADManageApplyList,
  querySelectedOrdersRevocation
} from '../../utils/api/OTC'
import IconFontCommon from '../../components/Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // loading加载
      loading: true,
      // 广告管理内容的高度
      height: '',
      // 分页
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 1.0 广告管理筛选下拉框数组--交易类型
      // 选中的筛选项
      activatedADManageTraderStyleList: '',
      ADManageTraderStyleList: [
        {
          value: 'BUY',
          label: 'M.comm_buying'
        },
        {
          value: 'SELL',
          label: 'M.comm_offering'
        }
      ],
      // 2.0 广告管理筛选下拉框数组--市场
      activatedADManageMarketList: '', // 选中的筛选项
      ADManageMarketList: [],
      // 交易法币
      activatedADManageCurrencyId: '',
      ADManageCurrencyId: [],
      // 3.0 广告管理筛选下拉框数组--状态
      activatedADManageStatusList: '', // 选中的筛选项
      ADManageStatusList: [
        {
          value: 'ENTRUSTED',
          label: 'M.otc_adMange_already_getting' // 已上架
        },
        {
          value: 'COMPLETED',
          label: 'M.otc_adMange_already_accomplish' // 已完成
        },
        {
          value: 'CANCELED',
          label: 'M.otc_adMange_already_adverting' // 已下架
        }
      ],
      // 设置默认列表页数
      pageNum: 0,
      // 设置列表当前页数
      pageSize: 10,
      // 广告列表
      ADList: []
    }
  },
  created () {
    // 动态获取广告管理内容的高度
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailableLegalTenderList()
    // 3.0 获取otc广告管理列表
    this.getOTCADManageList()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.loading = true
      this.getOTCADManageList()
    },
    // 2.0 清空数据
    resetCondition () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      // 清空交易类型
      this.activatedADManageTraderStyleList = ''
      // 清除选中币种id
      this.activatedADManageMarketList = ''
      // 清除法币币种id
      this.activatedADManageCurrencyId = ''
      // 选中状态清空
      this.activatedADManageStatusList = ''
      // 重新获取列表
      this.loading = true
      this.getOTCADManageList()
    },
    // 3.0 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 4.0 获取广告管理列表
    async getOTCADManageList () {
      const data = await getOTCADManageApplyList({
        entrustType: this.activatedADManageTraderStyleList ? this.activatedADManageTraderStyleList : '',
        coinId: this.activatedADManageMarketList ? this.activatedADManageMarketList : '',
        currencyId: this.activatedADManageCurrencyId ? this.activatedADManageCurrencyId : '',
        status: this.activatedADManageStatusList ? this.activatedADManageStatusList : '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      // 返回数据正确的逻辑 渲染列表
      console.log('获取广告管理列表')
      console.log(data)
      this.loading = false
      if (!data) return false
      if (data.data) {
        let ADData = getNestedData(data, 'data')
        this.ADList = getNestedData(ADData, 'list')
        this.totalPages = getNestedData(ADData, 'pages') - 0 // 分页
      }
    },
    // 5.0
    changeSelectValue (type, targetValue) {
      switch (type) {
        // 交易类型选中赋值
        case 'changeADManageTraderStyleList':
          this.activatedADManageTraderStyleList = targetValue
          break
        // 交易类型选中赋值
        case 'changeADManageMarketList':
          this.activatedADManageMarketList = targetValue
          break
        // 交易法币选中赋值
        case 'changeADManageCurrencyId':
          this.activatedADManageCurrencyId = targetValue
          break
        // 交易状态选中赋值
        case 'changeADManageStatusList':
          this.activatedADManageStatusList = targetValue
          break
      }
    },
    // 6.0 币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({})
      // console.log('可用币种列表')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.ADManageMarketList = getNestedData(data, 'data')
      }
    },
    // 7.0 可用法币查询
    async getMerchantAvailableLegalTenderList () {
      const data = await getMerchantAvailableLegalTender({})
      // console.log('可用法币')
      // console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.ADManageCurrencyId = getNestedData(data, 'data')
      }
    },
    // 8.0 一键下架所有广告 二次确认弹出框
    cancelAllOneKey () {
      this.$confirm(this.$t('M.otc_adMange_tipsContentThree'), {
        confirmButtonText: this.$t('M.comm_all_sold_out'), // 全部下架
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.loading = true
        this.cancelAllOneKeyConfirm()
      }).catch(() => {
      })
    },
    // 9.0 一键下架所有广告
    async cancelAllOneKeyConfirm () {
      const data = await cancelAllOrdersOnekey()
      // 返回数据正确的逻辑
      this.loading = false
      if (!data) return false
      this.getOTCADManageList()
    },
    // 10.0 点击表格中的下架按钮触发的事件
    updateADUnShelve (id) {
      this.$confirm(this.$t('M.otc_adMange_tipsContentOne'), {
        confirmButtonText: this.$t('M.comm_sold_out'), // 下架
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.loading = true
        this.getOTCEntrustingOrdersRevocation(id)
      }).catch(() => {
      })
    },
    // 11.0 点击 下架 按钮请求撤单接口
    async getOTCEntrustingOrdersRevocation (id) {
      let data = await querySelectedOrdersRevocation({
        entrustId: id
      })
      // 返回数据正确的逻辑 重新渲染列表
      this.loading = false
      if (!data) return false
      this.getOTCADManageList()
    },
    // 12.0 点击 修改 按钮钮触发的事件
    modifyAD (id) {
      this.$confirm(this.$t('M.otc_adMange_tipsContentTwo'), {
        confirmButtonText: this.$t('M.comm_confirm'), // 确定
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        // 跳转发布广告页面并携带一条信息的参数
        this.$goToPage('/OTCPublishAD', {id})
      }).catch(() => {
      })
    },
    // 13.0 点击查询按钮 重新请求列表数据
    findFilter () {
      // 改变查询条件从第1页开始查询
      this.currentPage = 1
      this.loading = true
      this.getOTCADManageList()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language, // 当前选中语言
      theme: state => state.common.theme // 主题颜色
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";

.otc-AD-manage-box {
  margin-top: 66px;
  overflow: hidden;

  > .otc-AD-manage-content {
    width: 1150px;
    padding-top: 50px;
    margin: 50px auto 10px;

    > .AD-title {
      height: 20px;
      margin-bottom: 30px;
      line-height: 20px;
    }

    > .AD-manage-main {
      > .manage-main-top {
        display: flex;
        margin-bottom: 15px;

        .one-filter-condition,
        .two-filter-condition,
        .three-filter-condition,
        .four-filter-condition,
        .five-filter-condition {
          flex: 1;

          > .filtrate-text {
            margin-right: 10px;
          }
        }

        .five-filter-condition {
          text-align: right;

          .second-button {
            margin-left: 25px;
          }
        }
      }

      > .manage-main-middle {
        margin-bottom: 15px;
        text-align: right;
      }

      > .manage-main-bottom {
        min-height: 450px !important;
      }

      .page {
        padding: 10px 0;
        text-align: center;
      }
    }
  }

  /deep/ {
    .style-input {
      .el-select {
        width: 110px;
      }
    }

    .market-input {
      .el-select {
        width: 120px;
      }
    }

    .status-input {
      .el-select {
        width: 120px;
      }
    }

    .el-input__inner {
      height: 34px;
      border: 0;
    }

    .el-input__icon {
      height: 34px;
      line-height: 34px;
    }

    .inquire-button {
      .el-button {
        padding: 10px 16px;
        border: 0;
      }
    }

    .manage-main-bottom {
      .el-table__header {
        margin-bottom: 10px;
      }

      .el-table {
        tr {
          height: 40px;
        }

        th {
          padding: 5px 0;

          &.is-leaf {
            &:first-of-type {
              border-bottom-left-radius: 5px;
              border-top-left-radius: 5px;
            }

            &:nth-last-of-type(2) {
              border-top-right-radius: 5px;
              border-bottom-right-radius: 5px;
            }
          }
        }

        td {
          padding: 0;
          border-bottom: 0;
        }

        .el-table__body {
          tr {
            &:last-of-type {
              td {
                &:last-of-type {
                  border-bottom-right-radius: 5px;
                }

                &:first-of-type {
                  border-bottom-left-radius: 5px;
                }
              }
            }
          }
        }
      }

      .el-table__empty-block {
        min-height: 410px;
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .otc-AD-manage-content {
      > .AD-title {
        border-left: 3px solid #338ff5;
        color: #338ff5;
      }

      > .AD-manage-main {
        > .manage-main-top {
          .one-filter-condition,
          .two-filter-condition,
          .three-filter-condition,
          .four-filter-condition,
          .five-filter-condition {
            > .filtrate-text {
              color: #fff;
            }
          }
        }

        > .manage-main-middle {
          > .all-unShelve {
            color: #338ff5;
          }
        }

        > .manage-main-bottom {
          .red {
            color: #d45858;
          }

          .green {
            color: #008069;
          }
        }
      }
    }

    /deep/ {
      .el-input__inner {
        background-color: #1c1f32;
      }

      .inquire-button {
        .el-button {
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .manage-main-bottom {
        .el-table {
          color: #9da5b3;
          background-color: #1c1f32;

          thead {
            color: #a9bed4;
          }

          tr {
            background-color: #1c1f32;
          }

          th {
            background-color: #1c1f32;
            box-shadow: 4px 4px 6px #191e28;

            &.is-leaf {
              border-top: 1px solid #1c1f32;
              border-bottom: 1px solid #1c1f32;

              &:first-of-type {
                border-left: 1px solid #1c1f32;
              }

              &:nth-last-of-type(2) {
                border-right: 1px solid #1c1f32;
              }
            }
          }

          .el-table__body {
            tr {
              &:last-of-type {
                td {
                  border-bottom: 1px solid #1c1f32;
                }
              }

              td {
                &:first-of-type {
                  border-left: 1px solid #1c1f32;
                }

                &:last-of-type {
                  border-right: 1px solid #1c1f32;
                }
              }
            }
          }
        }
      }

      .el-table--enable-row-hover {
        .el-table__body {
          tr {
            &:hover {
              > td {
                background-color: #1e2636;
              }
            }
          }
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .otc-AD-manage-content {
      > .AD-title {
        border-left: 3px solid #338ff5;
        color: #338ff5;
      }

      > .AD-manage-main {
        > .manage-main-top {
          .one-filter-condition,
          .two-filter-condition,
          .three-filter-condition,
          .four-filter-condition,
          .five-filter-condition {
            > .filtrate-text {
              color: #9da5b3;
            }
          }
        }

        > .manage-main-middle {
          > .all-unShelve {
            color: #338ff5;
          }
        }

        > .manage-main-bottom {
          .red {
            color: #d45858;
          }

          .green {
            color: #008069;
          }
        }
      }
    }

    /deep/ {
      .el-input__inner {
        border: 1px solid rgba(236, 241, 248, 1);
        color: #7d90ac;
        background: #fff;
      }

      .inquire-button {
        .el-button {
          background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      > .otc-AD-manage-content {
        > .AD-manage-main {
          > .manage-main-top {
            > .filtrate-text[data-v-0c55db16] {
              color: #7d90ac;
            }
          }
        }
      }

      .manage-main-bottom {
        .el-table {
          border: 1px solid rgba(236, 241, 248, 1);
          border-radius: 5px;
          background-color: #fff;

          thead {
            color: #333;
          }

          th {
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            background-color: #fff;
            box-shadow: inset 0 2px 4px #f3f3f3;

            &.is-leaf {
              border-top: 0 solid #262f38;
              border-bottom: 1px solid rgba(236, 241, 248, 1);

              &:first-of-type {
                border-left: 0 solid #262f38;
                border-bottom-left-radius: 0;
                border-top-left-radius: 0;
              }

              &:nth-last-of-type(2) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                border-right: 0 solid #262f38;
              }
            }
          }
        }
      }

      .el-table--enable-row-hover {
        .el-table__body {
          tr {
            &:hover {
              > td {
                background-color: #fff;
              }
            }
          }
        }
      }
    }
  }
}

/deep/ {
  .el-message {
    top: 40%;
    min-width: 0;
  }
}
</style>
