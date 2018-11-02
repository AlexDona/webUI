<template>
  <div
    class="banner-box home"
  >
    <img
      v-lazy="bannerBackgroundImage"
      :style="{
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
    // console.log(this.screenWidth)
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
      // console.log(window.innerWidth)
      return window.innerWidth / 3
    }
  },
  watch: {
    bannerBackgroundImage (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  .banner-box{
    width:100%;
    background:linear-gradient(#1d3863,#251f3d);
    background-size: 100% 100%;
    overflow: hidden;
    transition: all 1s;
    position: relative;
    >img{
      /*width:100%;*/
      /*height:100%;*/
    }
  }
</style>
