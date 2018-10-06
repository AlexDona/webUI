<template>
  <button
    class="count-down cursor-pointer"
    :class="className"
    :disabled="disabled"
    :status="status"
    @click.prevent="run"
  >
  <!-- @click.stop.prevent="run" -->
    {{text}}
  </button>
  <!--<button class="sendSmsBtn" :class="disabled?'dissendSmsBtn':''" type="button" v-on:click="run" :disabled="disabled || time > 0">{{ text }}</button>-->
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
      disabled: false
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
      // console.log(this.disabled)
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
    text: function () {
      return this.time > 0 ? this.time + 's' + this.$t('M.comm_after_get') : this.$t('M.comm_get_code')
    }
  },
  watch: {
    status (newVal) {
      console.log(newVal)
      if (newVal) {
        this.$emit('run')
        this.start()
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>
