<template>
  <div
    class="push-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="push-assets-main">
      <div class="push-assets-content">
        <header class="push-header personal-height40 line-height40">
          <span class="push-header-title display-inline-block padding-left23 font-size16 font-weight400">
            <!--PUSH资产-->
            PUSH{{ $t('M.comm_property') }}
          </span>
        </header>
      </div>
      <div class="push-assets-content-box">
        <div class="push-from-box">
          <el-form label-width="125px">
            <!--资产-->
            <el-form-item
              :label="$t('M.comm_property')"
            >
              <el-select
                v-model="currencyValue"
                filterable
                :placeholder="$t('M.comm_please_choose')"
                :no-data-text="$t('M.comm_no_data')"
                @change="toggleAssetsCurrencyId"
                :disabled="currencyValueStatus"
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
                v-model="currencyBalance"
              />
            </el-form-item>
            <!--买方UID-->
            <el-form-item
              :label="$t('M.comm_buyer') + ' UID'"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                type="number"
                v-model="buyUID"
                @keydown="setErrorMsg(0, '')"
                @blur="checkoutInputFormat(0, buyUID)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[0]"
                :isShow="!!errorShowStatusList[0]"
              />
            </el-form-item>
            <!--数量-->
            <el-form-item
              :label="'PUSH' + $t('M.comm_count')"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                ref="count"
                @keydown="setErrorMsg(1, '')"
                @blur="checkoutInputFormat(1, count)"
                @keyup="formatUserInput('count', pointLength)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[1]"
                :isShow="!!errorShowStatusList[1]"
              />
            </el-form-item>
            <!--价格-->
            <el-form-item
              :label="'PUSH' + $t('M.otc_index_UnitPrice')"
            >
              <input
                class="form-input-common border-radius2 padding-l15"
                ref="price"
                @keydown="setErrorMsg(2, '')"
                @blur="checkoutInputFormat(2, price)"
                @keyup="formatUserInput('price', pointLength)"
                @input="formatUserInput('price', pointLength)"
              />
              <!--错误提示-->
              <ErrorBox
                :text="errorShowStatusList[2]"
                :isShow="!!errorShowStatusList[2]"
              />
            </el-form-item>
            <div
              class="amount-style font-size12"
              v-show="sumState"
            >
              {{ $t('M.user_push_amount') }}：{{ grossAmount }} {{ pushPayCoinName }}
            </div>
            <button
              class="form-button-common border-radius4 cursor-pointer"
              @click.prevent="checkISNeedPayPassowd"
            >
              <!--提交-->
              {{ $t('M.comm_sub_time') }}
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <div
      class="push-assets-main"
      v-if="userCenterActiveName==='push-asset'"
    >
      <div class="award-record padding-top0">
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
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
          >
            <!--类型-->
            <el-table-column
              :label="$t('M.comm_type')"
              width="95"
            >
              <template slot-scope="s">
                <div>{{ s.row.type }}</div>
                <div
                  v-if="s.row.pushId !== innerUserInfo.id"
                >
                  {{ $t(rollIn) }}
                </div>
                <div
                  v-if="s.row.pushId == innerUserInfo.id"
                >
                  {{ $t(rollOut) }}
                </div>
              </template>
            </el-table-column>
            <!--对方UID-->
            <el-table-column
              :label="$t('M.user_push_opposite_side') + ' UID'"
              width="130"
            >
              <template slot-scope="s">
                <div
                  v-if="innerUserInfo.showId !== s.row.showPushId"
                >
                  {{ s.row.showPushId }}
                </div>
                <div
                  v-if="innerUserInfo.showId == s.row.showPushId"
                >
                  {{ s.row.showUid }}
                </div>
              </template>
            </el-table-column>
            <!--资产-->
            <el-table-column
              :label="$t('M.comm_property')"
              width="70"
            >
              <template slot-scope="s">
                <div>{{ s.row.coinName }}</div>
              </template>
            </el-table-column>
            <!--数量-->
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.count) }}</div>
              </template>
            </el-table-column>
            <!--价格-->
            <el-table-column
              :label="$t('M.comm_price_metre')"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.price) }} {{s.row.payCoinName}}</div>
              </template>
            </el-table-column>
            <!--金额-->
            <el-table-column
              :label="$t('M.comm_money')"
              width="90"
            >
              <template slot-scope="s">
                <div>{{ $scientificToNumber(s.row.amount) }}</div>
              </template>
            </el-table-column>
            <!--时间-->
            <el-table-column
              :label="$t('M.comm_time')"
              width="160"
            >
              <template slot-scope="s">
                <div>{{ timeFormatting(s.row.createTime) }}</div>
              </template>
            </el-table-column>
            <!--状态-->
            <el-table-column
              :label="$t('M.comm_state')"
              width="135"
            >
              <template slot-scope="s">
                <div v-if="s.row.state === 'PUSH_DEAL'">
                  <!--已完成-->
                  {{ $t(stateOffStocks) }}
                </div>
                <div v-if="s.row.state === 'PUSH_REGISTER'">
                  <!--待支付-->
                  {{ $t(stateWaitPayment) }}
                </div>
                <div v-if="s.row.state === 'PUSH_CANCEL'">
                  <!--已取消-->
                  {{ $t(stateCancel) }}
                </div>
              </template>
            </el-table-column>
            <!--操作-->
            <el-table-column
              :label="$t('M.comm_operation')"
              width="90"
            >
              <template slot-scope="s">
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && innerUserInfo.id == s.row.pushId"
                  class="cursor-pointer state-status"
                  @click.prevent="confirmCancelPush(s.row.id)"
                  :id="s.row.id"
                >
                  <!--取消-->
                  {{ $t(cancel) }}
                </div>
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && innerUserInfo.id !== s.row.pushId"
                  class="cursor state-status cursor-pointer"
                  @click.prevent="showPushInfo(s.row.id)"
                  :id="s.row.id"
                >
                  <!--付款-->
                  {{ $t(payment) }}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--PUSH确认-->
          <!--付款-->
          <div class="push-affirm">
            <el-dialog
              :title="$t('M.user_push_payment')"
              :visible.sync="isShowPaymentDialog"
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
                  @click.prevent="showPayConfirmBox"
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
              :visible.sync="isShowPayPasswordDialog"
              :close-on-click-modal="false"
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
                    autocomplete= "new-password"
                    class="form-input-common border-radius2 padding-l15 box-sizing"
                    v-model="payPassword"
                    @keydown.enter="killDefault"
                    @focus="handleinput"
                  >
                </el-form-item>
              </el-form>
              <div
                class = "error-msg font-size12"
              >
                <span v-show = "payPasswordErrorMsg">{{ payPasswordErrorMsg }}</span>
              </div>
              <span
                class="font-size12 cursor-pointer text-align-l hint-color display-inline-block margin-top9"
                @click.prevent="payPasswordState('setting')"
              >
                <!--暂时关闭交易密码校验-->
                {{ $t('M.user_payPassword_switch') }}
              </span>
              <div
                slot="footer"
                class="dialog-footer"
              >
                <el-button
                  type="primary"
                  @click.prevent="submitWithPayPassword"
                >
                  <!--确 定-->
                  {{ $t('M.comm_confirm') }}
                </el-button>
                <span
                  class="font-size12 cursor-pointer text-align-r hint-color"
                  @click.prevent="payPasswordState('patPassword')"
                >
                  <!--忘记密码-->
                  {{ $t('M.user_payPassword') }}
                </span>
              </div>
            </el-dialog>
          </div>
        </div>
      </div>
      <div class="paging">
        <!--分页-->
        <el-pagination
          background
          v-show="pushRecordList.length"
          layout="prev, pager, next"
          :current-page="currentPageForMyEntrust"
          :page-count="totalPageForMyEntrust"
          @current-change="changeCurrentPage"
        >
        </el-pagination>
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
import {
  timeFilter,
  formatNumberInput,
  pushAssetInputRestriction
} from '../../../utils/index'
import {
  getNestedData,
  isNeedPayPasswordAjax
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    ErrorBox // 错误提示接口
  },
  // props,
  data () {
    return {
      labelPosition: 'top', // form表单label位置
      errorShowStatusList: [
        '', // 买方UID
        '', // 数量
        '', // 价格
        '' // 交易密码
      ],
      currencyValue: '', // 币种
      currencyList: [], // push币种列表
      // push资产form
      currencyBalance: '', // 币种余额
      buyUID: '', // 买方UID
      count: '', // 数量
      price: '', // 价格
      sumState: false, // 默认数量x价格=金额状态显示为false
      grossAmount: '', // 数量x价格=金额
      payPassword: '', // 交易密码
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
      isShowPaymentDialog: false, // 付款二次确认弹窗默认隐藏
      isShowPayPasswordDialog: false, // 付款二次确认之后交易密码弹窗默认隐藏
      pushUID: '', // 每行数据ID
      pushPayCoinName: '', // 币种名称
      pushRecordList: [], // push列表记录
      currentPageForMyEntrust: 1, // 当前页码
      totalPageForMyEntrust: 1, // 当前总页数
      // pageSize: 10, // 每页显示条数
      currencyValueStatus: true, // 币种列表状态
      pointLength: 4, // 保留小数位后四位
      payPasswordErrorMsg: '', // 错误提示
      isNeedPayPassword: false,
      // 付款类型： 'pay': 付款 'push': push
      payType: 'pay'
    }
  },
  async created () {
    this.reflashIsNeedPayPassword()
    // console.log(this.userCenterActiveName)
    if (this.userCenterActiveName === 'push-asset') {
      this.getPushRecordList()
    }
  },
  mounted () {
  },
  activated () {},
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
      'SET_PUSH_BUTTON_STATUS',
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    /**
     * 1.静态方法封装
     */
    // 1.1点击跳转到重置交易密码
    payPasswordState (type) {
      switch (type) {
        case 'setting':
          this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
          this.$goToPage('/PersonalCenter')
          this.CHANGE_USER_CENTER_ACTIVE_NAME('personal-setting')
          this.isShowPayPasswordDialog = false
          break
        case 'patPassword':
          this.$goToPage('/TransactionPassword')
          break
      }
    },
    // 1.2时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 1.3禁止回车事件
    killDefault (event) {
      // console.log(event)
      var evt = window.event || event
      if (evt.keyCode == 13) {
        if (evt.preventDefault) {
          evt.preventDefault()
        } else {
          evt.returnValue = false
        }
      }
    },
    /**
     * 2.提交push value输入限制
     */
    // 2.1 value输入限制
    formatUserInput (ref, pointLength) {
      if (this.$refs.count.value - this.currencyBalance > 0) {
        this.$refs.count.value = this.currencyBalance
      }
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      // 限制输入多个0，以及整数首位是0
      pushAssetInputRestriction(target)
      // 限制数量小数位位数
      formatNumberInput(this.$refs[ref], pointLength)
      // 判断数量和价格是否为空为空则不显示 不为空显示
      if (this.$refs.count.value == '' || this.$refs.price.value == '') {
        this.sumState = false
      } else if (this.$refs.count.value !== '' || this.$refs.price.value !== '') {
        this.sumState = true
        this.grossAmount = this.$keep8Num(this.$refs.count.value * this.$refs.price.value)
        this.grossAmount = this.$keep8Num(this.$refs.price.value * this.$refs.count.value)
      }
    },
    // 2.2 检测输入格式
    checkoutInputFormat (type, targetNum) {
      switch (type) {
        // 买方UID
        case 0:
          if (!targetNum) {
            // 请输入买方UID
            this.setErrorMsg(0, this.$t('M.user_push_input_buyer') + 'UID')
            this.$forceUpdate()
            return 0
          } else if (this.buyUID === this.innerUserInfo.showId) {
            // 禁止自我push
            this.setErrorMsg(0, this.$t('M.user_push_forbid'))
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
            this.setErrorMsg(1, this.$t('M.user_push_input_sum'))
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
            this.setErrorMsg(2, this.$t('M.user_push_input_price'))
            this.$forceUpdate()
            return 0
          } else {
            this.setErrorMsg(2, '')
            this.$forceUpdate()
            return 1
          }
      }
    },
    // 2.3 设置错误信息
    setErrorMsg (index, msg) {
      this.errorShowStatusList[index] = msg
    },
    // 2.4 清空交易密码提交push、付款
    handleinput () {
      this.payPasswordErrorMsg = ''
    },
    /**
     * 3.push币种
     */
    // 3.1 Push 币种选择
    async toggleAssetsCurrencyId (e) {
      this.emptyInputData()
      let data = await getPushTotalByCoinId({
        coinId: e // 币种coinId
      })
      if (!data) return false
      // 点击资产币种下拉
      this.currencyBalance = getNestedData(data, 'data.total')
    },
    // 3.2 判断交易密码错误次数状态
    async reflashIsNeedPayPassword () {
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
    },
    /**
     * 4.Push资产提交push和付款逻辑
     */
    // Push资产点击
    // 提交按钮弹出交易密码框，校验交易密码
    // 第一步校验密码输入错误次数，如果密码错误则提示 ‘交易密码错误,您还可以输入n次,超限将被冻结2个小时’，并关闭交易密码弹窗
    // 第二步校验密码正确通过之后，提交成功，并关闭交易密码弹窗
    // 付款按钮
    // 第一步调用根据id获取当前币种push信息接口，弹出push信息一级确认框，点击确认之后，弹出二级交易密码确认弹窗
    // 第二步校验交易密码错误时次数，如果密码错误则提示 ‘交易密码错误,您还可以输入n次,超限将被冻结2个小时’，并关闭二级交易密码确认弹窗
    // 第三步校验密码正确通过之后，付款成功，并关闭二级交易密码确认弹窗
    // 4.1 付款按钮判断
    submitWithPayPassword () {
      if (this.payPassword === '') {
        // 请输入交易密码
        this.payPasswordErrorMsg = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      } else {
        switch (this.payType) {
          case 'pay':
            this.payWithPassword()
            break
          case 'push':
            this.submitPushAssets()
            break
        }
        this.isShowPayPasswordDialog = false
      }
    },
    // 4.2 是否需要交易密码
    async checkISNeedPayPassowd () {
      if (this.$refs.count.value === '0') {
        // PUSH数量为零提示数量不能为0
        this.$message({
          message: this.$t('M.user_push_amount_count'),
          type: 'error'
        })
        return false
      }
      if (this.$refs.price.value === '0') {
        // PUSH单价为零提示单价不能为0
        this.$message({
          message: this.$t('M.user_push_amount_price'),
          type: 'error'
        })
        return false
      }
      let goOnStatus = 0
      goOnStatus = (this.checkoutInputFormat(0, this.buyUID) && this.checkoutInputFormat(1, this.count) && this.checkoutInputFormat(2, this.price)) ? 1 : 0
      if (goOnStatus) {
        await this.reflashIsNeedPayPassword()

        if (this.isNeedPayPassword) {
          this.payType = 'push'
          // 判断是否交易密码锁定
          await this.REFRESH_USER_INFO_ACTION()
          let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
          this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
          if (this.isLockedPayPassword) return false
          this.isShowPayPasswordDialog = true
          this.handleinput()
        } else {
          this.submitPushAssets()
        }
      }
    },
    // 4.3 提交push资产
    async submitPushAssets () {
      let params = {
        coinId: this.currencyValue, // 币种id
        uid: this.buyUID, // 买方id
        count: this.count, // push数量
        price: this.price // push价格
      }
      params = this.isNeedPayPassword ? {...params, password: this.payPassword} : params
      let data = await pushAssetsSubmit(params)
      if (!data) return false
      await this.reflashIsNeedPayPassword()
      this.isShowPayPasswordDialog = false
      // push列表展示
      this.getPushRecordList()
      // 清空数据
      this.emptyInputData()
    },
    /**
     * 5.付款成交
     */
    // 5.1 点击获取当前付款id
    showPushInfo (id) {
      this.isShowPaymentDialog = true
      this.pushUID = id
      this.pushRecordList.forEach((item) => {
        if (item.id == id) {
          // 用户付款时二次确认信息
          this.pushAsset = item.coinName
          this.pushPrice = item.price
          this.pushCount = item.count
          this.pushPaymentAmount = this.$scientificToNumber(item.amount)
        }
        return false
      })
    },
    // 5.2 点击确认用户信息并弹出交易密码框
    async showPayConfirmBox () {
      this.handleinput()
      await this.reflashIsNeedPayPassword()
      this.isShowPaymentDialog = false
      if (this.isNeedPayPassword) {
        this.payType = 'pay'
        // 判断是否交易密码锁定
        await this.REFRESH_USER_INFO_ACTION()
        let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
        if (this.isLockedPayPassword) return false
        this.isShowPayPasswordDialog = true
      } else {
        this.payWithPassword()
      }
    },
    // 5.3 确定付款（含交易密码）
    async payWithPassword () {
      let data
      let params = {
        id: this.pushUID // 列表id
      }
      params = this.isNeedPayPassword ? {...params, password: this.payPassword} : params

      data = await pushPropertyTransaction(params)
      if (!data) return false
      await this.reflashIsNeedPayPassword()
      this.isShowPayPasswordDialog = false
      this.payPassword = ''
      // 付款成功刷新列表
      this.getPushRecordList()
    },
    /**
     * 6.取消push
     */
    // 6.1 点击获取当前取消push id
    confirmCancelPush (id) {
      // 确定删除提币地址吗, 是否继续?
      this.$confirm(this.$t('M.comm_sure_push'), {
        // 取消
        cancelButtonText: this.$t('M.comm_cancel'),
        // 确定
        confirmButtonText: this.$t('M.comm_confirm')
      }).then(() => {
        this.cancelPushAssets(id)
      }).catch(() => {
      })
    },
    // 6.2 确定撤销
    async cancelPushAssets (id) {
      let data = await revocationPushProperty({
        id
      })
      if (!data) return false
      this.getPushRecordList()
    },
    /**
     * 7.刚进页面时候 push列表展示
     */
    async getPushRecordList () {
      this.errorShowStatusList[0] = ''
      this.errorShowStatusList[1] = ''
      this.errorShowStatusList[2] = ''
      let data = await getPushAssetList({
        pageNum: this.currentPageForMyEntrust, // 分页
        pageSize: this.pageSize // 页码
      })
      if (!data) return false
      // 返回push记录数据
      this.pushRecordList = getNestedData(data, 'data.userPushVOPageInfo.list')
      this.totalPageForMyEntrust = getNestedData(data, 'data.userPushVOPageInfo.pages') - 0
      // 返回push币种信息列表
      this.currencyValue = getNestedData(data, 'data.coinLists[0].coinId')
      // 刷新列表默认币种
      this.currencyBalance = getNestedData(data, 'data.total')
      // 币种余额
      this.pushPayCoinName = getNestedData(data, 'data.pushPayCoinName')
      this.currencyList = getNestedData(data, 'data.coinLists')
      // 接口回来之后把select状态改为可用
      this.currencyValueStatus = false
    },
    // 7.1 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getPushRecordList()
      // console.log(pageNum)
    },
    // 清空数据
    emptyInputData () {
      this.buyUID = ''
      this.$refs.count.value = ''
      this.$refs.price.value = ''
      this.payPassword = ''
      this.count = ''
      this.price = ''
      this.sumState = false
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      loginStep1Info: state => state.user.loginStep1Info,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword
    })
  },
  watch: {
    async userCenterActiveName (newVal) {
      if (newVal === 'push-asset') {
        this.currentPageForMyEntrust = 1
        await this.reflashIsNeedPayPassword()
        this.getPushRecordList()
        // 清空数据
        this.emptyInputData()
      }
    },
    isShowPayPasswordDialog (newVal, oldVal) {
      if (!newVal && oldVal) {
        this.payPassword = ''
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .push-assets {
    > .push-assets-main {
      > .push-assets-content-box {
        min-height: 448px;
        margin: 10px 0;

        > .push-from-box {
          width: 400px;
          min-height: 443px;
          padding-top: 47px;
          margin: 0 250px;

          .form-input-common,
          .form-button-common,
          .form-input-common-state {
            box-sizing: border-box;
            width: 270px;
            height: 36px;
          }

          .form-button-common {
            margin: 0 0 40px 125px;
          }

          .amount-style {
            padding: 0 0 10px 125px;
            color: #338ff5;
          }
        }
      }

      .award-record {
        min-height: 200px;

        > .award-record-header {
          height: 56px;
        }

        > .award-record-content {
          min-height: 130px;

          .form-input-common {
            width: 270px;
            height: 36px;
          }

          .error-msg {
            line-height: 30px;
            color: rgb(212, 88, 88);
          }
        }
      }
    }

    /deep/ {
      /* 覆盖Element样式 */
      .el-form-item__content {
        width: 555px;
      }

      .el-dialog__wrapper {
        background-color: rgba(0, 0, 0, .7);
      }

      .el-input__inner,
      .el-input-group {
        width: 270px;
        height: 36px;
        border-radius: 2px;
        cursor: pointer;
      }

      .el-input__inner {
        height: 36px !important;
        border-radius: 2px;
        font-size: 14px;
      }

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-form-item__label {
        width: 125px !important;
        color: #a9bed4;
      }

      .cell {
        text-align: center;
      }

      .el-input-group__append {
        padding: 0 10px;
        border-left: 0;
        border-radius: 0 2px 2px 0;
      }

      th.is-leaf {
        border-bottom: 0;
      }

      td {
        border-bottom: 0;
      }

      .el-dialog {
        top: 10%;
      }

      .cancel-push {
        .el-dialog__body {
          padding: 25px 25px 30px;
          text-align: center;
          color: #fff;
        }

        .el-dialog__headerbtn {
          display: none;
        }

        .el-dialog {
          top: 10%;
          width: 300px;
          height: 200px;
          padding: 0;
          text-align: center;
        }

        .el-button {
          &:nth-child(1) {
            width: 80px;
            height: 35px;
            margin-right: 15px;
            border: 0;
            line-height: 0;
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }

          &:nth-child(2) {
            width: 80px;
            height: 35px;
            margin-right: 15px;
            border: 1px solid $mainColor;
            line-height: 0;
            color: rgba(255, 255, 255, .7);
            background-color: transparent;
          }
        }
      }

      /* PUSH确认 */
      .push-affirm {
        .el-form-item {
          margin-bottom: 0 !important;
        }

        .el-dialog {
          top: 10%;
          width: 350px;
          padding: 0;
          border-radius: 5px;
        }

        .el-dialog__body {
          padding: 0 40px 25px;
        }

        .el-dialog__header {
          padding: 10px 40px;
          border-radius: 5px 5px 0 0;
          background-color: #20293c;
        }

        .el-dialog__headerbtn {
          top: 13px;
        }

        .el-button {
          width: 270px;
          height: 36px;
          margin-left: 20px;
          border: 0;
          line-height: 0;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .shipping-address {
        .dialog-footer {
          margin-right: 5px;
        }

        .el-dialog {
          width: 320px;
        }

        .el-dialog__header {
          padding: 10px 25px;
          border-radius: 5px 5px 0 0;
          background: #20293c;
        }

        .el-form-item {
          margin-bottom: 0;
        }

        .el-button {
          width: 270px;
          height: 36px;
          margin: 10px 0;
          border: 0;
          line-height: 0;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        .el-dialog__headerbtn {
          top: 13px;
        }
      }

      .el-form--label-top {
        .el-form-item__label {
          padding: 0;
        }
      }

      .el-dialog__body {
        padding: 10px 25px 0;
      }

      .el-dialog--center {
        text-align: left;
      }

      .gutter {
        display: block !important;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .push-assets-main {
        > .push-assets-content,
        > .push-assets-content-box {
          background-color: $mainContentNightBgColor;

          > .push-header {
            background-color: $mainContentNightBgColor;

            > .push-header-title {
              color: $mainColor;
            }
          }

          > .push-from-box {
            .form-input-common {
              border: 1px solid #485776;
              color: #fff;

              &:focus {
                border: 1px solid $mainColor;
              }
            }

            .form-input-common-state {
              color: #fff;
              background-color: #37424c;
            }

            .form-button-common {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .award-record {
          background-color: $mainContentNightBgColor;

          > .award-record-header {
            border-bottom: 1px solid #39424d !important;

            > .header-color {
              color: #fff;
            }
          }

          .award-record-content {
            .state-status {
              color: $mainColor;
            }

            .form-input-common {
              border: 1px solid #485776;
              color: #fff;
              background-color: #1a2233;

              &:focus {
                border-color: $mainColor;
              }
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-select {
          .el-input__inner {
            border: 1px solid #485776;
            color: #a9bed4;
            background-color: #1c1f32;

            &:focus {
              border: 1px solid $mainColor;
            }
          }
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: #1c1f32;

          &:focus {
            border: 1px solid $mainColor;
          }
        }

        .el-input-group__append {
          border-top: 1px solid #485776;
          border-bottom: 1px solid #485776;
          color: $mainColor;
          background-color: #1e2636;
          border-right: 1px solid #485776;
        }

        th,
        tr {
          background-color: #1c1f32;
        }

        .el-table {
          thead {
            color: #617499;
          }

          td {
            border-bottom: 0;
            color: #9da5b3;
            background-color: #1c1f32;
          }
        }

        .el-dialog {
          background-color: #28334a;
        }

        .el-table--enable-row-hover {
          .el-table__body {
            td {
              &:hover {
                background-color: #1c1f32;
              }
            }
          }
        }

        .el-table__empty-block {
          color: #fff;
          background-color: #1c1f32;
        }

        .el-dialog--center {
          background-color: #28334a;
        }

        .el-dialog__title {
          color: #fff;
        }

        th.is-leaf {
          border-top: 0;
        }

        .shipping-address {
          .el-dialog__header {
            background: #20293c;
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .push-assets-main {
        > .push-assets-content,
        > .push-assets-content-box {
          border-radius: 2px;
          background: #fff;
          box-shadow: 0 0 6px #cfd5df;

          > .push-header {
            background: #fff;
            box-shadow: 0 0 6px #cfd5df;

            > .push-header-title {
              color: $mainColor;
            }
          }

          > .push-from-box {
            .form-input-common {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid $mainColor;
              }
            }

            .form-input-common-state {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;
            }

            .form-button-common {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .award-record {
          border-radius: 2px;
          background: #fff;
          box-shadow: 0 0 6px #cfd5df;

          > .award-record-header {
            border-bottom: 1px solid rgba(57, 66, 77, .1);

            > .header-color {
              color: #333;
            }
          }

          .award-record-content {
            .state-status {
              color: $mainColor;
            }

            .form-input-common {
              border: 1px solid #ecf1f8;
              color: #7d90ac;
              background-color: #fff;

              &:focus {
                border-color: $mainColor;
              }
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-form-item__label {
          color: #7d90ac;
        }

        .el-dialog__title {
          color: #7d90ac;
        }

        .el-select {
          .el-input__inner {
            border: 1px solid rgba(236, 241, 248, 1);
            background-color: #fff;

            &:focus {
              border: 1px solid #eee;
            }
          }
        }

        .el-table__empty-block {
          background-color: #fff;
        }

        .cell {
          color: #333;
        }

        td {
          padding: 7px 0;
          border-bottom: 1px solid #fff;
          color: #7d90ac;
          background-color: #fff;
        }

        .shipping-address {
          .el-dialog__header {
            background: #20293c;
          }
        }
      }
    }
  }
</style>
