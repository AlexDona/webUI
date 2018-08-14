<template>
  <div
    class="security-center personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="security-header background-color personal-height line-height70 font-size16 padding-left20">
      <span class="padding-left15">安全中心</span>
    </header>
    <div class="security-information background-color min-height500 margin-top5">
      <span class="padding-left15">个人信息</span>
    </div>
    <div class="security-setting background-color margin-top5">
      <span class="padding-left15">安全設置</span>
    </div>
    <div class="security-record background-color margin-top5">
      <el-tabs v-model="securityActiveName">
        <el-tab-pane label="最近登录记录" name="first">
          <el-table
            :data="logonRecord"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="登陆时间">
            </el-table-column>
            <el-table-column
              prop="IP"
              label="登录IP">
            </el-table-column>
            <el-table-column
              prop="placeBelonging"
              label="归属地">
            </el-table-column>
            <el-table-column
              prop="source"
              label="来源">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="安全设置记录" name="second">
          <el-table
            :data="securityRecord"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="登陆时间">
            </el-table-column>
            <el-table-column
              prop="name"
              label="设备名称">
            </el-table-column>
            <el-table-column
              prop="IP"
              label="登录IP">
            </el-table-column>
            <el-table-column
              prop="placeBelonging"
              label="归属地">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      securityActiveName: 'first', // 默认显示第一个
      // 最近登录记录
      logonRecord: [
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        },
        {
          time: '2016-05-02',
          IP: '登录IP',
          placeBelonging: '中国、香港九龙',
          source: 'WEB'
        }
      ],
      securityRecord: [
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        },
        {
          time: '2016-05-02',
          name: '设置交易密码',
          IP: '202.102.224.68',
          placeBelonging: '香港铜锣湾'
        }
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/SecurityCenter.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/SecurityCenterDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/SecurityCenterNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/SecurityCenter.scss";
  .security-center{
    >.security-information{
      min-height: 200px;
    }
    >.security-setting{
      min-height: 400px;
    }
    >.security-record{
      min-height: 200px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color{
        background-color: rgba(37, 46, 63, 1);
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background-color: #CCCCCC;
      }
    }
  }
</style>
