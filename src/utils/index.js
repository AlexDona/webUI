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
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
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
 */
export const timeFilter = (date, methods) => {
  let filterTime
  date = new Date(date)
  let newDate
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? '0' + month : month
  let day = date.getDay()
  day = day < 10 ? '0' + day : day
  newDate = year + '-' + month + '-' + day + ' '
  let hour = date.getHours()
  hour = hour < 10 ? '0' + hour : hour
  let miunte = date.getMinutes()
  miunte = miunte < 10 ? '0' + miunte : miunte
  let second = date.getSeconds()
  second = second < 10 ? '0' + second : second
  const time = hour + ':' + miunte + ':' + second
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
  }
  return filterTime
}
