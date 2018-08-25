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
          <el-form label-width="80px">
            <el-form-item label="资产">
              <el-select v-model="currencyValue">
                <el-option
                  v-for="item in currencyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="余额">
              <input
                disabled
                class="form-input-common-state border-radius4 padding-l15"
                ref="balance"
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
            <el-form-item label="验证码">
              <el-input
                @focus="emptyStatus"
                ref="code"
                @keyup="changeInputValue('code')"
              >
                <template slot="append">发送验证码</template>
              </el-input>
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
                <div>{{ shift }}</div>
                <!--<div>{{ $t(rollOut) }}</div>-->
              </template>
            </el-table-column>
            <el-table-column
              label="对方UID"
            >
              <template slot-scope = "s">
                <div>{{ s.row.otherUID }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="资产"
            >
              <template slot-scope = "s">
                <div>{{ s.row.asset }}</div>
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
              label="金额(FBT)"
            >
              <template slot-scope = "s">
                <div>{{ s.row.sum }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="时间"
              width="180px"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.time) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
            >
              <template slot-scope = "s">
                <div>{{ s.row.state }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
            >
              <template slot-scope = "s">
                <!--<div>{{ s.row.operate }}</div>-->
                <!--v-if="scope.row.fstate == 1 && scope.row.fuid == $store.state.userInfo.fshowid"-->
                <!--v-if="scope.row.fstate == 1 && scope.row.fuid !== $store.state.userInfo.fshowid"-->
                <div
                  class="cursor-pointer"
                  @click="cancelId(s.row.fid)"
                  :id="s.row.fid"
                >
                  {{ cancel }}
                </div>
                <!--<div-->
                  <!--class="cursor"-->
                  <!--@click="paymentId(s.row.fid)"-->
                  <!--:id="s.row.fid"-->
                <!--&gt;-->
                  <!--{{ $t(payment) }}-->
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
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {timeFilter} from '../../../utils/index'
export default {
  components: {},
  // props,
  data () {
    return {
      errorMsg: '', // 错误信息提示
      showStatusUserInfo: {}, // 个人信息
      // 币种
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
      // push资产form
      balance: '', // 余额
      buyUID: '', // 买方UID
      count: '', // 数量
      price: '', // 价格
      transactionPassword: '', // 交易密码
      code: '', // 验证码
      shift: '转入', // 转入
      rollOut: '转出', // 转出
      payment: '付款', // 付款
      cancel: '撤销', // 取消
      dialogVisible: false, // 取消弹窗默认隐藏
      pushUID: '', // 每行数据ID
      // push列表记录
      pushRecordList: [
        {
          fid: 1,
          otherUID: '3355446',
          asset: '123465',
          count: '265',
          price: '0.326',
          sum: '12346565',
          time: '2018-08-04 10:30:41',
          state: '未支付'
        }, {
          fid: 2,
          otherUID: '3355446',
          asset: '123465',
          count: '265',
          price: '0.326',
          sum: '12346565',
          time: '2018-08-04 10:30:41',
          state: '未支付'
        }, {
          fid: 3,
          otherUID: '3355446',
          asset: '123465',
          count: '265',
          price: '0.326',
          sum: '12346565',
          time: '2018-08-04 10:30:41',
          state: '未支付'
        }, {
          fid: 4,
          otherUID: '3355446',
          asset: '123465',
          count: '265',
          price: '0.326',
          sum: '12346565',
          time: '2018-08-04 10:30:41',
          state: '未支付'
        }, {
          fid: 5,
          otherUID: '3355446',
          asset: '123465',
          count: '265',
          price: '0.326',
          sum: '12346565',
          time: '2018-08-04 10:30:41',
          state: '未支付'
        }]
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
    this.showStatusUserInfo = this.userInfo
    console.log(this.showStatusUserInfo)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 清空内容信息
    emptyStatus () {
      this.errorMsg = ''
    },
    // 修改input value
    changeInputValue (ref) {
      // console.dir(this.$refs[ref])
      // console.log(this[ref])
      this[ref] = this.$refs[ref].value
    },
    // 提交push
    getStatusSubmit () {
      console.log(this.buyUID)
      if (!this.buyUID) {
        this.errorMsg = '买方UID不能为空'
      } else if (!this.count) {
        this.errorMsg = '数量不能为空'
      } else if (!this.price) {
        this.errorMsg = '价格不能为空'
      } else if (!this.transactionPassword) {
        this.errorMsg = '交易密码不能为空'
      } else if (!this.code) {
        this.errorMsg = '验证码不能为空'
      } else {
        this.errorMsg = ''
      }
      console.log(1)
    },
    // 取消push
    cancelId (id) {
      console.log(id)
      this.dialogVisible = true
      this.pushUID = id
      this.pushRecordList.forEach((fid, item) => {
        if (item.fid == fid) {
          this.pushRecordList = item
        }
      })
    },
    confirm () {
      console.log('确认')
    }
    // 付款
    // paymentId (id) {
    //   this.pushMsg = ''
    //   this.paymentVisible = true
    //   this.pushuid = id
    //   this.pushList.forEach((item, index) => {
    //     if (item.fid == id) {
    //       this.push = item.fcoin_s
    //       this.pros = item.fprice
    //       this.number = item.fcount
    //       this.money = item.famount
    //     }
    //   });
    // },
  },
  filter: {},
  computed: {
    ...mapState([
      'theme',
      'userInfo'
    ])
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
            margin-left: 80px;
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
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }
</style>
