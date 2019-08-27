/* eslint-disable*/
import CryptoJS from 'crypto-js'

/**
 * AES 加密
 * @param word
 * @param keyStr
 */
// const str = `.moc${(new Date().getTime()).toString().substring(0, 6)}zub.ne`
const str = '123456789asdfghq'
export const encrypt = (data, key = str, iv) => { // 加密
  var key = CryptoJS.enc.Utf8.parse(key)
  var encrypted = CryptoJS.AES.encrypt(data, key,
    {
      // iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
  return encrypted.toString() // 返回的是base64格式的密文
}
/**
 * AES 解密
 * @param word
 * @param keyStr
 * @returns {string}
 */
// export const decrypt = (word, keyStr = `${str}`) => {
//   const {enc: {Utf8: {parse, stringify}}, AES: {decrypt}, mode: {ECB}, pad: {Pkcs7}} = CryptoJS
//   let key = parse(keyStr)
//   let decrypted = decrypt(atob(word), key, {mode: ECB, padding: Pkcs7})
//   // return decodeURIComponent(atob(stringify(decrypted).toString()))
//   return stringify(decrypted).toString()
// }
