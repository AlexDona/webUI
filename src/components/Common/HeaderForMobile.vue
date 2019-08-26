<!--
  author: zhaoxinlei
  update: 20190816
  description: 当前页面为移动端header
-->
<template>
  <div
    class="mobile-header-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <router-link
          :to="`/${$routes_X.home}`"
          class="logo"
          v-show="isShowLogo"
          v-if="isAllowLinkJump"
        >
        <img
          class="img"
          :src="logoSrc"
        >
        </router-link>
        <a
          href="javascript:void(0);"
          v-else
          class="logo"
          v-show="isShowLogo"
        >
          <img
            class="img"
            :src="logoSrc"
          >
        </a>
      </div>
      <!--注册登录-->
      <div class="right login">
        <ul
          class="ul-list"
        >
          <!--切换语言-->
          <li
            class="li-item"
          >
            <dl
              class="lang-box"
              :class="{active: langSelecting}"
              @click="toggleShowLanguageBox(!langSelecting)"
            >
              <dt
                class="lang-selected"
              >
                <span
                  class="language-text"
                  :ref="languageRef"
                >{{activeLanguage.name}}</span>
                <i
                  class="el-icon-caret-bottom"
                  :ref="languageIconRef"
                  :class="{active: langSelecting}"
                ></i>
              </dt>
              <el-collapse-transition>
                <dd
                  class="lang-list"
                  v-show="langSelecting"
                >
                  <button
                    class="lang-item"
                    @click.stop="changeLanguage(item)"
                    v-for="(item,index) in languages"
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
  // components: {},
  props: {
    isShowLogo: {
      default: true
    },
    isAllowLinkJump: {
      default: true
    }
  },
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      // langSelecting: true,
      activeTheme: '',
      languageRef: 'language-ref',
      languageIconRef: 'language-icon-ref'
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
  mounted () {
    // 点击空白收起下拉
    document.querySelector('.the-login-m').addEventListener('click', (e) => {
      console.log(e.target)
      if (e.target == this.$refs[this.languageRef] || e.target == this.$refs[this.languageIconRef]) return
      this.langSelecting = false
    })
  },
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
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .mobile-header-box {
    > .inner-box {
      display: flex;
      box-sizing: border-box;
      width: 100%;
      height: 1.44rem;
      padding: 0 1rem;
      line-height: 1.44rem;

      > .left {
        height: 1.44rem;
        margin-top: .22rem;

        > a {
          > .img {
            height: 1rem;
            vertical-align: top;
          }
        }
      }

      > .right {
        flex: 1;
        font-size: 30px;
        color: #fff;

        > .ul-list {
          height: 1.44rem;
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

              &::before {
                position: absolute;
                top: 1.44rem;
                left: 0;
                width: 0;
                height: 0;
                border-bottom: .21rem solid transparent;
                border-left: .21rem solid transparent;
                content: '';
                border-right: .21rem solid transparent;
              }

              &.active {
                &::before {
                  border-bottom: .21rem solid #1d2033;
                }
              }

              /* 当前语言 dt */
              > .lang-selected {
                display: inline-block;
                box-sizing: border-box;
                width: 100%;
                height: 1.44rem;

                /* padding: 10px 12px; */
                font-size: .66rem;
                line-height: 1.44rem;

                > .icon {
                  margin-right: 5px;
                }

                > .language-text {
                  display: inline-block;
                  font-size: .72rem;
                }

                /deep/ {
                  .el-icon-caret-bottom {
                    transition: all .3s;

                    &.active {
                      transform: rotate(180deg);
                    }
                  }
                }
              }

              > .lang-list {
                position: absolute;
                z-index: 2;
                top: 1.64rem;
                left: 0;
                padding: .5rem 0;
                border-radius: 4px;
                background-color: #1d2033;
                box-shadow: 0 3px 10px 0 rgba(19, 22, 39, .83);

                > .lang-item {
                  display: block;
                  box-sizing: border-box;
                  width: 100%;
                  height: 1.2rem;
                  padding: 0 .3rem;
                  font-size: .66rem;
                  line-height: 1.2rem;
                  text-align: left;
                  white-space: nowrap;
                  color: #fff;
                  transition: all 1s;

                  &:hover {
                    background-color: #121526;
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
