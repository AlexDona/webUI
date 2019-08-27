/* eslint-disable */
import storeCreator from '../../src/vuex'
import {IsPC} from '../../src/utils'

const store = storeCreator()
getSize(document, window)


function getSize(doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      let clientWidth = docEl.clientWidth
      let remWidth = clientWidth

      if (!clientWidth) return
      if (clientWidth > 2500) {
        remWidth = 960
      } else if (clientWidth > 640) {
        remWidth = 640
      } else if (clientWidth > 480) {
        remWidth = 480
      } else {
        if (clientWidth < 320) {
          remWidth = 320
        }
      }
      store.commit('SET_WINDOW_WIDTH', {
        clientWidth,
        remWidth: remWidth / 7.5
      })

      docEl.style.fontSize = (remWidth / 7.5) + 'px'
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

