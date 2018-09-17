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
    >
    </Slider>
  </div>
</template>
<script>
import Slider from 'vue-concise-slider'// 引入slider组件
import {getBanner} from '../../utils/api/home'
import {returnAjaxMessage} from '../../utils/commonFunc'
// import lrz from 'lrz'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('home')
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
        autoplay: 4000, // 自动播放:时间[ms]
        infinite: 8
      },
      sliderListAjax: []
    }
  },
  created () {
    require('../../../static/css/list/Home/SliderHome.css')

    // 请求轮播图数据
    this.getBanner()
    let sliderList = []
    this.sliderListAjax.forEach((item) => {
      sliderList.push({
        style: {
          width: '230px',
          height: '120px',
          borderRadius: '4px',
          margin: '20px',
          cursor: 'pointer',
          overflow: 'hidden'
        },
        component: {
          props: ['item', 'sliderinit', 'pages'],
          data () {
            return {
              miniImg: item.miniImg,
              background: item.background
            }
          },
          mounted () {
          },
          methods: {
            ...mapMutations([
              'CHANGE_BANNER_ACTIVE',
              'CHANGE_BANNER_BACKGROUND'
            ]),
            mouseOver (e) {
              const URL = e.target.attributes.background.value
              this.CHANGE_BANNER_ACTIVE(true)
              this.CHANGE_BANNER_BACKGROUND(URL)
            },
            mouseLeave () {
              this.CHANGE_BANNER_ACTIVE(false)
              this.CHANGE_BANNER_BACKGROUND(this.bannerDefaultBackground)
            }
          },
          computed: {
            ...mapState({
              bannerActive: state => state.home.bannerActive,
              bannerDefaultBackground: state => state.home.bannerDefaultBackground
            })
          },
          template: `<router-link
                       style="width: 100%;height:100%"
                       to="/home/${item.id}"
                     >
                       <img
                        style="width: 100%;height:100%"
                        :src="miniImg"
                        :background="background"
                        @mouseenter="mouseOver"
                        @mouseleave="mouseLeave"
                       />
                     </router-link>`
        }
      })
    })

    this.pages = sliderList
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 获取轮播图
    async getBanner () {
      const params = {
        partnerId: this.partnerId,
        language: 'CHN'
      }
      const data = await getBanner(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        console.log(data)
        this.sliderListAjax = data.data.data
        console.log(this.sliderListAjax)
        // this.sliderListAjax.forEach((item, index) => {
        //   console.log(item.url)
        //   lrz(item.url).then((res) => {
        //     console.log(res)
        //   }).catch((err) => {
        //     console.log(err)
        //   })
        // })
        this.renderSlider()
      }
    },
    renderSlider () {
      let sliderList = []
      this.sliderListAjax.forEach((item) => {
        sliderList.push({
          style: {
            width: '230px',
            height: '120px',
            borderRadius: '4px',
            margin: '20px',
            cursor: 'pointer',
            overflow: 'hidden'
          },
          component: {
            props: ['item', 'sliderinit', 'pages'],
            data () {
              return {
                miniImg: item.url,
                background: `${require('../../assets/develop/banner-bg.png')}`
              }
            },
            mounted () {
            },
            methods: {
              ...mapMutations([
                'CHANGE_BANNER_ACTIVE',
                'CHANGE_BANNER_BACKGROUND'
              ]),
              mouseOver (e) {
                const URL = e.target.attributes.background.value
                this.CHANGE_BANNER_ACTIVE(true)
                this.CHANGE_BANNER_BACKGROUND(URL)
              },
              mouseLeave () {
                this.CHANGE_BANNER_ACTIVE(false)
                this.CHANGE_BANNER_BACKGROUND(this.bannerDefaultBackground)
              }
            },
            computed: {
              ...mapState({
                bannerActive: state => state.home.bannerActive,
                bannerDefaultBackground: state => state.home.bannerDefaultBackground
              })
            },
            template: `<router-link
                       style="width: 100%;height:100%"
                       to="/home/${item.id}"
                     >
                       <img
                        style="width: 100%;height:100%"
                        :src="miniImg"
                        :background="background"
                        @mouseenter="mouseOver"
                        @mouseleave="mouseLeave"
                       />
                     </router-link>`
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
      partnerId: state => state.common.partnerId
    })
  },
  watch: {
    'bannerActive' (now) {
      // 开启暂停轮播
      now ? this.$refs.slider.$emit('autoplayStop') : this.$refs.slider.$emit('autoplayStart', 4000)
    }
  }
}
</script>
<style scoped lang="scss">
  .slider-box{
    /*height:300px;*/
    /*margin:200px auto;*/
    width:100%;
    transition: all 4s;
    position: absolute;
    bottom:40px;
    &.active{
      opacity:.2;
    }
    /*opacity:.8;*/
    .inner-box{
      width:1040px;
      height:270px;
    }
  }
</style>
