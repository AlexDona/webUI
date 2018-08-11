<template>
  <div
    class="nav-box common"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--导航-->
      <div class="left nav">
        <ul class="nav-list">
          <li class="nav-item">
            <a
              href="#"
              class="logo"
            >
            </a>
          </li>
          <li class="nav-item">
            <router-link to="/">
              <!--<span>币币交易</span>-->
              <span>{{$t('M.home')}}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/OTCCenter">
              <span>OTC交易</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/">
              <span>投资理财</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/">
              <span>活动中心</span>
            </router-link>
          </li>
        </ul>
        <ul class="sub-nav-list">
          <li class="sub-nav-item">
            <router-link to="/">子导航</router-link>
          </li>
          <li class="sub-nav-item">
            <router-link to="/">子导航</router-link>
          </li>
          <li class="sub-nav-item">
            <router-link to="/">子导航</router-link>
          </li>
          <li class="sub-nav-item">
            <router-link to="/">子导航</router-link>
          </li>
        </ul>
      </div>
      <!--注册登录-->
      <div class="right login">
        <ul class="ul-list">
          <li class="li-item">
            <!--设置（语言，换肤）-->
            <button
              class="setting"
              @click="toggleShowSettingBox(1)"
            >
              <!--<Icon type="ios-settings-outline" />-->
              <i class="el-icon-setting"></i>
            </button>
          </li>
          <li class="li-item">
            <router-link to="/">
              <span>登录</span>
            </router-link>
          </li>
          <li class="li-split"></li>
          <li class="li-item">
            <router-link to="/">
              <span>注册</span>
            </router-link>
          </li>
          <!--切换语言-->
          <li class="li-item">
            <dl
              class="lang-box"
              @mouseenter="toggleShowLanguageBox(1)"
              @mouseleave="toggleShowLanguageBox(0)"
            >
              <dt
                class="lang-selected"
                v-show="language=='zh_CN'"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-zhongguo"></use>
                </svg>
                <span class="language-text">简体中文</span>
                <!--<Icon type="md-arrow-dropdown" />-->
              </dt>
              <dt
                class="lang-selected"
                v-show="language=='en_US'"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yingguo"></use>
                </svg>
                <span class="language-text">English</span>
                <!--<Icon type="md-arrow-dropdown" />-->
              </dt>
              <dt
                class="lang-selected"
                v-show="language=='zh_TW'"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-fantizhongwen"></use>
                </svg>
                <span class="language-text">繁体中文</span>
                <!--<Icon type="md-arrow-dropdown" />-->
              </dt>
              <dt
                class="lang-selected"
                v-show="language=='ko_KR'"
              >
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-hanguo"></use>
                </svg>
                <span class="language-text">韩语</span>
                <!--<Icon type="md-arrow-dropdown" />-->
              </dt>
              <dd
                class="lang-list"
                v-show="langSelecting"
              >
                <a
                  class="lang-item"
                  href="#"
                  @click="changeLanguage('zh_CN')"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhongguo"></use>
                  </svg>
                  简体中文
                </a>
                <a
                  class="lang-item"
                  href="#"
                  @click="changeLanguage('en_US')"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yingguo"></use>
                  </svg>
                  English
                </a>
                <a
                  class="lang-item"
                  href="#"
                  @click="changeLanguage('zh_TW')"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-fantizhongwen"></use>
                  </svg>
                  繁体中文
                </a>
                <a
                  class="lang-item"
                  href="#"
                  @click="changeLanguage('ko_KR')"
                >
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-hanguo"></use>
                  </svg>
                  韩语
                </a>
              </dd>
            </dl>
          </li>
        </ul>
      </div>
      <!--设置弹窗-->
      <!--<Modal-->
        <!--width="470"-->
        <!--class="nav-box common"-->
        <!--v-model="showSetting"-->
        <!---->

      <!--&gt;-->
      <el-dialog
        :title="settingBoxTitle"
        :visible.sync="showSetting"
        width="470px"
        :before-close="handleClose"
        :class="{day:theme=='day',night:theme=='night' }"
      >
        <p class="title line-height50 font-size14">折算货币</p>
        <!-- 折算货币选择 -->
        <el-select v-model="activeConvertCurrency" placeholder="请选择">
          <el-option
            v-for="item in convertCurrencyList"
            :value="item.value"
            :key="item.value">
          </el-option>

        </el-select>

        <p class="title line-height50 font-size14">主题</p>
        <!-- 主题选择框 -->
        <el-radio-group
          @on-change="changeTheme"
          v-model="activeTheme">
        <el-radio
          v-for="(item,index) in themeList"
          :key="index"
          :label="item.value"
          border
        >{{item.label}}</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button
            size="large"
            type="primary"
            @click="changeSetting"
          >确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions} from 'vuex'
import {setStore} from '../../utils'
export default{
  /*
  * list: {},
    props,
    data () {
      return {}
    },
    created () {},
    mounted () {},
    activited () {},
    update () {},
    beforeRouteUpdate () {},
    methods: {},
    filter: {},
    computed: {},
    watch: {}
  */
  data () {
    return {
      // 语言选择中
      langSelecting: false,
      // 设置弹窗状态
      showSetting: false,
      settingBoxTitle: '设置',
      // 折算货币列表
      convertCurrencyList: [
        {
          value: 'CNY',
          label: '¥ CNY'
        },
        {
          value: 'USDT',
          label: '$ USDT'
        }
      ],
      // 当前折算货币
      activeConvertCurrency: '',
      // 主题列表
      themeList: [
        {
          label: '黑色',
          value: 'night'
        },
        {
          label: '白色',
          value: 'day'
        }
      ],
      activeTheme: ''
    }
  },
  created () {
    console.log(this.theme)
    this.activeTheme = this.theme
  },
  methods: {
    ...mapActions([
      'changeSettingAction'
    ]),
    ...mapMutations([
      // 修改语言
      'CHANGE_LANGUAGE',
      // 修改折算货币
      'CHANGE_CONVERT_CURRENCY',
      // 修改主题
      'CHANGE_THEME'
    ]),
    // 显示状态切换 （设置）
    toggleShowSettingBox (status) {
      console.log(Boolean(status))
      this.showSetting = Boolean(status)
    },
    // 显示状态切换 （语言）
    toggleShowLanguageBox (status) {
      this.langSelecting = Boolean(status)
    },
    // 切换语言
    changeLanguage (e) {
      this.CHANGE_LANGUAGE(e)
      this.$i18n.locale = e
    },
    // 切换主题
    changeTheme (e) {
      console.log(e)
    },
    // 更改设置
    changeSetting () {
      this.CHANGE_THEME(this.activeTheme)
      setStore('theme', this.activeTheme)
      this.CHANGE_CONVERT_CURRENCY(this.activeConvertCurrency)
      setStore('convertCurrency', this.activeConvertCurrency || 'CNY')
      this.toggleShowSettingBox(0)
    }
  },
  computed: {
    ...mapState([
      'theme',
      'language'
    ])
  }
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Common/HeaderCommon.scss";
.nav-box{
  height:66px;
  width:100%;
  background-color:$dayNavBgColor;
  padding:0 30px;
  line-height: 66px;
  box-sizing: border-box;
  >.inner-box{
    display:flex;
    height:100%;
    >.left{
      flex:1;
      position: relative;
      >.nav-list{
        height:100%;
        >.nav-item{
          text-align: center;
          display: inline-block;
          padding:0 25px;
          height:100%;
          vertical-align: top;
          >a{
            color:$fontColor;
          }
          >.logo{
            display:inline-block;
            height:66px;
            width:100px;
            background: url(../../assets/develop/logo.png) no-repeat center center;
            -webkit-background-size: 100px 30px;
            background-size: 100px 30px;
          }
        }
      }
      /*子导航list*/
      >.sub-nav-list{
        position: absolute;
          left:20%;
          height:30px;
          line-height:30px;
        width:100%;
        >.sub-nav-item{
          display: inline-block;
          height:100%;
          background-color: pink;
          padding:0 20px;
        }
      }
    }
    >.right{
      color:#fff;
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
          /*设置*/
          .setting{
            color:#fff;
            cursor:pointer;
            font-size: 20px;
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
              >.icon{
                margin-right:5px;
              }
              >.language-text{
                display:inline-block;
                width:60px;
              }
            }
            >.lang-list{
              position: absolute;
              left:0;
              top:64px;
              >.lang-item{
                transition: all 1s;
                color:#fff;
                display:block;
                height:30px;
                line-height:30px;
                text-align: left;
                width:100%;
                padding:0 20px 0 10px;
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
  &.day{
  }
}
</style>
