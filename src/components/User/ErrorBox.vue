<template>
  <span
    class="animated-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <transition enter-active-class="animated fadeIn">
     <span v-show="isShow" class="err-box user" :text="text">
        <span>{{this.text}}</span>
      </span>
    </transition>
  </span>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  mapMutations,
  mapState
} from 'vuex'
export default {
  components: {},
  props: ['text', 'isShow'],
  data () {
    return {}
  },
  // created () {},
  // mounted () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([])
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .animated-box {
    .err-box {
      height: 40px;
      border: 1px solid transparent;
      overflow: hidden;

      span {
        display: inline-block;
        height: 34px;
        padding: 0 10px;
        border-radius: 14px;
        font-size: 12px;
        line-height: 34px;
        vertical-align: top;
      }
    }

    &.night {
      .err-box {
        > span {
          color: $mainColor;
          background-color: #17283d;
        }
      }
    }

    &.day {
      .err-box {
        > span {
          border: 1px solid #ecf1f8;
          color: $mainColor;
          background-color: #fff;
        }
      }
    }
  }
</style>
