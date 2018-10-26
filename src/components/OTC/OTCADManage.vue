<template>
  <div
    class="otc-AD-manage-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  <!-- :style="{'height':windowHeight+'px'}" -->
    <!-- 2.0 广告管理 -->
    <div class="otc-AD-manage-content" :style="{'min-height':(height-556)+'px'}">
      <!-- 2.1 大标题广告管理 -->
      <div class="AD-title font-size20 padding-l15 font-weight700">
        <!-- 广告管理 -->
        {{$t('M.otc_adMange')}}
      </div>
      <!-- 2.2 广告管理主体内容 -->
      <div class="AD-manage-main">
        <!-- 上部分筛选条件 -->
        <div class="manage-main-top">
          <!-- 交易类型 -->
          <span class="filtrate-text font-size14">
            {{$t('M.otc_type_ransaction')}}
          </span>
          <span class="style-input">
            <el-select
              :placeholder="$t('M.comm_please_choose')"
              :no-data-text="$t('M.comm_no_data')"
              v-model="activitedADManageTraderStyleList"
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
          <!-- 交易币种 -->
          <span class="filtrate-text font-size14">
            <!-- {{$t('M.otc_trade')}}{{$t('M.comm_currency')}} -->
            {{$t('M.otc_AD_trade_token')}}
          </span>
          <span class="market-input">
            <el-select
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose')"
              v-model="activitedADManageMarketList"
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
          <!-- 交易法币 -->
          <span class="filtrate-text font-size14">
            <!-- {{$t('M.otc_trade')}}{{$t('M.comm_coin')}} -->
            {{$t('M.otc_AD_trade_currency')}}
          </span>
          <span class="market-input">
            <el-select
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose')"
              v-model="activitedADManageCurrencyId"
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
          <!-- 状态 -->
          <span class="filtrate-text font-size14">
            {{$t('M.comm_state')}}
          </span>
          <span class="status-input">
            <el-select
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose')"
              v-model="activitedADManageStatusList"
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
          <!-- 按钮 -->
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
            >
              {{$t('M.otc_MerchantsOrders_reset')}}
            </el-button>
          </span>
          <!-- 一键下架所有广告 -->
          <span
            class="all-unshelve cursor-pointer"
            @click="cancelAllOnekey"
          >
            <IconFontCommon
              class="font-size22"
              iconName="icon-xiajia5"
            />
            <span
              class="unshelve-text"
            >
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
            style="width: 100%"
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
                  v-if="s.row.entrustType === 'BUY'"
                  :class="{red:s.row.entrustType === 'BUY'}"
                >
                  <!-- 购买 -->
                  {{$t('M.otc_index_buy')}}
                </div>
                <div
                  v-if="s.row.entrustType === 'SELL'"
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
                <div>{{s.row.price}}</div>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="s">
                <div>{{s.row.entrustCount}}</div>
              </template>
            </el-table-column>
            <!-- 剩余数量 -->
            <el-table-column
              :label="$t('M.comm_surplus') + $t('M.comm_count')"
            >
              <template slot-scope="s">
                <!-- <div>{{s.row.entrustCount - s.row.matchCount}}</div> -->
                <div>{{s.row.remainCount}}</div>
              </template>
            </el-table-column>
            <!-- 已完成数量 -->
            <el-table-column
              :label="$t('M.otc_enum_status_yiwancheng') + $t('M.comm_count')"
              width="120px"
            >
              <template slot-scope="s">
                <div>{{s.row.matchCount}}</div>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope="s">
                <!-- 已上架 -->
                <div v-if="s.row.status === 'ENTRUSTED'">
                  {{$t('M.comm_already')}}{{$t('M.otc_adMange_getting')}}
                </div>
                <!-- 已完成 -->
                <div v-if="s.row.status === 'COMPLETED'">
                  {{$t('M.otc_enum_status_yiwancheng')}}
                </div>
                <!-- 已下架 -->
                <div v-if="s.row.status === 'CANCELED'">
                  {{$t('M.comm_already')}}{{$t('M.otc_adMange_adverting')}}
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
                  @click="updateADUnshelve(s.row.id)"
                >
                  {{$t('M.otc_adMange_adverting')}}
                </el-button>
                <!-- 修改 -->
                <el-button
                  type="text"
                  v-if="s.row.status === 'CANCELED'"
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
  getMerchantAvailablelegalTender,
  getOTCADManageApplyList,
  querySelectedOrdersRevocation
} from '../../utils/api/OTC'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      loading: true, // loading加载
      height: '', // 广告管理内容的高度
      // 分页
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 1.0 广告管理筛选下拉框数组--交易类型
      activitedADManageTraderStyleList: '', // 选中的筛选项
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
      activitedADManageMarketList: '', // 选中的筛选项
      ADManageMarketList: [],
      // 交易法币
      activitedADManageCurrencyId: '',
      ADManageCurrencyId: [],
      // 3.0 广告管理筛选下拉框数组--状态
      activitedADManageStatusList: '', // 选中的筛选项
      ADManageStatusList: [
        {
          value: 'ENTRUSTED',
          // label: this.$t('M.comm_already') + this.$t('M.otc_adMange_getting') // 已上架
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
      pageNum: 0, // 设置默认列表页数
      pageSize: 10, // 设置列表当前页数
      ADList: [] // 广告列表
    }
  },
  created () {
    // 动态获取广告管理内容的高度
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    // console.log(this.height)
    require('../../../static/css/list/OTC/OTCADManage.css')
    require('../../../static/css/theme/day/OTC/OTCADManageDay.css')
    require('../../../static/css/theme/night/OTC/OTCADManageNight.css')
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailablelegalTenderList()
    // 3.0 获取otc广告管理列表
    this.getOTCADManageList()
  },
  mounted () {
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    // 1.0 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.loading = true
      this.getOTCADManageList()
    },
    // 2.0 清空数据
    resetCondition () {
      // 清空交易类型
      this.activitedADManageTraderStyleList = ''
      // 清除选中币种id
      this.activitedADManageMarketList = ''
      // 请吃法币币种id
      this.activitedADManageCurrencyId = ''
      // 选中状态清空
      this.activitedADManageStatusList = ''
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
        entrustType: this.activitedADManageTraderStyleList ? this.activitedADManageTraderStyleList : '',
        coinId: this.activitedADManageMarketList ? this.activitedADManageMarketList : '',
        currencyId: this.activitedADManageCurrencyId ? this.activitedADManageCurrencyId : '',
        status: this.activitedADManageStatusList ? this.activitedADManageStatusList : '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('获取广告管理列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑 渲染列表
        this.loading = false
        let ADData = data.data.data
        this.ADList = ADData.list
        // 分页
        this.totalPages = ADData.pages - 0
      }
    },
    // 5.0
    changeSelectValue (type, targetValue) {
      switch (type) {
        // 交易类型选中赋值
        case 'changeADManageTraderStyleList':
          this.activitedADManageTraderStyleList = targetValue
          break
        // 交易类型选中赋值
        case 'changeADManageMarketList':
          this.activitedADManageMarketList = targetValue
          break
        // 交易法币选中赋值
        case 'changeADManageCurrencyId':
          this.activitedADManageCurrencyId = targetValue
          break
        // 交易状态选中赋值
        case 'changeADManageStatusList':
          this.activitedADManageStatusList = targetValue
          break
      }
    },
    // 6.0 币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({})
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.ADManageMarketList = data.data.data
      }
    },
    // 7.0 可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({})
      console.log('可用法币')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.ADManageCurrencyId = data.data.data
      }
    },
    // 8.0 一键下架所有广告 二次确认弹出框
    cancelAllOnekey () {
      this.$confirm(this.$t('M.otc_adMange_tipsContentThree'), {
        confirmButtonText: this.$t('M.comm_all_sold_out'), // 全部下架
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.loading = true
        this.cancelAllOnekeyConfirm()
      }).catch(() => {
      })
    },
    // 9.0 一键下架所有广告
    async cancelAllOnekeyConfirm () {
      const data = await cancelAllOrdersOnekey()
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        this.loading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.loading = false
        this.getOTCADManageList()
      }
    },
    // 10.0 点击表格中的下架按钮触发的事件
    updateADUnshelve (id) {
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
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 重新渲染列表
        this.getOTCADManageList()
        this.$message({
          type: 'success',
          message: this.$t('M.otc_adMange_adverting') + this.$t('M.comm_success') + '!' // 下架成功
        })
      }
    },
    // 12.0 点击 修改 按钮钮触发的事件
    modifyAD (id) {
      this.$confirm(this.$t('M.otc_adMange_tipsContentTwo'), {
        confirmButtonText: this.$t('M.comm_sold_out'), // 下架
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        // 跳转发布广告页面并携带一条信息的参数
        this.$router.push({path: '/OTCPublishAD', query: {id: id}})
      }).catch(() => {
      })
    },
    // 13.0 点击查询按钮 重新请求列表数据
    findFilter () {
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
    overflow: hidden;
    // position: relative;
    >.otc-AD-manage-content {
      width: 1150px;
      margin: 70px auto 10px auto;
      padding-top: 50px;
      > .AD-title {
        height: 30px;
        line-height: 30px;
        // color: #338FF5;
        // border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      > .AD-manage-main {
        > .manage-main-top {
          min-height: 60px;
          line-height: 60px;
          margin-bottom: 25px;
          > .filtrate-text {
            // color: #9DA5B3;
            margin-right: 5px;
          }
          > .style-input {
            margin-right: 15px;
          }
          > .market-input {
            margin-right: 15px;
          }
          > .status-input {
            margin-right: 73px;
          }
          > .inquire-button {
            margin-right: 15px;
          }
          > .all-unshelve {
            // color: #338FF5;
            > .unshelve-text {
            }
          }
        }
        > .manage-main-bottom {
         min-height: 450px!important;
          .red {
            // color: #D45858;
          }
          .green {
            // color: #008069;
          }
        }
        .page{
          text-align: center;
          padding: 10px 0;
        }
      }
    }
    &.night{
      background-color: $mainNightBgColor;
      >.otc-AD-manage-content {
        > .AD-title {
          color: #338FF5;
          border-left: 3px solid #338FF5;
        }
        > .AD-manage-main {
          > .manage-main-top {
            > .filtrate-text {
              color: #fff;
            }
            > .style-input {
            }
            > .market-input {
            }
            > .status-input {
            }
            > .inquire-button {
            }
            > .all-unshelve {
              color: #338FF5;
              > .unshelve-text {
              }
            }
          }
          > .manage-main-bottom {
            .red {
              color: #D45858;
            }
            .green {
              color: #008069;
            }
          }
          .page{
          }
        }
      }
    }
    &.day{
      background-color: $mainDayBgColor;
      >.otc-AD-manage-content {
        > .AD-title {
          color: #338FF5;
          border-left: 3px solid #338FF5;
        }
        > .AD-manage-main {
          > .manage-main-top {
            > .filtrate-text {
              color: #9DA5B3;
            }
            > .style-input {
            }
            > .market-input {
            }
            > .status-input {
            }
            > .inquire-button {
            }
            > .all-unshelve {
              color: #338FF5;
              > .unshelve-text {
              }
            }
          }
          > .manage-main-bottom {
            .red {
              color: #D45858;
            }
            .green {
              color: #008069;
            }
          }
          .page{
          }
        }
      }
    }
    .footer{
      // position: absolute;
      // bottom:0;
    }
  }
</style>
