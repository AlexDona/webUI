/**
 * author: zhaoxinlei
 * create: 20190514
 * description: user相关 mixins
 */
import {
  mapGetters,
  mapState,
  mapActions,
  mapMutations
} from 'vuex'
import {sendPhoneOrEmailCodeAjax} from '../utils/commonFunc'

let mixin = {
  data () {
    return {}
  },
  methods: {
    ...mapActions([]),
    ...mapMutations({
      '$UPDATE_LOGIN_STEP2_DIALOG_STATUS_X': 'UPDATE_LOGIN_STEP2_DIALOG_STATUS',
      '$UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M_X': 'UPDATE_LOGIN_IMAGE_DIALOG_STATUS_M',
      '$UPDATE_IMAGE_CODE_M_X': 'UPDATE_IMAGE_CODE_M',
      '$SET_USER_BUTTON_STATUS_X': 'SET_USER_BUTTON_STATUS'
    }),
    async $sendPhoneOrEmailCode_X (isNewPhone = 0) {
      if (this.$disabledOfPhoneBtn_X || this.$disabledOfEmailBtn_X) return false
      let params = { userId: this.$userInfo_X.userId }
      console.log(this.$loginType_X, this.$disabledOfPhoneBtn_X, this.$disabledOfEmailBtn_X)
      switch (this.$loginType_X) {
        case 0:
          params = {
            ...params,
            ...{ phone: this.$userInfo_X.phone }
          }
          break
        case 1:
          params = {
            ...params,
            ...{ email: this.$userInfo_X.email }
          }
          break
      }
      // let type = this.$loginType_X ? 'email' : 'phone'
      sendPhoneOrEmailCodeAjax(this.$loginType_X, params, this)
      // await getValidateCodeAJAX(type, params)
    }
  },
  computed: {
    ...mapGetters({}),
    ...mapState({
      // 用户身份
      $userType_X: state => state.user.loginStep1Info.userInfo.type,
      $firstLogin_X: state => state.user.loginStep1Info.firstLogin, // 是否第一次登录
      $loginIpEquals_X: state => state.user.loginStep1Info.loginIpEquals, // 是否异常ip登录
      // $isBindGoogle_X: state => state.user.loginStep1Info.isEnableGoogle, // 已绑定谷歌
      // $isBindPhone_X: state => state.user.loginStep1Info.userInfo.phoneEnable == 'enable', // 已绑定手机号
      // $isBindEmail_X: state => state.user.loginStep1Info.isEnableMail, // 已绑定邮箱
      $userInfo_X: state => _.get(state.user.loginStep1Info, 'userInfo'), // 用户详细信息
      $disabledOfPhoneBtn_X: state => state.user.disabledOfPhoneBtn,
      $disabledOfEmailBtn_X: state => state.user.disabledOfEmailBtn,
      $loginType_X: state => state.user.loginType,
      $isShowLoginStep2Dialog_S_X: state => state.user.isShowLoginStep2Dialog_S,
      $isShowLoginImageDialog_S_X: state => state.user.isShowLoginImageDialog_S,
      $routerTo_X: state => state.common.routerTo // 路由跳转
    }),
    $isBindPhone_X () {
      return _.get(this.$userInfo_X, 'phoneEnable') == 'enable' || _.get(this.$userInfo_X, 'phoneEnable') == true
    },
    $isBindEmail_X () {
      return _.get(this.$userInfo_X, 'mailEnable') == 'enable' || _.get(this.$userInfo_X, 'mailEnable') == true
    },
    $isBindGoogle_X () {
      return _.get(this.$userInfo_X, 'googleEnable') == 'enable' || _.get(this.$userInfo_X, 'googleEnable') == true
    },
    $userTypeOptions_X () {
      return {
        // 商家
        merchant: 'MERCHANT',
        // 普通用户
        common: 'COMMON'
      }
    },
    $isMerchant_X () {
      return this.$userType_X === this.$userTypeOptions_X.merchant
    },
    $useMerchantSetName_X () {
      return this.$isMerchant_X && this.nameOfMerchantSet
    }
  }
  // destroyed () {},
  // watch: {}
}
export default mixin
