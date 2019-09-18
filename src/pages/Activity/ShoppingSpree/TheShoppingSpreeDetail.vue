<!--
  author: zhaoxinlei
  create: 20190906
  description: 当前页面为 闪兑专区 抢购详情 页面
-->
<template lang="pug">
  .the-shopping-spree-detail
    // 顶部
    .banner
      .inner
        .inner
          .left
            TheShoppingSpreeDetailLeft(
              :details="detailsComp"
              :countDown="countDown"
              @updateDetails="updateDetails"
              )
          .right
            TheShoppingSpreeDetailRight(:details="detailsComp")
        .tips
          Iconfont.iconfont(icon-name="icon-wenxintishi")
          span {{tips}}
    // 详情页
    .desc
      .inner
        // 活动简介
        TheShoppingSpreeDetailRichText(
          :title="labelOBJ.activityDesc"
          :content ="projectDesc"
        )
        // 活动计划
        TheShoppingSpreeDetailRichText(
          :title="labelOBJ.activityPlan"
          :content ="projectDetail"
        )
        // 常见问题
        TheShoppingSpreeDetailRichText(
          :title="labelOBJ.FAQ"
          :content ="questions"
        )
</template>
<script>
import TheShoppingSpreeDetailLeft from '../../../components/ActivityCenter/ShoppingSpree/TheshoppingSpreeDetailLeft'
import TheShoppingSpreeDetailRight from '../../../components/ActivityCenter/ShoppingSpree/TheshoppingSpreeDetailRight'
import {getShoppingSpreeDetailAJAX} from '../../../utils/api/shoppingSpree'
import TheShoppingSpreeDetailRichText from '../../../components/ActivityCenter/ShoppingSpree/TheShoppingSpreeDetailRichText'
import mixins from '../../../mixins/shoppingSpree'
import Socket from '../../../utils/datafeeds/socket'
import {OTCIMSocketUrl} from '../../../utils/env'
export default {
  name: 'the-shopping-spree-detail',
  mixins: [mixins],
  components: {
    TheShoppingSpreeDetailLeft,
    TheShoppingSpreeDetailRight,
    TheShoppingSpreeDetailRichText
  },
  props: {
    // 订单id
    detailId: {}
  },
  data () {
    return {
      // 当前订单详情
      details: {},
      // socket
      socket: null,
      // 倒计时秒
      countDown: 0
    }
  },
  async created () {
    await this.getShoppingSpreeDetail()
    this.initSocket()
    // this.getJoinTermCoinStatus()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    this.socket.doClose()
  },
  // destroyed () {},
  methods: {
    // 供子组件修改状态调用
    updateDetails (details) {
      this.details = {...this.details, ...details}
    },
    checkHeart () {
      this.socket.on('message', (e) => {
        if (e.action == 'checkHeart') {
          this.socket.send(e)
          // 非心跳之外 duration 内 无消息，客户端主动断开连接
        }
      })
    },
    initSocket () {
      this.socket = new Socket(this.url = OTCIMSocketUrl)
      this.socket.doOpen()
      this.socket.on('open', () => {
        this.socket.send({
          'action': 'preActivity',
          projectSn: this.projectSn
        })
        // this.checkHeart()
      })
      this.socket.on('message', (e) => {
        // const { appliedAmount, appliedPercent, projectSn, status } = e
        this.details = { ...this.details, ...e }
      })
    },
    async getShoppingSpreeDetail () {
      const params = {id: this.detailId}
      const data = await getShoppingSpreeDetailAJAX(params)
      if (!data) return false
      this.details = _.get(data, 'data.details')
      this.countDown = _.get(data, 'data.countDown') - 0
    }
  },
  // filters: {},
  computed: {
    detailsComp () {
      return this.details
    },
    tips () {
      return this.$isChineseLanguage_G_X ? '温馨提示：数字资产为创新型资产，具有价格波动较大的特性。请理性判断，慎重选择投资决策！' : ''
    },
    // 活动简介
    projectDesc () {
      return _.get(this.details, 'projectDesc')
    },
    // 项目编号
    projectSn () {
      return _.get(this.details, 'sn')
    },
    // 项目id
    projectID () {
      return _.get(this.details, 'id')
    },
    // 活动计划
    projectDetail () {
      return _.get(this.details, 'projectDetail')
    },
    // 常见问题
    questions () {
      return _.get(this.details, 'questions')
    }
  },
  watch: {
    $isChineseLanguage_G_X () {
      this.getShoppingSpreeDetail()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree-detail
    >.banner
      height 600px
      background #121422 url("../../../assets/ShoppingSpree/shopping-spree-banner-bg.png") no-repeat center center/100% 100%
      overflow hidden
      >.inner
        height 496px
        background-color #1A1D2D
        width S_main_content_width
        margin 105px auto 0
        border-radius 4px
        >.inner
          width S_main_content_width
          background-color #1a1d2d
          display flex
          justify-content space-between
          >.left,>.right
            flex 1
        >.tips
          padding 0 110px
          box-sizing border-box
          font-size 12px
          color #66718F
          line-height 40px
          height 53px
          border-top 1px solid #2C3046
          >.iconfont
            color S_error_color
            margin-right 5px
    >.desc
      padding-top 20px
      background #121422 url("../../../assets/ShoppingSpree/shopping-spree-content-bg.png") no-repeat center center/100% 100%
      padding-bottom 178px
      >.inner
        width S_main_content_width
        background-color #1A1D2D
        margin 0 auto
        box-sizing border-box
        padding 36px 110px
        border-radius 4px
</style>
