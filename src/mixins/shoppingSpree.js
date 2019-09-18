/**
 * author: zxl
 * create: 20190909
 * description: 当前 js 为 闪兑专区相关 mixins
 */
// import {
//   mapGetters,
//   mapState
//   // mapActions
// } from 'vuex'

let mixin = {
  // data () {return {}},
  // methods: {
  // ...mapActions([])
  // },
  computed: {
    // ...mapGetters({}),
    // ...mapState({}),
    labelOBJ () {
      return {
        shopping_spree_accept_the_currency: this.$isChineseLanguage_G_X ? '接受币种' : 'Acceptance currency',
        shopping_spree_confess_to_raise_prices: this.$isChineseLanguage_G_X ? '抢购价格' : 'Purchase price',
        shopping_spree_total_amount: this.$isChineseLanguage_G_X ? '目标总额' : 'Total target',
        priceLimit: this.$isChineseLanguage_G_X ? '限额' : 'Quota',
        downLimit: this.$isChineseLanguage_G_X ? '起购量' : 'Purchase quantity',
        shopping_spree_process: this.$isChineseLanguage_G_X ? '进度' : 'schedule',
        shopping_spree_process1: this.$isChineseLanguage_G_X ? '抢购进度' : 'Purchase progress',
        descs: this.$isChineseLanguage_G_X ? [
          '项目打折',
          '超值兑换',
          '多重福利'
        ] : ['Project discount', 'Cost-effective exchange', 'Multiple benefits'],
        shopping_spree_slogan: this.$isChineseLanguage_G_X ? '闪兑专区' : 'Quick Exchange Zone',
        shopping_spree_record: this.$isChineseLanguage_G_X ? '抢购记录' : 'Buy record',
        shopping_spree_have_to_snap_up: this.$isChineseLanguage_G_X ? '已抢购' : 'bought',
        shopping_spree_price: this.$isChineseLanguage_G_X ? '抢购价格' : 'Buy price',
        startTime: this.$isChineseLanguage_G_X ? '开始时间' : 'Start time',
        endTime: this.$isChineseLanguage_G_X ? '结束时间' : 'End time',
        buyCount: this.$isChineseLanguage_G_X ? '抢购数量' : 'Purchase quantity',
        noData: this.$isChineseLanguage_G_X ? '暂无活动' : 'No activity',
        placeholder1: this.$isChineseLanguage_G_X ? '请输入抢购数量！' : 'Please enter the quantity purchased!',
        placeholder2: this.$isChineseLanguage_G_X ? '高于单人最高限额！' : 'Higher than the single maximum limit!',
        placeholder3: this.$isChineseLanguage_G_X ? '低于最少起购量！' : 'Less than the minimum purchase amount!',
        usable: this.$isChineseLanguage_G_X ? '可用' : 'Available',
        project_participation_conditions: this.$isChineseLanguage_G_X ? '项目参与条件' : 'Project participation conditions',
        rule1: this.$isChineseLanguage_G_X ? '账户持仓大于' : 'Account position is greater than',
        rule2: this.$isChineseLanguage_G_X ? '账户必须通过' : 'Account must pass',
        rule21: this.$isChineseLanguage_G_X ? '实名认证' : 'Real name authentication',
        rule22: this.$isChineseLanguage_G_X ? '高级认证' : 'Advanced certification',
        activityDesc: this.$isChineseLanguage_G_X ? '活动简介' : 'About the event',
        activityPlan: this.$isChineseLanguage_G_X ? '活动计划' : 'Event plan',
        FAQ: this.$isChineseLanguage_G_X ? '常见问题' : 'common problem',
        coming: this.$isChineseLanguage_G_X ? '即将开始' : 'Coming soon',
        ongoing: this.$isChineseLanguage_G_X ? '进行中' : 'processing',
        ended: this.$isChineseLanguage_G_X ? '已结束' : 'Over',
        notEndedText: this.$isChineseLanguage_G_X ? '立即抢购' : 'Purchase Now',
        countDownLabel: this.$isChineseLanguage_G_X ? '距离抢购开始还有' : 'There are still   from the start of the purchase',
        lackOfAvailable: this.$isChineseLanguage_G_X ? '可用不足' : 'Insufficient to use',
        purchaseSuccess: this.$isChineseLanguage_G_X ? '抢购成功' : 'Purchase Success',
        purchaseFailed: this.$isChineseLanguage_G_X ? '抢购失败' : 'Purchase Failed',
        goBack: this.$isChineseLanguage_G_X ? '返回' : 'Back',
        recordLabel: {
          orderId: this.$isChineseLanguage_G_X ? '单号' : 'Order number',
          projectName: this.$isChineseLanguage_G_X ? '活动名称' : 'Event name',
          coinName: this.$isChineseLanguage_G_X ? '活动币种' : 'Event currency',
          price: this.$isChineseLanguage_G_X ? '价格' : 'Price',
          count: this.$isChineseLanguage_G_X ? '数量' : 'Quantity',
          amount: this.$isChineseLanguage_G_X ? '金额' : 'Amount',
          purchaseTime: this.$isChineseLanguage_G_X ? '抢购时间' : 'Purchase time',
          accountingTime: this.$isChineseLanguage_G_X ? '到账时间' : 'accounting time',
          notAccount: this.$isChineseLanguage_G_X ? '暂未到账' : 'Not yet received'
        }
      }
    }
  }
  // destroyed() {
  // },
  // watch: {}
}
export default mixin
