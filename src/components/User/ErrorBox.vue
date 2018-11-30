<template>
  <span
    class="animated-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <transition enter-active-class="animated fadeIn">
     <span v-show="isShow" class="err-box user" :text="text">
        <div class="triangle"></div>
        <span>{{this.text}}</span>
      </span>
    </transition>
  </span>
</template>
<!--请严格按照如下书写书序-->
<script>
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {},
  props: ['text', 'isShow'],
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
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
<style scoped lang="scss">
  @import '../../../static/css/scss/index';

  .animated-box {
    .err-box {
      height: 40px;
      border: 1px solid transparent;
      overflow: hidden;

      .triangle {
        display: inline-block;
        margin-top: -14px;
        margin-right: -6px;
        border: 8px solid transparent;
        vertical-align: middle;
        transform: rotate(90deg);
      }

      span {
        display: inline-block;
        height: 40px;
        padding: 0 20px 0 30px;
        border-radius: 14px;
        font-size: 14px;
        line-height: 40px;
        vertical-align: top;
      }
    }

    &.night {
      .err-box {
        > .triangle {
          border-top-color: #17283d;
        }

        > span {
          color: $mainColor;
          background-color: #17283d;
        }
      }
    }

    &.day {
      .err-box {
        > .triangle {
          border-top-color: #ecf1f8;
        }

        > span {
          border: 1px solid #ecf1f8;
          color: $mainColor;
          background-color: #fff;
        }
      }
    }
  }
</style>
