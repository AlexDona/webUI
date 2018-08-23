<template>
  <!--最近成交记录-->
    <div
      class="order-record-box trade"
      :class="{'day':theme == 'day','night':theme == 'night' }"
    >
      <div class="inner-box">
        <div
          class="title font-size16 cursor-pointer"
          @click="toggleShowContent"
        >
        <span class="text">
          最近成交
        </span>
        </div>
        <div class="content">
          <el-collapse-transition>
            <div v-show="contentShowStatus">
              <el-table
                :data="orderRecordList"
              >
                <el-table-column
                  label="时间"
                >
                  <template slot-scope="s">
                  <span class="font-size12">
                    {{timeFilters(s.row.time)}}
                  </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="成交价(BTCC)"
                >
                  <template slot-scope="s">
                    <span
                      class="text-align-r font-size12"
                      :class="{
                        buy:s.row.type=='buy',
                        sell:s.row.type=='sell'}"
                    >
                      {{s.row.price}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="成交量(BTCCC)"
                >
                  <template slot-scope="s">
                      <span class="text-align-r font-size12">
                        {{s.row.volume}}
                      </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </div>
      </div>
    </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {timeFilter} from '../../utils'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      contentShowStatus: true,
      orderRecordList: []
    }
  },
  created () {
    require('../../../static/css/list/Trade/OrderRecord.css')
    this.orderRecordList = [
      {
        id: 0,
        type: 'buy', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 1,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 2,
        type: 'buy', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 3,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 4,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 5,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 6,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 7,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 8,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 9,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 10,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 11,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      },
      {
        id: 12,
        type: 'sell', // 类型
        time: new Date().getTime(), // 时间
        price: 7718.94, // 成交价
        volume: 561.82 // 成交量
      }
    ]
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFilters (date) {
      return timeFilter(date, 'time')
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/Trade/TradeCenter.scss';
  .order-record-box{
    >.inner-box{
      >.title{
        height:34px;
        line-height: 34px;
        font-weight: 700;
        margin-bottom:4px;
        box-shadow:0 2px 6px rgba(0,0,0,.1);
        >.text{
          display:inline-block;
          text-indent: 4px;
          height:100%;
          border-bottom:2px solid $mainColor;
        }
      }
      >.content{
      }
    }
    &.night{
      >.inner-box{
        >.title{
          color:$nightMainTitleColor;
          background-color: $nightMainTitleBgColor;
        }
        >.content{
          background-color: $nightMainContentBgColor;
        }
      }
    }
    &.day{
      >.inner-box{
        >.title{
          color:$dayMainTitleColor;
          background-color: $dayMainBgColor;
        }
        >.content{
          background-color: #fff;
        }
      }
    }
  }
</style>
