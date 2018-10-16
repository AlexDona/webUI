<template>
  <div class="coin-table font-size12">
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
                ></i>
                <i
                  class="el-icon-caret-bottom"
                  :class="{active:sortBy=='price-desc'}"
                  @click="sortByUser('price-desc',list)"
                ></i>
              </i>
            </span>
              <span
              class="title rose cursor-pointer"
              @click="sortByUser('rose',list)"
              >
              <!--涨幅-->
          {{ $t('M.trade_market_amount_increase') }}
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
                  class="el-icon-star-on cursor-pointer collected font-size16"
                  @click="toggleCollect(innerItem.id,0,innerItem,index,innerIndex)"
                ></i>
              </span>
              <!--非自选区-->
              <span v-show="activeName!=collectArea.areaId">
                <i
                  class="el-icon-star-off cursor-pointer font-size16"
                  v-show="!collectSymbol[innerItem.id]"
                  @click="toggleCollect(innerItem.id,1,innerItem,index)"
                ></i>
                <i
                  class="el-icon-star-on cursor-pointer collected font-size16"
                  v-show="collectSymbol[innerItem.id]"
                  @click="toggleCollect(innerItem.id,0,innerItem,index)"
                ></i>
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
      language: state => state.common.language // 语言
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';
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
</style>
