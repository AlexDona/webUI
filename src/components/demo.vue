<template>
  <div
    class="demo-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
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
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
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
