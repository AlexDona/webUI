<template>
  <div
    class="vip-main personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div class="header-content">
      <img
        class="images"
        :src="vipPictureBanner"
      >
    </div>
    <div class="content-main-content">
      <!--开通vip页面-->
      <div
        class="content-main display-flex"
        v-show="showOpenTheVIPPage"
        v-if="vipPriceInfo1"
      >
        <div class="content-main-box">
          <!--<div-->
            <!--class="content-box"-->
            <!--v-if="userInfo.userInfo.level == 'VIP1'"-->
          <!--&gt;-->
          <!--</div>-->
          <div
            class="content-module cursor-pointer"
            :class="{ active1:activeStatus < 1, disable:activeStatus > 0}"
          >
            <p class="content-vip-one text-align-c">
              VIP1
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              <!-- {{ $t('M.comm_service_charge') }}{{ $t('M.user_vip_discount') }} -->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--九折-->
              {{ $t('M.user_vip_nine') }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{vipPriceInfo1[0].value}}{{vipPriceInfo1[0].vipCoinName}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="statusImmediatelyOpened('vip1')"
                v-if="userInfo.userInfo.level !== 'VIP1'"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <button
                class="click-btn cursor-pointer"
                v-else
              >
                <!--已开通-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
            </p>
          </div>
        </div>
        <div class="content-main-box">
          <div
            class="content-box"
            v-if="userInfo.userInfo.level == 'VIP2'"
          >
          </div>
          <div
            class="content-module content-border-rl cursor-pointer"
            :class="{ active1:activeStatus < 2, disable:activeStatus > 2}"
          >
            <p class="content-vip-one text-align-c">
              VIP2
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              <!-- {{ $t('M.comm_service_charge') }}{{ $t('M.user_vip_discount') }} -->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--八折-->
              {{ $t('M.user_vip_eight') }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{vipPriceInfo1[4].value}}{{vipPriceInfo1[4].vipCoinName}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="statusImmediatelyOpened('vip2')"
                v-if="userInfo.userInfo.level !== 'VIP2'"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <button
                class="click-btn cursor-pointer"
                v-else
              >
                <!--已开通-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
            </p>
          </div>
        </div>
        <div class="content-main-box">
           <div
            class="content-box"
            v-if="userInfo.userInfo.level == 'VIP3'"
           >
           </div>
          <div
            class="content-module cursor-pointer"
            :class="{ active1:activeStatus < 3, disable:activeStatus > 3}"
          >
            <p class="content-vip-one text-align-c">
              VIP3
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              <!-- {{ $t('M.comm_service_charge') }}{{ $t('M.user_vip_discount') }} -->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--七折-->
              {{ $t('M.user_vip_seven') }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{vipPriceInfo1[8].value}}{{vipPriceInfo1[8].vipCoinName}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="statusImmediatelyOpened('vip3')"
                v-if="userInfo.userInfo.level !== 'VIP3'"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <button
                class="click-btn cursor-pointer"
                v-else
              >
                <!--已开通-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
            </p>
          </div>
        </div>
        <div class="content-main-box">
           <div
            class="content-box"
            v-if="userInfo.userInfo.level == 'VIP4'"
           >
          </div>
          <div
            class="content-module cursor-pointer"
            :class="{ active1:activeStatus < 4, disable:activeStatus > 4}"
          >
            <p class="content-vip-one text-align-c">
              VIP4
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              <!-- {{ $t('M.comm_service_charge') }}{{ $t('M.user_vip_discount') }} -->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--六折-->
              {{ $t('M.user_vip_six') }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{vipPriceInfo1[12].value}}{{vipPriceInfo1[12].vipCoinName}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="statusImmediatelyOpened('vip4')"
                v-if="userInfo.userInfo.level !== 'VIP4'"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <button
                class="click-btn cursor-pointer"
                v-else
              >
                <!--已开通-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
            </p>
          </div>
        </div>
        <div class="content-main-box">
           <div
            class="content-box"
            v-if="userInfo.userInfo.level == 'VIP5'"
           >
           </div>
          <div
            class="content-module content-border-rl cursor-pointer"
            :class="{ active1:activeStatus < 5, disable:activeStatus > 5}"
          >
            <p class="content-vip-one text-align-c">
              VIP5
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
              <!--手续费折扣-->
              <!-- {{ $t('M.comm_service_charge') }}{{ $t('M.user_vip_discount') }} -->
              {{ $t('M.user_vip_fee_discount') }}
            </p>
            <p class="content-text line-height50 text-align-c font-size18">
              <!--五折-->
              {{ $t('M.user_vip_five') }}{{ $t('M.user_vip_break') }}
            </p>
            <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">
              {{vipPriceInfo1[16].value}}{{vipPriceInfo1[16].vipCoinName}}
            </span>
              <span>
              <!--/月-->
              /{{ $t('M.user_vip_month') }}
            </span>
            </p>
            <p class="content-button">
              <button
                class="click-btn cursor-pointer"
                @click.prevent="statusImmediatelyOpened('vip5')"
                v-if="userInfo.userInfo.level !== 'VIP5'"
              >
                <!--立即开通-->
                <span>
                  {{ $t('M.user_vip_immediately_opened') }}
                </span>
              </button>
              <button
                class="click-btn cursor-pointer"
                v-else
              >
                <!--已开通-->
                <span>
                  {{ $t('M.user_vip_text7') }}
                </span>
              </button>
            </p>
          </div>
        </div>
        <!--<div class="content-module margin-top30 cursor-pointer">-->
          <!--<p class="content-vip-one text-align-c">-->
            <!--VIP6-->
          <!--</p>-->
          <!--<p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>-->
          <!--<p class="content-text line-height50 text-align-c font-size18">四折</p>-->
          <!--<p class="content-discount line-height50 text-align-c font-size16">-->
            <!--<span>{{vipPriceInfo1[20].value}}{{vipPriceInfo1[20].vipCoinName}}</span>-->
            <!--<span>/月</span>-->
          <!--</p>-->
          <!--<p class="content-button">-->
            <!--<button-->
              <!--class="click-btn cursor-pointer"-->
              <!--@click.prevent="statusImmediatelyOpened('vip6')"-->
            <!--&gt;-->
              <!--立即开通-->
            <!--</button>-->
          <!--</p>-->
        <!--</div>-->
        <p class="content-info-hint padding-right23 box-sizing font-size12">
          <span>
            <!--还没有FUC?-->
            {{ $t('M.user_vip_not_yet') }}{{vipPriceInfo1[0].vipCoinName}}?
          </span>
          <span
            class="hint-color cursor-pointer"
            @click.prevent="returnSuperior"
          >
            <!--立即购买-->
            {{ $t('M.user_vip_immediately_buy') }}
          </span>
        </p>
      </div>
      <!--开通vip详情页面-->
      <div
        class="content-detail-page"
        v-show="vipShowDetailsPage"
      >
        <div class="detail-page-grade display-flex">
          <div class="page-grade-title font-size14">
            <!--开通等级-->
            {{ $t('M.user_vip_opening_level') }}
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(1)"
            :class="{ blue1:changeRed1 == 1}"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP1
            </p>
            <p class="font-size12 grade-height">
              <!--手续费9折-->
              {{ $t('M.comm_service_charge') }}9{{ $t('M.user_vip_break') }}
            </p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(2)"
            :class="{ blue1:changeRed1 == 2}"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP2
            </p>
            <p class="font-size12 grade-height">
              <!--手续费8折-->
              {{ $t('M.comm_service_charge') }}8{{ $t('M.user_vip_break') }}
            </p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(3)"
            :class="{ blue1:changeRed1 == 3}"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP3
            </p>
            <p class="font-size12 grade-height">
              <!--手续费7折-->
              {{ $t('M.comm_service_charge') }}7{{ $t('M.user_vip_break') }}
            </p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(4)"
            :class="{ blue1:changeRed1 == 4}"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP4
            </p>
            <p class="font-size12 grade-height">
              <!--手续费6折-->
              {{ $t('M.comm_service_charge') }}6{{ $t('M.user_vip_break') }}
            </p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(5)"
            :class="{ blue1:changeRed1 == 5}"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP5
            </p>
            <p class="font-size12 grade-height">
              <!--手续费5折-->
              {{ $t('M.comm_service_charge') }}5{{ $t('M.user_vip_break') }}
            </p>
          </div>
          <!--<div-->
            <!--class="grade cursor-pointer text-align-c"-->
            <!--@click.prevent="stateOpeningLevel(6)"-->
            <!--:class="{ blue1:changeRed1 == 6}""-->
          <!--&gt;-->
            <!--<p class="font-size16 grade-color font-weight600">VIP6</p>-->
            <!--<p class="font-size12 grade-height">手续费4折</p>-->
          <!--</div>-->
        </div>
        <div
          class="detail-page-duration display-flex"
          v-if="filteredData"
        >
          <div class="duration-title font-size14">
            <!--开通时长-->
            {{ $t('M.user_vip_opening_time') }}
          </div>
          <div
            class="duration cursor-pointer cursor-pointer text-align-c"
            @click.prevent="changeMonth(3, filteredData[0].id)"
            :class="{ red:changeRed == 3}"
          >
            <span
              class="triangle-style font-size12 text-align-c"
            >
              推荐
            </span>
            <p class="duration-month font-size16">
              <!--3个月-->
              3{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[1].value}}{{vipPriceInfo1[1].vipCoinName}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(6, filteredData[1].id)"
            :class="{ red:changeRed == 6}"
          >
            <p class="duration-month font-size16">
              <!--6个月-->
              6{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[2].value}}{{filteredData[2].vipCoinName}}
            </p>
            <p class="duration-through ">
              <!--600FUC-->
              {{filteredData[2].value}}{{filteredData[2].vipCoinName}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(12, filteredData[2].id)"
            :class="{ red:changeRed == 12}"
          >
            <p class="duration-month font-size16">
              <!--12个月-->
              12{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[3].value}}{{filteredData[3].vipCoinName}}
            </p>
            <p class="duration-through">
              <!--1200FUC-->
              {{filteredData[3].value}}{{filteredData[3].vipCoinName}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(1, filteredData[3].id)"
            :class="{ red:changeRed == 1}"
          >
            <p class="duration-month font-size16">
              1{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[0].value}}{{filteredData[0].vipCoinName}}
            </p>
          </div>
        </div>
        <div class="detail-usable display-flex">
          <div class="usable-title font-size14">可用</div>
          <div class="usable">
            <span class="usable-asset font-size16">
              {{ currencyAsset }}
              <sub class="currency font-size12">
                {{filteredData[0].vipCoinName}}
              </sub>
            </span>
            <span
              class="usable-gain cursor-pointer font-size12 display-inline-block"
              @click.prevent="returnSuperior"
            >
              <!--立即获取-->
              {{ $t('M.user_vip_immediate_access') }}
            </span>
          </div>
        </div>
        <div class="detail-page-btn text-align-c">
          <button
            class="page-btn cursor-pointer"
            @click.prevent="confirmSubmit"
          >
            <!--确定-->
            {{ $t('M.comm_confirm') }}
          </button>
        </div>
      </div>
      <div class="text-below box-sizing font-size12">
        <p class="font-size14 warm-prompt">
          <!--温馨提示:-->
          {{ $t('M.user_account_warm_prompt') }}:
        </p>
        <p>
          <span class="warm-text-color">
            <!--VIP开通后立即生效，交易结算时自动计算折扣-->
            {{ $t('M.user_vip_text1') }}
          </span>
          <span
            class="prompt-color cursor-pointer"
            @click="changeServiceAgreement(0)"
          >
            <!--《折扣说明》-->
            {{ $t('M.user_vip_text2') }}
          </span>
        </p>
        <p class="warm-text-color">
          <!--费率折扣仅对交易手续费生效-->
          {{ $t('M.user_vip_text3') }}
        </p>
        <p class="warm-text-color">
          <!--一个月有效期时长为30个自然日-->
          {{ $t('M.user_vip_text4') }}
        </p>
        <p class="warm-text-color">
          <!--开通即代表您已同意-->
          {{ $t('M.user_vip_text5') }}
          <span
            class="prompt-color cursor-pointer"
            @click="changeServiceAgreement(1)"
          >
            <!--《VIP服务协议》-->
            《{{ $t('M.user_vip_text6') }}》
          </span>
        </p>
      </div>
      <!--折扣说明-->
      <el-dialog
        class="discounts-instruction-dialog"
        :title="$t('M.user_vip_text2')"
        :visible.sync="discountsInstructionStatus"
        width="50%"
      >
        <div
          v-html="discountsInstructionContent"
          class="html-content"
        ></div>
      </el-dialog>
      <!--vip服务协议-->
      <el-dialog
        class="discounts-instruction-dialog"
        :title="$t('M.user_vip_text6')"
        :visible.sync="serviceAgreementStatus"
        width="50%"
      >
        <div
          v-html="serviceAgreementContent"
          class="html-content"
        ></div>
      </el-dialog>
      <!--开通VIP-->
      <el-dialog
        :title="$t('M.user_vip_dredge') + 'VIP'"
        :visible.sync="dialogFormVisible"
      >
        <el-form>
          <!--交易密码-->
          <el-form-item
            :label="$t('M.comm_password')"
          >
            <el-input
              type="password"
              v-model="password"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <!--错误提示-->
        <div
          class = "error-msg font-size12"
        >
          <span v-show = "errorEditorMsg">
            {{ errorEditorMsg }}
          </span>
        </div>
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click.prevent="dialogFormVisibleButton"
          >
            <!--确 定-->
            {{ $t('M.comm_confirm') }}
          </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommonForPC'
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
import {
  vipPriceInfo,
  buyVipPriceInfo,
  getPushTotalByCoinId,
  currencyApplicationDownloadUrl
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  reflashUserInfo,
  getServiceProtocolData
} from '../../../utils/commonFunc'
// 底部
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    FooterCommon // 底部
  },
  data () {
    return {
      vipPictureBanner: require('../../../assets/user/VIPbanner.png'), // vip banner
      errorEditorMsg: '',
      showOpenTheVIPPage: true, // 开启vip页面默认
      vipShowDetailsPage: false, // 开启vip详情页面默认
      password: '', // 开启vip详情页面默认
      vipPriceInfo1: [], // vip信息接收
      dialogFormVisible: false,
      type: 1, // vip类型
      active: 0,
      changeRed: 0,
      changeRed1: 0,
      month: '', // 月份
      vipName: '', // vip名称
      configValue: '', // 币种id
      currencyAsset: 0, // 币种数量
      activeStatus: 0, // VIP状态
      loadingCircle: {}, // 整页loading
      discountsInstructionStatus: false, // 折扣说明弹窗显示状态
      serviceAgreementStatus: false,
      discountsInstructionContent: '', // 折扣说明内容
      serviceAgreementContent: '', // vip服务条款
      fullscreenLoading: false // 整页loading
    }
  },
  async created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/VipMainContent/VipMainContent.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/VipMainContent/VipMainContentDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/VipMainContent/VipMainContentNight.css')
    if (this.vipLeavl) {
      this.activeStatus = this.vipLeavl.split('')[3]
    }
    this.getServiceProtocolData()
    reflashUserInfo(this)
    await this.getVipPriceInfo()
    await this.getCurrencyApplicationDownloadUrl()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
    ]),
    changeServiceAgreement (type) {
      switch (type) {
        case 0:
          this.discountsInstructionStatus = true
          break
        case 1:
          this.serviceAgreementStatus = true
          break
      }
    },
    // vip 服务协议
    async getServiceProtocolData () {
      const params = {
        termsTypeIds: '11,12', // 用户协议代号
        language: this.language
      }
      await getServiceProtocolData(this, params, (data) => {
        console.log(data)
        this.serviceAgreementContent = data.data.data[0].content
        this.discountsInstructionContent = data.data.data[1].content
      })
    },
    // 点击返回上个页面
    returnSuperior () {
      this.$router.push({path: '/PersonalCenter'})
    },
    // vip开通页面点击页面
    statusImmediatelyOpened (paymentType, safeState) {
      this.activeType = paymentType
      this.state = safeState
      this.showOpenTheVIPPage = false
      this.vipShowDetailsPage = true
    },
    // vip详情页面资产渲染
    stateOpeningLevel (type) {
      switch (type) {
        case 1:
          this.type = 1
          this.changeRed1 = 1
          break
        case 2:
          this.type = 2
          this.changeRed1 = 2
          break
        case 3:
          this.type = 3
          this.changeRed1 = 3
          break
        case 4:
          this.type = 3
          this.changeRed1 = 4
          break
        case 5:
          this.type = 5
          this.changeRed1 = 5
          break
        case 6:
          this.type = 6
          this.changeRed1 = 6
          break
      }
      this.type = type
    },
    // 创建api检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 编辑用户备注
        case 0:
          if (!targetNum) {
            // 请输入交易密码
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorEditorMsg = msg
    },
    // 确定提交
    confirmSubmit () {
      if (!this.vipName && !this.month) {
        this.$message({
          message: this.$t('M.user_vip_please_choose'),
          type: 'error'
        })
      } else {
        this.password = ''
        this.dialogFormVisible = true
      }
    },
    // 选择当前开通月数显示样式
    change (index) {
      this.changeRed = index
    },
    // 选择当前开通月数
    changeMonth (month, vipName) {
      console.log(month, vipName)
      switch (month) {
        case 3:
          this.month = '3'
          this.changeRed = 3
          this.vipName = vipName
          break
        case 6:
          this.month = '6'
          this.changeRed = 6
          this.vipName = vipName
          break
        case 12:
          this.month = '12'
          this.changeRed = 12
          this.vipName = vipName
          break
        case 1:
          this.month = '1'
          this.changeRed = 1
          this.vipName = vipName
          break
      }
    },
    // 提交开通vip交易密码
    dialogFormVisibleButton () {
      this.confirmTransactionPassword()
    },
    // 提交开通vip接口请求
    async confirmTransactionPassword () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.password)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let params = {
          payPassword: this.password, // 用户password
          vipName: this.vipName,
          month: this.month
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await buyVipPriceInfo(params)
        if (!(returnAjaxMessage(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
          this.dialogFormVisible = false
          this.password = ''
          reflashUserInfo(this)
          this.toggleAssetsCurrencyId()
          console.log(data)
        }
      }
    },
    /**
    /**
     * vip价格
     */
    async getVipPriceInfo () {
      let data = await vipPriceInfo({})
      console.log(data)
      // 整页loading
      this.fullscreenLoading = true
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        if (data.data.data) {
          // 返回展示
          this.vipPriceInfo1 = data.data.data
          console.log(this.vipPriceInfo1[0].vipCoinName)
        }
      }
    },
    async getCurrencyApplicationDownloadUrl () {
      let data = await currencyApplicationDownloadUrl({
        key: 'VIP_COIN'
      })
      console.log(data)
      // 整页loading
      this.fullscreenLoading = true
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回展示
        this.configValue = data.data.data.configValue
        this.toggleAssetsCurrencyId()
      }
    },
    // 根据币种id获取可用余额
    async toggleAssetsCurrencyId () {
      let data
      let param = {
        coinId: this.configValue // 币种coinId
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await getPushTotalByCoinId(param)
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.currencyAsset = data.data.data.total
        console.log(this.currencyAsset)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      vipLeavl: state => state.user.loginStep1Info.userInfo.level
    }),
    filteredData () {
      console.log(this.vipPriceInfo1)
      return this.vipPriceInfo1.filter((item) => {
        // console.log(item)
        return item.id == this.type
      })
    }
  },
  watch: {
    vipLeavl (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
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
      .error-msg{
        height:25px;
        line-height: 25px;
        color: rgb(212, 88, 88);
      }
      > .content-main {
        > .content-info-hint {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }
        .error-msg{
          height:30px;
          line-height: 30px;
          padding-left: 35px;
          color: rgb(212, 88, 88);
        }
        width: 1300px;
        min-height: 300px;
        margin: 0 auto;
        flex-wrap: wrap;
        >.content-main-box {
          position: relative;
          >.content-box {
            flex-wrap: wrap;
            width: 250px;
            /*height: 380px;*/
            background-color: #1C1F32;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            opacity:0.7;
          }
          > .content-module {
            flex-wrap: wrap;
            width: 250px;
            height: 380px;
            margin-right: 4px;
            > .content-vip-one {
              height: 112px;
              line-height: 112px;
              font-size: 36px;
            }
            > .content-discount {
              margin: 0 3px;
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
        }
      }
      > .content-detail-page {
        .blue1{
          background-color: transparent !important;
          border: 1px solid #338FF5 !important;
          .duration-month {
            color: #338FF5 !important;
            font-weight: 600;
          }
        }
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
          .red{
            background-color: transparent !important;
            border: 1px solid #338FF5 !important;
            .duration-month {
              color: #338FF5 !important;
              font-weight: 600;
            }
          }
          > .duration {
            position: relative;
            .triangle-style {
              position: absolute;
              top: 0;
              right: 0;
              width: 40px;
              height: 24px;
              line-height: 24px;
              color: #fff;
              border-top-left-radius: 15px;
              border-bottom-left-radius: 15px;
              background-color: #338FF5;
            }
            &:hover {
              background-color: transparent !important;
              border: 1px solid #338FF5 !important;
              .duration-month {
                color: #338FF5 !important;
                font-weight: 600;
              }
            }
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
        width: 1300px;
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
        background-color: #272B41;
      }
      > .content-main-content {
        margin-top: -3px;
        background: #272B41;
        .html-content{
          color:$nightFontColor;
        }
        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338FF5;
            }
          }
          >.content-main-box {
            > .content-module {
              background-color: #1C1F32;
              border: 2px solid #33404B;
              &.disable {
                opacity: 0.5;
              }
              &.active1 {
                &:hover {
                  border: 4px solid #338FF5;
                  transform: scale(1.03);
                  box-shadow: 0 0 15px rgba(0, 0, 0, 1);
                  > .content-text {
                    font-weight: 600;
                    color: rgba(51, 143, 245, 1);
                  }
                  > .content-discount {
                    background-color: #2D3651;
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
              }
              > .content-vip-one {
                color: #fff;
              }
              > .content-text {
                color: rgba(51, 143, 245, 0.6);;
              }
              > .content-discount {
                background-color: #2D3651;
                color: rgba(255, 255, 255, 0.6);
                > .content-discount-color {
                  color: rgba(51, 143, 245, 0.6);
                }
              }
              > .content-button {
                > .click-btn {
                  background:linear-gradient(0deg,rgba(26,29,47,1) 0%,rgba(45,54,81,1) 100%);
                  color: #fff;
                }
              }
            }
          }
          /*> .content-border-rl {*/
            /*border-right: 0;*/
            /*border-left: 0;*/
          /*}*/
        }
        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              color: red;
              font-size: 30px;
            }
            .p {
              color: blue
            }
            .blue {
              background-color: transparent !important;
              border: 1px solid #338FF5 !important;
              > .grade-color,
              > .grade-height {
                color: #338FF5 !important;
              }
            }
            .grade {
              background-color: #1A2233;
              border: 1px solid #354057;
              &:hover {
                background-color: transparent;
                border: 1px solid #338FF5;
                > .grade-color,
                > .grade-height {
                  color: #338FF5;
                }
              }
              > .grade-color {
                color: #fff;
              }
              > .grade-height {
                color: #9DA5B3;
              }
            }
          }
          > .detail-page-duration {
            > .duration {
              background-color: #1A2233;
              border: 1px solid #354057;
              > .duration-month {
                color: #fff;
              }
              > .duration-currency {
                color: #D45858;
              }
              > .duration-through {
                color: #9DA5B3;
              }
            }
          }
          > .detail-usable {
            > .usable {
              > .usable-asset {
                color: #D45858;
                font-weight: 600;
                > .currency {
                  color: #fff;
                }
              }
              > .usable-gain {
                color: #338FF5;
              }
            }
          }
          > .detail-page-btn {
            > .page-btn {
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              border-radius: 4px;
            }
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
    }
    &.day {
      background-color: $dayBgColor;
      color: $dayFontColor;
      > .content-main-content {
        background-color: $dayBgColor;
        color:$dayFontColor;
      }
      > .content-main-content {
        margin-top: -3px;
        background-color: $dayBgColor;
        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338FF5;
            }
          }
          >.content-main-box {
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
                  background-color: #2D3651;
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
                background-color: #2D3651;
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
          }
          /*> .content-border-rl {*/
            /*border-right: 0;*/
            /*border-left: 0;*/
          /*}*/
        }
        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              color: red;
              font-size: 30px;
            }
            .p {
              color: blue
            }
            .blue {
              background-color: transparent !important;
              border: 1px solid #338FF5 !important;
              > .grade-color,
              > .grade-height {
                color: #338FF5 !important;
              }
            }
            .grade {
              background-color: #1A2233;
              border: 1px solid #354057;
              &:hover {
                background-color: transparent;
                border: 1px solid #338FF5;
                > .grade-color,
                > .grade-height {
                  color: #338FF5;
                }
              }
              > .grade-color {
                color: #fff;
              }
              > .grade-height {
                color: #9DA5B3;
              }
            }
          }
          > .detail-page-duration {
            background-color: $dayBgColor;
            > .duration {
              background-color: #1A2233;
              border: 1px solid #354057;
              > .duration-month {
                color: #fff;
              }
              > .duration-currency {
                color: #D45858;
              }
              > .duration-through {
                color: #9DA5B3;
              }
            }
          }
          > .detail-usable {
            > .usable {
              > .usable-asset {
                color: #D45858;
                font-weight: 600;
                > .currency {
                  color: #fff;
                }
              }
              > .usable-gain {
                color: #338FF5;
              }
            }
          }
          > .detail-page-btn {
            > .page-btn {
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              border-radius: 4px;
            }
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
    }
  }
</style>
