<template>
  <div
    class="entrust-order-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--查看更多委单记录-->
      <div class="view-more">
        <router-link to="/">
          <span>查看更多</span>
          <i class="el-icon-d-arrow-right"></i>
        </router-link>
      </div>
      <el-tabs
        v-model="activeName"
      >
        <el-tab-pane
          label="当前委托"
          name="current-entrust"
        >
          <!--主要内容-->
          <div class="content-box">
            <ul class="thead">
              <li class="th time">
                委托时间
              </li>
              <li class="th type">
                委托类型
              </li>
              <li class="th price">
                委托量
                <span>（BTC）</span>
              </li>
              <li class="th price">
                委托价
                <span>（BTC）</span>
              </li>
              <li class="th price">
                总金额
                <span>（BTC）</span>
              </li>
              <li class="th price">
                成交量
                <span>（BTC）</span>
              </li>
              <li class="th price">
                未成交量
                <span>（BTC）</span>
              </li>
              <li class="th">
                操作
              </li>
            </ul>
            <div class="tbody">
              <!--未登录-->
              <div
                class="not-login content"
                v-if="!isLogin"
              >
                您还没有登录，请 <router-link to="/123"> 登录</router-link> 或 <router-link to="/">注册</router-link> 后查看
              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else
              >
                <ul
                  class="tr"
                  v-for="(item,index) in currentEntructList"
                  :key="index"
                >
                  <!--委托时间-->
                  <li class="td time">
                    {{timeFormat(item.time)}}
                  </li>
                  <!--委托类型-->
                  <li class="td type">
                    {{item.type}}
                  </li>
                  <!--委托量-->
                  <li class="td price">
                    {{item.count}}
                  </li>
                  <!--委托价-->
                  <li class="td price">
                    {{item.price}}
                  </li>
                  <!--总金额-->
                  <li class="td price">
                    {{item.amount}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{item.doneVolume}}
                  </li>
                  <!--未成交量-->
                  <li class="td price">
                    {{item.freeVolume}}
                  </li>
                  <!--操作-->
                  <li class="td todos">
                    <button class="cursor-pointer">撤销</button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!--分页-->
          <el-pagination
            background
            layout="prev, pager, next"
            :total="50"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane
          label="历史委托"
          name="history-entrust"
        >
          <!--主要内容-->
          <div class="content-box history">
            <ul class="thead">
              <li class="th time">
                委托时间
              </li>
              <li class="th type">
                委托类型
              </li>
              <li class="th price">
                委托量
                <span>（BTC）</span>
              </li>
              <li class="th price">
                委托价
                <span>（BTC）</span>
              </li>
              <li class="th price">
                总金额
                <span>（BTC）</span>
              </li>
              <li class="th price">
                成交量
                <span>（BTC）</span>
              </li>
            </ul>
            <div class="tbody">
              <!--未登录-->
              <div
                class="not-login content"
                v-if="!isLogin"
              >
                您还没有登录，请 <router-link to="/123"> 登录</router-link> 或 <router-link to="/">注册</router-link> 后查看
              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else
              >
                <ul
                  class="tr"
                  v-for="(item,index) in currentEntructList"
                  :key="index"
                >
                  <!--委托时间-->
                  <li class="td time">
                    {{timeFormat(item.time)}}
                  </li>
                  <!--委托类型-->
                  <li class="td type">
                    {{item.type}}
                  </li>
                  <!--委托量-->
                  <li class="td price">
                    {{item.count}}
                  </li>
                  <!--委托价-->
                  <li class="td price">
                    {{item.price}}
                  </li>
                  <!--总金额-->
                  <li class="td price">
                    {{item.amount}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{item.doneVolume}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {timeFilter} from '../../utils'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'current-entrust', // 当前委托，历史委托切换（current、history）
      currentEntructList: [], // 当前委托列表
      historyEntructList: [], // 当前委托列表
      value1: '',
      end: '' // 占位项目上线后删除
    }
  },
  created () {
    require('../../../static/css/list/Trade/TradeCenter.css')
    this.currentEntructList = [
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      },
      {
        time: new Date().getTime(),
        type: '类型',
        count: 123123,
        price: 1.11211,
        amount: 345345.123,
        doneVolume: 123123,
        freeVolume: 123123,
        status: 0 // 状态码
      }
    ]
    this.historyEntructList = []
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    timeFormat (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      isLogin: state => state.common.isLogin
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter';
  .entrust-order-box{
    width:100%;
    >.inner-box{
      position: relative;
      >.view-more{
        position: absolute;
        right:0;
        top:0;
        height:34px;
        line-height: 34px;
        z-index: 2000;
        text-align: right;
        padding-right:27px;
        >a{
          color: $mainColor;
        }
      }
      /*主要内容*/
      .content-box{
        padding:0 20px;
        min-width:964px;
        &.history{
          >.thead{
            >.th{
              &.time,&.price,&.type{
                width:16.3%;
              }
            }
          }
          >.tbody{
            >.content{
              >.tr{
                >.td{
                  &.time,&.price,&.type{
                    width:16.3%;
                  }
                }
              }
            }
          }
        }
        /*表头*/
        >.thead{
          height:30px;
          line-height:30px;
          >.th{
            display:inline-block;
            &.time{
              width:15%;
            }
            &.type{
              width:10%;
            }
            &.price{
              width:13%;
            }
          }
        }
        /*表格内容*/
        >.tbody{
          .content{
            min-height:180px;
            /*未登录*/
            &.not-login{
              text-align: center;
              line-height: 180px;
              >a{
                color:$mainColor;
              }
            }
            >.tr{
              height:36px;
              line-height:36px;
              font-size: 14px;
              border-bottom:1px solid red;
              >.td{
                display:inline-block;
                &.time{
                  width:15%;
                  min-width:150px;
                }
                &.type{
                  width:10%;
                }
                &.price{
                  width:13%;
                }
                &.todos{
                  >button{
                    color:$mainColor;
                  }
                }
              }
            }
          }
        }
      }
    }
    &.night{
      background-color: $nightMainContentBgColor;
      color:$nightFontColor;
      >.inner-box{
        >.view-more{
          >a{
          }
        }
        /*主要内容*/
        .content-box{
          &.history{
            >.thead{
              >.th{
                &.time,&.price,&.type{
                }
              }
            }
            >.tbody{
              >.content{
                >.tr{
                  >.td{
                    &.time,&.price,&.type{
                    }
                  }
                }
              }
            }
          }
          /*表头*/
          >.thead{
            >.th{
              &.time{
              }
              &.type{
              }
              &.price{
              }
            }
          }
          /*表格内容*/
          >.tbody{
            .content{
              /*未登录*/
              &.not-login{
                >a{
                }
              }
              >.tr{
                /*border-bottom:1px solid red;*/
                border-color:rgba(57,66,77,.2);
                >.td{
                  &.time{
                  }
                  &.type{
                  }
                  &.price{
                  }
                  &.todos{
                    >button{
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayMainBgColor;
      color:$dayFontColor;
      >.inner-box{
        >.view-more{
          >a{
          }
        }
        /*主要内容*/
        .content-box{
          &.history{
            >.thead{
              >.th{
                &.time,&.price,&.type{
                }
              }
            }
            >.tbody{
              >.content{
                >.tr{
                  >.td{
                    &.time,&.price,&.type{
                    }
                  }
                }
              }
            }
          }
          /*表头*/
          >.thead{
            >.th{
              &.time{
              }
              &.type{
              }
              &.price{
              }
            }
          }
          /*表格内容*/
          >.tbody{
            .content{
              /*未登录*/
              &.not-login{
                >a{
                }
              }
              >.tr{
                border-color:rgba(57,66,77,.1);
                >.td{
                  &.time{
                  }
                  &.type{
                  }
                  &.price{
                  }
                  &.todos{
                    >button{
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
