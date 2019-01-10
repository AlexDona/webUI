<template>
  <div
    class="banner-box home"
  >
    <img
      :src="bannerBackgroundImage"
      :style="{
        width:screenWidth*3+'px',
        height:screenWidth/1.19+'px',
        minWidth: '1366px',
        minHeight: '383px'
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
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      bannerBackgroundImage: state => state.home.bannerBackgroundImage,
      clientWidth: state => state.common.clientWidth
    }),
    screenWidth () {
      return this.clientWidth / 3
    }
  },
  watch: {
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .banner-box {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(#1d3863, #251f3d);
    background-size: 100% 100%;
    transition: all 1s;

    > img {
      /* width:100%; */
    }
  }
</style>
