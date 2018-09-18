<template>
  <div class="footer-box common">
    <div class="inner-box">
      <!--顶部-->
      <div
        class="top"
       v-if="footerInfo1.logo"
      >
        <div class="left">
          <!--logo-->
          <div class="logo"
          >
            <img :src="footerInfo1.logo.url">
          </div>
          <!--简介-->
          <div class="introduction font-size12">
            {{footerInfo1.logo.content}}
          </div>
          <!--分享-->
          <ul class="share-box">
            <li
              class="share-item"
              v-for="(item,index) in shareList"
              :key="index"
            >
              <a href="#" class="mini-icon">
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
            <dt class="title">下载</dt>
            <!--<dd class="dd-item">客户端下载</dd>-->
            <dd
              class="dd-item"
            >
              <router-link to="/HelpCenter">
                帮助中心
              </router-link>
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','APIDocument')"
            >API文档</dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','CurrencyInformation')"
            >币种资料</dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">关于</dt>
            <dd
              class="dd-item"
            >
              <router-link to="/AboutUs">关于我们</router-link>
            </dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/NewsAndNoticeList','notice')"
            >新闻公告</dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">说明</dt>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','ClauseExplain')"
            >条款说明</dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','UserProtocol')"
            >用户协议</dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','PrivacyClause')"
            >隐私条款</dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','LegislationExplain')"
            >法律声明</dd>
            <dd
              class="dd-item"
              @click="jumpToOtherPage('/ServiceAndProtocol','Rate')"
            >费率</dd>
          </dl>
        </div>
      </div>
      <!--底部友情链接-->
      <div class="bottom">
        <span class="title">友情链接</span>
        <ul class="links-list">
          <li
            class="links-item"
            v-for="(item,index) in linkList"
            :key="index"
          >
            <a
              class="link-item"
              :href="item.link"
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
  getFooterInfo1,
  getFooterInfo2
} from '../../utils/api/header'
import {returnAjaxMessage} from '../../utils/commonFunc'
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
      ercodeImgSrc: 'https://old.fubt.top/front/images/index/wechat.jpg',
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
    this.getFooterInfo()
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
      this.CHANGE_FOOTER_ACTIVENAME({
        activeName,
        type: router
      })
      this.$router.push({path: router})
    },
    async getFooterInfo () {
      const params = {
        partnerId: this.partnerId,
        language: this.language
      }
      const data1 = await getFooterInfo1(params)
      const data2 = await getFooterInfo2(params)
      console.log(data1)
      console.log(data2)
      if (!returnAjaxMessage(data1, this) && !returnAjaxMessage(data2, this)) {
        return false
      } else {
        this.footerInfo1 = data1.data.data
        this.shareList[0].ercodeSrc = this.footerInfo1.twitter
        this.shareList[1].ercodeSrc = this.footerInfo1.facebook
        this.shareList[2].ercodeSrc = this.footerInfo1.weixin
        this.shareList[3].ercodeSrc = this.footerInfo1.qq
        this.shareList[4].ercodeSrc = this.footerInfo1.telegraph_group
        this.footerInfo2 = data2.data.data
        //   console.log(this.footerInfo2)
        // console.log(this.footerInfo2)
        this.linkList = this.footerInfo2.blogrollList
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      language: state => state.common.language
    })
  },
  watch: {}
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
            width:60px;
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
