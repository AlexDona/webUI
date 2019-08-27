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
        <span class="inner-box"><span class="time">{{PRE_Days}}</span><span>{{$isChineseLanguage_G_X?'天':'Day'}}</span></span>
        <span class="inner-box"><span class="time">{{PRE_Hours}}</span><span>{{$isChineseLanguage_G_X?'时':'Hou'}}</span></span>
        <span class="inner-box"><span class="time">{{PRE_Minutes}}</span><span>{{$isChineseLanguage_G_X?'分':'Min'}}</span></span>
        <span class="inner-box"><span class="time">{{PRE_Seconds}}</span><span>{{$isChineseLanguage_G_X?'秒':'Sec'}}</span></span>
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
      clearInterval(this.PRETimer)
      this.PRE_currentTime = newVal
      this.PRETimer = setInterval(() => {
        this.PRE_currentTime -= 1000
        if (this.PRE_currentTime < 1000) clearInterval(this.PRETimer)
      }, 1000)
    },
    // 活动结束倒计时
    endTime (newVal) {
      if (newVal == 0) return
      clearInterval(this.PRETimer)
      this.PRE_currentTime = newVal
      this.PRETimer = setInterval(() => {
        this.PRE_currentTime -= 1000
        if (this.PRE_currentTime < 1000) clearInterval(this.PRETimer)
      }, 1000)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .mask-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;

    > .inner-box {
      overflow: hidden;

      > .title {
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
          color: #fff;

          > .time {
            display: inline-block;
            padding: 8px;
            margin: 5px;
            font-weight: 700;
            font-size: 18px;
            color: #fff;
            background: url('../../assets/PRE/pre-timer-bg.png') no-repeat center center;
            background-size: 100%;
          }
        }
      }
    }
  }
</style>
