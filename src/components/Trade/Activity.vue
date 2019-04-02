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
          <p><strong>YST(第一轮/共三轮)</strong></p>
        </h2>
        <div class="tips">
          {{serverTime >= 0 ? '即将开始': '正在进行'}}</div>
      </header>
      <!--显示服务器时间并倒计时-->
      {{serverTime >= 0 ? timeFormatting(serverTime): timeFormatting(nextCountDown)}}
    </div>
    <div class="body">
      <p>
        距离结束:
        <span>0 </span>天
        <span>{{hour}}}</span>时
        <span>{{min}}</span>分
        <span>{{sec}}</span>秒
      </p>
      <p>本轮数量: 1,300,000 YST</p>
      <p>兑换比例: 1 YST = 0.09 USDT</p>
      <p>单人限额: 1500 USDT/人</p>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {formatSeconds} from '../../utils'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      'serveTimes': this.serverTime,
      'isShow': true,
      'hours': 0,
      'min': 0,
      'sec': 0
    }
  },
  created () {
    console.log(this.serverData)
    this.countdown()
    // console.log(new Date().getTime())
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  beforeDestroy () {},
  destroyed () {},
  methods: {
    timeFormatting (date) {
      return formatSeconds(date)
    },
    // 倒计时时间
    countdown () {
      // 相差的毫秒数
      // 一秒后递归
      setTimeout(function () {
        const msec = this.serverTime
        console.log(msec)
        // 计算时分秒数
        let day = parseInt(msec / 1000 / 60 / 60 / 24)
        let hr = parseInt(msec / 1000 / 60 / 60 % 24)
        let min = parseInt(msec / 1000 / 60 % 60)
        let sec = parseInt(msec / 1000 % 60)
        // 个位数前补零
        hr = hr > 9 ? hr : '0' + hr
        min = min > 9 ? min : '0' + min
        sec = sec > 9 ? sec : '0' + sec
        // 控制台打印
        console.log(`${day}天 ${hr}小时 ${min}分钟 ${sec}秒`)
      }, 1000)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      serverData: state => state.trade.serverData,
      isShowServerPort: state => state.trade.serverData.isShowServerPort,
      serverTime: state => state.trade.serverData.serverTime
    })
  },
  watch: {
    serverTime (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.serveTimes = newVal
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
      margin-top: 5px;

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
