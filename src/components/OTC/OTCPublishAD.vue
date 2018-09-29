<template>
  <div
    class="otc-publish-AD-box otc"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 商家发布广告挂单 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 OTC发布广告内容 -->
    <div class="otc-publish-AD-content">
      <!--发布广告左侧主体内容-->
      <div class="publish-AD-left">
        <!-- 大标题发布广告 -->
        <div class="AD-title font-size20 padding-l15 font-weight700">
          {{$t('M.otc_merchant_publishAD')}}
        </div>
        <!-- 大表单 -->
        <div class="AD-big-form">
          <!-- 选择 -->
          <div class="common choice">
            <div class="left display-inline-block">
              <!-- 选择 -->
              <p class="tips font-size14">{{$t('M.otc_pl')}}</p>
              <!-- 必填 -->
              <p class="warning font-size12">{{$t('M.otc_publishAD_nustFill')}}</p>
            </div>
            <div class="right display-inline-block">
              <!-- 买卖类型 -->
              <div class="right-style display-inline-block">
                <el-select
                  v-model="activitedBuySellStyle"
                  @change="changeBuySellStyle"
                >
                  <el-option
                    v-for="(item,index) in buySellStyle"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="right-change display-inline-block">
                <!-- 可用币种 -->
                <el-select
                  v-model="activitedCoinId"
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
                <!-- 可用法币 -->
                <el-select
                  v-model="activitedCurrencyId"
                  @change="changeCurrencyId"
                >
                  <el-option
                    v-for="(item,index) in availableCurrencyList"
                    :key="index"
                    :value="item.id"
                    :label="item.name"
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
                <p class="tips font-size14">{{$t('M.otc_sell')}}{{$t('M.otc_index_price')}}</p>
                <!-- 必填 -->
                <p class="warning font-size12">{{$t('M.otc_publishAD_nustFill')}}</p>
            </div>
            <div class="right display-inline-block">
              <div>
                <p>
                  <span v-if="activitedBuySellStyle === 'SELL'">
                    {{$t('M.otc_seller_maximum')}}:
                    <!-- {{total}}{{activeedCoinName}} -->
                    <span class="max-avail-sell">
                      {{total ? total : '--'}}{{activeedCoinName}}
                    </span>
                  </span>
                  <!-- 市价 -->
                  <span>{{$t('M.otc_market_price')}}:
                    <!-- {{marketPrice}}{{activeedCurrencyName}} -->
                    <span class="markder-price">
                      {{marketPrice ? marketPrice : '--'}}{{activeedCurrencyName}}
                    </span>
                  </span>
                </p>
              </div>
              <!-- 定价设置 -->
              <p>{{$t('M.otc_publishAD_setPrice')}}</p>
              <div class="input">
                <!-- 单价 -->
                <input
                  type="text"
                  class="price-input"
                  :placeholder="$t('M.otc_index_UnitPrice')"
                  ref="price"
                  @keyup="changePriceValue('price', moneyPointLength)"
                  @input="changePriceValue('price', moneyPointLength)"
                >
                <!-- @keyup="changePriceValue('price')" -->
                <span class="unit font-size12">{{activeedCurrencyName}}</span>
              </div>
              <!-- 单价错误提示 -->
              <div class="err">{{errorInfoPrice}}</div>
            </div>
          </div>
          <!-- 交易方式 -->
          <div class="common trade-way">
            <div class="left display-inline-block">
              <!-- 交易方式 -->
                <p class="tips font-size14">{{$t("M.otc_publishAD_selltype")}}</p>
                <!-- 必填 -->
                <p class="warning font-size12">{{$t('M.otc_publishAD_nustFill')}}</p>
            </div>
            <div class="right display-inline-block">
              <el-checkbox-group
                v-model="activitedPayTypes"
                @change='changePayTypes'
              >
                <el-checkbox
                  label="alipay"
                  v-show="payForListArr[0] === '1'"
                >
                  {{$t('M.comm_alipay')}}
                </el-checkbox>
                <el-checkbox
                  label="weixin"
                  v-show="payForListArr[1] === '1'"
                >
                  {{$t('M.comm_weixin')}}
                </el-checkbox>
                <el-checkbox
                  label="bank"
                  v-show="payForListArr[2] === '1'"
                >
                  {{$t('M.comm_bank')}}
                </el-checkbox>
                <el-checkbox
                  label="xilian"
                  v-show="payForListArr[3] === '1'"
                >
                  {{$t('M.comm_xilian')}}
                </el-checkbox>
                <el-checkbox
                label="paypal"
                v-show="payForListArr[4] === '1'"
                >
                  PAYPAL
                </el-checkbox>
              </el-checkbox-group>
              <div class="err">{{errorInfoTradeWay}}</div>
            </div>
          </div>
          <div class="common sum-limit">
            <div class="left display-inline-block">
                <!-- 数量与限额 -->
                <p class="tips font-size14">
                  {{$t('M.comm_count')}}{{$t('M.comm_and')}}{{$t('M.otc_publishAD_limitMoney')}}
                </p>
                <!--必填  -->
                <p class="warning font-size12">
                  {{$t('M.otc_publishAD_nustFill')}}
                </p>
            </div>
            <div class="right display-inline-block">
              <!-- 交易数量 -->
              <p>{{$t('M.otc_publishAD_sellmount')}}</p>
              <div class="input-top">
                <input
                  type="text"
                  class="input-sum"
                  :placeholder="$t('M.otc_publishAD_sellmount')"
                  ref="entrustCount"
                  @keyup="changeEntrustCountValue('entrustCount', pointLength)"
                  @input="changeEntrustCountValue('entrustCount', pointLength)"
                >
                <!-- @keyup="changeEntrustCountValue('entrustCount')" -->
                <span class="unit font-size14">{{activeedCoinName}}</span>
              </div>
              <div class="err">{{errorInfoEntrustCount}}</div>
              <p class="text">
                <!-- 单笔最小限额 -->
                <span class="money-min">{{$t('M.otc_publishAD_minlimitMoney')}}</span>
                <!-- 单笔最大限额 -->
                <span class="money-max">{{$t('M.otc_publishAD_maxlimitMoney')}}</span>
              </p>
              <div class="input-bottom">
                <!-- 单笔最小限额 -->
                <input
                  type="text"
                  class="input-min"
                  :placeholder="$t('M.otc_publishAD_minlimitMoney') + this.minCount"
                  ref="minCountValue"
                  @keyup="changeMinCountInputValue('minCountValue', moneyPointLength)"
                  @input="changeMinCountInputValue('minCountValue', moneyPointLength)"
                >
                <!-- @keyup="changeMinCountInputValue('minCountValue')" -->
                <span class="unit font-size14">{{activeedCurrencyName}}</span>
                <span class= "minMaxLink">一</span>
                <!-- 单笔最大限额 -->
                <input
                  type="text"
                  class="input-max"
                  :placeholder="$t('M.otc_publishAD_maxlimitMoney') + this.maxCount"
                  ref="maxCountValue"
                  @keyup="changeMaxCountInputValue('maxCountValue', moneyPointLength)"
                  @input="changeMaxCountInputValue('maxCountValue', moneyPointLength)"
                >
                <!-- @keyup="changeMaxCountInputValue('maxCountValue')" -->
                <span class="unit font-size14">{{activeedCurrencyName}}</span>
              </div>
              <div>
                <span class="err err-min-count">{{errorInfoMinCount}}</span>
                <span class="err">{{errorInfoMaxCount}}</span>
              </div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="common remark">
            <div class="left display-inline-block">
              <!-- 备注 -->
                <p class="tips font-size14">{{$t('M.comm_remark')}}</p>
                <!-- 建议填写 -->
                <p class="warning font-size12">{{$t('M.otc_publishAD_adviceToFill')}}</p>
            </div>
            <div class="right display-inline-block">
              <el-input
                type="textarea"
                auto-complete="off"
                maxlength="20"
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
                <p class="tips font-size14">{{$t('M.otc_publishAD_setLimit')}}</p>
                <!-- 必选 -->
                <p class="warning font-size12">{{$t('M.otc_publishAD_nustFill')}}</p>
            </div>
            <div class="right display-inline-block">
              <div>
                <!-- 同时处理最大订单数(0=不限制) -->
                {{$t('M.otc_publishAD_maxOrder')}}（0={{$t('M.otc_publishAD_noLimit')}}）
                <span class="question-mark cursor-pointer">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-start"
                  >
                    <div slot="content">
                      <!-- 设置该限制，可以避免大量订单同时涌进，导致处理不过来的情况，比如当您设定为 2 时，最多只会有 2 笔订单可同时向您下单，
                      <br/>
                      其余卖家会看到「广告主处理订单已达上限，请稍候再试」，待您处理完后才允许下一笔订单进入 -->
                      {{$t('M.otc_publishAD_setDiscript')}}<br/>
                      {{$t('M.otc_publishAD_setDiscriptTwo')}}
                    </div>
                    <IconFontCommon
                      class="font-size14"
                      iconName="icon-wenhao"
                    />
                  </el-tooltip>
                </span>
              </div>
              <div>
                <input
                  class="input-limit"
                  v-model="limitOrderCount"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
                >
                <!-- <input
                  type="text"
                  class="input-limit"
                  ref="limitOrderCount"
                  @keyup="changeLimitOrderCountValue('limitOrderCount')"
                > -->
                <!-- 错误提示 -->
                <div class="err">{{errorInfoLimitOrderCount}}</div>
              </div>
              <div>
              {{$t('M.otc_publishAD_sellNeedLimit')}}（0={{$t('M.otc_publishAD_noLimit')}}）
              </div>
              <div>
                <input
                  class="input-limit"
                  v-model="successOrderCount"
                  onkeyup="this.value=this.value.replace(/\D/g,'')"
                  onafterpaste="this.value=this.value.replace(/\D/g,'')"
                >
                <!-- <input
                  type="text"
                  class="input-limit"
                  ref="successOrderCount"
                  @keyup="changeSuccessOrderCountValue('successOrderCount')"
                > -->
                <!-- 错误提示 -->
                <div class="err">{{errorInfoSuccessOrderCount}}</div>
              </div>
            </div>
          </div>
          <!-- 提交按钮 -->
          <div class="button">
            <button
              class="AD-button font-size14 cursor-pointer"
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
              :visible.sync="dialogVisible"
              top="25vh"
              width="470"
            >
            <!-- 请输入交易密码 -->
              <div>{{$t('M.otc_publishAD_pleaseInput')}}{{$t('M.otc_publishAD_sellpassword')}}</div>
              <div class="input">
                <input
                  type="password"
                  class="password-input"
                  v-model="tradePassword"
                  @focus="tradePasswordFocus"
                >
              </div>
              <div class="error-info">
                <!-- 错误提示 -->
                <div class="tips err">{{errorInfoPassword}}</div>
              </div>
              <span
                slot="footer"
                class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="publishADSubmitButton"
                  >
                  <!-- 提交 -->
                    {{$t('M.comm_sub_time')}}
                  </el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
      <!--发布广告右侧提示信息-->
      <div class="publish-AD-right">
        <div class="publish-tips">
          <div class="title font-size14">{{$t('M.otc_publishAD_publishDis')}}：</div>
          <p class="tip font-size12">
            ●FUBT.TOP {{$t('M.otc_publishAD_discriptLineOne')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineTwo')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineThree')}}
          </p>
          <p class="tip font-size12">
            ●{{$t('M.otc_publishAD_discriptLineFour')}}
          </p>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 引入接口
import {formatNumberInput} from '../../utils'
import {querySelectedOrdersDetails, addOTCPutUpOrdersMerchantdedicated, getOTCCoinInfo} from '../../utils/api/OTC'
// 引入组件
import NavCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
// 引入提示信息
import {returnAjaxMessage} from '../../utils/commonFunc'
// 引入全局变量和方法
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      dialogVisible: false, // 弹窗状态
      // 选择模块下拉列表循环数组
      activitedBuySellStyle: 'SELL', // 选中的发布广告 买卖 类型
      buySellStyle: [ // 1.0 发布广告 买卖 类型数组
        {
          id: 'SELL',
          name: this.$t('M.comm_offering')
        },
        {
          id: 'BUY',
          name: this.$t('M.comm_buying')
        }
      ],
      // 2.0 币种名字下拉数组：可用币种
      activitedCoinId: '', // 选中的可用币种id
      activeedCoinName: '', // 选中币种的name
      availableCoinList: [], // 可用币种数组
      // 3.0 法币币种数组
      activitedCurrencyId: '', // 选中的可用法币id
      activeedCurrencyName: '', // 选中的可用法币name
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
      activitedPayTypes: [],
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
      messageId: this.$route.query.id,
      pointLength: 4, // 当前币种返回的保留小数点位数限制
      moneyPointLength: 2 // 当前金额小数点限制位数
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCPublishAD.css')
    require('../../../static/css/theme/day/OTC/OTCPublishADDay.css')
    require('../../../static/css/theme/night/OTC/OTCPublishADNight.css')
    // console.log('从全局获得商户id：' + this.partnerId)
    console.log('从广告管理传过来的URL中的订单id:' + this.$route.query.id)
    if (this.$route.query.id) {
      console.log('1:url中有id')
      this.getOTCSelectedOrdersDetails()
    } else {
      console.log('2：URL中没有id')
      this.getOTCCoinInfo()
    }
    // 刚进页面就调此方法请求币种详情来渲染页面
    // this.getOTCCoinInfo()
    // ====================分割线===================================
    // 1.0 otc可用币种查询：
    // this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    // this.getMerchantAvailablelegalTenderList()
    // 3.0 查询用户现有支付方式
    // this.queryUserPayTypesList()
    // 4.0 请求挂单详情接口
    // 根据 从广告管理传过来的URL中的订单id 请求挂单详情数据 再塞到页面中
    // if (this.$route.query.id && this.payForListArr) {
    //   console.log('URL有id才出现我')
    //   this.getOTCSelectedOrdersDetails()
    // }
    // 5.0 汇率转换:刚进页面时候(当币种和法币都返回以后调接口)
    // if (this.availableCoinList && this.availableCurrencyList) {
    //   console.log('1234')
    //   this.changeRateMinCreated()
    //   this.changeRateMaxCreated()
    // }
  },
  mounted () {
    // this.getOTCAvailableCurrencyList()
    // this.getMerchantAvailablelegalTenderList()
    // this.queryUserPayTypesList()
    // if (this.$route.query.id && this.payForListArr) {
    //   this.getOTCSelectedOrdersDetails()
    // }
    // if (this.activeedCoinName && this.activeedCurrencyName) {
    //   console.log('1234')
    //   console.log(this.$refs)
    //   console.log(this.activeedCurrencyName)
    // }
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
    ]),
    // 广告管理跳转过来 请求详情接口
    async getOTCSelectedOrdersDetails () {
      const data = await querySelectedOrdersDetails({
        entrustId: this.messageId
      })
      console.log('挂单详情')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.activitedCoinId = data.data.data.coinId // 可用币种id
        this.activitedCurrencyId = data.data.data.currencyId // 法币id
        this.activitedBuySellStyle = data.data.data.entrustType // 挂单类型
        this.limitOrderCount = data.data.data.limitOrderCount // 同时处理最大订单数
        this.successOrderCount = data.data.data.successOrderCount // 卖家必须成交过几次
        this.$refs.entrustCount.value = data.data.data.entrustCount // 挂单数量
        // this.$refs.price.value = data.data.data.price // 单价
        this.price = data.data.data.price // 单价
        this.$refs.price.value = this.price // 单价
        // 下面两个如果有id的话从挂单详情中渲染数据
        // 币种单笔最大限额
        // this.maxCount = data.data.data.maxCount
        // this.$refs.maxCountValue.value = this.maxCount
        // 币种单笔最小限额
        // this.minCount = data.data.data.minCount
        // this.$refs.minCountValue.value = this.minCount
        this.getOTCCoinInfo()
      }
    },
    // 1.0 币种详情 : 商家和普通用户挂单页面请求币种详情渲染页面
    async getOTCCoinInfo () {
      const data = await getOTCCoinInfo({
        currencyId: this.activitedCurrencyId, // 法币id
        coinId: this.activitedCoinId // 币种id
      })
      console.log('币种详情')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // 1.0 可用币种列表
        this.availableCoinList = data.data.data.coinlist
        this.availableCoinList.forEach(item => {
          if (data.data.data.otcCoinQryResponse.coinId === item.coinId) {
            this.activitedCoinId = item.coinId
          }
        })
        this.activeedCoinName = data.data.data.otcCoinQryResponse.name
        // 2.0 法币种列表
        this.availableCurrencyList = data.data.data.currencyList
        this.availableCurrencyList.forEach(item => {
          if (data.data.data.otcCoinQryResponse.currencyName === item.shortName) {
            this.activitedCurrencyId = item.id
          }
        })
        this.activeedCurrencyName = data.data.data.otcCoinQryResponse.currencyName
        // 3.0 交易支付方式
        this.payForListArr = data.data.data.userbankFlag
        // 最大可卖出量:可用资产
        this.total = data.data.data.otcCoinQryResponse.total
        // 市价
        this.marketPrice = data.data.data.otcCoinQryResponse.marketPrice
        // 最低价
        this.minPrice = data.data.data.otcCoinQryResponse.minPrice
        // 最高价
        this.maxPrice = data.data.data.otcCoinQryResponse.maxPrice
        // 当前币种返回的保留小数点位数限制
        this.pointLength = data.data.data.otcCoinQryResponse.unit
        // 下面这两个字段当URL中没id时候才用这个渲染页面
        // if (!this.$route.query.id) {
        // 币种单笔最大限额
        this.maxCount = data.data.data.otcCoinQryResponse.maxCount
        this.$refs.maxCountValue.value = this.maxCount
        // 币种单笔最小限额
        this.minCount = data.data.data.otcCoinQryResponse.minCount
        this.$refs.minCountValue.value = this.minCount
        // }
      }
    },
    // 2.0 改变发布广告 买卖 类型
    changeBuySellStyle (e) {
      this.activitedBuySellStyle = e
      console.log(this.activitedBuySellStyle)
      // 币种详情
      console.log('币种id：' + this.activitedCoinId)
      console.log('法种id：' + this.activitedCurrencyId)
      this.getOTCCoinInfo()
    },
    // 3.0 改变可用币种id
    changeAvailableCoinId (e) {
      // console.log(e)
      this.activitedCoinId = e
      // console.log(this.activitedCoinId)
      // 币种详情
      console.log('币种id：' + this.activitedCoinId)
      console.log('法种id：' + this.activitedCurrencyId)
      this.getOTCCoinInfo()
    },
    // 4.0 改变可用法币的币种id
    changeCurrencyId (e) {
      // console.log(e)
      this.activitedCurrencyId = e
      // console.log(this.activitedCurrencyId)
      // 币种详情
      console.log('币种id：' + this.activitedCoinId)
      console.log('法种id：' + this.activitedCurrencyId)
      this.getOTCCoinInfo()
    },
    // 5.0 点击发布广告弹出输入交易密码框
    showPasswordDialog () {
      // 非空及数据范围准确性验证
      // 单价
      if (!this.$refs.price.value) {
        this.errorInfoPrice = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_index_UnitPrice')
        return false
      } else if (this.$refs.price.value < this.minPrice || this.$refs.price.value > this.maxPrice) {
        this.errorInfoPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice + this.$t('M.otc_publishAD_rangePrice')
        return false
      }
      // 交易方式
      if (!this.parameterPayTypes) {
        // 请选择交易方式
        this.errorInfoTradeWay = this.$t('M.otc_publishAD_chouseSellType')
        return false
      }
      // 交易数量
      // console.log(this.$refs.entrustCount.value)
      if (!this.$refs.entrustCount.value || this.$refs.entrustCount.value - 0 === 0) {
        // 请输入交易数量
        this.errorInfoEntrustCount = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellmount')
        return false
      }
      // 单笔最小最大限制
      if (this.errorInfoMinCount) {
        return false
      }
      if (this.errorInfoMaxCount) {
        return false
      }
      // 限制设置--非必输选项
      this.dialogVisible = true
    },
    // 6.0 点击密码框中的提交按提交钮发布广告
    async publishADSubmitButton () {
      if (!this.tradePassword) {
        // 请输入交易密码
        this.errorInfoPassword = this.$t('M.otc_publishAD_pleaseInput') + this.$t('M.otc_publishAD_sellpassword')
        return false
      }
      let param = {
        entrustType: this.activitedBuySellStyle, // 挂单类型(BUY SELL)
        // partnerCoinId: this.activitedCoinId, // 挂单币种
        coinId: this.activitedCoinId, // 挂单币种
        currencyId: this.activitedCurrencyId, // 法币Id
        // entrustCount: this.entrustCount, // 挂单数量
        entrustCount: this.$refs.entrustCount.value, // 挂单数量
        // price: this.price, // 单价
        price: this.$refs.price.value, // 单价
        minCount: this.$refs.minCountValue.value, // 用户输入的单笔最小限额（单位：选中法币） 0 - 不限制
        maxCount: this.$refs.maxCountValue.value, // 用户输入的单笔最大限额（单位：选中法币） 0 - 不限制
        limitOrderCount: this.limitOrderCount, // 同时处理最大订单数(0=不限制)
        successOrderCount: this.successOrderCount, // 买家必须成交过几次(0=不限制)
        remark: this.remarkText, // 备注
        payTypes: this.parameterPayTypes, // 支付方式（用，隔开的名字）
        tradePassword: this.tradePassword // 交易密码
      }
      const data = await addOTCPutUpOrdersMerchantdedicated(param)
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.dialogVisible = false
        // 清空数据
      }
    },
    // 7.0 交易密码框获得焦点
    tradePasswordFocus () {
      this.errorInfoPassword = ''
    },
    // 改变支付方式
    changePayTypes (e) {
      console.log(e)
      this.activitedPayTypes = e
      // console.log(this.activitedPayTypes)
      // 处理支付方式数据格式，转成 a,b,c 形势
      let str = ''
      this.activitedPayTypes.forEach(item => {
        // console.log(item)
        str += item + ','
      })
      // 去掉最后一个逗号(如果不需要去掉，就不用写)
      if (str.length > 0) {
        str = str.substr(0, str.length - 1)
      }
      this.parameterPayTypes = str
      console.log(this.parameterPayTypes)
      this.errorInfoTradeWay = '' // 清空错误提示
    },
    // 清空input框数据
    clearInputData () {
      this.activitedBuySellStyle = ''
      this.activitedCoinId = ''
      this.activitedCurrencyId = ''
      this.entrustCount = ''
      this.price = ''
      this.minCount = ''
      this.maxCount = ''
      this.limitOrderCount = ''
      this.successOrderCount = ''
      this.remarkText = ''
      this.parameterPayTypes = ''
      this.tradePassword = ''
    },
    // 输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
    // 修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
      console.log(this[ref])
    },
    // 校验用户输入的 定价设置：键盘弹起事件
    changePriceValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.price)
      // console.log(this.$refs.price.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      if (this.$refs.price.value) {
        if (this.price < this.minPrice || this.price > this.maxPrice) {
          this.errorInfoPrice = this.$t('M.otc_publishAD_pleaseInput') + this.minPrice + '~' + this.maxPrice + this.$t('M.otc_publishAD_rangePrice')
          return false
        } else {
          this.errorInfoPrice = ''
        }
      } else {
        this.errorInfoPrice = ''
      }
    },
    // 校验用户输入的 交易数量：键盘弹起事件
    changeEntrustCountValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.entrustCount)
      // console.log(this.$refs.entrustCount.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      if (this.$refs.entrustCount.value) {
        this.errorInfoEntrustCount = ''
      }
    },
    // 校验单笔最小限额
    changeMinCountInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.minCountValue)
      // console.log(this.$refs.minCountValue.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 开始校验
      if (this.$refs.minCountValue.value < this.minCount) {
        // 输入值不能小于最小限额
        this.errorInfoMinCount = this.$t('M.otc_publishAD_inputminLimit')
        return false
      } else {
        this.errorInfoMinCount = ''
      }
      // console.log(typeof (this.$refs.maxCountValue.value)) // string
      if (this.$refs.minCountValue.value > this.$refs.maxCountValue.value - 0) {
        this.errorInfoMinCount = this.$t('M.otc_publishAD_inputmaxLimit')
        return false
      } else {
        this.errorInfoMinCount = ''
      }
      if (this.$refs.minCountValue.value < this.$refs.maxCountValue.value - 0) {
        this.errorInfoMaxCount = ''
      }
    },
    // 校验单笔最大限额
    changeMaxCountInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.maxCountValue)
      // console.log(this.$refs.maxCountValue.value)
      // 开始校验
      if (this.$refs.maxCountValue.value > this.maxCount) {
        // 输入值不能大于最大限额
        this.errorInfoMaxCount = this.$t('M.otc_publishAD_inputmaxLimit')
        return false
      } else {
        this.errorInfoMaxCount = ''
      }
      // console.log(this.minCountValue)
      // console.log(typeof (this.$refs.minCountValue.value)) // string
      if (this.$refs.maxCountValue.value < this.$refs.minCountValue.value - 0) {
        // 输入值不能小于最小限额
        this.errorInfoMaxCount = this.$t('M.otc_publishAD_inputminLimit')
        return false
      } else {
        this.errorInfoMaxCount = ''
      }
      if (this.$refs.maxCountValue.value > this.$refs.minCountValue.value - 0) {
        this.errorInfoMinCount = ''
      }
      // if (!(this.maxCountValue > this.minCountValue && this.maxCountValue <= this.maxCount)) {
      //   this.errorInfoMaxCount = '输入有误max'
      //   return false
      // } else {
      //   this.errorInfoMaxCount = ''
      // }
    }
    // 校验 同时处理最大订单数（0=不限制）
    // changeLimitOrderCountValue (ref) {
    //   this[ref] = this.$refs[ref].value
    //   console.log(this.limitOrderCount)
    //   // 开始处理用户输入数据逻辑
    //   if (this.limitOrderCount < 0) {
    //     this.errorInfoLimitOrderCount = '输入数字不能小于0'
    //     return false
    //   } else {
    //     this.errorInfoLimitOrderCount = ''
    //   }
    // },
    // 校验 卖家必须成交过几次（0=不限制）
    // changeSuccessOrderCountValue (ref) {
    //   this[ref] = this.$refs[ref].value
    //   console.log(this.successOrderCount)
    //   // 开始处理用户输入数据逻辑
    //   if (this.successOrderCount < 0) {
    //     this.errorInfoSuccessOrderCount = '输入数字不能小于0'
    //     return false
    //   } else {
    //     this.errorInfoSuccessOrderCount = ''
    //   }
    // },
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      theme: state => state.common.theme
      // userInfo: state => state.user.loginStep1Info.userInfo
    })
    // activitedBuySellStyle () {
    // }
  },
  watch: {
    // 监控法币change之前之后的法币名称
    // activeedCurrencyName (transformationNew, transformationOld) { // 新的  旧的
    //   this.transformationNewCurrencyName = transformationNew
    //   console.log(this.transformationNewCurrencyName)
    //   this.transformationOldCurrencyName = transformationOld
    //   console.log(this.transformationOldCurrencyName)
    //   this.changeRateMin()
    //   this.changeRateMax()
    // }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import "../../../static/css/scss/index";
.otc-publish-AD-box{
  >.otc-publish-AD-content{
    width: 1150px;
    margin: 70px auto;
    display: flex;
    flex: 3;
    padding-top: 50px;
    >.publish-AD-left{
      flex: 2;
      >.AD-title{
        height: 30px;
        line-height: 30px;
        // color: #338FF5;
        // border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      >.AD-big-form{
        width: 720px;
        .err{
          // color: red;
        }
        >.common{
          box-sizing: border-box;
          padding: 30px 0;
          // border-bottom: 1px solid #39424D;
          >.left{
            width: 110px;
            vertical-align: top;
            >.tips{
              // color: #fff;
            }
            >.warning{
              // color: #3E79D6;
            }
          }
          >.right{
            // color: #9DA5B3;
            font-size: 14px;
          }
        }
        >.choice{
          >.left{
            >.tips{
            }
            >.warning{
            }
          }
          >.right{
            >.right-style{
              margin-right: 50px;
            }
            >.right-change{
              >.double-sided-arrow{
                // color: #797979;
                margin: 0 10px;
              }
            }
          }
        }
        >.sale-price{
          >.right{
            .max-avail-sell{
              // color: #30C296;
              padding-right: 10px;
            }
            .markder-price{
              // color: #E97345;
            }
            >.input{
              margin: 10px 0 5px 0;
              >.price-input{
                width: 234px;
                height: 36px;
                // background-color: #232F44;
                padding-left: 10px;
                // color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 36px;
                height: 36px;
                line-height: 36px;
                // color: #7EA9E4;
                // background-color: #303F59;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
            }
          }
        }
        >.trade-way{
          >.right{
          }
        }
        >.sum-limit{
          >.right{
            .err-min-count{
              margin-right: 100px;
            }
            >.input-top{
              margin-top: 15px;
              margin-bottom: 5px;
              >.input-sum{
                width: 198px;
                height: 36px;
                // background-color: #232F44;
                padding-left: 10px;
                // color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                // color: #7EA9E4;
                // background-color: #303F59;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
            }
            >.text{
              margin-top: 20px;
              >.money-min{

              }
              >.money-max{
                margin-left: 166px;
              }
            }
            >.input-bottom{
              margin-top: 10px;
              margin-bottom: 5px;
              >.input-min,.input-max{
                width: 140px;
                height: 36px;
                // background-color: #232F44;
                padding-left: 10px;
                // color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                // color: #7EA9E4;
                // background-color: #303F59;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
              >.minMaxLink{
                margin: 0px 10px;
                // color:#7d90ac;
              }
            }
          }
        }
        >.remark{
          >.right{
          }
        }
        >.limit-set{
          border-bottom: 0;
          >.right{
            .question-mark{
            }
            .input-limit{
              width: 258px;
              height: 36px;
              // background-color: #232F44;
              padding-left: 10px;
              border-radius: 4px;
              margin: 15px 0 5px 0;
              // color: #9DA5B3;
            }
          }
        }
        >.button{
          text-align: center;
          margin-top: 20px;
          >.AD-button{
            width: 590px;
            height: 44px;
            // color: #FFFFFF;
            // background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            border-radius: 4px;
          }
        }
      }
    }
    >.publish-AD-right{
      flex: 1;
      >.publish-tips{
        width: 250px;
        margin-left: 40px;
        >.title{
          // color: #338FF5;
        }
        >.tip{
          // color: #9DA5B3;
          line-height: 20px;
        }
      }
    }
  }
  &.night{
    background-color: $mainNightBgColor;
    >.otc-publish-AD-content{
      >.publish-AD-left{
        >.AD-title{
          color: #338FF5;
          border-left: 3px solid #338FF5;
        }
        >.AD-big-form{
          .err{
            color: red;
          }
          >.common{
            >.left{
              >.tips{
                color: #fff;
              }
              >.warning{
                color: #3E79D6;
              }
            }
            >.right{
              color: #9DA5B3;
            }
          }
          >.choice{
            >.left{
              >.tips{
              }
              >.warning{
              }
            }
            >.right{
              >.right-style{
              }
              >.right-change{
                >.double-sided-arrow{
                  color: #797979;
                }
              }
            }
          }
          >.sale-price{
            >.right{
              .max-avail-sell{
                color: #30C296;
              }
              .markder-price{
                color: #E97345;
              }
              >.input{
                >.price-input{
                  background-color: #1C1F32;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #21243B;
                }
              }
            }
          }
          >.trade-way{
            >.right{
            }
          }
          >.sum-limit{
            >.right{
              .err-min-count{
              }
              >.input-top{
                >.input-sum{
                  background-color: #1C1F32;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #21243B;
                }
              }
              >.text{
                >.money-min{

                }
                >.money-max{
                }
              }
              >.input-bottom{
                >.input-min,.input-max{
                  background-color: #1C1F32;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #21243B;
                }
                >.minMaxLink{
                  color:#7d90ac;
                }
              }
            }
          }
          >.remark{
            >.right{
            }
          }
          >.limit-set{
            border-bottom: 0;
            >.right{
              .question-mark{
              }
              .input-limit{
                background-color: #1C1F32;
                color: #9DA5B3;
              }
            }
          }
          >.button{
            >.AD-button{
              color: #FFFFFF;
              background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            }
          }
        }
      }
      >.publish-AD-right{
        >.publish-tips{
          >.title{
            color: #338FF5;
          }
          >.tip{
            color: #9DA5B3;
          }
        }
      }
    }
  }
  &.day{
    background-color: $mainDayBgColor;
    >.otc-publish-AD-content{
      >.publish-AD-left{
        >.AD-title{
        }
        >.AD-big-form{
          .err{
            color: red;
          }
          >.common{
            >.left{
              >.tips{
                color: #fff;
              }
              >.warning{
                color: #3E79D6;
              }
            }
            >.right{
              color: #9DA5B3;
            }
          }
          >.choice{
            >.left{
              >.tips{
              }
              >.warning{
              }
            }
            >.right{
              >.right-style{
              }
              >.right-change{
                >.double-sided-arrow{
                  color: #797979;
                }
              }
            }
          }
          >.sale-price{
            >.right{
              .max-avail-sell{
                color: #30C296;
              }
              .markder-price{
                color: #E97345;
              }
              >.input{
                >.price-input{
                  background-color: #232F44;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #303F59;
                }
              }
            }
          }
          >.trade-way{
            >.right{
            }
          }
          >.sum-limit{
            >.right{
              .err-min-count{
              }
              >.input-top{
                >.input-sum{
                  background-color: #232F44;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #303F59;
                }
              }
              >.text{
                >.money-min{

                }
                >.money-max{
                }
              }
              >.input-bottom{
                >.input-min,.input-max{
                  background-color: #232F44;
                  color: #9DA5B3;
                }
                >.unit{
                  color: #7EA9E4;
                  background-color: #303F59;
                }
                >.minMaxLink{
                  color:#7d90ac;
                }
              }
            }
          }
          >.remark{
            >.right{
            }
          }
          >.limit-set{
            border-bottom: 0;
            >.right{
              .question-mark{
              }
              .input-limit{
                background-color: #232F44;
                color: #9DA5B3;
              }
            }
          }
          >.button{
            >.AD-button{
              color: #FFFFFF;
              background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            }
          }
        }
      }
      >.publish-AD-right{
        >.publish-tips{
          >.title{
            color: #338FF5;
          }
          >.tip{
            color: #9DA5B3;
          }
        }
      }
    }
  }
}
</style>
