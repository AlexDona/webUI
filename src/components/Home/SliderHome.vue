<!--
  @name:首页轮播图
  @author:赵鑫磊
-->
<template>
  <div
    class="slider-box home"
    :class="{active:bannerActive}"
  >
    <Slider
      ref="slider"
      :pages="pages"
      :sliderinit="sliderinit"
      class="inner-box"
      @slide='slide'
    >
    </Slider>
  </div>
</template>
<script>
import Slider from 'vue-concise-slider'// 引入slider组件
import {getBanner} from '../../utils/api/home'
import {
  getNestedData,
  http2https
} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  components: {
    Slider
  },
  data () {
    return {
      pages: [
      ],
      // 滑动配置[obj]
      sliderinit: {
        currentPage: 0,
        tracking: false,
        thresholdDistance: 100, // 滑动距离阈值判定
        thresholdTime: 300, // 滑动时间阈值判定
        loop: true, // 无限循环
        autoplay: 3000, // 自动播放:时间[ms]
        infinite: 8
      },
      sliderListAjax: []
    }
  },
  async created () {
  },
  mounted () {
    // console.log(this.$refs)
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_BANNER_ACTIVE',
      'CHANGE_BANNER_BACKGROUND'
    ]),
    // 获取轮播图
    async getBanner () {
      const params = {
        language: this.language
      }
      const data = await getBanner(params)
      this.sliderListAjax = getNestedData(data, 'data')
      let sliderList = []
      this.pages = sliderList
      this.renderSlider()
    },
    slide (data) {
      let bigUrl = getNestedData(this.sliderListAjax[data.currentPage - 1], 'bigUrl')
      this.CHANGE_BANNER_BACKGROUND(bigUrl)
    },
    renderSlider () {
      let bigUrl = getNestedData(this.sliderListAjax, '[0].bigUrl')
      console.log(bigUrl)
      this.CHANGE_BANNER_BACKGROUND(bigUrl)
      let sliderList = []
      this.sliderListAjax.forEach((item) => {
        let that = this
        sliderList.push({
          style: {
            width: '2.3rem',
            height: '1.2rem',
            borderRadius: '4px',
            margin: '20px',
            cursor: 'pointer',
            overflow: 'hidden'
          },
          component: {
            props: ['item', 'sliderinit', 'pages'],
            data () {
              return {
                miniImg: http2https(item.url),
                // background: `${require('../../assets/develop/banner-bg.png')}`
                background: http2https(item.bigUrl)
              }
            },
            mounted () {
              // console.log(that)
            },
            methods: {
              ...mapMutations([
                'CHANGE_BANNER_ACTIVE',
                'CHANGE_BANNER_BACKGROUND'
              ]),
              mouseOver (e) {
                const URL = getNestedData(e, 'target.attributes.background.value')
                this.CHANGE_BANNER_ACTIVE(true)
                console.log(URL)
                // this.CHANGE_BANNER_BACKGROUND(URL)
              },
              mouseLeave () {
                this.CHANGE_BANNER_ACTIVE(false)
                // this.CHANGE_BANNER_BACKGROUND(this.bannerDefaultBackground)
              }
            },
            computed: {
              ...mapState({
                bannerActive: state => state.home.bannerActive,
                bannerDefaultBackground: state => state.home.bannerDefaultBackground
              })
            },
            watch: {
              bannerActive (newVal) {
                // console.log(newVal)
                // console.log(this.$refs)
                newVal ? that.$refs.slider.$emit('autoplayStop') : that.$refs.slider.$emit('autoplayStart', 4000)
              }
            },
            template: `<a
                         style="width: 100%;height:100%"
                         href="${http2https(item.redirectUrl) || `javascript:void(0)`}"
                   >
                     <img
                      style="width: 100%;height:100%"
                      :src="miniImg"
                      :background="background"
                      @mouseenter="mouseOver"
                      @mouseleave="mouseLeave"
                     />
                   </a>`
          }
        })
      })
      this.pages = sliderList
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 'bannerActive',
      language: state => state.common.language
    })
  },
  watch: {
    language: {
      handler: 'getBanner',
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .slider-box {
    position: absolute;
    bottom: .2rem;
    width: 100%;

    /* height:300px; */

    /* margin:200px auto; */
    overflow: hidden;
    transition: all 4s;

    &.active {
      opacity: .2;
    }

    /* opacity:.8; */
    .inner-box {
      width: 10rem;
      height: 1.7rem;
    }
  }

  /deep/ {
    /* 首页轮播图（不分主题） */
    .slider-pagination-bullet {
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255, .8);
      transition: all 1s;
    }

    .slider-pagination-bullet-active {
      width: 27px;
      border-radius: 6px;
    }
  }
</style>
