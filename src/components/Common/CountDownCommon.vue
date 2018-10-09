<template>
  <button
    class="count-down cursor-pointer"
    :class="className"
    :disabled="disabled"
    :status="status"
    @click.prevent="run"
  >
    {{text}}
  </button>
</template>
<!--请严格按照如下书写书序-->
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('user')
export default {
  components: {},
  props: {
    second: {
      type: Number,
      default: 60
    },
    status: {
      type: Boolean
    }
  },
  data () {
    return {
      time: 0,
      disabled: false,
      text: this.$t('M.comm_get_code')
    }
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS'
    ]),
    run () {
      this.$emit('run')
    },
    start () {
      this.time = this.second
      this.disabled = true
      this.timer()
      this.SET_USER_BUTTON_STATUS({
        loginType: 0,
        status: false
      })
      this.SET_USER_BUTTON_STATUS({
        loginType: 1,
        status: false
      })
    },
    timer () {
      if (this.time > 0) {
        this.time--
        setTimeout(this.timer, 1000)
      } else {
        this.disabled = false
      }
    }
  },
  filter: {},
  computed: {
    // text () {
    //   return this.time > 0 ? this.time + 's' + this.$t('M.comm_after_get') : this.$t('M.comm_get_code')
    // }
  },
  watch: {
    status (newVal) {
      console.log(newVal)
      if (newVal) {
        this.$emit('run')
        this.start()
      }
    },
    text (newVal, oldVal) {
      console.log(newVal)
    },
    time (newVal, oldVal) {
      if (newVal > 0) {
        this.text = this.time + 's' + this.$t('M.comm_after_get')
      } else {
        this.text = this.$t('M.comm_get_code')
      }
      this.$forceUpdate()
    }
  }
}
</script>
<style scoped lang="scss">

</style>
