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
    .err-box{
      height:40px;
      overflow: hidden;
      border:1px solid transparent;
      .triangle{
        display: inline-block;
        border:8px solid transparent;
        transform:rotate(90deg);
        margin-right:-5px;
        margin-top:-14px;
        vertical-align: middle;
      }
      span{
        vertical-align: top;
        display:inline-block;
        height:40px;
        line-height:40px;
        font-size: 14px;
        padding:0 20px 0 30px;
        border-radius: 14px;
      }
    }
    &.night{
      .err-box{
        height:40px;
        overflow: hidden;
        /*border:1px solid transparent;*/
        >.triangle{
          display: inline-block;
          border:8px solid transparent;
          border-top-color:#17283d;
          transform:rotate(90deg);
          margin-right:-5px;
          margin-top:-14px;
          vertical-align: middle;
        }
        >span{
          vertical-align: top;
          display:inline-block;
          height:40px;
          line-height:40px;
          color:$mainColor;
          font-size: 14px;
          background-color: #17283d;
          padding:0 20px 0 30px;
          border-radius: 14px;
        }
      }
    }
    &.day{
      .err-box{
        height:40px;
        overflow: hidden;
        /*border:1px solid #ecf1f8;*/
        >.triangle{
          display: inline-block;
          border:8px solid transparent;
          border-top-color:#ecf1f8;
          transform:rotate(90deg);
          margin-right:-5px;
          margin-top:-14px;
          vertical-align: middle;
        }
        >span{
          vertical-align: top;
          display:inline-block;
          height:40px;
          line-height:40px;
          color:$mainColor;
          font-size: 14px;
          background-color: #fff;
          padding:0 20px 0 30px;
          border-radius: 14px;
          border:1px solid #ecf1f8;
        }
      }
    }
  }
</style>
