<template>
  <div
    class="coin-table font-size12"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--表格头部-->
    <dl class="coin-thead">
      <dt></dt>
      <dd class="coin-unit">
        <span
          class="title coin-type"
        >
          <!--交易对-->
          {{ $t('M.comm_deal') }}{{ $t('M.comm_pair') }}
        </span>
        <span
          class="title price cursor-pointer"
        >
          <!--最新价-->
            <span
              :data-text="$t('M.trade_latest_price')"
              @click="sortByUser('price',list)"
            >
              <!--最新价-->
              {{ $t('M.trade_latest_price') }}
            </span>
            <i class="sort-box">
              <i
                class="el-icon-caret-top"
                :class="{active:sortBy=='price-asc'}"
                @click="sortByUser('price-asc',list)"
              >
              </i>
              <i
                class="el-icon-caret-bottom"
                :class="{active:sortBy=='price-desc'}"
                @click="sortByUser('price-desc',list)"
              >
              </i>
            </i>
        </span>
        <span
          class="title rose cursor-pointer"
          @click="sortByUser('rose',list)"
        >
          <!--涨幅-->
          <!-- {{ $t('M.trade_market_amount_increase') }} -->
          {{ $t('M.trade_ups_and_downs') }}
          <i class="sort-box">
            <i
              class="el-icon-caret-top"
              :class="{active:sortBy=='rose-asc'}"
              @click="sortByUser('rose-asc',list)"
            ></i>
            <i
              class="el-icon-caret-bottom"
              :class="{active:sortBy=='rose-desc'}"
              @click="sortByUser('rose-desc',list)"
            ></i>
          </i>
        </span>
      </dd>
    </dl>
    <div class="coin-list">
      <div
        class="market-cate-wrap"
        v-for="(item,index) in plateList"
        :key="index"
      >
        <div
          class="market-category"
        >
          {{item.plateName}}
        </div>
        <dl
          class="coin-item "
        >
          <dt></dt>
          <dd
            class="coin-item cursor-pointer"
            v-for="(innerItem,innerIndex) in item.content"
            :key="innerIndex"
            @click=changeActiveSymbol(innerItem)
          >
            <span>
              <!--收藏按钮-->
              <!--自选区-->
              <span v-show="activeName==collectArea.areaId">
                <i
                  class="click-button cursor-pointer"
                  @click.stop="toggleCollect(innerItem.id,0,innerItem,index,innerIndex)"
                >
                  <i
                    class="el-icon-star-on  collected font-size16"
                  ></i>
                </i>
              </span>
              <!--非自选区-->
              <span v-show="activeName!=collectArea.areaId">
                <i
                  class="click-button cursor-pointer"
                  v-show="!collectSymbol[innerItem.id]"
                  @click.stop="toggleCollect(innerItem.id,1,innerItem,index)"
                >
                  <i
                    class="el-icon-star-off  font-size16"
                  ></i>
                </i>
                <i
                  class="click-button cursor-pointer"
                  v-show="collectSymbol[innerItem.id]"
                  @click.stop="toggleCollect(innerItem.id,0,innerItem,index)"
                >
                  <i
                    class="el-icon-star-on  collected font-size16"
                  ></i>
                </i>
              </span>
              <span class="base-currency">{{innerItem.sellsymbol}}</span>
              <!--币中文名-->
              <span
                class="currency-chn-name"
                v-show="language === 'zh_CN'"
              >{{innerItem.sellname}}</span>
              <span
                class="area"
                v-show="language !== 'zh_CN'"
              >/ {{innerItem.area}}</span>
            </span>
            <span
              class="price text-align-r"
              :class="{
                'up':innerItem.chg>0,
                'down':innerItem.chg<0
              }"
              >
              {{innerItem.last}}
            </span>
            <span
              class="rose text-align-r"
              :class="{
                'up':innerItem.chg>0,
                'down':innerItem.chg<0
              }"
            >
              {{innerItem.chg}}
            </span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// import {returnAjaxMessage} from '../../utils/commonFunc'
export default {
  components: {
  },
  props: [
    'sortBy',
    'plateList',
    'collectSymbol',
    'activeName',
    'collectArea',
    'list'
  ],
  data () {
    return {}
  },
  created () {
    // this.sort()
    // console.log(this.area)
    // console.log(this.plateId)
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    sortByUser (sortMethod, list) {
      this.$emit('sortByUser', {
        sortMethod,
        list
      })
    },
    changeActiveSymbol (activeSymbol, previousSymbol) {
      this.$emit('changeActiveSymbol', {
        activeSymbol,
        previousSymbol
      })
    },
    toggleCollect (id, status, row, plateIndex, contentIndex) {
      this.$emit('toggleCollect', {
        id,
        status,
        row,
        plateIndex,
        contentIndex
      })
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language // 语言
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';
  .coin-table{
    /*padding:0 5px;*/
    >.coin-thead{
      height:30px;
      line-height:30px;
      >.coin-unit{
        display:flex;
        /*表头*/
        >.title{
          flex:1;
          color:$mainNightTitleColor;
          &:nth-of-type(1){
            margin-left:20px;
          }
          &.price{
            text-align: right;
            margin-right:12%;
          }
          @media screen and (max-width: 1920px) {
            &.price{
              text-align: right;
              margin-right:5%;
            }
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
                top:-2px;
              }
              &.el-icon-caret-bottom{
                bottom:-2px;
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
          /*padding-left: 10px;*/
          /*padding: 0 20px;*/
          padding:0 4.5%;
          line-height: 40px;
          position: relative;
          color:$mainColor;
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
            /*padding: 0 20px;*/
            padding:0 4.5%;
            /*border-bottom: 1px solid;*/
            height: 30px;
            line-height: 30px;
            display:flex;
            .click-button{
              width:18px;
              height:30px;
              display: inline-block;
            }
            &:hover{
              background-color: pink;
            }
            >span{
              flex:1;
              display: inline-block;
              /*>.base-currency{*/
                /**/
              /*}*/
              &.price{
                margin-right:12%;
              }
              @media screen and (max-width: 1920px) {
                &.price{
                  margin-right:2%;
                }
              }
            }
          }
        }
      }
    }
    &.night{
      >.coin-thead{
        >.coin-unit{
          display:flex;
          /*表头*/
          >.title{
            &:nth-of-type(1){
            }
            &.price{
            }
            @media screen and (max-width: 1920px) {
              &.price{
              }
            }
            &.rose{
            }
            .sort-box{
              >i{
                &.active{
                }
                &.el-icon-caret-top{
                }
                &.el-icon-caret-bottom{
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
            &:before{
            }
          }
          >.coin-item{
            white-space:nowrap;
            >.coin-item{
              .click-button{
                color:$nightFontColor;
              }
              &:hover{
                background-color: rgba(255, 255, 255, 0.2);
              }
              >span{
                >.base-currency{
                  color:$nightFontColor;
                }
                >.currency-chn-name{
                  color:#b0b2b6;
                }
                &.price,&.rose{
                  color:$nightFontColor;
                }
                @media screen and (max-width: 1920px) {
                  &.price{
                  }
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
    &.day{
      >.coin-thead{
        >.coin-unit{
          display:flex;
          /*表头*/
          >.title{
            &:nth-of-type(1){
            }
            &.price{
            }
            @media screen and (max-width: 1920px) {
              &.price{
              }
            }
            &.rose{
            }
            .sort-box{
              >i{
                &.active{
                }
                &.el-icon-caret-top{
                }
                &.el-icon-caret-bottom{
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
            &:before{
            }
          }
          >.coin-item{
            >.coin-item{
              &:hover{
                background-color: #eaf2fa;
              }
              >span{
                >.currency-chn-name{
                  color:#b0b2b6;
                }
                &.price{
                }
                @media screen and (max-width: 1920px) {
                  &.price{
                  }
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
</style>
