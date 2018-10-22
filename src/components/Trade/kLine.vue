<template>
  <div
    id="tv_chart_container"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
  </div>
</template>

<script>
import { widget as TvWidget } from '../../../static/tradeview/charting_library/charting_library.min.js'
import socket from '../../utils/datafeeds/socket'
import datafeeds from '../../utils/datafeeds/datafees'
import {
  getDefaultSymbol,
  getActiveSymbolDataAjax
  // getTradeMarketDataAjax
} from '../../utils/api/trade'
// import {
//   getCollectionListAjax
// } from '../../utils/api/home'
import {
  returnAjaxMessage
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
      resolutions: ['min', 'min5', 'min15', 'min30', 'hour1', 'hour4', 'day', 'week']
    }
  },
  created () {
    console.log(1)
    // require('../../../static/charting_library/static/css/t-night.css')
    require('../../../static/css/theme/day/Trade/KlieneDay.css')
    // this.widget = null
    // 获取默认交易对
    this.getDefaultSymbol()
  },
  mounted () {
    this.initKLine(this.symbol)
  },
  activited () {
    console.log(2)
  },
  update () {},
  beforeRouteUpdate () {},
  destroyed () {
    console.log('destroy')
    this.socket.destroy()
    this.widget = null
  },
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVE_SYMBOL',
      'CHANGE_SOCKET_AND_AJAX_DATA'
    ]),
    // 获取当前交易对socket数据
    async getActiveSymbolData (tradeName) {
      console.log(tradeName)
      let params = {
        partnerId: this.partnerId,
        i18n: this.language
      }
      params.tradeName = tradeName
      const data = await getActiveSymbolDataAjax(params)
      console.log(data)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        let activeSymbolData = data.data.data.obj
        activeSymbolData = JSON.parse(unzip(activeSymbolData))
        console.log(activeSymbolData)
        let {
          defaultTrade, // 默认交易对
          depthList, // 买卖单、深度
          tradeList, // 交易记录
          tickerList // 行情交易区列表
        } = activeSymbolData
        console.log(depthList)
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
        this.socket.doOpen()
        this.socket.on('open', () => {
          this.getKlineDataBySocket('REQ', this.symbol, 'min')
          this.getKlineDataBySocket('SUB', this.symbol, 'min')
          this.getTradeMarketBySocket('SUB', this.activeTabSymbolStr)
          this.getBuyAndSellBySocket('SUB', this.symbol)
          this.getDepthDataBySocket('SUB', this.symbol)
          this.getTradeRecordBySocket('SUB', this.symbol)
          this.socket.on('message', this.onMessage)
        })
      }
    },
    // k线初始化
    initKLine (symbol) {
      this.widget = null
      this.socket.on('message', this.onMessage)
      this.options.symbol = symbol
      this.options.areaId = this.activeTabId
      this.options.paneProperties.background = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.paneProperties.vertGridPropertiesColor = this.theme === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)'
      this.options.interval = '1'
      this.options.language = this.language
      console.log(this.language)
      this.init(this.options)
      this.getBars()
    },
    // 获取初始交易对
    async getDefaultSymbol () {
      const data = await getDefaultSymbol()
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        const obj = data.data.data
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
        this.symbol = this.activeSymbol.id
        console.log(this.symbol)
        this.getActiveSymbolData(this.symbol)
      }
    },
    init (options) {
      if (!this.widget) {
        this.widget = new TvWidget({
          width: '100%',
          height: '100%',
          symbol: options.symbol,
          interval: options.interval,
          // fullscreen: true,
          container_id: 'tv_chart_container',
          datafeed: this.datafeeds,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: [
            'header_symbol_search',
            'use_localstorage_for_settings',
            'header_symbol_search', // 禁止头部搜索
            'header_interval_dialog_button',
            'show_interval_dialog_on_key_press',
            'symbol_search_hot_key',
            'study_dialog_search_control',
            'display_market_status',
            'header_compare',
            'edit_buttons_in_legend',
            'symbol_info',
            'border_around_the_chart',
            'main_series_scale_menu',
            'star_some_intervals_by_default',
            'datasource_copypaste',
            'right_bar_stays_on_scroll',
            'context_menus',
            'go_to_date',
            'compare_symbol',
            'border_around_the_chart',
            'timezone_menu',
            'volume_force_overlay', // 成交量上移
            'move_logo_to_main_pane', //
            'timeframes_toolbar', // 底部栏时间
            'header_undo_redo',
            'header_chart_type',
            'header_screenshot'
            // 'header_settings'
            // 'widget_logo',
          ],
          enabled_features: [
            'hide_left_toolbar_by_default' // 隐藏左侧边栏
          ],
          timezone: 'Asia/Shanghai',
          locale: options.language,
          debug: false,
          toolbar_bg: 'transparent', // 工具栏背景色
          studies_overrides: {
            'volume.volume.color.0': '#EC5E5E', // 成交量 k柱 背景色
            'volume.volume.color.1': '#008069', // 成交量 k柱 背景色
            'volume.volume.transparency': 100,
            'moving average.precision': 8
          },
          overrides: {
            // 'paneProperties.background': '#10172d', // 背景色
            'paneProperties.background': options.paneProperties.background, // 背景色
            'paneProperties.vertGridProperties.color': options.paneProperties.vertGridPropertiesColor, // 列分割线
            'paneProperties.horzGridProperties.color': options.paneProperties.vertGridPropertiesColor, // 行分割线
            'symbolWatermarkProperties.transparency': 90,
            // "scalesProperties.textColor": "#AAA",
            // "scalesProperties.backgroundColor": "#ff00ff",
            'scalesProperties.lineColor': '#61688a', // 右侧边框颜色
            'scalesProperties.textColor': '#61688a', // 左上角文字颜色
            'mainSeriesProperties.candleStyle.upColor': '#d45858', // k 柱颜色
            'mainSeriesProperties.candleStyle.downColor': '#008069', // k 柱颜色
            'mainSeriesProperties.candleStyle.borderUpColor': '#d45858', // k 柱边框颜色
            'mainSeriesProperties.candleStyle.borderDownColor': '#008069', // k 柱边框颜色
            // "mainSeriesProperties.candleStyle.wickColor": "#737375",
            'mainSeriesProperties.candleStyle.wickUpColor': '#d45858', // 上涨 蜡烛线颜色
            'mainSeriesProperties.candleStyle.wickDownColor': '#008069', // 下降 蜡烛线颜色
            // "mainSeriesProperties.hollowCandleStyle.borderColor": "#000",
            // "mainSeriesProperties.hollowCandleStyle.borderUpColor": "#ff00ff",
            // "mainSeriesProperties.haStyle.borderUpColor": "#00f",
            // "mainSeriesProperties.areaStyle.color1": "#0f0",
            // "mainSeriesProperties.areaStyle.color2": "yellow",
            // 'paneProperties.legendProperties.showStudyTitles': false,
            'mainSeriesProperties.areaStyle.color1': '#0cbef3',
            'mainSeriesProperties.areaStyle.color2': '#0098c4',
            'mainSeriesProperties.areaStyle.linecolor': '#4e5b85',
            'mainSeriesProperties.areaStyle.linestyle': 0,
            'mainSeriesProperties.areaStyle.linewidth': 1,
            'mainSeriesProperties.areaStyle.priceSource': 'close',
            'mainSeriesProperties.areaStyle.transparency': 80,
            'paneProperties.legendProperties.showLegend': false // 默认收起
          },
          custom_css_url: '../../../../static/tradeview/klineTheme.css'
        })
        console.log(this.widget)
        this.widget.onChartReady(() => {
          const _self = this
          let chart = _self.widget.chart()
          const btnList = [
            {
              class: 'resolution_btn',
              label: this.$t('M.trade_time_share'), // 分时
              resolution: '1',
              chartType: 3
            },
            {
              class: 'resolution_btn',
              label: '1min',
              resolution: '1'
            },
            {
              class: 'resolution_btn',
              label: '5min',
              resolution: '5'
            },
            {
              class: 'resolution_btn',
              label: '15min',
              resolution: '15'
            },
            {
              class: 'resolution_btn',
              label: '30min',
              resolution: '30'
            },
            {
              class: 'resolution_btn',
              label: '1hour',
              resolution: '60'
            },
            {
              class: 'resolution_btn',
              label: '4hour',
              resolution: '240'
            },
            {
              class: 'resolution_btn',
              label: '1day',
              resolution: '1D'
            },
            {
              class: 'resolution_btn',
              label: '1week',
              resolution: '1W'
            }
          ]
          chart.onIntervalChanged().subscribe(null, function (interval, obj) {
            _self.widget.changingInterval = false
          })
          btnList.forEach(function (item, index) {
            let button = _self.widget.createButton({
              align: 'left'
            })
            item.resolution === _self.widget._options.interval && _self.updateSelectedIntervalButton(button)
            const selected = index == 1 ? ' selected' : ''
            button.attr('class', 'button ' + item.class + selected)
              .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
              .on('click', function (e) {
                if (!_self.widget.changingInterval && !button.hasClass('selected')) {
                  let chartType = +button.attr('data-chart-type')
                  // let resolution = button.attr('data-resolution')
                  if (chart.resolution() !== item.resolution) {
                    _self.widget.changingInterval = true
                    chart.setResolution(item.resolution)
                  }
                  if (chart.chartType() !== chartType) {
                    chart.setChartType(chartType)
                  }
                  _self.updateSelectedIntervalButton(button)
                }
              })
              .append(item.label)
          })
          this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7b53a7'})
          this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#6b89ae'})
          this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#55ae63'})
          this.widget.chart().createStudy('Moving Average', false, true, [60, 'close', 0], null, {'Plot.color': '#89226e'})
        })
        this.symbol = options.symbol
        this.interval = options.interval
      }
    },
    // 修改样式
    applyOverrides: function (overrides) {
      console.log(this.widget)
      this.widget.applyOverrides(overrides)
    },
    // 切换时间间隔
    updateSelectedIntervalButton (button) {
      this.widget.selectedIntervalButton && this.widget.selectedIntervalButton.removeClass('selected')
      button.addClass('selected')
      this.widget.selectedIntervalButton = button
    },
    sendMessage (data) {
      if (this.socket.checkOpen()) {
        this.socket.send(data)
      } else {
        this.socket.on('open', () => {
          this.socket.send(data)
        })
      }
    },
    unSubscribe (interval) {
      let newInterval = this.transformInterval(interval)
      // this.socket.send({
      //   'tag': 'CANCEL',
      //   'content': `market.${this.symbol}.kline.${newInterval}.step5`,
      //   'id': `kline_${this.symbol}`
      // })
      this.getKlineDataBySocket('CANCEL', this.symbol, newInterval)
      if (interval < 60) {

        // this.sendMessage({ cmd: 'unsub', args: [`candle.M${interval}.${this.symbol.toLowerCase()}`, 1440, parseInt(Date.now() / 1000)] })
      } else if (interval >= 60) {
        // this.sendMessage({ cmd: 'unsub', args: [`candle.H${interval / 60}.${this.symbol.toLowerCase()}`, 1440, parseInt(Date.now() / 1000)] })
      } else {
        // this.sendMessage({ cmd: 'unsub', args: [`candle.D1.${this.symbol.toLowerCase()}`, 207, parseInt(Date.now() / 1000)] })
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
    subscribe () {
      // this.sendMessage( {
      //   'tag': 'REQ',
      //   'content': `market.${this.symbol}.kline.${this.resolution}.step5`,
      //   'id': `kline_${this.symbol}`
      // })
      // this.interval = 'min5'
      // this.sendMessage({
      //   'tag': 'SUB',
      //   'content': `market.${this.symbol}.kline.${this.interval}.step5`,
      //   'id': `kline_${this.symbol}14`
      // })

      if (this.interval < 60) {
        // this.sendMessage({ cmd: 'sub', args: [`candle.M${this.interval}.${this.symbol.toLowerCase()}`] })
      } else if (this.interval >= 60) {
        // this.sendMessage({ cmd: 'sub', args: [`candle.H${this.interval / 60}.${this.symbol.toLowerCase()}`] })
      } else {
        // this.sendMessage({ cmd: 'sub', args: [`candle.D1.${this.symbol.toLowerCase()}`] })
      }
    },
    onMessage (data) {
      console.log(data)
      switch (data.tradeType) {
        case 'KLINE':
          console.log(data)
          if (data.data && data.data.length && !data.type) {
            const list = []
            const ticker = `${this.symbol}-${this.interval}`
            data.data.forEach(function (element) {
              list.push({
                // time: this.interval !== 'D' || this.interval !== '1D' ? element.id * 1000 : element.id,
                time: element.time,
                open: element.open,
                high: element.high,
                low: element.low,
                close: element.close,
                volume: element.volume
              })
            }, this)
            this.cacheData[ticker] = list
            this.lastTime = list[list.length - 1].time
            this.subscribe()
          }
          // if (!data.type && data.type.indexOf(this.symbol.toLowerCase()) !== -1) {
          if (data.type) {
            // console.log(' >> sub:', data.type)
            let newData = data.data[0]
            const ticker = `${this.symbol}-${this.interval}`
            console.log(this.interval)
            const barsData = {
              time: newData.time,
              // time: this.lastTime,
              open: newData.open,
              high: newData.high,
              low: newData.low,
              close: newData.close,
              volume: newData.volume
            }
            console.log(barsData.time)
            console.log(this.lastTime)
            console.log(barsData.time - this.lastTime)
            if (barsData.time >= this.lastTime && this.cacheData[ticker] && this.cacheData[ticker].length) {
              this.cacheData[ticker][this.cacheData[ticker].length - 1] = barsData
            }
            this.datafeeds.barsUpdater.updateData()
          }
          break
        // 买卖单
        case 'DEPTH':
          console.log(data)
          if (data.data) {
            let newData = data.data
            console.log(newData)
            if (newData.sells && newData.sells.list) {
              newData.sells.list.reverse()
              this.socketData.buyAndSellData = newData
            }
          }
          break
        // 深度图
        case 'DEPTHRENDER':
          console.log(data)
          if (data.data) {
            this.socketData.depthData = data.data
          }
          break
        case 'TRADE':
          if (data.data) {
            this.socketData.tardeRecordList = data.data
          }
          break
        case 'TICKER':
          console.log(data)
          if (data.data) {
            this.socketData.tradeMarkeContentItem = data.data
          }
          break
      }
      console.log(this.socketData)
      this.CHANGE_SOCKET_AND_AJAX_DATA({
        'socketData': this.socketData,
        'type': 'socket'
      })
    },
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      console.log(symbolInfo)
      // symbolInfo.pricescale = 100000
      console.log(this.socket)
      // console.log(' >> :', rangeStartDate, rangeEndDate)
      if (this.interval != resolution) {
        this.unSubscribe(this.interval)
        this.interval = resolution
        this.options.interval = resolution
        // this.interval = 'min15'
        let newInterval = this.transformInterval(resolution)
        this.getKlineDataBySocket('REQ', this.symbol, newInterval)
        this.getKlineDataBySocket('SUB', this.symbol, newInterval)
        this.getTradeMarketBySocket('SUB', this.activeTabSymbolStr)
        this.getBuyAndSellBySocket('SUB', this.symbol)
        this.getDepthDataBySocket('SUB', this.symbol)
        this.getTradeRecordBySocket('SUB', this.symbol)
      }
      const ticker = `${this.symbol}-${this.interval}`
      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        this.isLoading = false
        const newBars = []
        this.cacheData[ticker].forEach(item => {
          if (item.time >= rangeStartDate * 1000 && item.time <= rangeEndDate * 1000) {
            newBars.push(item)
          }
        })
        if (onLoadedCallback) {
          onLoadedCallback(newBars)
        }
      } else {
        const self = this
        this.getBarTimer = setTimeout(function () {
          console.log(self.socket)
          self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 1)
      }
    },
    // 请求socket
    getKlineDataBySocket (type, symbol, newInterval) {
      // console.log(this.socket.send)
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
    // 获取默认交易对socket
    getDefaultSymbolBySocket (type, symbol) {
      if (type && symbol) {
        this.socket.send({
          'tag': type,
          'content': `market.${symbol}.${this.partnerId}`,
          'id': `market_001`
        })
      }
    },
    // 获取币币交易市场 socket
    getTradeMarketBySocket (type, params) {
      // 币币交易市场
      this.socket.send({
        'tag': type,
        'content': `market.${params}.ticker`,
        'id': `market_001`
      })
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
      partnerId: state => state.common.partnerId // 商户id
    })
  },
  watch: {
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
    activeSymbolId (newVal, oldVal) {
      // this.getActiveSymbolData(newVal)
      this.initKLine(newVal)
    },
    // 切换tab栏重新订阅
    activeTabSymbolStr (newVal, oldVal) {
      console.log(newVal)
      if (oldVal) {
        this.getTradeMarketBySocket('CANCEL', oldVal)
      }
      this.getTradeMarketBySocket('SUB', newVal)
    },
    symbol (newVal, oldVal) {
      this.getActiveSymbolData(newVal)

      this.getKlineDataBySocket('REQ', newVal, 'min')
      this.getKlineDataBySocket('SUB', newVal, 'min')
      if (oldVal) {
        console.log(oldVal)
        this.resolutions.forEach((item) => {
          this.getKlineDataBySocket('CANCEL', oldVal, item)
        })
        this.getBuyAndSellBySocket('CANCEL', oldVal)
        this.getDepthDataBySocket('CANCEL', oldVal)
        this.getTradeRecordBySocket('CANCEL', oldVal)
      }
    },
    activeTradeArea (newVal, oldVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
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
</style>
