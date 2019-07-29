<!--
  author: zhaoxinlei
  create: 20190725
  description: 当前组件为 注册页面 国家列表选择页面
-->
<template lang="pug">
  .the-countries-select(
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }"
  )
    span.current-country(
      :style="{width: width}"
      :ref="currentCountryRef"
      @click="toggleShowCountries"
      :class="{'not-show-allow':!isShowCountries}"
    ) {{isShowCode ? currentNationCode : $isChineseLanguage_G_X ? currentChineseName : currentEnglishName}}
      Iconfont.iconfont(icon-name="icon-jiantou")
    el-collapse-transition
      .countries-content(
          :class="{'email-register': !isShowCode, 'phone-register': isShowCode}"
          v-show="isShowCountries"
        )
        el-input.search-input(
          v-model="keyword"
          clearable
          v-show="isShowCountries"
          :ref="searchInputRef"
        )
          Iconfont.iconfont(
            icon-name="icon-sousuo"
            slot="prefix"
          )
        .countries
          li.country(
            v-for="country in filterCountries"
            @click="toggleCountry(country)"
          )
            span.left {{country[$isChineseLanguage_G_X ? 'chinese': 'english']}}
            span.right {{country['nationCode']}}
</template>
<script>
export default {
  name: 'the-countries-select',
  // mixins: [],
  // components: {},
  props: {
    width: {
      default: '263px'
    },
    countries: {
      default: []
    },
    // 显示内容（true：国家码， false：中文、英文）
    isShowCode: {
      default: true
    }
  },
  data () {
    return {
      currentCountryRef: 'current-country-ref',
      searchInputRef: 'search-input-ref',
      currentCountry: {},
      keyword: '',
      isShowCountries: false
    }
  },
  created () {
    if (this.countries) {
      this.currentCountry = this.countries[0]
    }
  },
  mounted () {
    document.addEventListener('mousedown', (e) => {
      console.log(e.target)
      const notNeedAddEvents = [this.searchInputRef, this.currentCountryRef]
      const isNeedAddEvent = _.some(notNeedAddEvents, ref => ref == e.target)
      if (!isNeedAddEvent) return
      this.isShowCountries = false
    })
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    toggleShowCountries () {
      this.isShowCountries = !this.isShowCountries
    },
    toggleCountry (country) {
      this.currentCountry = country
      this.keyword = ''
      this.isShowCountries = false
    }
  },
  // filters: {},
  computed: {
    filterCountries () {
      return _.filter(this.countries, country => {
        const {nationCode, chinese, english, abbreviation} = country
        return (nationCode).indexOf(this.keyword) !== -1 ||
          (chinese).indexOf(this.keyword) !== -1 ||
          (english.toUpperCase()).indexOf(this.keyword.toUpperCase()) !== -1 ||
          (abbreviation.toUpperCase()).indexOf(this.keyword.toUpperCase()) !== -1
      })
    },
    currentNationCode () {
      return _.get(this.currentCountry, 'nationCode')
    },
    currentChineseName () {
      return _.get(this.currentCountry, 'chinese')
    },
    currentEnglishName () {
      return _.get(this.currentCountry, 'english')
    }
  },
  watch: {
    countries (New) {
      this.currentCountry = New[0]
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../../assets/CSS/index.styl'
  .the-countries-select
    position relative
    z-index 10
    .current-country
      display inline-block
      color #fff
      padding 0 20px 0 40px
      box-sizing border-box
      position relative
      cursor pointer
      &.not-show-allow
        >.iconfont
          transform translateY(-50%)
        &:before
          border-bottom 10px solid transparent
      >.iconfont
        position absolute
        right 5px
        top 50%
        transform translateY(-50%) rotate(180deg)
        transition all .3s
        z-index 10
        font-size 14px
      /* 上拉展示 */
      &:before
        position absolute
        bottom -10px
        left 40px
        content ''
        width 0
        height 0
        border-bottom 10px solid #25293d
        border-left 10px solid transparent
        border-right 10px solid transparent
    .countries-content
      top 50px
      background-color #25293d
      height 280px
      border-radius 4px
      position absolute
      width 263px
      &.email-register
        left 50%
        transform translateX(-50%)
      &.phone-register
        left 20%
      >.countries
        top 60px
        position absolute
        width 263px
        max-height 280px
        overflow-y auto
        overflow-x hidden
        background-color #25293d
        padding 0 0 20px 0
        border-radius 4px
        >.country
          display flex
          justify-content space-between
          color #fff
          padding 0 20px
          height 34px
          line-height 34px
          cursor pointer
          font-size 14px
          &:hover
            background-color #16192b
      /deep/
        .search-input
          .el-input__inner
            border 1px solid rgba(76,80,96,1) !important
            border-radius 4px !important
            height 34px
            box-sizing border-box
            padding-left 40px
            margin 17px 12px
            width 238px
            color #2F72B7 !important
            background-color transparent !important
            &:focus
              border-color #2F72B7 !important
          .el-input__prefix
            top 13px
            left 23px
          .el-input__suffix
            right 15px
            top 3px
</style>
