<template>
  <div
    class="banner-box home"
    :style="{
      background:`url(${bannerBackgroundImage}) no-repeat center center`
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
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
      'bannerBackgroundImage'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  .banner-box{
    height:500px;
    width:100%;
    background:linear-gradient(#1d3863,#251f3d);
    -webkit-background-size: 100% 100%;
    background-size: 100% 100%;
    overflow: hidden;
    transition: all 1s;
  }
</style>
