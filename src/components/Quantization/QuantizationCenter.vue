<template lang="pug">
    .container.text-center(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
      .inner-box
        .banner-box
          .banner
        .content.text-center
          .content-box
            .navs
              el-tabs(v-model="activeName" @tab-click="handleClick" v-if="!change")
                el-tab-pane(label="量化市场" name="first" :class="{'d-flex': !change}")
                  .pane-content(v-for="list in strategyList")
                    .pane-header
                      .header-left {{list.strategyName}}
                      ul.header-right
                        li.price {{list.oneMonthPrice + list.coin + '/月'}}
                        li.price-info 包含策略使用费,平台使用费,托管者费用
                    .pane-container
                      ul.pane-ul-l
                        li 主流币种随意选择
                        li 自定义所选币种权重
                        li 实时计算币种折合比特币均值
                      ul.pane-ul-r
                        li 全自动持仓减仓
                        li 自定义精度, 交易粒度, 交易频率
                        li 锁定利润, 平衡资金
                    .pane-footer
                      button.buy 立即购买
                el-tab-pane(label="我的策略" name="second") 我的策略
                  // 点击切换样式
              el-tabs(v-model="activeName" @tab-click="handleClick" v-else)
                el-tab-pane(label="量化市场" name="first")
                  .pane-content-row(v-for="list in strategyList")
                    .pane-bg {{list.strategyName}}
                    .pane-list
                      ul
                        li 主流币种随意选择
                        li 自定义所选币种权重
                        li 实时计算币种折合比特币均值
                      ul
                        li 全自动持仓减仓
                        li 自定义精度, 交易粒度, 交易频率
                        li 锁定利润, 平衡资金
                      .pane-r
                        .price {{list.oneMonthPrice + list.coin + '/月'}}
                        .price-info 包含策略使用费,平台使用费,托管者费用
                        button.buy 立即购买
                el-tab-pane(label="我的策略" name="second") 我的策略
              span.icon-change(@click = "handleChangeLayout")
                  IconFont(:iconName= "icons")
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {getStrategyList} from '../../utils/api/quantizationCenter'
export default {
  // !!! 注意 !!! 如需要相关声明周期或方法，请放开注释(默认处于注释状态)
  // name 为必填项
  name: 'quantization-center',
  // mixins: [],
  components: {
    IconFont
  },
  // props,
  data () {
    return {
      activeName: 'first',
      change: false,
      // 默认图标
      icons: 'icon-list',
      // 当前页数
      currentNum: 1,
      pageSize: 10,
      strategyList: []
    }
  },
  async created () {
    await this.strategyConfigList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleChangeLayout () {
      if (!this.change) {
        this.change = true
        this.icons = 'icon-cascades'
      } else {
        this.change = false
        this.icons = 'icon-list'
      }
    },
    async strategyConfigList () {
      let data = await getStrategyList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentNum // 当前页码
      })
      if (!data) return false
      this.strategyList = _.get(data.data, 'list')
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style lang="stylus" scoped>
    .d-flex
      display flex
    price()
      font-weight bold
      color #e8554f
      font-size 18px
    buttonBuy()
      width 144px
      height 44px
      border-radius 4px
      font-size 14px
      cursor pointer
    .container
      >.inner-box
        >.banner-box
          background #110c38
          >.banner
            background url('../../assets/quantization/banner.png') center no-repeat
            height 229px
        >.content
          margin-bottom 241px
          >.content-box
            width 1300px
            margin 0 auto
            >.navs
              position relative
              font-size 16px
              >.icon-change
                cursor pointer
                line-height 60px
              .pane-content
                width 620px
                >.pane-header
                  padding 0 23px
                  display flex
                  height 90px
                  background url("../../assets/quantization/pane-header.png") center no-repeat
                  background-size cover
                  >.header-left
                    flex 1
                    height 100%
                    line-height 90px
                    font-size 18px
                    font-weight bold
                  >.header-right
                    text-align right
                    padding 24px 0
                    height 100%
                    .price
                      price()
                    .price-info
                      padding-top 11px
                      color #fff
                      font-size 12px
                >.pane-container
                   padding 55px 35px
                   overflow hidden
                   .pane-ul-l
                     float left
                     color #9da5b3
                     li
                      font-size 14px
                      line-height 48px
                      list-style-position inside
                      list-style-image url('../../assets/quantization/dot.png')
                   .pane-ul-r
                      float right
                      color #9da5b3
                      li
                        font-size 14px
                        line-height 48px
                        list-style-position inside
                        list-style-image url('../../assets/quantization/dot.png')
                >.pane-footer
                    padding 0 20px
                    height 90px
                    line-height 90px
                    text-align right
                    background url("../../assets/quantization/pane-footer.png") center no-repeat
                    .buy
                      buttonBuy()
              .pane-content-row
                display flex
                margin-bottom 27px
                .pane-bg
                  flex 0 1 275px
                  height 190px
                  text-align center
                  line-height 190px
                  font-size 18px
                  font-weight bold
                  color #fff
                  background url("../../assets/quantization/pane-list-bg.png") center no-repeat
                .pane-list
                  box-sizing border-box
                  display flex
                  flex 1
                  justify-content space-between
                  padding: 30px 30px 0 71px
                  height 190 px
                  ul
                    li
                      font-size 14px
                      line-height 48px
                      list-style-position inside
                      list-style-image url('../../assets/quantization/dot.png')
                  >.pane-r
                    text-align right
                    .price
                      price()
                    .price-info
                      line-height 40px
                      font-size 12px
                    .buy
                      margin-top 26px
                      color #338ff5
                      border 1px solid #338ff5
                      buttonbuy();
                      &:hover
                          box-shadow 0 0 1px 1px #338ff5
            /deep/
              .el-tab-pane
                justify-content space-between
              .el-tabs__header
                height 60px
                line-height 60px;
              .el-tabs__nav-wrap::after
                width 0
              .el-tabs__item
                width 166px
                text-align center
                font-weight bold
                color #9a9eb0
                font-size 16px
              .el-tabs__item.is-active
                color #338ff5
              .el-tabs__active-bar
                width 140px !important
              .icon-change
                position absolute
                top 0
                right 22px
              .el-tabs__content
                margin-top 42px
    &.night
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                .header-left
                  color #338ff5
                .pane-container
                  background #1c1f32
              .pane-content-row
                width 100%
                background #1c1f32
                .pane-list
                  ul
                    li
                      color #9da5b3
                .pane-r
                  .price-info
                    color #fff
            /deep/
              .el-tabs__header
                background #1c1f32
              .pane-footer
                .buy
                  color #338ff5
                  border 1px solid #338ff5
    &.day
      .inner-box
        .content
          .content-box
            .navs
              .pane-content
                  .header-left
                    color #fff
                  .pane-container
                    background #fff
              .pane-content-row
                width 100%
                background #fff
                .pane-list
                  ul
                    li
                      color #9da5b3
                .pane-r
                  .price-info
                    color #fff
            /deep/
              .el-tabs__header
                background #fff
              .pane-footer
                .buy
                  color #fff
                  border 1px solid #fff
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
