<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="account-assets-main">
      <UserInfo />
      <div class="account-assets-content padding-left15 margin-top16">
        账户资产主题
      </div>
      <div class="account-assets-content padding-left15">
        账户资产主题
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// 我的资产
import UserInfo from '../AccountBalance/UserInfo'
export default {
  components: {
    UserInfo // 我的资产
  },
  // props,
  data () {
    return {}
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/AccountAssets.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/AccountAssetsDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/AccountAssetsNight.css')
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
  @import "../../../../static/css/scss/Personal/AccountBalance/AccountAssets";
  .account-assets{
    >.account-assets-main{
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
