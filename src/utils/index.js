/**
 * 通用全局方法
 * */

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
export const formatSeconds = (date) => {
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
export function formatNumberInput (event, targetPointLength) {
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
  // pointLength为小数点后几位
  let count = (val.match(/\./g) || []).length// 小数点个数
  // 只允许输入一个小数点
  if (count > 0) {
    valArr = val.split('')
    newVal = ''
    valArr.forEach((item) => {
      if (item == '.') count1++
      if (count1 < 2) newVal += item
    })
    valArr2 = newVal.split('')
    newVal2 = ''
    valArr2.forEach((item) => {
      if (item != '.') {
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
    valArr3.forEach((item) => {
      let temp = parseFloat(item)
      if (!isNaN(temp)) newVal3 += temp
    })
    finalVal = newVal3
  }
  event.value = finalVal
  return finalVal
}

export function getRefValue (self, refName) {
  return self.$refs[refName].value
}
