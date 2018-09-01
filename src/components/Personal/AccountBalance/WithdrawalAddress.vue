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
              <el-select
                v-model="currencyValue"
                @change="changeId"
              >
                <el-option
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :label="item.name"
                  :value="item.coinId"
                >
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
            <div>{{ s.row.coinName }}</div>
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
            <div>{{ s.row.address }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope = "s">
            <div
              @click="cancelId(s.row.id)"
              :id="s.row.id"
            >
              {{ operation }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        background
        v-show="activeName === 'current-entrust' && gainAddressList.length"
        layout="prev, pager, next"
        :page-count="totalPageForMyEntrust"
        @current-change="changeCurrentPage"
      >
      </el-pagination>
      <el-dialog
        :title="删除提币地址"
        :visible.sync="dialogVisible"
        width="300px" center
      >
        <span class="info">确定删除提币地址吗？</span>
        <span slot="footer" class="dialog-footer">
         <!--确 定 取 消-->
          <el-button
            type="primary"
            @click="confirm"
            :disabled="statel"
          >
            确 定
          </el-button>
          <el-button @click="dialogVisible = false">
            取 消
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {inquireWithdrawalAddressList, addNewWithdrawalAddress, deleteUserWithdrawAddress} from '../../../utils/api/apiDoc'
import {returnAjaxMessage} from '../../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      errorMsg: '', // 错误信息提示
      // 币种列表
      currencyValue: '',
      currencyList: [],
      mentionRemark: '', // 提现备注
      prepaidAddress: '', // 提币地址
      // 地址列表
      gainAddressList: [],
      operation: '删除',
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      dialogVisible: false, // 取消弹窗默认隐藏
      deleteWithdrawalId: '' // 每行数据ID
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/WithdrawalAddress.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/WithdrawalAddressDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/WithdrawalAddressNight.css')
    // this.WithdrawalAddressList()
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
      // if (!this.prepaidAddress) {
      //   this.errorMsg = '提币地址不能为空'
      // }
      this.stateSubmitAddAddress()
      console.log('prepaidAddress')
    },
    // 资产币种下拉
    changeId (e) {
      this.currencyList.forEach(item => {
        if (e === item.id) {
          this.currencyValue = e
          console.log(item.currencyValue)
          this.stateSubmitAddAddress(e)
        }
      })
    },
    // 新增用户提币地址按钮
    async stateSubmitAddAddress () {
      let data
      let param = {
        coinId: this.currencyValue, // 币种coinId
        remark: this.mentionRemark, // 备注
        address: this.prepaidAddress // 充值地址
      }
      data = await addNewWithdrawalAddress(param)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.WithdrawalAddressList()
      }
    },
    /**
     *  刚进页面时候 提币地址列表查询
     */
    async WithdrawalAddressList () {
      let params = {
        currentPage: this.currentPageForMyEntrust,
        pageSize: this.pageSize
      }
      let data = await inquireWithdrawalAddressList(params)
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回列表数据
        this.currencyList = data.data.data.canWithdrawPartnerCoinList
        this.currencyValue = data.data.data.canWithdrawPartnerCoinList[0].name
        this.currencyValue = data.data.data.canWithdrawPartnerCoinList[0].coinId
        this.gainAddressList = data.data.data.UserWithdrawAddressPage.list
        this.totalPageForMyEntrust = data.data.data.UserWithdrawAddressPage.pages - 0
        console.log(this.currencyList)
        console.log(this.currencyValue)
      }
    },
    // 删除提币地址
    cancelId (id) {
      console.log(id)
      this.dialogVisible = true
      this.deleteWithdrawalId = id
      this.gainAddressList.forEach((fid, item) => {
        if (item.id == id) {
          this.gainAddressList = item
        }
      })
    },
    // 确认删除提币地址
    confirm () {
      this.deleteWithdrawal()
    },
    async deleteWithdrawal () {
      let data
      let param = {
        id: this.deleteWithdrawalId // 列表id
      }
      data = await deleteUserWithdrawAddress(param)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.WithdrawalAddressList()
        this.dialogVisible = false
        console.log(data)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.WithdrawalAddressList()
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
