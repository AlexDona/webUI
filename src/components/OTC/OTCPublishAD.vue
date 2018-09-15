<template>
  <div class="otc-publish-AD-box otc">
    <!-- 商家发布广告挂单 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 OTC发布广告内容 -->
    <div class="otc-publish-AD-content">
      <!--发布广告左侧主体内容-->
      <div class="publish-AD-left">
        <!-- 大标题发布广告 -->
        <div class="AD-title font-size20 padding-l15 font-weight700">
          发布广告
        </div>
        <!-- 大表单 -->
        <div class="AD-big-form">
          <!-- 选择 -->
          <div class="common choice">
            <div class="left display-inline-block">
              <p class="tips font-size14">选择</p>
              <p class="warning font-size12">必填</p>
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
                <!-- 商家可用币种 -->
                <el-select
                  v-model="activitedCoinId"
                  @change="changeAvailableCoinId"
                >
                  <el-option
                    v-for="(item,index) in availableCoinName"
                    :key="index"
                    :value="item.partnerCoinId"
                    :label="item.name"
                  >
                    {{ item.name }}
                  </el-option>
                </el-select>
                <span class="double-sided-arrow display-inline-block">
                  <!-- <IconFontCommon
                    iconName="icon-zhuanhuannei"
                  /> -->
                </span>
                <!-- 可用法币 -->
                <el-select
                  v-model="activitedCurrencyId"
                  @change="changeCurrencyId"
                >
                  <el-option
                    v-for="(item,index) in availableCurrencyId"
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
                <p class="tips font-size14">销售价格</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <div>
                <p>
                  <span v-if="activitedBuySellStyle === 'SELL'">最大可卖出量:{{total}}{{activeedCoinName}}</span>
                  <span>市价:{{marketPrice}}{{activeedCurrencyName}}</span>
                </p>
              </div>
              <p>定价设置</p>
              <div class="input">
                <input
                  type="text"
                  class="price-input"
                  placeholder="单价"
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
                <p class="tips font-size14">交易方式</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <el-checkbox-group
                v-model="activitedPayTypes"
                @change='changePayTypes'
              >
                <el-checkbox label="alipay" v-show="payForListArr[0] === '1'">支付宝</el-checkbox>
                <el-checkbox label="weixin" v-show="payForListArr[1] === '1'">微信</el-checkbox>
                <el-checkbox label="bank" v-show="payForListArr[2] === '1'">银行卡</el-checkbox>
                <el-checkbox label="xilian" v-show="payForListArr[3] === '1'">西联汇款</el-checkbox>
                <el-checkbox label="paypal" v-show="payForListArr[4] === '1'">PAYPAL</el-checkbox>
              </el-checkbox-group>
              <div class="err">{{errorInfoTradeWay}}</div>
            </div>
          </div>
          <!-- 数量与限额 -->
          <div class="common sum-limit">
            <div class="left display-inline-block">
                <p class="tips font-size14">数量与限额</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <p>交易数量</p>
              <div class="input-top">
                <input
                  type="text"
                  class="input-sum"
                  placeholder="交易数量"
                  ref="entrustCount"
                  @keyup="changeEntrustCountValue('entrustCount', pointLength)"
                  @input="changeEntrustCountValue('entrustCount', pointLength)"
                >
                <!-- @keyup="changeEntrustCountValue('entrustCount')" -->
                <span class="unit font-size14">{{activeedCoinName}}</span>
              </div>
              <div class="err">{{errorInfoEntrustCount}}</div>
              <p class="text">
                <span class="money-min">单笔最小限额</span>
                <span class="money-max">单笔最大限额</span>
              </p>
              <div class="input-bottom">
                <!-- 单笔最小限额 -->
                <input
                  type="text"
                  class="input-min"
                  placeholder="单笔最小限额"
                  ref="minCountValue"
                  @keyup="changeMinCountInputValue('minCountValue', moneyPointLength)"
                  @input="changeMinCountInputValue('minCountValue', moneyPointLength)"
                >
                <!-- @keyup="changeMinCountInputValue('minCountValue')" -->
                <span class="unit font-size14">{{activeedCurrencyName}}</span>
                <!-- 单笔最大限额 -->
                <input
                  type="text"
                  class="input-max"
                  placeholder="单笔最大限额"
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
                <p class="tips font-size14">备注</p>
                <p class="warning font-size12">建议填写</p>
            </div>
            <div class="right display-inline-block">
              <el-input
                type="textarea"
                auto-complete="off"
                maxlength="20"
                placeholder="输入留言: 请说明有关于您交易的相关条款或者其它您想让对方获悉得信息，以便对方和您快速交易"
                v-model="remarkText"
              >
              </el-input>
            </div>
          </div>
          <!-- 限制设置 -->
          <div class="common limit-set">
            <div class="left display-inline-block">
                <p class="tips font-size14">限制设置</p>
                <p class="warning font-size12">选填</p>
            </div>
            <div class="right display-inline-block">
              <div>
                同时处理最大订单数（0=不限制）
                <span class="question-mark cursor-pointer">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-start"
                  >
                    <div slot="content">
                      设置该限制，可以避免大量订单同时涌进，导致处理不过来的情况，比如当您设定为 2 时，最多只会有 2 笔订单可同时向您下单，
                      <br/>
                      其余卖家会看到「广告主处理订单已达上限，请稍候再试」，待您处理完后才允许下一笔订单进入
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
                卖家必须成交过几次（0=不限制）
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
              发布广告
            </button>
          </div>
          <!-- 发布广告弹出交易密码框 -->
          <div class="password-dialog">
            <el-dialog
              title="交易密码"
              :visible.sync="dialogVisible"
              top="25vh"
              width="470"
            >
              <div>请输入交易密码</div>
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
                    提 交
                  </el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
      <!--发布广告右侧提示信息-->
      <div class="publish-AD-right">
        <div class="publish-tips">
          <div class="title font-size14">发布说明：</div>
          <p class="tip font-size12">
            ●FUBT.TOP 为了保证用户的交易安全，将采用
            数字货币托管系统。严禁绕过平台私下交易，
            违者将自行承担损失，且永久封号；
          </p>
          <p class="tip font-size12">
            ●请在交易说明及交易备注中，详细写下您所希
            望的交易条件，以及与您交易所需注意的事项，
            明确的信息将提升您的交易成功机率。
          </p>
          <p class="tip font-size12">
            ●请勿在 FUBT.TOP尝试欺诈行为，违者将会导
            致帐号被冻结，并承担法律责任。
          </p>
          <p class="tip font-size12">
            ●发布广告后请履行契约精神，恶意抬价或者是
            反悔，被投诉将冻结账户 3-15 天不等
          </p>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 引入接口
import {formatNumberInput} from '../../utils'
import {querySelectedOrdersDetails, getOTCAvailableCurrency, getMerchantAvailablelegalTender, addOTCPutUpOrdersMerchantdedicated, queryUserTradeFeeAndCoinInfo, queryUserPayTypes} from '../../utils/api/OTC'
// 引入组件
import NavCommon from '../Common/HeaderCommon'
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
          name: '出售'
        },
        {
          id: 'BUY',
          name: '购买'
        }
      ],
      // 2.0 币种名字下拉数组：商家可用币种
      activitedCoinId: '', // 选中的商家可用币种id
      activeedCoinName: '', // 选中币种的name
      availableCoinName: [], // 可用币种数组
      // 3.0 可用法币币种数组
      activitedCurrencyId: '', // 选中的可用法币id
      activeedCurrencyName: '', // 选中的可用法币name
      availableCurrencyId: [], // 可用法币币种数组
      // 4.0 当前用户所有的支付方式数组
      // payForListArr: ['1', '1', '0', '1', '0'],
      payForListArr: [],
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
      // 市场价
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
    // 从全局获得商户id
    // console.log('从全局获得商户id')
    // console.log(this.partnerId)
    console.log('从广告管理传过来的URL中的订单id')
    console.log(this.$route.query.id)
    // if (this.userInfo.type == 'COMMON') {
    //   this.$router.push({path: '/OTCCenter'})
    // }
    // 1.0 otc可用币种查询：
    this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    this.getMerchantAvailablelegalTenderList()
    // 3.0 查询用户现有支付方式
    this.queryUserPayTypesList()
    // 请求挂单详情接口
    // 根据 从广告管理传过来的URL中的订单id 请求挂单详情数据 再塞到页面中
    if (this.$route.query.id && this.payForListArr) {
      this.getOTCSelectedOrdersDetails()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
    ]),
    //  输入限制
    formatInput (ref, pointLength) {
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
    },
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
        // 返回数据正确的逻辑
        // 选中交易类型赋值
        this.activitedBuySellStyle = data.data.data.entrustType
        // 选中法币id
        this.activitedCurrencyId = data.data.data.currencyId
        // 选中法币的name
        this.activeedCurrencyName = data.data.data.currencyName
        // 选中可用币种id
        this.activitedCoinId = data.data.data.partnerCoinId
        // 选中可用币种的name
        this.activeedCoinName = data.data.data.coinName
        // 查询用户交易币种手续费率以及币种详情
        this.queryUserTradeFeeAndCoinInfo()
        // 单价
        this.$refs.price.value = data.data.data.price
        // 交易数量
        this.$refs.entrustCount.value = data.data.data.matchCount
        // 最小交易量
        this.$refs.minCountValue.value = data.data.data.minCount
        // 最大交易量
        this.$refs.maxCountValue.value = data.data.data.maxCount
        // 同时处理最大订单数
        // this.$refs.limitOrderCount.value = data.data.data.totalAmount
        this.limitOrderCount = data.data.data.totalAmount
        // 用户成功交易次数
        // this.$refs.successOrderCount.value = data.data.data.tradeTimes
        // this.$refs.successOrderCount.value = data.data.data.tradeTimes
        this.successOrderCount = data.data.data.tradeTimes
        // 交易方式赋值
        this.payForListArr = data.data.data.payTypes
      }
    },
    // 1.0 改变发布广告 买卖 类型
    changeBuySellStyle (e) {
      this.activitedBuySellStyle = e
      console.log(this.activitedBuySellStyle)
    },
    //  2.0 otc可用币种查询：
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.partnerId
      })
      console.log('可用币种列表')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.availableCoinName = data.data.data
        // 刚进页面将第一个币种选中
        this.activitedCoinId = this.availableCoinName[0].partnerCoinId
        this.activeedCoinName = this.availableCoinName[0].name
        // 刚进页面根据可用币种id 查询用户交易币种手续费率以及币种详情
        this.queryUserTradeFeeAndCoinInfo()
      }
    },
    //  2.1 查询用户现有支付方式
    async queryUserPayTypesList () {
      const data = await queryUserPayTypes({
        // partnerId: this.partnerId
      })
      // console.log('用户现有支付方式')
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.payForListArr = data.data.data
        // console.log(this.payForListArr)
      }
    },
    // 3.0 改变可用币种id
    changeAvailableCoinId (e) {
      this.activitedCoinId = e
      console.log(e)
      console.log(this.activitedCoinId)
      this.availableCoinName.forEach(item => {
        if (e == item.partnerCoinId) {
          this.activeedCoinName = item.name
        }
      })
      console.log(this.activeedCoinName)
      // 根据可用币种id 查询用户交易币种手续费率以及币种详情
      this.queryUserTradeFeeAndCoinInfo()
    },
    // 3.01 根据可用币种id 查询用户交易币种手续费率以及币种详情
    async queryUserTradeFeeAndCoinInfo () {
      const data = await queryUserTradeFeeAndCoinInfo({
        partnerCoinId: this.activitedCoinId // 挂单id
      })
      console.log('用户交易币种手续费率以及币种详情')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑:将返回的数据赋值到页面中
        // 单笔最小限额（单位：选中法币） 0 - 不限制
        // this.$refs.minCountValue.value = data.data.data.minCount
        this.minCount = data.data.data.minCount
        this.$refs.minCountValue.value = this.minCount
        // 单笔最大限额（单位：选中法币） 0 - 不限制
        // this.$refs.maxCountValue.value = data.data.data.maxCount
        this.maxCount = data.data.data.maxCount
        this.$refs.maxCountValue.value = this.maxCount
        this.minPrice = data.data.data.minPrice // 最低价
        this.maxPrice = data.data.data.maxPrice // 最高价
        this.total = data.data.data.total // 最大可卖出量
        this.marketPrice = data.data.data.marketPrice // 市场价
        this.pointLength = data.data.data.unit // 每个币种返回的保留小数点位数限制
        // console.log(this.minPrice)
        // console.log(this.maxPrice)
      }
    },
    // 4.0 otc可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.partnerId
      })
      console.log('可用法币')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        this.availableCurrencyId = data.data.data
        // 刚进页面将第一个币种选中
        this.activitedCurrencyId = this.availableCurrencyId[0].id
        this.activeedCurrencyName = this.availableCurrencyId[0].shortName
      }
    },
    // 5.0 改变可用法币的币种id
    changeCurrencyId (e) {
      this.activitedCurrencyId = e
      console.log(e)
      console.log(this.activitedCurrencyId)
      this.availableCurrencyId.forEach(item => {
        if (e == item.id) {
          this.activeedCurrencyName = item.shortName
        }
      })
    },
    // 6.0 修改input value
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
          this.errorInfoPrice = '请输入' + this.minPrice + '~' + this.maxPrice + '之间的价格'
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
    // 校验单笔最小限额和最大限额
    changeMinCountInputValue (ref, pointLength) {
      this[ref] = this.$refs[ref].value
      // console.log(this[ref])
      // console.log(this.minCountValue)
      // console.log(this.$refs.minCountValue.value)
      let target = this.$refs[ref]
      formatNumberInput(target, pointLength)
      // 开始校验
      if (this.$refs.minCountValue.value < this.minCount) {
        this.errorInfoMinCount = '输入值不能小于最小限额'
        return false
      } else {
        this.errorInfoMinCount = ''
      }
      // console.log(typeof (this.$refs.maxCountValue.value)) // string
      if (this.$refs.minCountValue.value > this.$refs.maxCountValue.value - 0) {
        this.errorInfoMinCount = '输入值不能大于最大限额'
        return false
      } else {
        this.errorInfoMinCount = ''
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
        this.errorInfoMaxCount = '输入值不能大于最大限额'
        return false
      } else {
        this.errorInfoMaxCount = ''
      }
      // console.log(this.minCountValue)
      // console.log(typeof (this.$refs.minCountValue.value)) // string
      if (this.$refs.maxCountValue.value < this.$refs.minCountValue.value - 0) {
        this.errorInfoMaxCount = '输入值不能小于最小限额'
        return false
      } else {
        this.errorInfoMaxCount = ''
      }

      // if (!(this.maxCountValue > this.minCountValue && this.maxCountValue <= this.maxCount)) {
      //   this.errorInfoMaxCount = '输入有误max'
      //   return false
      // } else {
      //   this.errorInfoMaxCount = ''
      // }
    },
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
    // 8.0 改变支付方式
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
    // 9.0 清空input框数据
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
    // 7.0 点击发布广告弹出输入交易密码框
    showPasswordDialog () {
      // 非空及数据范围准确性验证
      // 单价
      if (!this.$refs.price.value) {
        this.errorInfoPrice = '请输入单价'
        return false
      } else if (this.$refs.price.value < this.minPrice || this.$refs.price.value > this.maxPrice) {
        this.errorInfoPrice = '请输入' + this.minPrice + '~' + this.maxPrice + '之间的价格'
        return false
      }
      // 交易方式
      if (!this.parameterPayTypes) {
        this.errorInfoTradeWay = '请选择交易方式'
        return false
      }
      // 交易数量
      // console.log(this.$refs.entrustCount.value)
      if (!this.$refs.entrustCount.value || this.$refs.entrustCount.value - 0 === 0) {
        this.errorInfoEntrustCount = '请输入交易数量'
        return false
      }
      // 单笔最小最大限制
      if (this.errorInfoMinCount) {
        return false
      }
      if (this.errorInfoMaxCount) {
        return false
      }
      // 限制设置--还未写记得写
      this.dialogVisible = true
    },
    // 10.0 点击密码框中的提交按提交钮发布广告
    async publishADSubmitButton () {
      if (!this.tradePassword) {
        this.errorInfoPassword = '请输入交易密码'
        return false
      }
      let param = {
        entrustType: this.activitedBuySellStyle, // 挂单类型(BUY SELL)
        partnerCoinId: this.activitedCoinId, // 挂单币种
        currencyId: this.activitedCurrencyId, // 法币Id
        // entrustCount: this.entrustCount, // 挂单数量
        entrustCount: this.$refs.entrustCount.value, // 挂单数量
        // price: this.price, // 单价
        price: this.$refs.price.value, // 单价
        minCount: this.minCount, // 单笔最小限额（单位：选中法币） 0 - 不限制
        maxCount: this.maxCount, // 单笔最大限额（单位：选中法币） 0 - 不限制
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
    // 11.0 交易密码框获得焦点
    tradePasswordFocus () {
      this.errorInfoPassword = ''
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId
      // userInfo: state => state.user.loginStep1Info.userInfo
    })
    // activitedBuySellStyle () {
    // }
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCPublishAD.scss);
.otc-publish-AD-box{
  background-color: #1D2331;
  >.otc-publish-AD-content{
    width: 1150px;
    margin: 70px auto;
    // background-color: #2B2B2B;
    display: flex;
    flex: 3;
    padding-top: 50px;
    >.publish-AD-left{
      flex: 2;
      // background-color: #1B2136;
      >.AD-title{
        height: 30px;
        line-height: 30px;
        color: #338FF5;
        border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      >.AD-big-form{
        width: 720px;
        .err{
          color: red;
        }
        >.common{
          box-sizing: border-box;
          padding: 30px 0;
          border-bottom: 1px solid #39424D;
          >.left{
            width: 110px;
            vertical-align: top;
            >.tips{
              color: #fff;
            }
            >.warning{
              color: #3E79D6;
            }
          }
          >.right{
            color: #9DA5B3;
            font-size: 14px;
          }
        }
        >.choice{
          // box-sizing: border-box;
          // padding-bottom: 30px;
          // border-bottom: 1px solid #39424D;
          >.left{
            // width: 110px;
            // vertical-align: middle;
            >.tips{
              // color: #fff;
            }
            >.warning{
              // color: #3E79D6;
            }
          }
          >.right{
            >.right-style{
              margin-right: 50px;
            }
            >.right-change{
              >.double-sided-arrow{
                /*transform:rotate(180deg);*/
                color: #797979;
                margin: 0 10px;
              }
            }
          }
        }
        >.sale-price{
          >.right{
            >.input{
              margin: 10px 0 5px 0;
              >.price-input{
                width: 234px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 36px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
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
              // display: inline-block;
              // width: 250px;
            }
            >.input-top{
              margin-top: 15px;
              margin-bottom: 5px;
              >.input-sum{
                width: 198px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
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
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
              >.input-max{
                margin-left: 40px;
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
              // cursor: pointer;
            }
            .input-limit{
              width: 258px;
              height: 36px;
              background-color: #333A41;
              padding-left: 10px;
              border-radius: 4px;
              margin: 15px 0 5px 0;
              color: #9DA5B3;
            }
          }
        }
        >.button{
          text-align: center;
          margin-top: 20px;
          >.AD-button{
            width: 590px;
            height: 44px;
            color: #FFFFFF;
            background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
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
          color: #338FF5;
        }
        >.tip{
          color: #9DA5B3;
          // line-height: 1.5rem;
          line-height: 20px;
        }
      }
    }
  }
}
</style>
