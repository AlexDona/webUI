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
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations, mapActions } = createNamespacedHelpers('common')
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
    require('../../../static/css/theme/day/Common/HeaderCommonDay.css')
    // 获取 语言列表
    await this.GET_LANGUAGE_LIST_ACTION({
      self: this
    })
    await this.SET_PARTNER_INFO_ACTION({
      self: this,
      language: this.language
    })
    if (this.routeLanguage) {
      _.forEach(this.languageList, item => {
        if (this.routeLanguage === item.shortName) {
          this.changeLanguage(item)
        }
      })
    }
    this.activeTheme = this.theme
    this.GET_COUNTRY_LIST_ACTION({
      self: this
    })
    if (this.isLogin) {
      this.reflashUserInfo()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'GET_COUNTRY_LIST_ACTION',
      'GET_LANGUAGE_LIST_ACTION',
      'SET_PARTNER_INFO_ACTION'
    ]),
    ...mapMutations([
      // 修改语言
      'CHANGE_LANGUAGE',
      // 修改折算货币
      'CHANGE_CONVERT_CURRENCY',
      // 修改主题
      'CHANGE_THEME',
      // 设置板块
      'CHANGE_PALTE_LIST',
      // 更新当前汇率列表
      'CHANGE_CURRENCY_RATE_LIST',
      'SET_COUNTRY_AREA_LIST',
      'USER_INFORMATION_REFRESH',
      'SET_USER_INFO_REFRESH_STATUS',
      'SET_FOOTER_INFO',
      'SET_LOGO_URL'
    ]),
    reflashUserInfo () {
      this.$store.dispatch('user/REFLASH_USER_INFO', this)
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
  .mobile-header-box{
    >.inner-box{
      height:160px;
      width:100%;
      line-height: 160px;
      display: flex;
      padding:0 1rem;
      >.left{
        height:80px;
        margin-top:40px;
        >a{
          >.img{
            height:80px;
            vertical-align: top;
          }
        }
      }
      >.right{
        color:#fff;
        font-size: 30px;
        flex:1;
        >.ul-list{
          height:100%;
          text-align: right;
          >.li-split{
            width:1px;
            height:20px;
            background-color: #4a5260;
            display:inline-block;
            vertical-align: middle;
          }
          >.li-item{
            display:inline-block;
            padding:0 10px;
            >a{
              transition: all 1s;
              color:#fff;
              padding:5px 10px;
              &:hover{
                background-color: $mainColor;
              }
            }
            /*语言选择 dl*/
            >.lang-box{
              transition: all 1s;
              position: relative;
              text-align: left;
              /*当前语言 dt*/
              >.lang-selected{
                box-sizing: border-box;
                height: 30px;
                line-height: 0px;
                padding: 10px 12px;
                display: inline-block;
                width:100%;
                font-size: 0.86453968rem;
                >.icon{
                  margin-right:5px;
                }
                >.language-text{
                  display:inline-block;
                }
              }
              >.lang-list{
                background-color: #2A3242;
                position: absolute;
                width:5rem;
                z-index: 2;
                left:0;
                top:120px;
                >.lang-item{
                  transition: all 1s;
                  color:#fff;
                  display:block;
                  height:1.5rem;
                  line-height:1.5rem;
                  text-align: left;
                  font-size: 0.72044974rem;
                  padding:0 0.5rem;
                  width:100%;
                  box-sizing: border-box;
                  &:hover{
                    background-color: $mainColor;
                  }
                  >.icon{
                    margin-right:5px;
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
