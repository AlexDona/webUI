<template>
  <div
    class="vip-main personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--头部-->
    <HeaderCommon/>
    <div class="header-content">
      <img
        class="images"
        :src="vipPictureBanner"
      >
    </div>
    <div class="content-main-content">
      <!--开通vip页面-->
      <div
        class="content-main display-flex"
        v-show="showOpenTheVIPPage"
      >
        <div class="content-module cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP1
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">九折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span class="content-discount-color">100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button
              class="click-btn cursor-pointer"
              @click.prevent="statusImmediatelyOpened('vip1')"
            >
              立即开通
            </button>
          </p>
        </div>
        <div class="content-module content-border-rl cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP2
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">八折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button
              class="click-btn cursor-pointer"
              @click.prevent="statusImmediatelyOpened('vip2')"
            >
              立即开通
            </button>
          </p>
        </div>
        <div class="content-module cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP3
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">七折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button
              class="click-btn cursor-pointer"
              @click.prevent="statusImmediatelyOpened('vip3')"
            >
              立即开通
            </button>
          </p>
        </div>
        <div class="content-module margin-top30 cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP4
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">六折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button
              class="click-btn cursor-pointer"
              @click.prevent="statusImmediatelyOpened('vip4')"
            >
              立即开通
            </button>
          </p>
        </div>
        <div class="content-module margin-top30 content-border-rl cursor-pointer">
          <p class="content-vip-one text-align-c">
            VIP5
          </p>
          <p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>
          <p class="content-text line-height50 text-align-c font-size18">五折</p>
          <p class="content-discount line-height50 text-align-c font-size16">
            <span>100FUC</span>
            <span>/月</span>
          </p>
          <p class="content-button">
            <button
              class="click-btn cursor-pointer"
              @click.prevent="statusImmediatelyOpened('vip5')"
            >
              立即开通
            </button>
          </p>
        </div>
        <!--<div class="content-module margin-top30 cursor-pointer">-->
          <!--<p class="content-vip-one text-align-c">-->
            <!--VIP6-->
          <!--</p>-->
          <!--<p class="content-discount line-height50 text-align-c font-size16">手续费折扣</p>-->
          <!--<p class="content-text line-height50 text-align-c font-size18">四折</p>-->
          <!--<p class="content-discount line-height50 text-align-c font-size16">-->
            <!--<span>100FUC</span>-->
            <!--<span>/月</span>-->
          <!--</p>-->
          <!--<p class="content-button">-->
            <!--<button-->
              <!--class="click-btn cursor-pointer"-->
              <!--@click.prevent="statusImmediatelyOpened('vip6')"-->
            <!--&gt;-->
              <!--立即开通-->
            <!--</button>-->
          <!--</p>-->
        <!--</div>-->
        <p class="content-info-hint text-align-r padding-right23 box-sizing font-size12">
          <span>还没有FUC?</span>
          <span
            class="hint-color cursor-pointer"
            @click.prevent="returnSuperior"
          >
            立即购买
          </span>
        </p>
      </div>
      <!--开通vip详情页面-->
      <div
        class="content-detail-page"
        v-show="vipShowDetailsPage"
      >
        <div class="detail-page-grade display-flex">
          <div class="page-grade-title font-size14">开通等级</div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(1)"
            :class="{ blue:active == 1}"
          >
            <p class="font-size16 grade-color font-weight600">VIP1</p>
            <p class="font-size12 grade-height">手续费9折</p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(2)"
            :class="{ blue:active == 2}"
          >
            <p class="font-size16 grade-color font-weight600">VIP2</p>
            <p class="font-size12 grade-height">手续费8折</p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(3)"
            :class="{ blue:active == 3}"
          >
            <p class="font-size16 grade-color font-weight600">VIP3</p>
            <p class="font-size12 grade-height">手续费7折</p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(4)"
            :class="{ blue:active == 4}"
          >
            <p class="font-size16 grade-color font-weight600">VIP4</p>
            <p class="font-size12 grade-height">手续费6折</p>
          </div>
          <div
            class="grade cursor-pointer text-align-c"
            @click.prevent="stateOpeningLevel(5)"
            :class="{ blue:active == 5}"
          >
            <p class="font-size16 grade-color font-weight600">VIP5</p>
            <p class="font-size12 grade-height">手续费5折</p>
          </div>
          <!--<div-->
            <!--class="grade cursor-pointer text-align-c"-->
            <!--@click.prevent="stateOpeningLevel(6)"-->
            <!--:class="{ blue:active == 6}"-->
          <!--&gt;-->
            <!--<p class="font-size16 grade-color font-weight600">VIP6</p>-->
            <!--<p class="font-size12 grade-height">手续费4折</p>-->
          <!--</div>-->
        </div>
        <div
          class="detail-page-duration display-flex"
        >
          <div class="duration-title font-size14">开通时长</div>
          <div
            class="duration cursor-pointer cursor-pointer text-align-c"
            @click.prevent="changeMonth(3, filteredData[0].id)"
          >
            <p class="duration-month font-size16">
              3个月
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[0].value}}FUC
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(6, filteredData[1].id)"
          >
            <p class="duration-month font-size16">
              6个月
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[1].value}}FUC
            </p>
            <p class="duration-through ">
              600FUC
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(12, filteredData[2].id)"
          >
            <p class="duration-month font-size16">
              12个月
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[2].value}}FUC
            </p>
            <p class="duration-through">
              1200FUC
            </p>
          </div>
          <div
            class="duration duration-left cursor-pointer text-align-c"
            @click.prevent="changeMonth(1, filteredData[3].id)"
          >
            <p class="duration-month font-size16">
              1个月
            </p>
            <p class="duration-currency font-size18">
              {{filteredData[3].value}}FUC
            </p>
          </div>
        </div>
        <div class="detail-usable display-flex">
          <div class="usable-title font-size14">可用</div>
          <div class="usable">
            <span class="usable-asset font-size16">
              0.0000
              <sub class="currency font-size12">FUC</sub>
            </span>
            <span
              class="usable-gain cursor-pointer font-size12 display-inline-block"
              @click.prevent="returnSuperior"
            >
              立即获取
            </span>
          </div>
        </div>
        <!--错误提示-->
        <div
          class = "error-msg font-size12"
        >
          <span v-show = "errorMsg">{{ errorMsg }}</span>
        </div>
        <div class="detail-page-btn text-align-c">
          <button
            class="page-btn cursor-pointer"
            @click.prevent="confirmSubmit"
          >
            确定
          </button>
        </div>
      </div>
      <div class="text-below box-sizing font-size12">
        <p class="font-size14 warm-prompt">温馨提示:</p>
        <p>
          <span class="warm-text-color">VIP开通后立即生效，交易结算时自动计算折扣</span>
          <span class="prompt-color">《折扣说明》</span>
        </p>
        <p class="warm-text-color">费率折扣仅对交易手续费生效</p>
        <p class="warm-text-color">一个月有效期时长为30个自然日</p>
        <p class="warm-text-color">开通即代表您已同意
          <span class="prompt-color">《VIP服务协议》</span>
        </p>
      </div>
      <el-dialog
        title="kaitongVIP"
        visible.sync="dialogFormVisible"
      >
        <el-form>
          <el-form-item
            label="交易密码"
          >
            <el-input
              type="password"
              auto-complete="off"
              v-model="password"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <!--错误提示-->
        <!--<div-->
          <!--class = "error-msg font-size12"-->
        <!--&gt;-->
          <!--<span v-show = "errorEditorMsg">-->
            <!--{{ errorEditorMsg }}-->
          <!--</span>-->
        <!--</div>-->
        <div
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click.prevent="dialogFormVisibleButton"
          >
            确 定
          </el-button>
        </div>
      </el-dialog>
    </div>
    <!--底部-->
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
import {
  vipPriceInfo,
  buyVipPriceInfo
} from '../../../utils/api/personal'
import {
  returnAjaxMessage
} from '../../../utils/commonFunc'
// 底部
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    FooterCommon // 底部
  },
  data () {
    return {
      vipPictureBanner: require('../../../assets/user/VIPbanner.png'), // vip banner
      errorEditorMsg: '',
      showOpenTheVIPPage: true, // 开启vip页面默认
      vipShowDetailsPage: false, // 开启vip详情页面默认
      password: '', // 开启vip详情页面默认
      vipPriceInfo: [], // vip信息接收
      dialogFormVisible: false,
      type: '1', // vip类型
      active: 0,
      month: '', //
      vipName: '' //
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/VipMainContent/VipMainContent.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/VipMainContent/VipMainContentDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/VipMainContent/VipMainContentNight.css')
    this.getVipPriceInfo()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {
  },
  methods: {
    ...mapMutations([
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.$router.push({path: '/PersonalCenter'})
    },
    // vip开通页面点击页面
    statusImmediatelyOpened (paymentType, safeState) {
      this.activeType = paymentType
      this.state = safeState
      this.showOpenTheVIPPage = false
      this.vipShowDetailsPage = true
      switch (paymentType) {
        case 'vip1':
          this.active = 1
          this.type = 1
          break
        case 'vip2':
          this.active = 2
          this.type = 2
          break
        case 'vip3':
          this.active = 3
          this.type = 3
          break
        case 'vip4':
          this.active = 4
          this.type = 3
          break
        case 'vip5':
          this.active = 5
          this.type = 5
          break
        case 'vip6':
          this.active = 6
          this.type = 6
          break
      }
    },
    // vip详情页面资产渲染
    stateOpeningLevel (type) {
      this.type = type
    },
    // 创建api检测输入格式
    // checkoutInputFormat (type, targetNum) {
    //   switch (type) {
    //     // 编辑用户备注
    //     case 0:
    //       if (!targetNum) {
    //         this.setErrorMsg(0, '请输入交易密码')
    //         this.$forceUpdate()
    //         return 0
    //       } else {
    //         this.setErrorMsg(0, '')
    //         this.$forceUpdate()
    //         return 1
    //       }
    //   }
    // },
    // 设置错误信息
    setErrorMsg (index, msg) {
      this.errorEditorMsg = msg
    },
    // 确定提交
    confirmSubmit () {
      this.dialogFormVisible = true
    },
    changeMonth (month, vipName) {
      console.log(month, vipName)
      switch (month) {
        case 3:
          this.month = '3'
          this.vipName = vipName
          break
        case 6:
          this.month = '6'
          this.vipName = vipName
          break
        case 12:
          this.month = '12'
          this.vipName = vipName
          break
        case 1:
          this.month = '1'
          this.vipName = vipName
          break
      }
    },
    dialogFormVisibleButton () {
      this.confirmTransactionPassword()
    },
    async confirmTransactionPassword () {
      let data
      let params = {
        payPassword: this.password, // 用户id
        vipName: this.vipName,
        month: this.month
      }
      data = await buyVipPriceInfo(params)
      if (!(returnAjaxMessage(data, this, 1))) {
        return false
      } else {
        this.dialogFormVisible = false
        console.log(data)
        // 安全中心状态刷新
      }
    },
    /**
    /**
     * vip价格
     */
    async getVipPriceInfo () {
      let data = await vipPriceInfo({})
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回展示
        this.vipPriceInfo = data.data.data
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    }),
    filteredData () {
      return this.vipPriceInfo.filter((item) => {
        // console.log(item)
        return item.id == this.type
      })
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/VipMainContent/VipMainContent";
  .vip-main {
    > .header-content {
      /*height: 600px;*/
      width: 100%;
      margin: 0 auto;
      .images {
        width: 100%;
      }
    }
    > .content-main-content {
      > .content-main {
        .error-msg{
          height:30px;
          line-height: 30px;
          padding-left: 35px;
          color: rgb(212, 88, 88);
        }
        width: 756px;
        min-height: 800px;
        margin: 0 auto;
        flex-wrap: wrap;
        > .content-module {
          flex-wrap: wrap;
          width: 250px;
          height: 380px;
          > .content-vip-one {
            height: 112px;
            line-height: 112px;
            font-size: 36px;
          }
          > .content-discount,
          > .content-text {
            height: 50px;
          }
          > .content-button {
            height: 115px;
            text-align: center;
            > .click-btn {
              width: 180px;
              height: 40px;
              transform: skew(-15deg);
              margin-top: 35px;
            }
          }
        }
        > .content-info-hint {
          width: 100%;
          height: 40px;
          line-height: 40px;
        }
      }
      > .content-detail-page {
        width: 900px;
        min-height: 500px;
        margin: 0 auto;
        > .detail-page-grade {
          > .page-grade-title {
            line-height: 70px;
          }
          .grade {
            width: 100px;
            height: 70px;
            border: 1px solid #354057;
            margin-left: 40px;
            padding: 13px;
            /*>.grade-color {*/
              /**/
            /*}*/
            >.grade-height {
              margin-top: 5px;
            }
          }
        }
        > .detail-page-duration {
          margin-top: 100px;
          > .duration-title {
            width: 100px;
            height: 150px;
            line-height: 150px;
          }
          > .duration {
            width: 140px;
            height: 150px;
            padding: 30px;
            >.duration-currency {
              padding: 8px 0 8px;
            }
            >.duration-through {
              text-decoration: line-through;
            }
          }
          > .duration-left {
            margin-left: 60px;
          }
        }
        >.detail-usable {
          margin: 100px 0 80px;
          >.usable-title {
            width: 100px;
          }
          >.usable {
            width: 500px;
            >.usable-asset {
              >.currency {
                margin-left: 5px;
              }
            }
            >.usable-gain {
              margin-left: 25px;
            }
          }
        }
        >.detail-page-btn {
          width: 100%;
          height: 40px;
          margin-bottom: 50px;
          >.page-btn {
            width: 290px;
            height: 40px;
          }
        }
      }
      > .text-below {
        width: 756px;
        height: 350px;
        margin: 0 auto;
        padding-top: 80px;
        line-height: 25px;
        > .warm-prompt {
          font-weight: 600;
        }
      }
    }
    &.night {
      background-color: $nightBgColor;
      color: $nightFontColor;
      > .header-content {
        background-color: #121824;
      }
      > .content-main-content {
        margin-top: -3px;
        background: rgba(18, 24, 36, 1);
        > .content-main {
          > .content-module {
            background-color: #232D39;
            border: 2px solid #33404B;
            &:hover {
              border: 4px solid #338FF5;
              transform: scale(1.03);
              box-shadow: 0 0 15px rgba(0, 0, 0, 1);
              > .content-text {
                font-weight: 600;
                color: rgba(51, 143, 245, 1);
              }
              > .content-discount {
                background-color: #1E2832;
                color: rgba(255, 255, 255, 1);
                > .content-discount-color {
                  font-weight: 600;
                  color: rgba(51, 143, 245, 1);
                }
              }
              > .content-button {
                > .click-btn {
                  background: #338FF5;
                  color: #fff;
                }
              }
            }
            > .content-vip-one {
              color: #fff;
            }
            > .content-text {
              color: rgba(51, 143, 245, 0.6);;
            }
            > .content-discount {
              background-color: #1E2832;
              color: rgba(255, 255, 255, 0.6);
              > .content-discount-color {
                color: rgba(51, 143, 245, 0.6);
              }
            }
            > .content-button {
              > .click-btn {
                background: linear-gradient(0deg, rgba(41, 52, 64, 1) 0%, rgba(52, 62, 71, 1) 100%);
                color: #fff;
              }
            }
          }
          > .content-info-hint {
            > .hint-color {
              color: #338FF5;
            }
          }
          > .content-border-rl {
            border-right: 0;
            border-left: 0;
          }
        }
        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              color: red;
              font-size: 30px;
            }
            .p {
              color: blue
            }
            .blue {
              background-color: transparent !important;
              border: 1px solid #338FF5 !important;
              > .grade-color,
              > .grade-height {
                color: #338FF5 !important;
              }
            }
            .grade {
              background-color: #1A2233;
              border: 1px solid #354057;
              &:hover {
                background-color: transparent;
                border: 1px solid #338FF5;
                > .grade-color,
                > .grade-height {
                  color: #338FF5;
                }
              }
              > .grade-color {
                color: #fff;
              }
              > .grade-height {
                color: #9DA5B3;
              }
            }
          }
          > .detail-page-duration {
            > .duration {
              background-color: #1A2233;
              border: 1px solid #354057;
              > .duration-month {
                color: #fff;
              }
              > .duration-currency {
                color: #D45858;
              }
              > .duration-through {
                color: #9DA5B3;
              }
            }
          }
          > .detail-usable {
            > .usable {
              > .usable-asset {
                color: #D45858;
                font-weight: 600;
                > .currency {
                  color: #fff;
                }
              }
              > .usable-gain {
                color: #338FF5;
              }
            }
          }
          > .detail-page-btn {
            > .page-btn {
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              border-radius: 4px;
            }
          }
          > .text-below {
            > .warm-prompt {
              color: #fff;
            }
            .prompt-color {
              color: #D45858;
            }
            .warm-text-color {
              color: #9DA5B3;
            }
          }
        }
      }
    }
    &.day {
      background-color: $dayBgColor;
      color: $dayFontColor;
      > .content-main-content {
        background-color: $dayBgColor;
      }
      > .content-main-content {
        margin-top: -3px;
        background-color: $dayBgColor;
        > .content-main {
          > .content-module {
            background-color: #232D39;
            border: 2px solid #33404B;
            &:hover {
              border: 4px solid #338FF5;
              transform: scale(1.03);
              box-shadow: 0 0 15px rgba(0, 0, 0, 1);
              > .content-text {
                font-weight: 600;
                color: rgba(51, 143, 245, 1);
              }
              > .content-discount {
                background-color: #1E2832;
                color: rgba(255, 255, 255, 1);
                > .content-discount-color {
                  font-weight: 600;
                  color: rgba(51, 143, 245, 1);
                }
              }
              > .content-button {
                > .click-btn {
                  background: #338FF5;
                  color: #fff;
                }
              }
            }
            > .content-vip-one {
              color: #fff;
            }
            > .content-text {
              color: rgba(51, 143, 245, 0.6);;
            }
            > .content-discount {
              background-color: #1E2832;
              color: rgba(255, 255, 255, 0.6);
              > .content-discount-color {
                color: rgba(51, 143, 245, 0.6);
              }
            }
            > .content-button {
              > .click-btn {
                background: linear-gradient(0deg, rgba(41, 52, 64, 1) 0%, rgba(52, 62, 71, 1) 100%);
                color: #fff;
              }
            }
          }
          > .content-info-hint {
            > .hint-color {
              color: #338FF5;
            }
          }
          > .content-border-rl {
            border-right: 0;
            border-left: 0;
          }
        }
        > .content-detail-page {
          > .detail-page-grade {
            .p1 {
              color: red;
              font-size: 30px;
            }
            .p {
              color: blue
            }
            .blue {
              background-color: transparent !important;
              border: 1px solid #338FF5 !important;
              > .grade-color,
              > .grade-height {
                color: #338FF5 !important;
              }
            }
            .grade {
              background-color: #1A2233;
              border: 1px solid #354057;
              &:hover {
                background-color: transparent;
                border: 1px solid #338FF5;
                > .grade-color,
                > .grade-height {
                  color: #338FF5;
                }
              }
              > .grade-color {
                color: #fff;
              }
              > .grade-height {
                color: #9DA5B3;
              }
            }
          }
          > .detail-page-duration {
            background-color: $dayBgColor;
            > .duration {
              background-color: #1A2233;
              border: 1px solid #354057;
              > .duration-month {
                color: #fff;
              }
              > .duration-currency {
                color: #D45858;
              }
              > .duration-through {
                color: #9DA5B3;
              }
            }
          }
          > .detail-usable {
            > .usable {
              > .usable-asset {
                color: #D45858;
                font-weight: 600;
                > .currency {
                  color: #fff;
                }
              }
              > .usable-gain {
                color: #338FF5;
              }
            }
          }
          > .detail-page-btn {
            > .page-btn {
              color: #fff;
              background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              border-radius: 4px;
            }
          }
          > .text-below {
            > .warm-prompt {
              color: #fff;
            }
            .prompt-color {
              color: #D45858;
            }
            .warm-text-color {
              color: #9DA5B3;
            }
          }
        }
      }
    }
  }
</style>
