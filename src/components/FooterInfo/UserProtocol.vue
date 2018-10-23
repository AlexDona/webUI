<template>
  <div
    class="user-protocol-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <h2>{{userProtocolData.termsTypeName}}</h2>
          <div
            class="content"
            v-html="userProtocolData.content"
          >

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// import {getServiceProtocolData} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {
      // content: {}
    }
  },
  created () {

  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      userProtocolData: state => state.footerInfo.serviceProtocolData.userProtocolData
    })
  },
  watch: {
    userProtocolData (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .user-protocol-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.content{
        background-color: green;
        /*overflow: hidden;*/
        >.inner-box{
          margin:0;
          height:1069px;
          width:1000px;
          box-sizing: border-box;
          padding:0px 50px;
          line-height: 26px;
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
          background-color: #121824;
          >.inner-box{
            background-color: #1e2636;
            overflow: auto;
            /*color: #fff;*/
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
