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
          {{serverTime >= 0 ? $t('M.trade_start'): $t('M.trade_going')}}</div>
      </header>
      <!--显示服务器时间并倒计时-->
      <!--{{serverTime >= 0 ? timeFormatting(serverTime): timeFormatting(nextCountDown)}}-->
    </div>
    <div class="body">
      <p v-if="serverTime >= 0">
        {{serverTime >= 0 ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}:
        <span>0 </span>{{$t('M.trade_data')}}
        <span>{{beforeHours}} </span>{{$t('M.trade_hours')}}
        <span>{{beforeMin}} </span>{{$t('M.trade_seconds')}}
        <span>{{beforeSec}} </span>{{$t('M.trade_limit')}}
      </p>
      <p v-else>
        {{serverTime >= 0 ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}:
        <span>0 </span>{{$t('M.trade_data')}}
        <span>{{afterHours}} </span>{{$t('M.trade_hours')}}
        <span>{{afterMin}} </span>{{$t('M.trade_seconds')}}
        <span>{{afterSec}} </span>{{$t('M.trade_limit')}}
      </p>
      <p>{{$t('M.trade_currentAccount')}}: 1,300,000 YST</p>
      <p>{{$t('M.trade_bili')}}: 1 YST = 0.09 USDT</p>
      <p>{{$t('M.trade_singleLimit')}}: 1500 USDT/{{$t('M.trade_people')}}</p>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {formatSecondsActivity} from '../../utils'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      serveTimes: this.serverTime,
      beforeHours: 0,
      beforeMin: 0,
      beforeSec: 0,
      afterHours: 0,
      afterMin: 0,
      afterSec: 0,
      cancelOrdersTimer: null,
      cancelOrdersTimerd: null,
      currentNextCountDown: 0,
      localShow: true
    }
  },
  created () {
    console.log(this.isShowServerPort)
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {
    clearInterval(this.cancelOrdersTimer)
    clearInterval(this.cancelOrdersTimerd)
  },
  methods: {
    BIHTimeFormatting (date) {
      return formatSecondsActivity(date)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      serverData: state => state.trade.serverData,
      isShowServerPort: state => state.trade.serverData.isShowServerPort,
      nextCountDown: state => state.trade.serverData.nextCountDown,
      serverTime: state => state.trade.serverData.serverTime
    }),
    isShow () {
      return this.isShowServerPort && this.localShow
    }
  },
  watch: {
    $middleTopData_S_X (newVal) {
      console.log(newVal)
      // clearInterval(this.cancelOrdersTimer)
      // clearInterval(this.cancelOrdersTimerd)
    },
    serverTime (newVal, oldVal) {
      clearInterval(this.cancelOrdersTimer)
      if (newVal - 0 >= 0 && newVal !== oldVal) {
        this.serveTimes = newVal
        this.cancelOrdersTimer = setInterval(() => {
          this.serveTimes = this.serveTimes - 1000
          this.BIHTimeFormatting(this.serveTimes)
          let time = this.BIHTimeFormatting(this.serveTimes)
          let timeArray = time.split('-')
          console.log(timeArray)
          switch (timeArray.length) {
            // 有时,分、秒
            case 4:
              this.beforeHours = timeArray[0].length < 2 ? `0${timeArray[0]}` : timeArray[0]
              this.beforeMin = timeArray[1].length < 2 ? `0${timeArray[1]}` : timeArray[1]
              this.beforeSec = timeArray[2].length < 2 ? `0${timeArray[2]}` : timeArray[2]
              break
            // 只有秒
            case 3:
              this.beforeMin = timeArray[0].length < 2 ? `0${timeArray[0]}` : timeArray[0]
              this.beforeSec = timeArray[1].length < 2 ? `0${timeArray[1]}` : timeArray[1]
              break
            case 2:
              this.beforeMin = '00'
              this.beforeSec = timeArray[0].length < 2 ? `0${timeArray[0]}` : timeArray[0]
              if (timeArray[0] === '0') {
                clearInterval(this.cancelOrdersTimer)
              }
              break
          }
          // this.beforeHours = timeArray[0]
          // this.beforeMin = timeArray[1]
          // this.beforeSec = timeArray[2]
        }, 1000)
      }
    },
    nextCountDown (newVal, oldVal) {
      clearInterval(this.cancelOrdersTimerd)
      if (this.serverTime - 0 < 0 && newVal !== oldVal) {
        this.currentNextCountDown = newVal
        // this.timeFormatting(newVal)
        this.cancelOrdersTimerd = setInterval(() => {
          this.currentNextCountDown = this.currentNextCountDown - 1000
          let time = this.BIHTimeFormatting(this.currentNextCountDown)
          // this.afterHours = time.split('-')[0]
          let timeArray = time.split('-')
          console.log(timeArray)
          switch (timeArray.length) {
            // 分、秒
            case 3:
              this.afterMin = timeArray[0].length < 2 ? `0${timeArray[0]}` : timeArray[0]
              this.afterSec = timeArray[1].length < 2 ? `0${timeArray[1]}` : timeArray[1]
              break
            // 只有秒
            case 2:
              this.afterMin = '00'
              this.afterSec = timeArray[0].length < 2 ? `0${timeArray[0]}` : timeArray[0]
              if (timeArray[0] === '0') {
                clearInterval(this.cancelOrdersTimerd)
                this.localShow = false
              }
              break
          }
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
