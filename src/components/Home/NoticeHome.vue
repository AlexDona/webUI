<template>
  <!--首页公告-->
  <div
    class="notice-box home"
    :class="{close:this.closeStatus}"
  >
    <div
      class="inner-box"
      :class="{'animate':this.animate}"
    >
      <div
        class="item"
        v-for="(item,index) in noticeList"
        :key="index"
      >
        <span
          class="cursor-pointer"
          @click="jumpToNewsDetail(item)"
        >
          <span class="type">【{{ $t(item.typeName) }}】</span>
          <span>{{ $t(item.title) }}</span>
        </span>
      </div>
    </div>
    <div
      class="close-btn"
      @click="closeNotice"
    >
      <IconFont
        class="font-size22 iconfont"
        iconName="icon-cha-"
      />
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import IconFont from '../Common/IconFontCommon'
import {getAllNewsNoticeListForHomePage} from '../../utils/api/home'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {createNamespacedHelpers, mapState} from 'vuex'
const {mapMutations} = createNamespacedHelpers('footerInfo')

export default {
  components: {
    IconFont
  },
  // props,
  data () {
    return {
      noticeList: [], // 新闻（公告）列表
      animate: false,
      timer: null,
      closeStatus: false // 是否关闭
    }
  },
  async created () {
    if (this.language) {
      await this.getNewsNoticeList()
    }
    this.noticeList = [
      // {
      //   id: 0, // 跳转id
      //   type: 0, // 0:新闻 1:公告
      //   typeName: 'M.home_market_text1', // type=0:'新闻资讯' type=1:'活动公告'
      //   title: 'M.home_market_text3' // 标题 fuc火热上线
      // },
      // {
      //   id: 1, // 跳转id
      //   type: 1, // 0:新闻 1:公告
      //   typeName: 'M.home_market_text1', // type=0:'新闻资讯' type=1:'活动公告'
      //   title: 'M.home_market_text4' // 标题 fuc火热上线1
      // },
      // {
      //   id: 2, // 跳转id
      //   type: 0, // 0:新闻 1:公告
      //   typeName: 'M.home_market_text1', // type=0:'新闻资讯' type=1:'活动公告'
      //   title: 'M.home_market_text5' // 标题 fuc火热上线2
      // }
    ]
    this.timer = setInterval(this.autoPlay, 4000)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_NEWS_DETAIL_JUMP_ID'
    ]),
    jumpToNewsDetail (e) {
      this.CHANGE_NEWS_DETAIL_JUMP_ID(e.id)
      this.$router.push({'path': '/NewsAndNoticeList'})
    },
    // 获取新闻公告列表
    async getNewsNoticeList () {
      const params = {
        language: this.language
      }
      const data = await getAllNewsNoticeListForHomePage(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.noticeList = data.data.data
      }
    },
    // 关闭组件
    closeNotice () {
      this.closeStatus = true
    },
    autoPlay () {
      this.animate = true
      setTimeout(() => {
        this.noticeList.push(this.noticeList[0])
        this.noticeList.shift()
        this.animate = false
      }, 500)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language
    })
  },
  watch: {
    async language (newVal) {
      if (newVal) {
        await this.getNewsNoticeList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../static/css/scss/index';
  .notice-box{
    height:30px;
    width:100%;
    overflow: hidden;
    background-color: #0a1b2f;
    color:#8b8e92;
    line-height: 30px;
    transition: all 2s;
    top:0;
    &.close{
      display:none;
    }
    .inner-box{
      padding:0 30px;
      position: relative;
      &.animate{
        transition: all .5s;
        margin-top: -30px;
      }
      >.item{
        text-align: center;
        color:#fff;

        >a{
          >.type {
            color:$mainColor;
          }
          /*color:#8B8E92;*/
          color:#fff;
        }
      }
    }
    >.close-btn{
      position: absolute;
      right:10px;
      top:0;
      width:30px;
      height:30px;
      .iconfont{
        cursor:pointer;
        color:#fff;
        width:30px;
        height:30px;
      }
    }
  }
</style>
