<template>
  <el-button
    class="count-down cursor-pointer"
    :class="className"
    :disabled="disabled"
    :status="status"
    @click.prevent="run"
  >
    {{text}}
  </el-button>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  props: {
    second: {
      type: Number,
      default: 60
    },
    status: {
      type: Boolean
    },
    className: {
      type: String
    }
  },
  data () {
    return {
      time: 0,
      disabled: false
    }
  },
  // created () {},
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'SET_USER_BUTTON_STATUS',
      'SET_COUNT_DOWN_RESET_STATUS'
    ]),
    run () {
      console.log(this.status, this.disabledOfPhoneBtn, this.disabledOfEmailBtn)
      this.$emit('run')
    },
    start () {
      this.time = this.second
      this.disabled = true
      this.timer()
      this.SET_USER_BUTTON_STATUS({
        loginType: 0,
        type: 0,
        status: false
      })
      this.SET_USER_BUTTON_STATUS({
        loginType: 0,
        type: 1,
        status: false
      })
      this.SET_USER_BUTTON_STATUS({
        loginType: 1,
        status: false
      })
      console.log(this.disabledOfPhoneBtn, this.disabledOfEmailBtn)
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
    ...mapState({
      countDownResetStatus: state => state.common.countDownResetStatus,
      disabledOfPhoneBtn: state => state.user.disabledOfPhoneBtn,
      disabledOfEmailBtn: state => state.user.disabledOfEmailBtn
    }),
    text () {
      return this.time > 0 ? `${this.time}s` : this.$t('M.comm_get_code')
    }
  },
  watch: {
    time (newVal) {
    },
    countDownResetStatus () {
      this.time = 0
      this.SET_COUNT_DOWN_RESET_STATUS(false)
    },
    status (newVal) {
      // console.log(newVal)
      if (newVal) {
        // this.$emit('run')
        this.start()
      }
    }
  }
}
</script>
<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .count-down
    background-color transparent
    min-width 100px
    width 100%
    border none
    border-radius 0
    &:hover
      background-color transparent
    /deep/
      span
        font-size 14px !important
</style>
