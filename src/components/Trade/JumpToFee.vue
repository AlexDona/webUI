<!--
  author: zhaoxinlei
  createTime: 2019-04-15
  description: 当前组件为 币币交易页面跳转费率组件
-->
<template>
  <button
    class="fees cursor-pointer font-size12"
    @click="jumpToOtherPage('/ServiceAndProtocol','Rate')"
  >
    <!--交易费率-->
    {{$t('M.trade_fee')}}
  </button>
</template>
<script>
import {mapMutations} from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'CHANGE_FOOTER_ACTIVE_NAME'
    ]),
    // 跳转
    jumpToOtherPage (router, activeName) {
      this.CHANGE_FOOTER_ACTIVE_NAME({
        activeName,
        type: router
      })
      this.$goToPage(router)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">

</style>
