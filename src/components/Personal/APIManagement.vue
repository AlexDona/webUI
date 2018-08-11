<template>
  <div
    class="api-management personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="background-color personal-height line-height70 padding-left20 font-size16 ">
      API管理
    </header>
    <div class="api-establish-height background-color padding-left20 margin-top5">
      创建API KEY
    </div>
    <div class="api-KEY-height background-color padding-left20 margin-top5">
      我的 API KEY
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
    require('../../../static/css/list/Personal/APIManagement.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/APIManagementDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/APIManagementNight.css')
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
  @import "../../../static/css/scss/Personal/APIManagement.scss";
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
        background-color: rgba(37, 46, 63, 1);
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
