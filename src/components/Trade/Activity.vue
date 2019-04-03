<template>
  <div
    class="activity-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-if = "isShow && $isNeedYST_G_X && $isNeedYST_G_X - 0 > 0"
  >
    <div class="inner-box">
      <header>
        <h2>
          YOOsourcing
          <p><strong>YST( {{$t('M.trade_startOne')}}/{{$t('M.trade_thired')}} )</strong></p>
        </h2>
        <div class="tips">
          {{ serverTime > 0 ? $t('M.trade_start'): $t('M.trade_going')}}</div>
      </header>
    </div>
    <div class="body">
      <!--显示服务器时间并倒计时-->
      <p>
        {{serverTime > 0 ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}:
        <span>0 </span>{{$t('M.trade_data')}}
        <span>{{serverTime > 0 ? beforeHours : 0 }} </span>{{$t('M.trade_hours')}}
        <span>{{serverTime > 0 ? beforeMin : afterMin}} </span>{{$t('M.trade_seconds')}}
        <span>{{serverTime > 0 ? beforeSec : afterSec}} </span>{{$t('M.trade_limit')}}
      </p>
      <p>{{$t('M.trade_currentAccount')}}: 2,150,000 YST</p>
      <p>{{$t('M.trade_bili')}}: 1 YST = 0.1 USDT</p>
      <p>{{$t('M.trade_singleLimit')}}: 1500 USDT/{{$t('M.trade_people')}}</p>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import {formatSecondsActivity} from '../../utils'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      serveTimes: 0,
      beforeHours: 0,
      beforeMin: 0,
      beforeSec: 0,
      afterMin: 0,
      afterSec: 0,
      beforeActivityTimer: null,
      afterActivityTimer: null,
      currentNextCountDown: 0,
      // 是否展示活动框
      localShow: true
    }
  },
  created () {
    console.log(this.isShowServerPort)
  },
  mounted () {},
  methods: {
    ...mapMutations([
      'CHANGE_ACTIVITY_STATUS'
    ]),
    countDownTimeBar (times, hour, minute, second, type) {
      if (this[times] === '0') {
        type === 'before' ? clearInterval(this.beforeActivityTimer) : clearInterval(this.afterActivityTimer)
      }
      console.log(this[times] - 1000, this[hour], this[minute], this[second], type)
      let arr = formatSecondsActivity(this[times]).split('-')
      switch (arr.length) {
        case 4:
          if (hour) {
            this[hour] = arr[0].length < 2 ? `0${arr[0]}` : arr[0]
            this[minute] = arr[1].length < 2 ? `0${arr[1]}` : arr[1]
            this[second] = arr[2].length < 2 ? `0${arr[2]}` : arr[2]
          }
          break
        case 3:
          this[minute] = arr[0].length < 2 ? `0${arr[0]}` : arr[0]
          this[second] = arr[1].length < 2 ? `0${arr[1]}` : arr[1]
          break
        case 2:
          this[minute] = '00'
          this[second] = arr[0].length < 2 ? `0${arr[0]}` : arr[0]
          console.log(arr[0])
          if (arr[0] === '0') {
            if (type === 'before') {
              clearInterval(this.beforeActivityTimer)
              window.location.reload()
            } else {
              clearInterval(this.afterActivityTimer)
              this.localShow = false
              this.CHANGE_ACTIVITY_STATUS(true)
            }
          }
          break
      }
    }
  },
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {
    clearInterval(this.beforeActivityTimer)
    clearInterval(this.afterActivityTimer)
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      serverData: state => state.trade.serverData,
      isShowServerPort: state => state.trade.serverData.isShowServerPort,
      // 9点到九点半的时间
      nextCountDown: state => state.trade.serverData.nextCountDown,
      // 当前时间到9点的时间
      serverTime: state => state.trade.serverData.serverTime
    }),
    isShow () {
      return this.isShowServerPort && this.localShow
    }
  },
  watch: {
    $middleTopData_S_X (newVal) {
      console.log(newVal)
    },
    serverTime (newVal, oldVal) {
      clearInterval(this.beforeActivityTimer)
      if (newVal - 0 >= 0 && newVal !== oldVal) {
        this.serveTimes = newVal
        this.beforeActivityTimer = setInterval(() => {
          this.serveTimes = this.serveTimes - 1000
          this.countDownTimeBar('serveTimes', 'beforeHours', 'beforeMin', 'beforeSec', 'before')
        }, 1000)
      }
    },
    nextCountDown (newVal, oldVal) {
      clearInterval(this.afterActivityTimer)
      if (this.serverTime - 0 < 0 && newVal !== oldVal) {
        this.currentNextCountDown = newVal
        // this.timeFormatting(newVal)
        this.afterActivityTimer = setInterval(() => {
          this.currentNextCountDown = this.currentNextCountDown - 1000
          this.countDownTimeBar('currentNextCountDown', '', 'afterMin', 'afterSec', 'after')
        }, 1000)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .activity-box {
    box-sizing: border-box;
    width: 100%;
    height: 193px;
    padding: 15px 0 15px 10px;
    margin-bottom: 10px;
    color: #fff;
    background: url("../../assets/user/activity.png") no-repeat center center;
    -webkit-background-size: 100%;
    background-size: 100%;

    .inner-box {
      overflow: hidden;

      header {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        p {
          font-size: 12px;
          color: #f5c033;

          strong {
            font-weight: 800;
          }
        }

        .tips {
          height: 30px;
          padding: 0 5px 0 8px;
          border-bottom-left-radius: 15px;
          border-top-left-radius: 15px;
          line-height: 30px;
          text-align: center;
          background: #d45858;
        }
      }
    }

    .body {
      margin-top: 15px;

      p {
        line-height: 24px;

        span {
          font-weight: 800;
          font-size: 16px;
          color: #d45858;
        }
      }
    }
  }
</style>
