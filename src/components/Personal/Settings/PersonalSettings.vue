<template>
  <div
    class="personal-setting personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-setting-header personal-height40 line-height40 background-color">
      <span class="padding-left23 header-content font-size16">
        <!--设置-->
        {{$t('M.comm_set')}}
      </span>
    </header>
    <div class="personal-setting-main margin-top9">
      <div class="inner-box">
        <h3 class="title">
          <!-- 个人设置 -->
          {{$t('M.user_personal_setting')}}
        </h3>
        <div class="content">
          <div class="top">
            <div class="left">
              <span>{{$t('M.user_exchange_validate')}}</span>
            </div>
            <div class="middle">
              <!--交易验证-->
              <span><i v-if="validatedActiveFrequency == 'userset'">{{usersetTimeInterval}}</i>{{$t(labelOfActiveFrequency)}}</span>
            </div>
            <div class="right">
              <button
                @click="showSettingBox"
                class="setting-btn"
              >{{$t('M.comm_set')}}
              </button>
            </div>
          </div>
          <el-collapse-transition>
            <div
              class="bottom"
              v-show="isSetting"
            >
              <ul class="inner-box">
                <li>
                  {{$t('M.user_pay_pwd_never')}}
                  <span
                    class="button"
                    @click="changeActiveFrequency('never')"
                    :class="{
                      'active': validatedActiveFrequency == 'never'
                    }"
                  ></span>
                </li>
                <li>
                  {{usersetTimeInterval}} {{$t('M.user_pay_pwd_user_set')}}
                  <span
                    class="button"
                    @click="changeActiveFrequency('userset')"
                    :class="{
                      'active': validatedActiveFrequency == 'userset'
                    }"
                  ></span>
                </li>
                <li>
                  {{$t('M.user_pay_pwd_every')}}
                  <span
                    class="button"
                    @click="changeActiveFrequency('everytime')"
                    :class="{
                      'active': validatedActiveFrequency == 'everytime'
                    }"
                  ></span>
                </li>
                <!--<li-->
                  <!--v-for="(item,index) in frequencyList"-->
                  <!--:key="index"-->
                  <!--:class="{-->
                    <!--'active': item.value == activeFrequency-->
                  <!--}"-->
                <!--&gt;-->
                  <!--<label>-->
                    <!--<input-->
                      <!--type="radio"-->
                      <!--@change="changeActiveFrequency"-->
                      <!--name="password-frequency"-->
                      <!--:checked="item.value == validatedActiveFrequency"-->
                      <!--:value="item.value"-->
                    <!--/>-->
                    <!--<span v-if="item.value=='userset'">{{usersetTimeInterval}}</span> {{$t(item.label)}}-->
                    <!--<span-->
                      <!--class="button"-->
                      <!--:class="{-->
                      <!--'active': item.value == validatedActiveFrequency-->
                    <!--}"-->
                    <!--&gt;</span>-->
                  <!--</label>-->
                <!--</li>-->
              </ul>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <el-dialog
        :title="$t('M.user_security_verify') + $t('M.comm_password')"
        :visible.sync="isCheckPayPassword"
        :close-on-click-modal="false"
      >
        <!-- 请输入交易密码 -->
        <el-input
          type="password"
          autocomplete= "new-password"
          v-model="payPassword"
          @input="clearErrorMsg"
          :placeholder="`${$t('M.comm_please_enter')}${$t('M.comm_password')}`"
        >
        </el-input>
        <div
          class="error-box"
        >
          <span v-show="isPayPasswordEmpty"
          >
            {{$t('M.otc_publishAD_pleaseInput')}}{{$t('M.otc_publishAD_sellpassword')}}
          </span>
        </div>
        <span
          slot="footer"
          class="dialog-footer footer"
        ><!--确 定 取 消-->
          <button
            class="button-color border-radius4 cursor-pointer"
            @click.prevent="setFrequencyWithPayPassword"
          >
            <!--确 定-->
            {{ $t('M.comm_confirm') }}
          </button>
          <button
            class="cancel-btn border-radius4 cursor-pointer"
            @click.prevent="cancelSetting"
          >
            <!--取 消-->
            {{ $t('M.comm_cancel') }}
          </button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFontCommon from '../../Common/IconFontCommon'
import {
  getNestedData
} from '../../../utils/commonFunc'
import {setUserInputPasswordFrequency} from '../../../utils/api/user'
import {getConfigAjax} from '../../../utils/api/common'
import {
  mapMutations,
  mapActions,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      frequencyList: [
        {
          // 永不输入交易密码
          'label': 'M.user_pay_pwd_never',
          'value': 'never'
        },
        {
          // 用户设置小时数 小时内免输入交易密码
          'label': 'M.user_pay_pwd_user_set',
          'value': 'userset'
        },
        {
          // 每次交易验证交易密码
          'label': 'M.user_pay_pwd_every',
          'value': 'everytime'
        }
      ],
      usersetTimeInterval: '',
      isSetting: false,
      activeFrequency: '',
      // 已校验的radio 选中值
      validatedActiveFrequency: '',
      isCheckPayPassword: false,
      payPassword: '',
      params: {},
      oldFrequency: '',
      isNeedPayPassword: true,
      isPayPasswordEmpty: false,
      // 是否成功修改
      isSuccessChanged: false,
      // 当前选中验证方式
      labelOfActiveFrequency: ''
    }
  },
  async created () {
    await this.getConfig()
    this.activeFrequency = this.notInputPayPasswdTime
    this.setLabelOfActiveFrequency()
    this.validatedActiveFrequency = this.activeFrequency
    this.oldFrequency = this.activeFrequency
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    cancelSetting () {
      this.activeFrequency = this.oldFrequency
      this.isCheckPayPassword = false
      this.payPassword = ''
    },
    async changeActiveFrequency (val) {
      if (val === this.validatedActiveFrequency) return false
      this.isSuccessChanged = false
      let newVal = val
      this.oldFrequency = this.activeFrequency
      this.activeFrequency = newVal
      this.params = {
        status: newVal
      }

      this.isNeedPayPassword = (this.oldFrequency == 'everytime' ||
        (this.oldFrequency == 'userset' && newVal == 'never')) ? 1 : 0
      console.log(this.isNeedPayPassword)
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      // 安全等级： 低 => 高
      if (!this.isNeedPayPassword) {
        this.setUserInputPasswordFrequency(this.params)
      } else {
        // 安全等级： 高 => 低'
        this.isSuccessChanged = false
        this.isCheckPayPassword = true
      }
    },
    clearErrorMsg () {
      this.isPayPasswordEmpty = false
    },
    async setFrequencyWithPayPassword () {
      this.params.payPassword = this.payPassword
      if (!this.payPassword) {
        this.isPayPasswordEmpty = true
        return false
      }
      await this.setUserInputPasswordFrequency(this.params)
    },
    async getConfig () {
      const data = await getConfigAjax()
      if (!data) return false
      this.usersetTimeInterval = getNestedData(data, 'data.notInputPayPasswdTime')
    },
    // 设置用户交易密码时长
    async setUserInputPasswordFrequency (params) {
      const data = await setUserInputPasswordFrequency(params)
      if (!data) {
        this.activeFrequency = this.oldFrequency
        this.isSuccessChanged = false
        this.isCheckPayPassword = false
        return false
      } else {
        this.isSuccessChanged = true
        this.activeFrequency = params.status
        this.validatedActiveFrequency = this.activeFrequency
        await this.REFRESH_USER_INFO_ACTION()
        this.isCheckPayPassword = false
        this.payPassword = ''
        this.setLabelOfActiveFrequency()
      }
    },
    setLabelOfActiveFrequency () {
      this.labelOfActiveFrequency = getNestedData(_.filter(this.frequencyList, item => item.value == this.activeFrequency), '[0].label')
    },
    showSettingBox () {
      if (!this.UserPayPassword) {
        this.$parent.$parent.$parent.showNoPasswdNotice()
        return
      }
      this.isSetting = !this.isSetting
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      notInputPayPasswdTime: state => state.user.loginStep1Info.notInputPayPasswdTime,
      UserPayPassword: state => state.user.loginStep1Info.userInfo.payPassword,
      loginStep1Info: state => state.user.loginStep1Info,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    })
  },
  watch: {
    isCheckPayPassword (newVal) {
      if (!this.isSuccessChanged && !newVal) {
        this.cancelSetting()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .personal-setting {
    > .personal-setting-main {
      min-height: 665px;
      font-size: 12px;

      > .inner-box {
        padding: 0 33px;

        > .title {
          height: 50px;
          border-bottom: 1px solid #39424d;
          font-weight: 400;
          line-height: 50px;
        }

        > .content {
          > .top {
            display: flex;
            height: 88px;
            line-height: 88px;

            > .left {
              flex: 1;
            }

            > .middle {
              flex: 1;
              white-space: nowrap;
              color: $mainColor;

              > span {
                box-sizing: border-box;
                padding: 0 30px;
                border-left: 1px solid #8ea0b5;
              }
            }

            > .right {
              flex: 2;

              > .setting-btn {
                float: right;
                width: 70px;
                height: 30px;
                margin: 25px auto;
                border: 1px solid;
                border-image: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1)) 10 10;
                border-radius: 2px;
                color: #fff;
                background: linear-gradient(0deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                cursor: pointer;
              }
            }
          }

          > .bottom {
            > .inner-box {
              > li {
                position: relative;
                height: 50px;
                padding: 0 20px;
                border: 1px solid rgba(53, 62, 91, 1);
                border-bottom: none;
                border-radius: 2px;
                font-size: 12px;
                line-height: 50px;
                background: rgba(40, 48, 73, 1);

                .button {
                  float: right;
                  display: inline-block;
                  width: 40px;
                  height: 20px;
                  margin: 15px auto;
                  background: url(../../../assets/user/wrong.png) no-repeat center center;
                  cursor: pointer;

                  &.active {
                    background: url(../../../assets/user/yes.png) no-repeat center center;
                  }
                }

                > label {
                  position: relative;

                  > input {
                    display: none;
                  }

                  > .button {
                    float: right;
                    display: inline-block;
                    width: 40px;
                    height: 20px;
                    margin: 15px auto;
                    background: url(../../../assets/user/wrong.png) no-repeat center center;
                    cursor: pointer;

                    &.active {
                      background: url(../../../assets/user/yes.png) no-repeat center center;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /deep/ {
      .el-dialog {
        width: 325px;

        .error-box {
          margin: 10px 0 0;
          font-size: 12px;
          color: #d45858;
        }
      }

      .el-dialog__header {
        height: 50px;
        padding: 10px 20px;
        border-radius: 5px;
        line-height: 30px;
      }

      .el-dialog__body {
        padding: 25px 27px 10px;
        line-height: 25px;
      }

      .el-form-item {
        height: 85px;
        margin-bottom: 0;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-dialog__footer {
        padding: 0 27px 25px;
        text-align: left;
      }

      .button-color {
        width: 80px;
        height: 35px;
        margin: 0 15px 0 50px;
        border: 0;
        line-height: 0;
      }

      .cancel-btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .background-color {
        background-color: $nightMainBgColor;
      }

      > .personal-setting-main {
        background-color: $nightMainBgColor;

        > .inner-box {
          > .title {
            border-bottom: 1px solid #39424d;
          }

          > .content {
            > .top {
              > .middle {
                > span {
                  border-left: 1px solid #8ea0b5;
                }
              }

              > .right {
                > .setting-btn {
                  border-image: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1)) 10 10;
                  color: #fff;
                  background: linear-gradient(0deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                }
              }
            }

            > .bottom {
              > .inner-box {
                > li {
                  border: 1px solid rgba(53, 62, 91, 1);
                  border-bottom: none;
                  background: rgba(40, 48, 73, 1);

                  &.active {
                    color: $mainColor;
                  }
                }
              }
            }
          }
        }
      }

      > .personal-setting-header {
        > .header-content {
          color: #338ff5;
        }
      }

      .content-title {
        > .title-tips {
          color: #d45858;
        }

        > .tips-content {
          color: #9da5b3;
        }
      }

      .title-status {
        color: rgba(255, 255, 255, .7);
        background: rgba(248, 249, 252, .05);
      }

      /deep/ {
        /* 个人中心（黑色主题） */

        /* 警告提示框背景色 */
        .el-dialog {
          background-color: #28334a;
        }

        /* 警告提示框按钮 */
        .el-button--primary {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-button {
          &:first-child {
            color: #fff;
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .el-dialog__header {
          background-color: #20293c;
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #fff;
          background-color: #2d3651;

          &:focus {
            border-color: $mainColor;
          }
        }

        .button-color {
          color: rgba(255, 255, 255, .7);
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .cancel-btn {
          border: 1px solid #338ff5;
          color: #fff;
          background-color: transparent;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .button-color {
        color: rgba(255, 255, 255, .7);
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .cancel-btn {
        border: 1px solid #338ff5;
        color: #333;
        background-color: transparent;
      }

      > .background-color {
        background-color: #ccc;
      }

      > .personal-setting-main {
        border: 1px solid rgba(38, 47, 56, .1);
        background-color: $dayBgColor;

        > .inner-box {
          > .title {
            border-bottom: 1px solid rgba(38, 47, 56, .1);
          }

          > .content {
            > .top {
              > .middle {
                > span {
                  border-left: 1px solid #8ea0b5;
                }
              }
            }

            > .bottom {
              > .inner-box {
                > li {
                  border-color: rgb(229, 234, 241);
                  background: rgb(243, 248, 255);
                }
              }
            }
          }
        }
      }

      > .personal-setting-header {
        border: 1px solid rgba(236, 241, 248, 1);
        background: rgba(255, 255, 255, 1);

        > .header-content {
          color: #333;
        }
      }

      .content-title {
        > .title-tips {
          color: #d45858;
        }

        > .tips-content {
          color: #7d90ac;
        }
      }

      .title-status {
        color: #333;
        background: rgba(51, 143, 245, .1);
      }

      .payment-content {
        .text-info {
          color: #333;
        }

        .cancel-btn {
          border: 1px solid #338ff5;
          color: #333;
          background-color: transparent;
        }

        .payment-card {
          color: #333;
        }

        .payment-state {
          color: #338ff5;
        }

        .dialog-warning {
          background: rgba(42, 122, 211, .9);

          .dialog-warning-box {
            background: linear-gradient(90deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }

        .warning-text {
          color: #333;
        }
      }

      /deep/ {
        .el-dialog {
          background-color: #fff;
        }

        .el-button--primary {
          color: #fff;
          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }
      }
    }
  }
</style>
