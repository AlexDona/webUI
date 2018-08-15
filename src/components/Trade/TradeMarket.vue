<template>
  <div
    class="trade-market-box trade"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div
        class="title font-size16 cursor-pointer"
        @click="toggleShowContent"
      >
        <span
          class="text"
          @click="toggleShowContent"
        >
          <span>市场</span>
        </span>
        <span class="right">
          <el-input
            class="search-box"
            suffix-icon="el-icon-search"
          ></el-input>
        </span>
      </div>
      <div class="content">
        <el-collapse-transition>
          <div
            v-show="contentShowStatus"
            class="inner-box"
          >
            <!--tab 切换-->
            <el-tabs
              v-model="activeName"
              @tab-click="changeTab"
            >
              <el-tab-pane
                :label="outItem.label"
                :name="outItem.name"
                v-for="(outItem,outIndex) in tabList"
                :key="outIndex"
              >
                <div class="coin-table font-size12">
                  <!--表格头部-->
                  <dl class="coin-thead">
                    <dt></dt>
                    <dd class="coin-unit">
                      <span
                        class="title coin-type"
                      >
                        交易对
                      </span>
                      <span
                        class="title price cursor-pointer"
                        @click="sortByUser('price')"
                      >
                            <span
                              id="new_price"
                              data-text="最新价">
                              最新价
                            </span>
                            <i class="sort-box">
                              <i
                                class="el-icon-caret-top"
                                :class="{active:sortBy=='price-asc'}"
                                @click="sortByUser('asc')"
                              ></i>
                              <i
                                class="el-icon-caret-bottom"
                                :class="{active:sortBy=='price-desc'}"
                                @click="sortByUser('desc')"
                              ></i>
                            </i>
                          </span>
                      <span
                        class="title rose cursor-pointer"
                      >
                            涨幅
                            <i class="sort-box">
                               <i
                                 class="el-icon-caret-top"
                                 :class="{active:sortBy=='rose-asc'}"
                                 @click="sortByUser('rose-asc')"
                               ></i>
                              <i
                                class="el-icon-caret-bottom"
                                :class="{active:sortBy=='rose-desc'}"
                                @click="sortByUser('rose-desc')"
                              ></i>
                            </i>
                          </span>
                    </dd>
                  </dl>
                  <div class="coin-list">
                    <div
                      class="market-cate-wrap"
                      v-for="(item,index) in marketList"
                      :key="index"
                    >
                      <div
                        class="market-category"
                      >
                        {{item.plateName}}
                      </div>
                    <dl class="coin-item">
                      <dt></dt>
                      <dd
                        class="coin-item"
                        v-for="(innerItem,innerIndex) in item.content"
                        :key="innerIndex"
                      >
                        <span>
                          <!--收藏按钮-->
                          <!--自选区-->
                          <span v-show="activeName==tabList[0].name">
                            <i
                              class="el-icon-star-on cursor-pointer collected"
                              @click="toggleCollect(innerItem.id,0,innerItem)"
                            ></i>
                          </span>
                          <!--非自选区-->
                          <span v-show="activeName!==tabList[0].name">
                            <i
                              class="el-icon-star-off cursor-pointer"
                            ></i>
                            <i
                              class="el-icon-star-on cursor-pointer"
                            ></i>
                          </span>
                          <span class="base-currency">{{innerItem.sellsymbol}}</span>
                          <!--币中文名-->
                          <span
                            class="currency-chn-name"
                            v-show="language == 'zh_CN'"
                          >{{innerItem.sellname}}</span>
                          <span
                            class="area"
                            v-show="language !== 'zh_CN'"
                          >/ {{innerItem.area}}</span>
                        </span>
                        <span
                          class="price text-align-r"
                          :class="{
                            'up':innerItem.rose>0,
                            'down':innerItem.rose<0
                          }"
                        >
                          {{innerItem.price}}
                        </span>
                        <span
                          class="rose text-align-r"
                          :class="{
                            'up':innerItem.rose>0,
                            'down':innerItem.rose<0
                          }"
                        >
                            {{innerItem.rose}}
                          </span>
                      </dd>
                    </dl>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-collapse-transition>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'

export default {
  components: {
  },
  // props,
  data () {
    return {
      contentShowStatus: true, // 显示隐藏控制
      tabList: [], // tab栏个数
      activeName: '', // 当前tabItem
      sortBy: 'price-asc', // 排序依据: price-asc price-desc rose-asc rose-desc
      marketList: [], // 行情数据
      filterList: [], // 过滤行情数据
      collectAreaId: '', // 自选区id
      nothing: '' // 占位
    }
  },
  created () {
    require('../../../static/css/list/Trade/TradeMarket.css')
    require('../../../static/css/theme/day/Trade/TradeMarketDay.css')
    require('../../../static/css/theme/night/Trade/TradeMarketNight.css')
    // 获取tab个数
    this.tabList = [
      {
        id: 0,
        name: 'first',
        label: '自选'
      },
      {
        id: 1,
        name: 'second',
        label: 'FBT'
      },
      {
        id: 2,
        name: 'third',
        label: 'BTC'
      },
      {
        id: 3,
        name: 'fourth',
        label: 'ETH'
      }
    ]
    this.activeName = this.tabList[0].name
    // 获取行情数据
    this.marketList = [
      {
        plateId: 0, // 交易区id( 0:主区， 1:创新区)
        plateName: '主区', // 交易区名称
        content: [
          {
            id: 0, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 1, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 2, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 3, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 4, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 5, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 6, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 7, // 交易对id
            plateId: 0, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          }
        ]
      },
      {
        plateId: 1, // 交易区名称( 0:主区， 1:创新区)
        plateName: '创新区', // 交易区名称
        content: [
          {
            id: 0, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 1, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 2, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 3, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 4, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 5, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 6, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 7, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: 0.16123 // 涨跌
          },
          {
            id: 8, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 9, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          },
          {
            id: 10, // 交易对id
            plateId: 1, // 板块id（主区，交易区。。。）
            sellsymbol: 'FUC', // 币种简称
            sellname: '富链', // 币种全程
            area: 'BTC', // 交易区
            price: 0.21761239, // 最新价格
            rose: -0.16123 // 涨跌
          }
        ]
      }
    ]
  },
  mounted () {
  },
  activited () {
  },
  update () {
  },
  beforeRouteUpdate () {
  },
  methods: {
    // 切换收藏
    toggleCollect (id, status, row) {
      console.log(row)
      status = Boolean(status)
      // this.collectStatusList[id] = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      if (status) {
        //  添加收藏
        this.collectList.push(row)
      } else {
        // 取消收藏
        this.collectList.forEach((item, index) => {
          if (item.id == row.id) {
            this.collectList.splice(index, 1)
          }
        })
      }
      // setStore('collectList', this.collectList)
      // this.CHANGE_COLLECT_LIST(this.collectList)
      // this.setMarketList(this.collectAreaId, this.collectList)
      // console.log(this.marketList)
    },
    // 重置marketLIst
    resetList (list) {
      list.forEach((item, index) => {
        item.content = []
      })
    },
    // 切换tab
    changeTab (e) {
      const name = e.name
      console.log(this.globalCollectList)
      // 自选区
      if (name == this.tabList[0].name) {
        this.resetList(this.marketList)
        this.globalCollectList.forEach((item, index) => {
          this.marketList[item.plateId].content.push(item)
        })
      }
    },
    // 排序
    sortByUser (sortRule) {
      console.log(sortRule)
    },
    // 切换内容显示隐藏
    toggleShowContent () {
      this.contentShowStatus = !this.contentShowStatus
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme',
      'language',
      'globalCollectList'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index.scss';
  @import '../../../static/css/scss/Trade/TradeCenter.scss';

  .trade-market-box {
    /*width:433px;*/
    > .inner-box {
      > .title {
        height: 34px;
        line-height: 34px;
        margin-bottom: 4px;
        box-shadow: 0px 2px 2px -2px #888;
        display: flex;
        > .text {
          flex: 1;
          font-weight: 700;
          display: inline-block;
          height: 100%;
          > span {
            text-indent: 4px;
            display: inline-block;
            height: 100%;
            //border-bottom: 2px solid $mainColor;
          }
        }
        /*买卖单顺序操作按钮*/
        > .right {
          flex: 1;
          text-align: right;
          > button {
            cursor: pointer;
            width: 28px;
            height: 20px;
            margin: 8px 8px 0 0;
            -webkit-background-size: 28px 20px;
            background-size: 28px 20px;
            background: url(../../assets/develop/middle.png) no-repeat center center;
          }
          > .middle {
          }
          > .bottom {
            background-image: url(../../assets/develop/buys.png);
          }
          > .top {
            background-image: url(../../assets/develop/sells.png);
          }
        }
      }
      /*表格内容*/
      > .content {
        > .inner-box {
          .coin-table{
            padding:0 5px;
            >.coin-thead{
              height:30px;
              line-height:30px;
              >.coin-unit{
                display:flex;
                /*表头*/
                >.title{
                  flex:1;
                  &:nth-of-type(1){
                    margin-left:20px;
                  }
                  &.price{
                    text-align: center;
                  }
                  &.rose{
                    text-align: right;
                    margin-right:20px;
                  }
                  .sort-box{
                    position: relative;
                    >i{
                      position: absolute;
                      left:0;
                      &.active{
                        color:$mainColor;
                      }
                      &.el-icon-caret-top{
                        top:-1px;
                      }
                      &.el-icon-caret-bottom{
                        bottom:-1px;
                      }
                    }
                  }
                }
              }
            }
            /*币种列表*/
            >.coin-list{
              >.market-cate-wrap{
                /*板块头部*/
                >.market-category{
                  height: 40px;
                  margin: 0 16px;
                  padding-left: 10px;
                  line-height: 40px;
                  position: relative;
                  &:before{
                    content:'';
                    position: absolute;
                    width:2px;
                    height:14px;
                    background-color: $mainColor;
                    left:0;
                    top:50%;
                    transform: translateY(-50%);
                  }
                }
                >.coin-item{
                  >.coin-item{
                    /*margin-left: 16px;*/
                    padding: 0 0 0 10px;
                    /*border-bottom: 1px solid;*/
                    height: 25px;
                    line-height: 25px;
                    display:flex;
                    >span{
                      flex:1;
                      display: inline-block;
                      &.price{
                        margin-right:18%;
                      }
                      &.up{
                        color: $upColor;
                      }
                      &.down{
                        color:$downColor;
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
    &.night {
      > .inner-box {
        > .title {
          color: $nightMainTitleColor;
          background-color: $nightMainTitleBgColor;
        }
        > .content {
          background-color: $nightMainContentBgColor;
          > .inner-box {
          }
        }
      }
    }
    &.day {
      > .inner-box {
        > .title {
          color: $dayMainTitleColor;
          background-color: $dayMainBgColor;
        }
        > .content {
          background-color: #fff;
          > .inner-box {
          }
        }
      }
    }
  }
</style>
