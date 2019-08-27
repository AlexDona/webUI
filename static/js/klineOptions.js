export const overrides = {
  'loading_screen': {
    'backgroundColor': '#000',
    'foregroundColor': '#000'
  },
  'symbolWatermarkProperties.transparency': 90,
  // "scalesProperties.textColor": "#AAA",
  // "scalesProperties.backgroundColor": "#ff00ff",
  'scalesProperties.lineColor': '#61688a', // 右侧边框颜色
  'scalesProperties.textColor': '#61688a', // 左上角文字颜色
  'mainSeriesProperties.candleStyle.upColor': '#F03E3E', // k 柱颜色
  'mainSeriesProperties.candleStyle.downColor': '#41B37D', // k 柱颜色
  'mainSeriesProperties.candleStyle.borderUpColor': '#F03E3E', // k 柱边框颜色
  'mainSeriesProperties.candleStyle.borderDownColor': '#41B37D', // k 柱边框颜色
  // "mainSeriesProperties.candleStyle.wickColor": "#737375",
  'mainSeriesProperties.candleStyle.wickUpColor': '#F03E3E', // 上涨 蜡烛线颜色
  'mainSeriesProperties.candleStyle.wickDownColor': '#41B37D', // 下降 蜡烛线颜色
  // 'mainSeriesProperties.hollowCandleStyle.borderColor': '#000',
  // 'mainSeriesProperties.hollowCandleStyle.borderUpColor': '#ff00ff',
  // "mainSeriesProperties.haStyle.borderUpColor": "#00f",
  // 'paneProperties.legendProperties.showStudyTitles': false,
  'mainSeriesProperties.areaStyle.color1': '#0cbef3',
  'mainSeriesProperties.areaStyle.color2': '#0098c4',
  'mainSeriesProperties.areaStyle.linecolor': '#4e5b85',
  'mainSeriesProperties.areaStyle.linestyle': 0,
  'mainSeriesProperties.areaStyle.linewidth': 1,
  'mainSeriesProperties.areaStyle.priceSource': 'close',
  'mainSeriesProperties.areaStyle.transparency': 80
  // 'paneProperties.legendProperties.showLegend': false // 默认收起
}
export const disabledFeatures = [
  // 'use_localstorage_for_settings',
  'header_symbol_search', // 禁止头部搜索
  'header_interval_dialog_button',
  'show_interval_dialog_on_key_press',
  'symbol_search_hot_key',
  'study_dialog_search_control',
  'display_market_status',
  'header_compare',
  // 'edit_buttons_in_legend',
  'symbol_info',
  'border_around_the_chart',
  'main_series_scale_menu',
  'star_some_intervals_by_default',
  'datasource_copypaste',
  // 缩放
  // 'right_bar_stays_on_scroll',
  // 'chart_zoom', // 允许缩放图表
  // 'context_menus',
  'go_to_date',
  'compare_symbol',
  'timezone_menu',
  'volume_force_overlay', // 成交量上移
  // 'move_logo_to_main_pane', //
  'timeframes_toolbar', // 底部栏时间
  'header_undo_redo',
  'header_chart_type',
  'header_screenshot',
  // 'left_toolbar',
  // 'header_settings',
  // 'header_indicators',
  'header_saveload',
  'header_resolutions',
  // 'legend_context_menu',
  // 'show_hide_button_in_legend',
  'snapshot_trading_drawings'
  // 'widget_logo',
]
export const studiesOverrides = {
  // 成交量 k柱 背景色 跌
  'volume.volume.color.0': '#008069',
  // 成交量 k柱 背景色 涨
  'volume.volume.color.1': '#EC5E5E',
  'volume.volume.transparency': 100
}
export const kLineBtnList = [
  {
    class: 'resolution_btn',
    label: 'Time', // 分时
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
