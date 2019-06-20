<!--
  author: zhaoxinlei
  update: 20190619
  description: 当前组件为 币币交易 k线 组件
-->
<template lang="pug">
  .kline-container
    #tv_chart_container(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    )
    .interval-loading-box(
      v-if="intervalLoading"
      v-loading.lock="intervalLoading"
      element-loading-background="rgba(28, 31, 50, 0.4)"
    )
</template>
<script>
import {widget as TvWidget} from '../../../static/tradeview/charting_library/charting_library.min.js'
import socket from '../../utils/datafeeds/socket'
import datafeeds from '../../utils/datafeeds/datafees'
import {xDomain} from '../../utils/env'
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
  unzip,
  getStore
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
      getBarTimer: null,
      klineInitCount: 0, // k线初始化次数
      options: {
        // symbol: this.activeSymbol.sellsymbol + this.activeSymbol.area,
        symbol: 'ETCFBT',
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
      // 时间周期loading
      intervalLoading: false,
      KlineNum: 0, // 拖拽k线档数
      isAllowDrag: true, // 是否允许拖拽
      // 是否全屏
      isFullScreen: false,
      // 小数位选择的新值
      newBitsValue: '',
      // 交易对深度小数位改变时，socket订阅数据延时器
      socketSUBTimer: null,
      // 所有的klinenum
      KlineNums: []
    }
  },
  created () {
    this.socket.doOpen()
  },
  async mounted () {
    const {tradeId} = this.$route.params
    if (tradeId && tradeId !== 'default') await this.getActiveSymbolData(tradeId)
    // 获取默认交易对
    await this.getDefaultSymbol()
    this.initKLine(this.symbol)
  },
  destroyed () {
    this.socket.destroy()
    this.widget = null
    // 离开本组件清除socket订阅数据延时器
    if (this.socketSUBTimer) clearTimeout(this.socketSUBTimer)
  },
  methods: {
    ...mapMutations([
      'CHANGE_SOCKET_AND_AJAX_DATA', // 改变socket数据
      'SET_IS_KLINE_DATA_READY',
      'SET_MIDDLE_TOP_DATA',
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS',
      'GET_SERVER_DATA',
      'RETURN_SYMBOL_DATA',
      'SET_PRE_INFO_M',
      'SET_REQUEST_COUNT_M'
    ]),
    resetData () {
      this.KlineNum = 0
      this.KlineNums = []
      this.klineInitCount = 0
    },
    // 接口获取K线数据
    async getKlineByAjax (tradeName, KlineType, KlineNum = 0, KlineStep = 'STEP5') {
      // console.log(KlineType, this.interval)
      this.isAllowDrag = false
      // console.log(tradeName)
      if (tradeName) {
        tradeName = tradeName.toLowerCase()
      }
      const params = {
        tradeName,
        KlineType,
        KlineNum,
        KlineStep
      }
      const data = await getKlineDataAjax(params)
      if (!data) return false
      this.isAllowDrag = true
      let klineDataList = getNestedData(data, 'data.obj')
      let klineDataStr = ''
      _.forEach(klineDataList, (klineData) => {
        klineDataStr += unzip(klineData)
      })

      if (!klineDataStr) return false
      let klineData = JSON.parse(klineDataStr)
      let klineList = getNestedData(klineData, 'klineList')
      // console.log(klineData, klineList)
      if (klineList) {
        this.KlineNum = klineData.num
        let list = []
        // console.log(this.KlineNum)
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
            break
          default:
            // console.log(klineData)
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
      setTimeout(() => {
        this.SET_IS_KLINE_DATA_READY(true)
        this.intervalLoading = false
      }, 500)
    },
    // 获取当前交易对socket数据
    async getActiveSymbolData (tradeName) {
      let params = {
        i18n: this.$language_S_X,
        tradeName
      }
      const data = await getActiveSymbolDataAjax(params)
      // console.log(data)
      if (!data) return false
      let resultStr = ''
      let objList = getNestedData(data, 'data.obj')
      _.forEach(objList, objItem => {
        resultStr += unzip(objItem)
      })
      // console.log(resultStr)
      if (!resultStr) return false
      let activeSymbolData = JSON.parse(resultStr)
      let {
        defaultTrade, // 默认交易对
        depthList, // 买卖单、深度
        tradeList, // 交易记录
        tickerList // 行情交易区列表
      } = activeSymbolData
      // console.log(activeSymbolData)
      if (depthList && depthList.depthData.sells.list) {
        depthList.depthData.sells.list.reverse()
      }
      // 默认交易对 数据
      const defaultTradeContent = getNestedData(defaultTrade, 'content[0]')
      if (defaultTradeContent) {
        this.SET_MIDDLE_TOP_DATA(defaultTradeContent)
        this.RETURN_SYMBOL_DATA(true)
      }
      // 买卖单
      this.ajaxData.buyAndSellData = getNestedData(depthList, 'depthData')
      // 小数位数据
      this.ajaxData.depthDecimal = getNestedData(depthList, 'depthDecimal')
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
      this.widget = null
      this.socket.on('message', this.onMessage)
      let options = {
        symbol,
        areaId: this.activeTabId,
        paneProperties: {
          background: this.$theme_S_X === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor,
          vertGridPropertiesColor: this.$theme_S_X === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)'
        },
        interval: '15',
        language: this.$language_S_X
      }
      this.options = {...this.options, ...options}
      this.init(this.options)
    },
    // 获取初始交易对
    async getDefaultSymbol () {
      let localSymbol = getStore('activeSymbol')
      let activeSymbol
      let data = await getDefaultSymbol()
      if (!data) return false
      const obj = getNestedData(data, 'data')
      activeSymbol = `${getNestedData(obj, 'sellCoinName')}${getNestedData(obj, 'buyCoinName')}`.toLowerCase()
      const {tradeId} = this.$route.params
      this.symbol = tradeId && tradeId !== 'default' ? tradeId : (localSymbol ? localSymbol : activeSymbol)
      this.RETURN_SYMBOL_DATA(true)
      if (this.$isLogin_S_X) this.getUserOrderSocket('SUB', this.symbol)
    },
    init (options) {
      if (!this.widget) {
        this.widget = new TvWidget({
          symbol: `${this.$activeSellName_X}/${this.$activeBuyName_X}`,
          interval: options.interval,
          autosize: true,
          container_id: 'tv_chart_container',
          datafeed: this.datafeeds,
          library_path: '/static/tradeview/charting_library/',
          disabled_features: disabledFeatures,
          enabled_features: [
            'dont_show_boolean_study_arguments',
            'hide_last_na_study_output',
            // 'move_logo_to_main_pane',
            // 'same_data_requery',
            'side_toolbar_in_fullscreen_mode'
            // 'hide_left_toolbar_by_default' // 隐藏左侧边栏
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
          // console.log(_self.widget.chart)
          if (_self.widget && _self.widget.chart) {
            chart = _self.widget.chart()
          }
          if (!chart) return false
          chart.onIntervalChanged().subscribe(null, function (interval, obj) {
            _self.widget.changingInterval = false
          })
          // console.log(this.klineInitCount)
          if (!this.klineInitCount) {
            let iframe$ = document.getElementsByTagName('iframe')[0].contentWindow.$
            /**
             * 自定义 设置 按钮
              * @type {JQuery | *}
             */
            let settingBtn = _self.widget.createButton({
              align: 'left'
            })
            settingBtn
              .attr('class', 'setting-button')
              .on('click', function () {
                // 设置切换
                iframe$('.header-group-properties .apply-common-tooltip').click()
              })

            /**
             * 自定义 指标 按钮
             */

            let indicatorBtn = _self.widget.createButton({
              align: 'left'
            })
            indicatorBtn
              .attr('class', 'indicator-button')
              .on('click', function () {
                iframe$('.header-group-indicators .apply-common-tooltip').click()
              })
            /**
             * 自定义 分时切换 按钮
             */
            kLineBtnList.forEach(function (item, index) {
              let button = _self.widget.createButton({
                align: 'left'
              })
              item.resolution === _self.widget._options.interval && _self.updateSelectedIntervalButton(button)
              const selected = index == 3 ? ' selected' : ''
              button.attr('class', 'button ' + item.class + selected + ' add' + index)
                .attr('data-chart-type', item.chartType === undefined ? 1 : item.chartType)
                .on('click', function (e) {
                  _self.intervalLoading = true
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
            /**
             * 自定义 全屏切换 按钮
             * @type {JQuery | *}
             */
            let fullScreenBtn = _self.widget.createButton({
              align: 'right'
            })
            fullScreenBtn
              .attr('class', 'full-screen')
              .on('click', function () {
                const fullarea = iframe$('.chart-page.on-widget')[0]
                // console.log(_self.isFullScreen)
                const klineContainerHeight = iframe$('.chart-page.on-widget').height()

                _self.isFullScreen = klineContainerHeight > 580 ? true : false

                if (_self.isFullScreen) {
                  if (document.exitFullscreen) {
                    document.exitFullscreen()
                  } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen()
                  } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen()
                  } else if (document.msExitFullscreen) {
                    document.msExitFullscreen()
                  }
                } else {
                  if (fullarea.requestFullscreen) {
                    fullarea.requestFullscreen()
                  } else if (fullarea.webkitRequestFullScreen) {
                    fullarea.webkitRequestFullScreen()
                  } else if (fullarea.mozRequestFullScreen) {
                    fullarea.mozRequestFullScreen()
                  } else if (fullarea.msRequestFullscreen) {
                    // IE11
                    fullarea.msRequestFullscreen()
                  }
                }
                _self.isFullScreen = !_self.isFullScreen
              })
              // .append(fullScreenIcon)
          }
          // iframe$('.add7').click()
          // console.log()
          this.klineInitCount++
          this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7b53a7'})
          this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#6b89ae'})
          this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#55ae63'})
          this.widget.chart().createStudy('Moving Average', false, true, [60, 'close', 0], null, {'Plot.color': '#89226e'})

          // K线图指针移动回调
          this.widget.chart().crossHairMoved(_.throttle(async (e) => {
            // const timeDiff = currentTime - limitTime
            if (this.KlineNum > 1 && this.isAllowDrag) {
              let interval = this.transformInterval(this.interval)
              await this.getKlineByAjax(this.symbol, interval, this.KlineNum - 1)
            }
          }, 1000))
        })
        this.symbol = options.symbol
        // console.log(this.symbol)
        this.interval = options.interval
      }
    },
    // 修改样式
    applyOverrides: function (overrides) {
      this.widget.applyOverrides(overrides)
    },
    // 切换时间间隔
    updateSelectedIntervalButton (button) {
      // console.dir(button)
      this.widget.selectedIntervalButton && this.widget.selectedIntervalButton.removeClass('selected')
      button.addClass('selected')
      this.widget.selectedIntervalButton = button
      // const ticker = `${this.symbol}-${this.interval}`
    },
    unSubscribe (interval) {
      let newInterval = this.transformInterval(interval)
      if (newInterval) {
        this.getKlineDataBySocket('CANCEL', this.symbol, newInterval)
      }
    },
    // 时间区间格式转换
    transformInterval (interval) {
      // console.log(interval)
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
    // 接收到websocket数据以后数据处理
    onMessage (data) {
      // const { countDown, isShow } = data.data
      // console.log(data)
      // if (this.activeSymbol.id !== symbol) return false
      switch (data.tradeType) {
        case 'KLINE':
          // console.log(data.data[0])
          // console.log(' >> sub:', data.type)
          const klineData = data.data[0]
          // console.log(klineData.close)
          const ticker = `${this.symbol}-${this.interval}`
          // console.log(klineData.time)
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
          // console.log('买卖单数据')
          // console.log(data)
          // console.log(symbol, this.activeSymbol.id)

          const depthData = getNestedData(data, 'data')
          // console.log(depthData)
          if (depthData.sells && depthData.sells.list) {
            depthData.sells.list.reverse()
          }
          this.socketData.buyAndSellData = depthData
          this.socketData = {...this.socketData, symbol: data.symbol}
          // console.log(this.socketData)
          break
        // 深度图
        case 'DEPTHRENDER':
          // console.log(data)
          this.socketData.depthData = getNestedData(data, 'data')
          break
        case 'TRADE':
          this.socketData.tardeRecordList = getNestedData(data, 'data')
          break
        case 'TICKER':
          // console.log(data)
          this.socketData.tradeMarkeContentItem = getNestedData(data, 'data')
          break
        case 'USERORDER':
          // console.log(data)
          this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
          this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(true)
          break
        case 'PRE':
          // console.log(data)
          this.SET_PRE_INFO_M(data.data)
          break
      }
      this.CHANGE_SOCKET_AND_AJAX_DATA({
        'socketData': this.socketData,
        'type': 'socket'
      })
    },
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback) {
      // const fromTime = this.cacheData[ticker][this.cacheData[ticker].length - 20].time / 1000
      // const toTime = this.cacheData[ticker][this.cacheData[ticker].length - 1].time / 1000
      // if (rangeStartDate && rangeEndDate) {
      //   this.widget.chart().setVisibleRange({
      //     from: rangeStartDate,
      //     to: rangeEndDate
      //   }, () => {})
      // }

      if (resolution && this.interval && (this.interval != resolution)) {
        this.unSubscribe(this.interval)
        this.interval = resolution
        this.options.interval = resolution
        let newInterval = this.transformInterval(resolution)
        this.KlineNum = 0
        this.subscribeSocketData(this.symbol, newInterval)
      }
      const ticker = `${this.symbol}-${this.interval}`
      let newBars = []

      if (this.cacheData[ticker] && this.cacheData[ticker].length) {
        // console.log(this.cacheData[ticker])
        this.cacheData[ticker].forEach(item => {
          newBars.push(item)
        })
        if (onLoadedCallback) {
          // console.log(this.KlineNum)
          this.KlineNums.unshift(this.KlineNum)
          const New = this.KlineNums[0]
          const Last = this.KlineNums[1]
          console.log(New, Last)
          if ((New == Last) && New < 2) {
            this.KlineNums = []
            // console.log('noData')
            onLoadedCallback([])
          } else {
            onLoadedCallback(newBars)
          }
        }
        clearTimeout(this.getBarTimer)
      } else {
        const self = this
        this.getBarTimer = setTimeout(function () {
          self.getBars(symbolInfo, resolution, rangeStartDate, rangeEndDate, onLoadedCallback)
        }, 1000)
      }
    },
    // 请求socket
    getKlineDataBySocket (type, symbol, newInterval) {
      // console.log(newInterval)
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
      let content
      if (type === 'CANCEL') {
        content = `market.${symbol}.depth.step1`
      } else {
        content = `market.${symbol}.depth.step1${this.newBitsValue}`
      }
      this.socket.send({
        'tag': type,
        'content': content,
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
      if (this.$isLogin_S_X) {
        this.socket.send({
          'tag': type,
          'content': `market.${symbol}.userorder.${this.userId}`,
          'id': 'pc'
        })
      }
    },
    // 获取PRE信息
    getPREInfo () {
      let uid = this.$isLogin_S_X ? this.showId : 0
      // console.log(uid, this.userInfo)
      this.socket.send({
        'tag': 'SUB',
        'content': `market.${uid}.pre`,
        'id': `pc`,
        'domain': xDomain
      })
    },
    // 订阅消息
    subscribeSocketData (symbol, interval = 'min15') {
      this.newBitsValue = ''
      this.getKlineByAjax(symbol, interval, this.KlineNum)
      this.getKlineDataBySocket('SUB', symbol, interval)
      this.getTradeMarketBySocket('SUB', this.activeTabSymbolStr)
      this.getBuyAndSellBySocket('SUB', symbol)
      this.getDepthDataBySocket('SUB', symbol)
      this.getTradeRecordBySocket('SUB', symbol)
      this.getPREInfo()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      symbolMap: state => state.home.symbolMap, // 交易对map
      activeTabSymbolStr: state => state.trade.activeTabSymbolStr,
      mainColor: state => state.common.mainColor,
      userId: state => state.user.loginStep1Info.userId,
      showId: state => state.user.loginStep1Info.userInfo.showId,
      userInfo: state => state.user.loginStep1Info,
      // 拿到全局存储的选中的交易对小数位
      globalCheckedBits: state => state.common.globalCheckedBits
    })
  },
  watch: {
    $isLogin_S_X (newVal) {
      if (newVal) this.getUserOrderSocket('SUB', newVal)
    },
    $theme_S_X () {
      // 更新K线主题
      this.widget.applyOverrides({
        'paneProperties.background': this.$theme_S_X === 'night' ? this.mainColor.$mainNightBgColor : this.mainColor.$mainDayBgColor,
        'paneProperties.vertGridProperties.color': this.$theme_S_X === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)', // 行分割线
        'paneProperties.horzGridProperties.color': this.$theme_S_X === 'night' ? 'rgba(57,66,77,.2)' : 'rgba(57,66,77,.05)' // 列分割线
      })
    },
    $language_S_X () {
      this.initKLine(this.symbol)
      this.resetData()
    },
    async $activeSymbol_S_X (newVal) {
      this.SET_IS_KLINE_DATA_READY(false)
      this.initKLine(newVal)
      this.resetData()
    },
    // 切换tab栏重新订阅
    activeTabSymbolStr (newVal, oldVal) {
      if (oldVal) this.getTradeMarketBySocket('CANCEL', oldVal)
      this.getTradeMarketBySocket('SUB', newVal)
    },
    symbol (newVal, oldVal) {
      let symbol = newVal
      if (newVal.startsWith('{')) symbol = JSON.parse(newVal).id
      if (oldVal) {
        this.resolutions.forEach((item) => {
          this.getKlineDataBySocket('CANCEL', oldVal, item)
        })
        this.getBuyAndSellBySocket('CANCEL', oldVal)
        this.getDepthDataBySocket('CANCEL', oldVal)
        this.getTradeRecordBySocket('CANCEL', oldVal)
        this.getUserOrderSocket('CANCEL', oldVal)
      }
      this.getActiveSymbolData(symbol)
      this.subscribeSocketData(symbol)
      this.getUserOrderSocket('SUB', symbol)
    },
    interval () {
      this.resetData()
    },
    // 监控全局存储的选中的小数位的值，值改变了，先CANCEL，再REQ 再SUB
    globalCheckedBits (New) {
      this.newBitsValue = '.' + New
      // 先CANCEL 间隔10毫秒 再REQ 再SUB
      this.getBuyAndSellBySocket('CANCEL', this.symbol)
      this.socketSUBTimer = setTimeout(() => {
        this.getBuyAndSellBySocket('REQ', this.symbol)
        this.getBuyAndSellBySocket('SUB', this.symbol)
      }, 10)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index';
  $maxHeight1920-2560: 580px;
  $defaultHeight: 355px;

  .kline-container {
    position: relative;
    width: 100%;
    height: $defaultHeight;
    overflow: hidden;

    #tv_chart_container {
      width: 100%;
      height: $defaultHeight;

      &.night {
        background-color: $mainContentNightBgColor;
      }

      &.day {
        background-color: #fff;
      }
    }

    .loading-box,
    .interval-loading-box {
      position: absolute;
      z-index: 15;
      top: 0;
      right: 0;
      width: 101%;
      height: $defaultHeight;
    }
  }

  @media screen and (max-width: 2560px) and (min-width: 1921px) {
    .kline-container {
      height: $maxHeight1920-2560;

      #tv_chart_container {
        height: $maxHeight1920-2560;
      }

      .loading-box,
      .interval-loading-box {
        height: $maxHeight1920-2560;
      }
    }
  }
</style>
