<template>
  <div
    class="currency-information-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <div class="title">数字资产列表</div>
        <ul class="list">
          <li
            class="currency-item"
            v-for="(item,index) in currencyList"
            :key="index"
          >
            <span>{{item.name}}({{item.shortName}})</span>
          </li>
        </ul>
      </div>
      <div class="right">

      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
  data () {
    return {
      currencyList: [
        {
          id: 1,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 2,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 3,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 4,
          name: '比特币',
          shortName: 'BTC'
        }
      ]
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
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .currency-information-box{
    >.inner-box{
      >.left{
        width:180px;
        height:720px;
        background:rgba(255,255,255,1);
        border:1px solid rgba(236,241,248,1);
      }
      >.right{

      }
    }
  }
</style>
