<!--
  author: zhaoxinlei
  update: 20190803
  description: 当前页面为 币币交易 行情 主页面
-->
<template lang="pug">
  .trade-market-box.trade(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .inner-box
      .title
        // 市场
        span.left {{ $t('M.trade_market_bazaar') }}
        .right
          .search-box
            input(
              ref="search-input"
              @change="changeSearchKeyWord"
              @input="changeSearchKeyWord"
            )
            i.el-icon-search
      .content(:class="{'needTime':$activityInfo_S_X.showCountDown}")
        .inner-box
          el-tabs(
            v-model="activeName"
            @tab-click="changeTab"
          )
            el-tab-pane(
              :label="collectArea.area"
              :name="collectArea.area"
            )
              TradeMarketTableItem(
                :searchKeyWord="searchKeyWord"
                :sortBy="sortBy"
                :plateList="searchFilterCollectArea.plateList"
                :collectSymbol="collectSymbol"
                :activeName="activeName"
                :collectArea="collectArea"
                :list="[collectArea]"
                @toggleCollect="toggleCollect"
                @sortByUser="sortByUser"
                @changeActiveSymbol="changeActiveSymbol"
              )
            el-tab-pane(
              :label="outItem.area"
              :name="outItem.area"
              v-for="(outItem,outIndex) in searchFilterMarketList"
              :key="outIndex"
            )
              TradeMarketTableItem(
                :sortBy="sortBy"
                :plateList="outItem.plateList"
                :collectSymbol="collectSymbol"
                :activeName="activeName"
                :collectArea="collectArea"
                @toggleCollect="toggleCollect"
                :list="filterMarketList"
                @sortByUser="sortByUser"
                @changeActiveSymbol="changeActiveSymbol"
                :searchKeyWord="searchKeyWord"
              )
</template>
<!--<template>-->
  <!--<div-->
    <!--class="trade-market-box trade"-->
    <!--:class="{'day':theme == 'day','night':theme == 'night' }"-->
  <!--&gt;-->
    <!--<div class="inner-box">-->
      <!--<div-->
        <!--class="title font-size16 cursor-pointer"-->
      <!--&gt;-->
        <!--<span-->
          <!--class="text"-->
          <!--@click="toggleShowContent"-->
        <!--&gt;-->
          <!--<span>-->
            <!--&lt;!&ndash;市场&ndash;&gt;-->
            <!--{{ $t('M.trade_market_bazaar') }}-->
          <!--</span>-->
        <!--</span>-->
        <!--<div class="right">-->
          <!--<div class="search-box">-->
            <!--<input-->
              <!--ref="search-input"-->
              <!--@change="changeSearchKeyWord"-->
              <!--@input="changeSearchKeyWord"-->
            <!--/>-->
            <!--<i class="el-icon-search"></i>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--<el-collapse-transition>-->
        <!--<div-->
          <!--class="content"-->
          <!--:class="{-->
            <!--'needTime':$activityInfo_S_X.showCountDown-->
          <!--}"-->
          <!--v-show="contentShowStatus"-->
        <!--&gt;-->
          <!--<div-->
              <!--class="inner-box"-->
            <!--&gt;-->
              <!--&lt;!&ndash;tab 切换&ndash;&gt;-->
              <!--<el-tabs-->
                <!--v-model="activeName"-->
                <!--@tab-click="changeTab"-->
              <!--&gt;-->
                <!--<el-tab-pane-->
                  <!--:label="collectArea.area"-->
                  <!--:name="collectArea.area"-->
                <!--&gt;-->
                  <!--<TradeMarketTableItem-->
                    <!--:searchKeyWord="searchKeyWord"-->
                    <!--:sortBy="sortBy"-->
                    <!--:plateList="searchFilterCollectArea.plateList"-->
                    <!--:collectSymbol="collectSymbol"-->
                    <!--:activeName="activeName"-->
                    <!--:collectArea="collectArea"-->
                    <!--:list="[collectArea]"-->
                    <!--@toggleCollect="toggleCollect"-->
                    <!--@sortByUser="sortByUser"-->
                    <!--@changeActiveSymbol="changeActiveSymbol"-->
                  <!--/>-->
                <!--</el-tab-pane>-->
                <!--<el-tab-pane-->
                  <!--:label="outItem.area"-->
                  <!--:name="outItem.area"-->
                  <!--v-for="(outItem,outIndex) in searchFilterMarketList"-->
                  <!--:key="outIndex"-->
                <!--&gt;-->
                  <!--<TradeMarketTableItem-->
                    <!--:sortBy="sortBy"-->
                    <!--:plateList="outItem.plateList"-->
                    <!--:collectSymbol="collectSymbol"-->
                    <!--:activeName="activeName"-->
                    <!--:collectArea="collectArea"-->
                    <!--@toggleCollect="toggleCollect"-->
                    <!--:list="filterMarketList"-->
                    <!--@sortByUser="sortByUser"-->
                    <!--@changeActiveSymbol="changeActiveSymbol"-->
                    <!--:searchKeyWord="searchKeyWord"-->
                  <!--/>-->
                <!--</el-tab-pane>-->
              <!--</el-tabs>-->
            <!--</div>-->
        <!--</div>-->
      <!--</el-collapse-transition>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->
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
  // getPartnerListAjax,
  toggleUserCollection,
  getCollectionList,
  setSocketData,
  getNestedData
} from '../../utils/commonFunc'
// import {socket} from '../../utils/tradingview/socket'
import {
  mapState,
  mapMutations
} from 'vuex'
import TradeMarketTableItem from './TradeMarketTableItem'
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
      collectPlateList: [], // 收藏板块列表
      collectPlateFilterList: [], // 收藏筛选板块列表
      activeIndex: '0', // 当前tabIndex
      // ----------------
      contentShowStatus: true, // 显示隐藏控制
      activeName: this.$t('M.trade_market_optional'), // 当前tabItem
      sortBy: '', // 排序依据: price-asc price-desc rose-asc rose-desc
      filterMarketList: [], // 过滤行情数据
      searchKeyWord: '' // 搜索关键字
    }
  },
  created () {
    if (this.language) {
      this.getTradeMarketData()
    }
  },
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_COLLECT_LIST',
      'CHANGE_COLLECT_SYMBOL',
      'CHANGE_SYMBOL_MAP',
      'CHANGE_ACTIVE_TAB_ID',
      'SET_MIDDLE_TOP_DATA',
      'CHANGE_SYMBOL_CHANGED_STATUS'
    ]),
    changeSearchKeyWord () {
      let value = this.$refs['search-input'].value
      this.searchKeyWord = value
    },
    // 获取用户收藏列表
    async getCollectionList (collectSymbol) {
      await getCollectionList(data => {
        _.forEach(data.data, item => {
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
      _.forEach(collectSymbol, collectSymbolItem => {
        _.forEach(newPlateList, (newItem, newIndex) => {
          _.forEach(plateList, plateItem => {
            if (newItem.plateId === plateItem.plateId) {
              _.forEach(plateItem.content, contentItem => {
                if (contentItem.id === collectSymbolItem) {
                  newPlateList[newIndex].content.push(contentItem)
                  return false
                }
              })
              return false
            }
          })
        })
      })
      this.$set(this.collectArea, 'plateList', newPlateList)
    },
    setActiveIndex (area) {
      _.forEach(this.filterMarketList, (item, index) => {
        if (item.area == area) {
          this.activeIndex = index + 2
          return false
        }
      })
    },
    // 获取交易区信息
    async getTradeMarketData () {
      this.collectPlateList = []
      this.collectPlateFilterList = []
      let params = {
        i18n: this.language
      }
      const data = await getTradeMarketDataAjax(params)
      if (!data) return false
      let objList = getNestedData(data, 'data.obj')
      let resultStr = ''
      _.forEach(objList, (objItem) => {
        resultStr += unzip(objItem)
      })
      const objData = JSON.parse(resultStr)
      let tickerList = _.cloneDeep(objData.tickerList)
      let plateList = []
      // 板块筛选
      _.forEach(tickerList, (tickerItem) => {
        _.forEach(tickerItem.plateList, plateItem => {
          let initPlateItem = {
            content: [],
            plateId: plateItem.plateId,
            plateName: plateItem.plateName.replace('+', ' ')
          }
          let isExist = plateList.some(item => item.plateId == plateItem.plateId)
          if (!isExist) {
            plateList.push(_.cloneDeep(initPlateItem))
            this.collectPlateList.push(_.cloneDeep(initPlateItem))
            this.collectPlateFilterList.push(_.cloneDeep(initPlateItem))
          }
        })
      })
      // 生成symbolMap
      _.forEach(tickerList, tickerItem => {
        _.forEach(tickerItem.plateList, plateItem => {
          _.forEach(plateItem.content, contentItem => {
            this.CHANGE_SYMBOL_MAP({
              key: contentItem.id,
              val: contentItem
            })
            _.forEach(plateList, (plateListItem, plateListIndex) => {
              if (plateListItem.plateId == plateItem.plateId) {
                plateList[plateListIndex].content.push(contentItem)
              }
            })
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
      this.setActiveIndex(this.middleTopData.area)
      this.activeName = this.middleTopData.area
      this.setActiveTabSymbolStr()
    },
    // 设置 当前交易区
    changeActiveSymbol ({activeSymbol}) {
      const {id} = activeSymbol
      setStore('activeSymbol', id)
      this.SET_MIDDLE_TOP_DATA(activeSymbol)
      this.CHANGE_SYMBOL_CHANGED_STATUS(true)
      const TradeStr = '/TradeCenter/'
      this.$goToPage(`${TradeStr}${id}`)
      let {href} = window.location

      window.location.href = `${href.split(TradeStr)[0]}${TradeStr}${id}`
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
    // 切换收藏
    async toggleCollect (data) {
      let {
        id,
        status,
        row,
        plateId
      } = data
      status = Boolean(status)
      // this.$set(this.collectStatusList, id, status)
      if (status) {
        //  添加收藏
        this.CHANGE_COLLECT_SYMBOL({
          type: 'add',
          collectSymbol: id
        })
        // this.collectArea.plateList[plateIndex].content.push(row)
        _.forEach(this.collectArea.plateList, (plateItem, plateIndex) => {
          if (plateItem.plateId == plateId) {
            let isExist = plateItem.content.some(item => item.id == id)
            if (!isExist) {
              plateItem.content.push(row)
              return false
            }
          }
        })
        if (this.isLogin) {
          await toggleUserCollection('add', id)
        }
      } else {
        this.CHANGE_COLLECT_SYMBOL({
          type: 'cancel',
          collectSymbol: id
        })
        _.forEach(this.collectArea.plateList, (plateItem, plateIndex) => {
          if (plateItem.plateId == plateId) {
            let newList = plateItem.content.filter(item => item.id !== id)
            this.$set(this.collectArea.plateList[plateIndex], 'content', newList)
            return false
          }
        })
        this.collectPlateList = this.collectArea.plateList
        // 取消收藏
        if (this.isLogin) {
          await toggleUserCollection('remove', id)
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
      switch (this.activeIndex) {
        // 自选区
        case 1:
          _.forEach(this.collectArea.plateList, (plateItem) => {
            _.forEach(plateItem.content, (contentItem) => {
              if (contentItem.id) {
                activeTabSymbolStr += `${contentItem.id}@`
              }
            })
          })
          break
        // 非自选区
        default:
          if (this.filterMarketList[this.activeIndex - 2]) {
            _.forEach(this.filterMarketList[this.activeIndex - 2].plateList, (plateItem) => {
              _.forEach(plateItem.content, (contentItem) => {
                if (contentItem.id) {
                  activeTabSymbolStr += `${contentItem.id}@`
                }
              })
            })
          }
          break
      }
      activeTabSymbolStr = this.middleTopData.id ? `${this.middleTopData.id}@${activeTabSymbolStr.slice(0, activeTabSymbolStr.length - 1)}` : `${activeTabSymbolStr.slice(0, activeTabSymbolStr.length - 1)}`
      this.CHANGE_ACTIVE_TAB_ID({
        activeTabSymbolStr
      })
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
      activeTabId: state => state.trade.activeTabId,
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
      let newArr = _.cloneDeep(this.filterMarketList)
      this.resetList(newArr)
      _.forEach(this.filterMarketList, (item, index) => {
        this.setSearchFilterList(1, item.plateList, {newArr, index}, [])
      })
      return newArr
    },
    // 自选区搜索
    searchFilterCollectArea () {
      let newCollectArea = _.cloneDeep(this.collectArea)
      _.forEach(newCollectArea.plateList, plateItem => {
        plateItem.content = []
      })
      this.setSearchFilterList(0, this.collectArea.plateList, [], newCollectArea)
      return newCollectArea
    }
  },
  watch: {
    language (newVal) {
      this.collectArea.area = this.$t('M.trade_market_optional')
      this.activeName = this.$t('M.trade_market_optional')
      this.getTradeMarketData()
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
          this.SET_MIDDLE_TOP_DATA(newMiddleDataList[0])
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
      this.setActiveIndex(newVal.area)
      this.activeName = newVal.area
    },
    activeName (newVal, oldVal) {
      this.setActiveTabSymbolStr()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .trade-market-box {
    > .inner-box {
      > .title {
        display: flex;
        height: 34px;
        padding: 0 20px;
        line-height: 34px;

        > .text {
          display: inline-block;
          flex: 1;
          height: 100%;

          > span {
            display: inline-block;
            height: 100%;
            font-size: 14px;
            color: #d9e1f1;
          }
        }

        /* 买卖单顺序操作按钮 */
        > .right {
          flex: 1;
          text-align: right;

          > .search-box {
            display: inline-block;
            width: 100px;
            height: 20px;
            border: 1px solid #fff;
            line-height: 0;
            text-align: left;

            > input {
              box-sizing: border-box;
              width: 70px;
              height: 100%;
              padding: 0 0 0 10px;
              color: #fff;
            }
          }

          > button {
            width: 28px;
            height: 20px;
            margin: 8px 8px 0 0;
            background: url(../../assets/develop/middle.png) no-repeat center center;
            -webkit-background-size: 28px 20px;
            background-size: 28px 20px;
            cursor: pointer;
          }

          > .bottom {
            background-image: url(../../assets/develop/buys.png);
          }

          > .top {
            background-image: url(../../assets/develop/sells.png);
          }
        }
      }

      /* 表格内容 */
      > .content {
        height: 873px;
        overflow: auto;

        &.needTime {
          height: 670px !important;
        }
      }
    }

    /deep/ {
      .el-input__inner {
        width: 100px;
        height: 20px;
        border: 1px solid #a9bed4;
        border-radius: 2px;
        background: transparent;
      }

      .el-tabs__nav-scroll {
        padding-left: 6px;
      }

      .el-input__suffix {
        top: -3px;
      }

      .el-tabs__active-bar,
      .el-tabs__nav-wrap::after {
        height: 0;
      }

      .el-tabs__item {
        height: 20px;
        padding: 0 6px !important;
        margin: 5px 6px;
        border-radius: 2px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;

        &.is-active {
          border: none;
          color: #fff !important;
          background: $mainColor !important;
        }
      }

      .el-tabs__nav {
        height: 40px;
        line-height: 40px;
      }

      .el-tabs__header {
        margin: 0;
      }

      .el-tabs--top {
        .el-tabs__item {
          &.is-top {
            &:nth-child(2) {
              margin-left: 10px;
            }
          }

          &:last-child {
            padding-right: 10px;
          }
        }
      }
    }

    &.night {
      > .inner-box {
        > .title {
          color: $mainNightTitleColor;
          background-color: #23273c;

          > .right {
            > .search-box {
              border-color: #3e4154;
            }
          }
        }

        > .content {
          background-color: $mainContentNightBgColor;
        }
      }

      /deep/ {
        .el-tabs__item {
          border: 1px solid #3e4154;
          color: #66718f;
        }

        .el-tabs__nav-scroll {
          background-color: #23273c;
        }
      }
    }

    &.day {
      > .inner-box {
        > .title {
          color: #333;
          background-color: #f2f6fa;

          > .right {
            > .search-box {
              border: 1px solid $mainNightTitleColor;

              > input {
                color: $dayMainTitleColor;
              }
            }
          }
        }

        > .content {
          background-color: $mainDayBgColor;
        }
      }

      /deep/ {
        .el-tabs__item {
          border: 1px solid #cfd5df;
          color: #66718f;
        }

        .el-tabs__nav-scroll {
          background-color: #f2f6fa;
        }
      }
    }
  }
</style>
