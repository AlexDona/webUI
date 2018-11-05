import {socketUrl} from '../../utils/env'
const pako = require('pako')
class socket {
  constructor (url = socketUrl, options) {
    this.heartBeatTimer = null
    this.options = options
    this.messageMap = {}
    this.connState = 0
    this.socket = null
    this.url = url
  }
  doOpen () {
    if (this.connState) return
    this.connState = 1
    this.afterOpenEmit = []
    const BrowserWebSocket = window.WebSocket || window.MozWebSocket
    const socket = new BrowserWebSocket(this.url)
    // socket.binaryType = 'arraybuffer'
    socket.onopen = evt => this.onOpen(evt)
    socket.onclose = evt => this.onClose(evt)
    socket.onmessage = evt => this.onMessage(evt.data)
    socket.onerror = err => this.onError(err)
    this.socket = socket
  }
  onOpen (evt) {
    this.connState = 2
    // this.heartBeatTimer = setInterval(this.checkHeartbeat.bind(this), 20000)
    this.onReceiver({ Event: 'open' })
  }
  checkOpen () {
    return this.connState === 2
  }
  onClose () {
    this.connState = 0
    if (this.connState) {
      this.onReceiver({ Event: 'close' })
    }
  }
  send (data, callback) {
    this.waitForConnection(() => {
      if (this.socket) {
        this.socket.send(JSON.stringify(data))
      }
      if (typeof callback !== 'undefined') {
        callback()
      }
    }, 1000)
  }
  waitForConnection (callback, interval) {
    if (!this.socket || this.socket.readyState === 1) {
      callback()
    } else {
      setTimeout(() => {
        this.waitForConnection(callback, interval)
      }, interval)
    }
  }

  emit (data) {
    return new Promise(resolve => {
      this.socket.send(JSON.stringify(data))
      this.on('message', data => {
        resolve(data)
      })
    })
  }
  onMessage (message) {
    try {
      // console.log(message)
      let blob = message
      let reader = new FileReader()
      reader.readAsBinaryString(blob)
      reader.onload = (evt) => {
        console.log(evt)
        let text = pako.inflate(evt.target.result, {to: 'string'})
        // console.log(text)
        let msg = JSON.parse(text)
        // console.log(msg)
        // 心跳包
        if (msg.type === 2) {
          console.log(msg)
          this.send({
            'tag': 'HEART',
            'content': msg.data,
            'id': `market_001`
          })
        } else {
          this.onReceiver({ Event: 'message', Data: msg })
        }
        // callback(msg)
      }
    } catch (err) {
      console.error(' >> Data parsing error:', err)
    }
  }
  checkHeartbeat () {
    const data = {
      'cmd': 'ping',
      'args': [Date.parse(new Date())]
    }
    console.log(this)
    this.send(data)
  }
  onError (err) {
    console.log(err)
  }
  onReceiver (data) {
    const callback = this.messageMap[data.Event]
    // console.log(callback)
    if (callback) callback(data.Data)
  }
  on (name, handler) {
    this.messageMap[name] = handler
  }
  doClose () {
    console.log('close')
    this.socket.close()
  }
  destroy () {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = null
    }
    this.doClose()
    this.messageMap = {}
    this.connState = 0
    this.socket = null
  }
}

export default socket
