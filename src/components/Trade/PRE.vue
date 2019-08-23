<template>
  <div
    class="activity-box"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    v-if="($status_S_X=='coming'||($status_S_X=='ongoing'&&currentTime>1000)) && $activityInfo_S_X.showCountDown"
  >
    <div class="inner-box">
      <header>
        <h2 :title="$projectName_S_X">
          {{$projectName_S_X}}
          <p><strong>{{$sellCoinName_S_X}} {{$stepDesc_S_X}}</strong></p>
        </h2>
        <div class="tips">
          {{ $status_S_X === 'coming' ? $t('M.trade_start'): $t('M.trade_going')}}</div>
      </header>
    </div>
    <div class="body">
      <!--显示服务器时间并倒计时-->
      <p>
        {{$status_S_X=='coming' ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}:
        <span>{{days}}</span>{{$isChineseLanguage_G_X?'天':'Day'}}
        <span>{{hours}} </span>{{$isChineseLanguage_G_X?'时':'Hou'}}
        <span>{{minutes}} </span>{{$isChineseLanguage_G_X?'分':'Min'}}
        <span>{{seconds}} </span>{{$isChineseLanguage_G_X?'秒':'Sec'}}
      </p>
      <!-- 发行量 -->
      <p>{{$t('M.trade_currentAccount')}}: {{$publishCount_S_X}} {{$sellCoinName_S_X}}</p>
      <!-- 兑换比例-->
      <p>{{$t('M.trade_bili')}}: 1 {{$sellCoinName_S_X}} = {{$exchangeRatio_S_X}} {{$buyCoinName_S_X}}</p>
      <!-- 单人限额 -->
      <p>{{$t('M.trade_singleLimit')}}: {{$limitAmount_S_X}} {{$buyCoinName_S_X}} / {{$isChineseLanguage_G_X?'人':'people'}}</p>
    </div>
  </div>
</template>
<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import mixin from '../../mixins/PRE'

export default {
  mixins: [mixin],
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {
  },
  mounted () {
  },
  methods: {
    ...mapActions([
    ]),
    ...mapMutations([])
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  destroyed () {
    clearInterval(this.timer)
  },
  filter: {},
  computed: {
    ...mapState({
    })
  },
  watch: {
    async $middleTopData_S_X (newVal) {
      // const {partnerTradeId} = newVal
      // const {tradeId} = this.$activityInfo_S_X
    },
    startTime (newVal) {
      if (newVal - 0 < 0) return
      clearInterval(this.timer)
      this.currentTime = newVal
      this.timer = setInterval(() => {
        this.currentTime -= 1000
        if (this.currentTime < 1000) {
          clearInterval(this.timer)
          // this.GET_PRE_INFO_A()
        }
      }, 1000)
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

        h2 {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

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
          white-space: nowrap;
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
