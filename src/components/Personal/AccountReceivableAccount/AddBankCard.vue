<template>
  <div
    class="add-bank card"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="add-bank-main margin25">
      <header class="add-bank-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          设置银行卡
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
            返回我的账户
        </span>
      </header>
      <div class="add-bank-content">
        <header class="bank-content-title">
          *请确认您的银行卡已开启短信通知功能
        </header>
        <div class="bank-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="名 称：">
              <span class="bank-content-name">杨</span>
            </el-form-item>
            <el-form-item label="银  行  名  称：">
              <input class="bank-input border-radius2"/>
            </el-form-item>
            <el-form-item label="银  行  卡  号：">
              <input class="bank-input border-radius2"/>
            </el-form-item>
            <el-form-item label="支  行  地  址：">
              <input class="bank-input border-radius2" />
            </el-form-item>
            <el-form-item label="手  机  号  码：">
              <el-input>
                <template slot="append">验证码</template>
              </el-input>
            </el-form-item>
            <el-form-item label="短信验证码：">
              <input class="bank-input border-radius2"/>
            </el-form-item>
            <button class="bank-button border-radius4">
              确认修改
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <FooterCommon />
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
import IconFontCommon from '../../Common/IconFontCommon'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {
      name: '', // 名称
      bankName: '', // 银行名称
      bankCard: '', // 银行卡号
      branchAddress: '', // 支行地址
      code: '' // 短信验证码
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddBankCard.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddBankCardDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddBankCardNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('fifth')
      this.$router.go(-1)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountReceivableAccount/AddBankCard.scss";
  .add-bank {
    >.add-bank-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.add-bank-header {
        display: flex;
        >.header-content-right,
        .header-content-left {
          flex: 1;
        }
        >.header-content-right {
          text-align: right;
        }
        >.header-content-left {
          text-align: left;
        }
      }
      >.add-bank-content {
        min-height: 300px;
        margin: 16px 25px;
        >.bank-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.bank-content-from {
          width: 500px;
          margin-left: 55px;
          .bank-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .bank-button {
            padding: 9px 33px;
            margin: 30px 0 50px 25px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-bank-main {
        background-color: #1E2636;
        >.add-bank-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-bank-content {
          .bank-content-name {
            color: #fff;
          }
          >.bank-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.bank-content-from {
            .bank-input {
              border: 1px solid #485776;
              color: #fff;
            }
            .bank-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .add-bank-main {
        background-color: #ccc;
        > .add-bank-header {
          border-bottom: 1px solid #ccc;
        }
        >.add-bank-content {
          >.bank-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.bank-content-from {
            .bank-input {
              border: 1px solid #000;
              color: #000;
            }
            .bank-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
