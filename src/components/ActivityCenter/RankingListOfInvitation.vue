<template>
  <div
    class="ranking-list-of-invitation-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 邀请排行 -->
    <div class="inner-box">
      <div
        class="top"
        :style="{
          width:screenWidth*3+'px',
          height:screenWidth/1.19+'px'
        }"
      ></div>
      <div class="content">
        <div class="inner-box">
          <div class="header"></div>
          <div class="top">
            <h1
              class="time"
            >
              {{timeFilter(date)}}
            </h1>
            <div v-html="rulesOfInvitation"></div>
          </div>
          <div class="middle-line"></div>
          <div class="main-content">
            <div class="title">
              <!-- 注册邀请排行榜 -->
              {{$t('M.actionCenter_rege')}}
            </div>
            <ul class="table">
              <li class="th text-align-c">
                <span class="td">
                  <!-- 排名 -->
                  {{$t('M.actionCenter_Rank')}}
                </span>
                <span class="td">
                  <!-- 用户 -->
                  {{$t('M.actionCenter_User')}}
                </span>
                <span class="td">
                  <!-- 直接推荐 -->
                  {{$t('M.actionCenter_Direct_recommend')}}
                </span>
                <span class="td">
                  <!-- 间接推荐 -->
                  {{$t('M.actionCenter_Indirect_recommend')}}
                </span>
                <span class="td">
                  <!-- 邀请奖励 -->
                  {{$t('M.actionCenter_Invite_rewards')}}
                </span>
              </li>
              <li
                class="tr"
                v-for="(item,index) in rankingList"
                :key="index"
              >
                <span class="td index text-align-c">
                  <span>
                    {{item.index}}
                  </span>
                </span>
                <span
                  class="td text-align-c"
                  v-if="item.userName"
                >
                  {{phoneNumberFormat(item.userName)}}
                </span>
                <span class="td text-align-c">
                  {{item.count}}
                </span>
                <span class="td text-align-c">
                  {{item.secondCount}}
                </span>
                <span class="td text-align-c">
                  {{item.account}}{{item.coinName}}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
import {
  timeFilter,
  phoneNumberFormat
} from '../../utils'
import {getServiceProtocoDataAjax} from '../../utils/api/common'
import {getRankingList} from '../../utils/api/activityCenter'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'

export default {
  components: {},
  // props,
  data () {
    return {
      date: new Date(),
      timer: '',
      // 上币申请说明
      rulesOfInvitation: '',
      rankingList: [{
        coinName: ''
      }]
    }
  },
  created () {
    this.getRealTime()
    this.getRankingList()
    this.getRulesOfInvitation(this.language)
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    phoneNumberFormat (targetNum) {
      return phoneNumberFormat(targetNum)
    },
    // 获取上币申请说明
    async getRulesOfInvitation (language = 'zh_CN') {
      const params = {
        termsTypeIds: '15', // 用户协议代号
        language
      }
      const data = await getServiceProtocoDataAjax(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        let targetContent = getNestedData(data, 'data.data[0].content')
        if (targetContent) {
          this.rulesOfInvitation = targetContent
        } else {
          this.getRulesOfInvitation()
        }
      }
    },
    // 获取 排行榜数据
    async getRankingList () {
      const data = await getRankingList()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.rankingList = getNestedData(data, 'data.data')
      }
    },
    // 获取当前时间
    getRealTime () {
      this.timer = setInterval(() => {
        this.date = new Date()
      }, 1000)
    },
    timeFilter (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      configInfo: state => state.common.footerInfo.configInfo,
      clientWidth: state => state.common.clientWidth
    }),
    screenWidth () {
      return this.clientWidth / 3
    },
    coinName () {
      return this.rankingList[0].coinName
    },
    startDate () {
      return this.configInfo.regStartTime
    },
    endDate () {
      return this.configInfo.regEndTime
    }
  },
  watch: {
    language (newVal) {
      this.getRulesOfInvitation(newVal)
    },
    coinName (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .ranking-list-of-invitation-box {
    margin-top: 66px;

    > .inner-box {
      width: 100%;
      overflow: hidden;

      .top {
        width: 100%;
        background: url(../../assets/develop/yaoqing.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
      }

      > .content {
        height: 1750px;
        margin-top: -1px;
        background-color: #121824;

        > .inner-box {
          width: 900px;
          height: 100%;
          margin: 0 auto;

          > .header {
            width: 900px;
            height: 30px;
            border: 6px solid #4461cb;
            border-radius: 15px;
          }

          > .top {
            width: 850px;
            padding: 10px 50px 50px;
            margin: -15px auto;
            color: #fff;
            background: linear-gradient(0deg, rgba(30, 51, 133, 1) 0%, rgba(85, 83, 204, 1) 100%);

            > .english {
              font-size: 18px;
            }

            p {
              line-height: 30px;
            }

            > .time {
              line-height: 80px;
              text-align: center;
            }
          }

          > .middle-line {
            position: relative;
            z-index: 2;
            width: 850px;
            margin: 10px auto;
            border-bottom: 10px dotted #390156;
          }

          > .main-content {
            width: 850px;
            height: 1000px;
            margin: -14px auto;
            overflow: hidden;
            background-color: #233e9a;

            > .title {
              width: 240px;
              height: 60px;
              margin: 30px auto;
              border-radius: 30px;
              font-weight: 500;
              font-size: 22px;
              font-family: "PingFang-SC-Medium";
              line-height: 60px;
              text-align: center;
              color: rgba(76, 40, 149, 1);
              background: linear-gradient(90deg, rgba(255, 182, 56, 1) 0%, rgba(250, 207, 16, 1) 100%);
              box-shadow: 0 2px 6px 0 rgba(88, 46, 199, 1);
            }

            > .table {
              width: 760px;
              height: 900px;
              margin: 0 auto;

              > .th {
                display: flex;
                height: 50px;
                border-bottom: 1px solid rgba(255, 255, 255, .1);
                font-size: 18px;
                line-height: 50px;

                > .td {
                  flex: 1;
                  color: #fff;
                }
              }

              > .tr {
                display: flex;
                height: 40px;
                margin: 4px 0;
                line-height: 40px;

                &:nth-of-type(2),
                &:nth-of-type(3),
                &:nth-of-type(4) {
                  background: linear-gradient(90deg, rgba(83, 82, 201, 1), rgba(255, 255, 255, 0));
                }

                > .index {
                  > span {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    margin-left: 10px;
                    line-height: 30px;
                    text-align: center;
                  }
                }

                &:nth-of-type(2) {
                  > .index {
                    > span {
                      color: #000;
                      background: url(../../assets/develop/first.png) no-repeat center center;
                    }
                  }
                }

                &:nth-of-type(3) {
                  > .index {
                    > span {
                      color: #000;
                      background: url(../../assets/develop/second.png) no-repeat center center;
                    }
                  }
                }

                &:nth-of-type(4) {
                  > .index {
                    > span {
                      color: #000;
                      background: url(../../assets/develop/third.png) no-repeat center center;
                    }
                  }
                }

                > .td {
                  flex: 1;
                  color: #fff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
