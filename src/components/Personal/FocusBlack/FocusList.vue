<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 关注 组件
-->
<template lang="pug">
  .focus-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
  )
    .inner-box
      .tab-one
        el-table(
          :data="focusList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
        )
          <!--名字-->
          el-table-column(label="")
            template(slot-scope = "s")
              .name
                img(
                  v-show="s.row.type === 'MERCHANT'"
                  src="../../../assets/develop/shangjia.png"
                  class="merchant-icon"
                  :title="$t('M.otc_merchant')"
                )
                span.cursor-pointer(
                  @click="jumpMerchantInfoPage(s.row.toId)"
                )
                  span(
                    v-if="s.row.nickName"
                  ) {{s.row.nickName}}
                  span(
                    v-else
                  ) {{s.row.realName}}
          <!--是否高级认证-->
          el-table-column(label="")
            template(slot-scope = "s")
              <!--已高级认证-->
              div(
                v-show="s.row.advancedAuth === 'pass'"
              ) {{$t('M.focus_black_identity4')}}
                <!--待审核-->
              div(
                v-show="s.row.advancedAuth === 'waitVeritfy'"
              ) {{$t('M.user_invite_audit')}}
              <!--未高级认证-->
              div(
                v-show="s.row.advancedAuth === 'notPass'"
              ) {{$t('M.user_advanced_authentication_tips1')}}
          <!--注册时间-->
          el-table-column(label="")
            template(slot-scope = "s")
              div {{$t('M.focus_black_time1')}}:{{s.row.regTime}}
          <!--操作-->
          el-table-column(
            label=""
            align="right"
            width="200"
          )
            template(slot-scope = "s")
              <!--取消关注-->
              .operation-text.cursor-pointer(
                @click="confirmCancelFocus(s.row.toId)"
              ) {{$t('M.focus_black_title3')}}
      <!--分页-->
      .page
        el-pagination(
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-count="totalPages"
          @current-change="changeCurrentPage"
          v-show="totalPages - 1 > 0"
        )
</template>
<script>
import {mapState} from 'vuex'
import {
  getFocusListsAJAX,
  cancelFocusAJAX
} from '../../../utils/api/focusBlack'
import {
  getNestedData
} from '../../../utils/commonFunc'
export default {
  components: {},
  // props,
  data () {
    return {
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 每页返回多少条
      pageSize: 15,
      // 关注列表
      focusList: []
    }
  },
  created () {
    this.getFocusLists()
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    // 1 翻页
    changeCurrentPage (pageNum) {
      this.currentPage = pageNum
      // 重新刷新列表
      this.getFocusLists()
    },
    // 2 确认取消关注接口
    confirmCancelFocus: _.debounce(async function (id) {
      let param = {
        toId: id,
        // 此操作进行时的关系：“1”关注，“2”拉黑
        relation: '1'
      }
      const data = await cancelFocusAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      this.currentPage = 1
      // 重新刷新列表
      this.getFocusLists()
    }, 500),
    // 3 获得关注列表
    async getFocusLists () {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const data = await getFocusListsAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      // 数据赋值
      this.focusList = getNestedData(data, 'data.list')
      // 总页数赋值
      this.totalPages = getNestedData(data, 'data.pages') - 0
    },
    // 4 昵称跳转
    jumpMerchantInfoPage (userId) {
      if (userId) {
        this.$goToPage(`/${this.$routes_X.OTCViewMerchantInfo}`, {userId: userId})
      }
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  }
  // watch: {}
}
</script>
<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .focus-box
    .inner-box
      .tab-one
        padding 0 30px
        min-height 650px
        .name
          color S_main_color
          .merchant-icon
            display inline-block
            width 14px
            height 19px
            vertical-align top
            cursor pointer
        .operation-text
          color S_main_color
      /deep/
        .el-table
          font-size 12px
          .el-table__empty-text
            line-height 600px
          td
            padding 8px 0
          .el-table__header
            display none
            tr
              th
                .cell
                  padding-right 0
                  padding-left 0
          .el-table__body
            tr
              td
                .cell
                  padding-right 0
                  padding-left 0
    &.night
      background-color S_night_main_bg
      /deep/
        .el-table
          color S_night_main_text_color
          background-color S_night_main_bg
          tr,th
            background-color S_night_main_bg
          .el-table__body
            tr:hover
              td
                background-color S_night_main_bg !important
            td
              border-bottom 1px solid S_color1
    &.day
      background-color S_day_bg
      /deep/
        .el-table
          color S_day_main_text_color
          background-color S_day_bg
          tr,th
            background-color S_day_bg
          .el-table__body
            tr:hover
              td
                background-color S_day_bg !important
            td
              border-bottom 1px solid rgba(45, 54, 81, .1)
</style>
