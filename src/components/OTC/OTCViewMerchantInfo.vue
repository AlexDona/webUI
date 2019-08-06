<!--
  author: renfuwei
  create: 20190723
  description: 当前页面为 商家信息 组件
-->
<template lang="pug">
  .merchant-info-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
  )
    .inner-box
      <!--1 左侧信息-->
      .left-info
        <!--1.1 头像-->
        .one-avatar
          .names-box
            IconFontCommon(
              class="font-size40 icon-user"
              iconName="icon-yonghu1"
            )
            span.merchant-name.font-size16
              span(
                v-if="merchantUserInfo.personNickName"
              ) {{merchantUserInfo.personNickName}}
              span(
                v-else
              ) {{merchantUserInfo.personRealName}}
          .time-box
            <!--注册时间-->
            p.bar.font-size12 {{$t('M.focus_black_time1')}}：{{merchantUserInfo.registerTime}}
            <!--最近登录时间-->
            p.bar.font-size12 {{$t('M.focus_black_time2')}}：{{merchantUserInfo.recentlyLoginTime}}
        <!--1.2 认证-->
        .two-identity
          .one-row.row
            <!--邮箱认证-->
            .first-item.items(
              :class="{unverified: merchantUserInfo.mailAuth !== 'enable'}"
            )
              span {{$t('M.focus_black_identity1')}}
              IconFontCommon(
                class="font-size40 icon-user"
                iconName="icon-tongguo_huaban"
              )
            <!--手机认证-->
            .second-item.items(
              :class="{unverified: merchantUserInfo.phoneAuth !== 'enable'}"
            )
              span {{$t('M.focus_black_identity2')}}
              IconFontCommon(
                class="font-size40 icon-user"
                iconName="icon-tongguo_huaban"
              )
          .two-row.row
            <!--实名认证-->
            .third-item.items(
              :class="{unverified: merchantUserInfo.realNameAuth !== 'y'}"
            )
              span {{$t('M.user_real_name')}}
              IconFontCommon(
                class="font-size40 icon-user"
                iconName="icon-tongguo_huaban"
              )
            <!--高级认证-->
            .fourth-item.items(
              :class="{unverified: merchantUserInfo.advancedAuth !== 'pass'}"
            )
              span {{$t('M.user_senior_certification')}}
              IconFontCommon(
                class="font-size40 icon-user"
                iconName="icon-tongguo_huaban"
              )
          .three-row.row
            <!--商家认证-->
            .fifth-item.items(
              :class="{unverified: merchantUserInfo.merchantAuth !== 'PASS'}"
            )
              span {{$t('M.focus_black_identity3')}}
              IconFontCommon(
                class="font-size40 icon-user"
                iconName="icon-tongguo_huaban"
              )
        <!--1.3 交易信息-->
        .trade-infos
          <!--商家保证金-->
          .first-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info1')}}
            .bar-bottom {{merchantUserInfo.cashDeposit}}{{merchantUserInfo.cashDepositName}}
          <!--交易总单数-->
          .second-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info2')}}
            .bar-bottom {{merchantUserInfo.totalOrders}}
          <!--30日成交单-->
          .third-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info3')}}
            .bar-bottom {{merchantUserInfo.successOrders}}
          <!--30日成交率-->
          .fourth-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info4')}}
            .bar-bottom {{merchantUserInfo.successRate}}%
          <!--30日冻结次数-->
          .fifth-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info5')}}
            .bar-bottom {{merchantUserInfo.freezeTimes}}
          <!--平均放行-->
          .sixth-bar.bars
            .bar-top {{$t('M.focus_black_merchant_info6')}}
            .bar-bottom {{BIHTimeFormatting(merchantUserInfo.avgConfirmTime)}}
        <!--1.4 按钮组-->
        .four-button(
          v-if="!(userId === this.userInfo.id)"
        )
          .button-group(
            v-if="merchantUserInfo.relationType == '1'"
          )
            <!--取消关注-->
            .focus-button-box
              button(
                class="button"
                @click="cancelFocusBlackOpposite('1')"
              ) {{$t('M.focus_black_title3')}}
            <!--拉黑-->
            .black-button-box
              button(
                class="button"
                @click="dialogVisible = true"
              ) {{$t('M.focus_black_title2')}}
          .button-group(
            v-else-if="merchantUserInfo.relationType == '2'"
          )
            <!--关注-->
            .focus-button-box
              button(
                class="button"
                @click="focusBlackOpposite('1')"
              ) {{$t('M.focus_black_title1')}}
            <!--解除-->
            .black-button-box
              button(
                class="button"
                @click="cancelFocusBlackOpposite('2')"
              ) {{$t('M.focus_black_title4')}}
          .button-group(
            v-else
          )
            <!--关注-->
            .focus-button-box
              button(
                class="button"
                @click="focusBlackOpposite('1')"
              ) {{$t('M.focus_black_title1')}}
            <!--拉黑-->
            .black-button-box
              button(
                class="button"
                @click="dialogVisible = true"
              ) {{$t('M.focus_black_title2')}}
      <!--2 右侧列表-->
      .right-lists
        <!--购买列表-->
        .buy-list.buy-sell-list
          <!--购买广告-->
          .header-title.buy-title {{$t('M.focus_black_buy_sell_title1')}}
          <!--表格内容-->
          .body-content
            el-table(
              :data="buyTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            )
              <!-- 币种 -->
              el-table-column(
                :label="$t('M.comm_currency')"
              )
                template(slot-scope = "s")
                  div {{s.row.coinName}}/{{s.row.currencyName}}
              <!-- 价格 -->
              el-table-column(
                :label="$t('M.otc_index_price')"
              )
                template(slot-scope = "s")
                  .buy-price {{s.row.price}}{{s.row.currencyName}}
              <!-- 数量 -->
              el-table-column(
                :label="$t('M.comm_count')"
              )
                template(slot-scope = "s")
                  div {{s.row.remainCount}}{{s.row.coinName}}
              <!-- 限额 -->
              el-table-column(
                :label="$t('M.otc_index_priceLimit')"
              )
                template(slot-scope = "s")
                  div {{s.row.minCount}}-{{s.row.maxCount}}{{s.row.currencyName}}
              <!-- 支付方式 -->
              el-table-column(
                :label="$t('M.otc_index_Payment_method')"
              )
                template(slot-scope = "s")
                  div
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    )
                    span(
                      v-show="s.row.payTypes[3] === '1'"
                    )
                      img(
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      )
              <!-- 操作 -->
              el-table-column(
                :label="$t('M.otc_index_operate')"
                align="right"
              )
                template(slot-scope = "s")
                  div
                    <!--购买按钮-->
                    el-button(
                      class="sell-buy-button buy-button border-radius2 cursor-pointer"
                      :disabled="s.row.otcEnable=='disable'"
                      @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country, 'onlineBuy')"
                    ) {{$t('M.comm_buying')}}
        <!--出售列表-->
        .sell-list.buy-sell-list
          <!--出售广告-->
          .header-title.sell-title {{$t('M.focus_black_buy_sell_title2')}}
          <!--表格内容-->
          .body-content
            el-table(
              :data="sellTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            )
              <!-- 币种 -->
              el-table-column(
                :label="$t('M.comm_currency')"
              )
                template(slot-scope = "s")
                  div {{s.row.coinName}}/{{s.row.currencyName}}
              <!-- 价格 -->
              el-table-column(
                :label="$t('M.otc_index_price')"
              )
                template(slot-scope = "s")
                  .sell-price {{s.row.price}}{{s.row.currencyName}}
              <!-- 数量 -->
              el-table-column(
                :label="$t('M.comm_count')"
              )
                template(slot-scope = "s")
                  div {{s.row.remainCount}}{{s.row.coinName}}
              <!-- 限额 -->
              el-table-column(
                :label="$t('M.otc_index_priceLimit')"
              )
                template(slot-scope = "s")
                  div {{s.row.minCount}}-{{s.row.maxCount}}{{s.row.currencyName}}
              <!-- 支付方式 -->
              el-table-column(
                :label="$t('M.otc_index_Payment_method')"
              )
                template(slot-scope = "s")
                  div
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    )
                    IconFontCommon(
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    )
                    span(
                      v-show="s.row.payTypes[3] === '1'"
                    )
                      img(
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      )
              <!-- 操作 -->
              el-table-column(
                :label="$t('M.otc_index_operate')"
                align="right"
              )
                template(slot-scope = "s")
                  div
                    <!--出售按钮-->
                    el-button(
                      class="sell-buy-button sell-button border-radius2 cursor-pointer"
                      :disabled="s.row.otcEnable=='disable'"
                      @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country, 'onlineSell')"
                    ) {{$t('M.comm_offering')}}
      <!--3 拉黑弹窗-->
      .black-list-dialog
        el-dialog(
          :title="$t('M.otc_prompt')"
          :visible.sync="dialogVisible"
          top="0vh"
        )
          <!--拉黑后该用户将无法访问您的广告信息或与您交易，您确定要拉黑吗？-->
          .content {{$t('M.focus_black_title6')}}
          span(slot="footer")
            .button-group
              button(
                class="cancel item"
                @click="dialogVisible = false"
              ) {{$t('M.comm_cancel')}}
              button(
                class="confirm item"
                @click="focusBlackOpposite('2')"
              ) {{$t('M.comm_confirm')}}
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import {
  getMerchantInfoAJAX, // 获得商家信息
  addFocusBlackListAJAX, // 关注/拉黑
  cancelFocusAJAX, // 取消关注/解除
  getUserIsBlackingAJAX // 判断此用户是否被当前用户正处于拉黑中状态
} from '../../utils/api/focusBlack'
import IconFontCommon from '../../components/Common/IconFontCommon'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  formatSeconds
} from '../../utils'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 拉黑弹窗显示状态
      dialogVisible: false,
      // 购买列表
      buyTableList: [],
      // 出售列表
      sellTableList: [],
      // 用户id
      userId: '',
      // 币种id
      coinId: '',
      // 法币id
      currencyId: '',
      // 左侧个人信息
      merchantUserInfo: {
        // 保证金
        cashDeposit: '',
        cashDepositName: '',
        // 总单数
        totalOrders: '',
        // 30日成交单
        successOrders: '',
        // 30日成交率
        successRate: '',
        // 30日冻结次数
        freezeTimes: '',
        // 平均放行时间
        avgConfirmTime: '',
        // 昵称
        personNickName: '',
        // 真实名称
        personRealName: '',
        // 注册时间
        registerTime: '',
        // 最近登录时间
        recentlyLoginTime: '',
        // 邮箱认证
        mailAuth: '',
        // 手机认证
        phoneAuth: '',
        // 商家认证
        merchantAuth: '',
        // 高级认证
        advancedAuth: '',
        // 实名认证
        realNameAuth: '',
        // 关注与拉黑的状态
        relationType: ''
      },
      // 判断此用户是否被当前用户正处于拉黑中状态
      userIsBlackingStatus: ''
    }
  },
  created () {
    this.getURLParamsData()
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_BLACK_TABS_STATUS_M'
    ]),
    // 0 国际标准格式(09ˋ40′32″)
    BIHTimeFormatting (date) {
      return formatSeconds(date, 'OTC')
    },
    // 1 获得URL中参数信息
    getURLParamsData () {
      if (this.$route.query.coinId) {
        this.coinId = this.$route.query.coinId
      }
      if (this.$route.query.currencyId) {
        this.currencyId = this.$route.query.currencyId
      }
      if (this.$route.query.userId) {
        this.userId = this.$route.query.userId
        this.getUserIsBlacking()
      }
    },
    // 2 判断此用户是否被当前用户正处于拉黑中状态
    async getUserIsBlacking () {
      let param = {
        toId: this.userId
      }
      const data = await getUserIsBlackingAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      // relation：1：关注；2：拉黑
      this.userIsBlackingStatus = getNestedData(data, 'data.relation')
      if (this.userIsBlackingStatus === '2') {
        this.$goToPage(`/${this.$routes_X.OTCCenter}`)
        return false
      }
      this.getMerchantInfo()
    },
    // 3 查看商家信息页面数据
    async getMerchantInfo () {
      let param = {
        userId: this.userId,
        coinId: this.coinId,
        currencyId: this.currencyId
      }
      const data = await getMerchantInfoAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      this.buyTableList = getNestedData(data, 'data.sellOtcEntrust')
      this.sellTableList = getNestedData(data, 'data.buyOtcEntrust')
      // 个人信息赋值
      this.merchantUserInfo.cashDeposit = getNestedData(data, 'data.userInfo.guaranteeCount')
      this.merchantUserInfo.cashDepositName = getNestedData(data, 'data.userInfo.guaranteeCoinName')
      this.merchantUserInfo.totalOrders = getNestedData(data, 'data.userInfo.tradeTimes')
      this.merchantUserInfo.successOrders = getNestedData(data, 'data.userInfo.successOrderTimes')
      this.merchantUserInfo.successRate = getNestedData(data, 'data.userInfo.completeRate')
      this.merchantUserInfo.freezeTimes = getNestedData(data, 'data.userInfo.freezeTimes')
      this.merchantUserInfo.avgConfirmTime = getNestedData(data, 'data.userInfo.avgGiveOutTime')
      this.merchantUserInfo.registerTime = getNestedData(data, 'data.userInfo.regTime')
      this.merchantUserInfo.recentlyLoginTime = getNestedData(data, 'data.userInfo.lastLoginTime')
      this.merchantUserInfo.personNickName = getNestedData(data, 'data.userInfo.nickName')
      this.merchantUserInfo.personRealName = getNestedData(data, 'data.userInfo.realName')
      this.merchantUserInfo.mailAuth = getNestedData(data, 'data.userInfo.mailAuth')
      this.merchantUserInfo.phoneAuth = getNestedData(data, 'data.userInfo.phoneAuth')
      this.merchantUserInfo.merchantAuth = getNestedData(data, 'data.userInfo.merchantAuth')
      this.merchantUserInfo.advancedAuth = getNestedData(data, 'data.userInfo.advancedAuth')
      this.merchantUserInfo.realNameAuth = getNestedData(data, 'data.userInfo.realNameAuth')
      this.merchantUserInfo.relationType = getNestedData(data, 'data.userInfo.relationType')
    },
    // 4 关注/拉黑
    focusBlackOpposite: _.debounce(async function (type) {
      let param = {
        toId: this.userId,
        relation: type
      }
      const data = await addFocusBlackListAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      if (type === '2') {
        // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
        this.CHANGE_BLACK_TABS_STATUS_M(true)
        // 跳转到个人中心关注/拉黑第二个选项卡我的黑名单
        this.$goToPage('/PersonalCenter')
        this.CHANGE_USER_CENTER_ACTIVE_NAME('focus-blacklist')
      }
      // 重新刷新列表
      this.getMerchantInfo()
    }, 500),
    // 5 取消关注/解除
    cancelFocusBlackOpposite: _.debounce(async function (type) {
      let param = {
        toId: this.userId,
        relation: type
      }
      const data = await cancelFocusAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      this.getMerchantInfo()
    }, 500),
    // 6.购买出售限制
    async toOnlineBuyOrSell (id, coinId, userId, countryCode, entrustType) {
      const CHINA = ['853', '852', '886', '86']
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
      } else {
        // 刷新用户信息
        await this.REFRESH_USER_INFO_ACTION()
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          // 去个人中心设置交易密码
          this.$error_tips_X(this.$t('M.otc_index_js'))
          return false
        } else if (!this.userInfo.realname) {
          // 去个人中心完成实名认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips'))
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          // 去个人中心完成高级认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips_pass'))
          return false
        } if (this.userInfo.otcEnable === 'disable') {
          // 该账号已被禁止交易OTC，请咨询客服
          this.$error_tips_X(this.$t('M.otc_disable_account_tips'))
          return false
        } else {
          if (userId === this.userInfo.id) {
            // 禁止自买自卖
            this.$error_tips_X(this.$t('M.otc_index_forbided_buyand_sell'))
            return false
            // 增加个人用户信息中的国籍和选中的国家对比，如果相同，可以摘单，不相同，不能摘单，给出提示
          } else if (!(CHINA.includes(countryCode) && CHINA.includes(this.userInfo.country)) && !(countryCode == this.userInfo.country)) {
            // 根据您注册所在地的相关规定，无法进行此操作
            this.$error_tips_X(this.$t('M.otc_failure_0094'))
            return false
          } else {
            // entrustType 挂单类型
            // id - 挂单id
            // coinId - 币种id
            this.$goToPage(`/OTCOnlineTraderBuySell/${entrustType}/${id}/${coinId}`)
          }
        }
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 用户登录状态 false 未登录； true 登录
      isLogin: state => state.user.isLogin,
      // 用户详细信息
      userInfo: state => state.user.loginStep1Info.userInfo
    })
  }
  // watch: {}
}
</script>
<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .merchant-info-box
    width S_main_content_width
    padding-top 70px
    margin 60px auto 200px
    > .inner-box
      display flex
      justify-content space-between
      > .left-info
        width 300px
        min-height 927px
        > .one-avatar
          box-sizing border-box
          height 150px
          padding 25px 0 0 30px
          > .names-box
            height 40px
            margin-bottom 20px
            line-height 40px
            .icon
              margin-right 20px
          > .time-box
            > .bar
              line-height 20px
        > .two-identity
          position relative
          padding 30px 10px
          &::after
            position absolute
            bottom 0
            right 30px
            width 240px
            height 1px
            content ''
          > .row
            display flex
            justify-content space-between
            > .items
              width 49%
              padding 10px 0
              font-size 12px
              text-align center
              .icon
                width 20px
                height 20px
        > .trade-infos
          display flex
          flex-wrap wrap
          padding 30px 10px 0
          > .bars
            width 49%
            > .bar-top
              margin-bottom 6px
              font-size 12px
              text-align center
            > .bar-bottom
              font-size 14px
              text-align center
          .first-bar,.second-bar,.third-bar,.fourth-bar
            margin-bottom 30px
        > .four-button
          > .button-group
            display flex
            justify-content space-between
            padding 80px 30px 0
            > .focus-button-box
              width 50%
            > .black-button-box
              width 50%
              text-align right
            .button
              width 105px
              height 30px
              padding 5px 10px
              border-radius 2px
              font-size 12px
              cursor pointer
      > .right-lists
        width 985px
        > .buy-sell-list
          > .header-title
            height 58px
            padding-left 20px
            font-weight 700
            font-size 18px
            line-height 58px
          > .body-content
            .buy-price
              color S_error_color
            .sell-price
              color S_otc_green_color
            .xilian
              vertical-align middle
            .icon
              margin-right 5px
        > .buy-list
          min-height 440px
          margin-bottom 18px
          > .buy-title
            color S_error_color
        > .sell-list
          min-height 469px
          > .sell-title
            color S_otc_green_color
      /deep/
        .right-lists
          > .buy-sell-list
            > .body-content
              .el-table
                font-size 12px
                .el-table__header
                  thead
                    tr
                      th
                        padding 14px 0
                        &:first-child
                          .cell
                            padding-left 20px
                        &:nth-last-child(2)
                          .cell
                            padding-right 20px
                .el-table__body
                  tr
                    td
                      padding 18px 0
                      &:first-child
                        .cell
                          padding-left 20px
                      &:last-child
                        .cell
                          padding-right 20px
                  .sell-buy-button
                    height 24px
                    padding 0 10px
                    border 0
                    line-height 24px
                    color S_day_bg
                  .buy-button
                    background-color S_error_color
                  .buy-button.is-disabled
                    background-color #e4b1a7
                  .sell-button
                    background-color S_otc_green_color
                  .sell-button.is-disabled
                    background-color #8ead9e
                .el-table__empty-text
                  line-height 350px !important
        .black-list-dialog
          .el-dialog__wrapper
            display flex
            justify-content center
            align-items center
            background-color rgba(0, 0, 0, .7)
            .el-dialog
              width 350px
              height 180px
              border-radius 4px
              .el-dialog__header
                padding 6px 18px
                border-radius 4px 4px 0 0
                .el-dialog__title
                  font-size 14px
                .el-dialog__headerbtn
                  top 10px
                  right 10px
              .el-dialog__body
                height 84px
                padding 30px 18px
                font-size 12px
              .el-dialog__footer
                padding 0 18px
                .button-group
                  .item
                    height 30px
                    padding 0 28px
                    border-radius 2px
                    font-size 12px
                    line-height 30px
                    cursor pointer
                  .confirm
                    margin-left 20px
    &.night
      .inner-box
        > .left-info
          background-color S_night_main_bg
          box-shadow 0 3px 4px 0 rgba(25, 30, 40, 1)
          > .one-avatar
            border-bottom 1px solid $dialogColor10
            > .names-box
              > .merchant-name
                color S_day_bg
            > .time-box
              color S_color5
          > .two-identity
            &::after
              border-bottom 1px dashed S_color10
            > .row
              > .items
                color S_day_bg
                .icon
                  color S_main_color
              .unverified
                color S_color5 !important
                .icon
                  color S_color5 !important
          > .trade-infos
            > .bars
              > .bar-top
                color S_color5
              > .bar-bottom
                color S_day_bg
          > .four-button
            > .button-group
              > .focus-button-box
                > .button
                  color S_day_bg
                  background-color S_main_color
              > .black-button-box
                > .button
                  border 1px solid S_main_color
                  color S_main_color
                  background-color S_night_main_bg
        > .right-lists
          .buy-sell-list
            background-color S_night_main_bg
            box-shadow 0 3px 4px 0 rgba(25, 30, 40, 1)
            > .header-title
              border-bottom 1px solid S_color10
        /deep/
          .right-lists
            > .buy-sell-list
              > .body-content
                .el-table
                  color S_day_bg
                  background-color S_night_main_bg
                  .el-table__header
                    thead
                      color S_night_main_text_color
                      tr
                        th
                          background-color S_night_main_bg
                          &.is-leaf
                            border-bottom 1px solid S_color10
                  .el-table__body
                    tr
                      background-color S_night_main_bg
                      td
                        border-bottom 0 solid transparent
                      &:hover
                        td
                          background-color S_color9
          .black-list-dialog
            .el-dialog__wrapper
              .el-dialog
                background-color S_color6
                .el-dialog__header
                  background-color S_color8
                  .el-dialog__title
                    color S_color4
                .el-dialog__body
                  color: S_color7
                .el-dialog__footer
                  .button-group
                    .cancel
                      border 1px solid S_main_color
                      color S_day_bg
                      background-color S_color6
                    .confirm
                      color S_day_bg
                      background S_night_button_bg_color1
    &.day
      .inner-box
        > .left-info
          background-color S_day_bg
          box-shadow 0 0 6px S_color4
          > .one-avatar
            border-bottom 1px solid rgba(97, 116, 153, .2)
            > .names-box
              > .merchant-name
                color S_day_main_text_color
            > .time-box
              color S_color5
          > .two-identity
            &::after
              border-bottom 1px dashed rgba(97, 116, 153, .2)
            > .row
              > .items
                color S_main_color
                .icon
                  color S_main_color
              .unverified
                color S_color5 !important
                .icon
                  color S_color5 !important
          > .trade-infos
            > .bars
              > .bar-top
                color S_color5
              > .bar-bottom
                color S_day_main_text_color
          > .four-button
            > .button-group
              > .focus-button-box
                > .button
                  color S_day_bg
                  background-color S_main_color
              > .black-button-box
                > .button
                  border 1px solid S_main_color
                  color S_main_color
                  background-color S_day_bg
        > .right-lists
          .buy-sell-list
            background-color S_day_bg
            box-shadow 0 0 6px S_color4
            > .header-title
              border-bottom 1px solid rgba(97, 116, 153, .2)
        /deep/
          .right-lists
            > .buy-sell-list
              > .body-content
                .el-table
                  color S_day_main_text_color
                  background-color S_day_bg
                  .el-table__header
                    thead
                      color S_color2
                      tr
                        th
                          background-color S_day_bg
                          &.is-leaf
                            border-bottom 1px solid rgba(97, 116, 153, .2)
                  .el-table__body
                    tr
                      background-color S_day_bg
                      td
                        border-bottom 0 solid transparent
                      &:hover
                        td
                          background-color rgba(97, 116, 153, .05)
          .black-list-dialog
            .el-dialog__wrapper
              .el-dialog
                background-color S_day_bg
                .el-dialog__header
                  background-color S_color3
                  .el-dialog__title
                    color S_day_main_text_color
                .el-dialog__body
                  color S_day_main_text_color
                .el-dialog__footer
                  .button-group
                    .cancel
                      border 1px solid S_main_color
                      color S_main_color
                      background-color S_day_bg
                    .confirm
                      color S_day_bg
                      background S_day_button_bg_color2
</style>
