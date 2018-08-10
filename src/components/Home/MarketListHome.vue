<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--表头-->
      <template>
        <el-tabs v-model="activeName">
          <el-tab-pane label="全部" name="first">
            <div class="tab-content">
              <div
              class="tab-item"
              v-for="(item,index) in marketList"
              v-dragging="{ item: item, list: marketList}"
              :key="index">
              <!--侧边栏-->
              <div
                class="left"
                @mouseenter="toggleSide(index,0)"
                @mouseleave="toggleSide(index,1)"
              >
                <!--正面-->
                <!--<transition enter-active-class="animated fadeIn">-->
                <transition
                  @before-enter="beforeEnter"
                  @enter="enter"
                  @leave="leave"
                >
                  <div
                    class="right-side animate"
                    v-show="toggleSideList[index]"
                  >
                    <div class="top">
                      <span>{{item.area}}</span>
                      <span>交易区</span>
                    </div>
                    <div class="bottom">
                      <Button type="primary"><span class="font-size16">查看更多</span> <Icon type="ios-arrow-down" /></Button>
                    </div>
                  </div>
                </transition>
                <!--反面-->
                <!--<transition enter-active-class="animated fadeIn">-->
                <transition
                  @before-enter="beforeEnterReverse"
                  @enter="enterDownReverse"
                  @leave="leaveReverse"
                >
                  <div
                    class="reverse-side animate"
                    v-show="!toggleSideList[index]"
                  >
                    <div class="top">
                      <span>最热交易对</span>
                    </div>
                    <div class="bottom">
                      <ul class="hot-list">
                        <li
                          class="hot-item"
                          v-for="(innerItem,innerIndex) in item.content"
                          :key="innerIndex"
                        >
                          <router-link to="/" v-if="innerItem.hot">
                              <span class="left font-size16">
                                <span>
                                  {{innerItem.sellsymbol}} / {{item.area}}
                                </span>
                              </span>
                            <span class="right">
                                <span
                                  class="top font-size14"
                                  :class="{up:innerItem.rose>0,down:innerItem.rose<0}"
                                >{{innerItem.price}}</span>
                                <span class="bottom font-size12">≈ 0.25</span>
                              </span>
                          </router-link>
                        </li>
                      </ul>
                      <Button type="primary"><span class="font-size16">查看更多</span> <Icon type="ios-arrow-down" /></Button>
                    </div>
                  </div>
                </transition>
              </div>
              <!--表格内容-->
              <div class="right">
                <el-table
                  :data="item.content"
                >
                <el-table-column
                  label="交易对"
                  width="126px"
                >
                  <template slot-scope="scope">
                    <div style="padding-left:14px;display:flex;width:126px !important;box-sizing: border-box;">
                      <div class="left" style="border-radius: 50%;">
                        <img
                          style="width:22px;vertical-align: middle;
                          display:inline-block;
                          margin:14px 0;"
                          :src="scope.row.image">
                      </div>
                      <div class="right"
                           style="height:30px;margin:10px 4px;"
                      >
                        <div class="top"
                             style="height:15px;line-height: 15px"
                        >
                          <span class="symbol">
                            {{scope.row.sellsymbol}}
                          </span>
                          /
                          <span class="area">
                            {{scope.row.area}}
                          </span>
                        </div>
                        <div class="bottom sellname" style="height:20px;line-height: 20px">
                          {{scope.row.sellname}}
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  label="最新价格(BTCC)"
                  width="160px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        padding-left:10px;
                        width:160px;
                        height:30px;
                        margin:10px auto;
                      ">
                      <div class="top"
                           style="height:15px;line-height: 15px"
                      >
                        <span
                          v-show="scope.row.rose>0"
                          style="color:#D45858;"
                        >
                          {{scope.row.price}}
                        </span>
                        <span
                          v-show="scope.row.rose<0"
                          style="color:#008069;"
                        >
                          {{scope.row.price}}
                        </span>
                      </div>
                      <div class="bottom"
                           style="height:15px;line-height: 15px">≈ 0.25</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="high"
                  label="最高价(BTCC)"
                  width="140px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        padding-left:10px;
                        height:30px;
                        width:140px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      {{scope.row.high}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="low"
                  label="最低价(BTCC)"
                  width="140px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        width:140px;
                        height:30px;
                        padding-left:12px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      {{scope.row.low}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="volume"
                  label="24H交易量"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        width: 120px;
                        padding-left:10px;
                        height:30px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      {{scope.row.volume}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="rose"
                  label="涨跌"
                  width="80px"
                >
                  <template slot-scope="scope">
                    <div
                      style="
                        width:74px;
                        padding-left:8px;
                        height:30px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      <span v-show="scope.row.rose>0" style="color:#D45858;">{{scope.row.rose}}</span>
                      <span v-show="scope.row.rose<0" style="color:#008069;">{{scope.row.rose}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="tendency"
                  label="价格趋势(3日)"
                  width="120px"
                >
                  <template slot-scope="scope">
                    <EchartsLineCommon :id="scope.row.id" :data="scope.row.tendency"/>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="collect"
                  label=" "
                  width="36px"
                >
                  <template slot-scope="scope">
                    <el-button icon="el-icon-star-on"></el-button>
                  </template>
                </el-table-column>
                </el-table>

              </div>
            </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="主交易区" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="创新区" name="third">角色管理</el-tab-pane>
        </el-tabs>
      </template>
      <!--搜索框-->
      <div class="search-box">
        <el-input v-model="value" placeholder="请输入内容">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
// 文件拖动
import VueDND from 'awe-dnd'
import {mapState, mapMutations} from 'vuex'
import Footer from './NoticeHome'
import EchartsLineCommon from '../Common/EchartsLineCommon'
Vue.use(VueDND)
export default{
  components: {
    Footer,
    EchartsLineCommon
  },
  data () {
    return {
      // 当前选中tab
      activeName: 'first',
      // 侧边栏节流阀
      flag: true,
      // 行情数据
      marketList: [],
      // 切换正反面显示列表
      toggleSideList: [],
      // 收藏列表
      collectList: [],
      // 表格表头
      columns: [
        {
          title: '交易对',
          key: 'symbol',
          // width: '126',
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        padding-left:14px;
                        display:flex;
                        width:126px !important;
                        box-sizing: border-box;
                      ">
                    <div class="left"
                      style="
                        /*margin-right:4px;*/
                        border-radius: 50%;
                      "
                    >
                      <img
                       style="
                        width:22px;
                        vertical-align: middle;
                        display:inline-block;
                        margin:14px 0;
                        "
                       src="${params.row.image}">
                    </div>
                    <div class="right"
                      style="height:30px;margin:10px 4px;"
                    >
                      <div class="top"
                        style="height:15px;line-height: 15px"
                      ><span class="symbol">${params.row.sellsymbol}</span> / <span class="area">${params.row.area}</span></div>
                      <div class="bottom sellname"
                       style="height:20px;line-height: 20px">${params.row.sellname}</div>
                    </div>
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '最新价格(BTCC)',
          key: 'price',
          // width: '160px',
          sortable: true,
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        padding-left:10px;
                        width:160px;
                        height:30px;
                        margin:10px auto;
                      ">
                      <div class="top"
                        style="height:15px;line-height: 15px"
                      >
                      <span v-show="${params.row.rose}>0" style="color:#D45858;">${params.row.price}</span>
                      <span v-show="${params.row.rose}<0" style="color:#008069;">${params.row.price}</span>
</div>
                      <div class="bottom"
                       style="height:15px;line-height: 15px">≈ 0.25</div>
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '最高价(BTCC)',
          key: 'high',
          // width: '140px',
          sortable: true,
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        padding-left:10px;
                        height:30px;
                        width:140px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      ${params.row.high}
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '最低价(BTCC)',
          key: 'low',
          // width: '140px',
          sortable: true,
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        width:140px;
                        height:30px;
                        padding-left:12px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      ${params.row.low}
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '24H交易量',
          key: 'volume',
          // width: '120px',
          sortable: true,
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        width: 120px;
                        padding-left:10px;
                        height:30px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      ${params.row.volume}
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '涨跌',
          key: 'rose',
          // width: '74px',
          sortable: true,
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        width:74px;
                        padding-left:8px;
                        height:30px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      <span v-show="${params.row.rose}>0" style="color:#D45858;">${params.row.rose}</span>
                      <span v-show="${params.row.rose}<0" style="color:#008069;">${params.row.rose}</span>
                   </div>`
              }
            }
            return h(func())
          }
        },
        {
          title: '价格趋势(3日)',
          key: '',
          // width: '120px',
          render: (h, params) => {
            // console.log(params)
            return h(EchartsLineCommon, {
              style: {
                boxSizing: 'border-box',
                width: '120px'
              },
              props: {
                'id': params.row.sellsymbol + params.index + params.row.area,
                'options': {
                  // backgroundColor: 'transparent',
                  xAxis: {
                    type: 'category',
                    boundaryGap: ['1%'],
                    show: false,
                    data: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35, 1.23]
                  },
                  yAxis: {
                    type: 'value',
                    boundaryGap: ['30%', '70%'],
                    show: false
                  },
                  series: [
                    {
                      type: 'line',
                      smooth: 0.3,
                      color: ['#338ff5'],
                      data: params.row.tendency,
                      symbolSize: 0
                    }
                  ]
                },
                'style': {
                  // width: '106px'
                }
              }
            //   domProps: {
            //     options: this.options
            //   }
            })
          }
        },
        {
          title: ' ',
          key: 'collect',
          methods: {
            toggleClick () {
              console.log(1)
            }
          },
          render: function (h, params) {
            let func = function () {
              return {
                template:
                  `<div
                      style="
                        width:74px;
                        padding-left:8px;
                        height:30px;
                        line-height: 30px;
                        margin:10px auto;
                      ">
                      <Icon type="md-star" v-on="listeners"/>
                   </div>`
              }
            }
            return h(func())
          }
          // width: '36px',
          // render: (h, params) => {
          //   if (this.collectList[params.row.id]) {
          //     return h('Icon', {
          //       style: {
          //         fontSize: '20px',
          //         paddingLeft: '14px',
          //         cursor: 'pointer',
          //         color: '#f5c34a'
          //       },
          //       class: {
          //         active: true
          //       },
          //       props: {
          //         type: 'md-star-outline'
          //         // type: 'md-star'
          //       },
          //       on: {
          //         click: () => {
          //           // console.log(self)
          //           console.log(params.row.id)
          //           if (this.collectList[params.row.id]) {
          //             this.collectList[params.row.id] = false
          //           } else {
          //             this.collectList[params.row.id] = true
          //           }
          //           console.log(this.collectList[params.row.id])
          //         }
          //       }
          //     })
          //   }
          // }
        }
      ]
    }
  },
  created () {
    require('../../../static/css/list/Home/MarketListHome.css')
    require('../../../static/css/theme/day/Home/MarketListHomeDay.css')
    require('../../../static/css/theme/night/Home/MarketListHomeNight.css')

    // 请求行情数据
    this.marketList = [
      {
        area: 'BTC', // 交易区名称
        id: 0,
        content: [
          {
            id: 0, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
            hot: false // 是否为最热交易对
          },
          {
            id: 1, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FBT', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59],
            hot: false // 是否为最热交易对
          },
          {
            id: 2, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'TKC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: true // 是否为最热交易对
          },
          {
            id: 3, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 4, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
            hot: true // 是否为最热交易对
          },
          {
            id: 5, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 6, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 7, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 8, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 9, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          }
        ]
      },
      {
        area: 'ETH', // 交易区名称
        id: 1,
        content: [
          {
            id: 10, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: true // 是否为最热交易对
          },
          {
            id: 11, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 12, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 13, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 14, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 15, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          },
          {
            id: 16, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            area: 'ETH', // 交易区
            price: 0.21761232, // 最新价格
            high: 0.21761232, // 最高价
            low: 0.21761232, // 最低价
            volume: 21761232, // 24小时成交量
            rose: 0.16123, // 涨跌
            tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
            hot: false // 是否为最热交易对
          }
        ]
      }
    ]
    this.marketList.forEach(() => {
      this.toggleSideList.push(true)
      // this.toggleSideList.push(false)
    })
    console.log(this.toggleSideList)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    // 切换正反面
    async toggleSide (index, status) {
      if (this.flag) {
        this.flag = false
        this.$set(this.toggleSideList, index, Boolean(status))
        await setTimeout(() => {
          this.flag = true
          console.log(this.flag)
        }, 500)
      }
    },
    // 正面动画
    beforeEnter (el) {
      el.style = 'opacity:0'
      // el.style = 'transform: rotateY(90deg);'
    },
    enter (el, done) {
      el.offsetWidth
      // el.style.paddingTop = '5px'
      el.style.opacity = 1
      // el.style = 'transform: rotateY(0deg);'
      done()
    },
    leave (el, done) {
      el.offsetWidth
      el.style.opacity = 0
      // el.style = 'transform: rotateY(90deg);'
      done()
    },
    // 反面动画
    beforeEnterReverse (el) {
      el.style = 'opacity:0'
      // el.style = 'transform: rotateY(90deg);'
    },
    enterDownReverse (el, done) {
      el.offsetWidth
      // el.style.paddingTop = '5px'
      el.style.opacity = 1
      // el.style = 'transform: rotateY(0deg);'
      done()
    },
    leaveReverse (el, done) {
      el.offsetWidth
      el.style.opacity = 0
      // el.style = 'transform: rotateY(90deg);'
      done()
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Home/MarketListHome.scss";
  .market-list-box{
    min-height:1440px;
    width:100%;
    overflow: hidden;
    /*表头*/
    .inner-box{
      width:1150px;
      margin: 78px auto;
      position: relative;
      >.search-box{
        position: absolute;
        top:8px;
        right:0;
        width:250px;
        height:30px;
        overflow: hidden;
        border:1px solid $mainColor;
      }
      &:before{
        content:'';
        width:70px;
        height:30px;
        background-color: $mainColor;
        position: absolute;
        right:0;
        top:9px;
        /*z-index: 1;*/
      }
      &:after{
        content:'';
        width:0px;
        height:0px;
        position: absolute;
        right:69px;
        top:14px;
        z-index: 1;
        border:10px solid transparent;
        border-right:10px solid $mainColor;
      }
      /*列表主要内容*/
      .tab-content{
        min-height:1255px;
        /*background-color: darkolivegreen;*/
        /*单个交易区*/
        >.tab-item{
          display:flex;
          margin-bottom:50px;
          /*侧边栏*/
         >.left{
           width:210px;
           min-height:560px;
           /*background-color: #f40;*/
           position: relative;
           text-align: center;
           >div{
             position: absolute;
             top:0;
             left:0;
             height:100%;
             width:100%;
           }
           >.right-side,>.reverse-side{
             &.animate {
               transition-property: all;
               transition-duration: 2s;
               /*transition-timing-function: linear;*/
               transition-timing-function: ease-in-out;
             }
             >.top{
               margin-top:30px;
               font-size: 30px;
               color:#fff;
               padding:20px 0;
               background: url(../../assets/develop/market-list-border.png) no-repeat center bottom;
             }
           }
           /*正面*/
           >.right-side{
             background:linear-gradient(#1D3862,#305FA7);
             >.bottom{
               margin-top:360px;
             }
           }

           /*反面*/
           >.reverse-side{
             background:linear-gradient(#2F398C,#3D4E8D);
             >.bottom{
               margin-top:30px;
               >.hot-list{
                 min-height:330px;
                 box-sizing: border-box;
                 >.hot-item{
                   box-sizing: border-box;
                   >a{
                     color:#fff;
                     height:60px;
                     display: inline-block;
                     width:100%;
                     >.left,>.right{
                       width:48%;
                       height:60px;
                       display: inline-block;
                       vertical-align: middle;
                     }
                     >.left{
                       line-height: 60px;
                     }
                     >.right{
                       >.top{
                         &.up{
                           color:#D45858;
                         }
                         &.down{
                           color:#008069;
                         }
                       }
                       text-align: left;
                       padding-top:10px;
                       >.top,>.bottom{
                         line-height: 20px;
                         display: inline-block;
                         height:20px;
                         width:100%;
                       }
                     }
                   }
                 }
               }
             }
           }
         }
          /*主要内容*/
          >.right{
            margin:13px 0 0 0;
            /*height:547px;*/
            width:940px;
            background-color: transparent;
            overflow: hidden;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.search-box{

      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }
</style>
