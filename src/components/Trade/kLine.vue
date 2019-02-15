`
<template>
  <div
    class="kline-container"
  >
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
import {widget as TvWidget} from '../../../static/tradeview/charting_library/charting_library.min.js'
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
import {
  getNestedData
  // getCollectionList
} from '../../utils/commonFunc'
import {
  unzip
} from '../../utils'
import {
  mapMutations,
  mapState
} from 'vuex'

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
      klineInitCount: 0, // k线初始化次数
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
  async created () {
    // this.widget = null
    console.log(this.socket)
    this.socket.doOpen()
    // 获取默认交易对
    await this.getDefaultSymbol()
  },
  mounted () {
    this.initKLine(this.symbol)
  },
  activated () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  destroyed () {
    this.socket.destroy()
    this.widget = null
  },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVE_SYMBOL',
      'CHANGE_SOCKET_AND_AJAX_DATA',
      'SET_IS_KLINE_DATA_READY',
      'SET_MIDDLE_TOP_DATA',
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS'
    ]),
    changeIsKlineDataReady (status) {
      this.SET_IS_KLINE_DATA_READY(status)
    },
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
      if (!data) return false
      this.isAllowDrag = true
      let klineData = getNestedData(data, 'data.obj')
      klineData = JSON.parse(unzip(klineData))
      let klineList = getNestedData(klineData, 'klineList')
      if (klineList) {
        this.KlineNum = klineData.num
        let list = []
        const ticker = `${this.symbol}-${this.interval}`
        switch (KlineNum) {
          case 0:
            klineList.forEach(item => {
              list.push({
                time: item.time - 0,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
              })
            })
            this.cacheData[ticker] = list
            this.lastTime = getNestedData(list[list.length - 1], 'time')
            break
          default:
            console.log(klineData)
            let reflashList = []
            klineList.forEach(item => {
              reflashList.push({
                time: item.time - 0,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
              })
            })
            let newList = reflashList.concat(this.cacheData[ticker])
            this.cacheData[ticker] = newList
            break
        }
      }
      this.fullscreenLoading = false
      setTimeout(() => {
        this.changeIsKlineDataReady(true)
      }, 500)
    },
    // 获取当前交易对socket数据
    async getActiveSymbolData (tradeName) {
      let params = {
        i18n: this.language
      }
      params.tradeName = tradeName
      const data = await getActiveSymbolDataAjax(params)
      console.log(data)
      if (!data) return false
      let resultStr = ''
      let objList = getNestedData(data, 'data.obj')
      _.forEach(objList, objItem => {
        resultStr += unzip(objItem)
      })

      let activeSymbolData = JSON.parse(resultStr)
      let {
        defaultTrade, // 默认交易对
        depthList, // 买卖单、深度
        tradeList, // 交易记录
        tickerList // 行情交易区列表
      } = activeSymbolData
      console.log(activeSymbolData)
      if (depthList && depthList.depthData.sells.list) {
        depthList.depthData.sells.list.reverse()
      }
      // 默认交易对 数据
      const defaultTradeContent = getNestedData(defaultTrade, 'content[0]')
      if (defaultTradeContent) {
        this.SET_MIDDLE_TOP_DATA(defaultTradeContent)
      }
      // 买卖单
      this.ajaxData.buyAndSellData = getNestedData(depthList, 'depthData')
      // 交易记录
      this.ajaxData.tardeRecordList = tradeList
      // 深度图
      this.ajaxData.depthData = getNestedData(depthList, 'depthResult')

      // 行情交易区列表
      this.ajaxData.tradeMarketList = tickerList

      this.CHANGE_SOCKET_AND_AJAX_DATA({
        ajaxData: this.ajaxData,
        type: 'ajax'
      })
    },
    // k线初始化
    initKLine (symbol) {
      this.loadingCount = 0
      this.fullscreenLoading = true
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
      if (!data) return false

      const obj = getNestedData(data, 'data')
      console.log(obj)
      const id = (getNestedData(obj, 'sellCoinName') + getNestedData(obj, 'buyCoinName'))
      if (!id) return false
      const activeSymbol = {
        id: (getNestedData(obj, 'sellCoinName') + getNestedData(obj, 'buyCoinName')).toLowerCase(),
        tradeId: getNestedData(obj, 'id'),
        sellsymbol: getNestedData(obj, 'sellCoinName'), // 币种简称
        sellname: getNestedData(obj, 'buyCoinName'), // 币种全程
        area: getNestedData(obj, 'buyCoinName'), // 交易区
        areaId: getNestedData(obj, 'tradeAreaId')
      }
      // 是否从其他页面跳转
      this.finalSymbol = this.isJumpToTradeCenter ? this.jumpSymbol : activeSymbol
      this.CHANGE_ACTIVE_SYMBOL({activeSymbol: this.finalSymbol})
      this.symbol = getNestedData(this.activeSymbol, 'id')
      if (this.isLogin) {
        this.getUserOrderSocket('SUB', this.symbol)
      }
    },
    init (options) {
      if (!this.widget) {
        this.widget = new TvWidget({
          symbol: options.symbol,
          interval: options.interval,
          autosize: true,
          container_id: 'tv_chart_container',
          datafeed: this.datafeeds,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: disabledFeatures,
          enabled_features: [
            'hide_left_toolbar_by_default' // 隐藏左侧边栏
          ],
          timezone: 'Asia/Shanghai',
          locale: options.language,
          debug: false,
          toolbar_bg: 'transparent', // 工具栏背景色
          studies_overrides: studiesOverrides,
          overrides: Object.assign({}, overrides, {
            'paneProperties.background': options.paneProperties.background, // 背景色
            'paneProperties.vertGridProperties.color': options.paneProperties.vertGridPropertiesColor, // 列分割线
            'paneProperties.horzGridProperties.color': options.paneProperties.vertGridPropertiesColor // 行分割线
          }),
          custom_css_url: '../../../../static/tradeview/klineTheme.css'
        })
        this.widget.onChartReady(() => {
          const _self = this
          // let chart = getNestedData(_self, 'widget.chart()')
          let chart
          console.log(_self.widget.chart)
          if (_self.widget && _self.widget.chart) {
            chart = _self.widget.chart()
          }
          if (!chart) return false
          const btnList = [{
            class: 'resolution_btn',
            label: this.$t('M.trade_time_share'), // 分时
            resolution: '1',
            chartType: 3
          }].concat(kLineBtnList)
          chart.onIntervalChanged().subscribe(null, function (interval, obj) {
            _self.widget.changingInterval = false
          })
          console.log(this.klineInitCount)
          if (!this.klineInitCount) {
            btnList.forEach(function (item, index) {
              let button = _self.widget.createButton({
                align: 'left'
              })
              item.resolution === _self.widget._options.interval && _self.updateSelectedIntervalButton(button)
              const selected = index == 1 ? ' selected' : ''
              button.attr('class', 'button ' + item.class + selected + ' add' + index)
                .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
                .on('click', function (e) {
                  let chartType = +button.attr('data-chart-type')
                  if (chart.resolution() !== item.resolution) {
                    chart.setResolution(item.resolution)
                  }
                  if (chart.chartType() !== chartType) {
                    chart.setChartType(chartType)
                  }
                  _self.updateSelectedIntervalButton(button)
                })
                .append(item.label)
            })
          }
          // let iframe$ = document.getElementsByTagName('iframe')[0].contentWindow.$
          // iframe$('.add7').click()
          // console.log()
          this.klineInitCount++
          this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7b53a7'})
          this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#6b89ae'})
          this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#55ae63'})
          this.widget.chart().createStudy('Moving Average', false, true, [60, 'close', 0], null, {'Plot.color': '#89226e'})

          // K线图指针移动回调
          this.widget.chart().crossHairMoved(async (e) => {
            const currentTime = e.time * 1000
            const ticker = `${this.symbol}-${this.interval}`
            const limitTime = getNestedData(this.cacheData[ticker], '[50].time')

            const timeDiff = currentTime - limitTime
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
      console.dir(button)
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
      // const {symbol} = data
      // if (this.activeSymbol.id !== symbol) return false
      switch (data.tradeType) {
        case 'KLINE':
          console.log(data.data[0])
          // console.log(' >> sub:', data.type)
          const klineData = data.data[0]
          console.log(klineData.close)
          const ticker = `${this.symbol}-${this.interval}`
          console.log(klineData.time)
          const barsData = {
            time: klineData.time - 0,
            open: klineData.open,
            high: klineData.high,
            low: klineData.low,
            close: klineData.close,
            volume: klineData.volume
          }
          let targetData = this.cacheData[ticker]
          if (!targetData) return false
          let timeDiff = getNestedData(targetData[getNestedData(targetData, 'length') - 1], 'time') - getNestedData(klineData, 'time')

          if (!timeDiff) {
            this.cacheData[ticker][targetData.length - 1] = barsData
          } else {
            this.cacheData[ticker].push(barsData)
          }
          this.datafeeds.barsUpdater.updateData()
          break
        // 买卖单
        case 'DEPTH':
          console.log(data)
          // console.log(symbol, this.activeSymbol.id)

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
          break
        case 'USERORDER':
          console.log(data)
          this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
          break
      }
      this.CHANGE_SOCKET_AND_AJAX_DATA({
        'socketData': this.socketData,
        'type': 'socket'
      })
    },
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      if (resolution && this.interval && (this.interval != resolution)) {
        this.unSubscribe(this.interval)
        this.interval = resolution
        this.options.interval = resolution
        let newInterval = this.transformInterval(resolution)
        this.KlineNum = 0
        this.subscribeSocketData(this.symbol, newInterval)
      }
      const ticker = `${this.symbol}-${this.interval}`
      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        // console.log(this.cacheData[ticker])
        this.isLoading = false
        const newBars = []
        this.cacheData[ticker].forEach(item => {
          newBars.push(item)
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
          'id': 'pc'
        })
      }
    },
    // 获取交易记录socket
    getTradeRecordBySocket (type, symbol) {
      // 交易记录
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.trade`,
        'id': 'pc'
      })
    },
    // 获取买卖单
    getBuyAndSellBySocket (type, symbol) {
      // 买卖单
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.depth.step1`,
        'id': 'pc'
      })
    },
    // 深度图
    getDepthDataBySocket (type, symbol) {
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.depthrender`,
        'id': 'pc'
      })
    },
    // 获取币币交易市场 socket
    getTradeMarketBySocket (type, params) {
      if (params) {
        // 币币交易市场
        this.socket.send({
          'tag': type,
          'content': `market.${params}.ticker`,
          'id': 'pc'
        })
      }
    },
    // 委单事实刷新标记
    getUserOrderSocket (type, symbol) {
      if (this.isLogin) {
        this.socket.send({
          'tag': type,
          'content': `market.${symbol}.userorder.${this.userId}`,
          'id': 'pc'
        })
      }
    },
    // 订阅消息
    subscribeSocketData (symbol, interval = 'min') {
      console.log(symbol)
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
      jumpSymbol: state => state.trade.jumpSymbol,
      isLogin: state => state.user.isLogin,
      userId: state => state.user.loginStep1Info.userId
    })
  },
  watch: {
    isLogin (newVal) {
      if (newVal) {
        this.getUserOrderSocket('SUB', newVal)
      }
    },
    KlineNum (newVal, oldVal) {
      console.log(newVal, oldVal)
    },
    theme () {
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
    async activeSymbolId (newVal) {
      this.changeIsKlineDataReady(false)
      this.initKLine(newVal)
      this.KlineNum = 0
      this.klineInitCount = 0
    },
    // 切换tab栏重新订阅
    activeTabSymbolStr (newVal, oldVal) {
      if (oldVal) {
        this.getTradeMarketBySocket('CANCEL', oldVal)
      }
      this.getTradeMarketBySocket('SUB', newVal)
    },
    symbol (newVal, oldVal) {
      if (oldVal) {
        this.resolutions.forEach((item) => {
          this.getKlineDataBySocket('CANCEL', oldVal, item)
        })
        this.getBuyAndSellBySocket('CANCEL', oldVal)
        this.getDepthDataBySocket('CANCEL', oldVal)
        this.getTradeRecordBySocket('CANCEL', oldVal)
        this.getUserOrderSocket('CANCEL', oldVal)
      }
      this.getActiveSymbolData(newVal)
      this.subscribeSocketData(newVal)
      this.getUserOrderSocket('SUB', newVal)
    },
    interval () {
      this.KlineNum = 0
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index';

  .kline-container {
    position: relative;
    width: 100%;
    height: 355px;
    overflow: hidden;

    #tv_chart_container {
      width: 100%;
      height: 355px;

      &.night {
        background-color: $mainContentNightBgColor;
      }

      &.day {
        background-color: #fff;
      }
    }

    .loading-box {
      position: absolute;
      z-index: 15;
      top: 0;
      right: 0;
      width: 101%;
      height: 355px;
    }
  }
</style>
`
