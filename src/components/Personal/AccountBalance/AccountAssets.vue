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
            v-loading="loading"
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
                  {{ $t('M.comm_total_sum') }}{{ $t('M.comm_count') }}
                </div>
                <!--冻结数量-->
                <div
                  class="flex1"
                >
                  {{ $t('M.comm_freeze') }}{{ $t('M.comm_count') }}
                </div>
                <!--可用数量-->
                <div
                  class="flex1"
                >
                  {{ $t('M.comm_usable') }}{{ $t('M.comm_count') }}
                </div>
                <!--资产估值(BTC)-->
                <div
                  class="flex1 flex-asset"
                >
                  {{ $t('M.user_asset_valuation') }}(BTC)
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
                        v-show="seen&&index==current"
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
                    <!--充币内容-->
                    <div
                      v-show="withdrawDepositList[index].rechargeIsShow"
                      class="recharge-list display-flex"
                    >
                      <p class="triangle"></p>
                      <div class='recharge-content'>
                        <p class="recharge-content-hint font-size12">
                          <span>{{ chargeMoneyName }}</span>
                          <!--充值地址-->
                          {{ $t('M.comm_charge_recharge') }}
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
                            <!--复制地址-->
                            {{ $t('M.comm_copy') }}{{ $t('M.comm_site') }}
                          </span>
                        </div>
                        <div class="recharge-content-title font-size12 margin-top9 float-left">
                          <!--转账时请务必备注（否则后果自负）：UID-->
                          <!--<p>* {{ $t('M.user_assets_recharge_hint0').format([chargeMoneyName,chargeMoneyName]) }}</p>-->
                          <!--禁止充值除 之外的其他资产，任何非 资产充值将不可找回-->
                          <p>* {{ $t('M.user_assets_recharge_hint1').format([chargeMoneyName]) }}</p>
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
                            :value="chargeMoney"
                            :options="{ size: 100 }"
                          >
                          </VueQrcode>
                        </p>
                        <p
                          class="code-list text-align-r float-right cursor-pointer font-size12"
                          @click.prevent="stateRechargeRecord"
                        >
                          <!--充值记录-->
                          {{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_record') }}
                        </p>
                      </div>
                    </div>
                    <!--提币内容-->
                    <!--普通币种提币显示框-->
                    <div
                      v-if="!needTag"
                      class="recharge-list recharge-list-mention display-flex"
                      v-show="withdrawDepositList[index].withdrawDepositIsShow"
                    >
                      <p class="triangle triangle-one"></p>
                      <div class="recharge-list-left display-flex">
                        <div class="list-left-flex flex1 font-size12">
                          <div class="flex-box padding-top10">
                            <p class="left-flex-hint">
                              {{ chargeMoneyName }}
                              <!--提币地址-->
                              {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
                            </p>
                            <el-select
                              v-model="mentionAddressValue"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="changeId"
                              filterable
                              allow-create
                              default-first-option
                            >
                              <el-option
                                v-for="(item, index) in mentionAddressList"
                                :key="index"
                                :label="item.address + ' ' + item.remark"
                                :value="item.id"
                              >
                              </el-option>
                            </el-select>
                            <span
                              class="new-address cursor-pointer address-bg"
                              @click.prevent="stateMentionAddress"
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
                              ref="serviceCharge"
                              @keyup="changeInputValue('serviceCharge', index, pointLength, 'serviceType')"
                              @input="changeInputValue('serviceCharge', index, pointLength, 'serviceType')"
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
                            <p class="content-flex-hint">
                              <!--数量-->
                              {{ $t('M.comm_count') }}
                            </p>
                            <input
                              type="text"
                              class="count-flex-input border-radius2 paddinglr15 box-sizing text-align-r"
                              ref="rechargeCount"
                              @keyup="changeInputValue('rechargeCount', index, pointLength, 'rechargeType')"
                              @input="changeInputValue('rechargeCount', index, pointLength, 'rechargeType')"
                            >
                            <p class="count-flex-text text-align-r">
                              <span>
                                <!--限额：-->
                                {{ $t('M.comm_limit') }}：
                              </span>
                              <span>
                                {{serviceChargeList.minWithdraw}}
                                -
                                {{serviceChargeList.maxWithdraw}}
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
                              v-model="serviceChargeCount"
                            >
                          </div>
                        </div>
                      </div>
                      <div class="text-info flex1 font-size12">
                        <!--提现费率规则：-->
                        <p class="currency-rule">
                          <span>{{ chargeMoneyName }}</span>
                          {{ $t('M.user_assets_withdrawal_hint1') }}：
                        </p>
                        <!--为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；-->
                        <p class="prompt-message">
                          * {{ $t('M.user_assets_withdrawal_hint2') }}
                        </p>
                        <!--充值经过1个确认后，才允许提现；-->
                        <p class="prompt-message">
                          * <span>{{ chargeMoneyName }}</span>
                          {{ $t('M.user_assets_withdrawal_hint3') }}
                        </p>
                        <!--可提现金额≤账户可用资产-未确认的数字资产。-->
                        <p class="prompt-message">
                          * {{ $t('M.user_assets_withdrawal_hint4') }}
                        </p>
                        <p class="mention-button">
                          <button
                            class="font-size12 submit-but border-radius4 cursor-pointer"
                            @click.prevent="moneyConfirmState"
                          >
                            <!--提币-->
                            {{ $t('M.comm_mention_money') }}
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
                            <!--提币记录-->
                                {{ $t('M.comm_mention_money') }}{{ $t('M.comm_record') }}
                          </span>
                        </p>
                      </div>
                    </div>
                    <!--公信宝类币种提笔显示框-->
                    <div
                      v-else
                      class="recharge-list recharge-list-mention list-mention-treasure"
                      v-show="withdrawDepositList[index].provideWithdrawDepositIsShow"
                    >
                      <p class="triangle triangle-one"></p>
                      <div class="mention">
                        <p class="mention-treasure">
                          <!--地址标签-->
                          {{ $t('M.user_address_labels') }}
                          <!--（填写错误可能导致资产损失，请仔细核对）-->
                          <span class="treasure-info font-size12">({{ $t('M.user_address_labels_prompt') }})</span>
                        </p>
                        <input
                          type="text"
                          class="input-mention border-radius2 paddinglr15 box-sizing"
                          v-model="remark"
                        >
                      </div>
                      <div class="recharge-list-left display-flex">
                        <div class="list-left-flex flex1 font-size12">
                          <div class="flex-box padding-top10">
                            <p class="left-flex-hint">
                              {{ chargeMoneyName }}
                              <!--提币地址-->
                              {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
                            </p>
                            <el-select
                              v-model="mentionAddressValue"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="changeId"
                              filterable
                              allow-create
                              default-first-option
                            >
                              <el-option
                                v-for="(item, index) in mentionAddressList"
                                :key="index"
                                :label="item.address + ' ' + item.remark"
                                :value="item.id"
                              >
                              </el-option>
                            </el-select>
                            <span
                              class="new-address cursor-pointer address-bg"
                              @click.prevent="stateMentionAddress"
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
                              ref="serviceCharge"
                              @keyup="changeInputValue('serviceCharge', index, pointLength, 'serviceType')"
                              @input="changeInputValue('serviceCharge', index, pointLength, 'serviceType')"
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
                            <p class="content-flex-hint">
                              <!--数量-->
                              {{ $t('M.comm_count') }}
                            </p>
                            <input
                              type="text"
                              class="count-flex-input border-radius2 paddinglr15 box-sizing text-align-r"
                              ref="rechargeCount"
                              @keyup="changeInputValue('rechargeCount', index, pointLength, 'rechargeType')"
                              @input="changeInputValue('rechargeCount', index, pointLength, 'rechargeType')"
                            >
                            <p class="count-flex-text text-align-r">
                              <span>
                                <!--限额：-->
                                {{ $t('M.comm_limit') }}：
                              </span>
                              <span>
                                {{serviceChargeList.minWithdraw}}
                                -
                                {{serviceChargeList.maxWithdraw}}
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
                              v-model="serviceChargeCount"
                            >
                          </div>
                        </div>
                        <div class="text-info-mention flex1 font-size12">
                          <!--提现费率规则：-->
                          <p class="currency-rule">
                            <span>{{ chargeMoneyName }}</span>
                            {{ $t('M.user_assets_withdrawal_hint1') }}：
                          </p>
                          <!--为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；-->
                          <p class="prompt-message">
                            * {{ $t('M.user_assets_withdrawal_hint2') }}
                          </p>
                          <!--充值经过1个确认后，才允许提现；-->
                          <p class="prompt-message">
                            * <span>{{ chargeMoneyName }}</span>
                            {{ $t('M.user_assets_withdrawal_hint3') }}
                          </p>
                          <!--可提现金额≤账户可用资产-未确认的数字资产。-->
                          <p class="prompt-message">
                            * {{ $t('M.user_assets_withdrawal_hint4') }}
                          </p>
                          <p class="mention-button">
                            <button
                              class="font-size12 submit-but border-radius4 cursor-pointer"
                              @click.prevent="moneyConfirmState"
                            >
                              <!--提币-->
                              {{ $t('M.comm_mention_money') }}
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
                              <!--提币记录-->
                                {{ $t('M.comm_mention_money') }}{{ $t('M.comm_record') }}
                          </span>
                          </p>
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
                  <span v-show="errorMsg">
                    {{ errorMsg }}
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
  returnAjaxMessage,
  sendPhoneOrEmailCodeAjax,
  getSecurityCenter
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
      labelPosition: 'top', // form表单label方向
      errorMessage: '', // 提币input错误提示
      errorMsg: '', // 提币验证错误提示
      showStatusButton: true, // 显示币种
      hideStatusButton: false, // 隐藏币种// 显示所有/余额切换，
      closePictureSrc: require('../../../assets/user/wrong.png'), // 显示部分
      openPictureSrc: require('../../../assets/user/yes.png'), // 全显示
      searchKeyWord: '', // 搜索关键字
      withdrawDepositList: [], // 我的资产全部币种列表
      chargeMoney: '', // 根据充币地址生成二维码条件
      serviceCharge: '', // 自定义手续费
      serviceChargeList: {}, // 手续费区间
      rechargeCount: '', // 提币数量
      serviceChargeCount: '', // 自定义到账数量
      seen: false, // 跳转交易对默认不显示
      current: 0,
      dialogVisible: false, // 新用户未设置交易密码提示框默认false
      currencyTradingList: [], // 根据coinid查询交易对信息
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      // 充值
      chargeDialogVisible: false, // 默认隐藏充值框
      chargeMoneyAddressId: '', // 每行数据ID
      chargeMoneyName: '', // 每行数据币种名称
      // 提币
      securityCenter: {}, // 安全中心状态获取
      mentionDialogVisible: false, // 默认隐藏提币框
      mentionMoneyAddressId: '', // 每行数据ID
      mentionMoneyName: '', // 每行数据币种名称
      mentionAddressValue: '', // 每行数据提币地址
      statusAddressValue: '', // 每行数据提币地址
      remark: '', // 每行数据提币地址备注
      amount: '', // 数量
      service: '', // 手续费
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
      activeType: '', // 显示类型
      tradingOnId: '', // 根据coinido跳转到对应交易信息
      currencyTradingId: '', // 根据coinido跳转到对应交易信息
      needTag: '', // 区别是否为公信宝累的币种 true为
      area: '', // 交易区名称
      areaId: '', // 交易区id
      id: '', // 币种Id
      sellname: '', // 币种名称
      sellsymbol: '', // 交易对名称
      fullscreenLoading: false, // 整页loading
      loading: true, // 页面列表局部loading
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
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_ACTIVE_SYMBOL'
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
          sellname: "比特币"
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
        sellname: e.sellCoinName,
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
      this.serviceChargeCount = Math.abs(
        amendPrecision(this.$refs.rechargeCount[index].value, this.$refs.serviceCharge[index].value, '-')
      )
      // 判断是输入时还是手续费 判断错误提示
      if (val === 'rechargeType') {
        console.log(1)
        // 获取输入数量
        this.amount = this.$refs.rechargeCount[index].value
        console.log(this.amount)
        console.log(this.$refs.rechargeCount[index].value)
        // 输入数量之后显示在到账数量框中显示,在手续费中输入手续费并且以输入数量之后减去的值显示在到账数量
        if (this.$refs.rechargeCount[index].value > this.withdrawDepositList[index].total) {
          // 判断输入数量不能大于总数量
          this.$refs.rechargeCount[index].value = this.withdrawDepositList[index].total
          console.log(this.amount)
        } else if (this.$refs.rechargeCount[index].value <= this.$refs.serviceCharge[index].value) {
          // 判断输入数量必须大于手续费
          this.$message({
            message: this.$t('M.user_assets_withdrawal_hint7'),
            type: 'error'
          })
        }
      } else if (val === 'serviceType') {
        console.log(2)
        // 获取输入手续费
        this.service = this.$refs.serviceCharge[index].value
        if (this.$refs.serviceCharge[index].value < this.serviceChargeList.minFees) {
          // 判断输入手续费小于最小提现手续费
          this.$message({
            message: this.$t('M.user_assets_withdrawal_hint5'),
            type: 'error'
          })
        } else if (this.$refs.serviceCharge[index].value > this.serviceChargeList.maxFees) {
          // 判断输入手续费大于于最大提现手续费
          this.$message({
            message: this.$t('M.user_assets_withdrawal_hint6'),
            type: 'error'
          })
        }
      }
    },
    // 点击充币按钮显示充币内容（带回币种id 币种名称 当前index）
    showRechargeBox (id, name, index) {
      // 显示充值框
      this.chargeDialogVisible = true
      // 每行数据ID
      this.chargeMoneyAddressId = id
      // 每行数据币种名称
      this.chargeMoneyName = name
      console.log(this.chargeMoneyName)
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
        if (this.needTag) {
          // 隐藏普通币种提现框
          this.withdrawDepositList[index].withdrawDepositIsShow = false
        } else {
          // 隐藏公信宝类币种提现框
          this.withdrawDepositList[index].provideWithdrawDepositIsShow = false
        }
      }
      // 调用充币地址方法
      this.fillingCurrencyAddress()
    },
    // 点击提现按钮显示充币内容（带回币种id 币种名称 当前index）
    mentionMoneyButton (id, name, index) {
      // 提币数量
      this.$refs.rechargeCount[index].value = ''
      // 到账数量
      this.serviceChargeCount = ''
      // 提币地址
      this.mentionAddressValue = ''
      // 地址标签
      this.remark = ''
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
      if (!this.needTag) {
        // 隐藏普通币种提现框
        this.withdrawDepositList[index].withdrawDepositIsShow = true
      } else {
        // 隐藏公信宝类币种提现框
        this.withdrawDepositList[index].provideWithdrawDepositIsShow = true
      }
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
      this.seen = true
      this.current = index
      this.getQueryTransactionInformation()
    },
    leave () {
      this.seen = false
      this.current = null
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
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
        type: 'VERIFICATION_CODE' // 类型
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
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          console.log(loginType)
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
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.loading = false
        return false
      } else {
        // 接口成功清除loading
        this.loading = false
        this.withdrawDepositList.push({
          allIsShow: false,
          rechargeIsShow: false,
          withdrawDepositIsShow: false,
          provideWithdrawDepositIsShow: false
        })
        // 返回数据
        this.totalSumBTC = data.data.data.totalSum
        this.withdrawDepositList = data.data.data.userCoinWalletVOPageInfo.list
        this.totalPageForMyEntrust = data.data.data.userCoinWalletVOPageInfo.pages - 0
        // console.log(this.withdrawDepositList)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getAssetCurrenciesList()
    },
    // 资产币种提币地址选择
    changeId (e) {
      this.mentionAddressList.forEach(item => {
        if (e === item.id) {
          console.log(this.statusAddressValue)
          // 普通币种公信宝类币种地址标签
          this.remark = item.remark
          // 提币地址id
          this.mentionAddressValue = e
          console.log(this.mentionAddressValue)
          console.log(this.statusAddressValue)
        }
        this.statusAddressValue = item.address
        this.mentionAddressValue = this.statusAddressValue
      })
      this.gitCheckCurrencyAddress()
    },
    // 根据币种id查询提币地址
    async queryWithdrawalAddressList (index) {
      let data = await inquireWithdrawalAddressId({
        coinId: this.mentionMoneyAddressId
      })
      this.fullscreenLoading = true
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        console.log(data.data.data.needTag)
        console.log(data.data.data.userWithdrawAddressListVO.userWithdrawAddressDtoList)
        // 对币种类型进行赋值 true公信宝类 false普通币种
        this.needTag = data.data.data.needTag
        // 返回列表数据并渲染币种列表
        this.mentionAddressList = data.data.data.userWithdrawAddressListVO.userWithdrawAddressDtoList
        if (!data.data.data.userWithdrawAddressListVO.userWithdrawAddressDtoList) {
          this.mentionAddressValue = data.data.data.userWithdrawAddressListVO.userWithdrawAddressDtoList[0].address
        }
        console.log(data.data.data.vo)
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
      if (!(returnAjaxMessage(data, this, 0))) {
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
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回列表数据
        this.serviceChargeList = data.data.data
        this.serviceCharge = data.data.data.minFees
        this.$refs.serviceCharge[index].value = this.serviceCharge
        this.service = this.$refs.serviceCharge[index].value
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
      if (!(returnAjaxMessage(data, this, 0))) {
        // 接口失败清除loading
        this.fullscreenLoading = false
        return false
      } else {
        // 接口成功清除loading
        this.fullscreenLoading = false
        // 返回列表数据
        this.chargeMoney = data.data.data.userRechargeAddress.address
        console.log(this.chargeMoney)
      }
    },
    /**
    * 点击提币按钮 验证
    * */
    moneyConfirmState () {
      if (this.needTag) {
        if (!this.remark) {
          // 请输入备注
          this.$message({
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_address_labels'),
            type: 'error'
          })
          this.mentionMoneyConfirm = false
        }
      } else {
        if (!this.mentionAddressValue) {
          // 请选择提币地址
          this.$message({
            message: this.$t('M.comm_please_choose') + this.$t('M.comm_mention_money') + this.$t('M.comm_site'),
            type: 'error'
          })
          this.mentionMoneyConfirm = false
        } else if (!this.amount) {
          // 请输入提币数量
          this.$message({
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_count'),
            type: 'error'
          })
          this.mentionMoneyConfirm = false
        } else if (!this.service) {
          // 请输入手续费
          this.$message({
            message: this.$t('M.comm_please_enter') + this.$t('M.comm_service_charge'),
            type: 'error'
          })
          this.mentionMoneyConfirm = false
        } else if (!this.userInfo.userInfo.payPassword) {
          this.dialogVisible = true
        } else {
          this.mentionMoneyConfirm = true
        }
      }
    },
    confirm () {
      this.$router.push({path: '/TransactionPassword'})
    },
    submitMentionMoney () {
      if (!this.phoneCode && !this.emailCode && !this.googleCode) {
        console.log(1)
        // 请输入验证码
        this.errorMsg = this.$t('M.comm_please_enter') + this.$t('M.user_security_verify')
        return false
      } else {
        this.errorMsg = ''
        this.stateSubmitAssets()
      }
    },
    // 提交提币接口
    async stateSubmitAssets (index) {
      let data
      let param = {
        msgCode: this.phoneCode, // 短信验证码
        emailCode: this.emailCode, // 邮箱验证码
        googleCode: this.googleCode, // 谷歌验证码
        coinId: this.mentionMoneyAddressId, // 币种ID
        withdrawAddress: this.mentionAddressValue,
        remark: this.remark, // 提币地址
        networkFees: this.service, // 手续费
        amount: this.amount, // 提币数量
        payCode: this.password // 交易密码
      }
      // 整页loading
      this.fullscreenLoading = true
      data = await statusSubmitWithdrawButton(param)
      if (!(returnAjaxMessage(data, this, 1))) {
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
      this.$refs.serviceCharge[index].value = ''
      this.$refs.rechargeCount[index].value = ''
      this.serviceChargeCount = ''
      this.mentionAddressValue = ''
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
          this.securityCenter = data.data.data
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
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.currencyTradingList = data.data.data.entrust
        // if (this.currencyTradingList !== '') {
        //   this.area = this.currencyTradingList.buyCoinName
        // }
        // this.areaId = this.currencyTradingList.tradeAreaId
        // this.id = this.currencyTradingList.sellCoinName + this.currencyTradingList.buyCoinName
        // this.sellname = data.data.data.entrust.sellCoinName
        // this.sellsymbol = this.currencyTradingList.sellCoinName
        // this.buyName = data.data.data.entrust
        // this.buysymbol = data.data.data.entrust
        // this.tradeId = this.currencyTradingList.tradeId
        // area: "ETH"
        // areaId: "486108806841892864"
        // id: "wtcfbt"
        // plateId: "486108580110401536"
        // sellname: "沃尔顿链"
        // sellsymbol: "WTC"
        // tradeId: "491725015746609152"
        // console.log(this.currencyTradingList)
        // console.log(this.area)
        // console.log(this.areaId)
        // console.log(this.id)
        // console.log(this.sellsymbol)
        // console.log(this.tradeId)
        // console.log(this.currencyTradingId)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
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
              .error-info {
                height: 20px;
                line-height: 35px;
                color: #d45858;
              }
              .button-color {
                width: 80px;
                height: 35px;
                border: 0;
                line-height: 0;
                margin-left: 50px;
                margin-right: 15px;
              }
              .btn{
                width: 80px;
                height: 35px;
                line-height: 0;
              }
              .flex-asset {
                position: relative;
                // text-align: center;
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
                    height:225px !important;
                  }
                  >.list-mention-treasure {
                    height:295px !important;
                  }
                  >.recharge-list {
                    position: relative;
                    height:205px;
                    padding: 20px 6px;
                    z-index: 2;
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
                      right: 55px;
                    }
                    >.mention {
                      width: 100%;
                      padding: 5px 0 0;
                      >.mention-treasure {
                        height: 20px;
                        line-height: 20px;
                        color: #338FF5;
                        >.treasure-info {
                          color: #D45858;
                        }
                      }
                      >.input-mention {
                        height: 34px;
                        width: 640px;
                        color: #fff;
                        background-color: #2D3651;
                      }
                    }
                    >.recharge-content {
                      padding: 0 20px;
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
                            height: 34px;
                            width: 35px;
                            position: absolute;
                            top: 38px;
                            right: 1px;
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
                          /*>.count-flex-text {*/
                            /*padding-right: 25px;*/
                          /*}*/
                          >.count-flex-input,
                          >.count-text-input {
                            width: 275px;
                            height: 34px;
                          }
                        }
                      }
                      >.text-info-mention {
                        padding-left: 15px;
                        position: relative;
                        top: -45px;
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
                      padding-left: 15px;
                      padding-top: 20px;
                      >.currency-rule,
                      >.prompt-message {
                        line-height: 20px;
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
                height: 34px;
                position: absolute;
                top: 4px;
                z-index: 999;
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
        background-color: $nightMainBgColor;
        .account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #2D3651;
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
          .info {
            color: #fff;
          }
          .button-color {
            color: rgba(255,255,255,0.7);
            background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          }
          .btn{
            background-color: transparent;
            border: 1px solid #338FF5;
          }
          >.table-tr {
            >.table-box {
              >.table-td {
                color: #9DA5B3;
                .money-color {
                  color: #9DA5B3;
                }
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
                >.triangle {
                  border-right: 1px solid transparent;
                  border-top: 1px solid transparent;
                  border-left: 1px solid #338FF5;
                  border-bottom: 1px solid #338FF5;
                  background-color: #1C1F32;
                }
                >.recharge-content {
                  >.recharge-content-hint {
                    color: #338FF5;
                  }
                  >.input-box {
                    >.hint-input {
                      background-color: #2D3651;
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
                        background-color: #2D3651;
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
                      >.address-bg {
                        background-color: #2D3651;
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
                        background-color: #2D3651;
                        color: #fff;
                      }
                      >.count-text-input {
                        background-color: #20273D;
                        color: #fff;
                      }
                    }
                  }
                  >.text-info-mention {
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
          .info {
            color: #333;
          }
          .button-color {
            color: rgba(255,255,255,0.7);
            background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
          }
          .btn{
            color: #333;
            background-color: transparent;
            border: 1px solid #338FF5;
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
                      >.address-bg {
                        background-color: #fff;
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
                  >.text-info-mention {
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
        }
      }
    }
  }
</style>
