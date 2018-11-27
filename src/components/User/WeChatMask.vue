<template>
  <!--微信遮罩-->
  <div
      class="wx-mask"
      v-if="isWXBrowserStatus"
    >
      <div class="img">
        <div
          class="ios-box"
          v-if="isIOS"
        >
          <img
            v-if="language=='zh_CN'||language=='zh_TW'"
            src="../../assets/develop/zh_CN_weiChat_ios.png"
          >
          <img
            v-else
            src="../../assets/develop/en_US_weiChat_ios.png"
          >
        </div>
        <div
          class="android-box"
          v-if="isAndroid"
        >
          <img
            v-if="language=='zh_CN'||language=='zh_TW'"
            src="../../assets/develop/zh_CN_weiChat_andriod.png"
          >
          <img
            v-else
            src="../../assets/develop/en_US_weiChat_andriod.png"
          >
        </div>
      </div>
    </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  props: ['isAndroid', 'language', 'isIOS', 'isWXBrowserStatus'],
  data () {
    return {
      // isWXBrowserStatus: false
    }
  },
  created () {
    // this.isWXBrowser()
  },
  mounted () {},
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {
  },
  filter: {},
  computed: {
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .wx-mask{
    width:100%;
    height:100%;
    background-color: rgba(0,0,0,.4);
    position: absolute;
    z-index: 1;
    top:0;
    left:0;
    >.img{
      width:100%;
      height:100%;
      text-align: center;
      img{
        width:90%;
      }
    }
  }
</style>
