<!--
  author: zhaoxinlei
  update: 20190705
  description: 当前组件为 个人中心 提币地址 组件
-->
<template lang="pug">
  .withdrawal-address.personal(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .withdrawal-address-main
      header.withdrawal-header.personal-height40.line-height40.background-color.padding-left23.border-radius2
      .withdrawal-address-content.padding-left15
        .withdrawal-address-box.margin-top30
          .main-form
            el-form(
              ref="form"
              label-width="70px"
              :model="addAddressForm"
              :rules="addAddressRules"
            )
              // 币种
              el-form-item(:label="$t('M.comm_currency')")
                el-select(
                  v-model="currencyValue"
                  filterable
                  :no-data-text="$t('M.comm_no_data')"
                  :disabled="currencyValueStatus"
                  @change="changeCurrency"
                )
                  el-option(
                    :placeholder="$t('M.comm_please_choose')"
                    v-for="(item, index) in currencyList"
                    :key="index"
                    :label="item.name"
                    :value="item.coinId"
                  )
              // 备注
              el-form-item(
                :label="$t('M.comm_remark')"
                prop="withdrawalRemark"
              )
                el-input.form-input.border-radius4.padding-left15(
                  v-model.trim="addAddressForm.withdrawalRemark"
                  maxlength="20"
                )
              // 地址标签
              el-form-item(
                :label="$t('M.user_address_labels')"
                v-if="isShowAddressLabel === 'true'"
                prop="addressLabel"
              )
                el-input.form-input.border-radius4.padding-left15(
                  type="text"
                  v-model.trim="addAddressForm.addressLabel"
                )
              // 提币地址
              el-form-item(
                :label="$t('M.comm_mention_money') + $t('M.comm_site')"
                prop="withdrawalAddress"
              )
                el-input.form-input.border-radius4.padding-left15(v-model="addAddressForm.withdrawalAddress")
              el-form-item
                // 新增
                el-button(@click.prevent="addAddress") {{ $t('M.comm_newly_increased') }}
          //  提币 手机验证 邮箱验证 谷歌验证
          .withdrawal-dialog
            el-dialog(
              :title="$t('M.comm_mention_money')"
              :visible.sync="mentionMoneyConfirm"
            )
              el-form(:label-position="labelPosition")
                // 验证码（手机）
                el-form-item(
                  v-if="securityCenter.isPhoneEnable"
                  :label="$t('M.comm_code_phone')"
                )
                  el-input.content-input.padding-l15.box-sizing(
                    type="number"
                    v-model="phoneCode"
                    @focus="emptyStatus"
                  )
                  CountDownButton.send-code-btn.cursor-pointer(
                    :status="disabledOfPhoneBtn"
                    @run="sendPhoneOrEmailCode(0)"
                    v-if="mentionMoneyConfirm"
                  )
                // 验证码（邮箱）
                el-form-item(
                  v-if="securityCenter.isMailEnable"
                  :label="$t('M.comm_code_email')"
                )
                  el-input.content-input.padding-l15.box-sizing(
                    type="number"
                    v-model="emailCode"
                    @focus="emptyStatus"
                  )
                  CountDownButton(
                    class="send-code-btn cursor-pointer"
                    :status="disabledOfEmailBtn"
                    @run="sendPhoneOrEmailCode(1)"
                    v-if="mentionMoneyConfirm"
                  )
                // 验证码（google）
                el-form-item(
                  v-if="securityCenter.isGoogleEnable"
                  :label="$t('M.comm_code_google')"
                )
                  el-input.content-input.content-input1.input-google.padding-l15.box-sizing(
                    type="number"
                    v-model="googleCode"
                    @focus="emptyStatus"
                  )
              .dialog-footer(slot="footer")
                // 确 定
                el-button(
                  type="primary"
                  @click.prevent="submitMentionMoney"
                ) {{ $t('M.comm_confirm') }}
    .withdrawal-address-main.content-main
      header.address-list-header.background-color
        // 地址列表
        span.header-content.display-inline-block.font-size16.cursor-pointer {{ $t('M.comm_site') }}{{ $t('M.comm_list') }}
      .tab-list
        el-table(
          :data="withdrawalAddressList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
        )
          // 币种
          el-table-column(
            :label="$t('M.comm_currency')"
            width="180"
          )
            template(slot-scope="s")
              div {{s.row.coinName}}
          // 备注
          el-table-column(
            :label="$t('M.comm_remark')"
            width="180"
          )
            template(slot-scope="s")
              div {{s.row.remark}}
          // 提币地址
          el-table-column(
            :label="$t('M.comm_mention_money') + $t('M.comm_site')"
            width="370"
          )
            template(slot-scope="s")
              div {{s.row.address
          // 操作
          el-table-column(:label="$t('M.comm_operation')")
            template(slot-scope="s")
              div(
                @click.prevent="cancelId(s.row.id)"
                :id="s.row.id"
              ) {{$t(operation)}}
    // 分页
    .paging
      el-pagination(
        background
        v-show="withdrawalAddressList.length"
        layout="prev, pager, next"
        :page-count="totalPageForMyEntrust"
        @current-change="changeCurrentPage"
      )
</template>
<script>
import {
  inquireWithdrawalAddressList,
  // addNewWithdrawalAddress,
  // deleteUserWithdrawAddress,
  checkCurrencyAddress
} from '../../../utils/api/personal'
import CountDownButton from '../../Common/CountDownCommon'
import {
  // returnAjaxMsg,
  // sendPhoneOrEmailCodeAjax,
  // getSecurityCenter,
  // validateNumForUserInput,
  getNestedData
} from '../../../utils/commonFunc'
import {
  mapMutations,
  mapState
} from 'vuex'
import {WITHDRAWAL_REG} from '../../../utils/regExp'

export default {
  // name: '',
  // mixins: [],
  components: {
    CountDownButton
  },
  // props,
  data () {
    // 提现备注校验
    let validateWithdrawRemark = (rule, value, callback) => {
      if (value === '') {
        // 请输入备注
        callback(new Error(this.$t('M.comm_please_enter') + this.$t('M.comm_remark')))
      } else {
        callback()
      }
    }
    // 地址标签校验
    let validateAddressLabel = (rule, value, callback) => {
      if (isShowAddressLabel === 'true') {
        // 禁止输入 空格
        value = value.replace(/\s*/g, '')
        if (value === '') {
          // 请输入地址标签
          callback(new Error(this.$t('M.comm_please_enter') + this.$t('M.user_address_labels')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    // 提币地址校验
    let validateAddress = (rule, value, callback) => {
      if (value === '') {
        // 请输入地址标签
        callback(new Error(this.$t('M.comm_please_enter') + this.$t('M.comm_mention_money') + this.$t('M.comm_site')))
      } else if (!WITHDRAWAL_REG.test(value)) {
        // 非法地址
        callback(new Error(this.$t('M.user_address_withdrawal')))
      } else {
        callback()
      }
    }
    return {
      addAddressForm: {
        // 提现备注
        withdrawalRemark: '',
        // 地址标签
        addressLabel: '',
        // 提币地址
        withdrawalAddress: ''
      },
      addAddressRules: {
        withdrawalRemark: [
          { validator: validateWithdrawRemark, trigger: 'blur' },
          { validator: validateWithdrawRemark, trigger: 'change' }
        ],
        addressLabel: [
          { validator: validateAddressLabel, trigger: 'blur' },
          { validator: validateAddressLabel, trigger: 'change' }
        ],
        withdrawalAddress: [
          { validator: validateAddress, trigger: 'blur' },
          { validator: validateAddress, trigger: 'change' }
        ]
      },
      // form表单label方向
      labelPosition: 'top',
      // select币种
      currencyValue: '',
      // 安全状态显示
      securityCenter: {},
      // select币种列表
      currencyList: [],
      // 提现备注
      withdrawalRemark: '',
      // 提币地址
      withdrawalAddress: '',
      // 地址标签
      addressLabel: '',
      // 是否显示 地址标签
      isShowAddressLabel: 'true',
      // 提币地址列表
      withdrawalAddressList: [],
      // 删除
      operation: 'M.comm_delete',
      // 每页条数
      pageSize: 10,
      // 当前委托页码
      currentPageForMyEntrust: 1,
      // 当前委托总页数
      totalPageForMyEntrust: 1,
      // 新增提币地址确认弹窗
      mentionMoneyConfirm: false,
      // 每行数据ID
      deleteWithdrawalId: '',
      // 手机验证
      phoneCode: '',
      // 邮箱验证
      emailCode: '',
      // 谷歌验证
      googleCode: '',
      // 币种列表可选状态
      currencyValueStatus: true
    }
  },
  created () {
    this.getWithdrawalAddressList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_NEW_WITHDRAW_ADDRESS'
    ]),
    // 2.0点击显示验证信息
    addAddress () {
      this.$refs[this.addAddressForm].validate(async (valid) => {
        if (!valid) return
        await this.checkCurrencyAddress()
      })
      // if (
      //   this.checkoutInputFormat(0, this.withdrawalRemark) &&
      //   this.checkoutInputFormat(1, this.withdrawalAddress) &&
      //   this.checkoutInputFormat(2, this.addAddress)
      // ) {
      //   // 验证通过调用新增提币地址接口
      //   this.gitCheckCurrencyAddress()
      // }
    },
    // 校验提币地址
    async checkCurrencyAddress () {
      let param = {
        // 币种coinId
        coinId: this.currencyValue,
        // 提币地址
        address: this.addAddressForm.withdrawalAddress
      }
      let data = await checkCurrencyAddress(param)
      if (!data) return false
      // 验证通过调用验证方式接口
      await this.getSecurityCenter()
    },
    disableInputBlank () {
      this.addressLabel = this.addressLabel.replace(/\s*/g, '')
    },
    // 改变选中币种
    changeCurrency (e) {
      _.forEach(this.currencyList, item => {
        if (item.coinId === e) {
          this.isShowAddressLabel = item.needTag
        }
      })
      console.log(this.isShowAddressLabel)
    },
    /**
     *  5.刚进页面时候 提币地址列表查询
     */
    getWithdrawalAddressList: _.debounce(async function () {
      console.log(this.paramOfJumpToAddWithdrawAdress)
      let params = {
        pageNum: this.currentPageForMyEntrust, // 页码
        pageSize: this.pageSize // 页数
      }
      let data = await inquireWithdrawalAddressList(params)
      // console.log(data)
      if (!data) return false
      // 返回列表数据
      let detailData = getNestedData(data, 'data')
      this.currencyList = getNestedData(detailData, 'canWithdrawPartnerCoinList')
      // 判断是否显示地址标签
      this.isShowAddressLabel = this.currencyList[0].needTag
      // 对ID名称进行赋值
      if (this.paramOfJumpToAddWithdrawAdress) {
        this.currencyValue = this.paramOfJumpToAddWithdrawAdress
        this.isShowAddressLabel = this.currencyList.filter(item => item.coinId === this.currencyValue)[0].needTag
      } else {
        this.currencyValue = getNestedData(detailData, 'canWithdrawPartnerCoinList[0].coinId')
      }
      this.SET_NEW_WITHDRAW_ADDRESS('')
      // 对币种名称列表进行赋值
      this.withdrawalAddressList = getNestedData(detailData, 'UserWithdrawAddressPage.list')
      this.totalPageForMyEntrust = getNestedData(detailData, 'UserWithdrawAddressPage.pages') - 0
      // 接口回来之后吧select状态改为可用
      this.currencyValueStatus = false
      // console.log(this.currencyList)
      // console.log(this.withdrawalAddressList)
    }, 500)
  },
  // filters: {},
  computed: {
    ...mapState({
      // 跳转到的提币地址
      paramOfJumpToAddWithdrawAdress: state => state.personal.paramOfJumpToAddWithdrawAdress
    })
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .withdrawal-address {
    > .withdrawal-address-main {
      min-height: 400px;

      &.content-main {
        margin-top: 10px;
      }

      > .withdrawal-header {
        margin-bottom: 2px;

        > .header-content {
          font-weight: 400;
        }
      }

      > .withdrawal-address-content {
        > .withdrawal-address-box {
          min-height: 100px;

          .send-code-btn {
            position: absolute;
            top: 4px;
            width: 94px;
            height: 34px;
          }

          .error-info {
            line-height: 20px;
            color: #d45858;
          }

          .error-info1 {
            text-align: left;
          }

          .content-input {
            width: 180px;
            height: 34px;
          }

          .content-input1 {
            width: 275px;
          }

          .form-input,
          .form-button {
            box-sizing: border-box;
            width: 324px;
            height: 34px;
          }

          .form-button {
            margin: 10px 0 0 136px;
          }

          /deep/ {
            .main-form {
              .el-form .el-form-item {
                .el-form-item__label {
                  width: 115px !important;
                }
              }
            }
          }
        }
      }

      > .address-list-header {
        height: 40px;
        padding: 0 25px;
        line-height: 40px;

        > .header-content {
          color: #338ff5;
        }
      }

      .btn {
        width: 80px;
        height: 35px;
        line-height: 0;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $mainNightBgColor;

      > .withdrawal-address-main {
        background-color: $mainContentNightBgColor;

        > .withdrawal-header {
          background-color: $mainContentNightBgColor;

          > .header-content {
            color: #338ff5;
          }
        }

        > .withdrawal-address-content {
          > .withdrawal-address-box {
            .error-info {
              line-height: 20px;
              color: #d45858;
            }

            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .content-input {
              border: 1px solid #485776;
              color: #fff;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .form-input {
              border: 1px solid #485776;
              color: rgba(255, 255, 255, .7);
            }

            .form-input:focus {
              border: 1px solid #338ff5;
            }

            .form-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .address-list-header {
          border-bottom: 1px solid #39424d;
          color: rgba(255, 255, 255, .7);
        }

        .btn {
          border: 1px solid #338ff5;
          color: rgba(255, 255, 255, .7);
          background-color: transparent;
        }
      }

      /deep/ {
        .el-input__inner {
          border: 0;
          color: rgba(255, 255, 255, .7);
          background-color: #2d3651;
        }

        .el-form-item__label {
          padding: 0;
          margin-right: 20px;
          color: rgba(255, 255, 255, .7);
        }

        .el-table {
          background-color: #1c1f32;

          .cell {
            color: #9da5b3;
          }

          th {
            & > .cell {
              color: #a9bed4;
            }

            &.is-leaf {
              border: 0;
              background-color: #1c1f32;
            }
          }

          td {
            border: 0;
            background-color: #1c1f32;

            &:nth-child(4) {
              & > .cell {
                color: #338ff5;
              }
            }
          }
        }

        .el-table__header-wrapper {
          background-color: #1c1f32;
        }

        .el-table__body {
          tr {
            &:hover {
              & > td {
                background-color: #1c1f32;
              }
            }
          }
        }

        .el-table__empty-block {
          background-color: #1c1f32;
        }

        .el-dialog {
          background-color: #28334a;
        }

        .el-button {
          &:first-child {
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
          }
        }

        .withdrawal-dialog {
          .el-dialog__header {
            background-color: #20293c;
          }

          .el-button {
            border: 0;
            color: rgba(255, 255, 255, .7);
            background: linear-gradient(0deg, #2b396e, #2a5082);
          }
        }
      }
    }

    &.day {
      color: $dayMainTitleColor;

      > .withdrawal-address-main {
        color: $dayMainTitleColor;
        background-color: $mainDayBgColor;
        box-shadow: 0 0 6px #cfd5df;

        > .withdrawal-header {
          border-bottom: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          > .header-content {
            color: #338ff5;
          }
        }

        > .withdrawal-address-content {
          > .withdrawal-address-box {
            .send-code-btn {
              color: #fff;
              background-color: #338ff5;
            }

            .content-input {
              border: 1px solid #ecf1f8;
              color: #333;

              &:focus {
                border: 1px solid #338ff5;
              }
            }

            .form-input {
              border: 1px solid rgba(236, 241, 248, 1);
              background: rgba(255, 255, 255, 1);
            }

            .form-input:focus {
              border: 1px solid #338ff5;
            }

            .form-button {
              color: rgba(255, 255, 255, .7);
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }

        > .address-list-header {
          border-bottom: 1px solid rgba(236, 241, 248, 1);
          color: #338ff5;
        }

        .btn {
          border: 1px solid #338ff5;
          color: rgba(255, 255, 255, .7);
          background-color: transparent;
        }
      }

      /deep/ {
        .el-table {
          background-color: #fff;

          .cell {
            color: #333;
          }

          th {
            & > .cell {
              color: #333;
            }

            &.is-leaf {
              background-color: #fff;
            }
          }

          td {
            border-bottom: 1px solid #fff;
            background-color: #fff;

            &:nth-child(4) {
              div {
                color: #338ff5;
              }
            }
          }
        }

        .el-switch__core {
          &::after {
            background-color: #fff;
          }
        }

        .el-table__body {
          tr {
            &:hover {
              & > td {
                background-color: #fff;
              }
            }
          }
        }

        .el-form-item__label {
          padding: 0;
          margin-right: 20px;
          color: #7d90ac;
        }

        .el-input__inner {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);
        }
      }
    }

    /deep/ {
      .el-table__empty-block {
        width: 920px !important;
        height: 257px;
      }

      .el-input__inner {
        width: 130px;
        height: 34px !important;
        border: 0;
        font-size: 14px;
      }

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-table--fit {
        padding: 0 25px;
      }

      .el-dialog {
        width: 325px;
        border-radius: 5px;
      }

      .el-dialog__close {
        display: none;
      }

      .el-button {
        &:first-child {
          width: 80px;
          height: 35px;
          border: 0;
          line-height: 0;
        }
      }

      .el-dialog__body {
        color: #fff;
      }

      .el-table {
        tr {
          background-color: transparent;
        }

        td {
          border-bottom: 0;

          &:nth-child(4) {
            padding-right: 75px;
            text-align: right;
            cursor: pointer;
          }
        }

        th {
          & > .cell {
            font-size: 12px;
          }

          &:nth-child(4) {
            & > .cell {
              padding-right: 90px;
              text-align: right;
            }
          }
        }
      }

      .withdrawal-dialog {
        .el-dialog__header {
          height: 40px;
          padding: 0 0 0 25px;
          margin-bottom: 10px;
          border-radius: 5px 5px 0 0;
          line-height: 40px;
          background: rgba(51, 143, 245, .1);
        }

        .el-dialog__body {
          padding: 0 25px;
        }

        .el-form-item {
          margin-bottom: 15px;
        }

        .el-form-item__label {
          width: 150px !important;
          height: 30px;
          line-height: 30px;
        }

        .el-button {
          width: 275px;
          height: 34px;
        }

        .el-dialog__footer {
          text-align: center;
        }
      }
    }
  }
</style>
