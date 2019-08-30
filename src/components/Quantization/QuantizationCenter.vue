<!--
  author: wt
  created: 20190827
  description: 当前组件为量化中心
-->
<template lang="pug">
    .container.text-center(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
      .inner-box
        .banner-box
          .banner
        .content.text-center
          .content-box
            .navs
              el-tabs(v-model="activeName" @tab-click="handleClick" v-if="!change")
                el-tab-pane(label="量化市场" name="first" :class="{'d-flex': !change}")
                  .pane-content(v-for="list in strategyList" v-if="strategyList.length")
                    .pane-header
                      .header-left {{list.strategyName}}
                      ul.header-right
                        li.price {{list.oneMonthPrice + list.coin + '/月'}}
                        li.price-info 包含策略使用费,平台使用费,托管者费用
                    .pane-container
                      ul.pane-ul-l
                        li 主流币种随意选择
                        li 自定义所选币种权重
                        li 实时计算币种折合比特币均值
                      ul.pane-ul-r
                        li 全自动持仓减仓
                        li 自定义精度, 交易粒度, 交易频率
                        li 锁定利润, 平衡资金
                    .pane-footer
                      button.buy(@click="handleDialog" :data-formData="JSON.stringify(list)") 立即购买
                  .pane-content(v-else)
                    .pane-container(style="width:100%") 暂无策略
                // 我的策略
                el-tab-pane(label="我的策略" name="second")
                  div.my-strategy
                    el-table(:data="myStrategyList"
                      :empty-text="$t('M.comm_no_data')"
                      style="width: 100%")
                      el-table-column(:label="'名称'")
                        template(slot-scope = "s")
                          div {{s.row.strategyName}}
                      el-table-column(:label="'到期时间'")
                        template(slot-scope = "s")
                          div {{s.row.endTime}}
                      el-table-column(:label="'剩余'")
                        template(slot-scope = "s")
                          div {{s.row.remainDay + '天'}}
                      el-table-column(:label="'状态'")
                        template(slot-scope = "s")
                          div(:class="{'active-text': !s.row.isValid}") {{s.row.isValid ? '已过期' : '使用中'}}
                      el-table-column(:label="'操作'")
                        template(slot-scope = "s")
                          div
                            button.check 查看
                            button.check 续费
              // 点击切换样式
              el-tabs(v-model="activeName" @tab-click="handleClick" v-else)
                el-tab-pane(label="量化市场" name="first")
                  .pane-content-row(v-for="list in strategyList")
                    .pane-bg {{list.strategyName}}
                    .pane-list
                      ul
                        li 主流币种随意选择
                        li 自定义所选币种权重
                        li 实时计算币种折合比特币均值
                      ul
                        li 全自动持仓减仓
                        li 自定义精度, 交易粒度, 交易频率
                        li 锁定利润, 平衡资金
                      .pane-r
                        .price {{list.oneMonthPrice + list.coin + '/月'}}
                        .price-info 包含策略使用费,平台使用费,托管者费用
                        button.buy 立即购买
                el-tab-pane(label="我的策略" name="second")
              span.icon-change(@click = "handleChangeLayout")
                  IconFont(:iconName= "icons" v-show="iconsVisible")
      el-dialog(:title="'开通'" :visible.sync="dialogBuyVisible" class="dialog-buy")
        el-form(:model="form")
          el-form-item(label='策略')
            el-input(v-model="form.strategyName" disabled)
          el-form-item(label='时长')
          .duration-box.display-flex
            input#btn1(type="radio" name="duration" :value="[dialogData.oneMonthPrice, dialogData.oneMonthPrice,  {validMonth: 1}]" v-model="monthPrice")
            label.duration-item(for="btn1") 1个月
            el-badge(value="推荐" class="item")
              input#btn2(type="radio" checked="checked" :value="[dialogData.threeMonthPrice, (dialogData.oneMonthPrice * 3).toFixed(5), {validMonth: 3}]" v-model="monthPrice" name="duration")
              label.duration-item(for="btn2") 3个月
            input#btn3(type="radio" name="duration"  :value="[dialogData.sixMonthPrice, (dialogData.oneMonthPrice * 6).toFixed(5),  {validMonth: 6}]" v-model="monthPrice")
            label.duration-item(for="btn3") 6个月
            input#btn4(type="radio" name="duration" :value="[dialogData.twelveMonthPrice, (dialogData.oneMonthPrice * 12).toFixed(5),  {validMonth: 12}]" v-model="monthPrice")
            label.duration-item(for="btn4") 12个月
          el-form-item.pay(label='支付')
          .cut-price {{monthPrice[0] + ' ' + dialogData.coin}}
            s.origin-price 原价{{monthPrice[1] + ' ' + dialogData.coin}}
          .remains
            span 可用：{{balance}}
            a(href="javascript:void(0)" @click.stop="jumpToPersonalCenter('assets', 'buy', 'recharge')") 立即充值
        div(slot="footer" class="dialog-footer")
          el-button(type="primary" @click="handleSubmit") 确认
      PayPassDialog(@next="buySubmit")
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {getStrategyList, getMyStrategyList, getBuyDialogList, buyStrategy} from '../../utils/api/quantizationCenter'
import {getPushTotalByCoinId} from '../../utils/api/personal'
import {mapState, mapMutations} from 'vuex'
export default {
  // !!! 注意 !!! 如需要相关声明周期或方法，请放开注释(默认处于注释状态)
  // name 为必填项
  name: 'quantization-center',
  // mixins: [],
  components: {
    IconFont
  },
  // props,
  data () {
    return {
      activeName: 'first',
      change: false,
      // 默认图标
      icons: 'icon-list',
      iconsVisible: true,
      // 当前页数
      currentNum: 1,
      pageSize: 10,
      userId: '',
      strategyList: [],
      myStrategyList: [],
      dialogBuyVisible: false,
      form: {
      },
      // 弹出窗数据
      dialogData: {
      },
      balance: '',
      monthPrice: []
    }
  },
  async created () {
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
      'UPDATE_PAY_PASSWORD_M'
    ]),
    handleClick (tab, event) {
      console.log(tab, event)
      if (tab.index) {
        this.iconsVisible = !this.iconsVisible
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
    // 跳转个人中心方法
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
      this.strategyList = _.get(data.data, 'list')
    },
    // 策略列表分页
    async getMyStrategyList () {
      let data = await getMyStrategyList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentNum, // 当前页码
        userId: this.userInfo.userId
      })
      if (!data) return false
      this.myStrategyList = _.get(data.data, 'list')
      console.log(this.myStrategyList)
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
    handleSubmit () {
      this.dialogBuyVisible = !this.dialogBuyVisible
      // 支付密码弹窗
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
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      userInfo: state => state.user.loginStep1Info,
      globalPayPassword_S: state => state.common.globalPayPassword_S
    })
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
        >.content
          margin-bottom 200px
          >.content-box
            width 1300px
            margin 0 auto
            >.navs
              position relative
              font-size 16px
              >.icon-change
                cursor pointer
                line-height 60px
              .pane-content
                width 620px
                margin-bottom 41px
                >.pane-header
                  padding 0 23px
                  display flex
                  height 90px
                  background url("../../assets/quantization/pane-header.png") center no-repeat
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
                   padding 55px 35px
                   overflow hidden
                   .pane-ul-l
                     float left
                     color #9da5b3
                     li
                      font-size 14px
                      line-height 48px
                      list-style-position inside
                      list-style-image url('../../assets/quantization/dot.png')
                   .pane-ul-r
                      float right
                      color #9da5b3
                      li
                        font-size 14px
                        line-height 48px
                        list-style-position inside
                        list-style-image url('../../assets/quantization/dot.png')
                >.pane-footer
                    padding 0 20px
                    height 90px
                    line-height 90px
                    text-align right
                    background url("../../assets/quantization/pane-footer.png") center no-repeat
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
                  background url("../../assets/quantization/pane-list-bg.png") center no-repeat
                .pane-list
                  box-sizing border-box
                  display flex
                  flex 1
                  justify-content space-between
                  padding 30px 30px 0 71px
                  height 190 px
                  ul
                    li
                      font-size 14px
                      line-height 48px
                      list-style-position inside
                      list-style-image url('../../assets/quantization/dot.png')
                  >.pane-r
                    text-align right
                    .price
                      price()
                    .price-info
                      line-height 40px
                      font-size 12px
                    .buy
                      buttonBuy()
                      margin-top 26px
                      color #338ff5
                      border 1px solid #338ff5
                      &:hover
                          box-shadow 0 0 1px 1px #338ff5
              .my-strategy
                padding 0 28px
                min-height 457px
                .check
                  color #338ff5
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
                font-weight bold
                color #9a9eb0
                font-size 16px
              .el-tabs__item.is-active
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
                font-size 12px
                th
                  color #a9beD4
                td
                  border none
    /deep/
      // 弹窗样式
      .el-dialog__wrapper
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
                  color #cfd5df
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
                span
                  color #cfd5df
                a
                  color #338ff5
                  padding-left 20px
          .el-input__inner
            font-size 12px
            background-color #1a2233
            border-color #485776
            color #fff
          .el-dialog__footer
            padding 40px 48px
            button
              width 100%
              height 34px
              border none
    &.night
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                .header-left
                  color #338ff5
                .pane-container
                  background #1c1f32
              .pane-content-row
                width 100%
                background #1c1f32
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
        .el-tabs__header
          background #1c1f32
        .pane-footer
          .buy
            color #338ff5
            border 1px solid #338ff5
            &:hover
              box-shadow 0 0 1px 1px #338ff5
        .el-dialog__wrapper
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
                .origin-price
                  color #cfd5df !important
            .el-dialog__footer
              background #28334a
              button
                background linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%)
        .el-table
          th.is-leaf
            padding 32px 0 23px 0
            color #9da5b3
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
    &.day
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                .header-left
                  color #fff
                .pane-container
                  background #fff
              .pane-content-row
                width 100%
                background #fff
                .pane-list
                  ul
                    li
                      color #9da5b3
                .pane-r
                  .price-info
                    color #fff
            /deep/
              .el-tabs__header
                background #fff
              .pane-footer
                .buy
                  color #fff
                  border 1px solid #fff;
                  &:hover
                    box-shadow 0 0 1px 1px #fff
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
