<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--表头-->
      <template>
        <Tabs value="name1">
          <TabPane
            label="全部"
            name="name1"
          >
            <!--列表主要内容-->
            <div class="tab-content">
              <!--单个交易区-->
              <div
                class="tab-item"
                v-for="(item,index) in marketList"
                :key="index"
              >
                <div
                  class="left"
                  @mouseenter="toggleSide(index,0)"
                  @mouseleave="toggleSide(index,1)"
                >
                  <!--正面-->
                  <transition enter-active-class="animated flipInY">
                    <div
                      class="right-side"
                      v-show="toggleSideList[index]"
                    >
                    <div class="top">
                      <span>{{item.area}}</span>
                      <span>交易区</span>
                    </div>
                    <div class="bottom">
                      <Button type="primary"><span class="font-size16">查看更多</span> <Icon type="ios-arrow-down" /></Button>
                    </div>
                  </div>
                    </transition>
                  <!--反面-->
                  <transition enter-active-class="animated flipInY">
                    <div
                      class="reverse-side"
                      v-show="!toggleSideList[index]"
                    >
                      <div class="top">
                        <span>最热交易对</span>
                      </div>
                      <div class="bottom">
                        <ul class="hot-list">
                          <li class="hot-item">
                            <router-link to="/">
                              <span class="left">
                                <!--{{item.content[index]['sellsymbol']}}/{{item.area}}-->
                              </span>
                              <span class="right">
                                <span>{{item.price}}</span>
                                <span>≈0.25</span>
                              </span>
                            </router-link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </transition>
                </div>
                <div class="right">

                </div>
              </div>
            </div>
          </TabPane>
          <TabPane
            label="主交易区"
            name="name2"
          >
            标签二的内容
          </TabPane>
          <TabPane
            label="创新区"
            name="name3"
          >
            标签三的内容
          </TabPane>
        </Tabs>
      </template>
      <!--搜索框-->
      <div class="search-box">
        <Input
          v-model="value"
          placeholder="Enter something..."
          style="width: 300px"
          icon="ios-search-outline"
        />
      </div>
    </div>

    <!--文件拖拽-->
    <!--<div class="color-list">-->
      <!--<div-->
        <!--class="color-item"-->
        <!--v-for="color in colors" v-dragging="{ item: color, list: colors, group: 'color' ,otherData: otherData }"-->
        <!--:key="color.text"-->
      <!--&gt;{{color.text}}</div>-->
    <!--</div>-->
  </div>
</template>
<script>
// 文件拖动
import VueDND from 'awe-dnd'
import {mapState, mapMutations} from 'vuex'
Vue.use(VueDND)
export default{
  components: {},
  data () {
    return {

      // 拖拽
      colors: [
        {
          text: 'Aquamarine'
        }, {
          text: 'Hotpink'
        }, {
          text: 'Gold'
        }, {
          text: 'Crimson'
        }, {
          text: 'Blueviolet'
        }, {
          text: 'Lightblue'
        }, {
          text: 'Cornflowerblue'
        }, {
          text: 'Skyblue'
        }, {
          text: 'Burlywood'
        }
      ],
      // 行情数据
      marketList: [],
      // 切换正反面显示列表
      toggleSideList: []
    }
  },
  created () {
    require('../../../static/css/list/Home/MarketListHome.css')
    require('../../../static/css/theme/day/Home/MarketListHomeDay.css')
    require('../../../static/css/theme/night/Home/MarketListHomeNight.css')

    // 请求行情数据
    this.marketList = [
      {
        area: 'BTC', // 交易区名称
        content: [
          {
            id: 2, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            price: 0.2176, // 最新价格
            high: 0.235, // 最高价
            low: 0.001, // 最低价
            volume: 29222, // 24小时成交量
            rose: 0.16, // 涨跌
            tendency: [
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              }
            ],
            hot: true // 是否为最热交易对
          }
        ]
      },
      {
        area: 'ETH', // 交易区名称
        content: [
          {
            id: 2, // 交易对id
            image: 'https://www.fubt.top//fubt/upload/coin/a7e56fc38ea44e1f8ed4c395193ec2e0组.png', // 币种图标
            sellsymbol: 'FUC', // 币种简称
            sellname: '富比特', // 币种全程
            price: 0.2176, // 最新价格
            high: 0.235, // 最高价
            low: 0.001, // 最低价
            volume: 29222, // 24小时成交量
            rose: 0.16, // 涨跌
            tendency: [
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              },
              {
                time: 15222222222, // 时间
                high: 1.23 // 最高价
              }
            ],
            hot: true // 是否为最热交易对
          }
        ]
      }
    ]

    this.marketList.forEach(() => {
      // this.toggleSideList.push(true)
      this.toggleSideList.push(false)
    })
    console.log(this.toggleSideList)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([]),
    // 切换正反面
    toggleSide (index, status) {
      // this.$set(this.toggleSideList, index, Boolean(status))
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="less">
  @import url(../../../static/css/less/Home/MarketListHome);
  .market-list-box{
    min-height:1440px;
    width:100%;
    overflow: hidden;
    /*表头*/
    .inner-box{
      width:1090px;
      margin: 78px auto;
      position: relative;
      >.search-box{
        position: absolute;
        top:8px;
        right:0;
        width:250px;
        height:30px;
        overflow: hidden;
        border:1px solid @mainColor;
      }
      &:before{
        content:'';
        width:70px;
        height:30px;
        background-color: @mainColor;
        position: absolute;
        right:0;
        top:8px;
        z-index: 1;
      }
      &:after{
        content:'';
        width:0px;
        height:0px;
        position: absolute;
        right:69px;
        top:13px;
        z-index: 1;
        border:10px solid transparent;
        border-right:10px solid @mainColor;
      }
      /*列表主要内容*/
      .tab-content{
        min-height:1255px;
        background-color: darkolivegreen;
        /*单个交易区*/
        >.tab-item{
          >div{
            display:inline-block;
          }
          /*侧边栏*/
         >.left{
           width:210px;
           min-height:560px;
           background-color: #f40;
           position: relative;
           text-align: center;
           >div{
             position: absolute;
             top:0;
             left:0;
             height:100%;
             width:100%;
           }
           >.right-side,>.reverse-side{
             >.top{
               margin-top:30px;
               font-size: 30px;
               color:#fff;
               padding:20px 0;
               background: url(../../assets/develop/market-list-border.png) no-repeat center bottom;
             }
           }
           /*正面*/
           >.right-side{
             background:linear-gradient(#1D3862,#305FA7);

             >.top{

             }
             >.bottom{
               margin-top:360px;
             }
           }

           /*反面*/
           >.reverse-side{
             background:linear-gradient(#2F398C,#3D4E8D);

           }
         }
          /*主要内容*/
          >.right{

          }
        }
      }
    }
    &.night{
      background-color: @nightBgColor;
      color:@nightFontColor;
      >.search-box{

      }
    }
    &.day{
      background-color: @dayBgColor;
      color:@dayFontColor;
    }
  }
</style>
