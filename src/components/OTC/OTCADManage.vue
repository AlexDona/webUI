<template>
  <div
    class="otc-AD-manage-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 广告管理 -->
    <div class="otc-AD-manage-content">
      <!-- 2.1 大标题广告管理 -->
      <div class="AD-title font-size20 padding-l15 font-weight700">
        <!-- 广告管理 -->
        {{$t('M.otc_adMange')}}
      </div>
      <!-- 2.2 广告管理主体内容 -->
      <div class="AD-manage-main">
        <!-- 上部分筛选条件 -->
        <div class="manage-main-top">
          <span class="filtrate-text font-size14">
            <!-- 交易类型 -->
            {{$t('M.otc_type_ransaction')}}
          </span>
          <span class="style-input">
            <el-select
              v-model="activitedADManageTraderStyleList"
              @change="changeSelectValue('changeADManageTraderStyleList', $event)"
              clearable
            >
              <el-option
                v-for="item in ADManageTraderStyleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <!-- 交易币种 -->
          <span class="filtrate-text font-size14">{{$t('M.otc_trade')}}{{$t('M.comm_currency')}}</span>
          <!-- 币种选择 -->
          <span class="market-input">
              <el-select
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
          <span class="filtrate-text font-size14">{{$t('M.otc_trade')}}{{$t('M.comm_coin')}}</span>
          <!-- 法币选择 -->
          <span class="market-input">
              <el-select
                v-model="activitedADManageCurrencyId"
                @change="changeSelectValue('changeADManageCurrencyId', $event)"
                clearable
              >
                <el-option
                  v-for="(item,index) in ADManageCurrencyId"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
          </span>
          <!-- 状态 -->
          <span class="filtrate-text font-size14">{{$t('M.comm_state')}}</span>
          <span class="status-input">
            <el-select
              v-model="activitedADManageStatusList"
              @change="changeSelectValue('changeADManageStatusList', $event)"
              clearable
            >
              <el-option
                v-for="item in ADManageStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span class="inquire-button">
            <!-- 查询 -->
            <el-button type="primary" @click="findFilter">{{$t('M.comm_query')}}</el-button>
          </span>
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
            <!-- 一件下架所有广告 -->
            {{$t('M.otc_adMange_advertingAD')}}
            </span>
          </span>
        </div>
        <!-- 下部分表格内容 -->
        <div class="manage-main-bottom">
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
              <template slot-scope="scope">
                <div>{{timeFormatting(scope.row.createTime)}}</div>
              </template>
            </el-table-column>
            <!-- 交易类型 -->
            <el-table-column
              :label="$t('M.otc_type_ransaction')"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.entrustType === 'BUY'"
                  :class="{red:scope.row.entrustType === 'BUY'}"
                >
                  购买
                </div>
                <div
                  v-if="scope.row.entrustType === 'SELL'"
                  :class="{green:scope.row.entrustType === 'SELL'}"
                >
                  出售
                </div>
              </template>
            </el-table-column>
            <!-- 市场 -->
            <el-table-column
              :label="$t('M.comm_currency')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.coinName}}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_coin')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.currencyName}}</div>
              </template>
            </el-table-column>
            <!-- 单价 -->
            <el-table-column
              :label="$t('M.otc_index_UnitPrice')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.price}}</div>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.entrustCount}}</div>
              </template>
            </el-table-column>
            <!-- 剩余数量 -->
            <el-table-column
              :label="$t('M.comm_surplus') + $t('M.comm_count')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.entrustCount - scope.row.matchCount}}</div>
              </template>
            </el-table-column>
            <!-- 已完成数量 -->
            <el-table-column
              :label="$t('M.otc_enum_status_yiwancheng') + $t('M.comm_count')"
            >
              <template slot-scope="scope">
                <div>{{scope.row.matchCount}}</div>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope="scope">
                <!-- 已上架 -->
                <div v-if="scope.row.status === 'ENTRUSTED'">{{$t('M.comm_already')}}{{$t('M.otc_adMange_getting')}}</div>
                <!-- 已完成 -->
                <div v-if="scope.row.status === 'COMPLETED'">{{$t('M.otc_enum_status_yiwancheng')}}</div>
                <!-- 已下架 -->
                <div v-if="scope.row.status === 'CANCELED'">{{$t('M.comm_already')}}{{$t('M.otc_adMange_adverting')}}</div>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              :label="$t('M.otc_index_operate')"
            >
              <template slot-scope="scope">
                <!-- @click = "paymessage(scope.row.fid)"
                :id = "scope.row.fid"  -->
                <el-button
                  type="text"
                  v-if="scope.row.status === 'ENTRUSTED'"
                  @click="updateADUnshelve(scope.row.id)"
                >
                  <!-- 下架 -->
                  {{$t('M.otc_adMange_adverting')}}
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.status === 'CANCELED'"
                  @click="modifyAD(scope.row)"
                >
                <!-- 修改 -->
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
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {cancelAllOrdersOnekey, getOTCAvailableCurrency, getMerchantAvailablelegalTender, getOTCADManageApplyList, querySelectedOrdersRevocation} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 分页
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 1.0 广告管理筛选下拉框数组--交易类型
      activitedADManageTraderStyleList: '', // 选中的筛选项
      ADManageTraderStyleList: [
        {
          value: 'BUY',
          label: this.$t('M.comm_buying')
        },
        {
          value: 'SELL',
          label: this.$t('M.comm_offering')
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
          label: this.$t('M.comm_already') + this.$t('M.otc_adMange_getting')
        },
        {
          value: 'CANCELED',
          label: this.$t('M.otc_enum_status_yiwancheng')
        },
        {
          value: 'COMPLETED',
          label: this.$t('M.comm_already') + this.$t('M.otc_adMange_adverting')
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
    require('../../../static/css/list/OTC/OTCADManage.css')
    require('../../../static/css/theme/day/OTC/OTCADManageDay.css')
    require('../../../static/css/theme/night/OTC/OTCADManageNight.css')
    // 从全局获得商户id
    console.log(this.partnerId)
    // 获取otc广告管理列表
    this.getOTCADManageList()
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailablelegalTenderList()
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
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCADManageList()
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 获取广告管理列表
    async getOTCADManageList () {
      const data = await getOTCADManageApplyList({
        entrustType: this.activitedADManageTraderStyleList ? this.activitedADManageTraderStyleList : '',
        coinId: this.activitedADManageMarketList ? this.activitedADManageMarketList : '',
        currencyId: this.activitedADManageCurrencyId ? this.activitedADManageCurrencyId : '',
        status: this.activitedADManageStatusList ? this.activitedADManageStatusList : '',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 渲染列表
        this.ADList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    },
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
    // 币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.partnerId
      })
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.ADManageMarketList = data.data.data
      }
    },
    // 可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.partnerId
      })
      console.log('可用法币')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.ADManageCurrencyId = data.data.data
      }
    },
    // 一键下架所有广告
    async cancelAllOnekey () {
      const data = await cancelAllOrdersOnekey()
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.getOTCADManageList()
      }
    },
    // 点击表格中的下架按钮触发的事件
    updateADUnshelve (id) {
      this.$confirm(this.$t('M.otc_adMange_tipsContentOne'), {
        confirmButtonText: this.$t('M.comm_confirm'), // 确定
        cancelButtonText: this.$t('M.comm_cancel') // 取消
      }).then(() => {
        this.getOTCEntrustingOrdersRevocation(id)
        // this.$message({
        //   type: 'success',
        //   message: '下架成功!'
        // })
      }).catch(() => {
        this.$message({
          type: 'success',
          message: this.$t('M.comm_already') + this.$t('M.comm_cancel') + this.$t('M.otc_adMange_adverting') // 已取消下架
        })
      })
    },
    // 点击下架按钮 请求撤单接口
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
    // 点击修改按钮钮触发的事件
    modifyAD (item) {
      this.$confirm(this.$t('M.otc_adMange_tipsContentTwo'), this.$t('M.otc_prompt'), {
        confirmButtonText: this.$t('M.comm_confirm'),
        cancelButtonText: this.$t('M.comm_cancel'),
        type: 'warning'
      }).then(() => {
        // 跳转发布广告页面并携带一条信息的参数
        this.$router.push({path: '/OTCPublishAD', query: {id: item.id}})
      }).catch(() => {
        // this.$message({
        //   type: 'success',
        //   message: '已取消修改'
        // })
      })
    },
    // 点击查询按钮 重新请求列表数据
    findFilter () {
      this.getOTCADManageList()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
// @import url(../../../static/css/scss/OTC/OTCCenter.scss);
  .otc-AD-manage-box {
    >.otc-AD-manage-content {
      width: 1150px;
      margin: 70px auto;
      margin-bottom: 10px;
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
          height: 60px;
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
            margin-right: 155px;
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
      background-color: #121824;
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
    &.day{
      background-color: #ffffff;
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
  }
</style>
