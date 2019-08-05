<template>
  <div
    class="fiat-trading-order-box personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 交易中订单 -->
    <div class="fiat-trading-order-content">
      <!-- 一、交易中订单 -->
      <div
        class="order-list"
        v-for="(item, index) in tradingOrderList"
        :key="index"
      >
        <!-- 订单列表 ：1.0 买单 -->
        <div
          class="order"
          v-if="!showOrderAppeal[index] && item.orderType === 'BUY'"
        >
          <!-- 1.1 表头 -->
          <div class="order-list-head">
            <div class="left">
              <!-- 卖家 -->
              <div class="buyer-seller">
                <!--卖家-->
                {{$t('M.otc_seller')}}：
                <span
                  class="cursor-pointer"
                  @click="jumpMerchantInfoPage(item.sellId)"
                >
                  <span>
                    {{item.sellNickName}}
                  </span>
                </span>
              </div>
              <!--广告id-->
              <div class="AD-ID">
                {{$t('M.otc_AD_ID')}}：{{item.entrustSequence}}
              </div>
              <!-- 订单号 -->
              <div class="order-id">
                <!--订单号-->
                {{$t('M.otc_MerchantsOrders_orderNum')}}：{{item.orderSequence}}
              </div>
              <!-- 挂单时间 -->
              <div class="deal-time">
                <!--挂单时间-->
                {{$t('M.otc_entrust_time')}}：{{item.createTime}}
              </div>
              <div class="order-list-head-icon buy-icon"></div>
              <div class="buy-sell-icon">
                <!--买-->
                {{$t('' + 'M.comm_bid')}}
              </div>
            </div>
            <div class="right">
              <!-- otc 及时通讯 -->
              <OTCIM
                class="otc-im"
                :orderInfo="item"
                :top="OTC_IM_TOP"
                activeName="TRADING"
              />
            </div>
          </div>
          <!-- 1.2 表身体 -->
          <div class="order-list-body">
            <!-- 1.2.1 表左侧 -->
            <div class="order-list-body-left">
              <!-- logo图标和名字 -->
              <div class="logo">
                <img
                  :src="item.coinUrl"
                  width="30"
                  class="logo-icon"
                >
                <p class="logo-name">
                  {{item.coinName}}
                </p>
              </div>
              <div class="left-info">
                <!-- 金额 -->
                <p class="trade-info">
                  <span>
                    <!--金额-->
                    {{$t('M.comm_money')}}：
                  </span>
                  <span class="money">
                    {{item.symbol}}{{item.payAmount}}
                  </span>
                </p>
                <!-- 单价 -->
                <p class="trade-info">
                  <span>
                    <!--单价-->
                    {{$t('M.otc_index_UnitPrice')}}：{{item.price}}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>
                    <!--数量-->
                    {{$t('M.comm_count')}}：{{item.pickCount}}
                  </span>
                </p>
                <!-- 卖家姓名 -->
                <p class="trade-info">
                  {{$t('M.otc_trading_seller_name')}}：{{item.sellName}}
                </p>
                <!-- 卖家手机号 -->
                <p class="trade-info">
                  <!--卖家手机号-->
                  {{$t('M.otc_trading_sellphone')}}：{{item.sellPhone}}
                </p>
              </div>
            </div>
            <!-- 1.2.2 表中部 -->
            <div class="order-list-body-middle">
              <!-- 付款前 -->
              <div
                class="middle-content"
                v-if="item.status == 'PICKED'"
              >
                <div class="trader-info display-inline-block">
                  <!-- 选择支付方式 -->
                  <div class="pay-style">
                    <div class="qiandai-icon">
                      <IconFontCommon
                        iconName="icon-qiandai"
                        class="pay-style-icon"
                      />
                    </div>
                    <!--选择支付方式-->
                    <el-select
                      class="select-pay-type"
                      :placeholder="$t('M.otc_MerchantsOrders_chouse') + $t('M.otc_index_Payment_method')"
                      :no-data-text="$t('M.comm_no_data')"
                      v-model="activePayModeList[index]"
                      @change="changeUserBankInfo(index)"
                    >
                      <el-option
                        v-for="item1 in item.userBankList"
                        :key="item1.id"
                        :label="language === 'zh_CN'? item1.bankName : item1.bankType"
                        :value="item1.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <!-- 收款人 -->
                  <p class="bank-info">
                    <!--取userBankList中的realname-->
                    <span>
                      <span v-if="activeBankType[index]">
                        {{$t('M.otc_payee')}}:
                      </span>
                      <span>
                        {{checkedPayRealNameArr[index]}}
                      </span>
                    </span>
                  </p>
                  <!-- 开户行 -->
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Bankcard'"
                  >
                    <span>
                      <!--开户行-->
                      {{$t('M.otc_opening_bank')}}:
                    </span>
                    <span>
                      {{activeBankProv[index]}}{{activeBankCity[index]}}{{activeBankDetailAddress[index]}}
                    </span>
                  </p>
                  <!-- 账户 -->
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Bankcard'"
                  >
                    <span>
                      <!--账&nbsp;&nbsp;&nbsp;户-->
                      {{$t('M.user_google_account')}}:{{activedPayAccountArr[index]}}
                    </span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Alipay'"
                  >
                    <span>
                      <!--支付宝账户-->
                      {{$t('M.comm_alipay')}}{{$t('M.user_google_account')}}:
                    </span>
                    <span>{{activedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Wechat'"
                  >
                    <span>
                      <!--微信账户/-->
                      {{$t('M.comm_weixin')}}{{$t('M.user_google_account')}}:
                    </span>
                    <span>{{activedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'PAYPAL'"
                  >
                    <span>
                      <!--paypal账户-->
                      {{$t('M.user_account_paypal')}}{{$t('M.user_google_account')}}:
                    </span>
                    <span>{{activedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'WestUnion'"
                  >
                    <span>
                      <!--西联汇款账户-->
                      {{$t('M.user_account_western_union')}}{{$t('M.user_google_account')}}::
                    </span>
                    <span>{{activedPayAccountArr[index]}}</span>
                  </p>
                </div>
                <!-- 扫码支付 activeBankCode[index]  :src="item.coinUrl"-->
                <div
                  class="bank-info-picture display-inline-block"
                  v-if="activeBankType[index] === 'Wechat' || activeBankType[index] === 'Alipay'">
                  <div class="picture-box">
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <img
                        width="140"
                        height="200"
                        :src="activeBankCode[index]"
                      >
                      <!-- src="../../assets/develop/weixin.png" -->
                      <el-button slot="reference">
                        <!--扫码支付-->
                        {{$t('M.otc_tradingorder')}}
                      </el-button>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 付款后 -->
              <div
                class="middle-content"
                v-if="item.status == 'PAYED'"
              >
                <div class="trader-info display-inline-block">
                  <p class="bankMoneyInfo">
                    <span
                      v-if="item.payType === 'Bankcard'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-yinhangqia"
                      />
                      <!--银行卡已付款-->
                      {{$t('M.otc_trading_bankmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Alipay'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-zhifubao1"
                      />
                      <!--支付宝已付款-->
                      {{$t('M.otc_trading_alipay_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Wechat'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-weixin1"
                      />
                      <!--微信已付款-->
                      {{$t('M.otc_trading_wechat_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'WestUnion'"
                    >
                      <img src="../../../assets/user/xilian.png" alt="" class="xilian">
                      <!--西联汇款已付款-->
                       {{$t('M.otc_trading_xilianmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'PAYPAL'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-paypal"
                      />
                      <!--PAYPAL已付款-->
                      {{$t('M.user_account_paypal')}}{{$t('M.otc_enum_status_yifukuan')}}
                    </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      <!--转账金额-->
                      {{$t('M.otc_tradingorder_transformAcconu')}}:
                    </span><span>
                    {{item.symbol}}{{item.payAmount}}
                  </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      <!--账&nbsp;&nbsp;&nbsp;户-->
                      {{ $t('M.user_account_number') }}:
                    </span>
                    <span>{{item.payAcctount}}</span>
                  </p>
                </div>
                <!-- 扫码支付 qrCodeUrl  :src="item.coinUrl"-->
                <div
                  class="bank-info-picture display-inline-block"
                  v-if="item.payType === 'Alipay' || item.payType === 'Wechat'"
                >
                  <div class="picture-box">
                    <el-popover
                      placement="bottom"
                      trigger="click"
                    >
                      <img
                        width="140"
                        height="200"
                        :src="item.qrCodeUrl"
                      >
                      <!-- src="../../assets/develop/weixin.png" -->
                      <el-button slot="reference">
                        <!--扫码支付-->
                        {{$t('M.otc_tradingorder')}}
                      </el-button>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
            <!-- 1.2.3 表右部 -->
            <div class="order-list-body-right">
              <!-- 付款前 -->
              <div
                class="right-content"
                v-if="item.status == 'PICKED' && item.orderType === 'BUY'"
              >
                <!-- 等待付款确认付款按钮 -->
                <p class="action-tips">
                  <span class="wait-pay">
                    <!--等待付款-->
                    <!--{{$t('M.otc_waiting_payment')}}-->
                    <button
                      class="cancelOrderButton border-radius2 cursor-pointer"
                      @click="cancelOrderBeforePayFor(item.id)"
                    >
                      <!--取消订单-->
                      {{$t('M.otc_trading_cancel_order_text')}}
                    </button>
                  </span>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="confirmPayMoney(index)"
                  >
                    <!--确认付款-->
                    {{$t('M.otc_trading_confirmpayment')}}
                  </el-button>
                  <!-- 自动取消倒计时 -->
                  <span class="count-time">
                    <IconFontCommon
                      class="font-size16 wait-pay"
                      iconName="icon-daojishi"
                    />
                    <span v-if="cancelOrderTimeArr[index]">{{BIHTimeFormatting(cancelOrderTimeArr[index])}}</span>
                    <span v-else>--</span>
                  </span>
                </p>
                <!-- 注意 -->
                <p class="action-tips">
                  <!--注意！计时结束前未手动转账并点击"确认付款"，您的订单将自动取消，若上述情况累计出现3次，您的账户将被冻结24小时。-->
                  {{$t('M.otc_tradingorder_notice1')}}{{configInfo.otcUnpaidTimes}}{{$t('M.otc_tradingorder_notice2')}}
                </p>
              </div>
              <!-- 付款后 -->
              <div
                class="right-content"
                v-if="item.status == 'PAYED' && item.orderType === 'BUY'"
              >
                <p class="action-tips submitted-confirm-payment">
                  <!--已提交确认付款-->
                  {{$t('M.otc_confirmed_receipts')}}
                  <el-button
                    size="mini"
                    class="buy-appeal-order"
                    @click="orderAppeal(item.id, index, item.orderType)"
                    v-if="buyerAppealButtonStatus[index]"
                  >
                    <!-- 订单申诉 -->
                    {{$t('M.otc_complaint')}}
                  </el-button>
                </p>
                <p class="action-tips">
                  <!--注意！请联系卖家确认收款并确认订单，如果卖家{{item.completeTerm/3600}}小时内未确认订单，系统自动成交。-->
                  {{$t('M.otc_warm_prompt0')}}{{item.completeTerm/3600}}{{$t('M.otc_warm_prompt00')}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 订单列表 ：2.0 卖单 -->
        <div
          class="order"
          v-if="!showOrderAppeal[index] && item.orderType === 'SELL'"
        >
          <!-- 2.1 表头 -->
          <div class="order-list-head">
            <div class="left">
              <!-- 买家 -->
              <div class="buyer-seller">
                <!--买家-->
                {{$t('M.otc_buyer')}}：
                <span
                  class="cursor-pointer"
                  @click="jumpMerchantInfoPage(item.buyId)"
                >
                  <span>
                    {{item.buyNickName}}
                  </span>
                </span>
              </div>
              <!--广告id-->
              <div class="AD-ID">
                {{$t('M.otc_AD_ID')}}：{{item.entrustSequence}}
              </div>
              <!-- 订单号 -->
              <div class="order-id">
                <!--订单号-->
                {{$t('M.otc_MerchantsOrders_orderNum')}}：{{item.orderSequence}}
              </div>
              <!-- 挂单时间 -->
              <div class="deal-time">
                <!--挂单时间-->
                {{$t('M.otc_entrust_time')}}：{{item.createTime}}
              </div>
              <div class="order-list-head-icon sell-icon"></div>
              <div class="buy-sell-icon">
                <!--卖-->
                {{$t('M.comm_ask')}}
              </div>
            </div>
            <div class="right">
              <!-- otc 及时通讯 -->
              <OTCIM
                class="otc-im"
                :orderInfo="item"
                :top="OTC_IM_TOP"
                activeName="TRADING"
              />
            </div>
          </div>
          <!-- 2.2 表身体 -->
          <div class="order-list-body">
            <!-- 2.2.1 表左侧 -->
            <div class="order-list-body-left">
              <div class="logo">
                <img
                  :src="item.coinUrl"
                  width="30"
                  class="logo-icon"
                >
                <p class="logo-name">{{item.coinName}}</p>
              </div>
              <div class="left-info">
                <!-- 金额 -->
                <p class="trade-info">
                  <span>
                    <!--金额-->
                    {{$t('M.comm_money')}}：
                  </span>
                  <span class="money">
                    {{item.symbol}}{{item.payAmount}}
                  </span>
                </p>
                <!-- 单价 -->
                <p class="trade-info">
                  <span>
                    <!--单价-->
                    {{$t('M.otc_index_UnitPrice')}}：{{item.price}}
                  </span>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <span>
                    <!--数量-->
                    {{$t('M.comm_count')}}：{{item.pickCount}}
                  </span>
                </p>
                <!-- 买家姓名 -->
                <p class="trade-info">
                  {{$t('M.otc_trading_buyer_name')}}：{{item.buyName}}
                </p>
                <!-- 买家手机号 -->
                <p class="trade-info">
                  <!--买家手机号-->
                  {{$t('M.otc_trading_buyphone')}}：{{item.buyPhone}}
                </p>
              </div>
            </div>
            <!-- 2.2.2 表中部 -->
            <div class="order-list-body-middle">
              <!-- 付款前 -->
              <div
                class="middle-content"
                v-if="item.status == 'PICKED'"
              >
                <div class="trader-info display-inline-block">
                  <p class="order-cancel-tips">
                    <!--订单生成后{{item.cancelTerm/60}}分钟内对方未提交付款，订单将自动取消-->
                    {{$t('M.otc_tradingorder_orderExact')}}{{item.cancelTerm/60}}{{$t('M.otc_tradingorder_autoCancel')}}
                  </p>
                </div>
              </div>
              <!-- 付款后 -->
              <div class="middle-content"
                v-if="item.status == 'PAYED'"
              >
                <div class="trader-info display-inline-block">
                  <p class="bankMoneyInfo">
                    <span
                      v-if="item.payType === 'Bankcard'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-yinhangqia"
                      />
                      <!--银行卡已付款-->
                      {{$t('M.otc_trading_bankmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Alipay'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-zhifubao1"
                      />
                      <!--支付宝已付款-->
                      {{$t('M.otc_trading_alipay_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Wechat'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-weixin1"
                      />
                      <!--微信已付款-->
                      {{$t('M.otc_trading_wechat_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'WestUnion'"
                    >
                      <img src="../../../assets/user/xilian.png" alt="" class="xilian">
                      <!--西联汇款已付款-->
                      {{$t('M.otc_trading_xilianmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'PAYPAL'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-paypal"
                      />
                      <!--PAYPAL已付款-->
                      PAYPAL{{$t('M.otc_enum_status_yifukuan')}}
                    </span>
                    <!-- <IconFontCommon
                      iconName="icon-yinhangqia"
                    />
                    <span>银行卡已付款22</span> -->
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      <!--转账金额-->
                      {{$t('M.otc_tradingorder_transformAcconu')}}:
                    </span>
                    <span>
                      {{item.symbol}}{{item.payAmount}}
                    </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      <!--账&nbsp;&nbsp;&nbsp;户-->
                      {{$t('M.user_account_number')}}:
                    </span>
                    <span>{{item.payAcctount}}</span>
                  </p>
                </div>
              </div>
            </div>
            <!-- 2.2.3 表右部 -->
            <div class="order-list-body-right">
              <!-- 付款前 -->
              <div
                class="right-content"
                v-if="item.status == 'PICKED' && item.orderType === 'SELL'"
              >
                <p class="action-explain">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="gatheringBefore"
                  >
                    <!--确认收款-->
                    {{$t('M.otc_trading_collectionconfirmation')}}
                  </el-button>
                </p>
                <p class="action-explain">
                  <!--等待买家付款-->
                  {{$t('M.otc_waiting_buyer_payment')}}。
                </p>
              </div>
              <!-- 付款后 -->
              <div
                class="right-content"
                v-if="item.status == 'PAYED' && item.orderType === 'SELL'"
              >
                <p class="action-explain">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="confirmGatherMoney(item.id)"
                    style="font-size: 12px;"
                  >
                    <!--:disabled="sellerTimeOutDisabled[index]"20190508更改卖家超时仍可以收款-->
                    <!--确认收款-->
                    {{$t('M.otc_trading_collectionconfirmation')}}
                  </el-button>
                  <span class="appeal-button-sell">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="orderAppeal(item.id, index, item.orderType)"
                    >
                    <!--订单申诉-->
                    {{$t('M.otc_complaint')}}
                  </el-button>
                  </span>
                </p>
                <p class="action-explain">
                  <!--买家付款已付款-->
                  {{$t('M.otc_trading_sellermoney')}}
                </p>
                <!-- 自动成交倒计时 -->
                <p class="action-explain count-down-time">
                  <span>
                    <IconFontCommon
                      class="font-size16 timeIcon"
                      iconName="icon-daojishi"
                    />
                  </span>
                  <span class="remaining-time">
                    <span v-if="accomplishOrderTimeArr[index] - 0 > 0">
                      {{BIHTimeFormatting(accomplishOrderTimeArr[index])}}
                    </span>
                    <span v-else>00ˋ00′00″</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- 订单申诉 ：3.0 申诉-->
        <div
          class="appeal"
          v-if="showOrderAppeal[index]"
        >
          <!-- 申诉表头 -->
          <div class="appeal-head">
            <!--订单申诉-->
            {{$t('M.otc_complaint')}}
          </div>
          <!-- 申诉表身体 -->
          <div class="appeal-body">
            <div class="appeal-body-content">
              <!-- 1.文本域部分 -->
              <div class="appeal-textarea">
                <span class="appeal-reason">
                  <!--申诉原因-->
                  <span class="star">*</span>{{$t('M.otc_complaint_appeal_reason')}}
                </span>
                <textarea
                  class="appeal-textarea-text font-size12"
                  maxlength="30"
                  v-model.trim="appealTextAreaValue"
                ></textarea>
              </div>
              <!--2. 申诉图片部分-->
              <div class="appeal-picture">
                <!--上传图片-->
                <div class="upload-title">
                  <span class="star">*</span>{{$t('M.otc_upload_picture1')}}
                </div>
                <div class="upload-content">
                  <el-upload
                    :action="uploadUrl"
                    :headers="{
                      'token':token,
                      'x-domain':xDomain
                    }"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccess"
                    :on-error="imgUploadError"
                    :before-upload="beforeAvatarUpload"
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog
                    :visible.sync="dialogVisiblePicture"
                  >
                    <img width="100%" :src="dialogImageUrl">
                  </el-dialog>
                </div>
              </div>
              <!-- 3. 按钮部分 -->
              <div class="appeal-button">
                <el-button
                  class="appeal-button-submit"
                  type="primary"
                  size="mini"
                  @click="sellerAppeal(item.id, index, item.orderType)"
                >
                  <!--提交申诉-->
                  {{$t('M.otc_complaint_submit')}}
                </el-button>
                <el-button
                  class="appeal-button-cancel"
                  type="primary"
                  size="mini"
                  @click="cancelOrderAppeal(index)"
                >
                  <!--取消申诉-->
                  {{$t('M.otc_complaint_cancel')}}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 二、暂无数据 -->
      <div
        class="no-data font-size12"
        v-if="!tradingOrderList.length"
      >
        <!--暂无数据-->
        {{ $t('M.comm_no_data') }}
      </div>
      <!-- 三、分页-->
      <el-pagination
        class="pages"
        background
        v-show="tradingOrderList.length"
        layout="prev, pager, next"
        :current-page="legalTradePageNum"
        :page-count="legalTradePageTotals"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
      <!-- 四 买家点击确认付款按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!--交易密码-->
        <el-dialog
          :title="$t('M.comm_password')"
          :visible.sync="dialogVisible1"
          :close-on-click-modal="false"
          top="25vh"
          width="470"
        >
          <!-- 请输入交易密码 -->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{ errpwd }}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!--提 交-->
            <button
              class="button cursor-pointer"
              type="primary"
              @click="submitButton1"
              :disabled="confirmPaymentStatus"
            >
              {{$t('M.comm_sub_time')}}
            </button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip cursor-pointer display-inline-block"
                @click.prevent="forgetPwdJump"
              >
                {{$t('M.user_payPassword')}}
              </span>
            </div>
          </span>
        </el-dialog>
      </div>
      <!-- 五 卖家点击确认收款按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!--交易密码-->
        <el-dialog
          :title="$t('M.comm_password')"
          :visible.sync="dialogVisible2"
          :close-on-click-modal="false"
          top="25vh"
          width="470"
        >
          <!--请输入交易密码-->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{ errpwd }}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!--提 交-->
            <button
              class="button cursor-pointer"
              type="primary"
              @click="submitButton2"
              :disabled="confirmGatheringStatus"
            >
              {{$t('M.comm_sub_time')}}
            </button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip cursor-pointer display-inline-block"
                @click.prevent="forgetPwdJump"
              >
                {{$t('M.user_payPassword')}}
              </span>
            </div>
          </span>
        </el-dialog>
      </div>
      <!-- 六 点击提交申诉按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!--交易密码-->
        <el-dialog
          :title="$t('M.comm_password')"
          :visible.sync="dialogVisible3"
          :close-on-click-modal="false"
          top="25vh"
          width="470"
        >
          <!--请输入交易密码-->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{ errpwd }}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!--提 交-->
            <button
              class="button cursor-pointer"
              type="primary"
              @click="submitsellerAppeal"
              :disabled="submitAppealStatus"
            >
              {{$t('M.comm_sub_time')}}
            </button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip cursor-pointer display-inline-block"
                @click.prevent="forgetPwdJump"
              >
                {{$t('M.user_payPassword')}}
              </span>
            </div>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  buyerPayForOrder,
  sellerConfirmGetMoney,
  sellerSendAppeal,
  buyerSendAppeal,
  cancelUserOtcOrder,
  completeUserOtcOrder,
  cancelTradingOrderAjax
} from '../../../utils/api/OTC'
import {timeFilter, formatSeconds, getCookie} from '../../../utils'
import {apiCommonUrl, xDomain} from '../../../utils/env.js'
import IconFontCommon from '../../Common/IconFontCommon'
import OTCIM from '../../OTC/OTCIM'
import {
  changeCurrentPageForLegalTrader,
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
    IconFontCommon, //  字体图标组件
    OTCIM
  },
  props: {
    OTC_IM_TOP: {
      type: String
    }
  },
  data () {
    return {
      confirmPaymentStatus: false, // 确认付款交易密码框提交按钮禁用状态
      confirmGatheringStatus: false, // 确认收款交易密码框提交按钮禁用状态
      submitAppealStatus: false, // 提交申诉交易密码框提交按钮禁用状态
      dialogVisible1: false, // 确认付款交易密码框
      dialogVisible2: false, // 确认收款交易密码框
      dialogVisible3: false, // 提交申诉交易密码框
      appealTextAreaValue: '', // 订单申诉原因文本域内容
      activitedPayStyle: '', //  选中的支付方式
      activitedPayStyleId: '', //  选中的支付方式id-往后台传送的参数
      // tradingOrderList: [], // 交易中订单列表
      activedTradingOrderId: '', // 选中的订单id
      activedPayAccountArr: [], // 当前选中的订单中付款方式中的付款账号 ：为了解决支付宝和微信账号一样做的bug修复
      checkedPayRealNameArr: [], // 当前选中的订单中付款方式中的收款人名字（支付宝、微信、银行卡用此字段，其他支付方式还是用sellName字段）
      // 支付方式
      activePayModeList: [], // 当前选中支付方式中的哪一个 -->为了解决支付宝和微信账号一样做的bug修复// 当前选中的支付方式的id
      activeBankFidList: [], // 当前选中支付方式的id
      activeBankProv: [], // 当前选中支付银行所在省
      activeBankCity: [], // 当前选中支付银行所在市
      activeBankArea: [], // 当前选中支付银行所在区
      activeBankName: [], // 当前选中支付银行名字
      activeBankDetailAddress: [], // 当前选中支付银行具体地址
      activeBankType: [], // 当前选中支付方式类型（银行卡、支付宝等）
      activeBankCode: [], // 选中的支付宝和尾微信的支付码
      tradePassword: '', // 交易密码
      buttonStatusArr: [], // 确认付款按钮是否可用状态集
      showOrderAppeal: [], // 订单申诉框显示与隐藏状态集
      cancelOrderTimeArr: [], // 自动取消订单倒计时数组集
      accomplishOrderTimeArr: [], // 自动成交倒计时数组集
      errpwd: '', // 交易密码错提示
      cancelOrdersTimer: null, // 自动取消订单倒计时
      accomplishOrdersTimer: null, // 自动成交倒计时
      // 申诉上传图片
      orderTypeParam: '', // 订单类型参数
      token: getCookie('token'), // 获取token
      uploadUrl: apiCommonUrl + 'uploadfile', // 上传图片地址
      xDomain: xDomain, // 获取xDomain
      picture1: '', // 上传申诉的第1张图片
      picture2: '', // 上传申诉的第2张图片
      picture3: '', // 上传申诉的第3张图片
      dialogImageUrl: '', // 图片预览
      dialogVisiblePicture: false, // 预览图片弹出框状态
      fileList: [], // 绑定的上传的文件列表
      uploadFileList: [], // 自定义的上传的文件列表
      buyerAppealButtonStatus: [], // 买家申诉按钮显示状态
      // sellerTimeOutDisabled: [], // 卖家超时禁用确认收款按钮 20190508更改卖家超时仍可以收款
      // 增加上传图片压缩功能
      imgQuality: 0.4 // 压缩图片的质量
    }
  },
  created () {
    // 1.0 请求交易中订单列表
    // this.getOTCTradingOrdersList()
    // 2刚进页面调用接口刷新列表
    this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'CHANGE_LEGAL_PAGE',
      'CHANGE_RE_RENDER_TRADING_LIST_STATUS', // 更改重新渲染交易中订单列表状态,
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'UPDATE_IM_BOX_SHOW_STATUS_M',
      // 改变清除交易中数据方法的状态
      'CHANGE_CLEAR_DATA_STATUS_M',
      'UPDATE_IM_HAS_NEW_MESSAGE_MAP_M'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    jumpMerchantInfoPage (userId) {
      if (userId) {
        this.$goToPage(`/${this.$routes_X.OTCViewMerchantInfo}`, {userId: userId})
      }
    },
    // ren增加
    // 清除定义的数组类数据
    clearArrData () {
      this.checkedPayRealNameArr = [] // 清空收款人名字
      this.activePayModeList = [] // 清空支付方式数组
      this.activeBankType = [] // 清空选中的支付方式所展示的付款账户和账号
      this.cancelOrderTimeArr = [] // 清空取消订单倒计时
      this.accomplishOrderTimeArr = [] // 清空自动成交倒计时
      this.buyerAppealButtonStatus = [] // 清空买家申诉按钮
      this.CHANGE_CLEAR_DATA_STATUS_M(false)
    },
    // ren增加
    // 申诉上传图片
    // 1.0 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    // 文件上传之前调用做一些拦截限制
    // 增加上传图片压缩功能↓↓↓
    dataURItoBlob (dataURI, type) {
      let binary = atob(dataURI.split(',')[1])
      let array = []
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
      }
      return new Blob([new Uint8Array(array)], {type: type})
    },
    beforeAvatarUpload (file) {
      // 限制图片格式
      let isJPG = false
      switch (file.type) {
        case 'image/jpeg':
          isJPG = true
          break
        case 'image/jpg':
          isJPG = true
          break
        case 'image/png':
          isJPG = true
          break
        case 'image/bmp':
          isJPG = true
          break
      }
      if (!isJPG) {
        // 上传图片只能是 jpeg/jpg/png/bmp 格式!
        this.$error_tips_X(this.$t('M.otc_upload_picture3'))
        return isJPG
      }
      // 对图片进行压缩
      const imgSize = file.size / 1024 / 1024
      // console.log(imgSize)
      // console.log(typeof imgSize)
      if (imgSize > 0.5 && imgSize < 5) {
        const _this = this
        return new Promise(resolve => {
          const reader = new FileReader()
          const image = new Image()
          image.onload = (imageEvent) => {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            const width = image.width * _this.imgQuality
            const height = image.height * _this.imgQuality
            canvas.width = width
            canvas.height = height
            // console.log(width)
            // console.log(height)
            context.clearRect(0, 0, width, height)
            context.drawImage(image, 0, 0, width, height)
            const dataUrl = canvas.toDataURL(file.type)
            const blobData = _this.dataURItoBlob(dataUrl, file.type)
            resolve(blobData)
          }
          reader.onload = (e) => { image.src = e.target.result }
          reader.readAsDataURL(file)
        })
      }
      if (imgSize > 5) {
        // 请上传小于5M的图片
        this.$error_tips_X(this.$t('M.otc_upload_picture7'))
        return false
      }
    },
    // 增加上传图片压缩功能↑↑↑
    // 2.0 点击文件列表中已上传的文件时的钩子--预览图片时调用
    handlePictureCardPreview (file) {
      // console.log('预览图片时调用')
      // console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisiblePicture = true
    },
    // 3.0 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      // console.log('文件列表移除文件时的钩子')
      // console.log(file, fileList)
      this.uploadFileList = fileList
    },
    // 4.0 文件上传成功时的钩子
    handleAvatarSuccess (res, file, fileList) {
      // console.log('文件上传成功')
      // console.log(res, file, fileList)
      this.uploadFileList = fileList
    },
    // 5.0 文件上传失败时的钩子
    imgUploadError (file, fileList) {
      // console.log('文件上传失败时')
      // console.log(file, fileList)
      // 上传图片失败,请重试！
      this.$error_tips_X(this.$t('M.otc_upload_picture5'))
      this.uploadFileList = fileList
    },
    // 6.0 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      // console.log('文件超出个数限制时')
      // console.log(files. fileList)
      // 上传图片不能超过3张
      this.$error_tips_X(this.$t('M.otc_upload_picture6'))
      this.uploadFileList = fileList
    },
    // 1.0 分页
    changeCurrentPage (e) {
      console.log('当前页' + e)
      changeCurrentPageForLegalTrader(e, 'TRADING', this)
    },
    // 1.1 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'time')
    },
    // 1.2 倒计时时间格式化-国际标准格式(09ˋ40′32″)
    BIHTimeFormatting (date) {
      return formatSeconds(date, 'OTC')
    },
    // 1.3 自动取消订单倒计时
    cancelSetInter () {
      clearInterval(this.cancelOrdersTimer)
      this.cancelOrdersTimer = setInterval(() => {
        // 循环自动取消倒计时时间数组
        this.cancelOrderTimeArr.forEach((item, index) => {
          this.$set(this.cancelOrderTimeArr, index, this.cancelOrderTimeArr[index] - 1000)
          if (item - 0 < 0 || item == 0) {
            this.cancelCompleteUserOtcOrder(1)
          }
        })
      }, 1000)
    },
    // 1.4 自动成交倒计时
    accomplishSetInter () {
      clearInterval(this.accomplishOrdersTimer)
      this.accomplishOrdersTimer = setInterval(() => {
        this.accomplishOrderTimeArr.forEach((item, index) => {
          if (item - 0 > 0) {
            this.$set(this.accomplishOrderTimeArr, index, this.accomplishOrderTimeArr[index] - 1000)
            // this.$set(this.sellerTimeOutDisabled, index, false) // 卖家超时禁用确认收款按钮-未超时可点击 20190508更改卖家超时仍可以收款
            this.$set(this.buyerAppealButtonStatus, index, false) // 卖家未超时付款隐藏买家申诉订单按钮
          } else {
            this.$set(this.buyerAppealButtonStatus, index, true) // 卖家超时未付款显示买家申诉订单按钮
            // this.$set(this.sellerTimeOutDisabled, index, true) // 卖家超时禁用确认收款按钮 20190508更改卖家超时仍可以收款
          }
        })
      }, 1000)
    },
    // 1.5 增加自动取消倒计时和自动成交倒计时接口
    // 撤销/成交otc用户定单
    async cancelCompleteUserOtcOrder (val) { // 1 取消 2 完成
      let data
      if (val === 1) {
        data = await cancelUserOtcOrder()
        console.log('撤销（过期 买家 未付款）')
        if (!data) return false
        // 返回数据正确的逻辑：重新渲染列表
        this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      }
      if (val === 2) {
        data = await completeUserOtcOrder()
        console.log('成交（过期 卖家 未收款）')
        if (!data) return false
        // 返回数据正确的逻辑：重新渲染列表
        this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      }
    },
    // 2.0 倒计时逻辑方法 timerLogicMethod
    timerLogicMethod () {
      this.activePayModeList = [] // 清空支付方式数组：防止换页码之后之前选中的在此页面付款方式也被选中的问题
      this.cancelOrderTimeArr = []
      this.accomplishOrderTimeArr = []
      this.buyerAppealButtonStatus = [] // 清空买家申诉按钮
      // 循环数组
      this.tradingOrderList.forEach((item, index) => {
        this.buttonStatusArr[index] = false
        this.showOrderAppeal[index] = false
        // 自动取消订单倒计时数组集
        if (item.status === 'PICKED') {
          this.cancelOrderTimeArr[index] = item.cancelRestTime - 0 // cancelRestTime毫秒单位
          this.accomplishOrderTimeArr[index] = 10000000 // completeRestTime毫秒单位
        } else if (item.status === 'PAYED') {
          // 自动成交倒计时数组集
          this.cancelOrderTimeArr[index] = 10000000 // cancelRestTime毫秒单位
          this.accomplishOrderTimeArr[index] = item.completeRestTime - 0 // completeRestTime毫秒单位
        }
      })
      if (this.tradingOrderList.length) {
        this.cancelSetInter() // 调用自动取消倒计时方法
        this.accomplishSetInter() // 调用自动成交倒计时方法
      } else {
        clearInterval(this.cancelOrdersTimer)
        clearInterval(this.accomplishOrdersTimer)
      }
    },
    // 3.0 改变交易方式
    changeUserBankInfo (index) {
      this.activedTradingOrderId = this.tradingOrderList[index].id
      this.tradingOrderList[index].userBankList.forEach((item) => {
        if (item.id == this.activePayModeList[index]) {
          this.activedPayAccountArr[index] = item.cardNo
          this.checkedPayRealNameArr[index] = item.realname
          this.activeBankFidList[index] = item.id
          this.activitedPayStyleId = this.activeBankFidList[index]
          // 省
          this.activeBankProv[index] = item.prov
          // 市
          this.activeBankCity[index] = item.city
          // 区
          this.activeBankArea[index] = item.area
          // 银行名字
          this.activeBankName[index] = item.bankName
          // 具体地址
          this.activeBankDetailAddress[index] = item.address
          // 支付类型
          this.activeBankType[index] = item.bankType
          // 支付码
          this.activeBankCode[index] = item.qrcode
        }
        this.buttonStatusArr[index] = true
      })
    },
    // 4.0 买家点击确认付款按钮 弹出交易密码框
    async confirmPayMoney (index) {
      // console.log(index)
      if (!this.activePayModeList[index]) {
        // 请选择支付方式
        this.$error_tips_X(this.$t('M.comm_please_choose') + this.$t('M.otc_index_Payment_method'))
        return false
      }
      // 判断是否交易密码锁定
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.buttonStatusArr[index] === true) {
        if (this.isNeedPayPassword) {
          // 弹出交易密码框
          this.dialogVisible1 = true
        } else {
          this.submitButton1()
        }
      }
    },
    // 5.0 买家点击确认付款按钮 点击交易密码框中的提交按钮--交易密码狂获得焦点
    passWordFocus () {
      this.errpwd = ''
    },
    // 6.0 买家点击确认付款按钮 点击交易密码框中的提交按钮
    submitButton1: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        // 请输入交易密码
        this.errpwd = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.comm_password')
        return false
      } else {
        this.confirmPaymentStatus = true // 禁用确认付款交易密码框提交按钮
        const data = await buyerPayForOrder({
          orderId: this.activedTradingOrderId, // 订单id
          payId: this.activitedPayStyleId, // 支付账户id
          tradePassword: this.tradePassword // 交易密码
        })
        // console.log(data)
        this.confirmPaymentStatus = false // 开启确认付款交易密码框提交按钮
        // 1关闭交易密码框
        this.dialogVisible1 = false
        // 正确逻辑
        // 再次调用接口刷新列表
        this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
        // 清除定义的数组类数据
        this.clearArrData()
        this.errpwd = '' // 清空密码错提示
        this.tradePassword = '' // 清空密码框
        if (!data) return false
      }
    }, 500),
    // 7.0 卖家在买家付款前点击确认收款按钮的提示事件
    gatheringBefore () {
      // 请等待买家付款
      this.$error_tips_X(this.$t('M.comm_please') + this.$t('M.otc_waiting_buyer_payment') + '。')
    },
    // 8.0 卖家点击确认收款按钮
    async confirmGatherMoney (id) {
      this.activedTradingOrderId = id
      // 判断是否交易密码锁定
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      // 弹出交易密码框
      // console.log(id)
      console.log(this.activedTradingOrderId)
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        // 弹出交易密码框
        this.dialogVisible2 = true
      } else {
        this.submitButton2()
      }
    },
    // 9.0 卖家点击确认收款按钮 弹出交易密码框 点击交易密码框中的提交按钮
    submitButton2: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        this.errpwd = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.confirmGatheringStatus = true // 禁用确认收款交易密码框提交按钮
      const data = await sellerConfirmGetMoney({
        orderId: this.activedTradingOrderId, // 订单id
        tradePassword: this.tradePassword // 交易密码
      })
      console.log(data)
      this.confirmGatheringStatus = false // 开启确认收款交易密码框提交按钮
      // 正确逻辑
      // 1关闭交易密码框
      this.dialogVisible2 = false
      // 2清空密码
      this.errpwd = '' // 清空密码错提示
      this.tradePassword = '' // 清空密码框
      // 3清除定义的数组类数据
      this.clearArrData()
      // 4再次调用接口刷新列表
      this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      if (!data) return false
    }, 500),
    // 10.0 点击订单申诉弹窗申诉框
    orderAppeal (id, index, orderType) {
      console.log(orderType)
      // console.log(id)
      this.showOrderAppeal.forEach((item, index) => {
        this.$set(this.showOrderAppeal, index, false)
      })
      this.$set(this.showOrderAppeal, index, true)
      this.activedTradingOrderId = id
      this.uploadFileList = [] // 清空上传图片数组
      this.appealTextAreaValue = '' // 清空申诉原因
    },
    // 11.0 取消订单申诉按钮
    cancelOrderAppeal (index) {
      // this.showOrderAppeal = false
      this.$set(this.showOrderAppeal, index, false)
      this.uploadFileList = [] // 清空上传图片数组
      this.appealTextAreaValue = '' // 清空申诉原因
    },
    // 12.0 卖家提交申诉按钮弹出交易密码框
    async sellerAppeal (id, index, orderType) {
      console.log(orderType)
      this.tradePassword = '' // 清空密码框
      this.orderTypeParam = orderType
      // 申诉原因验证
      if (!this.appealTextAreaValue) {
        // 请输入申诉原因
        this.$error_tips_X(this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_complaint_appeal_reason'))
        return false
      }
      // 申诉图片验证
      if (!this.uploadFileList.length) {
        // message: '请至少上传一张图片！',
        this.$error_tips_X(this.$t('M.otc_upload_picture2'))
        return false
      } else {
        // 申诉图片赋值
        this.uploadFileList.forEach((item, index) => {
          if (item.response) {
            this[`picture${index + 1}`] = item.response.data.fileUrl
          }
        })
      }
      this.activedTradingOrderId = id
      // 判断是否交易密码锁定
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        this.dialogVisible3 = true
      } else {
        this.submitsellerAppeal()
      }
    },
    // 13.0 卖家提交申诉按钮
    submitsellerAppeal: _.debounce(async function () {
      console.log(this.orderTypeParam)
      if (this.isNeedPayPassword && !this.tradePassword) {
        // 请输入交易密码
        this.errpwd = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.submitAppealStatus = true // 禁用提交申诉交易密码框提交按钮
      let params = {
        orderId: this.activedTradingOrderId, // 订单id
        reason: this.appealTextAreaValue, // 申诉原因
        tradePassword: this.tradePassword, // 交易密码
        picture1: this.picture1,
        picture2: this.picture2,
        picture3: this.picture3
      }
      let data
      if (this.orderTypeParam === 'BUY') {
        data = await buyerSendAppeal(params)
      }
      if (this.orderTypeParam === 'SELL') {
        data = await sellerSendAppeal(params)
      }
      console.log(data)
      // 正确逻辑
      this.submitAppealStatus = false // 开启提交申诉交易密码框提交按钮
      this.dialogVisible3 = false
      this.errpwd = '' // 清空密码错提示
      this.tradePassword = '' // 清空密码框
      this.appealTextAreaValue = '' // 清空申诉原因
      // 1清除定义的数组类数据
      this.clearArrData()
      // 2再次调用接口刷新列表
      this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      if (!data) return false
    }, 500),
    // 忘记密码跳转
    forgetPwdJump () {
      this.$goToPage('/TransactionPassword')
    },
    // 暂时关闭交易密码验证跳转
    closePwdJump () {
      this.CHANGE_REF_ACCOUNT_CREDITED_STATE(true)
      this.$goToPage('/PersonalCenter')
      this.CHANGE_USER_CENTER_ACTIVE_NAME('personal-setting')
    },
    // 买家摘单后未付款前可取消订单
    cancelOrderBeforePayFor: _.debounce(async function (orderId) {
      console.log(orderId)
      let params = {
        orderId: orderId // 订单id
      }
      const data = await cancelTradingOrderAjax(params)
      console.log(data)
      // 接口成功后的逻辑
      // 再次调用接口刷新列表
      this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
    }, 500)
  },
  filter: {},
  computed: {
    ...mapState({
      // 当前选中语言
      language: state => state.common.language,
      activeLanguage: state => state.common.activeLanguage,
      theme: state => state.common.theme,
      loginStep1Info: state => state.user.loginStep1Info,
      // legalTraderTradingList: state => state.personal.legalTraderTradingList, // 从全局获得的交易中订单列表
      tradingOrderList: state => state.personal.legalTraderTradingList, // 从全局获得的交易中订单列表tradingOrderList
      // 已完成订单
      completeList: state => state.personal.legalTraderCompletedList,
      legalTraderTradingReflashStatus: state => state.personal.legalTraderTradingReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum,
      reRenderTradingListStatus: state => state.personal.reRenderTradingListStatus, // 从全局获得的重新渲染交易中订单列表状态
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      configInfo: state => state.common.footerInfo.configInfo,
      // 法币订单交易中订单定义的数组数据状态
      clearTradingOrderArrDataStatus: state => state.personal.clearTradingOrderArrDataStatus
    })
    // 从全局获得的交易中订单列表
    // tradingOrderList () {
    //   return this.legalTraderTradingList
    // }
  },
  watch: {
    // 清空定义的数组数据
    clearTradingOrderArrDataStatus (val) {
      if (val) {
        this.clearArrData()
      }
    },
    // 监控交易中订单列表并调用倒计时逻辑方法
    tradingOrderList (New) {
      console.log(New)
      _.forEach(New, item => {
        this.UPDATE_IM_BOX_SHOW_STATUS_M({orderId: item.id, status: false})
        this.UPDATE_IM_HAS_NEW_MESSAGE_MAP_M({orderId: item.id, status: false})
      })
      this.timerLogicMethod()
    },
    completeList (New) {
      _.forEach(New, item => {
        this.UPDATE_IM_HAS_NEW_MESSAGE_MAP_M({orderId: item.id, status: false})
      })
    },
    language () {
      this.errpwd = '' // 清空密码错提示
    },
    // tradingOrderList (newVal) {
    //   console.log(newVal)
    // if (newVal) {
    //   // 循环数组
    //   newVal.forEach((item, index) => {
    //     this.buttonStatusArr[index] = false
    //     this.showOrderAppeal[index] = false
    //     // 自动取消订单倒计时数组集
    //     this.cancelOrderTimeArr[index] = item.cancelRestTime // cancelRestTime毫秒单位
    //     // 自动成交倒计时数组集
    //     this.accomplishOrderTimeArr[index] = item.completeRestTime // completeRestTime毫秒单位
    //   })
    //   // 调用自动取消倒计时方法
    //   this.cancelSetInter()
    //   // 调用自动成交倒计时方法
    //   this.accomplishSetInter()
    // }
    // },
    activeName () {
      this.getOTCEntrustingOrdersRevocation(this.activeName)
    }
  },
  destroyed () {
    // 离开本组件清除定时器
    clearInterval(this.cancelOrdersTimer)
    clearInterval(this.accomplishOrdersTimer)
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .fiat-trading-order-box {
    margin-top: -10px;

    > .fiat-trading-order-content {
      position: relative;
      min-height: 584px;
      padding: 0 10px 35px;

      .button {
        width: 290px;
        padding: 8px 20px;
        border: 0;
        border-radius: 5px;

        &:disabled {
          cursor: not-allowed;
        }
      }

      > .order-list {
        box-sizing: border-box;
        height: 170px;
        margin-bottom: 10px;
        border-radius: 6px;
        font-size: 12px;
        background-color: $mainContentNightBgColor;

        > .order {
          > .order-list-head {
            display: flex;
            justify-content: space-between;
            height: 36px;
            padding-right: 25px;
            border-bottom: 1px solid #262f38;
            line-height: 36px;
            color: #9da5b3;

            > .left {
              position: relative;
              display: flex;
              box-sizing: border-box;
              padding-left: 55px;

              > .buyer-seller,
              .order-id,
              .AD-ID,
              .deal-time {
                margin-right: 35px;
              }

              > .order-list-head-icon {
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 0;
                border-right: 18px solid transparent;
                border-bottom: 18px solid transparent;
                border-top-left-radius: 6px;
            }

              > .buy-icon {
                border-top: 18px solid $upColor;
                border-left: 18px solid $upColor;
              }

              > .sell-icon {
                border-top: 18px solid $otcGreen;
                border-left: 18px solid $otcGreen;
              }

              > .buy-sell-icon {
                position: absolute;
                top: -6px;
                left: 2px;
                color: #fff;
              }
            }

            > .right {
              .otc-im {
                vertical-align: middle;
              }
            }
          }

          > .order-list-body {
            display: flex;
            flex: 7;
            padding: 15px 20px;
            color: #9da5b3;

            > .order-list-body-left {
              flex: 2;
              border-right: 1px solid #262f38;

              > .logo {
                display: inline-block;
                margin-right: 20px;
                text-align: center;

                > .logo-name {
                  margin-top: 5px;
                }
              }

              > .left-info {
                display: inline-block;

                > .trade-info {
                  line-height: 20px;

                  > .money {
                    color: $mainColor;
                  }
                }
              }
            }

            > .order-list-body-middle {
              flex: 2;
              box-sizing: border-box;
              border-right: 1px solid #262f38;

              > .middle-content {
                .trader-info {
                  width: 185px;

                  > .pay-style {
                    position: relative;
                    width: 150px;
                    height: 23px;
                    margin: 0 0 8px 10px;

                    > .qiandai-icon {
                      > .icon {
                        position: absolute;
                        z-index: 2;
                        top: 5px;
                        left: 5px;
                        width: 14px;
                        height: 14px;
                      }
                    }
                  }

                  > .bank-info {
                    margin-left: 10px;
                    line-height: 20px;
                  }

                  > .order-cancel-tips {
                    margin-left: 20px;
                    line-height: 20px;
                  }

                  > .bankMoneyInfo {
                    margin-left: 10px;
                    line-height: 20px;

                    .icon {
                      width: 16px;
                      height: 14px;
                    }

                    .xilian {
                      vertical-align: middle;
                    }
                  }
                }

                > .bank-info-picture {
                  width: 70px;
                  padding-left: 10px;
                  vertical-align: top;
                }
              }
            }

            > .order-list-body-right {
              flex: 3;

              > .right-content {
                > .action-tips {
                  margin: 0 0 10px 20px;

                  .wait-pay {
                    margin-right: 10px;
                    color: $upColor;

                    > .cancelOrderButton {
                      height: 22px;
                      padding: 0 10px;
                      border: 1px solid $mainColor;
                      line-height: 22px;
                      color: $mainColor;
                    }
                  }

                  .count-time {
                    margin-left: 10px;
                  }
                }

                > .submitted-confirm-payment {
                  color: $mainColor;
                }

                > .action-explain {
                  margin-left: 20px;
                  line-height: 20px;

                  > .remaining-time {
                    color: $upColor;
                  }
                }

                > .count-down-time {
                  line-height: 20px;

                  .timeIcon {
                    margin-right: 10px;
                    color: $upColor;
                  }
                }
              }
            }
          }
        }

        > .appeal {
          > .appeal-head {
            box-sizing: border-box;
            height: 36px;
            padding: 0 77px 0 25px;
            border-bottom: 1px solid #262f38;
            line-height: 36px;
            color: $mainColorOfWhite;
          }

          > .appeal-body {
            > .appeal-body-content {
              display: flex;
              flex: 4;

              > .appeal-textarea {
                display: flex;
                flex: 1;
                justify-content: flex-start;
                margin: 15px 0 0 20px;

                > .appeal-reason {
                  margin-right: 10px;
                  color: $mainColor;
                }

                > .appeal-textarea-text {
                  box-sizing: border-box;
                  width: 160px;
                  height: 90px;
                  padding: 8px;
                  border: 1px solid #7587a5;
                  outline-color: transparent;
                  line-height: 16px;
                }
              }

              > .appeal-picture {
                flex: 2;
                padding-top: 10px;

                > .upload-title {
                  display: inline-block;
                  vertical-align: top;
                  color: $mainColor;
                }

                > .upload-content {
                  display: inline-block;
                  margin-left: 10px;
                }
              }

              > .appeal-button {
                flex: 1;
                padding-top: 80px;
              }

              .star {
                color: $upColor;
              }
            }
          }
        }
      }

      > .no-data {
        height: 530px;
        line-height: 530px;
        text-align: center;
      }
    }

    /deep/ {
      /* 分页 */
      .el-pagination.is-background.pages {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .appeal {
        .appeal-body {
          .appeal-body-content {
            .appeal-picture {
              .el-upload--picture-card {
                width: 80px;
                height: 80px;
                margin-top: 25px;
                line-height: 85px;
                background-color: transparent;
              }

              .el-upload--picture-card i {
                font-size: 20px;
              }

              .el-upload-list--picture-card {
                .el-upload-list__item {
                  width: 80px;
                  height: 80px;
                  margin-top: 25px;
                }
              }
            }
          }
        }
      }

      /* 1.0付款方式下拉框 */
      .el-input--suffix {
        .el-input__inner {
          width: 150px;
          height: 26px;
        }
      }

      .order-list-body-middle {
        .middle-content {
          .pay-style {
            .select-pay-type {
              .el-input__icon {
                line-height: 0;
              }
            }
          }
        }
      }

      .el-input__inner {
        padding: 0 25px;
        border: none;
        font-size: 12px;
      }

      .el-select-dropdown {
        border: none;
      }

      .el-select-dropdown__item {
        height: 30px !important;
        line-height: 30px !important;
      }

      /* 2.0按钮样式 */
      .el-button--mini {
        padding: 3px 10px;
      }

      /* 4.0 扫码付款按钮及弹窗支付宝和微信图片 */
      .bank-info-picture {
        .el-button {
          float: right;
          padding: 2px 6px;
          font-size: 12px;
        }
      }

      /* 输入密码弹出框 */
      .password-dialog {
        .el-dialog {
          width: 350px;
          height: 240px;
          border-radius: 4px;

          .el-dialog__header {
            padding: 10px 20px;
            border-radius: 4px 4px 0 0;

            .el-dialog__title {
              font-size: 14px;
            }

            .el-dialog__headerbtn {
              top: 15px;
              right: 10px;
            }
          }

          .el-dialog__body {
            padding: 15px 20px 10px 30px;
            font-size: 12px;

            .input {
              margin-top: 13px;

              .password-input {
                display: inline-block;
                width: 280px;
                height: 36px;
                padding-left: 10px;
                border-radius: 4px;
              }
            }

            .error-info {
              height: 20px;
              padding-top: 5px;
            }

            .close-pwd-tip {
              margin-top: 5px;
            }
          }

          .el-dialog__footer {
            padding: 0;
            font-size: 12px;
            text-align: center;

            .el-button {
              width: 290px;
              padding: 9px 20px;
              border: 0;
              border-radius: 2px;
              font-size: 12px;
            }

            .forget-pwd-tip {
              padding: 8px 20px 0 0;
            }
          }
        }
      }

      .el-button {
        min-width: 70px;
        height: 22px;
        border: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      .appeal-textarea-text {
        color: #9da5b3;
        background-color: #1e2636;
      }

      > .fiat-trading-order-content {
        background-color: $mainContentNightBgColor;

        .button {
          color: $mainColorOfWhite;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        > .order-list {
          border: 1px solid $dialogColor6;

          > .order {
            > .order-list-body {
              > .order-list-body-middle {
                > .middle-content {
                  .trader-info {
                    > .pay-style {
                      > .qiandai-icon {
                        > .icon {
                          color: $mainColorOfWhite;
                        }
                      }
                    }
                  }
                }
              }

              > .order-list-body-right {
                .action-tips,
                .action-explain {
                  .el-button {
                    background-color: $mainColor;
                  }

                  .appeal-button-sell {
                    .el-button {
                      color: #8094bb;
                      background: rgba(205, 217, 238, 1);
                    }
                  }

                  .buy-appeal-order {
                    color: #8094bb;
                    background: rgba(205, 217, 238, 1);
                  }
                }
              }
            }
          }
        }

        > .no-data {
          background-color: $mainContentNightBgColor;
        }
      }

      > .background-color {
        background-color: $mainContentNightBgColor;

        > .fiat-color {
          color: $mainColor;
        }
      }

      /deep/ {
        .el-input__inner {
          padding: 0 30px;
          color: #9da5b3;
          background-color: #303b45;
        }

        .el-input__inner,
        .el-select-dropdown {
          background-color: #29343f;
        }

        .el-select-dropdown__item.selected {
          color: $mainColor;
        }

        .el-select-dropdown__item {
          &:hover {
            color: $mainColor;
            background-color: #29343f;
          }
        }

        .el-popper[x-placement^=bottom] {
          .popper__arrow::after {
            border-bottom-color: #29343f;
          }

          .popper__arrow {
            border-bottom-color: #29343f;
          }
        }

        /* 4.0 扫码付款按钮及弹窗支付宝和微信图片 */
        .bank-info-picture {
          .el-button {
            border-color: #409eff;
            color: #fff;
            background-color: #409eff;

            &:hover {
              border-color: #66b1ff;
              color: #fff;
              background: #66b1ff;
            }
          }
        }

        /* 输入密码弹出框 */
        .password-dialog {
          .el-dialog {
            background-color: $dialogColor1;

            .el-dialog__header {
              background-color: $dialogColor2;

              .el-dialog__title {
                color: $dialogColor4;
              }
            }

            .el-dialog__body {
              .password-input {
                border: 1px solid $dialogColor6;
                color: $mainColorOfWhite;
                background-color: $dialogColor3;
              }

              .tips {
                color: $upColor;
              }

              .close-pwd-tip {
                color: $mainColor;
              }
            }

            .el-dialog__footer {
              .el-button--primary {
                color: $mainColorOfWhite;
                background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }

              .forget-pwd-tip {
                color: $mainColor;
              }
            }
          }
        }

        .el-button {
          border-color: #409eff;
          color: #fff;
          background-color: #409eff;
        }

        .appeal-button {
          .appeal-button-submit {
            background-color: $mainColor;
          }

          .appeal-button-cancel {
            color: #8094bb;
            background: #cdd9ee;
          }
        }
      }
    }

    &.day {
      > .fiat-trading-order-content {
        background-color: $mainColorOfWhite;

        .button {
          color: $mainColorOfWhite;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        > .order-list {
          border: 1px solid rgba(72, 87, 118, .1);
          background-color: $mainColorOfWhite;

          > .order {
            > .order-list-head {
              border-bottom: 1px solid rgba(72, 87, 118, .1);
              color: $dayMainTitleColor;
            }

            > .order-list-body {
              color: $dayMainTitleColor;

              > .order-list-body-left {
                border-right: 1px solid rgba(72, 87, 118, .1);
              }

              > .order-list-body-middle {
                border-right: 1px solid rgba(72, 87, 118, .1);

                > .middle-content {
                  .trader-info {
                    > .pay-style {
                      > .qiandai-icon {
                        > .icon {
                          color: $mainColor;
                        }
                      }
                    }
                  }
                }
              }

              > .order-list-body-right {
                > .right-content {
                  > .action-tips,
                  .action-explain {
                    .wait-pay {
                      color: $upColor;
                    }

                    .el-button {
                      background-color: $mainColor;
                    }

                    .appeal-button-sell {
                      .el-button {
                        color: #8094bb;
                        background: rgba(205, 217, 238, 1);
                      }
                    }
                  }

                  > .submitted-confirm-payment {
                    color: $mainColor;
                  }

                  > .action-explain {
                    > .remaining-time {
                      color: $upColor;
                    }
                  }

                  > .count-down-time {
                    .timeIcon {
                      color: $upColor;
                    }
                  }
                }
              }
            }
          }

          > .appeal {
            > .appeal-head {
              border-bottom: 1px solid $borderColorOfDay;
              color: $dayMainTitleColor;
              background-color: $mainColorOfWhite;
            }

            > .appeal-body {
              > .appeal-body-content {
                > .appeal-textarea {
                  > .appeal-reason {
                    color: $mainColor;
                  }

                  > .appeal-textarea-text {
                    border: 1px solid $borderColorOfDay;
                    color: $dayMainTitleColor;
                    background-color: $mainColorOfWhite;
                  }
                }
              }
            }
          }
        }

        > .no-data {
          color: $fontColorSecondaryOfDay;
          background-color: $mainColorOfWhite;
        }
      }

      /deep/ {
        .el-input__inner {
          width: 130px;
          border: 1px solid #ccc;
        }

        .password-dialog {
          .el-dialog {
            background-color: $mainColorOfWhite;

            .el-dialog__header {
              background-color: $dialogColor7;

              .el-dialog__title {
                color: $dayMainTitleColor;
              }
            }

            .el-dialog__body {
              .password-input {
                border: 1px solid $dialogColor8;
                color: $dayMainTitleColor;
                background-color: $mainColorOfWhite;
                box-shadow: inset 0 2px 4px 0 rgba(243, 243, 243, 1);
              }

              .tips {
                color: $upColor;
              }

              .close-pwd-tip {
                color: $mainColor;
              }
            }

            .el-dialog__footer {
              .el-button--primary {
                color: $mainColorOfWhite;
                background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }

              .forget-pwd-tip {
                color: $mainColor;
              }
            }
          }
        }

        /* 订单申诉按钮 */
        .submitted-confirm-payment {
          .buy-appeal-order.el-button {
            color: #8094bb;
            background-color: #cdd9ee !important;
          }
        }

        .appeal-button {
          .appeal-button-submit {
            background-color: $mainColor;
          }

          .appeal-button-cancel {
            color: #8094bb;
            background: #cdd9ee;
          }
        }

        /* 扫码支付按钮 */
        .bank-info-picture {
          .picture-box {
            .el-button {
              color: $mainColor;
              background-color: $coinBgColorOfDay;
            }
          }
        }
      }
    }
  }
</style>
