<template>
  <div
    class="demo-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <keep-aline><HeaderCommon/></keep-aline>
    <div class="inner-box"></div>
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {mapState} from 'vuex'
// import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
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
  computed: {
    ...mapState([
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">

</style>
