<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <LoadingBox class="loading-box"/>
    <div class="inner-box">
      <!--表头-->
      <template>
        <el-tabs
          v-model="activeName"
          @tab-click="changeTab"
        >
          <el-tab-pane
            :label="outItem.plateName.replace('+',' ')"
            :name="outItem.plateId"
            v-for="(outItem,outIndex) in filterMarketList"
            :key="outIndex"
            :track-by="outIndex"
          >
            <div
              class="tab-content"
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
              />
              <div
                class="tab-item"
                v-for="(item) in outItem.tradeAreaList"
                :id="'tab-item.'+item.id"
                :key="item.id"
                :track-by="item.id"
              >
                <div
                  class="inner-item-box"
                  v-if="(item.content.length&&item.id!==searchAreaId)||(item.id==searchAreaId&&searchKeyWord!=='')"
                  :style="'height:'+(50*(item.content.length||1)+102)+'px'"
                  :class="{
                  'force-height':!(item.id==searchAreaId||item.id==collectAreaId),
                  'max-height':true
                  }"
                >
                  <!--单个交易区-->
                  <HomeMarketTableItem
                    :collectAreaId="collectAreaId"
                    :searchAreaId="searchAreaId"
                    :collectStatusList="collectStatusList"
                    :item="item"
                    :collectSymbol="collectSymbol"
                    @toggleCollect="toggleCollect"
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
                  @click="toggleTabContentHeightStatus"
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
        <el-input
          v-model="searchKeyWord"
          :placeholder="$t('M.comm_search')"
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
import HomeMarketTableItem from '../Home/HomeMarketTableItem'
import socket from '../../utils/datafeeds/socket'
import {
  getStore,
  setStore,
  unzip
} from '../../utils'
import {
  // splitSocketParams
  toggleUserCollection,
  getCollectionList,
  setSocketData,
  getNestedData
} from '../../utils/commonFunc'
import {
  getHomeMarketByAjax
  // getCollectionListAjax
} from '../../utils/api/home'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  components: {
    IconFontCommon,
    Footer,
    EchartsLineCommon,
    HomeMarketTableItem
  },
  data () {
    return {
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
      moreBtnShowStatus: true, // 查看更多按钮显示状态
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
      newSymbolIndexMap: new Map()
    }
  },
  async created () {
    if (this.language) {
      await this.getHomeMarketByAjax()
    }
    this.changeIsShowStatus()
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
  },
  methods: {
    ...mapMutations([
      'CHANGE_COLLECT_LIST',
      'CHANGE_COLLECT_SYMBOL',
      'CHANGE_SYMBOL_MAP',
      'CHANGE_ACTIVE_TRADE_AREA'
    ]),
    setCollectData (collectSymbol) {
      this.CHANGE_COLLECT_SYMBOL({
        type: 'reset',
        collectSymbol
      })
      let newContent = []
      _.forEach(collectSymbol, outItem => {
        if (this.symbolMap.get(outItem)) {
          newContent.push(this.symbolMap.get(outItem))
        }
      })
      this.$set(this.collectArea, 'content', newContent)
    },
    // 拼接socket参数
    concatSocketParamsStr (activeIndexOfNewMarketList) {
      this.socketParamsStr = ''
      let currentList = this.newMarketList[activeIndexOfNewMarketList]
      if (currentList && currentList.tradeAreaList) {
        _.forEach(currentList.tradeAreaList, outItem => {
          _.forEach(outItem.content, item => {
            this.socketParamsStr += `${item.id}@`
          })
        })
        _.forEach(this.collectArea.content, item => {
          if (item) {
            this.socketParamsStr += `${item.id}@`
          }
        })
        this.socketParamsStr = this.socketParamsStr.slice(0, this.socketParamsStr.length - 1)
      }
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
          let {buyCoinName, tradeName} = newData

          let areaMap = this.newTradeAreaIndexMap.get(this.activeIndex)
          if (!areaMap) return false
          const areaIndex = areaMap.get(buyCoinName)
          let contentMap = this.newSymbolIndexMap.get(this.activeIndex).get(buyCoinName)
          if (!contentMap) return false
          const contentIndex = this.newSymbolIndexMap.get(this.activeIndex).get(buyCoinName).get(tradeName)
          const newContent = {...this.newMarketList[this.activeIndex].tradeAreaList[areaIndex].content[contentIndex], ...newData}
          this.$set(this.newMarketList[this.activeIndex].tradeAreaList[areaIndex].content, contentIndex, newContent)
          this.getFilterMarketList()
          //  自选区
          _.forEach(this.collectArea.content, (item, index) => {
            let newContent = item
            if (item && item.tradeId === newData.tradeId) {
              setSocketData(
                newContent,
                newData,
                this.collectArea.content,
                index,
                this
              )
              return false
            }
          })
        }
      })
    },
    // 更改当前交易对
    changeActiveSymbol (e) {
      this.SET_JUMP_STATUS(true)
      this.SET_JUMP_SYMBOL(e)
      // 设置当前交易区
      const id = e.areaId
      const name = e.area
      this.CHANGE_ACTIVE_TRADE_AREA({
        id,
        name
      })
      this.$goToPage('/TradeCenter')
    },
    // 获取用户收藏列表
    async getCollectionList (collectSymbol) {
      await getCollectionList(data => {
        _.forEach(data.data, item => {
          collectSymbol[item.content] = item.content
        })
      })
    },
    // 首次链接接口获取行情数据
    async getHomeMarketByAjax () {
      const params = {
        i18n: this.language
      }
      const data = await getHomeMarketByAjax(params)
      let objData = getNestedData(data, 'data.obj')
      this.newMarketList = JSON.parse(unzip(objData))
      this.activeName = getNestedData(this.newMarketList[0], 'plateId')
      this.activeIndex = 0
      let collectSymbol = {}
      if (!this.isLogin) {
        collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
      } else {
        await this.getCollectionList(collectSymbol)
      }
      this.setCollectData(collectSymbol)
      this.concatSocketParamsStr(this.activeIndex)
      this.getFilterMarketList()

      _.forEach(this.newMarketList, (plateItem, plateIndex) => {
        this.marketMap.set(plateIndex, new Map())
        this.newTradeAreaIndexMap.set(plateIndex, new Map())
        this.newSymbolIndexMap.set(plateIndex, new Map())
        _.forEach(plateItem.tradeAreaList, (tradeAreaItem, tradeAreaIndex) => {
          this.marketMap.get(plateIndex).set(tradeAreaItem.area, new Map())
          this.newTradeAreaIndexMap.get(plateIndex).set(tradeAreaItem.area, tradeAreaIndex)
          this.newSymbolIndexMap.get(plateIndex).set(tradeAreaItem.area, new Map())
          _.forEach(tradeAreaItem.content, (contentItem, contentIndex) => {
            this.marketMap.get(plateIndex).get(tradeAreaItem.area).set(contentItem.id, contentItem)
            this.newSymbolIndexMap.get(plateIndex).get(tradeAreaItem.area).set(contentItem.id, contentIndex)
            this.CHANGE_SYMBOL_MAP({
              key: contentItem.id,
              val: contentItem
            })
          })
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
    changeTab (e) {
      this.searchFromMarketList()
      this.changeIsShowStatus()
    },
    // 是否显示查看更多按钮
    changeIsShowStatus () {
      let activeMarketList = this.newMarketList.filter(item => item.plateId == this.activeName)[0]
      let targetList = getNestedData(activeMarketList, 'tradeAreaList') || []
      this.moreBtnShowStatus = targetList.length > 2 ? 1 : 0
    },
    // market过滤
    getFilterMarketList () {
      let list = _.cloneDeep(this.newMarketList)
      if (!this.tabContentMoreStatus) {
        this.filterMarketList = list
        for (let k = 0; k < list.length; k++) {
          let newList = list[k].tradeAreaList.slice(0, 2)
          this.$set(this.filterMarketList[k], 'tradeAreaList', newList)
        }
      } else if (this.tabContentMoreStatus) {
        this.filterMarketList = this.newMarketList
      }
    },
    // 搜索关键字e
    searchFromMarketList () {
      this.searchList = []
      this.searchArea.content = this.searchList
      if (this.searchKeyWord.trim() !== '') {
        this.symbolMap.forEach(item => {
          if (item.plateId === this.activeName) {
            const result1 = item.sellsymbol.search(this.searchKeyWord.toUpperCase())
            const result2 = item.sellname.search(this.searchKeyWord)
            if (result1 !== -1 || result2 !== -1) {
              this.searchList.push(item)
            }
          }
        })
        this.searchArea.content = this.searchList
      } else {
        this.searchArea.content = []
      }
    },
    // 切换查看更多
    toggleTabContentHeightStatus () {
      this.itemAreaMoreStatus = false
      this.tabContentMoreStatus = !this.tabContentMoreStatus
      this.toggleViewMoreBtnText()
      this.getFilterMarketList()
    },
    // 切换 查看更多按钮文字
    toggleViewMoreBtnText () {
      this.moreBtnText = this.tabContentMoreStatus ? 'M.comm_pack_up' : 'M.comm_view_more'
    },
    // 切换收藏
    async toggleCollect (data) {
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
      this.tabChangeCount++
      _.forEach(this.newMarketList, (item, index) => {
        if (item.plateId === newVal) {
          this.activeIndex = index
          return false
        }
      })
      this.concatSocketParamsStr(this.activeIndex)
    },
    async language (newVal) {
      this.collectArea.area = this.$t('M.home_market_district')
      this.searchArea.area = this.$t('M.home_market_field_search')
      if (newVal) {
        await this.getHomeMarketByAjax()
      }
    },
    socketParamsStr (newVal, oldVal) {
      if (oldVal) {
        this.subscribeSocket('CANCEL', oldVal)
      }
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
        overflow: hidden;

        /deep/ {
          .el-input__inner {
            width: 195px;
          }
        }
      }

      &::before {
        position: absolute;
        top: 9px;
        right: 0;
        width: 70px;
        height: 30px;
        background-color: $mainColor;
        content: '';

        /* z-index: 1; */
      }

      &::after {
        position: absolute;
        z-index: 1;
        top: 14px;
        right: 69px;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        content: '';
        border-right: 10px solid $mainColor;
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
              max-height: 560px;
            }

            &.force-height {
              height: 560px !important;
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

          th,
          tr {
            background-color: transparent;
          }
        }

        /* 选中行颜色 */
        .el-table--enable-row-hover {
          .el-table__body tr {
            &:hover {
              > td {
                background-color: #282a3c;
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

      /deep/ {
        /* 选中行颜色 */
        .el-table--enable-row-hover .el-table__body tr:hover > td {
          background-color: #eaf2fa;
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
        height: 49px;
        padding: 0;
      }

      .el-table {
        th {
          box-sizing: border-box;
          height: 38px;
          padding: 0 0 0 14px;
          border-top: 1px solid #2f3a8c;
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
