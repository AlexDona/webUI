<template>
  <div
    class="service-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    :style="{'min-height':(windowHeight-302)+'px'}"
  >
    <div class="content">
      <div class="top">
        <h1>
          <!--服务条款-->
          {{ $t('M.about_digital_terms_hint1') }}
        </h1>
      </div>
      <div class="content">
        <div class="inner-box">
          <el-tabs
            v-model="activeName"
            @tab-click="changeTab"
          >
            <!--用户协议-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint2')"
              name="UserProtocol"
            >
              <div class="tab-content">
                <Content
                  :content="userProtocolData.content"
                />
              </div>
            </el-tab-pane>
            <!--法律声明-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint3')"
              name="LegislationExplain"
            >
              <div class="tab-content">
                <Content
                  :content="legislationExplainData.content"
                />
              </div>
            </el-tab-pane>
            <!--隐私条款-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint4')"
              name="PrivacyClause"
            >
              <div class="tab-content">
                <Content
                  :content="privacyClauseData.content"
                />
              </div>
            </el-tab-pane>
            <!--反洗钱-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint7')"
              name="AML"
            >
              <div class="tab-content">
                <Content
                  :content="AML.content"
                />
              </div>
            </el-tab-pane>
            <!--币种资料-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint6')"
              name="CurrencyInformation"
            >
              <div class="tab-content">
                <CurrencyInformation/>
              </div>
            </el-tab-pane>
            <!--费率-->
            <el-tab-pane
              :label="$t('M.comm_rate1')"
              name="Rate"
            >
              <div class="tab-content">
                <SymbolRate/>
              </div>
            </el-tab-pane>
            <!--交易须知-->
            <el-tab-pane
              :label="$t('M.otc_index_tradeKnow')"
              name="TradingWarning"
            >
              <div class="tab-content">
                <Content
                  :content="tradingWarningData.content"
                />
              </div>
            </el-tab-pane>
            <!-- OTC 服务协议 -->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint8')"
              name="OTCServices"
            >
              <div class="tab-content">
                <Content
                  :content="OTCServices.content"
                />
              </div>
            </el-tab-pane>
            <!-- OTC 商家认证协议 -->
            <el-tab-pane
              :label="$t('M.otc_merchant_authentication')"
              name="OTCMerchant"
            >
              <div class="tab-content">
                <Content
                  :content="OTCMerchant.content"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getNestedData
} from '../../utils/commonFunc'
import {getServiceProtocoDataAjax} from '../../utils/api/common'
import Content from './ServiceAndProtocolContent'
import SymbolRate from './SymbolRate'
import CurrencyInformation from './CurrencyInformation'
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {
    CurrencyInformation,
    Content,
    SymbolRate
  },
  // props,
  data () {
    return {
      activeName: this.serviceActiveName || 'UserProtocol',
      termsTypeIds: 1 // 参数id
    }
  },
  async created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
    // require('../../../static/css/list/FooterInfo/ServiceAndProtocol.css')
    this.changeTab({name: this.serviceActiveName})
    // const data = await getSymbolRate()
  },
  mounted () {
    this.getServiceProtocolData()
  },
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_PROTOCOL_DATA',
      'CHANGE_FOOTER_ACTIVE_NAME'
    ]),
    changeTab (e) {
      this.activeName = e.name
      switch (e.name) {
        case 'UserProtocol':
          this.termsTypeIds = 1
          break
        case 'PrivacyClause':
          this.termsTypeIds = 2
          break
        case 'LegislationExplain':
          this.termsTypeIds = 3
          break
        case 'AML':
          this.termsTypeIds = 4
          break
        case 'Rate':
          this.termsTypeIds = 5
          break
        case 'ClauseExplain':
          this.termsTypeIds = 8
          break
        // OTC 认证商家协议
        case 'OTCMerchant':
          this.termsTypeIds = 9
          break
        // 交易须知
        case 'TradingWarning':
          this.termsTypeIds = 14
          break
        // OTC 服务协议
        case 'OTCServices':
          this.termsTypeIds = 16
          break
      }
      this.getServiceProtocolData()
    },
    async getServiceProtocolData () {
      const params = {
        termsTypeIds: this.termsTypeIds, // 用户协议代号
        language: this.language
      }
      if (this.termsTypeIds !== 5) {
        const data = await getServiceProtocoDataAjax(params)
        if (!data) return false
        const targetData = getNestedData(data, 'data[0]')
        switch (this.termsTypeIds) {
          case 1:
            this.CHANGE_PROTOCOL_DATA({
              userProtocolData: targetData
            })
            break
          case 2:
            this.CHANGE_PROTOCOL_DATA({
              privacyClauseData: targetData
            })
            break
          case 3:
            this.CHANGE_PROTOCOL_DATA({
              legislationExplainData: targetData
            })
            break
          case 4:
            this.CHANGE_PROTOCOL_DATA({
              AML: targetData
            })
            break
          case 8:
            this.CHANGE_PROTOCOL_DATA({
              clauseExplainData: targetData
            })
            break
          case 9:
            this.CHANGE_PROTOCOL_DATA({
              OTCMerchant: targetData
            })
            break
          case 14:
            this.CHANGE_PROTOCOL_DATA({
              tradingWarningData: targetData
            })
            break
          case 16:
            this.CHANGE_PROTOCOL_DATA({
              OTCServices: targetData
            })
            break
        }
      } else {

      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      serviceActiveName: state => state.footerInfo.serviceActiveName,
      legislationExplainData: state => state.footerInfo.serviceProtocolData.legislationExplainData,
      userProtocolData: state => state.footerInfo.serviceProtocolData.userProtocolData,
      privacyClauseData: state => state.footerInfo.serviceProtocolData.privacyClauseData,
      rateData: state => state.footerInfo.serviceProtocolData.rateData,
      AML: state => state.footerInfo.serviceProtocolData.AML,
      tradingWarningData: state => state.footerInfo.serviceProtocolData.tradingWarningData,
      OTCServices: state => state.footerInfo.serviceProtocolData.OTCServices,
      OTCMerchant: state => state.footerInfo.serviceProtocolData.OTCMerchant
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    activeName (newVal) {
      this.CHANGE_FOOTER_ACTIVE_NAME({
        type: '/ServiceAndProtocol',
        activeName: newVal
      })
    },
    serviceActiveName (newVal) {
      this.activeName = newVal
    },
    // 改变语言重新请求对应语言的国际化内容
    language () {
      this.changeTab({name: this.activeName})
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

.service-protocol-box {
  width: 100%;
  // height:100%;
  > .content {
    width: 100%;
    height: 100%;
    overflow: visible;

    > .top {
      width: 100%;
      height: 250px;
      padding-top: 100px;
      text-align: center;
      background: #121824 url(../../assets/develop/about-us.png) no-repeat center center;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;

      > h1 {
        font-weight: 500;
        font-size: 36px;
        color: #8ba0ca;
      }

      > p {
        font-size: 22px;
        color: #97aac8;
      }
    }

    > .content {
      height: 100%;
      overflow: visible !important;

      > .inner-box {
        box-sizing: border-box;

        /* height:1100px; */
        width: 1100px;
        padding-bottom: 50px;
        margin: 0 auto;

        .tab-content {
          width: 1100px;
        }
      }
    }
  }

  /deep/ {
    .el-tabs__nav-wrap {
      &::after {
        height: 0;
        content: "";
      }
    }

    .el-tabs {
      .el-tabs-top {
        z-index: 10;
      }
    }

    .el-tabs__header {
      position: relative;
      top: -55px;
      margin: 0;
    }

    .el-tabs__active-bar {
      background-color: transparent;
    }

    .el-tabs__item {
      position: relative;
      display: inline-block;
      list-style: none;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      height: 40px;
      padding: 0 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 40px;
      color: #fff;
      background: rgba(51, 143, 245, 1);
      opacity: .6;
      transition: opacity 1s;
      border-right: 1px solid #121824;

      &.is-active {
        height: 70px;
        padding: 0 10px;
        margin-bottom: -20px;
        font-weight: 600;
        line-height: 70px;
        color: #fff;
        background: #338ff5;
        opacity: 1;
        border-right: none;
      }
    }

    .el-tabs--bottom,
    .el-tabs--top {
      .el-tabs__item {
        &.is-bottom,
        &.is-top {
          &:nth-child(2) {
            padding-left: 10px;
          }

          &:last-child {
            padding-right: 10px;
          }
        }
      }
    }
  }

  &.night {
    background-color: #121824;

    > .content {
      > .content {
        background-color: #121824;

        > .inner-box {
          color: #8ba0ca;
        }
      }
    }
  }

  &.day {
    background-color: $mainBgColorOfDay;

    > .content {
      > .content {
        background-color: $newDayBg;

        > .inner-box {
          color: #666;
          background-color: $newDayBg;
        }
      }
    }
  }
}
</style>
