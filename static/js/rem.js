import storeCreater from '../../src/vuex'
const store = storeCreater()
getSize()

function getSize () {
  let html = document.getElementsByTagName('html')[0]
  /* 取到屏幕的宽度 */
  let width = window.innerWidth
  let height = window.innerHeight
  console.log(width)
  store.commit('SET_WINDOW_WIDTH', width)
  let isPC = IsPC()
  if (width < 1050 || !isPC) {
    store.commit('TOGGLE_PC_MOBILE', true)
    document.body.classList.add('mobile')
  } else {
    store.commit('TOGGLE_PC_MOBILE', false)
    document.body.classList.remove('mobile')
  }
  /* 640 100  320 50 */
  let fontSize = 100 / 1920 * width
  /* 设置fontsize */
  html.style.fontSize = fontSize + 'px'
  html.style.height = height + 'px'
  // html.style.width = width + 'px'
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
