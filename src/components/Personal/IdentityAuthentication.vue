<template>
  <div
    class="identity-authentication personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="identity-authentication-header personal-height line-height70 padding-left20 font-size16">
      身份认证
    </header>
    <div class="identity-authentication-main min-height500 margin-top5 padding-left20">
      <!--实名认证-->
      <div class="real-name-authentication">
        <el-collapse v-model="activeNamesRealName">
          <el-collapse-item title="实名认证" name="1">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <!--高级认证-->
      <div class="advanced-certification">
        <el-collapse v-model="activeNamesAdvanced">
          <el-collapse-item title="高级认证" name="1">
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
          </el-collapse-item>
        </el-collapse>
      </div>
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
      activeNamesRealName: ['1'], // 实名认证默认显示展开
      activeNamesAdvanced: ['1'] // 高级认证默认显示展开
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/IdentityAuthentication.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/IdentityAuthenticationDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/IdentityAuthenticationNight.css')
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
  @import "../../../static/css/scss/Personal/IdentityAuthentication.scss";
.identity-authentication{
  &.night{
    background-color: $nightBgColor;
    color:$nightFontColor;
    .identity-authentication-header,
    .identity-authentication-main{
      background-color: rgba(37, 46, 63, 1);
    }
  }
  &.day{
    background-color: $dayBgColor;
    color:$dayFontColor;
    .identity-authentication-header,
    .identity-authentication-main {
      background-color: #CCCCCC;
    }
  }
}
</style>
