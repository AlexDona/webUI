<!--
  author: zhaoxinlei
  create: 20190605
  description: 当前组件为 全局 交易密码弹窗
-->
<template lang="pug">
  .global-pay-password-dialog
    el-dialog(
      title="交易密码"
      :visible.sync="isShowPayPasswordDialog"
      :close-on-click-modal="false"
    )
      el-form(
      :model="form"
      :rules="rules"
      :ref="formRef"
      label-width="100px"
      )
        el-form-item(
        label=""
        label-width="0px"
        prop="buyCount"
        )
          el-input(
          type="text"
          v-model="form.buyCount"
          :placeholder="buyCountPlaceholder"
          :autofocus="true"
          @keyup.native="formatInput"
          @input.native="formatInput"
          )

</template>
<script>
export default {
  // name: '',
  // mixins: [],
  // components: {},
  // props,
  // data () {
  //   return {}
  // }
  // async created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  // methods: {},
  // filters: {},
  // computed: {
  // },
  // watch: {}
}
</script>

<style scoped lang="stylus">
</style>
