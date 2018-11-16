<template>
  <div
    class="about-us-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="top">
        <h1>
          <!--关于我们-->
          {{ $t('M.about_us') }}
        </h1>
        <p>About Us</p>
      </div>
      <div class="content">
        <div
          class="inner-box"
          v-html="aboutData.content"
        >
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getAboutUsDataAjax} from '../../utils/api/header'
import {returnAjaxMsg} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {
      aboutData: {}
    }
  },
  created () {
    this.getAboutUsData()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async getAboutUsData () {
      const params = {
        language: this.language
      }
      const data = await getAboutUsDataAjax(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.aboutData = data.data.data[0]
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .about-us-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.top{
        height:250px;
        text-align: center;
        width:100%;
        background: url(../../assets/develop/about-us.png) no-repeat center center;
        background-size: 102% 100%;
        padding-top:100px;
        >h1{
          font-size: 36px;
          color:#338FF5;
          font-weight: 500;
        }
        >p{
          font-size: 22px;
          color:#97AAC8;
        }
      }
      >.content{
        overflow: hidden;
        >.inner-box{
          margin:50px auto;
          height:1100px;
          width:1100px;
          padding:50px;
        }
      }
    }
    &.night{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #121824;
          >.inner-box{
            background-color: #1e2636;
            color:#8BA0CA
          }
        }
      }
    }
    &.day{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #fff;
          >.inner-box{
            border:1px solid rgba(234,235,236,1);
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
