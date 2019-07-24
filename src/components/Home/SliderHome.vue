<!--
  author: zhaoxinlei
  update: 20190619
  description: 当前组件为 首页 轮播图 组件
-->
<template lang="pug">
  .slider-box.home(:class="{active:bannerActive}")
    Slider.inner-box(
      ref="slider"
      :pages="pages"
      :sliderinit="sliderinit"
      @slide='slide'
    )
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
        loop: false, // 无限循环
        autoplay: '', // 自动播放:时间[ms]
        infinite: 0
      },
      AUTO_START_LIMIT: 5,
      sliderListAjax: []
    }
  },
  // async created () {
  // },
  // mounted () {
  // },
  methods: {
    ...mapMutations([
      'CHANGE_BANNER_ACTIVE',
      'CHANGE_BANNER_BACKGROUND'
    ]),
    // 获取轮播图
    async getBanner () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getBanner(params)
      if (!data) return false
      this.sliderListAjax = getNestedData(data, 'data') || []
      let sliderList = []
      this.pages = sliderList
      this.sliderinit.autoplay = this.sliderListAjax.banner_time * 1000
      this.sliderinit.loop = this.sliderListAjax.banner.length >= this.AUTO_START_LIMIT ? true : false
      this.sliderinit.infinite = this.sliderListAjax.banner.length >= this.AUTO_START_LIMIT ? 4 : 0
      this.sliderListAjax.banner.length >= this.AUTO_START_LIMIT ? this.$refs.slider.$emit('autoplayStart', this.sliderinit.autoplay) : this.$refs.slider.$emit('autoplayStop')
      this.renderSlider()
    },
    slide (data) {
      // console.log(data.currentPage)
      let currentIndex = data.currentPage == this.sliderListAjax.banner.length ? 0 : data.currentPage
      let bigUrl = getNestedData(this.sliderListAjax.banner[currentIndex], 'bigUrl')
      this.CHANGE_BANNER_BACKGROUND(bigUrl)
    },
    renderSlider () {
      let bigUrl = getNestedData(this.sliderListAjax.banner, '[0].bigUrl')
      this.CHANGE_BANNER_BACKGROUND(bigUrl)
      let sliderList = []
      this.sliderListAjax.banner.forEach((item) => {
        const {bigUrl, redirectUrl, url} = item
        let that = this
        sliderList.push({
          style: {
            width: '236px',
            height: '130px',
            borderRadius: '4px',
            margin: '33px 14px',
            cursor: redirectUrl ? 'pointer' : '',
            overflow: 'hidden'
          },
          component: {
            props: ['item', 'sliderinit', 'pages'],
            data () {
              return {
                miniImg: http2https(url),
                // background: `${require('../../assets/develop/banner-bg.png')}`
                background: http2https(bigUrl)
              }
            },
            // created () {
            // },
            mounted () {
              $('.slider-pagination-bullet').on('click', (e) => {
                setTimeout(() => {
                  let sliderPaginationList = $('.slider-pagination-bullet')
                  for (let i = 0; i < sliderPaginationList.length; i++) {
                    let sliderPaginationItem = sliderPaginationList[i]
                    let arr = [...sliderPaginationItem.classList]
                    if (arr.indexOf('slider-pagination-bullet-active') != -1) {
                      let bigUrl = getNestedData(that.sliderListAjax.banner[i], 'bigUrl')
                      that.CHANGE_BANNER_BACKGROUND(bigUrl)
                      break
                    }
                  }
                }, 100)
              })
            },
            methods: {
              ...mapMutations([
                'CHANGE_BANNER_ACTIVE',
                'CHANGE_BANNER_BACKGROUND'
              ]),
              mouseOver (e) {
                this.CHANGE_BANNER_ACTIVE(true)
              },
              mouseLeave () {
                this.CHANGE_BANNER_ACTIVE(false)
              },
              jumpToNews () {
                // console.log(item)
                // const {redirectUrl} = item
                if (!redirectUrl) return
                this.$goToPage(`/${this.$routes_X.newsItem}/${redirectUrl.split('/').reverse()[0]}`)
              }
            },
            computed: {
              ...mapState({
                bannerActive: state => state.home.bannerActive
              })
            },
            watch: {
              bannerActive (newVal) {
                // console.log(newVal)
                newVal || that.sliderListAjax.banner.length < that.AUTO_START_LIMIT ? that.$refs.slider.$emit('autoplayStop') : that.$refs.slider.$emit('autoplayStart', this.sliderinit.autoplay)
              }
            },
            template: `<span
                         style="width: 100%;height:100%"
                         @click="jumpToNews"
                   >
                     <img
                      style="width: 100%;height:100%"
                      :src="miniImg"
                      :background="background"
                      @mouseenter="mouseOver"
                      @mouseleave="mouseLeave"
                     />
                   </span>`
          }
        })
      })
      this.pages = sliderList
    }
  },
  filter: {},
  computed: {
    ...mapState({
      bannerActive: state => state.home.bannerActive
    })
  },
  watch: {
    $language_S_X: {
      handler: 'getBanner',
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .slider-box {
    position: absolute;
    width: 100%;

    /* margin:200px auto; */
    overflow: hidden;
    transition: all 4s;

    /* opacity:.8; */
    .inner-box {
      width: 1300px;
      height: 160px;
      margin: 3px auto;
    }
  }

  /deep/ {
    /* 首页轮播图（不分主题） */
    .slider-pagination-bullet {
      width: .2rem;
      height: .04rem;
      margin: 0 3px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, .4);
      transition: all 1s;
    }

    .slider-pagination {
      padding-right: 4px;
      text-align: right;
    }

    @media screen and (min-width: 2560px) {
      .slider-pagination-bullet {
        width: .15rem;
        height: .02rem;
      }
    }

    @media screen and (max-width: 1919px) {
      .slider-pagination-bullet {
        width: .2rem;
        height: .03rem;
      }
    }
  }
</style>
