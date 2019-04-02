<template>
  <div
    class="activity-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
    v-if = "isShow"
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
      'serveTimes': this.serverTime,
      'isShow': true,
      'beforeHours': 0,
      'beforeMin': 0,
      'beforeSec': 0,
      'afterHours': 0,
      'afterMin': 0,
      'afterSec': 0,
      cancelOrdersTimer: null,
      cancelOrdersTimerd: null
    }
  },
  created () {
    // console.log(new Date().getTime())
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {},
  methods: {
    BIHTimeFormatting (date) {
      return formatSecondsActivity(date)
    }
    // timeFormatting (date) {
    //   if (this.serverTime >= 0) {
    //     setInterval(function () {
    //       date--
    //       let arr = formatSeconds(date).split('')
    //       _.forEach(arr, (item) => {
    //         if (item && item - 0 > 0) {
    //           this.beforeHours = arr[0] + arr[1]
    //           this.beforeMin = arr[2] + arr[3] + arr[4]
    //           this.beforeSec = arr[5] + arr[6] + arr[7]
    //         }
    //       })
    //     }, 1000)
    //     console.log(this.beforeHours, this.beforeMin, this.beforeSec)
    //   } else {
    //     setInterval(function () {
    //       date--
    //       let arr = formatSeconds(date).split('')
    //       _.forEach(arr, (item) => {
    //         if (item && item - 0 > 0) {
    //           this.afterHours = arr[0] + arr[1]
    //           this.afterMin = arr[2] + arr[3] + arr[4]
    //           this.afterSec = arr[5] + arr[6] + arr[7]
    //         }
    //       })
    //     }, 1000)
    //   }
    // }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      serverData: state => state.trade.serverData,
      isShowServerPort: state => state.trade.serverData.isShowServerPort,
      nextCountDown: state => state.trade.serverData.nextCountDown,
      serverTime: state => state.trade.serverData.serverTime
    })
  },
  watch: {
    serverTime (newVal, oldVal) {
      if (newVal - 0 >= 0 && newVal !== oldVal) {
        this.serveTimes = newVal
        this.cancelOrdersTimer = setInterval(() => {
          this.serveTimes = this.serveTimes - 1000
          this.BIHTimeFormatting(this.serveTimes)
          console.log(this.BIHTimeFormatting(this.serveTimes))
          let time = this.BIHTimeFormatting(this.serveTimes)
          console.log(time)
          time.split('-')
          this.beforeHours = time.split('-')[0]
          this.beforeMin = time.split('-')[1]
          this.beforeSec = time.split('-')[2]
        }, 1000)
      }
    },
    nextCountDown (newVal, oldVal) {
      if (this.serverTime - 0 < 0 && newVal !== oldVal) {
        // this.timeFormatting(newVal)
        this.cancelOrdersTimerd = setInterval(() => {
          this.nextCountDown = this.nextCountDown - 1000
          this.BIHTimeFormatting(this.nextCountDown)
          console.log(this.BIHTimeFormatting(this.nextCountDown))
          let time = this.BIHTimeFormatting(this.nextCountDown)
          time.split('-')
          console.log(time.split('-'))
          this.afterHours = time.split('-')[0]
          this.afterMin = time.split('-')[1]
          this.afterSec = time.split('-')[2]
        }, 1000)
      }
    },
    isShowServerPort (newVal, oldVal) {
      this.isShow = newVal
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
          width: 100px;
          height: 30px;
          margin-right: -15px;
          border-radius: 15px;
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
