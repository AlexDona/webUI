<!--
  author: wt
  create: 20190902
  description: 当前页面为 轮动策略 组件
-->
<template lang="pug">
  .container(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
    .inner-box
      .banner-box
        .banner
      .content.text-center
        .content-box
          .navs
            a.nav-list1(@click.prevent="handleToQuantization") 我的策略 &nbsp;>&nbsp;
            span.nav-list2 轮动策略配置
          .navs-detail
            el-form()
              el-form-item(label="活动时间" label-width="80px")
                el-date-picker(
                  v-model="startTime"
                  type="datetimerange"
                  align="right"
                  range-separator="~"
                  :start-placeholder="'开始时间'"
                  :end-placeholder="'结束时间'"
                  :default-time="['00:00:00', '00:00:00']"
                  :picker-options="pickerOptionsTime"
                )
              el-form-item(label="参数" label-width="80px")
                .params
                  .select-text 计价币种
                  el-select(placeholder="BTC")
                    el-option(label="BTC" value="'ssss'")
                .params-content
                  .add-params
                    .add-params-text
                      .params-text-l 基础币种
                      .params-text-r 占比
                    .add-params-content
                      .params-content-l BTC
                      .params-content-r 1%
                        IconFont.delete(iconName= "icon-shanchu")
                button.addCurrency 添加币种
    el-dialog(:title="'添加币种'" :visible.sync="addCurrencyVisible" class="dialog-buy")
      el-form()
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {routesVariable} from '../../router/routesVariable'
// import {mapState, mapMutations} from 'vuex'
// import { getLanguagesAJAX } from '../utils/API/common'
export default {
  // name 为必填项
  name: 'rotation-strategy',
  components: {
    IconFont
  },
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      startTime: [], // 开始时间
      pickerOptionsTime: {
        disabledDate: (time) => {
          let curDate = new Date(this.$route.params.endTime).getTime()
          let three = 90 * 24 * 3600 * 1000
          let threeMonths = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeMonths
        }
      },
      addCurrencyVisible: false
    }
  },
  async created () {
    // console.log(this.$route.params)
    // const data = await getLanguagesAJAX()
    // console.log(data)
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    handleToQuantization () {
      this.$router.replace({
        name: routesVariable.quantization,
        params: {
          tab: 1
        }
      })
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .container
    >.inner-box
      >.banner-box
        background #110c38
        >.banner
          background url('../../assets/quantization/banner.png') center no-repeat
          height 229px
      >.content
        margin-top 31px
        margin-bottom 200px
        >.content-box
          width 1300px
          margin 0 auto
          .navs
            padding 0 26px
            height 40px
            line-height 40px
            font-size 14px
            >.nav-list1
              cursor pointer
              color S_night_main_text_color
            >.nav-list2
              cursor pointer
              color S_main_color
          .navs-detail
            padding 36px 0 60px 134px
            .params-content
              margin-top 18px
              display flex
              flex-wrap wrap
              .add-params
                width 192px
                margin-right 33px
                .add-params-text
                  display flex
                  .params-text-l
                    flex 1
                    text-align left
                  .params-text-r
                    width 59px
                    text-align center
                .add-params-content
                  display flex
                  height 32px
                  line-height 32px
                  border-radius 2px
                  .params-content-l
                    padding-left 15px
                    flex 1
                  .params-content-r
                    width 59px
                    text-align center
                    position relative
                    .delete
                      position absolute
                      top -8px
                      right -8px
            .addCurrency
              width 77px
              height 28px
              border 1px solid S_main_color
              color S_main_color
              margin-top 33px
              cursor pointer
  /deep/
    .el-input__inner
      width 192px
      height 32px
      border none
      .el-range__icon
        line-height 27px
    .el-form-item__content
      padding-left 55px
  &.night
    .content-box
      .navs
        background S_night_main_bg
      .navs-detail
        .params
          >.select-text
            color S_night_main_text_color
      .add-params
        color S_night_main_text_color
        .add-params-content
          background S_color1
          .params-content-r
            border-left 1px solid S_night_main_bg
  /deep/
    .el-form-item__label
      color #fff
    .el-input__inner
      background S_color1
      .el-range-separator
        color S_night_main_text_color
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
