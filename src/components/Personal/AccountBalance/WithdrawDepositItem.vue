<!--
  author: zhaoxinlei
  update: 20190704
  description: 当前组件为 单个 提币组件
-->
<!--<template>-->
  <!--<div-->
    <!--class="recharge-list recharge-list-mention list-mention-treasure"-->
    <!--v-show="isShow"-->
    <!--:class="{'day':theme == 'day','night':theme == 'night' }"-->
  <!--&gt;-->
    <!--<p class="triangle triangle-one"></p>-->
    <!--&lt;!&ndash;公信宝类提币备注&ndash;&gt;-->
    <!--<div-->
      <!--class="mention"-->
      <!--v-if="isNeedTag"-->
    <!--&gt;-->
      <!--<p class="mention-treasure">-->
        <!--&lt;!&ndash;地址标签&ndash;&gt;-->
        <!--{{ $t('M.comm_address_labels') }}-->
        <!--&lt;!&ndash;（填写错误可能导致资产损失，请仔细核对）&ndash;&gt;-->
        <!--<span class="treasure-info font-size12">({{ $t('M.user_address_labels_prompt') }})</span>-->
      <!--</p>-->
      <!--<input-->
        <!--type="text"-->
        <!--class="input-mention border-radius2 padding-lr15 box-sizing"-->
        <!--v-model="withdrawRemark"-->
        <!--@input="filterSpace"-->
      <!--&gt;-->
    <!--</div>-->
    <!--<div class="recharge-list-left display-flex">-->
      <!--<div class="list-left-flex flex1 font-size12">-->
        <!--<div class="flex-box padding-top10">-->
          <!--<p class="left-flex-hint">-->
            <!--&lt;!&ndash;提币地址&ndash;&gt;-->
            <!--{{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}-->
          <!--</p>-->
          <!--<el-select-->
            <!--placeholder=""-->
            <!--v-model="activeWithdrawDepositAddress"-->
            <!--:no-data-text="$t('M.comm_no_data')"-->
            <!--filterable-->
            <!--@change="changeWithdrawAddress"-->
            <!--allow-create-->
          <!--&gt;-->
            <!--<el-option-->
              <!--v-for="(item, index) in withdrawAddressList"-->
              <!--:key="index"-->
              <!--:label="`${item.address} ${item.remark}`"-->
              <!--:value="item.address"-->
            <!--&gt;-->
            <!--</el-option>-->
          <!--</el-select>-->
          <!--<span-->
            <!--class="new-address cursor-pointer address-bg"-->
            <!--@click.prevent="jumpToOtherTab('mention-address', coinId)"-->
          <!--&gt;-->
            <!--&lt;!&ndash;新增&ndash;&gt;-->
            <!--{{ $t('M.comm_newly_increased') }}-->
          <!--</span>-->
        <!--</div>-->
        <!--<div class="flex-box padding-top20">-->
          <!--<p class="left-flex-hint">-->
            <!--&lt;!&ndash;手续费&ndash;&gt;-->
            <!--{{ $t('M.comm_service_charge') }}-->
          <!--</p>-->
          <!--<input-->
            <!--type="text"-->
            <!--class="flex-input border-radius2 padding-l15 box-sizing"-->
            <!--ref="feeInputRef"-->
            <!--@keyup="changeInputValue('feeInputRef', index, pointLengthAccountCount, 'serviceType', coinId, total)"-->
            <!--@input="changeInputValue('feeInputRef', index, pointLengthAccountCount, 'serviceType', coinId, total)"-->
          <!--&gt;-->
          <!--<span class="service-charge display-inline-block text-align-r">-->
            <!--{{feeRangeOfWithdraw.minFees}}-->
             <!-- - -->
            <!--{{feeRangeOfWithdraw.maxFees}}-->
          <!--</span>-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="count-box flex1 font-size12">-->
        <!--<div class="count-flex-box padding-top10">-->
          <!--<p class="content-flex-hint">-->
            <!--&lt;!&ndash;数量&ndash;&gt;-->
            <!--{{ $t('M.comm_count') }}-->
          <!--</p>-->
          <!--<input-->
            <!--type="text"-->
            <!--class="count-flex-input border-radius2 padding-lr15 box-sizing text-align-r"-->
            <!--ref="countInputRef"-->
            <!--@blur="checkUserInputAvailable-->
<!--('withdrawCount', index, total)"-->
            <!--@keyup="changeInputValue('countInputRef', index, pointLengthAccountCount, 'rechargeType', coinId, total)"-->
            <!--@input="changeInputValue('countInputRef', index, pointLengthAccountCount, 'rechargeType', coinId, total)"-->
          <!--&gt;-->
          <!--<p class="count-flex-text text-align-r">-->
            <!--<span>-->
              <!--&lt;!&ndash;限额：&ndash;&gt;-->
              <!--{{ $t('M.comm_limit') }}：-->
            <!--</span>-->
            <!--<span>-->
              <!--{{feeRangeOfWithdraw.minWithdraw}}-->
               <!-- - -->
              <!--{{feeRangeOfWithdraw.maxWithdraw}}-->
            <!--</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div class="count-flex-box padding-top20">-->
          <!--<p class="content-flex-hint">-->
            <!--&lt;!&ndash;到账数量&ndash;&gt;-->
            <!--{{ $t('M.comm_account') }}{{ $t('M.comm_count') }}-->
          <!--</p>-->
          <!--<input-->
            <!--type="text"-->
            <!--disabled-->
            <!--class="count-text-input border-radius2 padding-lr15 box-sizing text-align-r"-->
            <!--v-model="accountCountFilter"-->
          <!--&gt;-->
        <!--</div>-->
      <!--</div>-->
      <!--<div-->
        <!--class="text-info-mention flex1 font-size12"-->
        <!--:class="{'need-tag-top':isNeedTag}"-->
      <!--&gt;-->
        <!--&lt;!&ndash;提现费率规则：&ndash;&gt;-->
        <!--<p class="currency-rule">-->
          <!--<span>{{ currencyName }}</span>-->
          <!--{{ $t('M.user_assets_withdrawal_hint1') }}：-->
        <!--</p>-->
        <!--&lt;!&ndash;为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；&ndash;&gt;-->
        <!--<p-->
          <!--class="prompt-message cursor-pointer"-->
          <!--:title="$t('M.user_assets_withdrawal_hint2')"-->
        <!--&gt;-->
          <!--* {{ $t('M.user_assets_withdrawal_hint2') }}-->
        <!--</p>-->
        <!--&lt;!&ndash;充值经过1个确认后，才允许提现；&ndash;&gt;-->
        <!--<p-->
          <!--class="prompt-message cursor-pointer"-->
          <!--:title="$t('M.user_assets_withdrawal_hint3')"-->
        <!--&gt;-->
          <!--* <span>{{ currencyName }}</span>-->
          <!--{{ $t('M.user_assets_withdrawal_hint3') }}-->
        <!--</p>-->
        <!--&lt;!&ndash;可提现金额≤账户可用资产-未确认的数字资产。&ndash;&gt;-->
        <!--<p-->
          <!--class="prompt-message cursor-pointer"-->
          <!--:title="$t('M.user_assets_withdrawal_hint4')"-->
        <!--&gt;-->
          <!--* {{ $t('M.user_assets_withdrawal_hint4') }}-->
        <!--</p>-->
        <!--<p class="mention-button">-->
          <!--<button-->
            <!--class="font-size12 submit-but border-radius4 cursor-pointer"-->
            <!--@click.prevent="validateOfWithdraw(coinId, withdrawRemark)"-->
          <!--&gt;-->
            <!--&lt;!&ndash;提币&ndash;&gt;-->
            <!--{{ $t('M.comm_mention_money') }}-->
          <!--</button>-->
          <!--<span-->
            <!--class="float-right cursor-pointer"-->
            <!--@click.prevent="jumpToOtherTab('billing-details', coinId, 2)"-->
          <!--&gt;-->
            <!--&lt;!&ndash;提币记录&ndash;&gt;-->
            <!--{{ $t('M.comm_mention_money') }}{{ $t('M.comm_record') }}-->
          <!--</span>-->
        <!--</p>-->
      <!--</div>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->
<template lang="pug">
  .recharge-list.recharge-list-mention.list-mention-treasure(
    v-show="isShow"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    p.triangle.triangle-one
    // 公信宝类提币备注
    .mention(v-if="isNeedTag")
      // 地址标签
      p.mention-treasure {{ $t('M.comm_address_labels') }}
        // （填写错误可能导致资产损失，请仔细核对）
        span.treasure-info.font-size12 ({{ $t('M.user_address_labels_prompt') }})
      input.input-mention.border-radius2.padding-lr15.box-sizing(
        type="text"
        v-model="withdrawRemark"
        @input="filterSpace"
      )
    // USDT 多链选择
    USDTLinkNames(v-if="isShowUSDTSelect")
    .recharge-list-left.display-flex
      .list-left-flex.flex1.font-size12
        .flex-box.padding-top10
          // 提币地址
          p.left-flex-hint {{ $t('M.comm_mention_money') }}{{ $t('M.comm_site') }}
          el-select(
            placeholder=""
            v-model="activeWithdrawDepositAddress"
            :no-data-text="$t('M.comm_no_data')"
            filterable
            @change="changeWithdrawAddress"
            allow-create
          )
            el-option(
              v-for="(item, index) in withdrawAddressList"
              :key="index"
              :label="`${item.address} ${item.remark}`"
              :value="item.address"
            )
          //  新增
          span.new-address.cursor-pointer.address-bg(@click.prevent="jumpToOtherTab('mention-address', coinId)") {{ $t('M.comm_newly_increased') }}
        .flex-box.padding-top20
          // 手续费
          p.left-flex-hint {{ $t('M.comm_service_charge') }}
          input.flex-input.border-radius2.padding-l15.box-sizing(
            type="text"
            ref="feeInputRef"
            @keyup="changeInputValue('feeInputRef', index, pointLengthAccountCount, 'serviceType', coinId, total)"
            @input="changeInputValue('feeInputRef', index, pointLengthAccountCount, 'serviceType', coinId, total)"
          )
          span.service-charge.display-inline-block.text-align-r {{feeRangeOfWithdraw.minFees}} - {{feeRangeOfWithdraw.maxFees}}
      .count-box.flex1.font-size12
        .count-flex-box.padding-top10
          // 数量
          p.content-flex-hint {{$t('M.comm_count')}}
          input.count-flex-input.border-radius2.padding-lr15.box-sizing.text-align-r(
            type="text"
            ref="countInputRef"
            @blur="checkUserInputAvailable('withdrawCount', index, total)"
            @keyup="changeInputValue('countInputRef', index, pointLengthAccountCount, 'rechargeType', coinId, total)"
            @input="changeInputValue('countInputRef', index, pointLengthAccountCount, 'rechargeType', coinId, total)"
          )
          p.count-flex-text.text-align-r
            // 限额
            span {{ $t('M.comm_limit') }}：
            span  {{feeRangeOfWithdraw.minWithdraw}} - {{feeRangeOfWithdraw.maxWithdraw}}
        .count-flex-box.padding-top20
          // 到账数量
          p.content-flex-hint {{ $t('M.comm_account') }}{{ $t('M.comm_count') }}
          input.count-text-input.border-radius2.padding-lr15.box-sizing.text-align-r(
            type="text"
            disabled
            v-model="accountCountFilter"
          )
      .text-info-mention.flex1.font-size12(:class="{'need-tag-top':isNeedTag}")
        // 提现费率规则
        p.currency-rule
          span {{ currencyName }}
          // 不一样
          span {{ $t('M.user_assets_withdrawal_hint1') }}：
        //  为了用户资金安全，平台可能会电话确认您的提币操作，请注意接听；
        p.prompt-message.cursor-pointer(:title="$t('M.user_assets_withdrawal_hint2')") *  {{ $t('M.user_assets_withdrawal_hint2') }}
        // 充值经过1个确认后，才允许提现；
        p.prompt-message.cursor-pointer(:title="$t('M.user_assets_withdrawal_hint3')") *
          span  {{ currencyName }} {{ $t('M.user_assets_withdrawal_hint3') }}
        // 可提现金额≤账户可用资产-未确认的数字资产。
        p.prompt-message.cursor-pointer(:title="$t('M.user_assets_withdrawal_hint4')") *  {{ $t('M.user_assets_withdrawal_hint4') }}
        // 提币
        p.mention-button
          button.font-size12.submit-but.border-radius4.cursor-pointer(@click.prevent="validateOfWithdraw(coinId, withdrawRemark)"
          ) {{ $t('M.comm_mention_money') }}
          // 提币记录
          span.float-right.cursor-pointer(@click.prevent="jumpToOtherTab('billing-details', coinId, 2)") {{ $t('M.comm_mention_money') }}{{ $t('M.comm_record') }}

</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import USDTLinkNames from './USDTLinkNames'
export default {
  components: {
    USDTLinkNames
  },
  props: [
    'isShow',
    // 是否需要备注(公信宝)
    'isNeedTag',
    // 币种名称
    'currencyName',
    // 提币地址列表
    'withdrawAddressList',
    // 提币手续费范围
    'feeRangeOfWithdraw',
    // 当前币种索引
    'index',
    // 到账数量
    'accountCount',
    // 提币数量小数点限制位数
    'pointLengthAccountCount',
    // 提币地址初始值
    'originalActiveWithdrawDepositAddress',
    // 地址标签初始值
    'originWithdrawRemark',
    // 当前币种id
    'coinId',
    // 币种的可用总量
    'total'
  ],
  data () {
    return {
      //  当前提币地址
      activeWithdrawDepositAddress: '',
      // 地址标签
      withdrawRemark: ''
    }
  },
  // created () {},
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  methods: {
    // 地址标签输入时过滤空格
    filterSpace () {
      this.withdrawRemark = this.withdrawRemark.replace(/\s*/g, '')
    },
    // 当前提币地址改变回调
    changeWithdrawAddress (e) {
      if (_.every(this.withdrawAddressList, item => item.address !== e)) {
        this.$emit('changeWithdrawAddress', {
          activeWithdrawDepositAddress: e,
          activeWithdrawRemark: ''
        })
      } else {
        _.forEach(this.withdrawAddressList, item => {
          if (item.address === e) {
            this.$emit('changeWithdrawAddress', {
              activeWithdrawDepositAddress: this.activeWithdrawDepositAddress,
              activeWithdrawRemark: item.tag
            })
          }
        })
      }
    },
    jumpToOtherTab (target, coinId, index) {
      this.$emit('jumpToOtherTab', {
        target,
        coinId,
        index
      })
    },
    checkUserInputAvailable (ref, index, total) {
      this.$emit('checkUserInputAvailable', {
        ref,
        index,
        total
      })
    },
    validateOfWithdraw (coinId, withdrawRemark) {
      this.$emit('validateOfWithdraw', {
        coinId,
        withdrawRemark
      })
    },
    changeInputValue (ref, index, pointLengthAccountCount, val, coinId, total) {
      this.$emit('changeInputValue', {
        ref,
        index,
        pointLengthAccountCount,
        val,
        coinId,
        total
      })
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: store => store.common.theme,
      USDT_COIN_ID_S: state => state.personal.USDT_COIN_ID_S
    }),
    isShowUSDTSelect () {
      return this.coinId == this.USDT_COIN_ID_S
    },
    accountCountFilter () {
      return this.$scientificToNumber(this.accountCount)
    }
  },
  watch: {
    // 初始提币地址赋值
    originalActiveWithdrawDepositAddress (newVal) {
      this.activeWithdrawDepositAddress = newVal
    },
    originWithdrawRemark (newVal) {
      // console.log(newVal)
      this.withdrawRemark = newVal
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../assets/CSS/index';

  .recharge-list {
    position: relative;
    z-index: 2;
    padding: 20px 6px;

    > .triangle {
      position: absolute;
      top: -7px;
      right: 73px;
      width: 12px;
      height: 12px;
      -ms-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    > .mention {
      width: 100%;
      padding: 5px 0 0;

      > .mention-treasure {
        height: 20px;
        line-height: 20px;
        color: #338ff5;

        > .treasure-info {
          color: #d45858;
        }
      }

      > .input-mention {
        width: 640px;
        height: 34px;
      }
    }

    > .recharge-content {
      flex: 2;
      padding: 0 20px;

      > .recharge-content-hint {
        height: 20px;
        margin-bottom: 5px;
        line-height: 20px;
      }

      > .input-box {
        > .hint-input {
          width: 430px;
          height: 32px;
        }

        > .code-copy {
          width: 89px;
          height: 32px;
          border-radius: 0 2px 2px 0;
          line-height: 32px;
        }
      }

      > .recharge-content-title {
        width: 584px;
        line-height: 18px;
      }
    }

    > .recharge-content-right {
      > .recharge-content-code {
        box-sizing: border-box;
        width: 110px;
        height: 110px;
        padding: 5px;
      }

      > .code-list {
        padding-right: 10px;
        margin-top: 110px;
      }
    }

    > .recharge-list-left {
      flex: 2;
      height: 196px;

      > .list-left-flex {
        > .flex-box {
          position: relative;
          height: 80px;

          > .left-flex-hint {
            line-height: 20px;
          }

          > .service-charge {
            position: absolute;
            top: 70px;
            right: 0;
            width: 100%;
            height: 20px;
          }

          > .flex-input,
          > .text-input {
            width: 350px;
            height: 34px;
          }

          > .new-address {
            position: absolute;
            top: 38.5px;
            right: 1px;
            height: 34px;
            padding: 0 5px;
            line-height: 34px;
            text-align: center;
          }

          > .new-address-currency {
            top: 49px;
          }
        }
      }

      > .count-box {
        padding-left: 15px;

        > .count-flex-box {
          width: 250px;
          height: 80px;

          > .content-flex-hint,
          > .count-flex-text {
            line-height: 20px;
          }

          > .count-flex-input,
          > .count-text-input {
            width: 250px;
            height: 34px;
            margin-top: 9px;
          }

          > .count-text-input {
            margin-top: 5px;
          }
        }
      }

      > .text-info-mention {
        position: relative;
        top: -15px;
        padding: 15px 0 0 15px;

        &.need-tag-top {
          top: -45px;
        }

        > .currency-rule,
        > .prompt-message {
          width: 260px;
          overflow: hidden;
          line-height: 25px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        > .mention-button {
          margin-top: 20px;

          > .submit-but {
            width: 80px;
            height: 34px;
          }
        }
      }
    }

    > .text-info {
      padding: 20px 0 0 15px;

      > .currency-rule,
      > .prompt-message {
        line-height: 16px;
      }

      > .mention-button {
        margin-top: 8px;

        > .submit-but {
          width: 80px;
          height: 34px;
        }
      }
    }

    &.night {
      border: 1px solid #338ff5;

      > .triangle {
        border-top: 1px solid transparent;
        border-bottom: 1px solid #338ff5;
        border-left: 1px solid #338ff5;
        background-color: #1c1f32;
        border-right: 1px solid transparent;
      }

      .input-mention {
        color: #fff;
        background-color: #2d3651;
      }

      > .recharge-content {
        > .recharge-content-hint {
          color: #338ff5;
        }

        > .input-box {
          > .hint-input {
            color: #fff;
            background-color: #2d3651;
          }

          > .code-copy {
            color: #fff;
            background-color: #338ff5;
          }
        }

        > .recharge-content-title {
          color: #d45858;
        }
      }

      > .recharge-content-right {
        > .recharge-content-code {
          background-color: #fff;
        }
      }

      > .recharge-list-left {
        > .list-left-flex {
          > .flex-box {
            > .flex-input {
              color: #fff;
              background-color: #2d3651;
            }

            > .text-input {
              color: #fff;
              background-color: #37424c;
            }

            > .left-flex-hint,
            > .new-address {
              color: #338ff5;
            }

            > .address-bg {
              background-color: #2d3651;
            }
          }
        }

        > .count-box {
          > .count-flex-box {
            > .content-flex-hint {
              color: #338ff5;
            }

            > .count-flex-text {
              color: #83909b;
            }

            > .count-flex-input {
              color: #fff;
              background-color: #2d3651;
            }

            > .count-text-input {
              color: #fff;
              background-color: #20273d;
            }
          }
        }

        > .text-info-mention {
          > .currency-rule {
            color: #d45858;
          }

          > .prompt-message {
            color: #58616a;
          }

          > .mention-button {
            > .submit-but {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      > .text-info {
        > .currency-rule {
          color: #d45858;
        }

        > .prompt-message {
          color: #58616a;
        }

        > .mention-button {
          > .submit-but {
            color: #fff;
            background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }
      }

      > .email-input {
        width: 220px;
        height: 34px;
      }
    }

    &.day {
      border: 1px solid #338ff5;
      color: $dayMainTitleColor;
      background-color: $mainDayBgColor;

      .input-mention {
        color: #333;
        background-color: rgba(51, 143, 245, .1);
      }

      > .triangle {
        position: absolute;
        top: -7px;
        right: 62px;
        width: 12px;
        height: 12px;
        border-top: 1px solid transparent;
        border-bottom: 1px solid #338ff5;
        border-left: 1px solid #338ff5;
        background-color: #fff;
        border-right: 1px solid transparent;
      }

      > .recharge-content {
        > .recharge-content-hint {
          color: #338ff5;
        }

        > .input-box {
          > .hint-input {
            border: 1px solid rgba(38, 47, 56, .1);
            color: #333;
            background: rgba(51, 143, 245, .1);
          }

          > .code-copy {
            color: #fff;
            background-color: #338ff5;
          }
        }

        > .recharge-content-title {
          color: #d45858;
        }
      }

      > .recharge-content-right {
        > .recharge-content-code {
          background-color: #fff;
        }
      }

      > .recharge-list-left {
        > .list-left-flex {
          > .flex-box {
            > .flex-input {
              border: 1px solid rgba(38, 47, 56, .1);
              color: #333;
              background: rgba(51, 143, 245, .1);
            }

            > .text-input {
              color: #fff;
              background-color: #37424c;
            }

            > .left-flex-hint,
            > .new-address {
              color: #338ff5;
            }
          }
        }

        > .count-box {
          > .count-flex-box {
            > .content-flex-hint {
              color: #338ff5;
            }

            > .count-flex-text {
              color: #83909b;
            }

            > .count-flex-input {
              border: 1px solid rgba(38, 47, 56, .1);
              color: #333;
              background: rgba(51, 143, 245, .1);
            }

            > .count-text-input {
              border: 1px solid rgba(38, 47, 56, .1);
              color: #333;
              background: rgba(51, 143, 245, .1);
            }
          }
        }

        > .text-info-mention {
          > .currency-rule {
            color: #d45858;
          }

          > .prompt-message {
            color: #58616a;
          }

          > .mention-button {
            > .submit-but {
              color: #fff;
              background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
            }
          }
        }
      }

      > .text-info {
        > .currency-rule {
          color: #d45858;
        }

        > .prompt-message {
          color: #58616a;
        }

        > .mention-button {
          > .submit-but {
            color: #fff;
            background: linear-gradient(0deg, rgba(43, 57, 110, 1), rgba(42, 80, 130, 1));
          }
        }
      }

      > .email-input {
        width: 220px;
        height: 34px;
      }

      /deep/ {
        /* 个人中心（白色主题） */
        .el-switch__core::after {
          background-color: #fff;
        }

        .el-switch__core::after,
        .el-table,
        .el-table__header-wrapper,
        .el-table th.is-leaf,
        .el-table td {
          background-color: #fff;
        }

        .el-table {
          td {
            border-bottom: 1px solid #fff;
          }
        }

        tr {
          td {
            &:hover {
              background-color: #fff;
            }
          }
        }

        .cell {
          color: #333;
        }

        .el-form-item__label {
          padding: 0;
          margin-right: 20px;
          color: #7d90ac;
        }

        .el-input__inner {
          border: 1px solid rgba(38, 47, 56, .1);
          background: rgba(51, 143, 245, .1);
        }

        .el-table td:nth-child(4) {
          div {
            color: #338ff5;
          }
        }

        .withdrawal-dialog {
          .el-dialog__header {
            background: rgba(51, 143, 245, .1);
          }
        }
      }
    }
  }
</style>
