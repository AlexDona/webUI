<template>
  <div
    class="personal-setting personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="personal-setting-header personal-height40 line-height40 background-color">
      <span class="padding-left23 header-content font-size16">
        <!--收款账户-->
        {{ $t('M.user_account_credited') }}
      </span>
    </header>
    <div class="personal-setting-main min-height500 margin-top9">
      <div class="inner-box">
        <h3 class="title">
          个人设置
        </h3>
        <div class="content">
          <div class="top">
            <div class="left">
              <span>交易验证</span>
            </div>
            <div class="middle">
              <span>{{labelOfActiveFrequency}}</span>
            </div>
            <div class="right">
              <button
                @click="showSettingBox"
                class="setting-btn"
              >设置
              </button>
            </div>
          </div>
          <el-collapse-transition>
            <div
              class="bottom"
              v-show="isSetting"
            >
              <ul class="inner-box">
                <li
                  v-for="(item,index) in frequencyList"
                  :key="index"
                  :class="{
                    'active': item.value == activeFrequency
                  }"
                >
                  <label>
                    <input
                      type="radio"
                      @change="changeActiveFrequency"
                      name="password-frequency"
                      :checked="item.value == activeFrequency"
                      :value="item.value"
                    />
                    {{item.label}}
                    <span
                      class="button"
                      :class="{
                      'active': item.value == activeFrequency
                    }"
                    ></span>
                  </label>
                </li>
              </ul>
            </div>
          </el-collapse-transition>
        </div>
      </div>
      <el-dialog
        :title="$t('M.comm_set') + $t('M.comm_password')"
        :visible.sync="isCheckPayPassword"
        center
      >
        <el-input
          type="password"
          v-model="payPassword"
          @input="clearErrorMsg"
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
  returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
import {setUserInputPasswordFrequency} from '../../../utils/api/user'
import {getConfigAjax} from '../../../utils/api/header'
import {mapState, createNamespacedHelpers} from 'vuex'

const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      frequencyList: [
        {
          'label': '永不输入交易密码',
          'value': 'never'
        },
        {
          'label': `8小时内免输入交易密码`,
          'value': 'userset'
        },
        {
          'label': '每次交易验证交易密码',
          'value': 'everytime'
        }
      ],
      usersetTimeInterval: '',
      isSetting: false,
      activeFrequency: '',
      isCheckPayPassword: false,
      payPassword: '',
      params: {},
      oldFrequency: '',
      isNeedPayPassword: true,
      isPayPasswordEmpty: false
    }
  },
  async created () {
    await this.getConfig()
    this.activeFrequency = this.notInputPayPasswdTime
    this.oldFrequency = this.activeFrequency
  },
  mounted () {
  },
  activated () {},
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    cancelSetting () {
      this.activeFrequency = this.oldFrequency
      this.isCheckPayPassword = false
    },
    changeActiveFrequency (e) {
      let newVal = e.target.value
      this.oldFrequency = this.activeFrequency
      this.activeFrequency = newVal
      this.params = {
        status: newVal
      }

      this.isNeedPayPassword = (this.oldFrequency == 'everytime' ||
        (this.oldFrequency == 'userset' && newVal == 'never')) ? 1 : 0
      // 安全等级： 低 => 高
      if (!this.isNeedPayPassword) {
        this.setUserInputPasswordFrequency(this.params)
      } else {
        // 安全等级： 高 => 低
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
      this.isCheckPayPassword = false
      this.payPassword = ''
    },
    async getConfig () {
      const data = await getConfigAjax()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.usersetTimeInterval = getNestedData(data, 'data.data.notInputPayPasswdTime')
        this.frequencyList[1].label = `${this.usersetTimeInterval}小时内免输入交易密码`
      }
    },
    // 设置用户交易密码时长
    async setUserInputPasswordFrequency (params) {
      const data = await setUserInputPasswordFrequency(params)
      if (!returnAjaxMsg(data, this, 1)) {
        this.activeFrequency = this.oldFrequency
        return false
      } else {
        this.activeFrequency = params.status
        await this.$store.dispatch('user/REFLASH_USER_INFO', {
          self: this
        })
      }
    },
    showSettingBox () {
      this.isSetting = !this.isSetting
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      notInputPayPasswdTime: state => state.user.loginStep1Info.notInputPayPasswdTime
    }),
    labelOfActiveFrequency () {
      let arr = _.filter(this.frequencyList, item => {
        return item.value == this.activeFrequency
      })
      return getNestedData(arr, '[0].label')
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .personal-setting {
    > .personal-setting-main {
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
            border-bottom: 1px solid #39424d;
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
