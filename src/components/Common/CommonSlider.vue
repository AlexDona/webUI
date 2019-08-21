<!--
  author: zhaoxinlei
  create: 20190417
  description: 当前页面为 滑块组件,供（登录、注册、忘记密码页面使用）
-->
<template lang="pug">
  .drag-box.forbid-copy(
    :style="{width:`${propMaxWidth}px`}"
    :class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X, mobile: isMobile }"
  )
    .drag(
      :style="{height:`${height}px`,'line-height':`${height}px`}"
      v-show="!confirmSuccess"
    )
      .drag_bg.border-radius4(
        :style="{height:`${height-2}px`,'line-height':`${height-2}px`}"
      )
      .drag_text(:class="{mobile: isMobile}") {{$t('M.login_verifyTips')}}
      .handler.handler_bg(
        :style="{height:`${height-2}px`, width:`${barWidth}px`}"
        @mouseup="mouseUpFn($event)"
        @mousedown="mouseDownFn($event)"
        @touchstart="touchStart"
        @touchmove.prevent="touchMove"
        @touchend="touchEnd"
      )
    .drag-success(
      :style="{height:`${height}px`,'line-height':`${height}px`}"
      v-show="confirmSuccess"
    )
      span.left(:class="{mobile: isMobile}") {{$t(successText)}}
      span.right(
        :style="{width:`${height}px`, height: `${height-2}px`, 'line-height':`${height - 2}px`}"
        :class="{mobile: isMobile}"
      )
        Iconfont.icon(icon-name="icon-duihao-copy-copy")
</template>
<script>
import {mapState} from 'vuex'
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
      successText: 'M.slider_bar_success_tips',
      timer: null,
      returnTimer: null,
      moveX: 0,
      startX: 0
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
    clearTimeout(this.returnTimer)
  },
  // destroyed () {}
  methods: {
    mouseUpFn (e) {
      this.mouseMoveStatus = false
      let width = e.clientX - this.beginClientX
      if (width < this.maxWidth) {
        if (document.querySelector('.handler')) {
          document.querySelector('.handler').style.left = 0
          document.querySelector('.drag_bg').style.width = 0
        }
      }
    },
    mouseMoveFn (e) {
      if (this.mouseMoveStatus) {
        let width = e.clientX - this.beginClientX
        if (width > 0 && width <= this.maxWidth) {
          this.$changeCSS_X('.handler', 'left', width)
          this.$changeCSS_X('.drag_bg', 'width', width)
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
      this.mouseMoveStatus = true
      this.startX = e.targetTouches[0].pageX
    },
    touchMove (e) {
      this.moveX = e.targetTouches[0].pageX
      let left = this.moveX - this.startX

      let targetLeft = parseInt(window.getComputedStyle(document.querySelector(`.handler`)).left)
      if (targetLeft < 0 || left < 0) return false
      targetLeft < this.maxWidth && targetLeft >= 0 ? this.$changeCSS_X('.handler', 'left', left) : this.sliderSuccessCallback()
    },
    touchEnd () {
      document.querySelector('.handler').style.left = 0
      document.querySelector('.drag_bg').style.width = 0
      // CSSAnimate(document.querySelector('.handler'), { left: 0 }, 15, 0.8, this.dragTimer)
      // CSSAnimate(document.querySelector('.drag_bg'), { width: 0 }, 15, 0.8, this.dragTimer)
    },
    // 按下滑块函数
    sliderSuccessCallback () {
      this.$changeCSS_X('.handler', 'left', this.maxWidth)
      this.$changeCSS_X('.drag_bg', 'width', this.maxWidth)
      this.confirmSuccess = true

      this.returnTimer = setTimeout(() => {
        this.$emit('successCallback')
        this.mouseMoveStatus = false
        document.querySelector('.handler').style.left = 0
        document.querySelector('.drag_bg').style.width = 0
      }, 300)
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      isMobile: state => state.user.isMobile,
      remWidth_S: state => state.common.remWidth_S
    })
    // remHieght () {}
  },
  watch: {
    confirmSuccess (newV) {
      if (newV) {
        this.timer = setTimeout(() => {
          this.confirmSuccess = false
        }, 1000)
      }

      // if (newV) {
      //   console.log('success')
      //   document.querySelector('.handler').style.left = '-1px'
      //   document.querySelector('.drag_bg').style.width = 0
      // }
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
      text-align center
      cursor pointer
      border-radius 4px
      >.drag_bg
        width 0
        border-radius 4px 0 0 4px
      .drag_text
        position absolute
        top 0
        right 0
        width 90%
        font-size 14px
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
        left 0
        cursor move
        border-radius 4px
    >.drag-success
      width 100%
      display flex
      border-radius 4px
      overflow hidden
      -moz-user-select none
      -webkit-user-select none
      -o-user-select none
      -ms-user-select none
      user-select none
      >.left
        flex 1
        text-align center
      >.right
        box-sizing border-box
        font-size 18px
        overflow hidden
        text-align center
        display inline-block
        border-radius 4px
        &.mobile
          .icon
            font-size .4rem
        .icon
          font-size 24px
    &.night
      >.drag
        background-color #1c203c
        border 1px solid #485776
        >.drag_bg
          background-color #1c203c
        .drag_text
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
          background #485776 url('../../assets/develop/arrow-balck-bg.png') no-repeat center center
          background-size 100%
      >.drag-success
        background-color #1c203c
        border 1px solid #485776
        >.left
          color #118548
        >.right
          background-color #2b3152
          .icon
            color #118548
    &.day
      >.drag
        border 1px solid #ddd
        background-color #ECEAEA
        >.drag_bg
          background-color #f6f4f4
        .drag_text
          background -webkit-gradient(linear, left top, right top, color-stop(0, #999), color-stop(.4, #999), color-stop(.5, #fff), color-stop(.6, #999), color-stop(1, #999))
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
          background #485776 url('../../assets/develop/arrow-white-bg.png') no-repeat center center
          background-size 100%
      >.drag-success
        background-color #F6F4F4
        border 1px solid #DDD
        >.left
          color #118548
        >.right
          background-color #ccc
          border-color #BBB
          .icon
            color #118548
    &.mobile
      >.drag
        width 100%
        border-radius .06rem
        >.drag_bg
          width 0
          border-radius .06rem 0 0 .06rem
        .drag_text
          position absolute
          top 0
          right 0
          width 90%
          font-size .4rem
        .handler_bg
          position absolute
          top 0
          left 0
          cursor move
          border-radius .06rem
      >.drag-success
        width 100%
        display flex
        border-radius .06rem
        overflow hidden
        -moz-user-select none
        -webkit-user-select none
        -o-user-select none
        -ms-user-select none
        user-select none
        >.left
          font-size .4rem
        >.right
          font-size .4rem
          overflow hidden
          text-align center
          display inline-block
          border-radius .06rem
          .icon
            font-size .4rem
      &.night
        >.drag
          border .016rem solid #485776
          background-color #1c203c
        >.drag-success
          background-color #212644
          >.left
            color #118548
          >.right
            background-color #2b3152
            border .016rem solid #485776
            .icon
              color #118548
  @keyframes slidedownlock {
    0% {
      background-position: -200px 0;
    }

    100% {
      background-position: 200px 0;
    }
  }
</style>
