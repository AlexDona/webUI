<!--
  author: zhoaxinlei
  update: 20190821
  description: 当前文件为 微信、qq、百度浏览器遮罩
-->
<template lang="pug">
  .wx-mask(v-if="isWXBrowserStatus || (isBaiDuBrowser && isIOS) || isWeiBoBrowser")
    .img
      .ios-box(v-if="isIOS")
        img(:src="IOSFilterSrc")
      .android-box(v-if="isAndroid")
        img(:src="androidFilterSrc")
</template>
<script>
export default {
  // components: {},
  props: ['isAndroid', 'isIOS', 'isWXBrowserStatus', 'isBaiDuBrowser', 'isChineseLanguage', 'isWeiBoBrowser'],
  data () {
    return {
      IOS_ZH_CNSRC: require('../../assets/develop/zh_CN_weiChat_ios.png'),
      IOS_EN_USSRC: require('../../assets/develop/en_US_weiChat_ios.png'),
      android_ZH_CNSRC: require('../../assets/develop/zh_CN_weiChat_andriod.png'),
      android_EN_USSRC: require('../../assets/develop/en_US_weiChat_andriod.png'),
      IOS_Baidu_ZH_CNSRC: require('../../assets/h5/baidu-guide-bg-zh.png'),
      IOS_Baidu_EN_USSRC: require('../../assets/h5/baidu-guide-en.png')
    }
  },
  // created () {},
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // methods: {},
  // filter: {},
  computed: {
    IOSFilterSrc () {
      if (this.isChineseLanguage) {
        return this.isBaiDuBrowser ? this.IOS_Baidu_ZH_CNSRC : this.IOS_ZH_CNSRC
      } else {
        return this.isBaiDuBrowser ? this.IOS_Baidu_EN_USSRC : this.IOS_EN_USSRC
      }
    },
    androidFilterSrc () {
      return this.isChineseLanguage ? this.android_ZH_CNSRC : this.android_EN_USSRC
    }
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .wx-mask {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);

    > .img {
      width: 100%;
      height: 100%;
      text-align: center;

      img {
        width: 90%;
      }
    }
  }
</style>
