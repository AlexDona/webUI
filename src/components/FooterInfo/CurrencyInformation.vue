<template>
  <div
    class="currency-information-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="left">
        <div class="title">
          <!--数字资产列表-->
          {{ $t('M.about_digital_assets_list') }}
        </div>
        <ul class="list" id="list">
          <li
            class="currency-item cursor-pointer"
            :class="{'active':currencyId==item.id}"
            v-for="(item,index) in currencyList"
            :key="index"
            @click="changeCurrentCurrency(item.id)"
          >
            <span>{{item.name}} {{item.shortName}} </span>
          </li>
        </ul>
      </div>
      <div class="right">
        <div
          class="inner-box"
        >
          <h1>
            {{currencyInfo.name}} {{currencyInfo.shortName}}
          </h1>
          <div
            class="information"
            v-html="currencyInfo.information"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {
  getCurrencyInfoList,
  getCurrencyDetails
} from '../../utils/api/header'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      currencyId: '',
      currencyList: [
      ],
      currencyInfo: {
        // coinId: '486124940777488384',
        // createTime: '2018-09-18 10:12:17',
        // id: '491552030104485888',
        // information: `↵        <!DOCTYPE html>↵        <html>↵        <head lang="en">↵            <meta charset="UTF-8">↵            <title></title>↵            <link href="https://cdn.bootcss.com/quill/1.3.6/quill.snow.css" rel="stylesheet">↵        </head>↵        <body>↵          <p>比特币<img src="http://fubt-3.oss-cn-hongkong.aliyuncs.com/b91b13c4-af14-4c90-b217-c1f33c3b993b"></p>    ↵        </body>↵        </html>↵      `,
        // intro: '比特币',
        // language: 'zh_CN',
        // logo: 'http://fubt-3.oss-cn-hongkong.aliyuncs.com/3829bdfa-390b-46f7-b6cc-b201883ca93e',
        // modifier: '申',
        // name: 'BTC',
        // shortName: '比特币',
        // updateTime: '2018-09-18 10:12:17',
        // version: 1
      }
    }
  },
  async created () {
    await this.getFootCurrencyInfoList()
    await this.getFootCurrencyInforDetail()
    if (this.currencyList.length) {
      await this.changeCurrentCurrency(this.currencyList[0].id)
    }
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 数字资产列表
    async getFootCurrencyInfoList () {
      const data = await getCurrencyInfoList({
        language: this.language
      })
      console.log(data)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.currencyList = data.data.data
        console.log(this.currencyList.length)
        if (this.currencyList.length) {
          this.currencyId = this.currencyList[0].id
          console.log(this.currencyList)
        }
      }
    },
    changeCurrentCurrency (id) {
      this.currencyId = id
      // 重新币种详情
      this.getFootCurrencyInforDetail()
    },
    // 币种详情
    async getFootCurrencyInforDetail () {
      console.log(this.currencyId)
      if (this.currencyId) {
        const data = await getCurrencyDetails(this.currencyId)
        if (!(returnAjaxMessage(data, this, 0))) {
          return false
        } else {
          this.currencyInfo = data.data.data
          console.log(this.currencyDetails)
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  },
  watch: {
    currencyId (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .currency-information-box{
    width:100%;
    >.inner-box{
      width:100%;
      margin-left:10px;
      display: flex;//
      >.left{
        width:180px;
        height:720px;
        margin-right:20px;
        >.title{
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }
        >.list{
          text-align: center;
          height: 100%;
          width:180px;
          overflow-y: auto;
          padding:0 2px;
          >.currency-item{
            line-height: 30px;
            width:176px;
            height:30px;
            box-sizing: border-box;
            &.active{
              color: #338FF5;
            }
          }
        }
      }
      >.right{
        width: 890px;
        box-sizing: border-box;
        padding:29px 35px;
        line-height: 22px;
        >.inner-box{
          >h1{
            font-weight: 700;
            font-size: 16px;
            margin-bottom:20px;
          }
          img{
          }
        }
       >p{
         padding:10px 0px;
         >span{
         }
       }
      }
    }
    &.night{
      background-color: #121824;
      >.inner-box{
        >.left{
          background:#1E2636;
          >.title{
            background:rgba(51,66,95,0.5);
            box-shadow:2px 0px 2px rgba(11,14,22,0.5)
          }
          >.list{
            >.currency-item{
              &.active{
                background: #121824;
              }
            }
          }
        }
        >.right{
          background-color: #1e2636;
          color:#8BA0CA;
          >.inner-box{
            >h1{
              color:#338FF5;
            }
          }
          >p{
            padding:10px 0px;
            >span{
              color:#fff;
            }
          }
        }
      }
    }
    &.day{
      background-color: #fff;
      >.inner-box{
        >.left{
          background:#fff;
          border:1px solid rgba(236,241,248,1);
          >.title{
            background:rgba(51,143,245,.5);
            box-shadow:2px 0px 2px rgba(202,216,231,1);
          }
          >.list{
            >.currency-item{
              &.active{
                background:rgba(190,217,248,1);
              }
            }
          }
        }
        >.right{
          background-color: #fff;
          color:#8BA0CA;
          border:1px solid rgba(236,241,248,1);
          >.inner-box{
            >h1{
              color:#338FF5;
            }
          }
          >p{
            padding:10px 0px;
            >span{
              color:#fff;
            }
          }
        }
      }
    }
  }
</style>
