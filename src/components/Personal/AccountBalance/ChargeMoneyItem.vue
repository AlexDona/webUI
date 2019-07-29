<!--
  author: zhaoxinlei
  update: 20190705
  description: 当前组件为 个人中心 我的资产 币种充值单个组件
-->
<!--<template>-->
  <!--<div-->
    <!--v-show="isShow"-->
    <!--class="recharge-list display-flex"-->
    <!--:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"-->
  <!--&gt;-->
    <!--<p class="triangle"></p>-->
    <!--<div class='recharge-content'>-->
      <!--<p class="recharge-content-hint font-size12">-->
        <!--&lt;!&ndash;充值地址&ndash;&gt;-->
        <!--{{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_site') }}-->
      <!--</p>-->
      <!--<div-->
        <!--class="input-box"-->
      <!--&gt;-->
        <!--<input-->
          <!--class="hint-input border-radius2 padding-l15 float-left"-->
          <!--disabled-->
          <!--v-model="chargeMoneyAddress"-->
        <!--/>-->
        <!--<span-->
          <!--class="code-copy cursor-pointer display-inline-block float-left text-align-c"-->
          <!--v-clipboard:copy="chargeMoneyAddress"-->
          <!--v-clipboard:success="onCopy"-->
          <!--v-clipboard:error="onError"-->
        <!--&gt;-->
          <!--&lt;!&ndash;复制地址&ndash;&gt;-->
          <!--{{ $t('M.comm_copy') }}{{ $t('M.comm_site') }}-->
        <!--</span>-->
      <!--</div>-->
      <!--<div class="recharge-content-title font-size12 margin-top9 float-left">-->
        <!--&lt;!&ndash;20190402 我的资产添加USDT 类型区分文本&ndash;&gt;-->
        <!--<p v-if="currencyName == 'USDT'">-->
          <!--* {{ $t('M.user_assets_withdrawal_hint10').format([currencyName, currencyName]) }}-->
        <!--</p>-->
        <!--&lt;!&ndash;转账时请务必备注（否则后果自负）：UID&ndash;&gt;-->
        <!--<p v-if="isNeedTag == 'true'">-->
          <!--* {{ $t('M.user_assets_recharge_hint0').format([currencyName,currencyName]) }}{{rechargeNoteInfo}}-->
        <!--</p>-->
        <!--&lt;!&ndash;禁止充值除 之外的其他资产，任何非 资产充值将不可找回&ndash;&gt;-->
        <!--<p>* {{ $t('M.user_assets_recharge_hint1').format([currencyName, currencyName]) }}</p>-->
        <!--&lt;!&ndash;往该地址充值，汇款完成，等待网络自动确认（{}个确认）后系统自动到账&ndash;&gt;-->
        <!--<p>* {{ $t('M.user_assets_recharge_hint4').format([successCount]) }}</p>-->
        <!--&lt;!&ndash;为了快速到账，充值时可以适当提高网络手续费&ndash;&gt;-->
        <!--<p>* {{ $t('M.user_assets_recharge_hint5') }}</p>-->
        <!--&lt;!&ndash; 3、最小充值金额{}。 &ndash;&gt;-->
        <!--<p>* {{$t('M.user_assets_recharge_hint6').format([minRechargeAmount])}}</p>-->
      <!--</div>-->
    <!--</div>-->
    <!--<div class='recharge-content-right flex1'>-->
      <!--<p class="recharge-content-code margin-top20 float-left">-->
        <!--<Qrcode-->
          <!--class="ercode"-->
          <!--:value="chargeMoneyAddress"-->
        <!--&gt;-->
        <!--</Qrcode>-->
      <!--</p>-->
      <!--<p-->
        <!--class="code-list text-align-r float-right cursor-pointer font-size12"-->
        <!--@click.prevent="jumpToOtherTab('billing-details', coinId, 1)"-->
      <!--&gt;-->
        <!--&lt;!&ndash;充值记录&ndash;&gt;-->
        <!--{{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_record') }}-->
      <!--</p>-->
    <!--</div>-->
  <!--</div>-->
<!--</template>-->
<template lang="pug">
  .recharge-list.display-flex(
    v-show="isShow"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    p.triangle
    .recharge-content
      USDTLinkNames(v-if="isShowUSDTSelect")
      // 充币地址
      p.recharge-content-hint.font-size12  {{ $t('M.comm_charge_money') }}{{ $t('M.comm_site') }}
      .input-box
        input.hint-input.border-radius2.padding-l15.float-left(
          disabled
          v-model="chargeMoneyAddress"
        )
        // 复制地址
        span.code-copy.cursor-pointer.display-inline-block.float-left.text-align-c(
          v-clipboard:copy="chargeMoneyAddress"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        ) {{ $t('M.comm_copy') }}{{ $t('M.comm_site') }}
      .recharge-content-title.font-size12.margin-top9.float-left
        // 我的资产添加USDT 类型区分文本
        p(v-if="currencyName == 'USDT'") * {{ $t('M.user_assets_withdrawal_hint10').format([currencyName, currencyName]) }}
        // 转账时请务必备注（否则后果自负）：UID
        p(v-if="isNeedTag") * {{ $t('M.user_assets_recharge_hint0').format([currencyName,currencyName]) }}{{rechargeNoteInfo}}
        // 禁止充值除 之外的其他资产，任何非 资产充值将不可找回
        p * {{ $t('M.user_assets_recharge_hint1').format([currencyName, currencyName]) }}
        // 往该地址充值，汇款完成，等待网络自动确认（{}个确认）后系统自动到账
        p * {{ $t('M.user_assets_recharge_hint4').format([successCount]) }}
        // 为了快速到账，充值时可以适当提高网络手续费
        p * {{ $t('M.user_assets_recharge_hint5') }}
        //  3、最小充值金额{}。
        p * {{$t('M.user_assets_recharge_hint6').format([minRechargeAmount])}}
    .recharge-content-right.flex1
      p.recharge-content-code.margin-top20.float-left
        QRCode.ercode(:value="chargeMoneyAddress")
      //  充币记录
      p.code-list.text-align-c.cursor-pointer.font-size12(@click.prevent="jumpToOtherTab('billing-details', coinId, 1)") {{ $t('M.comm_charge_money') }}{{ $t('M.comm_record') }}

</template>
<script>
import {mapState} from 'vuex'
import USDTLinkNames from './USDTLinkNames'

// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
    USDTLinkNames
  },
  props: [
    'isShow',
    // 币种名称
    'currencyName',
    // 充币地址
    'chargeMoneyAddress',
    // 是否需要备注（公信宝）
    'isNeedTag',
    // 充币地址备注信息
    'rechargeNoteInfo',
    // 确认数
    'successCount',
    // 最小充币数量
    'minRechargeAmount',
    // 当前币种id
    'coinId'
  ],
  // data () {
  //   return {}
  // },
  // created () {},
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  methods: {
    // 跳转到其他页面
    jumpToOtherTab (target, coinId, index) {
      console.log(coinId)
      this.$emit('jumpToOtherTab', {
        target,
        coinId,
        index
      })
    },
    //  点击复制
    onCopy () {
      // 已拷贝
      this.$success_tips_X(this.$t('M.comm_have_been_copied'))
    },
    onError () {
      // 拷贝失败，请稍后重试
      this.$error_tips_X(this.$t('M.comm_copies_failure'))
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      USDT_COIN_ID_S: state => state.personal.USDT_COIN_ID_S
    }),
    isShowUSDTSelect () {
      return this.coinId == this.USDT_COIN_ID_S
    }
  }
  // watch: {}
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
      right: 119px;
      width: 12px;
      height: 12px;
      -ms-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    > .triangle-one {
      right: 55px;
    }

    > .mention {
      width: 100%;
      padding: 5px 0 0;

      > .mention-treasure {
        height: 20px;
        line-height: 20px;
        color: $mainColor;

        > .treasure-info {
          color: #d45858;
        }
      }

      > .input-mention {
        width: 640px;
        height: 34px;
        color: #fff;
        background-color: #2d3651;
      }
    }

    .recharge-content {
      flex: 2;
      padding: 0 35px;

      .recharge-content-hint {
        height: 20px;
        margin-bottom: 5px;
        line-height: 20px;
      }

      > .input-box {
        > .hint-input {
          width: 430px;
          height: 34px;
        }

        > .code-copy {
          min-width: 90px;
          height: 34px;
          padding: 0 5px;
          border-radius: 0 2px 2px 0;
          line-height: 34px;
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

        .ercode {
          width: 100px !important;
          height: 100px !important;
        }
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
            width: 35px;
            height: 30px;
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
          height: 80px;

          > .content-flex-hint,
          > .count-flex-text {
            line-height: 20px;
          }

          > .count-flex-input,
          > .count-text-input {
            width: 275px;
            height: 34px;
          }
        }
      }

      > .text-info-mention {
        position: relative;
        top: -20px;
        padding-left: 15px;

        &.need-tag-top {
          top: -45px;
        }

        > .currency-rule,
        > .prompt-message {
          line-height: 25px;
        }

        > .mention-button {
          margin-top: 41px;

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
      border: 1px solid $mainColor;

      > .triangle {
        border: 1px solid $mainColor;
        border-top: 1px solid transparent;
        border-right: 1px solid transparent;
        background-color: #1c1f32;
      }

      > .recharge-content {
        > .recharge-content-hint {
          color: $mainColor;
        }

        > .input-box {
          > .hint-input {
            color: #fff;
            background-color: #2d3651;
          }

          > .code-copy {
            color: #fff;
            background-color: $mainColor;
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
              color: $mainColor;
            }

            > .address-bg {
              background-color: #2d3651;
            }
          }
        }

        > .count-box {
          > .count-flex-box {
            > .content-flex-hint {
              color: $mainColor;
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
      border: 1px solid $mainColor;

      > .triangle {
        position: absolute;
        top: -7px;
        right: 108px;
        border: 1px solid $mainColor;
        border-top: 1px solid transparent;
        border-right: 1px solid transparent;
        background-color: #fff;
      }

      > .recharge-content {
        > .recharge-content-hint {
          color: $mainColor;
        }

        > .input-box {
          > .hint-input {
            height: 32px;
            border: 1px solid rgba(38, 47, 56, .1);
            line-height: 32px;
            color: #333;
            background: rgba(51, 143, 245, .1);
          }

          > .code-copy {
            color: #fff;
            background-color: $mainColor;
          }
        }

        > .recharge-content-title {
          color: #d45858;
        }
      }

      > .recharge-content-right {
        > .recharge-content-code {
          background-color: rgba(51, 143, 245, .1);
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
              color: $mainColor;
            }

            > .address-bg {
              background-color: #2d3651;
            }
          }
        }

        > .count-box {
          > .count-flex-box {
            > .content-flex-hint {
              color: $mainColor;
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
  }
</style>
