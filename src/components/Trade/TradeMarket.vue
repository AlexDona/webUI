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
            v-model="searchKeyWord"
          ></el-input>
        </span>
      </div>
      <el-collapse-transition>
        <div
          class="content"
          v-show="contentShowStatus"
        >
          <div
              class="inner-box"
            >
              <!--tab 切换-->
              <el-tabs
                v-model="activeName"
                @tab-click="changeTab"
              >
                <el-tab-pane
                  :label="collectArea.area"
                  :name="collectArea.area"
                >
                  <TradeMarketTableItem
                    :sortBy="sortBy"
                    :plateList="searchFilterCollectArea.plateList"
                    :collectSymbol="collectSymbol"
                    :activeName="activeName"
                    :collectArea="collectArea"
                    :list="[collectArea]"
                    @toggleCollect="toggleCollect"
                    @sortByUser="sortByUser"
                    @changeActiveSymbol="changeActiveSymbol"
                  />
                </el-tab-pane>
                <el-tab-pane
                  :label="$t(outItem.area)"
                  :name="outItem.area"
                  v-for="(outItem,outIndex) in searchFilterMarketList"
                  :key="outIndex"
                >
                  <TradeMarketTableItem
                    :sortBy="sortBy"
                    :plateList="outItem.plateList"
                    :collectSymbol="collectSymbol"
                    :activeName="activeName"
                    :collectArea="collectArea"
                    @toggleCollect="toggleCollect"
                    :list="filterMarketList"
                    @sortByUser="sortByUser"
                    @changeActiveSymbol="changeActiveSymbol"
                  />
                </el-tab-pane>
              </el-tabs>
            </div>
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>
<script>
import {
  getStore,
  setStore,
  unzip
} from '../../utils'
import {
  // getPartnerAreaList,
  getTradeMarketDataAjax
} from '../../utils/api/trade'
import {
  returnAjaxMessage,
  // getPartnerListAjax,
  toggleUserCollection,
  getCollectionList,
  setSocketData
} from '../../utils/commonFunc'
// import {socket} from '../../utils/tradingview/socket'
import {
  mapState,
  createNamespacedHelpers
} from 'vuex'
import TradeMarketTableItem from './TradeMarketTableItem'
const { mapMutations } = createNamespacedHelpers('home')
export default {
  components: {
    TradeMarketTableItem
  },
  // props,
  data () {
    return {
      newTradeMarketList: [], // 行情数据
      collectArea: {
        area: this.$t('M.trade_market_optional'), // 交易区名称 自选区
        areaId: 2,
        plateList: []
      },
      symbolPlateSet: new Set(), // 交易区板块set
      collectPlateList: [], // 收藏板块列表
      collectPlateFilterList: [], // 收藏筛选板块列表
      activeIndex: '0', // 当前tabIndex
      // ----------------
      contentShowStatus: true, // 显示隐藏控制
      activeName: 'M.trade_market_optional', // 当前tabItem
      sortBy: '', // 排序依据: price-asc price-desc rose-asc rose-desc
      marketList: [], // 行情数据
      filterMarketList: [], // 过滤行情数据
      // searchFilterMarketList: [], // 搜索过滤
      collectAreaId: '', // 自选区id
      collectList: [], // 收藏列表
      collectStatusList: {}, // 收藏状态
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
    if (this.language) {
      this.getTradeMarketData()
    }
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
    ...mapMutations([
      'CHANGE_COLLECT_LIST',
      'CHANGE_COLLECT_SYMBOL',
      'CHANGE_SYMBOL_MAP'
    ]),
    // 获取用户收藏列表
    async getCollectionList (collectSymbol) {
      await getCollectionList(this, data => {
        _.forEach(data.data.data, (item) => {
          collectSymbol[item.content] = item.content
        })
      })
    },
    // 设置收藏
    setCollectData (collectSymbol, plateList) {
      this.CHANGE_COLLECT_SYMBOL({
        type: 'reset',
        collectSymbol
      })
      let [...newPlateList] = this.collectPlateList
      _.forEach(plateList, (plateItem, plateIndex) => {
        _.forEach(plateItem.content, contentItem => {
          _.forEach(collectSymbol, collectSymbolItem => {
            if (collectSymbolItem === contentItem.id) {
              newPlateList[plateIndex].content.push(contentItem)
            }
          })
        })
      })
      this.$set(this.collectArea, 'plateList', newPlateList)
    },
    // 获取交易区信息
    async getTradeMarketData () {
      let params = {
        i18n: this.language
      }
      const data = await getTradeMarketDataAjax(params)
      console.log(data)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        const objData = JSON.parse(unzip(data.data.data.obj))
        console.log(objData)
        let [...tickerList] = objData.tickerList
        // let plateItemMap = new Map()
        console.log(tickerList)
        let plateList = []
        // 板块筛选
        _.forEach(tickerList, (tickerItem) => {
          _.forEach(tickerItem.plateList, (plateItem, plateIndex) => {
            let targetString = JSON.stringify({
              content: [],
              plateId: plateItem.plateId,
              plateName: plateItem.plateName
            })
            plateList[plateIndex] = JSON.parse(targetString)
            this.collectPlateList[plateIndex] = JSON.parse(targetString)
            this.collectPlateFilterList[plateIndex] = JSON.parse(targetString)
          })
        })
        // 生成symbolMap
        _.forEach(tickerList, (tickerItem) => {
          _.forEach(tickerItem.plateList, (plateItem, plateIndex) => {
            _.forEach(plateItem.content, (contentItem) => {
              this.$store.commit('home/CHANGE_SYMBOL_MAP', {
                key: contentItem.id,
                val: contentItem
              })
              plateList[plateIndex].content.push(contentItem)
            })
          })
        })
        let collectSymbol = {}
        if (!this.isLogin) {
          collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
        } else {
          await this.getCollectionList(collectSymbol)
        }
        this.setCollectData(collectSymbol, plateList)
        this.newTradeMarketList = tickerList
        this.filterMarketList = this.newTradeMarketList
      }
    },
    // 设置 当前交易区
    changeActiveSymbol (data) {
      let {activeSymbol, previousSymbol} = data
      console.log(activeSymbol)
      this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', {
        activeSymbol,
        previousSymbol
      })
    },
    // 排序
    sortByUser (data) {
      let {sortMethod, list} = data
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
              this.sortList('last', list, 'asc')
              break
            case 'price-desc':
              this.sortList('last', list, 'desc')
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
          switch (this.sortBy) {
            case 'rose-asc':
              this.sortList('chg', list, 'asc')
              break
            case 'rose-desc':
              this.sortList('chg', list, 'desc')
              break
          }
          break
        case 'price-asc':
          this.sortBy = 'price-asc'
          this.sortList('last', list, 'desc')
          break
        case 'price-desc':
          this.sortBy = 'price-desc'
          this.sortList('last', list, 'asc')
          break
        case 'rose-asc':
          this.sortBy = 'rose-desc'
          this.sortList('chg', list, 'desc')
          break
        case 'rose-desc':
          this.sortBy = 'rose-asc'
          this.sortList('chg', list, 'asc')
          break
      }
    },
    // 冒泡排序
    sortBybubble (content, column, methods) {
      let status
      for (let i = 0; i < content.length; i++) {
        for (let j = 0; j < content.length - i - 1; j++) {
          switch (methods) {
            case 'asc':
              status = content[j][column] > content[j + 1][column]
              break
            case 'desc':
              status = content[j][column] < content[j + 1][column]
              break
          }
          if (status) {
            let swap = content[j]
            content[j] = content[j + 1]
            content[j + 1] = swap
          }
        }
      }
    },
    // 排序方法
    sortList (column, arr, methods) {
      _.forEach(arr, item => {
        _.forEach(item.plateList, plateItem => {
          this.sortBybubble(plateItem.content, column, methods)
        })
      })
      arr[0].areaId === this.collectArea.areaId ? this.collectArea = arr[0] : this.filterMarketList = arr
      // 触发computed
      this.searchKeyWord = 'a'
      this.searchKeyWord = ''
    },
    // 初始化自选区
    resetCollectList () {
      this.collectList.forEach((item) => {
        this.collectStatusList[item.id] = true
      })
    },
    // 切换收藏
    async toggleCollect (data) {
      let {
        id,
        status,
        row,
        plateIndex
      } = data
      status = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      if (status) {
        //  添加收藏
        this.CHANGE_COLLECT_SYMBOL({
          type: 'add',
          collectSymbol: id
        })
        this.collectArea.plateList[plateIndex].content.push(row)
        if (this.isLogin) {
          await toggleUserCollection('add', row.tradeId, this)
        }
      } else {
        this.CHANGE_COLLECT_SYMBOL({
          type: 'cancel',
          collectSymbol: id
        })
        let newList = this.collectArea.plateList[plateIndex].content.filter(item => item.id !== id)
        this.$set(this.collectArea.plateList[plateIndex], 'content', newList)
        this.collectPlateList = this.collectArea.plateList
        // 取消收藏
        if (this.isLogin) {
          await toggleUserCollection('remove', id, this)
        }
      }
      if (!this.isLogin) {
        setStore('collectSymbol', this.collectSymbol)
      }
    },
    // 重置marketLIst
    resetList (list) {
      _.forEach(list, item => {
        _.forEach(item.plateList, plateItem => {
          plateItem.content = []
        })
      })
    },
    // 切换tab
    changeTab (e) {
      let {
        index
      } = e
      this.activeIndex = index - 0 + 1
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    },
    // 搜索遍历方法
    setSearchFilterList (type, originalList, {newArr, index}, newCollectArea) {
      _.forEach(originalList, (plateItem, plateIndex) => {
        _.forEach(plateItem.content, contentItem => {
          if (
            contentItem['sellsymbol'].toLocaleUpperCase().indexOf(this.searchKeyWord.toLocaleUpperCase()) !== -1 ||
            (contentItem['sellname']).indexOf(this.searchKeyWord) !== -1
          ) {
            type ? newArr[index].plateList[plateIndex].content.push(contentItem) : newCollectArea.plateList[plateIndex].content.push(contentItem)
          }
        })
      })
    },
    // 设置当前交易区交易对字符串
    setActiveTabSymbolStr () {
      let activeTabSymbolStr = ''
      console.log(this.activeIndex)
      switch (this.activeIndex) {
        // 自选区
        case 1:
          console.log(this.collectArea)
          _.forEach(this.collectArea.plateList, (plateItem) => {
            _.forEach(plateItem.content, (contentItem) => {
              activeTabSymbolStr += `${contentItem.id}@`
            })
          })
          break
        // 非自选区
        default:
          console.log(this.filterMarketList[this.activeIndex - 2])
          if (this.filterMarketList[this.activeIndex - 2]) {
            _.forEach(this.filterMarketList[this.activeIndex - 2].plateList, (plateItem) => {
              _.forEach(plateItem.content, (contentItem) => {
                activeTabSymbolStr += `${contentItem.id}@`
              })
            })
          }
          break
      }
      activeTabSymbolStr = `${this.middleTopData.id}@` + activeTabSymbolStr.slice(0, activeTabSymbolStr.length - 1)
      this.$store.commit('trade/CHANGE_ACTIVE_TAB_ID', {
        activeTabSymbolStr
      })
      console.log(this.activeTabSymbolStr)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      middleTopData: state => state.trade.middleTopData,
      isLogin: state => state.user.isLogin,
      theme: state => state.common.theme,
      symbolMap: state => state.home.symbolMap, // 交易对map
      language: state => state.common.language,
      activeTradeArea: state => state.common.activeTradeArea,
      activeSymbol: state => state.common.activeSymbol, // 当前选中交易对
      previousSymbol: state => state.common.previousSymbol,
      activeTabId: state => state.trade.activeTabId,
      activeSymbolId: state => state.common.activeSymbol.id,
      collectSymbol: state => state.home.collectSymbol, // 收藏标记
      tradeMarkeContentItem: state => state.common.socketData.tradeMarkeContentItem,
      activeTabSymbolStr: state => state.trade.activeTabSymbolStr
      // tradeMarketList: state => state.common.socketData.tradeMarketList // k线页面获取到的交易区信息
    }),
    tradeMarketList () {
      return this.newTradeMarketList
    },
    // 搜索关键字过滤列表过滤
    searchFilterMarketList () {
      let newArr = JSON.parse(JSON.stringify(this.filterMarketList))
      this.resetList(newArr)
      _.forEach(this.filterMarketList, (item, index) => {
        this.setSearchFilterList(1, item.plateList, {newArr, index}, [])
      })
      return newArr
    },
    // 自选区搜索
    searchFilterCollectArea () {
      let newCollectArea = JSON.parse(JSON.stringify(this.collectArea))
      _.forEach(newCollectArea.plateList, plateItem => {
        plateItem.content = []
      })
      this.setSearchFilterList(0, this.collectArea.plateList, [], newCollectArea)
      return newCollectArea
    }
  },
  watch: {
    language (newVal) {
      this.getTradeMarketData()
    },
    activeTabSymbolStr (newVal) {
      console.log(newVal)
    },
    // socket 更新数据
    tradeMarkeContentItem (newVal) {
      if (newVal) {
        // 当前交易对
        if (newVal.tradeId == this.middleTopData.tradeId) {
          let oldMiddleData = this.middleTopData
          let newMiddleDataList = []
          setSocketData(
            oldMiddleData,
            newVal,
            newMiddleDataList,
            0,
            this
          )
          this.$store.commit('trade/SET_MIDDLE_TOP_DATA', newMiddleDataList[0])
        }
        // 非自选区
        if (this.activeIndex != 1) {
          if (this.filterMarketList[this.activeIndex - 2]) {
            _.forEach(this.filterMarketList[this.activeIndex - 2].plateList, plateItem => {
              _.forEach(plateItem.content, (contentItem, contentIndex) => {
                let newContent = contentItem
                if (contentItem.tradeId === newVal.tradeId) {
                  setSocketData(
                    newContent,
                    newVal,
                    plateItem.content,
                    contentIndex,
                    this
                  )
                  return false
                }
              })
            })
          }
        } else {
          _.forEach(this.collectArea.plateList, (plateItem) => {
            _.forEach(plateItem.content, (contentItem, contentIndex) => {
              let newContent = contentItem
              if (contentItem.tradeId === newVal.tradeId) {
                setSocketData(
                  newContent,
                  newVal,
                  plateItem,
                  contentIndex,
                  this
                )
              }
            })
          })
        }
      }
    },
    middleTopData (newVal) {
      _.forEach(this.filterMarketList, (item, index) => {
        if (item.area == newVal.area) {
          this.activeIndex = index + 2
          return false
        }
      })
      this.activeName = newVal.area
    },
    activeName (newVal, oldVal) {
      this.setActiveTabSymbolStr()
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
        padding: 0 4.5%;
        height: 34px;
        line-height: 34px;
        margin-bottom: 1px;
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
        height:1584px;
        > .inner-box {

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
