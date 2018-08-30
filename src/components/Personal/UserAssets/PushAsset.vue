<template>
  <div
    class="push-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="push-assets-main">
      <div class="push-assets-content">
        <header class="push-header personal-height40 line-height40">
          <span class="push-header-title display-inline-block padding-left23 font-size16 font-weight600">
            PUSH资产
          </span>
        </header>
      </div>
      <div class="push-assets-content-box padding-left15 margin-top9">
        <div class="push-from-box">
          <el-form label-width="120px">
            <el-form-item label="资产">
              <el-select
                v-model="currencyValue"
                @change="changeId"
              >
                <el-option
                  v-for="item in currencyList"
                  :key="item.coinId"
                  :label="item.shortName"
                  :value="item.coinId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="余额">
              <input
                disabled
                class="form-input-common-state border-radius2 padding-l15"
                v-model="balance"
              />
            </el-form-item>
            <el-form-item label="买方UID">
              <input
                class="form-input-common border-radius2 padding-l15"
                @focus="emptyStatus"
                ref="buyUID"
                @keyup="changeInputValue('buyUID')"
              />
            </el-form-item>
            <el-form-item label="数量">
              <input
                class="form-input-common border-radius2 padding-l15"
                @focus="emptyStatus"
                ref="count"
                @keyup="changeInputValue('count')"
              />
            </el-form-item>
            <el-form-item label="价格">
              <input
                class="form-input-common border-radius2 padding-l15"
                @focus="emptyStatus"
                ref="price"
                @keyup="changeInputValue('price')"
              />
            </el-form-item>
            <el-form-item label="交易密码">
              <input
                type="password"
                class="form-input-common border-radius2 padding-l15"
                @focus="emptyStatus"
                ref="transactionPassword"
                @keyup="changeInputValue('transactionPassword')"
              />
            </el-form-item>
            <el-form-item label="手机验证码">
              <el-input
                @focus="emptyStatus"
                v-model="phoneCode"
              >
                <template slot="append">
                  <CountDownButton
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                  /></template>
              </el-input>
            </el-form-item>
            <el-form-item label="邮箱验证码">
              <el-input
                @focus="emptyStatus"
                v-model="emailCode"
              >
                <template slot="append">验证码</template>
                <CountDownButton
                  class="send-code-btn cursor-pointer"
                  :status="disabledOfEmailBtn"
                  @run="sendPhoneOrEmailCode(1)"
                />
              </el-input>
            </el-form-item>
            <el-form-item label="谷歌验证码">
              <input
                type="password"
                class="form-input-common border-radius2 padding-l15"
                @focus="emptyStatus"
                v-model="googleCode"
              />
            </el-form-item>
            <div v-show="errorMsg">{{ errorMsg }}</div>
            <button
              class="form-button-common border-radius4"
              @click="getStatusSubmit"
            >
              提交
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="push-assets-main margin-top9">
      <!--<div class="push-assets-content padding-left15">-->
        <!--push资产-->
      <!--</div>-->
      <div class="award-record margin-top9 padding-top0">
        <header class="award-record-header line-height56">
          <span class="font-size16 header-color">PUSH记录</span>
        </header>
        <div class="award-record-content">
          <el-table
            :data="pushRecordList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column
              label="类型"
            >
              <template slot-scope = "s">
                <!--<div>{{ s.row.type }}</div>-->
                <!--v-if="s.row.fuid !== $store.state.userInfo.fshowid"-->
                <!--v-else-->
                <div>{{ rollIn }}</div>
                <!--<div>{{ $t(rollOut) }}</div>-->
              </template>
            </el-table-column>
            <el-table-column
              label="对方UID"
            >
              <template slot-scope = "s">
                <div>{{ s.row.pushId }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="资产"
            >
              <template slot-scope = "s">
                <div>{{ s.row.coinName }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="数量"
            >
              <template slot-scope = "s">
                <div>{{ s.row.count }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="价格(FBT)"
            >
              <template slot-scope = "s">
                <div>{{ s.row.price }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="金额"
            >
              <template slot-scope = "s">
                <div>{{ s.row.amount }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="时间"
              width="180px"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.createTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
            >
              <template slot-scope = "s">
                <div v-if="s.row.state === 'PUSH_DEAL'">{{ stateOffStocks }}</div>
                <div v-if="s.row.state === 'PUSH_REGISTER'">{{ stateWaitPayment }}</div>
                <div v-if="s.row.state === 'PUSH_CANCEL'">{{ stateCancel }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope = "s">
                <!--<div>{{ s.row.operate }}</div>-->
                <!--v-if="s.row.state == 1 && s.row.fuid == s.row.showid"-->
                <!--v-if="s.row.state == 1 && s.row.fuid !== s.row.showid"-->
                <!--<div-->
                  <!--v-if="s.row.state == 'PUSH_REGISTER' && showStatusUserInfo.uid == s.row.pushId"-->
                  <!--class="cursor-pointer state-status"-->
                  <!--@click="cancelId(s.row.id)"-->
                  <!--:id="s.row.id"-->
                <!--&gt;-->
                  <!--{{ cancel }}-->
                <!--</div>-->
                <!--<div-->
                  <!--v-if="s.row.state == 'PUSH_REGISTER' && showStatusUserInfo.uid !== s.row.pushId"-->
                  <!--class="cursor state-status"-->
                  <!--@click="paymentId(s.row.id)"-->
                  <!--:id="s.row.id"-->
                <!--&gt;-->
                  <!--{{ payment }}-->
                <!--</div>-->
              </template>
            </el-table-column>
          </el-table>
          <!-- 取消push -->
          <!--温馨提示-->
          <el-dialog :title="取消push" :visible.sync="dialogVisible" width="300px" center>
            <span class="info">确定取消PUSH资产吗？</span>
            <span slot="footer" class="dialog-footer">
               <!--确 定 取 消-->
                <el-button type="primary" @click="confirm"
                           class="mg1" :disabled="statel">
                  确 定
                </el-button>
                <el-button @click="dialogVisible = false">
                  取 消
                </el-button>
            </span>
          </el-dialog>
          <!--PUSH确认-->
          <el-dialog
            title="付款"
            :visible.sync="paymentVisible"
            center
          >
            <el-form
              :label-position="labelPosition"
              class="form_padding"
              label-width="100px"
            >
              <!--PUSH资产-->
              <el-form-item label="资产">
                <input
                  class="form-input-common border-radius2 padding-l15 box-sizing"
                  type="text"
                  v-model="pushAsset"
                  disabled
                >
              </el-form-item>
              <!--PUSH价格-->
              <el-form-item label="价格">
                <input
                  class="form-input-common border-radius2 padding-l15 box-sizing"
                  type="text"
                  v-model="pushPrice"
                  disabled
                >
              </el-form-item>
              <!--PUSH数量-->
              <el-form-item label="数量">
                <input
                  class="form-input-common border-radius2 padding-l15 box-sizing"
                  type="text"
                  v-model="pushCount"
                  disabled
                >
              </el-form-item>
              <!--付款金额-->
              <el-form-item label="付款金额">
                <input
                  class="form-input-common border-radius2 padding-l15 box-sizing"
                  type="text"
                  v-model="pushPaymentAmount"
                  disabled
                >
              </el-form-item>
            </el-form>
            <el-button @click="paymentVisible = false">取 消</el-button>
            <el-button type="primary" @click="statusUserInfo">确 定</el-button>
          </el-dialog>
          <el-dialog
            title="收货地址"
            :visible.sync="passwordVisible">
            <el-form>
              <el-form-item label="交易密码">
                <input
                  class="form-input-common border-radius2 padding-l15 box-sizing"
                  v-model="pushPassword"
                  auto-complete="off"
                >
              </el-form-item>
            </el-form>
            <div
              slot="footer"
              class="dialog-footer"
            >
              <el-button @click="passwordVisible = false">取 消</el-button>
              <el-button
                type="primary"
                @click="confirmSubmit"
              >
                确 定
              </el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getPushAssetList, getPushTotalByCoinId, pushAssetsSubmit, revocationPushProperty, pushPropertyTransaction} from '../../../utils/api/apiDoc'
import CountDownButton from '../../Common/CountDownCommon'
import {timeFilter} from '../../../utils/index'
import {createNamespacedHelpers, mapState} from 'vuex'
import {returnAjaxMessage, pushSendPhoneOrEmailCodeAjax} from '../../../utils/commonFunc'
const {mapMutations} = createNamespacedHelpers('personal')
export default {
  components: {
    CountDownButton // 短信倒计时
  },
  // props,
  data () {
    return {
      errorMsg: '', // 错误信息提示
      showStatusUserInfo: {}, // 个人信息
      // 币种
      currencyValue: '',
      currencyList: [],
      // push资产form
      balance: '', // 余额
      buyUID: '', // 买方UID
      count: '', // 数量
      price: '', // 价格
      transactionPassword: '', // 交易密码
      sum: '', // 金额
      phoneCode: '', // 手机验证码
      emailCode: '', // 邮箱验证码
      googleCode: '', // 谷歌验证
      rollIn: '转入', // 转入
      rollOut: '转出', // 转出
      stateOffStocks: '已完成',
      stateWaitPayment: '待支付',
      stateCancel: '已取消',
      payment: '付款', // 付款
      cancel: '撤销', // 取消
      pushAsset: '', // PUSH资产信息展示
      pushPrice: '', // PUSH价格信息展示
      pushCount: '', // PUSH数量信息展示
      pushPaymentAmount: '', // 付款金额信息展示
      dialogVisible: false, // 取消弹窗默认隐藏
      // labelPosition: 'top', // form表单
      paymentVisible: false, // 付款二次确认弹窗默认隐藏
      passwordVisible: false, // 付款二次确认之后交易密码弹窗默认隐藏
      pushUID: '', // 每行数据ID
      pushPassword: '',
      // push列表记录
      pushRecordList: []
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/PushAsset.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/PushAssetDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/PushAssetNight.css')
    // 获取全局个人信息
    // console.log(this.userInfo)
    this.showStatusUserInfo = this.userInfo.data.user
    this.getPushRecordList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_PUSH_BUTTON_STATUS'
    ]),
    // 1.时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 2.清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 3.修改input value
    changeInputValue (ref) {
      this[ref] = this.$refs[ref].value
    },
    /**
     * push资产
     */
    /**
     * 刚进页面时候 push列表展示
     */
    async getPushRecordList () {
      let data = await getPushAssetList({
        partnerId: this.merchantID // 商户id
      })
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回push记录数据
        this.pushRecordList = data.data.data.userPushVOPageInfo.list
        // 返回push币种信息列表
        this.currencyValue = data.data.data.coinLists[0].shortName
        this.currencyValue = data.data.data.coinLists[0].coinId
        // 刷新列表默认币种
        this.balance = data.data.data.total
        this.currencyList = data.data.data.coinLists
        // console.log(this.currencyList)
        // console.log(this.balance)
        // 金额
        this.sum = data.data.data.pushPayCoinName
        console.log(this.sum)
      }
    },
    // 资产币种下拉
    changeId (e) {
      this.currencyList.forEach(item => {
        if (e === item.id) {
          this.toggleAssetsCurrencyId(e)
        }
      })
    },
    // 4.选择push资产币种
    async toggleAssetsCurrencyId (val) {
      let data
      let param = {
        coinId: val // 币种coinId
      }
      data = await getPushTotalByCoinId(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 点击资产币种下拉
        this.balance = data.data.data.total
      }
    },
    /**
     * 发送短信验证码或邮箱验证码
     */
    sendPhoneOrEmailCode (loginType) {
      console.log(this.disabledOfPhoneBtn)
      console.log(this.disabledOfEmailBtn)
      if (this.disabledOfPhoneBtn || this.disabledOfEmailBtn) {
        return false
      }
      let params = {
        country: this.activeCountryCode
      }
      pushSendPhoneOrEmailCodeAjax(loginType, params, (data) => {
        console.log(this.disabledOfPhoneBtn)
        // 提示信息
        if (!returnAjaxMessage(data, this)) {
          console.log('error')
          return false
        } else {
          switch (loginType) {
            case 0:
              this.$store.commit('push/SET_PUSH_BUTTON_STATUS', {
                loginType: 0,
                status: true
              })
              break
            case 1:
              this.$store.commit('push/SET_PUSH_BUTTON_STATUS', {
                loginType: 1,
                status: true
              })
              break
          }
        }
      })
    },
    /**
     * 5.提交push
     */
    getStatusSubmit () {
      this.stateSubmitPushAssets()
    },
    // 提交push资产
    async stateSubmitPushAssets () {
      let data
      let param = {
        coinId: this.currencyValue, // 币种id
        uid: this.buyUID, // 买方id
        count: this.count, // push数量
        price: this.price, // push价格
        password: this.transactionPassword, // 交易密码
        code: this.phoneCode // 短信验证码
      }
      data = await pushAssetsSubmit(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.getPushRecordList()
      }
    },
    /**
     * 取消push
     */
    // 点击获取当前取消push id
    cancelId (id) {
      console.log(id)
      this.dialogVisible = true
      this.pushUID = id
      this.pushRecordList.forEach((fid, item) => {
        if (item.id == id) {
          this.pushRecordList = item
        }
      })
    },
    // 确定撤销
    confirm () {
      this.stateRevocationInformation()
    },
    async stateRevocationInformation () {
      let data
      let param = {
        id: this.pushUID // 列表id
      }
      data = await revocationPushProperty(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        console.log(data)
      }
    },
    /**
     * 付款成交
     */
    // 点击获取当前付款id
    paymentId (id) {
      console.log(id)
      this.paymentVisible = true
      this.pushUID = id
      console.log(this.pushRecordList)
      this.pushRecordList.forEach((item) => {
        if (item.id == id) {
          // 用户付款时二次确认信息
          this.pushAsset = item.coinName
          this.pushPrice = item.price
          this.pushCount = item.count
          this.pushPaymentAmount = item.amount
        }
      })
    },
    // 点击确认用户信息并弹出交易密码框
    statusUserInfo () {
      this.paymentVisible = false
      this.passwordVisible = true
    },
    // 确定付款
    confirmSubmit () {
      this.statePushPropertyTransaction()
      this.passwordVisible = false
    },
    async statePushPropertyTransaction () {
      let data
      let param = {
        id: this.pushUID, // 列表id
        password: this.pushPassword // 用户付款时交易密码
      }
      data = await pushPropertyTransaction(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.getPushRecordList()
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userInfo: state => state.personal.userInfo,
      // userInfo: state => state.user.loginStep1Info, // 用户详细信息
      merchantID: state => state.common.merchantID,
      loginType: state => state.user.loginType, // 发送类型
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/PushAsset";
  .push-assets{
    >.push-assets-main{
      >.push-assets-content-box {
        min-height: 570px;
        >.push-from-box {
          width: 400px;
          min-height: 570px;
          padding-top: 29px;
          margin: 0 auto;
          .form-input-common,
          .form-button-common,
          .form-input-common-state {
            width: 270px;
            height: 36px;
            box-sizing: border-box;
          }
          .form-button-common {
            margin: 0 0 50px 120px;
          }
        }
      }
      .award-record{
        min-height: 200px;
        >.award-record-header{
          height: 56px
        }
        >.award-record-content{
          min-height: 130px;
          .form-input-common {
            width: 270px;
            height: 36px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.push-assets-main {
        >.push-assets-content,
        >.push-assets-content-box {
          background-color: #1E2636;
          >.push-header {
            background-color: #1E2636;
            >.push-header-title {
              color: #338FF5;
            }
          }
          >.push-from-box {
            .form-input-common {
              border: 1px solid #485776;
              color: #fff;
              &:focus {
                border: 1px solid #338FF5;
              }
            }
            .form-input-common-state {
              background-color: #37424C;
              color: #fff;
            }
            .form-button-common {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
        >.award-record {
          background-color: #1E2636;
          >.award-record-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          .award-record-content{
            >.state-status {
              color: #338FF5;
            }
            .form-input-common {
              color: #fff;
              background-color: #1A2233;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }
</style>
