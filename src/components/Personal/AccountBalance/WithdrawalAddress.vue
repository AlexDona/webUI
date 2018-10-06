<template>
  <div
    class="withdrawal-address personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="withdrawal-address-main">
      <header class="withdrawal-header personal-height40 line-height40 background-color padding-left23 border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          <!--提币地址-->
          {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
        </span>
      </header>
      <div class="withdrawal-address-content padding-left15">
        <div class="withdrawal-address-box paddinglr20 margin-top30">
          <el-form
            ref="form"
            label-width="70px"
          >
            <!--币种 备注 提币地址-->
            <el-form-item
              :label="$t('M.comm_currency')"
            >
              <el-select
                v-model="currencyValue"
                @change="changeId"
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
            <el-form-item
              :label="$t('M.comm_remark')"
            >
              <input
                class="form-input border-radius4 padding-left15"
                v-model="mentionRemark"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, mentionRemark)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <el-form-item
              :label="$t('M.comm_mention_money') + $t('M.comm_site')"
            >
              <input
                class="form-input border-radius4 padding-left15"
                v-model="prepaidAddress"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, prepaidAddress)"
              />
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
              <!--增加-->
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
                    v-model="phoneCode"
                  >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
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
                    v-model="emailCode"
                  >
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                  />
                </el-form-item>
                <!--邮箱未认证-->
                <span v-elsee></span>
                <!--谷歌已认证-->
                <el-form-item
                  v-if="securityCenter.isGoogleEnable"
                  :label="$t('M.comm_code_google')"
                >
                  <input
                    class="content-input content-input1 input-google padding-l15 box-sizing"
                    v-model="googleCode"
                  >
                </el-form-item>
                <!--谷歌未认证-->
                <span v-else></span>
              </el-form>
              <div
                class="error-info"
              >
                <span v-show="errorMsg1">
                  {{ errorMsg1 }}
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
    <div class="withdrawal-address-main margin-top9">
      <header class="address-list-header background-color border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          <!--地址列表-->
           {{ $t('M.comm_site') }}{{ $t('M.comm_list') }}
        </span>
      </header>
      <el-table
        :data="gainAddressList"
        style="width: 100%"
        :empty-text="$t('M.comm_no_data')"
      >
        <!--币种 备注 提币地址 操作-->
        <el-table-column
          :label="$t('M.comm_currency')"
          width="180"
        >
          <template slot-scope = "s">
            <div>{{ s.row.coinName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('M.comm_remark')"
          width="180"
        >
          <template slot-scope = "s">
            <div>{{ s.row.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('M.comm_mention_money') + $t('M.comm_site')"
          width="350"
        >
          <template slot-scope = "s">
            <div>{{ s.row.address }}</div>
          </template>
        </el-table-column>
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
      <!--分页-->
      <el-pagination
        background
        v-show="activeName === 'current-entrust' && gainAddressList.length"
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
import {mapState} from 'vuex'
import {
  inquireWithdrawalAddressList,
  addNewWithdrawalAddress,
  deleteUserWithdrawAddress,
  statusSecurityCenter
} from '../../../utils/api/personal'
import ErrorBox from '../../User/ErrorBox'
import CountDownButton from '../../Common/CountDownCommon'
import {
  returnAjaxMessage,
  apiSendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
export default {
  components: {
    ErrorBox, // 错误提示接口
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      labelPosition: 'top',
      errorShowStatusList: [
        '', // 备注
        '' // 提币地址
      ],
      // errorMsg: '', // 错误信息提示
      errorMsg1: '', // 错误信息提示
      // 币种列表
      currencyValue: '',
      securityCenter: {}, // 安全状态显示
      currencyList: [],
      mentionRemark: '', // 提现备注
      prepaidAddress: '', // 提币地址
      // 地址列表
      gainAddressList: [],
      operation: 'M.comm_delete',
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      dialogVisible: false, // 取消弹窗默认隐藏
      mentionMoneyConfirm: false, // 默认隐藏
      deleteWithdrawalId: '', // 每行数据ID
      phoneCode: '', // 手机验证
      emailCode: '', // 邮箱验证
      googleCode: '' // 谷歌验证
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/WithdrawalAddress.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/WithdrawalAddressDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/WithdrawalAddressNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 点击显示验证信息
    addAddress () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.mentionRemark) &&
        this.checkoutInputFormat(0, this.prepaidAddress)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        this.getSecurityCenter()
      }
    },
    // 点击确认
    submitMentionMoney () {
      this.stateSubmitAddAddress()
    },
    // 资产币种下拉
    changeId (e) {
      this.currencyList.forEach(item => {
        if (e === item.id) {
          this.currencyValue = e
          console.log(item.currencyValue)
          this.stateSubmitAddAddress(e)
        }
      })
    },
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 买方UID
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
        // 数量
        case 1:
          if (!targetNum) {
            // 请输入提币地址
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_site'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 新增用户提币地址按钮
    async stateSubmitAddAddress () {
      if (!this.phoneCode && !this.emailCode && !this.googleCode) {
        console.log(1)
        // 请输入验证码
        this.errorMsg1 = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      } else {
        this.errorMsg1 = ''
      }
      let data
      let param = {
        coinId: this.currencyValue, // 币种coinId
        remark: this.mentionRemark, // 备注
        address: this.prepaidAddress, // 充值地址
        phoneCode: this.phoneCode, // 手机验证
        emailCode: this.emailCode, // 邮箱验证
        googleCode: this.googleCode // 谷歌验证
      }
      data = await addNewWithdrawalAddress(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.WithdrawalAddressList()
        this.stateEmptyData()
        this.mentionMoneyConfirm = false
      }
    },
    /**
     *  刚进页面时候 提币地址列表查询
     */
    async WithdrawalAddressList () {
      let params = {
        pageNum: this.currentPageForMyEntrust,
        pageSize: this.pageSize
      }
      let data = await inquireWithdrawalAddressList(params)
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.currencyList = data.data.data.canWithdrawPartnerCoinList
        this.currencyValue = data.data.data.canWithdrawPartnerCoinList[0].name
        this.currencyValue = data.data.data.canWithdrawPartnerCoinList[0].coinId
        this.gainAddressList = data.data.data.UserWithdrawAddressPage.list
        this.totalPageForMyEntrust = data.data.data.UserWithdrawAddressPage.pages - 0
        console.log(this.currencyList)
        console.log(this.gainAddressList)
      }
    },
    // 删除提币地址
    cancelId (id) {
      console.log(id)
      this.deleteWithdrawalId = id
      // 确定删除提币地址吗, 是否继续?取消 确定
      this.$confirm(this.$t('M.user_address_delete_withdrawals'), {
        cancelButtonText: this.$t('M.comm_cancel'),
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        this.deleteWithdrawal(id)
      }).catch(() => {
      })
    },
    // 确认删除提币地址
    async deleteWithdrawal () {
      let data
      let param = {
        id: this.deleteWithdrawalId // 列表id
      }
      data = await deleteUserWithdrawAddress(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.WithdrawalAddressList()
        this.stateEmptyData()
      }
    },
    // 接口请求完成之后清空数据
    stateEmptyData () {
      this.dialogVisible = false
      this.mentionRemark = ''
      this.prepaidAddress = ''
      this.phoneCode = ''
      this.emailCode = ''
      this.googleCode = ''
    },
    // 分页
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        userId: this.userInfo.userId,
        partnerId: this.partnerId
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.email = this.userInfo.userInfo.email
          break
      }
      apiSendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        console.log(this.disabledOfPhoneBtn)
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (loginType) {
            case 0:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 0,
                status: true
              })
              break
            case 1:
              this.$store.commit('user/SET_USER_BUTTON_STATUS', {
                loginType: 1,
                status: true
              })
              break
          }
        }
      })
    },
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.WithdrawalAddressList()
    },
    /**
     * 安全中心
     */
    async getSecurityCenter () {
      let data = await statusSecurityCenter({
        token: this.userInfo.token // token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.securityCenter = data.data.data
        this.mentionMoneyConfirm = true
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      partnerId: state => state.common.partnerId,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'mention-address') {
        this.WithdrawalAddressList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .withdrawal-address{
    >.withdrawal-address-main{
      border-radius: 5px;
      min-height: 390px;
      >.withdrawal-header {
        margin-bottom: 2px;
        >.header-content {
          font-weight: 400;
        }
      }
      >.withdrawal-address-content {
        >.withdrawal-address-box {
          min-height: 100px;
          .send-code-btn {
            width: 91px;
            height: 34px;
            position: absolute;
            top: 4px;
          }
          .error-info {
            height: 20px;
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
            width: 324px;
            height: 34px;
            box-sizing: border-box;
          }
          .form-button {
            margin: 10px 0 0 70px;
          }
        }
      }
      >.address-list-header {
        height: 50px;
        line-height: 50px;
        padding: 0 25px;
      }
      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.withdrawal-address-main {
        background-color: $nightMainBgColor;
        >.withdrawal-header {
          background-color: $nightMainBgColor;
          /*box-shadow:2px 0px 3px rgba(24,30,42,1);*/
          box-shadow:2px 0px 2px rgba(20,23,37,1);
          >.header-content {
            color: rgba(255,255,255,0.7);
          }
        }
        >.withdrawal-address-content {
          >.withdrawal-address-box {
            .error-info {
              height: 20px;
              line-height: 20px;
              color: #d45858;
            }
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .content-input {
              border: 1px solid #485776;
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .form-input {
              border: 1px solid #485776;
              color: rgba(255,255,255,0.7);
            }
            .form-input:focus {
              border: 1px solid #338FF5;
            }
            .form-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: rgba(255,255,255,0.7);
            }
          }
        }
        >.address-list-header {
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid #39424D;
        }
        .btn {
          color: rgba(255,255,255,0.7);
          background-color: transparent;
          border: 1px solid #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.withdrawal-address-main {
        background-color: $dayBgColor;
        color:$dayFontColor;
        border:1px solid rgba(236,241,248,1);
        >.withdrawal-header {
          background:rgba(255,255,255,1);
          border:1px solid rgba(236,241,248,1);
          >.header-content {
            color: #338FF5;
          }
        }
        >.withdrawal-address-content {
          >.withdrawal-address-box {
            .send-code-btn {
              background-color: #338FF5;
              color: #fff;
            }
            .content-input {
              border: 1px solid #ECF1F8;
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .form-input {
              background:rgba(255,255,255,1);
              border:1px solid rgba(236,241,248,1);
            }
            .form-input:focus {
              border: 1px solid #338FF5;
            }
            .form-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: rgba(255,255,255,0.7);
            }
          }
        }
        >.address-list-header {
          color: #338FF5;
          border-bottom: 1px solid rgba(236,241,248,1);
        }
        .btn {
          color: rgba(255,255,255,0.7);
          background-color: transparent;
          border: 1px solid #338FF5;
        }
      }
    }
  }
</style>
