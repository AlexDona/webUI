<!--
  author: zhaoxinlei
  create: 20190604
  description: 当前页面为 众筹页面详情页
-->
<template lang="pug">
  .the-crowd-funding-detail
    .inner-box
      h3.title {{projectName}}
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
      .rules
</template>
<script>
import {getCrowdFundingDetailAJAX} from '../../utils/api/activityCenter'
import TheCrowdFundingDetailLeft from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingItemDetailLeft'
import TheCrowdFundingDetailRight from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFundingItemDetailRight'
export default {
  name: 'the-crowd-funding-detail',
  // mixins: [],
  components: {
    TheCrowdFundingDetailLeft,
    TheCrowdFundingDetailRight
  },
  props: {
    detailId: {
      type: String
    }
  },
  data () {
    return {
      detail: {},
      label: {
        total: '总额度',
        ieoRemained: '剩余额度',
        limit: '单人限额',
        buyDownLimit: '起购量',
        interestReturnWay: '返息方式',
        holdCoinAmount: '最低持仓',
        applyEndTime: '截止时间',
        interestStartTime: '计息时间',
        interestEndTime: '到期时间',
        interestRate: '年化收益率',
        status: '当前状态',
        joinUserCount: '参与人数',
        usable: '可用',
        balance: '余额'
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
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-crowd-funding-detail
    .inner-box
      width S_main_content_width
      margin 70px auto 0
      height 1000px
      color S_font_color
      font-size 12px
      >.title
        font-size 30px
        line-height 80px
        color S_main_color
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
</style>
