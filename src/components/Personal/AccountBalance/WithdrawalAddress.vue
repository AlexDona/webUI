<!--
  author: zhaoxinlei
  update: 20190613
  description: 当前组件为 个人中心 提币地址 组件
-->
<template>
  <div
    class="withdrawal-address personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
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
          <div class="main-form">
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
                  :disabled="currencyValueStatus"
                  @change="changeCurrencyValue"
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
              <!--地址标签-->
              <el-form-item
                :label="$t('M.user_address_labels')"
                v-if="isShowAddressLabel"
              >
                <input
                  type="text"
                  class="form-input border-radius4 padding-left15"
                  v-model.trim="addressLabel"
                  @input="disableInputBlank"
                  @keyup="setErrorMsg(2, '')"
                  @keydown="disableInputBlank"
                  @blur="checkoutInputFormat(2, addressLabel)"
                >
                <!--错误提示-->
                <ErrorBox
                  :text="errorShowStatusList[2]"
                  :isShow="!!errorShowStatusList[2]"
                />
              </el-form-item>
              <!-- 链名称 （USDT）-->
              <el-form-item
                :label="$t('M.user_link_name')"
                v-show="isShowLinkSelect"
              >
                <el-select
                  v-model="activeLinkName"
                  :no-data-text="$t('M.comm_no_data')"
                  @change="changeLinkNames"
                  popper-class="link-names"
                >
                  <el-option
                    v-for="(item, index) in linkNames_S"
                    :key="index"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!--提币地址-->
              <el-form-item
                :label="$t('M.comm_mention_money') + $t('M.comm_site')"
              >
                <input
                  class="form-input border-radius4 padding-left15"
                  v-model.trim="withdrawalAddress"
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
          </div>
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
    <div class="withdrawal-address-main content-main" >
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
      addressLabel: '', // 地址标签
      isShowAddressLabel: false, // 是否显示
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
      currencyValueStatus: true, // 币种列表状态
      // 当前选中链名称
      activeLinkName: '',
      activeLinkIndex: 0,
      // 是否显示 链名称下拉
      isShowLinkSelect: false
    }
  },
  created () {
    // 更改最新页面
    this.activeLinkName = this.linkNames_S[0].value
    this.getWithdrawalAddressList()
  },
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_NEW_WITHDRAW_ADDRESS',
      'UPDATE_ACTIVE_LINK_NAMES_M'
    ]),
    changeLinkNames (e) {
      console.log(e)
      // this.activeLinkIndex =
      this.UPDATE_ACTIVE_LINK_NAMES_M(e)
    },
    disableInputBlank () {
      this.addressLabel = this.addressLabel.replace(/\s*/g, '')
      console.log(this.addressLabel)
    },
    // 1.0提币输入格式校验
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
        case 2:
          if (!targetNum) {
            // 请输入地址标签
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.user_address_labels'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 1.1设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 清空内容信息
    emptyStatus () {
      this.emptyErrorMsg = ''
    },
    // 2.0点击显示验证信息
    addAddress () {
      if (
        this.checkoutInputFormat(0, this.withdrawalRemark) &&
        this.checkoutInputFormat(1, this.withdrawalAddress) &&
        this.checkoutInputFormat(2, this.addAddress)
      ) {
        // 验证通过调用新增提币地址接口
        this.gitCheckCurrencyAddress()
      }
    },
    // 3.0新增用户提币地址校验
    async gitCheckCurrencyAddress () {
      let param = {
        coinId: this.currencyValue, // 币种coinId
        address: this.withdrawalAddress // 提币地址
      }

      if (this.currencyValue == this.USDT_COIN_ID_S) {
        param = {
          ...param,
          rechargeType: this.activeLinkName
        }
      }
      let data = await checkCurrencyAddress(param)
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
          this.phoneCode = ''
          this.emailCode = ''
          this.googleCode = ''
        }
      })
    },
    // 4.0点击新增用户提币地址确认按钮
    submitMentionMoney () {
      this.stateSubmitAddAddress()
    },
    // 改变选中币种
    changeCurrencyValue (e) {
      _.forEach(this.currencyList, item => {
        if (item.coinId === e) {
          this.isShowAddressLabel = item.needTag
          return false
        }
      })
      // USDT 币种id
      this.isShowLinkSelect = e == this.USDT_COIN_ID_S
      this.resetFormContent()
      this.setErrorMsg(0, '')
      this.setErrorMsg(1, '')
      this.setErrorMsg(2, '')
    },
    // 4.01新增用户提币地址接口
    stateSubmitAddAddress: _.debounce(async function () {
      if (!this.phoneCode && !this.emailCode && !this.googleCode) {
        // 请输入验证码
        this.emptyErrorMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      } else {
        this.emptyErrorMsg = ''
      }
      let params = {
        coinId: this.currencyValue, // 币种coinId
        remark: this.withdrawalRemark, // 备注
        address: this.withdrawalAddress, // 提币地址
        tag: this.addressLabel, // 地址标签
        phoneCode: this.phoneCode, // 手机验证
        emailCode: this.emailCode, // 邮箱验证
        googleCode: this.googleCode // 谷歌验证
      }
      params = params.coinId == this.USDT_COIN_ID_S ? {...params, rechargeType: this.activeLinkName} : params
      let data = await addNewWithdrawalAddress(params)
      if (!data) return false
      this.mentionMoneyConfirm = false
      this.getWithdrawalAddressList()
      this.resetFormContent()
    }, 500),
    /**
     *  5.刚进页面时候 提币地址列表查询
     */
    getWithdrawalAddressList: _.debounce(async function () {
      console.log(this.paramOfJumpToAddWithdrawAdress)
      let params = {
        pageNum: this.currentPageForMyEntrust, // 页码
        pageSize: this.pageSize // 页数
      }
      let data = await inquireWithdrawalAddressList(params)
      // console.log(data)
      if (!data) return false
      // 返回列表数据
      let detailData = getNestedData(data, 'data')
      this.currencyList = getNestedData(detailData, 'canWithdrawPartnerCoinList')
      // 当前选中的币种 对应的 索引
      let targetIndex = 0

      // console.log(this.currencyValue, targetIndex)
      _.forEach(this.currencyList, (currencyItem, currencyIndex) => {
        if (this.currencyValue == _.get(currencyItem, 'coinId')) {
          targetIndex = currencyIndex
          return false
        }
      })
      // 判断是否显示地址标签
      this.isShowAddressLabel = this.currencyList[targetIndex].needTag
      // 对ID名称进行赋值
      if (this.paramOfJumpToAddWithdrawAdress) {
        this.currencyValue = this.paramOfJumpToAddWithdrawAdress
        _.forEach(this.currencyList, (currencyItem, currencyIndex) => {
          if (this.currencyValue == _.get(currencyItem, 'coinId')) {
            targetIndex = currencyIndex
            return false
          }
        })
        this.isShowAddressLabel = this.currencyList[targetIndex].needTag
      } else {
        this.currencyValue = _.get(detailData, `canWithdrawPartnerCoinList[${targetIndex}].coinId`)
      }
      this.SET_NEW_WITHDRAW_ADDRESS('')
      // 对币种名称列表进行赋值
      this.withdrawalAddressList = getNestedData(detailData, 'UserWithdrawAddressPage.list')
      console.log(this.withdrawalAddressList)
      this.totalPageForMyEntrust = getNestedData(detailData, 'UserWithdrawAddressPage.pages') - 0
      // 接口回来之后吧select状态改为可用
      this.currencyValueStatus = false
      // console.log(this.currencyList)
      // console.log(this.withdrawalAddressList)
    }, 500),
    // 6.删除提币地址弹窗
    cancelId (id) {
      console.log(id)
      this.deleteWithdrawalId = id
      // 确定删除提币地址？ 取消  删除
      this.$confirm(this.$t('M.user_address_delete_withdrawals'), {
        cancelButtonText: this.$t('M.comm_cancel'), // 取消
        confirmButtonText: this.$t('M.comm_confirm') // 确定
      }).then(() => {
        this.deleteWithdrawAddress()
      }).catch(() => {
      })
    },
    // 6.01确认删除提币地址
    deleteWithdrawAddress: _.debounce(async function () {
      let data
      let param = {
        id: this.deleteWithdrawalId // 列表ida
      }
      data = await deleteUserWithdrawAddress(param)
      if (!data) return false
      this.getWithdrawalAddressList()
      this.resetFormContent()
    }, 500),
    // 接口请求完成之后清空数据
    resetFormContent () {
      this.dialogVisible = false
      this.withdrawalRemark = ''
      this.withdrawalAddress = ''
      this.phoneCode = ''
      this.emailCode = ''
      this.googleCode = ''
      this.addressLabel = ''
    },
    // 7.发送验证码
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
      // 跳转到的提币地址
      paramOfJumpToAddWithdrawAdress: state => state.personal.paramOfJumpToAddWithdrawAdress,
      linkNames_S: state => state.personal.linkNames_S,
      USDT_COIN_ID_S: state => state.personal.USDT_COIN_ID_S,
      activeLinkName_S: state => state.personal.activeLinkName_S
    })
  },
  watch: {
    currencyValue (New) {
      if (this.withdrawalAddressList.length === 0) {
        if (New == this.USDT_COIN_ID_S) {
          this.isShowLinkSelect = true
          // 控制地址列表无数据时的高度
          this.$el.querySelector('.el-table').style.height = '267px'
        } else if (this.isShowAddressLabel) {
          this.$el.querySelector('.el-table').style.height = '267px'
        } else {
          this.$el.querySelector('.el-table').style.height = '327px'
        }
      } else {
        if (New == this.USDT_COIN_ID_S) {
          this.isShowLinkSelect = true
          // 控制地址列表有数据时的高度
          this.$el.querySelector('.el-table').style.minHeight = '268px'
        } else if (this.isShowAddressLabel) {
          this.$el.querySelector('.el-table').style.minHeight = '268px'
        } else {
          this.$el.querySelector('.el-table').style.minHeight = '327px'
        }
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .withdrawal-address {
    > .withdrawal-address-main {
      min-height: 200px;
      padding-bottom: 28px;
      margin-top: 10px;

      > .withdrawal-header {
        margin-top: -10px;
        margin-bottom: 2px;

        > .header-content {
          font-weight: 400;
        }
      }

      > .tab-list {
          padding-bottom: 20px;

          > .el-table {
              min-height: 268px;
          }
      }

      > .withdrawal-address-content {
        > .withdrawal-address-box {
          min-height: 100px;
          padding-left: 250px;

          .send-code-btn {
            position: absolute;
            top: 3px;
            width: 94px;
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
            .main-form {
              .el-form .el-form-item {
                .el-form-item__label {
                  width: 115px !important;
                }
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
      background-color: $mainNightBgColor;

      > .withdrawal-address-main {
        background-color: $mainContentNightBgColor;

        > .withdrawal-header {
          background-color: $mainContentNightBgColor;
          box-shadow: 0 0 2px rgba(20, 23, 37, 1);

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
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
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
          border: 1px solid #5c6882;
          color: rgba(255, 255, 255, .7);
          background-color: #1c1f32 !important;
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
            background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
          }
        }

        .withdrawal-dialog {
          .el-dialog__header {
            background-color: #20293c;
          }

          .el-button {
            border: 0;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(90deg, rgba(18, 71, 133, 1) 0%, rgba(42, 59, 97, 1) 100%);
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .withdrawal-address-main {
        color: $dayMainTitleColor;
        background-color: $mainDayBgColor;
        box-shadow: 0 0 6px #cfd5df;

        > .withdrawal-header {
          border-bottom: 1px solid rgba(236, 241, 248, 1);
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
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
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

        .withdrawal-dialog {
          .el-button {
            border: 0;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(90deg, rgba(106, 182, 244, 1) 0%, rgba(49, 135, 218, 1) 100%);
          }
        }
      }
    }

    /deep/ {
      .el-table__empty-block {
        width: 920px !important;
        height: 256px;
      }

      .el-input__inner {
        width: 130px;
        height: 34px !important;
        border: 0;
        font-size: 14px;
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
          width: 150px !important;
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

    .el-pagination {
      margin: -40px;
    }
  }
</style>
<style lang="scss">
  .night {
    .link-names {
      .el-select-dropdown__item {
        &.is-disabled {
          &:hover {
            background-color: #2a3242 !important;
          }
        }
      }
    }
  }

  .day {
    .link-names {
      .el-select-dropdown__item {
        &.is-disabled {
          &:hover {
            color: #c0c4cf;
            background-color: #fff !important;
          }
        }
      }
    }
  }
</style>
