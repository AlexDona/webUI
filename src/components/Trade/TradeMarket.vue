<!--币币交易 行情-->
<template>
  <div
    class="trade-market-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div
        class="title font-size16 cursor-pointer"
      >
        <span
          class="text"
          @click="toggleShowContent"
        >
          <span>市场</span>
        </span>
        <span class="right">
          <el-input
            class="search-box"
            suffix-icon="el-icon-search"
            @keyup.native="filterSearchMarket"
            v-model="searchKeyWord"
          ></el-input>
        </span>
      </div>
      <div class="content">
        <el-collapse-transition>
          <div
            v-show="contentShowStatus"
            class="inner-box"
          >
            <!--tab 切换-->
            <el-tabs
              v-model="activeName"
              @tab-click="changeTab"
            >
              <el-tab-pane
                :label="outItem.name"
                :name="outItem.id"
                v-for="(outItem,outIndex) in tabList"
                :key="outIndex"
              >
                <div class="coin-table font-size12">
                  <!--表格头部-->
                  <dl class="coin-thead">
                    <dt></dt>
                    <dd class="coin-unit">
                      <span
                        class="title coin-type"
                      >
                        交易对
                      </span>
                      <span
                        class="title price cursor-pointer"
                      >
                            <span
                              id="new_price"
                              ref="price"
                              data-text="最新价"
                              @click="sortByUser('price')"
                            >
                              最新价
                            </span>
                            <i class="sort-box">
                              <i
                                class="el-icon-caret-top"
                                ref="priceAscBtn"
                                :class="{active:sortBy=='price-asc'}"
                                @click="sortByUser('price-asc')"
                              ></i>
                              <i
                                class="el-icon-caret-bottom"
                                ref="priceDescBtn"
                                :class="{active:sortBy=='price-desc'}"
                                @click="sortByUser('price-desc')"
                              ></i>
                            </i>
                          </span>
                      <span
                        class="title rose cursor-pointer"
                        @click="sortByUser('rose')"
                      >
                            涨幅
                            <i class="sort-box">
                              <i
                                class="el-icon-caret-top"
                                :class="{active:sortBy=='rose-asc'}"
                                @click="sortByUser('rose-asc')"
                              ></i>
                              <i
                                class="el-icon-caret-bottom"
                                :class="{active:sortBy=='rose-desc'}"
                                @click="sortByUser('rose-desc')"
                              ></i>
                            </i>
                          </span>
                    </dd>
                  </dl>
                  <div class="coin-list">
                    <div
                      class="market-cate-wrap"
                      v-for="(item,index) in searchFilterMarketList"
                      :key="index"
                    >
                      <div
                        class="market-category"
                      >
                        {{item.plateName}}
                      </div>
                    <dl
                      class="coin-item "
                    >
                      <dt></dt>
                      <dd
                        class="coin-item cursor-pointer"
                        v-for="(innerItem,innerIndex) in item.content"
                        :key="innerIndex"
                        @click =changeActiveSymbol(innerItem)
                      >
                        <span>
                          <!--收藏按钮-->
                          <!--自选区-->
                          <span v-show="activeName==tabList[0].id">
                            <i
                              class="el-icon-star-on cursor-pointer collected"
                              @click="toggleCollect(innerItem.id,0,innerItem)"
                            ></i>
                          </span>
                          <!--非自选区-->
                          <span v-show="activeName!=tabList[0].id">
                            <i
                              class="el-icon-star-off cursor-pointer"
                              v-show="!collectStatusList[innerItem.id]"
                              @click="toggleCollect(innerItem.id,1,innerItem)"
                            ></i>
                            <i
                              class="el-icon-star-on cursor-pointer collected"
                              v-show="collectStatusList[innerItem.id]"
                              @click="toggleCollect(innerItem.id,0,innerItem)"
                            ></i>
                          </span>
                          <span class="base-currency">{{innerItem.sellsymbol}}</span>
                          <!--币中文名-->
                          <span
                            class="currency-chn-name"
                            v-show="language === 'zh_CN'"
                          >{{innerItem.sellname}}</span>
                          <span
                            class="area"
                            v-show="language !== 'zh_CN'"
                          >/ {{innerItem.area}}</span>
                        </span>
                        <span
                          class="price text-align-r"
                          :class="{
                            'up':innerItem.rose>0,
                            'down':innerItem.rose<0
                          }"
                        >
                          {{innerItem.price}}
                        </span>
                        <span
                          class="rose text-align-r"
                          :class="{
                            'up':innerItem.rose>0,
                            'down':innerItem.rose<0
                          }"
                        >
                            {{innerItem.rose}}
                          </span>
                      </dd>
                    </dl>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import {getStore, setStore} from '../../utils'
import {getPartnerAreaList} from '../../utils/api/trade'
import {
  returnAjaxMessage,
  getPartnerListAjax
} from '../../utils/commonFunc'
import {socket} from '../../utils/tradingview/socket'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('common')
export default {
  components: {
  },
  // props,
  data () {
    return {
      contentShowStatus: true, // 显示隐藏控制
      tabList: [
        {
          id: 99,
          name: '自选'
        }
      ], // tab栏个数
      activeName: '', // 当前tabItem
      sortBy: '', // 排序依据: price-asc price-desc rose-asc rose-desc
      marketList: [], // 行情数据
      filterMarketList: [], // 过滤行情数据
      // searchFilterMarketList: [], // 搜索过滤
      collectAreaId: '', // 自选区id
      collectList: [], // 收藏列表
      collectStatusList: {}, // 收藏状态
      // BTC 交易区模拟数据
      BTCMarketList: [],
      // ETH 交易区模拟数据
      ETHMarketList: [],
      searchKeyWord: '', // 搜索关键字
      plateList: [], // 板块列表
      socketCount: 0, // socket计数
      nothing: '' // 占位
    }
  },
  created () {
    require('../../../static/css/list/Trade/TradeMarket.css')
    require('../../../static/css/theme/day/Trade/TradeMarketDay.css')
    require('../../../static/css/theme/night/Trade/TradeMarketNight.css')
    // 获取tab个数
    // this.tabList = [
    //   {
    //     id: 0,
    //     name: 'first',
    //     label: '自选'
    //   },
    //   {
    //     id: 1,
    //     name: 'second',
    //     label: 'FBT'
    //   },
    //   {
    //     id: 2,
    //     name: 'third',
    //     label: 'BTC'
    //   },
    //   {
    //     id: 3,
    //     name: 'fourth',
    //     label: 'ETH'
    //   }
    // ]
    // 获取行情数据
    // this.marketList = [
    //   {
    //     plateId: 0, // 交易区id( 0:主区， 1:创新区)
    //     plateName: '主区', // 交易区名称
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
    //     plateId: 1,
    //     plateName: '创新区',
    //     content: [
    //       {
    //         id: 12, // 交易对id
    //         plateId: 1, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'LOCC', // 币种简称
    //         sellname: '创新区币种', // 币种全程
    //         area: 'FBT', // 交易区
    //         price: 0.21761239, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   }
    // ]
    // // BTC 交易区模拟数据
    // this.BTCMarketList = [
    //   {
    //     plateId: 0, // 交易区id( 0:主区， 1:创新区)
    //     plateName: '主区', // 交易区名称
    //     content: [
    //       {
    //         id: 13, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'FUC', // 币种简称
    //         sellname: '富链BTC', // 币种全程
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
    //         id: 14, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'AiFC', // 币种简称
    //         sellname: 'Aifc', // 币种全程
    //         area: 'BTC 富链BTC', // 交易区
    //         price: 0.20761232, // 最新价格
    //         high: 0.21721232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21461232, // 24小时成交量
    //         rose: 0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59],
    //         hot: false // 是否为最热交易对
    //       },
    //       {
    //         id: 15, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'TKC', // 币种简称
    //         sellname: '富比特 富链BTC', // 币种全程
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
    //         id: 16, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'LTC', // 币种简称
    //         sellname: '莱特币 BTC', // 币种全程
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
    //         id: 17, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'ETH', // 币种简称
    //         sellname: '以太坊 BTC', // 币种全程
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
    //         id: 18, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'EOS', // 币种简称
    //         sellname: 'EOS BTC', // 币种全程
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
    //         id: 19, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'SWFTC', // 币种简称
    //         sellname: 'SWFTC BTC', // 币种全程
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
    //         id: 20, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'TOPC', // 币种简称
    //         sellname: 'TOPC BTC', // 币种全程
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
    //         id: 21, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'OMG', // 币种简称
    //         sellname: 'OMG BTC', // 币种全程
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
    //         id: 22, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'IOST', // 币种简称
    //         sellname: 'IOST BTC', // 币种全程
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
    //         id: 23, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'BTM', // 币种简称
    //         sellname: 'BTM BTC', // 币种全程
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
    //         id: 24, // 交易对id
    //         plateId: 0, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'BTM', // 币种简称
    //         sellname: 'BTM BTC', // 币种全程
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
    //     plateId: 1,
    //     plateName: '创新区',
    //     content: [
    //       {
    //         id: 25, // 交易对id
    //         plateId: 1, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'LOCC', // 币种简称
    //         sellname: '创新区币种 BTC', // 币种全程
    //         area: 'FBT', // 交易区
    //         price: 0.21761239, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   }
    // ]
    // this.ETHMarketList = [
    //   {
    //     plateId: 0, // 交易区id( 0:主区， 1:创新区)
    //     plateName: '主区', // 交易区名称
    //     content: [
    //       {
    //         id: 26, // 交易对id
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
    //         id: 27, // 交易对id
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
    //         id: 28, // 交易对id
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
    //         id: 29, // 交易对id
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
    //         id: 30, // 交易对id
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
    //         id: 31, // 交易对id
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
    //         id: 32, // 交易对id
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
    //         id: 33, // 交易对id
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
    //         id: 34, // 交易对id
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
    //         id: 35, // 交易对id
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
    //         id: 36, // 交易对id
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
    //         id: 37, // 交易对id
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
    //     plateId: 1,
    //     plateName: '创新区',
    //     content: [
    //       {
    //         id: 38, // 交易对id
    //         plateId: 1, // 板块id（主区，交易区。。。）
    //         image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
    //         sellsymbol: 'LOCC', // 币种简称
    //         sellname: '创新区币种', // 币种全程
    //         area: 'FBT', // 交易区
    //         price: 0.21761239, // 最新价格
    //         high: 0.21761232, // 最高价
    //         low: 0.21761232, // 最低价
    //         volume: 21761232, // 24小时成交量
    //         rose: -0.16123, // 涨跌
    //         tendency: [2.35, 1.23, 1.89, 1.24, 2.1, 1.59, 0.1, 2.35],
    //         hot: false // 是否为最热交易对
    //       }
    //     ]
    //   }
    // ]
    // fbt交易区模拟数据
    // 获取本地搜藏列表
  },
  mounted () {
    // 获取交易区信息
    this.getTradeAreaList()
    // 获取板块
    this.getPartnerList()
    this.collectList = JSON.parse(getStore('collectList')) || []
    // console.log(this.collectList)
    this.resetCollectList()
    this.filterMarketList = this.marketList
    // this.setFilterMarketList(this.activeName, this.BTCMarketList)
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      // 'CHANGE_COLLECT_LIST'
      'CHANGE_ACTIVE_SYMBOL'
    ]),
    // 设置 当前交易区
    changeActiveSymbol (activeSymbol, previousSymbol) {
      console.log('active----------------->', activeSymbol.id)
      console.log(this.activeTabId)
      // console.log('previous--------------->', this.previousSymbol.id)
      // this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', activeSymbol)
      this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', {
        activeSymbol,
        previousSymbol
      })
    },
    // 获取板块列表
    getPartnerList () {
      getPartnerListAjax(this.partnerId, (data) => {
        if (!returnAjaxMessage(data, this, 0)) {
          return false
        } else {
          this.plateList = data.data.data
          // this.tabList = data.data.data
          // // 全部板块
          // this.tabList.unshift({
          //   i18nName: 'all-plate',
          //   id: '0',
          //   language: 'ZN_CN'
          // })
          // this.activeName = this.tabList[0].id
          // this.resetSocketMarket(this.activeName)
        }
      })
    },
    // 重新订阅请求socket
    resetSocketMarket (areaId) {
      socket.subscribeKline({
        type: 'trade_market', // 请求类型
        areaId
      }, (data) => {
        // console.log(data)
        // 币币交易
        if (data.tradeType == 'BBTICKER') {
          switch (data.type) {
            // 请求socket
            case 0:
              if (data.data) {
                // console.log(data.data[0])
                this.marketList = data.data
                this.collectList = JSON.parse(getStore('collectList')) || []
                this.resetCollectList()
                this.filterMarketList = this.marketList
                this.setFilterMarketList(this.activeName, this.marketList)
              }
              break
            // 订阅socket
            case 1:
              const newData = data.data[0].content[0]
              console.log(newData)
              // 设置当前选中交易对
              if (!this.socketCount) {
                console.log('activeSymbol')
                // this.changeActiveSymbol(newData)
                this.socketCount += 1
              }
              // 非自选区
              if (this.activeName != this.tabList[0].id) {
                this.marketList.forEach((item, index) => {
                  if (item.plateId === data.data[0].plateId) {
                    item.content.forEach((innerItem, innerIndex) => {
                      if (innerItem.id == newData.id) {
                        this.$set(this.marketList[index].content, innerIndex, newData)
                        this.filterMarketList = this.marketList
                        return false
                      }
                    })
                  }
                })
              } else {
                this.filterMarketList.forEach((item, index) => {
                  if (item.plateId == newData.plateId) {
                    item.content.forEach((innerItem, innerIndex) => {
                      if (innerItem.id == newData.id) {
                        this.$set(this.filterMarketList[index].content, innerIndex, newData)
                      }
                    })
                  }
                })
              }
              if (!this.activeSymbol.id) {
                // this.activeSymbol = newData
                console.log('111')
                // this.changeActiveSymbol(newData)
                // this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', newData)
                // this.CHANGE_ACTIVE_SYMBOL(newData)
                // console.log(this.activeSymbol)
              }
              // console.log(newData.id)
              // console.log(this.activeSymbol.id)
              if (newData.id == this.activeSymbol.id) {
                console.log('222')
                // this.changeActiveSymbol(newData)
                // console.log(this.activeSymbol.id)
              }
              // let newData = data.data[0]
              // let newContent = newData.content[0]
              // let collectContent = this.marketList[1].content
              // this.marketList.forEach((item, index) => {
              //   // 非自选区
              //   if (item.id === newData.id) {
              //     item.content.forEach((innerItem, innerIndex) => {
              //       if (innerItem.id === newData.content[0].id) {
              //         this.$set(this.marketList[index].content, innerIndex, newContent)
              //         return false
              //       }
              //     })
              //   }
              //   // 自选区
              //   if (collectContent.length) {
              //     collectContent.forEach((item, index) => {
              //       if (item.id === newContent.id) {
              //         this.$set(collectContent, index, newContent)
              //         this.$set(collectContent[index].tendency, 0, newContent.tendency[0])
              //         this.$set(collectContent[index].tendency, 1, newContent.tendency[1])
              //         // console.log(collectContent)
              //         return false
              //       }
              //     })
              //   }
              //   return false
              // })
              break
          }
        }
      })
    },
    // 获取交易区列表
    async getTradeAreaList () {
      let params = {
        partnerId: this.partnerId
      }
      const data = await getPartnerAreaList(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        const list = this.tabList.concat(data.data.data)
        this.tabList = list
        // console.log(this.tabList)
        this.activeName = this.tabList[1].id
        this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', this.tabList[1])
        this.$store.commit('trade/CHANGE_ACTIVE_TAB_ID', this.activeName)
        this.resetSocketMarket(this.activeName)
      }
    },
    // 排序
    sortByUser (sortMethod) {
      switch (sortMethod) {
        case 'price':
          if (this.sortBy === 'rose-asc' || this.sortBy === 'rose-desc' || !this.sortBy) {
            this.sortBy = 'price-desc'
          } else if (this.sortBy === 'price-asc') {
            this.sortBy = 'price-desc'
          } else if (this.sortBy === 'price-desc') {
            this.sortBy = 'price-asc'
          }
          switch (this.sortBy) {
            case 'price-asc':
              this.sortList('price', this.filterMarketList, 'asc')
              break
            case 'price-desc':
              this.sortList('price', this.filterMarketList, 'desc')
              break
          }
          break
        case 'rose':
          if (this.sortBy === 'price-asc' || this.sortBy === 'price-desc' || !this.sortBy) {
            this.sortBy = 'rose-desc'
          } else if (this.sortBy === 'rose-asc') {
            this.sortBy = 'rose-desc'
          } else if (this.sortBy === 'rose-desc') {
            this.sortBy = 'rose-asc'
          }

          console.log(this.sortBy)
          switch (this.sortBy) {
            case 'rose-asc':
              this.sortList('rose', this.filterMarketList, 'asc')
              break
            case 'rose-desc':
              this.sortList('rose', this.filterMarketList, 'desc')
              break
          }
          break
        case 'price-asc':
          this.sortBy = 'price-asc'
          this.sortList('price', this.filterMarketList, 'desc')
          break
        case 'price-desc':
          this.sortBy = 'price-desc'
          this.sortList('price', this.filterMarketList, 'asc')
          break
        case 'rose-asc':
          this.sortBy = 'rose-desc'
          this.sortList('rose', this.filterMarketList, 'desc')
          break
        case 'rose-desc':
          this.sortBy = 'rose-asc'
          this.sortList('rose', this.filterMarketList, 'asc')
          break
      }
    },
    // 排序方法
    sortList (column, arr, methods) {
      if (methods == 'asc') {
        arr.forEach((item) => {
          // 升序
          for (let i = 0; i < item.content.length; i++) {
            for (let j = 0; j < item.content.length - i - 1; j++) {
              if (item.content[j][column] > item.content[j + 1][column]) {
                let swap = item.content[j]
                item.content[j] = item.content[j + 1]
                item.content[j + 1] = swap
              }
            }
          }
        })
      } else if (methods == 'desc') {
        // 降序
        arr.forEach((item) => {
          for (let i = 0; i < item.content.length; i++) {
            for (let j = 0; j < item.content.length - i - 1; j++) {
              if (item.content[j][column] < item.content[j + 1][column]) {
                let swap = item.content[j]
                item.content[j] = item.content[j + 1]
                item.content[j + 1] = swap
              }
            }
          }
        })
      }
      console.log(this.activeName)
      this.setFilterMarketList(this.activeName, arr)
      // 触发computed
      this.searchKeyWord = 'a'
      this.searchKeyWord = ''
    },
    // 搜索过滤
    filterSearchMarket () {
      console.log(this.activeName)
    },
    // 设置filterMarketList
    setFilterMarketList (tabName, list) {
      // console.log(tabName)
      // console.log(tabName)
      // 自选区
      if (tabName == this.tabList[0].id) {
        console.log(this.filterMarketList)
        this.resetList(this.filterMarketList)
        this.plateList.forEach((item, index) => {
          // console.log(item)
          this.collectList.forEach((innerItem, innerIndex) => {
            // console.log(item)
            // console.log(innerItem)
            // console.log(this.filterMarketList)
            if (item.id == innerItem.plateId) {
              // console.log(innerIndex)
              console.log(this.filterMarketList)
              this.filterMarketList[index].content.push(innerItem)
            }
          })
        })
      } else {
        // 非自选区
        list.forEach((item, index) => {
          if (this.filterMarketList[index].plateId == item.plateId) {
            // this.filterMarketList[index].content = item.content
            this.$set(this.filterMarketList[index], 'content', item.content)
          }
        })
        // console.log(this.filterMarketList)
        this.resetCollectList()
      }
    },
    // 初始化自选区
    resetCollectList () {
      this.collectList.forEach((item) => {
        console.log(item)
        this.collectStatusList[item.id] = true
      })
    },
    // 切换收藏
    toggleCollect (id, status, row) {
      console.log(id)
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
      // this.CHANGE_COLLECT_LIST(this.collectList)
      this.$store.commit('home/CHANGE_COLLECT_LIST', this.collectList)
      setStore('collectStatusList', this.collectStatusList)
      if (this.activeName == this.tabList[0].id) {
        console.log(this.activeName)
        console.log(this.tabList[0].id)
        this.resetList(this.filterMarketList)
        this.setFilterMarketList(this.activeName, this.collectList)
      }
      console.log(this.collectStatusList)
    },
    // 重置marketLIst
    resetList (list) {
      list.forEach((item) => {
        item.content = []
      })
    },
    // 切换tab
    changeTab (e) {
      // console.log(e.name)
      // console.log(this.activeName)
      // console.log(this.tabList[0].id)
      // this.activeName
      this.$store.commit('trade/CHANGE_ACTIVE_TAB_ID', this.activeName)
      // 自选区
      if (this.activeName == this.tabList[0].id) {
        // this.resetList(this.filterMarketList)
        // console.log(this.filterMarketList)
        this.filterMarketList = []
        this.plateList.forEach((item, index) => {
          this.filterMarketList.push({
            plateId: item.id,
            plateName: item.i18nName,
            content: []
          })
        })
        // console.log(this.collectList)
        this.setFilterMarketList(this.activeName, this.collectList)
        // console.log(this.filterMarketList)
      } else {
        // 接口请求不同交易区数据
        console.log(this.activeName)
        this.resetSocketMarket(this.activeName)
        // if (this.activeName == this.tabList[1].id) {
        //   this.setFilterMarketList(this.activeName, this.BTCMarketList)
        // } else if (this.activeName == this.tabList[2].id) {
        //   this.setFilterMarketList(this.activeName, this.ETHMarketList)
        // }
      }
      this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', e)
      // console.log(e)
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      globalCollectList: state => state.home.globalCollectList,
      globalCollectStatusList: state => state.home.globalCollectStatusList,
      partnerId: state => state.common.partnerId, // 商户id
      activeTradeArea: state => state.common.activeTradeArea,
      activeSymbol: state => state.common.activeSymbol, // 当前选中交易对
      previousSymbol: state => state.common.previousSymbol,
      activeTabId: state => state.trade.activeTabId
    }),
    // 搜索关键字过滤列表过滤
    searchFilterMarketList () {
      let newArr = []
      this.filterMarketList.forEach((item, index) => {
        newArr[index] = {
          plateId: '',
          plateName: '',
          content: []
        }
      })
      this.filterMarketList.forEach((item, index) => {
        newArr[index]['plateId'] = item.plateId
        newArr[index].plateName = item.plateName
        item.content.forEach((innerItem) => {
          if (
            innerItem['sellsymbol'].toLocaleUpperCase().indexOf(this.searchKeyWord.toLocaleUpperCase()) !== -1 ||
            (innerItem['sellname']).indexOf(this.searchKeyWord) !== -1
          ) {
            newArr[index].content.push(innerItem)
          }
        })
      })
      return newArr
    }
  },
  watch: {
    activeName (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter.scss';

  .trade-market-box {
    /*width:433px;*/
    > .inner-box {
      > .title {
        height: 34px;
        line-height: 34px;
        margin-bottom: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,.1);
        display: flex;
        > .text {
          flex: 1;
          font-weight: 700;
          display: inline-block;
          height: 100%;
          > span {
            text-indent: 4px;
            display: inline-block;
            height: 100%;
            //border-bottom: 2px solid $mainColor;
          }
        }
        /*买卖单顺序操作按钮*/
        > .right {
          flex: 1;
          text-align: right;
          > button {
            cursor: pointer;
            width: 28px;
            height: 20px;
            margin: 8px 8px 0 0;
            -webkit-background-size: 28px 20px;
            background-size: 28px 20px;
            background: url(../../assets/develop/middle.png) no-repeat center center;
          }
          > .middle {
          }
          > .bottom {
            background-image: url(../../assets/develop/buys.png);
          }
          > .top {
            background-image: url(../../assets/develop/sells.png);
          }
        }
      }
      /*表格内容*/
      > .content {
        > .inner-box {
          .coin-table{
            padding:0 5px;
            >.coin-thead{
              height:30px;
              line-height:30px;
              >.coin-unit{
                display:flex;
                /*表头*/
                >.title{
                  flex:1;
                  &:nth-of-type(1){
                    margin-left:20px;
                  }
                  &.price{
                    text-align: center;
                  }
                  &.rose{
                    text-align: right;
                    margin-right:20px;
                  }
                  .sort-box{
                    position: relative;
                    >i{
                      position: absolute;
                      left:0;
                      &.active{
                        color:$mainColor;
                      }
                      &.el-icon-caret-top{
                        top:-2px;
                      }
                      &.el-icon-caret-bottom{
                        bottom:-2px;
                      }
                    }
                  }
                }
              }
            }
            /*币种列表*/
            >.coin-list{
              >.market-cate-wrap{
                /*板块头部*/
                >.market-category{
                  height: 40px;
                  margin: 0 16px;
                  padding-left: 10px;
                  line-height: 40px;
                  position: relative;
                  &:before{
                    content:'';
                    position: absolute;
                    width:2px;
                    height:14px;
                    background-color: $mainColor;
                    left:0;
                    top:50%;
                    transform: translateY(-50%);
                  }
                }
                >.coin-item{
                  >.coin-item{
                    /*margin-left: 16px;*/
                    padding: 0 0 0 10px;
                    /*border-bottom: 1px solid;*/
                    height: 25px;
                    line-height: 25px;
                    display:flex;
                    >span{
                      flex:1;
                      display: inline-block;
                      &.price{
                        margin-right:18%;
                      }
                      &.up{
                        color: $upColor;
                      }
                      &.down{
                        color:$downColor;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.night {
      > .inner-box {
        > .title {
          color: $nightMainTitleColor;
          background-color: $nightMainTitleBgColor;
        }
        > .content {
          background-color: $nightMainContentBgColor;
          > .inner-box {
          }
        }
      }
    }
    &.day {
      > .inner-box {
        > .title {
          color: $dayMainTitleColor;
          background-color: $dayMainBgColor;
        }
        > .content {
          background-color: #fff;
          > .inner-box {
          }
        }
      }
    }
  }
</style>
