/**
 * 通用全局方法
 * */
import {
  SPECIAL_REG,
  CHINESE_REG,
  ID_REG,
  WITHDRAWAL_REG
} from './regExp'
import citys from './citys'

const pako = require('pako')
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
// JSON字符串
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}
// JSON
export const getStoreWithJson = name => {
  if (!name) return
  return JSON.parse(window.localStorage.getItem(name))
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 设置 cookie
 * @param name
 * @param value
 */
export const setCookie = (name, value, times) => {
  if (value instanceof Object) {
    value = JSON.stringify(value)
  }
  let expires
  if (times) {
    let date = new Date()
    date.setTime(date.getTime() + (times * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toGMTString()}`
  } else {
    expires = ''
  }
  document.cookie = `${name}=${value}${expires};path=/`
}

/**
 * 获取cookie
 * @param name
 * @returns {string}
 */
export const getCookie = name => {
  let cookies = document.cookie
  if (cookies.length > 0) {
    let start = cookies.indexOf(`${name}=`)
    if (start < 0) {
      return ''
    }
    let end = cookies.indexOf(';', start)
    if (end < 0) {
      end = cookies.length
    }
    return cookies.substring(start + name.length + 1, end)
  }
}

/**
 * 获取cookie(转obj)
 * @param name
 * @returns {any}
 */
export const getCookieWithJSON = name => {
  if (getCookie(name)) {
    return JSON.parse(getCookie(name))
  }
}
/**
 * 删除cookie
 * @param name
 */
export const removeCookie = name => {
  setCookie(name, '', -1)
}
/**
 * 时间格式化
 * @date 要格式化的时间戳
 * @methods:
 *  'normal'：通用格式（2018-01-01 11：02：23）
 *  'date': 只取日期（2018-01-01）
 *  'time'：只取时间（11：02：23）
 *  'BIH': 国际标准时分秒 (09ˋ40′32″)
 */
export const timeFilter = (date, methods) => {
  let filterTime
  date = new Date(date)
  let newDate
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = date.getDate()
  day = day < 10 ? '0' + day : day
  newDate = year + '-' + month + '-' + day + ' '
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  const time = hour + ':' + minute + ':' + second
  const BIHTime = hour + 'ˋ' + minute + '′' + second + '″'
  switch (methods) {
    case 'normal':
      filterTime = newDate + time
      break
    case 'date':
      filterTime = newDate
      break
    case 'time':
      filterTime = time
      break
    case 'BIH':
      filterTime = BIHTime
      break
  }
  return filterTime
}
// 交易中订单倒计时国际标准时分秒 (09ˋ40′32″)
export const formatSeconds = date => {
  let secondTime = parseInt(date / 1000)// 秒
  let minuteTime = 0 // 分
  let hourTime = 0 // 小时
  if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
    // 获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60)
    // 获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60)
    // 如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      // 获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60)
      // 获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60)
    }
  }
  let result = '' + parseInt(secondTime) + '″'
  if (minuteTime > 0) {
    result = '' + parseInt(minuteTime) + '′' + result
  }
  if (hourTime > 0) {
    result = '' + parseInt(hourTime) + 'ˋ' + result
  }
  return result
}

/**
 * input框限制输入（只可以输入数字类型）
 * @param event : input框dom对象
 * @param targetPointLength ：限制小数点位数
 */
export const formatNumberInput = (event, targetPointLength) => {
  let val = event.value
  let newVal = ''
  let newVal2 = ''
  let newVal3 = ''
  let newVal4 = ''
  let newVal5 = ''
  let valArr = []
  let valArr2 = []
  let valArr3 = []
  let valArr4 = []
  let finalVal = ''
  let count1 = 0
  val = val.startsWith('.') ? val.substring(1) : val
  // pointLength为小数点后几位
  let count = (val.match(/\./g) || []).length// 小数点个数
  // 只允许输入一个小数点
  if (count > 0) {
    valArr = val.split('')
    newVal = ''
    valArr.forEach(item => {
      if (item === '.') count1++
      if (count1 < 2) newVal += item
    })
    valArr2 = newVal.split('')
    newVal2 = ''
    valArr2.forEach(item => {
      if (item !== '.') {
        let temp = parseFloat(item)
        if (!isNaN(temp)) {
          newVal2 += temp
        }
      } else {
        newVal2 += item
      }
    })
    valArr4 = newVal2.split('.')
    newVal4 = valArr4[0]
    newVal5 = newVal2.split('.')[1].substr(0, targetPointLength)
    finalVal = newVal4 + '.' + newVal5
  } else {
    valArr3 = val.split('')
    newVal3 = ''
    valArr3.forEach(item => {
      let temp = parseFloat(item)
      if (!isNaN(temp)) newVal3 += temp
    })
    finalVal = newVal3
  }
  event.value = finalVal
  return finalVal
}

/**
 * 手机号输入限制
 * @param event ： 当前input DOM 对象
 */
export const phoneNumRegexpInput = event => {
  let val = event.value
  let finalVal = ''
  let valArr = val.split('')
  _.forEach(valArr, (item, index) => {
    if (((item - 0) || item === '0') && index < 11) {
      finalVal += item
    }
  })
  event.value = finalVal
  return finalVal
}

/**
 * 只能输入正整数限制
 * @param event ： 当前input DOM 对象
 */
export const positiveIntegerNumRegexpInput = event => {
  let val = event.value
  let finalVal = ''
  let valArr = val.split('')
  _.forEach(valArr, (item) => {
    if (((item - 0) || item === '0')) {
      finalVal += item
    }
  })
  event.value = finalVal
  return finalVal
}

/**
 * 邮箱账号输入限制
 * @param event：当前input DOM对象
 */
export const emailNumRegexpInput = event => {
  let val = event.value
  let finalVal = ''
  let valArr = val.split('')
  // .个数
  let pointCount = 0
  // @个数
  let aCount = 0
  _.forEach(valArr, item => {
    if (item === '.') {
      pointCount++
    }
    if (item === '@') {
      aCount++
    }
    if (!SPECIAL_REG.test(item) && !CHINESE_REG.test(item) && pointCount < 2 && aCount < 2) {
      finalVal += item
    }
  })
  event.value = finalVal
  return finalVal
}

/**
 * 身份证 证件号码输入限制
 * @param event：当前input DOM对象
 */
export const idCardRegexpInputNum = event => {
  let val = event.value
  let finalVal = ''
  let valArr = val.split('')
  // 证件位数
  let pointCount = 0
  // X x 个数
  let aCount = 0
  _.forEach(valArr, item => {
    if (item) {
      pointCount++
    }
    if (item === 'x' || item === 'X') {
      aCount++
    }
    if (!ID_REG.test(item) && !WITHDRAWAL_REG.test(item) && !CHINESE_REG.test(item) && pointCount < 19 && aCount < 2) {
      finalVal += item
    }
  })
  event.value = finalVal
  return finalVal
}

/**
 * 护照 证件号码输入限制
 * @param event：当前input DOM对象
 */

export const passportEntryRestrictions = event => {
  let val = event.value
  let finalVal = ''
  let valArr = val.split('')
  // 护照位数
  let pointCount = 0
  _.forEach(valArr, item => {
    if (item) {
      pointCount++
    }
    if (!CHINESE_REG.test(item) && pointCount < 21) {
      finalVal += item
    }
  })
  event.value = finalVal
  return finalVal
}

export const getRefValue = (self, refName) => {
  if (!self.$refs[refName]) return false
  return self.$refs[refName].value
}

/**
 * 手机号、email隐藏封装
 * @param phoneNum
 * @returns {string}
 */
export const phoneNumberFormat = phoneNum => {
  return `${phoneNum.substring(0, 3)}****${phoneNum.substring(phoneNum.length - 4)}`
}

/**
 * 截取2位小数
 * @param number
 * @returns {*}
 */
export const keep2Num = number => {
  // if (!number || isNaN(number)) return 0.00
  console.log(number)
  return (number - 0).toFixed(2) - 0
}

/**
 * 修正精度
 * @param num1
 * @param num2
 * @param symbol 计算符号
 * @returns {*}
 */
export const amendPrecision = (num1, num2, symbol) => {
  num1 = scientificToNumber(num1)
  num2 = scientificToNumber(num2)
  let num1PointLength = ((num1 + '').split('.')[1] || []).length
  let num2PointLength = ((num2 + '').split('.')[1] || []).length
  let maxPointLength = num1PointLength > num2PointLength ? num1PointLength : num2PointLength
  let newNum1 = Math.round(Math.pow(10, maxPointLength) * num1)
  let newNum2 = Math.round(Math.pow(10, maxPointLength) * num2)
  switch (symbol) {
    case '*':
      return scientificToNumber(newNum1 * newNum2 / Math.pow(Math.pow(10, maxPointLength), 2))
    case '-':
      return scientificToNumber((newNum1 - newNum2) / Math.pow(10, maxPointLength))
    case '+':
      return scientificToNumber((newNum1 + newNum2) / Math.pow(10, maxPointLength))
    case '/':
      return scientificToNumber((newNum1 * Math.pow(10, maxPointLength))) / (newNum2 * Math.pow(10, maxPointLength))
  }
}

/**
 * 科学计数法
 * @param number
 * @returns {*}
 */
export const scientificToNumber = number => {
  var str = (number + '').toString()
  if (str.indexOf('.') == -1) {
    var reg = /^(\d+)(e)([\-]?\d+)$/
    let arr
    let len
    let zero = ''

    /* 6e7或6e+7 都会自动转换数值 */
    if ((!reg.test(str))) {
      return number
    } else {
      /* 6e-7 需要手动转换 */
      arr = reg.exec(str)
      len = Math.abs(arr[3]) - 1
      for (var i = 0; i < len; i++) {
        zero += '0'
      }
      return '0.' + zero + arr[1]
    }
  } else {
    let reg = /^(\d+[.]?\d+)(e)([\-]?\d+)$/
    let arr
    let len
    let zero = ''

    /* 6e7或6e+7 都会自动转换数值 */
    if ((!reg.test(str))) {
      return number
    } else {
      /* 6e-7 需要手动转换 */
      arr = reg.exec(str)
      len = Math.abs(arr[3]) - 1
      for (let i = 0; i < len; i++) {
        zero += '0'
      }
      return '0.' + zero + arr[1].replace('.', '')
    }
  }
}

/**
 * gzip解压缩
 * @param b64Data
 * @returns {string}
 */
export const unzip = b64Data => {
  console.log(b64Data)
  if (!b64Data) return false
  var strData = atob(b64Data)
  // Convert binary string to character-number array
  var charData = strData.split('').map(function (x) {
    return x.charCodeAt(0)
  })
  // Turn number array into byte-array
  var binData = new Uint8Array(charData)
  // // unzip
  var data = pako.inflate(binData)
  // Convert gunzipped byteArray back to ascii string:
  strData = String.fromCharCode.apply(null, new Uint16Array(data))
  return decodeURIComponent(strData)
}

/**
 * 截取小数点后几位 不是四舍五入
 * @num 要截取的数字
 * @pointLength 小数点后需要截取的位数
 */
export const cutOutPointLength = (num, pointLength) => {
  let result
  let str = num + ''
  let arr = str.split('.')
  if (arr.length == 1) {
    result = arr[0]
  } else {
    let value = arr[1].slice(0, pointLength)
    result = arr[0] + '.' + value
  }
  return result - 0
}
/**
 * 下载文件改名
 * @param downloadUrl
 * @param filename
 * @returns {boolean}
 */
export const downloadFileWithUserDefined = (downloadUrl, filename) => {
  if (downloadUrl) {
    fetch(downloadUrl).then(res => res.blob().then(blob => {
      let a = document.createElement('a')
      let url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(url)
    }))
  } else {
    return false
  }
}
/**
 * 获取浏览器版本、操作系统
 */
export const getUserAgent = () => {
  var UserAgent = navigator.userAgent.toLowerCase()
  if (/ucweb/.test(UserAgent)) return 'UC'
  if (/chrome/.test(UserAgent.substr(-34, 6)) || /chrome/.test(UserAgent.substr(-33, 6))) return 'Chrome'
  if (/firefox/.test(UserAgent)) return 'firefox'
  if (/opera/.test(UserAgent)) return 'opera'
  if (/safari/.test(UserAgent) && !/chrome/.test(UserAgent)) return 'safari'
  if (/360se/.test(UserAgent)) return '360'
  if (/bidubrowser/.test(UserAgent)) return 'baidu'
  if (/metasr/.test(UserAgent)) return 'sougou'
  if (/msie 6.0/.test(UserAgent)) return 'IE6'
  if (/msie 7.0/.test(UserAgent)) return 'IE7'
  if (/msie 8.0/.test(UserAgent)) return 'IE8'
  if (/msie 9.0/.test(UserAgent)) return 'IE9'
  if (/msie 10.0/.test(UserAgent)) return 'IE10'
  if (/msie 11.0/.test(UserAgent)) return 'IE11'
  if (/lbbrowser/.test(UserAgent)) return 'liebao'
  if (/micromessenger/.test(UserAgent)) return 'weixin'
  if (/qqbrowser/.test(UserAgent)) return 'QQ'
  return 'other'
}

export const detectOS = () => {
  let {platform} = navigator
  let sUserAgent = navigator.userAgent

  let isWin = (platform == 'Win32') || (platform == 'Windows')
  let isMac = (platform == 'Mac68K') || (platform == 'MacPPC') || (platform == 'Macintosh') || (platform == 'MacIntel')
  if (isMac) return 'Mac'
  let isUnix = (platform == 'X11') && !isWin && !isMac
  if (isUnix) return 'Unix'
  let isLinux = (String(platform).indexOf('Linux') > -1)

  let bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == 'android'
  if (isLinux) {
    if (bIsAndroid) {
      return 'Android'
    } else {
      return 'Linux'
    }
  }
  if (isWin) {
    let isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1
    if (isWin2K) return 'Windows 2000'
    let isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 ||
      sUserAgent.indexOf('Windows XP') > -1
    if (isWinXP) return 'Windows XP'
    let isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1
    if (isWin2003) return 'Windows 2003'
    let isWinVista = sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1
    if (isWinVista) return 'Windows Vista'
    let isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1
    if (isWin7) return 'Windows 7'
    let isWin8 = sUserAgent.indexOf('Windows NT 6.2') > -1 || sUserAgent.indexOf('Windows 8') > -1
    if (isWin8) return 'Windows 8'
    let isWin10 = sUserAgent.indexOf('Windows NT 10.0') > -1 || sUserAgent.indexOf('Windows 10') > -1
    if (isWin10) return 'Windows 10'
  }
  return 'other'
}

// 身份证正则校验
export const IdentityCodeValid = (code) => {
  var city = citys
  // var tip = ''
  var pass = true

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    // tip = '身份证号格式错误'
    pass = false
  } else if (!city[code.substr(0, 2)]) {
    // tip = '地址编码错误'
    pass = false
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('')
      // 加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
      // 校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
      var sum = 0
      var ai = 0
      var wi = 0
      for (var i = 0; i < 17; i++) {
        ai = code[i]
        wi = factor[i]
        sum += ai * wi
      }
      // var last = parity[sum % 11]
      if (parity[sum % 11] != code[17]) {
        // tip = '校验位错误'
        pass = false
      }
    }
  }
  if (!pass) console.log('no-pass')
  return pass
}
