<template>
  <div
    class="otc-trading-order-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="otc-trading-order-content"
    >
      <!-- 一、交易中订单 -->
      <div
        class="order-list font-size12"
        v-for="(item, index) in tradingOrderList"
        :key="index"
      >
        <!-- 订单列表 ：1.0 买单 -->
        <div
          class="order"
          v-if="!showOrderAppeal[index] && item.orderType === 'BUY'"
        >
          <!--v-if="item.orderType === 'BUY'"-->
          <!-- 1.1 表头 -->
          <div class="order-list-head">
            <!-- 买卖家 -->
            <div class="buyer-seller">
              <!-- 卖家 -->
              {{$t('M.otc_seller')}}：{{item.sellName}}
            </div>
            <!-- 订单号 -->
            <div class="order-id">
              {{$t('M.otc_MerchantsOrders_orderNum')}}：{{item.orderSequence}}
            </div>
            <!-- 挂单时间 -->
            <div class="deal-time">
              {{$t('M.otc_make_a_bargain_time')}}：{{item.createTime}}
            </div>
            <div class="order-list-head-icon buy-icon">
            </div>
            <div class="buy-sell-icon">
              <!-- 买 -->
              {{$t('M.comm_bid')}}
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
                <p class="logo-name">{{item.coinName}}</p>
              </div>
              <div class="left-info">
                <!-- 金额 -->
                <p class="trade-info">
                  <span>{{$t('M.comm_money')}}：</span>
                  <span class="money">
                    {{item.symbol}}&nbsp;{{$scientificToNumber(item.payAmount)}}
                  </span>
                </p>
                <!-- 单价 -->
                <p class="trade-info">
                  <span>
                    {{$t('M.otc_index_UnitPrice')}}：{{$scientificToNumber(item.price)}}
                  </span>
                  <!-- 数量 -->
                  &nbsp;&nbsp;
                  <span>
                    {{$t('M.comm_count')}}：{{$scientificToNumber(item.pickCount)}}
                  </span>
                </p>
                <!-- 卖家手机号 -->
                <!-- 付款前不显示 -->
                <p
                  class="trade-info"
                >
                <!-- 卖家手机号： -->
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
                    <!-- 选择支付方式 -->
                    <el-select
                      :placeholder="$t('M.otc_choose_pay_style')"
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
                    <!--都取userBankList中的realname -->
                    <span>
                      <span v-if="activeBankType[index]">
                        {{$t('M.otc_payee')}}:
                      </span>
                      <span>
                        {{checkedPayRealNameArr[index]}}
                      </span>
                    </span>
                  </p>
                  <!-- 开户行 :显示省，市，地址-->
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Bankcard'"
                  >
                  <!-- 开户行 -->
                    <span>{{$t('M.otc_opening_bank')}}: </span>
                    <span>{{activeBankProv[index]}}{{activeBankCity[index]}}{{activeBankDetailAddress[index]}}</span>
                  </p>
                  <!-- 账户 -->
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Bankcard'"
                  >
                    <span>
                      {{$t('M.comm_bill_house')}}: {{checkedPayAccountArr[index]}}
                    </span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Alipay'"
                  >
                  <!-- 支付宝账户 -->
                    <span>{{$t('M.comm_alipay')}}{{$t('M.comm_bill_house')}}:</span>
                    <span>{{checkedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'Wechat'"
                  >
                  <!-- 微信账户 -->
                    <span>{{$t('M.comm_weixin')}}{{$t('M.comm_bill_house')}}:</span>
                    <span>{{checkedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'PAYPAL'"
                  >
                    <!-- paypal -->
                    <span>PAYPAL{{$t('M.comm_bill_house')}}:</span>
                    <span>{{checkedPayAccountArr[index]}}</span>
                  </p>
                  <p
                    class="bank-info"
                    v-if="activeBankType[index] === 'WestUnion'"
                  >
                  <!-- 西联汇款账户 -->
                    <span>{{$t('M.comm_xilian')}}{{$t('M.comm_bill_house')}}:</span>
                    <span>{{checkedPayAccountArr[index]}}</span>
                  </p>
                </div>
                <!-- 扫码支付 activeBankCode[index]  :src="item.coinUrl"-->
                <div
                  class="bank-info-picture display-inline-block"
                  v-if="activeBankType[index] === 'Wechat' || activeBankType[index] === 'Alipay'"
                >
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
                      <!-- 扫码支付 -->
                      <el-button slot="reference">{{$t('M.otc_tradingorder')}}</el-button>
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
                      <!-- 银行卡已付款 -->
                      {{$t('M.otc_trading_bankmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Alipay'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-zhifubao1"
                      />
                      <!-- 支付宝已付款 -->
                      {{$t('M.otc_trading_alipay_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Wechat'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-weixin1"
                      />
                      <!-- 微信已付款 -->
                      {{$t('M.otc_trading_wechat_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'WestUnion'"
                    >
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                      <!-- 西联汇款已付款 -->
                      {{$t('M.otc_trading_xilianmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'PAYPAL'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-paypal"
                      />
                      <!-- paypal已付款 -->
                      PAYPAL{{$t('M.otc_enum_status_yifukuan')}}
                    </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <!-- 转账金额 -->
                    <span>{{$t('M.otc_tradingorder_transformAcconu')}}:</span>
                    <span>{{item.symbol}}{{$scientificToNumber(item.payAmount)}}</span>
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      <!-- 账户 -->
                      {{$t('M.comm_bill_house')}}:
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
                      <!-- 扫码支付 -->
                      <el-button slot="reference">
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
                  <!-- 等待付款 -->
                  <span class="wait-pay">
                    {{$t('M.otc_waiting_payment')}}
                  </span>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="confirmPayMoney(index)"
                  >
                    <!-- 确认付款 -->
                    {{$t('M.otc_trading_confirmpayment')}}
                  </el-button>
                  <!-- 自动取消倒计时 -->
                  <span class="count-time">
                    <IconFontCommon
                      class="font-size16 wait-pay"
                      iconName="icon-daojishi"
                    />
                    <span v-if="cancelOrderTimeArr[index]">
                      {{BIHTimeFormatting(cancelOrderTimeArr[index])}}
                    </span>
                    <span v-else>--</span>
                  </span>
                </p>
                <!-- 注意 -->
                <p class="action-tips">
                  <!-- 注意！计时结束前未手动转账并点击"确认付款"，您的订单将自动取消，若上述情况累计出现3次，您的账户将被冻结24小时。 -->
                  {{$t('M.otc_tradingorder_notice1')}}{{configInfo.otcUnpaidTimes}}{{$t('M.otc_tradingorder_notice2')}}
                </p>
              </div>
              <!-- 付款后 -->
              <div
                class="right-content"
                v-if="item.status == 'PAYED' && item.orderType === 'BUY'"
              >
              <!-- 已提交确认付款 -->
                <p class="action-tips submitted-confirm-payment">
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
                  <!-- 注意！请联系卖家确认收款并确认订单，如果卖家{{item.completeTerm/3600}}小时内未确认订单，系统自动成交。 -->
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
            <!-- 买家 -->
            <div class="buyer-seller">
              {{$t('M.otc_buyer')}}：{{item.buyName}}
            </div>
            <!-- 订单号 -->
            <div class="order-id">
              {{$t('M.otc_MerchantsOrders_orderNum')}}：{{item.orderSequence}}
            </div>
            <!-- 挂单时间 -->
            <div class="deal-time">
              {{$t('M.otc_make_a_bargain_time')}}：{{item.createTime}}
            </div>
            <div class="order-list-head-icon sell-icon">
            </div>
            <div class="buy-sell-icon">
              <!-- 卖 -->
              {{$t('M.comm_ask')}}
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
                  <span>{{$t('M.comm_money')}}：</span>
                  <span class="money">{{item.symbol}}&nbsp;{{$scientificToNumber(item.payAmount)}}</span>
                </p>
                <!-- 单价 -->
                <p class="trade-info">
                  <span>
                    {{$t('M.otc_index_UnitPrice')}}：{{$scientificToNumber(item.price)}}
                  </span>
                  &nbsp;&nbsp;
                  <!-- 数量 -->
                  <span>{{$t('M.comm_count')}}：{{$scientificToNumber(item.pickCount)}}</span>
                </p>
                <!-- 卖家手机号 -->
                <p class="trade-info">
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
                    {{$t('M.otc_tradingorder_orderExact')}}{{item.cancelTerm/60}}{{$t('M.otc_tradingorder_autoCancel')}}
                  </p>
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
                      <!-- 银行卡已付款 -->
                      {{$t('M.otc_trading_bankmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Alipay'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-zhifubao1"
                      />
                      <!-- 支付宝已付款 -->
                      {{$t('M.otc_trading_alipay_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'Wechat'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-weixin1"
                      />
                      <!-- 微信已付款 -->
                      {{$t('M.otc_trading_wechat_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'WestUnion'"
                    >
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                      <!-- 西联汇款已付款 -->
                      {{$t('M.otc_trading_xilianmoney_payment')}}
                    </span>
                    <span
                      v-if="item.payType === 'PAYPAL'"
                    >
                      <IconFontCommon
                        class="font-size16"
                        iconName="icon-paypal"
                      />
                      <!-- PAYPAL已付款 -->
                      PAYPAL{{$t('M.otc_enum_status_yifukuan')}}
                    </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <!-- 转账金额 -->
                    <span>
                      {{$t('M.otc_tradingorder_transformAcconu')}}: </span><span>{{item.symbol}}{{$scientificToNumber(item.payAmount)}}
                    </span>
                  </p>
                  <p class="bankMoneyInfo">
                    <span>
                      {{$t('M.comm_bill_house')}}:</span>
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
                    plain
                    disabled
                    size="mini"
                  >
                    <!-- 确认收款 -->
                    {{$t('M.otc_trading_collectionconfirmation')}}
                  </el-button>
                </p>
                <!-- 等待买家付款。 -->
                <p class="action-explain">
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
                  >
                    <!--:disabled="sellerTimeOutDisabled[index]"20190508更改卖家超时仍可以收款-->
                    <!-- 确认收款 -->
                    {{$t('M.otc_trading_collectionconfirmation')}}
                  </el-button>
                  <el-button
                    size="mini"
                    class="appeal-order"
                    @click="orderAppeal(item.id, index, item.orderType)"
                  >
                    <!-- 订单申诉 -->
                    {{$t('M.otc_complaint')}}
                  </el-button>
                </p>
                <p class="action-explain">
                  <!-- 买家已付款 -->
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
          <!-- 订单申诉 -->
          <div class="appeal-head">
            {{$t('M.otc_complaint')}}
          </div>
          <!-- 申诉表身体 -->
          <div class="appeal-body">
            <div class="appeal-body-content">
              <!-- 1.文本域部分 -->
              <div class="appeal-textarea">
                <!-- 申诉原因 -->
                <span class="appeal-reason">
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
                  type="primary"
                  size="mini"
                  @click="sellerAppeal(item.id, index, item.orderType)"
                >
                  <!-- 提交申诉 -->
                  {{$t('M.otc_complaint_submit')}}
                </el-button>
                <el-button
                  size="mini"
                  class="cancel-appeal"
                  @click="cancelOrderAppeal(index)"
                >
                  <!-- 取消申诉 -->
                  {{$t('M.otc_complaint_cancel')}}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 二、暂无数据 -->
      <div
        class="no-data text-align-c"
        v-show="!tradingOrderList.length"
      >
        {{ $t('M.comm_no_data') }}
      </div>
      <!-- 四 买家点击确认付款按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!-- 交易密码 -->
        <el-dialog
          :title="$t('M.otc_publishAD_sellpassword')"
          :visible.sync="dialogVisibleConfirmPayment"
          top="25vh"
          width="470"
        >
          <!-- 请输入交易密码 -->
          <div class="input">
            <!-- 交易密码 -->
            <input
              type="password"
              autocomplete="new-password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
              @keyup.enter="submitConfirmPayment"
              onpaste="return false"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{errPWD}}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip font-size12 cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!-- 提 交 -->
            <el-button
              type="primary"
              @click="submitConfirmPayment"
              :disabled="confirmPaymentStatus"
            >
              {{$t('M.otc_submit')}}
            </el-button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip font-size12 cursor-pointer display-inline-block"
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
        <el-dialog
          :title="$t('M.otc_publishAD_sellpassword')"
          :visible.sync="dialogVisibleConfirmReceipt"
          top="25vh"
          width="470"
        >
          <!-- 请输入交易密码 -->
          <div class="input">
            <!-- 交易密码 -->
            <input
              type="password"
              autocomplete="new-password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
              @keyup.enter="submitConfirmGathering"
              onpaste="return false"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{errPWD}}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip font-size12 cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!-- 提 交 -->
            <el-button
              type="primary"
              @click="submitConfirmGathering"
              :disabled="confirmGatheringStatus"
            >
              {{$t('M.otc_submit')}}
            </el-button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip font-size12 cursor-pointer display-inline-block"
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
        <!-- 交易密码 -->
        <el-dialog
          :title="$t('M.otc_publishAD_sellpassword')"
          :visible.sync="dialogVisibleSubmitComplaint"
          top="25vh"
          width="470"
        >
          <!-- 请输入交易密码 -->
          <div class="input">
            <!-- 交易密码 -->
            <input
              type="password"
              autocomplete="new-password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
              @keyup.enter="sellerSubmitAppeal"
              onpaste="return false"
            >
          </div>
          <!-- 错误提示 -->
          <div class="error-info">
            <div class="tips">{{errPWD}}</div>
          </div>
          <!--暂时关闭交易密码验证-->
          <span
            class="close-pwd-tip font-size12 cursor-pointer display-inline-block"
            @click.prevent="closePwdJump"
          >
            {{$t('M.user_payPassword_switch')}}
          </span>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <!-- 提 交 -->
            <el-button
              type="primary"
              @click="sellerSubmitAppeal"
              :disabled="submitAppealStatus"
            >
              {{$t('M.otc_submit')}}
            </el-button>
            <!--忘记交易密码？-->
            <div class="text-align-r">
              <span
                class="forget-pwd-tip font-size12 cursor-pointer display-inline-block"
                @click.prevent="forgetPwdJump"
              >
              {{$t('M.user_payPassword')}}
            </span>
            </div>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- 三、分页-->
    <div class="page text-align-c">
      <el-pagination
        background
        v-show="tradingOrderList.length"
        layout="prev, pager, next"
        :page-count="totalPages"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getOTCOrdersThreeDay,
  buyerPayForOrder,
  sellerConfirmGetMoney,
  sellerSendAppeal,
  buyerSendAppeal,
  cancelUserOtcOrder,
  completeUserOtcOrder
} from '../../utils/api/OTC'
import {timeFilter, formatSeconds, getCookie} from '../../utils'
import {apiCommonUrl, xDomain} from '../../utils/env.js'
import IconFontCommon from '../Common/IconFontCommon'
import {
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
import {mapState, mapActions, mapMutations} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标组件
  },
  // props,
  data () {
    return {
      confirmPaymentStatus: false, // 确认付款交易密码框提交按钮禁用状态
      confirmGatheringStatus: false, // 确认收款交易密码框提交按钮禁用状态
      submitAppealStatus: false, // 提交申诉交易密码框提交按钮禁用状态
      // 分页
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      dialogVisibleConfirmPayment: false, // 确认付款交易密码框
      dialogVisibleConfirmReceipt: false, // 确认收款交易密码框
      dialogVisibleSubmitComplaint: false, // 提交申诉交易密码框
      appealTextAreaValue: '', // 订单申诉原因文本域内容
      checkedPayStyle: '', //  选中的支付方式:checkedPayStyle
      checkedPayStyleId: '', //  选中的支付方式id-往后台传送的参数
      // 交易中订单列表
      tradingOrderList: [],
      activePayModeListID: '', // 选中的支付方式id
      checkedTradingOrderId: '', // 选中的订单id
      checkedPayAccountArr: [], // 当前选中的订单中付款方式中的付款账号 ：为了解决支付宝和微信账号一样做的bug修复
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
      activeBankCode: [], // 选中的支付宝和微信的支付码
      tradePassword: '', // 交易密码1
      buttonStatusArr: [], // 确认付款按钮是否可用状态集
      showOrderAppeal: [], // 订单申诉框显示与隐藏状态集
      cancelOrderTimeArr: [], // 自动取消订单倒计时数组集
      accomplishOrderTimeArr: [], // 自动成交倒计时数组集
      errPWD: '', // 交易密码错提示
      cancelOrdersTimer: null, // 自动取消订单倒计时
      accomplishOrdersTimer: null, // 自动成交倒计时
      pageSize: 5, // ，每页显示几条数据
      // 是否输入
      isNeedPayPassword: true,
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
    // 1.0 请求交易中订单列表:只有登录了才调用
    if (this.isLogin) {
      this.getOTCTradingOrdersList()
    }
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE'
    ]),
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
        this.$message({
          message: this.$t('M.otc_upload_picture3'),
          type: 'error'
        })
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
        this.$message({
          // message: '请上传小于5M的图片',
          message: this.$t('M.otc_upload_picture7'),
          type: 'error'
        })
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
      console.log('文件上传成功')
      console.log(res, file, fileList)
      this.uploadFileList = fileList
    },
    // 5.0 文件上传失败时的钩子
    imgUploadError (file, fileList) {
      // console.log('文件上传失败时')
      // console.log(file, fileList)
      this.$message({
        // message: '上传图片失败,请重试！',
        message: this.$t('M.otc_upload_picture5'),
        type: 'error'
      })
      this.uploadFileList = fileList
    },
    // 6.0 文件超出个数限制时的钩子
    handleExceed (files, fileList) {
      // console.log('文件超出个数限制时')
      // console.log(files. fileList)
      this.$message({
        // message: '上传图片不能超过3张!',
        message: this.$t('M.otc_upload_picture6'),
        type: 'error'
      })
      this.uploadFileList = fileList
    },
    // 1.0 分页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      this.getOTCTradingOrdersList()
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
        // 循环自动成交倒计时数组
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
    // 1.5 撤销/成交otc用户定单
    async cancelCompleteUserOtcOrder (val) { // 1 取消 2 完成
      let data
      // switch 改写
      switch (val) {
        case 1:
          data = await cancelUserOtcOrder()
          break
        case 2:
          data = await completeUserOtcOrder()
          break
      }
      // 返回数据正确的逻辑：重新渲染列表
      console.log(data)
      if (!data) return false
      this.getOTCTradingOrdersList()
    },
    // 2.0 请求交易中订单列表
    async getOTCTradingOrdersList () {
      this.checkedPayRealNameArr = [] // 清空收款人名字
      this.activePayModeList = [] // 清空支付方式数组：防止换页码之后之前选中的在此页面付款方式也被选中的问题
      this.activeBankType = [] // 清空选中的支付方式所展示的付款账户和账号
      this.cancelOrderTimeArr = []
      this.accomplishOrderTimeArr = []
      this.buyerAppealButtonStatus = [] // 清空买家申诉按钮
      const data = await getOTCOrdersThreeDay({
        status: 'TRADING',
        pageNum: this.currentPage,
        pageSize: this.pageSize
      })
      console.log('交易中订单列表')
      console.log(data)
      // 返回数据正确的逻辑
      if (!data) return false
      if (data.data) {
        let detailsData = getNestedData(data, 'data')
        this.tradingOrderList = getNestedData(detailsData, 'list')
        // 分页
        this.totalPages = getNestedData(detailsData, 'pages') - 0
        // 循环数组
        this.tradingOrderList.forEach((item, index) => {
          this.buttonStatusArr[index] = false
          this.showOrderAppeal[index] = false
          // 自动取消订单倒计时数组集
          if (item.status === 'PICKED') {
            this.cancelOrderTimeArr[index] = item.cancelRestTime - 0 // cancelRestTime毫秒单位
            this.accomplishOrderTimeArr[index] = 10000000 // completeRestTime毫秒单位
            // 自动成交倒计时数组集
          } else if (item.status === 'PAYED') {
            this.cancelOrderTimeArr[index] = 10000000 // cancelRestTime毫秒单位
            this.accomplishOrderTimeArr[index] = item.completeRestTime - 0 // completeRestTime毫秒单位
            console.log(this.accomplishOrderTimeArr[index])
            console.log(typeof this.accomplishOrderTimeArr[index])
          }
        })
        if (this.tradingOrderList.length) {
          // 调用自动取消倒计时方法
          this.cancelSetInter()
          // 调用自动成交倒计时方法
          this.accomplishSetInter()
        } else {
          clearInterval(this.cancelOrdersTimer)
          clearInterval(this.accomplishOrdersTimer)
        }
      }
    },
    // 3.0 改变交易方式
    changeUserBankInfo (index) {
      this.checkedTradingOrderId = this.tradingOrderList[index].id
      this.tradingOrderList[index].userBankList.forEach((item) => {
        if (item.id == this.activePayModeList[index]) {
          this.checkedPayAccountArr[index] = item.cardNo
          this.checkedPayRealNameArr[index] = item.realname
          this.activeBankFidList[index] = item.id
          this.checkedPayStyleId = this.activeBankFidList[index]
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
      if (!this.activePayModeList[index]) {
        this.$message({
          // 请选择支付方式
          message: this.$t('M.otc_choose_pay_style'),
          type: 'error'
        })
        return false
      }
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      //
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      console.log(this.isNeedPayPassword)
      if (this.buttonStatusArr[index] === true) {
        if (this.isNeedPayPassword) {
          // 弹出交易密码框
          this.dialogVisibleConfirmPayment = true
        } else {
          this.submitConfirmPayment()
        }
      }
    },
    // 5.0 买家点击确认付款按钮 点击交易密码框中的提交按钮--交易密码狂获得焦点
    passWordFocus () {
      this.errPWD = ''
    },
    // 7.0 买家点击确认付款按钮 点击交易密码框中的提交按钮
    submitConfirmPayment: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        // '请输入交易密码'
        this.errPWD = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      } else {
        this.confirmPaymentStatus = true // 禁用确认付款交易密码框提交按钮
        let params = {
          orderId: this.checkedTradingOrderId, // 订单id
          payId: this.checkedPayStyleId // 支付账户id
        }
        params = this.isNeedPayPassword ? {...params, tradePassword: this.tradePassword} : params
        const data = await buyerPayForOrder(params)
        // 正确逻辑
        this.getOTCTradingOrdersList() // 调用接口刷新列表-20190327新增
        this.confirmPaymentStatus = false // 开启确认付款交易密码框提交按钮
        this.dialogVisibleConfirmPayment = false
        this.errPWD = ''
        this.tradePassword = ''
        if (!data) return false
      }
    }, 500),
    // 8.0 卖家点击确认收款按钮
    async confirmGatherMoney (id) {
      this.checkedTradingOrderId = id
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      //
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        // 弹出交易密码框
        this.dialogVisibleConfirmReceipt = true
      } else {
        this.submitConfirmGathering()
      }
    },
    // 9.0 卖家点击确认收款按钮 弹出交易密码框 点击交易密码框中的提交按钮
    submitConfirmGathering: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        this.errPWD = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.confirmGatheringStatus = true // 禁用确认收款交易密码框提交按钮
      let params = {
        orderId: this.checkedTradingOrderId // 订单id
      }
      // 订单id
      params = this.isNeedPayPassword ? {...params, tradePassword: this.tradePassword} : params
      const data = await sellerConfirmGetMoney(params)
      // 正确逻辑
      this.getOTCTradingOrdersList() // 刷新列表-20190327新增
      this.confirmGatheringStatus = false // 开启确认收款交易密码框提交按钮
      this.dialogVisibleConfirmReceipt = false
      this.errPWD = ''
      this.tradePassword = ''
      if (!data) return false
      this.getOTCTradingOrdersList()
    }, 500),
    // 10.0 点击订单申诉弹窗申诉框
    orderAppeal (id, index, orderType) {
      console.log(orderType)
      // console.log(id)
      this.showOrderAppeal.forEach((item, index) => {
        this.$set(this.showOrderAppeal, index, false)
      })
      this.$set(this.showOrderAppeal, index, true)
      this.checkedTradingOrderId = id
      this.uploadFileList = [] // 清空上传图片数组
      this.appealTextAreaValue = '' // 清空申诉原因
    },
    // 11.0 取消订单申诉按钮
    cancelOrderAppeal (index) {
      this.$set(this.showOrderAppeal, index, false)
      this.uploadFileList = [] // 清空上传图片数组
      this.appealTextAreaValue = '' // 清空申诉原因
    },
    // 12.0 卖家提交申诉按钮弹出交易密码框
    async sellerAppeal (id, index, orderType) {
      console.log(orderType)
      this.orderTypeParam = orderType
      // 申诉原因验证
      if (!this.appealTextAreaValue) {
        this.$message({
          // 请输入申诉原因
          message: this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_complaint_appeal_reason'),
          type: 'error'
        })
        return false
      }
      // 申诉图片验证
      console.log(this.uploadFileList.length)
      if (!this.uploadFileList.length) {
        this.$message({
          // message: '请至少上传一张图片！',
          message: this.$t('M.otc_upload_picture2'),
          type: 'error'
        })
        return false
      }
      // 申诉图片赋值
      this.uploadFileList.forEach((item, index) => {
        if (item.response) {
          this[`picture${index + 1}`] = item.response.data.fileUrl
        }
      })
      this.checkedTradingOrderId = id
      console.log(this.checkedTradingOrderId)
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        this.dialogVisibleSubmitComplaint = true
      } else {
        this.sellerSubmitAppeal()
      }
    },
    // 13.0 卖家提交申诉按钮
    sellerSubmitAppeal: _.debounce(async function () {
      console.log(this.orderTypeParam)
      if (this.isNeedPayPassword && !this.tradePassword) {
        // 请输入交易密码
        this.errPWD = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      this.submitAppealStatus = true // 禁用提交申诉交易密码框提交按钮
      let params = {
        orderId: this.checkedTradingOrderId, // 订单id
        reason: this.appealTextAreaValue, // 申诉原因
        picture1: this.picture1,
        picture2: this.picture2,
        picture3: this.picture3
      }
      params = this.isNeedPayPassword ? {...params, tradePassword: this.tradePassword} : params
      let data
      if (this.orderTypeParam === 'BUY') {
        console.log('BUY')
        data = await buyerSendAppeal(params)
      }
      if (this.orderTypeParam === 'SELL') {
        console.log('SELL')
        data = await sellerSendAppeal(params)
      }
      console.log(data)
      // 正确逻辑
      this.submitAppealStatus = false // 开启提交申诉交易密码框提交按钮
      this.dialogVisibleSubmitComplaint = false
      this.errPWD = '' // 清空密码错提示
      this.tradePassword = '' // 清空密码框
      this.appealTextAreaValue = '' // 清空申诉原因
      // 再次调用接口刷新列表
      this.getOTCTradingOrdersList()
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
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 当前选中语言
      activeLanguage: state => state.common.activeLanguage,
      isLogin: state => state.user.isLogin, // 是否登录
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      loginStep1Info: state => state.user.loginStep1Info,
      configInfo: state => state.common.footerInfo.configInfo
    })
  },
  watch: {
    language (newVal) {
      this.errPWD = '' // 切换语言清空交易密码框错误提示
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
@import "../../../static/css/scss/index";

.otc-trading-order-box {
  > .otc-trading-order-content {
    border-radius: 5px;

    > .order-list {
      box-sizing: border-box;
      width: 1195px;
      height: 170px;
      margin-bottom: 15px;
      border-radius: 5px;

      > .order {
        > .order-list-head {
          position: relative;
          display: flex;
          justify-content: space-between;
          box-sizing: border-box;
          height: 36px;
          padding: 0 77px 0 25px;
          line-height: 36px;

          > .order-id {
            padding-left: 300px;
          }

          > .order-list-head-icon {
            position: absolute;
            top: 0;
            right: 0;
            width: 0;
            height: 0;
            border-bottom: 18px solid transparent;
            border-left: 18px solid transparent;
            border-radius: 5px;
          }

          > .buy-icon {
            border-top: 18px solid #d45858;
            border-right: 18px solid #d45858;
          }

          > .sell-icon {
            border-top: 18px solid #008069;
            border-right: 18px solid #008069;
          }

          > .buy-sell-icon {
            position: absolute;
            top: -8px;
            right: 4px;
            color: #fff;
          }
        }

        > .order-list-body {
          display: flex;
          flex: 7;
          padding: 20px 20px 15px;

          > .order-list-body-left {
            flex: 2;

            > .logo {
              display: inline-block;
              margin-right: 10px;
              text-align: center;

              > .logo-name {
                margin-top: 4px;
              }
            }

            > .left-info {
              display: inline-block;

              > .trade-info {
                line-height: 20px;
              }
            }
          }

          > .order-list-body-middle {
            flex: 2;
            box-sizing: border-box;

            > .middle-content {
              display: flex;

              .trader-info {
                flex: 2;
                width: 190px;

                > .pay-style {
                  position: relative;
                  margin: 0 0 8px 20px;

                  > .qiandai-icon {
                    > .icon {
                      position: absolute;
                      z-index: 2;
                      top: 5px;
                      left: 10px;
                      width: 14px;
                      height: 14px;
                    }
                  }
                }

                > .bank-info {
                  margin-left: 20px;
                  line-height: 20px;
                }

                > .order-cancel-tips {
                  margin-left: 10px;
                  line-height: 20px;
                }

                > .bankMoneyInfo {
                  margin-left: 20px;
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
                flex: 1;
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
                }

                .count-time {
                  margin-left: 10px;
                }
              }

              > .action-explain {
                margin-left: 20px;
                line-height: 24px;
              }

              > .count-down-time {
                line-height: 20px;

                .timeIcon {
                  margin-right: 10px;
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
          line-height: 36px;
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
              }

              > .appeal-textarea-text {
                box-sizing: border-box;
                width: 180px;
                height: 90px;
                padding: 8px;
                border: 1px solid #7587a5;
                border-radius: 4px;
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
                color: #338ff5;
              }

              > .upload-content {
                display: inline-block;
                margin-left: 10px;
              }
            }

            > .appeal-button {
              flex: 1;
              padding-top: 100px;
            }

            .star {
              color: #e8554f;
            }
          }
        }
      }
    }

    > .no-data {
      width: 1195px;
      height: 482px;
      line-height: 482px;
      color: rgba(255, 255, 255, .8);
    }
  }

  /deep/ {
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

    .el-input__icon {
      line-height: 26px;
    }

    .el-input--suffix {
      .el-input__inner {
        width: 170px;
        height: 26px;
      }
    }

    .el-input__inner {
      padding: 0 30px;
      border: none;
    }

    .el-select-dropdown {
      border: none;
    }

    .el-select-dropdown__item {
      height: 30px !important;
      line-height: 30px !important;
    }

    .el-button--mini {
      padding: 3px 10px;
    }

    .el-textarea {
      /* width: 540px; */
      width: 180px;
    }

    .el-textarea__inner {
      height: 90px;
      resize: none;
      font-size: 12px;
    }

    .bank-info-picture {
      .el-button {
        padding: 2px 6px;
      }
    }

    .password-dialog {
      .el-dialog {
        width: 350px;
        height: 240px;
        border-radius: 4px;
      }

      .el-dialog__header {
        padding: 10px 20px;
        border-radius: 4px;
      }

      .el-dialog__title {
        font-size: 14px;
      }

      .el-dialog__headerbtn {
        top: 15px;
        right: 10px;
      }

      .el-dialog__body {
        padding: 15px 20px 10px 30px;
        font-size: 12px;

        .input {
          margin-top: 13px;
        }

        .password-input {
          display: inline-block;
          width: 280px;
          height: 36px;
          padding-left: 10px;
          border-radius: 4px;
          font-size: 14px;
        }

        .error-info {
          height: 20px;
          padding-top: 5px;
          font-size: 12px;
        }

        .close-pwd-tip {
          margin-top: 5px;
          color: #338ff5;
        }
      }

      .el-dialog__footer {
        padding: 0;
        text-align: center;

        .forget-pwd-tip {
          padding: 8px 20px 0 0;
          color: #338ff5;
        }
      }

      .el-button {
        width: 290px;
        padding: 7px 20px;
        border: 0;
      }

      .el-button--primary {
        background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
      }
    }
  }

  &.night {
    > .otc-trading-order-content {
      > .order-list {
        border: 1px solid #485776;
        background-color: $mainContentNightBgColor;

        > .order {
          > .order-list-head {
            border-bottom: 1px solid #262f38;
            color: #9da5b3;

            > .buy-icon {
              border-top: 18px solid #d45858;
              border-right: 18px solid #d45858;
            }

            > .sell-icon {
              border-top: 18px solid #008069;
              border-right: 18px solid #008069;
            }

            > .buy-sell-icon {
              color: #fff;
            }
          }

          > .order-list-body {
            color: #9da5b3;

            > .order-list-body-left {
              border-right: 1px solid #262f38;

              > .left-info {
                > .trade-info {
                  > .money {
                    color: #5e95ec;
                  }
                }
              }
            }

            > .order-list-body-middle {
              border-right: 1px solid #262f38;

              > .middle-content {
                .trader-info {
                  > .pay-style {
                    > .qiandai-icon {
                      > .icon {
                        color: #fff;
                      }
                    }
                  }
                }
              }
            }

            > .order-list-body-right {
              flex: 3;

              > .right-content {
                > .action-tips {
                  .wait-pay {
                    color: #e8554f;
                  }
                }

                > .submitted-confirm-payment {
                  color: #5e95ec;

                  > .buy-appeal-order {
                    margin-left: 20px;
                    color: #409eff;
                    background-color: #cdd9ee;
                  }
                }

                > .action-explain {
                  > .remaining-time {
                    color: #e8554f;
                  }

                  .appeal-order {
                    color: #409eff;
                    background-color: #cdd9ee;
                  }
                }

                > .count-down-time {
                  .timeIcon {
                    color: #e8554f;
                  }
                }
              }
            }
          }
        }

        > .appeal {
          > .appeal-head {
            border-bottom: 1px solid #262f38;
            color: #fff;
          }

          > .appeal-body {
            > .appeal-body-content {
              > .appeal-textarea {
                > .appeal-reason {
                  color: #338ff5;
                }

                > .appeal-textarea-text {
                  color: #9da5b3;
                  background-color: #1e2636;
                }
              }

              > .appeal-button {
                .cancel-appeal {
                  border: 1px solid rgba(52, 70, 99, 1);
                  color: #8094bb;
                  background-color: #1e2636;
                }
              }
            }
          }
        }
      }

      > .no-data {
        color: rgba(255, 255, 255, .8);
        background-color: #1c1f32;
      }

      > .password-dialog {
        .tips {
          color: #d45858;
        }
      }
    }

    /deep/ {
      .action-explain .el-button.el-button--default.el-button--mini.is-disabled.is-plain {
        border: 0;
        color: #fff;
        background-color: rgba(255, 255, 255, .4);
      }

      .el-input--suffix {
        .el-input__inner {
          width: 170px;
          height: 26px;
        }
      }

      .el-input__inner {
        padding: 0 30px;
        border: none;
        color: #9da5b3;
        background-color: #303b45;
      }

      .el-select-dropdown {
        border: none;
        background-color: #29343f;
      }

      .el-select-dropdown__item {
        height: 30px !important;
        line-height: 30px !important;

        &.selected {
          color: #338ff5;
        }

        &:hover {
          background-color: #29343f;
        }

        &.hover {
          color: #338ff5;
          background-color: #29343f;
        }
      }

      .el-popper[x-placement^=bottom] {
        .popper__arrow {
          border-bottom-color: #29343f;

          &::after {
            border-bottom-color: #29343f;
          }
        }
      }

      .el-button--mini {
        padding: 3px 10px;
      }

      .el-textarea {
        /* width: 540px; */
      }

      .el-textarea__inner {
        height: 90px;
        border: 1px solid #7587a5;
        resize: none;
        font-size: 12px;
        color: #9da5b3;
        background-color: #1e2636;
      }

      .bank-info-picture {
        .el-button {
          padding: 2px 6px;
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

      .password-dialog {
        .el-dialog {
          width: 350px;
          height: 240px;
          border-radius: 4px;
          background: #28334a;

          .el-dialog__header {
            padding: 10px 20px;
            border-radius: 4px;
            background-color: #20293c;
          }

          .el-dialog__title {
            font-size: 14px;
            color: #fff;
          }

          .el-dialog__headerbtn {
            top: 15px;
            right: 10px;
          }

          .el-dialog__body {
            padding: 15px 20px 10px 30px;
            font-size: 12px;
            color: #fff;

            .input {
              margin-top: 13px;
            }

            .password-input {
              display: inline-block;
              width: 280px;
              height: 36px;
              padding-left: 10px;
              border-radius: 4px;
              font-size: 14px;
              color: #fff;
              background-color: #1a2233;
            }

            .error-info {
              height: 20px;
              padding-top: 5px;
              font-size: 12px;
            }
          }

          .el-dialog__footer {
            padding: 0;
            text-align: center;
          }

          .el-button {
            width: 290px;
            padding: 7px 20px;
            border: 0;
          }

          .el-button--primary {
            background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }
      }
    }
  }

  &.day {
    > .otc-trading-order-content {
      > .order-list {
        border: 1px solid rgba(72, 87, 118, .1);
        background-color: #fff;

        > .order {
          > .order-list-head {
            border-bottom: 1px solid rgba(72, 87, 118, .1);
            color: #333;

            > .buy-icon {
              border-top: 18px solid #d45858;
              border-right: 18px solid #d45858;
            }

            > .sell-icon {
              border-top: 18px solid #008069;
              border-right: 18px solid #008069;
            }

            > .buy-sell-icon {
              color: #fff;
            }
          }

          > .order-list-body {
            color: #7d90ac;

            > .order-list-body-left {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .left-info {
                > .trade-info {
                  > .money {
                    color: #5e95ec;
                  }
                }
              }
            }

            > .order-list-body-middle {
              border-right: 1px solid rgba(38, 47, 56, .1);

              > .middle-content {
                .trader-info {
                  > .pay-style {
                    > .qiandai-icon {
                      > .icon {
                        color: #338ff5;
                      }
                    }
                  }
                }
              }
            }

            > .order-list-body-right {
              flex: 3;

              > .right-content {
                > .action-tips {
                  .wait-pay {
                    color: #e8554f;
                  }
                }

                > .submitted-confirm-payment {
                  color: #5e95ec;

                  > .buy-appeal-order {
                    margin-left: 20px;
                    color: #8094bb;
                    background-color: #cdd9ee;
                  }
                }

                > .action-explain {
                  > .remaining-time {
                    color: #e8554f;
                  }

                  .appeal-order {
                    color: #8094bb;
                    background-color: #cdd9ee;
                  }
                }

                > .count-down-time {
                  .timeIcon {
                    color: #e8554f;
                  }
                }
              }
            }
          }
        }

        > .appeal {
          > .appeal-head {
            border: 1px solid rgba(72, 87, 118, .1);
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;
            color: #333;
            background-color: #e7e8e9;
          }

          > .appeal-body {
            > .appeal-body-content {
              > .appeal-textarea {
                > .appeal-reason {
                  color: #338ff5;
                }

                > .appeal-textarea-text {
                  color: #7d90ac;
                  background-color: #fff;
                }
              }

              > .appeal-button {
                .cancel-appeal {
                  border: 1px solid rgba(52, 70, 99, 1);
                  color: #8094bb;
                  background-color: #fff;
                }
              }
            }
          }
        }
      }

      > .no-data {
        border: 1px solid rgba(72, 87, 118, .1);
        border-radius: 5px;
        color: #333;
        background-color: #fff;
      }

      > .password-dialog {
        .tips {
          color: #d45858;
        }
      }
    }

    /deep/ {
      .action-explain .el-button.el-button--default.el-button--mini.is-disabled.is-plain {
        border: 0;
        color: #b0b0b0;
        background-color: #e7e7e7;
      }

      .el-input--suffix {
        .el-input__inner {
          width: 170px;
          height: 26px;
        }
      }

      .el-input__inner {
        padding: 0 30px;
        border: none;
        color: #7d90ac;
        background-color: #eaf4fe;
      }

      .el-select-dropdown {
        border: none;
        background-color: #29343f;
      }

      .el-select-dropdown__item {
        height: 30px !important;
        line-height: 30px !important;

        &.selected {
          color: #338ff5;
        }

        &:hover {
          background-color: #29343f;
        }

        &.hover {
          color: #338ff5;
          background-color: #29343f;
        }
      }

      .el-popper[x-placement^=bottom] {
        .popper__arrow {
          border-bottom-color: #29343f;

          &::after {
            border-bottom-color: #29343f;
          }
        }
      }

      .el-select {
        .el-input {
          .el-select__caret {
            color: #338ff5;
          }
        }
      }

      .el-button--mini {
        padding: 3px 10px;
      }

      .el-textarea {
        /* width: 540px; */
      }

      .el-textarea__inner {
        height: 90px;
        border: 1px solid #7587a5;
        resize: none;
        font-size: 12px;
        color: #7d90ac;
        background-color: #fff;
      }

      .bank-info-picture {
        .el-button {
          padding: 2px 6px;
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

      .password-dialog {
        .el-dialog {
          width: 350px;
          height: 240px;
          border-radius: 4px;
          background: #fff;
        }

        .el-dialog__header {
          padding: 10px 20px;
          border-radius: 4px;
          background-color: #fff;
        }

        .el-dialog__title {
          font-size: 14px;
          color: #338ff5;
        }

        .el-dialog__headerbtn {
          top: 15px;
          right: 10px;
        }

        .el-dialog__body {
          padding: 15px 20px 10px 30px;
          font-size: 12px;
          color: #fff;

          .input {
            margin-top: 13px;
          }

          .password-input {
            display: inline-block;
            width: 280px;
            height: 36px;
            padding-left: 10px;
            border: 1px solid #ecf1f8;
            border-radius: 4px;
            font-size: 14px;
          }

          .error-info {
            height: 20px;
            padding-top: 5px;
            font-size: 12px;
          }
        }

        .el-dialog__footer {
          padding: 0;
          text-align: center;
        }

        .el-button {
          width: 290px;
          padding: 7px 20px;
          border: 0;
        }

        .el-button--primary {
          background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }
      }
    }
  }
}
</style>
