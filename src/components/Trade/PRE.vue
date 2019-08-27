<!--
  author: zhaoxinlei
  update: 20190825
  description: 当前组件为 币币交易 PRE 活动组件
-->
<template lang="pug">
  .activity-box.cursor-pointer(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
    v-if="isShowPREActivity"
    @click="PREJumpToTradeCenter"
  )
    .inner-box
      header
        h2(:title="$projectName_S_X") {{$projectName_S_X}}
          p
            strong {{$sellCoinName_S_X}} {{$stepDesc_S_X}}
        .tips {{ $PREStatus_S_X === 'coming' ? $t('M.trade_start'): $t('M.trade_going')}}
    .body
      p {{$PREStatus_S_X=='coming' ? $t('M.trade_langstart') : $t('M.trade_langEnd')}}:
        span.time  {{PRE_Days}}
        span  {{$isChineseLanguage_G_X?'天':'Day'}}
        span.time  {{PRE_Hours}}
        span  {{$isChineseLanguage_G_X?'时':'Hou'}}
        span.time  {{PRE_Minutes}}
        span  {{$isChineseLanguage_G_X?'分':'Min'}}
        span.time  {{PRE_Seconds}}
        span  {{$isChineseLanguage_G_X?'秒':'Sec'}}
      // 发行量
      p {{$t('M.trade_currentAccount')}}:  {{$publishCount_S_X}} {{$sellCoinName_S_X}}
      // 兑换比例
      p {{$t('M.trade_bili')}}:  1 {{$sellCoinName_S_X}} = {{$exchangeRatio_S_X}} {{$buyCoinName_S_X}}
      // 单人限额
      p {{$t('M.trade_singleLimit')}}:  {{$limitAmount_S_X}} {{$buyCoinName_S_X}} / {{$isChineseLanguage_G_X?'人':'people'}}
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
    clearInterval(this.PRETimer)
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
      clearInterval(this.PRETimer)
      this.PRE_currentTime = newVal
      this.PRETimer = setInterval(() => {
        this.PRE_currentTime -= 1000
        if (this.PRE_currentTime < 1000) {
          clearInterval(this.PRETimer)
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
    background: url("../../assets/PRE/pre-bg-small.png") no-repeat center center/100%;
    -webkit-background-size: 100%;
    background-size: 100%;

    .inner-box {
      /* overflow: hidden; */

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
          position: relative;
          right: -4px;
          height: 30px;
          padding: 0 5px 0 8px;
          border-bottom-left-radius: 15px;
          border-top-left-radius: 15px;
          line-height: 30px;
          text-align: center;
          white-space: nowrap;
          background: #f03e3e;

          &::before {
            position: absolute;
            bottom: -7px;
            right: -.5px;
            width: 0;
            height: 0;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 5px solid #f03e3e;
            content: '';
          }
        }
      }
    }

    .body {
      margin-top: 15px;

      p {
        line-height: 24px;
        white-space: nowrap;

        span {
          font-weight: 800;
          font-size: 12px;
          color: #f03e3e;

          &.time {
            font-size: 15px;
          }
        }
      }
    }
  }
</style>
