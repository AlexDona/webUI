<template>
  <div
    class="push-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="push-assets-main">
      <div class="push-assets-content">
        <header class="push-header personal-height40 line-height40">
          <span class="push-header-title display-inline-block padding-left23 font-size16 font-weight600">
            <!--PUSH资产-->
            PUSH{{ $t('M.comm_property') }}
          </span>
        </header>
      </div>
      <div class="push-assets-content-box padding-left15 margin-top9">
        <div class="push-from-box">
          <el-form label-width="120px">
            <!--资产-->
            <el-form-item
              :label="$t('M.comm_property')"
            >
              <el-select
                v-model="currencyValue"
                @change="changeId"
              >
                <el-option
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :label="item.name"
                  :value="item.coinId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!--余额-->
            <el-form-item
              :label="$t('M.comm_balance')"
            >
              <input
                disabled
                class="form-input-common-state border-radius2 padding-l15"
                v-model="balance"
              />
            </el-form-item>
            <!--买方UID-->
            <el-form-item
              :label="$t('M.comm_buyer') + 'UID'"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                type="number"
                v-model="buyUID"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, buyUID)"
                @keyup="statusPushChange"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--数量-->
            <el-form-item
              :label="$t('M.comm_count')"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                ref="count"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, count)"
                @keyup="changeInputValue('count', pointLength)"
                @input="changeInputValue('count', pointLength)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <!--价格-->
            <el-form-item
              :label="$t('M.comm_price_metre')"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                ref="price"
                @keydown="setErrorMsg(2, '')"
                @blur="checkoutInputFormat(2, price)"
                @keyup="changeInputValue('price', pointLength)"
                @input="changeInputValue('price', pointLength)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <!--交易密码-->
            <el-form-item
              :label="$t('M.comm_password')"
            >
              <input
                type="password"
                class="form-input-common border-radius2 padding-l15"
                v-model="transactionPassword"
                @keydown="setErrorMsg(3, '')"
                @blur="checkoutInputFormat(3, transactionPassword)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[3]"
                :isShow="!!errorShowStatusList[3]"
              />
            </el-form-item>
            <button
              class="form-button-common border-radius4 cursor-pointer"
              @click.prevent="getStatusSubmit"
            >
              <!--提交-->
              {{ $t('M.comm_sub_time') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="push-assets-main margin-top9">
      <div class="award-record margin-top9 padding-top0">
        <header class="award-record-header line-height56">
          <span class="font-size16 header-color">
            <!--PUSH记录-->
            PUSH{{ $t('M.comm_record') }}
          </span>
        </header>
        <div class="award-record-content">
          <!--暂无数据-->
          <el-table
            :data="pushRecordList"
            style="width: 100%"
            :empty-text="$t('M.comm_no_data')"
          >
            <!--类型-->
            <el-table-column
              :label="$t('M.comm_type')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.type }}</div>
                <div
                  v-if="s.row.pushId !== userInfo.userInfo.id"
                >
                  {{ $t(rollIn) }}
                </div>
                <div
                  v-if="s.row.pushId == userInfo.userInfo.id"
                >
                  {{ $t(rollOut) }}
                </div>
              </template>
            </el-table-column>
            <!--对方UID-->
            <el-table-column
              :label="$t('M.user_push_opposite_side') + 'UID'"
            >
              <template slot-scope = "s">
                <div v-if="userInfo.userInfo.showId !== s.row.showPushId">{{ s.row.showPushId }}</div>
                <div v-if="userInfo.userInfo.showId == s.row.showPushId">{{ s.row.showUid }}</div>
              </template>
            </el-table-column>
            <!--资产-->
            <el-table-column
              :label="$t('M.comm_property')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.coinName }}</div>
              </template>
            </el-table-column>
            <!--数量-->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.count }}</div>
              </template>
            </el-table-column>
            <!--价格-->
            <el-table-column
              :label="$t('M.comm_price_metre')+ pushPayCoinName"
            >
              <template slot-scope = "s">
                <div>{{ s.row.price }}</div>
              </template>
            </el-table-column>
            <!--金额-->
            <el-table-column
              :label="$t('M.comm_money')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.amount }}</div>
              </template>
            </el-table-column>
            <!--时间-->
            <el-table-column
              :label="$t('M.comm_time')"
              width="180px"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.createTime) }}</div>
              </template>
            </el-table-column>
            <!--状态-->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope = "s">
                <div v-if="s.row.state === 'PUSH_DEAL'">
                  {{ $t(stateOffStocks) }}
                </div>
                <div v-if="s.row.state === 'PUSH_REGISTER'">
                  {{ $t(stateWaitPayment) }}
                </div>
                <div v-if="s.row.state === 'PUSH_CANCEL'">
                  {{ $t(stateCancel) }}
                </div>
              </template>
            </el-table-column>
            <!--操作-->
            <el-table-column
              :label="$t('M.comm_operation')"
            >
              <template slot-scope = "s">
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && userInfo.userInfo.id == s.row.pushId"
                  class="cursor-pointer state-status"
                  @click.prevent="cancelId(s.row.id)"
                  :id="s.row.id"
                >
                  {{ $t(cancel) }}
                </div>
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && userInfo.userInfo.id !== s.row.pushId"
                  class="cursor state-status cursor-pointer"
                  @click.prevent="paymentId(s.row.id)"
                  :id="s.row.id"
                >
                  {{ $t(payment) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="pushRecordList.length"
            layout="prev, pager, next"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage"
          >
          </el-pagination>
          <!--PUSH确认-->
          <!--付款-->
          <div class="push-affirm">
            <el-dialog
              :title="$t('M.user_push_payment')"
              :visible.sync="paymentVisible"
              center
            >
              <el-form
                :label-position="labelPosition"
                class="form_padding"
                label-width="100px"
              >
                <!--PUSH资产-->
                <el-form-item
                  :label="$t('M.comm_property')"
                >
                  <input
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    type="text"
                    v-model="pushAsset"
                    disabled
                  >
                </el-form-item>
                <!--PUSH价格-->
                <el-form-item
                  :label="$t('M.comm_price_metre')"
                >
                  <input
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    type="text"
                    v-model="pushPrice"
                    disabled
                  >
                </el-form-item>
                <!--PUSH数量-->
                <el-form-item
                  :label="$t('M.comm_count')"
                >
                  <input
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    type="text"
                    v-model="pushCount"
                    disabled
                  >
                </el-form-item>
                <!--付款金额-->
                <el-form-item
                  :label="$t('M.user_push_payment') + $t('M.comm_money')"
                >
                  <input
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    type="text"
                    v-model="pushPaymentAmount"
                    disabled
                  >
                </el-form-item>
              </el-form>
              <span
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click.prevent="statusUserInfo"
                >
                  <!--确 定-->
                  {{ $t('M.comm_confirm') }}
                </el-button>
              </span>
            </el-dialog>
          </div>
          <!--收货地址-->
          <div class="shipping-address">
            <!--安全验证-->
            <el-dialog
              :title="$t('M.user_security_safety') + $t('M.user_security_verify')"
              :visible.sync="passwordVisible"
            >
              <el-form
                :label-position="labelPosition"
              >
                <!--交易密码-->
                <el-form-item
                  :label="$t('M.comm_password')"
                >
                  <input
                    type="password"
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    v-model="pushPassword"
                    @keydown="stateErrorMsg(0, '')"
                    @blur="stateInputFormat(0, pushPassword)"
                  >
                </el-form-item>
              </el-form>
              <!--错误提示-->
              <div
                class = "error-msg font-size12"
                v-show = "errorMsg"
              >
                {{ errorMsg }}
              </div>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click.prevent="confirmSubmit"
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
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getPushAssetList,
  getPushTotalByCoinId,
  pushAssetsSubmit,
  revocationPushProperty,
  pushPropertyTransaction
} from '../../../utils/api/personal'
import ErrorBox from '../../User/ErrorBox'
import CountDownButton from '../../Common/CountDownCommon'
import {timeFilter, formatNumberInput} from '../../../utils/index'
import {createNamespacedHelpers, mapState} from 'vuex'
import {
  returnAjaxMessage
} from '../../../utils/commonFunc'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {
    ErrorBox, // 错误提示接口
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      errorShowStatusList: [
        '', // 买方UID
        '', // 数量
        '', // 价格
        '' // 交易密码
      ],
      showStatusUserInfo: {}, // 个人信息
      // 币种
      currencyValue: '',
      currencyList: [],
      // push资产form
      balance: '', // 余额
      buyUID: '', // 买方UID
      count: '', // 数量
      price: '', // 价格
      transactionPassword: '', // 交易密码
      sum: '', // 金额
      phoneCode: '', // 手机验证码
      emailCode: '', // 邮箱验证码
      googleCode: '', // 谷歌验证
      rollIn: 'M.user_push_shift', // 转入
      rollOut: 'M.user_push_roll', // 转出
      stateOffStocks: 'M.user_push_off_stocks', // 已完成
      stateWaitPayment: 'M.user_push_unpaid', // 待支付
      stateCancel: 'M.user_push_canceled', // 已取消
      payment: 'M.user_push_payment', // 付款
      cancel: 'M.user_push_revocation', // 取消
      pushAsset: '', // PUSH资产信息展示
      pushPrice: '', // PUSH价格信息展示
      pushCount: '', // PUSH数量信息展示
      pushPaymentAmount: '', // 付款金额信息展示
      dialogVisible: false, // 取消弹窗默认隐藏
      labelPosition: 'top', // form表单
      paymentVisible: false, // 付款二次确认弹窗默认隐藏
      passwordVisible: false, // 付款二次确认之后交易密码弹窗默认隐藏
      pushUID: '', // 每行数据ID
      pushPayCoinName: '', // 币种名称
      pushPassword: '',
      // push列表记录
      pushRecordList: [],
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      SecurityCenter: {},
      pointLength: 4, // 保留小数位后四位
      errorMsg: '' // 错误提示
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/PushAsset.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/PushAssetDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/PushAssetNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_PUSH_BUTTON_STATUS'
    ]),
    // 1.时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 3.修改input value  输入限制
    changeInputValue (ref, pointLength) {
      if (this.count > this.balance) {
        this.$refs.count.value = this.balance
      }
      // 获取ref中input值
      this[ref] = this.$refs[ref].value
      // 限制数量小数位位数
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // PUSH UID提示事件
    statusPushChange () {
      if (this.buyUID === this.userInfo.userInfo.showId) {
        this.$message({
          message: this.$t('M.user_push_forbid'),
          type: 'error'
        })
      }
    },
    /**
     * push资产
     */
    /**
     * 刚进页面时候 push列表展示
     */
    async getPushRecordList () {
      let data = await getPushAssetList({
        partnerId: this.partnerId // 商户id
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回push记录数据
        this.pushRecordList = data.data.data.userPushVOPageInfo.list
        this.totalPageForMyEntrust = data.data.data.userPushVOPageInfo.pages - 0
        // 返回push币种信息列表
        this.currencyValue = data.data.data.coinLists[0].name
        this.currencyValue = data.data.data.coinLists[0].coinId
        // 刷新列表默认币种
        this.balance = data.data.data.total
        this.pushPayCoinName = data.data.data.pushPayCoinName
        this.currencyList = data.data.data.coinLists
        // 金额
        this.sum = data.data.data.pushPayCoinName
        console.log(this.pushRecordList)
      }
    },
    // 资产币种下拉
    changeId (e) {
      console.log(e)
      this.toggleAssetsCurrencyId(e)
    },
    // 4.选择push资产币种
    async toggleAssetsCurrencyId (e) {
      let data
      let param = {
        coinId: e // 币种coinId
      }
      data = await getPushTotalByCoinId(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 点击资产币种下拉
        this.balance = data.data.data.total
        console.log(this.balance)
      }
    },
    /**
     * 5.提交push
     */
    // 检测输入格式
    checkoutInputFormat (type, targetNum) {
      console.log(type)
      switch (type) {
        // 买方UID
        case 0:
          if (!targetNum) {
            // 请输入买方UID
            this.setErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.comm_buyer') + 'UID')
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
            // 请输入数量
            this.setErrorMsg(1, this.$t('M.comm_please_enter') + this.$t('M.comm_count'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(1, '')
            this.$forceUpdate()
            return 1
          }
        // 价格
        case 2:
          if (!targetNum) {
            // 请输入价格
            this.setErrorMsg(2, this.$t('M.comm_please_enter') + this.$t('M.comm_price_metre'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 0
          }
        // 交易密码
        case 3:
          if (!targetNum) {
            // 请输入交易密码
            this.setErrorMsg(3, this.$t('M.comm_please_enter') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(3, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 确认提交push资产
    getStatusSubmit () {
      this.stateSubmitPushAssets()
    },
    // 提交push资产
    async stateSubmitPushAssets () {
      let goOnStatus = 0
      if (
        this.checkoutInputFormat(0, this.buyUID) &&
        // this.checkoutInputFormat(1, this.count) &&
        // this.checkoutInputFormat(2, this.price) &&
        this.checkoutInputFormat(3, this.transactionPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      console.log(goOnStatus)
      if (goOnStatus) {
        let data
        let param = {
          coinId: this.currencyValue, // 币种id
          uid: this.buyUID, // 买方id
          count: this.count, // push数量
          price: this.price, // push价格
          password: this.transactionPassword // 交易密码
        }
        data = await pushAssetsSubmit(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.passwordVisible = false
          // push列表展示
          this.getPushRecordList()
          // 清空数据
          this.emptyInputData()
        }
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getPushRecordList()
    },
    // 清空数据
    emptyInputData (ref) {
      this.buyUID = ''
      this.$refs.count.value = ''
      this.$refs.price.value = ''
      this.transactionPassword = ''
    },
    /**
     * 取消push
     */
    // 点击获取当前取消push id
    cancelId (id) {
      this.pushUID = id
      // 确定删除提币地址吗, 是否继续?
      this.$confirm(this.$t('M.comm_sure_push'), {
        // 取消
        cancelButtonText: this.$t('M.comm_cancel'),
        // 确定
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        this.stateRevocationInformation(id)
      }).catch(() => {
      })
    },
    // 确定撤销
    async stateRevocationInformation () {
      let data
      let param = {
        id: this.pushUID // 列表id
      }
      data = await revocationPushProperty(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.getPushRecordList()
        this.dialogVisible = false
        console.log(data)
      }
    },
    /**
     * 付款成交
     */
    // 点击获取当前付款id
    paymentId (id) {
      console.log(id)
      this.paymentVisible = true
      this.pushUID = id
      console.log(this.pushRecordList)
      this.pushRecordList.forEach((item) => {
        if (item.id == id) {
          // 用户付款时二次确认信息
          this.pushAsset = item.coinName
          this.pushPrice = item.price
          this.pushCount = item.count
          this.pushPaymentAmount = item.amount
        }
      })
    },
    // 点击确认用户信息并弹出交易密码框
    statusUserInfo () {
      this.paymentVisible = false
      this.passwordVisible = true
      this.pushPassword = ''
    },
    // 绑定手机检测输入格式
    stateInputFormat (type, targetNum) {
      switch (type) {
        // 交易密码
        case 0:
          if (!targetNum) {
            // 请输入交易密码
            this.stateErrorMsg(0, this.$t('M.comm_please_enter') + this.$t('M.comm_password'))
            this.$forceUpdate()
            return 0
          } else {
            this.stateErrorMsg(0, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 绑定手机设置错误信息
    stateErrorMsg (index, msg) {
      this.errorMsg = msg
    },
    // 确定付款
    confirmSubmit () {
      this.statePushPropertyTransaction()
    },
    async statePushPropertyTransaction () {
      let goOnStatus = 0
      if (
        this.stateInputFormat(0, this.pushPassword)
      ) {
        goOnStatus = 1
      } else {
        goOnStatus = 0
      }
      if (goOnStatus) {
        let data
        let param = {
          id: this.pushUID, // 列表id
          password: this.pushPassword // 用户付款时交易密码
        }
        data = await pushPropertyTransaction(param)
        if (!(returnAjaxMessage(data, this, 1))) {
          return false
        } else {
          this.passwordVisible = false
          this.dialogVisible = false
          this.getPushRecordList()
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      partnerId: state => state.common.partnerId,
      loginType: state => state.user.loginType, // 发送类型
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'push-asset') {
        this.getPushRecordList()
        // 清空数据
        this.emptyInputData()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .push-assets{
    >.push-assets-main{
      >.push-assets-content-box {
        min-height: 577px;
        >.push-from-box {
          width: 400px;
          min-height: 577px;
          padding-top: 29px;
          margin: 0 auto;
          .form-input-common,
          .form-button-common,
          .form-input-common-state {
            width: 270px;
            height: 36px;
            box-sizing: border-box;
          }
          .form-button-common {
            margin: 0 0 50px 120px;
          }
        }
      }
      .award-record{
        min-height: 200px;
        >.award-record-header{
          height: 56px
        }
        >.award-record-content{
          min-height: 130px;
          .form-input-common {
            width: 270px;
            height: 36px;
          }
          .error-msg{
            height:30px;
            line-height: 30px;
            /*margin-left: 30px;*/
            color: rgb(212, 88, 88);
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.push-assets-main {
        >.push-assets-content,
        >.push-assets-content-box {
          background-color: $nightMainBgColor;
          >.push-header {
            background-color: $nightMainBgColor;
            >.push-header-title {
              color: #338FF5;
            }
          }
          >.push-from-box {
            .form-input-common {
              border: 1px solid #485776;
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .form-input-common-state {
              background-color: #37424C;
              color: #fff;
            }
            .form-button-common {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
        >.award-record {
          background-color: $nightMainBgColor;
          >.award-record-header {
            border-bottom: 1px solid #39424D !important;
            >.header-color {
              color: #fff;
            }
          }
          .award-record-content{
            .state-status {
              color: #338FF5;
            }
            .form-input-common {
              color: #fff;
              background-color: #1A2233;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.push-assets-main {
        >.push-assets-content,
        >.push-assets-content-box {
          background:rgba(255,255,255,1);
          border:1px solid rgba(246,246,246,1);
          border-radius:4px;
          box-shadow:0px 0px 4px rgba(235,240,248,1);
          >.push-header {
            background:rgba(255,255,255,1);
            border:1px solid rgba(236,241,248,1);
            >.push-header-title {
              color: #338FF5;
            }
          }
          >.push-from-box {
            .form-input-common {
              border:1px solid rgba(236,241,248,1);
              color: #333;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .form-input-common-state {
              border:1px solid rgba(236,241,248,1);
              color: #333;
            }
            .form-button-common {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
        >.award-record {
          background:rgba(255,255,255,1);
          border:1px solid rgba(246,246,246,1);
          border-radius:4px;
          box-shadow:0px 0px 4px rgba(235,240,248,1);
          >.award-record-header {
            border-bottom: 1px solid rgba(57,66,77,0.1);
            >.header-color {
              color: #333;
            }
          }
          .award-record-content{
            .state-status {
              color: #338FF5;
            }
            .form-input-common {
              color: #fff;
              background-color: #1A2233;
            }
          }
        }
      }
    }
  }
</style>
