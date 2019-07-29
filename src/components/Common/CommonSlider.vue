<!--
  author: zhaoxinlei
  create: 20190417
  description: 当前页面为 滑块组件,供（登录、注册、忘记密码页面使用）
-->
<template lang="pug">
  .drag-box.forbid-copy(
    :style="{width:`${propMaxWidth}px`}"
  )
    .drag(
      :style="{height:`${height}px`,'line-height':`${height}px`}"
      v-show="!confirmSuccess"
    )
      .drag_bg.border-radius4(
        :style="{height:`${height-2}px`,'line-height':`${height-2}px`}"
      )
      .drag_text {{$t('M.login_verifyTips')}}
      .handler.handler_bg(
        :style="{height:`${height-2}px`, width:`${barWidth}px`}"
        @mouseup="mouseUpFn($event)"
        @mousedown="mouseDownFn($event)"
        @touchstart.prevent="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      )
    .drag-success(
      :style="{height:`${height}px`,'line-height':`${height}px`}"
      v-show="confirmSuccess"
    )
      span.left {{$t(successText)}}
      span.right(
        :style="{width:`${height}px`}"
      )
        Iconfont.icon(icon-name="icon-duihao-copy-copy")
</template>
<script>
import { CSSAnimate } from '../../utils'
export default {
  // name: 'common-slider',
  // components: {},
  props: {
    // 拖动最大宽度
    'propMaxWidth': {
      type: Number
    },
    'height': {
      type: Number
    },
    'barWidth': {
      type: Number
    },
    // 成功后重置
    initAfterSuccess: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 距离屏幕左端距离
      beginClientX: 0,
      // 触发拖动状态  判断
      mouseMoveStatus: false,
      // 验证成功判断
      // confirmSuccess: true,
      confirmSuccess: false,
      maxWidth: 0,
      dragTimer: null,
      successText: 'M.slider_bar_success_tips'
    }
  },
  async created () {
    this.maxWidth = this.propMaxWidth - this.barWidth
  },
  mounted () {
    this.$toggleEventListener_X('bind', this.mouseMoveFn, this.mouseUpFn)
  },
  // updated () {},
  // beforeRouteUpdate () {},
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  // destroyed () {}
  methods: {
    mouseUpFn (e) {
      this.mouseMoveStatus = false
      let width = e.clientX - this.beginClientX
      if (width < this.maxWidth) {
        if (document.querySelector('.handler')) {
          document.querySelector('.handler').style.left = '-1px'
          document.querySelector('.drag_bg').style.width = 0
        }
      }
    },
    mouseMoveFn (e) {
      if (this.mouseMoveStatus) {
        let width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxWidth) {
          this.$changeCSS_X('.handler', 'left', width)
          this.$changeCSS_X('.drag_bg', 'width', width + 5)
        } else if (width > this.maxWidth) {
          this.sliderSuccessCallback()
        }
      }
    },
    mouseDownFn (e) {
      this.mouseMoveStatus = true
      this.beginClientX = e.clientX
    },
    touchStart (e) {
      this.startX = e.targetTouches[0].pageX
    },
    touchMove (e) {
      this.moveX = e.targetTouches[0].pageX
      let left = this.moveX - this.startX

      let targetLeft = parseInt(window.getComputedStyle(document.querySelector(`.handler`)).left)
      if (targetLeft < 0 || left < 0) return false
      targetLeft < this.maxWidth && targetLeft >= 0 ? this.$changeCSS_X('.handler', 'left', left) : this.sliderSuccessCallback()
    },
    touchEnd (e) {
      CSSAnimate(document.querySelector('.handler'), { left: 0 }, 15, 0.8, this.dragTimer)
    },
    // 按下滑块函数
    sliderSuccessCallback () {
      this.$changeCSS_X('.handler', 'left', this.maxWidth)
      this.$changeCSS_X('.drag_bg', 'width', this.maxWidth + 5)
      this.confirmSuccess = true
      this.timer = setTimeout(() => {
        this.$emit('successCallback')
        this.mouseMoveStatus = false
        this.$changeCSS_X('.handler', 'left', '-1px')
        this.$changeCSS_X('.drag_bg', 'width', 0)
      }, 500)
    }
  },
  // filter: {},
  // computed: {
  // },
  watch: {
    confirmSuccess (newV) {
      if (newV && this.initAfterSuccess) {
        this.timer = setTimeout(() => {
          this.confirmSuccess = false
        }, 500)
      }

      if (this.initAfterSuccess) {
        this.$changeCSS_X('.handler', 'left', 0)
        this.$changeCSS_X('.drag_bg', 'width', 0)
      }
    }
  }
}
</script>
<style scoped lang="stylus">
  @import "../../assets/CSS/index.styl"
  .drag-box
    overflow hidden
    >.drag
      position relative
      width 100%
      border 1px solid #25283D
      background-color #32395c
      text-align center
      cursor pointer
      border-radius 4px
      >.drag_bg
        background-color #3c4369
        width 0
        border-radius 4px 0 0 4px
      .drag_text
        position absolute
        top 0
        width 100%
        font-size 14px
        background -webkit-gradient(linear, left top, right top, color-stop(0, #61688a), color-stop(.4, #61688a), color-stop(.5, #fff), color-stop(.6, #61688a), color-stop(1, #61688a))
        -webkit-background-clip text
        -webkit-animation slidedownlock 3s infinite
        -moz-user-select none
        -webkit-user-select none
        -o-user-select none
        -ms-user-select none
        user-select none
        -webkit-text-fill-color transparent
        -webkit-text-size-adjust none
      .handler_bg
        position absolute
        top 0
        left -1px
        background #25283d url('../../assets/develop/arrow-bg.png') no-repeat center center
        cursor move
        border-radius 4px
    >.drag-success
      width 100%
      display flex
      background-color #3c4369
      border-radius 4px
      overflow hidden
      -moz-user-select none
      -webkit-user-select none
      -o-user-select none
      -ms-user-select none
      user-select none
      >.left
        flex 1
        color #118548
        text-align center
      >.right
        font-size 18px
        background-color #2b3152
        overflow hidden
        text-align center
        display inline-block
        border-radius 4px
        border 1px solid rgba(37,40,61,1)
        .icon
          font-size 24px
          color #118548
          /*vertical-align sub*/
  @keyframes slidedownlock {
    0% {
      background-position: -200px 0;
    }

    100% {
      background-position: 200px 0;
    }
  }
</style>
