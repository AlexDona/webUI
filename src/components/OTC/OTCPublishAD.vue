<template>
  <div class="otc-publish-AD-box otc">
    <!-- 商家发布广告挂单 -->
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 OTC发布广告内容 -->
    <div class="otc-publish-AD-content">
      <!--发布广告左侧主体内容-->
      <div class="publish-AD-left">
        <!-- 大标题发布广告 -->
        <div class="AD-title font-size20 padding-l15 font-weight700">
          发布广告
        </div>
        <!-- 大表单 -->
        <div class="AD-big-form">
          <!-- 选择 -->
          <div class="common choice">
            <div class="left display-inline-block">
              <p class="tips font-size14">选择</p>
              <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <div class="right-style display-inline-block">
                <el-select
                  v-model="activitedBuySellStyle"
                >
                  <el-option
                    v-for="item in buySellStyle"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="right-change display-inline-block">
                <el-select
                  v-model="activitedCoinName"
                  placeholder="BTC"
                >
                  <el-option
                    v-for="item in coinName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="double-sided-arrow display-inline-block">
                  <IconFontCommon
                    iconName="icon-zhuanhuannei"
                  />
                </span>
                <el-select
                  v-model="activitedCurrencyUnit"
                >
                  <!-- <el-option
                    v-for="item in currencyUnit"
                    :key="item.id"
                    :label="item.shortName"
                    :value="item.id">
                  </el-option> -->
                  <el-option
                    v-for="item in currencyUnit"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <!-- 销售价格 -->
          <div class="common sale-price">
            <div class="left display-inline-block">
                <p class="tips font-size14">销售价格</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <p>定价设置</p>
              <div class="input">
                <input
                  type="text"
                  class="price-input"
                  placeholder="卖出单价"
                >
                <span class="unit font-size12">CNY</span>
              </div>
            </div>
          </div>
          <!-- 交易方式 -->
          <div class="common trade-way">
            <div class="left display-inline-block">
                <p class="tips font-size14">交易方式</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <el-checkbox-group v-model="checkList">
                <el-checkbox label="银行转账"></el-checkbox>
                <el-checkbox label="微信"></el-checkbox>
                <el-checkbox label="支付宝"></el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!-- 数量与限额 -->
          <div class="common sum-limit">
            <div class="left display-inline-block">
                <p class="tips font-size14">数量与限额</p>
                <p class="warning font-size12">必填</p>
            </div>
            <div class="right display-inline-block">
              <p>交易数量</p>
              <div class="input-top">
                <input
                  type="text"
                  class="input-sum"
                  placeholder="交易数量"
                >
                <span class="unit font-size14">BTC</span>
              </div>
              <p class="text">
                <span class="money-min">单笔最小限额</span>
                <span class="money-max">单笔最大限额</span>
              </p>
              <div class="input-bottom">
                <input
                  type="text"
                  class="input-min"
                  placeholder="单笔最小限额"
                >
                <span class="unit font-size14">CNY</span>
                <input
                  type="text"
                  class="input-max"
                  placeholder="单笔最大限额"
                >
                <span class="unit font-size14">CNY</span>
              </div>
            </div>
          </div>
          <!-- 备注 -->
          <div class="common remark">
            <div class="left display-inline-block">
                <p class="tips font-size14">备注</p>
                <p class="warning font-size12">建议填写</p>
            </div>
            <div class="right display-inline-block">
              <el-input
                type="textarea"
                auto-complete="off"
                placeholder="输入留言: 请说明有关于您交易的相关条款或者其它您想让对方获悉得信息，以便对方和您快速交易"
              >
              </el-input>
            </div>
          </div>
          <!-- 限制设置 -->
          <div class="common limit-set">
            <div class="left display-inline-block">
                <p class="tips font-size14">限制设置</p>
                <p class="warning font-size12">选填</p>
            </div>
            <div class="right display-inline-block">
              <div>
                同时处理最大订单数（0=不限制）
                <span class="question-mark cursor-pointer">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    placement="bottom-start"
                  >
                    <div slot="content">
                      设置该限制，可以避免大量订单同时涌进，导致处理不过来的情况，比如当您设定为 2 时，最多只会有 2 笔订单可同时向您下单，
                      <br/>
                      其余卖家会看到「广告主处理订单已达上限，请稍候再试」，待您处理完后才允许下一笔订单进入
                    </div>
                    <IconFontCommon
                      class="font-size14"
                      iconName="icon-wenhao"
                    />
                  </el-tooltip>
                </span>
              </div>
              <div>
                <input
                  type="text"
                  class="input-limit"
                >
              </div>
              <div>
                卖家必须成交过几次（0=不限制）
              </div>
              <div>
                <input
                  type="text"
                  class="input-limit"
                >
              </div>
            </div>
          </div>
          <!-- 提交按钮 -->
          <div class="button">
            <button
              class="AD-button font-size14 cursor-pointer"
              @click.prevent="showPasswordDialog"
            >
              发布广告
            </button>
          </div>
          <!-- 发布广告弹出交易密码框 -->
          <div class="password-dialog">
            <el-dialog
              title="交易密码"
              :visible.sync="dialogVisible"
              top="25vh"
              width="470"
            >
              <div>请输入交易密码</div>
              <div class="input">
                <input
                  type="password"
                  class="password-input"
                >
              </div>
              <div class="error-info">
                <!-- 错误提示 -->
                <div class="tips">错误提示</div>
              </div>
              <span
                slot="footer"
                class="dialog-footer">
                  <el-button
                    type="primary"
                    @click="publishADSubmitButton"
                  >
                    提 交
                  </el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
      <!--发布广告右侧提示信息-->
      <div class="publish-AD-right">
        <div class="publish-tips">
          <div class="title font-size14">发布说明：</div>
          <p class="tip font-size12">
            ●FUBT.TOP 为了保证用户的交易安全，将采用
            数字货币托管系统。严禁绕过平台私下交易，
            违者将自行承担损失，且永久封号；
          </p>
          <p class="tip font-size12">
            ●请在交易说明及交易备注中，详细写下您所希
            望的交易条件，以及与您交易所需注意的事项，
            明确的信息将提升您的交易成功机率。
          </p>
          <p class="tip font-size12">
            ●请勿在 FUBT.TOP尝试欺诈行为，违者将会导
            致帐号被冻结，并承担法律责任。
          </p>
          <p class="tip font-size12">
            ●发布广告后请履行契约精神，恶意抬价或者是
            反悔，被投诉将冻结账户 3-15 天不等
          </p>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 引入组件
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
// 引入接口
import {getOTCAvailableCurrency, getMerchantAvailablelegalTender} from '../../utils/api/apiDoc'
// 引入提示信息
import {returnAjaxMessage} from '../../utils/commonFunc'
// 引入全局变量和方法
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      dialogVisible: false,
      // 选择模块下拉列表循环数组
      // 1.0发布广告类型数组
      activitedBuySellStyle: '出售', // 选中的类型
      buySellStyle: [
        {
          value: '选项1',
          label: '出售'
        },
        {
          value: '选项2',
          label: '购买'
        }
      ],
      // 2.0币种名字下拉数组：商家可用币种
      activitedCoinName: 'BTC', // 选中的币种名字
      coinName: [
        {
          value: '选项1',
          label: 'BTC'
        },
        {
          value: '选项2',
          label: 'ETH'
        },
        {
          value: '选项3',
          label: 'EIKJ'
        },
        {
          value: '选项4',
          label: 'FUR'
        }
      ],
      // 3.0各个国家货比单位:可用法币
      activitedCurrencyUnit: '人民币', // 选中的各个国家货比单位
      currencyUnit: [
        {
          value: '选项1',
          label: '人民币'
        },
        {
          value: '选项2',
          label: '美元'
        },
        {
          value: '选项3',
          label: '韩元'
        },
        {
          value: '选项4',
          label: '港币'
        },
        {
          value: '选项5',
          label: '欧元'
        }
      ],
      // 交易方式默认选中项
      checkList: ['银行转账']
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCPublishAD.css')
    require('../../../static/css/theme/day/OTC/OTCPublishADDay.css')
    require('../../../static/css/theme/night/OTC/OTCPublishADNight.css')
    // 从全局获得商户id
    console.log(this.merchantID)
    // 1.0 otc可用币种查询：
    // this.getOTCAvailableCurrencyList()
    // 2.0 otc可用法币查询：
    // this.getMerchantAvailablelegalTenderList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
    ]),
    //  1.0 otc可用币种查询：
    async getOTCAvailableCurrencyList () {
      const data = await getOTCAvailableCurrency({
        partnerId: this.merchantID
      })
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.coinName = data.data.data.list
      }
    },
    // 2.0 otc可用法币查询
    async getMerchantAvailablelegalTenderList () {
      const data = await getMerchantAvailablelegalTender({
        partnerId: this.merchantID
      })
      // console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据正确的逻辑
        // this.currencyUnit = data.data.data.list
      }
    },
    // 3.0 点击发布广告弹出输入交易密码框
    showPasswordDialog () {
      this.dialogVisible = true
    },
    // 4.0 点击密码框中的提交按提交钮发布广告
    publishADSubmitButton () {
      console.log('成功提交了')
      alert('成功提交了')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      merchantID: state => state.common.merchantID
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import url(../../../static/css/scss/OTC/OTCPublishAD.scss);
.otc-publish-AD-box{
  background-color: #1D2331;
  >.otc-publish-AD-content{
    width: 1150px;
    margin: 70px auto;
    // background-color: #2B2B2B;
    display: flex;
    flex: 3;
    padding-top: 50px;
    >.publish-AD-left{
      flex: 2;
      // background-color: #1B2136;
      >.AD-title{
        height: 30px;
        line-height: 30px;
        color: #338FF5;
        border-left: 3px solid #338FF5;
        margin-bottom: 30px;
      }
      >.AD-big-form{
        width: 720px;
        >.common{
          box-sizing: border-box;
          padding: 30px 0;
          border-bottom: 1px solid #39424D;
          >.left{
            width: 110px;
            vertical-align: top;
            >.tips{
              color: #fff;
            }
            >.warning{
              color: #3E79D6;
            }
          }
          >.right{
            color: #9DA5B3;
            font-size: 14px;
          }
        }
        >.choice{
          // box-sizing: border-box;
          // padding-bottom: 30px;
          // border-bottom: 1px solid #39424D;
          >.left{
            // width: 110px;
            // vertical-align: middle;
            >.tips{
              // color: #fff;
            }
            >.warning{
              // color: #3E79D6;
            }
          }
          >.right{
            >.right-style{
              margin-right: 50px;
            }
            >.right-change{
              >.double-sided-arrow{
                /*transform:rotate(180deg);*/
                color: #797979;
                margin: 0 10px;
              }
            }
          }
        }
        >.sale-price{
          >.right{
            >.input{
              margin: 10px 0 30px 0;
              >.price-input{
                width: 234px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 36px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
            }
          }
        }
        >.trade-way{
          >.right{
          }
        }
        >.sum-limit{
          >.right{
            >.input-top{
              margin-top: 15px;
              >.input-sum{
                width: 198px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
            }
            >.text{
              margin-top: 20px;
              >.money-min{

              }
              >.money-max{
                margin-left: 166px;
              }
            }
            >.input-bottom{
              margin-top: 10px;
              >.input-min,.input-max{
                width: 140px;
                height: 36px;
                background-color: #333A41;
                padding-left: 10px;
                color: #9DA5B3;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
              }
              >.unit{
                width: 60px;
                height: 36px;
                line-height: 36px;
                color: #7EA9E4;
                background-color: #414951;
                display: inline-block;
                vertical-align: top;
                margin-left: -4px;
                text-align: center;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
              }
              >.input-max{
                margin-left: 40px;
              }
            }
          }
        }
        >.remark{
          >.right{
          }
        }
        >.limit-set{
          border-bottom: 0;
          >.right{
            .question-mark{
              // cursor: pointer;
            }
            .input-limit{
              width: 258px;
              height: 36px;
              background-color: #333A41;
              padding-left: 10px;
              border-radius: 4px;
              margin: 15px 0;
            }
          }
        }
        >.button{
          text-align: center;
          margin-top: 20px;
          >.AD-button{
            width: 590px;
            height: 44px;
            color: #FFFFFF;
            background:linear-gradient(9deg,rgba(43,57,110,1),rgba(42,80,130,1));
            border-radius: 4px;
          }
        }
      }
    }
    >.publish-AD-right{
      flex: 1;
      >.publish-tips{
        width: 250px;
        margin-left: 40px;
        >.title{
          color: #338FF5;
        }
        >.tip{
          color: #9DA5B3;
          line-height: 1.5rem;
        }
      }
    }
  }
}
</style>
