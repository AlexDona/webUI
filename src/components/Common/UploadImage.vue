<!--
  author: zhaoxinlei
  create: 20190618
  description: 当前页面为 上传图片 公用组件
-->
<template lang="pug">
  .upload-image
    el-upload(
    :action="uploadUrl"
    :headers="headers"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    accept="image/jpeg,image/jpg,image/png,image/bmp"
    :show-file-list="false"
    )
      // 上传组件出现的 形式
      slot
</template>
<script>
import {
  apiCommonUrl,
  xDomain
} from '../../utils/env'
import {getCookie} from '../../utils'
import {mapMutations} from 'vuex'
export default {
  name: 'upload-image',
  // mixins: [],
  // components: {},
  props: {
    // 是否需要 成功提示
    isNeedSuccessTips: {
      type: Boolean,
      default: true
    },
    uploadButtonText: {
      type: String
    },
    defaultImage: {
      type: String
    },
    type: {
      type: String,
      default: 'ID'
    },
    // 当前上传图标索引
    index: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      image: this.defaultImage,
      LIMIT_SIZE: 10 * 1024 * 1024,
      // 图片压缩质量
      ZIP_Quality: 0.6,
      uploadUrl: `${apiCommonUrl}uploadfile`,
      headers: {
        'token': getCookie('token'),
        'x-domain': xDomain
      }
    }
  },
  // created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'SET_REQUEST_COUNT_M'
    ]),
    beforeUpload (file) {
      this.SET_REQUEST_COUNT_M('ADD')
      console.log(file)
      const {size} = file

      if (size - this.LIMIT_SIZE > 0) {
        this.SET_REQUEST_COUNT_M('SUBTRACT')
        // 请上传小于5M的图片
        this.$error_tips_X(this.$t('M.otc_upload_picture7'))
        return false
      }
      return new Promise(resolve => {
        const reader = new FileReader()
        const image = new Image()
        image.onload = (imageEvent) => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          const width = image.width * this.ZIP_Quality
          const height = image.height * this.ZIP_Quality
          canvas.width = width
          canvas.height = height
          context.clearRect(0, 0, width, height)
          context.drawImage(image, 0, 0, width, height)
          const dataUrl = canvas.toDataURL(file.type)
          const blobData = this.dataURI2Blob(dataUrl, file.type)
          resolve(blobData)
        }
        reader.onload = (e) => { image.src = e.target.result }
        reader.readAsDataURL(file)
      })
    },
    beforeRemove (e) {
      console.log(e)
    },
    handleRemove (e) {
      console.log(e)
    },
    handleExceed (e) {
      console.log(e)
    },
    handleSuccess (res, file) {
      console.log(res, file)
      // eslint-disable-next-line
      const {data: {fileKey, fileUrl}, meta: {i18n_code}} = res
      console.log(fileKey, fileUrl)
      this.image = fileUrl
      this.SET_REQUEST_COUNT_M('SUBTRACT')
      if (this.isNeedSuccessTips) {
        // eslint-disable-next-line
        this.$success_tips_X(this.$t(`M.${i18n_code}`))
      }
      this.$emit('uploadSuccess', {type: this.type, index: this.index, url: fileUrl})
    },
    dataURI2Blob (dataURI, type) {
      let binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], {type: type})
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .upload-image
    /deep/
    .el-upload
      .img
        width 180px
        overflow hidden
        border-radius 10px
        height 110px
        margin-bottom 30px
      .upload-button
        height 30px
        line-height 6px
        font-size 12px
        border-radius 2px
        background-color transparent
        color S_main_color
        border-color S_main_color
</style>
