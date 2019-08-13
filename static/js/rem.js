/* eslint-disable */
import storeCreator from '../../src/vuex'

const store = storeCreator()
getSize(document, window)

// 检测是否为pc
function IsPC () {
  let userAgentInfo = navigator.userAgent
  let Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod']
  let flag = true
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

function getSize (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
      store.commit('SET_WINDOW_WIDTH', clientWidth)
      let isPC = IsPC()
      if (!isPC) {
        store.commit('TOGGLE_PC_MOBILE', true)
        document.body.classList.add('mobile')
      } else {
        store.commit('TOGGLE_PC_MOBILE', false)
        document.body.classList.remove('mobile')
      }
    }
  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
}
