// const moment = require('moment');
// const WebSocket = require('ws');
const pako = require('pako')

const WS_URL = 'ws://192.168.1.200:8060/market'

var orderbook = {}

function handle (data) {
  // console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
  let symbol = data.ch.split('.')[1]
  let channel = data.ch.split('.')[2]
  console.log(symbol)
  console.log(channel)
  switch (channel) {
    case 'depth':
      orderbook[symbol] = data.tick
      break
    case 'kline':
      console.log('kline', data.tick)
      break
  }
}

function subscribe (ws, params) {
  // console.log(params);
  /**
   * from:1532835197
   resolution:"1"
   symbol:"AA"
   to:1532921657
   type:"kline"
   */

  let symbols = [params.symbol]
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
  // console.log(resolution);
  // 请求asdfsdfsdf
  for (let symbol of symbols) {
    // 深度
    // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
    ws.send(JSON.stringify({
      'tag': 'REQ',
      'content': `market.${symbol}.depth.step0`,
      'id': `depth_${symbol}`
    }))

    // K线
    ws.send(JSON.stringify({
      'tag': 'REQ',
      'content': `market.${symbol}.kline.${resolution}`,
      'id': `kline_${symbol}`
    }))

    // 交易记录
    ws.send(JSON.stringify({
      'tag': 'REQ',
      'content': `market.${symbol}.trade`,
      'id': `trade_${symbol}`
    }))

    // 实时行情
    ws.send(JSON.stringify({
      'tag': 'REQ',
      'content': `market.${symbol}.ticker`,
      'id': `tick_${symbol}`
    }))
  }

  // 订阅
  for (let symbol of symbols) {
    // 深度
    // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
    ws.send(JSON.stringify({
      'tag': 'SUB',
      'content': `market.${symbol}.depth.step0`,
      'id': `depth_${symbol}`
    }))
    // K线
    ws.send(JSON.stringify({
      'tag': 'SUB',
      'content': `market.${symbol}.kline.${resolution}`,
      'id': `kline_${symbol}`
    }))
    // 交易记录
    ws.send(JSON.stringify({
      'tag': 'SUB',
      'content': `market.${symbol}.trade`,
      'id': `trade_${symbol}`
    }))
    // 实时行情
    ws.send(JSON.stringify({
      'tag': 'SUB',
      'content': `market.${symbol}.ticker`,
      'id': `tick_${symbol}`
    }))
  }
}

const Io = {
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
      // this.ws.send(JSON.stringify(params));
      subscribe(this.ws, params)
    } else {
      this.ws.onopen = evt => {
        // this.ws.send(JSON.stringify(params));
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
        if (msg.ping) {
          this.ws.send(JSON.stringify({
            pong: msg.ping
          }))
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
  Io,
  orderbook
}
