<template>
  <div
    class="currency-information-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <div class="title">数字资产列表</div>
        <ul class="list" id="list">
          <li
            class="currency-item"
            v-for="(item,index) in currencyList"
            :key="index"
            @click="currencyName(item.id)"
          >
            <span>{{item.name}}({{item.shortName}})</span>
          </li>
        </ul>
      </div>
      <div class="right">
        <h2>BTC是什么</h2>
        <P>
          <span>1.这是标题</span><br>
          香港FUBT交易所，致力于打造全球领先的区块链资产交易服务平台。
          FUBT前中国大陆站（即币兴网）于2017年6月搭建完成并开放注册，7月10日正式开启交易。上线伊始迅速发展壮大，用户激增、交易火爆，首发
          平台币BXB一度暴涨25倍领跑市场。后币兴网主动响应”中国9.4政策”而自主关停，并于同年底开启全新国际站香港富比特——www.fubt.top。
          2018年上半年，FUBT陆续启动中国台湾、柬埔寨金边、日本东京、韩国首尔、美国纽约等全球各地分站。
        </P>
        <P>
          <span>1.这是标题</span><br>
          香港FUBT交易所，致力于打造全球领先的区块链资产交易服务平台。
          FUBT前中国大陆站（即币兴网）于2017年6月搭建完成并开放注册，7月10日正式开启交易。上线伊始迅速发展壮大，用户激增、交易火爆，首发
          平台币BXB一度暴涨25倍领跑市场。后币兴网主动响应”中国9.4政策”而自主关停，并于同年底开启全新国际站香港富比特——www.fubt.top。
          2018年上半年，FUBT陆续启动中国台湾、柬埔寨金边、日本东京、韩国首尔、美国纽约等全球各地分站。
        </P>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {getCurrencyInforList, getCurrencyDetails} from '../../utils/api/OTC'
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
  data () {
    return {
      currencyId: '',
      currencyList: [
        {
          id: 1,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 2,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 3,
          name: '比特币',
          shortName: 'BTC'
        },
        {
          id: 4,
          name: '比特币',
          shortName: 'BTC'
        }
      ],
      currencyDetails: ''
    }
  },
  created () {
    this.getFootCurrencyInforList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 数字资产列表
    async getFootCurrencyInforList () {
      const data = await getCurrencyDetails({
        language: this.language,
        partnerId: this.partnerId
      })
      console.log('你好')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        this.currencyId = data.data.data.list[0].id
        this.currencyList = data.data.data.list
      }
    },
    currencyName (id) {
      this.currencyId = id
      // 重新币种详情
      this.getFootCurrencyInforDetail()
    },
    // 币种详情
    async getFootCurrencyInforDetail () {
      const data = await getCurrencyInforList({
        id: this.currencyId
      })
      console.log('你好世界')
      console.log(data)
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // this.currencyDetails=data.data.data
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      partnerId: state => state.common.partnerId,
      language: state => state.common.language
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .currency-information-box{
    >.inner-box{
      margin-left:10px;
      display: flex;//
      >.left{
        width:230px;
        height:720px;
        background:#1E2636;
        border-right:50px solid #121824;
        border-bottom:50px solid #121824;
        >.title{
          background:rgba(51,66,95,0.5);
          height: 30px;
          color: #fff;
          line-height: 30px;
          text-align: center;
          margin-bottom:10px;
          box-shadow:2px 0px 2px rgba(11,14,22,0.5)
        }
        >.list{
          text-align: center;
          height: 720px;;
          overflow-y: auto;
          >.currency-item{
            line-height: 30px;
            >.current{
              background: #121824;
              color: #338FF5;
            }
          }
        }
      }
      >.right{
        width: 820px;
        box-sizing: border-box;
       padding:29px 35px;
       color:#8BA0CA;
       line-height: 22px;
       >p{
         padding:10px 0px;
         >span{
            color:#fff;
         }
       }
      }
    }
    &.night{
      >.content{
        >.content{
          >.inner-box{
            background: transparent;
          }
        }
      }
    }
  }
</style>
