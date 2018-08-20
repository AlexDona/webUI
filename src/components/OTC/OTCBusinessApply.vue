<template>
  <div class="otc-business-apply-box otc">
    <!-- 1.0 导航 -->
    <NavCommon/>
    <!-- 2.0 -->
    <div class="business-apply-content">
      <!-- 2.1 商家特权 -->
      <div class="privilege">
        <div class="title font-weight700 font-size24">
          商家特权
        </div>
        <div class="content">
          <div class="common publish-AD">
            <img
              src="../../assets/develop/fabu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              发布广告
            </span>
            <p class="text font-size14">
              自由发布定价、浮价广告<br />
              买卖更灵活、额度更大
            </p>
          </div>
          <div class="common mark">
            <img
              src="../../assets/develop/biaozhi.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              独享标志
            </span>
            <p class="text font-size14">
              商家发布的广告会带有<br />
              专属“商”标志<br />
              增加交易信任
            </p>
          </div>
          <div class="common service">
            <img
              src="../../assets/develop/kefu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              专属客服
            </span>
            <p class="text font-size14">
              我们向商家提供7*24小时<br />
              专属客服服务
            </p>
          </div>
        </div>
      </div>
      <!-- 2.2 商家认证 -->
      <div class="approve">
        <!-- 2.2.1 商家认证 -->
        <div class="title font-weight700 font-size24">
          商家认证
        </div>
        <!-- 2.2.2 1234序号部分 -->
        <div class="number">
          <span class="common apply">商家申请</span>
          <span class="common send-email">发送邮件</span>
          <span class="common submit-apply">提交申请</span>
          <span class="common pass">审核通过</span>
        </div>
        <!-- 2.2.3 具体步骤部分 -->
        <div class="step">
          <div class="content">
            <h4 class="title">步骤一：准备资料</h4>
            <p>1.请下载《商家申请资料模板》，按照要求填写申请资料。</p>
            <p>2.录制视频资料，要求如下：</p>
            <p>手持本人身份证正面进行录制，保持录制过程中声音和影像都清晰。</p>
            <p>录制时要求诵读：本人（姓名），身份证号（身份证号码），我的资金来源合法可靠，自愿交易比特币等数字资产，本人充分了解数字货币及潜在风险，本人具有抗风险的能力并愿意承担一切风险。</p>
            <p>3.申请资质条件：①申请人需在OTC中成功交易100次。②申请人账户中FUC数量需≥500000</p>
            <h4 class="title">步骤二：发送申请邮件</h4>
            <p>请将以上申请资料和视频资料发送邮件至otc@FUBT.top，邮件主题为“申请成为OTC商家”。</p>
            <h4 class="title">步骤三：提交申请</h4>
            <p>发送邮件后，请在页面点击“确认申请”按钮，提交申请并同意冻结50,0000 FUC作为商家保证金。</p>
            <h4 class="title">步骤四：资料审核</h4>
            <p>我们将在3个工作日内对您的商家申请资料进行审核。我们会主动与您取得联系，请保持通讯畅通。</p>
            <h4 class="title tips">请您务必仔细阅读并透彻理解
              <a
                href="#"
                class="agree font-size14"
              >
                《认证商家协议》
              </a>
            </h4>
          </div>
        </div>
        <!-- 2.2.4 同意协议部分 -->
        <div class="agree font-size12">
          <span>
            <el-checkbox v-model="checked">
            </el-checkbox>
          </span>
          <span>我已阅读并同意</span>
          <span>
            <a href="#" class="agreement">
              《认证商家协议》
            </a>
            </span>
        </div>
        <!-- 2.2.5 申请为商家按钮部分 -->
        <div class="submit">
          <button class="button font-size16 cursor-pointer">
            申请成为商家
          </button>
        </div>
      </div>
    </div>
    <!-- 3.0 底部 -->
    <FooterCommon/>
  </div>
</template>
<script>
import NavCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import IconFontCommon from '../Common/IconFontCommon'
import {timeFilter} from '../../utils'
export default {
  components: {
    NavCommon, //  头部导航
    FooterCommon, //  底部
    IconFontCommon //  字体图标
  },
  data () {
    return {
      // 同意协议按钮:默认不勾选
      checked: false
    }
  },
  created () {
    require('../../../static/css/list/OTC/OTCBusinessApply.css')
    require('../../../static/css/theme/day/OTC/OTCBusinessApplyDay.css')
    require('../../../static/css/theme/night/OTC/OTCBusinessApplyNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCBusinessApply.scss);
.otc-business-apply-box{
  background-color: #1D2331;
  >.business-apply-content{
    width: 1150px;
    margin: 70px auto;
    padding-top: 20px;
    >.privilege{
      >.title{
        color: #fff;
        text-align: center;
      }
      >.content{
        display: flex;
        justify-content: space-around;
        >.common{
          margin-top: 120px;
          width: 210px;
          height: 250px;
          background: #202740;
          position: relative;
          text-align: center;
          &::before{
            content: "";
            position: absolute;
            top: -25px;
            left: 0;
            width: 0;
            height: 0;
            border-left: 105px solid transparent;
            border-right: 105px solid transparent;
            border-bottom: 25px solid #202740;
          }
          &::after{
            content: "";
            position: absolute;
            bottom: -25px;
            left: 0;
            width: 0;
            height: 0;
            border-left: 105px solid transparent;
            border-right: 105px solid transparent;
            border-top: 25px solid #202740;
          }
          >.title{
            width: 83px;
            color: #338FF5;
            padding-bottom: 10px;
            font-weight: 700;
            /*font-family: Microsoft YaHei;*/
            border-bottom: 1px dashed rgba(51, 143, 245,.3);
          }
          >.text{
            color: #fff;
            line-height: 2rem;
            margin-top: 60px;
          }
          >.location-picture{
            position: absolute;
            top: -67px;
            left: 75px;
          }
        }
      }
    }
    >.approve{
      >.title{
        color: #fff;
        text-align: center;
        margin-top: 100px;
      }
      >.number{
        width: 1150px;
        height: 52px;
        line-height: 58px;
        background: url(../../assets/develop/step.png) no-repeat center;
        margin-top: 70px;
        >.common{
          color: #fff;
          font-size: 18px;
        }
        >.apply{
          padding-left: 195px;
        }
        >.send-email{
          padding-left: 170px;
        }
        >.submit-apply{
          padding-left: 170px;
        }
        >.pass{
          padding-left: 172px;
        }
      }
      >.step{
        width: 1150px;
        height: 650px;
        margin-top: 70px;
        background: url(../../assets/develop/business-apply-bgm.png) no-repeat center;
        padding-left: 238px;
        padding-top: 40px;
        color: #8F9CA6;
        font-size: 14px;
        >.content{
          width: 620px;
          >p{
            line-height: 2rem;
          }
          >.title{
            color: #fff;
            margin-top: 30px;
            &:first-child{
              margin-top: 20px;
            }
          }
          >.tips{
            color: #4B5D6E;
            >.agree{
              color: #D45858;
            }
          }
        }
      }
      >.agree{
        text-align: center;
        color: #fff;
        margin-top: 70px;
        .agreement{
          color: #D45858;
        }
      }
      >.submit{
        text-align: center;
        margin-top: 20px;
        >.button{
          width: 300px;
          height: 50px;
          color: #fff;
          background: linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
          border-radius: 5px;
        }
      }
    }
  }
}
</style>
