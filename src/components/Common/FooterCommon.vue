<template>
  <div class="footer-box common">
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
              <a :href="item.ercodeSrc" class="mini-icon">
                <Iconfont
                  :icon-name="item.iconName"
                  class-name="icon-text"
                />
              </a>
            </li>
          </ul>
        </div>
        <div class="right">
          <dl class="right-dl">
            <dt class="title">
              <!--下载-->
              {{$t('M.comm_download')}}
            </dt>
            <!--<dd class="dd-item">客户端下载</dd>-->
            <dd
              class="dd-item"
            >
              <router-link to="/HelpCenter">
                <!--帮助中心-->
                {{$t('M.comm_help_center')}}
              </router-link>
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
                {{$t('M.comm_about')}}{{$t('M.comm_us')}}
              </router-link>
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/NewsAndNoticeList','notice')"
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
              {{$t('M.user_api_user')}}{{$t('M.comm_agreement')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','PrivacyClause')"
            >
              <!--隐私条款-->
              {{$t('M.comm_privacy')}}{{$t('M.comm_clause')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','LegislationExplain')"
            >
              <!--法律声明-->
              {{$t('M.comm_law')}}{{$t('M.comm_statement')}}
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','Rate')"
            >
              <!--费率-->
              {{$t('M.comm_rate1')}}
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
  // returnAjaxMessage,
  jumpToOtherPageForFooter
} from '../../utils/commonFunc'
import Iconfont from '../Common/IconFontCommon'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('footerInfo')
export default {
  components: {
    Iconfont
  },
  // props,
  data () {
    return {
      shareList: [
        {
          iconName: 'icon-twitter',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-facebook',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-weixin2',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-icon',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-telegram',
          ercodeSrc: ''
        }
      ],
      footerInfo1: {},
      footerInfo2: {},
      linkList: [] // 友情链接
    }
  },
  created () {
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_FOOTER_ACTIVENAME'
    ]),
    jumpToOtherPage (router, activeName) {
      jumpToOtherPageForFooter(router, activeName, this)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      logoSrc: state => state.common.logoSrc,
      footerInfo: state => state.common.footerInfo
    })
  },
  watch: {
    footerInfo (newVal) {
      console.log(newVal)
      if (newVal) {
        this.footerInfo1 = newVal.footerInfo1
        this.footerInfo2 = newVal.footerInfo2
        this.shareList[0].ercodeSrc = this.footerInfo1.twitter
        this.shareList[1].ercodeSrc = this.footerInfo1.facebook
        this.shareList[2].ercodeSrc = this.footerInfo1.weixin
        this.shareList[3].ercodeSrc = this.footerInfo1.qq
        this.shareList[4].ercodeSrc = this.footerInfo1.telegraph_group
      }
    }
  }
}
</script>
<style scoped lang="scss">
  .footer-box{
    width:100%;
    height:410px;
    background-color: #1c2237;
    color:#838dae;
    >.inner-box{
      width:1130px;
      height:300px;
      margin:0 auto;
      padding:50px 0;
      >.top{
        display:flex;
        >div{
          height:200px;
        }
        >.left{
          flex:1;
          >.logo{
            >img{
              width:100px;
            }
          }
          .introduction{
            margin-top:20px;
          }
          /**/
          >.share-box{
            margin-top:20px;
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
                background-color: #CFCFCF;
                border-radius: 50%;
                text-align: center;
                .icon-text{
                  font-size: 16px;
                  color:#1e2636;
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
        padding-top:40px;
        width:100%;
        >.title{
          display:inline-block;
          width:100px;
          height:100px;
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
