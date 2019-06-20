<!--
  author: zhaoxinlei
  update: 20190619
  description: 当前组件为 首页公告 组件
-->
<template>
  <div
    class="notice-box home"
    :class="{close:!noticeCloseVisible}"
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
        <router-link :to="`/${$routes_X.newsItem}/${item.id}`">
        <span
            class="cursor-pointer"
            @click="jumpToNewsDetail(item)"
          >
            <span class="type">【{{ item.typeName }}】</span>
            <span>{{ item.title }}</span>
          </span>
        </router-link>
      </div>
    </div>
    <div
      class="close-btn"
      @click="closeNotice"
    >
      <Iconfont
        class="font-size22 iconfont"
        iconName="icon-cha-"
      />
    </div>
  </div>
</template>
<script>
import {getPartNewsNotices} from '../../utils/api/home'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  mapState,
  mapMutations
} from 'vuex'

export default {
  // components: {
  // },
  // props,
  data () {
    return {
      noticeList: [], // 新闻（公告）列表
      animate: false,
      timer: null,
      // 是否关闭
      closeStatus: false
    }
  },
  async created () {
    this.noticeList = []
    this.getNewsNoticeList()
  },
  // mounted () {},
  beforeDestroy () {
    clearInterval(this.timer)
  },
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_NEWS_DETAIL_JUMP_ID',
      'CHANGE_NOTICE_VISIBLE'
    ]),
    jumpToNewsDetail (e) {
      this.CHANGE_NEWS_DETAIL_JUMP_ID(e.id)
      this.$goToPage(`/${this.$routes_X.news}`)
    },
    // 获取新闻公告列表
    async getNewsNoticeList () {
      clearInterval(this.timer)
      const params = {
        language: this.$language_S_X
      }
      const data = await getPartNewsNotices(params)
      if (!data) return false
      this.noticeList = getNestedData(data, 'data') || []
      this.timer = setInterval(this.autoPlay, 4000)
    },
    // 关闭组件
    closeNotice () {
      this.CHANGE_NOTICE_VISIBLE(false)
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
  // filter: {},
  computed: {
    ...mapState({
      noticeCloseVisible: state => state.home.noticeCloseVisible
    })
  },
  watch: {
    async $language_S_X (newVal) {
      if (newVal) {
        await this.getNewsNoticeList()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index';

  .notice-box {
    position: relative;
    top: 0;
    width: 100%;
    height: 30px;
    overflow: hidden;
    line-height: 30px;
    color: #8b8e92;
    background-color: #0a1b2f;
    transition: all 2s;

    &.close {
      display: none;
    }

    .inner-box {
      position: relative;
      padding: 0 30px;

      &.animate {
        margin-top: -30px;
        transition: all .5s;
      }

      > .item {
        text-align: center;
        color: #fff;

        > a {
          /* color:#8B8E92; */
          color: #fff;

          > .type {
            color: $mainColor;
          }
        }
      }
    }

    > .close-btn {
      position: absolute;
      top: 0;
      right: 10px;
      width: 30px;
      height: 30px;

      .iconfont {
        width: 30px;
        height: 30px;
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
