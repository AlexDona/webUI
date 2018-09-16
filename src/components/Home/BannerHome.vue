<template>
  <div
    class="banner-box home"
    :style="{
      // background:`url(${require(../../)}) no-repeat center center/100% 100%`,
      width:screenWidth*3+'px',
      height:screenWidth/1.19+'px'
    }"
  >
    <SliderHome/>
  </div>
</template>
<script>
import SliderHome from './SliderHome'
import {mapState} from 'vuex'
export default {
  components: {
    SliderHome
  },
  data () {
    return {
    }
  },
  created () {
    console.log(this.screenWidth)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      bannerBackgroundImage: state => state.home.bannerBackgroundImage
    }),
    screenWidth () {
      return window.innerWidth / 3
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  .banner-box{
    width:100%;
    background:linear-gradient(#1d3863,#251f3d);
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    overflow: hidden;
    transition: all 1s;
    position: relative;
  }
</style>
