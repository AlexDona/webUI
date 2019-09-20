<!--
  author: wt
  created: 20190827
  description: 当前组件为量化中心
-->
<template lang="pug">
    .container.text-center(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}"
      :style="{ 'min-height': windowHeight - footerHeight - 50 + 'px'}")
      .inner-box
        .banner-box
          .banner-bg(:class="$isChineseLanguage_G_X? 'banner': 'bannerEN'")
        .content
          .content-box
            .navs
              el-tabs(v-model="activeName" @tab-click="handleClick" v-if="!change")
                // 量化市场
                el-tab-pane(:label="languages.quantization_nav_1" name="first" :class="{'d-flex': !change}")
                  .pane-content(v-for="list in strategyList" v-if="strategyList.length")
                    .pane-header
                      .header-left {{$isChineseLanguage_G_X? list.strategyName: list.strategyEnName}}
                      ul.header-right
                        li.price {{list.oneMonthPrice + list.coin + `/${languages.month}`}}
                        // 包含策略使用费,平台使用费,托管者费用
                        li.price-info {{languages.quantization_price_info}}
                    .pane-container
                      ul.pane-ul-l
                        // 主流币种随意选择
                        li {{languages.quantization_pane_info1}}
                        // 自定义所选币种权重
                        li {{languages.quantization_pane_info2}}
                        // 实时计算币种折合比特币均值
                        li {{languages.quantization_pane_info3}}
                      ul.pane-ul-r
                        // 全自动持仓减仓
                        li {{languages.quantization_pane_info4}}
                        // 自定义精度, 交易粒度, 交易频率
                        li {{languages.quantization_pane_info5}}
                        // 锁定利润, 平衡资金
                        li {{languages.quantization_pane_info6}}
                    .pane-footer
                      // 立即购买
                      button.buy(@click="handleDialog" :data-formData="JSON.stringify(list)") {{languages.quantization_pane_buy}}
                  .pane-content(v-else)
                    // 暂无策略
                    .pane-container(style="width:100%") {{languages.quantization_no_strategies}}
                // 我的策略
                el-tab-pane(:label="languages.quantization_nav_2" name="second")
                  div.my-strategy
                    el-table(:data="myStrategyList"
                      :empty-text="$t('M.comm_no_data')"
                      style="width: 100%")
                      // 名称
                      el-table-column(:label="languages.quantization_table_name")
                        template(slot-scope = "s")
                          div {{$isChineseLanguage_G_X? s.row.strategyName: s.row.strategyEnName}}
                      // 到期时间
                      el-table-column(:label="languages.quantization_table_deadline")
                        template(slot-scope = "s")
                          div {{s.row.endTime}}
                      // 剩余
                      el-table-column(:label="languages.quantization_table_remains")
                        template(slot-scope = "s")
                          // 天
                          div {{s.row.remainDay + languages.quantization_table_day}}
                      // 状态
                      el-table-column(:label="languages.quantization_table_status")
                        template(slot-scope = "s")
                          // 已过期 || 使用中
                          div(:class="{'active-text': !s.row.isValid}") {{s.row.isValid ? languages.quantization_table_expire: languages.quantization_table_unexpired}}
                      // 操作
                      el-table-column(:label="languages.quantization_table_operation")
                        template(slot-scope = "s")
                          div
                            // 查看
                            button.check(@click="handleRotationStrategy(s.row)"
                            :class="s.row.isValid? 'btn-disabled' : null"
                            :disabled="!!s.row.isValid") {{languages.quantization_table_check}}
                            // 续费
                            button.check(@click="handleDialog" :data-formData="JSON.stringify(s.row)") {{languages.quantization_table_fee}}
              // 点击切换样式
              el-tabs(v-model="activeName" @tab-click="handleClick" v-else)
                // 量化市场
                el-tab-pane(:label="languages.quantization_nav_1"  name="first")
                  .pane-content-row(v-for="list in strategyList")
                    .pane-bg {{list.strategyName}}
                    .pane-list
                      ul
                        // 主流币种随意选择
                        li {{languages.quantization_pane_info1}}
                        // 自定义所选币种权重
                        li {{languages.quantization_pane_info2}}
                        // 实时计算币种折合比特币均值
                        li {{languages.quantization_pane_info3}}
                      ul
                        // 全自动持仓减仓
                        li {{languages.quantization_pane_info4}}
                        // 自定义精度, 交易粒度, 交易频率
                        li {{languages.quantization_pane_info5}}
                        // 锁定利润, 平衡资金
                        li {{languages.quantization_pane_info6}}
                      .pane-r
                        .price {{list.oneMonthPrice + list.coin + `/${languages.month}`}}
                        // 包含策略使用费,平台使用费,托管者费用
                        .price-info {{languages.quantization_price_info}}
                        // 立即购买
                        button.buy(@click="handleDialog" :data-formData="JSON.stringify(list)") {{languages.quantization_pane_buy}}
                // 我的策略
                el-tab-pane(:label="languages.quantization_nav_2" name="second")
                  div.my-strategy
                    el-table(:data="myStrategyList"
                      :empty-text="languages.quantization_table_nodata"
                      style="width: 100%")
                      el-table-column(:label="'名称'")
                        template(slot-scope = "s")
                          div {{$isChineseLanguage_G_X? s.row.strategyName: s.row.strategyEnName}}
                      el-table-column(:label="'到期时间'")
                        template(slot-scope = "s")
                          div {{s.row.endTime}}
                      el-table-column(:label="'剩余'")
                        template(slot-scope = "s")
                          div {{s.row.remainDay + '天'}}
                      el-table-column(:label="'状态'")
                        template(slot-scope = "s")
                          // 已过期 || 使用中
                          div(:class="{'active-text': !s.row.isValid}") {{s.row.isValid ? languages.quantization_table_expire: languages.quantization_table_unexpired}}
                      // 操作
                      el-table-column(:label="languages.quantization_table_operation")
                        template(slot-scope = "s")
                          div
                            // 查看
                            button.check(@click="handleRotationStrategy(s.row)"
                              :disabled="!!s.row.isValid"
                              :class="s.row.isValid? 'btn-disabled' : null") {{languages.quantization_table_check}}
                            // 续费
                            button.check(@click="handleDialog" :data-formData="JSON.stringify(s.row)") {{languages.quantization_table_fee}}
              span.icon-change(@click = "handleChangeLayout")
                  IconFont(:iconName= "icons" v-show="iconsVisible")
      //  开通
      el-dialog(:title="languages.quantization_dialog_title" :visible.sync="dialogBuyVisible" class="dialog-buy")
        el-form(:model="form")
          // 策略
          el-form-item(:label='languages.quantization_dialog_strategy')
            el-input(v-model="form.strategyName" disabled)
          // 时长
          el-form-item(:label='languages.quantization_dialog_duration')
          .duration-box.display-flex
            input#btn1(type="radio" name="duration" :value="[dialogData.oneMonthPrice, dialogData.oneMonthPrice,  {validMonth: 1}]" v-model="monthPrice")
            label.duration-item(for="btn1") 1{{languages.quantization_dialog_per_month}}
            // 推荐
            el-badge(:value="languages.quantization_dialog_recommendation" class="item")
              input#btn2(type="radio" name="duration" checked="checked" :value="[dialogData.threeMonthPrice, (dialogData.oneMonthPrice * 3).toFixed(5), {validMonth: 3}]" v-model="monthPrice")
              label.duration-item(for="btn2") 3{{languages.quantization_dialog_per_month}}
            input#btn3(type="radio" name="duration"  :value="[dialogData.sixMonthPrice, (dialogData.oneMonthPrice * 6).toFixed(5),  {validMonth: 6}]" v-model="monthPrice")
            label.duration-item(for="btn3") 6{{languages.quantization_dialog_per_month}}
            input#btn4(type="radio" name="duration" :value="[dialogData.twelveMonthPrice, (dialogData.oneMonthPrice * 12).toFixed(5),  {validMonth: 12}]" v-model="monthPrice")
            label.duration-item(for="btn4") 12{{languages.quantization_dialog_per_month}}
          // 支付
          el-form-item.pay(:label="languages.quantization_dialog_payment")
          .cut-price {{monthPrice[0] + ' ' + dialogData.coin}}
            s.origin-price {{languages.quantization_dialog_origin_price + monthPrice[1] + ' ' + dialogData.coin}}
          .remains
            // 可用
            span {{languages.quantization_dialog_remain_price + balance}}
            // 立即充值
            a(href="javascript:void(0)" @click.stop="jumpToPersonalCenter('assets', 'buy', 'recharge')") {{languages.quantization_dialog_charge}}
        div(slot="footer" class="dialog-footer")
          // 确认
          el-button(type="primary" @click="handleSubmit") {{languages.quantization_button_confirm}}
      PayPassDialog(@next="buySubmit")
      // 协议
      // 量化市场风险提示
      el-dialog.dialog-risk(:title="languages.quantization_prompt_title"
        :visible.sync="isRememberStatus"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false")
        .prompt-risk
          header {{languages.quantization_prompt_pTitle}}
          // 1.量化市场就各项服务、安全、无误、及不中断不负担任何明示或默示的保证责任。您同意承担使用本网站该项服务的所有风险及因该风险可能造成的任何损害。
          p {{languages.quantization_prompt_p1}}
          p {{languages.quantization_prompt_p2}}
          p {{languages.quantization_prompt_p3}}
          p {{languages.quantization_prompt_p4}}
          p {{languages.quantization_prompt_p5}}
          p {{languages.quantization_prompt_p6}}
          p {{languages.quantization_prompt_p7}}
          p {{languages.quantization_prompt_p8}}
          p {{languages.quantization_prompt_p9}}
          p {{languages.quantization_prompt_p10}}
          p {{languages.quantization_prompt_p11}}
          p {{languages.quantization_prompt_p12}}
        .check-box
          // 同意协议
          el-checkbox(v-model="isChecked") {{languages.quantization_prompt_agreement}}
        div(slot="footer" class="dialog-footer")
          el-button(type="primary" @click="handleConfirmPrompt" :style="{cursor: isChecked ? 'pointer' : 'auto'}") {{languages.quantization_button_sure}}
</template>4
<script>
import IconFont from '../Common/IconFontCommon'
import languages from '../../mixins/quantizationLanguage'
import RotationStrategy from '../Quantization/RotationStrategy'
import { getStrategyList, getMyStrategyList, getBuyDialogList, buyStrategy } from '../../utils/api/quantizationCenter'
import { getPushTotalByCoinId } from '../../utils/api/personal'
import { mapState, mapMutations, mapActions } from 'vuex'
import { routesVariable } from '../../router/routesVariable'
export default {
  // !!! 注意 !!! 如需要相关声明周期或方法，请放开注释(默认处于注释状态)
  // name 为必填项
  name: 'quantization-center',
  mixins: [languages],
  components: {
    IconFont,
    RotationStrategy
  },
  // props,
  data () {
    const status = !sessionStorage.getItem('REMEMBER_STATUS')
    const isRememberStatus = status || !sessionStorage.getItem('REMEMBER_STATUS')
    return {
      dialogRiskPrompt: true,
      isChecked: false,
      isRememberStatus: isRememberStatus,
      activeName: '',
      change: false,
      // 默认图标
      icons: 'icon-list',
      iconsVisible: true,
      // 当前页数
      currentNum: 1,
      pageSize: 10,
      userId: '',
      strategyList: [{
        strategyName: '--',
        oneMonthPrice: '--',
        coin: '--'
      }],
      myStrategyList: [],
      dialogBuyVisible: false,
      form: {
      },
      // 弹出窗数据
      dialogData: {
      },
      balance: '',
      monthPrice: [],
      searchData: {}
    }
  },
  async created () {
    // 判断tab标签
    if (this.$route.params.tab) {
      this.activeName = 'second'
      this.iconsVisible = false
    } else {
      this.activeName = 'first'
    }
    await this.strategyConfigList()
    await this.getMyStrategyList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_PAY_PASSWORD_DIALOG_M',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'UPDATE_PAY_PASSWORD_M',
      'SET_FORM_STRATEGY_DATA',
      'UPDATE_MY_STRATERGY_DATA'
    ]),
    ...mapActions([
      'MY_STRATEGY_ACTION',
      'SEARCH_STRATEGY_ACTION'
    ]),
    handleConfirmPrompt () {
      if (this.isChecked) {
        this.isRememberStatus = false
        sessionStorage.setItem('REMEMBER_STATUS', 'false')
      }
    },
    handleClick (tab, event) {
      // console.log(tab, event)
      if (+tab.index) {
        this.iconsVisible = false
        this.getMyStrategyList()
      } else {
        this.iconsVisible = true
      }
    },
    handleChangeLayout () {
      if (!this.change) {
        this.change = true
        this.icons = 'icon-cascades'
      } else {
        this.change = false
        this.icons = 'icon-list'
      }
    },
    handleDialog (e) {
      if (!this.dialogBuyVisible) this.dialogBuyVisible = !this.dialogBuyVisible
      this.form = JSON.parse(e.target.dataset.formdata)
      this.getBuyDialogList()
    },
    // 跳转个人中心充币方法
    async jumpToPersonalCenter (target, tradType, type) {
      const buyCoinId = +this.form.coinId
      if (tradType === 'buy') {
        this.$router.replace({
          path: '/PersonalCenter',
          name: 'PersonalCenter',
          params: {
            coinId: buyCoinId,
            type: type
          }
        })
      } else {
        this.$router.replace({
          path: '/PersonalCenter',
          name: 'PersonalCenter'
        })
      }
      this.CHANGE_USER_CENTER_ACTIVE_NAME(target)
    },
    // 量化列表
    async strategyConfigList () {
      let data = await getStrategyList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentNum // 当前页码
      })
      if (!data) return false
      this.strategyList = _.get(data, 'data.list')
    },
    // 策略列表分页
    async getMyStrategyList () {
      const data = await getMyStrategyList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.pageNumber, // 当前页码
        userId: this.userInfo.userId
      })
      if (!data) return false
      this.myStrategyList = _.get(data.data, 'list')
      // console.log(this.myStrategyList)
    },
    // 获取可用余额
    async getBalance () {
      const data = await getPushTotalByCoinId({
        coinId: this.dialogData.coinId
      })
      if (!data) return false
      this.balance = _.get(data, 'data.total')
    },
    // 立即购买
    async getBuyDialogList () {
      let data = await getBuyDialogList({
        strategyId: this.form.strategyId
      })
      if (!data) return false
      this.dialogData = _.get(data, 'data')
      // 设置默认时长
      this.monthPrice = [this.dialogData.threeMonthPrice, (this.dialogData.oneMonthPrice * 3).toFixed(5), {validMonth: 3}]
      this.getBalance() // 获取余额
    },
    // 提交购买
    async handleSubmit () {
      this.dialogBuyVisible = !this.dialogBuyVisible
      this.UPDATE_PAY_PASSWORD_DIALOG_M(true)
    },
    async buySubmit () {
      let data = await buyStrategy({
        strategyId: this.form.strategyId,
        validMonth: this.monthPrice[2].validMonth,
        coinId: this.dialogData.coinId,
        coinNum: this.monthPrice[0],
        payPassword: this.$globalPayPassword_S_X
      })
      if (!data) return false
      this.UPDATE_PAY_PASSWORD_DIALOG_M(false)
      await this.getMyStrategyList()
    },
    async searchStrategy (formData) {
      // 查看策略
      await this.SEARCH_STRATEGY_ACTION(formData)
      /* let data = await searchStrategy({
        strategyUserId: formData.id
      })
      if (!data) return false */
      // this.searchData = _.get(data, 'data')
      // let searchData = this.searchData

      // 跳转策略配置
      this.$router.replace({
        name: routesVariable.strategy
      })
    },
    handleRotationStrategy (formData) {
      // 查看策略更新当前策略数据缓存
      this.UPDATE_MY_STRATERGY_DATA(formData)
      this.searchStrategy(formData)
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      userInfo: state => state.user.loginStep1Info,
      globalPayPassword_S: state => state.common.globalPayPassword_S,
      footerHeight: state => state.common.footerHeight
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../assets/CSS/index.styl'
    .d-flex
      display flex
    .active-text
      color #008069
    .btn-disabled
      cursor not-allowed !important
    price()
      font-weight bold
      color #e8554f
      font-size 18px
    buttonBuy()
      width 144px
      height 44px
      border-radius 4px
      font-size 14px
      cursor pointer
    .container
      >.inner-box
        >.banner-box
          background #110c38
          >.banner
            background url('../../assets/quantization/banner.png') center no-repeat
            height 229px
          >.bannerEN
            background url('../../assets/quantization/bannerEN.png') center no-repeat
            height 229px
        >.content
          margin-top 30px
          margin-bottom 200px
          >.content-box
            width 1300px
            margin 0 auto
            >.navs
              position relative
              font-size 16px
              >.icon-change
                color #9da5b3
                cursor pointer
                line-height 60px
              .pane-content
                width 620px
                margin-bottom 41px
                >.pane-header
                  padding 0 23px
                  display flex
                  height 90px
                  background-size cover
                  >.header-left
                    flex 1
                    height 100%
                    line-height 90px
                    font-size 18px
                    font-weight bold
                  >.header-right
                    text-align right
                    padding 24px 0
                    height 100%
                    .price
                      price()
                    .price-info
                      padding-top 11px
                      color #fff
                      font-size 12px
                >.pane-container
                   display flex
                   padding 55px 35px
                   overflow hidden
                   .pane-ul-l
                     width 266px
                     float left
                     padding-right 20px
                     color #617499
                     li
                      font-size 14px
                      line-height 40px
                      list-style-position outside
                      list-style-image url('../../assets/quantization/dot.png')
                   .pane-ul-r
                      float right
                      color #617499
                      li
                        font-size 14px
                        line-height 40px
                        list-style-position outside
                        list-style-image url('../../assets/quantization/dot.png')
                >.pane-footer
                    padding 0 20px
                    height 90px
                    line-height 90px
                    text-align right
                    .buy
                      buttonBuy()
              .pane-content-row
                display flex
                margin-bottom 27px
                .pane-bg
                  flex 0 1 275px
                  height 190px
                  text-align center
                  line-height 190px
                  font-size 18px
                  font-weight bold
                  color #fff
                .pane-list
                  box-sizing border-box
                  display flex
                  flex 1
                  justify-content space-between
                  padding 30px 30px 0 71px
                  height 190 px
                  ul
                    padding-right 26px
                    li
                      font-size 14px
                      line-height 36px
                      list-style-position outside
                      list-style-image url('../../assets/quantization/dot.png')
                  >.pane-r
                    text-align right
                    .price
                      price()
                    .price-info
                      height 60px
                      font-size 12px
                    .buy
                      buttonBuy()
                      color #338ff5
                      border 1px solid #338ff5
                      &:hover
                          box-shadow 0 0 1px 1px #338ff5
              .my-strategy
                padding 0 28px
                min-height 457px
                .check
                  color S_main_color
                  cursor pointer
            /deep/
              .el-tab-pane
                flex-flow wrap
                justify-content space-between
              .el-tabs__header
                height 60px
                line-height 60px
              .el-tabs__nav-wrap::after
                width 0
              .el-tabs__item
                width 166px
                text-align center
                padding-left 10px
                color #9a9eb0
                font-size 16px
              .el-tabs__item.is-active
                font-weight bold
                color #338ff5
              .el-tabs__active-bar
                width 140px !important
              .icon-change
                position absolute
                top 0
                right 22px
              .el-tabs__content
                margin-top 42px
              .el-table
                background transparent
                td
                  font-size 12px
                  border none
                .el-table__empty-block
                  height 278px
    /deep/
      // 弹窗样式
      .el-dialog__wrapper.dialog-buy
        background-color rgba(0, 0, 0, .5)
        .el-dialog
          margin-top 25vh !important
          width 424px
          min-height 240px
          border-radius 4px
          overflow hidden
          background-color transparent
          .el-dialog__header
            padding-top 10px
            .el-dialog__title
              font-size 14px
            .el-dialog__headerbtn
              top 14px
          .el-dialog__body
            background-color #28334a
            padding-top 40px
            .el-form
              .el-form-item
                .el-form-item__label
                  text-align center
                .el-form-item__content
                  display flex
                  .el-input
                    input
                      border none
              .duration-box
                margin -10px 0 10px
                input
                  display none
                  &:checked+label
                    color #338ff5 !important
                    border-color #338ff5 !important
                input:unchecked+label
                    color #fff !important
                    border-color #354057 !important
                .el-badge
                  .duration-item
                    display block
                  sup
                    right 36px
                    border none
                    background red
                .duration-item
                  width 75px
                  height 40px
                  line-height 40px
                  text-align center
                  border-radius 5px
                  margin-right 9px
                  &:hover
                    cursor pointer
              .pay
                margin-bottom 0
              .cut-price
                font-size 18px
                font-weight bold
                color #e8554f
                .origin-price
                  padding-left 14px
                  font-size 12px !important
              .remains
                margin-top 42px
                a
                  color #338ff5
                  padding-left 20px
          .el-input__inner
            font-size 12px
            border-color #485776
          .el-dialog__footer
            padding 40px 48px
            button
              width 100%
              height 34px
              border none
      // 协议弹窗
      .el-dialog__wrapper.dialog-risk
        background-color rgba(0, 0, 0, .5)
        .el-dialog
          width 903px
          .el-dialog__header
            text-align center
          .el-dialog__body
            .prompt-risk
              p
                font-size 12px
                line-height 24px
            .check-box
              text-align center
              margin-top 21px
          .el-dialog__footer
            padding 0 48px 20px
            text-align center
            button
              width 100px
              height 30px
              line-height 8px
              border none
    &.night
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                .pane-header
                  background url("../../assets/quantization/pane-header.png") center no-repeat
                  .header-left
                    color #338ff5
                .pane-container
                  background #1c1f32
                .pane-footer
                  background url("../../assets/quantization/pane-footer.png") center no-repeat
              .pane-content-row
                width 100%
                background #1c1f32
                .pane-bg
                  background url("../../assets/quantization/pane-list-bg.png") center no-repeat
                .pane-list
                  ul
                    li
                      color #9da5b3
                .pane-r
                  .price-info
                    color #fff
            .my-strategy
                background #1c1f32
      /deep/
        .el-input__inner
          background #1a2233
          color #fff
        .el-tabs__header
          background #1c1f32
        .el-table
          th
            color #a9bed4
        .pane-footer
          .buy
            color #338ff5
            border 1px solid #338ff5
            &:hover
              box-shadow 0 0 1px 1px #338ff5
        .el-dialog__footer
          background #28334a
          button
            background linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%)
        .el-dialog__wrapper.dialog-buy
          .el-dialog
            background #28334a
            .el-dialog__header
              background-color #20293c
              .el-dialog__title
                color #cfd5df
            .el-dialog__body
              background-color #28334a
              padding 40px 48px 0 48px
              .el-form
                .el-form-item
                  .el-form-item__label
                    color #cfd5df
                    text-align center
                  .el-form-item__content
                    display flex
                    .el-input
                      input
                        border none
                .duration-box
                  margin-top -10px
                  .duration-item
                    background #20273d
                    border 1px solid #354057
                    color #fff
                .cut-price
                  .origin-price
                    color #cfd5df !important
                .remains
                  span
                    color #cfd5df
        .el-dialog__wrapper.dialog-risk
          .el-dialog
            background #28334a
            .el-dialog__header
              background-color #20293c
              .el-dialog__title
                font-weight bold
                color #cfd5df
            .el-dialog__body
              padding 10px 28px 0 28px
              max-height 652px
              overflow-y scroll
              header
                color #9da5b3
                font-weight bold
              p
                text-indent 24px
                color #9da5b3
              .el-checkbox__input
                .el-checkbox__inner
                  background transparent
              .el-checkbox__inner::after
                border-color S_main_color
              .el-checkbox__label
                color #9da5b3
              .is-focus
                .el-checkbox__inner
                  border-color #dcdfe6
              .is-checked
                .el-checkbox__inner
                  border-color S_main_color
              .is-checked+.el-checkbox__label
                color S_main_color
            .el-dialog__footer
              margin-top 15px
              padding 15px 20px
              border-top 1px solid S_color8
              button
                background linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%)
        .el-table
          th.is-leaf
            padding 32px 0 23px 0
            color S_night_main_text_color
            background #1c1f32
            border-bottom solid 1px #2d3651
          .is-leaf:nth-of-type(2)
             text-align center
          .is-leaf:nth-of-type(3)
            text-align center
          .is-leaf:nth-of-type(4)
              text-align center
          .is-leaf:nth-of-type(5)
            text-align right
          tr
            background #1c1f32
            td
              color #9da5b3
              &:nth-of-type(2)
                text-align center
              &:nth-of-type(3)
                text-align center
              &:nth-of-type(4)
                text-align center
              &:nth-of-type(5)
                text-align right
            &:hover
              >td
                background #1c1f32
          .el-table__empty-block
              background S_night_main_bg
    &.day
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                .pane-header
                  background url("../../assets/quantization/pane-header-day.png") center no-repeat
                  .header-left
                    color #fff
                .pane-container
                  background #fff
                .pane-footer
                  background url("../../assets/quantization/pane-footer-day.png") center no-repeat
              .pane-content-row
                width 100%
                background #fff
                .pane-bg
                  background url("../../assets/quantization/pane-list-bg-day.png") center no-repeat
                .pane-list
                  ul
                    li
                      color #9da5b3
                .pane-r
                  .price-info
                    color #fff
            .my-strategy
              background S_day_bg
      /deep/
        .el-input__inner
          background-color #e9edf3
          color S_day_main_text_color
        .el-tabs__header
          background #fff
        .el-table
          th
            color #7d90ac
        .pane-footer
          .buy
            color #fff
            border 1px solid #fff
            &:hover
              box-shadow 0 0 1px 1px #fff
        .el-dialog__wrapper.dialog-buy
          .el-dialog
            background S_day_bg
            .el-dialog__header
              background-color S_color3
            .el-dialog__body
              background S_day_bg
              padding 40px 48px 0 48px
              .el-form
                .el-form-item
                  .el-form-item__label
                    text-align center
                  .el-form-item__content
                    display flex
                    .el-input
                      input
                        border none
                .duration-box
                  margin-top -10px
                  .duration-item
                    background #e9edf3
                    border 1px solid #e9edf3
                .cut-price
                  .origin-price
                    color #333
                .remains
                  span
                    color #333 !important
            .el-dialog__footer
              button
                background linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%)
        .el-dialog__wrapper.dialog-risk
          .el-dialog
            background S_day_bg
            .el-dialog__header
              background-color S_color3
              .el-dialog__title
                color S_day_main_text_color
                font-weight bold
            .el-dialog__body
              padding 10px 28px 0 28px
              header
                color #333
                font-weight bold
              p
                text-indent 24px
                color #333
              .el-checkbox__input
                .el-checkbox__inner
                  background transparent
              .el-checkbox__inner::after
                border-color S_main_color
              .is-focus
                .el-checkbox__inner
                  border-color #dcdfe6
              .is-checked
                .el-checkbox__inner
                  border-color S_main_color
              .el-checkbox__label
                color #9da5b3
              .is-checked+.el-checkbox__label
                color S_main_color
            .el-dialog__footer
              margin-top 15px
              padding 15px 20px
              border-top 1px solid #e2e3e8
              button
                background linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%)
        .el-table
          th.is-leaf
            padding 32px 0 23px 0
            font-size 12px
            &:nth-of-type(1)
              text-align left
          .is-leaf:nth-of-type(2)
            text-align center
          .is-leaf:nth-of-type(3)
            text-align center
          .is-leaf:nth-of-type(4)
            text-align center
          .is-leaf:nth-of-type(5)
            text-align right
          tr
            td
              &:nth-of-type(2)
                text-align center
              &:nth-of-type(3)
                text-align center
              &:nth-of-type(4)
                text-align center
              &:nth-of-type(5)
                text-align right
            &:hover
              >td
                background S_day_bg
          .el-table__empty-block
            background S_day_bg
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
