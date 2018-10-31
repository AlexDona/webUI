<template>
  <div
    class="download-box"
  >
    <div class="inner-box">
      <div class="logo"></div>
      <div class="content">
        <img
          :src="zh_CNSrc"
          v-if="language=='zh_CN'"
        >
        <img
          :src="en_USSrc"
          v-else
        >
        <button class="download-btn">
          立即安装
        </button>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      zh_CNSrc: require('../assets/develop/download-bg-cn.png'),
      en_USSrc: require('../assets/develop/download-bg-en.png')
    }
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      footerInfo: state => state.common.footerInfo
    })
  },
  watch: {
    footerInfo (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .download-box{
    width:100%;
    height:100%;
    background-color: pink;
    >.inner-box{
      width:100%;
      height:100%;
      overflow: hidden;
      >.logo{
        width:3rem;
        height:3rem;
        background-color: blue;
        border-radius:10px;
        margin:3rem auto;
        -webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.1)));
      }
      >.content{
        width:100%;
        height:15rem;
        text-align: center;
        >img{
          height:100%;
        }
        >.download-btn{
          margin: 2rem auto;
          width:10rem;
          height:2rem;
          line-height:2rem;
          background:rgba(70,150,245,1);
          border-radius:40px;
          font-size: 0.8rem;
          color:#fff;
        }
      }
    }
  }
</style>
