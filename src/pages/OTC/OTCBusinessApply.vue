<template>
  <div
    class="otc-business-apply-box otc"
    :class="{'day':theme == 'day','night':theme == 'night','black':statusBlack == 'successOrApplying' }"
  >
    <!-- 2.1商家 申请 页面 -->
    <div
      class="business-apply-content"
      v-show="applyStatus === 1"
    >
      <!-- 2.1 商家特权 -->
      <div class="privilege">
        <div class="title font-weight700 font-size24">
          <!-- 商家特权 -->
          {{$t('M.otc_merchant')}}{{$t('M.otc_privilege')}}
        </div>
        <div class="content">
          <div class="common publish-AD">
            <img
              src="../../assets/develop/fabu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 发布广告 -->
          {{$t('M.otc_merchant_publishAD')}}
            </span>
            <p class="text font-size14">
              <!-- 自由发布广告 </br>买卖更灵活、额度更大 -->
              {{$t('M.otc_merchant_pubshorder')}}<br />
              {{$t('M.otc_merchant_bigmount')}}
            </p>
          </div>
          <div class="common mark">
            <img
              src="../../assets/develop/biaozhi.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 独享标志 -->
              {{$t('M.otc_merchant_singleFag')}}
            </span>
            <p class="text font-size14">
              <!-- 商家发布的广告会带有<br />专属“商”标志<br />增加交易信任 -->
              {{$t('M.otc_merchant_tipsLine')}}<br />
              {{$t('M.otc_merchant_Smark')}}<br />
              {{$t('M.otc_merchant_plusTrust')}}
            </p>
          </div>
          <div class="common service">
            <img
              src="../../assets/develop/kefu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 专属客服 -->
              {{$t('M.otc_merchant_singleSerice')}}
            </span>
            <p class="text font-size14">
              <!-- 我们向商家提供7*24小时<br />专属客服服务 -->
              {{$t('M.otc_merchant_we')}}<br />
              {{$t('M.otc_merchant_singleSeriviceserver')}}
            </p>
          </div>
        </div>
      </div>
      <!-- 2.2 商家认证 -->
      <div class="approve">
        <!-- 2.2.1 商家认证 -->
        <div class="title font-weight700 font-size24">
          {{$t('M.otc_merchant')}}{{$t('M.otc_approve')}}
        </div>
        <!-- 2.2.2 1234序号部分 -->
        <div class="number">
          <!-- 商家申请 -->
          <span class="common apply">
            <!-- {{$t('M.otc_merchant')}}{{$t('M.otc_apply')}} -->
            {{$t('M.otc_merchant_apply')}}
          </span>
          <!-- 发送邮件 -->
          <span class="common send-email">
            {{$t('M.otc_merchant_sendemail')}}
          </span>
          <!-- 提交申请 -->
          <span class="common submit-apply">
            {{$t('M.otc_submit')}}{{$t('M.otc_apply')}}
          </span>
          <!-- 审核通过 -->
          <span class="common pass">
            {{$t('M.otc_merchant_verified')}}
          </span>
        </div>
        <!-- 2.2.3 具体步骤部分 -->
        <div class="step">
          <div class="content">
            <h4 class="title">
              {{$t('M.otc_merchant_step1')}}
            </h4>
            <!-- 商家申请资料模板下载 -->
            <p>
              {{$t('M.otc_merchant_pleaseDowload')}}
              <span
                class="businessApplyModel"
                @click="downloadApplicationForm"
              >
                《{{$t('M.otc_merchant_applyMaterial')}}》
              </span>
              ，{{$t('M.otc_merchant_content_one')}}。
            </p>
            <p>{{$t('M. otc_merchant_videoKode')}}：</p>
            <p>{{$t('M.otc_merchant_detailOne')}}</p>
            <p>{{$t('M.otc_merchant_detailTwo')}}</p>
            <p>{{$t('M.otc_merchant_applyLimit')}}<span>{{$scientificToNumber(successTimes)}}</span>{{$t('M.otc_ci')}}。②{{$t('M.otc_merchant_account')}}<span>{{coinName}}</span>{{$t('M.comm_count')}}{{$t('M.otc_xu')}}≥<span>{{$scientificToNumber(count)}}</span></p>
            <h4 class="title">
              {{$t('M.otc_merchant_step2')}}
            </h4>
            <p>{{$t('M.otc_merchant_datailThree')}}{{configInfo.otcEmail}}，{{$t('M.otc_merchant_datailFour')}}OTC{{$t('M.otc_merchant')}}”。</p>
            <h4 class="title">
              {{$t('M.otc_merchant_step3')}}
            </h4>
            <p>{{$t('M.otc_merchant_datailFive')}}{{$scientificToNumber(count)}} {{coinName}}{{$t('M.otc_merchant_datailSix')}}。</p>
            <h4 class="title">
              {{$t('M.otc_merchant_step4')}}
            </h4>
            <p>{{$t('M.otc_merchant_datailSeven')}}</p>
            <!--<h4 class="title tips">-->
              <!--{{$t('M.otc_merchant_loveTips')}}-->
              <!--<el-button-->
                <!--type="text"-->
                <!--@click="businessArgument"-->
                <!--class="agree font-size14"-->
              <!--&gt;-->
                <!--《{{$t('M.otc_merchant_authentication')}}》-->
              <!--</el-button>-->
            <!--</h4>-->
          </div>
        </div>
        <!-- 2.2.4 同意协议部分 -->
        <div class="agree font-size12">
          <span>
            <el-checkbox
              v-model="checked"
              @change="changeVal"
            >
            </el-checkbox>
          </span>
          <span>{{$t('M.otc_merchant_readAndSure')}}</span>
          <el-button
            type="text"
            @click="businessArgument"
            class="agreement"
          >
            《{{$t('M.otc_merchant_authentication')}}》
          </el-button>
          <el-dialog
            :title="$t('M.otc_merchant_authentication')"
            :visible.sync="businessAgreementDialogStatus"
            width="50%"
          >
            <div v-html="argumentContent" class="plainText"></div>
          </el-dialog>
        </div>
        <!-- 2.2.5 申请为商家按钮部分 -->
        <div class="submit">
          <button
            class="button font-size16 cursor-pointer"
            @click="submit"
          >
            {{$t('M.otc_apply_become_shopper')}}
          </button>
        </div>
      </div>
    </div>
    <!-- 2.2商家 申请中 页面 -->
    <div
      :style="{'min-height':(height-405)+'px'}"
      class="business-applying-content"
      v-show="applyStatus === 2"
    >
      <div class="picture">
        <img src="../../assets/develop/business-applying.png">
      </div>
      <div class="text">
        <p class="tip">{{$t('M.otc_merchant_audit')}}</p>
        <p class="tip">{{$t('M.otc_merchant_wait')}}...</p>
      </div>
    </div>
    <!-- 2.3商家 申请成功 页面 -->
    <div
      :style="{'min-height':(height-405)+'px'}"
      class="business-apply-success-content"
      v-show="applyStatus === 3"
    >
      <div class="picture">
        <img src="../../assets/develop/business-apply-success.png">
      </div>
      <div class="text">
        <!-- 恭喜您已成为认证商家 -->
        <p class="tip">{{$t('M.otc_merchant_success')}}</p>
      </div>
    </div>
    <!-- 2.4切换导航时候数据返回之前显示的缓冲界面 -->
    <div
      class="business-apply-blank"
      v-show="applyStatus === 4"
    >
    </div>
    <!--申请成为商家提示框-->
    <div class="apply-merchant-dialog">
      <!--申请提示-->
      <el-dialog
        :title="$t('M.otc_apply_tips6')"
        :visible.sync="showApplyMerchantStatus"
        top="30vh"
        modal
      >
        <div class="tips">
          <!--您需要先申请成为商家才能使用此功能！-->
          <p class="content">
            <!--需OTC交易次数≥5次，资产可用≥10HF,是否继续？-->
            {{$t('M.otc_apply_tips3')}}≥{{successTimes}}{{$t('M.otc_ci')}},{{$t('M.otc_apply_tips4')}}≥{{count}}{{coinName}}, {{$t('M.otc_apply_tips5')}}？
          </p>
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
            <el-button
              type="primary"
              @click="cancelApply"
            >
              <!--取消-->
              {{$t('M.comm_cancel')}}
            </el-button>
            <el-button
              type="primary"
              @click="confirmApply"
            >
              {{$t('M.comm_confirm')}}
              <!--确定-->
            </el-button>
            </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import IconFontCommon from '../../components/Common/IconFontCommon'
import {
  businessApply,
  firstEnterBusinessApply,
  argumentBusinessApply
} from '../../utils/api/OTC'
import { downloadFileWithUserDefined } from '../../utils/'
import {
  // returnAjaxMsg,
  getNestedData,
  http2https
} from '../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      showApplyMerchantStatus: false, // 是否显示申请商家弹窗
      statusBlack: '', // 当为申请中和申请成功的页面时候，只有黑色主题颜色
      height: '', // 申请中 申请成功 内容的高度
      applyStatus: 1, // 商家申请状态
      checked: false, // 同意协议按钮:默认不勾选
      successTimes: '0', // 成功次数
      coinName: 'FUC', // 币种名称
      count: '0', // 次数
      businessAgreementDialogStatus: false, // 弹出框状态
      argumentContent: '', // 协议文件
      fileName: '商家认证申请表 Merchant certification application form', // 下载文件名字
      downLoadUrl: '', // 商家申请资料地址
      scrollToTimerOne: null, // 滚动跳转倒计时1
      scrollToTimerTwo: null // 滚动跳转倒计时2
    }
  },
  created () {
    // 动态获取申请中 申请成功内容的高度
    console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    this.determineUser()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
      'CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS'
    ]),
    // 下载商家申请资料模板
    downloadApplicationForm () {
      // console.log(this.downLoadUrl)
      // console.log(this.fileName)
      downloadFileWithUserDefined(this.downLoadUrl, this.fileName)
    },
    // 点击申请商家用户按钮发送请求
    submit () {
      // 点击按钮时判断商家是否登录
      if (this.isLogin) {
        if (!this.checked) {
          // 请先同意认证商家协议
          this.$message({
            message: this.$t('M.otc_firstSure') + this.$t('M.otc_merchant_authentication'),
            type: 'error'
          })
          return false
        }
        // this.getOTCBusinessApply()
        this.showApplyMerchantStatus = true
      } else {
        this.$message({showClose: true, message: this.$t('M.otc_login_pi') + '!'})
      }
    },
    // 申请成为商家提示框确定申请
    confirmApply () {
      this.getOTCBusinessApply()
      this.showApplyMerchantStatus = false
    },
    // 申请成为商家提示框取消申请
    cancelApply () {
      this.showApplyMerchantStatus = false
    },
    // 请求申请状态
    async getOTCBusinessApply () {
      const data = await businessApply()
      // 返回数据正确的逻辑
      console.log(data)
      if (!data) return false
      if (data.meta) {
        let detailMeta = getNestedData(data, 'meta')
        if (detailMeta.success == true) {
          this.applyStatus = 2
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
        } else {
          // 如果失败提示返回的数据
          this.$message({showClose: true, message: detailMeta.message})
          this.applyStatus = 1
        }
      }
    },
    changeVal (e) {
      this.checked = e
    },
    // 首次点击商家申请决定进入哪个界面
    async determineUser () {
      // 刚进页面接口请求回来之前先展示缓冲界面
      this.applyStatus = 4
      const data = await firstEnterBusinessApply()
      console.log(' 首次点击商家申请请求数据')
      console.log(data)
      // 正确逻辑
      if (data) {
        let getData = getNestedData(data, 'data')
        // 返回数据正确的逻辑
        this.successTimes = getNestedData(getData, 'successTimes')
        this.coinName = getNestedData(getData, 'coinName')
        this.count = getNestedData(getData, 'count')
        this.downLoadUrl = http2https(getNestedData(getData, 'downLoadUrl'))
        // 返回数据的状态 1 表示展示初次进入
        if (getData.status == 1) {
          this.applyStatus = 1
          // 状态 2 表示审核正在进行中
        } else if (getData.status == 2) {
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
          this.applyStatus = 2
          // 状态 3 表示审核通过
        } else {
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
          this.applyStatus = 3
        }
        // ren 增加非商家点击提示框申请按钮跳转到申请页面中的申请按钮部分功能
        if (getData.status !== 3 && this.otcApplyJumpBottomStatus) {
          // console.log('进入方法了' + this.otcApplyJumpBottomStatus)
          this.scrollToTimerOne = setTimeout(() => {
            window.scrollTo(0, 2000)
          }, 100)
          this.CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS(false)
        }
      } else {
        // 刚进页面接口请求错误时候显示申请界面
        this.applyStatus = 1
        return false
      }
    },
    // 商家申请界面用户协议
    async argumentBusinessApplyRequest () {
      const data = await argumentBusinessApply({
        termsTypeIds: 9,
        language: this.language
      })
      console.log('商家申请界面用户协议')
      console.log(data)
      // 正确逻辑
      if (!data) return false
      if (data.data) {
        this.argumentContent = getNestedData(data, 'data[0].content')
      }
    },
    businessArgument () {
      this.businessAgreementDialogStatus = true
      this.argumentBusinessApplyRequest()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin, // 用户登录状态 false 未登录； true 登录
      language: state => state.common.language,
      theme: state => state.common.theme,
      configInfo: state => state.common.footerInfo.configInfo,
      // 普通用户点击otc导航弹窗提示点击申请按钮跳转到申请商家组件底部状态
      otcApplyJumpBottomStatus: state => state.OTC.otcApplyJumpBottomStatus
    })
  },
  watch: {
    otcApplyJumpBottomStatus (newVal) {
      // console.log('监控')
      // console.log(newVal)
      if (newVal && this.applyStatus !== 3) {
        this.scrollToTimerTwo = setTimeout(() => {
          window.scrollTo(0, 2000)
        }, 100)
        this.CHANGE_OTC_APPLY_JUMP_BOTTOM_STATUS(false)
      }
    }
  },
  destroyed () {
    // 离开本组件清除定时器
    if (this.scrollToTimerOne) {
      clearTimeout(this.scrollToTimerOne)
    }
    if (this.scrollToTimerOne) {
      clearTimeout(this.scrollToTimerTwo)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/OTC/OTCCenter.scss";
  @import "../../../static/css/scss/index";

  .otc-business-apply-box {
    margin-top: 50px;
    overflow: hidden;

    > .business-apply-content {
      padding-top: 20px;

      > .privilege {
        width: 1150px;
        margin: 107px auto 0;

        > .title {
          text-align: center;
          color: #fff;
        }

        > .content {
          display: flex;
          justify-content: space-around;

          > .common {
            position: relative;
            width: 210px;
            height: 250px;
            margin-top: 120px;
            text-align: center;

            &::before {
              position: absolute;
              top: -25px;
              left: 0;
              width: 0;
              height: 0;
              border-left: 105px solid transparent;
              content: "";
              border-right: 105px solid transparent;
            }

            &::after {
              position: absolute;
              bottom: -25px;
              left: 0;
              width: 0;
              height: 0;
              border-left: 105px solid transparent;
              content: "";
              border-right: 105px solid transparent;
            }

            > .title {
              width: 83px;
              padding-bottom: 10px;
              font-weight: 700;
              color: #338ff5;
            }

            > .text {
              margin-top: 60px;
              line-height: 25px;
            }

            > .location-picture {
              position: absolute;
              top: -67px;
              left: 75px;
            }
          }
        }
      }

      > .approve {
        width: 1150px;
        margin: 70px auto;
        margin-top: 107px;

        > .title {
          margin-top: 100px;
          text-align: center;
        }

        > .number {
          position: relative;
          width: 1150px;
          height: 52px;
          margin-top: 70px;
          line-height: 58px;
          background: url(../../assets/develop/step.png) no-repeat center;

          > .common {
            font-size: 16px;
          }

          > .apply {
            position: absolute;
            top: 0;
            left: 185px;
          }

          > .send-email {
            position: absolute;
            top: 0;
            left: 430px;
          }

          > .submit-apply {
            position: absolute;
            top: 0;
            left: 680px;
          }

          > .pass {
            position: absolute;
            top: 0;
            left: 930px;
          }
        }

        > .step {
          width: 1150px;
          height: 650px;
          padding: 40px 0 0 238px;
          margin-top: 70px;
          font-size: 14px;
          background: url(../../assets/develop/business-apply-bgm.png) no-repeat center;

          > .content {
            width: 620px;

            > p {
              line-height: 25px;
            }

            > .title {
              margin-top: 20px;

              &:first-child {
                margin-top: 20px;
              }
            }
          }
        }

        > .agree {
          margin-top: 70px;
          text-align: center;
        }

        > .submit {
          margin-top: 20px;
          text-align: center;

          > .button {
            width: 300px;
            height: 50px;
            border-radius: 5px;
          }
        }
      }
    }

    > .business-applying-content,
    .business-apply-success-content {
      width: 1150px;
      padding-top: 20px;
      margin: 70px auto;
      text-align: center;
      background-color: $mainNightBgColor;

      > .picture {
        margin-top: 80px;
      }

      > .text {
        margin-top: 40px;
        font-size: 18px;
        color: #fff;

        > .tip {
          line-height: 30px;
        }
      }
    }

    > .business-apply-success-content {
      > .text {
        margin-top: 10px;
      }
    }

    > .business-apply-blank {
      width: 100%;
      height: 918px;
      background-color: $mainNightBgColor;
    }

    /deep/ {
      .el-checkbox__inner {
        border-radius: 6px;
        background-color: #eee;

        &::after {
          border: 1px solid #1f2f47;
          border-top: 0;
          border-left: 0;
        }
      }

      .agree {
        /* 遮罩层样式 */
        .el-dialog__wrapper {
          background: rgba(0, 0, 0, .5) !important;
        }

        .el-dialog {
          position: relative;
          width: 340px;
          text-align: left;
          background: #28334a !important;

          .el-dialog__header {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 10px 20px;
            text-align: left;
            background: #20293c;
            -webkit-box-shadow: 0 1px 2px 0 #1d2131;
            box-shadow: 0 1px 2px 0 #1d2131;

            .el-dialog__title {
              color: #fff !important;
            }

            .el-dialog__headerbtn {
              top: 15px;
              right: 10px;
            }
          }

          .el-dialog__body {
            height: 700px;
            padding: 15px 20px 10px 30px;
            overflow: scroll;
            font-size: 12px;

            .plainText {
              margin-top: 40px;
            }
          }
        }
      }
    }

    /* 申请商家提示框样式 */
    .apply-merchant-dialog {
      /* 遮罩层样式 */
      .el-dialog__wrapper {
        background: rgba(0, 0, 0, .7) !important;
      }

      .el-dialog__header {
        text-align: left;
        background-color: #1d2131 !important;
      }

      .el-dialog {
        width: 350px;
        height: 207px;
        border-radius: 4px;
        background-color: #1c2237 !important;

        .el-dialog__header {
          padding: 3px 20px;
          border-radius: 4px;

          .el-dialog__title {
            font-size: 16px;
            color: #338ff5 !important;
          }

          .el-dialog__headerbtn {
            top: 15px;
            right: 10px;
          }
        }

        .el-dialog__body {
          padding: 15px 20px 10px 30px;
          font-size: 12px;

          .tips {
            height: 80px;
            padding-top: 20px;
            font-size: 14px;
            color: #b8bdd0;

            > .content {
              line-height: 20px;
            }
          }
        }

        .el-dialog__footer {
          padding: 0 20px 0 0;

          .el-button {
            width: 90px;
            padding: 7px 20px;
            border: 0;

            &:first-child {
              border: 1px solid rgba(51, 143, 245, 1);
              color: #338ff5;
              background: #1c2237;
            }

            &:last-child {
              padding: 8px 21px;
            }
          }
        }
      }
    }

    &.night {
      overflow: hidden;
      background-color: $mainNightBgColor;

      > .business-apply-content {
        overflow: hidden;

        > .privilege {
          > .title {
            color: #fff;
          }

          > .content {
            > .common {
              background: #202740;

              &::before {
                border-bottom: 25px solid #202740;
              }

              &::after {
                border-top: 25px solid #202740;
              }

              > .title {
                border-bottom: 1px dashed rgba(51, 143, 245, .3);
                font-weight: 700;
                color: #338ff5;
              }

              > .text {
                color: #fff;
              }
            }
          }
        }

        > .approve {
          > .title {
            color: #fff;
          }

          > .number {
            > .common {
              color: #fff;
            }
          }

          > .step {
            color: #8f9ca6;

            > .content {
              > .title {
                color: #fff;
              }

              > .tips {
                color: #4b5d6e;

                > .agree {
                  color: #d45858;
                }
              }
            }
          }

          > .agree {
            color: #fff;

            .agreement {
              color: #d45858;
            }
          }

          > .submit {
            > .button {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        .el-checkbox__inner {
          background-color: #eee;
        }

        .el-dialog__body {
          color: #8494a6;
        }

        .el-dialog__title {
          color: #338ff5;
        }

        .el-dialog {
          background: #121824;

          &::-webkit-scrollbar-button {
            background-color: #292e42;
          }

          &::-webkit-scrollbar-track {
            background: #292e42;
          }

          &::-webkit-scrollbar-thumb {
            background: #1e2636;
          }

          &::-webkit-scrollbar-corner {
            background: #292e42;
          }
        }
      }
    }

    &.day {
      overflow: hidden;
      background-color: $mainDayBgColor;

      > .business-apply-content {
        > .privilege {
          > .title {
            color: #333;
          }

          > .content {
            > .common {
              background: #202740;

              &::before {
                border-bottom: 25px solid #202740;
              }

              &::after {
                border-top: 25px solid #202740;
              }

              > .title {
                border-bottom: 1px dashed rgba(51, 143, 245, .3);
                font-weight: 700;
                color: #338ff5;
              }

              > .text {
                color: #fff;
              }
            }
          }
        }

        > .approve {
          > .title {
            color: #333;
          }

          > .number {
            > .common {
              color: #333;
            }
          }

          > .step {
            color: #8f9ca6;

            > .content {
              > .title {
                color: #fff;
              }

              > .tips {
                color: #4b5d6e;

                > .agree {
                  color: #d45858;
                }
              }
            }
          }

          > .agree {
            color: #333;

            .agreement {
              color: #d45858;
            }
          }

          > .submit {
            > .button {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      /deep/ {
        .el-dialog {
          background: #fff;
        }

        .agree {
          /* 遮罩层样式 */
          .el-dialog__wrapper {
            background: rgba(0, 0, 0, .5) !important;
          }

          .el-dialog {
            position: relative;
            width: 340px;
            text-align: left;
            background: #fff !important;

            .el-dialog__header {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              text-align: left;
              background-color: #eaf4fe !important;
              -webkit-box-shadow: 0 1px 2px 0 rgba(29, 33, 49, .1);
              box-shadow: 0 1px 2px 0 rgba(29, 33, 49, .1);

              .el-dialog__title {
                color: #000 !important;
              }

              .el-dialog__headerbtn {
                top: 15px;
                right: 10px;
              }
            }

            .el-dialog__body {
              height: 700px;
              padding: 15px 20px 10px 30px;
              overflow: scroll;
              font-size: 12px;
              color: #666;

              .plainText {
                margin-top: 28px;
              }
            }
          }
        }

        /* 申请商家提示框样式 */
        .apply-merchant-dialog {
          .el-dialog {
            background: #fff !important;

            .el-dialog__header {
              border-bottom: 1px solid #ecf1f8;
              background: #fff !important;
            }

            .el-dialog__body {
              .tips {
                color: #333;
              }
            }

            .el-dialog__footer {
              .el-button {
                &:first-child {
                  border: 1px solid rgba(51, 143, 245, 1);
                  color: #338ff5;
                  background: #fff;
                }
              }
            }
          }
        }
      }
    }

    .businessApplyModel {
      color: #d45858;
      cursor: pointer;
    }
  }

  .black.otc-business-apply-box.day {
    // 当为申请中和申请成功的页面时候，只有黑色主题颜色
    background-color: $mainNightBgColor;
  }

  /deep/ {
    .el-dialog__title {
      color: #338ff5;
    }
  }
</style>
