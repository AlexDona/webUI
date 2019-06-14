<!--
  author: zhaoxinlei
  create: 20190604
  description: 当前页面为 众筹页面详情页
-->
<template lang="pug">
  .the-crowd-funding-detail(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .inner-box
      .title-container
        .left
          h3.title {{projectName}}
        .right
          TheCrowdFundingGoBack
      .detail
        TheCrowdFundingDetailLeft.left(
          :detail="detail"
          :label="label"
        )
        .split
        TheCrowdFundingDetailRight.right(
          :detail="detail"
          :label="label"
        )
      .description
        TheCrowdFundingRichText(
          :isRichText="false"
          :title="$t(label.descriptionTitle)"
          :content ="descriptionContent"
        )
      .rules
        TheCrowdFundingRichText(
        :title="$t(label.rulesTitle)"
        :content ="rulesContent"
        )
      .FAQ
        TheCrowdFundingFAQ(
        :title="$t(label.FAQTitle)"
        )
</template>
<script>
import {getCrowdFundingDetailAJAX} from '../../utils/api/activityCenter'
import TheCrowdFundingDetailLeft from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingItemDetailLeft'
import TheCrowdFundingDetailRight from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingItemDetailRight'
import TheCrowdFundingRichText from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingRichText'
import TheCrowdFundingGoBack from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingGoBack'
import TheCrowdFundingFAQ from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingFAQ'
export default {
  name: 'the-crowd-funding-detail',
  // mixins: [],
  components: {
    TheCrowdFundingDetailLeft,
    TheCrowdFundingDetailRight,
    TheCrowdFundingRichText,
    // Iconfont,
    TheCrowdFundingGoBack,
    TheCrowdFundingFAQ
  },
  props: {
    detailId: {
      type: String
    }
  },
  data () {
    return {
      detail: {},
      title1: 'M.crowd_funding_title1',
      label: {
        total: 'M.crowd_funding_total',
        // 剩余额度
        ieoRemained: 'M.crowd_funding_surplus',
        // 单人限额
        limit: 'M.crowd_funding_single_limit',
        // 起购量
        buyDownLimit: 'M.crowd_funding_purchase_quantity',
        // 返息方式
        interestReturnWay: 'M.crowd_funding_return_method',
        // 最低持仓
        holdCoinAmount: 'M.crowd_funding_minimum_position',
        // 截止时间
        applyEndTime: 'M.crowd_funding_minimum_deadline',
        // 计息时间
        interestStartTime: 'M.crowd_funding_interest_time',
        // 到期时间
        interestEndTime: 'M.crowd_funding_expire_date',
        interestRate: 'M.crowd_funding_interest_rate',
        // 当前状态
        status: 'M.crowd_funding_expire_current_State',
        joinUserCount: 'M.crowd_funding_number_of_participants',
        usable: 'M.comm_usable',
        balance: 'M.crowd_funding_expire_purplus1',
        descriptionTitle: 'M.crowd_funding_description_title',
        rulesTitle: 'M.crowd_funding_rules_title',
        FAQTitle: 'M.crowd_funding_question_title'
      }
    }
  },
  created () {
    this.getCrowdFundingDetail()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    async getCrowdFundingDetail () {
      const data = await getCrowdFundingDetailAJAX(this.detailId, {
        language: this.$language_S_X
      })
      if (!data) return
      console.log(data)
      this.detail = _.get(data, 'data')
      console.log(this.detail)
    }
  },
  filters: {
    timerFormat1 (date, type) {
      console.log(date, new Date(date).getMonth())
      const newDate = new Date(date)
      const years = `${newDate.getFullYear()}`
      const months = `${newDate.getMonth() + 1}`.padStart(2, '0')
      const days = `${newDate.getDate()}`.padStart(2, '0')
      const hours = `${newDate.getHours()}`.padStart(2, '0')
      const minutes = `${newDate.getMinutes()}`.padStart(2, '0')
      const seconds = `${newDate.getSeconds()}`.padStart(2, '0')
      let finalDate = ''
      switch (type) {
        case 'date':
          finalDate = `${years}/${months}/${days}`
          break
        case 'time':
          finalDate = `${hours}:${minutes}:${seconds}`
          break
        default:
          finalDate = `${years}/${months}/${days} ${hours}:${minutes}:${seconds}`
      }
      return finalDate
    }
  },
  computed: {
    /**
     * applyEndTime
     申购截止时间
     applyStartTime
     申购开始时间
     buyDownLimit
     起购金额
     buyUpLimit
     true number
     最高限购
     holdCoinAmount
     true number
     需持币金额
     holdCoinId
     true number
     持币币种ID
     holdCoinName
     true string
     持币币种名称
     id
     true string
     项目ID
     ieoCoinId
     true number
     募集币种ID
     ieoCoinName
     true string
     募集币种名称
     ieoRemained
     true number
     剩余额度
     ieoTotal
     true number
     募集总额
     interestStartTime
     true number
     计息开始时间
     interestEndTime
     true number
     计息结束时间
     interestRate
     true number
     年化率
     interestReturnWay
     true string
     返息方式（国际化）
     joinUserCount
     true number
     参与人数
     projectDesc
     true string
     项目简介（富文本）
     projectDetail
     true string
     项目规则详情（富文本）
     projectName
     true string
     项目名称
     questions
     true string
     常见问题（富文本）
     statusCode
     true string
     项目状态（国际化）
     statusName
     true string
     */
    descriptionContent () {
      return _.get(this.detail, 'projectDesc')
    },
    // 常见问题
    FAQContent () {
      return _.get(this.detail, 'questions')
    },
    // 项目规则
    rulesContent () {
      return _.get(this.detail, 'projectDetail')
    },
    ieoTotal () {
      return _.get(this.detail, 'ieoTotal')
    },
    projectName () {
      return _.get(this.detail, 'projectName')
    },
    ieoCoinName () {
      return _.get(this.detail, 'ieoCoinName')
    },
    ieoRemained () {
      return _.get(this.detail, 'ieoRemained')
    },
    buyUpLimit () {
      return _.get(this.detail, 'buyUpLimit')
    },
    buyDownLimit () {
      return _.get(this.detail, 'buyDownLimit')
    },
    interestReturnWay () {
      return this.$t(`M.${_.get(this.detail, 'interestReturnWay')}`)
    },
    holdCoinAmount () {
      return _.get(this.detail, 'holdCoinAmount')
    },
    // 最低持仓币种
    holdCoinName () {
      return _.get(this.detail, 'holdCoinName')
    },
    applyEndTime () {
      return _.get(this.detail, 'applyEndTime')
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
    // 当前状态 （文本）
    statusName () {
      return _.get(this.detail, 'statusName')
    },
    // 参与人数
    joinUserCount () {
      return _.get(this.detail, 'joinUserCount')
    }
  },
  watch: {
    $language_S_X () {
      this.getCrowdFundingDetail()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-crowd-funding-detail
    padding-bottom 100px
    .inner-box
      width S_main_content_width
      margin 50px auto 0
      min-height 1000px
      color S_font_color
      font-size 12px
      .title-container
        display flex
        justify-content space-between
        line-height 80px
        color S_main_color
        >.left
          >.title
            font-size 30px
      >.detail
        display flex
        height 320px
        background-color #151b30
        box-shadow 0 4px 4px 0 rgba(30,33,51,1)
        padding 40px 60px
        box-sizing border-box
        line-height 24px
        >.left
          flex 2
        .split
          width 1px
          background url('../../assets/images/crowd-funding-split-bg.png') no-repeat center center
          height 228px
          margin 0 40px
        .right
          flex 3
    &.day
      background-color: #f5f5fa
      .inner-box
        color S_font_color
        >.title
          color S_main_color
        >.detail
          background-color #fff
          box-shadow 0 4px 6px 0 rgba(214,215,217,1)
          >.left
            flex 2
          .split
            background url('../../assets/images/crowd-funding-split-bg.png') no-repeat center center
          .right
            flex 3
</style>
