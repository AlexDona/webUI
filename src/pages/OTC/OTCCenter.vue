<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 OTC首页 组件
-->
<template>
  <div
    class="otc-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--在线交易和订单管理-->
    <div class="otc-center-content">
      <!-- 1 在线交易-->
      <div
        class="otc-online-trading"
        id="jumpScrollTop"
      >
        <!--1.1个人信息-->
        <div class="person-info-box font-size12">
          <!--左侧-->
          <div class="info-left">
            <!--头像-->
            <div class="avatar text-align-c">
              <IconFontCommon
                class="font-size40"
                iconName="icon-yonghu1"
              />
            </div>
            <!--信息-->
            <div
              class="login-before"
              v-if="!isLogin"
            >
              <div
                class="login-text cursor-pointer"
                @click="loginJump"
              >
                {{$t('M.comm_login')}}
              </div>
              <div class="coin-count">
                <!--可用/冻结-->
                <span>
                  {{selectedOTCAvailableCurrencyName}}
                </span>
                {{$t('M.comm_usable')}} 0.00000000  / {{$t('M.focus_black_buy_sell_title3')}} 0.00000000
              </div>
            </div>
            <div
              class="login-after"
              v-else
            >
              <div class="view-info">
                <span class="person-name font-size20">
                  <span v-if="viewDialogInfo.personNickName">
                    {{viewDialogInfo.personNickName}}
                  </span>
                  <span v-else>
                    {{viewDialogInfo.personRealName}}
                  </span>
                </span>
                <span
                  class="view-text cursor-pointer"
                  @click="personInfoDiaStatus = true"
                >
                  <!--查看-->
                  {{$t('M.focus_black_buy_sell_title4')}}
                </span>
              </div>
              <div class="available-count">
                <!--可用/冻结-->
                <span>{{selectedOTCAvailableCurrencyName}}</span>
                <span>{{$t('M.comm_usable')}} {{viewDialogInfo.coinAvailableAmount}}</span> /
                <span>{{$t('M.focus_black_buy_sell_title3')}} {{viewDialogInfo.coinFreezeAmount}}</span>
              </div>
            </div>
          </div>
          <!--右侧-->
          <div class="info-right">
            <!-- 发布订单按钮 -->
            <el-button
              type="primary"
              @click="toPublishOrder"
              v-if="userPutUpOrderStatus"
            >
              {{ $t('M.otc_release_order') }}
            </el-button>
          </div>
        </div>
        <!-- 1.2 我要购买和商户列表内容-->
        <div class="otc-merchant-content">
          <!--1.2.1在线购买和在线出售切换-->
          <div class="otc-online-buy-and-sell-button">
            <el-radio-group
              v-model="OTCBuySellStyle"
              @change="toggleBuyOrSellStyle"
            >
              <el-radio-button
                label="onlineBuy"
                :disabled="isDisabledRadio"
              >
                <!-- 购买 -->
                {{$t('M.comm_buying')}}
              </el-radio-button>
              <el-radio-button
                label="onlineSell"
                :disabled="isDisabledRadio"
              >
                <!-- 出售 -->
                {{$t('M.comm_offering')}}
              </el-radio-button>
            </el-radio-group>
          </div>
          <!--1.2.2我要购买/出售和筛选框-->
          <div class="otc-filtrate-publish">
            <!-- 可用币种列表 -->
            <div class="otc-filtrate-box">
              <div class="otc-filtrate-style">
                <span
                  v-for="(item, index) in IWantToBuySellArr"
                  :key="index"
                  class="otc-filtrate-currency-name font-size12 cursor-pointer border-radius2"
                  :class="{ currencyNameActived: selectCurrencyNameStatus === index }"
                  @click="selectCurrencyName(index)"
                >
                  {{item.name}}
                </span>
              </div>
            </div>
            <!-- 国家列表、支付方式、货比类型、发布订单按钮 -->
            <!--国家列表-默认显示中国国家和人民币法币-->
            <div class="otc-publish-box">
              <span class="country-style">
                <IconFontCommon
                  class="country-style-icon"
                  iconName="icon-guojiapitchon"
                />
                <el-select
                  v-model="checkedCountryId"
                  @change="changeCountryId"
                  :placeholder="$t('M.comm_please_choose')"
                  :no-data-text="$t('M.comm_no_data')"
                  :disabled="countrySelectStatus"
                >
                  <el-option
                    v-for="(item, index) in countryInfoList"
                    :key="index"
                    :label="language === 'zh_CN' || language === 'zh_TW'? item.countryName : item.englishName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </span>
              <!-- 货币类型 -->
              <span class="currency-style">
                <IconFontCommon
                  class="currency-style-icon"
                  iconName="icon-jinbi"
                />
                <!-- 货币类型 -->
                <el-select
                  :disabled="currencyCoinSelectStatus"
                  v-model="checkedCurrencyId"
                  @change="changeCurrencyId"
                  :placeholder="$t('M.otc_index_currency_type')"
                  :no-data-text="$t('M.comm_no_data')"
                >
                  <el-option
                    v-for="(item, index) in availableCurrencyId"
                    :key="index"
                    :label="language === 'zh_CN'? item.name : item.shortName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </span>
              <!-- 支付方式 -->
              <span class="pay-style">
                <IconFontCommon
                  iconName="icon-qiandai"
                  class="pay-style-icon"
                />
                <el-select
                  :no-data-text="$t('M.comm_no_data')"
                  v-model="checkedPayType"
                  :placeholder="$t('M.otc_index_Payment_method')"
                  @change="payWayChangeValue"
                >
                  <el-option
                    v-for="(item,index) in payWayBankInfoList"
                    :key="index"
                    :value="item.id"
                    :label="$t(item.shortName)"
                  >
                  </el-option>
                </el-select>
              </span>
            </div>
          </div>
          <!--新增一键买币20190902-->
          <div
            class="one-key-buy-coin-box"
            v-if="(language === 'zh_CN' || language === 'zh_TW') && OTCBuySellStyle === 'onlineBuy'"
          >
            <div class="buy-left">
              <span class="left-one">
                <IconFontCommon
                  class="font-size40"
                  iconName="icon-shandian"
                />
              </span>
              <span
                class="left-two font-size18 font-weight700"
              >
                闪电交易
              </span>
              <span class="left-three font-size12">
                小额快速交易，单笔50000以下
              </span>
            </div>
            <div class="buy-right">
              <span class="right-one">
                <input
                  type="text"
                  class="buy-input border-radius2 box-sizing error-border"
                  :class="{errorBorder: isHaveOneTradeErrorTips}"
                  maxlength="20"
                  :placeholder="oneKeyBuyCheckedType === 'typeMoney'? '请输入购买金额': '请输入购买数量'"
                  ref="inputValue"
                  @keyup="changeInputValue('inputValue')"
                  @input="changeInputValue('inputValue')"
                  onpaste="return false"
                >
                <span class="unit-name font-size12">
                  {{oneKeyBuyCheckedType === 'typeMoney'? 'CNY': selectedOTCAvailableCurrencyName}}
                </span>
                <!--错误提示-->
                <div class="one-trade-err-info font-size12">
                  {{oneTradeErrorTips}}
                </div>
              </span>
              <span class="right-two">
                <el-select
                  class="one-key-buy-select"
                  v-model="oneKeyBuyCheckedType"
                  placeholder="请选择"
                  no-data-text="暂无数据"
                  @change="changeOneKeyBuyCoinType"
                >
                  <el-option
                    v-for="(item, index) in oneKeyBuyTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </span>
              <span class="right-three">
                <button
                  class="one-key-buy-button border-radius2 cursor-pointer"
                  @click="jumpOneTradePage"
                >
                  <span class="button-left">
                    <IconFontCommon
                      class="font-size30"
                      iconName="icon-shandian"
                    />
                  </span>
                  <span class="button-right font-size12">
                    购买{{selectedOTCAvailableCurrencyName}}
                  </span>
                </button>
              </span>
            </div>
          </div>
          <!--1.2.3商户列表表格部分-->
          <div class="otc-merchant-list">
            <!-- 表格信息 暂时无数据-->
            <el-table
              :data="onlineBuySellTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 名称 -->
              <!--:label="$t('M.otc_index_Merchant')"-->
              <!--label="广告方 (30日成交单 | 成交率 | 放行时间)"-->
              <el-table-column
                :label="$t('M.otc_index_Merchant')"
                align="left"
                width="250"
              >
                <template slot-scope = "s">
                  <div class="first-name">
                    <div class="top">
                      <span
                        class="cursor-pointer top-name"
                        @click="jumpMerchantInfoPage(s.row.userId)"
                      >
                        <span v-if="s.row.userNick">
                          {{s.row.userNick}}
                        </span>
                        <span v-else>
                          {{s.row.userName}}
                        </span>
                      </span>
                      <img
                        src="../../assets/develop/shangjia.png"
                        class="merchant-icon"
                        v-show="s.row.userType === 'MERCHANT'"
                        :title="$t('M.otc_merchant')"
                      >
                    </div>
                    <div class="bottom">
                      <!--单-->
                      <span>{{s.row.successOrderTimesForThirtyDays}}{{$t('M.otc_thirty_success_orders')}}</span>
                      <span class="line"></span>
                      <span>
                        <span v-if="s.row.successOrderTimes === 0 || s.row.tradeTimes === 0">
                          0%
                        </span>
                        <span v-else>
                          {{((s.row.successOrderTimes/(s.row.tradeTimes)) * 100).toFixed(2)}}%
                        </span>
                      </span>
                      <span class="line"></span>
                      <span>{{BIHTimeFormatting(s.row.avgGiveOutTime)}}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!-- 成交率 -->
              <!--<el-table-column
                :label="$t('M.otc_index_turnover')"
              >
                <template slot-scope = "s">
                  <div v-if="s.row.successOrderTimes === 0 || s.row.tradeTimes === 0">
                    0%
                  </div>
                  <div v-else>
                    {{((s.row.successOrderTimes/(s.row.tradeTimes)) * 100).toFixed(2)}}%
                  </div>
                </template>
              </el-table-column>-->
              <!-- 数量 -->
              <!--width="170"-->
              <el-table-column
                :label="$t('M.comm_count')"
                align="right"
                width="150"
              >
                <template slot-scope = "s">
                  <div>
                    {{$scientificToNumber(s.row.remainCount)}}&nbsp;{{(s.row.coinName)}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
                align="right"
                width="170"
              >
                <template slot-scope = "s">
                  <div
                    class="red"
                    v-show="OTCBuySellStyle === 'onlineBuy'"
                  >
                    <!--{{$scientificToNumber(s.row.price)}}{{(s.row.currencyName)}}-->
                    {{$otcPricePointShow(s.row.priceZero)}}&nbsp;{{(s.row.currencyName)}}
                  </div>
                  <div
                    class="green"
                    v-show="OTCBuySellStyle === 'onlineSell'"
                  >
                    <!--{{$scientificToNumber(s.row.price)}}{{(s.row.currencyName)}}-->
                    {{$otcPricePointShow(s.row.priceZero)}}&nbsp;{{(s.row.currencyName)}}
                  </div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
                align="right"
                width="170"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16 margin3"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16 margin3"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16 margin3"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian margin3"
                      >
                    </span>
                    <!-- 5PAYPAL -->
                    <IconFontCommon
                      class="font-size16 margin3"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <!--width="170"-->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
                align="right"
                width="170"
              >
                <template slot-scope = "s">
                  <div>
                    {{ $scientificToNumber(s.row.minCount) }}~{{ $scientificToNumber(s.row.maxCount) }}&nbsp;{{(s.row.currencyName)}}
                  </div>
                </template>
              </el-table-column>
              <!-- 备注 -->
              <!--width="120"-->
              <el-table-column
                :label="$t('M.comm_remark')"
                align="right"
                width="170"
              >
                <template slot-scope = "s">
                  <span class="remark-tips">
                    <span
                      class="content"
                      :title="s.row.remark"
                    >
                      {{s.row.remark}}
                    </span>
                  </span>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <!--width="140"-->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="right"
              >
                <template slot-scope="s">
                  <el-button
                    type="danger"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineBuy'"
                    :disabled="s.row.otcEnable==='disable'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country)"
                  >
                    <!-- 购买 -->
                    {{$t('M.comm_buying')}}{{(s.row.coinName)}}
                  </el-button>
                  <el-button
                    type="success"
                    size="mini"
                    v-if="OTCBuySellStyle === 'onlineSell'"
                    :disabled="s.row.otcEnable==='disable'"
                    @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country)"
                  >
                    <!-- 出售 -->
                   {{$t('M.comm_offering')}}{{(s.row.coinName)}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!--1.2.4分页-->
          <div class="page">
            <el-pagination
              background
              v-show="onlineBuySellTableList.length && totalPages - 1 > 0"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-count="totalPages"
              @current-change="changeCurrentPage"
            >
            </el-pagination>
          </div>
        </div>
        <!--1.3交易须知-->
        <div class="trade-rules border-radius2">
          <div class="rules-header">
            <!--交易规则：-->
            {{$t('M.focus_black_buy_sell_title5')}}：
          </div>
          <div class="rules-box font-size12">
            <p class="rules-item">
              1.{{$t('M.focus_black_buy_sell_title6')}}
            </p>
            <p class="rules-item">
              2.{{$t('M.otc_publishAD_discriptLineThree')}}&nbsp;{{configInfo.otcAd}}&nbsp;{{$t('M.otc_publishAD_discriptLineFive')}}
            </p>
            <p class="rules-item">
              3.{{$t('M.otc_publishAD_discriptLineFour')}}
            </p>
          </div>
        </div>
        <!--1.4 查看个人信息弹窗-->
        <div class="person-info-dialog">
          <el-dialog
            :visible.sync="personInfoDiaStatus"
            top="22vh"
          >
            <div class="person-body-content">
              <!--1头像部分-->
              <div class="photo">
                <!--左侧-->
                <div class="photo-left">
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-yonghu1"
                  />
                  <span class="person-name font-size16">
                    <span v-if="viewDialogInfo.personNickName">
                      {{viewDialogInfo.personNickName}}
                    </span>
                    <span v-else>
                      {{viewDialogInfo.personRealName}}
                    </span>
                  </span>
                </div>
                <!--右侧-->
                <div class="photo-right">
                  <!--注册时间-->
                  <div class="time-top text-align-r font-size12">
                    {{$t('M.focus_black_time1')}}：{{viewDialogInfo.registerTime}}
                  </div>
                  <!--最近登录时间-->
                  <div class="time-bottom text-align-r font-size12">
                    {{$t('M.focus_black_time2')}}：{{viewDialogInfo.recentlyLoginTime}}
                  </div>
                </div>
              </div>
              <!--2认证部分-->
              <div class="identity-box">
                <!--邮箱认证-->
                <div
                  class="first-item items"
                  :class="{unverified: viewDialogInfo.mailAuth !== 'enable'}"
                >
                  <span>{{$t('M.focus_black_identity1')}}</span>
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-tongguo_huaban"
                  />
                </div>
                <!--手机认证-->
                <div
                  class="second-item items"
                  :class="{unverified: viewDialogInfo.phoneAuth !== 'enable'}"
                >
                  <span>{{$t('M.focus_black_identity2')}}</span>
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-tongguo_huaban"
                  />
                </div>
                <!--实名认证-->
                <div
                  class="third-item items"
                  :class="{unverified: viewDialogInfo.realNameAuth !== 'y'}"
                >
                  <span>{{$t('M.user_real_name')}}</span>
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-tongguo_huaban"
                  />
                </div>
                <!--高级认证-->
                <div
                  class="fourth-item items"
                  :class="{unverified: viewDialogInfo.advancedAuth !== 'pass'}"
                >
                  <span>{{$t('M.user_senior_certification')}}</span>
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-tongguo_huaban"
                  />
                </div>
                <!--商家认证-->
                <div
                  class="fifth-item items"
                  :class="{unverified: viewDialogInfo.merchantAuth !== 'PASS'}"
                >
                  <span>{{$t('M.focus_black_identity3')}}</span>
                  <IconFontCommon
                    class="font-size40"
                    iconName="icon-tongguo_huaban"
                  />
                </div>
              </div>
              <!--3其他信息-->
              <div class="other-infos">
                <div class="first-bar bars">
                  <!--商家保证金-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info1')}}
                  </div>
                  <div class="bar-bottom">
                    {{viewDialogInfo.cashDeposit}}{{viewDialogInfo.cashDepositName}}
                  </div>
                </div>
                <div class="second-bar bars">
                  <!--交易总单数-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info2')}}
                  </div>
                  <div class="bar-bottom">
                    {{viewDialogInfo.totalOrders}}
                  </div>
                </div>
                <div class="third-bar bars">
                  <!--30日成交单-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info3')}}
                  </div>
                  <div class="bar-bottom">
                    {{viewDialogInfo.successOrders}}
                  </div>
                </div>
                <div class="fourth-bar bars">
                  <!--30日成交率-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info4')}}
                  </div>
                  <div class="bar-bottom">
                    {{viewDialogInfo.successRate}}%
                  </div>
                </div>
                <div class="fifth-bar bars">
                  <!--冻结次数-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info5')}}
                  </div>
                  <div class="bar-bottom">
                    {{viewDialogInfo.freezeTimes}}
                  </div>
                </div>
                <div class="sixth-bar bars">
                  <!--平均放行时间-->
                  <div class="bar-top">
                    {{$t('M.focus_black_merchant_info7')}}
                  </div>
                  <div class="bar-bottom">
                    {{BIHTimeFormatting(viewDialogInfo.avgConfirmTime)}}
                  </div>
                </div>
              </div>
            </div>
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
              <!--请前往个人中心完成实名认证！-->
              <span v-show="!isRealNameAuthSuccess">
                {{ $t('M.otc_index_digo_tips') }}
              </span>
              <!--请前往个人中心完成高级认证！-->
              <span v-show="isRealNameAuthSuccess && !isAdvancedAuthSuccess">
                {{ $t('M.otc_index_digo_tips_pass') }}
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
      <!-- 2 订单管理-->
      <!--<div
        class="otc-order-manage"
        id="orderView"
      >
        &lt;!&ndash;交易中订单右箭头&ndash;&gt;
        <div class="trading-order-right-arrow">
          <i
            class="el-icon-caret-right font-size20"
            v-if="activeName === 'first'"
          >
          </i>
        </div>
        &lt;!&ndash;交易中订单图标沙漏&ndash;&gt;
        <div
          class="trading-order-sand-clock cursor-pointer"
          @click="toggleTradingOrder"
        >
          <IconFontCommon
            v-if="activeName === 'first'"
            iconName="icon-shalou"
            style="color: #fff;"
          />
          <IconFontCommon
            v-else
            iconName="icon-shalou"
            style="color: #4f85da;"
          />
        </div>
        &lt;!&ndash;订单管理tab栏&ndash;&gt;
        <el-tabs
          :tab-position = "tabPosition"
          @tab-click = "toggleTabPane"
          v-model = "activeName"
        >
          &lt;!&ndash; 2.2.1 交易中的订单 &ndash;&gt;
          <el-tab-pane
            name = "first"
            :disabled="isDisabled"
            :label="$t('M.otc_trading')"
          >
            &lt;!&ndash;<span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'first'"
              >
              </i>
              <IconFontCommon
                iconName="icon-shalou"
              />
                交易中订单
              {{$t('M.otc_trading')}}
            </span>&ndash;&gt;
            <OTCTradingOrder v-if="activeName === 'first'"/>
          </el-tab-pane>
          &lt;!&ndash; 2.2.2 已完成订单 &ndash;&gt;
          <el-tab-pane
            name = "second"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'second'"
              >
              </i>
              <IconFontCommon
                iconName="icon-msnui-task-complete"
              />
              &lt;!&ndash; 已完成订单 &ndash;&gt;
              {{$t('M.otc_stocks')}}
            </span>
            <OTCCompletedOrder v-if="activeName === 'second'"/>
          </el-tab-pane>
          &lt;!&ndash; 2.2.3 已取消订单 &ndash;&gt;
          <el-tab-pane
            name = "third"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'third'"
              >
              </i>
              <IconFontCommon
                iconName="icon-cancel_order"
              />
              &lt;!&ndash; 已取消订单 &ndash;&gt;
              {{$t('M.otc_canceled')}}
            </span>
            <OTCCanceledOrder v-if="activeName === 'third'"/>
          </el-tab-pane>
          &lt;!&ndash; 2.2.4 冻结中订单 &ndash;&gt;
          <el-tab-pane
            name = "fourth"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'fourth'"
              >
              </i>
              <IconFontCommon
                iconName="icon-dongjie"
              />
              &lt;!&ndash; 冻结中订单 &ndash;&gt;
              {{$t('M.otc_freezingOrder')}}
            </span>
            <OTCFreezingOrder v-if="activeName === 'fourth'"/>
          </el-tab-pane>
          &lt;!&ndash; 2.2.5 委托订单 &ndash;&gt;
          <el-tab-pane
            name = "fifth"
            :disabled="isDisabled"
          >
            <span slot="label">
              <i
                class="el-icon-caret-right otc-tab-pane-arrow-right"
                v-if="activeName === 'fifth'"
              >
              </i>
              <IconFontCommon
                iconName="icon-daohang2"
              />
              &lt;!&ndash; 委托订单 &ndash;&gt;
              {{$t('M.otc_entrust')}}
            </span>
            <OTCEntrustOrder v-if="activeName === 'fifth'"/>
          </el-tab-pane>
        </el-tabs>
        &lt;!&ndash; 查询更多 &ndash;&gt;
        <span
          class="more"
          @click="queryMoreOrder"
        >
            {{$t('M.otc_transaction_inquiries_more')}}
          </span>
      </div>-->
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  amendPrecision,
  formatSeconds,
  formatNumberInput
} from '../../utils'
import {
  getOTCAvailableCurrency,
  getOTCPutUpOrders,
  getMerchantAvailableLegalTender,
  getCommonPutUpOrderStatus,
  // 增加国家-
  getCurrencyCountrys,
  // OTC一键买币input框输入数据调取委单列表信息接口
  getOTCOneTradeEntrustListInfoAjax
} from '../../utils/api/OTC'
import {
  getViewInfoAJAX
} from '../../utils/api/focusBlack'
import IconFontCommon from '../../components/Common/IconFontCommon'
import OTCTradingOrder from '../../components/OTC/OTCTradingOrder'
import OTCCompletedOrder from '../../components/OTC/OTCCompletedOrder'
import OTCCanceledOrder from '../../components/OTC/OTCCanceledOrder'
import OTCFreezingOrder from '../../components/OTC/OTCFreezingOrder'
import OTCEntrustOrder from '../../components/OTC/OTCEntrustOrder'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  components: {
    OTCTradingOrder, //  交易中订单
    OTCCompletedOrder, //  已完成订单
    OTCCanceledOrder, //  已取消订单
    OTCFreezingOrder, //  冻结中订单
    OTCEntrustOrder, //  委托订单
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 实名/高级认证弹窗显示与隐藏
      notVerifyDialogVisible: false,
      // 个人信息弹窗显示状态
      personInfoDiaStatus: false,
      currencyCoinSelectStatus: true, // 货币类型法币可用状态
      // 用户是否可以发单状态
      userPutUpOrderStatus: false,
      // 订单tabs面板切换禁用状态
      isDisabled: false,
      // 在线购买和在线出售按钮禁用状态
      isDisabledRadio: false,
      // 分页
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 可用法币币种数组
      // 选中的可用法币id
      checkedCurrencyId: '',
      // 选中的可用法币name
      checkedCurrencyName: '',
      availableCurrencyId: [],
      // 选中的tab面板的序号
      activeName: 'first',
      //  订单管理面板标签方向状态
      tabPosition: 'left',
      //  在线购买和在线出售选中类型
      OTCBuySellStyle: 'onlineBuy',
      //  选中我要购买或者出售的币种名称
      selectCurrencyNameStatus: 0,
      // 在线购买和在线出售表格列表
      onlineBuySellTableList: [],
      // 支付方式下拉框数据
      payWayBankInfoList: [
        {
          id: '',
          shortName: 'M.comm_all' // 全部
        },
        {
          id: 'Alipay',
          shortName: 'M.comm_alipay' // 支付宝
        },
        {
          id: 'Wechat',
          shortName: 'M.comm_weixin' // 微信
        },
        {
          id: 'Bankcard',
          shortName: 'M.comm_bank' // 银行卡
        },
        {
          id: 'WestUnion',
          shortName: 'M.comm_xilian' // 西联汇款
        },
        {
          id: 'PAYPAL',
          shortName: 'M.comm_PAYPAL' // PAYPAL
        }
      ],
      // 下拉框支付方式中选中的支付方式查询列表
      checkedPayType: '',
      // 我要购买出售币种数组
      IWantToBuySellArr: [],
      isDisabledTimer: null, // 面板切换防止频繁点击倒计时
      // 增加国家列表
      checkedCountryId: null, // 增加国家-选中国家id
      countryInfoList: [], // 增加国家-国家列表
      countrySelectStatus: true, // 国家下拉选择框禁用状态
      // 查看弹窗信息定义
      viewDialogInfo: {
        // 保证金
        cashDeposit: '',
        cashDepositName: '',
        // 总单数
        totalOrders: '',
        // 30日成交单
        successOrders: '',
        // 30日成交率
        successRate: '',
        // 30日冻结次数
        freezeTimes: '',
        // 平均放行时间
        avgConfirmTime: '',
        // 昵称
        personNickName: '',
        // 真实名称
        personRealName: '',
        // 注册时间
        registerTime: '',
        // 最近登录时间
        recentlyLoginTime: '',
        // 邮箱认证
        mailAuth: '',
        // 手机认证
        phoneAuth: '',
        // 商家认证
        merchantAuth: '',
        // 高级认证
        advancedAuth: '',
        // 实名认证
        realNameAuth: '',
        // 可用
        coinAvailableAmount: '',
        // 冻结
        coinFreezeAmount: ''
      },
      // 一键买币类型
      oneKeyBuyTypeList: [
        {
          id: 'typeMoney',
          name: '按金额购买'
        },
        {
          id: 'typeAmount',
          name: '按数量购买'
        }
      ],
      // 一键买币选中类型
      oneKeyBuyCheckedType: 'typeMoney', // typeAmount  typeMoney
      // 一键买币错误提示信息状态
      isHaveOneTradeErrorTips: false,
      // 一键买币错误提示信息
      oneTradeErrorTips: '',
      // 一键买币最小数量或者金额
      oneTradeMix: '',
      // 一键买币最大数量或者金额
      oneTradeMax: ''
    }
  },
  async created () {
    // 1.0 otc可用币种查询：我要购买/我要出售的币种列表
    await this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    await this.getMerchantAvailableLegalTenderList()
    // 3.0 otc主页面查询挂单列表:
    await this.getOTCPutUpOrdersList()
    // 4.0 用户登录了刷新用户个人信息
    if (this.isLogin) {
      // 刷新用户信息
      await this.REFRESH_USER_INFO_ACTION()
      // 7.0 登陆后进页面待币种和法币都有id的时候调接口渲染查看弹窗及头部可用冻结数据
      await this.getViewDialogInfo()
    }
    // 5.0 增加国家-查询法币联动国家列表
    await this.getCurrencyCountrysList()
    // 6.0 查询用户是否可以发单状态:不分登录前和登录后
    await this.getUserPutUpOrderStatus()
  },
  mounted () {
    // 如果是从购买和出售下单跳转过来的时候，页面加载打开到锚点位置：anchorStatus在全局先定义false，当用户购买或者出售时候改为true
    // if (this.anchorStatus) {
    //   document.getElementById('orderView').scrollIntoView(true) // scrollIntoView(true)参数为true时候才调用此方法
    //   // 改变全局锚点状态
    //   this.CHANGE_OTC_ANCHOR_STATUS(false)
    // }
    // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
    if (this.publishOrderJumpTopStatus) {
      document.getElementById('jumpScrollTop').scrollIntoView(true) // scrollIntoView(true)参数为true时候才调用此方法
      // 改变发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      this.CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS(false)
    }
  },
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_OTC_AVAILABLE_CURRENCY_NAME',
      'CHANGE_OTC_AVAILABLE_CURRENCY_ID',
      'CHANGE_OTC_AVAILABLE_CURRENCY_UNIT',
      'UPDATE_OTC_HOME_LIST_STATUS',
      // 改变全局锚点状态方法
      'CHANGE_OTC_ANCHOR_STATUS',
      // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      'CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      // 改变otc主页国家列表筛选框选中的国家id
      'CHANGE_OTC_SELECTED_COUNTRY_ID',
      // 改变otc主页法币列表筛选框选中的法币类型id
      'CHANGE_OTC_SELECTED_CURRENCY_ID'
    ]),
    // 实名认证验证
    realNameAuthConfirm () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('identity-authentication')
      this.$goToPage('/PersonalCenter')
      this.notVerifyDialogVisible = false
    },
    // 国际标准格式(09ˋ40′32″)
    BIHTimeFormatting (date) {
      return formatSeconds(date, 'OTC')
    },
    // 登录跳转
    loginJump () {
      this.$goToPage(`/${this.$routes_X.login}`)
    },
    // 点击挂单列表中的名称跳转到商家信息页面
    jumpMerchantInfoPage (userId) {
      // 未登录不弹窗不跳转
      if (this.isLogin) {
        if (!this.isRealNameAuthSuccess || !this.isAdvancedAuthSuccess) {
          this.notVerifyDialogVisible = true
          return
        }
        if (userId && this.selectedOTCAvailableCurrencyCoinID && this.checkedCurrencyId) {
          this.$goToPage(`/${this.$routes_X.OTCViewMerchantInfo}`, {userId: userId, coinId: this.selectedOTCAvailableCurrencyCoinID, currencyId: this.checkedCurrencyId})
        }
      }
    },
    // 获得查看弹窗信息和可用冻结数据：当币种和法币改变的时候也要调此接口刷新数据
    async getViewDialogInfo () {
      let param = {
        coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
        currencyId: this.checkedCurrencyId // 法币id
      }
      if (!this.selectedOTCAvailableCurrencyCoinID || !this.checkedCurrencyId) return false
      const data = await getViewInfoAJAX(param)
      if (!data) return false
      // 返回数据正确的逻辑
      // 先赋值
      this.viewDialogInfo.cashDeposit = getNestedData(data, 'data.guaranteeCount')
      this.viewDialogInfo.cashDepositName = getNestedData(data, 'data.guaranteeCoinName')
      this.viewDialogInfo.totalOrders = getNestedData(data, 'data.tradeTimes')
      this.viewDialogInfo.successOrders = getNestedData(data, 'data.successOrderTimes')
      this.viewDialogInfo.successRate = getNestedData(data, 'data.completeRate')
      this.viewDialogInfo.freezeTimes = getNestedData(data, 'data.freezeTimes')
      this.viewDialogInfo.avgConfirmTime = getNestedData(data, 'data.avgGiveOutTime')
      this.viewDialogInfo.registerTime = getNestedData(data, 'data.regTime')
      this.viewDialogInfo.recentlyLoginTime = getNestedData(data, 'data.lastLoginTime')
      this.viewDialogInfo.personNickName = getNestedData(data, 'data.nickName')
      this.viewDialogInfo.personRealName = getNestedData(data, 'data.realName')
      this.viewDialogInfo.mailAuth = getNestedData(data, 'data.mailAuth')
      this.viewDialogInfo.phoneAuth = getNestedData(data, 'data.phoneAuth')
      this.viewDialogInfo.merchantAuth = getNestedData(data, 'data.merchantAuth')
      this.viewDialogInfo.advancedAuth = getNestedData(data, 'data.advancedAuth')
      this.viewDialogInfo.realNameAuth = getNestedData(data, 'data.realNameAuth')
      this.viewDialogInfo.coinAvailableAmount = getNestedData(data, 'data.total')
      this.viewDialogInfo.coinFreezeAmount = getNestedData(data, 'data.frozen')
    },
    // 增加国家-查询法币联动国家列表
    async getCurrencyCountrysList () {
      this.countrySelectStatus = true
      const data = await getCurrencyCountrys()
      // 返回数据正确的逻辑
      if (!data) return false
      this.countryInfoList = getNestedData(data, 'data')
      this.countrySelectStatus = false
      // 给返回国家列表增加一项全部国家
      let ALL = {
        'countryId': '1111111111111111',
        'countryName': '全部国家',
        'createTime': null,
        'englishName': 'All Country',
        'id': '22222222222222',
        'language': '',
        'languageName': '',
        'name': '',
        'partnerId': '',
        'shortName': '',
        'status': '',
        'symbol': '',
        'updateTime': '',
        'version': 3
      }
      this.countryInfoList.push(ALL)
      // 默认选中中国
      // 第一次进来默认选中中国，切换之后跳出本页面，再返回本页面显示最后一次切换的国家
      if (this.otcSelectedCountryId) {
        this.checkedCountryId = this.otcSelectedCountryId
      } else {
        this.checkedCountryId = (this.countryInfoList.filter(item => item.shortName == 'CNY'))[0].id
      }
    },
    // 增加国家-切换国家列表
    changeCountryId (e) {
      this.CHANGE_OTC_SELECTED_COUNTRY_ID(e)
      this.currentPage = 1 // 改变页码为第1页
      this.checkedCountryId = e
      this.availableCurrencyId.forEach(item => {
        if (e == item.id) {
          this.checkedCurrencyId = item.id
        }
      })
      this.CHANGE_OTC_SELECTED_CURRENCY_ID(this.checkedCurrencyId)
      this.getOTCPutUpOrdersList() // 根据条件刷新列表
      if (this.isLogin) {
        this.getViewDialogInfo() // 调取查看弹窗信息
      }
    },
    // 点击交易中订单图标沙漏跳转到交易中订单
    toggleTradingOrder () {
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
        return false
      }
      this.activeName = 'first'
    },
    // 查询用户是否可以发单状态
    async getUserPutUpOrderStatus () {
      const data = await getCommonPutUpOrderStatus()
      if (!data) return false
      let flagStatus
      flagStatus = getNestedData(data, 'data.flag')
      if (flagStatus === 'true') {
        this.userPutUpOrderStatus = true
      }
    },
    // 0.1 切换各订单状态tab面板
    toggleTabPane (tab, event) {
      // 防止频繁切换点击按钮 通过禁用按钮，0.5秒后可以点击
      this.isDisabled = true
      this.isDisabledTimer = setTimeout(() => {
        this.isDisabled = false
      }, 500)
      // 未登录跳转到登录页面去
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
        return false
      }
    },
    // 0.2 点击发布订单按钮跳转到发布订单页面
    async toPublishOrder () {
      // 增加没有币种和法币点击按钮不跳转的验证
      if (!this.selectedOTCAvailableCurrencyCoinID) {
        // 请选择要发布的币种
        this.$error_tips_X(this.$t('M.otc_publish_order_err_tips1'))
        return false
      }
      if (!this.checkedCurrencyId) {
        // 请选择法币类型
        this.$error_tips_X(this.$t('M.otc_publish_order_err_tips2'))
        return false
      }
      // 未登录跳转到登录页面
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
      } else {
        await this.REFRESH_USER_INFO_ACTION()
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          // 去个人中心设置交易密码
          this.$error_tips_X(this.$t('M.otc_index_js'))
          return false
        } else if (!this.userInfo.realname) {
          // 去个人中心完成实名认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips'))
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          // 去个人中心完成高级认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips_pass'))
          return false
        } if (this.userInfo.otcEnable === 'disable') {
          // 该账号已被禁止交易OTC，请咨询客服
          this.$error_tips_X(this.$t('M.otc_disable_account_tips'))
          return false
        } else {
          // this.OTCBuySellStyle 当前买卖类型
          // this.selectedOTCAvailableCurrencyCoinID 选中的可用币种id
          // this.checkedCurrencyId 当前选中的可用法币id
          this.$goToPage(`/OTCPublishBuyAndSell/${this.OTCBuySellStyle}/${this.selectedOTCAvailableCurrencyCoinID}/${this.checkedCurrencyId}`)
        }
      }
    },
    // 0.3 点击 购买 或者 出售 按钮跳转到在线购买或者出售页面
    async toOnlineBuyOrSell (id, coinId, userId, countryCode) {
      const CHINA = ['853', '852', '886', '86']
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
      } else {
        // 刷新用户信息
        await this.REFRESH_USER_INFO_ACTION()
        // 未设置交易密码、未实名认证，未高级认证，不能进行交易
        if (!this.userInfo.payPassword) {
          // 去个人中心设置交易密码
          this.$error_tips_X(this.$t('M.otc_index_js'))
          return false
        } else if (!this.userInfo.realname) {
          // 请前往个人中心完成实名认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips'))
          return false
        } else if (!(this.userInfo.advancedAuth === 'pass')) {
          // 请前往个人中心完成高级认证
          this.$error_tips_X(this.$t('M.otc_index_digo_tips_pass'))
          return false
        } if (this.userInfo.otcEnable === 'disable') {
          // 该账号已被禁止交易OTC，请咨询客服
          this.$error_tips_X(this.$t('M.otc_disable_account_tips'))
          return false
        } else {
          if (userId === this.userInfo.id) {
            // 禁止自买自卖
            this.$error_tips_X(this.$t('M.otc_index_forbided_buyand_sell'))
            return false
            // 增加个人用户信息中的国籍和选中的国家对比，如果相同，可以摘单，不相同，不能摘单，给出提示
          } else if (!(CHINA.includes(countryCode) && CHINA.includes(this.userInfo.country)) && !(countryCode == this.userInfo.country)) {
            // 根据您注册所在地的相关规定，无法进行此操作
            this.$error_tips_X(this.$t('M.otc_failure_0094'))
            return false
          } else {
            // id - 挂单id
            // coinId - 币种id
            this.$goToPage(`/OTCOnlineTraderBuySell/${this.OTCBuySellStyle}/${id}/${coinId}`)
          }
        }
      }
    },
    // 0.5 查询更多订单按钮点击事件
    queryMoreOrder () {
      if (!this.isLogin) { // 未登录跳转登录页
        this.$goToPage(`/${this.$routes_X.login}`)
      } else {
        // 登录后：商家用户跳转到商家订单；普通用户跳转到个人中心中的法币订单
        if (this.userInfo.type === 'COMMON') {
          this.CHANGE_USER_CENTER_ACTIVE_NAME('fiat-orders')
          this.$goToPage('/PersonalCenter')
        }
        if (this.userInfo.type === 'MERCHANT') {
          this.$goToPage('/OTCMerchantsOrders')
        }
      }
    },
    // 0.6 解决OTC首页挂单列表剩余数量精度丢失问题
    getOTCRemainingSum (entrustCount, matchCount, symbol) {
      return amendPrecision(entrustCount, matchCount, symbol)
    },
    // 0.7 分页:改变页面刷新挂单列表
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  1.0 otc可用币种查询：我要购买/我要出售的币种列表
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({})
      // 返回数据正确的逻辑
      if (!data) return false
      console.log(data)
      if (data.data) {
        this.IWantToBuySellArr = getNestedData(data, 'data')
        if (this.IWantToBuySellArr.length) {
          // 去掉将FBT放到第一位的逻辑201908013期的需求增加了币种排序参数
          // _.forEach(this.IWantToBuySellArr, (coin, coinIndex) => {
          //   if (coin.name == 'FBT') {
          //     this.IWantToBuySellArr.splice(coinIndex, 1)
          //     this.IWantToBuySellArr.unshift(coin)
          //     return false
          //   }
          // })
          // 个人中心跳转otc-开始
          if (this.$route.params.coinId) {
            let jumpCoinId = this.$route.params.coinId
            if (jumpCoinId && this.IWantToBuySellArr.length) {
              this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(jumpCoinId)
              this.IWantToBuySellArr.forEach((item, index) => {
                if (jumpCoinId == item.coinId) {
                  this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(item.name)
                  this.CHANGE_OTC_AVAILABLE_CURRENCY_UNIT(item.unit)
                  this.selectCurrencyNameStatus = index
                }
              })
            }
          } else {
            // 个人中心跳转otc-结束
            this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[0].name)
            this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[0].coinId)
            this.CHANGE_OTC_AVAILABLE_CURRENCY_UNIT(this.IWantToBuySellArr[0].unit)
          }
        }
      }
    },
    //  2.0 otc可用法币查询
    async getMerchantAvailableLegalTenderList () {
      this.currencyCoinSelectStatus = true // 禁用货币类型select框
      const data = await getMerchantAvailableLegalTender({})
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        this.availableCurrencyId = getNestedData(data, 'data')
        // 第一次进来默认选中人民币，切换之后跳出本页面，再返回本页面显示最后一次切换的法币
        if (this.otcSelectedCurrencyId) {
          this.checkedCurrencyId = this.otcSelectedCurrencyId
          this.availableCurrencyId.forEach(item => {
            if (this.otcSelectedCurrencyId === item.id) {
              this.checkedCurrencyName = item.shortName
            }
          })
        } else {
          this.checkedCurrencyId = getNestedData(this.availableCurrencyId[0], 'id')
          this.checkedCurrencyName = getNestedData(this.availableCurrencyId[0], 'shortName')
        }
        this.currencyCoinSelectStatus = false // 开启货币类型select框
      }
    },
    //  3.0 刚进页面时候 otc主页面查询挂单列表
    getOTCPutUpOrdersList: _.debounce(async function () {
      if (this.selectedOTCAvailableCurrencyCoinID && this.checkedCurrencyId) {
        let param = {
          pageNum: this.currentPage,
          payType: this.checkedPayType, // 按照选中的支付方式查询列表
          coinId: this.selectedOTCAvailableCurrencyCoinID, // 币种id
          currencyId: this.checkedCurrencyId // 法币id
        }
        if (this.OTCBuySellStyle === 'onlineBuy') {
          param.entrustType = 'SELL' // 挂单类型（BUY SELL）
        }
        if (this.OTCBuySellStyle === 'onlineSell') {
          param.entrustType = 'BUY' // 挂单类型（BUY SELL）
        }
        const data = await getOTCPutUpOrders(param)
        // 返回数据正确的逻辑
        if (!data) return false
        if (data.data) {
          let orderListData = getNestedData(data, 'data')
          this.onlineBuySellTableList = getNestedData(orderListData, 'list')
          // 分页
          this.totalPages = getNestedData(orderListData, 'pages') - 0
          // 改变全局 委托定单撤单后，更新首页挂单列表状态
          this.UPDATE_OTC_HOME_LIST_STATUS(false)
        }
      }
    }, 500),
    //  4.0 选中我想购买和出售币种名称
    selectCurrencyName (index) {
      if (this.OTCBuySellStyle === 'onlineBuy') {
        // 清空input框的值
        this.clearInputValue()
      }
      this.currentPage = 1
      this.selectCurrencyNameStatus = index
      this.CHANGE_OTC_AVAILABLE_CURRENCY_NAME(this.IWantToBuySellArr[index].name) // 币种名称
      this.CHANGE_OTC_AVAILABLE_CURRENCY_ID(this.IWantToBuySellArr[index].coinId) // 币种id
      this.CHANGE_OTC_AVAILABLE_CURRENCY_UNIT(this.IWantToBuySellArr[index].unit) // 币种小数位
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
      if (this.isLogin) {
        this.getViewDialogInfo() // 调取查看弹窗信息
      }
    },
    //  6.0 切换在线购买和在线售出状态并调接口渲染列表
    async toggleBuyOrSellStyle (e) {
      console.log(e)
      this.currentPage = 1
      this.OTCBuySellStyle = e
      if (this.OTCBuySellStyle === 'onlineBuy') {
        // 清空input框的值
        this.clearInputValue()
      }
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    //  7.0 改变可用法币的币种id
    changeCurrencyId (e) {
      this.CHANGE_OTC_SELECTED_CURRENCY_ID(e)
      if (this.countryInfoList.length) {
        this.checkedCountryId = this.countryInfoList[this.countryInfoList.length - 1].id // 增加国家-国家为所有国家
      }
      this.CHANGE_OTC_SELECTED_COUNTRY_ID(this.checkedCountryId)
      this.currentPage = 1
      this.checkedCurrencyId = e
      this.availableCurrencyId.forEach(item => {
        if (e === item.id) {
          this.checkedCurrencyName = item.shortName
        }
      })
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
      if (this.isLogin) {
        this.getViewDialogInfo() // 调取查看弹窗信息
      }
    },
    // 9.0 改变支付方式下拉框的选中值
    payWayChangeValue (e) {
      this.currentPage = 1
      this.checkedPayType = e
      this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
    },
    // 10.0 一键买币模块内容方法
    // 切换一键买币选中项类型
    changeOneKeyBuyCoinType (e) {
      // 清空input框的值
      this.clearInputValue()
      // console.log(e) // typeAmount  typeMoney
      this.oneKeyBuyCheckedType = e
    },
    // 改变一键买币input的值
    async changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      let target = this.$refs[ref]
      let pointLength
      if (this.oneKeyBuyCheckedType === 'typeMoney') {
        pointLength = 2
      } else {
        pointLength = this.selectedOTCAvailableCurrencyUnit
      }
      formatNumberInput(target, pointLength)
      // this.getOneKeyBuyInfos()
    },
    getOneKeyBuyInfos: _.debounce(async function () {
      let param = {
        coinId: this.selectedOTCAvailableCurrencyCoinID // 币种id
      }
      if (this.oneKeyBuyCheckedType === 'typeMoney') {
        param.buyAmount = this.$refs.inputValue.value // 买入金额
      } else {
        param.buyCount = this.$refs.inputValue.value // 买入数量
      }
      const data = await getOTCOneTradeEntrustListInfoAjax(param)
      // console.log(data)
      if (!data) return false
      // 输入限制比较
      this.oneTradeMix = getNestedData(data, 'data.min')
      this.oneTradeMax = getNestedData(data, 'data.max')
      console.log(this.oneTradeMix, this.oneTradeMax)
      if (this.oneKeyBuyCheckedType === 'typeMoney') {
        if (this.$refs.inputValue.value - this.oneTradeMix < 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最小下单金额为' + this.oneTradeMix + 'CNY'
        } else if (this.$refs.inputValue.value - this.oneTradeMax > 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最大下单金额为' + this.oneTradeMax + 'CNY'
        } else {
          this.isHaveOneTradeErrorTips = false
          this.oneTradeErrorTips = ''
        }
      } else {
        if (this.$refs.inputValue.value - this.oneTradeMix < 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最小下单数量为' + this.oneTradeMix + this.selectedOTCAvailableCurrencyName
        } else if (this.$refs.inputValue.value - this.oneTradeMax > 0) {
          this.isHaveOneTradeErrorTips = true
          this.oneTradeErrorTips = '最大下单数量为' + this.oneTradeMax + this.selectedOTCAvailableCurrencyName
        } else {
          this.isHaveOneTradeErrorTips = false
          this.oneTradeErrorTips = ''
        }
      }
    }, 500),
    // 清空input框的值
    clearInputValue () {
      this.$refs.inputValue.value = ''
      this.isHaveOneTradeErrorTips = false
      this.oneTradeErrorTips = ''
    },
    // 跳转一键买币页面
    jumpOneTradePage () {
      // 非空验证
      // if (!this.$refs.inputValue.value) {
      //   this.isHaveOneTradeErrorTips = true
      //   this.oneTradeErrorTips = '请输入下单金额或数量'
      //   return false
      // }
      // 有错误提示不能跳转
      // if (this.isHaveOneTradeErrorTips) {
      //   return false
      // }
      this.$router.push({
        path: `/${this.$routes_X.OTCOneTrade}`,
        name: `${this.$routes_X.OTCOneTrade}`,
        params: {
          // 可用币种id
          coinId: this.selectedOTCAvailableCurrencyCoinID,
          // 一键买币交易类型：金额/数量
          purchasingTypes: this.oneKeyBuyCheckedType,
          buyInputValue: this.$refs.inputValue.value ? this.$refs.inputValue.value : ''
        }
      })
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      configInfo: state => state.common.footerInfo.configInfo,
      theme: state => state.common.theme,
      // anchorStatus: state => state.OTC.anchorStatus, // OTC全局定义的锚点状态 默认为false
      publishOrderJumpTopStatus: state => state.OTC.publishOrderJumpTopStatus, // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态 默认为false
      selectedOTCAvailableCurrencyName: state => state.OTC.selectedOTCAvailableCurrencyName,
      // selectedOTCAvailablePartnerCoinId: state => state.OTC.selectedOTCAvailablePartnerCoinId,
      selectedOTCAvailableCurrencyCoinID: state => state.OTC.selectedOTCAvailableCurrencyCoinID,
      selectedOTCAvailableCurrencyUnit: state => state.OTC.selectedOTCAvailableCurrencyUnit,
      language: state => state.common.language, // 当前选中语言
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      isLogin: state => state.user.isLogin, // 用户登录状态 false 未登录； true 登录
      updateOTCHomeListStatus: state => state.OTC.updateOTCHomeListStatus, // 委托定单撤单后，更新首页挂单列表状态
      otcSelectedCountryId: state => state.OTC.otcSelectedCountryId, // otc主页国家列表筛选框选中的国家id
      // otc主页法币列表筛选框选中的法币类型id
      otcSelectedCurrencyId: state => state.OTC.otcSelectedCurrencyId,
      // 是否通过高级认证
      advancedAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.advancedAuth'),
      // 实名认证
      realNameAuth: state => getNestedData(state, 'user.loginStep1Info.userInfo.realNameAuth')
    }),
    isAdvancedAuthSuccess () {
      return this.advancedAuth === 'pass'
    },
    isRealNameAuthSuccess () {
      return this.realNameAuth === 'y'
    }
  },
  watch: {
    updateOTCHomeListStatus (newVal) {
      // console.log(newVal)
      if (newVal) {
        this.getOTCPutUpOrdersList() // otc主页面查询挂单列表
      }
    },
    // otc主页国家列表筛选框选中的国家id
    otcSelectedCountryId (newVal) {
      // console.log(newVal)
    },
    // otc主页法币列表筛选框选中的法
    otcSelectedCurrencyId (newVal) {
      // console.log(newVal)
    }
  },
  destroyed () {
    // 离开本组件清除定时器
    if (this.isDisabledTimer) {
      clearTimeout(this.isDisabledTimer)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../assets/CSS/index";

.otc-box {
  margin-top: 60px;

  > .otc-center-content {
    width: 1300px;
    margin: 36px auto 200px;

    > .otc-online-trading {
      padding-top: 66px;

      > .person-info-box {
        display: flex;
        justify-content: space-between;
        width: 1300px;
        height: 80px;
        padding: 0 30px;
        line-height: 80px;

        > .info-left {
          display: flex;

          > .avatar {
            margin-right: 10px;

            .icon {
              width: 30px;
              height: 30px;
            }
          }

          > .login-before {
            display: flex;

            > .login-text {
              margin-right: 45px;
            }
          }

          > .login-after {
            display: flex;

            > .view-info {
              margin-right: 45px;

              > .person-name {
                margin-right: 10px;
              }
            }

            > .available-count {
              line-height: 90px;
            }
          }
        }
      }

      > .otc-merchant-content {
        margin-top: 30px;

        /* 在线购买和在线出售切换 */
        > .otc-online-buy-and-sell-button {
          height: 54px;
          padding-left: 30px;
          line-height: 54px;
        }

        > .otc-filtrate-publish {
          display: flex;
          justify-content: space-between;
          padding: 10px 30px;

          > .otc-filtrate-box {
            display: flex;
            align-items: center;

            > .otc-filtrate-style {
              > .otc-filtrate-currency-name {
                display: inline-block;
                height: 26px;
                padding: 0 10px;
                margin: 0 10px;
                line-height: 26px;

                &:first-child {
                  margin-left: 0;
                }
              }
            }
          }

          > .otc-publish-box {
            > .pay-style {
              position: relative;

              > .pay-style-icon {
                position: absolute;
                z-index: 2;
                top: 1px;
                left: 10px;
                width: 14px;
                height: 14px;
              }
            }

            > .currency-style {
              position: relative;
              margin-right: 5px;

              > .currency-style-icon {
                position: absolute;
                z-index: 2;
                top: 1px;
                left: 10px;
                width: 14px;
                height: 14px;
              }
            }

            > .country-style {
              position: relative;
              margin-right: 5px;

              > .country-style-icon {
                position: absolute;
                z-index: 2;
                top: 1px;
                left: 10px;
                width: 14px;
                height: 14px;
              }
            }
          }
        }

        /* 一键买币 */
        > .one-key-buy-coin-box {
          display: flex;
          flex: 2;
          justify-content: space-between;
          height: 40px;
          padding: 0 30px;
          margin: 30px 0 22px;
          line-height: 40px;

          > .buy-left {
            display: flex;
            flex: 1;

            > .left-two {
              margin: 0 15px 0 -15px;
            }
          }

          > .buy-right {
            display: flex;
            flex: 1;
            justify-content: space-between;
            padding-left: 120px;

            > .right-one {
              position: relative;

              > .buy-input {
                box-sizing: border-box;
                width: 260px;
                height: 34px;
                padding: 0 50px 0 10px;
              }

              .errorBorder {
                border: 1px solid $upColor;
              }

              > .unit-name {
                position: absolute;
                top: 50%;
                right: 16px;
                transform: translateY(-50%);
              }

              > .one-trade-err-info {
                position: absolute;
                bottom: -30px;
                left: 0;
                width: 430px;
              }
            }

            > .right-three {
              > .one-key-buy-button {
                width: 110px;
                height: 34px;

                > .button-left {
                  .icon {
                    height: 34px;
                  }
                }

                > .button-right {
                  margin-left: -18px;
                }
              }
            }
          }
        }

        > .otc-merchant-list {
          position: relative;
          min-height: 828px;
          margin-top: 20px;

          .red {
            color: $upColor;
          }

          .green {
            color: $otcGreen;
          }

          .first-name {
            height: 49px;

            .top {
              .top-name {
                margin-right: 5px;

                &:hover {
                  color: $mainColor;
                }
              }

              .merchant-icon {
                display: inline-block;
                width: 14px;
                height: 19px;
                vertical-align: top;
                cursor: pointer;
              }
            }

            .bottom {
              font-size: 12px;

              .line {
                display: inline-block;
                width: 1px;
                height: 10px;
                margin: 0 3px;
              }
            }
          }

          .remark-tips {
            position: relative;
            display: inline-block;
            width: 96px;
            height: 32px;
            font-size: 12px;
            line-height: 16px;
            text-align: left;
            vertical-align: middle;
            cursor: pointer;

            .content {
              position: absolute;
              top: 50%;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-wrap: break-word;
              word-break: break-all;
              transform: translateY(-50%);
              -webkit-box-orient: vertical;
              -moz-box-orient: vertical;
              -webkit-line-clamp: 2; /* 设置最大2行，父元素需填写宽度 */
            }
          }

          .xilian {
            vertical-align: middle;
          }

          > .pay-way {
            position: absolute;
            z-index: 1;
            top: 10px;
            left: 616px;
            display: inline-block;
          }
        }

        > .page {
          padding-bottom: 10px;
          margin-top: 20px;
          text-align: center;
        }
      }

      > .trade-rules {
        margin-top: 31px;

        > .rules-header {
          height: 43px;
          padding: 0 30px;
          line-height: 43px;
        }

        > .rules-box {
          padding: 18px 30px 32px;

          > .rules-item {
            line-height: 27px;
          }
        }
      }

      /* 个人信息弹窗 */
      > .person-info-dialog {
        .person-body-content {
          > .photo {
            display: flex;
            justify-content: space-between;
            height: 60px;
            padding: 0 30px;

            > .photo-left {
              padding-top: 10px;

              .icon {
                margin-right: 5px;
              }
            }

            > .photo-right {
              padding-top: 15px;
            }
          }

          > .identity-box {
            display: flex;
            flex-wrap: wrap;
            height: 100px;
            padding: 15px 30px 0 80px;

            > .items {
              width: 33%;
              font-size: 12px;

              .icon {
                width: 24px;
                height: 24px;
              }
            }

            .fifth-item {
              width: 50%;
            }
          }

          > .other-infos {
            display: flex;
            flex-wrap: wrap;
            padding: 25px 30px 0 80px;

            > .bars {
              width: 33%;

              > .bar-top {
                margin-bottom: 6px;
                font-size: 12px;
              }

              > .bar-bottom {
                font-size: 14px;
              }
            }

            > .first-bar,
            .second-bar,
            .third-bar {
              margin-bottom: 25px;
            }
          }
        }
      }
    }

    > .otc-order-manage {
      position: relative;
      margin-top: 50px;

      .trading-order-right-arrow {
        position: absolute;
        top: 33px;
        left: 82px;
        color: $mainColor;
      }

      .trading-order-sand-clock {
        position: absolute;
        z-index: 11;
        top: 0;
        left: 0;
      }

      > .more {
        position: absolute;
        top: 440px;
        display: inline-block;
        width: 90px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
      }

      .otc-tab-pane-arrow-right {
        position: absolute;
        top: 27px;
        right: -12px;
        font-size: 20px;
      }

      .icon {
        position: absolute;
        top: 22px;
        left: 35px;
      }
    }
  }

  /deep/ {
    /* 发布订单按钮 */
    .person-info-box {
      .el-button {
        padding: 9px 15px;
        border: 0;
        font-size: 12px;
      }
    }

    .el-input__icon {
      font-size: 12px;
      line-height: 30px;
    }

    /* 在线购买和在线出售切换 */
    .otc-online-buy-and-sell-button {
      .el-radio-button__inner {
        height: 36px;
        padding: 0;
        border: 0;
        border-radius: 0;
        font-weight: 700;
        font-size: 16px;
        line-height: 36px;
      }

      .el-radio-button {
        &:first-child {
          position: relative;

          &::after {
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            height: 10px;
            background-color: #6e778d;
            transform: translateY(-50%);
            content: '';
          }

          .el-radio-button__inner {
            padding-left: 0;
            margin-right: 15px;
          }
        }

        &:last-child {
          .el-radio-button__inner {
            margin-left: 15px;
          }
        }
      }
    }

    .otc-publish-box {
      .el-input {
        width: 110px;
      }

      .el-input__inner {
        height: 30px;
        border: 0;
        font-size: 12px;
        line-height: 30px;
      }

      .el-input--suffix {
        .el-input__inner {
          padding: 2px 28px;
        }
      }
    }

    /* 一键买币模块 */
    .one-key-buy-coin-box {
      .buy-right {
        .right-two {
          .one-key-buy-select {
            .el-input__inner {
              width: 150px;
              height: 34px;
              border: none;
              border-radius: 2px;
              font-size: 12px;
            }

            .el-input__icon {
              line-height: 40px;
            }
          }
        }
      }
    }

    .otc-merchant-list {
      .el-table {
        .el-table__header {
          thead {
            font-size: 12px;

            tr {
              th {
                &:first-child {
                  .cell {
                    padding-left: 30px;
                  }
                }

                &:nth-last-child(2) {
                  .cell {
                    padding-right: 30px;
                  }
                }

                .cell {
                  padding: 0;
                }
              }
            }
          }
        }

        .el-table__body {
          tr {
            td {
              padding: 15px 0;

              .cell {
                padding: 0;
                line-height: 24px;
              }

              &:first-child {
                .cell {
                  padding-left: 30px;
                }
              }

              &:nth-last-child(1) {
                .cell {
                  padding-right: 30px;
                }
              }
            }
          }

          .el-button--danger.is-disabled {
            border-color: #e4b1a7;
            background-color: #e4b1a7;
          }

          .el-button--success.is-disabled {
            border-color: #8ead9e;
            background-color: #8ead9e;
          }

          /* 鼠标悬浮购买出售按钮增加背景色 */
          .el-button--danger {
            &:hover {
              background-color: #dc4d4d !important;
            }
          }

          .el-button--success {
            &:hover {
              background-color: #00807b !important;
            }
          }

          .el-button--mini {
            height: 30px;
            padding: 7px 10px;
          }
        }

        .el-table__empty-block {
          height: 760px;
        }
      }

      .el-table__column-filter-trigger {
        i {
          font-weight: 700;
          font-size: 14px;
        }
      }
    }

    .el-tabs__active-bar {
      height: 0 !important;
    }

    .el-tabs__nav-wrap {
      overflow: visible;

      &::after {
        background-color: transparent;
      }
    }

    .el-tabs__item {
      height: 45px;
      padding: 0;
      font-size: 12px;
      line-height: 45px;
    }

    .el-tabs--left {
      .el-tabs__item {
        &.is-left {
          width: 90px;
          height: 84px;
          line-height: 110px;
          text-align: center;
        }
      }

      .el-tabs__header {
        &.is-left {
          margin-right: 16px;
        }
      }
    }

    .el-tabs__nav-scroll {
      overflow: visible;
    }

    /* 个人信息弹窗 */
    .person-info-dialog {
      .el-dialog {
        width: 550px !important;
        height: 360px;
        border-radius: 4px;

        .el-dialog__header {
          .el-dialog__headerbtn {
            top: 10px;
            right: 10px;
            padding: 0;
          }
        }

        .el-dialog__body {
          padding: 0;
        }
      }
    }

    /* 未实名认证弹窗 */
    .warning {
      .el-dialog__wrapper {
        @include centerHorizontally;

        .el-dialog {
          margin-top: 0 !important;
        }
      }

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

      .el-dialog {
        width: 350px;
        border-radius: 5px;
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

      .el-dialot__body {
        text-align: center;
      }

      .el-dialog__footer {
        margin-top: 20px;
        text-align: center;
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .otc-center-content {
      > .otc-online-trading {
        > .person-info-box {
          color: #838ea6;
          background-color: $mainContentNightBgColor;
          box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

          > .info-left {
            > .login-before {
              > .login-text {
                color: $mainColor;
              }
            }

            > .login-after {
              > .view-info {
                > .person-name {
                  color: $mainColorOfWhite;
                }

                > .view-text {
                  color: $mainColor;
                }
              }
            }
          }
        }

        > .otc-merchant-content {
          background-color: $mainContentNightBgColor;
          box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

          > .otc-filtrate-publish {
            box-shadow: 0 3px 4px 0 #191e28;

            > .otc-filtrate-box {
              > .otc-filtrate-style {
                color: #838ea6;

                .currencyNameActived {
                  color: $mainColorOfWhite;
                  background-color: $mainColor;
                }
              }
            }

            > .otc-publish-box {
              > .pay-style {
                > .pay-style-icon {
                  color: $mainColor;
                }
              }

              > .currency-style {
                > .currency-style-icon {
                  color: $mainColor;
                }
              }

              > .country-style {
                > .country-style-icon {
                  color: $mainColor;
                }
              }
            }
          }

          /* 一键买币 */
          > .one-key-buy-coin-box {
            color: $dialogColor9;

            > .buy-left {
              > .left-one {
                .icon {
                  color: $mainColor;
                }
              }

              > .left-two {
                color: $mainColor;
              }
            }

            > .buy-right {
              > .right-one {
                > .buy-input {
                  color: $mainColorOfWhite;
                  background-color: #2c3048;
                }

                .errorBorder {
                  border: 1px solid $upColor;
                }

                > .one-trade-err-info {
                  color: $upColor;
                }
              }

              > .right-three {
                > .one-key-buy-button {
                  background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);

                  > .button-left {
                    .icon {
                      color: $mainColorOfWhite;
                    }
                  }

                  > .button-right {
                    color: $mainColorOfWhite;
                  }
                }
              }
            }
          }

          > .otc-merchant-list {
            background-color: $mainContentNightBgColor;

            .first-name {
              .bottom {
                color: $mainNightTitleColor;

                .line {
                  background-color: $mainNightTitleColor;
                }
              }
            }

            .remark-tips {
              color: $mainNightTitleColor;
            }
          }

          > .page {
            background-color: $mainContentNightBgColor;
          }
        }

        > .trade-rules {
          background: $mainContentNightBgColor;
          box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

          > .rules-header {
            border-bottom: 1px solid rgba(97, 116, 153, .2);
            color: $mainColor;
          }

          > .rules-box {
            color: #a9bed4;
          }
        }

        /* 个人信息弹窗黑色 */
        > .person-info-dialog {
          .person-body-content {
            > .photo {
              border-bottom: 1px solid #34415e;

              > .photo-left {
                > .person-name {
                  color: $mainColorOfWhite;
                }
              }

              > .photo-right {
                > .time-top {
                  color: $dialogColor9;
                }

                > .time-bottom {
                  color: $dialogColor9;
                }
              }
            }

            > .identity-box {
              box-shadow: 0 2px 6px 0 rgba(32, 36, 55, 1);

              > .items {
                color: $mainColorOfWhite;

                .icon {
                  color: $mainColor;
                }
              }

              > .unverified {
                color: $dialogColor9 !important;

                .icon {
                  color: $dialogColor9 !important;
                }
              }
            }

            > .other-infos {
              > .bars {
                > .bar-top {
                  color: $dialogColor9;
                }

                > .bar-bottom {
                  color: $mainColorOfWhite;
                }
              }
            }
          }
        }
      }

      > .otc-order-manage {
        > .more {
          color: $mainColor;
        }

        .otc-tab-pane-arrow-right {
          color: $mainColor;
        }
      }
    }

    /deep/ {
      /* 一键买币模块 */
      .one-key-buy-coin-box {
        .buy-right {
          .right-two {
            .one-key-buy-select {
              .el-input__inner {
                background-color: #2c3048;
              }
            }
          }
        }
      }

      /* 发布订单按钮 */
      .person-info-box {
        .el-button {
          background: $nightButtonBgColor1;
        }
      }

      .el-input--suffix .el-input__inner {
        color: $dialogColor4;
      }

      /* 在线购买和在线出售切换 */
      .otc-online-buy-and-sell-button {
        .el-radio-button__inner {
          color: #838ea6;
          background: transparent;
        }

        .el-radio-button {
          &.is-active {
            .el-radio-button__inner {
              border-bottom: 1px solid $mainColor;
              color: $mainColor;
            }
          }
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          box-shadow: -1px 0 0 0 transparent;
        }
      }

      .otc-publish-box {
        .el-input__inner {
          border: 1px solid #4a4e68;
          background-color: #19202e;
        }
      }

      .otc-merchant-list {
        .el-table {
          color: $mainColorOfWhite;
          background-color: $mainContentNightBgColor;

          tr {
            background-color: $mainContentNightBgColor;
          }

          th {
            background-color: $mainContentNightBgColor;

            &.is-leaf {
              border-bottom: 1px solid rgba(97, 116, 153, .05);
            }

            > .cell {
              &.highlight {
                color: #617499;
              }
            }
          }

          td {
            border-bottom: 1px solid rgba(97, 116, 153, .05);
          }

          .el-table__header {
            thead {
              color: $mainNightTitleColor;
            }
          }

          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: $mainContentNightBgColor;
                }
              }
            }

            .el-button--danger {
              border-color: $upColor;
              background-color: $upColor;
            }

            .el-button--success {
              border-color: $otcGreen;
              background-color: $otcGreen;
            }
          }

          .el-table__empty-block {
            background-color: $mainContentNightBgColor;

            .el-table__empty-text {
              color: rgba(255, 255, 255, .8);
            }
          }
        }
      }

      .el-table__column-filter-trigger {
        i {
          color: $mainColor;
        }
      }

      .el-tabs__item {
        color: #4f85da;

        &.is-active {
          color: $mainColorOfWhite;
          background-color: $mainColor;
        }
      }

      /* 个人信息弹窗黑色 */
      .person-info-dialog {
        .el-dialog__wrapper {
          background-color: rgba(0, 0, 0, .7);
        }

        .el-dialog {
          background-color: $dialogColor1;
        }
      }

      .warning {
        .el-dialog__wrapper {
          background-color: rgba(11, 12, 20, .5);

          .el-dialog {
            margin-top: 0 !important;
            background-color: #28334a;

            .button-color {
              color: rgba(255, 255, 255, 1);
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
            }

            .btn {
              border: 1px solid #338ff5;
              color: #fff;
              background-color: transparent;
            }
          }
        }
      }
    }
  }

  &.day {
    background-color: $mainBgColorOfDay;

    > .otc-center-content {
      > .otc-online-trading {
        > .person-info-box {
          color: $dayMainTitleColor;
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px #cfd5df;

          > .info-left {
            > .login-before {
              > .login-text {
                color: $mainColor;
              }
            }

            > .login-after {
              > .view-info {
                > .person-name {
                  color: $dayMainTitleColor;
                }

                > .view-text {
                  color: $mainColor;
                }
              }
            }
          }
        }

        > .otc-merchant-content {
          background-color: $mainDayBgColor;
          box-shadow: 0 0 6px $boxShadowColorOfDay;

          > .otc-filtrate-publish {
            > .otc-filtrate-box {
              > .otc-filtrate-style {
                color: #838ea6;

                .currencyNameActived {
                  color: $mainColorOfWhite;
                  background-color: $mainColor;
                }
              }
            }

            > .otc-publish-box {
              > .pay-style {
                > .pay-style-icon {
                  color: $mainColor;
                }
              }

              > .currency-style {
                > .currency-style-icon {
                  color: $mainColor;
                }
              }

              > .country-style {
                > .country-style-icon {
                  color: $mainColor;
                }
              }
            }
          }

          /* 一键买币 */
          > .one-key-buy-coin-box {
            color: $dayMainTitleColor;

            > .buy-left {
              > .left-one {
                .icon {
                  color: $mainColor;
                }
              }

              > .left-two {
                color: $mainColor;
              }
            }

            > .buy-right {
              > .right-one {
                > .buy-input {
                  color: $dialogColor9;
                  background-color: #e8edf4;
                }

                .errorBorder {
                  border: 1px solid $upColor;
                }

                > .one-trade-err-info {
                  color: $upColor;
                }
              }

              > .right-three {
                > .one-key-buy-button {
                  background: linear-gradient(-88deg, rgba(52, 137, 219, 1) 0%, rgba(101, 178, 241, 1) 100%);

                  > .button-left {
                    .icon {
                      color: $mainColorOfWhite;
                    }
                  }

                  > .button-right {
                    color: $mainColorOfWhite;
                  }
                }
              }
            }
          }

          > .otc-merchant-list {
            .first-name {
              .bottom {
                color: $fontColorSecondaryOfDay;

                .line {
                  background-color: $fontColorSecondaryOfDay;
                }
              }
            }

            .remark-tips {
              color: $fontColorSecondaryOfDay;
            }
          }
        }

        > .trade-rules {
          background: $mainColorOfWhite;
          box-shadow: 0 0 6px $borderColorOfDay;

          > .rules-header {
            border-bottom: 1px solid rgba(97, 116, 153, .2);
            color: $mainColor;
          }

          > .rules-box {
            color: $dayMainTitleColor;
          }
        }

        /* 个人信息弹窗白色 */
        > .person-info-dialog {
          .person-body-content {
            > .photo {
              border-bottom: 1px solid rgba(97, 116, 153, .1);

              > .photo-left {
                > .person-name {
                  color: $dayMainTitleColor;
                }
              }

              > .photo-right {
                > .time-top {
                  color: $dialogColor9;
                }

                > .time-bottom {
                  color: $dialogColor9;
                }
              }
            }

            > .identity-box {
              box-shadow: 0 2px 2px 0 rgba(240, 240, 240, 1);

              > .items {
                color: $mainColor;

                .icon {
                  color: $mainColor;
                }
              }

              > .unverified {
                color: $dialogColor9 !important;

                .icon {
                  color: $dialogColor9 !important;
                }
              }
            }

            > .other-infos {
              > .bars {
                > .bar-top {
                  color: $dialogColor9;
                }

                > .bar-bottom {
                  color: $dayMainTitleColor;
                }
              }
            }
          }
        }
      }

      > .otc-order-manage {
        > .more {
          color: $mainColor;
        }

        .otc-tab-pane-arrow-right {
          color: $mainColor;
        }
      }
    }

    /deep/ {
      /* 一键买币模块 */
      .one-key-buy-coin-box {
        .buy-right {
          .right-two {
            .one-key-buy-select {
              .el-input__inner {
                background-color: #e8edf4;
              }
            }
          }
        }
      }

      .warning {
        .el-dialog__wrapper {
          background-color: rgba(204, 204, 204, .5);

          .button-color {
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }

          .warning-text {
            color: #333;
          }

          .btn {
            border: 1px solid #338ff5;
            color: #333;
            background-color: transparent;
          }
        }
      }

      /* 发布订单按钮 */
      .person-info-box {
        .el-button {
          background: $dayButtonBgColor2;
        }
      }

      .el-input--suffix .el-input__inner {
        color: $dayMainTitleColor;
      }

      /* 在线购买和在线出售切换 */
      .otc-online-buy-and-sell-button {
        .el-radio-button__inner {
          color: #838ea6;
          background: transparent;
        }

        .el-radio-button {
          &.is-active {
            .el-radio-button__inner {
              border-bottom: 1px solid $mainColor;
              color: $mainColor;
            }
          }
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          box-shadow: -1px 0 0 0 transparent;
        }
      }

      .otc-publish-box {
        .el-input__inner {
          border: 1px solid $borderColorOfDay;
          background-color: $mainColorOfWhite;
        }
      }

      .otc-merchant-list {
        .el-table {
          color: $dayMainTitleColor;

          th {
            background-color: $mainColorOfWhite;

            &.is-leaf {
              border-bottom: 1px solid $borderColorOfDay;
            }

            > .cell {
              &.highlight {
                color: #617499;
              }
            }
          }

          tr {
            background-color: $mainColorOfWhite;
          }

          td {
            border-bottom: 1px solid rgba(97, 116, 153, .1);
          }

          .el-table__header {
            thead {
              color: $fontColorSecondaryOfDay;
            }
          }

          .el-table__body {
            tr {
              &:hover {
                > td {
                  background-color: $mainColorOfWhite;
                }
              }
            }

            .el-button--danger {
              border-color: $upColor;
              background-color: $upColor;
            }

            .el-button--success {
              border-color: $otcGreen;
              background-color: $otcGreen;
            }
          }

          .el-table__empty-block {
            background-color: $mainColorOfWhite;

            .el-table__empty-text {
              color: $dayMainTitleColor;
            }
          }
        }
      }

      .el-table__column-filter-trigger {
        i {
          color: $mainColor;
        }
      }

      .el-tabs__item {
        color: $mainColor;

        &.is-active {
          color: $mainColorOfWhite;
          background-color: $mainColor;
        }
      }

      /* 个人信息弹窗白色 */
      .person-info-dialog {
        .el-dialog__wrapper {
          background-color: rgba(0, 0, 0, .7);
        }

        .el-dialog {
          background-color: $mainColorOfWhite;
        }
      }
    }
  }
}
</style>
