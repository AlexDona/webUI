<template>
  <div
    class="credited-credited personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="credited-credited-header personal-height padding-left15 font-size16 line-height70">
      收款账户
    </header>
    <div class="credited-credited-main min-height500 margin-top5">
      <span class="padding-left15"></span>收款账户
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
    require('../../../static/css/list/Personal/AccountCredited.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/AccountCreditedDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/AccountCreditedNight.css')
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
  @import "../../../static/css/scss/Personal/AccountCredited.scss";
  .credited-credited{
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.credited-credited-header,
      .credited-credited-main {
        background-color: rgba(37, 46, 63, 1);
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.credited-credited-header,
      .credited-credited-main {
        background-color: #CCCCCC;
      }
    }
  }
</style>
