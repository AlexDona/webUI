<template>
  <div
    class="user-info personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="user-info-main">
      <div class="user-info-content-box display-flex">
        <div class="user float-left flex1">
            <IconFontCommon
              class="user-background text-align-c line-height56 float-left font-size40 icon-user"
              iconName="icon-yonghu1"
            />
          <div class="text-align-id margin-top16 float-left">
            <p class="font-size12 nickname-p">
              <span class="text-color">
                <!--您好，-->
                {{ $t('M.comm_hello') }}
              </span>
              <span class="color nickname-span">
                {{ nickName }}
              </span>
              <!--编辑昵称-->
              <span class="display-inline-block margin-left10 edit-nickName" @click.prevent="editNickname">
                &nbsp;<IconFontCommon class="color text-align-r line-height56 float-left font-size14" iconName="icon-tianxie"/>
              </span>
            </p>
            <span class="display-inline-block margin-top9 text-color">
              UID： {{ showId }}
            </span>
            <el-dialog
                    :title="'修改昵称'"
                    :visible.sync="showNickNameDialog"
                    class="nickNameDialog"
            >
              <el-form>
                <!--修改昵称-->
                <el-form-item prop="nickName">
                  <input
                          class="text-color input-nickName padding-l15 box-sizing"
                          type="text"
                          v-model="nickNames"
                          @focus="emptyStatus()"
                          @keyUp="checkoutInputFormat(nickNames)"
                          @change="checkoutInputFormat(nickNames)"
                          maxlength="15"
                  />
                  <span v-if="errorHint1" class="error-span">· 不可超过7个汉字或15个英文字母</span>
                  <span v-if="errorHint2" class="error-span">· 不可包含空格与特殊字符</span>
                </el-form-item>
              </el-form>
              <div
                      slot="footer"
                      class="dialog-footer"
              >
                <el-button
                        type="primary"
                        @click.prevent="submitNickName(nickNames)"
                >
                  <!--确 定-->
                  {{ $t('M.comm_confirm') }}
                </el-button>
              </div>
            </el-dialog>
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
            class="
             display-flex margin-top16"
            v-if="$isVIPEnable_S_X"
          >
            <span class="info-centre-left text-indent float-left font-size12">
              <!--会员等级 - -->
              {{ $t('M.user_assets_grade_membership') }} -&nbsp;
            </span>
            <p
              class="info-picture float-left cursor-pointer"
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
                  {{ $scientificToNumber($keep2Num(this.totalSumCNY * Rates)) }} <span class="font-size12">{{ activeConvertCurrencyObj.shortName }}</span>
                </p>
                <p v-else>
                  {{ $scientificToNumber($keep2Num(this.totalSumCNY)) }} <span class="font-size12">CNY</span>
                </p>
              </div>
              <div v-else>
                <p
                  class="info-color font-size16"
                  v-if="activeConvertCurrencyObj.shortName !== 'CNY'"
                >
                  0.00 <span class="font-size14">{{ activeConvertCurrencyObj.shortName }}</span>
                </p>
                <p
                  class="info-color font-size16"
                  v-else
                >
                  0.00  <span class="font-size14">CNY</span>
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
import {mapState, mapActions} from 'vuex'
import {
  assetCurrenciesList, changeNickName,
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
  props: ['Rates'],
  data () {
    return {
      vipShowPictureSrc: require('../../../assets/user/vip.png'), // 开通VIP之后点亮图片
      vipShowDefaultSrc: require('../../../assets/user/default.png'), // 未开通VIP默认图片
      totalSumCNY: '', // CNY资产
      CNYRate: '', // 转换汇率
      showNickNameDialog: false,
      nickNames: '',
      emptyErrorMsg: '', // 清空错误信息提示
      errorHint1: false,
      errorHint2: false
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
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
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
    // 编辑昵称
    editNickname () {
      this.showNickNameDialog = true
      this.nickNames = ''
      this.errorHint1 = false
      this.errorHint2 = false
    },
    // 确定设置检测输入格式
    checkoutInputFormat (targetNum) {
      let regExp = /[^a-z0-9\u4E00-\u9FA5]/g
      if (!targetNum) {
        // 请输入昵称
        this.errorHint1 = true
        this.errorHint2 = true
        this.$forceUpdate()
        return 0
      } else if (regExp.test(targetNum)) {
        this.errorHint1 = true
        this.errorHint2 = true
        this.$forceUpdate()
        return 0
      } else {
        let iLength = 0 // 记录字符的字节数
        for (let i of targetNum) {
          if (targetNum.charCodeAt(i) > 255) { // 判斷字節數
            iLength += 2
          } else {
            iLength += 1
          }
        }
        if (iLength <= 15) {
          this.errorHint1 = false
          this.errorHint2 = false
          return 1
        } else {
          this.errorHint1 = true
          this.errorHint2 = true
          return 0
        }
      }
    },
    // 清空内容信息
    emptyStatus () {
      if (this.errorHint1 && this.errorHint2) {
        this.nickNames = ''
        this.errorHint1 = false
        this.errorHint2 = false
      } else {
        this.errorHint1 = false
        this.errorHint2 = false
      }
    },
    // 提交昵称修改
    async submitNickName (targetNum) {
      let data
      let params = {nickName: targetNum}
      if (this.checkoutInputFormat(targetNum)) {
        data = await changeNickName(params)
        if (!data) return false
        this.showNickNameDialog = false
        await this.REFRESH_USER_INFO_ACTION()
      }
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
  // filter: {},
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
            margin: 15px 21px 0 36px;
            border-radius: 50%;
          }

          > .text-align-id {
            width: 185px;
            margin-top: 25px;

            > .nickname-p {
              display: flex;

              > .nickname-span {
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap
              }
            }
          }

          .edit-nickName {
            width: 20px;
            height: 20px;
            cursor: pointer;
          }

          .nickNameDialog {
            .input-nickName {
              width: 100%;
              height: 34px;
              border: 1px solid rgba(72, 87, 118, 1);
              border-radius: 4px;
              line-height: 34px;
              background: transparent;
            }

            .input-nickName:focus {
              border-color: $mainColor;
            }

            .error-span {
              color: $upColor;
            }

            .error-span:nth-of-type(1) {
              display: block;
              height: 22px;
            }

            .el-form-item {
              min-height: 70px;
            }

            .el-dialog__footer {
              margin-top: 28px;
            }
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
              margin-right: 29px;
            }
          }

          > .margin-top16 {
              justify-content: center;

              .text-indent {
                  text-indent: -60px;
              }

            > .info-picture {
              position: relative;

              > .info-centre-right {
                position: absolute;
                top: 0;
                left: 17px;
                font-weight: normal;
                color: #fff;
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
            padding: 0 67px;
            margin-top: 8px;
          }

          > .asset-info {
            padding: 0 67px;
          }

          > .asset-color {
            padding-left: 58px;
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
            text-align: center;

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
        color: $dayMainTitleColor;
        background-color: $mainDayBgColor;
        box-shadow: 0 0 6px #cfd5df;

        > .user-info-content-box {
          > .user,
          > .info,
          > .volume {
            border-right: 1px solid rgba(97, 116, 153, .1);
          }

          > .user {
            > .user-background {
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
