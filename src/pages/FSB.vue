<!--
  author: renfuwei
  create: 20190822
  description: 当前页面为 封神榜 组件
-->
<template lang="pug">
  .main-box
    .inner-box
      .header.relative
        .content.relative
          .big-title-box
            .big-title-pic
              img(
                src='../assets/fsb/title_pic.png'
              )
            span.title-tips.font-size22 {{$t('M.fsb_top_text')}}
              img.logo-box(
                src='../assets/fsb/stamp.png'
              )
          .sun-box.absolute
            img(
              src='../assets/fsb/top_sun.png'
            )
          .top-yun-left-box.absolute
            img(
              src='../assets/fsb/top_yun1.png'
            )
          .top-yun-right-box.absolute
            img(
              src='../assets/fsb/top_yun2.png'
            )
          .top-he-left.absolute
            img(
              src='../assets/fsb/he_top.png'
            )
          .top-he-right.absolute
            img(
              src='../assets/fsb/he_top.png'
            )
      .middle
        .first-prospect.common
          .title
            span
              img(
                src='../assets/fsb/zuo.png'
              )
            span.text {{$t('M.fsb_title_text1')}}
            span
              img(
                src='../assets/fsb/you.png'
              )
          .content
            p.purpose {{$t('M.fsb_title1_text')}}
        .second-equity.common
          .title
            span
              img(
                src='../assets/fsb/zuo.png'
              )
            span.text {{$t('M.fsb_title_text2')}}
            span
              img(
                src='../assets/fsb/you.png'
              )
          .content
            .item.border-radius4.relative.cursor-pointer(
              v-for="(item,index) in equitiesList"
              :key="index"
            )
              p.overview.font-size14 {{$t(`${item.overviewText}`)}}
              IconFontCommon(
                class="pic"
                :iconName="item.iconName"
              )
        .third-policy.common
          .title
            span
              img(
                src='../assets/fsb/zuo.png'
              )
            span.text {{$t('M.fsb_title_text3')}}
            span
              img(
                src='../assets/fsb/you.png'
              )
          .content
            .head-title {{$t('M.fsb_title3_table1')}}
            .table-list
              el-table(
                :empty-text="$t('M.comm_no_data')"
                :data="policyList"
                style="width: 100%;"
              )
                el-table-column(
                  :label="$t('M.fsb_title3_table2')"
                  width="140"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.name}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table3')"
                  width="180"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.userCount}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table4')"
                  width="180"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.pay}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table5')"
                  width="180"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.lockedCycle}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table6')"
                  width="180"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.commissionRatio}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table7')"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.commissionCycle}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table8')"
                  prop="commissionCoin"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.commissionCoin}`)}}
                el-table-column(
                  :label="$t('M.fsb_title3_table9')"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.stockDater}`)}}
          .tips-box
            .top
              p 1.{{$t('M.fsb_title3_tips1')}}
              p 2.{{$t('M.fsb_title3_tips2')}}
              p 3.{{$t('M.fsb_title3_tips3')}}
            .bottom
              .remark {{$t('M.fsb_title3_tips4')}}
              p 1：{{$t('M.fsb_title3_tips5')}}
              p 2：{{$t('M.fsb_title3_tips6')}}
              p 3：{{$t('M.fsb_title3_tips7')}}
        .fourth-list.common
          .title
            span
              img(
                src='../assets/fsb/zuo.png'
              )
            span.text {{$t('M.fsb_title_text4')}}
            span
              img(
                src='../assets/fsb/you.png'
              )
          .content
            .head-title {{$t('M.fsb_title4_table1')}}
            .table-list
              el-table(
                :empty-text="$t('M.comm_no_data')"
                :data="serviceChargeList"
                style="width: 100%;"
              )
                el-table-column(
                  :label="$t('M.fsb_title3_table2')"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.name}`)}}
                el-table-column(
                  :label="$t('M.fsb_title4_table2')"
                  prop="userCount"
                  align="center"
                )
                el-table-column(
                  :label="$t('M.fsb_title4_table3')"
                  prop="perCapita"
                  align="center"
                )
                el-table-column(
                  :label="$t('M.fsb_title4_table4')"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.tradeFrequency}`)}}
                el-table-column(
                  :label="$t('M.fsb_title4_table5')"
                  prop="dailyEarnings"
                  align="center"
                )
                el-table-column(
                  :label="$t('M.fsb_title4_table6')"
                  prop="monthlyIncome"
                  align="center"
                )
                el-table-column(
                  :label="$t('M.fsb_title4_table7')"
                  align="center"
                )
                  template(slot-scope="s")
                    div {{$t(`${s.row.annualEarnings}`)}}
          .questions
            .bars
              .aq AQ：
              .questions-title 1.{{$t('M.fsb_title4_tips1')}}
              p {{$t('M.fsb_title4_tips2')}}
            .bars
              .questions-title 2.{{$t('M.fsb_title4_tips3')}}
              p {{$t('M.fsb_title4_tips4')}}{{$t('M.fsb_title4_tips4_1')}}
            .bars
              .questions-title 3.{{$t('M.fsb_title4_tips5')}}
              p {{$t('M.fsb_title4_tips6')}}
        .fifth-flow.common
          .title
            span
              img(
                src='../assets/fsb/zuo.png'
              )
            span.text {{$t('M.fsb_title_text5')}}
            span
              img(
                src='../assets/fsb/you.png'
              )
          .content.relative
            .text-one.text-item {{$t('M.fsb_title5_flow1')}}
            .text-two.text-item {{$t('M.fsb_title5_flow2')}}
            .text-three.text-item {{$t('M.fsb_title5_flow3')}}
            .text-four.text-item {{$t('M.fsb_title5_flow4')}}
      .footer
        .content.relative
          .email-box
            p.email.text-align-c {{$t('M.fsb_bottom_text1')}}
            p.address.text-align-c kangyafei@mail.fubt.com
          .wechat-box.text-align-c
            p.wechat {{$t('M.fsb_bottom_text2')}}
            img.wechat-pic(
              src='../assets/fsb/wechat.png'
            )
          .footer-yun-left.absolute
            img(
              src='../assets/fsb/footer_yun1.png'
            )
          .footer-yun-right.absolute
            img(
              src='../assets/fsb/footer_yun2.png'
            )
          img.he-left.absolute(
            src='../assets/fsb/he_bottom.png'
          )
          img.he-right.absolute(
            src='../assets/fsb/he_bottom.png'
          )
</template>
<script>
import IconFontCommon from '../components/Common/IconFontCommon'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 分佣政策列表
      policyList: [
        {
          name: 'M.fsb_title3_table10',
          userCount: 'M.fsb_title3_table14',
          pay: 'M.fsb_title3_table17',
          lockedCycle: 'M.fsb_title3_table20',
          commissionRatio: '10%',
          commissionCycle: 'M.fsb_title3_table23',
          commissionCoin: 'M.fsb_title3_table24',
          stockDater: 'M.fsb_title3_table25'
        },
        {
          name: 'M.fsb_title3_table11',
          userCount: 'M.fsb_title3_table15',
          pay: 'M.fsb_title3_table18',
          lockedCycle: 'M.fsb_title3_table21',
          commissionRatio: '25%',
          commissionCycle: 'M.fsb_title3_table23',
          commissionCoin: 'M.fsb_title3_table24',
          stockDater: 'M.fsb_title3_table25'
        },
        {
          name: 'M.fsb_title3_table13',
          userCount: 'M.fsb_title3_table16',
          pay: 'M.fsb_title3_table19',
          lockedCycle: 'M.fsb_title3_table22',
          commissionRatio: '50%',
          commissionCycle: 'M.fsb_title3_table23',
          commissionCoin: 'M.fsb_title3_table24',
          stockDater: 'M.fsb_title3_table25'
        }
      ],
      // 手续费收益参考表
      serviceChargeList: [
        {
          name: 'M.fsb_title3_table10',
          userCount: '1000',
          perCapita: '3000',
          tradeFrequency: 'M.fsb_title4_table8',
          dailyEarnings: '1200',
          monthlyIncome: '36000',
          annualEarnings: 'M.fsb_title4_table9'
        },
        {
          name: 'M.fsb_title3_table11',
          userCount: '1000',
          perCapita: '3000',
          tradeFrequency: 'M.fsb_title4_table8',
          dailyEarnings: '3000',
          monthlyIncome: '90000',
          annualEarnings: 'M.fsb_title4_table10'
        },
        {
          name: 'M.fsb_title3_table13',
          userCount: '1000',
          perCapita: '3000',
          tradeFrequency: 'M.fsb_title4_table8',
          dailyEarnings: '6000',
          monthlyIncome: '180000',
          annualEarnings: 'M.fsb_title4_table11'
        }
      ],
      equitiesList: [
        {
          id: '1',
          overviewText: 'M.fsb_title2_item1',
          iconName: 'icon-fenyong'
        },
        {
          id: '2',
          overviewText: 'M.fsb_title2_item2',
          iconName: 'icon-tuijianfuli2'
        },
        {
          id: '3',
          overviewText: 'M.fsb_title2_item3',
          iconName: 'icon-xitongfuli'
        },
        {
          id: '4',
          overviewText: 'M.fsb_title2_item4',
          iconName: 'icon-xiangmufuli'
        },
        {
          id: '5',
          overviewText: 'M.fsb_title2_item5',
          iconName: 'icon-jihuidian1'
        },
        {
          id: '6',
          overviewText: 'M.fsb_title2_item6',
          iconName: 'icon-youzhi'
        },
        {
          id: '7',
          overviewText: 'M.fsb_title2_item7',
          iconName: 'icon-peixun1'
        },
        {
          id: '8',
          overviewText: 'M.fsb_title2_item8',
          iconName: 'icon-jiaren1'
        },
        {
          id: '9',
          overviewText: 'M.fsb_title2_item9',
          iconName: 'icon-zigezhengshu1'
        },
        {
          id: '10',
          overviewText: 'M.fsb_title2_item10',
          iconName: 'icon-zunxiangzhengshu'
        },
        {
          id: '11',
          overviewText: 'M.fsb_title2_item11',
          iconName: 'icon-jiedianzhengshu1'
        },
        {
          id: '12',
          overviewText: 'M.fsb_title2_item12',
          iconName: 'icon-gaoduanhuodong'
        },
        {
          id: '13',
          overviewText: 'M.fsb_title2_item13',
          iconName: 'icon-jinsheng1'
        },
        {
          id: '14',
          overviewText: 'M.fsb_title2_item14',
          iconName: 'icon-zhuanyepeixun1'
        }
      ]
    }
  }
  // created () {},
  // mounted () {},
  // destroyed () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  // methods: {}
  // filter: {},
  // computed: {}
  // watch: {}
}
</script>
<style scoped lang="stylus">
  @import '../assets/CSS/index.styl'
  .main-box
    background-color #272b41
    > .inner-box
      color S_day_bg
      > .header
        width 100%
        height 476px
        background url("../assets/fsb/header_banner.png") no-repeat center
        background-size 100% 100%
        > .content
          width S_main_content_width
          height 476px
          margin 0 auto
          > .sun-box
            top 27px
            left 20px
          > .top-yun-left-box
            top 40px
            left -20px
          > .top-yun-right-box
            top 40px
            right -90px
          > .top-he-left
            top 33px
            left -58px
          > .top-he-right
            bottom 178px
            right 100px
          > .big-title-box
            padding-top 84px
            text-align center
            > .big-title-pic
              margin-bottom 40px
            > .title-tips
              font-family KaiTi
              position relative
              > .logo-box
                position absolute
                bottom -40px
                right -34px
      > .middle
        width S_main_content_width
        margin 0 auto
        > .common
          > .title
            display flex
            justify-content center
            align-items center
            padding-bottom 53px
            .text
              font-size 24px
              margin 0 12px
        > .first-prospect
          padding-top 52px
          > .content
            width S_main_content_width
            height 261px
            border-radius 4px
            font-size 16px
            padding-top 48px
            background url("../assets/fsb/hangye_banner.png") no-repeat center
            > .purpose
              width 1153px
              margin 0 81px 0 66px
              line-height 30px
        > .second-equity
          padding-top 69px
          > .title
            padding-bottom 87px
          > .content
            display flex
            flex-wrap wrap
            > .item
              display flex
              align-items center
              width 320px
              height 60px
              background-color S_night_main_bg
              padding-left 20px
              margin 0 170px 40px 0
              &:nth-of-type(3),
              &:nth-of-type(6),
              &:nth-of-type(9),
              &:nth-of-type(12)
                margin-right 0
              &:nth-of-type(13),
              &:nth-of-type(14)
                margin-bottom 0
              .overview
                line-height 20px
              .icon.pic
                position absolute
                top -30px
                left 10px
                color S_day_bg
                font-size 50px
        > .third-policy,
        > .fourth-list
          padding-top 109px
          > .title
            padding-bottom 61px
          > .content
            width S_main_content_width
            min-height 384px
            background-color S_night_main_bg
            border-radius 4px
            > .head-title
              height 72px
              line-height 72px
              text-align center
              font-size 18px
          > .tips-box
            padding 0 40px 0 27px
            margin-top 20px
            .top
              margin-bottom 26px
              p
                line-height 22px
                color #617499
            .bottom
              .remark
                color S_otc_red_color
              p
                line-height 22px
                color #617499
        > .fourth-list
          > .questions
            padding 0 40px 0 27px
            margin-top 20px
            > .bars
              margin-bottom 20px
              &:nth-of-type(3)
                margin-bottom 0
              > .aq
                margin-bottom 10px
                color S_otc_red_color
              > .questions-title
                margin-bottom 5px
              > p
                line-height 22px
                color #617499
        > .fifth-flow
          padding 89px 0 144px
          > .title
            padding-bottom 88px
          > .content
            height 155px
            background url("../assets/fsb/xian_dian.png") no-repeat center
            > .text-item
              position absolute
              width 300px
              height 30px
              line-height 30px
              text-align center
            > .text-one
              top 105px
              left 130px
            > .text-two
              top 10px
              left 390px
            > .text-three
              top 5px
              right 373px
            > .text-four
              top 130px
              right 163px
      > .footer
        width 100%
        height 369px
        background url("../assets/fsb/footer_banner.png") no-repeat center
        background-size 100% 100%
        > .content
          width S_main_content_width
          height 369px
          margin 0 auto
          padding-top 91px
          overflow hidden
          > .email-box
            > .email
              margin-bottom 10px
            > .address
              color #988961
          > .wechat-box
            > .wechat
              margin 29px 0 18px
          > .footer-yun-left
            top 155px
            left 33px
          > .footer-yun-right
            top 130px
            right 0
          > .he-left
            left 100px
            bottom 200px
          > .he-right
            right 150px
            bottom 60px
      /deep/
      .common
        .content
          .table-list
            .el-table
              .el-table__header-wrapper
                background-color #26293A
                .el-table__header
                  thead
                    font-size 16px
                    color S_day_bg
                    tr
                      th
                        padding 10px 0
                        background-color #26293a
                        &.is-leaf
                          border-bottom none
              .el-table__body
                color #617499
                tr
                  background-color S_night_main_bg
                  &:hover
                    td
                      background-color S_night_main_bg
                  td
                    padding 28px 0
                    border-bottom 1px solid #26293a
                    .cell
                      min-height 22px
              .el-table__empty-block
                background-color #1C1F32
                .el-table__empty-text
                  line-height 265px
                  color #fff
</style>
