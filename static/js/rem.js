import store from '../../src/vuex'
getSize()

function getSize () {
  /* 让文字和标签的大小随着屏幕的尺寸做变话 等比缩放 */
  let html = document.getElementsByTagName('html')[0]
  /* 取到屏幕的宽度 */
  let width = window.innerWidth
  let height = window.innerHeight
  let isPC = IsPC()
  if (width < 1050 || !isPC) {
    store.commit('user/TOGGLE_PC_MOBILE', true)
  } else {
    // store.commit('toggleWidth', false)
    store.commit('user/TOGGLE_PC_MOBILE', false)
    // store.commit('toggleFooterStatus', false)
  }
  /* 640 100  320 50 */
  let fontSize = 100 / 1920 * width
  /* 设置fontsize */
  html.style.fontSize = fontSize + 'px'
  html.style.height = height + 'px'
}

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

// alert(flag);
window.onresize = getSize
