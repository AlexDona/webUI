<template>
  <div
    class="market-list-box home"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <LoadingBox class="loading-box"/>
    <div class="inner-box">
      <!--表头-->
      <template>
        <el-tabs
          v-model="activeName"
          @tab-click="changeTab"
        >
          <el-tab-pane
            :label="outItem.plateName.replace('+',' ')"
            :name="outItem.plateId"
            v-for="(outItem,outIndex) in filterMarketList"
            :key="outIndex"
          >
            <div
              class="tab-content"
            >
              <!--搜索区-->
              <HomeMarketTableItem
                :searchKeyWord="searchKeyWord"
                :collectAreaId="collectAreaId"
                :searchAreaId="searchAreaId"
                :collectStatusList="collectStatusList"
                :item="searchArea"
                :collectSymbol="collectSymbol"
                @toggleCollect="toggleCollect"
              />
              <!--自选区-->
              <HomeMarketTableItem
                :collectAreaId="collectAreaId"
                :searchAreaId="searchAreaId"
                :collectStatusList="collectStatusList"
                :item="collectArea"
                :collectSymbol="collectSymbol"
                @toggleCollect="toggleCollect"
              />
              <div
                class="tab-item"
                v-for="(item) in outItem.tradeAreaList"
                :id="'tab-item.'+item.id"
                :key="item.id">
                <div
                  class="inner-item-box"
                  v-if="(item.content.length&&item.id!==searchAreaId)||(item.id==searchAreaId&&searchKeyWord!=='')"
                  :style="'height:'+(50*(item.content.length||1)+102)+'px'"
                  :class="{
                  'force-height':!(item.id==searchAreaId||item.id==collectAreaId),
                  'max-height':true
                  }"
                >
                  <!--单个交易区-->
                  <HomeMarketTableItem
                    :collectAreaId="collectAreaId"
                    :searchAreaId="searchAreaId"
                    :collectStatusList="collectStatusList"
                    :item="item"
                    :collectSymbol="collectSymbol"
                    @toggleCollect="toggleCollect"
                  />
                </div>
              </div>
              <div
                class="more-box"
                v-show="moreBtnShowStatus"
              >
                <IconFontCommon
                  v-show="!tabContentMoreStatus"
                  iconName="icon-iconmore"
                />
                <IconFontCommon
                  v-show="tabContentMoreStatus"
                  iconName="icon-iconfewer"
                />
                <br>
                <!--查看更多交易区-->
                <el-button
                  round
                  @click="toggleTabContentHeightStatus"
                >
                  {{$t(moreBtnText)}}
                </el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
      <!--搜索框-->
      <!--请输入内容-->
      <div class="search-box">
        <el-input
          v-model="searchKeyWord"
          :placeholder="$t('M.comm_search')"
          @keyup.native="searchFromMarketList"
        >
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
  </div>
</template>
<script>
import Footer from './NoticeHome'
import EchartsLineCommon from '../Common/EchartsLineCommon'
import IconFontCommon from '../Common/IconFontCommon'
import HomeMarketTableItem from '../Home/HomeMarketTableItem'
import socket from '../../utils/datafeeds/socket'
import {
  getStore,
  setStore,
  keep2Num,
  unzip
} from '../../utils'
// import {
//   addUserCollectionAjax,
//   removeCollectionAjax
// } from '../../utils/api/home'
import {
  returnAjaxMsg,
  // splitSocketParams
  toggleUserCollection,
  getCollectionList,
  setSocketData,
  getNestedData
} from '../../utils/commonFunc'
import {
  getHomeMarketByAjax
  // getCollectionListAjax
} from '../../utils/api/home'
import {mapState, createNamespacedHelpers} from 'vuex'
const { mapMutations } = createNamespacedHelpers('home')
export default{
  components: {
    IconFontCommon,
    Footer,
    EchartsLineCommon,
    HomeMarketTableItem
  },
  data () {
    return {
      // tab 栏列表
      tabList: [],
      // 单个交易区查看全部状态
      itemAreaMoreStatus: false,
      // 当前选中查看更多的交易区id
      activeAreaId: '',
      // 搜索关键字
      searchKeyWord: '',
      // 搜索列表
      searchList: [],
      // 搜索区 id
      searchAreaId: 3,
      // 查看更多按钮文字
      moreBtnText: 'M.comm_view_more',
      // tab-content查看更多状态, 默认为false
      tabContentMoreStatus: false,
      // 自选区 id
      collectAreaId: 2,
      // 自选区状态列表
      collectStatusList: {},
      // 自选区列表
      collectList: [],
      // 当前选中tab
      activeName: '',
      activeIndex: null, // 当前activeName 对应index
      // 侧边栏节流阀
      flag: true,
      // 全部行情数据
      marketList: [],
      // 前两项行情数据
      filterMarketList: [],
      moreBtnShowStatus: true, // 查看更多按钮显示状态
      socket: new socket(),
      tabChangeCount: 0, // tab栏切换次数
      newMarketList: [], // 当前最新行情
      collectArea: {
        area: this.$t('M.home_market_district'), // 交易区名称 自选区
        id: 2,
        content: []
      },
      searchArea: {
        area: this.$t('M.home_market_field_search'), // 搜索区
        id: 3,
        content: []
      },
      socketParamsStr: '', // socket请求参数字符串
      end: ''
    }
  },
  async created () {
    // console.log(this.loginStep1Info)
    require('../../../static/css/list/Home/MarketListHome.css')
    require('../../../static/css/theme/day/Home/MarketListHomeDay.css')
    require('../../../static/css/theme/night/Home/MarketListHomeNight.css')
    if (this.language) {
      await this.getHomeMarketByAjax()
    }
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {
  },
  destroyed () {
    this.socket.destroy()
  },
  methods: {
    ...mapMutations([
      'CHANGE_COLLECT_LIST',
      'CHANGE_COLLECT_SYMBOL',
      'CHANGE_SYMBOL_MAP'
    ]),
    setCollectData (collectSymbol) {
      this.CHANGE_COLLECT_SYMBOL({
        type: 'reset',
        collectSymbol
      })
      let newContent = []
      _.forEach(collectSymbol, (outItem) => {
        if (this.symbolMap.get(outItem)) {
          newContent.push(this.symbolMap.get(outItem))
        }
      })
      this.$set(this.collectArea, 'content', newContent)
    },
    // 遍历行情数组
    ergodicNewMarketList (callback) {
      _.forEach(this.newMarketList, (item) => {
        _.forEach(item.tradeAreaList, (innerItem) => {
          _.forEach(innerItem.content, (fourthItem) => {
            callback(fourthItem)
          })
        })
        return false
      })
    },
    // 拼接socket参数
    concatSocketParamsStr (activeIndexOfNewMarketList) {
      this.socketParamsStr = ''
      let currentList = this.newMarketList[activeIndexOfNewMarketList]
      if (currentList && currentList.tradeAreaList) {
        _.forEach(currentList.tradeAreaList, (outItem) => {
          _.forEach(outItem.content, (item) => {
            this.socketParamsStr += `${item.id}@`
          })
        })
        _.forEach(this.collectArea.content, (item) => {
          if (item) {
            this.socketParamsStr += `${item.id}@`
          }
        })
        this.socketParamsStr = this.socketParamsStr.slice(0, this.socketParamsStr.length - 1)
      }
    },
    // 订阅数据
    subscribeSocket (type, params) {
      this.socket.doOpen()
      // 第一次加载
      if (!this.tabChangeCount) {
        this.socket.on('open', () => {
          this.getSocketData(type, params)
        })
      } else {
        this.getSocketData(type, params)
      }

      this.socket.on('message', (data) => {
        console.log(data.data)
        if (data.type == 1) {
          const newData = data.data
          // 非自选区
          _.forEach(this.newMarketList[this.activeIndex].tradeAreaList, (item, index) => {
            console.log(item)
            _.forEach(item.content, (innerItem, innerIndex) => {
              let newContent = innerItem
              if (innerItem.tradeId === newData.tradeId) {
                setSocketData(
                  newContent,
                  newData,
                  this.newMarketList[this.activeIndex].tradeAreaList[index].content,
                  innerIndex,
                  this
                )
                this.getFilterMarketList()
                return false
              }
            })
          })
          //  自选区
          _.forEach(this.collectArea.content, (item, index) => {
            let newContent = item
            if (item && item.tradeId === newData.tradeId) {
              setSocketData(
                newContent,
                newData,
                this.collectArea.content,
                index,
                this
              )
            }
          })
        }
      })
    },
    // 截取2位小数
    keep2Num (number) {
      return keep2Num(number)
    },
    // 更改当前交易对
    changeActiveSymbol (e) {
      console.log(e)
      this.$store.commit('trade/SET_JUMP_STATUS', true)
      this.$store.commit('trade/SET_JUMP_SYMBOL', e)
      console.log(this.activeSymbol)
      // 设置当前交易区
      const id = e.areaId
      const name = e.area
      this.$store.commit('common/CHANGE_ACTIVE_TRADE_AREA', {
        id,
        name
      })
      this.$router.push({'path': '/TradeCenter'})
    },
    // 获取用户收藏列表
    async getCollectionList (collectSymbol) {
      await getCollectionList(this, data => {
        _.forEach(data.data.data, (item) => {
          collectSymbol[item.content] = item.content
        })
      })
    },
    // 首次链接接口获取行情数据
    async getHomeMarketByAjax () {
      const params = {
        i18n: this.language
      }
      const data = await getHomeMarketByAjax(params)
      console.log(data)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        let objData = getNestedData(data, 'data.data.obj')
        this.newMarketList = JSON.parse(unzip(objData))
        this.ergodicNewMarketList((item) => {
          this.CHANGE_SYMBOL_MAP({
            key: item.id,
            val: item
          })
        })
        this.activeName = this.newMarketList[0].plateId
        this.activeIndex = 0
        let collectSymbol = {}
        if (!this.isLogin) {
          collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
        } else {
          await this.getCollectionList(collectSymbol)
        }
        this.setCollectData(collectSymbol)
        this.concatSocketParamsStr(this.activeIndex)
        this.getFilterMarketList()
      }
    },
    getSocketData (type, params) {
      // 首页socket
      this.socket.send({
        'tag': type,
        'content': `market.${params}.ticker`,
        'id': `market_002`
      })
    },
    // 切换板块
    changeTab () {
      this.searchFromMarketList()
    },
    // market过滤
    getFilterMarketList () {
      let list = _.cloneDeep(this.newMarketList)
      if (!this.tabContentMoreStatus) {
        this.filterMarketList = list
        for (let k = 0; k < list.length; k++) {
          let newList = list[k].tradeAreaList.slice(0, 2)
          this.$set(this.filterMarketList[k], 'tradeAreaList', newList)
        }
        // list.forEach((item, index) => {
        //   let newList = list[index].tradeAreaList.slice(0, 2)
        //   this.$set(this.filterMarketList[index], 'tradeAreaList', newList)
        //   // this.filterMarketList[index].tradeAreaList = list[index].tradeAreaList.slice(0, 2)
        // })
      } else if (this.tabContentMoreStatus) {
        this.filterMarketList = this.newMarketList
      }
    },
    // 搜索关键字
    searchFromMarketList () {
      this.searchList = []
      this.searchArea.content = this.searchList
      if (this.searchKeyWord.trim() !== '') {
        this.symbolMap.forEach(item => {
          console.log(item.plateId, this.activeName)
          if (item.plateId === this.activeName) {
            const result1 = item.sellsymbol.search(this.searchKeyWord.toUpperCase())
            const result2 = item.sellname.search(this.searchKeyWord)
            if (result1 !== -1 || result2 !== -1) {
              this.searchList.push(item)
            }
          }
        })
        console.log(this.searchKeyWord, this.searchList)

        this.searchArea.content = this.searchList
      } else {
        this.searchArea.content = []
      }
    },
    // 切换查看更多
    toggleTabContentHeightStatus () {
      this.itemAreaMoreStatus = false
      this.tabContentMoreStatus = !this.tabContentMoreStatus
      this.toggleViewMoreBtnText()
      this.getFilterMarketList()
    },
    // 切换 查看更多按钮文字
    toggleViewMoreBtnText () {
      this.moreBtnText = this.tabContentMoreStatus ? 'M.comm_pack_up' : 'M.comm_view_more'
    },
    // 切换收藏
    async toggleCollect (data) {
      let {id, status, row} = data
      console.log(id)
      status = Boolean(status)
      // this.collectStatusList[id] = Boolean(status)
      this.$set(this.collectStatusList, id, status)
      // console.log(this.collectStatusList)
      if (status) {
        //  添加收藏
        this.CHANGE_COLLECT_SYMBOL({
          type: 'add',
          collectSymbol: id
        })
        this.collectArea.content.push(row)
        if (this.isLogin) {
          await toggleUserCollection('add', id, this)
        }
      } else {
        this.CHANGE_COLLECT_SYMBOL({
          type: 'cancel',
          collectSymbol: id
        })
        console.log(id, this.collectArea.content)
        // // 取消收藏
        let newList = this.collectArea.content.filter(item => item.id !== id)
        this.$set(this.collectArea, 'content', newList)
        if (this.isLogin) {
          await toggleUserCollection('remove', id, this)
        }
      }
      if (!this.isLogin) {
        setStore('collectSymbol', this.collectSymbol)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language, // 语言
      plateList: state => state.common.plateList, // 板块列表
      activeSymbol: state => state.common.activeSymbol,
      isLogin: state => state.user.isLogin,
      activeTradeArea: state => state.common.activeTradeArea,
      currencyRateList: state => state.common.currencyRateList, // 折算货币列表
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      loginStep1Info: state => state.user.loginStep1Info,
      userId: state => state.user.loginStep1Info.userId,
      userInfo: state => state.user.loginStep1Info.userInfo,
      collectSymbol: state => state.home.collectSymbol, // 收藏标记
      symbolMap: state => state.home.symbolMap // 交易对map
    })
  },
  watch: {
    '$route' (to, from) {
      console.log(to)
    },
    filterMarketList (newVal) {
      // 查看更多按钮显示状态判断
      for (let i = 2; i < newVal.length; i++) {
        let item = newVal[i]
        if (item.content.length !== 0) {
          this.moreBtnShowStatus = true
          break
        } else {
          this.moreBtnShowStatus = false
        }
      }
    },
    currencyRateList (newVal) {
    },
    activeName (newVal) {
      console.log(newVal)
      this.tabChangeCount++
      _.forEach(this.newMarketList, (item, index) => {
        if (item.plateId === newVal) {
          this.activeIndex = index
          return false
        }
      })
      this.concatSocketParamsStr(this.activeIndex)
    },
    async language (newVal) {
      this.collectArea.area = this.$t('M.home_market_district')
      this.searchArea.area = this.$t('M.home_market_field_search')
      if (newVal) {
        await this.getHomeMarketByAjax()
      }
    },
    socketParamsStr (newVal, oldVal) {
      if (oldVal) {
        this.subscribeSocket('CANCEL', oldVal)
      }
      this.subscribeSocket('SUB', newVal)
    },
    isLogin (newVal) {
      if (!newVal) {
        let collectSymbol = JSON.parse(getStore('collectSymbol')) || {}
        this.setCollectData(collectSymbol)
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/index.scss";
  @import "../../../static/css/scss/Home/MarketListHome.scss";
  .market-list-box{
    width:100%;
    overflow: hidden;
    min-height:876px;
    >.loading-box{
      z-index: 999;
      position: absolute;
      width:100%;
      background-color: rgba(255,255,255,0.2);
      left:0;
      top:0;
    }
    /*表头*/
    .inner-box{
      width:1130px;
      margin: 78px auto;
      position: relative;
      >.search-box{
        position: absolute;
        top:8px;
        right:0;
        width:250px;
        height:31px;
        overflow: hidden;
        border:1px solid $mainColor;
      }
      &:before{
        content:'';
        width:70px;
        height:30px;
        background-color: $mainColor;
        position: absolute;
        right:0;
        top:9px;
        /*z-index: 1;*/
      }
      &:after{
        content:'';
        width:0px;
        height:0px;
        position: absolute;
        right:69px;
        top:14px;
        z-index: 1;
        border:10px solid transparent;
        border-right:10px solid $mainColor;
      }
      /*列表主要内容*/
      .tab-content{
        &.tab-height{
          /*height:1320px;*/
        }
        /*min-height:1255px;*/
        /*background-color: darkolivegreen;*/
        position: relative;
        /*单个交易区*/
        >.tab-item{
          >.inner-item-box{
            margin-bottom:20px;
            &.max-height {
              max-height:560px;
            }
            &.force-height{
              height:560px !important;
            }
            overflow: hidden;
          }
        }
        >.more-box{
          text-align: center;
          >.icon{
            color:#273C69;
            margin-bottom:20px;
          }
          >.el-button{
            background-color: #305794;
            border:none;
            color:#fff;
            font-size: 16px;
          }
        }
      }
    }
    &.night{
      background-color: $mainNightBgColor;
      color:$nightFontColor;
      >.search-box{

      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
    }
  }
</style>
