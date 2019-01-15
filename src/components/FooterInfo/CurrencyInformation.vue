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
} from '../../utils/api/common'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      currencyId: '',
      currencyList: [],
      currencyInfo: {}
    }
  },
  async created () {
    console.log(this.middleTopData)
    await this.initInfoList()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async initInfoList () {
      await this.getFootCurrencyInfoList()
      await this.getFootCurrencyInforDetail()
      if (this.currencyList.length) {
        await this.changeCurrentCurrency(this.currencyId || getNestedData(this.currencyList, '[0].id'))
      } else {
        this.currencyInfo = {}
      }
    },
    // 数字资产列表
    async getFootCurrencyInfoList () {
      let language
      switch (this.language) {
        case 'zh_TW':
          language = 'zh_CN'
          break
        case 'zh_CN':
          language = 'zh_CN'
          break
        default:
          language = 'en_US'
          break
      }
      const data = await getCurrencyInfoList({language})
      this.currencyList = getNestedData(data, 'data')
      if (this.currencyList.length) {
        this.currencyId = getNestedData(this.currencyList.filter(item => item.name == this.middleTopData.sellsymbol), '[0].id') || getNestedData(this.currencyList, '[0].id')
      }
      console.log(data)
    },
    changeCurrentCurrency (id) {
      this.currencyId = id
      // 重新币种详情
      this.getFootCurrencyInforDetail()
    },
    // 币种详情
    async getFootCurrencyInforDetail () {
      let currencyId = this.currencyId || getNestedData(this.currencyList, '[0].id')
      if (currencyId) {
        const data = await getCurrencyDetails(this.currencyId || getNestedData(this.currencyList, '[0].id'))
        if (!(returnAjaxMsg(data, this, 0))) {
          return false
        } else {
          this.currencyInfo = getNestedData(data, 'data.data')
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      serviceActiveName: state => state.footerInfo.serviceActiveName,
      middleTopData: state => state.trade.middleTopData
    })
  },
  watch: {
    async language () {
      await this.initInfoList()
    },
    serviceActiveName () {
      this.getFootCurrencyInforDetail()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .currency-information-box {
    width: 100%;

    > .inner-box {
      display: flex;
      width: 100%;
      margin-left: 10px;//
      > .left {
        width: 180px;
        height: 720px;
        margin-right: 20px;

        > .title {
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }

        > .list {
          width: 180px;
          height: 100%;
          padding: 0 2px;
          overflow-y: auto;
          text-align: center;

          > .currency-item {
            box-sizing: border-box;
            width: 176px;
            height: 30px;
            line-height: 30px;

            &.active {
              color: #338ff5;
            }
          }
        }
      }

      > .right {
        box-sizing: border-box;
        width: 890px;
        padding: 29px 35px;
        line-height: 22px;

        > .inner-box {
          > h1 {
            margin-bottom: 20px;
            font-weight: 700;
            font-size: 16px;
          }
        }

        > p {
          padding: 10px 0;
        }
      }
    }

    &.night {
      background-color: #121824;

      > .inner-box {
        > .left {
          background: #1e2636;

          > .title {
            background: rgba(51, 66, 95, .5);
            box-shadow: 2px 0 2px rgba(11, 14, 22, .5);
          }

          > .list {
            > .currency-item {
              &.active {
                background: #121824;
              }
            }
          }
        }

        > .right {
          color: #8ba0ca;
          background-color: #1e2636;

          > .inner-box {
            > h1 {
              color: #338ff5;
            }
          }

          > p {
            padding: 10px 0;

            > span {
              color: #fff;
            }
          }
        }
      }
    }

    &.day {
      background-color: #fff;

      > .inner-box {
        > .left {
          border: 1px solid rgba(236, 241, 248, 1);
          background: #fff;

          > .title {
            background: rgba(51, 143, 245, .5);
            box-shadow: 2px 0 2px rgba(202, 216, 231, 1);
          }

          > .list {
            > .currency-item {
              &.active {
                background: rgba(190, 217, 248, 1);
              }
            }
          }
        }

        > .right {
          border: 1px solid rgba(236, 241, 248, 1);
          color: #8ba0ca;
          background-color: #fff;

          > .inner-box {
            > h1 {
              color: #338ff5;
            }
          }

          > p {
            padding: 10px 0;

            > span {
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>
