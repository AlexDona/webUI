<!--
  author: zhaoxinlei
  createTime: 20190603
  description: 当前页面为 众筹 页面
-->
<template lang="pug">
  .crowd-funding(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .inner-box
      .banner
        .inner-box
          h3 {{$t(title1)}}
          p {{$t(title2)}}
      .container
        .header
          // tabs
          .left
            li.tab(
            v-for="tab in tabs"
            :class="{active:activeName == tab.value}"
            @click="toggleTab(tab.value)"
            )
              span {{$t(tab.name)}}
          //  锁仓记录列表
          .right
            // 锁仓记录
            router-link(:to="`/${$routes_X.crowdFundingRecord}`") {{$t('M.crowd_funding_lock_up_record')}}
        .content
          li.crowd-funding-item(
            v-for="crowdFunding in crowdFundings"
          )
            TheCrowdFundingItem(
              :crowdFunding ="crowdFunding"
            )
          // 暂无数据
          .no-data(v-if="!crowdFundings.length")
            span {{ $t('M.comm_no_data') }}
</template>
<script>
import {mapState} from 'vuex'
import {getCrowdFundingAJAX} from '../../utils/api/activityCenter'
import TheCrowdFundingItem from '../../components/ActivityCenter/CrowdFuncding/TheCrowdFundingDetail/TheCrowdFuncdingItem'
export default {
  components: {
    TheCrowdFundingItem
  },
  // props,
  data () {
    return {
      tabs: [
        // 全部
        {
          value: '',
          name: 'M.comm_all'
        },
        // 未开始
        {
          value: 'coming',
          name: 'M.crowd_funding_coming_soon'
        },
        // 进行中
        {
          value: 'ongoing',
          name: 'M.crowd_funding_processing'
        },
        // 已结束
        {
          value: 'ended',
          name: 'M.crowd_funding_over'
        }
      ],
      activeName: '',
      crowdFundings: [],
      title1: 'M.crowd_funding_title1',
      title2: 'M.crowd_funding_title2'
    }
  },
  async created () {
    this.activeName = this.tabs[0].value
    await this.getCrowdFunding()
  },
  // mounted () {},
  // activated () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    toggleTab (name) {
      this.activeName = name
      this.getCrowdFunding()
    },
    // 获取众筹列表
    getCrowdFunding: _.debounce(async function () {
      const params = {
        language: this.$language_S_X
      }
      if (this.activeName) params.status = this.activeName
      const data = await getCrowdFundingAJAX(params)
      if (!data) return
      // console.log(data)
      this.crowdFundings = _.get(data, 'data')
      // this.crowdFundings = []
    }, 500)
  },
  // filter: {},
  computed: {
    ...mapState([])
  },
  watch: {
    $language_S_X (New) {
      console.log(New)
      this.getCrowdFunding()
    }
  }
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .crowd-funding
    padding-bottom 100px
    > .inner-box
      > .banner
        margin-top 50px
        height 400px
        background url('../../assets/images/crowd-funding-bg.png') no-repeat center center / cover
        position relative
        >.inner-box
          position absolute
          left 30%
          top 19%
          >h3
            font-size 44px
            color #fff
            line-height 80px
            text-align center
          >p
            font-size 30px
            color #fff
            background url('../../assets/images/crowd-banner-bg.png') no-repeat center center/100% 100%
            padding 0 40px
      > .container
        width S_main_content_width
        margin -107px auto 0
        min-height 1000px
        position relative
        > .header
          height 50px
          line-height 50px
          background-color #282c49
          display flex
          > .left
            flex 1
            display flex
            > .tab
              flex 1
              text-align center
              cursor pointer
              color S_font_color
              &.active
                color S_main_color
                border-bottom 2px solid S_main_color
          > .right
            flex 1
            text-align right
            padding-right 40px
            > a
              color S_main_color
        > .content
          background-color S_night_main_bg
          display flex
          padding 50px !important
          box-sizing border-box
          flex-wrap wrap
          /*justify-content space-between*/
          min-height 1000px
          > .crowd-funding-item
            width 370px
            min-width 370px
            height 370px
            background-color #151b30
            margin 0 15px 50px 15px
            border-radius 6px
            transition all .1s ease
            &:hover
              margin-top -10px
          >.no-data
            width 100%
            background url('../../assets/images/no-data-bg.png') no-repeat center 40%
            height 930px
            position relative
            >span
              position absolute
              top 55%
              left 48%
              transform translateX(-50%)
              color S_main_color
    &.day
      background-color #f5f5fa
      > .inner-box
        background-color #f5f5fa
        > .banner
        > .container
          > .header
            background-color #e7eefc
            > .left
              > .tab
                color #2F363D
                &.active
                  color S_main_color
                  border-bottom 2px solid S_main_color
            > .right
              > a
                color S_main_color
          > .content
            background-color #fff
            box-shadow 0 2px 2px 0 rgba(225,225,225,1)
            > .crowd-funding-item
              background-color #fff
              box-shadow 0 -1px 9px 0 #d6d6d6
            >.no-data
              >span
                color S_main_color
</style>
