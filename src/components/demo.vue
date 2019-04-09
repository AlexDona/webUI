<template>
  <div
    class="demo-box"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div class="inner-box"></div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">

</style>
