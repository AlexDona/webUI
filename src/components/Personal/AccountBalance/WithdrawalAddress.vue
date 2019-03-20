<template>
  <div
    class="withdrawal-address personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
  >
    <div
      class="withdrawal-address-main"
    >
      <header class="withdrawal-header personal-height40 line-height40 background-color padding-left23 border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          <!--提币地址-->
          {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
        </span>
      </header>
      <div class="withdrawal-address-content padding-left15">
        <div class="withdrawal-address-box margin-top30">
          <el-form
            ref="form"
            label-width="70px"
          >
            <!--币种-->
            <el-form-item
              :label="$t('M.comm_currency')"
            >
              <el-select
                v-model="currencyValue"
                filterable
                :no-data-text="$t('M.comm_no_data')"
              >
                <el-option
                  :placeholder="$t('M.comm_please_choose')"
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :label="item.name"
                  :value="item.coinId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--备注-->
            <el-form-item
              :label="$t('M.comm_remark')"
            >
              <input
                class="form-input border-radius4 padding-left15"
                v-model="withdrawalRemark"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, withdrawalRemark)"
                maxlength="20"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--提币地址-->
            <el-form-item
              :label="$t('M.comm_mention_money') + $t('M.comm_site')"
            >
              <input
                class="form-input border-radius4 padding-left15"
                v-model="withdrawalAddress"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, withdrawalAddress)"
              >
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <button
              class="form-button border-radius4 cursor-pointer"
              @click.prevent="addAddress"
            >
              <!--新增-->
              {{ $t('M.comm_newly_increased') }}
            </button>
          </el-form>
          <div class="withdrawal-dialog">
            <!--提币 手机验证 邮箱验证 谷歌验证-->
            <el-dialog
              :title="$t('M.comm_mention_money')"
              :visible.sync="mentionMoneyConfirm"
            >
              <el-form
                :label-position="labelPosition"
              >
                <!--手机已认证-->
                <el-form-item
                  v-if="securityCenter.isPhoneEnable"
                  :label="$t('M.comm_code_phone')"
                >
                  <input
                    class="content-input padding-l15 box-sizing"
                    type="number"
                    v-model="phoneCode"
                    @focus="emptyStatus"
                  >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                    v-if="mentionMoneyConfirm"
                  />
                </el-form-item>
                <!--手机未认证-->
                <span v-else></span>
                <!--邮箱已认证-->
                <el-form-item
                  v-if="securityCenter.isMailEnable"
                  :label="$t('M.comm_code_email')"
                >
                  <input
                    class="content-input padding-l15 box-sizing"
                    type="number"
                    v-model="emailCode"
                    @focus="emptyStatus"
                  >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                    v-if="mentionMoneyConfirm"
                  />
                </el-form-item>
                <!--邮箱未认证-->
                <span v-else></span>
                <!--谷歌已认证-->
                <el-form-item
                  v-if="securityCenter.isGoogleEnable"
                  :label="$t('M.comm_code_google')"
                >
                  <input
                    class="content-input content-input1 input-google padding-l15 box-sizing"
                    type="number"
                    v-model="googleCode"
                    @focus="emptyStatus"
                  >
                </el-form-item>
                <!--谷歌未认证-->
                <span v-else></span>
              </el-form>
              <div
                class="error-info"
              >
                <span v-show="emptyErrorMsg">
                  {{ emptyErrorMsg }}
                </span>
              </div>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click.prevent="submitMentionMoney"
                >
                  <!--确 定-->
                  {{ $t('M.comm_confirm') }}
                </el-button>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
    </div>
    <div class="withdrawal-address-main content-main margin-top9">
      <header class="address-list-header background-color border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          <!--地址列表-->
            {{ $t('M.comm_site') }}{{ $t('M.comm_list') }}
        </span>
      </header>
      <div class="tab-list">
        <el-table
          :data="withdrawalAddressList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
          v-loading="partLoading"
          element-loading-background="rgba(0, 0, 0, 0.6)"
        >
          <!--币种-->
          <el-table-column
            :label="$t('M.comm_currency')"
            width="180"
          >
            <template slot-scope = "s">
              <div>{{ s.row.coinName }}</div>
            </template>
          </el-table-column>
          <!--备注-->
          <el-table-column
            :label="$t('M.comm_remark')"
            width="180"
          >
            <template slot-scope = "s">
              <div>{{ s.row.remark }}</div>
            </template>
          </el-table-column>
          <!--提币地址-->
          <el-table-column
            :label="$t('M.comm_mention_money') + $t('M.comm_site')"
            width="370"
          >
            <template slot-scope = "s">
              <div>{{ s.row.address }}</div>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column
            :label="$t('M.comm_operation')"
          >
            <template slot-scope = "s">
              <div
                @click.prevent="cancelId(s.row.id)"
                :id="s.row.id"
              >
                <!--{{ operation }}-->
                {{ $t(operation) }}
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="paging">
      <!--分页-->
      <el-pagination
        background
        v-show="activeName === 'current-entrust' && withdrawalAddressList.length"
        layout="prev, pager, next"
        :page-count="totalPageForMyEntrust"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>

import {
  inquireWithdrawalAddressList,
  addNewWithdrawalAddress,
  deleteUserWithdrawAddress,
  checkCurrencyAddress
} from '../../../utils/api/personal'
import ErrorBox from '../../User/ErrorBox'
import CountDownButton from '../../Common/CountDownCommon'
import {
  // returnAjaxMsg,
  sendPhoneOrEmailCodeAjax,
  getSecurityCenter,
  validateNumForUserInput,
  getNestedData
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    ErrorBox, // 错误提示接口
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      labelPosition: 'top', // form表单label方向
      // 错误信息提示
      errorShowStatusList: [
        '', // 备注
        '' // 提币地址
      ],
      emptyErrorMsg: '', // 清空错误信息提示
      currencyValue: '', // select币种
      securityCenter: {}, // 安全状态显示
      currencyList: [], // select币种列表
      withdrawalRemark: '', // 提现备注
      withdrawalAddress: '', // 提币地址
      withdrawalAddressList: [], // 提币地址列表
      operation: 'M.comm_delete', // 删除
      activeName: 'current-entrust',
      pageSize: 10, // 每页条数
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      dialogVisible: false, // 取消弹窗默认隐藏
      mentionMoneyConfirm: false, // 默认隐藏
      deleteWithdrawalId: '', // 每行数据ID
      phoneCode: '', // 手机验证
      emailCode: '', // 邮箱验证
      googleCode: '', // 谷歌验证
      fullscreenLoading: false, // 整页loading
      partLoading: false // 局部列表loading
    }
  },
  created () {
    this.getWithdrawalAddressList()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_NEW_WITHDRAW_ADDRESS'
    ]),
    checkoutInputFormat (type, targetNum) {
      // console.log(type)
      switch (type) {
        case 0:
          if (!targetNum) {
            // 请输入备注
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.comm_remark'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
        case 1:
          switch (validateNumForUserInput('withdrawal-address', targetNum)) {
            case 0:
              this.setErrorMsg(1, '')
              this.$forceUpdate()
              return 1
            case 1:
              // 请输入提币地址
              this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_site'))
              this.$forceUpdate()
              return 0
            case 2:
              // 非法地址
              this.setErrorMsg(1, this.$t('M.user_address_withdrawal'))
              this.$forceUpdate()
              return 0
          }
          break
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 清空内容信息
    emptyStatus () {
      this.emptyErrorMsg = ''
    },
    // 点击显示验证信息
    addAddress () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.withdrawalRemark) &&
        this.checkoutInputFormat(1, this.withdrawalAddress)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        // 验证通过调用新增提币地址接口
        this.gitCheckCurrencyAddress()
      }
    },
    // 新增用户提币地址校验
    async gitCheckCurrencyAddress () {
      let data
      let param = {
        coinId: this.currencyValue, // 币种coinId
        address: this.withdrawalAddress // 提币地址
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await checkCurrencyAddress(param)
      this.fullscreenLoading = false
      if (!data) return false
      // 验证通过调用验证方式接口
      await this.getSecurityCenter()
    },
    /**
     * 安全中心
     */
    async getSecurityCenter () {
      await getSecurityCenter(this, {}, data => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
          this.mentionMoneyConfirm = true
        }
      })
    },
    // 点击新增用户提币地址确认按钮
    submitMentionMoney () {
      this.stateSubmitAddAddress()
    },
    // 新增用户提币地址接口
    async stateSubmitAddAddress () {
      if (!this.phoneCode && !this.emailCode && !this.googleCode) {
        // 请输入验证码
        this.emptyErrorMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      } else {
        this.emptyErrorMsg = ''
      }
      let data
      let param = {
        coinId: this.currencyValue, // 币种coinId
        remark: this.withdrawalRemark, // 备注
        address: this.withdrawalAddress, // 提币地址
        phoneCode: this.phoneCode, // 手机验证
        emailCode: this.emailCode, // 邮箱验证
        googleCode: this.googleCode // 谷歌验证
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await addNewWithdrawalAddress(param)
      // 接口失败清除loading
      this.fullscreenLoading = false
      if (!data) return false
      this.getWithdrawalAddressList()
      this.resetFormContent()
      this.mentionMoneyConfirm = false
    },
    /**
     *  刚进页面时候 提币地址列表查询
     */
    async getWithdrawalAddressList () {
      this.partLoading = true
      console.log(this.paramOfJumpToAddWithdrawAdress)
      let params = {
        pageNum: this.currentPageForMyEntrust, // 页码
        pageSize: this.pageSize // 页数
      }
      let data = await inquireWithdrawalAddressList(params)
      this.partLoading = false
      // console.log(data)
      if (!data) return false
      // 返回列表数据
      let detailData = getNestedData(data, 'data')
      this.currencyList = getNestedData(detailData, 'canWithdrawPartnerCoinList')
      // 对ID名称进行赋值
      this.currencyValue = this.paramOfJumpToAddWithdrawAdress || getNestedData(detailData, 'canWithdrawPartnerCoinList[0].coinId')
      this.SET_NEW_WITHDRAW_ADDRESS('')
      // 对币种名称列表进行赋值
      this.withdrawalAddressList = getNestedData(detailData, 'UserWithdrawAddressPage.list')
      this.totalPageForMyEntrust = getNestedData(detailData, 'UserWithdrawAddressPage.pages') - 0
      // console.log(this.currencyList)
      // console.log(this.withdrawalAddressList)
    },
    // 删除提币地址
    cancelId (id) {
      console.log(id)
      this.deleteWithdrawalId = id
      // 确定删除提币地址？ 取消  删除
      this.$confirm(this.$t('M.user_address_delete_withdrawals'), {
        cancelButtonText: this.$t('M.comm_cancel'), // 取消
        confirmButtonText: this.$t('M.comm_confirm') // 确定
      }).then(() => {
        this.deleteWithdrawAddress(id)
      }).catch(() => {
      })
    },
    // 确认删除提币地址
    async deleteWithdrawAddress () {
      let data
      let param = {
        id: this.deleteWithdrawalId // 列表id
      }
      data = await deleteUserWithdrawAddress(param)
      // 接口清除局部loading
      this.partLoading = false
      if (!data) return false
      this.getWithdrawalAddressList()
      this.resetFormContent()
    },
    // 接口请求完成之后清空数据
    resetFormContent () {
      this.dialogVisible = false
      this.withdrawalRemark = ''
      this.withdrawalAddress = ''
      this.phoneCode = ''
      this.emailCode = ''
      this.googleCode = ''
    },
    // 发送验证码
    async sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.innerUserInfo.phone
          break
        case 1:
          params.email = this.innerUserInfo.email
          break
      }
      await sendPhoneOrEmailCodeAjax(loginType, params, this)
    },
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getWithdrawalAddressList()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      paramOfJumpToAddWithdrawAdress: state => state.personal.paramOfJumpToAddWithdrawAdress // 跳转到的提币地址
    })
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .withdrawal-address {
    > .withdrawal-address-main {
      min-height: 352px;
      border-radius: 5px;

      > .withdrawal-header {
        margin-bottom: 2px;

        > .header-content {
          font-weight: 400;
        }
      }

      > .withdrawal-address-content {
        > .withdrawal-address-box {
          min-height: 100px;

          .send-code-btn {
            position: absolute;
            top: 3px;
            width: 91px;
            height: 34px;
          }

          .error-info {
            line-height: 20px;
            color: #d45858;
          }

          .error-info1 {
            text-align: left;
          }

          .content-input {
            width: 180px;
            height: 34px;
          }

          .content-input1 {
            width: 275px;
          }

          .form-input,
          .form-button {
            box-sizing: border-box;
            width: 324px;
            height: 34px;
          }

          .form-button {
            margin: 10px 0 0 136px;
          }

          /deep/ {
            .el-form .el-form-item {
              .el-form-item__label {
                width: 115px !important;
              }
            }
          }
        }
      }

      > .address-list-header {
        height: 50px;
        padding: 0 25px;
        line-height: 50px;

        > .header-content {
          color: #338ff5;
        }
      }

      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .withdrawal-address-main {
        background-color: $nightMainBgColor;

        > .withdrawal-header {
          background-color: $nightMainBgColor;
          box-shadow: 2px 0 2px rgba(20, 23, 37, 1);

          > .header-content {
            color: #338ff5;
          }
        }

        > .withdrawal-address-content {
          > .withdrawal-address-box {
            .error-info {
              line-height: 20px;
              color: #d45858;
            }

            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .content-input {
              border: 1px solid #485776;
              color: #fff;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .form-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);
            }

            .form-input:focus {
              border: 1px solid #338ff5;
            }

            .form-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .address-list-header {
          border-bottom: 1px solid #39424d;
          color: rgba(255, 255, 255, .7);
        }

        .btn {
          border: 1px solid #338ff5;
          color: rgba(255, 255, 255, .7);
          background-color: transparent;
        }
      }

      /deep/ {
        .el-input__inner {
          border: 0;
          color: rgba(255, 255, 255, .7);
          background-color: #2d3651;
        }

        .el-form-item__label {
          padding: 0;
          margin-right: 20px;
          color: rgba(255, 255, 255, .7);
        }

        .el-table {
          background-color: #1c1f32;

          .cell {
            color: #9da5b3;
          }

          th {
            & > .cell {
              color: #a9bed4;
            }

            &.is-leaf {
              border: 0;
              background-color: #1c1f32;
            }
          }

          td {
            border: 0;
            background-color: #1c1f32;

            &:nth-child(4) {
              & > .cell {
                color: #338ff5;
              }
            }
          }
        }

        .el-table__header-wrapper {
          background-color: #1c1f32;
        }

        .el-table__body {
          tr {
            &:hover {
              & > td {
                background-color: #1c1f32;
              }
            }
          }
        }

        .el-table__empty-block {
          background-color: #1c1f32;
        }

        .el-dialog {
          background-color: #28334a;
        }

        .el-button {
          &:first-child {
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .withdrawal-dialog {
          .el-dialog__header {
            background-color: #20293c;
          }

          .el-button {
            border: 0;
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(0deg, #2b396e, #2a5082);
          }
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .withdrawal-address-main {
        border: 1px solid rgba(236, 241, 248, 1);
        color: $dayFontColor;
        background-color: $dayBgColor;

        > .withdrawal-header {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          > .header-content {
            color: #338ff5;
          }
        }

        > .withdrawal-address-content {
          > .withdrawal-address-box {
            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .content-input {
              border: 1px solid #ecf1f8;
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .form-input {
              border: 1px solid rgba(236, 241, 248, 1);
              background: rgba(255, 255, 255, 1);
            }

            .form-input:focus {
              border: 1px solid #338ff5;
            }

            .form-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .address-list-header {
          border-bottom: 1px solid rgba(236, 241, 248, 1);
          color: #338ff5;
        }

        .btn {
          border: 1px solid #338ff5;
          color: rgba(255, 255, 255, .7);
          background-color: transparent;
        }
      }

      /deep/ {
        .el-table {
          background-color: #fff;

          .cell {
            color: #333;
          }

          th {
            & > .cell {
              color: #333;
            }

            &.is-leaf {
              background-color: #fff;
            }
          }

          td {
            border-bottom: 1px solid #fff;
            background-color: #fff;

            &:nth-child(4) {
              div {
                color: #338ff5;
              }
            }
          }
        }

        .el-switch__core {
          &::after {
            background-color: #fff;
          }
        }

        .el-table__body {
          tr {
            &:hover {
              & > td {
                background-color: #fff;
              }
            }
          }
        }

        .el-form-item__label {
          padding: 0;
          margin-right: 20px;
          color: #7d90ac;
        }

        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);
        }
      }
    }

    /deep/ {
      .el-table__empty-block {
        width: 920px !important;
        height: 257px;
      }

      .el-input__inner {
        width: 130px;
        height: 34px;
        border: 0;
      }

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-table--fit {
        padding: 0 25px;
      }

      .el-dialog {
        width: 325px;
        border-radius: 5px;
      }

      .el-dialog__close {
        display: none;
      }

      .el-button {
        &:first-child {
          width: 80px;
          height: 35px;
          border: 0;
          line-height: 0;
        }
      }

      .el-dialog__body {
        color: #fff;
      }

      .el-table {
        tr {
          background-color: transparent;
        }

        td {
          border-bottom: 0;

          &:nth-child(4) {
            padding-right: 75px;
            text-align: right;
            cursor: pointer;
          }
        }

        th {
          & > .cell {
            font-size: 12px;
          }

          &:nth-child(4) {
            & > .cell {
              padding-right: 90px;
              text-align: right;
            }
          }
        }
      }

      .withdrawal-dialog {
        .el-dialog__header {
          height: 40px;
          padding: 0 0 0 25px;
          margin-bottom: 10px;
          border-radius: 5px 5px 0 0;
          line-height: 40px;
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__body {
          padding: 0 25px;
        }

        .el-form-item {
          margin-bottom: 15px;
        }

        .el-form-item__label {
          height: 30px;
          line-height: 30px;
        }

        .el-button {
          width: 275px;
          height: 34px;
        }

        .el-dialog__footer {
          text-align: center;
        }
      }
    }
  }
</style>
