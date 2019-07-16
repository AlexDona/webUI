<!-- 二维码组件 -->
<template>
  <Qrcode
    :logoSrc="logoSrc"
    :class="className"
    :text="value"
    :logoScale="0.2"
    :size="size"
    :logoCornerRadius="1"
    :logoMargin="0"
    logoBackgroundColor="#fff"
    v-if="value"
    colorLight="#fff"
    :dotScale="0.999"
  />
</template>
<script>

export default {
  components: {
    Qrcode: resolve => {
      require([('vue-qr')], resolve)
    }
  },
  props: {
    className: {
      type: String
    },
    value: {
      type: String
    },
    options: {
      type: Object
    },
    logoSrc: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 170
    }
  },
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
