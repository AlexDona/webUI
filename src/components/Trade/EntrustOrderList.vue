<template>
  <div
    class="entrust-order-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--查看更多委单记录-->
      <div class="view-more">
        <a href="#" @click="jumpToPersonal">
          <span>查看更多</span>
          <i class="el-icon-d-arrow-right"></i>
        </a>
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
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
              <li class="th price">
                委托价
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th price">
                总金额
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th price">
                成交量
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
              <li class="th price">
                未成交量
                <span>（{{activeSymbol.sellsymbol}}）</span>
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
                您还没有登录，请 <router-link to="/Login"> 登录</router-link> 或 <router-link to="/Register">注册</router-link> 后查看

              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else-if="currentEntrustList.length!=0"
              >
                <ul
                  class="tr"
                  v-for="(item,index) in currentEntrustList"
                  :key="index"
                >
                  <!--委托时间-->
                  <li class="td time">
                    {{item.createTime}}
                  </li>
                  <!--委托类型-->
                  <li class="td type">
                    <span v-show="language !== 'zh_CN'">{{item.type}}</span>
                    <span v-show="language === 'zh_CN'">{{item.typeName}}</span>
                  </li>
                  <!--委托量-->
                  <li class="td price">
                    {{item.count-0}}
                  </li>
                  <!--委托价-->
                  <li class="td price">
                    {{item.price-0}}
                  </li>
                  <!--总金额-->
                  <li class="td price">
                    {{item.amount-0}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{item.completeCount-0}}
                  </li>
                  <!--未成交量-->
                  <li class="td price">
                    {{item.leftCount-0}}
                  </li>
                  <!--操作-->
                  <li class="td todos">
                    <button
                      class="cursor-pointer"
                      @click="repealMyEntrust(item.id,item.version)"
                    >撤销</button>
                  </li>
                </ul>
              </div>
              <div
                class="content empty"
                v-else
              >
                <p>暂无数据</p>
              </div>
            </div>
          </div>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'current-entrust' && currentEntrustList.length && isLogin"
            layout="prev, pager, next"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage(0,$event)"
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
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
              <li class="th price">
                委托价
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th price">
                总金额
                <span>（{{activeSymbol.area}}）</span>
              </li>
              <li class="th price">
                成交量
                <span>（{{activeSymbol.sellsymbol}}）</span>
              </li>
            </ul>
            <div class="tbody">
              <!--未登录-->
              <div
                class="not-login content"
                v-if="!isLogin"
              >
                您还没有登录，请 <router-link to="/Login"> 登录</router-link> 或 <router-link to="/Register">注册</router-link> 后查看
              </div>
              <!--已登录-->
              <div
                class="logined content"
                v-else-if="historyEntrustList.length!=0"
              >
                <ul
                  class="tr"
                  v-for="(item,index) in historyEntrustList"
                  :key="index"
                >
                  <!--委托时间-->
                  <li class="td time">
                    {{item.createTime}}
                  </li>
                  <!--委托类型-->
                  <li class="td type">
                    <span v-show="language !== 'zh_CN'">{{item.type}}</span>
                    <span v-show="language === 'zh_CN'">{{item.typeName}}</span>
                  </li>
                  <!--委托量-->
                  <li class="td price">
                    {{item.count-0}}
                  </li>
                  <!--委托价-->
                  <li class="td price">
                    {{item.price-0}}
                  </li>
                  <!--总金额-->
                  <li class="td price">
                    {{item.amount-0}}
                  </li>
                  <!--成交量-->
                  <li class="td price">
                    {{item.completeCount-0}}
                  </li>
                </ul>
              </div>
              <div
                class="content empty"
                v-else
              >
                <p>暂无数据</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!--分页-->
        <el-pagination
          background
          v-show="activeName === 'history-entrust' && historyEntrustList.length && isLogin"
          layout="prev, pager, next"
          :page-count="totalPageForHistoryEntrust"
          @current-change="changeCurrentPage(1,$event)"
        >
        </el-pagination>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {timeFilter} from '../../utils'
import {
  getMyEntrust,
  getHistoryEntrust
} from '../../utils/api/trade'
import {
  returnAjaxMessage,
  repealMyEntrustCommon
} from '../../utils/commonFunc'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('trade')

export default {
  components: {},
  // props,
  data () {
    return {
      activeName: 'current-entrust', // 当前委托，历史委托切换（current、history）
      currentEntrustList: [], // 当前委托列表
      historyEntrustList: [], // 当前委托列表
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      currentPageForHistoryEntrust: 1, // 历史委托页码
      totalPageForHistoryEntrust: 1, // 历史委托总页数
      pageSize: 10,
      value1: '',
      end: '' // 占位项目上线后删除
    }
  },
  created () {
    require('../../../static/css/list/Trade/TradeCenter.css')
    // this.currentEntrustList = [
    //   {
    //     time: new Date().getTime(),
    //     type: '类型',
    //     count: 123123,
    //     price: 1.11211,
    //     amount: 345345.123,
    //     doneVolume: 123123,
    //     freeVolume: 123123,
    //     status: 0 // 状态码
    //   }
    // ]
    // this.historyEntrustList = []
    if (this.isLogin) {
      // 获取我的当前委托
      this.getMyCurrentEntrust()
      // 获取历史委托
      this.getHistoryEntrust()
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'TOGGLE_REFRESH_ENTRUST_LIST_STATUS'
    ]),
    // 跳转到个人中心
    jumpToPersonal () {
      this.$store.commit('personal/CHANGE_USER_CENTER_ACTIVE_NAME', 'coin-orders')
      this.$router.push({path: '/PersonalCenter'})
    },
    /**
     *撤销委单
     */
    repealMyEntrust (id, version) {
      this.$confirm('您确定要撤销此单吗, 是否继续?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          id,
          version
        }
        repealMyEntrustCommon(params, (res) => {
          if (!returnAjaxMessage(res, this, 1)) {
            return false
          } else {
            this.getMyCurrentEntrust()
          }
        })
      }).catch(() => {
      })
      // console.log(id)
      // console.log(version)

      // const repealData =  repealMyEntrust(params)
      // returnAjaxMessage(repealData, this, 1)
      // this.getMyCurrentEntrust()
    },
    /**
      * 切换页码
      * @entrustType: 订单类型： 0：当前委托 1： 历史委托
      */
    changeCurrentPage (entrustType, pageNum) {
      switch (entrustType) {
        case 0:
          this.currentPageForMyEntrust = pageNum
          this.getMyCurrentEntrust()
          break
        case 1:
          this.currentPageForHistoryEntrust = pageNum
          this.getHistoryEntrust()
      }
    },
    // 获取历史委托
    async getHistoryEntrust () {
      let params = {
        userId: this.userInfo.userId,
        currentPage: this.currentPageForHistoryEntrust,
        pageSize: this.pageSize
      }
      const data = await getHistoryEntrust(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        this.historyEntrustList = data.data.data.list || []
        this.totalPageForHistoryEntrust = data.data.data.pages - 0
      }
    },
    // 获取我的当前委单
    async getMyCurrentEntrust () {
      let params = {
        userId: this.userInfo.userId,
        currentPage: this.currentPageForMyEntrust,
        pageSize: this.pageSize
      }
      const data = await getMyEntrust(params)
      if (!returnAjaxMessage(data, this, 0)) {
        return false
      } else {
        this.currentEntrustList = data.data.data.list || []
        this.totalPageForMyEntrust = data.data.data.pages - 0
      }
    },
    // 时间格式化
    timeFormat (date) {
      return timeFilter(date, 'normal')
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      isLogin: state => state.user.isLogin,
      refreshEntrustStatus: state => state.trade.refreshEntrustStatus,
      userInfo: state => state.user.loginStep1Info,
      activeSymbol: state => state.common.activeSymbol
    })
  },
  watch: {
    activeName (newVal) {
      console.log(newVal)
      switch (newVal) {
        case 'current-entrust':
          this.getMyCurrentEntrust()
          break
        case 'history-entrust':
          this.getHistoryEntrust()
          break
      }
    },
    refreshEntrustStatus (newVal) {
      if (newVal) {
        this.getMyCurrentEntrust()
        this.getHistoryEntrust()
        this.TOGGLE_REFRESH_ENTRUST_LIST_STATUS(false)
      }
    },
    historyEntrustList (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
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
        min-width:1000px;
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
              min-width:150px;
            }
            &.type{
              width:8%;
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
            &.empty{
              >p{
                line-height: 180px;
                text-align: center;
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
                  width:8%;
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
      background-color: $mainContentNightBgColor;
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
      background-color: $mainDayBgColor;
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
