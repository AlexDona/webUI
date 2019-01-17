<template>
  <div
    class="mobile-header-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <router-link
          to="/home"
          class="logo"
        >
        <img
          class="img"
          :src="logoSrc"
        >
        </router-link>
      </div>
      <!--注册登录-->
      <div class="right login">
        <ul class="ul-list">
          <!--切换语言-->
          <li class="li-item">
            <dl
              class="lang-box"
              @mouseenter="toggleShowLanguageBox(1)"
              @mouseleave="toggleShowLanguageBox(0)"
              @click="toggleShowLanguageBox(1)"
            >
              <dt
                class="lang-selected"
              >
                <span class="language-text">{{activeLanguage.name}}</span>
                <i class="el-icon-caret-bottom"></i>
              </dt>
              <el-collapse-transition>
                <dd
                  class="lang-list"
                  v-show="langSelecting"
                >
                  <button
                    class="lang-item"
                    @click.stop="changeLanguage(item)"
                    v-for="(item,index) in languageList"
                    :key="index"
                  >
                    {{item.name}}
                  </button>
                </dd>
              </el-collapse-transition>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      activeTheme: '',
      languageList: []
    }
  },
  async created () {
    // 获取 语言列表
    await this.GET_LANGUAGE_LIST_ACTION(this)
    await this.SET_PARTNER_INFO_ACTION(this.language)
    if (this.routeLanguage) {
      _.forEach(this.languageList, item => {
        if (this.routeLanguage === item.shortName) {
          this.changeLanguage(item)
        }
      })
    }
    this.activeTheme = this.theme
    this.GET_COUNTRY_LIST_ACTION()
    if (this.isLogin) {
      this.reflashUserInfo()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
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
      'SET_FOOTER_INFO',
      'SET_LOGO_URL'
    ]),
    reflashUserInfo () {
      this.REFRESH_USER_INFO_ACTION(this)
    },
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
      logoSrc: state => state.common.logoSrc,
      activeLanguage: state => state.common.activeLanguage,
      language: state => state.common.language, // 语言
      defaultLanguage: state => state.common.defaultLanguage // 语言
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
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";

  .mobile-header-box {
    > .inner-box {
      display: flex;
      width: 100%;
      height: 160px;
      padding: 0 1rem;
      line-height: 160px;

      > .left {
        height: 80px;
        margin-top: 40px;

        > a {
          > .img {
            height: 80px;
            vertical-align: top;
          }
        }
      }

      > .right {
        flex: 1;
        font-size: 30px;
        color: #fff;

        > .ul-list {
          height: 100%;
          text-align: right;

          > .li-split {
            display: inline-block;
            width: 1px;
            height: 20px;
            vertical-align: middle;
            background-color: #4a5260;
          }

          > .li-item {
            display: inline-block;
            padding: 0 10px;

            > a {
              padding: 5px 10px;
              color: #fff;
              transition: all 1s;

              &:hover {
                background-color: $mainColor;
              }
            }

            /* 语言选择 dl */
            > .lang-box {
              position: relative;
              text-align: left;
              transition: all 1s;

              /* 当前语言 dt */
              > .lang-selected {
                display: inline-block;
                box-sizing: border-box;
                width: 100%;
                height: 30px;
                padding: 10px 12px;
                font-size: .86453968rem;
                line-height: 0;

                > .icon {
                  margin-right: 5px;
                }

                > .language-text {
                  display: inline-block;
                }
              }

              > .lang-list {
                position: absolute;
                z-index: 2;
                top: 120px;
                left: 0;
                width: 5rem;
                background-color: #2a3242;

                > .lang-item {
                  display: block;
                  box-sizing: border-box;
                  width: 100%;
                  height: 1.5rem;
                  padding: 0 .5rem;
                  font-size: .72044974rem;
                  line-height: 1.5rem;
                  text-align: left;
                  color: #fff;
                  transition: all 1s;

                  &:hover {
                    background-color: $mainColor;
                  }

                  > .icon {
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
