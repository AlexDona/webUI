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
          <!--<div class="first item">
            <div class="left">
              <img src="../assets/supernode/plan1.png">
            </div>
            <div class="right">
              <h4 class="title font-size16 font-weight700">指导思想</h4>
              <p class="text font-size14">
                超级节点计划以FUBT交易服务平台为依托，以优秀节点资源为纽带，积极推动区块链技术变革与创新，以增强区块链实际落地应用，并营造良好的技术研究氛围，创造公平诚信环境，鼓励保护平等竞争、公正公平的市场秩序，推进节点生态标准化、规范化、国际化建设。
              </p>
            </div>
          </div>
          <div class="second item">
            <div class="left">
              <img src="../assets/supernode/plan2.png">
            </div>
            <div class="right">
              <h4 class="title font-size16 font-weight700">基本原则</h4>
              <p class="text font-size14">
                立足平台与借鉴国际经验相结合，从FUBT平台实际出发，学习借鉴国际顶尖交易所成功经验，发展FUBT特色节点生态；着眼长远规划与现实改善相结合，加强顶层设计，树立大格局，节点生态共商、共建、共享；普遍规律与产业特色相结合，解放思想转变观念，尊重规律加强科学治理，破解发展难题。
              </p>
            </div>
          </div>
          <div class="third item">
            <div class="left">
              <img src="../assets/supernode/plan3.png">
            </div>
            <div class="right">
              <h4 class="title font-size16 font-weight700">近期目标</h4>
              <p class="text font-size14">
                初步搭建节点型、综合性、开放型交易服务平台，打破传统桎梏，改善项目上线推广的环境和氛围，帮助100家优质潜力项目团队实现里程碑式跨越。包括且不限于提供项目投融资、模式设计优化、新币发行上线、社群建设维护、综合运营推广等。
              </p>
            </div>
          </div>
          <div class="fourth item">
            <div class="left">
              <img src="../assets/supernode/plan4.png">
            </div>
            <div class="right">
              <h4 class="title font-size16 font-weight700">中远期目标</h4>
              <p class="text font-size14">
                创新项目开发、募资、运营及管理模式，形成区块链行业与产业协调发展。平台优质潜力项目大幅增加，基本覆盖区块链各主题板块概念；平台孵化器功能进一步增强，节点类型、涉及领域、运作模式、运行效率等持续提升。
              </p>
            </div>
          </div>-->
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
        <div class="bottom">
          <div class="left">
            <div class="item" v-for="(item, index) in nodeEquitiesLeftData" :key="index">
              <div class="left-content text-align-r">
                <h4 class="title font-weight700 font-size14">{{$t(`${item.title}`)}}</h4>
                <p class="text font-size14">
                  {{$t(`${item.text}`)}}
                </p>
              </div>
              <div class="right-content">
                <img :src="item.src">
              </div>
            </div>
           <!-- <div class="first item">
              <div class="left-content">
                <h4 class="title">推荐权</h4>
                <p class="text">
                  入选超级节点，成为FUBT的超级合作伙伴，可参与“节点型”交易服务平台的业务开拓与构建，同时享受有关奖励与福利。
                </p>
              </div>
              <div class="right-content">
                <img src="../assets/supernode/equities1.png">
              </div>
            </div>
            <div class="second item">
              <div class="left-content">
                <h4 class="title">投票权</h4>
                <p class="text">
                  对于申请投票上线的项目，超级节点将通过其专业视角，以各自领域内特长帮助用户甄别出优质潜力项目，降低用户的投资风险。
                </p>
              </div>
              <div class="right-content">
                <img src="../assets/supernode/equities3.png">
              </div>
            </div>
            <div class="third item">
              <div class="left-content">
                <h4 class="title">决策权</h4>
                <p class="text">
                  入选节点优先进入平台“风险决策理事会”，对于节点生态发展方向、战略规划、商业架构等等重大问题，理事会成员拥有表决权。
                </p>
              </div>
              <div class="right-content">
                <img src="../assets/supernode/equities5.png">
              </div>
            </div>-->
          </div>
          <div class="middle">
            <div class="equities-animate-top">
              <img src="../assets/supernode/equities_animate_top.png">
            </div>
            <div class="equities-animate-middle">
              <img src="../assets/supernode/equities_animate_middle.png">
            </div>
            <div class="equities-animate-bottom">
              <img src="../assets/supernode/equities_animate_bottom.png">
            </div>
          </div>
          <div class="right">
            <div class="item" v-for="(item, index) in nodeEquitiesRightData" :key="index">
              <div class="left-content">
                <img :src="item.src">
              </div>
              <div class="right-content text-align-l">
                <h4 class="title font-size14 font-weight700">{{$t(`${item.title}`)}}</h4>
                <p class="text font-size14">
                  {{$t(`${item.text}`)}}
                </p>
              </div>
            </div>
            <!--<div class="first item">
              <div class="left-content">
                <img src="../assets/supernode/equities2.png">
              </div>
              <div class="right-content">
                <h4 class="title">监督权</h4>
                <p class="text">
                  超级节点是生态耕耘者与获益者，亦是监督者与维护者，通过行使监管、督察、评审等权力，保障生态健康、持续、长久。
                </p>
              </div>
            </div>
            <div class="second item">
              <div class="left-content">
                <img src="../assets/supernode/equities4.png">
              </div>
              <div class="right-content">
                <h4 class="title">仲裁权</h4>
                <p class="text">
                  节点型生态平台的自运转，需要多方参与合力共建。其中涉及面广、时间跨度长、项目开发存在不确定风险因素等，如涉及到利益纠纷由超级节点参与仲裁划分责任解决纠纷。
                </p>
              </div>
            </div>
            <div class="third item">
              <div class="left-content">
                <img src="../assets/supernode/equities6.png">
              </div>
              <div class="right-content">
                <h4 class="title">收益权</h4>
                <p class="text">
                  超级节点作为产业生态融合的纽带和价值传递中枢，是该生态建设运作最为关键的环节，享受生态发展进步的各方面收益与权益。包括且不限于服务费佣金、手续费返佣、投资份额及其他收益等。
                </p>
              </div>
            </div>-->
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
                <!--<li>FUBT资深用户，认同FUBT价值观，认可节点型生态；</li>
                <li>拥有一定的资金实力，持有并自愿锁仓一定数量的FUC；</li>
                <li>拥有较丰富的行业资源，或实际管理与运营经验；</li>
                <li>区块链行业的深度参与者，具备国际性视野与大局观；</li>
                <li>从事合法合规的产业，在法律允许的范围内开展业务活动。</li>-->
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
                <!--<li>维护FUBT节点生态，努力推动技术革新与应用落地转化；</li>
                <li>参与节点生态建设、市场开拓、社群推广、国际站点营建等；</li>
                <li>新项目的对接，新用户的拓展，新节点的引荐与审核；</li>
                <li>收集反馈用户意见，推进节点生态持续优化迭代；</li>
                <li>搜集政策动态情报，促进行业产业融合，共建健康生态环境。</li>-->
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
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      // 公司名称fubt fbt、fuc、邮箱等信息
      configInfo: state => state.common.footerInfo.configInfo,
      language: state => state.common.language // 当前选中语言
    })
  },
  watch: {
    language (newValue) {
      console.log(newValue)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../static/css/scss/index.scss";

  @keyframes equitiesTop {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(45px);
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
      transform: translateY(45px);
    }

    100% {
      transform: translateY(0);
    }
  }

  @keyframes equitiesMiddle {
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

  @-webkit-keyframes equitiesMiddle {
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
            }
          }

          > .middle {
            position: relative;
            width: 260px;
            height: 429px;

            > .equities-animate-top {
              position: absolute;
              z-index: 12;
              bottom: 280px;
              left: 15%;
              -webkit-animation: equitiesTop 2s infinite linear;
              animation: equitiesTop 2s infinite linear;
            }

            > .equities-animate-middle {
              position: absolute;
              z-index: 11;
              bottom: 200px;
              left: 50%;
              transform: translateX(-50%);
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
