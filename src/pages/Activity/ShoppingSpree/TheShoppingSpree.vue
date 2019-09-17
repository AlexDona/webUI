<!--
  author: zhaoxinlei
  create: 20190902
  description: 当前页面为 活动页面中的 打折抢购 页面
-->
<template lang="pug">
  .the-shopping-spree
    .banner
      .inner
        .text
          h3.slogan {{$partnerName_S_X}}{{labelOBJ.shopping_spree_slogan}}
          p.desc
            span(v-for="item in labelOBJ.descs") {{item}}
    .header
      .inner
        .left
          ul.status
            li.status-item(
              v-for="status in statusList"
              @click="changeStatus(status)"
              :class="{active: activeStatus == status}"
            ) {{$t(status.label)}}
        .right
          // 抢购记录
          router-link(:to="`/record/${$routes_X.shoppingSpree}`")
            Iconfont.iconfont(icon-name="icon-jilu")
            span {{labelOBJ.shopping_spree_record}}
    .content(:style="{'min-height':innerContentHeight}")
      .inner
        ul.project-list(v-show="shoppingList.length")
          li.project-item(v-for="item in shoppingList")
            // 项目名称
            p.title {{item.projectName}}
              // 当前项目状态
              span.status(
                v-if="item.status != statusList[3].value"
                :class="{ongoing: item.status == statusList[2].value, coming: item.status == statusList[1].value}") {{labelOBJ[item.status]}}
            // 项目详细内容
            .content
              // 接受币种
              .first.rules
                p.value {{item.priceCoinName}}
                //p.label 接受币种
                p.label {{labelOBJ.shopping_spree_accept_the_currency}}
              // 抢购价格

              .second.rules
                p.value 1 {{item.coinName}} = {{item.price}}{{item.priceCoinName}}
                //p.label
                //抢购价格
                p.label {{labelOBJ.shopping_spree_confess_to_raise_prices}}
              // 目标总额
              .third.rules
                p.value {{item.amount}}
                  span.third-coin  {{item.coinName}}
                p.label {{labelOBJ.shopping_spree_total_amount}}
              // 起购量
              .fourthly.rules
                p.value {{item.downLimit}}
                  span.third-coin  {{item.priceCoinName}}
                p.label {{labelOBJ.downLimit}}
              // 限额
              .fifth.rules
                p.value {{item.upLimit}}
                  span.third-coin  {{item.priceCoinName}}
                //p.label 限额
                p.label {{labelOBJ.priceLimit}}
              // 进度 :percentage="item.appliedPercent"
              .sixth.rules
                el-progress(
                  :percentage="item.appliedPercent|formatAppliedPercent"
                  :show-text="false"
                  :stroke-width="8"
                )
                // 进度
                p.label {{labelOBJ.shopping_spree_process}}：{{item.appliedPercent}} %
              // todos
              .seven.rules
                button.jump-button(
                  :to="`/${$routes_X.shoppingSpree}/${item.id}`"
                  @click="goToDetail(item.id)"
                  :class="{active: item.status === 'ongoing'}"
                )
                  // span 立即抢购
                  //  换成状态
                  span {{formatStatusName(item.status)}}
        el-pagination(
          background
          v-show="totalPages>=10"
          layout="prev, pager, next"
          :total="totalPages"
          @current-change="changeCurrentPage"
          :current-page="currentPage"
        )
        // 暂无活动
        .no-data(
          v-show="!shoppingList.length"
          :style="{'min-height':innerContentHeight}"
        )
          p
            Iconfont.iconfont(icon-name="icon-zanwukejian")
            span {{labelOBJ.noData}}
</template>
<script>
import {
  mapState
} from 'vuex'
import mixins from '../../../mixins/shoppingSpree'
import {getShoppingSpreeListAJAX} from '../../../utils/api/shoppingSpree'
export default {
  name: 'the-shopping-spree',
  mixins: [mixins],
  // components: {},
  // props,
  data () {
    return {
      statusList: [
        // 全部
        {
          label: 'M.comm_all',
          value: ''
        },

        // 即将开始
        {
          label: 'M.trade_start',
          value: 'coming'
        },
        // 进行中
        {
          label: 'M.ieo_project_status_ongoing',
          value: 'ongoing'
        },
        // 已结束
        {
          label: 'M.crowd_funding_over',
          value: 'ended'
        }
      ],
      // 当前激活状态
      activeStatus: {},
      // 当前页
      currentPage: 1,
      // 分页
      pageSize: 10,
      // 总页数
      totalPages: 0,
      shoppingList: []
    }
  },
  async created () {
    this.changeStatus(this.statusList[0])
    await this.getShoppingSpreeList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    goToDetail (id) {
      this.$goToPage(`/${this.$routes_X.shoppingSpree}/${id}`)
    },
    // 项目状态名称（点击事件）
    formatStatusName (status) {
      const {notEndedText, ended} = this.labelOBJ
      const statusMap = {
        coming: notEndedText,
        ongoing: notEndedText,
        ended
      }
      return statusMap[status]
    },
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getShoppingSpreeList()
    },
    // 更新状态
    changeStatus (status) {
      this.activeStatus = status
      this.getShoppingSpreeList()
    },
    getShoppingSpreeList: _.debounce(async function () {
      const {value} = this.activeStatus
      const params = {
        status: value,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      }
      const data = await getShoppingSpreeListAJAX(params)
      if (!data) return false
      this.shoppingList = _.get(data, 'data.list')
      this.totalPages = _.get(data, 'data.total') - 0
    }, 500)
  },
  computed: {
    ...mapState({
      footerHeight: state => state.common.footerHeight
    }),
    // 列表内容高度
    innerContentHeight () {
      const bannerHeight = 650
      const titleHeight = 154
      const headerHeight = 50
      return `${window.innerHeight - titleHeight - bannerHeight - headerHeight - this.footerHeight}px`
    }
  },
  filters: {
    formatAppliedPercent (val) {
      if (val - 0 >= 100) {
        return 100
      } else {
        return val - 0 || 0
      }
    }
  },
  watch: {
    $isChineseLanguage_G_X () {
      this.getShoppingSpreeList()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-shopping-spree
    >.banner
      height 650px
      background #121422 url("../../../assets/ShoppingSpree/shopping-spree-banner-bg.png") no-repeat center center/100% 100%
      >.inner
        width S_main_content_width
        height 100%
        margin 0 auto
        position relative
        background url("../../../assets/ShoppingSpree/btc.png") no-repeat right bottom
        >.text
          position absolute
          top 50%
          left 10%
          transform translateY(-50%)
          >.slogan
            font-size 50px
            color #fff
            margin-bottom 46px
          >.desc
            >span
              color #fff
              display inline-block
              height 50px
              line-height 50px
              background linear-gradient(91deg,rgba(253,120,78,1),rgba(255,148,112,1))
              box-shadow 0 7px 9px 0 rgba(219,66,16,1)
              border-radius 4px
              padding 0 35px
              margin 0 20px
              &:first-of-type
                margin-left 0
    >.header
      height 154px
      background-color #121422
      >.inner
        line-height 154px
        display flex
        width S_main_content_width
        margin 0 auto
        >.left
          flex 5
          color #fff
          >.status
            display flex
            >.status-item
              margin 52px 35px
              cursor pointer
              font-size 18px
              font-weight 400
              height 50px
              line-height 50px
              &:first-of-type
                margin-left 0
              &.active
                font-size 24px
                font-weight 700
                position relative
                &:before
                  content ''
                  width 31px
                  height 6px
                  background linear-gradient(215deg,rgba(252,76,28,1) 0%,rgba(245,122,57,1) 100%)
                  position absolute
                  bottom 0
                  left 0
                  transform skew(-30deg)
        >.right
          flex 1
          text-align right
          display flex
          flex-direction row-reverse
          >a
            color S_main_color
            font-size 18px
            >.iconfont
              margin 67px 5px
              font-size 18px
              color S_main_color
    >.content
      background #0F111C url("../../../assets/ShoppingSpree/shopping-spree-content-bg.png") no-repeat center center/100% 100%
      box-sizing border-box
      padding 40px 0
      >.inner
        width S_main_content_width
        margin 0 auto
        /*background-color #1A1D2D*/
        /*min-height 1000px*/
        >.project-list
          /*min-height 1500px*/
          >.project-item
            height 150px
            background-color #1A1D2D
            border 1px solid rgba(34,38,57,1)
            border-radius 4px
            padding 25px
            box-sizing border-box
            transition all .4s
            &:hover
              position relative
              z-index 10
              box-shadow 0 3px 27px 0 rgba(17,20,32,1)
            >.title
              color #fff
              font-size 18px
              font-weight 700
              margin-bottom 20px
              >.status
                margin-left 13px
                font-size 12px
                border-radius 9px
                display inline-block
                height 20px
                line-height 20px
                padding 0 13px
                &.ongoing
                  color S_main_color
                  border 1px solid S_main_color
                &.coming
                  color S_error_color
                  border 1px solid S_error_color
            >.content
              display flex
              >.rules
                >.jump-button
                  color #66718F
                  font-size 14px
                  cursor pointer
                  &.active
                    color S_main_color
                >.value
                  color #D9E1F1
                  font-size 18px
                >.label
                  color #66718F
                  font-size 14px
                  margin-top 10px
                  white-space nowrap
                &.first
                  width 160px
                  >.value
                    color S_main_color
                    font-weight 700
                &.second
                  width 190px
                &.third,&.fourthly,&.fifth
                  width 200px
                  >.value
                    >.third-coin
                      font-size 12px
                &.fourthly
                  width 180px
                &.fifth
                  width 169px
                &.sixth
                  width 200px
                  /deep/
                    .el-progress
                      >.el-progress-bar
                        >.el-progress-bar__outer
                          background-color #31354A
                &.seven
                  color #66718F
                  font-size 14px
                  padding-left 80px
                  >a
                    color S_main_color
                    font-size 14px
        /* 暂无数据 */
        >.no-data
          display flex
          justify-content center
          flex-direction column
          height 100%
          >p
            color #D9E1F1
            text-align center
            >span
              margin-left 5px
              vertical-align middle
            >.iconfont
              vertical-align middle
        /deep/
          .el-pagination
            margin-top 40px
</style>
