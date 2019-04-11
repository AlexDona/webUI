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
                  <p class="float-right header-right-show margin-left10 cursor-pointer">
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
                <!--冻结数量-->
                <div
                  class="flex1 title-position"
                >
                  <div style="float: left;">
                    {{ $t('M.user_assets_sum2') }}
                  </div>
                  <div class="icon-caret">
                    <!--升序-->
                    <i
                      class="el-icon-caret-bottom caret-text cursor-pointer"
                      :class="{active: blueStyleFrozen == 1}"
                      @click.prevent="assetsSorting('up', 'frozen')"
                    >
                    </i>
                    <!--降序-->
                    <i
                      class="el-icon-caret-top caret-text-order cursor-pointer"
                      :class="{active: blueStyleFrozen == 2}"
                      @click.prevent="assetsSorting('down', 'frozen')"
                    >
                    </i>
                  </div>
                </div>
                <!--可用数量-->
                <div
                  class="flex1 title-position"
                >
                  <div style="float: left;">
                    {{ $t('M.user_assets_sum3') }}
                  </div>
                  <div class="icon-caret-order">
                    <!--升序-->
                    <i
                      class="el-icon-caret-bottom caret-text cursor-pointer"
                      :class="{active: blueStyleTotal == 1}"
                      @click.prevent="assetsSorting('up', 'total')"
                    >
                    </i>
                    <!--降序-->
                    <i
                      class="el-icon-caret-top caret-text-order cursor-pointer"
                      :class="{active: blueStyleTotal == 2}"
                      @click.prevent="assetsSorting('down', 'total')"
                    >
                    </i>
                  </div>
                </div>
                <!--锁仓-->
                <div
                  class="flex1"
                >
                  {{ $t('M.assets_locked_position') }}
                </div>
                <!--资产估值()-->
                <div
                  class="flex-asset flex1"
                >
                  <div class="float-left">
                    <span v-if="activeConvertCurrencyObj.shortName !== 'CNY'">
                    ({{ activeConvertCurrencyObj.shortName }})
                  </span>
                    <span v-else>
                    (CNY)
                  </span>
                    <div style="float: left;">
                      {{ $t('M.user_assets_sum4') }}
                    </div>
                  </div>

                  <div class="icon-caret-order">
                    <!--升序-->
                    <i
                      class="el-icon-caret-bottom caret-text cursor-pointer"
                      :class="{active: blueStyleValue == 1}"
                      @click.prevent="assetsSorting('up', 'cnyValue')"
                    >
                    </i>
                    <!--降序-->
                    <i
                      class="el-icon-caret-top caret-text-order cursor-pointer"
                      :class="{active: blueStyleValue == 2}"
                      @click.prevent="assetsSorting('down', 'cnyValue')"
                    >
                    </i>
                  </div>
                </div>
                <!--操作-->
                <div
                  class="text-align-r title-width title-width-last"
                >
                  {{ $t('M.comm_operation') }}
                </div>
              </div>
              <div
                class="table-tr font-size12 padding-lr20"
                v-for="(assetItem, index) in (isShowAllCurrency?filteredData1:filteredData2)"
                :key="index"
                :id= "assetItem.coinName"
              >
                <div class="table-box display-flex flex1">
                  <!--币种-->
                  <div class="table-td title-width">
                    {{ assetItem.coinName }}
                  </div>
                  <!--冻结数量-->
                  <div class="table-td flex1">
                    <span v-if="assetItem.frozen > 0">
                      {{ $scientificToNumber($keep8Num(assetItem.frozen - 0)) }}
                    </span>
                    <span v-else>
                      0.00000000
                    </span>
                  </div>
                  <!--可用数量-->
                  <div class="table-td flex1">
                    <span v-if="assetItem.total > 0">
                      {{ $scientificToNumber($keep8Num(assetItem.total - 0)) }}
                    </span>
                    <span v-else>
                      0.00000000
                    </span>
                  </div>
                  <!--锁仓-->
                  <div class="table-td flex1">
                    <span v-if="assetItem.wareHouse > 0">
                      {{ $scientificToNumber($keep8Num(assetItem.wareHouse - 0)) }}
                    </span>
                    <span v-else>
                      0.00000000
                    </span>
                  </div>
                  <!--资产估值-->
                  <div
                    class="table-td flex1"
                  >
                    <div
                      v-if="assetItem.cnyValue > 0"
                    >
                      <div v-if="activeConvertCurrencyObj.shortName !== 'CNY'">
                        {{ $scientificToNumber($keep2Num(assetItem.cnyValue * CNYRate)) }} {{ activeConvertCurrencyObj.shortName }}
                      </div>
                      <div v-else>
                        {{ $scientificToNumber($keep2Num(assetItem.cnyValue)) }} CNY
                      </div>
                    </div>
                    <div
                      class="title-width-right"
                      v-else
                    >
                      <div v-if="activeConvertCurrencyObj.shortName !== 'CNY'">
                        0.00 {{ activeConvertCurrencyObj.shortName }}
                      </div>
                      <div v-else>
                        0.00 CNY
                      </div>
                    </div>
                  </div>
                  <!--操作-->
                  <div class="table-td display-flex text-align-r font-size12 title-width title-width-la">
                    <!--.isRecharge === 'true'-->
                    <div
                      v-if="(withdrawStorageMap.get(assetItem.coinId)).isRecharge ==='true' && isRechargeState"
                      class="table-charge-money flex1 cursor-pointer"
                      @click.prevent="showRechargeBox(assetItem.coinId, assetItem.coinName)"
                    >
                      <!--充 币-->
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
                      v-if="(withdrawStorageMap.get(assetItem.coinId)).isWithdraw ==='true' && isWithdrawState"
                      class="table-mention-money flex1 cursor-pointer"
                      @click.prevent="changeWithdrawBoxByCoin(assetItem.coinId, assetItem.coinName)"
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
                      class="table-deal cursor-pointer trade-width text-align-c"
                      @mouseenter="showSymbolJumpList(assetItem.coinId, index)"
                      @mouseleave="leave()"
                    >
                      <!--交易-->
                      {{ $t('M.comm_deal') }}
                      <div
                        class="type-transaction border-radius4"
                        v-if="(currencyTradingList.length || OTCCenterHasCurrentCoin) && tradingState && index === current"
                      >
                        <!--小三角-->
                        <span
                          class="triangle-border display-inline-block"
                          v-show="currencyTradingList.length || OTCCenterHasCurrentCoin"
                        >
                        </span>
                        <p
                          class="transaction-list text-align-c"
                          v-show="OTCCenterHasCurrentCoin"
                          @click="jumpToOTCCenter(assetItem.coinId)"
                        >
                          <!-- otc 交易-->
                          {{$t('M.comm_otc_center')}}
                          <!--个人资产跳转OTC 增加了上面两个OTCCenterHasCurrentCoin显示-->
                        </p>
                        <p
                          class="transaction-list text-align-c"
                          v-for="(item, index) in currencyTradingList"
                          :key="index"
                          @click.prevent="changeActiveSymbol(item, index)"
                        >
                          {{ item.name }}
                        </p>
                      </div>
                      <div v-else></div>
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
                        v-if="withdrawDepositMap.get(assetItem.coinId).rechargeIsShow"
                        :isShow="withdrawDepositMap.get(assetItem.coinId).rechargeIsShow"
                        :currencyName="currencyName"
                        :minRechargeAmount="minRechargeAmount"
                        :successCount="successCount"
                        :coinId="assetItem.coinId"
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
                        :isShow="withdrawDepositMap.get(assetItem.coinId).withdrawDepositIsShow"
                        :isNeedTag="isNeedTag"
                        :withdrawRemark="withdrawRemark"
                        :currencyName="currencyName"
                        :originalActiveWithdrawDepositAddress="originalActiveWithdrawDepositAddress"
                        :withdrawAddressList="withdrawAddressList"
                        :feeRangeOfWithdraw="feeRangeOfWithdraw"
                        :index="assetItem.coinId"
                        :accountCount="accountCount"
                        :pointLengthAccountCount="pointLengthAccountCount"
                        :ref="`withdrawItemRef${assetItem.coinId}`"
                        :coinId="assetItem.coinId"
                        :total="assetItem.total"
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
                  <!--交易密码-->
                  <el-form-item
                    :label="$t('M.comm_password')"
                  >
                    <input
                      type="password"
                      autocomplete= "new-password"
                      class="content-input input-google padding-l15 box-sizing"
                      v-model="password"
                      @focus="emptyStatus"
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
                    @click.prevent="submitMentionMoney()"
                  >
                    <!--确 定-->
                    {{ $t('M.comm_confirm') }}
                  </el-button>
                  <span
                    class="font-size12 tops-password tops-verify cursor-pointer"
                    @click.prevent="payPasswordState"
                  >
                    {{ $t('M.user_payPassword') }}
                  </span>
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
    </div>
    <!--未实名认证前弹框提示-->
    <div class="warning">
      <el-dialog
        :visible.sync="notVerifyDialogVisible"
        center
      >
        <div class="dialog-warning">
          <div class="dialog-warning-box">
            <IconFontCommon
              class="font-size60"
              iconName="icon-gantanhao"
            />
          </div>
        </div>
        <p class="font-size12 warning-text margin-top35 text-align-c">
          <!--请先完成实名认证，再进行提币操作！-->
          <span v-show="!(this.realNameAuth === 'y')">
            {{ $t('M.user_asset_title15') }}
          </span>
          <!--请先完成高级认证，再进行提币操作！-->
          <span v-show="this.realNameAuth === 'y' && !(this.advancedAuth === 'pass')">
            {{ $t('M.user_asset_title16') }}
          </span>
        </p>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <!--确 定 取 消-->
        <button
          class="button-color border-radius4 cursor-pointer"
          type="primary"
          @click="realNameAuthConfirm"
        >
          <!--确 定-->
          {{ $t('M.comm_confirm') }}
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="notVerifyDialogVisible = false"
        >
          <!--取 消-->
          {{ $t('M.comm_cancel') }}
        </button>
        </span>
      </el-dialog>
    </div>
    <!--未实名认证前弹框提示-->
    <div class="warning">
      <el-dialog
        :visible.sync="notVerifyDialogVisible"
        center
      >
        <div class="dialog-warning">
          <div class="dialog-warning-box">
            <IconFontCommon
              class="font-size60"
              iconName="icon-gantanhao"
            />
          </div>
        </div>
        <p class="font-size12 warning-text margin-top35 text-align-c">
          <!--请先完成实名认证，再进行提币操作！-->
          <span v-show="!(this.realNameAuth === 'y')">
            {{ $t('M.user_asset_title15') }}
          </span>
          <!--请先完成高级认证，再进行提币操作！-->
          <span v-show="this.realNameAuth === 'y' && !(this.advancedAuth === 'pass')">
            {{ $t('M.user_asset_title16') }}
          </span>
        </p>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <!--确 定 取 消-->
        <button
          class="button-color border-radius4 cursor-pointer"
          type="primary"
          @click="realNameAuthConfirm"
        >
          <!--确 定-->
          {{ $t('M.comm_confirm') }}
        </button>
        <button
          class="btn border-radius4 cursor-pointer"
          @click.prevent="notVerifyDialogVisible = false"
        >
          <!--取 消-->
          {{ $t('M.comm_cancel') }}
        </button>
        </span>
      </el-dialog>
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
  amendPrecision,
  setStore
} from '../../../utils'
import {
  assetCurrenciesList,
  inquireRechargeAddressList,
  statusSubmitWithdrawButton,
  withdrawalInformation,
  queryTransactionInformation,
  inquireWithdrawalAddressId,
  checkCurrencyAddress,
  currencyTransform,
  getCoinRechargeWithdraw
} from '../../../utils/api/personal'
// 个人资产跳转OTC
import {
  getOTCAvailableCurrency
} from '../../../utils/api/OTC'
import {
  // returnAjaxMsg,
  sendPhoneOrEmailCodeAjax,
  getSecurityCenter,
  getNestedData
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState,
  mapActions
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
      notVerifyDialogVisible: false, // 实名/高级认证弹窗显示与隐藏
      errorMessage: '', // 提币验证错误提示
      isShowAllCurrency: true, // 隐藏币种// 显示所有/余额切换，
      closePictureSrc: require('../../../assets/user/wrong.png'), // 显示部分
      openPictureSrc: require('../../../assets/user/yes.png'), // 全显示
      searchKeyWord: '', // 搜索关键字
      blueStyleFrozen: 0, // 排序冻结默认样式
      blueStyleTotal: 0, // 排序可用默认样式
      blueStyleValue: 0, // 排序估值默认样式
      CNYRate: '', // 转换汇率
      withdrawDepositList: [], // 我的资产全部币种列表
      withdrawDepositMap: new Map(),
      chargeMoneyAddress: '', // 根据充币地址生成二维码条件
      withdrawalFee: '', // 自定义提币手续费
      feeRangeOfWithdraw: {}, // 提币手续费范围
      withdrawCount: '', // 提币数量
      accountCount: '', // 自定义到账数量
      tradingState: false, // 跳转交易对默认不显示
      current: 0, // 交易对当前状态
      dialogVisible: false, // 新用户未设置交易密码提示框默认false
      currencyTradingList: [], // 根据coinId查询交易对信息
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      // 充值
      chargeDialogVisible: false, // 默认隐藏充值框
      currentState: 'not_all', // 当前显示状态
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
      isRechargeState: true, // 是否允许充币(作用于前后台同时进行充币或者禁用)
      isWithdraw: '', // 是否允许提币
      isWithdrawState: true, // 是否允许提币(作用于前后台同时进行充币或者禁用)
      currencyTradingId: '', // 根据Id跳转到对应交易信息
      id: '', // 币种ID
      sellName: '', // 币种名称
      sellsymbol: '', // 交易对名称
      isNeedTag: false, // 是否需要转账提示标签
      rechargeNoteInfo: '', // 充币地址备注信息
      localLoading: true, // 页面列表局部loading
      isLegalWithdrawAddress: true, // 是否为合法提币地址
      minRechargeAmount: '', // 最小提币数量
      successCount: '', // 确认次数
      currentIndex: '', // 提币清空数据当前索引
      end: '', // 占位
      // 个人资产跳转OTC
      // 当前币种是否含有OTC交易
      OTCCenterHasCurrentCoin: false,
      OTCCoinList: [], // OTC可用币种列表
      // 我的资产
      withdrawStorageMap: new Map(),
      withdrawStorage: []
    }
  },
  async created () {
    console.log(this.$route.params.type, this.$route.params.coinId)
    // 刚进页面时候 个人资产列表展示
    if (this.currencyRateList.CNY) {
      // 汇率转换
      await this.currencyTransform()
    }
    // 个人资产跳转OTC-otc可用币种查询
    await this.getOTCAvailableCurrencyList()
  },
  async mounted () {
    await this.getAssetCurrenciesList()
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_JUMP_STATUS',
      'SET_JUMP_SYMBOL',
      'CHANGE_ACTIVE_TRADE_AREA',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'SET_NEW_WITHDRAW_ADDRESS',
      'SET_NEW_WITHDRAW_RECORD',
      'SET_NEW_WITHDRAW_RECORD_STATUS',
      'CHANGE_PASSWORD_USEABLE'
    ]),
    // 点击跳转到重置交易密码
    payPasswordState () {
      this.$goToPage('/TransactionPassword')
    },
    // 1.0 汇率折算以及根据header切换显示对应资产换算
    async currencyTransform () {
      const params = {
        coinName: 'FBT',
        shortName: this.activeConvertCurrencyObj.shortName
      }
      const data = await currencyTransform(params)
      // console.log(data)
      if (!data) return false
      // console.log(data)
      // 获取汇率
      this.CNYRate = getNestedData(data, 'data.coinPrice')
    },
    // 切换当前显示币种 状态（全部币种 币种为零隐藏）Toggle current currency status
    statusOpenToCloseCurrency (e) {
      this.isShowAllCurrency = e == 'not_all' ? true : false
    },
    // 2.0资产估值升序降序
    assetsSorting (type, val) {
      // type 冻结(frozen) 可用(total) 资产估值(btcValue)
      // val 升序(order) 降序(invertedOrder)
      switch (type) {
        case 'up':
          this.blueStyleFrozen = 1
          this.blueStyleTotal = 0
          this.blueStyleTotal = 0
          if (val == 'frozen') {
            this.blueStyleFrozen = 1
            this.blueStyleTotal = 0
            this.blueStyleTotal = 0
          } else if (val == 'total') {
            this.blueStyleTotal = 1
            this.blueStyleFrozen = 0
            this.blueStyleValue = 0
          } else {
            this.blueStyleValue = 1
            this.blueStyleTotal = 0
            this.blueStyleFrozen = 0
          }
          this.withdrawDepositList.sort((a, b) => b[val] - a[val])
          break
        case 'down':
          if (val == 'frozen') {
            this.blueStyleFrozen = 2
            this.blueStyleTotal = 0
            this.blueStyleTotal = 0
          } else if (val == 'total') {
            this.blueStyleTotal = 2
            this.blueStyleFrozen = 0
            this.blueStyleValue = 0
          } else {
            this.blueStyleValue = 2
            this.blueStyleTotal = 0
            this.blueStyleFrozen = 0
          }
          this.withdrawDepositList.sort((a, b) => a[val] - b[val])
          break
      }
    },

    // 3.0跳转当前交易对
    changeActiveSymbol (e) {
      console.log(e)
      this.SET_JUMP_STATUS(true)
      // 设置当前交易区
      const id = (e.sellCoinName + e.buyCoinName).toLowerCase()
      console.log(id)
      this.CHANGE_ACTIVE_TRADE_AREA({
        id
      })
      this.$goToPage(`/TradeCenter/${id}`)
    },
    // 4.0修改input value 输入限制
    changeInputValue ({ref, index, pointLengthAccountCount, val, coinId, total}) {
      console.log(coinId, total)
      console.log(this.$refs[`withdrawItemRef${index}`][0])
      // 限制数量小数位位数
      let target = this.$refs[`withdrawItemRef${index}`][0].$refs[ref]
      formatNumberInput(target, pointLengthAccountCount)
      let targetCount = amendPrecision(
        this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value,
        this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value,
        '-'
      )
      if (targetCount > 0) {
        if (targetCount < total - 0) {
          this.accountCount = targetCount + ''
        } else {
          this.accountCount = total
        }
      } else {
        this.accountCount = '0'
      }
      // 判断是输入时还是手续费 判断错误提示
      if (val === 'rechargeType') {
      } else if (val === 'serviceType') {
        // 获取输入手续费
        this.withdrawFeeVModel = this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value
      }
    },
    // 4.01失去焦点判断输入提币数量不能大于可用量 否则显示总可用量
    checkUserInputAvailable (data) {
      let {index, total} = data
      // 获取ref中input值
      this.withdrawCountVModel = this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value
      if (this.withdrawCountVModel - 0 > total - 0) {
        this.$refs[`withdrawItemRef${index}`][0].$refs.countInputRef.value = total - 0
        this.withdrawCountVModel = total - 0
      }
      let targetCount = amendPrecision(this.withdrawCountVModel, this.$refs[`withdrawItemRef${index}`][0].$refs.feeInputRef.value, '-')
      this.accountCount = targetCount > 0 ? targetCount : 0
    },
    // 充提币校验是否禁用
    async isRechargeWithdrawState (id) {
      let data
      let params = {
        coinId: id// 列表id
      }
      data = await getCoinRechargeWithdraw(params)
      if (!data) return false
      console.log(data)
      // 是否允许充币
      this.isRechargeState = getNestedData(data.data, 'isRecharge')
      // 是否允许提币
      this.isWithdrawState = getNestedData(data.data, 'isWithdraw')
      // 点击提币展示框中的提币按钮判断，当前币种是否在后台管理禁用
      // 判断如果并且币种禁用并且则关闭提币弹框并提示暂停提币
      let item = this.withdrawDepositMap.get(id)
      if (!this.isWithdrawState) {
        this.withdrawDepositMap.set(id, {...item, withdrawDepositIsShow: false})
      }
      // 判断充提类型和coinId是否存在，并且等于当前id，如果存在并且等于进行下一步
      // 在判断当前币种是否允许充提 允许不执行，不允许关闭窗口不提示
      if (this.$route.params.coinId === id && this.$route.params.type) {
        switch (this.$route.params.type) {
          case 'recharge':
            if (!this.isRechargeState) {
              this.withdrawDepositMap.set(id, {...item, rechargeIsShow: false})
            }
            break
          case 'withdraw':
            if (!this.isWithdrawState) {
              this.withdrawDepositMap.set(id, {...item, withdrawDepositIsShow: false})
            }
            break
        }
      }
      console.log(this.isRechargeState, this.isWithdrawState)
    },
    // 5.0点击充币按钮显示充币内容（带回币种id 币种名称 当前index）
    async showRechargeBox (id, name) {
      // console.log(id)
      // 校验是否充币
      await this.isRechargeWithdrawState(id)
      if (!this.isRechargeState) {
        // 充值暂停，钱包维护中
        this.$message({
          message: this.$t('M.user_assets_suspended'),
          type: 'error'
        })
        return false
      }
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
      this.withdrawDepositMap.forEach((val, key) => {
        console.log(val, key)
        this.withdrawDepositMap.set(key, {
          rechargeIsShow: false,
          withdrawDepositIsShow: false,
          provideWithdrawDepositIsShow: false
        })
      })
      let item = this.withdrawDepositMap.get(id)
      if (!item.rechargeIsShow) {
        this.withdrawDepositMap.set(id, {...item, rechargeIsShow: true})
      } else {
        if (this.isNeedTag) {
          this.withdrawDepositMap.set(id, {...item, withdrawDepositIsShow: false})
        } else {
          this.withdrawDepositMap.set(id, {...item, provideWithdrawDepositIsShow: false})
        }
      }
      this.fillingCurrencyAddress()
    },
    // 5.01重置提现表单内容
    resetWithdrawFormContent (id) {
      this.currentIndex = id
      // console.log(this.$refs[`withdrawItemRef${id}`][0])
      this.$refs[`withdrawItemRef${id}`][0].$refs.countInputRef.value = ''
      // 到账数量
      this.accountCount = ''
      // 提币地址
      this.activeWithdrawDepositAddress = ''
      // 地址标签备注
      this.withdrawRemark = ''
    },
    // 实名认证验证
    realNameAuthConfirm () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
      this.$goToPage('/PersonalCenter')
      this.notVerifyDialogVisible = false
    },
    // 6.0点击提现按钮显示提币内容（带回币种id 币种名称）
    async changeWithdrawBoxByCoin (id, name) {
      // console.log(id, name)
      if (!(this.realNameAuth === 'y')) {
        this.notVerifyDialogVisible = true
        return false
      }
      if (!(this.advancedAuth === 'pass')) {
        this.notVerifyDialogVisible = true
        return false
      }
      // console.log(this.userInfo)
      // console.log(this.coinStatus)
      if (this.coinStatus == 'disable') {
        // 该账号已被禁止提币，请咨询客服
        this.$message({
          type: 'error',
          message: this.$t('M.recharge_withdraw_failure_0041')
        })
        return
      }
      // 提币数量
      this.resetWithdrawFormContent(id)
      // 当前币种id
      this.activeCoinId = id
      this.currencyName = name

      // 每行数据币种名
      // 隐藏验证弹窗
      this.isShowWithdrawDialog = false
      // 循环列表 隐藏充值或提现框
      this.withdrawDepositMap.forEach((val, key) => {
        console.log(val, key)
        this.withdrawDepositMap.set(key, {
          rechargeIsShow: false,
          withdrawDepositIsShow: false,
          provideWithdrawDepositIsShow: false
        })
      })
      let item = this.withdrawDepositMap.get(id)
      this.withdrawDepositMap.set(id, {...item, withdrawDepositIsShow: true})
      this.$forceUpdate()
      await this.queryWithdrawalAddressList()
      await this.getWithdrawalInformation(id)
      this.getSecurityCenter()
    },
    // 6.10显示交易对跳转币种信息
    showSymbolJumpList (id, index) {
      this.currencyTradingId = id
      // 个人资产跳转OTC-改写开始
      console.log(id)
      this.OTCCenterHasCurrentCoin = _.some(this.OTCCoinList, ['coinId', this.currencyTradingId])
      // 个人资产跳转OTC-改写结束
      this.tradingState = true
      this.current = index
      this.getQueryTransactionInformation()
    },
    leave () {
      this.tradingState = false
      this.current = null
      // 个人资产跳转OTC
      this.OTCCenterHasCurrentCoin = false
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMessage = ''
    },
    // 7.0发送验证码
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
    /**
     * 8.0刚进页面时候 个人资产列表展示
     */
    async getAssetCurrenciesList () {
      let params = {
        pageNum: this.currentPageForMyEntrust,
        pageSize: '10000'
      }
      this.localLoading = true
      let data = await assetCurrenciesList(params)
      // 接口失败清除loading
      this.localLoading = false
      if (!data) return false
      this.withdrawDepositList.push({
        allIsShow: false,
        rechargeIsShow: false,
        withdrawDepositIsShow: false,
        provideWithdrawDepositIsShow: false
      })
      // 返回数据
      let detailData = getNestedData(data, 'data')
      this.totalSumBTC = detailData.totalSum
      this.withdrawDepositList = getNestedData(detailData, 'userCoinWalletVOPageInfo.list')
      _.forEach(this.withdrawDepositList, (item, index) => {
        this.withdrawStorageMap.set(item.coinId, item)
        this.withdrawDepositMap.set(item.coinId, {
          allIsShow: false,
          rechargeIsShow: false,
          withdrawDepositIsShow: false,
          provideWithdrawDepositIsShow: false
        })
        // 币币带回充提类型
        let typeName = this.$route.params.type
        // 币币带回币种id
        let coinId = this.$route.params.coinId
        // 从币币交易页面跳到我的资产带回参数，有充币 提现
        if (coinId === item.coinId && typeName) {
          this.isRechargeWithdrawState(coinId)
          console.log(this.isRechargeState, this.isWithdrawState)
          if (typeName === 'recharge') {
            // 类型为充币在展开充币界面
            this.withdrawDepositMap.set(item.coinId, {...item, rechargeIsShow: true})
            this.fillingCurrencyAddress(coinId)
          } else {
            // 类型为提现在展开提现界面
            this.withdrawDepositMap.set(item.coinId, {...item, withdrawDepositIsShow: true})
            this.getWithdrawalInformation('', coinId)
          }
          // 跳转到对应位置 滚动类型
          this.$nextTick(() => {
            // document.documentElement.scrollTop = (index - 1) * 50 + 347
            window.scroll({
              top: (index - 1) * 50 + 347,
              behavior: 'smooth'
            })
          })
        }
      })
      this.getAllWithdraw()
    },
    getAllWithdraw () {
      // 缓存币种列表
      setStore('withdrawStorage', this.withdrawDepositList)
      // 获取币种列表
      // console.log(this.withdrawDepositMap.set(key))
      console.log(this.withdrawStorageMap.key)
    },
    // 9.0根据币种id查询提币地址
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
      this.activeWithdrawDepositAddress = getNestedData(withdrawalAddressData, 'userWithdrawAddressListVO.userWithdrawAddressDtoList[0].address') || ''
    },
    // select框自定义提币地址校验地址
    // 10 新增用户提币地址校验
    async checkCurrencyAddress () {
      let param = {
        coinId: this.activeCoinId, // 币种coinId
        address: this.activeWithdrawDepositAddress
      }
      let data = await checkCurrencyAddress(param)
      this.isLegalWithdrawAddress = false
      if (!data) return false
      this.isLegalWithdrawAddress = true
      // 验证通过调用验证方式接口
      this.getSecurityCenter()
    },
    /**
     *  11.点击提币按钮时 获取提币信息（最大最小手续费）
     */
    async getWithdrawalInformation (id, coinId) {
      let data = await withdrawalInformation({
        coinId: coinId ? coinId : this.activeCoinId
      })
      console.log(data)
      if (!data) return false
      // 返回列表数据
      this.feeRangeOfWithdraw = getNestedData(data, 'data')
      this.withdrawalFee = getNestedData(data, 'data.minFees')
      if (id) {
        this.$refs[`withdrawItemRef${id}`][0].$refs.feeInputRef.value = this.withdrawalFee
      }
      this.withdrawFeeVModel = this.withdrawalFee
    },
    /**
     *  12.点击充币按钮时 查询充币地址查询
     */
    async fillingCurrencyAddress (id) {
      let data = await inquireRechargeAddressList({
        coinId: id ? id : this.chargeMoneyAddressId
      })
      if (!data) return false
      // 获取充币地址
      this.chargeMoneyAddress = getNestedData(data, 'data.userRechargeAddress.address')
      // 获取币种类型 true公信宝类 false普通币种
      this.isNeedTag = getNestedData(data, 'data.userRechargeAddress.needTag')
      // 获取充值备注信息 rechargeNoteInfo
      this.rechargeNoteInfo = getNestedData(data, 'data.userRechargeAddress.tag')
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
     * 13.点击提币按钮 验证
     * */
    async validateOfWithdraw (id) {
      console.log(id)
      this.phoneCode = '' // 短信验证码
      this.emailCode = '' // 邮箱验证码
      this.googleCode = '' // 谷歌验证码
      this.password = '' // 交易密码
      this.isShowWithdrawDialog = false
      // console.log(index)
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
      // console.log(this.accountCount)
      if (this.withdrawFeeVModel - this.feeRangeOfWithdraw.minFees < 0) {
        // 判断输入手续费小于最小提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint5'),
          type: 'error'
        })
        return false
      } else if (this.withdrawFeeVModel - this.feeRangeOfWithdraw.maxFees > 0) {
        // // 判断输入手续费大于于最大提现手续费
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint6'),
          type: 'error'
        })
        return false
      }
      // console.log(this.withdrawFeeVModel, this.feeRangeOfWithdraw)
      if (this.withdrawCountVModel - this.feeRangeOfWithdraw.maxWithdraw > 0) {
        // 大于最大限额
        this.$message({
          message: this.$t('M.user_assets_withdrawal_hint8'),
          type: 'error'
        })
        return false
      } else if (this.withdrawCountVModel - this.feeRangeOfWithdraw.minWithdraw < 0) {
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
      // console.log(this.isWithdrawState)
      // 校验是否提币
      await this.isRechargeWithdrawState(id.coinId)
      if (!this.userInfo.userInfo.payPassword) {
        this.dialogVisible = true
      } else if (!this.isWithdrawState) {
        // 暂停提币
        this.$message({
          message: this.$t('M.user_assets_pause_mention'),
          type: 'error'
        })
        return false
      } else {
        await this.REFRESH_USER_INFO_ACTION()
        let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
        this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
        if (this.isLockedPayPassword) return false
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
      } else if (this.password == '') {
        this.errorMessage = this.$t('M.comm_please_enter') + this.$t('M.comm_password')
      } else {
        this.errorMessage = ''
        this.stateSubmitAssets()
      }
    },
    // 14.提交提币接口
    async stateSubmitAssets () {
      let data
      let params = {
        // msgCode: this.phoneCode, // 短信验证码
        // emailCode: this.emailCode, // 邮箱验证码
        // googleCode: this.googleCode, // 谷歌验证码
        coinId: this.activeCoinId, // 币种ID
        withdrawAddress: this.activeWithdrawDepositAddress,
        remark: this.withdrawRemark, // 提币地址
        networkFees: this.withdrawFeeVModel, // 手续费
        amount: this.withdrawCountVModel, // 提币数量
        payCode: this.password // 交易密码
      }
      const {isPhoneEnable, isMailEnable, isGoogleEnable} = this.securityCenter
      if (isPhoneEnable) params.msgCode = this.phoneCode
      if (isMailEnable) params.emailCode = this.emailCode
      if (isGoogleEnable) params.googleCode = this.googleCode
      data = await statusSubmitWithdrawButton(params)
      console.log(data)
      this.isShowWithdrawDialog = false
      if (!data) return false
      // 判断是否交易密码锁定
      // 提币地址列表查询
      this.getAssetCurrenciesList()
      this.resetWithdrawFormContent(this.currentIndex)
      this.stateEmptyData()
    },
    // 接口请求完成之后普通币种清空数据
    stateEmptyData () {
      this.phoneCode = '' // 短信验证码
      this.emailCode = '' // 邮箱验证码
      this.googleCode = '' // 谷歌验证码
      this.password = '' // 交易密码
      this.accountCount = ''
      this.activeWithdrawDepositAddress = ''
    },
    // 15.跳转到账单明细参数传递
    jumpToOtherTab ({target, coinId, index}) {
      this.CHANGE_USER_CENTER_ACTIVE_NAME(target)
      // 判断点击的类型1 充值 2 提币
      if (index == 1) {
        this.SET_NEW_WITHDRAW_RECORD_STATUS('RECHARGE')
      } else {
        this.SET_NEW_WITHDRAW_RECORD_STATUS('WITHDRAW')
      }
      // 指定要跳转到的coinId
      console.log(coinId, this.activeCoinId)
      if (coinId) {
        this.SET_NEW_WITHDRAW_ADDRESS(coinId)
      }
      // 指定跳转的币种Id
      this.SET_NEW_WITHDRAW_RECORD(coinId)
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
     * 16.根据coinid查询交易信息
     */
    async getQueryTransactionInformation () {
      let data = await queryTransactionInformation({
        coinId: this.currencyTradingId // 币种coinId
      })
      console.log(data)
      if (!data) return false
      this.currencyTradingList = getNestedData(data, 'data.entrust') || []
      console.log(data.data)
    },
    // 个人资产跳转OTC
    jumpToOTCCenter (coinId) {
      console.log(coinId)
      this.$router.push({
        path: '/OTCCenter',
        name: 'OTCCenter',
        params: {coinId: coinId}
      })
    },
    // otc可用币种查询
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency()
      if (!data) return false
      this.OTCCoinList = getNestedData(data, 'data') ? getNestedData(data, 'data') : []
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      loginStep1Info: state => state.user.loginStep1Info,
      uid: state => state.user.loginStep1Info.userInfo.showId,
      activeSymbol: state => state.common.activeSymbol, // 当前选中交易对
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn,
      userCenterActiveName: state => state.personal.userCenterActiveName,
      // 是否允许提币
      coinStatus: state => state.user.loginStep1Info.userInfo.coinStatus,
      // 是否通过高级认证
      advancedAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.advancedAuth'),
      // 实名认证
      realNameAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.realNameAuth'),
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
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
    },
    filteredData: function () {
      return this.withdrawDepositList.filter((item) => {
        return item['coinName'].toLowerCase().indexOf(this.searchKeyWord.toLowerCase()) !== -1
      })
    },
    // 筛选币种为小于零的币种
    filteredData1: function () {
      return this.filteredData.filter(function (item) {
        return item
      })
    },
    // 开启关闭币种小于零的币种 总数量和锁仓
    filteredData2: function () {
      return this.filteredData.filter(function (item) {
        console.log(item.sum, item.wareHouse, item)
        return item.sum > 0 || item.wareHouse > 0
      })
    }
  },
  watch: {
    async activeConvertCurrencyObj () {
      if (this.currencyRateList.CNY) {
        // 汇率转换
        await this.currencyTransform()
      }
      console.log(this.activeConvertCurrencyObj)
    },
    currencyRateList () {
      console.log(this.currencyRateList)
    },
    filteredData1 () {
      console.log(this.filteredData1)
    },
    filteredData2 () {
      console.log(this.filteredData2)
    },
    userCenterActiveName (newVal) {
      console.log(newVal)
      if (newVal === 'assets') {
        console.log(newVal)
        this.getAssetCurrenciesList()
      }
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
        margin-bottom: 50px;

        .account-assets-header {
          > .header-flex {
            position: relative;
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

              .tops-verify {
                color: #3e79d6;
              }

              .tops-password {
                float: right;
                display: inline-block;
                line-height: 30px;
              }

              .title-width {
                width: 150px;
              }

              .title-position {
                .icon-caret {
                  position: relative;
                  right: 0;
                  float: left;
                }
              }

              .padding-l7 {
                padding-left: 4px;
              }

              .title-width1 {
                width: 200px;
              }

              .title-width-last {
                padding-right: 10px;
                margin-right: 10px;
              }

              .title-width-la {
                margin-left: 7px;
              }

              .title-width-header {
                width: 140px;
              }

              .error-info {
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
              }

              .active {
                color: #3e79d6;
              }

              .icon-caret,
              .icon-caret-order {
                position: relative;
                right: 0;
                float: right;

                .caret-text {
                  position: absolute;
                  top: 23px;
                  left: 5px;
                }

                .caret-text-order {
                  position: absolute;
                  top: 15px;
                  left: 5px;
                }
              }

              .icon-caret-order {
                position: relative;
                right: 0;
                float: left;
              }

              > .table-tr {
                > .table-box {
                  width: 100%;

                  > .out-box {
                    > .recharge-list {
                      position: relative;
                      z-index: 2;
                      padding: 20px 6px;

                      > .triangle-one {
                        right: 65px;
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
                            min-width: 90px;
                            height: 32px;
                            padding: 0 5px;
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
                              height: 34px;
                              padding: 0 5px;
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
                          top: -15px;
                          padding: 15px 0 0 15px;

                          &.need-tag-top {
                            top: -45px;
                          }

                          > .currency-rule,
                          > .prompt-message {
                            line-height: 25px;
                          }

                          > .mention-button {
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
                top: 3px;
                right: 2px;
                width: 96px;
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
            left: 65px;
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

        .trade-width {
          width: 60px !important;
        }
      }
    }

    > .warning {
      .dialog-warning {
        width: 90px;
        height: 90px;
        padding-top: 6px;
        margin: 0 auto;
        border-radius: 50%;
        background: rgba(42, 122, 211, .2);

        .dialog-warning-box {
          width: 78px;
          height: 78px;
          margin: 0 auto;
          border-radius: 50%;
          line-height: 75px;
          text-align: center;
          background: linear-gradient(90deg, #2b396e, #2a5082);
        }
      }

      .warning-text {
        color: #fff;
      }

      .button-color {
        width: 80px;
        height: 35px;
        margin-right: 15px;
        border: 0;
        line-height: 0;
      }

      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    /deep/ {
      .el-dialog__headerbtn {
        top: 11px;
      }

      .warning {
        .el-dialog {
          width: 350px;
          border-radius: 5px;
        }

        .el-dialog__footer {
          margin-top: 20px;
          text-align: center;
        }
      }

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

      .header-right-right .el-select .el-input--suffix .el-input__inner {
        width: 150px;
        height: 30px;
      }

      .el-select-dropdown__empty {
        padding: 5px 0;
      }

      .el-input__icon {
        display: none;
      }

      .el-dialog {
        width: 325px;
      }

      .el-dialog__header {
        height: 40px;
        padding: 5px 20px;
        border-radius: 5px 5px 0 0;
        line-height: 30px;
      }

      .el-dialog__body {
        padding: 25px 27px 0;
        line-height: 25px;
      }

      .el-form-item {
        height: 70px;
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
        padding: 0 27px 40px;
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

      .button-color {
        color: rgba(255, 255, 255, .7);
        background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
      }

      .btn {
        border: 1px solid #338ff5;
        color: #fff;
        background-color: transparent;
      }

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

      .warning-text {
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
                .recharge-list {
                  border: 1px solid #338ff5;
                  background: #fff;

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
