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
        <router-link to="/">
          <span class="type">【{{item.typeName}}】</span>
          <span>{{item.title}}</span>
        </router-link>
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
import {mapState} from 'vuex'
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
  created () {
    this.noticeList = [
      {
        id: 0, // 跳转id
        type: 0, // 0:新闻 1:公告
        typeName: '新闻资讯', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线' // 标题
      },
      {
        id: 1, // 跳转id
        type: 1, // 0:新闻 1:公告
        typeName: '活动公告', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线1' // 标题
      },
      {
        id: 2, // 跳转id
        type: 0, // 0:新闻 1:公告
        typeName: '新闻资讯', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线2' // 标题
      }
    ]
    this.getNewsNoticeList()
    this.timer = setInterval(this.autoPlay, 3000)
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 获取新闻公告列表
    async getNewsNoticeList () {
      const params = {
        partnerId: this.partnerId,
        language: this.language
      }
      const data = await getAllNewsNoticeListForHomePage(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.noticeList = data.data.data
        console.log(this.noticeList)
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
      partnerId: state => state.common.partnerId,
      language: state => state.common.language
    })
  },
  watch: {
    language () {
      this.getNewsNoticeList()
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
        >a{
          >.type {
            color:$mainColor;
          }
          color:#8B8E92;
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
