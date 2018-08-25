<template>
  <div
    class="api-management personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="background-color personal-height line-height70 padding-left15 font-size16 ">
      <span class="padding-left15">API管理</span>
    </header>
    <div class="api-establish-height background-color margin-top5">
      <header class="padding-left15">创建API KEY</header>
    </div>
    <div class="api-KEY-height background-color margin-top5">
      <header class="padding-left15">我的 API KEY</header>
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
    return {}
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
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/UserAssets/APIManagement";
  .api-management{
    >.api-establish-height{
      min-height: 200px;
    }
    >.api-KEY-height{
      min-height: 300px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .background-color {
        background-color: #1E2636;
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .background-color {
        background-color: #ccc;
      }
    }
  }
</style>
