<!--
  author: zhaoxinlei
  create: 20190620
  description: 当前组件为 顶部 同步设置 组件
-->
<template lang="pug">
  li.li-item.setting-li(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    button.setting(
      @click="toggleBox(true)"
    )
      Iconfont.font-size24(icon-name="icon-setting")
    el-dialog.setting(
      :title="$t('M.comm_set')"
      :visible.sync="showSetting"
      width="470px"
      :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
      class="nav-box-dialog"
    )
      // 折算货币
      p.title {{$t('M.comm_convert_currency')}}
      el-select(
        :no-data-text="$t('M.comm_no_data')"
        v-model="activeConvertCurrency"
        :placeholder="$t('M.comm_please_choose')"
        popper-class="convert-currency"
      )
        el-option(
          v-for="item in convertCurrencyList"
          :key="item.shortName"
          :label="$language_S_X=='zh_CN' ? item.name : item.shortName"
          :value="item.shortName"
        )
      //  主题
      p.title {{$t('M.comm_theme')}}
      // 主题选择框
      el-radio-group(
        v-model="activeTheme"
      )
        el-radio-button(
          v-for="(item,index) in themeList"
          :key="index"
          :label="item.value"
          border
        ) {{$t(item.label)}}
          i.el-icon-check(
            v-show="activeTheme == item.value"
          )
      // 底部
      .dialog-footer(slot="footer")
        // 确 定
        el-button(
          size="large"
          type="primary"
          @click="changeSetting"
        ) {{$t('M.comm_confirm')}}
</template>
<script>
import {getStore, setStore} from '../../utils'
import {
  mapActions,
  mapMutations
} from 'vuex'
import {getMerchantAvailableLegalTender} from '../../utils/api/OTC'
import {getNestedData} from '../../utils/commonFunc'
export default {
  name: 'the-setting',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      showSetting: false,
      // 当前折算货币
      activeConvertCurrency: '',
      // 当前折算货币obj
      activeConvertCurrencyObj: {},
      // 折算货币列表
      convertCurrencyList: [],
      // 主题列表
      themeList: [
        {
          label: 'M.comm_black', // 黑色
          value: 'night'
        },
        {
          label: 'M.comm_white', // 白色
          value: 'day'
        }
      ],
      activeTheme: ''
    }
  },
  created () {
    this.getMerchantAvailableLegalTenderList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapActions([
      'GET_TRANSITION_RATE_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_THEME',
      'CHANGE_CONVERT_CURRENCY',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    toggleBox (status) {
      this.showSetting = status
      console.log(this.showSetting)
      this.initSettings()
    },
    // uploadSettings
    initSettings () {
      if (getStore('convertCurrency')) {
        this.activeConvertCurrency = getStore('convertCurrency')
      }
      this.activeTheme = this.$theme_S_X
    },
    // 更改设置
    async changeSetting () {
      // 主题设置
      this.CHANGE_THEME(this.activeTheme)
      document.body.classList.remove('day', 'night')
      document.body.classList.add(this.activeTheme)
      // 汇率转换设置
      await this.changeActiveTransitionCurrency()
      this.CHANGE_CONVERT_CURRENCY(this.activeConvertCurrency)
      this.toggleBox(false)
      this.CHANGE_PASSWORD_USEABLE(false)
    },
    // 更改当前选中汇率转换货币
    async changeActiveTransitionCurrency () {
      const params = {
        shortName: this.activeConvertCurrency || getStore('convertCurrency')
      }
      this.convertCurrencyList.forEach((item) => {
        if (item.shortName === params.shortName) {
          // console.log(item.shortName)
          setStore('convertCurrency', item.shortName)
          this.activeConvertCurrencyObj = item
          return false
        }
      })
      // console.log(params)
      if (!params.shortName) return false
      await this.GET_TRANSITION_RATE_ACTION({
        params,
        activeConvertCurrencyObj: this.activeConvertCurrencyObj
      })
    },
    // 查询某商户可用法币币种列表
    async getMerchantAvailableLegalTenderList () {
      let data = await getMerchantAvailableLegalTender()
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.convertCurrencyList = getNestedData(data, 'data')
        await this.changeActiveTransitionCurrency()
      }
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
  .li-item
    display inline-block
    &.setting-li
      padding 0
      >.setting
        padding 0 4px 0 2px
        font-size 20px
        color #fff
        cursor pointer
        vertical-align middle
      &.night
        /deep/
          .el-dialog
            background-color #1c2237
            .el-select-dropdown
              border-color #282e43 !important
            .el-dialog__title
              color #b8bdd0
            .el-dialog__header
              background-color #1d2131
              box-shadow 0 2px 6px rgba(0, 0, 0, .1)
            .el-dialog__body
              >p
                color #b8bdd0
              .el-input__inner
                color #dee1ea
                border-color #282e43
                background-color #181d2e
              .el-radio-button__inner
                border-color #282e43
                color #b8bdd0
                background-color #181d2e
            .el-dialog__footer
              .el-button
                border none
                background linear-gradient(90deg, #124785 0%, #2a3b61 100%)

  &.day
        /deep/
          .el-radio-button__inner
            color: #333 !important
            background-color: #fff !important
          .el-dialog__title
            padding: 0
            color: #333

          .el-dialog,
          .el-dialog__header
            background-color #fff !important
            box-shadow none
            .el-dialog__footer
                .el-button
                    border none
                    background linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%)

    /deep/
      .setting
        .el-dialog
          height 340px
          border-radius 10px
          overflow hidden
          .el-dialog__header,.el-dialog__body
            padding 0 40px
            text-align left
          .el-dialog__header
            height 44px
            line-height 48px
            .el-dialog__title
              font-size 16px
            .el-dialog__headerbtn
              top 15px
          .el-dialog__body
            padding 10px 40px 0
            .el-select
              width 100%
            .el-input--suffix .el-input__inner,
            .el-radio-button__inner,
            .el-select-dropdown__item
              width 100%
              height 44px
              line-height 44px
            .el-radio-button__inner
              width 110px
              padding 0
              margin-right 44px
              border 1px solid #c3c8cd
              border-radius 4px
            .el-radio-button__orig-radio:checked + .el-radio-button__inner
              border 1px solid S_main_color
              box-shadow none
            .el-icon-check
              position absolute
              top 0
              right 0
              padding 2px 2px 5px 5px
              border-bottom-left-radius: 2em
              color S_day_bg
              background-color S_main_color
            .el-popper[x-placement^=bottom] .popper__arrow
              border-bottom-color transparent
            .el-popper[x-placement^=bottom] .popper__arrow::after
              border none
            .title
              line-height  30px
              margin-top 10px
          .el-dialog__footer
            /*padding 35px 40px*/
            padding 5px 40px
            border none
</style>
<style>
  .convert-currency.el-select-dropdown.el-popper {
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .el-select-dropdown.el-popper {
    z-index: 2100 !important;
    border: none;
  }

  .v-modal {
    position: relative;
    z-index: 2000 !important;
  }
</style>
