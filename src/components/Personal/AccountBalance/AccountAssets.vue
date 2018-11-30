<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="account-assets-main"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
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
                      v-show="showStatusButton"
                      @click.prevent="statusOpenToCloseCurrency('all')"
                      class="switch-img"
                      :src="closePictureSrc"
                    >
                    <img
                      v-show="hideStatusButton"
                      @click.prevent="statusOpenToCloseCurrency('noall')"
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
                class="table-tr font-size12 paddinglr20"
                v-for="(assetItem, index) in withdrawDepositList"
                :key="index"
              >
                <div class="table-box display-flex">
                  <div class="table-td flex1">
                    {{ assetItem.coinName }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.sum - 0 }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.frozen - 0 }}
                  </div>
                  <div class="table-td flex1">
                    {{ assetItem.total - 0 }}
                  </div>
                  <div class="table-td flex1 text-align-c">
                    {{ assetItem.btcValue }}
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
                      @click.prevent="mentionMoneyButton(assetItem.coinId, assetItem.coinName, index)"
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
                      @mouseenter="enter(assetItem.coinId, index)"
                      @mouseleave="leave()"
                    >
                      <!--交易-->
                      {{ $t('M.comm_deal') }}
                      <div
                        class="type-transaction border-radius4"
                        v-show="tradingState&&index==current"
                      >
                        <span class="triangle-border display-inline-block">
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
                      <div
                      v-show="withdrawDepositList[index].rechargeIsShow"
                      class="recharge-list display-flex"
                    >
                      <p class="triangle"></p>
                      <div class='recharge-content'>
                        <p class="recharge-content-hint font-size12">
                          <span>{{ currencyName }}</span>
                          <!--充值地址-->
                          {{ $t('M.comm_charge_recharge') }}
                        </p>
                        <div
                          class="input-box"
                        >
                          <input
                            class="hint-input border-radius2 padding-l15 float-left"
                            disabled
                            v-model="chargeMoneyAddress"
                          />
                          <span
                            class="code-copy cursor-pointer display-inline-block float-left text-align-c"
                            v-clipboard:copy="chargeMoneyAddress"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError"
                          >
                            <!--复制地址-->
                            {{ $t('M.comm_copy') }}{{ $t('M.comm_site') }}
                          </span>
                        </div>
                        <div class="recharge-content-title font-size12 margin-top9 float-left">
                          <!--转账时请务必备注（否则后果自负）：UID-->
                          <p v-if="isNeedTag == 'true'">
                            * {{ $t('M.user_assets_recharge_hint0').format([currencyName,currencyName]) }}{{rechargeNoteInfo}}
                          </p>
                          <!--禁止充值除 之外的其他资产，任何非 资产充值将不可找回-->
                          <p>* {{ $t('M.user_assets_recharge_hint1').format([currencyName]) }}</p>
                          <!--往该地址充值，汇款完成，等待网络自动确认（6个确认）后系统自动到账-->
                          <p>* {{ $t('M.user_assets_recharge_hint4') }}</p>
                          <!--为了快速到账，充值时可以适当提高网络手续费-->
                          <p>* {{ $t('M.user_assets_recharge_hint5') }}</p>
                        </div>
                      </div>
                      <div class='recharge-content-right flex1'>
                        <p class="recharge-content-code margin-top20 float-left">
                          <VueQrcode
                            class="ercode"
                            :value="chargeMoneyAddress"
                            :options="{ size: 100 }"
                          >
                          </VueQrcode>
                        </p>
                        <p
                          class="code-list text-align-r float-right cursor-pointer font-size12"
                          @click.prevent="jumpToOtherTab('billing-details')"
                        >
                          <!--充值记录-->
                          {{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_record') }}
                        </p>
                      </div>
                    </div>
                    </div>
                    <!--提币内容-->
                    <div
                      class="out-box"
                    >
                      <div
                      class="recharge-list recharge-list-mention list-mention-treasure"
                      v-show="withdrawDepositList[index].withdrawDepositIsShow"
                    >
                      <p class="triangle triangle-one"></p>
                        <!--公信宝类提币备注-->
                      <div
                        class="mention"
                        v-if="isNeedTag"
                      >
                        <p class="mention-treasure">
                          <!--地址标签-->
                          {{ $t('M.user_address_labels') }}
                          <!--（填写错误可能导致资产损失，请仔细核对）-->
                          <span class="treasure-info font-size12">({{ $t('M.user_address_labels_prompt') }})</span>
                        </p>
                        <input
                          type="text"
                          class="input-mention border-radius2 paddinglr15 box-sizing"
                          v-model="withdrawRemark"
                        >
                      </div>
                      <div class="recharge-list-left display-flex">
                        <div class="list-left-flex flex1 font-size12">
                          <div class="flex-box padding-top10">
                            <p class="left-flex-hint">
                              {{ currencyName }}
                              <!--提币地址-->
                              {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
                            </p>
                            <el-select
                              v-model="mentionAddressValue"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="gitCheckCurrencyAddress"
                              filterable
                              allow-create
                            >
                              <el-option
                                v-for="(item, index) in mentionAddressList"
                                :key="index"
                                :label="item.address + ' ' + item.withdrawRemark"
                                :value="item.address"
                              >
                              </el-option>
                            </el-select>
                            <span
                              class="new-address cursor-pointer address-bg"
                              @click.prevent="jumpToOtherTab('mention-address')"
                            >
                              <!--新增-->
                              {{ $t('M.comm_newly_increased') }}
                            </span>
                          </div>
                          <div class="flex-box padding-top20">
                            <p class="left-flex-hint">
                              <!--手续费-->
                              {{ $t('M.comm_service_charge') }}
                            </p>
                            <input
                              type="text"
                              class="flex-input border-radius2 padding-l15 box-sizing"
                              ref="withdrawalFee"
                              @keyup="changeInputValue('withdrawalFee', index, pointLength, 'serviceType')"
                              @input="changeInputValue('withdrawalFee', index, pointLength, 'serviceType')"
                            >
                            <span
                              class="new-address new-address-currency cursor-pointer"
                            >
                              {{ currencyName }}
                            </span>
                            <span class="service-charge display-inline-block text-align-r">
                              {{withdrawalFeeRange.minFees}}
                              -
                              {{withdrawalFeeRange.maxFees}}
                            </span>
                          </div>
                        </div>
                        <div class="count-box flex1 font-size12">
                          <div class="count-flex-box padding-top10">
                            <p class="content-flex-hint">
                              <!--数量-->
                              {{ $t('M.comm_count') }}
                            </p>
                            <input
                              type="text"
                              class="count-flex-input border-radius2 paddinglr15 box-sizing text-align-r"
                              ref="withdrawCount"
                              @blur="stateBlur('withdrawCount', index)"
                              @keyup="changeInputValue('withdrawCount', index, pointLength, 'rechargeType')"
                              @input="changeInputValue('withdrawCount', index, pointLength, 'rechargeType')"
                            >
                            <p class="count-flex-text text-align-r">
                              <span>
                                <!--限额：-->
                                {{ $t('M.comm_limit') }}：
                              </span>
                              <span>
                                {{withdrawalFeeRange.minWithdraw}}
                                -
                                {{withdrawalFeeRange.maxWithdraw}}
                              </span>
                            </p>
                          </div>
                          <div class="count-flex-box padding-top20">
                            <p class="content-flex-hint">
                              <!--到账数量-->
                              {{ $t('M.comm_account') }}{{ $t('M.comm_count') }}
                            </p>
                            <input
                              type="text"
                              disabled
                              class="count-text-input border-radius2 paddinglr15 box-sizing text-align-r"
                              v-model="accountCount"
                            >
                          </div>
                        </div>
                        <div
                          class="text-info-mention flex1 font-size12"
                          :class="{
                            'need-tag-top':isNeedTag
                          }"
                        >
                          <!--提现费率规则：-->
                          <p class="currency-rule">
                            <span>{{ currencyName }}</span>
                            {{ $t('M.user_assets_withdrawal_hint1') }}：
                          </p>
                          <!--为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；-->
                          <p class="prompt-message">
                            * {{ $t('M.user_assets_withdrawal_hint2') }}
                          </p>
                          <!--充值经过1个确认后，才允许提现；-->
                          <p class="prompt-message">
                            * <span>{{ currencyName }}</span>
                            {{ $t('M.user_assets_withdrawal_hint3') }}
                          </p>
                          <!--可提现金额≤账户可用资产-未确认的数字资产。-->
                          <p class="prompt-message">
                            * {{ $t('M.user_assets_withdrawal_hint4') }}
                          </p>
                          <p class="mention-button">
                            <button
                              class="font-size12 submit-but border-radius4 cursor-pointer"
                              @click.prevent="moneyConfirmState(index)"
                            >
                              <!--提币-->
                              {{ $t('M.comm_mention_money') }}
                            </button>
                            <span
                              class="float-right cursor-pointer"
                              @click.prevent="jumpToOtherTab('billing-details')"
                            >
                          <div
                            class="false-tips fz14 ml100 mt0 mb20 pl10 tl"
                            v-show="withdrawErrorMessage"
                          >
                            {{withdrawErrorMessage}}
                          </div>
                              <!--提币记录-->
                                {{ $t('M.comm_mention_money') }}{{ $t('M.comm_record') }}
                          </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </transition>
              </div>
              <!--提币验证-->
              <el-dialog
                :title="$t('M.comm_mention_money') + $t('M.comm_site')"
                :visible.sync="mentionMoneyConfirm"
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
import VueClipboard from 'vue-clipboard2'
import {
  formatNumberInput,
  amendPrecision
} from '../../../utils'
import { createNamespacedHelpers, mapState } from 'vuex'
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
const { mapMutations } = createNamespacedHelpers('user')
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
      labelPosition: 'top', // form表单label方向
      withdrawErrorMessage: '', // 提币input错误提示
      errorMessage: '', // 提币验证错误提示
      showStatusButton: true, // 显示币种
      hideStatusButton: false, // 隐藏币种// 显示所有/余额切换，
      closePictureSrc: require('../../../assets/user/wrong.png'), // 显示部分
      openPictureSrc: require('../../../assets/user/yes.png'), // 全显示
      searchKeyWord: '', // 搜索关键字
      withdrawDepositList: [], // 我的资产全部币种列表
      chargeMoneyAddress: '', // 根据充币地址生成二维码条件
      withdrawalFee: '', // 自定义提币手续费
      withdrawalFeeRange: {}, // 提币手续费范围
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
      mentionDialogVisible: false, // 默认隐藏提币框
      mentionMoneyAddressId: '', // 每行数据ID
      mentionMoneyName: '', // 每行数据币种名称
      mentionAddressValue: '', // 每行数据提币地址
      withdrawRemark: '', // 每行数据提币地址备注
      withdrawAmount: '', // 数量
      withdrawService: '', // 手续费
      pointLength: 4, // 小数为限制
      mentionMoneyConfirm: false, // 默认提币确认弹窗
      phoneCode: '', // 邮箱验证
      emailCode: '', // 手机验证
      googleCode: '', // 谷歌验证
      password: '', // 交易密码
      // 提币地址列表
      mentionAddressList: [], // 查询提币地址列表
      activeCurrency: {}, // 当前选中币种
      totalSumBTC: '', // 资产总估值BTC
      isRecharge: '', // 是否允许充币
      isWithdraw: '', // 是否允许提币
      currencyTradingId: '', // 根据Id跳转到对应交易信息
      id: '', // 币种ID
      sellName: '', // 币种名称
      sellsymbol: '', // 交易对名称
      fullscreenLoading: false, // 整页loading
      isNeedTag: false, // 是否需要转账提示标签
      rechargeNoteInfo: '', // 充币地址备注信息
      localLoading: true, // 页面列表局部loading
      end: '' // 占位
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
    this.getAssetCurrenciesList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    // 切换当前显示币种 状态（全部币种 币种为零隐藏）Toggle current currency status
    statusOpenToCloseCurrency (e) {
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
      this.$store.commit('trade/SET_JUMP_STATUS', true)
      this.$store.commit('trade/SET_JUMP_SYMBOL', activeSymbol)
      console.log(this.activeSymbol)
      // 设置当前交易区
      const id = e.tradeAreaId
      const name = e.buyCoinName
      console.log(e)
      this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', {
        id,
        name
      })
      this.$router.push({'path': '/TradeCenter'})
    },
    // 修改input value 输入限制
    changeInputValue (ref, index, pointLength, val) {
      // 获取ref中input值
      this[ref] = this.$refs[ref].value
      // 限制数量小数位位数
      let target = this.$refs[ref][index]
      formatNumberInput(target, pointLength)
      let targetCount = amendPrecision(this.$refs.withdrawCount[index].value, this.$refs.withdrawalFee[index].value, '-')
      console.log(this.accountCount)
      this.accountCount = targetCount > 0 ? targetCount : 0
      // 判断是输入时还是手续费 判断错误提示
      if (val === 'rechargeType') {
        console.log(1)
        console.log(this.withdrawAmount)
        console.log(this.$refs.withdrawCount[index].value)
      } else if (val === 'serviceType') {
        console.log(2)
        // 获取输入手续费
        this.withdrawService = this.$refs.withdrawalFee[index].value
      }
    },
    // 失去焦点判断输入提币数量不能大于可用量 否则显示总可用量
    stateBlur (ref, index) {
      // 获取ref中input值
      this[ref] = this.$refs[ref].value
      // 获取输入数量
      this.withdrawAmount = this.$refs.withdrawCount[index].value
      console.log(this.withdrawAmount)
      if (this.withdrawAmount - 0 > this.withdrawDepositList[index].total - 0) {
        this.$refs.withdrawCount[index].value = this.withdrawDepositList[index].total - 0
      }
      this.withdrawAmount = this.$refs.withdrawCount[index].value
      let targetCount = amendPrecision(this.$refs.withdrawCount[index].value, this.$refs.withdrawalFee[index].value, '-')
      this.accountCount = targetCount > 0 ? targetCount : 0
    },
    // 点击充币按钮显示充币内容（带回币种id 币种名称 当前index）
    async showRechargeBox (id, name, index) {
      // 显示充值框
      this.chargeDialogVisible = true
      // 每行数据ID
      this.chargeMoneyAddressId = id
      // 每行数据币种名称
      this.currencyName = name
      console.log(this.currencyName)
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
      // 调用充币地址方法
      await this.fillingCurrencyAddress()
    },
    // 点击提现按钮显示提币内容（带回币种id 币种名称 当前index）
    mentionMoneyButton (id, name, index) {
      // 提币数量
      this.$refs.withdrawCount[index].value = ''
      this.withdrawAmount = ''
      // 到账数量
      this.accountCount = ''
      // 提币地址
      this.mentionAddressValue = ''
      // 地址标签备注
      this.withdrawRemark = ''
      // 显示充值框
      this.mentionDialogVisible = true
      // 每行数据ID
      this.mentionMoneyAddressId = id
      // 每行数据币种名
      this.mentionMoneyName = name
      // 隐藏验证弹窗
      this.mentionMoneyConfirm = false
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
      // 调用充币地址方法
      this.queryWithdrawalAddressList()
      // 调用手续费信息
      this.getWithdrawalInformation(index)
      this.getSecurityCenter()
    },
    // 显示交易对跳转币种信息
    enter (id, index) {
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
      console.log(loginType)
      // console.log(this.disabledOfPhoneBtn)
      // console.log(this.disabledOfEmailBtn)
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
        selectType: 'all' // all：所有币种 noall：有资产币种
      }
      switch (type) {
        case 'all':
          params.selectType = 'noall'
          break
        case 'noall':
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
        // this.withdrawDepositList = detailData.userCoinWalletVOPageInfo.list
        this.withdrawDepositList = getNestedData(detailData, 'userCoinWalletVOPageInfo.list')
        // this.totalPageForMyEntrust = detailData.userCoinWalletVOPageInfo.pages - 0
        this.totalPageForMyEntrust = getNestedData(detailData, 'userCoinWalletVOPageInfo.pages') - 0
        console.log('我的资产币种列表')
        console.log(this.withdrawDepositList)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getAssetCurrenciesList()
    },
    // 根据币种id查询提币地址
    async queryWithdrawalAddressList () {
      let data = await inquireWithdrawalAddressId({
        coinId: this.mentionMoneyAddressId
      })
      this.fullscreenLoading = true
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // let withdrawalAddressData = data.
        let withdrawalAddressData = getNestedData(data, 'data.data')
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 对币种类型进行赋值 true公信宝类 false普通币种
        this.isNeedTag = withdrawalAddressData.needTag
        // 返回列表数据并渲染币种列表
        // this.mentionAddressList = withdrawalAddressData.userWithdrawAddressListVO.userWithdrawAddressDtoList
        this.mentionAddressList = getNestedData(withdrawalAddressData, 'userWithdrawAddressListVO.userWithdrawAddressDtoList')
        this.mentionAddressValue = getNestedData(withdrawalAddressData, 'userWithdrawAddressListVO.userWithdrawAddressDtoList[0].address')
      }
    },
    // select框自定义提币地址校验地址
    // 新增用户提币地址校验
    async gitCheckCurrencyAddress () {
      let data
      let param = {
        coinId: this.mentionMoneyAddressId, // 币种coinId
        address: this.mentionAddressValue
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await checkCurrencyAddress(param)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 验证通过调用验证方式接口
        this.getSecurityCenter()
      }
    },
    /**
     *  点击提币按钮时 获取提币信息（最大最小手续费）
     */
    async getWithdrawalInformation (index) {
      let data = await withdrawalInformation({
        coinId: this.mentionMoneyAddressId
      })
      // 整页loading
      this.fullscreenLoading = true
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回列表数据
        // this.withdrawalFeeRange = data.data.data
        this.withdrawalFeeRange = getNestedData(data, 'data.data')
        // this.serviceCharge = data.data.data.minFees
        this.withdrawalFee = getNestedData(data, 'data.data.minFees')
        console.log(this.$refs.withdrawalFee[index])
        console.log(this.$refs.withdrawalFee, index)
        this.$refs.withdrawalFee[index].value = this.withdrawalFee
        this.withdrawService = this.$refs.withdrawalFee[index].value
      }
    },
    /**
     *  点击充币按钮时 查询充币地址查询
     */
    async fillingCurrencyAddress () {
      let data = await inquireRechargeAddressList({
        coinId: this.chargeMoneyAddressId
      })
      // 整页loading
      this.fullscreenLoading = true
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回列表数据
        console.log(data.data.data)
        // 获取充币地址
        this.chargeMoneyAddress = getNestedData(data, 'data.data.userRechargeAddress.address')
        // 获取币种类型 true公信宝类 false普通币种
        this.isNeedTag = getNestedData(data, 'data.data.userRechargeAddress.needTag')
        // 获取充值备注信息 rechargeNoteInfo
        this.rechargeNoteInfo = getNestedData(data, 'data.data.userRechargeAddress.tag')
        console.log(data.data.data.userRechargeAddress.tag)
        console.log(this.chargeMoneyAddress)
      }
    },
    /**
    * 点击提币按钮 验证
    * */
    moneyConfirmState (index) {
      console.log(index)
      if (this.isNeedTag) {
        if (!this.withdrawRemark) {
          // 请输入备注
          this.$message({
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_address_labels'),
            type: 'error'
          })
          this.mentionMoneyConfirm = false
        }
      }
      console.log(this.mentionAddressValue)
      if (!this.mentionAddressValue) {
        // 请选择提币地址
        this.$message({
          message: this.$t('M.comm_please_choose') + this.$t('M.comm_mention_money') + this.$t('M.comm_site'),
          type: 'error'
        })
        this.mentionMoneyConfirm = false
        return false
      }
      if (!this.withdrawAmount) {
        // 请输入提币数量
        this.$message({
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_count'),
          type: 'error'
        })
        this.mentionMoneyConfirm = false
        return false
      }
      if (!this.withdrawService) {
        // 请输入手续费
        this.$message({
          message: this.$t('M.comm_please_enter') + this.$t('M.comm_service_charge'),
          type: 'error'
        })
        this.mentionMoneyConfirm = false
        return false
      }
      console.log(this.accountCount)
      if (this.withdrawService < this.withdrawalFeeRange.minFees) {
        // 判断输入手续费小于最小提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint5'),
          type: 'error'
        })
        return false
      } else if (this.withdrawService > this.withdrawalFeeRange.maxFees) {
        // // 判断输入手续费大于于最大提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint6'),
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
        this.mentionMoneyConfirm = true
      }
    },
    confirm () {
      this.$router.push({path: '/TransactionPassword'})
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
        coinId: this.mentionMoneyAddressId, // 币种ID
        withdrawAddress: this.mentionAddressValue,
        remark: this.withdrawRemark, // 提币地址
        networkFees: this.withdrawService, // 手续费
        amount: this.withdrawAmount, // 提币数量
        payCode: this.password // 交易密码
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await statusSubmitWithdrawButton(param)
      if (!(returnAjaxMsg(data, this, 1))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        this.mentionMoneyConfirm = false
        // 提币地址列表查询
        this.getAssetCurrenciesList()
        this.stateEmptyData()
      }
    },
    // 接口请求完成之后普通币种清空数据
    stateEmptyData (index) {
      this.phoneCode = '' // 短信验证码
      this.emailCode = '' // 邮箱验证码
      this.googleCode = '' // 谷歌验证码
      this.password = ''
      this.$refs.withdrawalFee[index].value = ''
      this.$refs.withdrawCount[index].value = ''
      this.accountCount = ''
      this.mentionAddressValue = ''
    },
    jumpToOtherTab (target) {
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', target)
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    /**
     * 安全中心
     */
    getSecurityCenter () {
      getSecurityCenter(this, {}, data => {
        // 接口失败清除loading
        this.fullscreenLoading = false
        if (data) {
          // 接口成功清除loading
          this.fullscreenLoading = false
          // this.securityCenter = data.data.data
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
        // this.currencyTradingList = data.data.data.entrust
        this.currencyTradingList = getNestedData(data, 'data.data.entrust')
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
      userCenterActiveName: state => state.personal.userCenterActiveName
    })
  },
  watch: {
    userCenterActiveName (newVal) {
      if (newVal === 'assets') {
        console.log(newVal)
        this.getAssetCurrenciesList()
      }
    },
    mentionAddressValue (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .account-assets{
    >.account-assets-main {
      >.account-assets-box {
        min-height: 480px;

        .account-assets-header {
          >.header-flex {
            height: 100%;

            >.header-right-left {
              >.header-right-text {
                width: 200px;

                >.header-right-show {
                  line-height: 50px;
                }
              }
            }

            >.header-right-right {
              position: relative;

              .header-right-search {
                box-sizing: border-box;
                width: 140px;
                height: 26px;
              }

              >.icon-color {
                position: absolute;
                top: 12px;
                left: 95px;
              }
            }
          }
        }

        >.account-assets-content {
          >.content-list {
            >.table-body {
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

              .btn{
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

              >.table-tr {
                >.table-box {
                  width: 100%;

                  >.recharge-list-mention {
                    height:236px !important;
                  }

                  >.list-mention-treasure {
                    height:295px !important;
                  }

                  >.out-box{
                    >.recharge-list {
                      position: relative;
                      z-index: 2;
                      padding: 20px 6px;

                      >.triangle {
                        position: absolute;
                        top: -7px;
                        right: 113px;
                        width: 12px;
                        height: 12px;
                        -ms-transform:rotate(135deg);
                        -moz-transform:rotate(135deg);
                        -webkit-transform:rotate(135deg);
                        -o-transform:rotate(135deg);
                        transform:rotate(135deg);
                      }

                      >.triangle-one {
                        right: 55px;
                      }

                      >.mention {
                        width: 100%;
                        padding: 5px 0 0;

                        >.mention-treasure {
                          height: 20px;
                          line-height: 20px;
                          color: #338ff5;

                          >.treasure-info {
                            color: #d45858;
                          }
                        }

                        >.input-mention {
                          width: 640px;
                          height: 34px;
                          color: #fff;
                          background-color: #2d3651;
                        }
                      }

                      >.recharge-content {
                        flex: 2;
                        padding: 0 20px;

                        >.recharge-content-hint {
                          height: 20px;
                          margin-bottom: 5px;
                          line-height: 20px;
                        }

                        >.input-box {
                          >.hint-input {
                            width: 430px;
                            height: 32px;
                          }

                          >.code-copy {
                            width: 89px;
                            height: 32px;
                            border-radius: 0 2px 2px 0;
                            line-height: 32px;
                          }
                        }

                        >.recharge-content-title {
                          width: 584px;
                          line-height: 18px;
                        }
                      }

                      >.recharge-content-right {
                        >.recharge-content-code {
                          box-sizing: border-box;
                          width: 110px;
                          height: 110px;
                          padding: 5px;
                        }

                        >.code-list {
                          padding-right: 10px;
                          margin-top: 110px;
                        }
                      }

                      >.recharge-list-left {
                        flex: 2;
                        height:196px;

                        >.list-left-flex {
                          >.flex-box {
                            position: relative;
                            height: 80px;

                            >.left-flex-hint {
                              line-height: 20px ;
                            }

                            >.service-charge {
                              position: absolute;
                              top: 70px;
                              right: 0;
                              width: 100%;
                              height: 20px;
                            }

                            >.flex-input,
                            >.text-input {
                              width: 350px;
                              height: 34px;
                            }

                            >.new-address {
                              position: absolute;
                              top: 38px;
                              right: 1px;
                              width: 35px;
                              height: 34px;
                              line-height: 34px;
                              text-align: center;
                            }

                            >.new-address-currency {
                              top: 49px;
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

                            >.count-flex-input,
                            >.count-text-input {
                              width: 275px;
                              height: 34px;
                            }
                          }
                        }

                        >.text-info-mention {
                          position: relative;
                          top: -20px;
                          padding-left: 15px;

                          &.need-tag-top{
                            top: -45px;
                          }

                          >.currency-rule,
                          >.prompt-message {
                            line-height: 25px;
                          }

                          >.mention-button {
                            margin-top: 41px;

                            >.submit-but {
                              width: 80px;
                              height: 34px;
                            }
                          }
                        }
                      }

                      >.text-info {
                        padding: 20px 0 0 15px;

                        >.currency-rule,
                        >.prompt-message {
                          line-height: 16px;
                        }

                        >.mention-button {
                          margin-top: 8px;

                          >.submit-but {
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
      color:$nightFontColor;
      background-color: $nightBgColor;

      .account-assets-box {
        background-color: $nightMainBgColor;

        .account-assets-header {
          box-shadow: 0 2px 13px rgba(24,30,42,1);

          >.header-left {
            color: #338ff5;
          }

          >.header-right {
            >.header-right-right {
              >.header-right-search {
                color: #fff;
                background-color: #2d3651;
              }
            }
          }
        }

        .table-body {
          >.table-title-th {
            border-bottom: 1px solid #39424d;
            color: #a9bed4;
          }

          .info {
            color: #fff;
          }

          .button-color {
            color: rgba(255,255,255,.7);
            background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          }

          .btn{
            border: 1px solid #338ff5;
            background-color: transparent;
          }

          >.table-tr {
            >.table-box {
              >.table-td {
                color: #9da5b3;

                .money-color {
                  color: #9da5b3;
                }

                .table-charge-money,.table-mention-money,.money-color{
                  margin-right: 10px;
                }

                >.table-charge-money,
                >.table-mention-money,
                >.table-deal {
                  color: #3e79d6;

                  >.type-transaction {
                    background-color: #2a3242;

                    >.triangle-border {
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                      border-right: 8px solid #2a3242;
                    }

                    >.transaction-list {
                      color:  #7a8093;

                      &:hover {
                        color: #3e79d6;
                      }
                    }
                  }
                }
              }

              >.out-box{
                >.recharge-list {
                  border: 1px solid #338ff5;

                  >.triangle {
                    border-top: 1px solid transparent;
                    border-bottom: 1px solid #338ff5;
                    border-left: 1px solid #338ff5;
                    background-color: #1c1f32;
                    border-right: 1px solid transparent;
                  }

                  >.recharge-content {
                    >.recharge-content-hint {
                      color: #338ff5;
                    }

                    >.input-box {
                      >.hint-input {
                        color: #fff;
                        background-color: #2d3651;
                      }

                      >.code-copy {
                        color: #fff;
                        background-color: #338ff5;
                      }
                    }

                    >.recharge-content-title {
                      color: #d45858;
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
                          color: #fff;
                          background-color: #2d3651;
                        }

                        >.text-input {
                          color: #fff;
                          background-color: #37424c;
                        }

                        >.left-flex-hint,
                        >.new-address {
                          color: #338ff5;
                        }

                        >.address-bg {
                          background-color: #2d3651;
                        }
                      }
                    }

                    >.count-box {
                      >.count-flex-box {
                        >.content-flex-hint {
                          color: #338ff5;
                        }

                        >.count-flex-text {
                          color: #83909b;
                        }

                        >.count-flex-input{
                          color: #fff;
                          background-color: #2d3651;
                        }

                        >.count-text-input {
                          color: #fff;
                          background-color: #20273d;
                        }
                      }
                    }

                    >.text-info-mention {
                      >.currency-rule {
                        color: #d45858;
                      }

                      >.prompt-message {
                        color: #58616a;
                      }

                      >.mention-button {
                        >.submit-but {
                          color: #fff;
                          background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                        }
                      }
                    }
                  }

                  >.text-info {
                    >.currency-rule {
                      color: #d45858;
                    }

                    >.prompt-message {
                      color: #58616a;
                    }

                    >.mention-button {
                      >.submit-but {
                        color: #fff;
                        background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
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
    }

    &.day{
      color:$dayFontColor;
      background-color: $dayBgColor;

      .account-assets-box {
        border:1px solid rgba(38,47,56,.1);
        color:$dayFontColor;
        background-color: $dayBgColor;

        .account-assets-header {
          >.header-left {
            color: #338ff5;
          }

          >.header-right {
            >.header-right-right {
              >.icon-color {
                color: #d5d8dc;
              }

              >.header-right-search {
                border: 1px solid rgba(38,47,56,.1);
                color: #333;
                background-color: #fff;
              }
            }
          }
        }

        .table-body {
          >.table-title-th {
            border-bottom: 1px solid rgba(57,66,77,.1);
            color: #333;
          }

          .info {
            color: #333;
          }

          .button-color {
            color: rgba(255,255,255,.7);
            background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          }

          .btn{
            border: 1px solid #338ff5;
            color: #333;
            background-color: transparent;
          }

          >.table-tr {
            >.table-box {
              background-color: #fff;

              >.table-td {
                color: #666;

                >.table-charge-money,
                >.table-mention-money,
                >.table-deal {
                  color:  #7d90ac;

                  >.type-transaction {
                    border: 1px solid rgba(38,47,56,.1);
                    color: #333;
                    background-color: #fff;

                    >.triangle-border {
                      border-top: 8px solid transparent;
                      border-bottom: 8px solid transparent;
                      border-right: 8px solid rgba(38,47,56,.1);
                    }

                    >.transaction-list {
                      color:  #7a8093;

                      &:hover {
                        color: #3e79d6;
                      }
                    }
                  }
                }
              }

              >.out-box{
                >.recharge-list {
                  border: 1px solid #338ff5;
                  background: #fff;

                  >.triangle {
                    border-top: 1px solid transparent;
                    border-bottom: 1px solid #338ff5;
                    border-left: 1px solid #338ff5;
                    background-color: #fff;
                    border-right: 1px solid transparent;
                  }

                  >.recharge-content {
                    >.recharge-content-hint {
                      color: #338ff5;
                    }

                    >.input-box {
                      >.hint-input {
                        border:1px solid rgba(38,47,56,.1);
                        color: #333;
                        background:rgba(51,143,245,.1);
                      }

                      >.code-copy {
                        color: #fff;
                        background-color: #338ff5;
                      }
                    }

                    >.recharge-content-title {
                      color: #d45858;
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
                          border: 1px solid rgba(38,47,56,.1);
                          color: #333;
                          background:rgba(51,143,245,.1);
                        }

                        >.text-input {
                          color: #fff;
                          background-color: #37424c;
                        }

                        >.left-flex-hint,
                        >.new-address {
                          color: #338ff5;
                        }

                        >.address-bg {
                          background-color: #fff;
                        }
                      }
                    }

                    >.count-box {
                      >.count-flex-box {
                        >.content-flex-hint {
                          color: #338ff5;
                        }

                        >.count-flex-text {
                          color: #83909b;
                        }

                        >.count-flex-input{
                          border: 1px solid rgba(38,47,56,.1);
                          color: #333;
                          background:rgba(51,143,245,.1);
                        }

                        >.count-text-input {
                          border: 1px solid rgba(38,47,56,.1);
                          color: #333;
                          background:rgba(51,143,245,.1);
                        }
                      }
                    }

                    >.text-info-mention {
                      >.currency-rule {
                        color: #d45858;
                      }

                      >.prompt-message {
                        color: #58616a;
                      }

                      >.mention-button {
                        >.submit-but {
                          color: #fff;
                          background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                        }
                      }
                    }
                  }

                  >.text-info {
                    >.currency-rule {
                      color: #d45858;
                    }

                    >.prompt-message {
                      color: #58616a;
                    }

                    >.mention-button {
                      >.submit-but {
                        color: #fff;
                        background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
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
    }
  }
</style>
