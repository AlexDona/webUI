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
                {{ nickName }}
              </span>
            </p>
            <span class="display-inline-block margin-top9 text-color">
              UID： {{ showId }}
            </span>
          </div>
        </div>
        <div class="info float-left flex1">
          <p
            class="info-top"
            :style="{'marginTop': !$isVIPEnable_S_X ? '30px' : ''}"
          >
            <!--未实名-->
            <span
              v-if="realNameAuth !== 'y'"
              class="icon-user-info info-right display-inline-block text-align-c"
              :title="$t('M.user_not_real_name')"
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
              :title="$t('M.user_by_real_name')"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-yonghu"
              />
            </span>
            <!--未绑定邮箱-->
            <span
              v-if="!email"
              class="icon-user-info info-right display-inline-block text-align-c"
              :title="$t('M.user_not_email_enabled')"
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
              :title="$t('M.user_open_email_enabled')"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-xin-copy"
              />
            </span>
            <!--未绑定绑定手机-->
            <span
              v-if="phoneEnable === 'disable' || phoneEnable === ''"
              class="icon-user-info info-right display-inline-block text-align-c"
              :title="$t('M.user_not_phone_enabled')"
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
              :title="$t('M.user_open_phone_enabled')"
            >
              <IconFontCommon
                class="font-size20 icon-color"
                iconName="icon-shouji"
              />
            </span>
            <!--未绑定谷歌-->
            <span
              v-if="googleEnable === 'disable' || googleEnable === ''"
              class="icon-user-info display-inline-block text-align-c"
              :title="$t('M.user_not_google_enabled')"
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
              :title="$t('M.user_open_google_enabled')"
            >
              <IconFontCommon
                class="font-size16 icon-color"
                iconName="icon-google"
              />
            </span>
          </p>
          <div
            class="info-centre margin-top16"
            v-if="$isVIPEnable_S_X"
          >
            <span class="info-centre-left float-left font-size12">
              <!--会员等级 - -->
              {{ $t('M.user_assets_grade_membership') }} -
            </span>
            <p
              class="info-picture margin-left10 float-left cursor-pointer"
              @click="stateOpenVip"
            >
              <!--未申请VIP默认背景-->
              <img
                v-if="!level"
                :src="vipShowDefaultSrc"
              >
              <!--已开通VIP背景-->
              <img
                v-else
                :src="vipShowPictureSrc"
              >
              <!--未申请VIP默认VIP-->
              <span
                v-if="!level"
                class="info-centre-right font-size12"
                :title="$t('M.user_leave_vip')"
              >
                VIP0
              </span>
              <!--已开通VIP显示对应VIP等级-->
              <span
                v-else
                class="info-centre-right font-size12"
                :title="$t('M.user_look_vip')"
              >
                {{ level }}
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
          <div class="asset-info margin-top9">
            <div
              class="info-color"
            >
              <div
                class="info-color font-size16"
                v-if="this.totalSumCNY > 0"
              >
                <p v-if="activeConvertCurrencyObj.shortName !== 'CNY'">
                  {{ $scientificToNumber($keep2Num(this.totalSumCNY * CNYRate)) }} <span class="font-size12">{{ activeConvertCurrencyObj.shortName }}</span>
                </p>
                <p v-else>
                  {{ $scientificToNumber($keep2Num(this.totalSumCNY)) }} <span class="font-size12">CNY</span>
                </p>
              </div>
              <div v-else>
                <p
                  class="info-color font-size12"
                  v-if="activeConvertCurrencyObj.shortName !== 'CNY'"
                >
                  0.00 <span class="font-size12">{{ activeConvertCurrencyObj.shortName }}</span>
                </p>
                <p
                  class="info-color font-size12"
                  v-else
                >
                  0.00  <span class="font-size12">CNY</span>
                </p>
              </div>
            </div>
          </div>
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
  currencyTransform
} from '../../../utils/api/personal'
import {
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
      vipShowPictureSrc: require('../../../assets/user/vip.png'), // 开通VIP之后点亮图片
      vipShowDefaultSrc: require('../../../assets/user/default.png'), // 未开通VIP默认图片
      totalSumCNY: '', // CNY资产
      CNYRate: '' // 转换汇率
    }
  },
  async created () {
    await this.getAssetCurrenciesList()
    if (this.currencyRateList.BTC) {
      // 汇率转换
      this.currencyTransform()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 汇率折算以及根据header切换显示对应资产换算
    async currencyTransform () {
      const { shortName } = this.activeConvertCurrencyObj
      if (!shortName) return
      const params = {
        coinName: 'FBT',
        shortName
      }
      const data = await currencyTransform(params)
      if (!data) return false
      // 获取汇率
      this.CNYRate = getNestedData(data, 'data.coinPrice')
    },
    // Vip跳转
    stateOpenVip () {
      this.$goToPage('/VipMainContent')
    },
    /**
     * 2.0刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList () {
      let data
      let params = {}
      data = await assetCurrenciesList(params)
      if (!data) return false
      // 返回数据
      this.totalSumCNY = getNestedData(data, 'data.totalSum')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内存用户详细信息
      nickName: state => getNestedData(state, 'user.loginStep1Info.userInfo.nickName'),
      realNameAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.realNameAuth'),
      showId: state => getNestedData(state, 'user.loginStep1Info.userInfo.showId'),
      email: state => getNestedData(state, 'user.loginStep1Info.userInfo.email'),
      phoneEnable: state => getNestedData(state, 'user.loginStep1Info.userInfo.phoneEnable'),
      googleEnable: state => getNestedData(state, 'user.loginStep1Info.userInfo.googleEnable'),
      level: state => getNestedData(state, 'user.loginStep1Info.userInfo.level'),
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
    async activeConvertCurrencyObj () {
      if (this.currencyRateList.BTC) {
        // 汇率转换
        await this.currencyTransform()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

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
      background-color: $mainNightBgColor;

      > .user-info-main {
        background-color: $mainContentNightBgColor;

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
      color: $dayMainTitleColor;
      background-color: $mainDayBgColor;

      > .user-info-main {
        border: 1px solid rgba(38, 47, 56, .1);
        color: $dayMainTitleColor;
        background-color: $mainDayBgColor;

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
