<!-- 二维码组件 -->
<template>
  <Qrcode
    :logoSrc="logoSrc"
    :class="className"
    :text="value"
    :size="size"
    :logoCornerRadius="1"
    :logoMargin="0"
    :logoBackgroundColor="logoBackgroundColor"
    :backgroundColor="backgroundColor"
    v-if="value"
    :colorLight="colorLight"
    :dotScale="1"
    :margin="margin"
    :colorDark="colorDark"
    :autoColor="false"
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
    colorDark: {
      type: String,
      default: '#000'
    },
    margin: {
      type: Number,
      default: 20
    },
    colorLight: {
      type: String,
      default: '#fff'
    },
    logoBackgroundColor: {
      type: String,
      default: '#fff'
    },
    backgroundColor: {
      type: String,
      default: '#fff'
    },
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
  }
  // data () {
  //   return {}
  // },
  // created () {},
  // mounted () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // methods: {},
  // filter: {},
  // computed: {
  // },
  // watch: {}
}
</script>
