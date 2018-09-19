<template>
  <div
    class="rate-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <h2>{{APIDocumentData.termsTypeName}}</h2>
          <div
            class="content"
            v-html="APIDocumentData.content"
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
      theme: state => state.common.theme,
      APIDocumentData: state => state.footerInfo.serviceProtocolData.APIDocumentData

    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .rate-box{
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
          padding:50px;
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
