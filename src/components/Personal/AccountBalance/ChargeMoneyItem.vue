<!--个人中心 - 我的资产 - 充币 item -->
<template>
  <div
    v-show="isShow"
    class="recharge-list display-flex"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <p class="triangle"></p>
    <div class='recharge-content'>
      <p class="recharge-content-hint font-size12">
        <!--充值地址-->
        {{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_site') }}
      </p>
      <div
        class="input-box"
      >
        <input
          class="hint-input border-radius2 padding-l15 float-left"
          disabled
          v-model="chargeMoneyAddress"
        />
        <span
          class="code-copy cursor-pointer display-inline-block float-left text-align-c"
          v-clipboard:copy="chargeMoneyAddress"
          v-clipboard:success="onCopy"
          v-clipboard:error="onError"
        >
          <!--复制地址-->
          {{ $t('M.comm_copy') }}{{ $t('M.comm_site') }}
        </span>
      </div>
      <div class="recharge-content-title font-size12 margin-top9 float-left">
        <!--转账时请务必备注（否则后果自负）：UID-->
        <p v-if="isNeedTag == 'true'">
          * {{ $t('M.user_assets_recharge_hint0').format([currencyName,currencyName]) }}{{rechargeNoteInfo}}
        </p>
        <!--禁止充值除 之外的其他资产，任何非 资产充值将不可找回-->
        <p>* {{ $t('M.user_assets_recharge_hint1').format([currencyName, currencyName]) }}</p>
        <!--往该地址充值，汇款完成，等待网络自动确认（{}个确认）后系统自动到账-->
        <p>* {{ $t('M.user_assets_recharge_hint4').format([successCount]) }}</p>
        <!--为了快速到账，充值时可以适当提高网络手续费-->
        <p>* {{ $t('M.user_assets_recharge_hint5') }}</p>
        <!-- 3、最小充值金额{}。 -->
        <p>* {{$t('M.user_assets_recharge_hint6').format([minRechargeAmount])}}</p>
      </div>
    </div>
    <div class='recharge-content-right flex1'>
      <p class="recharge-content-code margin-top20 float-left">
        <Qrcode
          class="ercode"
          :value="chargeMoneyAddress"
          :options="{ size: 100 }"
        >
        </Qrcode>
      </p>
      <p
        class="code-list text-align-r float-right cursor-pointer font-size12"
        @click.prevent="jumpToOtherTab('billing-details', coinId, 1)"
      >
        <!--充值记录-->
        {{ $t('M.comm_charge_recharge') }}{{ $t('M.comm_record') }}
      </p>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import VueClipboard from 'vue-clipboard2'
import Qrcode from '../../Common/Qrcode'
import Vue from 'vue'
Vue.use(VueClipboard)

// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
    Qrcode
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
  data () {
    return {}
  },
  created () {
    console.log(this.minRechargeAmount)
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
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
    onCopy (e) {
      // 已拷贝
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: store => store.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .recharge-list {
    position: relative;
    z-index: 2;
    padding: 20px 6px;

    > .triangle {
      position: absolute;
      top: -7px;
      right: 115px;
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
        color: #338ff5;

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
      padding: 0 20px;

      .recharge-content-hint {
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
            top: 38px;
            right: 1px;
            width: 35px;
            height: 34px;
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
      border: 1px solid #338ff5;

      > .triangle {
        border-top: 1px solid transparent;
        border-bottom: 1px solid #338ff5;
        border-left: 1px solid #338ff5;
        background-color: #1c1f32;
        border-right: 1px solid transparent;
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

      > .triangle {
        position: absolute;
        top: -7px;
        right: 102px;
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
  }
</style>
