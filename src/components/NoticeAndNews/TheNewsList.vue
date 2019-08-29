<!--
  author: zhaoxinlei
  create: 20190806
  description: 当前页面为 新版新闻列表页面
-->
<template lang="pug">
  .news-container(:class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }")
    .inner-box
      .header
        .left
          ul.titles()
            li.title.cursor-pointer(
              v-for="title in fifthNewsTypeList"
              @click="toggleTitle(title)"
              :class="{active: activeTitle.id == title.id}"
            ) {{title.name}}
            //  超过5个列表的显示
            .more-types(
              @mouseenter="toggleShowMoreType(true)"
              @mouseleave="toggleShowMoreType(false)"
              v-show="lastTypeList.length"
            )
              span.active-title(
                :class="{active: isMoreTypesClick}"
              ) {{isMoreTypesClick ? activeTitle.name : '更多'}}
                Iconfont.iconfont(icon-name="icon-xiala")
              el-collapse-transition
                ul.titles(v-show="isShowMoreTitles")
                  li.title.cursor-pointer(
                    v-for="title in lastTypeList"
                    @click="toggleTitle(title, true)"
                    :class="{active: activeTitle.id == title.id}"
                  ) {{title.name}}
        .right
          // 请输入关键词搜索
          el-input(
            type="text"
            v-model="keyword"
            @keyup.enter.native="filterByKeyWord"
            :placeholder="$t('M.news_search_placeholder_label')"
          )
            Iconfont.iconfont(
              icon-name="icon-sousuo"
              slot="prefix"
            )
            template(
              slot="append"
            )
              // 搜索
              el-button(@click="filterByKeyWord") {{$t('M.news_search_label')}}
      .content
        .news()
          li.content-item.cursor-pointer(
            v-for="(item,index) in news"
            :key="index"
          )
            router-link(
              :to="`/${$routes_X.newsItem}/${item.id}`"
              class="content-item-link"
            )
              .right
                p.top {{item.title}}
                p.bottom
                  span.date {{item.createTime}}
        el-pagination(
          v-show="news.length"
          background
          layout="prev, pager, next"
          :current-page="pageNum"
          :page-count="totalPages"
          @current-change="changeCurrentPage"
        )
</template>
<script>
import {getAllNewsTypeList, getNewsNoticeList} from '../../utils/api/home'

export default {
  name: 'news-container',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      newsTypeList: [],
      activeTitle: {},
      // 当前新闻类型id
      newsTypeId: 1,
      news: [],
      // 是否更多被点击
      isMoreTypesClick: false,
      // 公告总条数
      totalPages: 0,
      pageSize: 15,
      // 当前页
      pageNum: 1,
      // 搜索关键字
      keyword: '',
      isShowMoreTitles: false
    }
  },
  async created () {
    await this.resetNewTypeList()
    await this.getNewsNoticeList()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    toggleShowMoreType (status) {
      this.isShowMoreTitles = status
    },
    // 获取新闻公告列表
    getNewsNoticeList: _.debounce(async function () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        language: this.$language_S_X,
        newsTypeId: this.newsTypeId,
        title: this.keyword
      }
      const data = await getNewsNoticeList(params)
      if (!data) return false
      const targetData = _.get(data, 'data')
      this.news = _.get(targetData, 'list') || []
      this.pageNum = _.get(targetData, 'pageNum')
      this.totalPages = _.get(targetData, 'pages')
    }, 500),
    changeCurrentPage (e) {
      this.pageNum = e
      this.getNewsNoticeList()
    },
    // 获取所有新闻类型
    async getAllNewsTypeList () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getAllNewsTypeList(params)
      if (!data) return false
      const targetList = _.get(data, 'data')
      console.log(targetList)
      if (!targetList.length) return false
      this.newsTypeList = targetList
      return true
    },
    async resetNewTypeList () {
      if (!await this.getAllNewsTypeList()) return
      if (this.newsTypeActiveName) {
        this.activeName = this.newsTypeActiveName
        this.changeTab({name: this.activeName})
      } else {
        // this.activeTitle = this.$getStore('targetTitle', 'json') || _.get(this.newsTypeList, '[0]')
        this.newsTypeId = this.$getStore('newsTypeId') || _.get(this.newsTypeList, '[0].id')
        this.activeTitle = this.newsTypeList.filter(item => item.id == this.newsTypeId)[0] || this.newsTypeList[0]
        this.activeName = this.newsTypeId
      }
    },
    toggleTitle (title, more) {
      this.isMoreTypesClick = more ? true : false
      this.activeTitle = title
      this.pageNum = 1
      this.getNewsNoticeList()
    },
    // 搜索关键字
    filterByKeyWord: _.debounce(async function () {
      this.pageNum = 1
      await this.getNewsNoticeList()
    }, 500)
  },
  // filters: {},
  computed: {
    fifthNewsTypeList () {
      return this.newsTypeList.slice(0, 5)
    },
    lastTypeList () {
      return this.newsTypeList.slice(5)
    }
  },
  watch: {
    async $language_S_X () {
      await this.resetNewTypeList()
      await this.getNewsNoticeList()
    },
    activeTitle (New) {
      this.newsTypeId = _.get(New, 'id')
      this.$setStore('newsTypeId', this.newsTypeId || '')
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .news-container
    box-sizing border-box
    padding 120px 0
    >.inner-box
      margin 0 auto
      width 1300px
      >.header
        height 60px
        line-height 60px
        display flex
        padding 0 38px
        justify-content space-between
        >.left
          >.titles
            display flex
            >.title
              margin-right 30px
              font-size 18px
              &.active
                color S_main_color
            >.more-types
              position relative
              &:hover
                >.active-title
                  > .iconfont
                    transform rotate(180deg)
              span.active-title
                font-size 18px
                &.active
                  color S_main_color
                > .iconfont
                  transition all .2s
              >.titles
                position absolute
                top 47px
                left 50%
                transform translateX(-50%)
                .title
                  height 36px
                  line-height 36px
                  padding 0 10px
                  font-size 14px
                  box-sizing border-box
                  white-space nowrap
        >.right
          line-height 60px
          /deep/
            .el-input__inner
              height 30px
              width 220px
              font-size 12px
              &::-webkit-input-placeholder
                color #66718f
            .el-input__prefix
              top 5px
            .el-input-group__append
              border none
      >.content
        margin-top 17px
        > .news
          min-height 750px
          > .content-item
            height 59px
            padding 0 40px
            line-height 59px
            text-align left
            &:last-child
              border-color transparent
            > .content-item-link
              display inline-block
              width 100%
              height fit-content
              > .left,
              > .right
                display inline-block
              > .left
                width 110px
                height 60px
                margin-right 20px
                text-align center
                vertical-align top
                > .top
                  height 25px
                  line-height 25px
                > .bottom
                  float right
                  height 60px
                  font-size 26px
                  line-height 60px
              > .right
                display flex
                width 100%
                font-weight 400
                > .top
                  width 100%
                  margin-bottom 10px
                  overflow hidden
                  font-weight bold
                  font-size 14px
                  text-overflow ellipsis
                  white-space nowrap
                > .middle
                  display -webkit-box
                  height 40px
                  margin-bottom 5px
                  overflow hidden
                  font-weight 400
                  font-size 12px
                  line-height 20px
                  text-overflow ellipsis
                  -webkit-box-orient vertical
                  -webkit-line-clamp 3
                > .bottom
                  flex 0 0 112px
                  font-weight 400
                  font-size 12px
                  white-space nowrap
                  > .author
                    margin-right 20px
          >.content-item
            &:last-child
              border-bottom none !important
    &.night
      >.inner-box
        >.header
          background-color #1c1f32
          >.left
            >.titles
              >.title
                color #C1D2F3
                &.active
                  color S_main_color
              >.more-types
                span.active-title
                  color #C1D2F3
                  &.active
                    color S_main_color
                >.titles
                  background-color #2C314D
                  box-shadow 0 3px 6px 0 rgba(32,35,54,1)
                  .title
                    color #C1D2F3
                    &.active,
                    &:hover
                      color S_main_color
                      background-color #262A42
          >.right
            /deep/
              .el-input__inner
                background-color #1c1f32
                border 1px solid S_main_color
                color S_main_color
              .el-input__prefix
                .iconfont
                  color #7D90AC
              .el-input-group__append
                background-color S_main_color
                border none
                color #fff
        >.content
          > .news
            background-color #1c1f32
            > .content-item
              border-bottom 1px solid #292d47
              &:last-child
                border-color transparent
              > .content-item-link
                width 100%
                height fit-content
                > .left
                  > .top
                    background rgba(149, 160, 184, 1)
                  > .bottom
                    color #fff
                    background rgba(31, 144, 234, 1)
                > .right
                  color #c1d2f3
              .content-item:last-child
                border-bottom none !important
    &.day
      >.inner-box
        >.header
          background-color #fff
          box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.1)
          >.left
            >.titles
              >.title
                color #7D90AC
                &.active
                  color S_main_color
              >.more-types
                span.active-title
                  color #7D90AC
                  &.active
                    color S_main_color
                >.titles
                  background-color #E5E5E5
                  box-shadow 0 3px 6px 0 rgba(32,35,54,0.24)
                  .title
                    color #333
                    &.active,
                    &:hover
                      color #fff
                      background-color #C5C5C5
          >.right
            /deep/
              .el-input__inner
                background-color #fff
                border 1px solid S_main_color
                color S_main_color
              .el-input__prefix
                .iconfont
                  color #7D90AC
              .el-input-group__append
                background-color S_main_color
                border none
                color #fff
        >.content
          > .news
            background-color #fff
            box-shadow 0 2px 6px 0 rgba(0, 0, 0, 0.1)
            > .content-item
              border-bottom 1px solid #CFD5DF
              &:last-child
                border-color transparent
              > .content-item-link
                width 100%
                height fit-content
                > .left
                  > .top
                    background rgba(149, 160, 184, 1)
                  > .bottom
                    color #fff
                    background rgba(31, 144, 234, 1)
                > .right
                  color #333
              .content-item:last-child
                border-bottom none !important
</style>
