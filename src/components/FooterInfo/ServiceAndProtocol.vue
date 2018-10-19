<template>
  <div
    class="service-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <keep-aline><HeaderCommon/></keep-aline>
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
                <UserProtocol/>
              </div>
            </el-tab-pane>
            <!--法律声明-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint3')"
              name="LegislationExplain"
            >
              <div class="tab-content">
                <LegislationExplain/>
              </div>
            </el-tab-pane>
            <!--隐私条款-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint4')"
              name="PrivacyClause"
            >
              <div class="tab-content">
                <PrivacyClause/>
              </div>
            </el-tab-pane>
            <!--API文档-->
            <el-tab-pane
              :label="$t('M.about_digital_terms_hint5')"
              name="APIDocument"
            >
              <div class="tab-content">
                <APIDocument/>
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
                <Rate/>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <keep-alive><FooterCommon/></keep-alive>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getServiceProtocolData} from '../../utils/commonFunc'
import Rate from './Rate'
import APIDocument from './APIDocument'
import PrivacyClause from './PrivacyClause'
import LegislationExplain from './LegislationExplain'
// import ClauseExplain from './ClauseExplain'
import UserProtocol from './UserProtocol'
import CurrencyInformation from './CurrencyInformation'
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('footerInfo')
export default {
  components: {
    HeaderCommon,
    FooterCommon,
    CurrencyInformation,
    UserProtocol,
    // ClauseExplain,
    LegislationExplain,
    PrivacyClause,
    APIDocument,
    Rate
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
    console.log(this.serviceActiveName)
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
      'CHANGE_PROTOCOL_DATA'
    ]),
    changeTab (e) {
      console.log(e.name)
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
      }
      this.getServiceProtocolData()
    },
    getServiceProtocolData () {
      const params = {
        partnerId: this.partnerId,
        termsTypeIds: this.termsTypeIds, // 用户协议代号
        language: this.language
      }
      getServiceProtocolData(this, params, (data) => {
        if (data) {
          const targetData = data.data.data[0]
          console.log(targetData)
          // avatar: "",
          // content: "",
          // createTime: "2018-09-18 15:36:49",
          // id: "491633701420007424",
          // keyword: "条款说明",
          // language: "zh_CN",
          // modifier: "申",
          // partnerId: "474629374641963008",
          // termsTypeId: "8",
          // termsTypeName: "条款说明",
          // updateTime: "2018-09-18 15:36:49",
          // version: 1,
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
      partnerId: state => state.common.partnerId,
      serviceActiveName: state => state.footerInfo.serviceActiveName
    })
    // activeName () {
    //   return this.serviceActiveName
    // }
  },
  watch: {
    serviceActiveName (newVal) {
      console.log(newVal)
    },
    activeName (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .service-protocol-box{
    width:100%;
    height:100%;
    >.content{
      overflow: visible;
      width:100%;
      >.top{
        height:250px;
        text-align: center;
        width:100%;
        background:#121824 url(../../assets/develop/about-us.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        padding-top:100px;
        >h1{
          font-size: 36px;
          color:#8BA0CA;
          /*font-family:HYa4gj;*/
        }
        >p{
          font-size: 22px;
          color:#97AAC8;
        }
      }
      >.content{
        /*overflow: hidden;*/
        >.inner-box{
          box-sizing: border-box;
          margin:0px auto 0px;
          /*height:1100px;*/
          width:1100px;
          padding-bottom:50px;
          .tab-content{
            width:1100px;
            /*overflow: hidden;*/
          }
        }
      }
    }
    &.night{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #121824;
          >.inner-box{
            /*background-color: #1e2636;*/
            color:#8BA0CA
          }
        }
      }
    }
    &.day{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #fff;
          >.inner-box{
            /*border:1px solid rgba(234,235,236,1);*/
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
