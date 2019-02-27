<template>
  <div
    class="about-us-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="top">
        <h1>
          <!--关于我们-->
          {{ $t('M.about_us') }}
        </h1>
        <p>Company Profile</p>
      </div>
      <div class="content">
        <div
          class="inner-box"
          v-html="aboutData.content"
        >
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getAboutUsDataAjax} from '../../utils/api/common'
import {
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {
      aboutData: {}
    }
  },
  created () {
    this.getAboutUsData()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async getAboutUsData () {
      const params = {
        language: this.language
      }
      const data = await getAboutUsDataAjax(params)
      if (!data) return false
      this.aboutData = getNestedData(data, 'data[0]') || {content: ''}
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  },
  watch: {
    language () {
      this.getAboutUsData()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .about-us-box {
    width: 100%;
    height: 100%;

    > .content {
      width: 100%;

      > .top {
        width: 100%;
        height: 250px;
        padding-top: 100px;
        text-align: center;
        background: url(../../assets/develop/about-us.png) no-repeat center center;
        background-size: 102% 100%;

        > h1 {
          font-weight: 500;
          font-size: 36px;
          color: #338ff5;
        }

        > p {
          font-size: 22px;
          color: #97aac8;
        }
      }

      > .content {
        overflow: hidden;

        > .inner-box {
          width: 1100px;
          height: 1100px;
          padding: 50px;
          margin: 50px auto;
        }
      }
    }

    &.night {
      > .content {
        > .content {
          background-color: #121824;

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
