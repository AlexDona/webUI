<template>
  <div
    class="withdrawal-address personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="withdrawal-address-main">
      <header class="withdrawal-header personal-height40 line-height40 background-color padding-left23 border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          提币地址
        </span>
      </header>
      <div class="withdrawal-address-content padding-left15">
        <div class="withdrawal-address-box paddinglr20 margin-top30">
          <el-form ref="form" label-width="70px">
            <el-form-item label="币种">
              <el-select v-model="currencyValue">
                <el-option
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <input
                class="form-input border-radius4 padding-left15"
                v-model="mentionRemark"
                @focus="emptyStatus"
              />
            </el-form-item>
            <el-form-item label="充值地址">
              <input
                class="form-input border-radius4 padding-left15"
                v-model="prepaidAddress"
                @focus="emptyStatus"
              />
            </el-form-item>
            <div v-show="errorMsg">{{ errorMsg }}</div>
            <button
              class="form-button border-radius4 cursor-pointer"
              @click="addAddress"
            >
              增加
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="withdrawal-address-main margin-top9">
      <header class="address-list-header background-color margin25 border-radius2">
        <span class="header-content display-inline-block font-size16 cursor-pointer">
          地址列表
        </span>
      </header>
      <el-table
        :data="gainAddressList"
        style="width: 100%"
      >
        <el-table-column
          label="币种"
          width="180"
        >
          <template slot-scope = "s">
            <div>{{ s.row.currency }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          width="180"
        >
          <template slot-scope = "s">
            <div>{{ s.row.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="提币地址"
          width="350"
        >
          <template slot-scope = "s">
            <div>{{ s.row.mentionAddress }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope = "s">
            <div>{{ s.row.operation }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      errorMsg: '', // 错误信息提示
      // 币种列表
      currencyValue: 'BTC',
      currencyList: [{
        value: '1',
        label: 'BTC'
      }, {
        value: '2',
        label: 'EHT'
      }, {
        value: '3',
        label: 'EHT'
      }, {
        value: '4',
        label: 'FUC'
      }, {
        value: '5',
        label: 'HT'
      }],
      mentionRemark: '', // 提现备注
      prepaidAddress: '', // 提币地址
      // 地址列表
      gainAddressList: [{
        currency: 'BTC',
        remark: '王小虎',
        mentionAddress: 'HDFJKASDFHKLASHDFASLDFHASDFLAHSDFJ',
        operation: '删除'
      }, {
        currency: 'BTC',
        remark: '王小虎',
        mentionAddress: 'HDFJKASDFHKLASHDFASLDFHASDFLAHSDFJ',
        operation: '删除'
      }, {
        currency: 'BTC',
        remark: '王小虎',
        mentionAddress: 'HDFJKASDFHKLASHDFASLDFHASDFLAHSDFJ',
        operation: '删除'
      }, {
        currency: 'BTC',
        remark: '王小虎',
        mentionAddress: 'HDFJKASDFHKLASHDFASLDFHASDFLAHSDFJ',
        operation: '删除'
      }]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/WithdrawalAddress.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/WithdrawalAddressDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/WithdrawalAddressNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    addAddress () {
      if (!this.prepaidAddress) {
        this.errorMsg = '提币地址不能为空'
      }
      console.log('prepaidAddress')
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountBalance/WithdrawalAddress";
  .withdrawal-address{
    >.withdrawal-address-main{
      min-height: 390px;
      >.withdrawal-header {
        margin-bottom: 2px;
      }
      >.withdrawal-address-content {
        >.withdrawal-address-box {
          min-height: 100px;
          .form-input,
          .form-button {
            width: 324px;
            height: 34px;
            box-sizing: border-box;
          }
          .form-button {
            margin: 10px 0 0 70px;
          }
        }
      }
      >.address-list-header {
        height: 50px;
        line-height: 50px;
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.withdrawal-address-main {
        background-color: #1e2636;
        >.withdrawal-header {
          background-color: #1E2636;
          box-shadow:2px 0px 3px rgba(24,30,42,1);
          >.header-content {
            color: #fff;
          }
        }
        >.withdrawal-address-content {
          >.withdrawal-address-box {
            .form-input {
              border: 1px solid #485776;
              color: #fff;
            }
            .form-input:focus {
              border: 1px solid #338FF5;
            }
            .form-button {
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
        >.address-list-header {
          color: #fff;
          border-bottom: 1px solid #39424D;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      /*>.withdrawal-address-main {*/
        /*background-color: #ccc;*/
        /*>.withdrawal-header {*/
          /*background-color: #1E2636;*/
          /*box-shadow:2px 0px 3px rgba(24,30,42,1);*/
        /*}*/
        /*>.withdrawal-address-content {*/
          /*>.withdrawal-address-box {*/
            /*.form-input {*/
              /*border: 1px solid #485776;*/
                /*color: #fff;*/
            /*}*/
          /*}*/
        /*}*/
      /*}*/
    }
  }
</style>
