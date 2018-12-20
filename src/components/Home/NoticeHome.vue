<template>
  <!--首页公告-->
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
        <router-link :to="`NewsAndNoticeItem/${item.id}`">
        <span
            class="cursor-pointer"
            @click="jumpToNewsDetail(item)"
          >
            <span class="type">【{{ $t(item.typeName) }}】</span>
            <span>{{ $t(item.title) }}</span>
          </span>
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
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
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
    this.noticeList = [
    ]
    if (this.language) {
      await this.getNewsNoticeList()
      this.timer = setInterval(this.autoPlay, 4000)
    }
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
      this.$router.push({'path': '/NewsAndNoticeCenter'})
    },
    // 获取新闻公告列表
    async getNewsNoticeList () {
      const params = {
        language: this.language
      }
      const data = await getAllNewsNoticeListForHomePage(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.noticeList = getNestedData(data, 'data.data')
      }
    },
    // 关闭组件
    closeNotice () {
      this.$store.commit('home/CHANGE_NOTICE_VISIBLE', false)
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
      language: state => state.common.language,
      noticeCloseVisible: state => state.home.noticeCloseVisible
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
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index';

  .notice-box {
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
