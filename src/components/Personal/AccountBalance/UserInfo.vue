<template>
  <div
    class="user-info personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="user-info-main">
      <div class="user-info-content-box display-flex">
        <div class="user float-left flex1">
          <p class="user-background text-align-c line-height56 float-left">
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-yonghu1"
            />
          </p>
          <div class="text-align-id margin-top16 float-right">
            <p class="font-size12">
              <span class="text-color">
                <!--您好，-->
                {{ $t('M.comm_hello') }}
              </span>
              <span class="color">
                {{ innerUserInfo.userName }}
              </span>
            </p>
            <span class="display-inline-block margin-top9 text-color">
              UID： {{ innerUserInfo.showId }}
            </span>
          </div>
        </div>
        <div class="info float-left flex1">
          <p class="info-top">
            <!--未实名-->
            <span
              v-if="!innerUserInfo.realname"
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
              v-if="!innerUserInfo.email"
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
              v-if="innerUserInfo.phoneEnable === 'disable' || innerUserInfo.phoneEnable === ''"
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
              v-if="innerUserInfo.googleEnable === 'disable' || innerUserInfo.googleEnable === ''"
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
            <span class="info-centre-left float-left font-size12">
              <!--会员等级 - -->
              {{ $t('M.user_assets_grade_membership') }} -
            </span>
            <p class="info-picture margin-left10 float-left">
              <img :src="vipShowPictureSrc">
              <span
                v-if="!innerUserInfo.level"
                class="info-centre-right font-size12"
              >
                VIP0
              </span>
              <span
                v-else
                class="info-centre-right font-size12"
              >
                <!-- {{ userInfo.userInfo.level }} -->
                {{ innerUserInfo.level }}
              </span>
            </p>
          </div>
          <!--<p class="info-discount margin-top45">-->
            <!--<span class="discount-text font-size12">折扣率</span>&nbsp;-->
            <!--<span class="discount-state font-size12">{{ discountRate }}</span>-->
          <!--</p>-->
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
        <div class="asset float-left flex1">
          <p class="asset-text font-size12">
            <!--当前资产总估值-->
            {{ $t('M.user_assets_current_total') }}
          </p>
          <p class="asset-info margin-top9">
            <span class="info-color font-size16">
              {{ totalSumBTC }}
            </span>
            <span class="info-color font-size12">
              BTC
            </span>
            <span
              class="info-color"
              v-show="CNYAssets"
            >
              <!--或-->
               {{ $t('M.user_assets_or') }}
              <span class="info-color font-size16">
                {{ CNYAssets }}
              </span>
              <span class="info-color font-size12">
                CNY
              </span>
            </span>
          </p>
          <p class="asset-color margin-top9 font-size12">
            （{{ $t('M.user_assets_attention') }}）
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {
  assetCurrenciesList,
  userRefreshUser,
  currencyTransform
} from '../../../utils/api/personal'
import {
  returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
export default {
  components: {
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      userInfoRefresh: {}, // 获取全局个人信息
      vipShowPictureSrc: require('../../../assets/user/vip.png'), // VIP图片
      discountRate: '无', // 自定义折扣率
      totalSumBTC: '', // btc资产
      BTC2CNYRate: '' // 转换汇率
    }
  },
  async created () {
    await this.currencyTransform()
    await this.getAssetCurrenciesList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async currencyTransform () {
      const params = {
        coinName: 'BTC',
        shortName: 'CNY'
      }
      const data = await currencyTransform(params)
      console.log(2)
      if (!returnAjaxMsg(data, this)) {
        console.log(3)
        return false
      } else {
        console.log(data)
        if (data.data.data.coinPrice) {
          // this.BTC2CNYRate = data.data.data.coinPrice
          // 获取汇率
          this.BTC2CNYRate = getNestedData(data, 'data.data.coinPrice')
        }
      }
    },
    /**
     * 刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList (type) {
      let data
      let params = {}
      switch (type) {
        case 'all':
          params.selectType = 'all'
          break
        case 'noall':
          params.selectType = 'noall'
          break
      }
      data = await assetCurrenciesList(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回数据
        // this.totalSumBTC = data.data.data.totalSum
        this.totalSumBTC = getNestedData(data, 'data.data.totalSum')
        console.log(this.totalSumBTC)
      }
    },
    /**
     *  刷新用户信息
     */
    async getUserRefreshUser () {
      let data = await userRefreshUser({
        token: this.userInfo.token
      })
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        // this.userInfoRefresh = data.data.data.userInfo
        this.userInfoRefresh = getNestedData(data, 'data.data.userInfo')
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      // 任改动
      innerUserInfo: state => state.user.loginStep1Info.userInfo // 内存用户详细信息
    }),
    // CNY 资产
    CNYAssets () {
      return (this.BTC2CNYRate - 0) * (this.totalSumBTC - 0)
    }
  },
  watch: {
    totalSumBTC () {
    },
    // 任改动
    userInfo (val) {
      // console.log(88888888)
      // console.log(val)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .user-info {
    > .user-info-main {
      height: 130px;
      padding: 16px 0;

      > .user-info-content-box {
        height: 100%;

        > .user,
        > .info,
        > .volume,
        > .asset {
          height: 100%;
        }

        > .user {
          > .user-background {
            width: 59px;
            height: 60px;
            margin: 15px 20px 0 36px;
            border-radius: 50%;
          }

          > .text-align-id {
            width: 185px;
            margin-top: 25px;
          }
        }

        > .info {
          > .info-top {
            padding: 0 70px;

            > .icon-user-info,
            > .real-name {
              width: 26px;
              height: 26px;
              border-radius: 50%;
              line-height: 22px;
            }

            > .info-right {
              margin-right: 12px;
            }
          }

          > .info-centre {
            padding: 0 70px;

            > .info-picture {
              position: relative;

              > .info-centre-right {
                position: absolute;
                top: 0;
                left: 17px;
              }
            }
          }

          > .info-discount {
            padding: 0 70px;
          }
        }

        > .volume {
          > .volume-text {
            padding: 0 25px;
            margin-top: 23px;
          }

          > .volume-info {
            padding: 0 25px;
          }
        }

        > .asset {
          > .asset-text {
            padding: 0 20px;
            margin-top: 8px;
          }

          > .asset-info {
            padding: 0 20px;
          }

          > .asset-color {
            padding: 0 15px;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .user-info-main {
        background-color: $nightMainBgColor;

        > .user-info-content-box {
          > .user,
          > .info,
          > .volume {
            border-right: 1px solid rgba(97, 116, 153, .1);
          }

          > .user {
            > .user-background {
              background: linear-gradient(90deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));

              .icon-user {
                color: #e1f3ff;
              }
            }

            > .text-align-id {
              .text-color {
                color: rgba(255, 255, 255, .9);
              }

              .color {
                color: #338ff5 !important;
              }
            }
          }

          > .info {
            padding-top: 10px;

            > .info-top {
              > .icon-user-info,
              > .real-name {
                background-color: #46525d;

                > .icon-color {
                  color: #d5d8dc;
                }
              }

              > .real-name {
                background-color: #338ff5;
              }
            }

            > .info-centre {
              > .info-picture {
                > .info-centre-right {
                  color: #fff;
                }
              }

              > .info-centre-left {
                color: #9da5b3;
              }
            }

            > .info-discount {
              > .discount-text {
                color: #9da5b3;
              }

              > .discount-state {
                color: #fff;
              }
            }
          }

          > .volume,
          > .asset {
            > .volume-text,
            > .asset-text {
              color: #9da5b3;
            }

            > .volume-info,
            > .asset-info {
              > .info-color {
                color: #fff;
              }
            }

            > .asset-color {
              color: #9da5b3;
            }
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .user-info-main {
        border: 1px solid rgba(38, 47, 56, .1);
        color: $dayFontColor;
        background-color: $dayBgColor;

        > .user-info-content-box {
          > .user,
          > .info,
          > .volume {
            border-right: 1px solid rgba(97, 116, 153, .1);
          }

          > .user {
            > .user-background {
              background: linear-gradient(90deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));

              .icon-user {
                color: #e1f3ff;
              }
            }

            > .text-align-id {
              .text-color {
                color: #333;
              }

              .color {
                color: #338ff5 !important;
              }
            }
          }

          > .info {
            padding-top: 10px;

            > .info-top {
              > .icon-user-info,
              > .real-name {
                background-color: #46525d;

                > .icon-color {
                  color: #fff;
                }
              }

              > .real-name {
                background-color: #338ff5;
              }
            }

            > .info-centre {
              > .info-picture {
                > .info-centre-right {
                  color: #fff;
                }
              }

              > .info-centre-left {
                color: #333;
              }
            }

            > .info-discount {
              > .discount-text {
                color: #333;
              }

              > .discount-state {
                color: #fff;
              }
            }
          }

          > .volume,
          > .asset {
            > .volume-text,
            > .asset-text {
              color: #333;
            }

            > .volume-info,
            > .asset-info {
              > .info-color {
                color: #338ff5;
              }
            }

            > .asset-color {
              color: #7d90ac;
            }
          }
        }
      }
    }
  }
</style>
