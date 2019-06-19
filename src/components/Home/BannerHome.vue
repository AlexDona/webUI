<template>
  <div
    class="banner-box home"
  >
    <div
      class="img"
      :style="{
        background: `url(${bannerBackgroundImage}) center center/cover no-repeat`
      }"
    ></div>
    <SliderHome class="slider-content"/>
  </div>
</template>
<script>
import SliderHome from './SliderHome'
import {mapState} from 'vuex'
export default {
  components: {
    SliderHome
  },
  // data () {
  //   return {
  //   }
  // },
  // created () {
  // },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  // methods: {},
  // filter: {},
  computed: {
    ...mapState({
      bannerBackgroundImage: state => state.home.bannerBackgroundImage,
      clientWidth: state => state.common.clientWidth
    }),
    screenWidth () {
      return this.clientWidth / 3
    }
  }
  // watch: {
  // }
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

    > .img {
      position: absolute;
      top: 0;
      left: 50%;
      width: 100%;
      transform: translateX(-50%);
    }

    /deep/ {
      @media screen and (min-width: 1440px) {
        .slider-content {
          margin-top: 540px;
        }
      }

      @media screen and (max-width: 1440px) {
        .slider-content {
          margin-top: 400px;
        }
      }
    }

    @media screen and (min-width: 1440px) {
      > .img {
        height: 540px;
      }
    }

    @media screen and(max-width: 1440px) {
      > .img {
        height: 400px;
      }
    }
  }

  @media screen and (min-width: 1440px) {
    .banner-box {
      height: 720px;
    }
  }

  @media screen and (max-width: 1440px) {
    .banner-box {
      height: 580px;
    }
  }
</style>
