<template>
  <div
    class="push-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-background="rgba(0, 0, 0, 0.6)"
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
                :no-data-text="$t('M.comm_no_data')"
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
                onpaste="return false"
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
                onpaste="return false"
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
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <!--类型-->
            <el-table-column
              :label="$t('M.comm_type')"
            >
              <template slot-scope = "s">
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
              width="100"
            >
              <template slot-scope = "s">
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
              :label="$t('M.comm_price_metre') + pushPayCoinName"
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
            >
              <template slot-scope = "s">
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && innerUserInfo.id == s.row.pushId"
                  class="cursor-pointer state-status"
                  @click.prevent="cancelId(s.row.id)"
                  :id="s.row.id"
                >
                  <!--取消-->
                  {{ $t(cancel) }}
                </div>
                <div
                  v-if="s.row.state == 'PUSH_REGISTER' && innerUserInfo.id !== s.row.pushId"
                  class="cursor state-status cursor-pointer"
                  @click.prevent="paymentId(s.row.id)"
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
      <div class="paging">
        <!--分页-->
        <el-pagination
          background
          v-show="pushRecordList.length"
          layout="prev, pager, next"
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
import CountDownButton from '../../Common/CountDownCommon'
import {timeFilter, formatNumberInput} from '../../../utils/index'
import {createNamespacedHelpers, mapState} from 'vuex'
import {
  returnAjaxMsg,
  getNestedData
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
      currencyValue: '', // 币种
      currencyList: [], // push币种列表
      // push资产form
      currencyBalance: '', // 币种余额
      buyUID: '', // 买方UID
      count: '', // 数量
      price: '', // 价格
      transactionPassword: '', // 交易密码
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
      labelPosition: 'top', // form表单label位置
      paymentVisible: false, // 付款二次确认弹窗默认隐藏
      passwordVisible: false, // 付款二次确认之后交易密码弹窗默认隐藏
      pushUID: '', // 每行数据ID
      pushPayCoinName: '', // 币种名称
      pushPassword: '', // 用户付款时交易密码
      pushRecordList: [], // push列表记录
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      pointLength: 4, // 保留小数位后四位
      errorMsg: '', // 错误提示
      fullscreenLoading: false, // 整页loading
      partLoading: true // 局部列表loading
    }
  },
  created () {
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
      if (this.count > this.currencyBalance) {
        this.$refs.count.value = this.currencyBalance
      }
      // 获取ref中input值
      this[ref] = this.$refs[ref].value
      // 限制数量小数位位数
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // PUSH UID提示事件
    statusPushChange () {
      if (this.buyUID === this.innerUserInfo.showId) {
        this.$message({
          // 禁止自我PUSH
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
      })
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除局部loading
        this.partLoading = false
        return false
      } else {
        // 接口成功清除局部loading
        this.partLoading = false
        // 返回push记录数据
        this.pushRecordList = getNestedData(data, 'data.data.userPushVOPageInfo.list')
        this.totalPageForMyEntrust = getNestedData(data, 'data.data.userPushVOPageInfo.pages') - 0
        // 返回push币种信息列表
        this.currencyValue = getNestedData(data, 'data.data.coinLists[0].name')
        this.currencyValue = getNestedData(data, 'data.data.coinLists[0].coinId')
        // 刷新列表默认币种
        this.currencyBalance = getNestedData(data, 'data.data.total')
        // 币种余额
        this.pushPayCoinName = getNestedData(data, 'data.data.pushPayCoinName')
        this.currencyList = getNestedData(data, 'data.data.coinLists')
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
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 点击资产币种下拉
        // this.currencyBalance = data.data.data.total
        this.currencyBalance = getNestedData(data, 'data.data.total')
        console.log(this.currencyBalance)
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
            this.setErrorMsg(0, this.$t('M.user_push_input_buyer') + 'UID')
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
            return 0
          }
        // 交易密码
        case 3:
          if (!targetNum) {
            // 请输入交易密码
            this.setErrorMsg(3, this.$t('M.user_push_input_pwd'))
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
        // 整页loading
        this.fullscreenLoading = true
        data = await pushAssetsSubmit(param)
        if (!(returnAjaxMsg(data, this, 1))) {
          // 接口失败清除loading
          this.fullscreenLoading = false
          return false
        } else {
          // 接口成功清除loading
          this.fullscreenLoading = false
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
      if (!(returnAjaxMsg(data, this, 0))) {
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
    // 确定付款接口
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
        if (!(returnAjaxMsg(data, this, 1))) {
          return false
        } else {
          this.passwordVisible = false
          this.dialogVisible = false
          // 付款成功刷新列表
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
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
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
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .push-assets {
    > .push-assets-main {
      > .push-assets-content-box {
        min-height: 577px;

        > .push-from-box {
          width: 400px;
          min-height: 577px;
          padding-top: 29px;
          margin: 0 auto;

          .form-input-common,
          .form-button-common,
          .form-input-common-state {
            box-sizing: border-box;
            width: 270px;
            height: 36px;
          }

          .form-button-common {
            margin: 0 0 50px 120px;
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
            height: 30px;
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

      .el-input__inner,
      .el-input-group {
        width: 270px;
        height: 36px;
        border-radius: 2px;
        cursor: pointer;
      }

      .el-input__inner {
        height: 36px;
        border-radius: 2px;
      }

      .el-form-item {
        margin-bottom: 25px;
      }

      .el-form-item__label {
        width: 124px !important;
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
            border: 1px solid #338ff5;
            line-height: 0;
            color: rgba(255, 255, 255, .7);
            background-color: transparent;
          }
        }
      }

      /* PUSH确认 */
      .push-affirm {
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

        .el-dialog__footer {
          text-align: center;
        }

        .el-button {
          width: 270px;
          height: 36px;
          border: 0;
          line-height: 0;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .shipping-address {
        .el-dialog {
          width: 320px;
        }

        .el-dialog__header {
          padding: 20px 25px 5px;
        }

        .el-form-item {
          margin-bottom: 0;
        }

        .el-dialog__footer {
          text-align: center;
        }

        .el-button {
          width: 270px;
          height: 36px;
          border: 0;
          line-height: 0;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }

      .el-form--label-top {
        .el-form-item__label {
          padding: 0;
        }
      }

      .el-dialog__body {
        padding: 10px 25px 15px;
      }

      .el-dialog--center {
        text-align: left;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .push-assets-main {
        > .push-assets-content,
        > .push-assets-content-box {
          background-color: $nightMainBgColor;

          > .push-header {
            background-color: $nightMainBgColor;

            > .push-header-title {
              color: #338ff5;
            }
          }

          > .push-from-box {
            .form-input-common {
              border: 1px solid #485776;
              color: #fff;

              &:focus {
                border: 1px solid #338ff5;
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
          background-color: $nightMainBgColor;

          > .award-record-header {
            border-bottom: 1px solid #39424d !important;

            > .header-color {
              color: #fff;
            }
          }

          .award-record-content {
            .state-status {
              color: #338ff5;
            }

            .form-input-common {
              color: #fff;
              background-color: #1a2233;
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
              border: 1px solid #338ff5;
            }
          }
        }

        .el-input__inner {
          border: 1px solid #485776;
          color: #a9bed4;
          background-color: #1c1f32;

          &:focus {
            border: 1px solid #338ff5;
          }
        }

        .el-input-group__append {
          border-top: 1px solid #485776;
          border-bottom: 1px solid #485776;
          color: #338ff5;
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
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .push-assets-main {
        > .push-assets-content,
        > .push-assets-content-box {
          border: 1px solid rgba(246, 246, 246, 1);
          border-radius: 4px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 4px rgba(235, 240, 248, 1);

          > .push-header {
            border: 1px solid rgba(236, 241, 248, 1);
            background: rgba(255, 255, 255, 1);

            > .push-header-title {
              color: #338ff5;
            }
          }

          > .push-from-box {
            .form-input-common {
              border: 1px solid rgba(236, 241, 248, 1);
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
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
          border: 1px solid rgba(246, 246, 246, 1);
          border-radius: 4px;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 4px rgba(235, 240, 248, 1);

          > .award-record-header {
            border-bottom: 1px solid rgba(57, 66, 77, .1);

            > .header-color {
              color: #333;
            }
          }

          .award-record-content {
            .state-status {
              color: #338ff5;
            }

            .form-input-common {
              color: #fff;
              background-color: #1a2233;
            }
          }
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-form-item__label {
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
      }
    }
  }
</style>
