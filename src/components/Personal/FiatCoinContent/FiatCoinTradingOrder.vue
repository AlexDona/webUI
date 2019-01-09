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
        <div class="order" v-if="item.orderType === 'BUY'">
          <!-- 1.1 表头 -->
          <div class="order-list-head">
            <!-- 买卖家 -->
            <div class="buyer-seller">
              <!--卖家-->
              {{$t('M.otc_seller')}}：{{item.sellName}}
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
            <div class="order-list-head-icon buy-icon">
              <!-- <img src="../../assets/develop/buy.png" alt=""> -->
            </div>
            <div class="buy-sell-icon">
              <!--买-->
              {{$t('' + 'M.comm_bid')}}
            </div>
          </div>
          <!-- 1.2 表身体 -->
          <div class="order-list-body">
            <!-- 1.2.1 表左侧 -->
            <div class="order-list-body-left">
              <!-- logo图标和名字 -->
              <div class="logo">
                <!-- src="../../assets/develop/bi.png" -->
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
                <!-- 卖家手机号 -->
                <!-- 付款前不显示 -->
                <p
                  class="trade-info"
                >
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
                    <span>
                      <!--收款人-->
                      {{$t('M.otc_payee')}}: {{item.sellName}}
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
                    <!-- <span>
                      {{activeBankProv[index]}}{{activeBankCity[index]}}{{activeBankArea[index]}}{{activeBankName[index]}}{{activeBankDetailAddress[index]}}
                    </span> -->
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
                      <!-- {{$t('M.co' + 'mm_bill')}}: {{activedPayAccountArr[index]}} -->
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
                v-if="item.status == 'PICKED'"
              >
                <!-- 等待付款确认付款按钮 -->
                <p class="action-tips">
                  <span class="wait-pay">
                    <!--等待付款-->
                    {{$t('M.otc_waiting_payment')}}
                  </span>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="comfirmPayMoney(index)"
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
                    <!-- <span>
                      {{BIHTimeFormatting(cancelOrderTimeArr[index])}}
                    </span> -->
                    <span v-if="cancelOrderTimeArr[index]">{{BIHTimeFormatting(cancelOrderTimeArr[index])}}</span>
                    <span v-else>--</span>
                  </span>
                </p>
                <!-- 注意 -->
                <p class="action-tips">
                  <!--注意！计时结束前未手动转账并点击"确认付款"，您的订单将自动取消，若上述情况累计出现3次，您的账户将被冻结24小时。-->
                  {{$t('M.otc_tradingorder_notice')}}
                </p>
              </div>
              <!-- 付款后 -->
              <div
                class="right-content"
                v-if="item.status == 'PAYED'"
              >
                <p class="action-tips submitted-confirm-payment">
                  <!--已提交确认付款-->
                  {{$t('M.otc_confirmed_receipts')}}
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
            <!-- 买家 -->
            <div class="buyer-seller">
              <!--买家-->
              {{$t('M.otc_buyer')}}：{{item.buyName}}
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
            <div class="order-list-head-icon sell-icon">
              <!-- <img src="../../assets/develop/sell.png" alt=""> -->
            </div>
            <div class="buy-sell-icon">
              <!--卖-->
              {{$t('M.comm_ask')}}
            </div>
          </div>
          <!-- 2.2 表身体 -->
          <div class="order-list-body">
            <!-- 2.2.1 表左侧 -->
            <div class="order-list-body-left">
              <div class="logo">
                <!-- src="../../assets/develop/bi.png" -->
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
                <!-- 卖家手机号 -->
                <p class="trade-info">
                  <!--买家手机号-->
                  <!-- {{$t('M.otc_trading_sellphone')}}：{{item.buyPhone}} -->
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
                  <p class="order-cancle-tips">
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
                v-if="item.status == 'PICKED'"
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
                v-if="item.status == 'PAYED'"
              >
                <p class="action-explain">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="comfirmGatherMoney(item.id)"
                  >
                    <!--确认收款-->
                    {{$t('M.otc_trading_collectionconfirmation')}}
                  </el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="orderAppeal(item.id, index)"
                  >
                    <!--订单申诉-->
                    {{$t('M.otc_complaint')}}
                  </el-button>
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
                    <!-- <span>{{BIHTimeFormatting(accomplishOrderTimeArr[index])}}</span> -->
                    <span v-if="accomplishOrderTimeArr[index]">{{BIHTimeFormatting(accomplishOrderTimeArr[index])}}</span>
                    <span v-else>--</span>
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
              <!-- 文本域部分 -->
              <div class="appeal-textarea">
                <span class="appeal-reason">
                  <!--*申诉原因-->
                  *{{$t('M.otc_complaint_appeal_reason')}}
                </span>
                <el-input
                  type="textarea"
                  maxlength="30"
                  v-model="appealTextareaValue"
                >
                </el-input>
              </div>
              <!-- 按钮部分 -->
              <div class="appeal-button">
                <el-button
                  type="primary"
                  size="mini"
                  @click="sellerAppeal"
                >
                  <!--提交申诉-->
                  {{$t('M.otc_complaint_submit')}}
                </el-button>
                <el-button
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
      <div class="no-data" v-if="!tradingOrderList.length">
        <!--暂无数据-->
        {{ $t('M.comm_no_data') }}
      </div>
      <!-- 三、分页-->
      <el-pagination
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
          top="25vh"
          width="470"
        >
          <!--<div>-->
            <!--请输入交易密码-->
          <!--</div>-->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
              @focus="passWordFocus"
            >
          </div>
          <div class="error-info">
            <!-- 错误提示 -->
            <div class="tips">
              {{errpwd}}
            </div>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
              <button
                class="button"
                type="primary"
                @click="submitButton1"
              >
                <!--提 交-->
                {{$t('M.comm_sub_time')}}
              </button>
          </span>
        </el-dialog>
      </div>
      <!-- 五 卖家点击确认收款按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!--交易密码-->
        <el-dialog
          :title="$t('M.comm_password')"
          :visible.sync="dialogVisible2"
          top="25vh"
          width="470"
        >
          <!--<div>-->
            <!--请输入交易密码2-->
          <!--</div>-->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
            >
          </div>
          <div class="error-info">
            <!-- 错误提示 -->
            <div class="tips">
              <!--错误提示-->
              {{errpwd}}
            </div>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
              <button
                class="button"
                type="primary"
                @click="submitButton2"
              >
                <!--提 交-->
                {{$t('M.comm_sub_time')}}
              </button>
          </span>
        </el-dialog>
      </div>
      <!-- 六 点击提交申诉按钮 弹出交易密码框 -->
      <div class="password-dialog">
        <!--交易密码-->
        <el-dialog
          :title="$t('M.comm_password')"
          :visible.sync="dialogVisible3"
          top="25vh"
          width="470"
        >
          <!--<div>请输入交易密码3</div>-->
          <div class="input">
            <input
              type="password"
              class="password-input"
              v-model="tradePassword"
            >
          </div>
          <div class="error-info">
            <!-- 错误提示 -->
            <div class="tips">{{errpwd}}</div>
          </div>
          <span
            slot="footer"
            class="dialog-footer">
              <button
                class="button"
                type="primary"
                @click="submitsellerAppeal"
              >
                <!--提 交-->
                {{$t('M.comm_sub_time')}}
              </button>
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
  cancelUserOtcOrder,
  completeUserOtcOrder
} from '../../../utils/api/OTC'
import {timeFilter, formatSeconds} from '../../../utils'
import IconFontCommon from '../../Common/IconFontCommon'
import {
  returnAjaxMsg,
  changeCurrentPageForLegalTrader
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标组件
  },
  // props,
  data () {
    return {
      dialogVisible1: false, // 确认付款交易密码框
      dialogVisible2: false, // 确认收款交易密码框
      dialogVisible3: false, // 提交申诉交易密码框
      appealTextareaValue: '', // 订单申诉原因文本域内容
      activitedPayStyle: '', //  选中的支付方式
      activitedPayStyleId: '', //  选中的支付方式id-往后台传送的参数
      // tradingOrderList: [], // 交易中订单列表
      activedTradingOrderId: '', // 选中的订单id
      activedPayAccountArr: [], // 当前选中的订单中付款方式中的付款账号 ：为了解决支付宝和微信账号一样做的bug修复
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
      accomplishOrdersTimer: null // 自动成交倒计时
      // pageSize:
    }
  },
  created () {
    // 1.0 请求交易中订单列表
    // this.getOTCTradingOrdersList()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'CHANGE_LEGAL_PAGE',
      'CHANGE_RE_RENDER_TRADING_LIST_STATUS' // 更改重新渲染交易中订单列表状态
    ]),
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
      return formatSeconds(date)
    },
    // 1.3 自动取消订单倒计时
    cancelSetInter () {
      clearInterval(this.cancelOrdersTimer)
      this.cancelOrdersTimer = setInterval(() => {
        // console.log(this.cancelOrderTimeArr)
        // 循环自动取消倒计时时间数组
        this.cancelOrderTimeArr.forEach((item, index) => {
          // console.log(item)
          this.$set(this.cancelOrderTimeArr, index, this.cancelOrderTimeArr[index] - 1000)
          // console.log(this.cancelOrderTimeArr[index])
          // console.log(typeof (this.cancelOrderTimeArr[index]))
          if (this.cancelOrderTimeArr[index] < 0 || this.cancelOrderTimeArr[index] == 0) {
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
          this.$set(this.accomplishOrderTimeArr, index, this.accomplishOrderTimeArr[index] - 1000)
          // console.log(this.accomplishOrderTimeArr[index])
          // 任增加
          if (!(this.accomplishOrderTimeArr[index] > 0)) {
            this.cancelCompleteUserOtcOrder(2)
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
        if (!(returnAjaxMsg(data, this, 0))) {
          return false
        } else {
          // 返回数据正确的逻辑：重新渲染列表
          // this.getOTCTradingOrdersList()
          this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
        }
      }
      if (val === 2) {
        data = await completeUserOtcOrder()
        console.log('成交（过期 卖家 未收款）')
        // console.log(data)
        if (!(returnAjaxMsg(data, this, 0))) {
          return false
        } else {
          // 返回数据正确的逻辑：重新渲染列表
          // this.getOTCTradingOrdersList()
          this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
        }
      }
    },
    // 2.0 倒计时逻辑方法 timerLogicMethod
    timerLogicMethod () {
      this.activePayModeList = [] // 清空支付方式数组：防止换页码之后之前选中的在此页面付款方式也被选中的问题
      this.cancelOrderTimeArr = []
      this.accomplishOrderTimeArr = []
      // 循环数组
      this.tradingOrderList.forEach((item, index) => {
        this.buttonStatusArr[index] = false
        this.showOrderAppeal[index] = false
        // 自动取消订单倒计时数组集
        if (item.status === 'PICKED') {
          this.cancelOrderTimeArr[index] = item.cancelRestTime // cancelRestTime毫秒单位
          this.accomplishOrderTimeArr[index] = 10000000 // completeRestTime毫秒单位
        } else if (item.status === 'PAYED') {
          // 自动成交倒计时数组集
          this.cancelOrderTimeArr[index] = 10000000 // cancelRestTime毫秒单位
          this.accomplishOrderTimeArr[index] = item.completeRestTime // completeRestTime毫秒单位
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
      console.log('第' + index + '条数据')
      console.log(index)
      console.log('选中订单的订单号')
      console.log(this.tradingOrderList[index].id)
      this.activedTradingOrderId = this.tradingOrderList[index].id
      this.tradingOrderList[index].userBankList.forEach((item) => {
        if (item.id == this.activePayModeList[index]) {
          this.activedPayAccountArr[index] = item.cardNo
          console.log('选中的付款账号：' + this.activedPayAccountArr[index])
          this.activeBankFidList[index] = item.id
          console.log('选中的支付方式id' + this.activeBankFidList[index])
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
          console.log('支付类型：' + this.activeBankType[index])
          // 支付码
          this.activeBankCode[index] = item.qrcode
          console.log('支付码')
          console.log(this.activeBankCode[index])
        }
        this.buttonStatusArr[index] = true
      })
    },
    // 4.0 买家点击确认付款按钮 弹出交易密码框
    comfirmPayMoney (index) {
      if (!this.activePayModeList[index]) {
        this.$message({
          // 请选择支付方式
          message: this.$t('M.comm_please_choose') + this.$t('M.otc_index_Payment_method'),
          type: 'error'
        })
        return false
      }
      if (this.buttonStatusArr[index] === true) {
        // 弹出交易密码框
        this.dialogVisible1 = true
      }
    },
    // 5.0 买家点击确认付款按钮 点击交易密码框中的提交按钮--交易密码狂获得焦点
    passWordFocus () {
      this.errpwd = ''
    },
    // 6.0 买家点击确认付款按钮 点击交易密码框中的提交按钮
    async submitButton1 () {
      if (!this.tradePassword) {
        // 请输入交易密码
        this.errpwd = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.comm_password')
        return false
      } else {
        const data = await buyerPayForOrder({
          orderId: this.activedTradingOrderId, // 订单id
          payId: this.activitedPayStyleId, // 支付账户id
          tradePassword: this.tradePassword // 交易密码
        })
        console.log(data)
        // 提示信息
        if (!(returnAjaxMsg(data, this, 1))) {
          return false
        } else {
          // 先判断status订单状态（已创建，已付款，已完成，已取消，已冻结 PICKED PAYED COMPLETED CANCELED FROZEN）
          // 付款成功后，根据返回的状态再渲染
          // 付款成功后逻辑
          // 1关闭交易密码框
          this.dialogVisible1 = false
          this.errpwd = '' // 清空密码错提示
          this.tradePassword = '' // 清空密码框
          // 2再次调用接口刷新列表
          // this.SET_LEGAL_TENDER_REFLASH_STATUS({
          //   type: 'TRADING',
          //   status: true
          // })
          // 2再次调用接口刷新列表
          // this.getOTCTradingOrdersList()
          this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
        }
      }
    },
    // 7.0 卖家在买家付款前点击确认收款按钮的提示事件
    gatheringBefore () {
      this.$message({
        // 请等待买家付款
        message: this.$t('M.comm_please') + this.$t('M.otc_waiting_buyer_payment') + '。',
        type: 'error'
      })
    },
    // 交易密码框错误提示
    // tradePasswordLeave (e) {
    //  console.log(e)
    // },
    // 8.0 卖家点击确认收款按钮
    comfirmGatherMoney (id) {
      this.activedTradingOrderId = id
      // 弹出交易密码框
      this.dialogVisible2 = true
      // console.log(id)
      console.log(this.activedTradingOrderId)
    },
    // 9.0 卖家点击确认收款按钮 弹出交易密码框 点击交易密码框中的提交按钮
    async submitButton2 () {
      const data = await sellerConfirmGetMoney({
        orderId: this.activedTradingOrderId, // 订单id
        tradePassword: this.tradePassword // 交易密码
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMsg(data, this, 1))) {
        return false
      } else {
        // 先判断status订单状态（已创建，已付款，已完成，已取消，已冻结 PICKED PAYED COMPLETED CANCELED FROZEN）
        // 付款成功后，根据返回的状态再渲染
        // 付款成功后逻辑
        // 1关闭交易密码框
        this.dialogVisible2 = false
        this.errpwd = '' // 清空密码错提示
        this.tradePassword = '' // 清空密码框
        // 2再次调用接口刷新列表
        // this.SET_LEGAL_TENDER_REFLASH_STATUS({
        //   type: 'TRADING',
        //   status: true
        // })
        // 2再次调用接口刷新列表
        // this.getOTCTradingOrdersList()
        this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      }
    },
    // 10.0 点击订单申诉弹窗申诉框
    orderAppeal (id, index) {
      console.log(id)
      // this.showOrderAppeal[index] = true
      this.$set(this.showOrderAppeal, index, true)
      this.activedTradingOrderId = id
      console.log(this.activedTradingOrderId)
    },
    // 11.0 取消订单申诉按钮
    cancelOrderAppeal (index) {
      // this.showOrderAppeal = false
      this.$set(this.showOrderAppeal, index, false)
    },
    // 12.0 卖家提交申诉按钮弹出交易密码框
    sellerAppeal () {
      if (!this.appealTextareaValue) {
        this.$message({
          // 请输入申诉原因
          message: this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_complaint_appeal_reason'),
          type: 'error'
        })
        return false
      }
      this.dialogVisible3 = true
    },
    // 13.0 卖家提交申诉按钮
    async submitsellerAppeal () {
      const data = await sellerSendAppeal({
        orderId: this.activedTradingOrderId, // 订单id
        reason: this.appealTextareaValue, // 申诉原因
        tradePassword: this.tradePassword // 交易密码
      })
      console.log(data)
      // 提示信息
      if (!(returnAjaxMsg(data, this, 1))) {
        return false
      } else {
        this.dialogVisible3 = false
        this.errpwd = '' // 清空密码错提示
        this.tradePassword = '' // 清空密码框
        // 2再次调用接口刷新列表
        // this.getOTCTradingOrdersList()
        this.CHANGE_RE_RENDER_TRADING_LIST_STATUS(true)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 当前选中语言
      language: state => state.common.language,
      activeLanguage: state => state.common.activeLanguage,
      theme: state => state.common.theme,
      // legalTraderTradingList: state => state.personal.legalTraderTradingList, // 从全局获得的交易中订单列表
      tradingOrderList: state => state.personal.legalTraderTradingList, // 从全局获得的交易中订单列表tradingOrderList
      legalTraderTradingReflashStatus: state => state.personal.legalTraderTradingReflashStatus,
      legalTradePageTotals: state => state.personal.legalTradePageTotals,
      legalTradePageNum: state => state.personal.legalTradePageNum,
      reRenderTradingListStatus: state => state.personal.reRenderTradingListStatus // 从全局获得的重新渲染交易中订单列表状态
    })
    // 从全局获得的交易中订单列表
    // tradingOrderList () {
    //   return this.legalTraderTradingList
    // }
  },
  watch: {
    activeLanguage (newVal) {
      console.log('当前选中语言')
      console.log(newVal)
    },
    language (newVal) {
      console.log('language')
      console.log(newVal)
    },
    // 监控交易中订单列表并调用倒计时逻辑方法
    tradingOrderList (newVal) {
      this.timerLogicMethod()
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
    legalTradePageTotals (newVal) {
      console.log(newVal)
    },
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
  @import "../../../../static/css/scss/Personal/IndexPersonal.scss";

  .fiat-trading-order-box {
    > .fiat-trading-order-content {
      min-height: 386px;
      border-radius: 5px;

      .button {
        width: 290px;
        padding: 8px 20px;
        border: 0;
        border-radius: 5px;
      }

      > .order-list {
        box-sizing: border-box;
        height: 170px;
        margin-bottom: 15px;
        border: 1px solid #262f38;
        border-radius: 5px;
        font-size: 12px;
        background-color: $nightMainBgColor;

        > .order {
          > .order-list-head {
            position: relative;
            display: flex;
            justify-content: space-between;
            box-sizing: border-box;
            height: 36px;
            padding: 0 77px 0 25px;
            border-bottom: 1px solid #262f38;
            line-height: 36px;
            color: #9da5b3;

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
                    color: #5e95ec;
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
                  width: 190px;

                  > .pay-style {
                    position: relative;
                    width: 150px;
                    height: 23px;
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

                  > .order-cancle-tips {
                    margin-left: 20px;
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
                    color: #e8554f;
                  }

                  .count-time {
                    margin-left: 10px;
                  }
                }

                > .submitted-confirm-payment {
                  color: #5e95ec;
                }

                > .action-explain {
                  margin-left: 20px;
                  line-height: 20px;

                  > .remaining-time {
                    color: #d45858;
                  }
                }

                > .count-down-time {
                  line-height: 20px;

                  .timeIcon {
                    margin-right: 10px;
                    color: #d45858;
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
            color: #fff;
          }

          > .appeal-body {
            > .appeal-body-content {
              display: flex;
              flex: 3;

              > .appeal-textarea {
                display: flex;
                flex: 2;
                justify-content: flex-start;
                margin: 15px 0 0 20px;

                > .appeal-reason {
                  margin-right: 10px;
                  color: #338ff5;
                }
              }

              > .appeal-button {
                flex: 1;
                padding-top: 80px;
              }
            }
          }
        }
      }

      > .no-data {
        height: 385px;
        line-height: 385px;
        text-align: center;
      }

      > .password-dialog {
        .tips {
          color: #d45858;
        }
      }
    }

    /deep/ {
      /* 交易中的订单样式重写 */

      /* 1.0付款方式下拉框 */
      .el-input--suffix {
        .el-input__inner {
          width: 150px;
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

      /* 2.0按钮样式 */
      .el-button--mini {
        padding: 3px 10px;
      }

      /* 3.0 订单申诉 */
      .el-textarea {
        width: 540px;
      }

      .el-textarea__inner {
        height: 90px;
        resize: none;
        font-size: 14px;
      }

      /* 4.0 扫码付款按钮及弹窗支付宝和微信图片 */
      .bank-info-picture {
        .el-button {
          float: right;
          padding: 2px 6px;
        }
      }

      /* 输入密码弹出框 */
      .password-dialog {
        .el-dialog {
          width: 350px;
          height: 207px;
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
        }

        .el-dialog__footer {
          padding: 0;
          text-align: center;
        }

        .el-button--primary {
          background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
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
      background-color: $nightBgColor;

      > .fiat-trading-order-content {
        .button {
          color: #fff;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        > .order-list {
          > .order {
            > .order-list-body {
              > .order-list-body-middle {
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
            }
          }
        }

        > .no-data {
          background-color: $nightMainBgColor;
        }
      }

      > .background-color {
        background-color: $nightMainBgColor;

        > .fiat-color {
          color: #338ff5;
        }
      }

      /deep/ {
        /* 黑色样式切换 */
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
          color: #338ff5;
        }

        .el-select-dropdown__item {
          &:hover {
            color: #338ff5;
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

        .el-textarea__inner {
          border: 1px solid #7587a5;
          background-color: #1c1f32;
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
            background: #28334a;
          }

          .el-dialog__header {
            background-color: #20293c;
          }

          .el-dialog__title {
            color: #fff;
          }

          .el-dialog__body {
            color: #fff;

            .password-input {
              color: #fff;
              background-color: #1a2233;
            }

            .error-info {
              color: #fff;
            }
          }
        }

        .el-button {
          border-color: #409eff;
          color: #fff;
          background-color: #409eff;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .fiat-trading-order-content {
        .button {
          color: #fff;
          background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
        }

        > .order-list {
          border: 1px solid  rgba(72, 87, 118, .1);
          background-color: #fff;

          > .order {
            > .order-list-head {
              border-bottom: 1px solid rgba(72, 87, 118, .1);
              color: #333;
            }

            > .order-list-body {
              color: #7d90ac;

              > .order-list-body-left {
                border-right: 1px solid rgba(72, 87, 118, .1);
              }

              > .order-list-body-middle {
                border-right: 1px solid rgba(72, 87, 118, .1);

                > .middle-content {
                  .trader-info {
                    > .pay-style {
                      background: rgba(51, 143, 245, .1);

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
                > .right-content {
                  > .action-tips {
                    .wait-pay {
                      color: #e8554f;
                    }
                  }

                  > .submitted-confirm-payment {
                    color: #5e95ec;
                  }

                  > .action-explain {
                    > .remaining-time {
                      color: #d45858;
                    }
                  }

                  > .count-down-time {
                    .timeIcon {
                      color: #d45858;
                    }
                  }
                }
              }
            }
          }

          > .appeal {
            > .appeal-head {
              border-bottom: 1px solid rgba(72, 87, 118, .1);
              color: #333;
              background-color: #e7e8e9;
            }

            > .appeal-body {
              > .appeal-body-content {
                > .appeal-textarea {
                  > .appeal-reason {
                    color: #338ff5;
                  }
                }
              }
            }
          }
        }

        > .no-data {
          border: 1px solid rgba(38, 47, 56, .1);
          background-color: #fff;
        }
      }

      /deep/ {
        .el-input__inner {
          width: 130px;
        }

        /* 交易密码弹出框样式修复 */
        .password-dialog {
          .el-dialog__body {
            .password-input {
              border: 1px solid #ecf1f8;
            }
          }
        }
      }
    }
  }
</style>
