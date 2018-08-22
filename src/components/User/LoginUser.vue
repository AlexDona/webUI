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
            <div class="input username">
             <!--用户名-->
             <input
               type="text"
               class="input"
               value="123"
               placeholder="请输入邮箱/手机号"
             >
            </div>
            <div class="input password">
              <!--密码-->
              <input
                type="password"
                class="input "
                placeholder="请输入密码"
              >
            </div>
            <div class="link">
              <router-link to="/Register">注册</router-link>
              <router-link to="/" class="text-align-r">忘记密码？</router-link>
            </div>
            <button class="login-btn">登录</button>
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
import {changeLang} from '../../utils/api/apiDoc'

export default {
  components: {
    HeaderCommon
  },
  // props,
  data () {
    return {}
  },
  created () {
    // this.changeLang()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async changeLang () {
      let data
      console.log(1)
      data = await changeLang({
        lan: 'en_US'
      })
      console.log(2)
      console.log(data)
      // console.log(data)
    }
  },
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
          background-color: green;
          overflow: hidden;
          >.main-box{
            width:370px;
            height:330px;
            background-color: pink;
            margin: 12% 0 0 50%;
            padding:55px 40px;
            border-radius: 10px;
            /*密码账号框*/
            >.input{
              height:40px;
              width:100%;
              background-color: yellowgreen;
              border-radius: 20px;
              padding:0 20px;
              &.username{
                margin-bottom:35px;
              }
              >.input{
                width:100%;
                height:100%;
              }
            }
            /*注册，忘记密码*/
            >.link{
              width:100%;
              height:40px;
              line-height: 40px;
              font-size: 12px;
              margin-bottom:30px;
              >a{
                display:inline-block;
                width:49%;
              }
            }
            /*登录按钮*/
            >.login-btn{
              width:130px;
              height:40px;
              line-height:40px;
              background-color: yellowgreen;
              border-radius: 20px;
              margin:0 auto;
              display:block;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
</style>
