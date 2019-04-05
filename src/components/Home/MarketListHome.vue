<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--<LoadingBox class="loading-box"/>-->
    <div class="inner-box">
      <!--表头-->
      <template>
        <el-tabs
          v-model="activeName"
          @tab-click="changeTab"
        >
          <el-tab-pane
            :label="plate.name.replace('+',' ')"
            :name="plate.id"
            v-for="plate in plates"
            :key="plate.name"
            :track-by="plate"
          >
            <div
              class="tab-content"
              v-if="activeName === plate.id"
            >
              <!--搜索区-->
              <HomeMarketTableItem
                :searchKeyWord="searchKeyWord"
                :collectAreaId="collectAreaId"
                :searchAreaId="searchAreaId"
                :collectStatusList="collectStatusList"
                :item="searchArea"
                :collectSymbol="collectSymbol"
                @toggleCollect="toggleCollect"
              />
              <!--自选区-->
              <HomeMarketTableItem
                :collectAreaId="collectAreaId"
                :searchAreaId="searchAreaId"
                :collectStatusList="collectStatusList"
                :item="collectArea"
                :collectSymbol="collectSymbol"
                @toggleCollect="toggleCollect"
                :searchKeyWord="searchKeyWord"
              />
              <div
                class="tab-item"
                v-for="area in areas"
                :id="'tab-item.' + area.id"
                :key="area.id"
                :track-by="area.id"
              >
                <div
                  class="inner-item-box"
                  v-if="(area.content.filter(item => item.visible).length && area.id !== searchAreaId)||( area.id == searchAreaId && searchKeyWord!=='')"
                  :style="'height:'+(50*(moreBtnShowStatus ? (area.content.length + 1) : area.content.length || 1)+102)+'px'"
                  :class="{
                  'force-height': !(area.id == searchAreaId || area.id == collectAreaId),
                  'max-height':true
                  }"
                >
                  <!--单个交易区-->
                  <HomeMarketTableItem
                    :collectAreaId="collectAreaId"
                    :searchAreaId="searchAreaId"
                    :collectStatusList="collectStatusList"
                    :item="area"
                    :collectSymbol="collectSymbol"
                    :activeName="activeName"
                    @toggleCollect="toggleCollect"
                    @getMoreSymbols="getMoreSymbols"
                    :searchKeyWord="searchKeyWord"
                  />
                </div>
              </div>
              <div
                class="more-box"
                v-show="moreBtnShowStatus"
              >
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
                  @click="getMoreAreas({more: true})"
                  v-show="moreBtnShowStatus"
                  :disabled="disabledStatus"
                >
                  {{$t(moreBtnText)}}
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!--搜索框-->
      <!--请输入内容-->
      <div class="search-box">
        <input
          ref="search-btn"
          :placeholder="$t('M.comm_search')"
          @keyup="searchFromMarketList"
          @change="searchFromMarketList"
        />
        <i class="el-icon-search"></i>
      </div>
    </div>
  </div>
</template>
<script>
import EchartsLineCommon from '../Common/EchartsLineCommon'
import IconFontCommon from '../Common/IconFontCommon'
import HomeMarketTableItem from '../Home/HomeMarketTableItem'
import socket from '../../utils/datafeeds/socket'
import {
  getStore,
  setStore,
  unzip,
  getStoreWithJson
} from '../../utils'
import {
  // splitSocketParams
  toggleUserCollection,
  getCollectionList,
  setSocketData,
  getNestedData
} from '../../utils/commonFunc'
import {
  getPlatesAJAX,
  getAllTradeAreasAJAX,
  getAllSymbolsAJAX
  // getCollectionListAjax
} from '../../utils/api/home'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  components: {
    IconFontCommon,
    EchartsLineCommon,
    HomeMarketTableItem
  },
  data () {
    return {
      disabledStatus: false, // 查看更多按钮禁用状态
      // 单个交易区查看全部状态
      itemAreaMoreStatus: false,
      // 搜索关键字
      searchKeyWord: '',
      // 搜索列表
      searchList: [],
      // 搜索区 id
      searchAreaId: 3,
      // 查看更多按钮文字
      moreBtnText: 'M.comm_view_more',
      // tab-content查看更多状态, 默认为false
      tabContentMoreStatus: false,
      // 自选区 id
      collectAreaId: 2,
      // 自选区状态列表
      collectStatusList: {},
      // 当前选中tab
      activeName: '',
      activeIndex: null, // 当前activeName 对应index
      // 前两项行情数据
      filterMarketList: [],
      moreBtnShowStatus: false, // 查看更多按钮显示状态
      socket: new socket(),
      tabChangeCount: 0, // tab栏切换次数
      newMarketList: [], // 当前最新行情
      collectArea: {
        area: this.$t('M.home_market_district'), // 交易区名称 自选区
        id: 2,
        content: []
      },
      searchArea: {
        area: this.$t('M.home_market_field_search'), // 搜索区
        id: 3,
        content: []
      },
      // socket请求参数字符串
      socketParamsStr: '',
      // 最新的list
      newMarketFilterList: [],
      marketMap: new Map(),
      // 最新的marketMap
      newCurrentMarketMap: new Map(),
      newMarketSet: new Set(),
      // 最新的交易区内容map
      newContentMap: new Map(),
      // 最新的交易区map
      newTradeAreaIndexMap: new Map(),
      newSymbolIndexMap: new Map(),
      // 板块列表
      plates: [],
      // 当前板块下的交易区
      areas: [],
      areasIndexMap: new Map(),
      symbolsIndexMap: new Map(),
      areasFromAPI: [],
      platesMap: new Map(),
      ONE_MINUTES: 2 * 1000,
      MAX_AREAS_LENGTH: 2,
      MAX_SYMBOLS_LENGTH: 10,
      timer: null,
      isCollectAreaReady: false,
      collectOriginalSymbols: []
    }
  },
  async created () {
    if (this.language) {
      await this.initPlatesAndAreas()
    }
  },
  mounted () {
  },
  activated () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  destroyed () {
    this.socket.destroy()
    clearTimeout(this.timer)
  },
  methods: {
    ...mapMutations([
      'CHANGE_COLLECT_LIST',
      'CHANGE_COLLECT_SYMBOL',
      'CHANGE_SYMBOL_MAP',
      'CHANGE_ACTIVE_TRADE_AREA',
      'CHANGE_AJAX_READY_STATUS',
      'RESET_SYMBOL_MAP'
    ]),
    async initPlatesAndAreas () {
      await this.getPlates()
      if (!this.plates.length) return false
      this.activeName = getNestedData(this.plates[0], 'id')
      // console.log(this.plates)
      await this.getAllTradeAreas()
    },
    getMoreAreas () {
      this.areas = this.areasFromAPI
      this.moreBtnShowStatus = false
    },
    async getAllTradeAreas (plateId = this.activeName) {
      this.disabledStatus = true
      let params = { plateId }

      let now = new Date().getTime()
      let lastTime = getStore('platesAges')
      let storePlates = getStoreWithJson('plates') || {}
      // console.log(storePlates, plateId, storePlates.hasOwnProperty(plateId))
      let data
      if (now - lastTime > this.ONE_MINUTES || !storePlates.hasOwnProperty(plateId)) {
        data = await getAllTradeAreasAJAX(params)
        let dataObjList = getNestedData(data, 'data.obj')
        let dataStr = ''
        _.forEach(dataObjList, dataObj => {
          dataStr += unzip(dataObj)
        })
        if (!dataStr) return false
        this.areasFromAPI = JSON.parse(dataStr) || []
        console.log(this.areasFromAPI)
        this.platesMap.set(plateId, this.areasFromAPI)
        let newPlates = {
          ...storePlates,
          [plateId]: this.areasFromAPI
        }
        setStore('plates', newPlates)
        setStore('platesAges', new Date().getTime())
      } else {
        this.areasFromAPI = storePlates[plateId]
      }

      const SYMBOL_AGE = getStore('symbolJSONAge')
      const NOW = new Date().getTime()
      let symbolJSON
      let localSymbolJSON = getStoreWithJson('symbolJSON') || {}
      // console.log(localSymbolJSON)
      let localSymbolLength = Object.keys(localSymbolJSON).length
      console.log(localSymbolLength)
      if (NOW - SYMBOL_AGE < this.ONE_MINUTES && localSymbolLength) {
        symbolJSON = localSymbolJSON
      } else {
        this.RESET_SYMBOL_MAP()
        if (this.plates.length !== 1) {
          let symbolsData = await getAllSymbolsAJAX({
            i18n: this.language
          })
          if (!symbolsData) return false
          let symbolsObjs = getNestedData(symbolsData, 'data.obj')
          // console.log(symbolsObjs)
          let symbolsStr = ''
          _.forEach(symbolsObjs, (symbolObj) => {
            symbolsStr += unzip(symbolObj)
          })
          if (!symbolsStr) return false
          // console.log(symbolsStr)
          let symbolsSJONFromBackEnd = JSON.parse(symbolsStr)
          // console.log(symbolsSJONFromBackEnd)
          symbolJSON = symbolsSJONFromBackEnd
          setStore('symbolJSONAge', new Date().getTime())
          console.log(symbolJSON)
        }
      }
      for (let k in symbolJSON) {
        // console.log(symbolJSON[k])
        this.CHANGE_SYMBOL_MAP({
          key: symbolJSON[k].id,
          val: symbolJSON[k]
        })
      }
      // this.RESET_SYMBOL_MAP()
      _.forEach(this.areasFromAPI, (area, areaIndex) => {
        this.areasIndexMap.set(area.area, areaIndex)
        this.symbolsIndexMap.set(areaIndex, new Map())
        this.newContentMap.set(area.area, area.content)
        // console.log(this.areasFromAPI[areaIndex])
        _.forEach(area.content, (symbol, symbolIndex) => {
          this.symbolsIndexMap.get(areaIndex).set(symbol.id, symbolIndex)
          console.log(symbol.id, this.symbolMap)
          if (this.symbolMap.get(symbol.id)) {
            this.areasFromAPI[areaIndex].content[symbolIndex] = this.symbolMap.get(symbol.id)
          }
          this.CHANGE_SYMBOL_MAP({
            key: symbol.id,
            val: this.areasFromAPI[areaIndex].content[symbolIndex]
          })
        })
      })
      console.log(this.areasFromAPI)
      let newAreas = [...this.areasFromAPI]
      // console.log(newAreas)
      _.forEach(this.areasFromAPI, (area, areaIndex) => {
        console.log(area)
        if (area.content.length > this.MAX_SYMBOLS_LENGTH) {
          newAreas[areaIndex].content = area.content.slice(0, this.MAX_SYMBOLS_LENGTH)
          newAreas[areaIndex].more = true
        }
      })
      console.log(this.areasFromAPI)
      if (newAreas.length > this.MAX_AREAS_LENGTH) {
        this.areas = [...newAreas.slice(0, this.MAX_AREAS_LENGTH)]
        this.moreBtnShowStatus = true
        this.disabledStatus = false
      } else {
        this.areas = [...newAreas]
      }
      console.log(newAreas)
      console.log(this.areas)

      let collectSymbol = {}
      if (!this.isLogin) {
        collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
      } else {
        await this.getCollectionList(collectSymbol)
      }
      console.log(collectSymbol)
      this.setCollectData(collectSymbol)
      // more
      this.setSymbolsForSocket()
    },
    // 获取更多交易对
    getMoreSymbols ({areaId}) {
      // console.log(data)
      _.forEach(this.areas, (area, areaIndex) => {
        if (area.id === areaId) {
          console.log(area)
          console.log(this.newContentMap)

          this.areas[areaIndex].content = this.newContentMap.get(area.area)
          console.log(this.areas)
          return false
        }
      })
    },
    // 获取板块信息
    async getPlates () {
      const data = await getPlatesAJAX({i18n: this.language})
      if (!data) return false
      this.plates = JSON.parse(unzip(getNestedData(data, 'data'))) || []
      // console.log(this.plates)
    },
    setCollectData (collectSymbol) {
      this.CHANGE_COLLECT_SYMBOL({
        type: 'reset',
        collectSymbol
      })
      let newContent = []
      _.forEach(collectSymbol, outItem => {
        // console.log(this.symbolMap, outItem)
        if (this.symbolMap.get(outItem)) {
          newContent.push(this.symbolMap.get(outItem))
        }
      })
      console.log(newContent)
      this.$set(this.collectArea, 'content', newContent)
    },
    // 拼接socket参数
    setSymbolsForSocket () {
      this.socketParamsStr = ''
      console.log(this.areas)
      _.forEach(this.areas, area => {
        _.forEach(area.content, symbol => {
          console.log(symbol)
          if (symbol) {
            this.socketParamsStr += `${symbol.id}@`
          }
        })
      })
      _.forEach(this.collectArea.content, symbol => {
        if (symbol) {
          this.socketParamsStr += `${symbol.id}@`
        }
      })
      this.socketParamsStr = this.socketParamsStr.slice(0, this.socketParamsStr.length - 1)
    },
    // 订阅数据
    subscribeSocket (type, params) {
      this.socket.doOpen()
      // 第一次加载
      if (!this.tabChangeCount) {
        this.socket.on('open', () => {
          this.getSocketData(type, params)
        })
      } else {
        this.getSocketData(type, params)
      }

      this.socket.on('message', (data) => {
        if (data.type == 1) {
          const newData = data.data
          let {
            buyCoinName, // 'BTC'、'FBT'
            tradeName // rdnbtc、 fucfbt
          } = newData
          // console.log(tradeName, newData, this.symbolMap)
          this.updateSymbol(buyCoinName, tradeName, newData)
          this.CHANGE_SYMBOL_MAP({
            key: tradeName,
            val: {...this.symbolMap.get(tradeName), ...newData}
          })
          // let symbol = getStoreWithJson('symbolJSON')
          // console.log(symbol)
          // console.log(symbol[tradeName])
          this.setCollectionAndSearchContent(this.searchArea.content, newData)
          this.setCollectionAndSearchContent(this.collectArea.content, newData)
        }
      })
    },
    // 更新交易区
    updateSymbol (area, tradeName, newData) {
      let areaIndex = this.areasIndexMap.get(area)
      if (String(areaIndex) == 'undefined' || !this.symbolsIndexMap.get(areaIndex)) return false
      let symbolIndex = this.symbolsIndexMap.get(areaIndex).get(tradeName)
      if (!this.areas[areaIndex]) return false
      const newSymbol = {...this.areas[areaIndex]['content'][symbolIndex], ...newData}
      this.$set(this.areas[areaIndex]['content'], symbolIndex, newSymbol)
    },
    setCollectionAndSearchContent (target, newData) {
      if (!target.length) return false
      // 搜索区
      _.forEach(target, (symbol, symbolIndex) => {
        let newSymbol = symbol
        if (symbol && symbol.tradeId === newData.tradeId) {
          setSocketData(
            newSymbol,
            newData,
            target,
            symbolIndex,
            this
          )
        }
      })
    },
    // 获取用户收藏列表
    async getCollectionList (collectSymbol) {
      await getCollectionList(data => {
        _.forEach(data.data, item => {
          console.log(item)
          collectSymbol[item.content] = item.content
        })
      })
    },
    getSocketData (type, params) {
      // 首页socket
      this.socket.send({
        'tag': type,
        'content': `market.${params}.ticker`,
        'id': 'pc'
      })
    },
    // 切换板块
    async changeTab (e) {
      this.searchFromMarketList()
      _.forEach(this.areas, area => {
        console.log(area)
        area.content = []
      })
      this.moreBtnShowStatus = false
      await this.getAllTradeAreas()
      let now = new Date().getTime()
      let lastTime = getStore('platesAges')
      if (now - lastTime < this.ONE_MINUTES) {
        this.CHANGE_AJAX_READY_STATUS(true)
        this.timer = setTimeout(() => {
          this.CHANGE_AJAX_READY_STATUS(false)
          clearTimeout(this.timer)
        }, 500)
      }
      // this.getTradeAreas({})
    },
    // 搜索关键字e
    searchFromMarketList () {
      console.log(this.$refs['search-btn'].value, this.searchKeyWord)
      this.searchKeyWord = this.$refs['search-btn'].value
      let searchList = []
      this.searchArea.content = searchList
      if (this.searchKeyWord.trim() !== '') {
        this.symbolMap.forEach(item => {
          console.log(item)
          if (item.plateId === this.activeName) {
            const result1 = item.sellsymbol.search(this.searchKeyWord.toUpperCase())
            const result2 = item.sellname.search(this.searchKeyWord)
            if (result1 !== -1 || result2 !== -1) {
              searchList.push(item)
            }
          }
        })
        this.searchArea.content = searchList
      } else {
        this.searchArea.content = []
      }
    },
    resetCoolectAndSearchAreaLang () {
      this.collectArea.area = this.$t('M.home_market_district')
      this.searchArea.area = this.$t('M.home_market_field_search')
    },
    // 切换收藏
    async toggleCollect (data) {
      this.resetCoolectAndSearchAreaLang()
      let {id, status, row} = data
      status = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      if (status) {
        //  添加收藏
        this.CHANGE_COLLECT_SYMBOL({
          type: 'add',
          collectSymbol: id
        })
        this.collectArea.content.push(row)
        if (this.isLogin) {
          await toggleUserCollection('add', id)
        }
      } else {
        this.CHANGE_COLLECT_SYMBOL({
          type: 'cancel',
          collectSymbol: id
        })
        // // 取消收藏
        let newList = this.collectArea.content.filter(item => item.id !== id)
        this.$set(this.collectArea, 'content', newList)
        if (this.isLogin) {
          await toggleUserCollection('remove', id)
        }
      }
      if (!this.isLogin) {
        setStore('collectSymbol', this.collectSymbol)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 语言
      isLogin: state => state.user.isLogin,
      collectSymbol: state => state.home.collectSymbol, // 收藏标记
      symbolMap: state => state.home.symbolMap // 交易对map
    })
  },
  watch: {
    filterMarketList (newVal) {
      // 查看更多按钮显示状态判断
      for (let i = 2; i < newVal.length; i++) {
        let item = newVal[i]
        if (item.content.length !== 0) {
          this.moreBtnShowStatus = true
          break
        } else {
          this.moreBtnShowStatus = false
        }
      }
    },
    activeName (newVal) {
      console.log(newVal)
      this.tabChangeCount++
      _.forEach(this.newMarketList, (item, index) => {
        if (item.plateId === newVal) {
          this.activeIndex = index
          return false
        }
      })
      this.setSymbolsForSocket()
    },
    async language (newVal) {
      this.resetCoolectAndSearchAreaLang()
      if (newVal) {
        await this.initPlatesAndAreas()
      }
    },
    socketParamsStr (newVal, oldVal) {
      if (oldVal) {
        this.subscribeSocket('CANCEL', oldVal)
      }
      console.log(newVal)
      this.subscribeSocket('SUB', newVal)
    },
    isLogin (newVal) {
      if (!newVal) {
        let collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
        this.setCollectData(collectSymbol)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index.scss";
  @import "../../../static/css/scss/Home/MarketListHome.scss";

  .market-list-box {
    width: 100%;
    min-height: 876px;
    overflow: hidden;

    > .loading-box {
      position: absolute;
      z-index: 999;
      top: 0;
      left: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, .2);
    }

    /* 表头 */
    .inner-box {
      position: relative;
      width: 1130px;
      margin: 78px auto;

      > .search-box {
        position: absolute;
        top: 8px;
        right: 0;
        width: 250px;
        height: 31px;
        border: 1px solid $mainColor;
        border-radius: 14px;
        overflow: hidden;

        > input {
          width: 195px;
          height: 100%;
          padding: 0 14px;
          color: #fff;
        }

        /deep/ {
          .el-icon-search {
            position: absolute;
            top: 50%;
            right: 8px;
            width: 50px;
            height: 20px;
            border-radius: 0 10px 10px 12px;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            color: #fff;
            background: $mainColor;
            transform: translateY(-50%);
          }
        }
      }

      /* 列表主要内容 */
      .tab-content {
        position: relative;

        /* 单个交易区 */
        > .tab-item {
          > .inner-item-box {
            margin-bottom: 20px;
            overflow: hidden;

            &.max-height {
              max-height: 610px;
            }

            &.force-height {
              height: 610px !important;
            }
          }
        }

        > .more-box {
          text-align: center;

          > .icon {
            margin-bottom: 20px;
            color: #273c69;
          }

          > .el-button {
            border: none;
            font-size: 16px;
            color: #fff;
            background-color: #305794;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      /deep/ {
        /* 首页交易区（night主题） */

        .el-table {
          color: #a0a0a0;
          background-color: #1c1f32;

          th,
          td {
            border-bottom: 1px solid #222c35;

            div {
              color: #fff;
            }
          }

          td {
            border-bottom: none;
          }

          th,
          tr {
            background-color: transparent;
          }
        }

        .has-data {
          td {
            border-bottom: 1px solid #222c35;
          }

          /* 选中行颜色 */
          &.el-table--enable-row-hover {
            .el-table__body tr {
              &:hover {
                > td {
                  background-color: #282a3c;
                }
              }
            }
          }
        }

        .el-table--enable-row-hover {
          .el-table__body tr {
            &:hover {
              > td {
                background-color: transparent;
              }
            }
          }
        }

        /* tab栏每一项 */
        .el-tabs__item {
          color: #8494a6;
          transition: all 1s;

          &.is-active {
            color: #fff;
          }
        }

        /* 滚动条 */
        .el-table--scrollable-y {
          .el-table__body-wrapper::-webkit-scrollbar {
            width: 3px;
          }

          .el-table__body-wrapper::-webkit-scrollbar-track-piece {
            background-color: #4a5662;
          }

          /* 滚动条背景 */
          .el-table__body-wrapper::-webkit-scrollbar-thumb {
            background-color: #338ff5;
          }

          .el-table__body-wrapper::-webkit-scrollbar-button {
            display: none;
            background-color: #fff;
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .inner-box {
        > .search-box {
          > input {
            color: $dayFontColor;
          }
        }
      }

      /deep/ {
        .el-table--enable-row-hover {
          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: transparent;
                }
              }

              td {
                border-bottom: none;
              }
            }
          }

          &.has-data {
            .el-table__body {
              tr {
                td {
                  border-bottom: 1px solid #ebeef5;
                }

                &:hover {
                  > td {
                    background-color: #eaf2fa;
                  }
                }
              }
            }
          }
        }

        .el-table {
          color: #333;

          th {
            div {
              color: #333;
            }
          }
        }
      }
    }

    /* element 样式修改 */
    /deep/ {
      .el-tabs__nav-scroll {
        height: 46px;
        background-image: url(../../assets/develop/tab-bg.png);
        background-position: center center;
        -webkit-background-size: 1130px 46px;
        background-size: 1130px 46px;
      }

      .el-input__inner {
        width: 250px;
        height: 30px;
        border: none;
        border-radius: 0;
        outline: none;
        background-color: transparent;
      }

      .el-input__icon {
        position: absolute;
        top: -4px;
        right: 14px;
        font-size: 22px;
        color: #fff;
      }

      .el-tabs__nav-wrap::after,
      .el-tabs__active-bar {
        height: 0;
      }

      /* tab栏每一项 */
      .el-tabs__item {
        height: 35px;
        padding: 0 30px !important;
        margin: 6px auto;
        font-size: 16px;
        line-height: 35px;
        transition: color 0s;

        &.is-active {
          border: none;
          color: #fff;
          background: url(../../assets/develop/tab-active-bg.png) no-repeat center center;
          -webkit-background-size: 100% 100%;
          background-size: 100% 100%;
        }
      }

      .el-table--enable-row-transition .el-table__body td {
        box-sizing: border-box;
        height: 49px !important;
        padding: 0;
      }

      .el-table {
        th {
          box-sizing: border-box;
          height: 38px;
          padding: 0 0 0 14px;
          border-top: 1px solid #2f3a8c;
        }

        tr {
          max-height: 50px !important;
        }

        .cell,
        th div {
          padding: 0;
        }

        .sort-caret {
          border-width: 4px;

          &.ascending {
            top: 8px;
          }

          .descending {
            bottom: 8px;
          }
        }

        /* 交易对颜色 */
        .sellname,
        .area {
          color: #646464;
        }
      }

      .tab-content {
        visibility: inherit !important;
      }

      .el-button {
        background-color: transparent;

        &.more-btn {
          width: 115px;
          height: 35px;
          padding: 0;
          border-radius: 10px;
          line-height: 35px;
          color: #fff;
        }
      }
    }
  }
</style>
<style>
  /* 表格表头 */
  .trade-box.day .el-table th > .cell {
    color: #333;
  }
</style>
