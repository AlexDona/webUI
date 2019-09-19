<!--
  author: renfuwei
  update: 20190924周期增加
  description: 当前页面 合伙人返佣排行榜（全部） 页面
-->
<template lang="pug">
  .rank-list-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
  )
    .inner-box
      .header-box
        .banner-box
          .title.font-size26
            img(
              src="../assets/partner/banner3.png"
            )
            span.text {{$t('M.partner_ranking_title')}}
            img(
              src="../assets/partner/banner2.png"
            )
          .tips.font-size22 {{$t('M.partner_ranking_text2')}}
          .pic
            img(
              src="../assets/partner/banner1.png"
            )
      .body-box
        .content-box
          .table-header
            span.item {{$t('M.partner_ranking_table_title1')}}
            span.item {{$t('M.partner_ranking_table_title2')}}
            span.item {{$t('M.partner_ranking_table_title3')}}
            span.item {{$t('M.partner_ranking_table_title4')}}
          .table-box
            .bars(
              v-for="(item, index) in rankingListsArr"
            )
              span.row {{index + 1}}
                img.land-mark(
                  src="../assets/partner/first.png"
                  v-if="index + 1 == 1"
                )
                img.land-mark(
                  src="../assets/partner/second.png"
                  v-if="index + 1 == 2"
                )
                img.land-mark(
                  src="../assets/partner/third.png"
                  v-if="index + 1 == 3"
                )
              span.row {{hiddenLoginNameShow(item.loginName)}}
              span.row {{item.teamNumber}}
              span.row {{item.rebateFee}}{{item.coinName}}
          .rules.font-size12
            .rule-title.font-size16.font-weight700 {{$t('M.partner_ranking_text3')}}
            .rule-content(
              v-html="rebateTopRule"
            )
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import {
  getNestedData,
  hiddenLoginName
} from '../utils/commonFunc'
import {
  getPartnerRebateTopListAJAX
} from '../utils/api/personal'
export default {
  // name: '',
  // components: {},
  // props,
  data () {
    return {
      // 排行榜数组数据
      rankingListsArr: [],
      rebateTopRule: ''
    }
  },
  async created () {
    await this.getPartnerRebateTopList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions([]),
    ...mapMutations([]),
    // 合伙人排行榜列表
    async getPartnerRebateTopList () {
      const data = await getPartnerRebateTopListAJAX()
      if (!data) return
      this.rankingListsArr = getNestedData(data, 'data.rebateTopList')
      this.rebateTopRule = getNestedData(data, 'data.rebateTopRule')
    },
    // 显示邮箱前三位和@之后的 显示手机前三位和后四位
    hiddenLoginNameShow (val) {
      return hiddenLoginName(val)
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 当前选中语言
      language: state => state.common.language
    })
  },
  watch: {
    // 切换语言再次调接口获得当前语言下的规则富文本
    language (newVal) {
      console.log(newVal)
      if (newVal) {
        this.getPartnerRebateTopList()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../assets/CSS/index.styl'
  .rank-list-box
    .inner-box
      .header-box
        width 100%
        height 320px
        background-color #161927
        .banner-box
          position relative
          width S_main_content_width
          height 320px
          margin 0 auto
          padding-top 90px
          .title
            padding-left 40px
            color #DEC085
            .text
              margin 0 10px
          .tips
            display inline-block
            padding-left 108px
            margin-top 45px
            min-width 384px
            color rgba(205,205,205,1)
            background linear-gradient(45deg,rgba(210,184,133,1) 0%, rgba(169,114,67,1) 100%)
            -webkit-text-fill-color transparent
            -webkit-background-clip text
          .pic
            position absolute
            right -120px
            bottom -6px
            img
              width 800px
    .body-box
      .content-box
        width S_main_content_width
        min-height 1000px
        margin 0 auto
        position relative
        padding 20px 0 40px
        margin-bottom 100px
        .table-header
          width S_main_content_width
          height 60px
          line-height 60px
          position absolute
          top -40px
          left 0
          display flex
          flex 6
          padding 0 30px
          .item
            flex 2
            display flex
            justify-content center
            &:nth-of-type(1),
            &:nth-of-type(4)
              flex 1
        .table-box
          padding 0 30px
          .bars
            box-sizing border-box
            display flex
            flex 6
            height 60px
            line-height 60px
            .row
              flex 2
              display flex
              justify-content center
              position relative
              &:nth-of-type(1),
              &:nth-of-type(4)
                flex 1
              .land-mark
                position absolute
                left 50%
                top 50%
                transform translate(-50%, -50%)
        .rules
          padding 0 30px
          .rule-title
            margin-top 45px
          .rule-content
            margin-top 20px
    &.night
      .inner-box
        .body-box
          background-color #272B41
          .content-box
            background-color S_night_main_bg
            .table-header
              background-color #282C49
              color #A5A6A8
            .table-box
              .bars
                border-bottom 1px solid #2D3651
                .row
                  color #D9E1F1
            .rules
              color S_font_color
              .rule-content
                color S_font_color
    &.day
      .inner-box
        .body-box
          background-color #F5F5FA
          .content-box
            background-color S_day_bg
            border 1px solid rgba(232,232,232,1)
            .table-header
              background-color #E7EEFC
              color #A5A6A8
            .table-box
              .bars
                border-bottom 1px solid #E8E8E8
                .row
                  color #2D2E32
            .rules
              color #2D2E32
              .rule-content
                color #2D2E32
</style>
