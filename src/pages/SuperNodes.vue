<!--
  author: renfuwei
  create: 20190619
  description: 当前页面为 超级节点 组件
-->
<template>
  <div class="super-nodes-box">
    <!--1.0 计划-->
    <div class="node-plan">
      <div class="content">
        <!--1.1 计划-->
        <div class="plan">
          <h3 class="title">{{$t('M.super_node_plan')}}</h3>
          <p class="text font-size14">
            {{$t('M.super_node_purpose')}}
          </p>
        </div>
        <!--1.2 卡片-->
        <div class="card">
          <div class="item border-radius5" v-for="(item, index) in planData" :key="index">
            <div class="left">
              <img :src="item.src">
            </div>
            <div class="right">
              <h4 class="title font-size16 font-weight700">{{$t(`${item.title}`)}}</h4>
              <p class="text font-size14">
                {{$t(`${item.text}`)}}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--左侧灯-->
      <div class="plan-left">
        <div class="banner-top-light-top">
          <img src="../assets/supernode/banner_top_left2.png">
        </div>
        <div class="banner-top-light-bottom">
          <img src="../assets/supernode/banner_top_left1.png">
        </div>
      </div>
      <!--右侧方块-->
      <div class="plan-right">
        <img src="../assets/supernode/banner2.gif">
      </div>
    </div>
    <!--2.0 权益-->
    <div class="node-equities">
      <div class="content">
        <!--上部标题-->
        <div class="top font-size30 font-weight700 text-align-c">
          {{$t('M.super_node_authority')}}
        </div>
        <!--下部权益-->
        <div class="bottom" id="equitiesDiv">
          <div class="left" :class="{'middleStyle1':middleStatus}">
            <div class="item" v-for="(item, index) in nodeEquitiesLeftData" :key="index">
              <div class="left-content text-align-r">
                <h4 class="title font-weight700 font-size14">{{$t(`${item.title}`)}}</h4>
                <p class="text font-size14">
                  {{$t(`${item.text}`)}}
                </p>
              </div>
              <div class="right-content" v-show="animateStatusStart">
                <img :src="item.src" :class="`left${index + 1}`">
              </div>
            </div>
          </div>
          <div class="middle">
            <div class="equities-animate-top" :class="{'lidAnimateTop':lidAnimateStart}">
              <img src="../assets/supernode/equities_animate_top.png">
            </div>
            <div class="equities-animate-middle" :class="{'lidAnimateMiddle':lidAnimateStart}" v-show="lidAnimateStart">
              <img src="../assets/supernode/equities_animate_middle.png">
            </div>
            <div class="equities-animate-bottom">
              <img src="../assets/supernode/equities_animate_bottom.png">
            </div>
          </div>
          <div class="right" :class="{'middleStyle2':middleStatus}">
            <div class="item" v-for="(item, index) in nodeEquitiesRightData" :key="index">
              <div class="left-content" v-show="animateStatusStart">
                <img :src="item.src" :class="`right${index + 1}`">
              </div>
              <div class="right-content text-align-l">
                <h4 class="title font-size14 font-weight700">{{$t(`${item.title}`)}}</h4>
                <p class="text font-size14">
                  {{$t(`${item.text}`)}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--3.0 职责-->
    <div class="node-obligation">
      <div class="content">
        <!--标题-->
        <div class="title font-size30 font-weight700 text-align-c">
          {{$t('M.super_node_conditions_duty')}}
        </div>
        <!--卡片-->
        <div class="condition-duty">
          <div class="item">
            <div class="condition-duty-pic text-align-c">
              <img src="../assets/supernode/condition.png">
            </div>
            <div class="condition-duty-content">
              <div class="title font-size16 font-weight700">
                {{$t('M.super_node_conditions')}}
              </div>
              <ul class="bar">
                <li v-for="(item, index) in eligibilityData" :key="index">{{$t(`${item.text}`)}}</li>
              </ul>
            </div>
          </div>
          <div class="item">
            <div class="condition-duty-pic text-align-c">
              <img src="../assets/supernode/duty.png">
            </div>
            <div class="condition-duty-content">
              <div class="title font-size16 font-weight700">
                {{$t('M.super_node_duty')}}
              </div>
              <ul class="bar">
                <li v-for="(item, index) in dutyData" :key="index">{{$t(`${item.text}`)}}</li>
              </ul>
            </div>
          </div>
        </div>
        <!--资料提交-->
        <div class="submit">
          <div class="item title font-size30 font-weight700 text-align-c">
            {{$t('M.super_node_data_submit')}}
          </div>
          <div class="item text-align-c font-size18">
            {{$t('M.super_node_data_submit_text1')}}
            <span class="email">
              {{configInfo['otcEmail']}}
            </span>
          </div>
          <div class="item text-align-c font-size18">
            {{$t('M.super_node_data_submit_text2')}}
          </div>
        </div>
      </div>
      <!--右侧灯-->
      <div class="obligation-right">
        <div class="obligation-bottom-light-top">
          <img src="../assets/supernode/banner_bottom_right2.png">
        </div>
        <div class="obligation-bottom-light-bottom">
          <img src="../assets/supernode/banner_bottom_right1.png">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  mapState
} from 'vuex'
export default {
  name: 'SuperNodes',
  components: {},
  // props,
  data () {
    return {
      // 权益中间盖子上下活动动画开始状态
      lidAnimateStart: false,
      // 权益中间动画盒子类样式状态：刚开始加上此样式是为了撑开盒子
      middleStatus: true,
      // 权益6个标签动画开始状态：当页面完全滚动出当前内容时触发
      animateStatusStart: false,
      // 计划四项数据
      planData: [
        {
          title: 'M.super_node_thought',
          text: 'M.super_node_thought_text',
          src: require('../assets/supernode/plan1.png')
        },
        {
          title: 'M.super_node_principle',
          text: 'M.super_node_principle_text',
          src: require('../assets/supernode/plan2.png')
        },
        {
          title: 'M.super_node_target1',
          text: 'M.super_node_target_text1',
          src: require('../assets/supernode/plan3.png')
        },
        {
          title: 'M.super_node_target2',
          text: 'M.super_node_target_text2',
          src: require('../assets/supernode/plan4.png')
        }
      ],
      // 尊享权利左侧三项数据
      nodeEquitiesLeftData: [
        {
          title: 'M.super_node_authority1',
          text: 'M.super_node_authority2',
          src: require('../assets/supernode/equities1.png')
        },
        {
          title: 'M.super_node_authority3',
          text: 'M.super_node_authority4',
          src: require('../assets/supernode/equities3.png')
        },
        {
          title: 'M.super_node_authority5',
          text: 'M.super_node_authority6',
          src: require('../assets/supernode/equities5.png')
        }
      ],
      // 尊享权利右侧三项数据
      nodeEquitiesRightData: [
        {
          title: 'M.super_node_authority7',
          text: 'M.super_node_authority8',
          src: require('../assets/supernode/equities2.png')
        },
        {
          title: 'M.super_node_authority9',
          text: 'M.super_node_authority10',
          src: require('../assets/supernode/equities4.png')
        },
        {
          title: 'M.super_node_authority11',
          text: 'M.super_node_authority12',
          src: require('../assets/supernode/equities6.png')
        }
      ],
      // 入选条件数据
      eligibilityData: [
        {
          text: 'M.super_node_conditions_text1'
        },
        {
          text: 'M.super_node_conditions_text2'
        },
        {
          text: 'M.super_node_conditions_text3'
        },
        {
          text: 'M.super_node_conditions_text4'
        },
        {
          text: 'M.super_node_conditions_text5'
        }
      ],
      // 超级节点职责数据
      dutyData: [
        {
          text: 'M.super_node_duty_text1'
        },
        {
          text: 'M.super_node_duty_text2'
        },
        {
          text: 'M.super_node_duty_text3'
        },
        {
          text: 'M.super_node_duty_text4'
        },
        {
          text: 'M.super_node_duty_text5'
        }
      ]
    }
  },
  created () {},
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    handleScroll () {
      let equitiesDiv = document.getElementById('equitiesDiv')
      let equitiesDivHeight = equitiesDiv.clientHeight || equitiesDiv.offsetHeight
      let clients = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      let divTop = equitiesDiv.getBoundingClientRect().top
      // console.log(clients)
      // console.log(divTop)
      // console.log(equitiesDivHeight)
      if (clients - divTop - equitiesDivHeight > -50) {
        // console.log('权益div刚好全部出现在窗口中')
        this.animateStatusStart = true
        this.middleStatus = false
        this.lidAnimateStart = true
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      // 公司名称fubt fbt、fuc、邮箱等信息
      configInfo: state => state.common.footerInfo.configInfo
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../static/css/scss/index.scss";

  @keyframes equitiesTop {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-45px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @-webkit-keyframes equitiesTop {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-45px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes equitiesMiddle {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes equitiesMiddle {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  @keyframes planLeftTop {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes planLeftTop {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes obligationRightTop {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes obligationRightTop {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes leftAnimate1 {
    0% {
      transform: translateX(150px) translateY(100px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes leftAnimate1 {
    0% {
      transform: translateX(150px) translateY(100px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes leftAnimate2 {
    0% {
      transform: translateX(150px) translateY(20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes leftAnimate2 {
    0% {
      transform: translateX(150px) translateY(20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes leftAnimate3 {
    0% {
      transform: translateX(150px) translateY(-20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes leftAnimate3 {
    0% {
      transform: translateX(150px) translateY(-20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes rightAnimate1 {
    0% {
      transform: translateX(-150px) translateY(100px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes rightAnimate1 {
    0% {
      transform: translateX(-150px) translateY(100px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes rightAnimate2 {
    0% {
      transform: translateX(-150px) translateY(20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes rightAnimate2 {
    0% {
      transform: translateX(-150px) translateY(20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @keyframes rightAnimate3 {
    0% {
      transform: translateX(-150px) translateY(-20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  @-webkit-keyframes rightAnimate3 {
    0% {
      transform: translateX(-150px) translateY(-20px);
    }

    100% {
      transform: translateX(0) translateY(0);
    }
  }

  .super-nodes-box {
    width: 100%;
    padding-top: 50px;
    color: #81868f;
    background-color: #f5f9fa;

    > .node-plan {
      position: relative;
      min-width: 1366px;
      height: 968px;
      background: #f5f9fa url(../assets/supernode/banner1.png) no-repeat center center;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;

      > .content {
        position: relative;
        width: 1300px;
        height: 968px;
        padding-top: 150px;
        margin: 0 auto;

        > .plan {
          color: #fbfbfc;

          > .title {
            margin-bottom: 20px;
            font-size: 44px;
          }

          > .text {
            width: 448px;
            line-height: 36px;
          }
        }

        > .card {
          position: absolute;
          z-index: 99;
          bottom: 30px;
          left: 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          width: 1300px;

          > .item {
            display: flex;
            width: 619px;
            padding: 28px 23px 20px 33px;
            margin-bottom: 20px;
            background-color: #fff;
            box-shadow: 0 2px 38px 0 rgba(215, 215, 215, .5);
            transition: all .3s;

            &:nth-of-type(3),
            &:nth-of-type(4) {
              margin-bottom: 0;
            }

            &:hover {
              transform: scale(1.01) translateY(-6px);
            }

            > .left {
              display: flex;
              align-items: center;
              margin-right: 20px;
            }

            > .right {
              > .title {
                margin-bottom: 5px;
                color: #252c3a;
              }

              > .text {
                line-height: 22px;
              }
            }
          }
        }
      }

      > .plan-left {
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 270px;
        height: 683px;

        > .banner-top-light-top {
          position: absolute;
          z-index: 11;
          bottom: 0;
          left: 0;
          -webkit-animation: planLeftTop 2s infinite;
          animation: planLeftTop 2s infinite;
        }

        > .banner-top-light-bottom {
          position: absolute;
          z-index: 10;
          bottom: 0;
          left: 0;
        }
      }

      > .plan-right {
        position: absolute;
        z-index: 10;
        top: -13%;
        right: 0;
      }
    }

    > .node-equities {
      width: 100%;
      height: 718px;
      background-color: #f5f9fa;

      > .content {
        width: 1300px;
        height: 718px;
        padding-top: 62px;
        margin: 0 auto;

        > .top {
          color: #3c434e;
        }

        > .bottom {
          display: flex;
          justify-content: space-between;
          padding-top: 80px;

          > .left {
            width: 490px;

            > .item {
              display: flex;
              margin-bottom: 40px;

              > .left-content {
                > .title {
                  margin-bottom: 5px;
                  color: #3c434e;
                }

                > .text {
                  line-height: 24px;
                }
              }

              > .right-content {
                > .left1 {
                  -webkit-animation: leftAnimate1 .5s 1 linear;
                  animation: leftAnimate1 .5s 1 linear;
                }

                > .left2 {
                  -webkit-animation: leftAnimate2 .5s 1 linear;
                  animation: leftAnimate2 .5s 1 linear;
                }

                > .left3 {
                  -webkit-animation: leftAnimate3 .5s 1 linear;
                  animation: leftAnimate3 .5s 1 linear;
                }
              }
            }
          }

          .middleStyle1 {
            padding-right: 84px;
          }

          .middleStyle2 {
            padding-left: 84px;
          }

          > .middle {
            position: relative;
            width: 260px;
            height: 429px;

            > .equities-animate-top {
              position: absolute;
              z-index: 12;
              bottom: 235px;
              left: 15%;
            }

            > .lidAnimateTop {
              -webkit-animation: equitiesTop 2s infinite linear;
              animation: equitiesTop 2s infinite linear;
            }

            > .equities-animate-middle {
              position: absolute;
              z-index: 11;
              bottom: 200px;
              left: 50%;
              transform: translateX(-50%);
            }

            > .lidAnimateMiddle {
              -webkit-animation: equitiesMiddle 2s infinite;
              animation: equitiesMiddle 2s infinite;
            }

            > .equities-animate-bottom {
              position: absolute;
              z-index: 10;
              bottom: 80px;
              left: 50%;
              transform: translateX(-50%);
            }
          }

          > .right {
            width: 490px;

            > .item {
              display: flex;
              margin-bottom: 40px;

              > .left-content {
                > .right1 {
                  -webkit-animation: rightAnimate1 .5s 1 linear;
                  animation: rightAnimate1 .5s 1 linear;
                }

                > .right2 {
                  -webkit-animation: rightAnimate2 .5s 1 linear;
                  animation: rightAnimate2 .5s 1 linear;
                }

                > .right3 {
                  -webkit-animation: rightAnimate3 .5s 1 linear;
                  animation: rightAnimate3 .5s 1 linear;
                }
              }

              > .right-content {
                > .title {
                  margin-bottom: 5px;
                  color: #3c434e;
                }

                > .text {
                  line-height: 24px;
                }
              }
            }
          }
        }
      }
    }

    > .node-obligation {
      position: relative;
      min-width: 1366px;
      background: #f5f9fa url(../assets/supernode/banner4.png) no-repeat center center;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;

      > .content {
        position: relative;
        width: 1300px;
        height: 992px;
        margin: 0 auto;

        > .title {
          color: #3c434f;
        }

        > .condition-duty {
          position: absolute;
          z-index: 99;
          left: 98px;
          display: flex;
          justify-content: space-around;
          width: 1114px;
          padding-top: 70px;

          > .item {
            width: 457px;
            height: 502px;
            padding: 50px 30px 0;
            border-radius: 5px;
            background-color: #fff;
            box-shadow: 0 2px 20px 0 rgba(215, 215, 215, .5);

            > .condition-duty-content {
              > .title {
                margin: 10px 0 20px;
                color: #252c3a;
              }

              > .bar {
                padding-left: 13px;

                > li {
                  position: relative;
                  padding: 10px 0;
                  font-size: 14px;

                  &::before {
                    position: absolute;
                    top: 15px;
                    left: -12px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: #526ff8;
                    content: '';
                  }
                }
              }
            }
          }
        }

        > .submit {
          position: absolute;
          bottom: 100px;
          left: 50%;
          width: 800px;
          transform: translateX(-50%);

          > .title {
            margin-bottom: 30px;
          }

          > .item {
            padding: 5px 0;
            color: #fff;

            > .email {
              color: #526ff8;
            }
          }
        }
      }

      > .obligation-right {
        position: absolute;
        bottom: 8%;
        right: 0;
        width: 320px;
        height: 729px;

        > .obligation-bottom-light-top {
          position: absolute;
          z-index: 11;
          bottom: 0;
          right: 0;
          -webkit-animation: obligationRightTop 2s infinite;
          animation: obligationRightTop 2s infinite;
        }

        > .obligation-bottom-light-bottom {
          position: absolute;
          z-index: 10;
          bottom: 0;
          right: 0;
        }
      }
    }
  }
</style>
