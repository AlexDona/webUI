<!--
  author: zhaoxinlei
  update: 20190823
  description: 当前组件为公共底部组件
-->
<template lang="pug">
  .footer-box.common#footerDiv
    .inner-box
      .top
        .left
          .logo(v-if="footerInfo1.logo")
            img(:src="http2https(footerInfo1.logo)")
          //  简介
          .introduction.font-size12(v-if="footerInfo1.logo") {{footerInfo1.content}}
        .right
          dl.right-dl
            // 下载
            dt.title {{$t('M.comm_download')}}
            // API文档
            dd.dd-item
              a(
                :href="APIUrl"
                target="_blank"
              ) {{$t('M.comm_api_doc')}}
            // 上币申请
            dd.dd-item
              // 20190813周期增加了上币申请第三方表单提交申请页面：有URL就按照URL跳转 没有就跳转本项目上币申请页面
              a(
                v-if="configInfo.listingUrl"
                :href="configInfo.listingUrl"
                target="_blank"
              ) {{$t('M.actionCenter_coin_apply')}}
              router-link(
                v-else
                to="/CurrencyApplication"
              ) {{$t('M.actionCenter_coin_apply')}}
            // 币种资料
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','CurrencyInformation')") {{$t('M.comm_currency_info')}}
            // 客户端下载
            dd.dd-item(v-if="isNeedApp")
              router-link(:to="downloadAppSrc") {{$t('M.comm_Client_Downloads')}}
          // 关于
          dl.right-dl
            dt.title {{$t('M.footer_about_label')}}
            // 新闻公告
            dd.dd-item(@click="$footerJump(`/${$routes_X.news}`,'notice')")  {{$t('M.comm_news_and_notice')}}
            // 帮助中心
            dd.dd-item
              router-link(to="/HelpCenter") {{$t('M.comm_help_center')}}
            // 交易须知
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','TradingWarning')")  {{$t('M.otc_index_tradeKnow')}}
             // 关于反洗钱
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','AML')")  {{$t('M.about_digital_terms_hint10')}}
          //  条款
          dl.right-dl
            dt.title {{$t('M.comm_clause')}}
            // 费率
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','Rate')") {{$t('M.comm_rate1')}}
            // 用户协议
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','UserProtocol')") {{$t('M.common_footer_user_agreement')}}
            // 隐私条款
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','PrivacyClause')") {{$t('M.common_footer_privacy_policy')}}
            // 法律声明
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','LegislationExplain')") {{$t('M.common_footer_legal_notice')}}
            // OTC 服务协议
            dd.dd-item(@click="$footerJump('/ServiceAndProtocol','OTCServices')") {{$t('M.about_digital_terms_hint8')}}
          //  服务
          dl.right-dl
            dt.title {{$t('M.footer_service_label')}}
            .email
              // 客服邮箱
              span.email-content(v-if="configInfo['otcEmail']") {{$t('M.footer_service_email')}}: {{configInfo['otcEmail']}}
              br
              // 投诉邮箱
              span.email-content(v-if="configInfo['complaintEmail']") {{$t('M.footer_complaint_email')}}: {{configInfo['complaintEmail']}}
            ul.share-box
              li.share-item(
                v-for="(item,index) in shareList"
                :key="index"
              )
                a.mini-icon(
                  :href="http2https(item.ercodeSrc)"
                  v-show="index!==2 && index!==3"
                )
                  Iconfont(
                    :icon-name="item.iconName"
                    class-name="icon-text"
                    )
                a.weixin-btn(
                  v-show="index==2"
                  @mouseenter="toggleShowStatus('weixin',1)"
                  @mouseleave="toggleShowStatus('weixin',0)"
                )
                  Iconfont(
                    icon-name="icon-weixin2"
                    class-name="icon-text"
                  )
                  span.er-code(v-show="isShowWeixin")
                    img(:src="weixinImage")
                a.weixin-btn(
                  v-show="index==3"
                  @mouseenter="toggleShowStatus('qq',1)"
                  @mouseleave="toggleShowStatus('qq',0)"
                )
                  Iconfont(
                    icon-name="icon-QQ"
                    class-name="icon-text"
                  )
                  span.er-code(v-show="isShowQQ")
                    img(:src="qqImage")
      .bottom
        // 战略合作
        LinksItem(
          :title="$t('M.common_foot_cooperation_label')"
          :links="cooperations"
          :isShowLogo="isShowCooperationLogo"
          v-if="cooperationsLength"
        )
        // 友情链接
        LinksItem(
          :title="$t('M.common_friendly_link')"
          :links="friendlyLinks"
          :isShowLogo="isShowFriendlyLinksLogo"
          v-if="friendlyLinksLength"
        )
      .copyright
        p {{configInfo['copyright']}}
</template>
<script>
import {
  getNestedData,
  http2https
} from '../../../utils/commonFunc'
import Iconfont from '../IconFontCommon'
import LinksItem from './LinksItem'
import {
  mapMutations,
  mapState,
  mapGetters,
  mapActions
} from 'vuex'
export default {
  components: {
    Iconfont,
    LinksItem
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
          iconName: 'icon-tuite1',
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
          iconName: 'icon-QQ',
          ercodeSrc: ''
        },
        {
          iconName: 'icon-send',
          ercodeSrc: ''
        }
      ],
      footerInfo1: {},
      footerInfo2: {},
      linkList: [], // 友情链接
      // 上币申请模板下载url
      currencyApplicationURL: '',
      APIUrl: 'https://github.com/bizuyun/API'
    }
  },
  async created () {
    const data = await this.GET_CURRENCY_URL_ACTION({
      key: 'COIN_APPLY'
    })
    if (!data) return false
    this.currencyApplicationURL = data
  },
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions(['GET_CURRENCY_URL_ACTION']),
    ...mapMutations([
      'CHANGE_FOOTER_ACTIVE_NAME',
      'SAVE_FOOTER_HEIGHT'
    ]),
    http2https (str) {
      return http2https(str)
    },
    toggleShowStatus (type, data) {
      switch (type) {
        case 'weixin':
          this.isShowWeixin = data
          break
        case 'qq':
          this.isShowQQ = data
          break
      }
    }
  },
  updated () {
    let footerDivHeight = document.getElementById('footerDiv').clientHeigh || document.getElementById('footerDiv').offsetHeight
    console.log(footerDivHeight)
    this.SAVE_FOOTER_HEIGHT(footerDivHeight)
  },
  // filter: {},
  computed: {
    ...mapGetters({
      'isNeedApp': 'isNeedApp'
    }),
    ...mapState({
      footerInfo: state => state.common.footerInfo,
      // 公司名称fubt fbt fuc、邮箱等信息
      configInfo: state => state.common.footerInfo.configInfo,
      isMobile: state => state.user.isMobile
    }),
    downloadAppSrc () {
      const {downloadApp, guideOfDownload} = this.$routes_X
      return this.mobile ? `${downloadApp}` : `/${guideOfDownload}`
    },
    isShowCooperationLogo () {
      return _.get(this.footerInfo, 'footerInfo2.cooperationFlag')
    },
    // 战略合作内容
    cooperations () {
      return _.get(this.footerInfo, 'footerInfo2.blogrollList.cooperation')
    },
    cooperationsLength () {
      return _.get(this.cooperations, 'length')
    },
    isShowFriendlyLinksLogo () {
      return _.get(this.footerInfo, 'footerInfo2.blogrollFlag')
    },
    // 友情链接内容
    friendlyLinks () {
      return _.get(this.footerInfo, 'footerInfo2.blogrollList.blogroll')
    },
    friendlyLinksLength () {
      return _.get(this.friendlyLinks, 'length')
    }
  },
  watch: {
    footerInfo: {
      handler (newVal) {
        if (newVal) {
          this.footerInfo1 = newVal.footerInfo1
          this.footerInfo2 = newVal.footerInfo2
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
<style scoped lang="scss" type="text/scss">
  .footer-box {
    box-sizing: border-box;
    width: 100%;
    min-width: 1288px;
    color: #838dae;
    background-color: #1c1f32;

    > .inner-box {
      width: 1300px;
      padding: 20px 0;
      margin: 0 auto;

      > .top {
        display: flex;
        margin-bottom: 10px;

        > .left {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;

          > .logo {
            > img {
              width: 100px;
            }
          }

          .introduction {
            margin-top: 10px;
          }
        }

        > .right {
          display: flex;
          flex: 3;
          justify-content: center;

          > .right-dl {
            flex: 1;
            margin-left: 5%;

            > .title {
              height: 50px;
              font-size: 12px;
              line-height: 50px;
              color: #fff;
            }

            > .dd-item {
              font-size: 12px;
              line-height: 25px;
              color: #838dae;
              cursor: pointer;

              &:hover {
                color: #fff;

                > a {
                  color: #fff;
                }
              }

              > a {
                color: #838dae;
              }
            }

            > .email {
              > .email-content {
                font-size: 12px;
                line-height: 25px;
                color: #838dae;
              }
            }

            > .share-box {
              margin-top: 5px;

              > .share-item {
                position: relative;
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 10px;

                > .mini-icon {
                  display: inline-block;
                  width: 22px;
                  height: 22px;
                  border-radius: 50%;
                  line-height: 22px;
                  text-align: center;

                  .icon-text {
                    font-size: 22px;
                    background-color: #1c2237;
                  }
                }

                > .weixin-btn {
                  position: relative;

                  > .er-code {
                    position: absolute;
                    top: -110px;
                    left: 50%;
                    width: 100px;
                    height: 100px;
                    padding: 4px;
                    background-color: #fff;
                    transform: translate(-50%, 0);

                    > img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }

                > .hidden-box {
                  position: absolute;
                  top: -120px;
                  left: 50%;
                  width: 110px;
                  height: 110px;
                  background-color: green;
                  transform: translate(-50%, 0);

                  > img {
                    width: 110px;
                  }
                }
              }
            }
          }
        }
      }

      > .bottom {
        width: 100%;
        padding-top: 15px;
        border-top: 1px solid rgba(67, 74, 95, .5);
      }

      > .copyright {
        height: 30px;
        line-height: 30px;

        > p {
          font-size: 12px;
          text-align: center;
        }
      }
    }

    /* 设置底部字体图标微信QQ等为22px */
    /deep/ {
      .icon {
        font-size: 22px;
      }
    }
  }
</style>
