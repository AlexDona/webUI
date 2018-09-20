<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="account-assets-main">
      <!-- 用户信息-->
      <UserInfo />
      <div class="account-assets-box margin-top16">
        <div>
          <header class="account-assets-header display-flex personal-height40 line-height40">
            <div class="header-flex header-left flex1 padding-left23 font-size16 font-weight600">
              我的资产
            </div>
            <div class="header-flex header-right flex1 padding-right23 display-flex">
              <div class="header-right-left float-left flex1">
                <div class="header-right-text text-align-r">
                  显示资产为0的币种
                  <p class="float-right header-right-show margin-left10">
                    <img
                      v-show="showStatusButton"
                      @click.prevent="statusOpenToClose('all')"
                      class="switch-img"
                      :src="closePictureSrc"
                    >
                    <img
                      v-show="hideStatusButton"
                      @click.prevent="statusOpenToClose('noall')"
                      class="switch-img"
                      :src="openPictureSrc"
                    >
                  </p>
                </div>
              </div>
              <p class="header-right-right float-left flex1 text-align-r">
                <IconFontCommon
                  class="font-size16 icon-color"
                  iconName="icon-sousuo-copy"
                />
                <!--搜索框-->
                <input
                  type="text"
                  class="header-right-search border-radius2 padding-left25 font-size12"
                  v-model="searchKeyWord"
                >
              </p>
            </div>
          </header>
        </div>
        <div class="account-assets-content">
          <!--账户资产币种列表-->
          <div class="content-list">
            <div class="table-body text-align-l line-height50">
              <!-- 表头 -->
              <div class="table-title-th display-flex margin20 font-size12">
                <!--币种  总数量  冻结数量  可用数量  资产估值(BTC)  操作-->
                <div
                  class="flex1"
                >
                  币种
                </div>
                <div
                  class="flex1"
                >
                  总数量
                </div>
                <div

                  class="flex1"
                >
                  冻结数量
                </div>
                <div
                  class="flex1"
                >
                  可用数量
                </div>
                <div
                  class="flex1 text-align-c"
                >
                  资产估值(BTC)
                  <i class="el-icon-caret-bottom"></i>
                  <i class="el-icon-caret-top"></i>
                </div>
                <div
                  class="flex1 text-align-c"
                >
                  操作
                </div>
              </div>
              <div
                class="table-tr font-size12 paddinglr20"
                v-for="(assetItem, index) in filteredData"
                :key="index"
              >
                <div class="table-box display-flex">
                  <div class="table-td flex1">
                    {{ assetItem.coinName }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.sum }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.frozen }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.total }}
                  </div>
                  <div class="table-td flex1 text-align-c">
                    {{ assetItem.btcValue }}
                  </div>
                  <div class="table-td flex1 display-flex text-align-r font-size12">
                    <div
                      class="table-charge-money flex1 cursor-pointer"
                      @click.prevent="showRechargeBox(assetItem.coinId, assetItem.coinName, index)"
                    >
                      充币
                    </div>
                    <div
                      class="table-mention-money flex1 cursor-pointer"
                      @click.prevent="mentionMoneyButton(assetItem.coinId, assetItem.coinName, index)"
                    >
                      提币
                    </div>
                    <div
                      class="table-deal flex1 cursor-pointer text-align-c"
                      @mouseenter="enter(assetItem.coinId, index)"
                      @mouseleave="leave()"
                    >
                      交易
                      <div
                        class="type-transaction border-radius4"
                        v-show="seen&&index==current"
                      >
                        <span class="triangle-border display-inline-block"></span>
                        <p
                          class="transaction-list text-align-c"
                          v-for="(item, index) in currencyTradingList"
                          :key="index"
                          @click.prevent="changeActiveSymbol(item, index)"
                        >
                          {{ item.name }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <transition enter-active-class="animated fadeIn">
                  <div
                    class="table-box"
                  >
                    <!--充币内容-->
                    <div
                      v-show="withdrawDepositList[index].rechargeIsShow"
                      class="recharge-list display-flex"
                    >
                      <p class="triangle"></p>
                      <div class='recharge-content'>
                        <p class="recharge-content-hint font-size12">
                          <span>{{ chargeMoneyName }}</span>充值地址
                        </p>
                        <div
                          class="input-box"
                        >
                          <input
                            class="hint-input border-radius2 padding-l15 float-left"
                            disabled
                            v-model="chargeMoney"
                          />
                          <span
                            class="code-copy cursor-pointer display-inline-block float-left text-align-c"
                            v-clipboard:copy="chargeMoney"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                          >
                            复制地址
                          </span>
                        </div>
                        <div class="recharge-content-title font-size12 margin-top9 float-left">
                          <p>* 禁止充值除{{ chargeMoneyName }}之外的其他资产，任何非{{ chargeMoneyName }}资产充值将不可找回</p>
                          <p>* 往该地址充值，汇款完成，等待网络自动确认（4个确认）后系统自动到账</p>
                          <p>* 为了快速到账，充值时可以适当提高网络手续费</p>
                        </div>
                      </div>
                      <div class='recharge-content-right flex1'>
                        <p class="recharge-content-code margin-top45 float-left">
                          <VueQrcode
                            class="ercode"
                            :value="chargeMoney"
                            :options="{ size: 100 }"
                          >
                          </VueQrcode>
                        </p>
                        <p
                          class="code-list text-align-r float-right cursor-pointer font-size12"
                          @click.prevent="stateRechargeRecord"
                        >
                          充值记录
                        </p>
                      </div>
                    </div>
                    <!--提币内容-->
                    <div
                      class="recharge-list recharge-list-mention display-flex"
                      v-show="withdrawDepositList[index].withdrawDepositIsShow"
                    >
                      <p class="triangle triangle-one"></p>
                      <div class="recharge-list-left display-flex">
                        <div class="list-left-flex flex1 font-size12">
                          <div class="flex-box padding-top10">
                            <p class="left-flex-hint">
                              {{ chargeMoneyName }}
                              提币地址
                            </p>
                            <el-select
                              v-model="mentionAddressValue"
                              @change="changeId"
                            >
                              <el-option
                                v-for="(item, index) in mentionAddressList"
                                :key="index"
                                :label="item.address + '—' + item.remark"
                                :value="item.coinId"
                              >
                              </el-option>
                            </el-select>
                            <span
                              class="new-address cursor-pointer"
                              @click.prevent="stateMentionAddress"
                            >
                              新增
                            </span>
                          </div>
                          <div class="flex-box padding-top20">
                            <p class="left-flex-hint">
                              手续费
                            </p>
                            <input
                              type="text"
                              class="flex-input border-radius2 padding-l15 box-sizing"
                              ref="serviceCharge"
                              @keyup="changeInputValue('serviceCharge', index, pointLength)"
                              @input="changeInputValue('serviceCharge', index, pointLength)"
                            >
                            <span
                              class="new-address new-address-currency cursor-pointer"
                            >
                              {{ chargeMoneyName }}
                            </span>
                            <span class="service-charge display-inline-block text-align-r">
                              {{serviceChargeList.minFees}}
                              -
                              {{serviceChargeList.maxFees}}
                            </span>
                          </div>
                        </div>
                        <div class="count-box flex1 font-size12">
                          <div class="count-flex-box padding-top10">
                            <p class="content-flex-hint">数量</p>
                            <input
                              type="text"
                              class="count-flex-input border-radius2 paddinglr15 box-sizing text-align-r"
                              ref="rechargeCount"
                              @keyup="changeInputValue('rechargeCount', index, pointLength)"
                              @input="changeInputValue('rechargeCount', index, pointLength)"
                            >
                            <p class="count-flex-text text-align-r">
                              <span>限额：</span>
                              <span>
                                {{serviceChargeList.minWithdraw}}
                                -
                                {{serviceChargeList.maxWithdraw}}
                              </span>
                            </p>
                          </div>
                          <div class="count-flex-box padding-top20">
                            <p class="content-flex-hint">到账数量</p>
                            <input
                              type="text"
                              disabled
                              class="count-text-input border-radius2 paddinglr15 box-sizing text-align-r"
                              v-model="serviceChargeCount"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="text-info flex1 font-size12">
                        <p class="currency-rule">
                          <span>{{ chargeMoneyName }}</span>提现费率规则：
                        </p>
                        <p class="prompt-message">
                          * 为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；
                        </p>
                        <p class="prompt-message">
                          * <span>{{ chargeMoneyName }}</span>充值经过1个确认后，才允许提现；
                        </p>
                        <p class="prompt-message">
                          * 可提现金额≤账户可用资产-未确认的数字资产。
                        </p>
                        <p class="mention-button">
                          <button
                            class="font-size12 submit-but border-radius4 cursor-pointer"
                            @click.prevent="moneyConfirmState"
                          >
                            提币
                          </button>
                          <span
                            class="float-right cursor-pointer"
                            @click.prevent="stateRechargeRecord"
                          >
                          <div
                            class="false-tips fz14 ml100 mt0 mb20 pl10 tl"
                            v-show="errorMessage"
                          >
                            {{errorMessage}}
                          </div>
                        提币记录
                      </span>
                        </p>
                      </div>
                      <el-dialog
                        title="提币"
                        :visible.sync="mentionMoneyConfirm"
                      >
                        <el-form
                          :label-position="labelPosition"
                        >
                          <!--手机已认证-->
                          <el-form-item
                            v-if="securityCenter.isPhoneEnable"
                            label="手机验证"
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
                            label="邮箱验证"
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
                            label="谷歌验证"
                          >
                            <input
                              class="content-input input-google padding-l15 box-sizing"
                              v-model="googleCode"
                            >
                          </el-form-item>
                          <!--谷歌未认证-->
                          <span v-else></span>
                          <el-form-item label="交易密码">
                            <input
                              type="password"
                              class="content-input input-google padding-l15 box-sizing"
                              v-model="password"
                            >
                          </el-form-item>
                        </el-form>
                        <div
                          slot="footer"
                          class="dialog-footer"
                        >
                          <el-button
                            type="primary"
                            @click.prevent="submitMentionMoney"
                          >
                            确 定
                          </el-button>
                        </div>
                      </el-dialog>
                      <el-dialog
                        title="设置交易密码"
                        :visible.sync="dialogVisible"
                        center
                      >
                        <span class="info text-align-c display-inline-block">
                          您还未设置交易密码请先设置交易密码在进行提币
                        </span>
                        <span
                          slot="footer"
                          class="dialog-footer footer"
                        ><!--确 定 取 消-->
                          <button
                            class="button-color border-radius4 cursor-pointer"
                            type="primary"
                            @click.prevent="confirm"
                          >
                            确 定
                          </button>
                          <button
                            class="btn border-radius4 cursor-pointer"
                            @click.prevent="dialogVisible = false"
                          >
                            取 消
                          </button>
                        </span>
                      </el-dialog>
                    </div>
                  </div>
                </transition>
              </div>
              <!--分页-->
              <el-pagination
                background
                v-show="activeName === 'current-entrust' && withdrawDepositList.length"
                layout="prev, pager, next"
                :page-count="totalPageForMyEntrust"
                @current-change="changeCurrentPage"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 我的资产
import UserInfo from '../AccountBalance/UserInfo'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import VueClipboard from 'vue-clipboard2'
import {formatNumberInput} from '../../../utils'
import { createNamespacedHelpers, mapState } from 'vuex'
import {
  assetCurrenciesList,
  inquireRechargeAddressList,
  statusSubmitWithdrawButton,
  withdrawalInformation,
  statusSecurityCenter,
  queryTransactionInformation,
  inquireWithdrawalAddressId,
  userRefreshUser
} from '../../../utils/api/personal'
import {
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax
} from '../../../utils/commonFunc'
const { mapMutations } = createNamespacedHelpers('personal')
Vue.use(VueClipboard)
export default {
  components: {
    UserInfo, // 我的资产
    IconFontCommon, // 字体图标
    CountDownButton, // 短信倒计时
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {
      labelPosition: 'top',
      activeNames: ['1'],
      errorMessage: '',
      showStatusButton: false, // 显示币种
      hideStatusButton: true, // 隐藏币种// 显示所有/余额切换，
      closePictureSrc: require('../../../assets/user/wrong.png'), // 显示部分
      openPictureSrc: require('../../../assets/user/yes.png'), // 全显示
      searchKeyWord: '', // 搜索关键字
      searchList: [], // 搜索列表
      withdrawDepositList: [],
      activeCoinId: '', // 提现币种id
      rechargeIsShowList: false, // 充币内容
      chargeMoney: '', // 根据充币地址生成二维码条件
      serviceCharge: '', // 自定义手续费
      serviceChargeList: {}, // 手续费区间
      rechargeCount: '', // 提币数量
      serviceChargeCount: '', // 自定义到账数量
      seen: false,
      current: 0,
      dialogVisible: false,
      currencyTradingList: [],
      stateIsShowId: false,
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      // 充值
      chargeDialogVisible: false, // 默认隐藏
      chargeMoneyAddressId: '', // 每行数据ID
      chargeMoneyName: '', // 每行数据币种名称
      // 提币
      securityCenter: {},
      mentionDialogVisible: false, // 默认隐藏
      mentionMoneyAddressId: '', // 每行数据ID
      mentionMoneyName: '', // 每行数据币种名称
      mentionAddressValue: '', // 每行数据提币地址
      amount: '', // 数量
      service: '', // 手续费
      pointLength: 4, // 小数为限制
      mentionMoneyConfirm: false, // 默认提币确认弹窗
      phoneCode: '', // 邮箱验证
      emailCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      password: '', // 交易密码
      // 提币地址列表
      mentionAddressList: [],
      activeCurrency: {}, // 当前选中币种
      totalSumBTC: '', // 资产总估值BTC
      end: '', // 站位
      activeType: '', // 显示类型
      tradingOnId: '', // 根据coinido跳转到对应交易信息
      currencyTradingId: '', // 根据coinido跳转到对应交易信息
      area: '', // 交易区名称
      areaId: '', // 交易区id
      id: '', // 币种Id
      sellname: '',
      sellsymbol: '',
      userInfoRefresh: {}
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/AccountAssets.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/AccountAssetsDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/AccountAssetsNight.css')
    // 刚进页面时候 个人资产列表展示
    // this.getAssetCurrenciesList()
    // this.getUserRefreshUser()
  },
  mounted () {
    // this.parameterSymbol = {
    //   // area: '',
    //   // areaId: '',
    //   // id: '',
    //   // sellname: '',
    //   // sellsymbol: '',
    //   // tradeId: ''
    // }
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_ACTIVE_SYMBOL'
    ]),
    // 切换当前币种
    // 确认开启关闭
    statusOpenToClose (e) {
      switch (e) {
        case 'all':
          this.showStatusButton = false
          this.hideStatusButton = true
          break
        case 'noall':
          this.hideStatusButton = false
          this.showStatusButton = true
          break
      }
      this.getAssetCurrenciesList(e)
    },
    // 根据coinid跳转交易信息
    // tradingId (name, index, activeSymbol) {
    //   console.log(this.parameterSymbol)
    //   this.currencyTradingId = name
    //   this.$store.commit('common/CHANGE_ACTIVE_SYMBOL', {
    //     activeSymbol
    //   })
    // },
    // 跳转当前交易对
    changeActiveSymbol (e) {
      console.log(e)
      // changeActiveSymbol
      /*
        * {
        "data":{
        "entrust":[
          {
            "buyCoinId":"491719528745533440",
            "buyCoinName":"USDT",
            "buyCoinNickname":"USDT",
            "buyFee":0.0000000000,
            "buyStatus":"",
            "createTime":"2018-09-19 15:51:32",
            "forumId":"486108441757089792",
            "id":"491999795670417408",
            "isStop":"true",
            "isTransaction":"true",
            "maxCount":0.0000,
            "maxPrice":0.0000000000,
            "minCount":0.0000,
            "minPrice":0.0000000000,
            "modifier":"申",
            "name":"BTC/USDT",
            "openPrice":0.00000000,
            "openTime":null,
            "operable":"true",
            "priceDecimalPlace":"6",
            "quantityDecimalPlace":"6",
            "sellCoinId":"486124940777488384",
            "sellCoinName":"BTC",
            "sellCoinNickname":"BTC",
            "sellFee":0.0000000000,
            "sellStatus":"",
            "sort":0,
            "status":"enabled",
            "stopTime":null,
            "tradeAreaId":"491998732594708480",
            "tradeId":"491999715173335040",
            "tradeStatus":"",
            "updateTime":"2018-09-19 17:21:05"
          */
      /*
          * area: ""
          high: 0
          hot: false
          id: ""
          image: ""
          low: 0
          price: 0
          rose: 0
          sellname: ""
          sellsymbol: ""
          tendency: Array(8)
          tradeId: ""
          volume: 0 */
      let activeSymbol = {
        id: e.sellCoinName + e.buyCoinName,
        sellname: '',
        sellsymbol: '',
        tradeId: e.tradeId
      }
      this.$store.commit('trade/SET_JUMP_STATUS', true)
      this.$store.commit('trade/SET_JUMP_SYMBOL', activeSymbol)
      console.log(this.activeSymbol)
      // 设置当前交易区
      const id = e.buyCoinId
      const name = e.buyCoinName
      console.log(e)
      this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', {
        id,
        name
      })
      this.$router.push({'path': '/TradeCenter'})
    },
    // 输入限制
    // 修改input value 输入限制
    changeInputValue (ref, index, pointLength) {
      // 获取ref中input值
      this[ref] = this.$refs[ref].value
      // 限制数量小数位位数
      let target = this.$refs[ref][index]
      formatNumberInput(target, pointLength)
      // 获取输入数量
      this.service = this.$refs.serviceCharge[index].value
      this.amount = this.$refs.rechargeCount[index].value
      // 输入数量之后显示在到账数量框中显示,在手续费中输入手续费并且以输入数量之后减去的值显示在到账数量
      this.serviceChargeCount = Math.abs(this.$refs.rechargeCount[index].value - this.$refs.serviceCharge[index].value)
      console.log(this.amount)
    },
    // 显示充值框
    showRechargeBox (id, name, index) {
      this.chargeDialogVisible = true
      this.chargeMoneyAddressId = id
      this.chargeMoneyName = name
      this.withdrawDepositList.forEach((item) => {
        item.rechargeIsShow = false
        item.withdrawDepositIsShow = false
      })
      if (!this.withdrawDepositList[index].rechargeIsShow) {
        this.withdrawDepositList[index].rechargeIsShow = true
      } else {
        this.withdrawDepositList[index].withdrawDepositIsShow = false
      }
      // 调用充币地址方法
      this.fillingCurrencyAddress()
    },
    // 显示提现框
    mentionMoneyButton (id, name, index) {
      this.rechargeCount = ''
      this.amount = ''
      this.serviceChargeCount = ''
      this.mentionDialogVisible = true
      this.mentionMoneyAddressId = id
      this.mentionMoneyName = name
      this.mentionMoneyConfirm = false
      this.withdrawDepositList.forEach((item) => {
        item.rechargeIsShow = false
        item.withdrawDepositIsShow = false
      })
      this.withdrawDepositList[index].withdrawDepositIsShow = true
      this.withdrawDepositList[index].rechargeIsShow = false
      // 调用充币地址方法
      this.queryWithdrawalAddressList()
      // 调用手续费信息
      this.getWithdrawalInformation(index)
    },
    // 显示交易对跳转币种信息
    enter (id, index) {
      this.currencyTradingId = id
      this.seen = true
      this.current = index
      this.getQueryTransactionInformation()
    },
    leave () {
      this.seen = false
      this.current = null
    },
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.address = this.userInfo.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, (data) => {
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
    /**
     * 刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList (type) {
      let data
      let params = {
        pageNum: this.currentPageForMyEntrust,
        pageSize: this.pageSize,
        selectType: 'all' // all：所有币种 noall：有资产币种
      }
      switch (type) {
        case 'all':
          params.selectType = 'all'
          break
        case 'noall':
          params.selectType = 'noall'
          break
      }
      data = await assetCurrenciesList(params)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.withdrawDepositList.push({
          allIsShow: false,
          rechargeIsShow: false,
          withdrawDepositIsShow: false
        })
        // console.log(data.data.data.userCoinWalletVOPageInfo.list)
        // 返回数据
        this.totalSumBTC = data.data.data.totalSum
        this.withdrawDepositList = data.data.data.userCoinWalletVOPageInfo.list
        this.totalPageForMyEntrust = data.data.data.userCoinWalletVOPageInfo.pages - 0
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getAssetCurrenciesList()
    },
    /**
     *  刚进页面时候 提币地址列表查询
     */
    // 资产币种提币地址选择
    changeId (e) {
      this.mentionAddressList.forEach(item => {
        if (e === item.coinId) {
          this.mentionAddressValue = item.address
        }
      })
    },
    // 查询提币地址列表查询
    async queryWithdrawalAddressList () {
      let data = await inquireWithdrawalAddressId({
        coinId: this.mentionMoneyAddressId
        // shortName: this.partnerId, // 币种名称
        // selectType: this.hideStatusButton // all：所有币种 noall：有资产币种
      })
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据userWithdrawAddressDtoList
        this.mentionAddressList = data.data.data.userWithdrawAddressDtoList
        // this.mentionAddressValue = data.data.data.userWithdrawAddressDtoList[0].address
      }
    },
    /**
     *  点击提币按钮时 获取提币信息
     */
    async getWithdrawalInformation (index) {
      let data = await withdrawalInformation({
        coinId: this.mentionMoneyAddressId
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.serviceChargeList = data.data.data
        this.serviceCharge = data.data.data.minFees
        // this.$refs.serviceCharge[index].value = this.serviceCharge
        // console.log(this.$refs.serviceCharge[index].value)
      }
    },
    /**
     *  点击充币按钮时 查询充币地址查询
     */
    async fillingCurrencyAddress () {
      let data = await inquireRechargeAddressList({
        coinId: this.chargeMoneyAddressId
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.chargeMoney = data.data.data.userRechargeAddress.address
        console.log(this.chargeMoney)
      }
    },
    /**
    * 点击提币按钮
    * */
    moneyConfirmState () {
      this.phoneCode = '' // 短信验证码
      this.emailCode = '' // 邮箱验证码
      this.googleCode = '' // 谷歌验证码
      this.payPassword = ''
      if (!this.amount) {
        this.$message({
          message: '请上输入提币数量',
          type: 'error'
        })
        this.mentionMoneyConfirm = false
      } else if (!this.service) {
        this.$message({
          message: '请输入手续费',
          type: 'error'
        })
        this.mentionMoneyConfirm = false
      } else if (this.userInfoRefresh.payPassword == '') {
        this.dialogVisible = true
      } else {
        this.mentionMoneyConfirm = true
        this.getSecurityCenter()
      }
    },
    confirm () {
      this.$router.push({path: '/TransactionPassword'})
    },
    submitMentionMoney () {
      this.stateSubmitAssets()
    },
    // 提交提币接口
    async stateSubmitAssets () {
      let data
      let param = {
        msgCode: this.phoneCode, // 短信验证码
        emailCode: this.emailCode, // 邮箱验证码
        googleCode: this.googleCode, // 谷歌验证码
        coinId: this.mentionMoneyAddressId, // 币种ID
        withdrawAddress: this.mentionAddressValue, // 提币地址
        networkFees: this.service, // 手续费
        amount: this.amount, // 提币数量
        payCode: this.password // 交易密码
      }
      data = await statusSubmitWithdrawButton(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 提币地址列表查询
        this.getAssetCurrenciesList()
      }
    },
    // 点击跳转账单明细
    stateRechargeRecord () {
      console.log('1')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('billing-details')
    },
    // 点击跳转提币地址
    stateMentionAddress () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('mention-address')
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = '已拷贝'
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = '拷贝失败，请稍后重试'
      this.$message({
        type: 'success',
        message: msg
      })
    },
    /**
     *  刷新用户信息
     */
    async getUserRefreshUser () {
      let data = await userRefreshUser({
        token: this.userInfo.token
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.userInfoRefresh = data.data.data.userInfo
      }
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
      }
    },
    /**
     * 根据coinid查询交易信息
     */
    async getQueryTransactionInformation () {
      let data = await queryTransactionInformation({
        coinId: this.currencyTradingId // 币种coinId
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.currencyTradingList = data.data.data.entrust
        this.area = this.currencyTradingList.buyCoinName
        this.areaId = this.currencyTradingList.tradeAreaId
        this.id = this.currencyTradingList.sellCoinName + this.currencyTradingList.buyCoinName
        // this.sellname = data.data.data.entrust.sellCoinName
        this.sellsymbol = this.currencyTradingList.sellCoinName
        // this.buyName = data.data.data.entrust
        // this.buysymbol = data.data.data.entrust
        this.tradeId = this.currencyTradingList.tradeId
        // area: "ETH"
        // areaId: "486108806841892864"
        // id: "wtcfbt"
        // plateId: "486108580110401536"
        // sellname: "沃尔顿链"
        // sellsymbol: "WTC"
        // tradeId: "491725015746609152"
        console.log(this.currencyTradingList)
        console.log(this.area)
        console.log(this.areaId)
        console.log(this.id)
        console.log(this.sellsymbol)
        console.log(this.tradeId)
        console.log(this.currencyTradingId)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      partnerId: state => state.common.partnerId,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      activeSymbol: state => state.common.activeSymbol, // 当前选中交易对
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName
    }),
    filteredData: function () {
      var self = this
      return this.withdrawDepositList.filter((item, index) => {
        console.log(item)
        return (item['coinName'].toLocaleUpperCase()).indexOf(self.searchKeyWord.toLocaleUpperCase()) !== -1
      })
    },
    filteredData1: function () {
      return this.filteredData.filter(function (item) {
        return item
      })
    }
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'assets') {
        console.log(newVal)
        this.getAssetCurrenciesList()
        this.getUserRefreshUser()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountBalance/AccountAssets";
  .account-assets{
    >.account-assets-main {
      >.account-assets-box {
        min-height: 300px;
        .account-assets-header {
          >.header-flex {
            height: 100%;
            >.header-right-left {
              >.header-right-text {
                width: 180px;
                >.header-right-show {
                  line-height: 50px;
                }
              }
            }
            >.header-right-right {
              position: relative;
              .header-right-search {
                width: 140px;
                height: 26px;
                box-sizing: border-box;
              }
              >.icon-color {
                position: absolute;
                left: 95px;
                top: 12px;
              }
            }
          }
        }
        >.account-assets-content {
          >.content-list {
            >.table-body {
              width: 100%;
              >.table-tr {
                >.table-box {
                  width: 100%;
                  >.recharge-list-mention {
                    height:225px !important;
                  }
                  >.recharge-list {
                    position: relative;
                    height:195px;
                    padding: 20px 6px;
                    z-index: 2;
                    .info {
                      color: #fff;
                    }
                    .button-color {
                      width: 80px;
                      height: 35px;
                      border: 0;
                      line-height: 0;
                      margin-left: 50px;
                      margin-right: 15px;
                      color: rgba(255,255,255,0.7);
                      background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
                    }
                    .btn{
                      width: 80px;
                      height: 35px;
                      line-height: 0;
                      color: rgba(255, 255, 255, 0.7);
                      background-color: transparent;
                      border: 1px solid #338FF5;
                    }
                    >.triangle {
                      position: absolute;
                      top: -7px;
                      right: 100px;
                      width: 12px;
                      height: 12px;
                      transform:rotate(135deg);
                      -ms-transform:rotate(135deg);
                      -moz-transform:rotate(135deg);
                      -webkit-transform:rotate(135deg);
                      -o-transform:rotate(135deg);
                    }
                    >.triangle-one {
                      right: 50px;
                    }
                    >.recharge-content {
                      padding: 20px 20px;
                      flex: 2;
                      >.recharge-content-hint {
                        line-height: 20px;
                        height: 20px;
                        margin-bottom: 5px;
                      }
                      >.input-box {
                        >.hint-input {
                          width: 430px;
                          height: 32px;
                        }
                        >.code-copy {
                          width: 89px;
                          height: 34px;
                          border-radius: 0 2px 2px 0;
                          line-height: 34px;
                        }
                      }

                      >.recharge-content-title {
                        width: 450px;
                        line-height: 25px;
                      }
                    }
                    >.recharge-content-right {
                      >.recharge-content-code {
                        width: 110px;
                        height: 110px;
                        padding: 5px;
                        box-sizing: border-box;
                      }
                      >.code-list {
                        margin-top: 110px;
                        padding-right: 10px;
                      }
                    }
                    >.recharge-list-left {
                      flex: 2;
                      >.list-left-flex {
                        >.flex-box {
                          position: relative;
                          height: 80px;
                          >.left-flex-hint {
                            line-height: 20px ;
                          }
                          >.service-charge {
                            width: 100%;
                            position: absolute;
                            top: 70px;
                            height: 20px;
                            right: 0;
                          }
                          >.flex-input,
                          >.text-input {
                            width: 350px;
                            height: 34px;
                          }
                          >.new-address {
                            position: absolute;
                            top: 30px;
                            right: 15px;
                          }
                          >.new-address-currency {
                            top: 40px;
                          }
                        }
                      }
                      >.count-box {
                        padding-left: 15px;
                        >.count-flex-box {
                          height: 80px;
                          >.content-flex-hint,
                          >.count-flex-text {
                            line-height: 20px ;
                          }
                          /*>.count-flex-text {*/
                            /*padding-right: 25px;*/
                          /*}*/
                          >.count-flex-input,
                          >.count-text-input {
                            width: 250px;
                            height: 34px;
                          }
                        }
                      }
                    }
                    >.text-info {
                      padding-left: 15px;
                      >.currency-rule,
                      >.prompt-message {
                        line-height: 20px;
                      }
                      >.mention-button {
                        >.submit-but {
                          width: 80px;
                          height: 34px;
                        }
                      }
                    }
                    .content-input {
                      width: 180px;
                      height: 34px;
                      /*margin-top: 20px;*/
                    }
                    .input-google {
                      width: 270px;
                    }
                    .send-code-btn {
                      width: 90px;
                      height: 35px;
                      margin-left: -4px;
                      padding: 0;
                    }
                  }
                }
              }
            }
          }
        }
        .table-deal {
          position: relative;
          .type-transaction {
            width: 135px;
            position: absolute;
            top: 10px;
            left: 56px;
            z-index: 2;
            >.triangle-border {
              position: absolute;
              top: 6px;
              left: -8px;
            }
            >.transaction-list {
              height: 30px;
              line-height: 30px;
            }
          }
        }
      }
    }
    &.night {
      background-color: $nightBgColor;
      color:$nightFontColor;
      .account-assets-box {
        background-color: #1E2636;
        .account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #333F4A;
                color: #fff;
              }
            }
          }
        }
        .table-body {
          >.table-title-th {
            border-bottom: 1px solid #39424D;
            color: #A9BED4;
          }
          >.table-tr {
            >.table-box {
              >.table-td {
                color: #9DA5B3;
                >.table-charge-money,
                >.table-mention-money,
                >.table-deal {
                  color: #3E79D6;
                  >.type-transaction {
                    background-color: #2a3242;
                    >.triangle-border {
                      border-right: 8px solid #2a3242;
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                    }
                    >.transaction-list {
                      color:  #7a8093;
                      &:hover {
                        color: #3E79D6;
                      }
                    }
                  }
                }
              }
              >.recharge-list {
                border: 1px solid #338FF5;
                .content-input {
                  border: 1px solid #485776;
                  color: #fff;
                  &:focus {
                    border: 1px solid #338FF5;
                  }
                }
                .send-code-btn {
                  background-color: #338FF5;
                  color: #fff;
                }
                >.triangle {
                  border-right: 1px solid transparent;
                  border-top: 1px solid transparent;
                  border-left: 1px solid #338FF5;
                  border-bottom: 1px solid #338FF5;
                  background-color: #1E2636;
                }
                >.recharge-content {
                  >.recharge-content-hint {
                    color: #338FF5;
                  }
                  >.input-box {
                    >.hint-input {
                      background-color: #181E24;
                      color: #fff;
                    }
                    >.code-copy {
                      background-color: #338FF5;
                      color: #fff;
                    }
                  }
                  >.recharge-content-title {
                    color: #D45858;
                  }
                }
                >.recharge-content-right {
                  >.recharge-content-code {
                    background-color: #fff;
                  }
                }
                >.recharge-list-left {
                  >.list-left-flex {
                    >.flex-box {
                      >.flex-input {
                        background-color: #181E24;
                        color: #fff;
                      }
                      >.text-input {
                        background-color: #37424C;
                        color: #fff;
                      }
                      >.left-flex-hint,
                      >.new-address {
                        color: #338FF5;
                      }
                    }
                  }
                  >.count-box {
                    >.count-flex-box {
                      >.content-flex-hint {
                        color: #338FF5;
                      }
                      >.count-flex-text {
                        color: #83909B;
                      }
                      >.count-flex-input{
                        background-color: #181E24;
                        color: #fff;
                      }
                      >.count-text-input {
                        background-color: #37424C;
                        color: #fff;
                      }
                    }
                  }
                }
                >.text-info {
                  >.currency-rule {
                    color: #D45858;
                  }
                  >.prompt-message {
                    color: #58616A;
                  }
                  >.mention-button {
                    >.submit-but {
                      background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                      color: #fff;
                    }
                  }
                }
                >.email-input {
                  width: 220px;
                  height: 34px;
                }
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .account-assets-box {
        background-color: $dayBgColor;
        color:$dayFontColor;
        border:1px solid rgba(38,47,56,0.1);
        .account-assets-header {
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.icon-color {
                color: #D5D8DC;
              }
              >.header-right-search {
                background-color: #fff;
                color: #333;
                border: 1px solid rgba(38,47,56,0.1);
              }
            }
          }
        }
        .table-body {
          >.table-title-th {
            border-bottom: 1px solid rgba(57,66,77,0.1);
            color: #333333;
          }
          >.table-tr {
            >.table-box {
              background-color: #fff;
              >.table-td {
                color: #666666;
                >.table-charge-money,
                >.table-mention-money,
                >.table-deal {
                  color:  #7D90AC;
                  >.type-transaction {
                    background-color: #fff;
                    color: #333;
                    border: 1px solid rgba(38,47,56,0.1);
                    >.triangle-border {
                      border-right: 8px solid rgba(38,47,56,0.1);
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                    }
                    >.transaction-list {
                      color:  #7a8093;
                      &:hover {
                        color: #3E79D6;
                      }
                    }
                  }
                }
              }
              >.recharge-list {
                border: 1px solid #338FF5;
                background: #fff;
                .content-input {
                  border: 1px solid #ECF1F8;
                  color: #333;
                  &:focus {
                    border: 1px solid #338FF5;
                  }
                }
                .send-code-btn {
                  background-color: #338FF5;
                  color: #fff;
                }
                >.triangle {
                  border-right: 1px solid transparent;
                  border-top: 1px solid transparent;
                  border-left: 1px solid #338FF5;
                  border-bottom: 1px solid #338FF5;
                  background-color: #fff;
                }
                >.recharge-content {
                  >.recharge-content-hint {
                    color: #338FF5;
                  }
                  >.input-box {
                    >.hint-input {
                      background:rgba(51,143,245,0.1);
                      color: #333;
                      border:1px solid rgba(38,47,56,0.1);
                    }
                    >.code-copy {
                      background-color: #338FF5;
                      color: #fff;
                    }
                  }
                  >.recharge-content-title {
                    color: #D45858;
                  }
                }
                >.recharge-content-right {
                  >.recharge-content-code {
                    background-color: #fff;
                  }
                }
                >.recharge-list-left {
                  >.list-left-flex {
                    >.flex-box {
                      >.flex-input {
                        background:rgba(51,143,245,0.1);
                        color: #333;
                        border: 1px solid rgba(38,47,56,0.1);
                      }
                      >.text-input {
                        background-color: #37424C;
                        color: #fff;
                      }
                      >.left-flex-hint,
                      >.new-address {
                        color: #338FF5;
                      }
                    }
                  }
                  >.count-box {
                    >.count-flex-box {
                      >.content-flex-hint {
                        color: #338FF5;
                      }
                      >.count-flex-text {
                        color: #83909B;
                      }
                      >.count-flex-input{
                        background:rgba(51,143,245,0.1);
                        color: #333;
                        border: 1px solid rgba(38,47,56,0.1);
                      }
                      >.count-text-input {
                        background:rgba(51,143,245,0.1);
                        color: #333;
                        border: 1px solid rgba(38,47,56,0.1);
                      }
                    }
                  }
                }
                >.text-info {
                  >.currency-rule {
                    color: #D45858;
                  }
                  >.prompt-message {
                    color: #58616A;
                  }
                  >.mention-button {
                    >.submit-but {
                      background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                      color: #fff;
                    }
                  }
                }
                >.email-input {
                  width: 220px;
                  height: 34px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
