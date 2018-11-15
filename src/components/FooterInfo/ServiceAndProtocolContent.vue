<template>
  <div
    class="user-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <div
            class="content"
            v-html="content"
          >

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {
  },
  props: ['content'],
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
      theme: state => state.common.theme
      // legislationExplainData: state => state.footerInfo.serviceProtocolData.legislationExplainData
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .user-protocol-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.content{
        overflow: hidden;
        >.inner-box{
          margin:0px auto;
          height:1100px;
          width:1100px;
          padding:0 50px;
          overflow: auto;
          >h2{
            text-align: center;
            line-height: 70px;
          }
        }
      }
    }
    &.night{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #1e2636;
          >.inner-box{
            background-color: #1e2636;
            color:#8BA0CA
          }
        }
      }
    }
    &.day{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #fff;
          >.inner-box{
            border:1px solid rgba(234,235,236,1);
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
