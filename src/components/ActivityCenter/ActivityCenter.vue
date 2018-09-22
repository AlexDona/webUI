<template>
  <div
    class="activity-center-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    活动中心
  </div>
</template>
<script>
import HeaderCommon from '../Common/HeaderCommonForPC'
export default {
  components: {
    HeaderCommon
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
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss">
  .activity-center-box{
    >.inner-box{

    }
    &.night{}
    &.day{}
  }
</style>
