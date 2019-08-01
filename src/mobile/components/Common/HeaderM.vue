<!--
  author: zhaoxinlei
  create: 20190731
  description: 当前组件为 H5 页面头部
  -->
<template lang="pug">
  .mobile-header(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X }")
    .inner-box
      .left
        img.img(:src="logoSrc")
      .right
        span 测试
        TheSetting.setting
        TheLanguages.the-language
</template>
<!--<template>-->
  <!--<div-->
    <!--class="mobile-header-box"-->
    <!--:class="{'day':theme == 'day','night':theme == 'night' }"-->
  <!--&gt;-->
    <!--<div class="inner-box">-->
      <!--<div class="left">-->
        <!--<router-link-->
          <!--:to="`/${$routes_X.home}`"-->
          <!--class="logo"-->
        <!--&gt;-->
        <!--<img-->
          <!--class="img"-->
          <!--:src="logoSrc"-->
        <!--&gt;-->
        <!--</router-link>-->
      <!--</div>-->
      <!--&lt;!&ndash;注册登录&ndash;&gt;-->
      <!--<div class="right login">-->
        <!--<ul class="ul-list">-->
          <!--&lt;!&ndash;切换语言&ndash;&gt;-->
          <!--<li class="li-item">-->
            <!--<dl-->
              <!--class="lang-box"-->
              <!--@mouseenter="toggleShowLanguageBox(1)"-->
              <!--@mouseleave="toggleShowLanguageBox(0)"-->
              <!--@click="toggleShowLanguageBox(1)"-->
            <!--&gt;-->
              <!--<dt-->
                <!--class="lang-selected"-->
              <!--&gt;-->
                <!--<span class="language-text">{{activeLanguage.name}}</span>-->
                <!--<i class="el-icon-caret-bottom"></i>-->
              <!--</dt>-->
              <!--<el-collapse-transition>-->
                <!--<dd-->
                  <!--class="lang-list"-->
                  <!--v-show="langSelecting"-->
                <!--&gt;-->
                  <!--<button-->
                    <!--class="lang-item"-->
                    <!--@click.stop="changeLanguage(item)"-->
                    <!--v-for="(item,index) in languages"-->
                    <!--:key="index"-->
                  <!--&gt;-->
                    <!--{{item.name}}-->
                  <!--</button>-->
                <!--</dd>-->
              <!--</el-collapse-transition>-->
            <!--</dl>-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->
<!--请严格按照如下书写书序-->
<script>
import TheLanguages from '../../../components/Header/TheLanguages'
import TheSetting from '../../../components/Header/TheSetting'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    TheLanguages,
    TheSetting
  },
  // props,
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      // langSelecting: true,
      activeTheme: ''
    }
  },
  async created () {
    // console.log(this.isMobile)
    // 获取 语言列表
    if (!await this.GET_LANGUAGE_LIST_ACTION()) return false
    await this.SET_PARTNER_INFO_ACTION(this.language)
    if (this.routeLanguage) {
      _.forEach(this.languages, item => {
        if (this.routeLanguage === item.shortName) {
          this.changeLanguage(item)
        }
      })
    }
    this.activeTheme = this.theme
    this.GET_COUNTRY_LIST_ACTION()
    if (this.isLogin) {
      this.REFRESH_USER_INFO_ACTION()
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION',
      'GET_LANGUAGE_LIST_ACTION',
      'SET_PARTNER_INFO_ACTION',
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      // 修改语言
      'CHANGE_LANGUAGE',
      // 修改折算货币
      'CHANGE_CONVERT_CURRENCY',
      // 修改主题
      'CHANGE_THEME',
      // 更新当前汇率列表
      'CHANGE_CURRENCY_RATE_LIST',
      'SET_COUNTRY_AREA_LIST',
      'USER_INFORMATION_REFRESH',
      'SET_USER_INFO_REFRESH_STATUS',
      'SET_LOGO_URL'
    ]),
    // 显示状态切换 （语言）
    toggleShowLanguageBox (status) {
      this.langSelecting = Boolean(status)
    },
    // 切换语言
    changeLanguage (e) {
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e.shortName
      this.toggleShowLanguageBox(0)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      logoSrc: state => state.common.logoSrc,
      activeLanguage: state => state.common.activeLanguage,
      language: state => state.common.language, // 语言
      // 默认语言
      defaultLanguage: state => state.common.defaultLanguage,
      isMobile: state => state.user.isMobile,
      languages: state => state.common.languages_S
    }),
    routeLanguage () {
      return this.$route.query.language
    }
  },
  watch: {
    defaultLanguage (newVal) {
      this.$i18n.locale = newVal
    }
  }
}
</script>
<style lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .mobile-header
    >.inner-box
      width 100%
      display flex
      justify-content space-between
      height .75rem
      >.left
        background-color pink
        flex 1
      >.right
        flex 1
        background-color green
        span
          font-size: .2rem
        .setting
          /deep/
            button.setting
              width .26rem
              height .24rem
              .icon
                font-size .6rem
</style>
<!--<style scoped lang="scss" type="text/scss">-->
  <!--@import "../../../assets/CSS/index";-->

  <!--.mobile-header-box {-->
    <!--&gt; .inner-box {-->
      <!--display: flex;-->
      <!--width: 100%;-->
      <!--height: 160px;-->
      <!--padding: 0 1rem;-->
      <!--line-height: 160px;-->

      <!--&gt; .left {-->
        <!--height: 80px;-->
        <!--margin-top: 40px;-->

        <!--&gt; a {-->
          <!--&gt; .img {-->
            <!--height: 80px;-->
            <!--vertical-align: top;-->
          <!--}-->
        <!--}-->
      <!--}-->

      <!--&gt; .right {-->
        <!--flex: 1;-->
        <!--font-size: 30px;-->
        <!--color: #fff;-->

        <!--&gt; .ul-list {-->
          <!--height: 100%;-->
          <!--text-align: right;-->

          <!--&gt; .li-split {-->
            <!--display: inline-block;-->
            <!--width: 1px;-->
            <!--height: 20px;-->
            <!--vertical-align: middle;-->
            <!--background-color: #4a5260;-->
          <!--}-->

          <!--&gt; .li-item {-->
            <!--display: inline-block;-->
            <!--padding: 0 10px;-->

            <!--&gt; a {-->
              <!--padding: 5px 10px;-->
              <!--color: #fff;-->
              <!--transition: all 1s;-->

              <!--&:hover {-->
                <!--background-color: $mainColor;-->
              <!--}-->
            <!--}-->

            <!--/* 语言选择 dl */-->
            <!--&gt; .lang-box {-->
              <!--position: relative;-->
              <!--text-align: left;-->
              <!--transition: all 1s;-->

              <!--/* 当前语言 dt */-->
              <!--&gt; .lang-selected {-->
                <!--display: inline-block;-->
                <!--box-sizing: border-box;-->
                <!--width: 100%;-->
                <!--height: 30px;-->
                <!--padding: 10px 12px;-->
                <!--font-size: .86453968rem;-->
                <!--line-height: 0;-->

                <!--&gt; .icon {-->
                  <!--margin-right: 5px;-->
                <!--}-->

                <!--&gt; .language-text {-->
                  <!--display: inline-block;-->
                <!--}-->
              <!--}-->

              <!--&gt; .lang-list {-->
                <!--position: absolute;-->
                <!--z-index: 2;-->
                <!--top: 120px;-->
                <!--left: 0;-->
                <!--width: 5rem;-->
                <!--background-color: #2a3242;-->

                <!--&gt; .lang-item {-->
                  <!--display: block;-->
                  <!--box-sizing: border-box;-->
                  <!--width: 100%;-->
                  <!--height: 1.5rem;-->
                  <!--padding: 0 .5rem;-->
                  <!--font-size: .72044974rem;-->
                  <!--line-height: 1.5rem;-->
                  <!--text-align: left;-->
                  <!--color: #fff;-->
                  <!--transition: all 1s;-->

                  <!--&:hover {-->
                    <!--background-color: $mainColor;-->
                  <!--}-->

                  <!--&gt; .icon {-->
                    <!--margin-right: 5px;-->
                  <!--}-->
                <!--}-->
              <!--}-->
            <!--}-->
          <!--}-->
        <!--}-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</style>-->
