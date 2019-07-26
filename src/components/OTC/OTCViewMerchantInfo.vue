<!--
  author: renfuwei
  create: 20190723
  description: 当前页面为 商家信息 组件
-->
<template>
  <div
    class="merchant-info-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--1 左侧信息-->
      <div class="left-info">
        <!--1.1 头像-->
        <div class="one-avatar">
          <div class="names-box">
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-yonghu1"
            />
            <span class="merchant-name font-size16">
              {{merchantUserInfo.personNickName}}
            </span>
          </div>
          <div class="time-box">
            <!--注册时间-->
            <p class="bar font-size12">
              {{$t('M.focus_black_time1')}}：{{merchantUserInfo.registerTime}}
            </p>
            <!--最近登录时间-->
            <p class="bar font-size12">
              {{$t('M.focus_black_time2')}}：{{merchantUserInfo.recentlyLoginTime}}
            </p>
          </div>
        </div>
        <!--1.2 认证-->
        <div class="two-identity">
          <!--邮箱认证-->
          <div
            class="first-item items"
            :class="{unverified: merchantUserInfo.mailAuth !== 'enable'}"
          >
            <span>{{$t('M.focus_black_identity1')}}</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <!--手机认证-->
          <div
            class="second-item items"
            :class="{unverified: merchantUserInfo.phoneAuth !== 'enable'}"
          >
            <span>{{$t('M.focus_black_identity2')}}</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <!--实名认证-->
          <div
            class="third-item items"
            :class="{unverified: merchantUserInfo.realNameAuth !== 'y'}"
          >
            <span>{{$t('M.user_real_name')}}</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <!--高级认证-->
          <div
            class="fourth-item items"
            :class="{unverified: merchantUserInfo.advancedAuth !== 'pass'}"
          >
            <span>{{$t('M.user_senior_certification')}}</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <!--商家认证-->
          <div
            class="fifth-item items"
            :class="{unverified: merchantUserInfo.merchantAuth !== 'PASS'}"
          >
            <span>{{$t('M.focus_black_identity3')}}</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
        </div>
        <!--1.3 交易信息-->
        <div class="trade-infos">
          <div class="first-bar bars">
            <!--商家保证金-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info1')}}</div>
            <div class="bar-bottom">
              {{merchantUserInfo.cashDeposit}}{{merchantUserInfo.cashDepositName}}
            </div>
          </div>
          <div class="second-bar bars">
            <!--交易总单数-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info2')}}</div>
            <div class="bar-bottom">{{merchantUserInfo.totalOrders}}</div>
          </div>
          <div class="third-bar bars">
            <!--30日成交单-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info3')}}</div>
            <div class="bar-bottom">{{merchantUserInfo.successOrders}}</div>
          </div>
          <div class="fourth-bar bars">
            <!--30日成交率-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info4')}}</div>
            <div class="bar-bottom">{{merchantUserInfo.successRate}}%</div>
          </div>
          <div class="fifth-bar bars">
            <!--30日冻结次数-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info5')}}</div>
            <div class="bar-bottom">{{merchantUserInfo.freezeTimes}}</div>
          </div>
          <div class="sixth-bar bars">
            <!--平均放行-->
            <div class="bar-top">{{$t('M.focus_black_merchant_info6')}}</div>
            <div class="bar-bottom">
              {{BIHTimeFormatting(merchantUserInfo.avgConfirmTime)}}
            </div>
          </div>
        </div>
        <!--1.4 按钮组-->
        <div
          class="four-button"
          v-if="!(userId === this.userInfo.id)"
        >
          <div
            class="button-group"
            v-if="merchantUserInfo.relationType == '1'"
          >
            <div class="focus-button-box">
              <button
                class="button"
                @click="cancelFocusBlackOpposite('1')"
              >
                <!--取消关注-->
                {{$t('M.focus_black_title3')}}
              </button>
            </div>
            <div class="black-button-box">
              <button
                class="button"
                @click="dialogVisible = true"
              >
                <!--拉黑-->
                {{$t('M.focus_black_title2')}}
              </button>
            </div>
          </div>
          <div
            class="button-group"
            v-else-if="merchantUserInfo.relationType == '2'"
          >
            <div class="focus-button-box">
              <button
                class="button"
                @click="focusBlackOpposite('1')"
              >
                <!--关注-->
                {{$t('M.focus_black_title1')}}
              </button>
            </div>
            <div class="black-button-box">
              <button
                class="button"
                @click="cancelFocusBlackOpposite('2')"
              >
                <!--解除-->
                {{$t('M.focus_black_title4')}}
              </button>
            </div>
          </div>
          <div class="button-group" v-else>
            <div class="focus-button-box">
              <button
                class="button"
                @click="focusBlackOpposite('1')"
              >
                <!--关注-->
                {{$t('M.focus_black_title1')}}
              </button>
            </div>
            <div class="black-button-box">
              <button
                class="button"
                @click="dialogVisible = true"
              >
                <!--拉黑-->
                {{$t('M.focus_black_title2')}}
              </button>
            </div>
          </div>
        </div>
      </div>
      <!--2 右侧列表-->
      <div class="right-lists">
        <!--购买列表-->
        <div class="buy-list buy-sell-list">
          <div class="header-title buy-title">
            <!--购买广告-->
            {{$t('M.focus_black_buy_sell_title1')}}
          </div>
          <div class="body-content">
            <el-table
              :data="buyTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 币种 -->
              <el-table-column
                :label="$t('M.comm_currency')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.coinName}}/{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <div class="buy-price">
                    {{s.row.price}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.remainCount}}{{s.row.coinName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.minCount}}-{{s.row.maxCount}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!-- 5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="right"
              >
                <template slot-scope="s">
                  <!--购买按钮-->
                  <div>
                    <el-button
                      class="sell-buy-button buy-button border-radius2 cursor-pointer"
                      :disabled="s.row.otcEnable=='disable'"
                      @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country, 'onlineBuy')"
                    >
                      {{$t('M.comm_buying')}}
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--出售列表-->
        <div class="sell-list buy-sell-list">
          <div class="header-title sell-title">
            <!--出售广告-->
            {{$t('M.focus_black_buy_sell_title2')}}
          </div>
          <div class="body-content">
            <el-table
              :data="sellTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 币种 -->
              <el-table-column
                :label="$t('M.comm_currency')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.coinName}}/{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <div class="sell-price">
                    {{s.row.price}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.remainCount}}{{s.row.coinName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.minCount}}-{{s.row.maxCount}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!-- 5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="right"
              >
                <template slot-scope="s">
                  <!--出售按钮-->
                  <div>
                    <el-button
                      class="sell-buy-button sell-button border-radius2 cursor-pointer"
                      :disabled="s.row.otcEnable=='disable'"
                      @click="toOnlineBuyOrSell(s.row.id,s.row.coinId,s.row.userId,s.row.country, 'onlineSell')"
                    >
                      {{$t('M.comm_offering')}}
                    </el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <!--3 拉黑弹窗-->
      <div class="black-list-dialog">
        <el-dialog
          :title="$t('M.otc_prompt')"
          :visible.sync="dialogVisible"
          top="25vh"
        >
          <div class="content">
            <!--拉黑后该用户将无法访问您的广告信息或与您交易，您确定要拉黑吗？-->
            {{$t('M.focus_black_title6')}}
          </div>
          <span slot="footer">
            <div class="button-group">
              <button
                class="cancel item"
                @click="dialogVisible = false"
              >
                {{$t('M.comm_cancel')}}
              </button>
              <button
                class="confirm item"
                @click="focusBlackOpposite('2')"
              >
                {{$t('M.comm_confirm')}}
              </button>
            </div>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import {
  getMerchantInfoAJAX, // 获得商家信息
  addFocusBlackListAJAX, // 关注/拉黑
  cancelFocusAJAX, // 取消关注/解除
  getUserIsBlackingAJAX // 判断此用户是否被当前用户正处于拉黑中状态
} from '../../utils/api/focusBlack'
import IconFontCommon from '../../components/Common/IconFontCommon'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  formatSeconds
} from '../../utils'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 拉黑弹窗显示状态
      dialogVisible: false,
      // 购买列表
      buyTableList: [],
      // 出售列表
      sellTableList: [],
      // 用户id
      userId: '',
      // 币种id
      coinId: '',
      // 法币id
      currencyId: '',
      // 左侧个人信息
      merchantUserInfo: {
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
        // 关注与拉黑的状态
        relationType: ''
      },
      // 判断此用户是否被当前用户正处于拉黑中状态
      userIsBlackingStatus: ''
    }
  },
  created () {
    this.getURLParamsData()
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapActions([
      'REFRESH_USER_INFO_ACTION'
    ]),
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME',
      'CHANGE_BLACK_TABS_STATUS_M'
    ]),
    // 0 国际标准格式(09ˋ40′32″)
    BIHTimeFormatting (date) {
      return formatSeconds(date, 'OTC')
    },
    // 1 获得URL中参数信息
    getURLParamsData () {
      // console.log(this.$route.query)
      if (this.$route.query.coinId) {
        this.coinId = this.$route.query.coinId
      }
      if (this.$route.query.currencyId) {
        this.currencyId = this.$route.query.currencyId
      }
      if (this.$route.query.userId) {
        this.userId = this.$route.query.userId
        this.getUserIsBlacking()
      }
    },
    // 2 判断此用户是否被当前用户正处于拉黑中状态
    async getUserIsBlacking () {
      let param = {
        toId: this.userId
      }
      const data = await getUserIsBlackingAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // relation：1：关注；2：拉黑
      this.userIsBlackingStatus = getNestedData(data, 'data.relation')
      if (this.userIsBlackingStatus === '2') {
        this.$goToPage(`/${this.$routes_X.OTCCenter}`)
        return false
      }
      this.getMerchantInfo()
    },
    // 3 查看商家信息页面数据
    async getMerchantInfo () {
      let param = {
        userId: this.userId,
        coinId: this.coinId,
        currencyId: this.currencyId
      }
      const data = await getMerchantInfoAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      this.buyTableList = getNestedData(data, 'data.sellOtcEntrust')
      console.log(this.buyTableList)
      this.sellTableList = getNestedData(data, 'data.buyOtcEntrust')
      console.log(this.sellTableList)
      // 个人信息赋值
      this.merchantUserInfo.cashDeposit = getNestedData(data, 'data.userInfo.guaranteeCount')
      this.merchantUserInfo.cashDepositName = getNestedData(data, 'data.userInfo.guaranteeCoinName')
      this.merchantUserInfo.totalOrders = getNestedData(data, 'data.userInfo.tradeTimes')
      this.merchantUserInfo.successOrders = getNestedData(data, 'data.userInfo.successOrderTimes')
      this.merchantUserInfo.successRate = getNestedData(data, 'data.userInfo.completeRate')
      this.merchantUserInfo.freezeTimes = getNestedData(data, 'data.userInfo.freezeTimes')
      this.merchantUserInfo.avgConfirmTime = getNestedData(data, 'data.userInfo.avgGiveOutTime')
      this.merchantUserInfo.registerTime = getNestedData(data, 'data.userInfo.regTime')
      this.merchantUserInfo.recentlyLoginTime = getNestedData(data, 'data.userInfo.lastLoginTime')
      this.merchantUserInfo.personNickName = getNestedData(data, 'data.userInfo.nickName')
      this.merchantUserInfo.mailAuth = getNestedData(data, 'data.userInfo.mailAuth')
      this.merchantUserInfo.phoneAuth = getNestedData(data, 'data.userInfo.phoneAuth')
      this.merchantUserInfo.merchantAuth = getNestedData(data, 'data.userInfo.merchantAuth')
      this.merchantUserInfo.advancedAuth = getNestedData(data, 'data.userInfo.advancedAuth')
      this.merchantUserInfo.realNameAuth = getNestedData(data, 'data.userInfo.realNameAuth')
      this.merchantUserInfo.relationType = getNestedData(data, 'data.userInfo.relationType')
    },
    // 4 关注/拉黑
    async focusBlackOpposite (type) {
      let param = {
        toId: this.userId,
        relation: type
      }
      const data = await addFocusBlackListAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      if (type === '2') {
        // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
        this.CHANGE_BLACK_TABS_STATUS_M(true)
        // 跳转到个人中心关注/拉黑第二个选项卡我的黑名单
        this.$goToPage('/PersonalCenter')
        this.CHANGE_USER_CENTER_ACTIVE_NAME('focus-blacklist')
      }
      // 重新刷新列表
      this.getMerchantInfo()
    },
    // 5 取消关注/解除
    async cancelFocusBlackOpposite (type) {
      let param = {
        toId: this.userId,
        relation: type
      }
      const data = await cancelFocusAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      this.getMerchantInfo()
    },
    // 6.购买出售限制
    async toOnlineBuyOrSell (id, coinId, userId, countryCode, entrustType) {
      const CHINA = ['853', '852', '886', '86']
      if (!this.isLogin) {
        this.$goToPage(`/${this.$routes_X.login}`)
      } else {
        // 刷新用户信息
        await this.REFRESH_USER_INFO_ACTION()
        // console.log(countryCode, userId, this.userInfo)
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
            // entrustType 挂单类型
            // id - 挂单id
            // coinId - 币种id
            this.$goToPage(`/OTCOnlineTraderBuySell/${entrustType}/${id}/${coinId}`)
          }
        }
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 用户登录状态 false 未登录； true 登录
      isLogin: state => state.user.isLogin,
      // 用户详细信息
      userInfo: state => state.user.loginStep1Info.userInfo
    })
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .merchant-info-box {
    width: 1300px;
    padding-top: 70px;
    margin: 60px auto 200px;

    > .inner-box {
      display: flex;
      justify-content: space-between;

      > .left-info {
        width: 300px;
        min-height: 927px;

        > .one-avatar {
          box-sizing: border-box;
          height: 150px;
          padding: 25px 0 0 30px;

          > .names-box {
            height: 40px;
            margin-bottom: 20px;
            line-height: 40px;

            .icon {
              margin-right: 20px;
            }
          }

          > .time-box {
            > .bar {
              line-height: 20px;
            }
          }
        }

        > .two-identity {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          height: 180px;
          padding: 30px 30px 0;

          .icon {
            width: 24px;
            height: 24px;
          }

          > .items {
            width: 49%;
            font-size: 12px;
          }

          > .second-item,
          .fourth-item {
            text-align: right;
          }

          &::after {
            position: absolute;
            bottom: 0;
            right: 30px;
            width: 240px;
            height: 1px;
            content: '';
          }
        }

        > .trade-infos {
          display: flex;
          flex-wrap: wrap;
          padding: 30px 10px 0;

          > .bars {
            width: 49%;

            > .bar-top {
              margin-bottom: 6px;
              font-size: 12px;
              text-align: center;
            }

            > .bar-bottom {
              font-size: 14px;
              text-align: center;
            }
          }

          > .first-bar,
          .second-bar,
          .third-bar,
          .fourth-bar {
            margin-bottom: 30px;
          }
        }

        > .four-button {
          > .button-group {
            display: flex;
            justify-content: space-between;
            padding: 80px 30px 0;

            > .focus-button-box {
              width: 50%;
            }

            > .black-button-box {
              width: 50%;
              text-align: right;
            }

            .button {
              height: 30px;
              padding: 5px 25px;
              border-radius: 2px;
              font-size: 12px;
              cursor: pointer;
            }
          }
        }
      }

      > .right-lists {
        width: 985px;

        > .buy-sell-list {
          > .header-title {
            height: 58px;
            padding-left: 20px;
            font-weight: 700;
            font-size: 18px;
            line-height: 58px;
          }

          > .body-content {
            .buy-price {
              color: $upColor;
            }

            .sell-price {
              color: $otcGreen;
            }

            .xilian {
              vertical-align: middle;
            }
          }
        }

        > .buy-list {
          min-height: 440px;
          margin-bottom: 18px;

          > .buy-title {
            color: $upColor;
          }
        }

        > .sell-list {
          min-height: 469px;

          > .sell-title {
            color: $otcGreen;
          }
        }
      }
    }

    /deep/ {
      .inner-box {
        > .right-lists {
          > .buy-sell-list {
            > .body-content {
              .el-table {
                font-size: 12px;

                .el-table__header {
                  thead {
                    tr {
                      th {
                        padding: 14px 0;

                        &:first-child {
                          .cell {
                            padding-left: 20px;
                          }
                        }

                        &:nth-last-child(2) {
                          .cell {
                            padding-right: 20px;
                          }
                        }
                      }
                    }
                  }
                }

                .el-table__body {
                  tr {
                    td {
                      padding: 18px 0;

                      &:first-child {
                        .cell {
                          padding-left: 20px;
                        }
                      }

                      &:last-child {
                        .cell {
                          padding-right: 20px;
                        }
                      }
                    }
                  }

                  .sell-buy-button {
                    height: 24px;
                    padding: 0 10px;
                    border: 0;
                    line-height: 24px;
                    color: $mainColorOfWhite;
                  }

                  .buy-button {
                    background-color: $upColor;
                  }

                  .buy-button.is-disabled {
                    background-color: #e4b1a7;
                  }

                  .sell-button {
                    background-color: $otcGreen;
                  }

                  .sell-button.is-disabled {
                    background-color: #8ead9e;
                  }
                }

                .el-table__empty-text {
                  line-height: 350px !important;
                }
              }
            }
          }
        }

        > .black-list-dialog {
          .el-dialog__wrapper {
            background-color: rgba(0, 0, 0, .7);

            .el-dialog {
              width: 350px;
              height: 180px;
              border-radius: 4px;

              .el-dialog__header {
                padding: 6px 18px;
                border-radius: 4px 4px 0 0;

                .el-dialog__title {
                  font-size: 14px;
                }

                .el-dialog__headerbtn {
                  top: 10px;
                  right: 10px;
                }
              }

              .el-dialog__body {
                height: 84px;
                padding: 30px 18px;
                font-size: 12px;
              }

              .el-dialog__footer {
                padding: 0 18px;

                .button-group {
                  .item {
                    height: 30px;
                    padding: 0 28px;
                    border-radius: 2px;
                    font-size: 12px;
                    line-height: 30px;
                    cursor: pointer;
                  }

                  .confirm {
                    margin-left: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.night {
      .inner-box {
        > .left-info {
          background-color: $mainContentNightBgColor;
          box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

          > .one-avatar {
            border-bottom: 1px solid $dialogColor10;

            > .names-box {
              > .merchant-name {
                color: $mainColorOfWhite;
              }
            }

            > .time-box {
              color: $dialogColor9;
            }
          }

          > .two-identity {
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

            &::after {
              border-bottom: 1px dashed $dialogColor10;
            }
          }

          > .trade-infos {
            > .bars {
              > .bar-top {
                color: $dialogColor9;
              }

              > .bar-bottom {
                color: $mainColorOfWhite;
              }
            }
          }

          > .four-button {
            > .button-group {
              > .focus-button-box {
                > .button {
                  color: $mainColorOfWhite;
                  background-color: $mainColor;
                }
              }

              > .black-button-box {
                > .button {
                  border: 1px solid $mainColor;
                  color: $mainColor;
                  background-color: $mainContentNightBgColor;
                }
              }
            }
          }
        }

        > .right-lists {
          .buy-sell-list {
            background-color: $mainContentNightBgColor;
            box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

            > .header-title {
              border-bottom: 1px solid $dialogColor10;
            }
          }
        }
      }

      /deep/ {
        .inner-box {
          > .right-lists {
            > .buy-sell-list {
              > .body-content {
                .el-table {
                  color: $mainColorOfWhite;
                  background-color: $mainContentNightBgColor;

                  .el-table__header {
                    thead {
                      color: $mainNightTitleColor;

                      tr {
                        th {
                          background-color: $mainContentNightBgColor;

                          &.is-leaf {
                            border-bottom: 1px solid $dialogColor10;
                          }
                        }
                      }
                    }
                  }

                  .el-table__body {
                    tr {
                      background-color: $mainContentNightBgColor;

                      td {
                        border-bottom: 0 solid transparent;
                      }

                      &:hover {
                        td {
                          background-color: #181b2b;
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          > .black-list-dialog {
            .el-dialog__wrapper {
              .el-dialog {
                background-color: $dialogColor1;

                .el-dialog__header {
                  background-color: $dialogColor2;

                  .el-dialog__title {
                    color: $dialogColor4;
                  }
                }

                .el-dialog__body {
                  color: $dialogColor5;
                }

                .el-dialog__footer {
                  .button-group {
                    .cancel {
                      border: 1px solid $mainColor;
                      color: $mainColorOfWhite;
                      background-color: $dialogColor1;
                    }

                    .confirm {
                      color: $mainColorOfWhite;
                      background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      .inner-box {
        > .left-info {
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px #cfd5df;

          > .one-avatar {
            border-bottom: 1px solid rgba(97, 116, 153, .2);

            > .names-box {
              > .merchant-name {
                color: $dayMainTitleColor;
              }
            }

            > .time-box {
              color: $dialogColor9;
            }
          }

          > .two-identity {
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

            &::after {
              border-bottom: 1px dashed rgba(97, 116, 153, .2);
            }
          }

          > .trade-infos {
            > .bars {
              > .bar-top {
                color: $dialogColor9;
              }

              > .bar-bottom {
                color: $dayMainTitleColor;
              }
            }
          }

          > .four-button {
            > .button-group {
              > .focus-button-box {
                > .button {
                  color: $mainColorOfWhite;
                  background-color: $mainColor;
                }
              }

              > .black-button-box {
                > .button {
                  border: 1px solid $mainColor;
                  color: $mainColor;
                  background-color: $mainColorOfWhite;
                }
              }
            }
          }
        }

        > .right-lists {
          .buy-sell-list {
            background-color: $mainColorOfWhite;
            box-shadow: 0 0 6px #cfd5df;

            > .header-title {
              border-bottom: 1px solid rgba(97, 116, 153, .2);
            }
          }
        }
      }

      /deep/ {
        .inner-box {
          > .right-lists {
            > .buy-sell-list {
              > .body-content {
                .el-table {
                  color: $dayMainTitleColor;
                  background-color: $mainColorOfWhite;

                  .el-table__header {
                    thead {
                      color: $fontColorSecondaryOfDay;

                      tr {
                        th {
                          background-color: $mainColorOfWhite;

                          &.is-leaf {
                            border-bottom: 1px solid rgba(97, 116, 153, .2);
                          }
                        }
                      }
                    }
                  }

                  .el-table__body {
                    tr {
                      background-color: $mainColorOfWhite;

                      td {
                        border-bottom: 0 solid transparent;
                      }

                      &:hover {
                        td {
                          background-color: rgba(97, 116, 153, .05);
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          > .black-list-dialog {
            .el-dialog__wrapper {
              .el-dialog {
                background-color: $mainColorOfWhite;

                .el-dialog__header {
                  background-color: $dialogColor7;

                  .el-dialog__title {
                    color: $dayMainTitleColor;
                  }
                }

                .el-dialog__body {
                  color: $dayMainTitleColor;
                }

                .el-dialog__footer {
                  .button-group {
                    .cancel {
                      border: 1px solid $mainColor;
                      color: $mainColor;
                      background-color: $mainColorOfWhite;
                    }

                    .confirm {
                      color: $mainColorOfWhite;
                      background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                    }
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
