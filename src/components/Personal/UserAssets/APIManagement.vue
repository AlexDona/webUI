<template>
  <div
    class="api-management personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="api-management-header personal-height40 line-height40 padding-left20 font-size16 background-color">
      <span class="padding-left23 header-content font-weight600">API管理</span>
    </header>
    <div class="invitation-promotion-main min-height500 margin-top9">
      <!--创建API KEY-->
      <div class="extension-info padding-top0">
        <header class="extension-info-header line-height56">
          <span class="font-size16 header-color">创建API KEY</span>
        </header>
        <div class="extension-info-content display-flex">
          <div class="info-content info-content-left flex1">
            <el-form
              :label-position="labelPosition"
              label-width="120px"
            >
              <el-form-item label="备注：">
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                >
              </el-form-item>
              <el-form-item label="绑定IP地址：">
                <input
                  type="text"
                  class="api-input border-radius2 padding-l15 box-sizing"
                >
              </el-form-item>
              <button
                class="api-button border-radius4 cursor-pointer font-size14"
              >
                创建
              </button>
            </el-form>
          </div>
          <div class="info-content info-content-right flex1 font-size12">
            <p class="font-size14 content-title">提示</p>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                FUBT 为您提供了强大的API，您可以通过 API 使用行情查询、自动
                交易等服务。通过 API 文档 查看如何使用;
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                每个用户最多创建5组API Key;
              </p>
            </div>
            <div class="content-info">
              <span class="style">● </span>
              <p class="content-text">
                请不要泄露您的API Key，以免造成资产损失。出于安全考虑，建议为
                API Key绑定IP，每个API Key最多绑定4个IP。 单个地址直接填写，多
                个IP地址用半角逗号分隔，如：192.168.1.1,192.168.1.2,192.168.1.3。
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--我的 API KEY-->
      <div class="extension-statistics margin-top9 padding-top0">
        <header class="extension-statistics-header line-height56">
          <span class="font-size16 header-color header-right">我的 API KEY</span>
        </header>
        <div class="extension-statistics-content">
          <el-table
            :data="extensionList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column
              label="创建时间"
              width="180"
            >
              <template slot-scope = "s">
                <div>{{timeFormatting(s.row.creationTime) }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
            >
              <template slot-scope = "s">
                <div>{{ s.row.remark }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="API访问秘钥"
              width="180"
            >
              <template slot-scope = "s">
                <div>{{ s.row.secretKey }}</div>
              </template>
            </el-table-column>
            <el-table-column
              label="IP地址"
            >
              <template slot-scope = "s">
                <div>{{ s.row.IpSite }}</div>
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
                <div>{{ s.row.operation }}</div>
              </template>
            </el-table-column>
          </el-table>
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
  data () {
    return {
      // 推广统计
      // creationTime 创建时间
      // remark 备注
      // secretKey API访问秘钥
      // IpSite IP地址
      // state 状态
      // operation 操作
      extensionList: [
        {
          creationTime: '2018-08-04 10:30:41',
          remark: '阿斯顿发',
          secretKey: '18033****',
          IpSite: '二麻子',
          state: '未认证',
          operation: '5566887'
        },
        {
          creationTime: '2018-08-04 10:30:41',
          remark: '阿斯顿发',
          secretKey: '18033****',
          IpSite: '二麻子',
          state: '未认证',
          operation: '5566887'
        },
        {
          creationTime: '2018-08-04 10:30:41',
          remark: '阿斯顿发',
          secretKey: '18033****',
          IpSite: '二麻子',
          state: '未认证',
          operation: '5566887'
        },
        {
          creationTime: '2018-08-04 10:30:41',
          remark: '阿斯顿发',
          secretKey: '18033****',
          IpSite: '二麻子',
          state: '未认证',
          operation: '5566887'
        },
        {
          creationTime: '2018-08-04 10:30:41',
          remark: '阿斯顿发',
          secretKey: '18033****',
          IpSite: '二麻子',
          state: '未认证',
          operation: '5566887'
        }
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/APIManagement.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/APIManagementDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/APIManagementNight.css')
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
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/APIManagement";
  .api-management{
    >.invitation-promotion-main{
      /*推广信息*/
      >.extension-info{
        min-height: 350px;
        >.extension-info-header {
          height: 56px;
        }
        >.extension-info-content {
          >.info-content {
            height: 250px;
            padding-top: 40px;
            .api-input {
              width: 220px;
              height: 34px;
            }
            .content-title {
              margin-bottom: 10px;
              padding-left: 12px;
            }
            .content-info {
              display: flex;
              line-height: 25px;
              .style {
                margin-right: 5px;
              }
              .content-text {
                flex: 4;
                padding-right: 40px;
              }
            }
            .api-button {
              padding: 10px 96px;
              margin: 30px 0 0 120px;
            }
            .prompt-message {
              height: 20px;
              padding-left: 35px;
            }
          }
        }
      }
      /*推广统计*/
      >.extension-statistics{
        min-height: 200px;
        >.extension-statistics-header{
          height: 56px;
        }
        >.extension-statistics-content{
          min-height: 130px;
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color {
        background-color: #1E2636;
      }
      .invitation-promotion-main{
        >.extension-info{
          background-color: #1E2636;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          >.extension-info-content{
            >.info-content {
              .api-input {
                border: 1px solid #485776;
                color: #fff;
                &:focus {
                  border: 1px solid #338FF5;
                }
              }
              .content-title {
                color: #338FF5;
              }
              .content-info {
                color: #9DA5B3;
              }
              .api-button {
                background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
                color: #fff;
              }
            }
          }
        }
        >.extension-statistics {
          background-color: #1E2636;
          >.extension-statistics-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
        }
      }
      .api-management-header {
        .header-content {
          color: #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color {
        background-color: #ccc;
      }
      .invitation-promotion-main {
        >.extension-info{
          background-color: #ccc;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #ccc;
            }
          }
          >.extension-info-content{
            >.promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #ccc;
                }
              }
              .info-left,
              info-right {
                color: #ccc;
              }
            }
          }
        }
        >.extension-statistics {
          background-color: #ccc;
          >.extension-statistics-header {
            border-bottom: 1px solid #333;
            >.header-color {
              color: #ccc;
            }
          }
        }
      }
      .api-management-header {
        .header-content {
          color: #555;
        }
      }
    }
  }
</style>
