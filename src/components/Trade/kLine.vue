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
import {getDefaultSymbol} from '../../utils/api/trade'
import {returnAjaxMessage} from '../../utils/commonFunc'
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
      resolutions: ['min', 'min5', 'min15', 'min30', 'hour1', 'hour4', 'day', 'week']
    }
  },
  created () {
    // require('../../../static/charting_library/static/css/t-night.css')
    require('../../../static/css/theme/day/Trade/KlieneDay.css')
    // this.widget = null
    // 获取默认交易对
    this.getDefaultSymbol()
  },
  mounted () {
    this.initKLine(this.symbol)
  },
  activited () {},
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
      'CHANGE_SOCKET_DATA'
    ]),
    // k线初始化
    initKLine (symbol) {
      this.widget = null
      this.socket.on('message', this.onMessage)
      this.options.symbol = symbol
      this.options.areaId = this.activeTabId
      this.options.paneProperties.background = this.theme === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor
      this.options.paneProperties.vertGridPropertiesColor = this.theme === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)'
      this.options.interval = '1'
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
          id: obj.sellCoinName + obj.buyCoinName,
          tradeId: obj.id,
          sellsymbol: obj.sellCoinName, // 币种简称
          sellname: obj.buyCoinName, // 币种全程
          area: obj.buyCoinName, // 交易区
          areaId: obj.tradeAreaId
        }
        // 是否从其他页面跳转
        const finalSymbol = this.isJumpToTradeCenter ? this.jumpSymbol : activeSymbol
        this.CHANGE_ACTIVE_SYMBOL({activeSymbol: finalSymbol})
        console.log(activeSymbol)
        this.symbol = this.activeSymbol.id
        this.socket.doOpen()
        this.socket.on('open', () => {
          this.getKlineDataBySocket('REQ', this.symbol, 'min')
          this.getKlineDataBySocket('SUB', this.symbol, 'min')
          this.getTradeMarketBySocket('REQ')
          this.getTradeMarketBySocket('SUB')
          this.getDefaultSymbolBySocket('REQ', finalSymbol.id)
          this.getDefaultSymbolBySocket('SUB', finalSymbol.id)
          this.getDepthDataBySocket('REQ', this.symbol)
          this.getDepthDataBySocket('SUB', this.symbol)
          this.getTradeRecordBySocket('REQ', this.symbol)
          this.getTradeRecordBySocket('SUB', this.symbol)
        })
        this.socket.on('message', this.onMessage)
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
            'header_screenshot',
            'header_settings'
          ],
          enabled_features: [
            'hide_left_toolbar_by_default' // 隐藏左侧边栏
          ],
          timezone: 'Asia/Shanghai',
          locale: 'zh',
          debug: false,
          toolbar_bg: 'transparent', // 工具栏背景色
          studies_overrides: {
            'volume.volume.color.0': '#008069', // 成交量 k柱 背景色
            'volume.volume.color.1': '#EC5E5E', // 成交量 k柱 背景色
            'volume.volume.transparency': 100
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
            'mainSeriesProperties.candleStyle.upColor': '#008069', // k 柱颜色
            'mainSeriesProperties.candleStyle.downColor': '#d45858', // k 柱颜色
            'mainSeriesProperties.candleStyle.borderUpColor': '#008069', // k 柱边框颜色
            'mainSeriesProperties.candleStyle.borderDownColor': '#d45858', // k 柱边框颜色
            // "mainSeriesProperties.candleStyle.wickColor": "#737375",
            'mainSeriesProperties.candleStyle.wickUpColor': '#008069', // 上涨 蜡烛线颜色
            'mainSeriesProperties.candleStyle.wickDownColor': '#d45858', // 下降 蜡烛线颜色
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
        this.widget.onChartReady(() => {
          const _self = this
          let chart = _self.widget.chart()
          const btnList = [
            {
              class: 'resolution_btn',
              label: '分时',
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
          btnList.forEach(function (item) {
            let button = _self.widget.createButton({
              align: 'left'
            })
            item.resolution === _self.widget._options.interval && _self.updateSelectedIntervalButton(button)
            button.attr('class', 'button ' + item.class)
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
          // this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7D53A8'})
          // this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#7699C2'})
          // this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#A0D75B'})
          // this.widget.chart().createStudy('MA Cross', false, false, [30, 120])
        })
        this.symbol = options.symbol
        this.interval = options.interval
      }
    },
    // 修改样式
    applyOverrides: function (overrides) {
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
      this.socket.send({
        'tag': 'CANCEL',
        'content': `market.${this.symbol}.kline.${newInterval}.step5`,
        'id': `kline_${this.symbol}`
      })
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
      // console.log(data)
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
            this.datafeeds.barsUpdater.updateData()
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
          }
          break
        case 'DEPTH':
          // console.log(data)
          if (data.data) {
            this.socketData.depthData = data.data.depthData
            this.socketData.buyAndSellData = data.data.depthRender
          }
          break
        case 'TRADE':
          // console.log(data)
          if (data.data) {
            if (!data.type) {
              this.socketData.tardeRecordList = data.data
            } else {
              this.socketData.tardeRecordList.pop()
              this.socketData.tardeRecordList.unshift(data.data[0])
            }
          }
          break
        case 'BBTICKER':
          // console.log(data)
          if (data.data) {
            this.socketData.tradeMarketList = data
          }
          break
        case 'DEFAULTTRADE':
          // console.log(data)
          if (data.data) {
            this.$store.commit('trade/SET_MIDDLE_TOP_DATA', data.data[0].content[0])
            // this.CHANGE_ACTIVE_SYMBOL({activeSymbol: data.data[0].content[0]})
          }
          break
      }
      this.CHANGE_SOCKET_DATA(this.socketData)
    },
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      // console.log(symbolInfo)
      // console.log(' >> :', rangeStartDate, rangeEndDate)
      if (this.interval != resolution) {
        // this.unSubscribe(this.interval)
        this.interval = resolution
        this.options.interval = resolution
        // this.interval = 'min15'
        let newInterval = this.transformInterval(resolution)
        this.getKlineDataBySocket('REQ', this.symbol, newInterval)
        this.getKlineDataBySocket('SUB', this.symbol, newInterval)
        this.getDefaultSymbolBySocket('REQ', this.symbol)
        this.getDefaultSymbolBySocket('SUB', this.symbol)
        this.getDepthDataBySocket('REQ', this.symbol)
        this.getDepthDataBySocket('SUB', this.symbol)
        this.getTradeRecordBySocket('REQ', this.symbol)
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
          self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 10)
      }
    },
    // 请求socket
    getKlineDataBySocket (type, symbol, newInterval) {
      // k线
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.kline.${newInterval}.step5`,
        'id': `kline_${symbol}`
      })
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
    // 获取深度socekt
    getDepthDataBySocket (type, symbol) {
      // 深度
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.depth.step1`,
        'id': `depth_${symbol}`
      })
    },
    // 获取默认交易对socket
    getDefaultSymbolBySocket (type, symbol) {
      this.socket.send({
        'tag': type,
        'content': `market.${symbol}.defaultTrade.${this.partnerId}`,
        'id': `market_001`
      })
    },
    // 获取币币交易市场 socket
    getTradeMarketBySocket (type, areaId = this.activeTradeArea.id) {
      if (areaId) {
        // 币币交易市场
        this.socket.send({
          'tag': type,
          'content': `market.bbticker.${this.partnerId}.${areaId}`,
          'id': `market_001`
        })
      } else {
        setTimeout(this.getTradeMarketBySocket(type), 1000)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      activeSymbol: state => state.common.activeSymbol,
      activeSymbolId: state => state.common.activeSymbol.id,
      activeTradeArea: state => state.common.activeTradeArea,
      activeTabId: state => state.trade.activeTabId,
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
    activeSymbolId (newVal) {
      this.initKLine(newVal)
    },
    // 切换tab栏重新订阅
    activeTabId (newVal, oldVal) {
      this.getTradeMarketBySocket('CANCEL', oldVal)
      this.getTradeMarketBySocket('REQ')
      this.getTradeMarketBySocket('SUB')
    },
    symbol (newVal, oldVal) {
      console.log(newVal, oldVal)
      console.log(this.options.interval)
      this.getKlineDataBySocket('REQ', newVal, 'min')
      this.getKlineDataBySocket('SUB', newVal, 'min')
      if (oldVal) {
        console.log(oldVal)
        this.resolutions.forEach((item) => {
          this.getKlineDataBySocket('CANCEL', oldVal, item)
        })
        this.getDefaultSymbolBySocket('CANCEL', oldVal)
        this.getDepthDataBySocket('CANCEL', oldVal)
        this.getTradeRecordBySocket('CANCEL', oldVal)
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  #tv_chart_container {
    width: 100%;
    height: 445px;
  &.night {
     background-color: $mainNightBgColor;
   }
  &.day{
     background-color: #fff;
   }
  }
</style>
