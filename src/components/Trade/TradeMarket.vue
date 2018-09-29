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
          <span>
            <!--市场-->
            {{ $t('M.trade_market_bazaar') }}
          </span>
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
                :label="$t(outItem.name)"
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
                        <!--交易对-->
                        {{ $t('M.comm_deal') }}{{ $t('M.comm_pair') }}
                      </span>
                      <span
                        class="title price cursor-pointer"
                      >
                        <!--最新价-->
                            <span
                              id="new_price"
                              ref="price"
                              :data-text="$t('M.trade_latest_price')"
                              @click="sortByUser('price')"
                            >
                              <!--最新价-->
                              {{ $t('M.trade_latest_price') }}
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
                            <!--涨幅-->
                        {{ $t('M.trade_market_amount_increase') }}
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
                        @click=changeActiveSymbol(innerItem)
                      >
                        <span>
                          <!--收藏按钮-->
                          <!--自选区-->
                          <span v-show="activeName==tabList[0].id">
                            <i
                              class="el-icon-star-on cursor-pointer collected font-size16"
                              @click="toggleCollect(innerItem.id,0,innerItem)"
                            ></i>
                          </span>
                          <!--非自选区-->
                          <span v-show="activeName!=tabList[0].id">
                            <i
                              class="el-icon-star-off cursor-pointer font-size16"
                              v-show="!collectStatusList[innerItem.id]"
                              @click="toggleCollect(innerItem.id,1,innerItem)"
                            ></i>
                            <i
                              class="el-icon-star-on cursor-pointer collected font-size16"
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
import {
  getStore,
  setStore
} from '../../utils'
import {getPartnerAreaList} from '../../utils/api/trade'
import {
  returnAjaxMessage,
  getPartnerListAjax,
  toggleUserCollection
} from '../../utils/commonFunc'
// import {socket} from '../../utils/tradingview/socket'
import {
  mapState,
  createNamespacedHelpers
} from 'vuex'
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
          name: 'M.trade_market_optional' // 自选
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
      console.log(activeSymbol)
      // console.log('active----------------->', activeSymbol)
      // console.log(activeSymbol.tradeId)
      // console.log(this.activeTabId)
      // console.log('previous--------------->', this.previousSymbol.id)
      // this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', activeSymbol)
      this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', {
        activeSymbol,
        previousSymbol
      })
    },
    // 获取板块列表
    getPartnerList () {
      const params = {
        partnerId: this.partnerId,
        i18n: this.language
      }
      getPartnerListAjax(params, (data) => {
        if (!returnAjaxMessage(data, this, 0)) {
          return false
        } else {
          this.plateList = data.data.data
        }
      })
    },
    // 重新订阅请求socket
    resetSocketMarket (areaId) {
      socket.subscribeKline({
        type: 'trade_market', // 请求类型
        areaId,
        symbol: this.activeSymbol.id,
        interval: 'min'
      }, (data) => {
        console.log(data)
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
              this.setTradeAreaSubscribeData(data)
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
        console.log(this.activeSymbol)
        const list = this.tabList.concat(data.data.data)
        this.tabList = list
        console.log(this.tabList)
        this.tabList.forEach((item, index) => {
          if (item.id == this.activeSymbol.areaId) {
            this.activeName = this.tabList[index].id
            this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', this.tabList[index])
            this.$store.commit('trade/CHANGE_ACTIVE_TAB_ID', this.activeName)
            return false
          }
        })
        // this.changeActiveSymbol({id: 'btmbtc'})
        // this.resetSocketMarket(this.activeName)
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
      // 自选区
      if (tabName == this.tabList[0].id) {
        console.log(this.filterMarketList)
        this.resetList(this.filterMarketList)
        this.plateList.forEach((item, index) => {
          this.collectList.forEach((innerItem, innerIndex) => {
            if (item.id == innerItem.plateId) {
              this.filterMarketList[index].content.push(innerItem)
            }
          })
        })
      } else {
        // 非自选区
        list.forEach((item, index) => {
          if (this.filterMarketList[index].plateId == item.plateId) {
            this.$set(this.filterMarketList[index], 'content', item.content)
          }
        })
        this.resetCollectList()
      }
    },
    // 初始化自选区
    resetCollectList () {
      this.collectList.forEach((item) => {
        // console.log(item)
        this.collectStatusList[item.id] = true
      })
    },
    // 切换收藏
    async toggleCollect (id, status, row) {
      console.log(id)
      console.log(row)
      status = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      if (status) {
        //  添加收藏
        this.collectList.push(row)
        if (this.isLogin) {
          await toggleUserCollection('add', row.tradeId, this)
        }
      } else {
        let chooseId
        // 取消收藏
        this.collectList.forEach((item, index) => {
          if (item.id == row.id) {
            this.collectList.splice(index, 1)
            chooseId = item.tradeId
          }
        })
        await toggleUserCollection('remove', chooseId, this)
      }
      setStore('collectList', this.collectList)
      this.$store.commit('home/CHANGE_COLLECT_LIST', this.collectList)
      setStore('collectStatusList', this.collectStatusList)
      if (this.activeName == this.tabList[0].id) {
        this.resetList(this.filterMarketList)
        this.setFilterMarketList(this.activeName, this.collectList)
      }
    },
    // 重置marketLIst
    resetList (list) {
      list.forEach((item) => {
        item.content = []
      })
    },
    // 切换tab
    changeTab (e) {
      // console.log(e)
      this.$store.commit('trade/CHANGE_ACTIVE_TAB_ID', this.activeName)
      // 自选区
      if (this.activeName == this.tabList[0].id) {
        this.filterMarketList = []
        this.plateList.forEach((item, index) => {
          this.filterMarketList.push({
            plateId: item.id,
            plateName: item.i18nName,
            content: []
          })
        })
        this.setFilterMarketList(this.activeName, this.collectList)
      } else {
        // 接口请求不同交易区数据
        this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', this.tabList[e.index])
        // console.log(this.activeTradeArea)
        // this.resetSocketMarket(this.activeName)
      }
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 设置交易区 订阅数据
    setTradeAreaSubscribeData (data) {
      const newData = data.data[0].content[0]
      if (this.activeSymbol.id == newData.id) {
        this.changeActiveSymbol(newData)
      }
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
      activeTabId: state => state.trade.activeTabId,
      activeSymbolId: state => state.common.activeSymbol.id,
      tradeMarketList: state => state.common.socketData.tradeMarketList // k线页面获取到的交易区信息
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
      // console.log(newVal)
    },
    tradeMarketList (newVal) {
      const data = newVal
      if (data) {
        switch (data.type) {
          case 0:
            this.marketList = data.data
            // console.log(this.marketList)
            this.marketList.forEach((item) => {
              // console.log(item)
              item.content.forEach((innerItem) => {
                if (innerItem.id.toLocaleUpperCase() == this.activeSymbolId.toLocaleUpperCase()) {
                  this.CHANGE_ACTIVE_SYMBOL(innerItem)
                  // console.log(innerItem.id)
                  // console.log(this.activeSymbolId)
                  return false
                }
              })
            })
            this.collectList = JSON.parse(getStore('collectList')) || []
            this.resetCollectList()
            this.filterMarketList = this.marketList
            this.setFilterMarketList(this.activeName, this.marketList)
            break
          case 1:
            // console.log(newVal)
            this.setTradeAreaSubscribeData(newVal)
            break
        }
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  /*@import '../../../static/css/scss/Trade/TradeCenter.scss';*/
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
          /*font-weight: 700;*/
          display: inline-block;
          height: 100%;
          > span {
            text-indent: 4px;
            display: inline-block;
            height: 100%;
            color:$mainColor;
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
          color: $mainNightTitleColor;
          background-color: $mainContentNightBgColor;
        }
        > .content {
          background-color: $mainContentNightBgColor;
          > .inner-box {
          }
        }
      }
    }
    &.day {
      > .inner-box {
        > .title {
          color: $dayMainTitleColor;
          background-color: $mainDayBgColor;
        }
        > .content {
          background-color: $mainDayBgColor;
          > .inner-box {
          }
        }
      }
    }
  }
</style>
