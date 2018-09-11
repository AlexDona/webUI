<template>
  <div
    class="vip-main personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--头部-->
    <HeaderCommon/>
    <div class="header-content">
      <img
        class="images"
        :src="vipPictureBanner"
      >
    </div>
    <div class="content-main-content">
      <!--开通vip页面-->
      <div class="content-main display-flex">
        <div class="content-module cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP1
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">九折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <div class="content-module content-border-rl cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP2
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">八折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <div class="content-module cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP3
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">七折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <div class="content-module margin-top30 cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP4
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">六折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <div class="content-module margin-top30 content-border-rl cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP5
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">五折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <div class="content-module margin-top30 cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP6
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">四折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button class="click-btn cursor-pointer">立即开通</button>
          </p>
        </div>
        <p class="content-info-hint text-align-r padding-right23 box-sizing font-size12">
          <span>还没有FUC?</span>
          <span
            class="hint-color cursor-pointer"
            @click="returnSuperior"
          >
            立即购买
          </span>
        </p>
      </div>
      <!--开通vip详情页面-->
      <div class="content-detail-page">
        <div class="detail-page-grade display-flex">
          <div class="page-grade-title font-size14">开通等级</div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP1</p>
            <p class="font-size12 grade-height">手续费9折</p>
          </div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP2</p>
            <p class="font-size12 grade-height">手续费8折</p>
          </div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP3</p>
            <p class="font-size12 grade-height">手续费7折</p>
          </div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP4</p>
            <p class="font-size12 grade-height">手续费6折</p>
          </div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP5</p>
            <p class="font-size12 grade-height">手续费5折</p>
          </div>
          <div class="grade cursor-pointer text-align-c">
            <p class="font-size16 grade-color font-weight600">VIP6</p>
            <p class="font-size12 grade-height">手续费4折</p>
          </div>
        </div>
        <div class="detail-page-duration display-flex">
          <div class="duration-title font-size14">开通时长</div>
          <div class="duration cursor-pointer cursor-pointer text-align-c">
            <p class="duration-month font-size16">3个月</p>
            <p class="duration-currency font-size18">100FUC</p>
          </div>
          <div class="duration duration-left cursor-pointer text-align-c">
            <p class="duration-month font-size16">6个月</p>
            <p class="duration-currency font-size18">100FUC</p>
            <p class="duration-through ">600FUC</p>
          </div>
          <div class="duration duration-left cursor-pointer text-align-c">
            <p class="duration-month font-size16">12个月</p>
            <p class="duration-currency font-size18">100FUC</p>
            <p class="duration-through">1200FUC</p>
          </div>
          <div class="duration duration-left cursor-pointer text-align-c">
            <p class="duration-month font-size16">1个月</p>
            <p class="duration-currency font-size18">100FUC</p>
          </div>
        </div>
        <div class="detail-usable display-flex">
          <div class="usable-title font-size14">可用</div>
          <div class="usable">
            <span class="usable-asset font-size16">
              0.0000
              <sub class="currency font-size12">FUC</sub>
            </span>
            <span class="usable-gain cursor-pointer font-size12 display-inline-block">立即获取</span>
          </div>
        </div>
        <div class="detail-page-btn text-align-c">
          <button class="page-btn">
            确定
          </button>
        </div>
      </div>
      <div class="text-below box-sizing font-size12">
        <p class="font-size14 warm-prompt">温馨提示:</p>
        <p>
          <span class="warm-text-color">VIP开通后立即生效，交易结算时自动计算折扣</span>
          <span class="prompt-color">《折扣说明》</span>
        </p>
        <p class="warm-text-color">费率折扣仅对交易手续费生效</p>
        <p class="warm-text-color">一个月有效期时长为30个自然日</p>
        <p class="warm-text-color">开通即代表您已同意<span class="prompt-color">《VIP服务协议》</span></p>
      </div>
    </div>
    <!--底部-->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    FooterCommon // 底部
  },
  data () {
    return {
      vipPictureBanner: require('../../../assets/user/vipBanner.png') // vip banner
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/VipMainContent/VipMainContent.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/VipMainContent/VipMainContentDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/VipMainContent/VipMainContentNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
      this.$router.push({path: '/PersonalCenter'})
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/VipMainContent/VipMainContent";
  .vip-main {
    > .header-content {
      /*height: 600px;*/
      width: 100%;
      margin: 0 auto;
      .images {
        width: 100%;
      }
    }
    > .content-main-content {
      > .content-main {
        width: 756px;
        min-height: 800px;
        margin: 0 auto;
        flex-wrap: wrap;
        > .content-module {
          flex-wrap: wrap;
          width: 250px;
          height: 380px;
          > .content-vip-one {
            height: 112px;
            line-height: 112px;
            font-size: 36px;
          }
          > .content-discount,
          > .content-text {
            height: 50px;
          }
          > .content-button {
            height: 115px;
            text-align: center;
            > .click-btn {
              width: 180px;
              height: 40px;
              transform: skew(-15deg);
              margin-top: 35px;
            }
          }
        }
        > .content-info-hint {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }
      }
      > .content-detail-page {
        width: 900px;
        min-height: 500px;
        margin: 0 auto;
        > .detail-page-grade {
          > .page-grade-title {
            line-height: 70px;
          }
          .grade {
            width: 100px;
            height: 70px;
            border: 1px solid #354057;
            margin-left: 40px;
            padding: 13px;
            /*>.grade-color {*/
              /**/
            /*}*/
            >.grade-height {
              margin-top: 5px;
            }
          }
        }
        > .detail-page-duration {
          margin-top: 100px;
          > .duration-title {
            width: 100px;
            height: 150px;
            line-height: 150px;
          }
          > .duration {
            width: 140px;
            height: 150px;
            padding: 30px;
            >.duration-currency {
              padding: 8px 0 8px;
            }
            >.duration-through {
              text-decoration: line-through;
            }
          }
          > .duration-left {
            margin-left: 60px;
          }
        }
        >.detail-usable {
          margin: 100px 0 80px;
          >.usable-title {
            width: 100px;
          }
          >.usable {
            width: 500px;
            >.usable-asset {
              >.currency {
                margin-left: 5px;
              }
            }
            >.usable-gain {
              margin-left: 25px;
            }
          }
        }
        >.detail-page-btn {
          width: 100%;
          height: 40px;
          margin-bottom: 50px;
          >.page-btn {
            width: 290px;
            height: 40px;
          }
        }
      }
      > .text-below {
        width: 756px;
        height: 350px;
        margin: 0 auto;
        padding-top: 80px;
        line-height: 25px;
        > .warm-prompt {
          font-weight: 600;
        }
      }
    }
    &.night {
      background-color: $nightBgColor;
      color: $nightFontColor;
      > .header-content {
        /*background-color: red;*/
        /*margin: 0 auto;*/
      }
      > .content-main-content {
        margin-top: -3px;
        background: rgba(18, 24, 36, 1);
        > .content-main {
          > .content-module {
            background-color: #232D39;
            border: 2px solid #33404B;
            &:hover {
              border: 4px solid #338FF5;
              transform: scale(1.03);
              box-shadow: 0 0 15px rgba(0, 0, 0, 1);
              > .content-text {
                font-weight: 600;
                color: rgba(51, 143, 245, 1);
              }
              > .content-discount {
                background-color: #1E2832;
                color: rgba(255, 255, 255, 1);
                > .content-discount-color {
                  font-weight: 600;
                  color: rgba(51, 143, 245, 1);
                }
              }
              > .content-button {
                > .click-btn {
                  background: #338FF5;
                  color: #fff;
                }
              }
            }
            > .content-vip-one {
              color: #fff;
            }
            > .content-text {
              color: rgba(51, 143, 245, 0.6);;
            }
            > .content-discount {
              background-color: #1E2832;
              color: rgba(255, 255, 255, 0.6);
              > .content-discount-color {
                color: rgba(51, 143, 245, 0.6);
              }
            }
            > .content-button {
              > .click-btn {
                background: linear-gradient(0deg, rgba(41, 52, 64, 1) 0%, rgba(52, 62, 71, 1) 100%);
                color: #fff;
              }
            }
          }
          > .content-info-hint {
            > .hint-color {
              color: #338FF5;
            }
          }
          > .content-border-rl {
            border-right: 0;
            border-left: 0;
          }
        }
        > .content-detail-page {
          >.detail-page-grade {
            .grade {
              background-color: #1A2233;
              border: 1px solid #354057;
              &:hover {
                background-color: transparent;
                border: 1px solid #338FF5;
                >.grade-color,
                >.grade-height {
                  color: #338FF5;
                }
              }
              >.grade-color {
                color: #fff;
              }
              >.grade-height {
                color: #9DA5B3;
              }
            }
          }
          >.detail-page-duration {
            > .duration {
              background-color: #1A2233;
              border: 1px solid #354057;
              >.duration-month {
                color: #fff;
              }
              >.duration-currency {
                color: #D45858;
              }
              >.duration-through {
                color: #9DA5B3;
              }
            }
          }
          >.detail-usable {
            >.usable {
              >.usable-asset {
                color: #D45858;
                font-weight: 600;
                >.currency {
                  color: #fff;
                }
              }
              >.usable-gain {
                color: #338FF5;
              }
            }
          }
          >.detail-page-btn {
            >.page-btn {
              color: #fff;
              background:linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
              border-radius:4px;
            }
          }
          > .text-below {
            > .warm-prompt {
              color: #fff;
            }
            .prompt-color {
              color: #D45858;
            }
            .warm-text-color {
              color: #9DA5B3;
            }
          }
        }
        &.day {
          background-color: $dayBgColor;
          color: $dayFontColor;
          /*>.header-content {*/
          /**/
          /*}*/
          /*>.content-main {*/
          /**/
          /*}*/
          /*>.text-below {*/
          /**/
        }
      }
    }
  }
</style>
