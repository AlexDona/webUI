<template>
  <div class="otc-merchants-orders-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 商家订单 -->
    <div class="otc-merchants-orders-content">
      <!-- 2.1 大标题商家订单 -->
      <div class="merchants-title font-size20 padding-l15 font-weight700">
        商家订单
      </div>
      <!-- 2.2 商家订单主体内容 -->
      <div class="merchants-orders-main">
        <!-- 上部分筛选条件 -->
        <div class="orders-main-top">
          <span class="filtrate-text font-size14">交易类型</span>
          <span class="style-input">
            <el-select
              v-model="activitedMerchantsOrdersTraderStyleList"
              @change="changeMerchantsOrdersTraderStyleList"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in merchantsOrdersTraderStyleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">币种</span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersCoin"
              @change="changeMerchantsOrdersCoin"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in merchantsOrdersCoinList"
                :key="index"
                :label="item.name"
                :value="item.coinId"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">货币</span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersCurrency"
              @change="changeMerchantsOrdersCurrency"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="(item,index) in merchantsOrdersCurrencyList"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">状态</span>
          <span class="status-input">
            <el-select
              v-model="activitedMerchantsOrdersStatusList"
              @change="changeMerchantsOrdersStatusList"
              clearable
              placeholder="全部"
            >
              <el-option
                v-for="item in merchantsOrdersStatusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </span>
          <span class="filtrate-text font-size14">日期</span>
          <span class="date-picker">
            <!--开始日期-->
            <el-date-picker
              placeholder="选择日期"
              v-model="value1"
              type="date"
              value-format="yyyy-MM-dd"
              @change="startDate"
              clearable
            >
            </el-date-picker>
            <span class="date-short-line">-</span>
            <!--结束日期-->
            <el-date-picker
              placeholder="选择日期"
              v-model="value2"
              value-format="yyyy-MM-dd"
              type="date"
              @change="endDate"
              clearable
            >
            </el-date-picker>
          </span>
          <span class="inquire-button">
            <el-button type="primary" @click="findFilter">查询</el-button>
            <el-button type="primary" @click="resetCondition">重置</el-button>
          </span>
        </div>
        <!-- 下部分表格内容 -->
        <div class="orders-main-bottom">
          <el-table
            :data = "merchantsOrdersList"
            style = "width: 100%"
            empty-text="暂无数据"
          >
            <!-- 交易日期 -->
            <el-table-column
              label = "交易日期"
              width="95"
            >
              <template slot-scope = "scope">
                <div>{{timeFormatting(scope.row.createTime)}}</div>
              </template>
            </el-table-column>
            <!-- 订单号 -->
            <el-table-column
              label = "订单号"
              width="130"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.orderSequence}}</div>
              </template>
            </el-table-column>
            <!-- 币种 -->
            <el-table-column
              label = "币种"
              width="85"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.coinName}}</div>
              </template>
            </el-table-column>
            <!-- 交易类型 -->
            <el-table-column
              label = "交易类型"
              width="80"
            >
              <template slot-scope = "scope">
                <div
                  v-if="scope.row.orderType === 'BUY'"
                  :class="{red:scope.row.orderType === 'BUY'}"
                >
                  购买
                </div>
                <div
                  v-if="scope.row.orderType === 'SELL'"
                  :class="{green:scope.row.orderType === 'SELL'}"
                >
                  出售
                </div>
              </template>
            </el-table-column>
            <!-- 订单状态 -->
            <!-- 状态 (未付款 PICKED 已付款 PAYED 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN) -->
            <el-table-column
              label = "订单状态"
              width="100"
            >
              <template slot-scope = "scope">
                <div v-show="scope.row.status === 'PICKED'">未付款</div>
                <div v-show="scope.row.status === 'PAYED'">已付款</div>
                <div v-show="scope.row.status === 'COMPLETED'">已完成</div>
                <div v-show="scope.row.status === 'CANCELED'">已取消</div>
                <div v-show="scope.row.status === 'FROZEN'">冻结中</div>
                <!-- <div>{{scope.row.status}}</div> -->
              </template>
            </el-table-column>
            <!-- 货币 -->
            <el-table-column
              label = "货币"
              width="85"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.currencyName}}</div>
              </template>
            </el-table-column>
            <!-- 支付方式 -->
            <el-table-column
              label = "支付方式"
            >
              <template slot-scope = "scope">
                <!-- <div>{{scope.row.payStyle}}</div> -->
                <div>
                  <!-- 支付宝 -->
                  <IconFontCommon
                    class="font-size16"
                    iconName="icon-zhifubao1"
                    v-if="scope.row.payType === 'alipay'"
                  />
                  <!-- 微信 -->
                  <IconFontCommon
                    class="font-size16"
                    iconName="icon-weixin1"
                    v-if="scope.row.payType === 'weixin'"
                  />
                  <!-- 银行卡 -->
                  <IconFontCommon
                    class="font-size16"
                    iconName="icon-yinhangqia"
                    v-if="scope.row.payType === 'bank'"
                  />
                  <!-- 4西联汇款 -->
                  <span v-if="scope.row.payType === 'xilian'">
                    <img src="../../assets/user/xilian.png" alt="" class="xilian">
                  </span>
                  <!--  5PAYPAL -->
                  <IconFontCommon
                    class="font-size16"
                    iconName="icon-paypal"
                    v-if="scope.row.payType === 'paypal'"
                  />
                </div>
              </template>
            </el-table-column>
            <!-- 成交价 -->
            <el-table-column
              label = "成交价"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.price}}</div>
              </template>
            </el-table-column>
            <!-- 成交量 -->
            <el-table-column
              label = "成交量"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.pickCount}}</div>
              </template>
            </el-table-column>
            <!-- 总金额 -->
            <el-table-column
              label = "总金额"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.payAmount}}</div>
              </template>
            </el-table-column>
            <!-- 对方姓名 -->
            <el-table-column
              label = "对方姓名"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.otherName}}</div>
              </template>
            </el-table-column>
            <!-- 申诉记录 -->
            <el-table-column
              label = "申诉记录"
              width="80"
            >
              <template slot-scope = "scope">
                <div>{{scope.row.appeal == 'YES'? '卖方申诉' : '无'}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="merchantsOrdersList.length"
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
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender, getOTCMerchantsOrdersList} from '../../utils/api/OTC'
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
      pageSize: 10,
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      // 1.0 商家订单筛选下拉框数组--交易类型
      activitedMerchantsOrdersTraderStyleList: '', // 选中的筛选项
      merchantsOrdersTraderStyleList: [
        {
          value: 'BUY',
          label: '购买'
        },
        {
          value: 'SELL',
          label: '出售'
        }
      ],
      // 商家订单筛选下拉框 币种
      activitedMerchantsOrdersCoin: '',
      merchantsOrdersCoinList: [],
      // 商家订单筛选下拉框 法币
      activitedMerchantsOrdersCurrency: '',
      merchantsOrdersCurrencyList: [],
      // 2.0 商家订单筛选下拉框数组--状态
      activitedMerchantsOrdersStatusList: '', // 选中的筛选项
      merchantsOrdersStatusList: [
        {
          value: 'PAYED',
          label: '已付款'
        },
        {
          value: 'PICKED',
          label: '未付款'
        },
        {
          value: 'COMPLETED ',
          label: '已完成'
        },
        {
          value: 'CANCELED',
          label: '已取消'
        },
        {
          value: 'FROZEN',
          label: '已冻结'
        }
      ],
      value1: '', // 默认开始时间
      value2: '', // 默认结束时间
      // 商家订单列表
      merchantsOrdersList: []
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCMerchantsOrders.css')
    require('../../../static/css/theme/day/OTC/OTCMerchantsOrdersDay.css')
    require('../../../static/css/theme/night/OTC/OTCMerchantsOrdersNight.css')
    // 加载列表
    this.getOTCEntrustingOrdersRevocation()
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailablelegalTenderList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      this.getOTCEntrustingOrdersRevocation()
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'date')
    },
    // 页面加载时 可用币种查询
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
        this.merchantsOrdersCoinList = data.data.data
      }
    },
    // 页面加载时 可用法币查询
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
        this.merchantsOrdersCurrencyList = data.data.data
      }
    },
    // 选中交易 类型 赋值
    changeMerchantsOrdersTraderStyleList (e) {
      this.activitedMerchantsOrdersTraderStyleList = e
    },
    // 选中 币种 状态赋值
    changeMerchantsOrdersCoin (e) {
      this.activitedMerchantsOrdersCoin = e
    },
    // 选中 货币 状态赋值
    changeMerchantsOrdersCurrency (e) {
      this.activitedMerchantsOrdersCurrency = e
    },
    // 选中 状态 赋值
    changeMerchantsOrdersStatusList (e) {
      this.activitedMerchantsOrdersStatusList = e
    },
    // 初始 日期赋值
    startDate (e) {
      this.value1 = e
    },
    // 结束 日期赋值
    endDate (e) {
      this.value2 = e
    },
    // 点击查询按钮
    findFilter () {
      this.getOTCEntrustingOrdersRevocation()
    },
    resetCondition () {
      this.activitedMerchantsOrdersTraderStyleList = ''
      this.activitedMerchantsOrdersCoin = ''
      this.activitedMerchantsOrdersCurrency = ''
      this.activitedMerchantsOrdersStatusList = ''
      this.value1 = ''
      this.value2 = ''
      this.getOTCEntrustingOrdersRevocation()
    },
    // 页面加载时请求接口渲染列表
    async getOTCEntrustingOrdersRevocation () {
      let data = await getOTCMerchantsOrdersList({
        // 当前页数
        pageNum: this.currentPage,
        // 每页条数
        pageSize: this.pageSize,
        // 币种
        coinId: this.activitedMerchantsOrdersCoin,
        // 法币
        currencyId: this.activitedMerchantsOrdersCurrency,
        // 状态 状态 (未付款 PICKED 已付款 PAYED 已完成 COMPLETED  已取消  CANCELED 冻结中 FROZEN)
        status: this.activitedMerchantsOrdersStatusList,
        // 开始时间
        startTime: this.value1,
        // 结束时间
        endTime: this.value2,
        // 类型
        tradeType: this.activitedMerchantsOrdersTraderStyleList
      })
      // 提示信息
      console.log('商家订单列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑 重新渲染列表
        this.merchantsOrdersList = data.data.data.list
        // 分页
        this.totalPages = data.data.data.pages - 0
      }
    }
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
  @import url(../../../static/css/scss/OTC/OTCMerchantsOrders.scss);
  .otc-merchants-orders-box{
    background-color: #121824;
    >.otc-merchants-orders-content{
      width: 1150px;
      min-height: 500px;
      margin: 70px auto;
      margin-bottom: 10px;
      padding-top: 50px;
      >.merchants-title{
        height: 30px;
        line-height: 30px;
        color: #338FF5;
        border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      >.merchants-orders-main{
        >.orders-main-top{
          height: 60px;
          line-height: 60px;
          margin-bottom: 25px;
          >.filtrate-text{
            color: #9DA5B3;
            // margin-right: 10px;
          }
          >.style-input{
            // margin-right: 30px;
          }
          >.status-input{
            // margin-right: 30px;
          }
          >.date-picker{
            margin-right: 60px;
            >.date-short-line{
              margin: 0 3px;
            }
          }
          >.inquire-button{
            // margin-right: 100px;
          }
          >.all-clear{
            color: #338FF5;
          }
        }
        >.orders-main-bottom{
          min-height: 440px;
          .red{
            color: #D45858;
          }
          .green{
            color: #008069;
          }
          .xilian{
            vertical-align: middle
          }
        }
        .page{
          text-align: center;
          padding: 10px 0;
        }
      }
    }
  }
</style>
