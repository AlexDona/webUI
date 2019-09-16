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
                            button.check(@click="handleRotationStrategy(s.row)") 查看
                            button.check(@click="handleDialog" :data-formData="JSON.stringify(s.row)") 续费
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
                        button.buy(@click="handleDialog" :data-formData="JSON.stringify(list)") 立即购买
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
                            button.check(@click="handleRotationStrategy(s.row)") 查看
                            button.check(@click="handleDialog" :data-formData="JSON.stringify(s.row)") 续费
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
      // 协议
      el-dialog.dialog-risk(:title="'量化市场风险提示'"
        :visible.sync="isRememberStatus"
        :close-on-click-modal="false"
        :show-close="false")
        .prompt-risk
          p 1.量化市场就各项服务、安全、无误、及不中断不负担任何明示或默示的保证责任。您同意承担使用本网站该项服务的所有风险及因该风险可能造成的任何损害。
          p 2.任何在本网站出现的信息包括但不限于评论、预测、图表、指标、理论、直接的或暗示的指示均只作为参考，您须对任何自主决定的行为负责。
          p 3.量化提供或展示的有关策略，只保证其历史信号及历史产生的收益真实有效，但未来收益情况，不能按照历史简单统计，所有直接或间接使用策略用于真实交易的用户需要谨慎选择，合理运用。量化市场不承担任何因策略产生的资金损失及相关责任，凡使用策略的用户，量化市场依据相关法律法规及平台服务协议，默认用户已同意此条款。
          p 4.量化市场对于您所使用的各项服务、或无法使用各项服务所导致的任何直接、间接、衍生或特别损害，不负任何赔偿责任。
          p 5.量化市场不对因本网站资料全部或部分内容产生的或因依赖该资料而引致的任何损失承担任何责任。
          p 6.您了解并同意，本网站可能因平台、其他合作方或相关电信部门的互联网软硬件设备故障或失灵、或人为操作疏忽而全部或部分中断、延迟、遗漏、误导或造成资料传输或储存上的错误、或遭第三人侵入系统篡改或伪造变造资料等，本网站不承担任何责任。
          p 7.凡通过本网站与其他网站的链接，而获得其所提供的网上资料及内容，您应该自己进行辨别及判断，并应当由该等网站对其提供内容承担相应责任，本网站对此不承担任何责任。本网站提供超级链接至其它网站，并不视为同意、推荐、认可、保证或推介任何第三方或在其网站所提供的服务、产品，亦不可视为与该等第三方及网站有任何形式的合作。
          p 8.量化市场所载商标、徽号和服务标志及其他任何数据的所有版权、专利权、知识产权及其它产权均属本网站或其关联公司所有。未经本网站事前以书面同意，不得将此等材料的任何部分修改、翻版、储存于检索系统、传送、复制、分发或以任何其它方式作商业或公共用途。
          p 9.量化市场所提供的信息、软件、产品、模型、策略、搜索结果、接往第三方网站的超级链接及第三方所提供的商品、服务、权利等一切内容，其完整性、正确性、适时性、妥当性、及时性、信赖性、和目的性、有用性、商品性、知识产权的不受侵害性及第三方债务的履行及有无瑕疵等方面，不做任何保证，不负任何相关担保责任。
          p 10.量化市场所有策略均属知识产权类产品，一经售出，概不退换。任何因策略产生的纠纷，请及时咨询官方客服协商解决。
          p 11.本网站保留随时变更、中断或终止部分或全部量化市场服务的权利。网站有权随时修改量化市场包含但不限于产品、策略、支付条件及政策等，并通过本网站展示，而无需另行单独通知用户。
          p 12. 本风险揭示书的揭示事项仅为列举性质，未能详尽列明用户购买及使用量化服务所面临的全部风险和可能导致损失的所有因素。用户在购买及使用量化服务前，应认真阅读并理解相关业务规则、服务协议及本风险揭示书的全部内容。接受量化服务的用户，自行承担投资及操作风险，平台不以任何方式向用户作出不受损失或者取得最低收益的承诺。
        .check-box
          // 同意协议
          el-checkbox(v-model="isChecked") 我已阅读并知晓风险
        div(slot="footer" class="dialog-footer")
          el-button(type="primary" @click="handleConfirmPrompt") 确认
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import RotationStrategy from '../Quantization/RotationStrategy'
import {getStrategyList, getMyStrategyList, getBuyDialogList, buyStrategy} from '../../utils/api/quantizationCenter'
import {getPushTotalByCoinId} from '../../utils/api/personal'
import {mapState, mapMutations, mapActions} from 'vuex'
import {routesVariable} from '../../router/routesVariable'
export default {
  // !!! 注意 !!! 如需要相关声明周期或方法，请放开注释(默认处于注释状态)
  // name 为必填项
  name: 'quantization-center',
  // mixins: [],
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
      console.log(tab, event)
      if (tab.index) {
        this.iconsVisible = !this.iconsVisible
        this.getMyStrategyList()
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
      this.strategyList = _.get(data.data, 'list')
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
                .origin-price
                  color #cfd5df !important
        .el-dialog__wrapper.dialog-risk
          .el-dialog
            background #28334a
            .el-dialog__header
              background-color #20293c
              .el-dialog__title
                color #cfd5df
            .el-dialog__body
              p
                color #9da5b3
              .el-checkbox__input
                .el-checkbox__inner
                  background transparent
              .el-checkbox__label
                color #9da5b3
              .is-checked+.el-checkbox__label
                color S_main_color
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
          .el-table__empty-block
              background S_night_main_bg
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
                  border 1px solid #fff
                  &:hover
                    box-shadow 0 0 1px 1px #fff
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
