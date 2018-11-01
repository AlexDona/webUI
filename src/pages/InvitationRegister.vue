<template>
  <div
    class="invitation-register-box"
  >
    <HeaderCommonForMobile/>
    <div class="inner-box">

    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import HeaderCommonForMobile from '../components/Common/HeaderForMobile'
export default {
  components: {
    HeaderCommonForMobile
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
    ...mapState({
      isMobile: state => state.user.isMobile
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .invitation-register-box{
    background: linear-gradient(81deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
    height:100%;
    width:100%;
  }
</style>
