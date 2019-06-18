<template>
  <div
    class="otc-publish-AD-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 商家发布广告挂单 -->
    <!-- 2.0 OTC发布广告内容 -->
    <div
      class="otc-publish-AD-content"
    >
      <!--发布广告左侧主体内容-->
      <div class="publish-AD-left">
        <!-- 大标题发布广告 -->
        <div class="AD-title font-size18 padding-l15 font-weight700">
          {{$t('M.otc_merchant_publishAD')}}
        </div>
        <!-- 大表单 -->
        <div class="AD-big-form">
          <!-- 选择 -->
          <div class="common choice">
            <div class="left display-inline-block">
              <!-- 选择 -->
              <p class="tips font-size12 tips-choose">
                &nbsp;&nbsp;{{$t('M.otc_pl')}}
              </p>
            </div>
            <div class="right display-inline-block">
              <!-- 买卖类型 -->
              <div class="right-style display-inline-block">
                <el-select
                  :placeholder="$t('M.comm_please_choose')"
                  v-model="activatedBuySellStyle"
                  :no-data-text="$t('M.comm_no_data')"
                  @change="changeBuySellStyle"
                >
                  <el-option
                    v-for="(item,index) in buySellStyle"
                    :key="index"
                    :value="item.id"
                    :label="$t(item.name)"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="right-change display-inline-block">
                <!-- 可用币种 -->
                <el-select
                  v-model="activatedCoinId"
                  :placeholder="$t('M.comm_please_choose')"
                  :no-data-text="$t('M.comm_no_data')"
                  @change="changeAvailableCoinId"
                >
                  <el-option
                    v-for="(item,index) in availableCoinList"
                    :key="index"
                    :value="item.coinId"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
                <span class="double-sided-arrow display-inline-block">
                </span>
                <!--可用法币-->
                <el-select
                  v-model="activatedCurrencyId"
                  :placeholder="$t('M.comm_please_choose')"
                  :no-data-text="$t('M.comm_no_data')"
                  @change="changeCurrencyId"
                >
                  <el-option
                    v-for="(item,index) in availableCurrencyList"
                    :key="index"
                    :value="item.id"
                    :label="language === 'zh_CN'? item.name : item.shortName"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- 销售价格 -->
          <div class="common sale-price">
            <div class="left display-inline-block">
              <!-- 销售价格 -->
                <p class="tips font-size12">
                  <span class="must-fill-star">*&nbsp;</span>{{$t('M.otc_sell')}}{{$t('M.otc_index_price')}}
                </p>
            </div>
            <div class="right display-inline-block">
              <div>
                <p>
                  <!-- 最大可卖出量: -->
                  <span v-if="activatedBuySellStyle === 'SELL'">
                    {{$t('M.otc_seller_maximum')}}:
                    <span class="max-avail-sell">
                      {{total ? $scientificToNumber(total) : '--'}}{{activatedCoinName}}
                    </span>
                  </span>
                  <!-- 市价 -->
                  <span>{{$t('M.otc_market_price')}}:
                    <span class="market-price">
                      {{marketPrice ? $scientificToNumber(marketPrice) : '--'}}{{activatedCurrencyName}}
                    </span>
                  </span>
                  <!--20190415增加当前市场最低最高价-->
                  <!--当前市场最低出售价-->
                  <span
                    v-if="activatedBuySellStyle === 'SELL'"
                    class="current-price"
                  >
                    {{$t('M.otc_current-market-price-min')}}:
                    <span class="price-data">
                      {{currentMarketPriceMin ? $scientificToNumber(currentMarketPriceMin) : '--'}}{{activatedCurrencyName}}
                    </span>
                  </span>
                  <!--当前市场最高收购价-->
                  <span
                    v-if="activatedBuySellStyle === 'BUY'"
                    class="current-price"
                  >
                    {{$t('M.otc_current-market-price-max')}}:
                    <span class="price-data">
                      {{currentMarketPriceMax ? $scientificToNumber(currentMarketPriceMax) : '--'}}{{activatedCurrencyName}}
                    </span>
                  </span>
                </p>
              </div>
              <!-- 定价设置 -->
              <div class="input">
                <!-- 单价 -->
                <input
                  type="text"
                  class="price-input"
                  :class="{ redBorderRightNone: priceErrorTipsBorder }"
                  :placeholder="$t('M.otc_index_UnitPrice')"
                  ref="price"
                  @keyup="changePriceValue('price', moneyPointLengthPrice)"
                  @input="changePriceValue('price', moneyPointLengthPrice)"
                  onpaste="return false"
                >
                <span
                  class="unit font-size12"
                  :class="{ redBorderLeftNone: priceErrorTipsBorder }"
                >
                  {{ activatedCurrencyName }}
                </span>
              </div>
              <!-- 单价错误提示 -->
              <div class="err">{{ errorInfoPrice }}</div>
            </div>
          </div>
          <!-- 数量与限额 -->
          <div class="common sum-limit">
            <div class="left display-inline-block">
                <!-- 数量与限额 -->
                <p class="tips font-size12">
                  <span class="must-fill-star">*&nbsp;</span>{{$t('M.otc_publishAD_sum_and_limitMoney')}}
                </p>
            </div>
            <div class="right display-inline-block">
              <!-- 交易数量 -->
              <p>{{$t('M.otc_publishAD_sellmount')}}</p>
              <div class="input-top">
                <input
                  type="text"
                  class="input-sum"
                  :class="{ redBorderRightNone: entrustCountErrorTipsBorder }"
                  :placeholder="$t('M.otc_publishAD_sellmount')"
                  ref="entrustCount"
                  @keyup="changeEntrustCountValue('entrustCount', pointLength)"
                  @input="changeEntrustCountValue('entrustCount', pointLength)"
                  onpaste="return false"
                >
                <span
                  class="unit font-size12"
                  :class="{ redBorderLeftNone: entrustCountErrorTipsBorder }"
                >
                  {{activatedCoinName}}
                </span>
              </div>
              <div class="err">
                {{errorInfoEntrustCount}}
              </div>
              <p class="text">
                <!-- 单笔最小限额 -->
                <span class="money-min">
                  {{$t('M.otc_publishAD_minlimitMoney')}}
                </span>
                <!-- 单笔最大限额 -->
                <span class="money-max">
                  {{$t('M.otc_publishAD_maxlimitMoney')}}
                </span>
              </p>
              <div class="input-bottom">
                <!-- 单笔最小限额 -->
                <input
                  type="text"
                  class="input-min"
                  :class="{ redBorderRightNone: minCountErrorTipsBorder }"
                  :placeholder="$t('M.otc_min') + this.minCount"
                  ref="minCountValue"
                  @keyup="changeMinCountInputValue('minCountValue', moneyPointLength)"
                  @input="changeMinCountInputValue('minCountValue', moneyPointLength)"
                  @blur.prevent="minBlur"
                  onpaste="return false"
                >
                <span
                  class="unit font-size12"
                  :class="{ redBorderLeftNone: minCountErrorTipsBorder }"
                >
                  {{activatedCurrencyName}}
                </span>
                <span class= "minMaxLink">一</span>
                <!-- 单笔最大限额 -->
                <input
                  type="text"
                  class="input-max"
                  :class="{ redBorderRightNone: maxCountErrorTipsBorder }"
                  :placeholder="$t('M.otc_max') + this.maxCount"
                  ref="maxCountValue"
                  @keyup="changeMaxCountInputValue('maxCountValue', moneyPointLength)"
                  @input="changeMaxCountInputValue('maxCountValue', moneyPointLength)"
                  @blur.prevent="maxBlur"
                  onpaste="return false"
                >
                <span
                  class="unit font-size12"
                  :class="{ redBorderLeftNone: maxCountErrorTipsBorder }"
                >
                  {{activatedCurrencyName}}
                </span>
              </div>
              <div>
                <span class="err err-min-count">
                  <span>{{errorInfoMinCount}}</span>
                </span>
                <span class="err err-max-count">
                  {{errorInfoMaxCount}}
                </span>
              </div>
            </div>
          </div>
          <!-- 交易方式 -->
          <div class="common trade-way">
            <div class="left display-inline-block">
              <!-- 交易方式 -->
              <p class="tips font-size12">
                <span class="must-fill-star">*&nbsp;</span>{{$t("M.otc_publishAD_selltype")}}
              </p>
            </div>
            <div class="right display-inline-block">
              <el-checkbox-group
                v-model="activatedPayTypes"
                @change='changePayTypes'
              >
                <!-- 支付宝 -->
                <el-checkbox
                  label="Alipay"
                  v-show="payForListArr[0] === '1'"
                >
                  {{$t('M.comm_alipay')}}
                </el-checkbox>
                <!-- 微信 -->
                <el-checkbox
                  label="Wechat"
                  v-show="payForListArr[1] === '1'"
                >
                  {{$t('M.comm_weixin')}}
                </el-checkbox>
                <!-- 银行卡 -->
                <el-checkbox
                  label="Bankcard"
                  v-show="payForListArr[2] === '1'"
                >
                  {{$t('M.comm_bank')}}
                </el-checkbox>
                <!-- 西联 -->
                <el-checkbox
                  label="WestUnion"
                  v-show="payForListArr[3] === '1'"
                >
                  {{$t('M.comm_xilian')}}
                </el-checkbox>
                <!-- PAYPAL -->
                <el-checkbox
                  label="PAYPAL"
                  v-show="payForListArr[4] === '1'"
                >
                  PAYPAL
                </el-checkbox>
              </el-checkbox-group>
              <!-- 错误提示信息 -->
              <div class="err">{{errorInfoTradeWay}}</div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="common remark">
            <div class="left display-inline-block">
              <!-- 备注 -->
                <p class="tips font-size12">
                  &nbsp;&nbsp;{{$t('M.comm_remark')}}
                </p>
                <!-- 可选填 -->
                <p class="warning font-size12">
                  &nbsp;&nbsp;{{$t('M.otc_publishAD_adviceToFill')}}
                </p>
            </div>
            <div class="right display-inline-block">
              <el-input
                type="textarea"
                maxlength="30"
                auto-complete="off"
                :placeholder="$t('M.otc_publishAD_liveMessage')"
                v-model="remarkText"
              >
              </el-input>
            </div>
          </div>
          <!-- 限制设置 -->
          <div class="common limit-set">
            <div class="left display-inline-block">
              <!-- 限制设置 -->
                <p class="tips font-size12">
                  <span class="must-fill-star">*&nbsp;</span>{{$t('M.otc_publishAD_setLimit')}}
                </p>
            </div>
            <div class="right display-inline-block">
              <div>
                <!-- 同时处理最大订单数(0=不限制) -->
                {{$t('M.otc_publishAD_maxOrder')}}（0={{$t('M.otc_publishAD_noLimit')}}）
                <span
                  class="question-mark cursor-pointer"
                  :title="$t('M.otc_publishAD_setDiscript') + $t('M.otc_publishAD_setDiscriptTwo')"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-wenhao"
                  />
                </span>
              </div>
              <div>
                <input
                  class="input-limit"
                  type="text"
                  @focus="clearLimitOrderCountErrData"
                  ref="limitRef"
                  @keyup="positiveIntegerNumRegexpInputLimit('limitRef')"
                  @input="positiveIntegerNumRegexpInputLimit('limitRef')"
                  onpaste="return false"
                >
                <!-- 错误提示 -->
                <div class="err">{{errorInfoLimitOrderCount}}</div>
              </div>
              <!-- 卖家必须成交过几次（0=不限制） -->
              <div class="num-success">
                {{$t('M.otc_publishAD_sellNeedLimit')}}(0={{$t('M.otc_publishAD_noLimit')}})
              </div>
              <div>
                <input
                  type="text"
                  class="input-limit"
                  @focus="clearSuccessOrderCountErrData"
                  ref="successRef"
                  @keyup="positiveIntegerNumRegexpInputSuccess('successRef')"
                  @input="positiveIntegerNumRegexpInputSuccess('successRef')"
                  onpaste="return false"
                >
                <!-- 错误提示 -->
                <div class="err">{{errorInfoSuccessOrderCount}}</div>
              </div>
            </div>
          </div>
          <!--增加显示交易额和手续费-->
          <div class="fee-detail">
            <span class="predict-text">
              <!-- 预计交易额： -->
              {{$t('M.otc_expected_value')}}：
            </span>
            <!-- 卖 -->
            <span
              class="predict-sum"
              v-show="this.activatedBuySellStyle === 'SELL'"
            >
              {{$scientificToNumber(publishSumSELL)}} {{activatedCurrencyName}}
            </span>
            <!-- 买 -->
            <span
              class="predict-sum"
              v-show="this.activatedBuySellStyle === 'BUY'"
            >
              {{$scientificToNumber(publishSumBUY)}} {{activatedCurrencyName}}
            </span>
            <span class="predict-text">
              <!-- 手续费： -->
              {{$t('M.comm_service_charge')}}：
            </span>
            <!-- 卖 -->
            <span
              class="predict-sum"
              v-show="this.activatedBuySellStyle === 'SELL'"
            >
              {{$scientificToNumber(serviceChargeSELL)}} {{activatedCoinName}}
            </span>
            <!-- 买 -->
            <span
              class="predict-sum"
              v-show="this.activatedBuySellStyle === 'BUY'"
            >
              {{$scientificToNumber(serviceChargeBUY)}} {{activatedCoinName}}
            </span>
            <span class="rate-text">
              <!-- 费率 -->
              ( {{$t('M.otc_index_rate')}}
              <span class="rate">
                {{rate * 100}}%
              </span>
              )
            </span>
          </div>
          <!-- 提交按钮 -->
          <div class="button">
            <button
              class="AD-button font-size12 cursor-pointer"
              @click.prevent="showPasswordDialog"
            >
              <!-- 发布广告 -->
              {{$t('M.otc_merchant_publishAD')}}
            </button>
          </div>
          <!-- 发布广告弹出交易密码框 -->
          <div class="password-dialog">
            <el-dialog
              :title="$t('M.otc_publishAD_sellpassword')"
              :visible.sync="publishADTradePwdDialogStatus"
              top="25vh"
              width="470"
            >
            <!-- 请输入交易密码 -->
              <div>
                {{$t('M.otc_publishAD_pleaseInput')}}{{$t('M.otc_publishAD_sellpassword')}}
              </div>
              <div class="input">
                <input
                  type="password"
                  autocomplete="new-password"
                  class="password-input"
                  v-model="tradePassword"
                  @focus="tradePasswordFocus"
                  @keyup.enter="publishADSubmitButton"
                  onpaste="return false"
                >
              </div>
              <div class="error-info">
                <!-- 错误提示 -->
                <div class="tips err">{{errorInfoPassword}}</div>
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
                <!-- 提交 -->
                <el-button
                  type="primary"
                  @click="publishADSubmitButton"
                >
                  {{$t('M.comm_sub_time')}}
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
      </div>
      <!--发布广告右侧提示信息-->
      <div class="publish-AD-right">
        <div class="publish-tips">
          <div class="title font-size14">
            {{$t('M.otc_publishAD_publishDis')}}：
          </div>
          <p class="tip font-size12">
            ●{{configInfo.otcAd}} {{$t('M.otc_publishAD_discriptLineOne')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineTwo')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineThree')}}{{configInfo.otcAd}}{{$t('M.otc_publishAD_discriptLineFive')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineFour')}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 引入接口
import {
  formatNumberInput,
  positiveIntegerNumRegexpInputNoZero,
  amendPrecision,
  cutOutPointLength
} from '../../utils'
import {
  querySelectedOrdersDetails,
  addOTCPutUpOrdersMerchantDedicated,
  getOTCCoinInfo,
  addModifyPublishADOrder
} from '../../utils/api/OTC'
// 引入组件
import IconFontCommon from '../../components/Common/IconFontCommon'
// 引入提示信息
import {
  getNestedData,
  isNeedPayPasswordAjax
} from '../../utils/commonFunc'
// 引入全局变量和方法
import {
  mapMutations,
  mapState,
  mapActions
} from 'vuex'
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      publishADTradePwdDialogStatus: false, // 弹窗状态
      ADManageJumpOrderStatus: 1, // 从广告管理点击修改订单跳转过来状态标识 1为不是跳转来的，2为跳转来的
      // 选择模块下拉列表循环数组
      activatedBuySellStyle: 'SELL', // 选中的发布广告 买卖 类型
      // 1.0 发布广告 买卖 类型数组
      buySellStyle: [
        {
          id: 'SELL',
          name: 'M.comm_offering'
        },
        {
          id: 'BUY',
          name: 'M.comm_buying'
        }
      ],
      // 2.0 币种名字下拉数组：可用币种
      activatedCoinId: '', // 选中的可用币种id
      activatedCoinName: '', // 选中币种的name
      availableCoinList: [], // 可用币种数组
      // 3.0 法币币种数组
      activatedCurrencyId: '', // 选中的可用法币id
      activatedCurrencyName: '', // 选中的可用法币name
      availableCurrencyList: [], // 可用法币币种数组
      transformationOldCurrencyName: '', // 法币改变之前选中的法币名称
      transformationNewCurrencyName: '', // 法币改变之后选中的法币名称
      // 4.0 当前用户所有的支付方式数组
      payForListArr: [], // payForListArr: ['1', '1', '0', '1', '0'],
      // 挂单数量
      entrustCount: '',
      // 用户输入的 单笔最小限额
      minCountValue: '',
      // 用户输入的 单笔最大限额
      maxCountValue: '',
      // 后台返回 的单笔最小限额（单位：选中法币） 0 - 不限制
      minCount: '',
      // 后台返回 的单笔最大限额（单位：选中法币） 0 - 不限制
      maxCount: '',
      // 定价设置：单价 要求用户输入的价格在返回的最小价格和最高价格之间
      price: '',
      // 最低价
      minPrice: '',
      // 最高价
      maxPrice: '',
      // 同时处理最大订单数(0=不限制)
      limitOrderCount: '',
      // 买家必须成交过几次(0=不限制)
      successOrderCount: '',
      // 备注
      remarkText: '',
      // 交易密码
      tradePassword: '',
      // 交易密码错误提示
      errorInfoPassword: '',
      // 支付方式（用，隔开的名字）
      // checkList: ['支付宝']
      // 支付方式错误提示
      errorInfoTradeWay: '',
      activatedPayTypes: [],
      // 往后台传参数的支付方式类型
      parameterPayTypes: '',
      // 定价设置中的价格错误提示信息
      errorInfoPrice: '',
      // 交易数量错误提示
      errorInfoEntrustCount: '',
      // 单笔最小限额错误提示
      errorInfoMinCount: '',
      // 单笔最大限额错误提示
      errorInfoMaxCount: '',
      // 同时处理最大订单数（0=不限制）错误提示
      errorInfoLimitOrderCount: '',
      // 卖家必须成交过几次（0=不限制）错误提示
      errorInfoSuccessOrderCount: '',
      // 市价
      marketPrice: '',
      // 最大可卖出量
      total: '',
      // 广告管理传过来的id
      messageId: this.$route.query.id, // 从广告管理点击修改跳转过来的订单id
      pointLength: 4, // 当前币种返回的保留小数点位数限制
      moneyPointLengthPrice: 3, // 当前金额小数点限制位数-单价保留3位
      moneyPointLength: 2, // 当前金额小数点限制位数-总金额和最低最高限额保留2位
      priceErrorTipsBorder: false, // 价格错误提示框
      entrustCountErrorTipsBorder: false, // 交易数量错误提示框
      minCountErrorTipsBorder: false, // 单笔最小限额错误提示框
      maxCountErrorTipsBorder: false, // 单笔最大限额错误提示框
      isNeedPayPassword: true,
      rate: '', // 费率
      // 手续费：卖
      serviceChargeSELL: 0,
      // 手续费：买
      serviceChargeBUY: 0,
      // 预计交易额：卖
      publishSumSELL: 0,
      // 预计交易额 :买
      publishSumBUY: 0,
      // 当前市场最低出售价
      currentMarketPriceMin: '',
      // 当前市场最高收购价
      currentMarketPriceMax: ''
    }
  },
  created () {
    // console.log('从广告管理传过来的URL中的订单id:' + this.$route.query.id)
    if (this.$route.query.id) {
      // console.log('1:url中有id')
      // console.log(this.$route.query.id)
      this.getOTCSelectedOrdersDetails()
      this.ADManageJumpOrderStatus = 2
    } else {
      // console.log('2：URL中没有id')
      this.getOTCCoinInfo()
      this.ADManageJumpOrderStatus = 1
    }
  },
  mounted () {
    // 同时处理最大订单数(0=不限制) 和  卖家必须成交过几次（0=不限制） 初始值赋值为0
    this.$refs.limitRef.value = 0
    this.$refs.successRef.value = 0
    this.limitOrderCount = this.$refs.limitRef.value
    this.successOrderCount = this.$refs.successRef.value
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      // 发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      'CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS',
      'CHANGE_PASSWORD_USEABLE',
      'CHANGE_REF_ACCOUNT_CREDITED_STATE',
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    // 1.0 同时处理最大订单数(0=不限制)input框限制
    positiveIntegerNumRegexpInputLimit (ref) {
      let target = this.$refs[ref]
      this.limitOrderCount = positiveIntegerNumRegexpInputNoZero(target)
      // console.log(this.$refs.limitRef.value)
    },
    // 2.0 卖家必须成交过几次（0=不限制）input框限制
    positiveIntegerNumRegexpInputSuccess (ref) {
      let target = this.$refs[ref]
      this.successOrderCount = positiveIntegerNumRegexpInputNoZero(target)
      // console.log(this.$refs.successRef.value)
    },
    // 3.0 广告管理跳转过来 请求详情接口
    async getOTCSelectedOrdersDetails () {
      const data = await querySelectedOrdersDetails({
        entrustId: this.messageId
      })
      // console.log('广告管理跳转过来挂单详情')
      // console.log(data)
      // 正确逻辑
      if (!data) return false
      if (data.data) {
        let detailsData = getNestedData(data, 'data')
        this.activatedCoinId = getNestedData(detailsData, 'coinId') // 可用币种id
        this.activatedCurrencyId = getNestedData(detailsData, 'currencyId') // 法币id
        this.activatedBuySellStyle = getNestedData(detailsData, 'entrustType') // 挂单类型
        this.$refs.limitRef.value = getNestedData(detailsData, 'limitOrderCount') // 同时处理最大订单数
        this.limitOrderCount = this.$refs.limitRef.value
        this.$refs.successRef.value = getNestedData(detailsData, 'successOrderCount') // 卖家必须成交过几次
        this.successOrderCount = this.$refs.successRef.value
        this.$refs.entrustCount.value = getNestedData(detailsData, 'entrustCount') // 挂单数量
        this.price = getNestedData(detailsData, 'price') // 单价
        this.$refs.price.value = this.price // 单价
        this.getOTCCoinInfo()
      }
    },
    // 4.0 币种详情 : 商家和普通用户挂单页面请求币种详情渲染页面
    async getOTCCoinInfo () {
      const data = await getOTCCoinInfo({
        currencyId: this.activatedCurrencyId, // 法币id
        coinId: this.activatedCoinId // 币种id
      })
      // console.log('币种详情')
      // console.log(data)
      if (!data) return false
      // 返回数据正确的逻辑
      // 1.0 可用币种列表
      let availableCoinListData = getNestedData(data, 'data')
      this.availableCoinList = getNestedData(availableCoinListData, 'coinlist')
      this.availableCoinList.forEach(item => {
        if (availableCoinListData.otcCoinQryResponse.coinId === item.coinId) {
          this.activatedCoinId = item.coinId
        }
      })
      this.activatedCoinName = getNestedData(availableCoinListData, 'otcCoinQryResponse.name')
      // 2.0 法币种列表
      this.availableCurrencyList = getNestedData(availableCoinListData, 'currencyList')
      this.availableCurrencyList.forEach(item => {
        if (availableCoinListData.otcCoinQryResponse.currencyName === item.shortName) {
          this.activatedCurrencyId = item.id
        }
      })
      this.activatedCurrencyName = getNestedData(availableCoinListData, 'otcCoinQryResponse.currencyName')
      // 3.0 交易支付方式
      this.payForListArr = getNestedData(availableCoinListData, 'userbankFlag')
      // 最大可卖出量:可用资产
      this.total = getNestedData(availableCoinListData, 'otcCoinQryResponse.total')
      // 市价
      this.marketPrice = getNestedData(availableCoinListData, 'otcCoinQryResponse.marketPrice')
      // 最低价
      this.minPrice = getNestedData(availableCoinListData, 'otcCoinQryResponse.minPrice')
      // console.log('最低价格' + this.minPrice)
      // 最高价
      this.maxPrice = getNestedData(availableCoinListData, 'otcCoinQryResponse.maxPrice')
      // console.log('最高价格' + this.maxPrice)
      // 当前币种返回的保留小数点位数限制
      this.pointLength = getNestedData(availableCoinListData, 'otcCoinQryResponse.unit')
      // 下面这两个字段当URL中没id时候才用这个渲染页面
      // 币种单笔最大限额
      this.maxCount = getNestedData(availableCoinListData, 'otcCoinQryResponse.maxCount')
      this.$refs.maxCountValue.value = this.maxCount
      // 币种单笔最小限额
      this.minCount = getNestedData(availableCoinListData, 'otcCoinQryResponse.minCount')
      this.$refs.minCountValue.value = this.minCount
      // 费率
      if (this.activatedBuySellStyle === 'SELL') {
        this.rate = getNestedData(availableCoinListData, 'otcCoinQryResponse.sellRate')
      }
      if (this.activatedBuySellStyle === 'BUY') {
        this.rate = getNestedData(availableCoinListData, 'otcCoinQryResponse.buyRate')
      }
      // 当前市场最低出售价
      this.currentMarketPriceMin = getNestedData(availableCoinListData, 'minPrice')
      // 当前市场最高收购价
      this.currentMarketPriceMax = getNestedData(availableCoinListData, 'maxPrice')
    },
    // 5.0 改变发布广告 买卖 类型
    changeBuySellStyle (e) {
      this.activatedBuySellStyle = e
      // console.log(this.activatedBuySellStyle)
      // 切换买卖类型，如果是买单则清空交易数量错误提示
      if (this.activatedBuySellStyle == 'BUY') {
        this.errorInfoEntrustCount = ''
        this.entrustCountErrorTipsBorder = false
      }
      this.clearMainData()
      this.getOTCCoinInfo()
    },
    // 6.0 改变可用币种id
    changeAvailableCoinId (e) {
      this.activatedCoinId = e
      // console.log(this.activatedCoinId)
      this.clearMainData()
      this.getOTCCoinInfo()
    },
    // 7.0 改变可用法币的币种id
    changeCurrencyId (e) {
      this.activatedCurrencyId = e
      // console.log(this.activatedCurrencyId)
      this.clearMainData()
      this.getOTCCoinInfo()
    },
    // 8.0 点击发布广告弹出输入交易密码框
    async showPasswordDialog () {
      // 用户交易密码是否锁定判断
      await this.REFRESH_USER_INFO_ACTION()
      let isPaypasswordLocked = getNestedData(this.loginStep1Info, 'payPasswordRemainCount') ? false : true
      this.CHANGE_PASSWORD_USEABLE(isPaypasswordLocked)
      if (this.isLockedPayPassword) return false
      //
      // 非空及数据范围准确性验证
      // 单价
      if (!this.$refs.price.value) {
        // 请输入单价
        this.errorInfoPrice = this.$t('M.otc_please_enter_price')
        this.priceErrorTipsBorder = true
        return false
      } else if (this.$refs.price.value - this.minPrice < 0 || this.$refs.price.value - this.maxPrice > 0) {
        this.errorInfoPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice
        this.priceErrorTipsBorder = true
        return false
      }
      // 交易方式
      if (this.payForListArr[0] === '0' && this.payForListArr[1] === '0' && this.payForListArr[2] === '0' && this.payForListArr[3] === '0' && this.payForListArr[4] === '0') {
        // this.errorInfoTradeWay = '请先设置收款方式'
        this.errorInfoTradeWay = this.$t('M.otc_publishAD_set_get_money_way')
        return false
      }
      if (!this.parameterPayTypes) {
        // 请选择交易方式
        this.errorInfoTradeWay = this.$t('M.otc_publishAD_chouseSellType')
        return false
      }
      // 交易数量
      // console.log(this.$refs.entrustCount.value)
      if (!this.$refs.entrustCount.value || this.$refs.entrustCount.value - 0 === 0) {
        // 请输入交易数量
        this.errorInfoEntrustCount = this.$t('M.otc_please_enter_trade_number')
        this.entrustCountErrorTipsBorder = true
        return false
      }
      // 交易数量 有错误提示 and 单笔最小最大限制
      if (this.errorInfoEntrustCount || this.errorInfoMinCount || this.errorInfoMaxCount) {
        return false
      }
      // 20190308增加单笔最小、最大成交限额必输验证
      if (!this.$refs.minCountValue.value) {
        // this.errorInfoMinCount = '单笔最小限额不能为空！'
        this.errorInfoMinCount = this.$t('M.otc_min_limit_not_empty')
        this.minCountErrorTipsBorder = true
        return false
      }
      if (!this.$refs.maxCountValue.value) {
        // this.errorInfoMaxCount = '单笔最大限额不能为空！'
        this.errorInfoMaxCount = this.$t('M.otc_max_limit_not_empty')
        this.maxCountErrorTipsBorder = true
        return false
      }
      // 限制设置--非必输选项
      // 20181213增加非空验证：变为了必须字段
      // console.log(this.limitOrderCount)
      // console.log(typeof this.limitOrderCount)
      // console.log(this.successOrderCount)
      if (!this.limitOrderCount) {
        // this.errorInfoLimitOrderCount = '同时处理最大订单数不能为空'
        this.errorInfoLimitOrderCount = this.$t('M.otc_publish_ad_err1')
        return false
      }
      if (!this.successOrderCount) {
        // this.errorInfoSuccessOrderCount = '卖家必须成交过几次不能为空'
        this.errorInfoSuccessOrderCount = this.$t('M.otc_publish_ad_err2')
        return false
      }
      this.isNeedPayPassword = await isNeedPayPasswordAjax(this)
      if (this.isNeedPayPassword) {
        this.publishADTradePwdDialogStatus = true
      } else {
        this.publishADSubmitButton()
      }
    },
    // 9.0 同时处理最大订单数获得焦点清空错误信息
    clearLimitOrderCountErrData () {
      this.errorInfoLimitOrderCount = ''
    },
    // 10.0 卖家必须成交过几次获得焦点清空错误信息
    clearSuccessOrderCountErrData () {
      this.errorInfoSuccessOrderCount = ''
    },
    // 11.0 点击密码框中的提交按提交钮发布广告
    publishADSubmitButton: _.debounce(async function () {
      if (this.isNeedPayPassword && !this.tradePassword) {
        // 请输入交易密码
        this.errorInfoPassword = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      let param = {
        entrustType: this.activatedBuySellStyle, // 挂单类型(BUY SELL)
        coinId: this.activatedCoinId, // 挂单币种
        currencyId: this.activatedCurrencyId, // 法币Id
        entrustCount: this.$refs.entrustCount.value, // 挂单数量
        price: this.$refs.price.value, // 单价
        minCount: this.$refs.minCountValue.value, // 用户输入的单笔最小限额（单位：选中法币） 0 - 不限制
        maxCount: this.$refs.maxCountValue.value, // 用户输入的单笔最大限额（单位：选中法币） 0 - 不限制
        limitOrderCount: this.limitOrderCount, // 同时处理最大订单数(0=不限制)
        successOrderCount: this.successOrderCount, // 买家必须成交过几次(0=不限制)
        remark: this.remarkText, // 备注
        payTypes: this.parameterPayTypes // 支付方式（用，隔开的名字）
      }
      // 交易密码
      param = this.isNeedPayPassword ? { ...param, tradePassword: this.tradePassword } : param
      let data
      if (this.ADManageJumpOrderStatus == 1) {
        data = await addOTCPutUpOrdersMerchantDedicated(param)
      }
      if (this.ADManageJumpOrderStatus == 2) {
        param.entrustId = this.messageId
        data = await addModifyPublishADOrder(param)
      }
      // 返回数据正确的逻辑
      this.publishADTradePwdDialogStatus = false // 关闭交易密码框
      this.tradePassword = '' // 清空交易密码
      // console.log(data)
      if (!data) return false
      // 改变标识状态为不是跳转来的
      this.ADManageJumpOrderStatus = 1
      // 清空数据
      this.clearMainData()
      // 下单成功跳转到首页挂单列表去 并 改变发布订单（商家和普通用户公用）后页面跳转到首页顶部状态
      this.CHANGE_PUBLISH_ORDER_JUMP_TOP_STATUS(true)
      this.$goToPage('/OTCCenter')
    }, 500),
    // 12.0 交易密码框获得焦点
    tradePasswordFocus () {
      this.errorInfoPassword = ''
    },
    // 13.0 改变支付方式
    changePayTypes (e) {
      console.log(e)
      this.activatedPayTypes = e
      // console.log(this.activatedPayTypes)
      // 处理支付方式数据格式，转成 a,b,c 形势
      let str = ''
      this.activatedPayTypes.forEach(item => {
        // console.log(item)
        str += item + ','
      })
      // 去掉最后一个逗号(如果不需要去掉，就不用写)
      if (str.length > 0) {
        str = str.substr(0, str.length - 1)
      }
      this.parameterPayTypes = str
      // console.log(this.parameterPayTypes)
      this.errorInfoTradeWay = '' // 清空错误提示
    },
    // 14.0 清空主要数据
    clearMainData () {
      // 单价
      this.$refs.price.value = ''
      // 单价错误提示
      this.errorInfoPrice = ''
      // 交易数量
      this.$refs.entrustCount.value = ''
      // 交易数量错误提示
      this.errorInfoEntrustCount = ''
      // 往后台传参数的支付方式类型
      this.parameterPayTypes = ''
      // 支付方式
      this.activatedPayTypes = []
      // 支付方式错误提示
      this.errorInfoTradeWay = ''
      // 备注
      this.remarkText = ''
      // 同时处理最大订单数
      this.$refs.limitRef.value = 0
      this.limitOrderCount = this.$refs.limitRef.value
      this.errorInfoLimitOrderCount = '' // 错误提示
      // 成功过几次
      this.$refs.successRef.value = 0
      this.successOrderCount = this.$refs.successRef.value
      this.errorInfoSuccessOrderCount = '' // 错误提示
      // 交易密码
      this.tradePassword = ''
      // 交易密码错误提示
      this.errorInfoPassword = ''
      // 清空错误边框红色警示
      this.priceErrorTipsBorder = false
      this.entrustCountErrorTipsBorder = false
      this.minCountErrorTipsBorder = false
      this.maxCountErrorTipsBorder = false
      // 清空单笔最小最大限额错误提示
      this.errorInfoMinCount = ''
      this.errorInfoMaxCount = ''
      // 清空买卖预计交易额和手续费
      this.publishSumSELL = 0
      this.publishSumBUY = 0
      this.serviceChargeSELL = 0
      this.serviceChargeBUY = 0
    },
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // 修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
    },
    // 15.0 校验用户输入的 定价设置：键盘弹起事件
    changePriceValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.price)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      if (this.$refs.price.value) {
        // console.log(this.$refs.price.value)
        // console.log(this.minPrice)
        // console.log(this.maxPrice)
        if (this.$refs.price.value - this.minPrice < 0 || this.$refs.price.value - this.maxPrice > 0) {
          this.errorInfoPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice
          this.priceErrorTipsBorder = true
          return false
        } else {
          this.errorInfoPrice = ''
          this.priceErrorTipsBorder = false
        }
      } else {
        this.errorInfoPrice = ''
        this.priceErrorTipsBorder = false
      }
      // 增加显示预计交易额和手续费
      if (this.$refs.entrustCount.value) {
        // 交易额
        // 卖
        this.publishSumSELL = amendPrecision(this.$refs.price.value, this.$refs.entrustCount.value, '*')
        this.publishSumSELL = cutOutPointLength(this.publishSumSELL, this.moneyPointLength)
        // 买
        this.publishSumBUY = amendPrecision(this.$refs.price.value, this.$refs.entrustCount.value, '*')
        this.publishSumBUY = cutOutPointLength(this.publishSumBUY, this.moneyPointLength)
        // 手续费
        // 卖
        this.serviceChargeSELL = amendPrecision(this.$refs.entrustCount.value, this.rate, '*')
        this.serviceChargeSELL = cutOutPointLength(this.serviceChargeSELL, this.pointLength)
        // 买
        this.serviceChargeBUY = amendPrecision(this.$refs.entrustCount.value, this.rate, '*')
        this.serviceChargeBUY = cutOutPointLength(this.serviceChargeBUY, this.pointLength)
      }
    },
    // 16.0 校验用户输入的 交易数量：键盘弹起事件
    changeEntrustCountValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      console.log(this.$refs.entrustCount.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      if (this.$refs.entrustCount.value) {
        this.errorInfoEntrustCount = ''
        this.entrustCountErrorTipsBorder = false
      }
      // 开始校验
      if (this.activatedBuySellStyle == 'SELL') {
        if (this.$refs.entrustCount.value - this.total > 0) {
          // this.errorInfoEntrustCount = '最大可卖出量不足'
          this.errorInfoEntrustCount = this.$t('M.otc_publishAD_entrustCountLimit')
          this.entrustCountErrorTipsBorder = true
          return false
        }
      }
      // 增加显示预计交易额和手续费
      if (this.$refs.price.value) {
        // 交易额
        // 卖
        this.publishSumSELL = amendPrecision(this.$refs.price.value, this.$refs.entrustCount.value, '*')
        this.publishSumSELL = cutOutPointLength(this.publishSumSELL, this.moneyPointLength)
        // 买
        this.publishSumBUY = amendPrecision(this.$refs.price.value, this.$refs.entrustCount.value, '*')
        this.publishSumBUY = cutOutPointLength(this.publishSumBUY, this.moneyPointLength)
        // 手续费
        // 卖
        this.serviceChargeSELL = amendPrecision(this.$refs.entrustCount.value, this.rate, '*')
        this.serviceChargeSELL = cutOutPointLength(this.serviceChargeSELL, this.pointLength)
        // 买
        this.serviceChargeBUY = amendPrecision(this.$refs.entrustCount.value, this.rate, '*')
        this.serviceChargeBUY = cutOutPointLength(this.serviceChargeBUY, this.pointLength)
      }
    },
    // 17.0 校验单笔最小限额
    changeMinCountInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this.minCountValue)
      // console.log(this.$refs.minCountValue.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 开始校验
      if (this.$refs.minCountValue.value - this.minCount < 0) {
        // this.errorInfoMinCount = '单笔最小限额不能低于' + this.minCount
        this.errorInfoMinCount = this.$t('M.otc_min_limit_not_low') + this.minCount
        this.minCountErrorTipsBorder = true
      } else if (this.$refs.minCountValue.value - this.$refs.maxCountValue.value > 0) {
        // this.errorInfoMinCount = '不能大于单笔最大限额'
        this.errorInfoMinCount = this.$t('M.otc_min_limit_not_more')
        this.minCountErrorTipsBorder = true
      } else if (this.$refs.minCountValue.value - this.maxCount > 0) {
        // this.errorInfoMinCount = '不能大于单笔最大限额'
        this.errorInfoMinCount = this.$t('M.otc_min_limit_not_more')
        this.minCountErrorTipsBorder = true
      } else {
        this.errorInfoMinCount = ''
        this.minCountErrorTipsBorder = false
      }
      if (this.$refs.minCountValue.value - this.$refs.maxCountValue.value <= 0 && this.$refs.minCountValue.value - this.minCount >= 0 && this.$refs.minCountValue.value - this.maxCount <= 0 && this.$refs.maxCountValue.value - this.$refs.minCountValue.value >= 0 && this.$refs.maxCountValue.value - this.minCount >= 0 && this.$refs.maxCountValue.value - this.maxCount <= 0) {
        this.errorInfoMaxCount = ''
        this.maxCountErrorTipsBorder = false
      }
    },
    // 18.0 单笔最大限额失去焦点事件：提示输入值
    maxBlur () {
      if (!this.$refs.maxCountValue.value) {
        // this.errorInfoMaxCount = '单笔最大限额不能为空！'
        this.errorInfoMaxCount = this.$t('M.otc_max_limit_not_empty')
        this.maxCountErrorTipsBorder = true
      }
    },
    // 19.0 单笔最小限额失去焦点事件：提示输入值
    minBlur () {
      if (!this.$refs.minCountValue.value) {
        // this.errorInfoMinCount = '单笔最小限额不能为空！'
        this.errorInfoMinCount = this.$t('M.otc_min_limit_not_empty')
        this.minCountErrorTipsBorder = true
      }
    },
    // 20.0 校验单笔最大限额
    changeMaxCountInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this.maxCountValue)
      // console.log(this.$refs.maxCountValue.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 开始校验
      if (this.$refs.maxCountValue.value - this.maxCount > 0) {
        // this.errorInfoMaxCount = '单笔最大限额不能高于' + this.maxCount
        this.errorInfoMaxCount = this.$t('M.otc_max_limit_not_high') + this.maxCount
        this.maxCountErrorTipsBorder = true
        return false
      } else if (this.$refs.maxCountValue.value - this.$refs.minCountValue.value < 0) {
        // this.errorInfoMaxCount = '不能小于单笔最小限额'
        this.errorInfoMaxCount = this.$t('M.otc_max_limit_not_few')
        this.maxCountErrorTipsBorder = true
        return false
      } else if (this.$refs.maxCountValue.value - this.minCount < 0) {
        // this.errorInfoMaxCount = '不能小于单笔最小限额'
        this.errorInfoMaxCount = this.$t('M.otc_max_limit_not_few')
        this.maxCountErrorTipsBorder = true
        return false
      } else {
        this.errorInfoMaxCount = ''
        this.maxCountErrorTipsBorder = false
      }
      if (this.$refs.minCountValue.value - this.$refs.maxCountValue.value <= 0 && this.$refs.minCountValue.value - this.minCount >= 0 && this.$refs.minCountValue.value - this.maxCount <= 0 && this.$refs.maxCountValue.value - this.$refs.minCountValue.value >= 0 && this.$refs.maxCountValue.value - this.minCount >= 0 && this.$refs.maxCountValue.value - this.maxCount <= 0) {
        this.errorInfoMinCount = ''
        this.minCountErrorTipsBorder = false
      }
    },
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
      language: state => state.common.language,
      theme: state => state.common.theme,
      configInfo: state => state.common.footerInfo.configInfo,
      // 交易密码是否被锁定
      isLockedPayPassword: state => state.common.isLockedPayPassword,
      loginStep1Info: state => state.user.loginStep1Info
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";

input::-webkit-input-placeholder { /* input框中placeholder字体设置 */
  font-size: 12px;
  color: #aab2bd;
}

input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
  font-size: 12px;
  color: #aab2bd;
}

input::-moz-placeholder { /* Mozilla Firefox 19+ */
  font-size: 12px;
  color: #aab2bd;
}

input:-ms-input-placeholder { /* Internet Explorer 10-11 */
  font-size: 12px;
  color: #aab2bd;
}

.otc-publish-AD-box {
  margin-top: 50px;
  overflow: hidden;

  .redBorderRightNone {
    border: 1px solid #d45858 !important;
    border-right: 0 !important;
  }

  .redBorderLeftNone {
    border: 1px solid #d45858 !important;
    border-left: 0 !important;
  }

  > .otc-publish-AD-content {
    display: flex;
    flex: 3;
    width: 1150px;
    padding-top: 50px;
    margin: 50px auto;

    > .publish-AD-left {
      flex: 2;

      > .AD-title {
        height: 20px;
        margin-bottom: 30px;
        line-height: 20px;
      }

      > .AD-big-form {
        width: 720px;

        .must-fill-star {
          color: #d45858;
        }

        > .common {
          box-sizing: border-box;
          padding: 20px 0;

          > .left {
            width: 115px;
            vertical-align: top;

            .tips-choose {
              padding-top: 4px;
            }
          }

          > .right {
            font-size: 12px;

            .err {
              padding-top: 4px;
            }
          }
        }

        > .choice {
          > .right {
            > .right-style {
              margin-right: 25px;
            }

            > .right-change {
              > .double-sided-arrow {
                margin: 0 10px;
              }
            }
          }
        }

        > .sale-price {
          > .right {
            .max-avail-sell {
              padding-right: 10px;
            }

            > .input {
              margin: 10px 0 0;

              > .price-input {
                width: 130px;
                height: 32px;
                padding-left: 10px;
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }

              > .unit {
                display: inline-block;
                width: 50px;
                height: 32px;
                margin-left: -5px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                line-height: 32px;
                text-align: center;
                vertical-align: top;
              }
            }
          }

          .current-price {
            padding-left: 8px;

            .price-data {
              color: #e97345;
            }
          }
        }

        > .sum-limit {
          > .right {
            .err-min-count {
              display: inline-block;
              width: 200px;
            }

            .err-max-count {
              display: inline-block;
              margin-left: 24px;
            }

            > .input-top {
              margin: 8px 0 0;

              > .input-sum {
                width: 130px;
                height: 32px;
                padding-left: 10px;
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }

              > .unit {
                display: inline-block;
                width: 50px;
                height: 32px;
                margin-left: -5px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                line-height: 32px;
                text-align: center;
                vertical-align: top;
              }
            }

            > .text {
              margin-top: 10px;

              > .money-max {
                margin-left: 156px;
              }
            }

            > .input-bottom {
              margin: 8px 0 0;

              > .input-min,
              .input-max {
                width: 130px;
                height: 32px;
                padding-left: 10px;
                border-bottom-left-radius: 4px;
                border-top-left-radius: 4px;
              }

              > .unit {
                display: inline-block;
                width: 50px;
                height: 32px;
                margin-left: -5px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                line-height: 32px;
                text-align: center;
                vertical-align: top;
              }

              > .minMaxLink {
                margin: 0 10px;
              }
            }
          }
        }

        > .limit-set {
          > .right {
            .input-limit {
              box-sizing: border-box;
              width: 200px;
              height: 32px;
              padding-left: 10px;
              margin: 10px 0 0;
              border-radius: 4px;
            }

            .num-success {
              margin-top: 15px;
            }
          }
        }

        > .fee-detail {
          padding: 10px 0 0 115px;
          font-size: 12px;

          .predict-text {
            color: #9fa7b2;
          }

          .predict-sum {
            color: #30c296;
          }

          .rate-text {
            color: #9fa7b2;
          }

          .rate {
            color: #ca5040;
          }
        }

        > .button {
          padding-left: 115px;
          margin-top: 40px;
          margin-bottom: 50px;

          > .AD-button {
            width: 200px;
            height: 32px;
            border-radius: 4px;
          }
        }
      }
    }

    > .publish-AD-right {
      flex: 1;

      > .publish-tips {
        width: 250px;
        margin-left: 40px;

        > .tip {
          line-height: 24px;
        }
      }
    }
  }

  /deep/ {
    .el-input__icon {
      line-height: 34px;
    }

    .right-style {
      .el-select {
        width: 180px;
      }
    }

    .right-change {
      .el-select {
        width: 180px;
      }
    }

    .choice {
      .el-input__inner {
        height: 32px;
        border: none;
        font-size: 12px;
      }
    }

    .trade-way {
      .el-checkbox__label {
        font-size: 12px;
      }

      .el-checkbox__inner {
        &::after {
          border: 1px solid #1f90ea;
          border-top: 0;
          border-left: 0;
        }
      }
    }

    .el-textarea__inner {
      width: 600px;
      height: 120px;
      padding-top: 10px;
      border: 0;
      resize: none;
      font-size: 12px;
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
          color: $mainColor;
        }
      }

      .el-dialog__footer {
        padding: 0;
        text-align: center;

        .forget-pwd-tip {
          padding: 8px 20px 0 0;
          color: $mainColor;
        }
      }

      .el-button {
        width: 290px;
        padding: 7px 20px;
        border: 0;
      }
    }
  }

  &.night {
    background-color: $mainNightBgColor;

    > .otc-publish-AD-content {
      > .publish-AD-left {
        > .AD-title {
          border-left: 3px solid $mainColor;
          color: $mainColor;
        }

        > .AD-big-form {
          .common {
            border-bottom: 1px solid rgba(50, 54, 76, 1);
          }

          .err {
            color: #d45858;
          }

          > .common {
            > .left {
              > .tips {
                color: #fff;
              }

              > .warning {
                color: #3e79d6;
              }
            }

            > .right {
              color: #9da5b3;
            }
          }

          > .choice {
            > .right {
              > .right-change {
                > .double-sided-arrow {
                  color: #797979;
                }
              }
            }
          }

          > .sale-price {
            > .right {
              .max-avail-sell {
                color: #30c296;
              }

              .market-price {
                color: #e97345;
              }

              > .input {
                > .price-input {
                  color: #9da5b3;
                  background-color: #1c1f32;
                }

                > .unit {
                  color: #7ea9e4;
                  background-color: #21243b;
                }
              }
            }
          }

          > .sum-limit {
            > .right {
              > .input-top {
                > .input-sum {
                  color: #9da5b3;
                  background-color: #1c1f32;
                }

                > .unit {
                  color: #7ea9e4;
                  background-color: #21243b;
                }
              }

              > .input-bottom {
                > .input-min,
                .input-max {
                  color: #9da5b3;
                  background-color: #1c1f32;
                }

                > .unit {
                  color: #7ea9e4;
                  background-color: #21243b;
                }

                > .minMaxLink {
                  color: #7d90ac;
                }
              }
            }
          }

          > .limit-set {
            > .right {
              .input-limit {
                color: #9da5b3;
                background-color: #1c1f32;
              }
            }
          }

          > .button {
            > .AD-button {
              color: #fff;
              background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      > .publish-AD-right {
        > .publish-tips {
          > .title {
            margin-bottom: 5px;
            color: #fff;
          }

          > .tip {
            color: #7d90ac;
          }
        }
      }
    }

    /deep/ {
      .choice {
        .el-input__inner {
          background: #1c1f32;
        }
      }

      .limit-set {
        .icon {
          color: $mainColor;
        }
      }

      .el-textarea__inner {
        color: #a9bed4;
        background-color: #1c1f32;
      }

      .trade-way {
        .el-checkbox {
          margin-right: 20px;
          color: #9da5b3;
        }

        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }

        .el-checkbox__inner {
          border: 1px solid #435372;
          background-color: #1c1f32;
        }

        .el-checkbox__input.is-checked + .el-checkbox__label {
          color: #9da5b3;
        }
      }

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

        .el-button--primary {
          background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
        }
      }
    }
  }

  &.day {
    background-color: $mainDayBgColor;

    > .otc-publish-AD-content {
      > .publish-AD-left {
        > .AD-title {
          border-left: 3px solid $mainColor;
          color: $mainColor;
        }

        > .AD-big-form {
          .err {
            color: #d45858;
          }

          > .common {
            > .left {
              > .tips {
                color: #333;
              }

              > .warning {
                color: #3e79d6;
              }
            }

            > .right {
              color: #7d90ac;
            }
          }

          > .choice {
            > .right {
              > .right-change {
                > .double-sided-arrow {
                  color: #797979;
                }
              }
            }
          }

          > .sale-price {
            > .right {
              .max-avail-sell {
                color: #30c296;
              }

              .market-price {
                color: #e97345;
              }

              > .input {
                > .price-input {
                  border: 1px solid rgba(236, 241, 248, 1);
                  color: #7d90ac;
                  background-color: #fff;
                }

                > .unit {
                  border: 1px solid #cbddf4;
                  color: $mainColor;
                  background-color: #cbddf4;
                }
              }
            }
          }

          > .sum-limit {
            > .right {
              > .input-top {
                > .input-sum {
                  border: 1px solid rgba(236, 241, 248, 1);
                  color: #9da5b3;
                  background-color: #fff;
                }

                > .unit {
                  border: 1px solid #cbddf4;
                  color: $mainColor;
                  background-color: #cbddf4;
                }
              }

              > .input-bottom {
                > .input-min,
                .input-max {
                  border: 1px solid rgba(236, 241, 248, 1);
                  background-color: #fff;
                }

                > .unit {
                  border: 1px solid #cbddf4;
                  color: $mainColor;
                  background-color: #cbddf4;
                }

                > .minMaxLink {
                  color: #7d90ac;
                }
              }
            }
          }

          > .limit-set {
            > .right {
              .input-limit {
                border: 1px solid rgba(236, 241, 248, 1);
                background-color: #fff;
              }
            }
          }

          > .button {
            > .AD-button {
              color: #fff;
              background: linear-gradient(9deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      > .publish-AD-right {
        > .publish-tips {
          > .title {
            color: #d45858;
          }

          > .tip {
            color: #7d90ac;
          }
        }
      }
    }

    /deep/ {
      .choice {
        .el-input__inner {
          border: 1px solid #ecf1f8;
          border-radius: 2px;
          background: #fff;
        }
      }

      .trade-way {
        .el-checkbox__inner {
          border: 1px solid #435372;
          background-color: #fff;
        }

        .el-checkbox {
          margin-right: 20px;
        }

        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }
      }

      .el-checkbox__input {
        &.is-checked {
          .el-checkbox__inner {
            background-color: #fff;
          }
        }

        &.is-indeterminate {
          .el-checkbox__inner {
            background-color: #fff;
          }
        }
      }

      .el-textarea__inner {
        border: 1px solid #ecf1f8;
        color: #7d90ac;
        background: #fff;
      }

      .password-dialog {
        .el-dialog__body {
          .password-input {
            border: 1px solid #ecf1f8;
          }
        }
      }

      .otc-publish-AD-content {
        > .publish-AD-left {
          > .AD-big-form {
            > .sale-price {
              > .right {
                > .input {
                  > .unit[data-v-6b1c45d6] {
                    color: $mainColor;
                    background-color: #cbddf4;
                  }

                  > .price-input[data-v-6b1c45d6] {
                    border: 1px solid #ecf1f8;
                    border-radius: 2px;
                    background: #fff;
                  }
                }
              }
            }

            > .sum-limit {
              > .right {
                > .input-top {
                  > .unit[data-v-6b1c45d6] {
                    color: $mainColor;
                    background-color: #cbddf4;
                  }

                  > .input-sum[data-v-6b1c45d6] {
                    border: 1px solid #ecf1f8;
                    border-radius: 2px;
                    background: #fff;
                  }
                }

                > .input-bottom {
                  > .unit[data-v-6b1c45d6] {
                    color: $mainColor;
                    background-color: #cbddf4;
                  }

                  > .input-min[data-v-6b1c45d6] {
                    border: 1px solid #ecf1f8;
                    border-radius: 2px;
                    background: #fff;
                  }

                  .input-max[data-v-6b1c45d6] {
                    border: 1px solid #ecf1f8;
                    border-radius: 2px;
                    background: #fff;
                  }
                }

                .input-limit[data-v-6b1c45d6] {
                  border: 1px solid #ecf1f8;
                  border-radius: 2px;
                  background: #fff;
                }
              }
            }

            > .common {
              border-bottom: 1px solid rgba(50, 54, 76, .1);

              > .left {
                > .warning[data-v-6b1c45d6] {
                  color: #3e79d6;
                }

                > .tips[data-v-6b1c45d6] {
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
