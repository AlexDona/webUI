// const moment = require('moment');
// const WebSocket = require('ws');
import store from '../../vuex'
const pako = require('pako')

// const WS_URL = 'ws://192.168.1.200:8060/market'
const WS_URL = 'ws://192.168.1.52:8087/market'

var orderbook = {}

function handle (data) {
  console.log(data)
  // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
  let symbol = data.ch.split('.')[1]
  let channel = data.ch.split('.')[2]
  // console.log(symbol)
  // console.log(channel)
  switch (channel) {
    case 'depth':
      orderbook[symbol] = data.tick
      break
    case 'kline':
      // console.log('kline', data.tick)
      break
  }
}

function sendData (ws, params) {
  ws.send(JSON.stringify(params))
}

function subscribe (ws, params) {
  // 首页行情
  if (params.type === 'home_market') {
    // console.log('qidong')
    sendData(ws, {
      'tag': 'REQ',
      'content': `market.ticker.${store.state.common.partnerId}.${params.plateId}.0.i18nCode`,
      'id': `market_001`
    })
    sendData(ws, {
      'tag': 'SUB',
      'content': `market.ticker.${store.state.common.partnerId}.${params.plateId}.0.i18nCode`,
      'id': `market_001`
    })
  // 币币交易市场
  } else if (params.type === 'trade_market') {
    // 币币交易市场
    sendData(ws, {
      'tag': 'REQ',
      'content': `market.bbticker.${store.state.common.partnerId}.${params.areaId}`,
      'id': `market_001`
    })
    // 币币交易市场
    ws.send(JSON.stringify({
      'tag': 'SUB',
      'content': `market.bbticker.${store.state.common.partnerId}.${params.areaId}`,
      'id': `market_001`
    }))
  } else {
  //  币币交易
    let symbols = [params.symbol]
    console.log(symbols)
    let resolution = '1'

    switch (params.resolution) {
      case '1':
        resolution = 'min'
        break
      case '5':
        resolution = 'min5'
        break
      case '15':
        resolution = 'min15'
        break
      case '30':
        resolution = 'min30'
        break
      case '60':
        resolution = 'hour1'
        break
      case '240':
        resolution = 'hour4'
        break
      case '1D':
        resolution = 'day'
        break
      case '1w':
        resolution = 'week'
        break
    }
    console.log(resolution)
    // 请求
    for (let symbol of symbols) {
      // console.log(symbol)
      // 深度
      // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
      if (store.state.common.reqRefreshStatus) {
        sendData(ws, {
          'tag': 'REQ',
          'content': `market.${symbol}.depth.step1`,
          'id': `depth_${symbol}`
        })
      }
      // console.log(resolution)
      // K线
      // sendData(ws, {
      //   'tag': 'REQ',
      //   'content': `market.${symbol}.kline.${resolution}`,
      //   'id': `kline_${symbol}`
      // })

      // 交易记录
      if (store.state.common.reqRefreshStatus) {
        // sendData(ws, {
        //   'tag': 'REQ',
        //   'content': `market.${symbol}.trade`,
        //   'id': `trade_${symbol}`
        // })
      }
      // 实时行情
      // sendData(ws, {
      //   'tag': 'REQ',
      //   'content': `market.${symbol}.ticker`,
      //   'id': `tick_${symbol}`
      // })
    }
    // 订阅
    for (let symbol of symbols) {
    // symbol = symbol.toLowerCase()
    // 深度
    // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
      if (store.state.common.reqRefreshStatus) {
        sendData(ws, {
          'tag': 'SUB',
          'content': `market.${symbol}.depth.step1`,
          'id': `depth_${symbol}`
        })
      }

      // K线
      // console.log(resolution)
      // console.log(symbol)
      // sendData(ws, {
      //   'tag': 'SUB',
      //   'content': `market.${symbol}.kline.${resolution}`,
      //   'id': `kline_${symbol}14`
      // })
      // 交易记录
      if (store.state.common.reqRefreshStatus) {
        // sendData(ws, {
        //   'tag': 'SUB',
        //   'content': `market.${symbol}.trade`,
        //   'id': `trade_${symbol}`
        // })
      }
    // // 实时行情(首页数据)
    // sendData(ws, {
    //   'tag': 'SUB',
    //   'content': `market.${symbol}.ticker`,
    //   'id': `tick_${symbol}`
    // })
    }
  }
  /**
   * from:1532835197
     resolution:"1"
     symbol:"AA"
     to:1532921657
     type:"kline"
   */
  /**
   * 数据格式
   *ws.send(JSON.stringify({
        "tag": "REQ",
        "content": `market.ticker.55.477187759069462528.all`,
        "id": `tick_fucfbt`
    }))

   ws.send(JSON.stringify({
       "tag": "SUB",
        "content": `market.ticker.55.477187759069462528.all`,
        "id": `tick_fucfbt`
    }));
   */
}

const socket = {
  ws: null,
  init: function () {
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    this.ws = new BrowserWebSocket(WS_URL)
  },
  subscribeKline: function (params, callback) {
    if (this.ws === null) {
      this.init()
    }
    if (this.ws.readyState) {
      subscribe(this.ws, params)
    } else {
      this.ws.onopen = evt => {
        subscribe(this.ws, params)
      }
    }
    this.ws.onmessage = (e) => {
      let blob = e.data
      let reader = new FileReader()
      reader.readAsBinaryString(blob)
      reader.onload = (evt) => {
        let text = pako.inflate(evt.target.result, {to: 'string'})
        let msg = JSON.parse(text)
        // console.log(msg)
        if (msg.ping) {
          sendData(this.ws, {
            pong: msg.ping
          })
        } else if (msg.tick) {
          handle(msg)
        } else {
          callback(msg)
        }
      }
    }
  }
}

export {
  socket
  // orderbook
}
