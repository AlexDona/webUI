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
      <div class="title">
        <!-- 一键开通VIP享受优惠特权 -->
        {{$t('M.user_vip_one_key_open')}}
      </div>
    </div>
    <div
      class="loading-box"
      v-if="fullscreenLoading"
    >
    </div>
    <div class="content-main-content">
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
            @click.prevent="changeVipLevel(item.id)"
            :class="{
              active:activeId == item.id,
              disabled: (activeStatus >= item.id && vipAction=='update') || (activeStatus!=item.id && vipAction==='renew'),
              'hover-active': (vipAction =='update' && activeStatus < item.id) || vipAction =='open'
            }"
            v-for="item in VipPriceInfoList"
            :key="item.id"
          >
            <p class="font-size16 grade-color font-weight600">
              VIP{{item.id}}
            </p>
            <p class="font-size12 grade-height">
              <!--手续费9、8、7、6、5折-->
              {{ $t('M.comm_service_charge') }}{{10-item.id}}{{ $t('M.user_vip_break') }}
            </p>
          </div>
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
            :class="{
              active: changeRed == 3,
              'hover-active': vipAction !== 'update',
              disabled: vipAction =='update'
            }"
          >
            <span class="triangle-style font-size12 text-align-c">
              <!-- 推荐 -->
              {{ $t('M.user_vip_recommend') }}
            </span>
            <p class="duration-month font-size16">
              <!--3个月-->
              3{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[1]?filteredData[1].value:'--'}}{{vipPriceInfo1[1]?vipPriceInfo1[1].vipCoinName:'--'}}
            </p>
            <p class="duration-through ">
              <!--600FUC-->
              {{filteredData[1]?filteredData[1].costValue:'--'}}{{filteredData[1]?filteredData[1].vipCoinName:'--'}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(6, filteredData[1].id)"
            :class="{
              active:changeRed == 6,
              'hover-active': vipAction !== 'update',
              disabled: vipAction =='update'
            }"
          >
            <p class="duration-month font-size16">
              <!--6个月-->
              6{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[2]?filteredData[2].value:'--'}}{{filteredData[2]?filteredData[2].vipCoinName:'--'}}
            </p>
            <p class="duration-through ">
              <!--600FUC-->
              {{filteredData[2]?filteredData[2].costValue:'--'}}{{filteredData[2]?filteredData[2].vipCoinName:'--'}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(12, filteredData[2].id)"
            :class="{
              active:changeRed == 12,
              'hover-active': vipAction !== 'update',
              disabled: vipAction =='update'
            }"
          >
            <p class="duration-month font-size16">
              <!--12个月-->
              12{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[3]?filteredData[3].value:'--'}}{{filteredData[3]?filteredData[3].vipCoinName:'--'}}
            </p>
            <p class="duration-through">
              <!--1200FUC-->
              {{filteredData[3]?filteredData[3].costValue:'--'}}{{filteredData[3]?filteredData[3].vipCoinName:'--'}}
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(1, filteredData[3].id)"
            :class="{
              active:changeRed == 1,
              'hover-active': vipAction !== 'update',
              disabled: vipAction =='update'
            }"
          >
            <p class="duration-month font-size16">
              1{{ $t('M.user_vip_months') }}
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[0]?filteredData[0].value:'--'}}{{filteredData[0]?filteredData[0].vipCoinName:'--'}}
            </p>
          </div>
        </div>
        <!-- 应付 -->
        <div class="detail-usable display-flex">
          <span class="usable-title font-size14">{{$t('M.comm_should_pay')}}</span>
          <span class="usable">
            <span class="usable-asset font-size16">
              {{ needUserPayCount }}
              <sub class="currency font-size12">
                {{filteredData[0]?filteredData[0].vipCoinName:'--'}}
              </sub>
            </span>
          </span>
        </div>
        <!-- 可用 -->
        <div class="detail-usable display-flex">
          <span class="usable-title font-size14">{{$t('M.comm_usable')}}</span>
          <span class="usable">
            <span class="usable-asset font-size16">
              {{ currencyAsset }}
              <sub class="currency font-size12">
                {{filteredData[0]?filteredData[0].vipCoinName:'--'}}
              </sub>
            </span>
            <span
              class="usable-gain cursor-pointer font-size12 display-inline-block"
              @click.prevent="goToAccountAssets"
            >
              <!--立即获取-->
              {{ $t('M.user_vip_immediate_access') }}
            </span>
          </span>
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
        >
        </div>
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
        >
        </div>
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
              autocomplete= "new-password"
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
import {
  vipPriceInfo,
  buyVipPriceInfo,
  getPushTotalByCoinId,
  currencyApplicationDownloadUrl,
  getVipUserPayCount
} from '../../utils/api/personal'
import {getServiceProtocoDataAjax} from '../../utils/api/common'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {
  getStoreWithJson,
  getStore

} from '../../utils'
// 底部
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {},
  data () {
    return {
      vipPictureBanner: require('../../assets/user/VIPbanner.png'), // vip banner
      errorEditorMsg: '',
      showOpenTheVIPPage: true, // 开启vip页面默认
      vipShowDetailsPage: true, // 开启vip详情页面默认
      password: '', // 开启vip详情页面默认
      vipPriceInfo1: [], // vip信息接收
      dialogFormVisible: false,
      type: 1, // vip类型
      active: 0,
      changeRed: 0,
      activeId: 0,
      month: '', // 月份
      vipName: '', // vip名称
      coinId: '', // 币种id
      currencyAsset: 0, // 币种数量
      activeStatus: 0, // VIP状态
      loadingCircle: {}, // 整页loading
      discountsInstructionStatus: false, // 折扣说明弹窗显示状态
      serviceAgreementStatus: false,
      // 折扣说明内容
      discountsInstructionContent: '',
      // vip服务条款
      serviceAgreementContent: '',
      // 整页loading
      fullscreenLoading: true,
      // 用户需要支付金额
      needUserPayCount: 0,
      returnJumpTimer: null // 返回跳转倒计时
    }
  },
  async created () {
    console.log(this.vipAction)
    if (this.vipLevel) {
      this.activeStatus = this.vipLevel.split('')[3] - 0
    }
    console.log(this.activeStatus)
    if (this.activeSelectLevel) {
      this.activeId = this.activeSelectLevel
      this.type = this.activeSelectLevel
      this.vipName = this.activeSelectLevel
      if (this.vipAction === 'update') {
        this.getVipUserPayCount()
      }
    }
    this.getServiceProtocolData()
    await this.REFRESH_USER_INFO_ACTION()
    await this.getVipPriceInfo()
    await this.getCurrencyApplicationDownloadUrl()
    console.log(this.VipPriceInfoList)
    console.log(this.vipName)
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {
  },
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    // 获取用户应付金额
    async getVipUserPayCount () {
      const params = {
        vipName: this.vipName,
        type: this.vipAction
      }
      if (this.vipAction !== 'update') {
        params.month = this.month
      }
      const data = await getVipUserPayCount(params)
      if (!data) return false
      this.needUserPayCount = getNestedData(data, 'data')
      console.log(this.needUserPayCount)
    },
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
      const data = await getServiceProtocoDataAjax(params)
      this.serviceAgreementContent = getNestedData(data, 'data[0].content')
      this.discountsInstructionContent = getNestedData(data, 'data[1].content')
    },
    // 跳转我的资产
    goToAccountAssets () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('assets')
      this.$goToPage('/PersonalCenter')
    },
    // vip详情页面资产渲染
    changeVipLevel (type) {
      console.log(type, this.activeSelectLevel, this.vipAction)
      if ((this.vipAction == 'update' && type <= this.activeStatus) || this.vipAction === 'renew') {
        return false
      }
      switch (type) {
        case 1:
          this.type = 1
          this.activeId = 1
          this.vipName = 1
          break
        case 2:
          this.type = 2
          this.activeId = 2
          this.vipName = 2
          break
        case 3:
          this.type = 3
          this.activeId = 3
          this.vipName = 3
          break
        case 4:
          this.type = 4
          this.activeId = 4
          this.vipName = 4
          break
        case 5:
          this.type = 5
          this.activeId = 5
          this.vipName = 5
          break
        case 6:
          this.type = 6
          this.activeId = 6
          this.vipName = 6
          break
      }
      this.type = type
      this.getVipUserPayCount()
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
    async confirmSubmit () {
      console.log(this.vipAction)
      if ((!this.vipName || !this.month) && this.vipAction !== 'update') {
        this.$message({
          message: this.$t('M.user_vip_please_choose'),
          type: 'error'
        })
        return false
      }
      if (this.needUserPayCount > this.currencyAsset) {
        this.$message({
          message: this.$t('M.user_vip_lack_of_available'),
          type: 'error'
        })
        return false
      }
      this.password = ''
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.userInfo, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      this.dialogFormVisible = true
    },
    // 选择当前开通月数显示样式
    change (index) {
      this.changeRed = index
    },
    // 选择当前开通月数
    changeMonth (month, vipName) {
      console.log(month, vipName)
      console.log(this.vipAction)
      if (this.vipAction === 'update') {
        return false
      }
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
      this.getVipUserPayCount()
    },
    // 提交开通vip交易密码
    dialogFormVisibleButton () {
      this.confirmTransactionPassword()
    },
    // 提交开通vip接口请求
    async confirmTransactionPassword () {
      console.log(this.needUserPayCount, this.currencyAsset)
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
          month: this.month,
          type: this.vipAction
        }
        // 整页loading
        this.fullscreenLoading = true
        data = await buyVipPriceInfo(params)
        // 接口失败清除loading
        this.fullscreenLoading = false
        this.dialogFormVisible = false
        if (!data) return false
        this.password = ''
        this.REFRESH_USER_INFO_ACTION()
        this.toggleAssetsCurrencyId()
        console.log(data)
        this.returnJumpTimer = setTimeout(() => {
          this.$goToPage('/VipMainContent')
        }, 3000)
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
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.vipPriceInfo1 = getNestedData(data, 'data.data')
        console.log(this.vipPriceInfo1)
      }
    },
    async getCurrencyApplicationDownloadUrl () {
      // 整页loading
      this.fullscreenLoading = true
      let data = await currencyApplicationDownloadUrl({
        key: 'VIP_COIN_NAME'
      })
      // 接口失败清除loading
      this.fullscreenLoading = false
      if (!data) return false
      // 返回展示
      // this.coinId = data.data.data.coinId
      this.coinId = getNestedData(data, 'data.coinId')
      // 任修复报错问题
      this.toggleAssetsCurrencyId()
    },
    // 根据币种id获取可用余额
    async toggleAssetsCurrencyId () {
      let data
      let param = {
        coinId: this.coinId // 币种coinId
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await getPushTotalByCoinId(param)
      // 接口失败清除loading
      this.fullscreenLoading = false
      if (!data) return false
      this.currencyAsset = getNestedData(data, 'data.total')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      vipLevel: state => state.user.loginStep1Info.userInfo.level,
      originVipPriceInfoList: state => state.user.vip.VipPriceInfoList,
      payPassword: state => state.user.loginStep1Info.userInfo.payPassword,
      activeSelectLevel: state => getStore('activeSelectLevel') || state.user.vip.activeSelectLevel,
      // vip操作
      vipAction: state => getStore('vipAction') || state.user.vip.vipAction,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    }),
    filteredData () {
      console.log(this.vipPriceInfo1)
      return this.vipPriceInfo1.filter((item) => {
        // console.log(item)
        return item.id == this.type
      })
    },
    VipPriceInfoList () {
      return this.originVipPriceInfoList.length ? this.originVipPriceInfoList : getStoreWithJson('VipPriceInfoList')
    }
  },
  watch: {
    async language () {
      await this.getServiceProtocolData()
    },
    vipAction (newVal) {
      console.log(newVal)
    },
    vipLevel (newVal) {
      console.log(newVal)
    },
    VipPriceInfoList (newVal) {
      console.log(newVal)
    },
    filteredData (newVal) {
      console.log(newVal)
    }
  },
  destroyed () {
    // 离开本组件清除定时器
    if (this.returnJumpTimer) {
      clearTimeout(this.returnJumpTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/Personal/IndexPersonal";

  .vip-main {
    margin-top: 65px;

    > .header-content {
      position: relative;
      width: 100%;
      margin: 0 auto;

      > .images {
        width: 100%;
      }

      > .title {
        position: absolute;
        top: 30%;
        left: 47%;
        font-size: 48px;
        color: #fff;
        transform: translate(-50%, -50%);
      }
    }

    > .loading-box {
      width: 100%;
      height: 800px;
    }

    > .content-main-content {
      height: 100%;

      .error-msg {
        height: 25px;
        line-height: 25px;
        color: rgb(212, 88, 88);
      }

      > .content-main {
        flex-wrap: wrap;
        width: 1300px;
        min-height: 300px;
        margin: 0 auto;

        > .content-info-hint {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }

        .error-msg {
          height: 30px;
          padding-left: 35px;
          line-height: 30px;
          color: rgb(212, 88, 88);
        }

        > .content-main-box {
          position: relative;

          > .content-box {
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            flex-wrap: wrap;
            width: 250px;
            background-color: #1c1f32;
            opacity: .7;
          }

          > .content-module {
            flex-wrap: wrap;
            width: 250px;
            height: 380px;
            margin-right: 4px;

            > .content-vip-one {
              height: 112px;
              font-size: 36px;
              line-height: 112px;
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
                margin-top: 35px;
                transform: skew(-15deg);
              }
            }
          }
        }
      }

      > .content-detail-page {
        width: 900px;
        min-height: 500px;
        margin: 10px auto;

        .active {
          border: 1px solid #338ff5 !important;
          background-color: transparent !important;

          .duration-month {
            font-weight: 600;
            color: #338ff5 !important;
          }
        }

        > .detail-page-grade {
          > .page-grade-title {
            line-height: 70px;
          }

          .grade {
            width: 100px;
            height: 70px;
            padding: 13px;
            margin-left: 40px;

            > .grade-height {
              margin-top: 5px;
            }
          }
        }

        > .detail-page-duration {
          margin-top: 100px;

          > .duration-title {
            width: 114px;
            height: 150px;
            line-height: 150px;
          }

          .active {
            border: 1px solid #338ff5 !important;
            background-color: transparent !important;

            .duration-month {
              font-weight: 600;
              color: #338ff5 !important;
            }
          }

          > .duration {
            position: relative;
            width: 140px;
            height: 150px;
            padding: 28px;

            .triangle-style {
              position: absolute;
              top: 0;
              right: 0;
              min-width: 40px;
              height: 24px;
              padding: 0 2px;
              border-bottom-left-radius: 15px;
              border-top-left-radius: 15px;
              line-height: 24px;
              color: #fff;
              background-color: #338ff5;
            }

            &.disabled {
              opacity: .3;
              cursor: default;
            }

            &.hover-active {
              &:hover {
                border: 1px solid #338ff5 !important;
                background-color: transparent !important;

                .duration-month {
                  font-weight: 600;
                  color: #338ff5 !important;
                }
              }
            }

            > .duration-currency {
              padding: 8px 0;
            }

            > .duration-through {
              text-decoration: line-through;
            }
          }

          > .duration-left {
            margin-left: 60px;
          }
        }

        > .detail-usable {
          margin: 100px 0 80px;

          > .usable-title {
            width: 100px;
          }

          > .usable {
            width: 500px;

            > .usable-asset {
              > .currency {
                margin-left: 5px;
              }
            }

            > .usable-gain {
              margin-left: 25px;
            }
          }
        }

        > .detail-page-btn {
          width: 100%;
          height: 40px;
          margin-bottom: 50px;

          > .page-btn {
            width: 290px;
            height: 40px;
          }
        }
      }

      > .text-below {
        width: 900px;
        height: 350px;
        padding-top: 80px;
        margin: 0 auto;
        line-height: 25px;

        > .warm-prompt {
          font-weight: 600;
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-dialog {
        top: 5%;
        width: 310px;
        border-radius: 10px;

        .el-dialog__header {
          padding: 10px 20px;
          border-radius: 5px 5px 0 0;
          background-color: #20293c;
        }

        .el-dialog__body {
          padding: 0 20px 10px;

          .ql-editor {
            padding-top: 0;
          }
        }

        .el-dialog__title {
          color: #fff;
        }
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__label {
        color: #fff;
      }

      .el-input__inner {
        width: 270px;
        height: 34px;
        border: 1px solid rgba(72, 87, 118, 1);
        background-color: #1a2233;

        &:focus {
          border: 1px solid #338ff5;
        }
      }

      .el-button {
        width: 270px;
        height: 36px;
        border: 0;
        line-height: 0;
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .content-main-content {
        .discounts-instruction-dialog {
          .el-dialog {
            height: 800px;
            overflow: auto;
          }

          .el-dialog__header {
            text-align: center;
            background-color: transparent;
          }

          .el-dialog__title {
            color: #338ff5;
          }
        }
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .header-content {
        background-color: #272b41;
      }

      > .content-main-content {
        margin-top: -3px;
        background: #272b41;

        .html-content {
          color: $nightFontColor;
        }

        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338ff5;
            }
          }

          > .content-main-box {
            > .content-module {
              border: 2px solid #33404b;
              background-color: #1c1f32;

              &.disable {
                opacity: .5;
              }

              &.active1 {
                &:hover {
                  border: 4px solid #338ff5;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 1);
                  transform: scale(1.03);

                  > .content-text {
                    font-weight: 600;
                    color: rgba(51, 143, 245, 1);
                  }

                  > .content-discount {
                    color: rgba(255, 255, 255, 1);
                    background-color: #2d3651;

                    > .content-discount-color {
                      font-weight: 600;
                      color: rgba(51, 143, 245, 1);
                    }
                  }

                  > .content-button {
                    > .click-btn {
                      color: #fff;
                      background: #338ff5;
                    }
                  }
                }
              }

              > .content-vip-one {
                color: #fff;
              }

              > .content-text {
                color: rgba(51, 143, 245, .6);
              }

              > .content-discount {
                color: rgba(255, 255, 255, .6);
                background-color: #2d3651;

                > .content-discount-color {
                  color: rgba(51, 143, 245, .6);
                }
              }

              > .content-button {
                > .click-btn {
                  color: #fff;
                  background: linear-gradient(0deg, rgba(26, 29, 47, 1) 0%, rgba(45, 54, 81, 1) 100%);
                }
              }
            }
          }
        }

        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              font-size: 30px;
              color: red;
            }

            .p {
              color: blue;
            }

            .active {
              border: 1px solid #338ff5 !important;
              background-color: transparent !important;

              > .grade-color,
              > .grade-height {
                color: #338ff5 !important;
              }
            }

            .grade {
              border: 1px solid #354057;
              background-color: #1a2233;

              &.disabled {
                opacity: .3;
                cursor: default;
              }

              &.hover-active {
                &:hover {
                  border: 1px solid #338ff5;
                  background-color: transparent;

                  > .grade-color,
                  > .grade-height {
                    color: #338ff5;
                  }
                }
              }

              > .grade-color {
                color: #fff;
              }

              > .grade-height {
                color: #9da5b3;
              }
            }
          }

          > .detail-page-duration {
            > .duration {
              border: 1px solid #354057;
              background-color: #1a2233;

              > .duration-month {
                color: #fff;
              }

              > .duration-currency {
                color: #d45858;
              }

              > .duration-through {
                color: #9da5b3;
              }
            }
          }

          > .detail-usable {
            > .usable {
              > .usable-asset {
                font-weight: 600;
                color: #d45858;

                > .currency {
                  color: #fff;
                }
              }

              > .usable-gain {
                color: #338ff5;
              }
            }
          }

          > .detail-page-btn {
            > .page-btn {
              border-radius: 4px;
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }
          }
        }

        > .text-below {
          > .warm-prompt {
            color: #fff;
          }

          .prompt-color {
            color: #d45858;
          }

          .warm-text-color {
            color: #9da5b3;
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-dialog {
          background-color: #28334a;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      /deep/ {
        .el-dialog__header {
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__title {
          color: #333;
        }

        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          &:focus {
            border: 1px solid #338ff5;
          }
        }
      }

      > .content-main-content {
        margin-top: -3px;
        color: $dayFontColor;
        background-color: $dayBgColor;

        > .content-main {
          .content-info-hint {
            .hint-color {
              color: #338ff5;
            }
          }

          > .content-main-box {
            > .content-module {
              border: 2px solid rgba(222, 228, 233, 1);
              background: rgba(234, 239, 244, 1);

              &.disable {
                opacity: .5;
              }

              &.active1 {
                &:hover {
                  border: 2px solid #338ff5;
                  transform: scale(1.03);

                  > .content-text {
                    font-weight: 600;
                    color: rgba(51, 143, 245, 1);
                  }

                  > .content-button {
                    > .click-btn {
                      color: #fff;
                      background: #338ff5;
                    }
                  }
                }
              }

              > .content-vip-one {
                color: #333;
              }

              > .content-text {
                color: rgba(51, 143, 245, .6);
              }

              > .content-discount {
                color: rgba(34, 34, 34, .6);
                background: rgba(222, 231, 239, 1);

                > .content-discount-color {
                  color: rgba(51, 143, 245, .6);
                }
              }

              > .content-button {
                > .click-btn {
                  color: #fff;
                  background: #99b4d1;
                }
              }
            }
          }
        }

        > .content-detail-page {
          .active {
            border: 1px solid #338ff5 !important;
            background-color: transparent !important;

            .duration-month {
              font-weight: 600;
              color: red !important;
            }
          }

          > .detail-page-grade {
            .p1 {
              font-size: 30px;
              color: red;
            }

            .p {
              color: blue;
            }

            .active {
              border: 1px solid #338ff5 !important;
              color: #338ff5 !important;
              background-color: transparent !important;

              > .grade-color,
              > .grade-height {
                color: #338ff5 !important;
              }
            }

            .grade {
              background-color: #eaeff4;

              &:hover {
                border: 1px solid #338ff5;
                background-color: transparent;

                > .grade-color,
                > .grade-height {
                  color: #338ff5;
                }
              }

              > .grade-color {
                color: #333;
              }

              > .grade-height {
                color: #222;
              }
            }
          }

          > .detail-page-duration {
            background-color: $dayBgColor;

            > .duration {
              background: rgba(234, 239, 244, 1);

              > .duration-month {
                font-weight: 600;
                color: #333;
              }

              > .duration-currency {
                font-weight: 600;
                color: #d45858;
              }

              > .duration-through {
                color: #333;
              }
            }
          }

          > .detail-usable {
            > .usable {
              > .usable-asset {
                font-weight: 600;
                color: #d45858;

                > .currency {
                  color: #fff;
                }
              }

              > .usable-gain {
                color: #338ff5;
              }
            }
          }

          > .detail-page-btn {
            > .page-btn {
              border-radius: 4px;
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }
          }
        }

        > .text-below {
          > .warm-prompt {
            color: #fff;
          }

          .prompt-color {
            color: #d45858;
          }

          .warm-text-color {
            color: #9da5b3;
          }
        }
      }
    }
  }
</style>
