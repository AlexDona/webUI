<template>
  <div
    class="service-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="content">
      <div class="top">
        <h1>服务条款</h1>
      </div>
      <div class="content">
        <div class="inner-box">
          <el-tabs
            v-model="activeName"
          >
            <el-tab-pane
              label="用户协议"
              name="first"
            >
              <UserProtocol/>
            </el-tab-pane>
            <el-tab-pane
              label="条款说明"
              name="second">
              <ClauseExplain/>
            </el-tab-pane>
            <el-tab-pane
              label="法律声明"
              name="third"
            >
              <LegislationExplain/>
            </el-tab-pane>
            <el-tab-pane
              label="隐私条款"
              name="fourth"
            >
              <PrivacyClause/>
            </el-tab-pane>
            <el-tab-pane
              label="API文档"
              name="fifth"
            >
              <APIDocument/>
            </el-tab-pane>
            <el-tab-pane
              label="币种资料"
              name="sixth"
            >
              <CurrencyInformation/>
            </el-tab-pane>
            <el-tab-pane
              label="费率"
              name="seventh"
            >
              <Rate/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <FooterCommon/>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import Rate from './Rate'
import APIDocument from './APIDocument'
import PrivacyClause from './PrivacyClause'
import LegislationExplain from './LegislationExplain'
import ClauseExplain from './ClauseExplain'
import UserProtocol from './UserProtocol'
import CurrencyInformation from './CurrencyInformation'
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon,
    FooterCommon,
    CurrencyInformation,
    UserProtocol,
    ClauseExplain,
    LegislationExplain,
    PrivacyClause,
    APIDocument,
    Rate
  },
  // props,
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .service-protocol-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.top{
        height:250px;
        text-align: center;
        width:100%;
        background: url(../../assets/develop/about-Us.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        padding-top:100px;
        >h1{
          font-size: 36px;
          color:#338FF5;
        }
        >p{
          font-size: 22px;
          color:#97AAC8;
        }
      }
      >.content{
        overflow: hidden;
        >.inner-box{
          margin:50px auto;
          height:1100px;
          width:1100px;
          padding:50px;
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
            background-color: #1e2636;
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
            border:1px solid rgba(234,235,236,1);
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
