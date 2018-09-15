<template>
  <div
    class="user-info personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="user-info-main">
      <div class="user-info-content-box">
        <div class="user float-left">
          <p class="user-background text-align-c line-height56">
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-yonghu1"
            />
          </p>
          <p class="text-align-c margin-top16">
            <span>UID:</span>
            <span>{{ userInfo.userInfo.showId }}</span>
          </p>
        </div>
        <div class="info float-left">
          <p class="info-top">
            <!--未实名-->
            <span
              v-if="!userInfo.userInfo.realname"
              class="icon-user-info info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-yonghu"
              />
            </span>
            <!--已实名-->
            <span
              v-else
              class="real-name info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-yonghu"
              />
            </span>
            <!--未绑定邮箱-->
            <span
              v-if="!userInfo.userInfo.email"
              class="icon-user-info info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-xin-copy"
              />
            </span>
            <!--已绑定邮箱-->
            <span
              v-else
              class="real-name info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-xin-copy"
              />
            </span>
            <!--未绑定绑定手机-->
            <span
              v-if="!userInfo.userInfo.phone"
              class="icon-user-info info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size20 icon-color"
                iconName="icon-shouji"
              />
            </span>
            <!--已绑定绑定手机-->
            <span
              v-else
              class="real-name info-right display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size20 icon-color"
                iconName="icon-shouji"
              />
            </span>
            <!--未绑定谷歌-->
            <span
              v-if="!userInfo.userInfo.googleSecretKey"
              class="icon-user-info display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-google"
              />
            </span>
            <!--已绑定谷歌-->
            <span
              v-else
              class="real-name display-inline-block text-align-c"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-google"
              />
            </span>
          </p>
          <div class="info-centre margin-top16">
            <span class="info-centre-left float-left font-size12">会员等级 -</span>
            <p class="info-picture margin-left10 float-left">
              <img :src="vipShowPictureSrc">
              <span class="info-centre-right font-size12">{{ userShowVipGrade }}</span>
            </p>
          </div>
          <p class="info-discount margin-top45">
            <span class="discount-text font-size12">折扣率</span>&nbsp;
            <span class="discount-state font-size12">{{ discountRate }}</span>
          </p>
          <p></p>
        </div>
        <!--<div class="volume float-left">-->
          <!--<p class="volume-text font-size12">近30天交易量</p>-->
          <!--<p class="volume-info margin-top9">-->
            <!--<span class="info-color font-size16">{{ BTCAssets }}</span>-->
            <!--<span class="info-color font-size12">BTC</span>-->
            <!--或-->
            <!--<span class="info-color font-size16">{{ CNYAssets }}</span>-->
            <!--<span class="info-color font-size12">CNY</span>-->
          <!--</p>-->
        <!--</div>-->
        <div class="asset float-left">
          <p class="asset-text font-size12">当前资产总估值</p>
          <p class="asset-info margin-top9">
            <span class="info-color font-size16">{{ BTCAssets }}</span>
            <span class="info-color font-size12">BTC</span>
            或
            <span class="info-color font-size16">{{ CNYAssets }}</span>
            <span class="info-color font-size12">CNY</span>
          </p>
          <p class="asset-color margin-top9 font-size12">
            （注：资产总估仅提供参考，请以单项资金为准）
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      showStateUserInfo: {}, // 获取全局个人信息
      vipShowPictureSrc: require('../../../assets/user/vip.png'), // VIP图片
      userShowVipGrade: 'V1', // 自定义VIP等级
      discountRate: '无', // 自定义折扣率
      BTCAssets: '0.0000', // btc资产
      CNYAssets: '0.0000' // bcny资产
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/UserInfo.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/UserInfoDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/UserInfoNight.css')
    // 获取全局个人信息
    // this.showStateUserInfo = this.userInfo.data.user
    // console.log(this.userInfo.userInfo)
    console.log(this.userInfo.userInfo.realname)
    console.log(this.userInfo.userInfo.email)
    console.log(this.userInfo.userInfo.phone)
    console.log(this.userInfo.userInfo.googleAccount)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info // 用户详细信息
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountBalance/UserInfo";
  .user-info{
    >.user-info-main{
      height: 130px;
      padding: 16px 0;
      >.user-info-content-box {
        height: 100%;
        >.user,
        >.info,
        >.volume,
        >.asset {
          height: 100%;
        }
        >.user {
          width: 146px;
          >.user-background {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            margin: 0 auto;
          }
        }
        >.info {
          width: 234px;
          >.info-top {
            padding: 0 40px;
            >.icon-user-info,
            >.real-name {
              width: 26px;
              height: 26px;
              border-radius: 50%;
              line-height: 22px;
            }
            >.info-right {
              margin-right: 12px;
            }
          }
          >.info-centre {
            padding: 0 40px;
            >.info-picture {
              position: relative;
              >.info-centre-right{
                position: absolute;
                top: 0;
                left: 22px;
              }
            }
          }
          >.info-discount {
            padding: 0 40px;
            >.discount-text {

            }
          }
        }
        >.volume {
          width: 242px;
          >.volume-text {
            padding: 0 25px;
            margin-top: 23px;
          }
          >.volume-info {
            padding: 0 25px;
          }
        }
        >.asset {
          width: 295px;
          >.asset-text {
            padding: 0 20px;
            margin-top: 23px;
          }
          >.asset-info {
            padding: 0 20px;
          }
          >.asset-color {
            padding: 0 15px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.user-info-main{
        background-color: #1E2636;
        >.user-info-content-box {
          >.user,
          >.info,
          >.volume {
            border-right: 1px solid rgba(97,116,153,0.1);
          }
          >.user {
            >.user-background{
              background:linear-gradient(90deg,rgba(43,57,110,1),rgba(42,80,130,1));
              .icon-user {
                color: #E1F3FF;
              }
            }
          }
          >.info {
            >.info-top {
              >.icon-user-info,
              >.real-name {
                background-color: #46525D;
                >.icon-color {
                  color: #fff;
                }
              }
              >.real-name {
                background-color: #338FF5;
              }
            }
            >.info-centre {
              >.info-picture {
                >.info-centre-right {
                    color: #fff;
                }
              }
              >.info-centre-left {
                color: #9DA5B3;
              }
            }
            >.info-discount {
              >.discount-text {
                color: #9DA5B3;
              }
              >.discount-state {
                color: #fff;
              }
            }
          }
          >.volume,
          >.asset{
            >.volume-text,
            >.asset-text {
              color: #9DA5B3;
            }
            >.volume-info,
            >.asset-info {
              >.info-color {
                color: #fff;
              }
            }
            >.asset-color {
              color: #9DA5B3;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      /*>.user-info-main{*/
        /*>.user-info-content-box,*/
        /*>.user-info-content {*/
          /*background-color: #1E2636;*/
        /*}*/
        /*>.user-info-content {*/
          /*min-height: 500px;*/
        /*}*/
      /*}*/
    }
  }
</style>
