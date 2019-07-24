import CryptoJs from 'crypto-js'

/**
 * AES 加密
 * @param word
 * @param keyStr
 */
// const str = `.moc${(new Date().getTime()).toString().substring(0, 6)}zub.ne`
const str = 'ABCDEFGabcdefgAB'
export const encrypt = (word, keyStr = `${str}`) => {
  console.log(btoa(word))
  const {enc: {Utf8: {parse}}, AES: {encrypt}, mode: {ECB}, pad: {Pkcs7}} = CryptoJs
  let key = parse(keyStr)
  // let srcs = parse(btoa(encodeURIComponent(word)))
  let srcs = parse(btoa(word))
  let encrypted = encrypt(srcs, key, {mode: ECB, padding: Pkcs7})
  // return btoa(encrypted.toString())
  return encrypted.toString()
}
/**
 * AES 解密
 * @param word
 * @param keyStr
 * @returns {string}
 */
export const decrypt = (word, keyStr = `${str}`) => {
  const {enc: {Utf8: {parse, stringify}}, AES: {decrypt}, mode: {ECB}, pad: {Pkcs7}} = CryptoJs
  let key = parse(keyStr)
  let decrypted = decrypt(atob(word), key, {mode: ECB, padding: Pkcs7})
  // return decodeURIComponent(atob(stringify(decrypted).toString()))
  return stringify(decrypted).toString()
}
