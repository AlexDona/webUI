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
        shopping_spree_accept_the_currency: this.$isChineseLanguage_G_X ? '接受币种' : '',
        shopping_spree_confess_to_raise_prices: this.$isChineseLanguage_G_X ? '抢购价格' : '',
        shopping_spree_total_amount: this.$isChineseLanguage_G_X ? '目标总额' : '',
        priceLimit: this.$isChineseLanguage_G_X ? '限额' : '',
        downLimit: this.$isChineseLanguage_G_X ? '起购量' : '',
        shopping_spree_process: this.$isChineseLanguage_G_X ? '进度' : '',
        shopping_spree_process1: this.$isChineseLanguage_G_X ? '抢购进度' : '',
        descs: this.$isChineseLanguage_G_X ? [
          '项目打折',
          '超值兑换',
          '多重福利'
        ] : ['', '', ''],
        shopping_spree_slogan: this.$isChineseLanguage_G_X ? '闪兑专区' : '',
        shopping_spree_record: this.$isChineseLanguage_G_X ? '抢购记录' : '',
        shopping_spree_have_to_snap_up: this.$isChineseLanguage_G_X ? '已抢购' : '',
        shopping_spree_price: this.$isChineseLanguage_G_X ? '抢购价格' : '',
        startTime: this.$isChineseLanguage_G_X ? '开始时间' : '',
        endTime: this.$isChineseLanguage_G_X ? '结束时间' : '',
        buyCount: this.$isChineseLanguage_G_X ? '抢购数量' : '',
        noData: this.$isChineseLanguage_G_X ? '暂无活动' : '',
        placeholder1: this.$isChineseLanguage_G_X ? '请输入抢购数量！' : '',
        placeholder2: this.$isChineseLanguage_G_X ? '高于单人最高限额！' : '',
        placeholder3: this.$isChineseLanguage_G_X ? '低于最少起购量！' : '',
        usable: this.$isChineseLanguage_G_X ? '可用' : '',
        project_participation_conditions: this.$isChineseLanguage_G_X ? '项目参与条件' : '',
        rule1: this.$isChineseLanguage_G_X ? '账户持仓大于' : '',
        rule2: this.$isChineseLanguage_G_X ? '账户必须通过' : '',
        rule21: this.$isChineseLanguage_G_X ? '实名认证' : '',
        rule22: this.$isChineseLanguage_G_X ? '高级认证' : '',
        activityDesc: this.$isChineseLanguage_G_X ? '活动简介' : '',
        activityPlan: this.$isChineseLanguage_G_X ? '活动计划' : '',
        FAQ: this.$isChineseLanguage_G_X ? '常见问题' : '',
        coming: this.$isChineseLanguage_G_X ? '即将开始' : '',
        ongoing: this.$isChineseLanguage_G_X ? '进行中' : '',
        ended: this.$isChineseLanguage_G_X ? '已结束' : '',
        notEndedText: this.$isChineseLanguage_G_X ? '立即抢购' : '',
        countDownLabel: this.$isChineseLanguage_G_X ? '距离抢购开始还有' : '',
        lackOfAvailable: this.$isChineseLanguage_G_X ? '可用不足' : '',
        purchaseSuccess: this.$isChineseLanguage_G_X ? '抢购成功' : '',
        purchaseFailed: this.$isChineseLanguage_G_X ? '抢购失败' : '',
        goBack: this.$isChineseLanguage_G_X ? '返回' : '',
        recordLabel: {
          orderId: this.$isChineseLanguage_G_X ? '单号' : '',
          projectName: this.$isChineseLanguage_G_X ? '活动名称' : '',
          coinName: this.$isChineseLanguage_G_X ? '活动币种' : '',
          price: this.$isChineseLanguage_G_X ? '价格' : '',
          count: this.$isChineseLanguage_G_X ? '数量' : '',
          amount: this.$isChineseLanguage_G_X ? '金额' : '',
          purchaseTime: this.$isChineseLanguage_G_X ? '抢购时间' : '',
          accountingTime: this.$isChineseLanguage_G_X ? '到账时间' : '',
          notAccount: this.$isChineseLanguage_G_X ? '暂未到账' : ''
        }
      }
    }
  }
  // destroyed() {
  // },
  // watch: {}
}
export default mixin
