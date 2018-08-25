<template>
  <transition
    enter-active-class="animated fadeIn"
  >
   <span v-show="isShow" class="err-box user" :text="text">
      <div class="triangle"></div>
      <span>{{this.text}}</span>
    </span>
  </transition>
</template>
<!--请严格按照如下书写书序-->
<script>
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
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  .err-box{
    height:40px;
    overflow: hidden;
    border:1px solid transparent;
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
</style>
