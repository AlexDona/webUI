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
      width="486px"
      :close-on-click-modal="false"
      :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
      class="nav-box-dialog"
    )
      // 折算货币
      p.title {{$t('M.comm_convert_currency')}}
      el-select(
        :no-data-text="$t('M.comm_no_data')"
        v-model="activeConvertCurrency"
        :placeholder="$t('M.comm_please_choose')"
        :popper-class="`convert-currency ${$isDayTheme_G_X ? 'day':'night'}`"
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
    // getMerchantAvailableLegalTenderList: _.throttle(async function () {
    //   let data = await getMerchantAvailableLegalTender()
    //   // 返回数据正确的逻辑
    //   if (!data) return false
    //   console.log(data, _.get(data, 'data'))
    //   this.$set(this, 'convertCurrencyList', _.get(data, 'data'))
    //   await this.changeActiveTransitionCurrency()
    // }, 500)
    async getMerchantAvailableLegalTenderList () {
      let data = await getMerchantAvailableLegalTender()
      // 返回数据正确的逻辑
      if (!data) return false
      console.log(data, _.get(data, 'data'))
      this.$set(this, 'convertCurrencyList', _.get(data, 'data'))
      await this.changeActiveTransitionCurrency()
    }
  }
  // filters: {},
  // computed: {
  // },
  // watch: {
  // }
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
            background-color #2b304c
            .el-select-dropdown
              border-color #282e43 !important
            .el-dialog__title
              color #fff
            .el-dialog__header
              background-color #25283D
              .el-dialog__close
                color #fff
                &:hover
                  color S_main_color
            .el-dialog__body
              >p
                color #FEFEFF
              .el-input__inner
                color #FEFEFF
                border-color #25283D
                background-color #32395C
              .el-radio-button__inner
                border-color #25283D
                color #b8bdd0
                background-color #32395c
            .el-dialog__footer
              .el-button
                border none
                background linear-gradient(81deg,rgba(42,59,97,1),rgba(18,71,133,1))
                box-shadow 0 3px 8px 0 rgba(0, 0, 0, 0.25)
      &.day
        /deep/
          .el-dialog__wrapper
            background rgba(204,204,204,.5)
            .el-dialog
              background-color #fff
              box-shadow 0 3px 6px 0 rgba(0, 0, 0, 0.25)
              .el-select-dropdown
                border-color #282e43 !important
              .el-dialog__title
                color #333
              .el-dialog__header
                background-color #DCE7F3
                .el-dialog__close
                  color #333
                  &:hover
                    color S_main_color
              .el-dialog__body
                >p
                  color #1C1F32
                .el-input__inner
                  color #1C1F32
                  border-color #ddd
                  background-color #F1F1F1
                .el-radio-button__inner
                  border-color #ddd
                  color #1C1F32
                  background-color #F1F1F1
              .el-dialog__footer
                .el-button
                  border none
                  background linear-gradient(81deg,rgba(49,135,218,1),rgba(106,182,244,1))
                  box-shadow 0 3px 6px 0 rgba(26,42,71,0.27)
    /deep/
      .setting
        .el-dialog
          height 430px
          border-radius 10px
          overflow hidden
          .el-dialog__header,.el-dialog__body
            padding 0 40px
            text-align left
          .el-dialog__header
            height 44px
            line-height 44px
            padding 0 20px
            .el-dialog__title
              height 44px
              line-height 44px
              display inline-block
            .el-dialog__headerbtn
              top 10px
              .el-dialog__close
                font-size 26px
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
              .el-icon-check
                background S_main_color url('../../assets/user/checkbox-success-bg.png') no-repeat center center/60% 60%
                width 23px
                height 19px
                padding 0
                &:before
                  content ''
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
              margin-top 30px
          .el-dialog__footer
            padding 40px
            border none
            text-align center
            .el-button
              width 235px
              height 46px
              span
                font-size 16px
</style>
<style lang="scss">
  .el-select-dropdown.el-popper {
    z-index: 2100 !important;
    border: none;

    &.convert-currency {
      left: 50% !important;
      transform: translateX(-50%) !important;
    }

    &.night {
      background-color: #25293d;

      .el-select-dropdown__item {
        font-weight: 400;
        color: #fff;

        &.hover,
        &:hover {
          font-weight: 400;
          background-color: #16192b !important;
        }
      }

      /deep/ {
        .popper__arrow::after {
          top: -10px;
          border-width: 8px;
          border-bottom-color: #25293d !important;
        }
      }
    }

    &.day {
      background-color: #e5e5e5;

      .el-select-dropdown__item {
        font-weight: 400;
        color: #1c1f32;

        &.hover,
        &:hover {
          font-weight: 400;
          background-color: #c5c5c5 !important;
        }
      }

      /deep/ {
        .popper__arrow::after {
          top: -10px;
          border-width: 8px;
          border-bottom-color: #e5e5e5 !important;
        }
      }
    }
  }

  .v-modal {
    position: relative;
    z-index: 2000 !important;
  }
</style>
