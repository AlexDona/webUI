<!--
  author: zhaoxinlei
  createTime: 2019-04-09
  description: PRE活动页面币币交易遮罩
-->
<template>
  <div
    class="mask-box"
    :style="{
      background: `url(${$shadeImg_S_X || maskBg}) no-repeat center center/100% 100%`
    }"
  >
    <div class="inner-box">
      <div class="title">
        <h3>{{$projectName_S_X}}</h3>
      </div>
      <div class="sub-title">
        <!-- 项目简介-->
        <a
          :href="$projectDesc_S_X"
          target="_blank"
        >{{$t('M.trade_profile')}}</a>
        <span class="split"></span>
        <!-- 项目规则 -->
        <a
          :href="$activityRule_S_X"
          target="_blank"
        >{{$t('M.trade_rules')}}</a>
      </div>
      <p class="desc">
        <!--即将开盘，距离开始还有-->
        <span>{{$sellCoinName_S_X}}</span> <span>{{$t('M.trade_pre_desc')}}</span>
      </p>
      <div class="timer">
        <span class="inner-box"><span class="time">{{days}}</span><span>{{$isChineseLanguage_G_X?'天':'Day'}}</span></span>
        <span class="inner-box"><span class="time">{{hours}}</span><span>{{$isChineseLanguage_G_X?'时':'Hou'}}</span></span>
        <span class="inner-box"><span class="time">{{minutes}}</span><span>{{$isChineseLanguage_G_X?'分':'Min'}}</span></span>
        <span class="inner-box"><span class="time">{{seconds}}</span><span>{{$isChineseLanguage_G_X?'秒':'Sec'}}</span></span>
      </div>
    </div>
  </div>
</template>
<script>
// import {
//   mapState,
//   mapMutations
// } from 'vuex'
import mixin from '../../mixins/PRE'
export default {
  mixins: [mixin],
  components: {
  },
  // props,
  // data () {
  //   return {
  //   }
  // },
  // created () {
  // },
  // mounted () {},
  // activated () {},
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {
  // },
  // methods: {
  //   ...mapMutations([
  //   ])
  // },
  // filter: {},
  // computed: {
  //   ...mapState({
  //   })
  // },
  watch: {
    // 活动开始倒计时
    startTime (newVal) {
      if (newVal - 0 < 0) return
      clearInterval(this.timer)
      this.currentTime = newVal
      this.timer = setInterval(() => {
        this.currentTime -= 1000
        if (this.currentTime < 1000) clearInterval(this.timer)
      }, 1000)
    },
    // 活动结束倒计时
    endTime (newVal) {
      if (newVal == 0) return
      clearInterval(this.timer)
      this.currentTime = newVal
      this.timer = setInterval(() => {
        this.currentTime -= 1000
        if (this.currentTime < 1000) clearInterval(this.timer)
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .mask-box {
    width: 100%;
    height: 100%;

    > .inner-box {
      overflow: hidden;

      > .title {
        margin: 13% auto 0;
        font-weight: 700;
        font-size: 28px;
        font-family: pangmenzhengdao;
        text-align: center;
        color: $mainColor;
      }

      > .sub-title {
        margin: 3% 0 4%;
        font-family: "Microsoft Himalaya";
        text-align: center;
        vertical-align: middle;

        > a {
          font-weight: 700;
          font-size: 14px;
          color: $mainColor;
        }

        > .split {
          display: inline-block;
          width: 2px;
          height: 10px;
          margin: 0 20px;
          background: $mainColor;
        }
      }

      @media screen and (min-width: 1921px) {
        .sub-title {
          margin: 3% 0;
        }
      }

      > .desc {
        font-weight: 700;
        font-size: 14px;
        text-align: center;
        color: #fff;
      }

      > .timer {
        padding-top: 20px;
        text-align: center;

        > .inner-box {
          display: inline-block;
          font-weight: 700;
          color: $mainColor;

          > .time {
            display: inline-block;
            width: 39px;
            height: 42px;
            margin: 0 10px;
            border: 1px solid $mainColor;
            border-radius: 3px;
            font-weight: 400;
            font-size: 20px;
            line-height: 42px;
            vertical-align: middle;
            text-shadow: 0 0 3px #000;
            color: #fff;
            background-color: rgba(51, 143, 245, .23);
          }
        }
      }
    }
  }
</style>
