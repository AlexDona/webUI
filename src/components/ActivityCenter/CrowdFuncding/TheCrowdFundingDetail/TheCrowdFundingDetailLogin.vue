<!--
  author: zhaoxinlei
  create: 20190605
  description: 当前页面为 众筹详情页 已登录模块组件
-->
<template lang="pug">
  .the-crowd-funding-detail-login(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .top
      // 可用
      span.usable
        span.label {{$t(label.usable)}}
        span.value  {{ieoCoinBalance}}
        span.coin-name  {{ieoCoinName}}
      //  余额
      span.usable.balance
        span.label {{$t(label.balance)}}
        span.value  {{holdCoinBalance}}
        span.coin-name  {{holdCoinName}}
    .middle
      el-form(
        :model="form"
        :rules="rules"
        :ref="formRef"
        label-width="100px"
      )
        el-form-item(
        label=""
        label-width="0px"
        prop="buyCount"
        )
          el-input(
          type="text"
          v-model="form.buyCount"
          :placeholder="$t(crowd_funding_error5)"
          :autofocus="true"
          @keyup.native="formatInput"
          @input.native="formatInput"
          )
            template(slot="append")
              el-button(
                @click="submitForm"
                :disabled ="statusCode!=='ongoing'"
              ) {{buttonText}}
    .bottom
      span.predict {{$t(predictText)}}
      span.placeholder(v-if="!predict") --
      span.predict(v-else) {{predict}}
      span {{ieoCoinName}}
    PayPassDialog(@next="applyCrowdFunding")
</template>
<script>
import {getDateTime} from '../../../../utils'
import {applyCrowdFundingAJAX} from '../../../../utils/api/activityCenter'
import {mapState} from 'vuex'
export default {
  // name: '',
  // mixins: [],
  // components: {},
  props: {
    detail: {
      type: Object
    },
    label: {
      type: Object
    }
  },
  data () {
    let validateBuyCount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(`${this.$t(this.crowd_funding_error5)}`))
      } else if (value - this.buyDownLimit < 0) {
        // 小于起购限额
        callback(new Error(`${this.$t(this.crowd_funding_error1)}：${this.buyDownLimit} ${this.ieoCoinName}`))
      } else if (value - this.buyUpLimit > 0) {
        // 高于最高限额
        callback(new Error(`${this.$t(this.crowd_funding_error2)}：${this.buyUpLimit} ${this.ieoCoinName}`))
      } else if (this.ieoCoinBalance - value < 0) {
        callback(new Error(`${this.$t(this.crowd_funding_error3)}`))
      } else if (this.holdCoinBalance - this.holdCoinAmount < 0) {
        callback(new Error(`${this.$t(this.crowd_funding_error4)}`))
      }
      callback()
    }
    return {
      form: {
        // 申购数量
        buyCount: ''
      },
      formRef: 'form',
      rules: {
        buyCount: [
          { validator: validateBuyCount, trigger: 'blur' },
          { validator: validateBuyCount, trigger: 'change' }
        ]
      },
      buyCountPlaceholder: '请输入申购数量',
      // 预计收益
      predictText: 'M.crowd_funding_expected_return',
      crowd_funding_error1: 'M.crowd_funding_error1',
      crowd_funding_error2: 'M.crowd_funding_error2',
      crowd_funding_error3: 'M.crowd_funding_error3',
      crowd_funding_error4: 'M.crowd_funding_error4',
      crowd_funding_error5: 'M.crowd_funding_error5',
      // 预计收益
      predict: '',
      ONE_YEAR: 365,
      timer: null,
      // 按钮文字
      buttonText: ''
    }
  },
  async created () {
    console.log(this.statusCode)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  // destroyed () {},
  methods: {
    /**
     * 输入限制： 整数 最大 7位，小数 最大8位
     */
    formatInput () {
      const { buyCount } = this.form
      let integer = ''
      let point = ''
      if (buyCount.includes('.')) {
        let strArr = buyCount.split('.')
        integer = strArr[0]
        point = strArr[1] || ''
        console.log(strArr, integer, point)
        integer = integer.substring(0, 7)
        point = point.substring(0, 8)
      } else {
        integer = buyCount.substring(0, 7)
      }

      this.form.buyCount = buyCount.includes('.') ? `${integer}.${point}` : `${integer}`
      this.updatePredict()
    },
    submitForm () {
      this.$refs[this.formRef].validate((valid) => {
        if (!valid) return false
        if (!this.$userInfo_X.payPassword) {
          // 请设置交易密码后操作
          this.$message({
            type: 'error',
            message: this.$t('M.comm_please_set_up') + this.$t('M.comm_password') + this.$t('M.trade_exchange_after_operation')
          })
          this.$goToPage(`/${this.$routes_X.TransactionPassword}`)
          return false
        }
        this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(true)
      })
    },
    updatePredict () {
      let time = this.interestEndTime - this.interestStartTime + 1 * 24 * 60 * 60 * 1000
      console.log(time)
      const timeObj = getDateTime(time)
      let {
        dayTime
      } = timeObj
      console.log(this.interestRate, this.form.buyCount, dayTime)
      // 预计收益 = ( 年化收益 * 申购数量 / 365 ) * 计息天数
      const {buyCount} = this.form
      this.predict = this.$cutOutPointLength((this.interestRate / 100 * buyCount) / this.ONE_YEAR * dayTime, 8)
      console.log(this.predict)
    },
    applyCrowdFunding: _.debounce(async function () {
      const params = {
        // 申购项目id
        id: this.detailId,
        // 项目金额
        amount: this.form.buyCount,
        payPassword: this.$globalPayPassword_S_X
      }
      const data = await applyCrowdFundingAJAX(params)
      if (!data) return false
      // console.log(data)
      this.timer = setTimeout(() => {
        this.$goToPage(`/${this.$routes_X.crowdFunding}`)
      }, 2000)
    }, 500),
    updateButtonText () {
      const status = ['coming', 'ongoing', 'ended']
      const statusMap = {
        // 即将开始
        [status[0]]: 'M.trade_start',
        // 立即申购
        [status[1]]: 'M.crowd_funding_buy_now',
        // 已结束
        [status[2]]: 'M.crowd_funding_over'
      }
      this.buttonText = this.$t(statusMap[this.statusCode])
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      $userInfo_X: state => state.user.loginStep1Info.userInfo
    }),
    ieoCoinName () {
      return _.get(this.detail, 'ieoCoinName')
    },
    // 募集币种余额
    ieoCoinBalance () {
      return _.get(this.detail, 'ieoCoinBalance')
    },
    // 需持币金额
    holdCoinAmount () {
      return _.get(this.detail, 'holdCoinAmount')
    },
    // 起购金额
    buyDownLimit () {
      return _.get(this.detail, 'buyDownLimit')
    },
    // 最高限额
    buyUpLimit () {
      return _.get(this.detail, 'buyUpLimit')
    },
    // 最低持仓币种
    holdCoinName () {
      return _.get(this.detail, 'holdCoinName')
    },
    // 持仓币种余额
    holdCoinBalance () {
      return _.get(this.detail, 'holdCoinBalance')
    },
    // 计息开始时间
    interestStartTime () {
      return _.get(this.detail, 'interestStartTime')
    },
    // 计息结束时间
    interestEndTime () {
      return _.get(this.detail, 'interestEndTime')
    },
    // 年化收益
    interestRate () {
      return _.get(this.detail, 'interestRate')
    },
    statusCode () {
      return _.get(this.detail, 'statusCode')
    },
    // 当前项目ID
    detailId () {
      return _.get(this.detail, 'id')
    }
  },
  watch: {
    $language_S_X () {
      this.updateButtonText()
      console.log(this.buttonText)
    },
    detail (New) {
      console.log(New)
      this.updateButtonText()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-crowd-funding-detail-login
    >.top
      display flex
      justify-content space-between
      margin-bottom 10px
      >.usable
        color S_font_color
      >.balance
        color #fff
    >.middle
      /deep/
        .el-input__inner
          border-radius 0
          background-color #2a334f
          border none
          height 50px
          font-size 12px
        .el-input-group__append,.el-button--default
          border-radius 0 2px 2px 0
          border none
        .el-input-group__append
          background-color transparent
        .el-button--default
          background-color S_main_color
          border none
          color #fff
          height 50px
          font-size 12px
          &.is-disabled
            background-color #232b46
    >.bottom
      color S_main_color
      >span
        margin 0 2px
      >.placeholder
        font-size 20px
    &.day
      >.top
        >.usable
          color #2F363D
        >.balance
          color #2F363D
      >.middle
        /deep/
          .el-input__inner
            background-color #fff
            border 1px solid S_main_color
          .el-input-group__append,.el-button--default
            border none
          .el-input-group__append
            background-color transparent
          .el-button--default
            background-color S_main_color
            border 1px solid S_main_color
            border-left none
            color #fff
            &.is-disabled
              background-color #ededed
              color #2F363D
      >.bottom
        color S_main_color
</style>
