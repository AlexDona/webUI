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
  activated () {},
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
  .user-protocol-box {
    width: 100%;
    height: 100%;

    > .content {
      width: 100%;

      > .content {
        overflow: hidden;

        > .inner-box {
          width: 1100px;
          height: 1100px;
          padding: 20px 50px;
          margin: 0 auto;
          overflow: auto;

          > h2 {
            line-height: 70px;
            text-align: center;
          }
        }
      }
    }

    &.night {
      > .content {
        > .content {
          background-color: #1e2636;

          > .inner-box {
            color: #8ba0ca;
            background-color: #1e2636;
          }
        }
      }
    }

    &.day {
      > .content {
        > .content {
          background-color: #fff;

          > .inner-box {
            border: 1px solid rgba(234, 235, 236, 1);
            color: #666;
            background-color: #fff;
          }
        }
      }
    }
  }
</style>
