<!--
  author: renfuwei
  create: 2019080
  description: 当前页面为 OTC一键买币 组件
-->
<template lang="pug">
  .buy-coin-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{ 'min-height': windowHeight - footerHeight - 50 + 'px'}"
  )
    .buy-coin-inner-box.border-radius4
      .bottom-picture
      .buy-header
        h3.title.font-size20.text-align-c 一键买币
        div.tips.font-size12.text-align-c 小额快速交易，单笔50000以下
      .buy-body
        .coin-list
          ul
            li.item.cursor-pointer(
              v-for="(item,index) in coinList"
              :key="index"
              @click="selectCoin(item.coinId,item.name,item.unit)"
              :class="{checked: checkedCoinId == item.coinId}"
            ) {{item.name}}
        .reference-price.font-size12
          span.price-data {{checkedCoinName}} 参考价：{{checkedCoinMarketPrice || '--'}}CNY/{{checkedCoinName}}
          span.question-mark
            el-popover(
              popper-class="question-tips"
              placement="top"
              trigger="hover"
              content="非最终成交单价，仅供参考"
            )
              IconFontCommon.cursor-pointer(
                iconName="icon-wen"
                slot="reference"
              )
        .buy-input-box
          .buy-style-text
            span.text-first.cursor-pointer(
              @click="toggleText('first')"
              :class="{isCheckedText: showFirstStatus}"
            ) 按金额购买
            span.line
            span.text-second.cursor-pointer(
              @click="toggleText('second')"
              :class="{isCheckedText: showSecondStatus}"
            ) 按数量购买
          .buy-style-input-box
            .input-content
              input(
                type="text"
                class="buy-input"
                :class="{errorBorder: isHaveOneTradeErrorTips}"
                maxlength="20"
                :placeholder="purchasingTypes === 'money'? '请输入购买金额': '请输入购买数量'"
                ref="inputValue"
                @keyup="changeInputValue('inputValue')"
                @input="changeInputValue('inputValue')"
                onpaste="return false"
              )
              span.currency-name(
                v-if="purchasingTypes === 'money'"
              ) CNY
              span.currency-name(
                v-else
              ) {{checkedCoinName}}
            .error-info {{oneTradeErrorTips}}
        .pay-for-box
          .pay-title 选择付款方式
          .pay-type-box(
            v-if="entrustList.length"
          )
            .item.cursor-pointer(
              @click="togglePayFor(item)"
              :class="{itemChecked: item === currentSelectedItem}"
              v-for="(item, index) in entrustList"
              :key="index"
            )
              .pay-sign
                span(
                  v-if="item.payType === 'Bankcard'"
                )
                  IconFontCommon.font-size20(
                    iconName="icon-icon"
                  )
                span(
                  v-if="item.payType === 'Alipay'"
                )
                  IconFontCommon.font-size20(
                    iconName="icon-zhifubao3"
                  )
                span(
                  v-if="item.payType === 'Wechat'"
                )
                  IconFontCommon.font-size20(
                    iconName="icon-weixin4"
                  )
              .pay-bank.font-size12
                span(
                  v-if="item.payType === 'Bankcard'"
                ) 银行卡
                span(
                  v-if="item.payType === 'Alipay'"
                ) 支付宝
                span(
                  v-if="item.payType === 'Wechat'"
                ) 微信
              // 原来是图片增加类名展示optimalPic测试说不清楚改为了字体图标显示
              .best-mark(
                v-show="item.best"
              )
                IconFontCommon(
                  iconName="icon-zuiyou2"
                )
          .no-data.font-size12(
            v-else
          ) 暂无合适报价，
            span.cursor-pointer.all-price(
              @click="viewAllPrice"
            ) 查看所有报价
        .trade-info-box
          .trade-price.bar
            .left.font-size14 交易单价
            .right.font-size12.red {{currentSelectedItem.price || '--'}}CNY/{{checkedCoinName}}
          .trade-amount.bar
            .left.font-size14 交易数量
            .right.font-size12 {{currentSelectedItem.buyCount  || '--'}}{{checkedCoinName}}
          .trade-total.bar
            .left.font-size14 交易总额
            .right.font-size12 {{currentSelectedItem.buyAmount  || '--'}}CNY
        .submit-box
          button.submit-button.font-size14.cursor-pointer.border-radius4(
            @click="oneKeyBuyButton"
          ) 一键买币
          PayPassDialog(@next="submitOneKeyBuy")
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import {
  getOTCAvailableCurrency,
  getOTCOneTradeCoinMarketPriceAjax,
  // OTC一键买币input框输入数据调取委单列表信息接口
  getOTCOneTradeEntrustListInfoAjax,
  pickOrdersToBuy
} from '../../utils/api/OTC'
import {
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
import IconFontCommon from '../Common/IconFontCommon'
import {
  formatNumberInput
} from '../../utils'
export default {
  name: 'otc-one-trade',
  // mixins: [],
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 币种列表
      coinList: [],
      // 选中币种id
      checkedCoinId: '',
      // 选中币种name
      checkedCoinName: '',
      // 选中币种市价
      checkedCoinMarketPrice: '',
      // 按金额/数量购买类型及选中项状态
      showFirstStatus: false,
      showSecondStatus: false,
      // 购买类型 金额money数量amount
      purchasingTypes: '', // amount  money
      // input框默认金额小数位位数
      moneyPointLength: 2,
      // input框默认数量小数位位数
      amountPointLength: 4,
      // 10S定时器
      timer: null,
      // 一键买币最小数量或者金额
      oneTradeMix: '',
      // 一键买币最大数量或者金额
      oneTradeMax: '',
      // 一键买币错误提示信息状态
      isHaveOneTradeErrorTips: false,
      // 一键买币错误提示信息
      oneTradeErrorTips: '',
      // 后台返回的支付方式列表信息
      entrustList: [],
      // 有最优价的数组项
      checkedItemArr: [],
      // 当前选中项
      currentSelectedItem: {},
      isNeedPayPassword: true
    }
  },
  async created () {
    // 关闭交易密码弹窗
    this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(false)
    // console.log(this.$route)
    // 获得币种列表
    await this.getOTCOneTradeCoinList()
    // 获取参考价
    await this.getOTCOneTradeCoinMarketPrice()
    // 根据URL中是否有交易类型来显示
    await this.getUrlParam()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'UPDATE_PAY_PASSWORD_DIALOG_M',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    // 1 url参数赋值
    getUrlParam () {
      if (this.$route.params && this.$route.params.purchasingTypes) {
        if (this.$route.params.purchasingTypes === 'typeAmount') {
          this.purchasingTypes = 'amount'
          this.showSecondStatus = true
        }
        if (this.$route.params.purchasingTypes === 'typeMoney') {
          this.purchasingTypes = 'money'
          this.showFirstStatus = true
        }
      } else {
        this.purchasingTypes = 'money'
        this.showFirstStatus = true
        this.showSecondStatus = false
      }
      if (this.$route.params && this.$route.params.buyInputValue) {
        this.$refs.inputValue.value = this.$route.params.buyInputValue - 0
        this.getOneKeyBuyInfos()
      }
    },
    // 2 获得币种列表
    async getOTCOneTradeCoinList () {
      const data = await getOTCAvailableCurrency()
      if (!data) return false
      this.coinList = getNestedData(data, 'data')
      // URL中有币种id就按照此id来渲染页面，如果没有就按照数组的第一项渲染
      if (this.$route.params && this.$route.params.coinId) {
        this.coinList.forEach((item, index) => {
          if (this.$route.params.coinId === item.coinId) {
            this.checkedCoinId = item.coinId
            this.checkedCoinName = item.name
            this.amountPointLength = item.unit
          }
        })
      } else {
        if (this.coinList.length) {
          this.checkedCoinId = this.coinList[0].coinId
          this.checkedCoinName = this.coinList[0].name
          this.amountPointLength = this.coinList[0].unit
        }
      }
    },
    // 3 获取币种市价
    async getOTCOneTradeCoinMarketPrice () {
      let param = {
        coinId: this.checkedCoinId
      }
      const data = await getOTCOneTradeCoinMarketPriceAjax(param)
      if (!data) return false
      this.checkedCoinMarketPrice = getNestedData(data, 'data')
      this.tenSecondTimer()
    },
    // 4 市价10秒倒计时
    tenSecondTimer () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.getOTCOneTradeCoinMarketPrice()
      }, 10000)
    },
    // 5 选择币种
    selectCoin: _.debounce(function (id, name, unit) {
      // 清空数据
      this.clearData()
      this.checkedCoinId = id
      this.checkedCoinName = name
      this.amountPointLength = unit
      this.getOTCOneTradeCoinMarketPrice()
    }, 200),
    // 6 清空数据
    clearData () {
      // 清空input框
      this.$refs.inputValue.value = ''
      this.isHaveOneTradeErrorTips = false
      this.oneTradeErrorTips = ''
      this.entrustList = []
      this.currentSelectedItem = {}
    },
    // 7 切换按金额/数量购买类型
    toggleText: _.debounce(function (data) {
      switch (data) {
        case 'first':
          this.showFirstStatus = true
          this.showSecondStatus = false
          this.purchasingTypes = 'money'
          break
        case 'second':
          this.showFirstStatus = false
          this.showSecondStatus = true
          this.purchasingTypes = 'amount'
          break
      }
      // 清空数据
      this.clearData()
    }, 200),
    // 8 改变input框输入值
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      let pointLength
      if (this.purchasingTypes === 'money') {
        pointLength = this.moneyPointLength
      }
      if (this.purchasingTypes === 'amount') {
        pointLength = this.amountPointLength
      }
      formatNumberInput(target, pointLength)
      // 键盘弹起没有值
      if (!this.$refs.inputValue.value) {
        this.currentSelectedItem = {}
      }
      this.getOneKeyBuyInfos()
    },
    // 9 input键盘弹起调接口
    getOneKeyBuyInfos: _.debounce(async function () {
      let param = {
        coinId: this.checkedCoinId // 币种id
      }
      if (this.purchasingTypes === 'money') {
        param.buyAmount = this.$refs.inputValue.value // 买入金额
      } else {
        param.buyCount = this.$refs.inputValue.value // 买入数量
      }
      this.entrustList = []
      this.currentSelectedItem = {}
      const data = await getOTCOneTradeEntrustListInfoAjax(param)
      if (!data) return false
      // 输入限制比较
      this.oneTradeMix = getNestedData(data, 'data.min') - 0
      this.oneTradeMax = getNestedData(data, 'data.max') - 0
      if (this.oneTradeMax == 0) {
        this.isHaveOneTradeErrorTips = true
        this.oneTradeErrorTips = '当前币种没有挂单'
        return false
      }
      if (this.oneTradeMix - this.oneTradeMax > 0) {
        this.isHaveOneTradeErrorTips = true
        this.oneTradeErrorTips = '暂无合适报价'
        return false
      }
      if (this.purchasingTypes === 'money') {
        if (this.$refs.inputValue.value - this.oneTradeMix < 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最小下单金额为' + this.oneTradeMix + 'CNY'
        } else if (this.$refs.inputValue.value - this.oneTradeMax > 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最大下单金额为' + this.oneTradeMax + 'CNY'
        } else {
          this.isHaveOneTradeErrorTips = false
          this.oneTradeErrorTips = ''
        }
      } else {
        if (this.$refs.inputValue.value - this.oneTradeMix < 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最小下单数量为' + this.oneTradeMix + this.checkedCoinName
        } else if (this.$refs.inputValue.value - this.oneTradeMax > 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最大下单数量为' + this.oneTradeMax + this.checkedCoinName
        } else {
          this.isHaveOneTradeErrorTips = false
          this.oneTradeErrorTips = ''
        }
      }
      // 如果输入数据不正确有报错
      if (this.isHaveOneTradeErrorTips) {
        this.currentSelectedItem = {}
      }
      // 支付方式逻辑处理
      if (data.data.entrustList) {
        this.entrustList = getNestedData(data, 'data.entrustList')
        // 筛选返回数据中有最优价标签的数据项
        this.checkedItemArr = this.entrustList.filter(item => item.best)
        // 将筛选出来的数据项第一项赋值给当前选中数据项
        this.currentSelectedItem = this.checkedItemArr[0] ? this.checkedItemArr[0] : {}
      } else {
        this.entrustList = []
      }
    }, 500),
    // 10 切换付款方式
    togglePayFor: _.debounce(function (item) {
      this.currentSelectedItem = item
    }),
    // 11 一键买币提交
    oneKeyBuyButton: _.debounce(async function () {
      // 1 增加登录验证
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
        return false
      }
      // input框有错误提示信息不能点击购买
      if (this.isHaveOneTradeErrorTips) {
        return false
      }
      // 2 刷新用户信息
      await this.REFRESH_USER_INFO_ACTION()
      // 3 未设置交易密码、未实名认证，未高级认证，OTC账号禁用， 不能进行交易
      if (!this.userInfo.payPassword) {
        // 请前往个人中心设置交易密码
        this.$error_tips_X('请前往个人中心设置交易密码!')
        return false
      } else if (!this.userInfo.realname) {
        // 请前往个人中心完成实名认证
        this.$error_tips_X('请前往个人中心完成实名认证!')
        return false
      } else if (!(this.userInfo.advancedAuth === 'pass')) {
        // 请前往个人中心完成高级认证
        this.$error_tips_X('请前往个人中心完成高级认证')
        return false
      }
      // 增加数据是否为空验证
      if (!this.currentSelectedItem.buyCount || !this.currentSelectedItem.id) {
        this.$error_tips_X('请先选择付款方式！')
        return false
      }
      // 用户交易密码是否锁定判断
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      // 该账号已被禁止交易OTC，请咨询客服
      if (this.userInfo.otcEnable === 'disable') {
        this.$error_tips_X('该账号已被禁止交易OTC，请咨询客服')
        return false
      }
      // 增加判定是否显示交易密码 若不显示直接调接口
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(true)
      } else {
        this.submitOneKeyBuy()
      }
    }, 500),
    // 12 一键买币点击交易密码框中提交按钮
    submitOneKeyBuy: _.debounce(async function () {
      let param = {
        entrustId: this.currentSelectedItem.id, // 挂单id
        buyCount: this.currentSelectedItem.buyCount, // 买入数量
        tradePassword: this.$globalPayPassword_S_X // 交易密码
      }
      const data = await pickOrdersToBuy(param)
      if (!data) return false
      // 接口成功后逻辑
      // 关闭交易密码弹窗
      this.$UPDATE_PAY_PASSWORD_DIALOG_M_X(false)
      // 跳转到法币订单
      this.$goToPage('/PersonalCenter')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('fiat-orders')
      // 清空数据
      this.clearData()
    }, 500),
    // 13 查看所有报价
    viewAllPrice () {
      this.$goToPage(`/${this.$routes_X.OTCCenter}`)
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 用户登录状态 false 未登录； true 登录
      isLogin: state => state.user.isLogin,
      // 用户详细信息
      userInfo: state => state.user.loginStep1Info.userInfo,
      loginStep1Info: state => state.user.loginStep1Info,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      footerHeight: state => state.common.footerHeight
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {}
}
</script>
<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .buy-coin-box
    box-sizing border-box
    width S_main_content_width
    margin 0 auto
    padding 50px 0
    > .buy-coin-inner-box
      width 540px
      height 570px
      margin 0 auto
      position relative
      > .bottom-picture
        position absolute
        left 50%
        bottom -16px
        transform translateX(-50%)
        width: 520px
        height 17px
      > .buy-header
        height 110px
        > .title
          padding-top 24px
        > .tips
          padding-top 7px
      > .buy-body
        padding 0 50px
        > .coin-list
          ul
            display flex
            flex-wrap wrap
            max-height 44px
            min-height 26px
            > .item
              height 18px
              margin-right 15px
        > .reference-price
          margin-top 5px
          > .question-mark
            padding-left 5px
        > .buy-input-box
          margin-top 10px
          > .buy-style-text
            font-size 12px
            height 18px
            line-height 18px
            .isCheckedText
              font-size 14px
            > .line
              display inline-block
              width 1px
              height 9px
              margin 0 10px
          > .buy-style-input-box
            margin-top 10px
            > .input-content
              position relative
              > .buy-input
                box-sizing border-box
                width 440px
                height 44px
                padding: 0 50px 0 10px
                border-radius 4px
              > .currency-name
                position absolute
                top 50%
                right 16px
                transform translateY(-50%)
                font-size 12px
            > .error-info
              min-height 16px
              font-size 12px
              margin-top 5px
        > .pay-for-box
          > .pay-title
            font-size 12px
          > .no-data
            width 440px
            height 80px
            line-height 80px
            text-align center
            .all-price
              color S_main_color
          > .pay-type-box
            box-sizing border-box
            width 440px
            height 70px
            margin-top 10px
            display flex
            > .item
              width 33%
              box-sizing border-box
              height 70px
              display flex
              flex-direction column
              align-items center
              justify-content center
              position relative
              border-radius 2px
              > .pay-sign
                margin-bottom 4px
              > .best-mark
                position absolute
                top -11px
                left 5px
                .icon
                  font-size 40px
              > .optimalPic
                width 35px
                height 22px
                position absolute
                top 0
                left 5px
            > .itemChecked
              border-radius 4px
        > .trade-info-box
          margin-top 20px
          > .bar
            display flex
            justify-content space-between
            height 26px
            line-height 26px
        > .submit-box
          margin-top 20px
          > .submit-button
            width 440px
            height 44px
  &.night
    color S_color5
    > .buy-coin-inner-box
      background url("../../assets/otc/one_trade_banner.png")
      > .bottom-picture
        background url("../../assets/otc/one_trade_bottom.png") no-repeat center
      > .buy-header
        > .title
          color S_day_bg
        > .tips
          color #9AA5C4
      > .buy-body
        > .coin-list
          ul
            .checked
              color S_main_color
              border-bottom 1px solid S_main_color
        > .reference-price
          color S_day_bg
          > .question-mark
            .icon
              color S_main_color
        > .buy-input-box
          > .buy-style-text
            .isCheckedText
              color S_main_color
            > .line
              background-color S_color5
          > .buy-style-input-box
            > .input-content
              .errorBorder
                border 1px solid S_error_color !important
              > .buy-input
                border 1px solid #454b70
                color S_color5
                background-color S_night_main_bg
                &:focus
                  border 1px solid S_main_color
            > .error-info
              color S_otc_red_color
        > .pay-for-box
          > .pay-type-box
            > .item
              border 1px solid #454b70
              > .optimalPic
                background url("../../assets/otc/one_trade_sign.png") no-repeat center
            > .itemChecked
              color S_main_color
              border 1px solid S_main_color !important
        > .trade-info-box
          > .bar
            > .red
              color S_error_color
        > .submit-box
          > .submit-button
            color #fff
            background linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%)
  &.day
    color S_color5
    > .buy-coin-inner-box
      background url("../../assets/otc/one_trade_banner_day.png")
      > .bottom-picture
        background url("../../assets/otc/one_trade_bottom_day.png") no-repeat center
      > .buy-header
        > .title
          color S_day_bg
        > .tips
          color #9AA5C4
      > .buy-body
        > .coin-list
          ul
            .checked
              color S_main_color
              border-bottom 1px solid S_main_color
        > .reference-price
          color S_day_main_text_color
          > .question-mark
            .icon
              color S_main_color
        > .buy-input-box
          > .buy-style-text
            .isCheckedText
              color S_main_color
            > .line
              background-color S_color5
          > .buy-style-input-box
            > .input-content
              .errorBorder
                border 1px solid S_error_color !important
              > .buy-input
                border 1px solid rgba(69, 75, 112,.4)
                color S_color5
                background-color S_day_bg
                &:focus
                  border 1px solid S_main_color
            > .error-info
              color S_otc_red_color
        > .pay-for-box
          > .pay-type-box
            > .item
              border 1px solid rgba(69, 75, 112,.4)
              > .pay-sign
                .icon
                  color S_day_main_text_color
              > .pay-bank
                color S_day_main_text_color
              > .optimalPic
                background url("../../assets/otc/one_trade_sign.png") no-repeat center
            > .itemChecked
              color S_main_color
              border 1px solid S_main_color !important
        > .trade-info-box
          > .bar
            > .red
              color S_error_color
        > .submit-box
          > .submit-button
            color #fff
            background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
</style>
