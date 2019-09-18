<!--
  author: zxl
  create: 20190905
  description: 当前页面为 闪兑专区详情页面 右侧抢购 组件
-->
<template lang="pug">
  .the-shopping-spree-detail-right
    .inner
      // 表单
      el-form.shopping-form(
        :model="form"
        :rules="rules"
        :ref="formRef"
        label-width="100px"
        @submit.native.prevent="'@submit.native.prevent'"
      )
        el-form-item(
          label=""
          label-width="0px"
          prop="buyCount"
        )
          span.label {{labelOBJ.buyCount}}
          // 抢购数量
          el-input(
            type="text"
            v-model="form.buyCount"
            :autofocus="true"
            @keyup.native="formatInput"
            @input.native="formatInput"
            @keyup.enter.native="submitForm"
          )
            template(slot="append")
              span {{priceCoinName}}
            template(
              slot="prefix"
              v-if="form.buyCount"
              )
              span ≈ {{estimatePrice}} {{coinName}}
        // 开始抢购
        el-form-item.submit(
          label=""
          label-width="0px"
        )
          el-button.submit(
            v-if="$isLogin_S_X"
            @click="submitForm"
            :disabled ="isPurchaseButtonDisabled"
            :class="{active: !isPurchaseButtonDisabled}"
          ) {{buttonText}}
          // 登录
          el-button.submit.login-btn(v-else @click="$goToPage(`/${$routes_X.login}`)") {{$t('M.comm_login')}}
        // 可用
        .usable(v-if="$isLogin_S_X")
          span.label {{labelOBJ.usable}} {{priceCoinName}}：
          span.value {{usableCoinNum}}
      // 项目参与条件
      .bottom
        .inner(v-if="$isLogin_S_X")
          p.title {{labelOBJ.project_participation_conditions}}
          p.rule.rule1(v-if="term1CoinId")
            Iconfont.iconfont.success(
              icon-name="icon-dui2"
              v-if="isSatisfyTerm1"
            )
            Iconfont.iconfont.error(
              icon-name="icon-cuowu1"
              v-else
              )
            // 账户持仓大于
            span {{labelOBJ.rule1}}
            span.limit {{term1CoinLimit}}
            span {{term1CoinName}}
          p.rule.rule2(v-if="term2CoinId")
            Iconfont.iconfont.success(
              icon-name="icon-dui2"
              v-if="isSatisfyTerm2"
              )
            Iconfont.iconfont.error(
              icon-name="icon-cuowu1"
              v-else
            )
            // 账户持仓大于
            span {{labelOBJ.rule1}}
            span {{term2CoinLimit}}
            span {{term2CoinName}}
          p.rule.rule3(v-if="!notNeedAuth")
            Iconfont.iconfont.success(
              icon-name="icon-dui2"
              v-if="$isPassAdvancedAuth_X"
            )
            Iconfont.iconfont.error(
              icon-name="icon-cuowu1"
              v-else
            )
            // span 账户必须通过
            span {{labelOBJ.rule2}}
            // 实名认证
            span.auth.router-to-realname(
              v-if="isNeedRealNameAuth"
              @click="jumpToPersonal"
              ) {{labelOBJ.rule21}}
            // 高级认证
            span.auth.router-to-advance-auth(
              v-if="isNeedAdvancedAuth"
              @click="jumpToPersonal"
            ) {{labelOBJ.rule22}}
      PayPassDialog(@next="doPurchase")
      // 排队loading
      TheQueuingLoading2(:isShow="isShowCheckResultDialog")
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import mixins from '../../../mixins/shoppingSpree'
import userMixins from '../../../mixins/user'
import {
  checkIsPurchaseSuccessAJAX,
  doPurchaseAJAX,
  getJoinTermCoinStatusAJAX,
  getQueuingStatusAJAX
} from '../../../utils/api/shoppingSpree'
import TheQueuingLoading2 from './TheQueuingLoading'
import {isNeedPayPasswordAjax} from '../../../utils/commonFunc'
export default {
  name: '',
  mixins: [mixins, userMixins],
  components: {
    TheQueuingLoading2
  },
  props: {
    // 详情
    details: {}
  },
  data () {
    let validateBuyCount = (rule, value, callback) => {
      const {lackOfAvailable, placeholder1, placeholder3, placeholder2} = this.labelOBJ
      if (this.usableCoinNum - value < 0) {
        // 可用不足
        callback(new Error(lackOfAvailable))
      } else if (value === '') {
        // 请输入抢购数量
        callback(new Error(placeholder1))
      } else if (value - this.downLimit < 0) {
        // 低于最少起购量！
        callback(new Error(placeholder3))
      } else if (value - this.upLimit > 0) {
        // 高于单人最高限额！
        callback(new Error(placeholder2))
      }
      callback()
    }
    return {
      form: {
        // 抢购数量
        buyCount: ''
      },
      formRef: 'form',
      rules: {
        buyCount: [
          { validator: validateBuyCount, trigger: 'blur' },
          { validator: validateBuyCount, trigger: 'change' }
        ]
      },
      // 按钮文字
      buttonText: '',
      // 当前订单号
      orderSn: '',
      // 轮询最大时长
      LIMIT_TIME: 10 * 1000,
      // 轮询结束时间
      endTime: null,
      // 当前轮询状态： success: 订单成功，failed : 失败， queuing: 排队中
      orderPurchaseStatus: null,
      isShowCheckResultDialog: false,
      // 最低持仓币种、用户可用 信息
      JoinTermCoinStatus: {
        // 币种1 是否满足最低持仓
        term1: false,
        // 币种2 是否满足最低持仓
        term2: false,
        // 用户 可用币种
        usableCoinNum: 0
      }
    }
  },
  created () {
    // this.checkQueuingStatus()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    // 检测用户当前活动币种可用 和 持仓币种是否满足条件
    async getJoinTermCoinStatus () {
      if (!this.$isLogin_S_X) return
      const params = {
        id: this.projectID
      }
      const data = await getJoinTermCoinStatusAJAX(params)
      if (!data) return
      this.JoinTermCoinStatus = _.get(data, 'data')
    },
    jumpToPersonal () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(this.$routes_X.personalName.identityAuthentication)
      this.$goToPage(`${this.$routes_X.personalCenter}`)
    },
    // 查询队列标识（刚进页面时,判断是否需要loading）
    async checkQueuingStatus () {
      const params = {
        // 项目编号
        projectSn: this.projectSn
      }
      const data = await getQueuingStatusAJAX(params)
      if (!data) return
      const {flag, orderSn, time} = _.get(data, 'data')
      if (flag) {
        this.isShowCheckResultDialog = true
        this.endTime = new Date().getTime() + (time - 0)
        this.orderSn = orderSn
        this.checkIsPurchaseSuccess()
      }
    },
    // 执行购买
    doPurchase: _.throttle(async function () {
      const {buyCount} = this.form
      const params = {
        id: this.id,
        rushNum: buyCount,
        payPassword: this.$globalPayPassword_S_X
      }

      const data = await doPurchaseAJAX(params)
      if (!data) return
      this.getJoinTermCoinStatus()
      this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(false)
      this.orderSn = _.get(data, 'data')
      // 获取轮询结束倒计时
      this.endTime = new Date().getTime() + this.LIMIT_TIME
      this.checkIsPurchaseSuccess()
    }, 500),
    // 获取抢购结果
    checkIsPurchaseSuccess: _.throttle(async function () {
      let params = {
        orderSn: this.orderSn
      }
      const data = await checkIsPurchaseSuccessAJAX(params)
      if (!data) return
      const status = _.get(data, 'data')
      console.log(status)
      const isQueuing = status === 'queuing'
      const isSuccess = status === 'success'
      // 继续轮询条件： 1、未达到 轮询结束时间; 2、用户当前订单正在排队
      const currentTime = new Date().getTime()
      const timeDiff = this.endTime - currentTime
      if (timeDiff > 0 && isQueuing) {
        this.checkIsPurchaseSuccess()
        this.isShowCheckResultDialog = true
      } else {
        const {purchaseSuccess, purchaseFailed} = this.labelOBJ
        if (isSuccess) {
          // 抢购成功
          this.$success_tips_X(`${purchaseSuccess}`)
        } else {
          // 抢购失败
          this.$error_tips_X(`${purchaseFailed}`)
        }
        this.isShowCheckResultDialog = false
      }
    }, 500),
    updateButtonText () {
      const status = ['coming', 'ongoing', 'ended']
      const statusMap = {
        // 即将开始
        [status[0]]: this.$isChineseLanguage_G_X ? '即将开始' : '',
        // 立即抢购
        [status[1]]: this.$isChineseLanguage_G_X ? '立即抢购' : '',
        // 已结束
        [status[2]]: this.$isChineseLanguage_G_X ? '已结束' : ''
      }
      this.buttonText = this.$t(statusMap[this.status])
    },
    submitForm () {
      this.$refs[this.formRef].validate(async (valid) => {
        if (!valid) return false

        // 最低持仓不足
        if (this.holdCoinBalance - this.holdCoinAmount < 0) {
          this.toggleTips(true)
          return
        }

        let isPayPasswordLocked = this.payPasswordRemainCount ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPayPasswordLocked)
        if (this.$isLockedPayPassword_S_X) return false
        let isNeedPayPassword = await isNeedPayPasswordAjax(this)

        if (isNeedPayPassword) {
          if (!this.$userInfo_X.payPassword) {
            // 请设置交易密码后操作
            this.$error_tips_X(`${this.$t('M.comm_please_set_up')}${this.$t('M.comm_password')}${this.$t('M.trade_exchange_after_operation')}`)
            this.$goToPage(`/${this.$routes_X.TransactionPassword}`)
            return false
          }
          this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(true)
        } else {
          this.doPurchase()
        }
      })
    },
    formatInput () {
      const { buyCount } = this.form
      let integer = ''
      if (isNaN(buyCount - 0)) {
        this.form.buyCount = this.form.buyCount.substring(0, this.form.buyCount.length - 1)
        integer = this.form.buyCount
        return
      }
      // 非数字
      if (buyCount.includes('.')) {
        let strArr = buyCount.split('.')
        integer = strArr[0]
      } else {
        integer = buyCount
      }

      this.form.buyCount = integer
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      $userInfo_X: state => state.user.loginStep1Info.userInfo,
      // 交易密码剩余次数
      payPasswordRemainCount: state => state.user.loginStep1Info.payPasswordRemainCount
    }),
    // 是否禁用
    isPurchaseButtonDisabled () {
      // needTerm1: 是否需要第一个
      const needTerm1 = (this.term1CoinId && this.isSatisfyTerm1) || (!this.term1CoinId)
      const needTerm2 = (this.term2CoinId && this.isSatisfyTerm2) || (!this.term2CoinId)
      return !this.isONGoing || this.isNotPassAdvanceAuth || this.isNotPassRealAuth || !needTerm1 || !needTerm2
    },
    // 未通过高级认证
    isNotPassAdvanceAuth () {
      return this.isNeedAdvancedAuth && !this.$isPassAdvancedAuth_X
    },
    // 未通过实名认证
    isNotPassRealAuth () {
      return this.isNeedRealNameAuth && !this.$isPassRealNameAuth_X
    },
    // 是否满足 持仓币种1
    isSatisfyTerm1 () {
      return _.get(this.JoinTermCoinStatus, 'term1')
    },
    // 是否满足 持仓币种2
    isSatisfyTerm2 () {
      return _.get(this.JoinTermCoinStatus, 'term2')
    },
    // 当前用户可用
    usableCoinNum () {
      return _.get(this.JoinTermCoinStatus, 'usableCoinNum') - 0
    },
    // 项目id
    projectID () {
      return _.get(this.details, 'id')
    },
    // 认证类型
    authType () {
      return _.get(this.details, 'authType')
    },
    // 需要高级认证
    isNeedAdvancedAuth () {
      return this.authType === 'advanced_auth'
    },
    // 需要实名认证
    isNeedRealNameAuth () {
      return this.authType === 'real_name_auth'
    },
    // 不需要认证
    notNeedAuth () {
      return this.authType === 'dispense_with_auth'
    },
    // 抢购币种
    coinName () {
      return _.get(this.details, 'coinName')
    },
    // 兑换币种
    priceCoinName () {
      return _.get(this.details, 'priceCoinName')
    },
    // 抢购价格
    price () {
      return _.get(this.details, 'price')
    },
    // 项目 Id
    id () {
      return _.get(this.details, 'id')
    },
    // 项目编号
    projectSn () {
      return _.get(this.details, 'sn')
    },
    // 估值
    estimatePrice () {
      const {buyCount} = this.form
      if (this.price) return (buyCount / this.price).toLocaleString()
      else return 0
    },
    // 起购量
    downLimit () {
      return _.get(this.details, 'downLimit')
    },
    // 限额
    upLimit () {
      return _.get(this.details, 'upLimit')
    },
    status () {
      return _.get(this.details, 'status')
    },
    isONGoing () {
      return this.status === 'ongoing'
    },
    // 最低持仓币种1， 若为空则表示无限制
    term1CoinId () {
      return _.get(this.details, 'term1CoinId')
    },
    // 最低持仓币种1 最低限额
    term1CoinLimit () {
      return _.get(this.details, 'term1CoinLimit')
    },
    // 最低持仓币种1 币种名称
    term1CoinName () {
      return _.get(this.details, 'term1CoinName')
    },
    // 最低持仓币种2， 若为空则表示无限制
    term2CoinId () {
      return _.get(this.details, 'term2CoinId')
    },
    // 最低持仓币种2 币种名称
    term2CoinLimit () {
      return _.get(this.details, 'term2CoinLimit')
    },
    // 最低持仓币种1 币种名称
    term2CoinName () {
      return _.get(this.details, 'term2CoinName')
    }
  },
  watch: {
    projectID () {
      this.getJoinTermCoinStatus()
    },
    projectSn () {
      this.checkQueuingStatus()
    },
    status () {
      this.updateButtonText()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree-detail-right
    width 100%
    height 100%
    background-color #1A1D2D
    position relative
    >.inner
      background-color #1A1D2D
      box-shadow 0 3px 7px 0 rgba(18,20,32,1)
      padding 95px 45px 0
      box-sizing border-box
      width 465px
      height 438px
      position absolute
      top -12px
      right 110px
      &:before
        position absolute
        left -24px
        top 0
        content ''
        border-top 12px solid transparent
        border-left 12px solid transparent
        border-right 12px solid #0C0D16
      >.bottom
        margin-top 17px
        min-height 110px
        background url("../../../assets/ShoppingSpree/condition-bg.png") no-repeat bottom right/contain
        >.inner
          >.title
            color #D9E1F1
            margin-bottom 17px
          >.rule
            color #66718F
            font-size 12px
            line-height 22px
            >.auth
              color S_main_color
              cursor pointer
            >.iconfont
              font-size 14px
              margin-right 5px
              &.success
                color S_main_color
              &.error
                color S_error_color
      /deep/
        .shopping-form
          >.usable
            font-size 12px
            color #fff
          >.el-form-item
            margin-bottom 50px
            /* 提交按钮 */
            &.submit
              margin-bottom 5px
            >.el-form-item__content
              >.label
                color #66718F
              >.el-input
                >.el-input__inner
                  background-color #2C3046
                  color #fff
                  border-radius 2px 0 0 2px
                  border none
                  padding-left 20px
                >.el-input-group__append
                  border-radius 0 2px 2px 0
                  background-color #2C3046
                  border none
                >.el-input__prefix
                  background-color #363A50
                  left 0
                  top 40px
                  width 100%
                  height 22px
                  line-height 22px
                  text-align right
                  padding 0 20px
                  box-sizing border-box
                  border-radius 0 0 2px 2px
                  overflow hidden
                  >span
                    font-size 12px
                    color #D9E1F1
                    white-space nowrap
                    text-overflow ellipsis
                    width 100%
                    display inline-block
              >.el-form-item__error
                top 104px
                color S_error_color
              /* 提交按钮 */
              >.el-button
                width 100%
                height 40px
                border-radius 2px
                background-color #2C3046
                border none
                color #fff
                font-size 12px
                &.login-btn
                  &:hover
                    background-color S_main_color
                &.active
                  background-color S_main_color
</style>
