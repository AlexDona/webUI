<template>
  <div class="otc-AD-manage-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 广告管理 -->
    <div class="otc-AD-manage-content">
      <!-- 2.1 大标题广告管理 -->
      <div class="AD-title font-size20 padding-l15 font-weight700">
        广告管理
      </div>
      <!-- 2.2 广告管理主体内容 -->
      <div class="AD-manage-main">
        <!-- 上部分筛选条件 -->
        <div class="manage-main-top">
          <span class="filtrate-text font-size14">
            交易类型
          </span>
          <span class="style-input">
            <el-select
              v-model="activitedADManageTraderStyleList"
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
          <span class="filtrate-text font-size14">交易币种</span>
          <!-- 币种选择 -->
          <span class="market-input">
              <el-select
                v-model="activitedADManageMarketList"
                @change="changeADManageMarketList"
              >
                <el-option
                  v-for="item in ADManageMarketList"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                >
                </el-option>
              </el-select>
          </span>
          <span class="filtrate-text font-size14">交易法币</span>
          <!-- 法币选择 -->
          <span class="market-input">
              <el-select
                v-model="activitedADManageCurrencyId"
                @change="changeADManageCurrencyId"
              >
                <el-option
                  v-for="item in ADManageCurrencyId"
                  :key="item.name"
                  :label="item.label"
                  :value="item.name"
                >
                </el-option>
              </el-select>
          </span>
          <span class="filtrate-text font-size14">状态</span>
          <span class="status-input">
            <el-select
              v-model="activitedADManageStatusList"
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
            <el-button type="primary" @click="findFilter">查询</el-button>
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
              一键下架所有广告
            </span>
          </span>
        </div>
        <!-- 下部分表格内容 -->
        <div class="manage-main-bottom">
          <el-table
            :data="ADList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <!-- 时间 -->
            <el-table-column
              label="时间"
              width="180"
            >
              <template slot-scope="scope">
                <div>{{timeFormatting(scope.row.time)}}</div>
              </template>
            </el-table-column>
            <!-- 交易类型 -->
            <el-table-column
              label="交易类型"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.buySellStatus === 1"
                  :class="{red:scope.row.buySellStatus === 1}"
                >
                  购买
                </div>
                <div
                  v-if="scope.row.buySellStatus === 2"
                  :class="{green:scope.row.buySellStatus === 2}"
                >
                  出售
                </div>
              </template>
            </el-table-column>
            <!-- 市场 -->
            <el-table-column
              label="币种"
            >
              <template slot-scope="scope">
                <div>{{scope.row.market}}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="法币"
            >
              <template slot-scope="scope">
                <div>{{scope.row.market}}</div>
              </template>
            </el-table-column>
            <!-- 单价 -->
            <el-table-column
              label="单价"
            >
              <template slot-scope="scope">
                <div>{{scope.row.price}}</div>
              </template>
            </el-table-column>
            <!-- 数量 -->
            <el-table-column
              label="数量"
            >
              <template slot-scope="scope">
                <div>{{scope.row.sum}}</div>
              </template>
            </el-table-column>
            <!-- 剩余数量 -->
            <el-table-column
              label="剩余数量"
            >
              <template slot-scope="scope">
                <div>{{scope.row.residue}}</div>
              </template>
            </el-table-column>
            <!-- 已完成数量 -->
            <el-table-column
              label="已完成数量"
            >
              <template slot-scope="scope">
                <div>{{scope.row.complete}}</div>
              </template>
            </el-table-column>
            <!-- 状态 -->
            <el-table-column
              label="状态"
            >
              <template slot-scope="scope">
                <div>{{scope.row.status}}</div>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              label="操作"
            >
              <template slot-scope="scope">
                <!-- @click = "paymessage(scope.row.fid)"
                :id = "scope.row.fid"  -->
                <el-button
                  type="text"
                  @click="updateADUnshelve(scope.row.id)"
                  v-if="scope.row.adStatus === 1"
                >
                  下架
                </el-button>
                <el-button
                  type="text"
                  v-if="scope.row.adStatus === 2"
                  @click="modifyAD(scope.row.id)"
                >
                  修改
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {cancelAllOrdersOnekey, getOTCAvailableCurrency, getMerchantAvailablelegalTender, getOTCADManageApplyList} from '../../utils/api/OTC'
import NavCommon from '../Common/HeaderCommon'
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
      // 1.0 广告管理筛选下拉框数组--交易类型
      activitedADManageTraderStyleList: '', // 选中的筛选项
      ADManageTraderStyleList: [
        {
          value: '选项1',
          label: '购买'
        },
        {
          value: '选项2',
          label: '出售'
        }
      ],
      // 2.0 广告管理筛选下拉框数组--市场
      activitedADManageMarketList: '', // 选中的筛选项
      ADManageMarketList: [
        // {
        //   value: '选项1',
        //   label: '市场1'
        // },
        // {
        //   value: '选项2',
        //   label: '市场2'
        // }
      ],
      activitedADManageCurrencyId: '',
      ADManageCurrencyId: [],
      // 3.0 广告管理筛选下拉框数组--状态
      activitedADManageStatusList: '', // 选中的筛选项
      ADManageStatusList: [
        {
          value: '选项1',
          label: '已上架'
        },
        {
          value: '选项2',
          label: '已下架'
        },
        {
          value: '选项2',
          label: '已完成'
        }
      ],
      // 设置默认列表页数
      pageNum: 0,
      // 设置列表页面长度
      pageSize: 10,
      // 广告列表
      ADList: [
        {
          time: 1302486032000,
          id: 1,
          market: 'FBT',
          price: '67812.21',
          sum: '2.7869',
          residue: '0.00123',
          complete: '2.78951',
          status: '已下架',
          buySellStatus: 1, // 1:买 2：卖
          adStatus: 2 // 1:已上架 2：已下架 3：已完成
        },
        {
          time: 1802486032000,
          id: 2,
          market: 'CNY',
          price: '67812.21',
          sum: '2.7869',
          residue: '0.00123',
          complete: '2.78951',
          status: '已上架',
          buySellStatus: 2, // 1:买 2：卖
          adStatus: 1 // 1:已上架 2：已下架 3：已完成
        },
        {
          time: 1802486032000,
          id: 3,
          market: 'FBT',
          price: '67812.21',
          sum: '2.7869',
          residue: '0.00123',
          complete: '2.78951',
          status: '已完成',
          buySellStatus: 1, // 1:买 2：卖
          adStatus: 3 // 1:已上架 2：已下架 3：已完成
        }
      ]
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
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 获取广告管理列表
    async getOTCADManageList () {
      const data = await getOTCADManageApplyList({
        // pageNum: this.pageNum,
        // pageSize: this.pageSize
      })
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.ADList = data.data.data.list
      }
    },
    changeADManageMarketList (e) {
      this.activitedADManageMarketList = e
    },
    changeADManageCurrencyId (e) {
      this.activitedADManageCurrencyId = e
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
      // console.log('d')
      const data = await cancelAllOrdersOnekey({})
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
      }
    },
    // 点击表格中的下架按钮触发的事件
    updateADUnshelve (val) {
      console.log(val)
      this.$confirm('此操作将永久下架该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '下架成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消下架'
        })
      })
    },
    // 点击修改按钮钮触发的事件
    modifyAD (val) {
      console.log(val)
      this.$confirm('此操作将永久修改该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    }
    // findFilter () {
    //   console.log(this.activitedADManageTraderStyleList)
    //   console.log(this.activitedADManageMarketList)
    //   console.log(this.activitedADManageStatusList)
    // }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCADManage.scss);

  .otc-AD-manage-box {
    background-color: #1D2331;
    > .otc-AD-manage-content {
      width: 1150px;
      // height: 1000px;
      margin: 70px auto;
      // background-color: #2B2B2B;
      padding-top: 50px;
      > .AD-title {
        height: 30px;
        line-height: 30px;
        color: #338FF5;
        border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      > .AD-manage-main {
        > .manage-main-top {
          height: 60px;
          line-height: 60px;
          margin-bottom: 25px;
          > .filtrate-text {
            color: #9DA5B3;
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
            color: #338FF5;
            > .unshelve-text {
            }
          }
        }
        > .manage-main-bottom {
          // height: 500px;
          /*background-color:#eee;*/
          .red {
            color: #D45858;
          }
          .green {
            color: #008069;
          }
        }
      }
    }
  }
</style>
