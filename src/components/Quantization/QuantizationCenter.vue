<template lang="pug">
    .container.text-center(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
      .inner-box
        .banner-box
          .banner
        .content.text-center
          .content-box
            .navs
                el-tabs(v-model="activeName" @tab-click="handleClick" v-if="!change")
                    el-tab-pane(label="量化市场" name="first")
                        .pane-content
                            .pane-header
                                .header-left ETF轮动增强策略
                                ul.header-right
                                    li.price 800.00FUC/月
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
                        .pane-content
                            .pane-header
                                .header-left ETF轮动增强策略
                                ul.header-right
                                    li.price 800.00FUC/月
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
                        .pane-content-row
                            .pane-bg ETF轮动增强策略
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
                                    .price 800.00FUC/月
                                    .price-info 包含策略使用费,平台使用费,托管者费用
                                    button.buy 立即购买
                    el-tab-pane(label="我的策略" name="second") 我的策略
                span.icon-change(@click = "handleChangeLayout")
                    IconFont(iconName="icon-qianbao-")
</template>
<script>
import IconFont from '../Common/IconFontCommon'
// import { getLanguagesAJAX } from '../utils/API/common'
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
      change: false
    }
  },
  // async created () {
  // 接口请求 demo
  // const data = await getLanguagesAJAX()
  // 数据处理
  // console.log(data)
  // },
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
      if (!this.change) this.change = true
      else this.change = false
      console.log(this.change)
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style lang="stylus" scoped>
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
                            padding: 0 23px
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
                                    font-weight bold
                                    color #e8554f
                                    font-size 18px
                                .price-info
                                    padding-top 11px
                                    color #fff
                                    font-size 12px
                        >.pane-container;
                             padding: 55px 35px
                             overflow hidden
                             .pane-ul-l
                                 float left
                                 color #9da5b3
                                 li
                                    line-height 48px
                                    list-style-position inside
                                    list-style-image url('../../assets/quantization/dot.jpg')
                             .pane-ul-r
                                float right
                                color #9da5b3
                                li
                                    line-height 48px
                                    list-style-position inside
                                    list-style-image url('../../assets/quantization/dot.jpg')
                        >.pane-footer
                            padding 0 20px
                            height 90px
                            line-height 90px
                            text-align right
                            background url("../../assets/quantization/pane-footer.png") center no-repeat
                            .buy
                                width 144px
                                height 44px
                                border-radius 4px
                                font-size 14px
                                cursor pointer
                    .pane-content-row
                        display flex
                        .pane-bg
                            flex 0 1 275px
                        .pane-list
                            display inherit
                            ul
                                li
                                    line-height 48px
                                    list-style-position inside
                                    list-style-image url('../../assets/quantization/dot.jpg')
                    /deep/
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
                        .el-tab-pane
                            display flex
                            justify-content space-between
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
                            background #1c1f32
                  /deep/
                    .el-tabs__header
                        background #1c1f32
                    .pane-footer
                        .buy
                            color #338ff5
                            border 1px solid #338ff5;
                            &:hover
                                box-shadow 0 0 1px 1px #338ff5
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
