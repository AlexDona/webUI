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
            <div
              class="chinese"
              v-if="language=='zh_CN' || language=='zh_TW'"
            >
              <p>1.邀请奖励{{coinName}}统计起始时间为{{startDate}}，在此之前已邀请 注册的无累计{{coinName}}至此活动；</p>
              <p>2.登录平台账户—财务中心—推广注册链接—复制专属推广链接；</p>
              <p>3.假设新用户A通过您的推广链接注册完成实名认证，即成为您的直接下级，系统会在您的账户增加10{{coinName}}；新用户B通过新用户A的推广链接，即成为您的间接下级，间接下级不享受赠送{{coinName}}；</p>
              <p>4.为维护正常推广者权益，如发现有作弊者，经分析属实，将强制取消奖励，平台有权对推广虚假用户骗取奖励行为进行判定；</p>
              <p>5.邀请的新用户注册通过实名认证，系统则自动累计{{coinName}}；</p>
              <p>6.活动奖励{{coinName}}币均为官方第一、第二期新币投票所得{{coinName}}币；</p>
              <p>7.邀请注册详细数据用户可进入财务中心—代理下级查询，近期官网将展示邀请排行榜，排名按照积分排序，公平公正公开；</p>
              <p>8.数据每隔5分钟刷新1次</p>
            </div>
            <div
              class="english"
              v-else
            >
              <p>1. The invitation to reward {{coinName}} statistics start time is 2018-05-20 10:18, before this has been invitation  to register no cumulative {{coinName}} to this event;</p>
              <p>2. Login in the platform account - Finance Center - Promotion of registration link - copy exclusive promotion link;</p>
              <p>3. Assume that the new user A completes the real-name authentication through your promotion registration link , he will be your direct subordinate, thesystem will add 10{{coinName}} to your account; the new user B will become your indirect subordinate through the promotion link of the new user A. Indirect subordinates do not enjoy the gift of {{coinName}};</p>
              <p>4. In order to maintain the rights of normal promoters, if there is a cheater, the analysis is true, the reward will be forcibly cancelled, and the platform has the right to judge the fraudulent behavior of promoting false users;</p>
              <p>5. The new user registration is approved by real-name authentication, and the system automatically accumulates {{coinName}};</p>
              <p>6. The activity reward {{coinName}} coins are the official first and second voting got {{coinName}} coins;</p>
              <p>7. Invite registered detailed data users can enter the financial center to  - agent lower level query, the official website will display the invitation list, the ranking is ranked according to points, fair and open;</p>
              <p>8. Data is refreshed once every 5 minutes.</p>
            </div>

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
      startDate: '2018-11-28 00:00',
      rankingList: [{
        coinName: ''
      }]
    }
  },
  created () {
    this.getRealTime()
    this.getRankingList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    phoneNumberFormat (targetNum) {
      return phoneNumberFormat(targetNum)
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
      configInfo: state => state.common.footerInfo.configInfo
    }),
    screenWidth () {
      return window.innerWidth / 3
    },
    coinName () {
      return this.rankingList[0].coinName
    }
  },
  watch: {
    coinName (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .ranking-list-of-invitation-box{
    margin-top:66px;
    >.inner-box{
      width:100%;
      overflow: hidden;
      .top{
        width:100%;
        background: url(../../assets/develop/yaoqing.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
      }
      >.content{
        background-color: #121824;
        height:1750px;
        margin-top:-1px;
        >.inner-box{
          margin: 0 auto;
          width:900px;
          height:100%;
          >.header{
            width:900px;
            height:30px;
            border:6px solid #4461CB;
            border-radius: 15px;
          }
          >.top{
            width:850px;
            background:linear-gradient(0deg,rgba(30,51,133,1) 0%,rgba(85,83,204,1) 100%);
            margin: -15px auto;
            padding:10px 50px 50px;
            color:#fff;
            >.english{
              font-size: 18px;
            }
            p{
              line-height: 30px;
            }
            >.time{
              text-align: center;
              line-height: 80px;
            }
          }
          >.middle-line{
            border-bottom:10px dotted #390156;
            margin:10px auto;
            width:850px;
            position: relative;
            z-index: 2;
          }
          >.main-content{
            margin:-14px auto;
            height:1000px;
            width:850px;
            background-color: #233e9a;
            overflow: hidden;
            >.title{
              margin: 30px auto;
              width:240px;
              height:60px;
              line-height:60px;
              background:linear-gradient(90deg,rgba(255,182,56,1) 0%,rgba(250,207,16,1) 100%);
              border-radius:30px;
              box-shadow:0px 2px 6px 0px rgba(88,46,199,1);
              text-align: center;
              font-size:22px;
              font-family:PingFang-SC-Medium;
              font-weight:500;
              color:rgba(76,40,149,1);
            }
            >.table{
              width:760px;
              height:900px;
              margin:0 auto;
              >.th{
                height:50px;
                line-height:50px;
                border-bottom:1px solid rgba(255,255,255,0.1);
                font-size: 18px;
                display:flex;
                >.td{
                  flex:1;
                  color:#fff;
                }
              }
              >.tr{
                margin: 4px 0;
                height:40px;
                line-height:40px;
                display:flex;
                &:nth-of-type(2),
                &:nth-of-type(3),
                &:nth-of-type(4)
                {
                  background:linear-gradient(90deg,rgba(83,82,201,1) ,rgba(255,255,255,0));

                }
                >.index{
                  >span{
                    display:inline-block;
                    width:30px;
                    height:30px;
                    line-height:30px;
                    text-align: center;
                    margin-left:10px;
                  }
                }
                &:nth-of-type(2){
                  >.index{
                    >span{
                      background: url(../../assets/develop/first.png) no-repeat center center;
                      color:#000;
                    }
                  }
                }
                &:nth-of-type(3){
                  >.index{
                    >span{
                      background: url(../../assets/develop/second.png) no-repeat center center;
                      color:#000;
                    }
                  }
                }
                &:nth-of-type(4){
                  >.index{
                    >span{
                      background: url(../../assets/develop/third.png) no-repeat center center;
                      color:#000;
                    }
                  }
                }
                >.td{
                  flex:1;
                  color:#fff;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
