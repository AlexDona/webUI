import './chart'
import {socket} from './socket'
import Datafeeds from './datafeed'
import store from '../../vuex'
import {splitSocketParams} from '../../utils/commonFunc'
console.log(store)
// import '../../../../static/charting_library/static/css/custom_color_black.css'
export default {
  widget: null,
  dataFeed: null,
  dataCache: {}, // 缓存数据
  getBarTimer: null,
  // 获取 到的socket 数据
  socketData: {},
  init: function (options) {
    this.dataFeed = new Datafeeds(this)

    this.widget = new TradingView.widget({
      autosize: true,
      symbol: options.symbol,
      interval: options.interval,
      container_id: 'tv_chart_container',
      datafeed: this.dataFeed,
      library_path: '/static/charting_library/',
      drawings_access: {
        type: 'black',
        tools: [{name: 'Regression Trend'}]
      },
      disabled_features: [
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
        // "move_logo_to_main_pane", //
        'timeframes_toolbar', // 底部栏时间
        'header_undo_redo',
        'header_chart_type',
        'header_screenshot'
      ],
      enabled_features: [
        // "study_templates", // 显示 交易对话框
        // "dome_widget"
        'hide_left_toolbar_by_default' // 隐藏左侧边栏
      ],
      numeric_formatting: {
        decimal_sign: '.'
      },
      timezone: 'Asia/Shanghai',
      locale: 'zh',
      debug: false,
      supports_group_request: false,
      toolbar_bg: options.paneProperties.background, // 工具栏背景色
      // toolbar_bg: options.toolbar_bg, // 工具栏背景色
      studies_overrides: {
        // "volume.volume.color.0": "#d45858", // 成交量 k柱 背景色
        // "volume.volume.color.1": "#008069", // 成交量 k柱 背景色
        'volume.volume.transparency': 100
      },
      overrides: {
        // 'paneProperties.background': '#10172d', // 背景色
        'paneProperties.background': options.paneProperties.background, // 背景色
        'paneProperties.vertGridProperties.color': '#1f2943', // 列分割线
        'paneProperties.horzGridProperties.color': '#1f2943', // 行分割线
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
        'mainSeriesProperties.areaStyle.transparency': 80
      },
      custom_css_url: '../../../../static/charting_library/static/css/t-night.css'
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
              // let resolution = button.attr("data-resolution");
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
      this.widget.chart().createStudy('Moving Average', false, true, [5, 'close', 0], null, {'Plot.color': '#7D53A8'})
      this.widget.chart().createStudy('Moving Average', false, true, [10, 'close', 0], null, {'Plot.color': '#7699C2'})
      this.widget.chart().createStudy('Moving Average', false, true, [30, 'close', 0], null, {'Plot.color': '#A0D75B'})
      this.widget.chart().createStudy('MA Cross', false, false, [30, 120])
    })
  },
  updateSelectedIntervalButton (button) {
    this.widget.selectedIntervalButton && this.widget.selectedIntervalButton.removeClass('selected')
    button.addClass('selected')
    this.widget.selectedIntervalButton = button
  },

  getBars: function (symbol, resolution, from, to, callback) {
    // console.log(from)
    // console.log(to)
    let data
    const symbolData = this.dataCache[symbol]
    // console.log(this.dataCache[symbol]);
    if (symbolData) {
      data = symbolData[resolution]
    }
    if (resolution === 'D') {
      resolution = '1D'
    }

    if (this.getBarTimer) {
      clearTimeout(this.getBarTimer)
    }
    const fromMs = from * 1000
    const toMs = to * 1000
    // 取缓存数据
    const fetchCacheData = data => {
      const newBars = []
      let count = 0
      data.forEach(function (element) {
        const barTime = element.time
        if (barTime >= fromMs && barTime <= toMs) {
          newBars.push(element)
          count++
        }
      }, this)

      if (count > 0) {
        newBars.sort((l, r) => l.time > r.time ? 1 : -1)
        callback && callback({s: 'ok', bars: newBars})
      } else {
        callback && callback({s: 'no_data'})
      }
      const params = {
        resolution: resolution,
        symbol: symbol,
        type: 'updata',
        from: from,
        to: to,
        activeTradeArea: store.state.common.activeTradeArea
      }
      socket.subscribeKline(params, this.onUpdateData.bind(this))
    }
    // 请求数据
    const requestData = list => {
      const params = {
        resolution: resolution,
        symbol: symbol,
        type: 'kline',
        from: from,
        to: to,
        activeTradeArea: store.state.common.activeTradeArea
      }
      // console.log(resolution)
      socket.subscribeKline(params, this.onUpdateData.bind(this))
      if (store.state.reqRefreshStatus) {
        this.getBarTimer = setTimeout(() => {
          this.getBars(symbol, resolution, from, to, callback)
          // console.log('reflash')
          store.commit('common/CHANGE_SOCKET_REFRESH_STATUS', false)
          // console.log(store.state.common.reqRefreshStatus)
        }, 1000)
      }
    }
    data ? fetchCacheData(data) : requestData()
  },

  getConfig: function () {
    return {}
  },

  getServerTime: function () {
    return parseInt(Date.now() / 1000)
  },

  resolveTVSymbol: function (symbol) {
    return {
      'name': '',
      'exchange-traded': '',
      'exchange-listed': '',
      'timezone': 'Asia/Shanghai',
      'minmov': 1,
      'minmov2': 0,
      'pointvalue': 1,
      'fractional': false,
      'session': '24x7',
      'has_intraday': true,
      'has_no_volume': false,
      'description': symbol,
      'pricescale': 1,
      'ticker': symbol
      // 'supported_resolutions': ['1', '5', '15', '30', '60', '1D', '5D', '1W', '1M']
    }
  },
  onUpdateData: function (data) {
    // console.log('***********************************************************')
    let tradeType = data.tradeType
    let dataArr = []
    let dataType = data.type
    // 数据类型
    // let type = ''
    // 交易对
    let symbol = ''
    // 分辨率（时间周期）
    let resolution = ''
    // if (data.rep) {
    //   dataArr = data.rep.split('.')
    // } else if (data.sub) {
    //   dataArr = data.sub.split('.')
    // }
    dataArr = splitSocketParams(data)
    symbol = dataArr[1]
    resolution = dataArr[3]
    //  k线
    if (tradeType === 'KLINE') {
      // 分辨率转换
      switch (resolution) {
        case 'min':
          resolution = '1'
          break
        case 'min5':
          resolution = '5'
          break
        case 'min15':
          resolution = '15'
          break
        case 'min30':
          resolution = '30'
          break
        case 'hour1':
          resolution = '60'
          break
        case 'hour4':
          resolution = '240'
          break
        case 'day':
          resolution = '1D'
          break
        case 'week':
          resolution = '1w'
          break
      }
      // console.log(resolution);
      if (!this.dataCache[symbol]) {
        this.dataCache[symbol] = {}
      }
      if (!this.dataCache[symbol][resolution]) {
        this.dataCache[symbol][resolution] = []
      }
      // 请求订阅区分
      switch (dataType) {
        // 请求历史数据
        case 0:
          // console.log(data)
          this.dataCache[symbol][resolution] = data.data
          // console.log(new Date(this.dataCache[symbol][resolution][0].time))
          // console.log(this.dataCache)
          break
        case 1:
          // 订阅当前数据
          // 未超过当前时间周期
          if (data.data) {
            // let length = this.dataCache[symbol][resolution].length - 1
            // console.log(this.dataCache[symbol][resolution])
            // console.log(data.data[0].time)
            // console.log(this.dataCache[symbol][resolution][length])
            // let arr = this.dataCache[symbol][resolution]
            // arr.pop()
            // arr.push(data.data[0])
            // this.dataCache[symbol][resolution] = arr
            // console.log(this.dataCache[symbol][resolution])
            // this.dataCache[symbol][resolution][length].open = data.data[0].open
            // this.dataCache[symbol][resolution][length].close = data.data[0].close
            // this.dataCache[symbol][resolution][length].high = data.data[0].high
            // this.dataCache[symbol][resolution][length].low = data.data[0].low
            // this.dataCache[symbol][resolution][length].volume = data.data[0].volume
            // console.log(this.dataCache[symbol][resolution])
          }
          break
      }
      // console.log(dataType)
      // if (!dataType) {
      //   // 请求历史数据
      //   this.dataCache[symbol][resolution] = data.data
      // } else {
      //   // 订阅当前数据
      //   if (data.data) {
      //     // let length = this.dataCache[symbol][resolution].length - 1
      //     // console.log(this.dataCache[symbol][resolution])
      //     // console.log(data.data[0].time)
      //     // console.log(this.dataCache[symbol][resolution][length])
      //     // let arr = this.dataCache[symbol][resolution]
      //     // arr[arr.length - 1].open = data.data[0].open
      //     // arr[arr.length - 1].close = data.data[0].close
      //     // arr[arr.length - 1].high = data.data[0].high
      //     // arr[arr.length - 1].low = data.data[0].low
      //     // arr[arr.length - 1].volume = data.data[0].volume
      //     // this.dataCache[symbol][resolution] = arr
      //     // console.log(this.dataCache[symbol][resolution])
      //     // this.dataCache[symbol][resolution][length].open = data.data[0].open
      //     // this.dataCache[symbol][resolution][length].close = data.data[0].close
      //     // this.dataCache[symbol][resolution][length].high = data.data[0].high
      //     // this.dataCache[symbol][resolution][length].low = data.data[0].low
      //     // this.dataCache[symbol][resolution][length].volume = data.data[0].volume
      //     // console.log(this.dataCache[symbol][resolution])
      //   }
      // }
      // console.log(data.data.reverse());
      // targetData.forEach((item, index) => {
      // item.time = 1532941620000;
      // item.close = 126.84;
      // item.high = item.low + 20;
      // item.open = 129.84;
      // item.low = 134.84;
      // // item.volume = item.v;
      // this.dataCache[symbol][resolution].push(item)
      //
      // })
      // console.log('----------------------------------------------------');

      // console.log(data.data)

      // this.dataCache[symbol][resolution] = data.data
      // console.log(this.dataCache[symbol][resolution])
    //  深度图
    } else if (tradeType == 'DEPTH') {
      // console.log(data)
      // 深度图、买列表、卖列表
      if (data.data) {
        // const depthData = {
        //   depthData: data.data.depthData,
        //   buyAndSellData: data.data.depthRender
        // }
        this.socketData.depthData = data.data.depthData
        this.socketData.buyAndSellData = data.data.depthRender
        // store.commit('common/CHANGE_SOCKET_DATA', depthData)
        // console.log(store.state.common.socketData)
      }
    //  交易记录
    } else if (tradeType === 'TRADE') {
      if (data.data) {
        if (!dataType) {
          this.socketData.tardeRecordList = data.data
        } else {
          this.socketData.tardeRecordList.pop()
          this.socketData.tardeRecordList.unshift(data.data)
        }
      }
    // 币币交易市场信息
    } else if (tradeType === 'BBTICKER') {
      // console.log(data)
    }
    store.commit('common/CHANGE_SOCKET_DATA', this.socketData)
  }
  // onUpdateData: function (data) {
  //   console.log(data.id)
  //   console.log('--------------------------')
  //   // if (!data.kline) {
  //   //   return false
  //   // }
  //   // if (!this.dataCache[data.symbol]) {
  //   //   this.dataCache[data.symbol] = {}
  //   // }
  //   // if (!this.dataCache[data.symbol][data.resolution]) {
  //   //   this.dataCache[data.symbol][data.resolution] = []
  //   // }
  //   // if (data.kline) {
  //   //
  //   //   data.kline.forEach(elm => {
  //   //     this.dataCache[data.symbol][data.resolution].push(elm)
  //   //   })
  //   // }
  //   if (data.type == 'updata') {
  //     let lastObj = this.dataCache[data.symbol][data.resolution][0]
  //     // // console.log(lastObj.time);
  //     // let leadTime = data.kline[0].time - this.dataCache[data.symbol][data.resolution][1].time;
  //     // // console.log(leadTime);
  //     // // if (leadTime < 60000) {
  //     // this.dataCache[data.symbol][data.resolution].unshift(data.kline[0]);
  //     lastObj.open = data.kline[0].open
  //     lastObj.close = data.kline[0].close
  //     lastObj.low = data.kline[0].low
  //     lastObj.high = data.kline[0].high
  //     lastObj.volume = data.kline[0].volume
  //     // }
  //   }
  // }
}
