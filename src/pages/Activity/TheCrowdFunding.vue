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
      .container
        .header
          // tabs
          .left
            li.tab(
            v-for="tab in tabs"
            :class="{active:activeName == tab.value}"
            @click="toggleTab(tab.value)"
            )
              span {{tab.name}}
          //  存币记录列表
          .right
            router-link(to="/") 存币记录
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
        {
          value: '',
          name: '全部'
        },
        {
          value: 'coming',
          name: '未开始'
        },
        {
          value: 'ongoing',
          name: '进行中'
        },
        {
          value: 'ended',
          name: '已结束'
        }
      ],
      activeName: '',
      crowdFundings: []
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
  watch: {}
}
</script>
<style lang="stylus">
  @import '../../assets/CSS/index.styl'
  .crowd-funding
    > .inner-box
      > .banner
        height 600px
        background url('../../assets/images/crowd-funding-bg.png') no-repeat center center / cover
      > .container
        width S_main_content_width
        margin -200px auto 100px
        /*background-color pink*/
        min-height 1000px
        > .header
          height 70px
          line-height 70px
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
            /*background-color pink*/
            text-align right
            padding-right 40px
            > a
              color S_main_color
        > .content
          background-color S_night_main_bg
          display flex
          padding 50px
          box-sizing border-box
          flex-wrap wrap
          justify-content space-between
          > .crowd-funding-item
            width 384px
            min-width 384px
            height 420px
            background-color #151b30
            margin-bottom 50px
            border-radius 6px
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
</style>
