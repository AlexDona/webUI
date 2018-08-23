<template>
  <div
    class="register-box user"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <!--注册-->
      <div class="main-box">
        <!--切换注册方式-->
        <ul class="methods-list">
          <li
            class="method-item cursor-pointer"
            :class="{active:!activeMethod}"
            @click="toggleMethod(0)"
          >手机注册</li>
          <li
            class="method-item cursor-pointer"
            :class="{active:activeMethod}"
            @click="toggleMethod(1)"
          >邮箱注册</li>
        </ul>
        <!--手机号注册-->
        <transition
          enter-active-class = "animated fadeIn"
          leave-active-class = "animated fadeOut"
        >
          <div
          class="inner-content mobile"
          v-show="!activeMethod"
        >
          <div class="input username">
            <!--国籍选择-->
            <el-select
              v-model="activeCountry"
              placeholder="请选择"
            >
              <el-option
                v-for="item in contryAreaList"
                :key="item.code"
                :label="item.code"
                :value="item.code"
              >
                <span style="float: left">
                  <span v-show="language==='zh_CN'">
                    {{ item.chName }}
                  </span>
                  <span v-show="language!=='zh_CN'">
                    {{item.enName}}
                  </span>
                </span>
                <span style="
                  float: right;
                  color: #8492a6;
                  font-size: 13px"
                >{{ item.code }}</span>
              </el-option>
            </el-select>
            <!--手机号-->
            <input
              type="text"
              class="input mobile-phone"
              placeholder="手机号码"
              v-model="phoneNum"
            >
          </div>
        </div>
        </transition>
        <!--邮箱注册-->
        <transition
          enter-active-class = "animated fadeIn"
          leave-active-class = "animated fadeOut"
        >
          <div
          class="inner-content email"
          v-show="activeMethod"
        >
          <!--邮箱账号-->
          <div class="input">
            <input
              type="text"
              class="input"
              placeholder="邮箱地址"
            >
          </div>
        </div>
        </transition>
        <!--公共部分-->
        <div class="inner-content common">
          <div class="input">
            <!--图片验证码-->
            <input
              type="text"
              class="input image-validate"
              placeholder="验证码"
            >
            <!--获取图片验证码-->
            <span
              @click="refreshCode"
              class="cursor-pointer"
            >
              <ImageValidate
                id="register"
                :content-width="80"
                :content-height="40"
                :identifyCode="identifyCode"
                class="display-inline-block"
              />
            </span>

          </div>
          <div class="input">
            <!--邮箱、手机验证码-->
            <input
              type="text"
              class="input image-validate"
              :placeholder="activeCodePlaceholder"
              v-model="checkCode"
            >
            <span class="middle-line"></span>
            <input
              type="button"
              :disabled="sendMsgBtnDisabled"
              :value="sendMsgBtnText"
              class="send-code-btn cursor-pointer"
              @click="sendPhoneOrEmailCode(activeMethod)"
            >
          </div>
          <div class="input">
            <!--登录密码-->
            <input
              type="password"
              class="input"
              placeholder="请输入密码"
            >
          </div>
          <div class="input">
            <!--确认密码-->
            <input
              type="password"
              class="input "
              placeholder="请输入密码"
            >
          </div>
          <div class="input">
            <!--邀请码-->
            <input
              type="password"
              class="input "
              placeholder="邀请码（没有可不填）"
            >
          </div>
          <div class="input">
            <!--用户协议-->
            <el-checkbox v-model="userAgreementStatus">我已阅读并同意 <router-link to="/">《用户协议》</router-link></el-checkbox>
          </div>
          <button
            class="register-btn btn cursor-pointer"
            @click="sendRegister"
          >注册</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ImageValidate from '../Common/ImageValidateCommon'
import HeaderCommon from '../Common/HeaderCommon'
import {mapState} from 'vuex'
import {list as contryAreaList} from '../../../static/js/countryAreaList'
import {sendMsgByPhoneUser, sendRegisterUser} from '../../utils/api/apiDoc'
import {returnAjaxMessage, validatePhoneNum} from '../../utils/commonFunc'

export default {
  components: {
    HeaderCommon,
    ImageValidate
  },
  // props,
  data () {
    return {
      activeMethod: 0, // 当前注册方式： 0： 手机注册 : 1 邮箱注册
      contryAreaList: contryAreaList, // 国家区域列表
      activeCountry: '86',
      activeCodePlaceholder: !this.activeMethod ? '短信验证码' : '邮箱验证码',
      identifyCode: '1235', // 图片验证码
      phoneNum: '', // 手机号
      emailNum: '', // email 地址
      password: 'a111111', // 密码
      repeatPassword: '', // 确认密码
      checkCode: '', // 短信、邮箱验证码
      inviter: '', // 邀请码
      userAgreementStatus: true, // 是否同意协议
      msgCountDown: 60,
      sendMsgBtnText: '发送验证码',
      sendMsgBtnDisabled: false,
      end: '' // 占位
    }
  },
  created () {
    require('../../../static/css/list/User/Register.css')
    // changeLang({'lan': 'zh_CN'})
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 手机
    msgTimer () {
      if (this.msgCountDown > 0) {
        this.msgCountDown--
        this.sendMsgBtnText = this.msgCountDown
        setTimeout(this.msgTimer, 1000)
      } else {
        this.msgCountDown = 0
        this.sendMsgBtnText = '发送验证码'
        this.sendMsgBtnDisabled = false
      }
    },
    // 发送验证码（短信、邮箱）
    async sendPhoneOrEmailCode (type) {
      switch (type) {
        // 短信
        case 0:
          const data = await sendMsgByPhoneUser({
            country: this.activeCountry,
            phone: this.phoneNum
          })
          // 提示信息
          returnAjaxMessage(data, this)
          this.msgCountDown = 60
          this.sendMsgBtnDisabled = true
          this.msgTimer()
          break
        // 邮箱
        case 1:
          break
      }``
    },
    // 随机数
    getRandomNum () {
      return parseInt(Math.random() * 10000) + ''
    },
    // 刷新验证码
    refreshCode () {
      this.identifyCode = this.getRandomNum()
    },
    // 发送注册申请
    async sendRegister () {
      let regType = this.activeMethod ? 'email' : 'phone'
      console.log(regType)
      switch (regType) {
        case 'phone':
          if (!validatePhoneNum(this.phoneNum)) {
            alert('错误')
            return false
          }
          break
      }
      let userName = this.activeMethod ? this.emailNum : this.phoneNum
      let params = {
        userName: userName,
        password: this.password,
        checkCode: this.checkCode,
        // inviter: this.inviter,
        regType: regType
      }
      const data = await sendRegisterUser(params)
      returnAjaxMessage(data, this)
      console.log(data)
    },
    // 切换注册方式
    toggleMethod (method) {
      this.activeMethod = method
      this.activeCodePlaceholder = !this.activeMethod ? '短信验证码' : '邮箱验证码'
    }
    // async changeLang () {
    //   let data
    //   console.log(1)
    //   data = await changeLang({
    //     lan: 'en_US'
    //   })
    //   console.log(2)
    //   console.log(data)
    //   // console.log(data)
    // }
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
<style scoped lang="scss">
  .register-box{
    width:100%;
    height:1080px;
    >.inner-box{
      width:100%;
      height:100%;
      >.main-box{
        width:370px;
        background-color: pink;
        margin: 12% 0 0 50%;
        padding:12px 40px;
        border-radius: 10px;
        /*注册方式选择*/
        >.methods-list{
          display:flex;
          >.method-item{
            flex:1;
            height:40px;
            line-height:40px;
            text-align: center;
            &.active{
              color:#fff;
              font-size: 16px;
            }
          }
        }
        >.inner-content{
          /*密码账号框*/
          >.input{
            height:40px;
            width:100%;
            background-color: yellowgreen;
            border-radius: 20px;
            padding:0 20px;
            margin-bottom:15px;
            >.input{
              width:100%;
              height:100%;
              &.image-validate{
                width:164px;
                vertical-align: top;
              }
              &.mobile-phone{
                width:164px;
              }
            }
            >.middle-line{
              width:1px;
              height:20px;
              display: inline-block;
              background-color: #f40;
              vertical-align: top;
              margin:10px 5px 0 0;
            }
            >.send-code-btn{
              height:40px;
              line-height: 40px;
              text-align: center;
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
          /*注册按钮*/
          >.btn{
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
</style>
