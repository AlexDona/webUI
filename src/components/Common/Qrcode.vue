<!-- 二维码组件 -->
<template>
  <Qrcode
    :class="className"
    :value="value"
    :options="options"
    v-if="value"
  />
</template>
<script>

export default {
  components: {
    Qrcode: resolve => {
      require([('@chenfengyuan/vue-qrcode')], resolve)
    }
  },
  props: ['className', 'value', 'options'],
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
  },
  watch: {}
}
</script>
