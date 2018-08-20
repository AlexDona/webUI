<template>
  <div
    class="login-box user"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <!--pc登录-->
      <div class="pc-box content">
        <!--登录第一步-->
        <div class="first-step">
          <!--登录框-->
          <!--用户名密码登录-->
          <div class="main-box user-password">
            <input type="text" class="input">
          </div>
          <!--二维码登录-->
          <div class="main-box er-code"></div>
        </div>
        <!--登录第二步-->
        <div class="second-step"></div>
        <!--登录第三步-->
        <div class="third-step"></div>
      </div>
      <!--移动端登录-->
      <div class="mobile-box content"></div>
    </div>
  </div>
</template>
<script>
import HeaderCommon from '../Common/HeaderCommon'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  .login-box{
    width:100%;
    height:1080px;
    >.inner-box{
      width:100%;
      height:100%;
      >.pc-box{
        width:100%;
        height:100%;
        >.first-step{
          width:100%;
          height:100%;
          background-color: yellow;
          overflow: hidden;
          >.main-box{
            width:370px;
            height:330px;
            background-color: pink;
            margin: 12% 0 0 50%;
          }
        }
      }
    }
  }
</style>
