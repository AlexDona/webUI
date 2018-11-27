<template>
  <div
    class="footer-box common"
    v-show="!isloading"
    ref="footer"
  >
    <div class="inner-box">
      <!--顶部-->
      <div
        class="top"
      >
        <div
          class="left"
        >
          <!--logo-->
          <div class="logo"
            v-if="footerInfo1.logo"
          >
            <img :src="footerInfo1.logo">
          </div>
          <!--简介-->
          <div
            class="introduction font-size12"
            v-if="footerInfo1.logo"
          >
            {{footerInfo1.content}}
          </div>
          <!--分享-->
          <ul class="share-box">
            <li
              class="share-item"
              v-for="(item,index) in shareList"
              :key="index"
            >
              <a
                :href="item.ercodeSrc"
                class="mini-icon"
                v-show="index!==2 && index!==3"
              >
                <Iconfont
                  :icon-name="item.iconName"
                  class-name="icon-text"
                />
              </a>
              <!--微信-->
              <a
                class="weixin-btn"
                v-show="index==2"
                @mouseenter="toggleShowStatus('weixin',1)"
                @mouseleave="toggleShowStatus('weixin',0)"
              >
                <Iconfont
                  icon-name="icon-weixin-copy"
                  class-name="icon-text icon-weixin"
                >
                </Iconfont>
                <span
                  class="er-code"
                  v-show="isShowWeixin"
                >
                   <img
                     :src="weixinImage"
                   >
                </span>
              </a>
              <a
                class="weixin-btn"
                v-show="index==3"
                @mouseenter="toggleShowStatus('qq',1)"
                @mouseleave="toggleShowStatus('qq',0)"
              >
                <!--qq-->
                <Iconfont
                  icon-name="icon-qq"
                  class-name="icon-text"
                />
                <span
                  class="er-code"
                  v-show="isShowQQ"
                >
                  <img
                    :src="qqImage"
                  >
                </span>
              </a>
            </li>
          </ul>
          <!-- 版权 -->
          <div class="copyright">
            <span
              class="copyright-content"
              v-if="configInfo"
            >
              {{configInfo.copyright}}
            </span>
          </div>
        </div>
        <div class="right">
          <dl class="right-dl">
            <dt class="title">
              <!--下载-->
              {{$t('M.comm_download')}}
            </dt>
            <dd
              class="dd-item"
              v-if="xDomain!=='bithumber.com'"
            >
              <!-- 客户端下载 -->
              <router-link to="/guideOfDownload">{{$t('M.comm_Client_Downloads')}}</router-link>
            </dd>
            <dd
              class="dd-item"
            >
              <router-link to="/HelpCenter">
                <!--帮助中心-->
                {{$t('M.comm_help_center')}}
              </router-link>
              <!--<a-->
                <!--href="http://fubt.udesk.cn/hc"-->
                <!--target="_blank"-->
                <!--v-show="xDomain==='new.bzu.com'"-->
              <!--&gt;-->
                <!--{{$t('M.comm_help_center')}}-->
              <!--</a>-->
              <a
                href="#"
                v-show="xDomain!='new.bzu.com'"
              >
                {{$t('M.comm_help_center')}}
              </a>
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','APIDocument')"
            >
              <!--API文档-->
              {{$t('M.comm_api_doc')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','CurrencyInformation')"
            >
              <!--币种资料-->
              {{$t('M.comm_currency_info')}}
            </dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">
              <!--关于-->
              {{$t('M.comm_about')}}
            </dt>
            <dd
              class="dd-item"
            >
              <router-link to="/AboutUs">
                <!--关于我们-->
                {{$t('M.comm_us')}}
              </router-link>
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/NewsAndNoticeCenter','notice')"
            >
              <!--新闻公告-->
              {{$t('M.comm_news_and_notice')}}
            </dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">
              <!--说明-->
              {{$t('M.comm_description')}}
            </dt>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','UserProtocol')"
            >
              <!--用户协议-->
              <!-- {{$t('M.user_api_user')}}{{$t('M.comm_agreement')}} -->
              {{$t('M.common_footer_user_agreement')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','PrivacyClause')"
            >
              <!--隐私条款-->
              <!-- {{$t('M.comm_privacy')}}{{$t('M.comm_clause')}} -->
              {{$t('M.common_footer_privacy_policy')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','LegislationExplain')"
            >
              <!--法律声明-->
              <!-- {{$t('M.comm_law')}}{{$t('M.comm_statement')}} -->
              {{$t('M.common_footer_legal_notice')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','Rate')"
            >
              <!--费率-->
              {{$t('M.comm_rate1')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','TradingWarning')"
            >
              <!--交易须知-->
              {{$t('M.otc_index_tradeKnow')}}
            </dd>
          </dl>
        </div>
      </div>
      <!--底部友情链接-->
      <div class="bottom">
        <!-- 友情链接 -->
        <span class="title">{{$t('M.common_friendly_link')}}</span>
        <ul class="links-list">
          <li
            class="links-item"
            v-for="(item,index) in footerInfo2.blogrollList"
            :key="index"
          >
            <a
              class="link-item"
              :href="item.link"
              target="_blank"
            >
              <img
                :src="item.logo"
              >
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import {
  // returnAjaxMsg,
  jumpToOtherPageForFooter,
  getNestedData
} from '../../utils/commonFunc'
import {xDomain} from '../../utils/env'
import Iconfont from '../Common/IconFontCommon'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('footerInfo')
export default {
  components: {
    Iconfont,
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {
      weixinImage: '',
      isShowWeixin: false,
      isShowQQ: false,
      qqImage: '',
      shareList: [
        {
          iconName: 'icon-twitter_F',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-facebookfacebook52',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-weixin-copy',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-qq',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-telegram1',
          ercodeSrc: ''
        }
      ],
      footerInfo1: {},
      footerInfo2: {},
      linkList: [], // 友情链接
      isloading: true
    }
  },
  created () {
    console.log(xDomain)
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_FOOTER_ACTIVENAME'
    ]),
    toggleShowStatus (type, data) {
      switch (type) {
        case 'weixin':
          this.isShowWeixin = data
          break
        case 'qq':
          this.isShowQQ = data
          break
      }
    },
    jumpToOtherPage (router, activeName) {
      jumpToOtherPageForFooter(router, activeName, this)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      logoSrc: state => state.common.logoSrc,
      footerInfo: state => state.common.footerInfo,
      footerInfo1: state => state.common.footerInfo.footerInfo1,
      // 公司名称fubt fbt fuc、邮箱等信息
      configInfo: state => state.common.footerInfo.configInfo
    }),
    xDomain () {
      return xDomain
    }
  },
  watch: {
    configInfo (newVal) {
      console.log(newVal)
    },
    footerInfo1 (newVal) {
      console.log(newVal)
    },
    footerInfo: {
      handler (newVal) {
        console.log(newVal)
        if (newVal) {
          this.isloading = false
          this.footerInfo1 = newVal.footerInfo1
          this.footerInfo2 = newVal.footerInfo2
          console.log(this.footerInfo2)
          this.shareList[0].ercodeSrc = getNestedData(this.footerInfo1, 'twitter')
          this.shareList[1].ercodeSrc = getNestedData(this.footerInfo1, 'facebook')
          this.weixinImage = getNestedData(this.footerInfo1, 'weixinImage')
          this.qqImage = getNestedData(this.footerInfo1, 'qqImage')
          this.shareList[4].ercodeSrc = getNestedData(this.footerInfo1, 'telegraph_group')
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
  .footer-box{
    width:100%;
    // height:410px;
    // height:330px;
    background-color: #1c2237;
    color:#838dae;
    >.inner-box{
      width: 1130px;
      // height: 300px;
      margin: 0 auto;
      padding: 20px 0;
      >.top{
        display:flex;
        margin-bottom: 10px;
        >div{
          // height:200px;
        }
        >.left{
          flex:1;
          >.logo{
            >img{
              width:100px;
            }
          }
          .introduction{
            margin-top:10px;
          }
          /**/
          >.share-box{
            margin-top:26px;
            >.share-item{
              position: relative;
              width:20px;
              height:20px;
              display:inline-block;
              margin-right:10px;
              >.mini-icon{
                display:inline-block;
                width:22px;
                height:22px;
                line-height:22px;
                /*background-color: #CFCFCF;*/
                border-radius: 50%;
                text-align: center;
                .icon-text{
                  font-size: 22px;
                }
              }
              >.icon-weixin{

              }
              >.weixin-btn{
                position: relative;
                >.er-code{
                  position: absolute;
                  left:50%;
                  transform: translate(-50%,0);
                  top:-110px;
                  width:100px;
                  height:100px;
                  padding:4px;
                  background-color: #fff;
                  >img{
                    width:100%;
                    height:100%;
                  }
                }
              }
              >.hidden-box{
                width:110px;
                height:110px;
                background-color: green;
                position: absolute;
                top:-120px;
                left:50%;
                transform: translate(-50%,0);
                >img{
                  width:110px;
                }
              }
            }
          }
          >.copyright{
            margin-top: 10px;
            >.copyright-content{
              color: #CECECE;
              font-size: 12px;
            }
          }
        }
        >.right{
          flex:1;
          justify-content: center;
          display:flex;
          >.right-dl{
            flex:1;
            margin-left:5%;
            >.title{
              height:50px;
              line-height:50px;
            }
            >.dd-item{
              line-height: 25px;
              cursor: pointer;
              >a{
                color:#838dae;
              }
            }
          }
        }
      }
      >.bottom{
        border-top:1px solid rgba(67,74,95,0.5);
        padding-top:15px;
        width:100%;
        >.title{
          display:inline-block;
          width:100px;
          // height:100px;
          vertical-align: top;
        }
        >.links-list{
          display:inline-block;
          width:1026px;
          >.links-item{
            /*width:60px;*/
            height:20px;
            display:inline-block;
            margin-right:30px;
            >.link-item{
              >img{
                width:100%;
                height:100%;
              }
            }
          }
        }
      }
    }
  }
</style>
