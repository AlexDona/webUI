<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--表头-->
      <template>
        <el-tabs
          v-model="activeName">
          <el-tab-pane
            :label="outItem.label"
            :name="outItem.name"
            v-for="(outItem,outIndex) in tabList"
            :key="outIndex"
          >
            <div
             class="tab-content"
            >
              <div
              class="tab-item"
              v-for="(item) in filterMarketList"
              v-dragging="{ item: item, list: filterMarketList}"
              :id="'tab-item.'+item.id"
              :key="item.id">
              <div
                class="inner-item-box"
                v-if="(item.content.length&&item.id!==searchAreaId)||(item.id==searchAreaId&&searchKeyWord!=='')"
                :style="'height:'+(50*(item.content.length||1)+102)+'px'"
                :class="{
                  'force-height':!(item.id==searchAreaId||item.id==collectAreaId)&&!itemAreaMoreStatus,
                  'max-height':!itemAreaMoreStatus
                  }"
              >
                <!--侧边栏-->
                <div
                  class="left"
                  @mouseenter="toggleSide(item.id,0)"
                  @mouseleave="toggleSide(item.id,1)"
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
                      v-show="toggleSideList[item.id]"
                    >
                      <div class="top">
                        <span>{{item.area}}</span>
                        <span v-show="item.id!==collectAreaId&&item.id!==searchAreaId">交易区</span>
                      </div>
                      <div class="bottom">
                        <el-button
                          type="default"
                          class="more-btn"
                          @click="itemViewMore(item.id,item.content)"
                        >
                          {{itemViewMoreBtnText}}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
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
                      v-show="!toggleSideList[item.id]"
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
                            <router-link
                              to="/"
                              v-if="innerItem.hot"
                            >
                              <span class="left font-size16">
                                <span>
                                  {{innerItem.sellsymbol}} / {{item.area}}
                                </span>
                              </span>
                              <span class="right">
                                <span
                                  class="top font-size14"
                                  :class="{up:innerItem.rose>0,down:innerItem.rose<0}"
                                >
                                  {{innerItem.price}}
                                </span>
                                <!--货币兑换-->
                                <span class="bottom font-size12">
                                  ≈
                                  <span></span>
                                  0.25
                                </span>
                              </span>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                      <div class="more-btn">
                        <el-button
                          type="default"
                          class="more-btn"
                          @click="itemViewMore(item.id,item.content)"
                        >
                          {{itemViewMoreBtnText}}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                      </div>
                    </div>
                  </transition>
                </div>
                <!--表格内容-->
                <div
                  class="right"
                  :style="'height:'+(50*(item.content.length||1)+108)+'px'"
                >
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
                          <span class="symbol">{{scope.row.sellsymbol}}</span>
                              <span
                                class="area"
                                v-show="language!=='zh_CN'"
                              >/{{scope.row.area}}</span>
                            </div>
                            <div
                              class="bottom sellname"
                              style="height:20px;line-height: 20px"
                              v-show="language=='zh_CN'"
                            >
                              {{scope.row.sellname}}
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="最新价格(BTCC)"
                      width="160px"
                      sortable
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
                          <!--货币转换-->
                          <div class="bottom"
                               style="height:15px;line-height: 15px">
                            ≈ 0.25
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="high"
                      label="最高价(BTCC)"
                      width="145px"
                      sortable
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
                      width="145px"
                      sortable
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
                      sortable
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
                      sortable
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
                        <EchartsLineCommon
                          :id="scope.row.id + Math.random()"
                          :data="scope.row.tendency"/>
                      </template>
                    </el-table-column>
                    <!--收藏-->
                    <el-table-column
                      prop="collect"
                      label=" "
                      width="36px"
                    >
                      <template slot-scope="scope">
                        <!--非自选区-->
                        <div
                          class="collect-box"
                          v-show="item.id!==collectAreaId"
                        >
                          <i
                            class="el-icon-star-on collected collect font-size16 cursor-pointer"
                            @click="toggleCollect(scope.row.id,0,scope.row)"
                            v-show="collectStatusList[scope.row.id]"
                          ></i>
                          <i
                            class="el-icon-star-off collect font-size16 cursor-pointer"
                            @click="toggleCollect(scope.row.id,1,scope.row)"
                            v-show="!collectStatusList[scope.row.id]"
                          ></i>
                        </div>
                        <!--自选区-->
                        <div
                          class="collect-box"
                          v-show="item.id==collectAreaId"
                        >
                          <i
                            class="el-icon-star-on collected collect font-size16 cursor-pointer"
                            @click="toggleCollect(scope.row.id,0,scope.row)"
                          ></i>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
              <div class="more-box">
                <IconFontCommon
                  v-show="!tabContentMoreStatus"
                  iconName="icon-iconmore"
                />
                <IconFontCommon
                  v-show="tabContentMoreStatus"
                  iconName="icon-iconfewer"
                />
                <br>
                <!--查看更多交易区-->
                <el-button
                  round
                  @click="toggleTabContentHeightStatus"
                >{{moreBtnText}}</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!--搜索框-->
      <div class="search-box">
        <el-input
          v-model="searchKeyWord"
          placeholder="请输入内容"
          @keyup.native="searchFromMarketList"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import Footer from './NoticeHome'
import EchartsLineCommon from '../Common/EchartsLineCommon'
import IconFontCommon from '../Common/IconFontCommon'
// 文件拖动
import VueDND from 'awe-dnd'
import {mapState, mapMutations} from 'vuex'
import {getStore, setStore} from '../../utils'
import {Io} from '../../utils/tradingview/socket'
Vue.use(VueDND)
export default{
  components: {
    IconFontCommon,
    Footer,
    EchartsLineCommon
  },
  data () {
    return {
      // tab 栏列表
      tabList: [],
      // 单个交易区查看全部状态
      itemAreaMoreStatus: false,
      // 当前选中查看更多的交易区id
      activeAreaId: '',
      // 搜索关键字
      searchKeyWord: '',
      // 搜索列表
      searchList: [],
      // 搜索区 id
      searchAreaId: 100,
      // 查看更多按钮文字
      moreBtnText: '查看更多交易区',
      itemViewMoreBtnText: '查看更多',
      // tab-content查看更多状态, 默认为false
      tabContentMoreStatus: false,
      // 自选区 id
      collectAreaId: 99,
      // 自选区状态列表
      collectStatusList: [],
      // 自选区列表
      collectList: [],
      // 当前选中tab
      activeName: '',
      // 侧边栏节流阀
      flag: true,
      // 全部行情数据
      marketList: [],
      // 前两项行情数据
      filterMarketList: [],
      // 切换正反面显示列表
      toggleSideList: []
    }
  },
  created () {
    require('../../../static/css/list/Home/MarketListHome.css')
    require('../../../static/css/theme/day/Home/MarketListHomeDay.css')
    require('../../../static/css/theme/night/Home/MarketListHomeNight.css')
    // 初始化socket
    Io.subscribeKline({
      'type': 0 // 请求类型
    }, (data) => {
      console.log(data)
      this.marketList = data.data
      this.marketList.unshift(
        {
          area: '搜索区',
          id: this.searchAreaId,
          content: []
        },
        {
          area: '自选区', // 交易区名称
          id: this.collectAreaId,
          content: []
        }
      )
      this.getFilterMarketList(this.marketList)
      if (this.collectList.length) {
        this.setMarketList(this.collectAreaId, this.collectList)
      }
      this.initSideBar(true)
    })
    // 获取tab个数
    this.tabList = [
      {
        id: 0,
        name: 'first',
        label: '全部'
      },
      {
        id: 1,
        name: 'second',
        label: '主交易区'
      },
      {
        id: 2,
        name: 'third',
        label: '创新区'
      }
    ]
    this.activeName = this.tabList[0].name
    console.log(this.marketList)
    // 获取本地搜藏列表
    this.collectList = JSON.parse(getStore('collectList')) || []
    this.collectList.forEach((item) => {
      this.collectStatusList[item.id] = true
    })
    // 请求行情数据
    // this.marketList = [
    //   {
    //     area: '搜索区',
    //     id: this.searchAreaId,
    //     content: []
    //   },
    //   {
    //     area: '自选区', // 交易区名称
    //     id: this.collectAreaId,
    //     content: []
    //   },
    //   {
    //     area: 'BTC', // 交易区名称
    //     id: 0,
    //     content: [
    //       {
    //         id: 0, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富链', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761239, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 1, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'AiFC', // 币种简称
    //         sellname: 'Aifc', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.20761232, // 最新价格
    //         high: 0.21721232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21461232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 2, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'TKC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: true // 是否为最热交易对
    //       },
    //       {
    //         id: 3, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'LTC', // 币种简称
    //         sellname: '莱特币', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21711292, // 最新价格
    //         high: 0.21761239, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 4, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'ETH', // 币种简称
    //         sellname: '以太坊', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
    //         hot: true // 是否为最热交易对
    //       },
    //       {
    //         id: 5, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'EOS', // 币种简称
    //         sellname: 'EOS', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 6, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'SWFTC', // 币种简称
    //         sellname: 'SWFTC', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 7, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'TOPC', // 币种简称
    //         sellname: 'TOPC', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 1.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 8, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'OMG', // 币种简称
    //         sellname: 'OMG', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 9, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'IOST', // 币种简称
    //         sellname: 'IOST', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 10, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'BTM', // 币种简称
    //         sellname: 'BTM', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 11, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'BTM', // 币种简称
    //         sellname: 'BTM', // 币种全程
    //         area: 'BTC', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   },
    //   {
    //     area: 'ETH', // 交易区名称
    //     id: 1,
    //     content: [
    //       {
    //         id: 22, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: true // 是否为最热交易对
    //       },
    //       {
    //         id: 23, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 24, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 25, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 26, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 27, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 28, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'ETH', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   },
    //   {
    //     area: 'USDT', // 交易区名称
    //     id: 2,
    //     content: [
    //       {
    //         id: 38, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: true // 是否为最热交易对
    //       },
    //       {
    //         id: 39, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 40, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 41, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 42, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 43, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 44, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富比特', // 币种全程
    //         area: 'USDT', // 交易区
    //         price: 0.21761232, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [1.23, 1.24, 2.35, 2.1, 1.59, 6.89],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   }
    // ]
    console.log(this.toggleSideList)
  },
  mounted () {
    // 搜索区、自选区禁止拖拽
    window.ondragstart = (e) => {
      const id = e.target.id.split('.')[1]
      if (id == this.collectAreaId || id == this.searchAreaId) {
        return false
      }
    }
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_COLLECT_LIST'
    ]),
    // 发送

    // 初始化 侧边栏正反面
    initSideBar (status) {
      this.marketList.forEach((item) => {
        this.toggleSideList[item.id] = status
      })
    },
    // market过滤
    getFilterMarketList (list) {
      // 单个查看更多
      if (this.itemAreaMoreStatus) {
        list.forEach((item, index) => {
          if (item.id == this.activeAreaId) {
            this.filterMarketList = list.slice(index, index + 1)
            return false
          }
        })
      } else {
        if (!this.tabContentMoreStatus) {
          this.filterMarketList = list.slice(0, 4)
        } else if (this.tabContentMoreStatus) {
          this.filterMarketList = list
        }
      }
    },
    // 单个交易区查看更多
    itemViewMore (id, content) {
      const length = content.length
      if (length < 10) {
        return false
      }
      this.activeAreaId = id
      this.itemAreaMoreStatus = !this.itemAreaMoreStatus
      this.tabContentMoreStatus = false
      this.toggleViewMoreBtnText()
      this.getFilterMarketList(this.marketList)
    },
    // marketList 赋值
    setMarketList (id, content) {
      this.marketList.forEach((item) => {
        if (item.id == id) {
          item.content = content
          return false
        }
      })
      this.getFilterMarketList(this.marketList)
    },
    // 搜索关键字
    searchFromMarketList () {
      this.searchList = []
      this.setMarketList(this.searchAreaId, [])
      if (this.searchKeyWord.trim() !== '') {
        this.marketList.forEach((item) => {
          let status = item.id !== this.searchAreaId && item.id !== this.collectAreaId
          if (status) {
            item.content.forEach((innerItem) => {
              let result1 = innerItem.sellsymbol.search(this.searchKeyWord.toUpperCase())
              let result2 = innerItem.sellname.search(this.searchKeyWord)
              if (result1 !== -1 || result2 !== -1) {
                console.log(this.searchList)
                this.searchList.push(innerItem)
              }
            })
          }
        })
        this.setMarketList(this.searchAreaId, this.searchList)
      } else {
        this.setMarketList(this.searchAreaId, [])
      }
    },
    // 切换查看更多
    toggleTabContentHeightStatus () {
      this.itemAreaMoreStatus = false
      this.tabContentMoreStatus = !this.tabContentMoreStatus
      this.toggleViewMoreBtnText()
      this.getFilterMarketList(this.marketList)
    },
    // 切换 查看更多按钮文字
    toggleViewMoreBtnText () {
      this.itemViewMoreBtnText = this.itemAreaMoreStatus ? '收起' : '查看更多'
      this.moreBtnText = this.tabContentMoreStatus ? '收起' : '查看更多交易区'
    },
    // 切换收藏
    toggleCollect (id, status, row) {
      console.log(row)
      status = Boolean(status)
      // this.collectStatusList[id] = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      if (status) {
      //  添加收藏
        this.collectList.push(row)
      } else {
      // 取消收藏
        this.collectList.forEach((item, index) => {
          if (item.id == row.id) {
            this.collectList.splice(index, 1)
          }
        })
      }
      setStore('collectList', this.collectList)
      this.CHANGE_COLLECT_LIST(this.collectList)
      this.setMarketList(this.collectAreaId, this.collectList)
      console.log(this.marketList)
    },
    // 切换正反面
    async toggleSide (index, status) {
      if (index == this.searchAreaId || index == this.collectAreaId) {
        return
      }
      if (this.flag) {
        this.flag = false
        this.$set(this.toggleSideList, index, Boolean(status))
        await setTimeout(() => {
          this.flag = true
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
      'theme',
      'plateList', // 板块列表
      'language' // 语言
    ])
    // // 筛选列表
    // filterMarketList () {
    //   // 单个查看更多
    //   if (this.itemAreaMoreStatus) {
    //     this.marketList.forEach((item, index) => {
    //       console.log(item)
    //       if (item.id == this.activeAreaId) {
    //         return this.marketList.slice(index, index + 1)
    //       }
    //     })
    //   } else {
    //     if (!this.tabContentMoreStatus) {
    //       return this.marketList.slice(0, 4)
    //     } else if (this.tabContentMoreStatus) {
    //       return this.marketList
    //     }
    //   }
    // }
  },
  watch: {
    filterMarketList (newest, old) {
      console.log(newest)
      console.log(old)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/index.scss";
  @import "../../../static/css/scss/Home/MarketListHome.scss";
  .market-list-box{
    width:100%;
    overflow: hidden;
    /*表头*/
    .inner-box{
      width:1130px;
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
        &.tab-height{
          /*height:1320px;*/
        }
        /*min-height:1255px;*/
        /*background-color: darkolivegreen;*/
        position: relative;
        /*单个交易区*/
        >.tab-item{
          >.inner-item-box{
           margin-bottom:20px;
           display:flex;
            /*transition: all 1s;*/
            &.max-height {
              max-height:560px;
            }
            &.force-height{
              height:560px !important;
            }
            overflow: hidden;
           /*侧边栏*/
           >.left{
             width:210px;
             /*min-height:560px;*/
             /*background-color: #f40;*/
             position: relative;
             text-align: center;
             &:before{
               content:'';
               position: absolute;
               top:1px;
               right:-26px;
               width:0px;
               border: 13px solid transparent;
               border-left-color: #526e90;
               height:0px;
             }
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
               position: relative;
               top:-30px;
               >.bottom{
                 position: absolute;
                 left:50%;
                 transform: translateX(-50%);
                 bottom:20px;
               }
             }
             /*反面*/
             >.reverse-side{
               background:linear-gradient(#2F398C,#3D4E8D);
               position: relative;
               top:-30px;
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
                             color:$upColor;
                           }
                           &.down{
                             color:$downColor;
                           }
                         }
                         text-align: left;
                         padding-top:10px;
                         .collect-box{
                           text-align: center;
                         }
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
               >.more-btn{
                 position: absolute;
                 left:50%;
                 transform: translateX(-50%);
                 bottom:20px;
               }
             }
           }
           /*主要内容*/
           >.right{
             margin:13px 0 0 0;
             /*height:547px;*/
             width:986px;
             background-color: transparent;
             overflow: hidden;

           }
         }
        }
        >.more-box{
          text-align: center;
          >.icon{
            color:#273C69;
            margin-bottom:20px;
          }
          >.el-button{
            background-color: #305794;
            border:none;
            color:#fff;
            font-size: 16px;
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
