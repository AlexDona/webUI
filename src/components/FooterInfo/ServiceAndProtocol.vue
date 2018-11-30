<template>
  <div
    class="service-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
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
            <!--API文档-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint5')"
              name="APIDocument"
            >
              <div class="tab-content">
                <Content
                  :content="APIDocumentData.content"
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
                <Content
                  :content="rateData.content"
                />
              </div>
            </el-tab-pane>
            <!--交易须知-->
            <el-tab-pane
              :label="$t('M.otc_index_tradeKnow')"
              name="TradingWraning"
            >
              <div class="tab-content">
                <Content
                  :content="tradingWarningData.content"
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
  getServiceProtocolData,
  getNestedData
} from '../../utils/commonFunc'
import Content from './ServiceAndProtocolContent'
import CurrencyInformation from './CurrencyInformation'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('footerInfo')
export default {
  components: {
    CurrencyInformation,
    Content
  },
  // props,
  data () {
    return {
      activeName: this.serviceActiveName || 'UserProtocol',
      termsTypeIds: 1 // 参数id
    }
  },
  created () {
    require('../../../static/css/list/FooterInfo/ServiceAndProtocol.css')
    this.changeTab({name: this.serviceActiveName})
  },
  mounted () {
    this.getServiceProtocolData()
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_PROTOCOL_DATA',
      'CHANGE_FOOTER_ACTIVENAME'
    ]),
    changeTab (e) {
      this.activeName = e.name
      switch (e.name) {
        case 'UserProtocol':
          this.termsTypeIds = 1
          break
        case 'ClauseExplain':
          this.termsTypeIds = 8
          break
        case 'LegislationExplain':
          this.termsTypeIds = 3
          break
        case 'PrivacyClause':
          this.termsTypeIds = 2
          break
        case 'APIDocument':
          this.termsTypeIds = 7
          break
        case 'Rate':
          this.termsTypeIds = 5
          break
        // 交易须知
        case 'TradingWraning':
          this.termsTypeIds = 14
          break
      }
      this.getServiceProtocolData()
    },
    getServiceProtocolData () {
      const params = {
        termsTypeIds: this.termsTypeIds, // 用户协议代号
        language: this.language
      }
      getServiceProtocolData(this, params, (data) => {
        if (data) {
          const targetData = getNestedData(data, 'data.data[0]')
          console.log(targetData)
          // avatar: "",
          // content: "",
          // createTime: "2018-09-18 15:36:49",
          // id: "491633701420007424",
          // keyword: "条款说明",
          // language: "zh_CN",
          // modifier: "申",
          // termsTypeId: "8",
          // termsTypeName: "条款说明",
          // updateTime: "2018-09-18 15:36:49",
          // version: 1,
          console.log(this.termsTypeIds)
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
            case 5:
              this.CHANGE_PROTOCOL_DATA({
                rateData: targetData
              })
              break
            case 7:
              this.CHANGE_PROTOCOL_DATA({
                APIDocumentData: targetData
              })
              break
            case 8:
              this.CHANGE_PROTOCOL_DATA({
                clauseExplainData: targetData
              })
              break
            case 14:
              this.CHANGE_PROTOCOL_DATA({
                tradingWarningData: targetData
              })
              break
          }
        }
      })
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
      APIDocumentData: state => state.footerInfo.serviceProtocolData.APIDocumentData,
      tradingWarningData: state => state.footerInfo.serviceProtocolData.tradingWarningData
    }),
    windowHeight () {
      return window.innerHeight
    }
  },
  watch: {
    activeName (newVal) {
      this.CHANGE_FOOTER_ACTIVENAME({
        type: '/ServiceAndProtocol',
        activeName: newVal
      })
    },
    // 任增加：改变语言重新请求对应语言的国际化内容
    language () {
      this.changeTab({name: this.activeName})
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .service-protocol-box{
    width:100%;
    // height:100%;
    >.content{
      width:100%;
      height:100%;
      overflow: visible;

      >.top{
        width:100%;
        height:250px;
        padding-top:100px;
        text-align: center;
        background:#121824 url(../../assets/develop/about-us.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;

        >h1{
          font-weight: 500;
          font-size: 36px;
          color:#8ba0ca;
        }

        >p{
          font-size: 22px;
          color:#97aac8;
        }
      }

      >.content{
        height:100%;

        >.inner-box{
          box-sizing: border-box;

          /*height:1100px;*/
          width:1100px;
          padding-bottom:50px;
          margin:0 auto;

          .tab-content{
            width:1100px;
          }
        }
      }
    }

    &.night{
      >.content{
        >.content{
          background-color: #121824;

          >.inner-box{
            color:#8ba0ca
          }
        }
      }
    }

    &.day{
      >.content{
        >.content{
          background-color: #fff;

          >.inner-box{
            color:#666;
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
