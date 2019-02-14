<template>
  <dl class="new-price">
    <dt class="text-align-c font-size16">
      <span
        :class="{
          up:middleTopData.chg>0,
          down:middleTopData.chg<0
        }"
      >{{$scientificToNumber(middleTopData.last)}}</span>
      <IconFontCommon
        v-show="middleTopData.chg<0"
        iconName="icon-down"
      />
      <IconFontCommon
        v-show="middleTopData.chg>0"
        iconName="icon-up"
      />
    </dt>
  </dl>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import IconFontCommon from '../Common/IconFontCommon'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      middleTopData: state => state.trade.middleTopData
    })
  },
  watch: {
    middleTopData (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index";

  .new-price {
    > dt {
      > span {
        &.up {
          color: $upColor;
        }

        &.down {
          color: $downColor;
        }
      }
    }
  }
</style>
