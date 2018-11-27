<template>
  <div
    class="kline-container"
  >
    <!--<div-->
      <!--id="tv_chart_container"-->
      <!--:class="{'day':theme == 'day','night':theme == 'night' }"-->
    <!--&gt;-->
    <!--</div>-->
    <div
      id="tv_chart_container"
      :class="{'day':theme == 'day','night':theme == 'night' }"
      :style="{
        opacity: !fullscreenLoading ? 1:0
      }"
    >
    </div>
    <div
      class="loading-box"
      v-if="fullscreenLoading"
      v-loading.lock="fullscreenLoading"
      element-loading-background="rgb(28, 31, 50)"
    >
    </div>
  </div>
</template>

<script>
import { widget as TvWidget } from '../../../static/tradeview/charting_library/charting_library.min.js'
import socket from '../../utils/datafeeds/socket'
import datafeeds from '../../utils/datafeeds/datafees'
import {
  overrides,
  disabledFeatures,
  studiesOverrides,
  kLineBtnList
} from '../../../static/js/klineOptions'
import {
  getDefaultSymbol,
  getActiveSymbolDataAjax,
  // getTradeMarketDataAjax,
  getKlineDataAjax
} from '../../utils/api/trade'
// import {
//   getCollectionListAjax
// } from '../../utils/api/home'
import {
  returnAjaxMsg,
  getNestedData
  // getCollectionList
} from '../../utils/commonFunc'
import {
  unzip
} from '../../utils'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('common')
export default {
  components: {},
  // props,
  data () {
    return {
      widget: null,
      socket: new socket(),
      datafeeds: new datafeeds(this),
      symbol: null,
      interval: null,
      cacheData: {},
      lastTime: null,
      getBarTimer: null,
      isLoading: true,
      options: {
        // symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
        symbol: 'ETCFBT',
        previousSymbol: '', // 上一个交易对（取消用）
        interval: 1,
        // paneProperties: this.paneProperties
        paneProperties: {
          background: '',
          vertGridProperties: {
            color: ''
          },
          horzGridProperties: {
            color: ''
          }
        }
      }, // K线请求参数
      socketData: {}, // socket 数据
      ajaxData: {}, // 接口请求数据
      resolutions: ['min', 'min5', 'min15', 'min30', 'hour1', 'hour4', 'day', 'week'],
      fullscreenLoading: true,
      loadingCount: 0, // loading 次数
      KlineNum: 0, // 拖拽k线档数
      isAllowDrag: true, // 是否允许拖拽
      defaultButton: null // 默认buttonDom
    }
  },
  beforeCreate () {
  },
  created () {
    // require('../../../static/charting_library/static/css/t-night.css')
    require('../../../static/css/theme/day/Trade/KlieneDay.css')
    // this.widget = null
    console.log(this.socket)
    this.socket.doOpen()
    // 获取默认交易对
    this.getDefaultSymbol()
  },
  mounted () {
    this.initKLine(this.symbol)
  },
  activited () {
  },
  update () {},
  beforeRouteUpdate () {},
  destroyed () {
    this.socket.destroy()
    this.widget = null
  },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVE_SYMBOL',
      'CHANGE_SOCKET_AND_AJAX_DATA'
    ]),
    // 接口获取K线数据
    async getKlineByAjax (tradeName, KlineType, KlineNum = 0, KlineStep = 'STEP5') {
      this.isAllowDrag = false
      const params = {
        tradeName,
        KlineType,
        KlineNum,
        KlineStep
      }
      const data = await getKlineDataAjax(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.isAllowDrag = true
        console.log(data)
        let klineData = getNestedData(data, 'data.data.obj')
        klineData = JSON.parse(unzip(klineData))
        console.log(klineData)
        let klineList = getNestedData(klineData, 'klineList')
        if (klineList) {
          this.KlineNum = klineData.num
          let list = []
          const ticker = `${this.symbol}-${this.interval}`
          switch (KlineNum) {
            case 0:
              console.log(klineData)
              console.log(this.KlineNum)
              console.log(ticker)
              klineList.forEach((element) => {
                list.push({
                  time: element.time - 0,
                  open: element.open,
                  high: element.high,
                  low: element.low,
                  close: element.close,
                  volume: element.volume
                })
              })
              this.cacheData[ticker] = list
              console.log(list)
              this.lastTime = getNestedData(list[list.length - 1], 'time')
              break
            default:
              console.log(klineData)
              let reflashList = []
              klineList.forEach((element, index) => {
                // console.log(item)
                reflashList.push({
                  time: element.time - 0,
                  open: element.open,
                  high: element.high,
                  low: element.low,
                  close: element.close,
                  volume: element.volume
                })
              })
              // let newSet = new Set()
              // console.log(ticker)
              let newList = reflashList.concat(this.cacheData[ticker])
              console.log(newList)
              this.cacheData[ticker] = newList
              console.log(reflashList)
              console.log(this.cacheData[ticker])
              break
          }
        }
      }
    },
    // 获取当前交易对socket数据
    async getActiveSymbolData (tradeName) {
      let params = {
        i18n: this.language
      }
      params.tradeName = tradeName
      const data = await getActiveSymbolDataAjax(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        let activeSymbolData = getNestedData(data, 'data.data.obj')
        activeSymbolData = JSON.parse(unzip(activeSymbolData))
        console.log(activeSymbolData)
        let {
          defaultTrade, // 默认交易对
          depthList, // 买卖单、深度
          tradeList, // 交易记录
          tickerList // 行情交易区列表
        } = activeSymbolData
        if (depthList.depthData.sells.list) {
          depthList.depthData.sells.list.reverse()
        }
        // 默认交易对 数据
        this.$store.commit('trade/SET_MIDDLE_TOP_DATA', defaultTrade.content[0])
        // 买卖单
        this.ajaxData.buyAndSellData = depthList.depthData
        // 交易记录
        this.ajaxData.tardeRecordList = tradeList
        // 深度图
        this.ajaxData.depthData = depthList.depthResult

        // 行情交易区列表
        this.ajaxData.tradeMarketList = tickerList

        this.CHANGE_SOCKET_AND_AJAX_DATA({
          ajaxData: this.ajaxData,
          type: 'ajax'
        })
      }
    },
    // k线初始化
    initKLine (symbol) {
      this.loadingCount = 0
      this.fullscreenLoading = true
      // console.log(this.fullscreenLoading)
      // this.resetKlineAjaxAndSocketData()
      this.widget = null
      this.socket.on('message', this.onMessage)
      this.options.symbol = symbol
      this.options.areaId = this.activeTabId
      this.options.paneProperties.background = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.paneProperties.vertGridPropertiesColor = this.theme === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)'
      this.options.interval = '1'
      this.options.language = this.language
      this.init(this.options)
      this.getBars()
    },
    // 获取初始交易对
    async getDefaultSymbol () {
      const data = await getDefaultSymbol()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        const obj = getNestedData(data, 'data.data')
        const activeSymbol = {
          id: (obj.sellCoinName + obj.buyCoinName).toLowerCase(),
          tradeId: obj.id,
          sellsymbol: obj.sellCoinName, // 币种简称
          sellname: obj.buyCoinName, // 币种全程
          area: obj.buyCoinName, // 交易区
          areaId: obj.tradeAreaId
        }
        // 是否从其他页面跳转
        this.finalSymbol = this.isJumpToTradeCenter ? this.jumpSymbol : activeSymbol
        this.CHANGE_ACTIVE_SYMBOL({activeSymbol: this.finalSymbol})
        this.symbol = getNestedData(this.activeSymbol, 'id')
        await this.getActiveSymbolData(this.symbol)
      }
    },
    init (options) {
      if (!this.widget) {
        this.widget = new TvWidget({
          // width: '100%',
          // height: '100%',
          symbol: options.symbol,
          interval: options.interval,
          // fullscreen: true,
          autosize: true,
          container_id: 'tv_chart_container',
          datafeed: this.datafeeds,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: disabledFeatures,
          enabled_features: [
            // 'hide_left_toolbar_by_default' // 隐藏左侧边栏
          ],
          // loading_screen: { backgroundColor: '#000000' },
          timezone: 'Asia/Shanghai',
          locale: options.language,
          debug: false,
          toolbar_bg: 'transparent', // 工具栏背景色
          studies_overrides: studiesOverrides,
          overrides: Object.assign({}, overrides, {
            // 'paneProperties.background': '#10172d', // 背景色
            'paneProperties.background': options.paneProperties.background, // 背景色
            'paneProperties.vertGridProperties.color': options.paneProperties.vertGridPropertiesColor, // 列分割线
            'paneProperties.horzGridProperties.color': options.paneProperties.vertGridPropertiesColor // 行分割线
          }),
          custom_css_url: '../../../../static/tradeview/klineTheme.css'
        })
        this.widget.onChartReady(() => {
          const _self = this
          let chart = _self.widget.chart()
          const btnList = [{
            class: 'resolution_btn',
            label: this.$t('M.trade_time_share'), // 分时
            resolution: '1',
            chartType: 3
          }].concat(kLineBtnList)
          chart.onIntervalChanged().subscribe(null, function (interval, obj) {
            _self.widget.changingInterval = false
          })

          btnList.forEach(function (item, index) {
            let button = _self.widget.createButton({
              align: 'left'
            })
            // console.log(button)
            item.resolution === _self.widget._options.interval && _self.updateSelectedIntervalButton(button)
            const selected = index == 1 ? ' selected' : ''
            button.attr('class', 'button ' + item.class + selected + ' add' + index)
              .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
              .on('click', function (e) {
                // if (!_self.widget.changingInterval && !button.hasClass('selected')) {
                let chartType = +button.attr('data-chart-type')
                if (chart.resolution() !== item.resolution) {
                  // _self.widget.changingInterval = true
                  // console.log(item.resolution)
                  chart.setResolution(item.resolution)
                }
                if (chart.chartType() !== chartType) {
                  chart.setChartType(chartType)
                }
                _self.updateSelectedIntervalButton(button)
                // }
              })
              .append(item.label)
          })
          setTimeout(() => {
            let iframe$ = document.getElementsByTagName('iframe')[0].contentWindow.$
            let lastBtnList = iframe$('.header-chart-panel-content .left')[0].childElementCount
            // console.log(iframe$('.header-chart-panel-content .left .group.space-single .add0').length)
            // let repeatCount = iframe$('.header-chart-panel-content .left .group.space-single .add0').length
            // for (let j = 0; j < repeatCount - 1; j++) {
            //   for (let k = 0; k < 9; k++) {
            //     iframe$.remove(iframe$(`.header-chart-panel-content .left .group.space-single .add${i}`).parentNode)
            //   }
            // }
            // console.log(lastBtnList)
            if (lastBtnList.length > 13) {
              for (let i = 2; i < lastBtnList.length - 9; i++) {
                iframe$.remove(`add${i}`)
              }
            }
          }, 10)
          this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7b53a7'})
          this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#6b89ae'})
          this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#55ae63'})
          this.widget.chart().createStudy('Moving Average', false, true, [60, 'close', 0], null, {'Plot.color': '#89226e'})

          // K线图指针移动回调
          this.widget.chart().crossHairMoved(async (e) => {
            // console.log(e)
            const currentTime = e.time * 1000
            const ticker = `${this.symbol}-${this.interval}`
            // console.log(this.cacheData[ticker][50].time)
            const limitTime = this.cacheData[ticker][50].time
            // console.log(currentTime, limitTime)

            const timeDiff = currentTime - limitTime
            // console.log(timeDiff, this.KlineNum, this.interval)
            if (timeDiff < 0 && this.KlineNum > 1 && this.isAllowDrag) {
              let interval = this.transformInterval(this.interval)
              this.getKlineByAjax(this.symbol, interval, this.KlineNum - 1)
            }
          })
        })
        this.symbol = options.symbol
        console.log(this.symbol)
        this.interval = options.interval
      }
    },
    // 修改样式
    applyOverrides: function (overrides) {
      this.widget.applyOverrides(overrides)
    },
    // 切换时间间隔
    updateSelectedIntervalButton (button) {
      console.log(button)
      this.widget.selectedIntervalButton && this.widget.selectedIntervalButton.removeClass('selected')
      button.addClass('selected')
      this.widget.selectedIntervalButton = button
    },
    unSubscribe (interval) {
      let newInterval = this.transformInterval(interval)
      if (newInterval) {
        this.getKlineDataBySocket('CANCEL', this.symbol, newInterval)
      }
    },
    // 时间区间格式转换
    transformInterval (interval) {
      let newInterval
      switch (interval) {
        case '1':
          newInterval = 'min'
          break
        case '5':
          newInterval = 'min5'
          break
        case '15':
          newInterval = 'min15'
          break
        case '30':
          newInterval = 'min30'
          break
        case '60':
          newInterval = 'hour1'
          break
        case '240':
          newInterval = 'hour4'
          break
        case '1D':
          newInterval = 'day'
          break
        case 'D':
          newInterval = 'week'
          break
      }
      return newInterval
    },
    onMessage (data) {
      console.log(data)
      switch (data.tradeType) {
        case 'KLINE':
          console.log(data.data[0])
          // console.log(' >> sub:', data.type)
          const klineData = data.data[0]
          console.log(klineData.close)
          const ticker = `${this.symbol}-${this.interval}`
          // console.log(this.interval)
          // console.log(this.cacheData[ticker][this.cacheData[ticker].length - 1].time - klineData.time)
          console.log(klineData.time)
          const barsData = {
            time: klineData.time - 0,
            // time: this.lastTime,
            open: klineData.open,
            high: klineData.high,
            low: klineData.low,
            close: klineData.close,
            volume: klineData.volume
          }
          let timeDiff = this.cacheData[ticker][this.cacheData[ticker].length - 1].time - klineData.time

          if (!timeDiff) {
            this.cacheData[ticker][this.cacheData[ticker].length - 1] = barsData
          } else {
            this.cacheData[ticker].push(barsData)
          }
          this.datafeeds.barsUpdater.updateData()
          break
        // 买卖单
        case 'DEPTH':
          console.log(data)
          const depthData = getNestedData(data, 'data')
          console.log(depthData)
          if (depthData.sells && depthData.sells.list) {
            depthData.sells.list.reverse()
          }
          this.socketData.buyAndSellData = depthData
          break
        // 深度图
        case 'DEPTHRENDER':
          console.log(data)
          this.socketData.depthData = getNestedData(data, 'data')
          break
        case 'TRADE':
          this.socketData.tardeRecordList = getNestedData(data, 'data')
          break
        case 'TICKER':
          console.log(data)
          this.socketData.tradeMarkeContentItem = getNestedData(data, 'data')
          console.log(this.socketData.tradeMarkeContentItem)
          break
      }
      // console.log(this.socketData)
      this.CHANGE_SOCKET_AND_AJAX_DATA({
        'socketData': this.socketData,
        'type': 'socket'
      })
    },
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      // symbolInfo.pricescale = 100000
      // console.log(' >> :', rangeStartDate, rangeEndDate)
      if (resolution && this.interval && (this.interval != resolution)) {
        this.unSubscribe(this.interval)
        this.interval = resolution
        this.options.interval = resolution
        // this.interval = 'min15'
        let newInterval = this.transformInterval(resolution)
        console.log(1)
        this.KlineNum = 0
        this.subscribeSocketData(this.symbol, newInterval)
      }
      const ticker = `${this.symbol}-${this.interval}`
      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        console.log(this.cacheData[ticker])
        this.isLoading = false
        const newBars = []
        this.cacheData[ticker].forEach(item => {
          // if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
          newBars.push(item)
          // }
        })
        if (onLoadedCallback) {
          onLoadedCallback(newBars)
        }
      } else {
        const self = this
        this.getBarTimer = setTimeout(function () {
          self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 1)
      }
    },
    // 请求socket
    getKlineDataBySocket (type, symbol, newInterval) {
      console.log(newInterval)
      if (newInterval) {
        // k线
        this.socket.send({
          'tag': type,
          'content': `market.${symbol}.kline.${newInterval}.step5`,
          'id': `kline_${symbol}`
        })
      }
    },
    // 获取交易记录socket
    getTradeRecordBySocket (type, symbol) {
      // 交易记录
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.trade`,
        'id': `trade_${symbol}`
      })
    },
    // 获取买卖单
    getBuyAndSellBySocket (type, symbol) {
      // 买卖单
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.depth.step1`,
        'id': `depth_${symbol}`
      })
    },
    // 深度图
    getDepthDataBySocket (type, symbol) {
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.depthrender`,
        'id': `market_001`
      })
    },
    // 获取币币交易市场 socket
    getTradeMarketBySocket (type, params) {
      // 币币交易市场
      this.socket.send({
        'tag': type,
        'content': `market.${params}.ticker`,
        'id': `market_001`
      })
    },
    // 订阅消息
    subscribeSocketData (symbol, interval = 'min') {
      this.getKlineByAjax(symbol, interval, this.KlineNum)
      this.getKlineDataBySocket('SUB', symbol, interval)
      this.getTradeMarketBySocket('SUB', this.activeTabSymbolStr)
      this.getBuyAndSellBySocket('SUB', symbol)
      this.getDepthDataBySocket('SUB', symbol)
      this.getTradeRecordBySocket('SUB', symbol)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      symbolMap: state => state.home.symbolMap, // 交易对map
      theme: state => state.common.theme,
      language: state => state.common.language,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id,
      activeTradeArea: state => state.common.activeTradeArea,
      activeTabSymbolStr: state => state.trade.activeTabSymbolStr,
      mainColor: state => state.common.mainColor,
      isJumpToTradeCenter: state => state.trade.isJumpToTradeCenter,
      jumpSymbol: state => state.trade.jumpSymbol
    })
  },
  watch: {
    KlineNum (newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    theme (newVal) {
      // 更新K线主题
      this.widget.applyOverrides({
        'paneProperties.background': this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor,
        'paneProperties.vertGridProperties.color': this.theme === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)', // 行分割线
        'paneProperties.horzGridProperties.color': this.theme === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)' // 列分割线
      })
    },
    language () {
      this.initKLine(this.symbol)
    },
    async activeSymbolId (newVal, oldVal) {
      this.initKLine(newVal)
      this.KlineNum = 0
    },
    // 切换tab栏重新订阅
    activeTabSymbolStr (newVal, oldVal) {
      if (oldVal) {
        this.getTradeMarketBySocket('CANCEL', oldVal)
      }
      console.log(newVal)
      this.getTradeMarketBySocket('SUB', newVal)
    },
    resolutions (newVal, oldVal) {
      console.log(newVal)
    },
    symbol (newVal, oldVal) {
      if (oldVal) {
        this.resolutions.forEach((item) => {
          console.log(item)
          this.getKlineDataBySocket('CANCEL', oldVal, item)
        })
        this.getBuyAndSellBySocket('CANCEL', oldVal)
        this.getDepthDataBySocket('CANCEL', oldVal)
        this.getTradeRecordBySocket('CANCEL', oldVal)
      }
      this.getActiveSymbolData(newVal)
      console.log(newVal)
      this.subscribeSocketData(newVal)
      if (!this.loadingCount) {
        setTimeout(() => {
          this.fullscreenLoading = false
          this.loadingCount++
          console.log(this.fullscreenLoading)
        }, 600)
      }
      // let iframe$ = document.getElementsByTagName('iframe')[0].contentWindow.$
      // // let lastBtnList = iframe$('.header-chart-panel-content .left')[0].childElementCount
      // console.log(iframe$('.header-chart-panel-content .left .group.space-single .add0'))
    },
    interval (newVal, oldVal) {
      console.log(newVal)
      this.KlineNum = 0
    },
    activeTradeArea (newVal, oldVal) {
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  .kline-container{
    overflow: hidden;
    width:100%;
    height:355px;
    position: relative;
    #tv_chart_container {
      width: 100%;
      height: 355px;
      &.night {
        background-color: $mainContentNightBgColor;
      }
      &.day{
        background-color: #fff;
      }
    }
    .loading-box{
      width:101%;
      height:355px;
      position: absolute;
      top:0;
      right:0;
      z-index: 15;
    }
  }
</style>
