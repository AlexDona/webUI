<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color personal-height40 line-height40 font-size16">
      <span class="padding-left15 font-weight600 coin-color">
        币币订单
      </span>
    </header>
    <div class="min-height500 background-color margin-top9">
      <el-tabs
        v-model="activeName"
        @tab-click = "coinMoneyOrders"
      >
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
                :key="item.name"
                :label="item.name"
                :value="item.name"
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
            <span class="currency-span">委单类型</span>
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
              @click.prevent="searchWithCondition(activeName)"
            >
              查询
            </button>
          </div>
        </div>
        <el-tab-pane
          label="当前委托"
          name="current-entrust"
        >
          <div class="inner-box">
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
                      @click.prevent="repealMyEntrust(s.row.id,s.row.version)"
                    >
                      撤销
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
        <!-- 取消委托订单 -->
        <div class="cancel-push">
          <el-dialog
            :title="取消委托订单"
            :visible.sync="cancellationOfOrder"
            center
          >
              <span class="text-align-c">
                确定取消取消委托订单吗？
              </span>
            <span
              slot="footer"
              class="dialog-footer"
            >
             <!--确 定 取 消-->
              <el-button
                type="primary"
                @click.prevent="confirm"
                class="mg1"
                :disabled="statel"
              >
                确 定
              </el-button>
              <el-button
                @click.prevent="cancellationOfOrder = false"
              >
                取 消
              </el-button>
            </span>
          </el-dialog>
        </div>
        <el-tab-pane
          label="历史委托"
          name="history-entrust"
        >
          <el-table
            :data="historyEntrustList"
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
              label="价格"
              width="110"
            >
              <template slot-scope="s">
                <span>{{ s.row.price }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="委托量"
              width="120"
            >
              <template slot-scope="s">
                <span>{{ s.row.count-0}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成交量"
              width="120"
            >
              <template slot-scope="s">
                <span>{{ s.row.completeCount-0}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="成交价"
              width="120"
            >
              <template slot-scope="s">
                <span>{{s.row.completeCount-0}}</span>
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
                  @click.prevent="repealMyEntrust(s.row.id,s.row.version)"
                >删除</button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 取消历史订单 -->
          <div class="cancel-push">
            <el-dialog
              :title="取消历史订单"
              :visible.sync="cancelHistoricalOrder"
              center
            >
              <span class="text-align-c">
                确定取消取消委托订单吗？
              </span>
              <span
                slot="footer"
                class="dialog-footer"
              >
             <!--确 定 取 消-->
              <el-button
                type="primary"
                @click.prevent="confirm"
                class="mg1"
                :disabled="statel"
              >
                确 定
              </el-button>
              <el-button
                @click.prevent="cancelHistoricalOrder = false"
              >
                取 消
              </el-button>
            </span>
            </el-dialog>
          </div>
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
        <el-tab-pane
          label="成交明细"
          name="make-detail"
        >
          <el-table
            :data="currentMakeDetailList"
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
              label="价格"
              width="110"
            >
              <template slot-scope="s">
                <span>{{ s.row.count-0 }}</span>
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
              label="成交额"
              width="120"
            >
              <template slot-scope="s">
                <span>{{ s.row.amount-0}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="手续费"
              width="120"
            >
              <template slot-scope="s">
                <span>{{s.row.fees - 0}}</span>
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
import {timeFilter} from '../../../utils'

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
  created (entrustType) {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/CoinOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/CoinOrdersNight.css')
    this.getEntrustSelectBox()
    this.commissionList('current-entrust')
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
    async searchWithCondition (entrustType) {
      this.commissionList(entrustType)
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
      repealMyEntrustCommon(params, (res) => {
        if (!returnAjaxMessage(res, this, 1)) {
          return false
        } else {
          this.commissionList()
        }
      })
    },
    async commissionList (entrustType) {
      let params = {
        userId: this.userInfo.userId,
        currentPage: '',
        pageSize: this.pageSize,
        buyCoinName: this.activeSymbol,
        matchType: this.activeMatchType,
        type: this.activeType,
        sellCoinName: this.activeExchangeArea,
        startTime: this.startTime === '' ? '' : timeFilter(this.startTime, 'normal'),
        endTime: this.endTime === '' ? '' : timeFilter(this.endTime, 'normal')
      }
      let data
      let data1
      let data2
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
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: #1E2636;
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
