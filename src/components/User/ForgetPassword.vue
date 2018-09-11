<template>
  <div
    class="froget-password-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="title">
        找回密码
      </div>
      <!--步骤条-->
      <div class="step-box">
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=1}"
        >
          <div class="line"></div>
          <p class="step-number">1</p>
          <p class="step-desc">填写账户名</p>
        </div>
        <div
          class="step-item"
         :class="{'have-down': activeStepNumber>=2}"
        >
          <div class="line"></div>
          <p class="step-number">2</p>
          <p class="step-desc">验证身份</p>
        </div>
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=3}"
        >
          <div class="line"></div>
          <p class="step-number">3</p>
          <p class="step-desc">设置新密码</p>
        </div>
        <div
          class="step-item"
          :class="{'have-down': activeStepNumber>=4}"
        >
          <div class="line"></div>
          <p class="step-number">4</p>
          <p class="step-desc">完成</p>
        </div>
      </div>
      <!--操作-->
      <div class="content-box">
        <!--步骤一-->
        <div
          class="content-item step1"
          v-if="activeStepNumber==1"
        >
          <div class="inner-box">
            <div class="item">
              <span class="label">账号</span>
              <span class="label-content">
                <input
                  class="username-input"
                  type="text"
                  v-model="username"
                />
              </span>
            </div>
            <div class="item">
              <span class="label">验证</span>
              <!--滑块验证-->
              <span class="label-content">
                <div class="drag-box border-radius4">
                <div class="drag cursor-pointer border-radius4">
                  <div class="drag_bg border-radius4">
                  </div>
                  <div class="drag_text border-radius4">
                    {{confirmWords}}
                    <!--请按住滑块，拖动到最右边-->
                  </div>
                  <div
                    @mouseup="mouseupFn($event)"
                    @mousedown="mousedownFn($event)"
                    class="handler handler_bg"
                  >
                    <IconFont class="icon-text" iconName="icon-icon-right"/>
                  </div>
                </div>
              </div>
              </span>
            </div>
            <div class="item">
              <span class="label"></span>
              <span class="label-content">
                <!--下一步按钮-->
                <button class="next-btn">下一步</button>
              </span>
            </div>
          </div>
        </div>
        <!--步骤二-->
        <div
          class="content-item step2"
          v-else-if="activeStepNumber == 2"
        >
          <div class="inner-box">
            <div class="item">
              <span class="label">验证手机</span>
              <span class="label-content">
                <span class="number">18625512982</span>
                <span class="tips">{{phoneNumTips}}</span>
              </span>
            </div>
            <div class="item">
              <span class="label">手机验证码</span>
              <span class="label-content">
                <input
                  class="username-input validate-code-input"
                  type="text"
                  v-model="phoneCode"
                />
                <!--发送验证码按钮-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfPhoneBtn"
                  @run="sendPhoneOrEmailCode(0)"
                />
              </span>
            </div>
            <div class="item">
              <span class="label">验证邮箱</span>
              <span class="label-content">
                <span class="number">999999999@qq.com</span>
                <span class="tips">{{phoneNumTips}}</span>
              </span>
            </div>
            <div class="item">
              <span class="label">邮箱验证码</span>
              <span class="label-content">
                <input
                  class="username-input validate-code-input"
                  type="text"
                  v-model="emailCode"
                />
                <!--发送验证码按钮-->
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfEmailBtn"
                  @run="sendPhoneOrEmailCode(1)"
                />
              </span>
            </div>
          </div>
        </div>
        <!--步骤三-->
        <div
          class="content-item step3"
          v-else-if="activeStepNumber == 3"
        ></div>
        <!--步骤四-->
        <div
          class="content-item step4"
          v-else
        ></div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFont from '../Common/IconFontCommon'
import CountDownButton from '../Common/CountDownCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')
export default {
  components: {
    IconFont,
    CountDownButton
  },
  // props,
  data () {
    return {
      activeStepNumber: 2, // 当前步骤
      username: '',
      phoneCode: '', // 手机验证码
      emailCode: '', // 邮箱验证码
      confirmWords: '请按住滑块，拖动到最右边', /* 滑块文字 */
      sliderFlag: true, // 滑块调用节流阀
      mouseMoveStatus: false, // 触发拖动状态
      confirmSuccess: false, // 验证成功判断
      dragStatus: true, // 拖动标记
      maxwidth: 340, // 拖动最大宽度，依据滑块宽度算出来的
      phoneNumTips: '若该手机号无法使用请联系客服', // 手机号提示信息
      emailNumTips: '若该邮箱无法使用请联系客服', // 邮箱号提示信息
      end: ''
    }
  },
  created () {
  },
  mounted () {
    $('body').on('mousemove', (e) => { // 拖动，这里需要用箭头函数，不然this的指向不会是vue对象
      if (this.mouseMoveStatus) {
        var width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxwidth) {
          $('.handler').css({'left': width})
          $('.drag_bg').css({'width': width})
        } else if (width > this.maxwidth) {
          this.successFunction()
        }
      }
    })
    $('body').on('mouseup', (e) => { // 鼠标放开
      this.mouseMoveStatus = false
      var width = e.clientX - this.beginClientX
      if (width < this.maxwidth) {
        $('.handler').animate({'left': 0}, 500)
        $('.drag_bg').animate({'width': 0}, 500)
      }
      $('body').off('mousemove')
      $('body').off('mouseup')
    })
    $('body').on('dblclick', (e) => {

    })
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    /**
     * 滑块验证
     */
    mouseupFn (e) {
      console.log('mouseup')
      // this.dragStatus = true;
    },
    mousedownFn: function (e) {
      // if (this.dragStatus) {
      this.dragStatus = false
      this.mouseMoveStatus = true
      this.beginClientX = e.clientX
      // console.log('mousedown')
      // }
    },
    // 按下滑块函数
    successFunction () {
      // console.log('success0')
      if (this.sliderFlag) {
        // console.log('success1')
        this.sliderFlag = false// 调用函数节流阀
        $('.handler').css({'left': this.maxwidth})
        $('.drag_bg').css({'width': this.maxwidth})
        $('body').unbind('mousemove')
        $('body').unbind('mouseup')
        this.confirmSuccess = true
        this.mouseMoveStatus = false
        $('.handler').css({'left': 0})
        $('.drag_bg').css({'width': 0})
      } // 验证成功函数
    }
  },
  filter: {},
  computed: {
    ...mapState({
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  .froget-password-box{
    >.inner-box{
      margin:180px auto;
      width:780px;
      background:linear-gradient(201deg,rgba(42,88,137,1) 0%,rgba(43,58,111,1) 100%);
      border-radius:10px;
      box-shadow:0px 4px 21px 0px rgba(26,42,71,1);
      color:#fff;
      padding-bottom:50px;
      >.title{
        height:60px;
        line-height:60px;
        font-size: 24px;
        box-sizing: border-box;
        padding:0 35px;
        border-bottom:1px solid rgba(68,102,145,1);
      }
      /*步骤条*/
      >.step-box{
        height:100px;
        text-align: center;
        display:flex;
        justify-content:center;
        >.step-item{
          max-width:140px;
          flex:1;
          vertical-align: top;
          height:100px;
          position: relative;
          &.have-down{
            >.line,>.step-number{
              background-color: $mainColor;
            }
            >.step-desc{
              color:$mainColor;
            }
          }
          >.line{
            width:140px;
            height:2px;
            background-color: #5D7A9F;
            position: relative;
            top:50%;
          }
          >.step-number{
            margin: 0 auto;
            width:24px;
            height:24px;
            line-height:24px;
            background-color: #5D7A9F;
            font-size: 12px;
            font-weight: 700;
            border-radius:50%;
            color:#fff;
            position: absolute;
            left:50%;
            top:50%;
            transform: translate(-50%,-50%);
          }
          >.step-desc{
            margin-top:70px;
            color: #5D7A9F;
          }
        }
      }
      >.content-box{
        width:100%;
        padding-top:30px;
        >.content-item{
          width:600px;
          margin:0 auto;
          text-align: center;
          >.inner-box{
            >.item{
              height:36px;
              line-height: 36px;
              margin-top:15px;
              >span{
                display: inline-block;
                vertical-align: top;
                margin-right:20px;
              }
              >.label{
                height:36px;
                width:100px;
                text-align: right;
              }
              >.label-content{
                width:380px;
                height:36px;
                text-align: left;
                >.number{
                  font-size: 16px;
                  font-weight: 700;
                  color:$mainColor;
                  margin-right:10px;
                }
                >.tips{
                  width:200px;
                  display:inline-block;
                  font-size: 12px;
                  color:$upColor;
                }
                >.next-btn{
                  width:80px;
                  height:36px;
                  background:linear-gradient(81deg,rgba(61,152,249,1) 0%,rgba(71,135,255,1) 100%);
                  border-radius:4px;
                  box-shadow:0 0 8px 0px rgba(26,42,71,1);
                  color:#fff;
                  margin-left:0px;
                }
                >.username-input{
                  width:200px;
                  height:36px;
                  background:rgba(32,55,90,1);
                  border-radius:4px;
                  padding:0 10px;
                  box-sizing: border-box;
                  color:#fff;
                }
                >.validate-code-input{
                  width:126px;
                }
                >.send-code-btn{
                  padding:0 10px;
                  height:36px;
                  background:rgba(51,143,245,1);
                  border-radius:4px;
                  color:#fff;
                }
              }
              /*滑块*/
              .drag-box{
                width:200px;
                display:inline-block;
                overflow: hidden;
                >.drag{
                  position: relative;
                  background-color: #20375a;
                  width: 200px;
                  height: 36px;
                  line-height: 36px;
                  text-align: center;
                  /*border: 1px solid #4e5b85;*/
                  cursor: pointer;
                  color:#fff;
                  >.drag_bg{
                    background-color: #20375a;
                    height: 36px;
                  }
                  >.drag_text{
                    font-size: 12px;
                    position: absolute;
                    top: 0px;
                    width: 200px;
                    -moz-user-select: none;
                    -webkit-user-select: none;
                    user-select: none;
                    -o-user-select: none;
                    -ms-user-select: none;
                    background: -webkit-gradient(linear, left top, right top, color-stop(0, #61688a), color-stop(.4, #61688a), color-stop(.5, #fff), color-stop(.6, #61688a), color-stop(1, #61688a));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -webkit-animation: slidetounlock 3s infinite;
                    -webkit-text-size-adjust: none;
                  }

                  @keyframes slidetounlock {
                    0% {
                      background-position: -100px 0;
                    }
                    100% {
                      background-position: 100px 0;
                    }
                  }
                  >.handler_bg{
                    border-radius: 0px 3px 3px 0px;
                    background: #5b89cf;
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    width: 40px;
                    height: 36px;
                    /* border: 1px solid #ccc; */
                    cursor: move;
                    .icon-text{
                      color:rgba(222,225,234,1);
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
          /*步骤1*/
          &.step1{
          }
        }
      }
    }
    &.night{
      background:linear-gradient(150deg,rgba(30,38,54,1),rgba(37,75,117,1));
    }
  }
</style>
