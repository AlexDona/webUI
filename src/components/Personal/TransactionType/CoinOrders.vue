<template>
  <div
    class="coin-orders personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-height background-color line-height70 font-size16">
      <span class="padding-left15">币币订单</span>
    </header>
    <div class="min-height500 background-color margin-top5">
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="当前委托"
          name="first"
        >
          <div class="inner-box">
            <!--查询条件-->
            <div class="search-condition-box">
              <div class="symbol-box condition-item">
                <span class="currency-span">交易对</span>
                <!--币种-->
                <input
                  type="text"
                  placeholder="币种名称"
                  class="currency-input"
                />
                <span class="currency-span">/</span>
                <!--交易区下拉-->
                <el-select
                  v-model="value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <!--类型-->
              <div class="trade-type-box condition-item">
                <span class="currency-span">类型</span>
                <el-select
                  v-model="value"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <!--起止时间-->
              <div class="start-end-time-box condition-item">
                <span>起止时间</span>
                <el-date-picker
                  v-model="startTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <span class="middle-line"> - </span>
                <el-date-picker
                  v-model="endTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
              <div class="search-box condition-item">
                <button class="search-btn">查询</button>
              </div>
            </div>
            <!--查询结果-->
            <div class="result-box">
              <el-table
                :data="myEntrustList"
              >
                <el-table-column
                  label="时间"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.createTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易对"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="交易类型"
                >
                  <template slot-scope="s">
                    <span v-show="language !== 'zh_CN'">{{s.row.type}}</span>
                    <span v-show="language === 'zh_CN'">{{s.row.typeName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="方向"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="数量"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="委托总额"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.amount }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="已成交"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.completeCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="未成交"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.leftCount }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="状态"
                >
                  <template slot-scope="s">
                    <span>{{ s.row.address }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="操作"
                >
                  <template slot-scope="s">
                    <button
                      class="cursor-pointer"
                    >撤销</button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="历史委托"
          name="second"
        >
          历史委托
        </el-tab-pane>
        <el-tab-pane
          label="成交明细"
          name="third"
        >
          成交明细
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'first',
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
      myEntrustList: [
        {
          'id': '委单ID',
          'partnerId': '商户ID',
          'uid': '用户UID',
          'userId': '用户ID',
          'tradeId': '交易对ID',
          'buyCoinId': '买方币种ID',
          'sellCoinId': '卖方币种ID',
          'status': '状态值',
          'type': '委单类型值',
          'matchType': '戳和类型值',
          'price': '委托价格',
          'count': '委托数量',
          'amount': '委托总价',
          'leftCount': '剩余数量',
          'completeCount': '完成数量',
          'createTime': '创建时间',
          'version': '当前版本号',
          'tradeName': '交易对名称',
          'typeName': '戳和名称',
          'statusName': '状态名称',
          'matchTypeName': '撮合名称'
        }
      ] // 我的委托订单
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/TransactionType/CoinOrders.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/TransactionType/CoinOrdersDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/TransactionType/CoinOrdersNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/TransactionType/CoinOrders";
  .coin-orders{
    .inner-box{
      >.search-condition-box{
        width:100%;
        padding:20px;
        >.condition-item{
          height:34px;
          line-height:34px;
          display:inline-block;
          margin-right:48px;
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
          }
          >.currency-input{
            background-color: pink;
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
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: rgba(37, 46, 63, 1);
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background-color: #CCCCCC;
      }
    }
  }
</style>
