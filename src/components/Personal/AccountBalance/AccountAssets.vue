<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="account-assets-main"
    >
      <!-- 用户信息-->
      <UserInfo />
      <div class="account-assets-box margin-top16">
        <div>
          <header class="account-assets-header display-flex personal-height40 line-height40">
            <!--我的资产-->
            <div class="header-flex header-left flex1 padding-left23 font-size16 font-weight600">
              {{ $t('M.comm_user_asset_information') }}
            </div>
            <div class="header-flex header-right flex1 padding-right23 display-flex">
              <div class="header-right-left float-left flex1">
                <div class="header-right-text text-align-r">
                  <!--隐藏资产为0的币种-->
                  {{ $t('M.user_hidden_assets') }}
                  <p class="float-right header-right-show margin-left10">
                    <img
                      v-show="isShowAllCurrency"
                      @click.prevent="statusOpenToCloseCurrency('all')"
                      class="switch-img"
                      :src="closePictureSrc"
                    >
                    <img
                      v-show="!isShowAllCurrency"
                      @click.prevent="statusOpenToCloseCurrency('not_all')"
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
                  @keyup="statusSearch"
                >
              </p>
            </div>
          </header>
        </div>
        <div class="account-assets-content">
          <!--账户资产币种列表-->
          <div
            class="content-list"
            v-loading="localLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <div class="table-body text-align-l line-height50">
              <!-- 表头 -->
              <div class="table-title-th display-flex margin20 font-size12">
                <!--币种-->
                <div
                  class="flex1"
                >
                  {{ $t('M.comm_currency') }}
                </div>
                <!--总数量-->
                <div
                  class="flex1"
                >
                  {{ $t('M.user_assets_sum1') }}
                </div>
                <!--冻结数量-->
                <div
                  class="flex1"
                >
                  {{ $t('M.user_assets_sum2') }}
                </div>
                <!--可用数量-->
                <div
                  class="flex1"
                >
                  {{ $t('M.user_assets_sum3') }}
                </div>
                <!--资产估值(BTC)-->
                <div
                  class="flex1 flex-asset"
                >
                  {{ $t('M.user_assets_sum4') }}(BTC)
                  <div class="icon-caret">
                    <i class="el-icon-caret-bottom caret-text cursor-pointer"></i>
                    <i class="el-icon-caret-top caret-text1 cursor-pointer"></i>
                  </div>
                </div>
                <!--操作-->
                <div
                  class="flex1 text-align-c"
                >
                  {{ $t('M.comm_operation') }}
                </div>
              </div>
              <div
                class="table-tr font-size12 padding-lr20"
                v-for="(assetItem, index) in withdrawDepositList"
                :key="index"
              >
                <div class="table-box display-flex">
                  <div class="table-td flex1">
                    {{ assetItem.coinName }}
                  </div>
                  <div class="table-td flex1">
                    {{ $scientificToNumber(assetItem.sum - 0) }}
                  </div>
                  <div class="table-td flex1">
                    {{ $scientificToNumber(assetItem.frozen - 0) }}
                  </div>
                  <div class="table-td flex1">
                    {{ $scientificToNumber(assetItem.total - 0) }}
                  </div>
                  <div class="table-td flex1 text-align-c">
                    {{ $scientificToNumber(assetItem.btcValue) }}
                  </div>
                  <div class="table-td flex1 display-flex text-align-r font-size12">
                    <div
                      v-if="withdrawDepositList[index].isRecharge === 'true'"
                      class="table-charge-money flex1 cursor-pointer"
                      @click.prevent="showRechargeBox(assetItem.coinId, assetItem.coinName, index)"
                    >
                      <!--充币-->
                      {{ $t('M.comm_charge_money') }}
                    </div>
                    <div
                      v-else
                      class="money-color flex1 cursor-pointer"
                      :title="$t('M.user_assets_suspended')"
                    >
                      <!--充币-->
                      {{ $t('M.comm_charge_money') }}
                    </div>

                    <!--提币-->
                    <div
                      v-if="withdrawDepositList[index].isWithdraw === 'true'"
                      class="table-mention-money flex1 cursor-pointer"
                      @click.prevent="changeWithdrawBoxByCoin(assetItem.coinId, assetItem.coinName, index)"
                    >
                      <!--提币-->
                      {{ $t('M.comm_mention_money') }}
                    </div>
                    <div
                      v-else
                      class="money-color flex1 cursor-pointer"
                      :title="$t('M.user_assets_pause_mention')"
                    >
                      <!--提币-->
                      {{ $t('M.comm_mention_money') }}
                    </div>
                    <div
                      class="table-deal flex1 cursor-pointer text-align-c"
                      @mouseenter="showSymbolJumpList(assetItem.coinId, index)"
                      @mouseleave="leave()"
                    >
                      <!--交易-->
                      {{ $t('M.comm_deal') }}
                      <div
                        class="type-transaction border-radius4"
                        v-show="tradingState&&index==current"
                      >
                        <span
                          class="triangle-border display-inline-block"
                          v-show="currencyTradingList.length"
                        >
                        </span>
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
                    <div class="out-box">
                      <!--充币内容-->
                      <ChargeMoneyItem
                        v-if="withdrawDepositList[index].rechargeIsShow"
                        :isShow="withdrawDepositList[index].rechargeIsShow"
                        :currencyName="currencyName"
                        :minRechargeAmount="minRechargeAmount"
                        :successCount="successCount"
                        :chargeMoneyAddress="chargeMoneyAddress"
                        :isNeedTag="isNeedTag"
                        :rechargeNoteInfo="rechargeNoteInfo"
                        @jumpToOtherTab="jumpToOtherTab"
                      />
                    </div>
                    <!--提币内容-->
                    <div
                      class="out-box"
                    >
                      <WithdrawDepositItem
                        :isShow="withdrawDepositList[index].withdrawDepositIsShow"
                        :isNeedTag="isNeedTag"
                        :withdrawRemark="withdrawRemark"
                        :currencyName="currencyName"
                        :originalActiveWithdrawDepositAddress="originalActiveWithdrawDepositAddress"
                        :withdrawAddressList="withdrawAddressList"
                        :feeRangeOfWithdraw="feeRangeOfWithdraw"
                        :index="index"
                        :accountCount="accountCount"
                        :pointLengthAccountCount="pointLengthAccountCount"
                        :ref="`withdrawItemRef${index}`"
                        :coinId="assetItem.coinId"
                        @changeInputValue="changeInputValue"
                        @validateOfWithdraw="validateOfWithdraw"
                        @checkUserInputAvailable="checkUserInputAvailable"
                        @jumpToOtherTab="jumpToOtherTab"
                        @checkCurrencyAddress="checkCurrencyAddress"
                        @changeWithdrawAddress="changeWithdrawAddress"
                      />
                    </div>
                  </div>
                </transition>
              </div>
              <!--提币验证-->
              <el-dialog
                :title="$t('M.comm_mention_money') + $t('M.comm_site')"
                :visible.sync="isShowWithdrawDialog"
              >
                <el-form
                  :label-position="labelPosition"
                >
                  <!--手机已认证-->
                  <!--手机验证-->
                  <el-form-item
                    v-show="securityCenter.isPhoneEnable"
                    :label="$t('M.comm_code_phone')"
                  >
                    <input
                      class="content-input padding-l15 box-sizing"
                      type="number"
                      v-model="phoneCode"
                      @focus="emptyStatus"
                    />
                    <CountDownButton
                      class="send-code-btn cursor-pointer"
                      :status="disabledOfPhoneBtn"
                      @run="sendPhoneOrEmailCode(0)"
                      v-if="isShowWithdrawDialog"
                    />
                  </el-form-item>
                  <!--手机未认证-->
                  <span
                    v-show="!securityCenter.isPhoneEnable"
                  >

                  </span>
                  <!--邮箱已认证-->
                  <!--邮箱验证-->
                  <el-form-item
                    v-show="securityCenter.isMailEnable"
                    :label="$t('M.comm_code_email')"
                  >
                    <input
                      class="content-input padding-l15 box-sizing"
                      type="number"
                      v-model="emailCode"
                      @focus="emptyStatus"
                    />
                    <CountDownButton
                      class="send-code-btn cursor-pointer"
                      :status="disabledOfEmailBtn"
                      @run="sendPhoneOrEmailCode(1)"
                      v-if="isShowWithdrawDialog"
                    />
                  </el-form-item>
                  <!--邮箱未认证-->
                  <span
                    v-show="!securityCenter.isMailEnable"
                  >
                  </span>
                  <!--谷歌已认证-->
                  <!--谷歌验证-->
                  <el-form-item
                    v-show="securityCenter.isGoogleEnable"
                    :label="$t('M.comm_code_google')"
                  >
                    <input
                      class="content-input input-google padding-l15 box-sizing"
                      type="number"
                      v-model="googleCode"
                      @focus="emptyStatus"
                    >
                  </el-form-item>
                  <!--谷歌未认证-->
                  <span
                    v-show="!securityCenter.isGoogleEnable"
                  >
                  </span>
                  <!--交易密码-->
                  <el-form-item
                    :label="$t('M.comm_password')"
                  >
                    <input
                      type="password"
                      autocomplete= "new-password"
                      class="content-input input-google padding-l15 box-sizing"
                      v-model="password"
                    >
                  </el-form-item>
                </el-form>
                <div
                  class="error-info"
                >
                  <span v-show="errorMessage">
                    {{ errorMessage }}
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
              <!--设置交易密码-->
              <el-dialog
                :title="$t('M.comm_set') + $t('M.comm_password')"
                :visible.sync="dialogVisible"
                center
              >
                <span class="info text-align-c display-inline-block">
                  <!--您还未设置交易密码请先设置交易密码在进行提币-->
                  {{ $t('M.user_assets_no_transaction_password') }}
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
                    <!--确 定-->
                    {{ $t('M.comm_confirm') }}
                  </button>
                  <button
                    class="btn border-radius4 cursor-pointer"
                    @click.prevent="dialogVisible = false"
                  >
                    <!--取 消-->
                    {{ $t('M.comm_cancel') }}
                  </button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
      <div class="paging">
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
</template>
<!--请严格按照如下书写书序-->
<script>
// 我的资产
import UserInfo from '../AccountBalance/UserInfo'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
import CountDownButton from '../../Common/CountDownCommon'
import ChargeMoneyItem from './ChargeMoneyItem'
import WithdrawDepositItem from './WithdrawDepositItem'
import {
  formatNumberInput,
  amendPrecision
} from '../../../utils'
import {
  assetCurrenciesList,
  inquireRechargeAddressList,
  statusSubmitWithdrawButton,
  withdrawalInformation,
  queryTransactionInformation,
  inquireWithdrawalAddressId,
  checkCurrencyAddress
} from '../../../utils/api/personal'
import {
  returnAjaxMsg,
  sendPhoneOrEmailCodeAjax,
  getSecurityCenter,
  getNestedData
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    WithdrawDepositItem, // 提币 item
    ChargeMoneyItem, // 充币 item
    UserInfo, // 我的资产
    IconFontCommon, // 字体图标
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      labelPosition: 'top', // form表单label方向
      errorMessage: '', // 提币验证错误提示
      isShowAllCurrency: true, // 隐藏币种// 显示所有/余额切换，
      closePictureSrc: require('../../../assets/user/wrong.png'), // 显示部分
      openPictureSrc: require('../../../assets/user/yes.png'), // 全显示
      searchKeyWord: '', // 搜索关键字
      withdrawDepositList: [], // 我的资产全部币种列表
      chargeMoneyAddress: '', // 根据充币地址生成二维码条件
      withdrawalFee: '', // 自定义提币手续费
      feeRangeOfWithdraw: {}, // 提币手续费范围
      withdrawCount: '', // 提币数量
      accountCount: '', // 自定义到账数量
      tradingState: false, // 跳转交易对默认不显示
      current: 0, // 交易对当前状态
      dialogVisible: false, // 新用户未设置交易密码提示框默认false
      currencyTradingList: [], // 根据coinId查询交易对信息
      activeName: 'current-entrust', // 分页类型
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      // 充值
      chargeDialogVisible: false, // 默认隐藏充值框
      chargeMoneyAddressId: '', // 数据ID
      currencyName: '', // 币种名称
      // 提币
      securityCenter: {}, // 安全中心状态获取
      activeCoinId: '', // 每行数据ID
      activeWithdrawDepositAddress: '', // 当前提币地址
      withdrawRemark: '', // 每行数据提币地址备注
      withdrawCountVModel: '', // 数量
      withdrawFeeVModel: '', // 手续费
      pointLengthAccountCount: 4, // 提币数量小数位限制
      isShowWithdrawDialog: false, // 默认提币确认弹窗
      phoneCode: '', // 邮箱验证
      emailCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      password: '', // 交易密码
      // 提币地址列表
      withdrawAddressList: [], // 查询提币地址列表
      activeCurrency: {}, // 当前选中币种
      totalSumBTC: '', // 资产总估值BTC
      isRecharge: '', // 是否允许充币
      isWithdraw: '', // 是否允许提币
      currencyTradingId: '', // 根据Id跳转到对应交易信息
      id: '', // 币种ID
      sellName: '', // 币种名称
      sellsymbol: '', // 交易对名称
      isNeedTag: false, // 是否需要转账提示标签
      rechargeNoteInfo: '', // 充币地址备注信息
      localLoading: true, // 页面列表局部loading
      isLegalWithdrawAddress: true, // 是否为合法提币地址
      // 最小提币数量
      minRechargeAmount: '',
      // 确认次数
      successCount: '',
      end: '' // 占位
    }
  },
  created () {
    // 刚进页面时候 个人资产列表展示
    this.getAssetCurrenciesList()
  },
  mounted () {
    console.log(this.$refs)
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_JUMP_STATUS',
      'SET_JUMP_SYMBOL',
      'CHANGE_ACTIVE_TRADE_AREA',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'SET_NEW_WITHDRAW_ADDRESS'
    ]),
    // 切换当前显示币种 状态（全部币种 币种为零隐藏）Toggle current currency status
    statusOpenToCloseCurrency (e) {
      console.log(e)
      this.isShowAllCurrency = e == 'not_all' ? true : false
      this.getAssetCurrenciesList(e)
    },
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
          amount24h: 3.376161
          area: "ETH"
          areaId: "492663598368161792"
          countExchange: 6
          high: 7.1
          hot: false
          id: "btceth"
          image: "http://fubt-3.oss-cn-hongkong.aliyuncs.com/dae9ad6c-b4e9-47ad-a655-bc24d05d698c"
          kai: 0.02
          low: 0.000001
          plateId: "492663683579641856"
          price: 0.1
          priceExchange: 6
          rose: 4
          sellName: "比特币"
          sellsymbol: "BTC"
          tendency: Array(0)
          tradeId: "492663376246210560"
          volume: 116.21105 */
      let activeSymbol = {
        area: e.buyCoinName,
        areaId: e.tradeAreaId,
        countExchange: e.quantityDecimalPlace,
        id: e.sellCoinName + e.buyCoinName,
        priceExchange: e.priceDecimalPlace,
        sellName: e.sellCoinName,
        sellsymbol: e.sellCoinNickname,
        tradeId: e.id
      }
      this.SET_JUMP_STATUS(true)
      this.SET_JUMP_SYMBOL(activeSymbol)
      console.log(this.activeSymbol)
      // 设置当前交易区
      const id = e.tradeAreaId
      const name = e.buyCoinName
      console.log(e)
      this.CHANGE_ACTIVE_TRADE_AREA({
        id,
        name
      })
      this.$goToPage('/TradeCenter')
    },
    // 修改input value 输入限制
    changeInputValue ({ref, index, pointLengthAccountCount, val}) {
      // 获取ref中input值
      // this[ref] = this.$refs[ref].value
      // 限制数量小数位位数
      let target = this.$refs[`withdrawItemRef${index}`][0].$refs[ref]
      formatNumberInput(target, pointLengthAccountCount)
      let targetCount = amendPrecision(
        this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value,
        this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value,
        '-'
      )
      console.log(this.accountCount)
      this.accountCount = targetCount > 0 ? targetCount : 0
      // 判断是输入时还是手续费 判断错误提示
      if (val === 'rechargeType') {
        // console.log(this.withdrawCountVModel)
        // console.log(this.$refs.withdrawCount[index].value)
      } else if (val === 'serviceType') {
        // 获取输入手续费
        this.withdrawFeeVModel = this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value
      }
    },
    // 失去焦点判断输入提币数量不能大于可用量 否则显示总可用量
    checkUserInputAvailable (data) {
      let {index} = data
      // 获取ref中input值
      // this[ref] = this.$refs[ref].value
      // 获取输入数量
      // this.withdrawCountVModel = this.$refs.withdrawCount[index].value
      // console.log(this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value)
      this.withdrawCountVModel = this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value
      // console.log(this.withdrawCountVModel)
      // console.log(this.withdrawDepositList[index].total)
      if (this.withdrawCountVModel - 0 > this.withdrawDepositList[index].total - 0) {
        this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value = this.withdrawDepositList[index].total - 0
        this.withdrawCountVModel = this.withdrawDepositList[index].total - 0
      }
      let targetCount = amendPrecision(this.withdrawCountVModel, this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value, '-')
      // console.log(targetCount)
      this.accountCount = targetCount > 0 ? targetCount : 0
    },
    // 点击充币按钮显示充币内容（带回币种id 币种名称 当前index）
    async showRechargeBox (id, name, index) {
      // 每行数据ID
      this.chargeMoneyAddressId = id
      // 每行数据币种名称
      this.currencyName = name

      // 循环列表 隐藏充值或提现框
      this.withdrawDepositList.forEach((item) => {
        item.rechargeIsShow = false
        // 普通币种提币默认显示框
        item.withdrawDepositIsShow = false
        // 公信宝类币种提币默认显示框
        item.provideWithdrawDepositIsShow = false
      })

      if (!this.withdrawDepositList[index].rechargeIsShow) {
        // 显示充值框
        this.withdrawDepositList[index].rechargeIsShow = true
      } else {
        if (this.isNeedTag) {
          // 隐藏普通币种提现框
          this.withdrawDepositList[index].withdrawDepositIsShow = false
        } else {
          // 隐藏公信宝类币种提现框
          this.withdrawDepositList[index].provideWithdrawDepositIsShow = false
        }
      }

      this.fillingCurrencyAddress()
    },
    // 重置提现表单内容
    resetWithdrawFormContent (index) {
      this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value = ''
      // 到账数量
      this.accountCount = ''
      // 提币地址
      this.activeWithdrawDepositAddress = ''
      // 地址标签备注
      this.withdrawRemark = ''
    },
    // 点击提现按钮显示提币内容（带回币种id 币种名称 当前index）
    async changeWithdrawBoxByCoin (id, name, index) {
      console.log(this.userInfo)
      console.log(this.coinStatus)
      if (this.coinStatus == 'disable') {
        // 该账号已被禁止提币，请咨询客服
        this.$message({
          type: 'error',
          message: this.$t('M.recharge_withdraw_failure_0041')
        })
        return
      }
      // 提币数量
      this.resetWithdrawFormContent(index)

      // 当前币种id
      this.activeCoinId = id
      this.currencyName = name

      // 每行数据币种名
      // 隐藏验证弹窗
      this.isShowWithdrawDialog = false
      // 循环列表 隐藏充值或提现框
      this.withdrawDepositList.forEach((item) => {
        item.rechargeIsShow = false
        // 普通币种提币默认显示框
        item.withdrawDepositIsShow = false
        // 公信宝类币种提币默认显示框
        item.provideWithdrawDepositIsShow = false
      })
      this.withdrawDepositList[index].withdrawDepositIsShow = true

      // 隐藏充值弹窗
      this.withdrawDepositList[index].rechargeIsShow = false
      await this.queryWithdrawalAddressList()
      await this.getWithdrawalInformation(index)
      this.getSecurityCenter()
    },
    // 显示交易对跳转币种信息
    showSymbolJumpList (id, index) {
      this.currencyTradingId = id
      this.tradingState = true
      this.current = index
      this.getQueryTransactionInformation()
    },
    leave () {
      this.tradingState = false
      this.current = null
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMessage = ''
    },
    // 发送验证码
    sendPhoneOrEmailCode (loginType) {
      console.log(this.disabledOfPhoneBtn, this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        userId: this.userInfo.userId
      }
      switch (loginType) {
        case 0:
          params.phone = this.userInfo.userInfo.phone
          break
        case 1:
          params.email = this.userInfo.userInfo.email
          break
      }
      sendPhoneOrEmailCodeAjax(loginType, params, this)
    },
    // 调取后台接口 搜索关键字模糊查询
    statusSearch () {
      this.getAssetCurrenciesList()
    },
    /**
     * 刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList (type) {
      let data
      let params = {
        pageNum: this.currentPageForMyEntrust,
        pageSize: this.pageSize,
        shortName: this.searchKeyWord, // 搜索关键字
        selectType: 'all' // all：所有币种 not_all：有资产币种
      }
      switch (type) {
        case 'all':
          params.selectType = 'not_all'
          break
        case 'not_all':
          params.selectType = 'all'
          break
      }
      data = await assetCurrenciesList(params)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.localLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.localLoading = false
        this.withdrawDepositList.push({
          allIsShow: false,
          rechargeIsShow: false,
          withdrawDepositIsShow: false,
          provideWithdrawDepositIsShow: false
        })
        // 返回数据
        // let detailData = data.data.data
        let detailData = getNestedData(data, 'data.data')
        this.totalSumBTC = detailData.totalSum
        this.withdrawDepositList = getNestedData(detailData, 'userCoinWalletVOPageInfo.list')
        this.totalPageForMyEntrust = getNestedData(detailData, 'userCoinWalletVOPageInfo.pages') - 0
        // console.log('我的资产币种列表')
        // console.log(this.withdrawDepositList)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getAssetCurrenciesList()
    },
    // 根据币种id查询提币地址
    async queryWithdrawalAddressList () {
      this.activeWithdrawDepositAddress = ''
      this.withdrawAddressList = []
      let data = await inquireWithdrawalAddressId({
        coinId: this.activeCoinId
      })
      if (!data) return false
      let withdrawalAddressData = getNestedData(data, 'data')
      // 对币种类型进行赋值 true公信宝类 false普通币种
      this.isNeedTag = withdrawalAddressData.needTag
      // 返回列表数据并渲染币种列表
      this.withdrawAddressList = getNestedData(withdrawalAddressData, 'userWithdrawAddressListVO.userWithdrawAddressDtoList')
      // console.log(this.withdrawAddressList)
      this.activeWithdrawDepositAddress = getNestedData(withdrawalAddressData, 'userWithdrawAddressListVO.userWithdrawAddressDtoList[0].address') || ''
    },
    // select框自定义提币地址校验地址
    // 新增用户提币地址校验
    async checkCurrencyAddress () {
      let param = {
        coinId: this.activeCoinId, // 币种coinId
        address: this.activeWithdrawDepositAddress
      }
      let data = await checkCurrencyAddress(param)
      if (!(returnAjaxMsg(data, this))) {
        this.isLegalWithdrawAddress = false
        return false
      } else {
        this.isLegalWithdrawAddress = true
        // 验证通过调用验证方式接口
        this.getSecurityCenter()
      }
    },
    /**
     *  点击提币按钮时 获取提币信息（最大最小手续费）
     */
    async getWithdrawalInformation (index) {
      let data = await withdrawalInformation({
        coinId: this.activeCoinId
      })
      console.log(data)
      if (!data) return false
      // 返回列表数据
      this.feeRangeOfWithdraw = getNestedData(data, 'data')
      this.withdrawalFee = getNestedData(data, 'data.minFees')
      this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value = this.withdrawalFee
      this.withdrawFeeVModel = this.withdrawalFee
    },
    /**
     *  点击充币按钮时 查询充币地址查询
     */
    async fillingCurrencyAddress () {
      let data = await inquireRechargeAddressList({
        coinId: this.chargeMoneyAddressId
      })
      console.log(data)
      if (!data) return false
      // 获取充币地址
      this.chargeMoneyAddress = getNestedData(data, 'data.userRechargeAddress.address')
      // 获取币种类型 true公信宝类 false普通币种
      this.isNeedTag = getNestedData(data, 'data.userRechargeAddress.needTag')
      // 获取充值备注信息 rechargeNoteInfo
      this.rechargeNoteInfo = getNestedData(data, 'data.userRechargeAddress.tag')
      // console.log(data.data.data.userRechargeAddress.tag)
      this.minRechargeAmount = getNestedData(data, 'data.userRechargeAddress.minRechargeAmount')
      this.successCount = getNestedData(data, 'data.userRechargeAddress.successCount')
      return true
    },
    // 当前提币地址改变回调
    changeWithdrawAddress ({activeWithdrawDepositAddress}) {
      this.activeWithdrawDepositAddress = activeWithdrawDepositAddress
      this.checkCurrencyAddress()
    },
    /**
     * 点击提币按钮 验证
     * */
    validateOfWithdraw (index) {
      this.isShowWithdrawDialog = false
      console.log(index)
      if (this.isNeedTag) {
        if (!this.withdrawRemark) {
          // 请输入备注
          this.$message({
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_address_labels'),
            type: 'error'
          })
        }
      }
      console.log(this.activeWithdrawDepositAddress)
      if (!this.activeWithdrawDepositAddress) {
        // 请选择提币地址
        this.$message({
          message: this.$t('M.comm_please_choose') + this.$t('M.comm_mention_money') + this.$t('M.comm_site'),
          type: 'error'
        })
        return false
      } else if (!this.isLegalWithdrawAddress) {
        // 提币地址不合法
        this.$message({
          message: this.$t('M.account_failure_00127'),
          type: 'error'
        })
        return false
      }

      if (!this.withdrawCountVModel) {
        // 请输入提币数量
        this.$message({
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_count'),
          type: 'error'
        })
        return false
      }
      if (!this.withdrawFeeVModel) {
        // 请输入手续费
        this.$message({
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_service_charge'),
          type: 'error'
        })
        return false
      }
      console.log(this.accountCount)
      if (this.withdrawFeeVModel < this.feeRangeOfWithdraw.minFees) {
        // 判断输入手续费小于最小提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint5'),
          type: 'error'
        })
        return false
      } else if (this.withdrawFeeVModel > this.feeRangeOfWithdraw.maxFees) {
        // // 判断输入手续费大于于最大提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint6'),
          type: 'error'
        })
        return false
      }
      console.log(this.withdrawFeeVModel, this.feeRangeOfWithdraw)
      if (this.withdrawCountVModel > this.feeRangeOfWithdraw.maxWithdraw) {
        // 大于最大限额
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint8'),
          type: 'error'
        })
        return false
      } else if (this.withdrawCountVModel < this.feeRangeOfWithdraw.minWithdraw) {
        // 小于最小限额
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint9'),
          type: 'error'
        })
        return false
      }
      if (!this.accountCount) {
        // 判断输入数量必须大于手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint7'),
          type: 'error'
        })
        return false
      }
      if (!this.userInfo.userInfo.payPassword) {
        this.dialogVisible = true
      } else {
        this.isShowWithdrawDialog = true
      }
    },
    confirm () {
      this.$goToPage('/TransactionPassword')
    },
    submitMentionMoney () {
      if (!this.phoneCode && !this.emailCode && !this.googleCode) {
        console.log(1)
        // 请输入验证码
        this.errorMessage = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      } else {
        this.errorMessage = ''
        this.stateSubmitAssets()
      }
    },
    // 提交提币接口
    async stateSubmitAssets () {
      let data
      let param = {
        msgCode: this.phoneCode, // 短信验证码
        emailCode: this.emailCode, // 邮箱验证码
        googleCode: this.googleCode, // 谷歌验证码
        coinId: this.activeCoinId, // 币种ID
        withdrawAddress: this.activeWithdrawDepositAddress,
        remark: this.withdrawRemark, // 提币地址
        networkFees: this.withdrawFeeVModel, // 手续费
        amount: this.withdrawCountVModel, // 提币数量
        payCode: this.password // 交易密码
      }
      data = await statusSubmitWithdrawButton(param)
      if (!(returnAjaxMsg(data, this, 1))) {
        return false
      } else {
        this.isShowWithdrawDialog = false
        // 提币地址列表查询
        this.getAssetCurrenciesList()
        // this.stateEmptyData()
        this.resetWithdrawFormContent()
        this.stateEmptyData()
      }
    },
    // 接口请求完成之后普通币种清空数据
    stateEmptyData (index) {
      this.phoneCode = '' // 短信验证码
      this.emailCode = '' // 邮箱验证码
      this.googleCode = '' // 谷歌验证码
      this.password = '' // 交易密码
      this.$refs.withdrawalFee[index].value = ''
      this.$refs.withdrawCount[index].value = ''
      this.accountCount = ''
      this.activeWithdrawDepositAddress = ''
    },
    jumpToOtherTab ({target, coinId}) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(target)
      // 指定要跳转到的coinId
      if (coinId) {
        this.SET_NEW_WITHDRAW_ADDRESS(coinId)
      }
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, {}, data => {
        if (data) {
          this.securityCenter = getNestedData(data, 'data.data')
        }
      })
    },
    /**
     * 根据coinid查询交易信息
     */
    async getQueryTransactionInformation () {
      let data = await queryTransactionInformation({
        coinId: this.currencyTradingId // 币种coinId
      })
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.currencyTradingList = getNestedData(data, 'data.data.entrust') || []
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      uid: state => state.user.loginStep1Info.userInfo.showId,
      activeSymbol: state => state.common.activeSymbol, // 当前选中交易对
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      // 是否允许提币
      coinStatus: state => state.user.loginStep1Info.userInfo.coinStatus
    }),
    // 提现手续费输入input ref
    feeInputRef () {
      return this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef
    },
    // 提现数量输入 input ref
    countInputRef () {
      return this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef
    },
    // 提币地址初始化赋值
    originalActiveWithdrawDepositAddress () {
      return this.activeWithdrawDepositAddress
    }
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'assets') {
        console.log(newVal)
        this.getAssetCurrenciesList()
      }
    },
    activeWithdrawDepositAddress (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .account-assets {
    > .account-assets-main {
      > .account-assets-box {
        min-height: 480px;

        .account-assets-header {
          > .header-flex {
            height: 100%;

            > .header-right-left {
              > .header-right-text {
                width: 200px;

                > .header-right-show {
                  line-height: 50px;
                }
              }
            }

            > .header-right-right {
              position: relative;

              .header-right-search {
                box-sizing: border-box;
                width: 140px;
                height: 26px;
              }

              > .icon-color {
                position: absolute;
                top: 12px;
                left: 95px;
              }
            }
          }
        }

        > .account-assets-content {
          > .content-list {
            > .table-body {
              width: 100%;

              .error-info {
                height: 20px;
                line-height: 35px;
                color: #d45858;
              }

              .button-color {
                width: 80px;
                height: 35px;
                margin: 0 15px 0 50px;
                border: 0;
                line-height: 0;
              }

              .btn {
                width: 80px;
                height: 35px;
                line-height: 0;
              }

              .flex-asset {
                position: relative;
                text-align: left;
              }

              .icon-caret {
                position: absolute;
                top: 0;
                right: 40px;

                .caret-text {
                  position: absolute;
                  top: 23px;
                  left: 5px;
                }

                .caret-text1 {
                  position: absolute;
                  top: 15px;
                  left: 5px;
                }
              }

              > .table-tr {
                > .table-box {
                  width: 100%;

                  > .recharge-list-mention {
                    height: 236px !important;
                  }

                  > .list-mention-treasure {
                    height: 295px !important;
                  }

                  > .out-box {
                    > .recharge-list {
                      position: relative;
                      z-index: 2;
                      padding: 20px 6px;

                      > .triangle {
                        position: absolute;
                        top: -7px;
                        right: 113px;
                        width: 12px;
                        height: 12px;
                        -ms-transform: rotate(135deg);
                        -moz-transform: rotate(135deg);
                        -webkit-transform: rotate(135deg);
                        -o-transform: rotate(135deg);
                        transform: rotate(135deg);
                      }

                      > .triangle-one {
                        right: 55px;
                      }

                      > .mention {
                        width: 100%;
                        padding: 5px 0 0;

                        > .mention-treasure {
                          height: 20px;
                          line-height: 20px;
                          color: #338ff5;

                          > .treasure-info {
                            color: #d45858;
                          }
                        }

                        > .input-mention {
                          width: 640px;
                          height: 34px;
                        }
                      }

                      > .recharge-content {
                        flex: 2;
                        padding: 0 20px;

                        > .recharge-content-hint {
                          height: 20px;
                          margin-bottom: 5px;
                          line-height: 20px;
                        }

                        > .input-box {
                          > .hint-input {
                            width: 430px;
                            height: 32px;
                          }

                          > .code-copy {
                            width: 89px;
                            height: 32px;
                            border-radius: 0 2px 2px 0;
                            line-height: 32px;
                          }
                        }

                        > .recharge-content-title {
                          width: 584px;
                          line-height: 18px;
                        }
                      }

                      > .recharge-content-right {
                        > .recharge-content-code {
                          box-sizing: border-box;
                          width: 110px;
                          height: 110px;
                          padding: 5px;
                        }

                        > .code-list {
                          padding-right: 10px;
                          margin-top: 110px;
                        }
                      }

                      > .recharge-list-left {
                        flex: 2;
                        height: 196px;

                        > .list-left-flex {
                          > .flex-box {
                            position: relative;
                            height: 80px;

                            > .left-flex-hint {
                              line-height: 20px;
                            }

                            > .service-charge {
                              position: absolute;
                              top: 70px;
                              right: 0;
                              width: 100%;
                              height: 20px;
                            }

                            > .flex-input,
                            > .text-input {
                              width: 350px;
                              height: 34px;
                            }

                            > .new-address {
                              position: absolute;
                              top: 38px;
                              right: 1px;
                              width: 35px;
                              height: 34px;
                              line-height: 34px;
                              text-align: center;
                            }

                            > .new-address-currency {
                              top: 49px;
                            }
                          }
                        }

                        > .count-box {
                          padding-left: 15px;

                          > .count-flex-box {
                            height: 80px;

                            > .content-flex-hint,
                            > .count-flex-text {
                              line-height: 20px;
                            }

                            > .count-flex-input,
                            > .count-text-input {
                              width: 275px;
                              height: 34px;
                            }
                          }
                        }

                        > .text-info-mention {
                          position: relative;
                          top: -20px;
                          padding-left: 15px;

                          &.need-tag-top {
                            top: -45px;
                          }

                          > .currency-rule,
                          > .prompt-message {
                            line-height: 25px;
                          }

                          > .mention-button {
                            margin-top: 41px;

                            > .submit-but {
                              width: 80px;
                              height: 34px;
                            }
                          }
                        }
                      }

                      > .text-info {
                        padding: 20px 0 0 15px;

                        > .currency-rule,
                        > .prompt-message {
                          line-height: 16px;
                        }

                        > .mention-button {
                          margin-top: 8px;

                          > .submit-but {
                            width: 80px;
                            height: 34px;
                          }
                        }
                      }
                    }
                  }
                }
              }

              .content-input {
                width: 180px;
                height: 34px;
              }

              .input-google {
                width: 270px;
              }

              .send-code-btn {
                position: absolute;
                z-index: 999;
                top: 4px;
                right: 2px;
                width: 95px;
                height: 34px;
              }
            }
          }
        }

        .table-deal {
          position: relative;

          .type-transaction {
            position: absolute;
            z-index: 2;
            top: 10px;
            left: 56px;
            width: 135px;

            > .triangle-border {
              position: absolute;
              top: 6px;
              left: -8px;
            }

            > .transaction-list {
              height: 30px;
              line-height: 30px;
            }
          }
        }
      }
    }

    /deep/ {
      /* tabs组件出现蓝色边框问题 */
      .el-tabs__active-bar {
        height: 0 !important;
      }

      .el-switch__core {
        width: 32px !important;
        height: 15px;
        border: 0;
      }

      .el-switch__core::after {
        width: 14px;
        height: 14px;
        margin-left: -14px;
      }

      .el-input-group__append {
        width: 89px;
        height: 30px;
        border: 0;
      }

      .el-input__inner {
        width: 350px;
        height: 34px;
        border: 0;
        border-radius: 2px;
      }

      .el-input__icon {
        display: none;
      }

      .el-dialog {
        width: 325px;
      }

      .el-dialog__header {
        height: 50px;
        padding: 10px 20px;
        border-radius: 5px;
        line-height: 30px;
      }

      .el-dialog__body {
        padding: 25px 27px 0;
        line-height: 25px;
      }

      .el-form-item {
        height: 85px;
        margin-bottom: 0;
      }

      .el-dialog__title {
        font-size: 16px;
      }

      .el-button {
        width: 270px;
        height: 34px;
        padding: 0;
        border: 0;
      }

      .el-form-item__label {
        float: none;
        height: 20px;
        padding: 0;
        line-height: 20px;
        text-align: left;
      }

      .el-dialog__footer {
        padding: 0 27px 25px;
        text-align: left;
      }

      .el-table {
        width: 968px !important;
        margin-left: 2px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      .account-assets-box {
        background-color: $nightMainBgColor;

        .account-assets-header {
          box-shadow: 0 2px 13px rgba(24, 30, 42, 1);

          > .header-left {
            color: #338ff5;
          }

          > .header-right {
            > .header-right-right {
              > .header-right-search {
                color: #fff;
                background-color: #2d3651;
              }
            }
          }
        }

        .table-body {
          > .table-title-th {
            border-bottom: 1px solid #39424d;
            color: #a9bed4;
          }

          .info {
            color: #fff;
          }

          .button-color {
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }

          .btn {
            border: 1px solid #338ff5;
            background-color: transparent;
          }

          > .table-tr {
            > .table-box {
              > .table-td {
                color: #9da5b3;

                .money-color {
                  color: #9da5b3;
                }

                .table-charge-money,
                .table-mention-money,
                .money-color {
                  margin-right: 10px;
                }

                > .table-charge-money,
                > .table-mention-money,
                > .table-deal {
                  color: #3e79d6;

                  > .type-transaction {
                    background-color: #2a3242;

                    > .triangle-border {
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                      border-right: 8px solid #2a3242;
                    }

                    > .transaction-list {
                      color: #7a8093;

                      &:hover {
                        color: #3e79d6;
                      }
                    }
                  }
                }
              }

              .input-mention {
                color: #fff;
                background-color: #2d3651;
              }

              > .out-box {
                > .recharge-list {
                  border: 1px solid #338ff5;

                  > .triangle {
                    border-top: 1px solid transparent;
                    border-bottom: 1px solid #338ff5;
                    border-left: 1px solid #338ff5;
                    background-color: #1c1f32;
                    border-right: 1px solid transparent;
                  }

                  > .recharge-content {
                    > .recharge-content-hint {
                      color: #338ff5;
                    }

                    > .input-box {
                      > .hint-input {
                        color: #fff;
                        background-color: #2d3651;
                      }

                      > .code-copy {
                        color: #fff;
                        background-color: #338ff5;
                      }
                    }

                    > .recharge-content-title {
                      color: #d45858;
                    }
                  }

                  > .recharge-content-right {
                    > .recharge-content-code {
                      background-color: #fff;
                    }
                  }

                  > .recharge-list-left {
                    > .list-left-flex {
                      > .flex-box {
                        > .flex-input {
                          color: #fff;
                          background-color: #2d3651;
                        }

                        > .text-input {
                          color: #fff;
                          background-color: #37424c;
                        }

                        > .left-flex-hint,
                        > .new-address {
                          color: #338ff5;
                        }

                        > .address-bg {
                          background-color: #2d3651;
                        }
                      }
                    }

                    > .count-box {
                      > .count-flex-box {
                        > .content-flex-hint {
                          color: #338ff5;
                        }

                        > .count-flex-text {
                          color: #83909b;
                        }

                        > .count-flex-input {
                          color: #fff;
                          background-color: #2d3651;
                        }

                        > .count-text-input {
                          color: #fff;
                          background-color: #20273d;
                        }
                      }
                    }

                    > .text-info-mention {
                      > .currency-rule {
                        color: #d45858;
                      }

                      > .prompt-message {
                        color: #58616a;
                      }

                      > .mention-button {
                        > .submit-but {
                          color: #fff;
                          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
                        }
                      }
                    }
                  }

                  > .text-info {
                    > .currency-rule {
                      color: #d45858;
                    }

                    > .prompt-message {
                      color: #58616a;
                    }

                    > .mention-button {
                      > .submit-but {
                        color: #fff;
                        background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
                      }
                    }
                  }

                  > .email-input {
                    width: 220px;
                    height: 34px;
                  }
                }
              }
            }
          }

          .content-input {
            border: 1px solid #485776;
            color: #fff;

            &:focus {
              border: 1px solid #338ff5;
            }
          }

          .send-code-btn {
            color: #fff;
            background-color: #338ff5;
          }
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        .el-input__inner {
          color: #fff;
          background-color: #2d3651;
        }

        .el-dialog {
          background-color: #28334a;
        }

        .el-dialog__header {
          background-color: #20293c;
        }

        .el-dialog__title {
          color: #fff;
        }

        .el-button {
          color: #fff;
          background: linear-gradient(0deg, #2b396e, #2a5082);
        }

        .el-form-item__label {
          color: rgba(255, 255, 255, .7);
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      .account-assets-box {
        border: 1px solid rgba(38, 47, 56, .1);
        color: $dayFontColor;
        background-color: $dayBgColor;

        .account-assets-header {
          > .header-left {
            color: #338ff5;
          }

          > .header-right {
            > .header-right-right {
              > .icon-color {
                color: #d5d8dc;
              }

              > .header-right-search {
                border: 1px solid rgba(38, 47, 56, .1);
                color: #333;
                background-color: #fff;
              }
            }
          }
        }

        .input-mention {
          color: #333;
          background-color: rgba(51, 143, 245, .1);
        }

        .table-body {
          > .table-title-th {
            border-bottom: 1px solid rgba(57, 66, 77, .1);
            color: #333;
          }

          .info {
            color: #333;
          }

          .button-color {
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }

          .btn {
            border: 1px solid #338ff5;
            color: #333;
            background-color: transparent;
          }

          > .table-tr {
            > .table-box {
              background-color: #fff;

              > .table-td {
                color: #666;

                > .table-charge-money,
                > .table-mention-money,
                > .table-deal {
                  color: #7d90ac;

                  > .type-transaction {
                    border: 1px solid rgba(38, 47, 56, .1);
                    color: #333;
                    background-color: #fff;

                    > .triangle-border {
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                      border-right: 8px solid rgba(38, 47, 56, .1);
                    }

                    > .transaction-list {
                      color: #7a8093;

                      &:hover {
                        color: #3e79d6;
                      }
                    }
                  }
                }
              }

              > .out-box {
                > .recharge-list {
                  border: 1px solid #338ff5;
                  background: #fff;

                  > .triangle {
                    border-top: 1px solid transparent;
                    border-bottom: 1px solid #338ff5;
                    border-left: 1px solid #338ff5;
                    background-color: #fff;
                    border-right: 1px solid transparent;
                  }

                  > .recharge-content {
                    > .recharge-content-hint {
                      color: #338ff5;
                    }

                    > .input-box {
                      > .hint-input {
                        border: 1px solid rgba(38, 47, 56, .1);
                        color: #333;
                        background: rgba(51, 143, 245, .1);
                      }

                      > .code-copy {
                        color: #fff;
                        background-color: #338ff5;
                      }
                    }

                    > .recharge-content-title {
                      color: #d45858;
                    }
                  }

                  > .recharge-content-right {
                    > .recharge-content-code {
                      background-color: #fff;
                    }
                  }

                  > .recharge-list-left {
                    > .list-left-flex {
                      > .flex-box {
                        > .flex-input {
                          border: 1px solid rgba(38, 47, 56, .1);
                          color: #333;
                          background: rgba(51, 143, 245, .1);
                        }

                        > .text-input {
                          color: #fff;
                          background-color: #37424c;
                        }

                        > .left-flex-hint,
                        > .new-address {
                          color: #338ff5;
                        }

                        > .address-bg {
                          background-color: rgba(51, 143, 245, .1);
                        }
                      }
                    }

                    > .count-box {
                      > .count-flex-box {
                        > .content-flex-hint {
                          color: #338ff5;
                        }

                        > .count-flex-text {
                          color: #83909b;
                        }

                        > .count-flex-input {
                          border: 1px solid rgba(38, 47, 56, .1);
                          color: #333;
                          background: rgba(51, 143, 245, .1);
                        }

                        > .count-text-input {
                          border: 1px solid rgba(38, 47, 56, .1);
                          color: #333;
                          background: rgba(51, 143, 245, .1);
                        }
                      }
                    }

                    > .text-info-mention {
                      > .currency-rule {
                        color: #d45858;
                      }

                      > .prompt-message {
                        color: #58616a;
                      }

                      > .mention-button {
                        > .submit-but {
                          color: #fff;
                          background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
                        }
                      }
                    }
                  }

                  > .text-info {
                    > .currency-rule {
                      color: #d45858;
                    }

                    > .prompt-message {
                      color: #58616a;
                    }

                    > .mention-button {
                      > .submit-but {
                        color: #fff;
                        background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
                      }
                    }
                  }

                  > .email-input {
                    width: 220px;
                    height: 34px;
                  }
                }
              }
            }
          }

          .content-input {
            border: 1px solid #ecf1f8;
            color: #333;

            &:focus {
              border: 1px solid #338ff5;
            }
          }

          .send-code-btn {
            color: #fff;
            background-color: #338ff5;
          }
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-tabs__nav {
          border: 1px solid rgba(38, 47, 56, .1);
        }

        .el-input__inner {
          border: 1px solid rgba(38, 47, 56, .1);
          color: #333;
          background: rgba(51, 143, 245, .1);
        }

        .el-select-dropdown__list {
          background: #fff;
        }

        .el-select-dropdown__item.hover {
          color: #333 !important;
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__header {
          color: #333;
          background: rgba(51, 143, 245, .1);
        }

        .el-button {
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }
      }
    }
  }
</style>
