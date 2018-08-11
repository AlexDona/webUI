<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="account-assets-main">
      账户资产主题
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
    require('../../../static/css/list/Personal/AccountAssets.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/AccountAssetsDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/AccountAssetsNight.css')
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
  @import "../../../static/css/scss/Personal/AccountAssets.scss";
  .account-assets{
    >.account-assets-main{
      margin-top: 5px;
      min-height: 500px;
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }

</style>
