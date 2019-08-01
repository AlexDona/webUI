<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 拉黑 组件
-->
<template lang="pug">
  .black-box(
    :class="{'day':theme == 'day','night':theme == 'night' }"
  )
    .inner-box
      .tab-two
        el-table(
          :data="blackList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
        )
          <!--用户UID-->
          el-table-column(
            :label="$t('M.focus_black_table3')"
            prop="showId"
          )
          <!--昵称-->
          el-table-column(
            :label="$t('M.focus_black_table4')"
            prop="nickName"
          )
          <!--单数/成交率-->
          el-table-column(
            :label="$t('M.focus_black_table5')"
            width="240"
          )
            template(slot-scope = "s")
              div {{s.row.tradeTimes}}/{{s.row.completeRate}}%
          <!--拉黑时间-->
          el-table-column(
            :label="$t('M.focus_black_table6')"
            prop="createTime"
          )
          <!--操作-->
          el-table-column(
            :label="$t('M.otc_index_operate')"
            align="right"
            width="150"
          )
            template(slot-scope = "s")
              <!--解除-->
              .operation-text.cursor-pointer(
                @click="confirmUnBlackList(s.row.toId)"
              ) {{$t('M.focus_black_title4')}}
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
  getBlackListsAJAX,
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
      // 黑名单列表
      blackList: []
    }
  },
  created () {
    this.getBlackLists()
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
      this.getBlackLists()
    },
    // 2 确认解除黑名单接口
    confirmUnBlackList: _.debounce(async function (id) {
      let param = {
        toId: id,
        // 此操作进行时的关系：“1”关注，“2”拉黑
        relation: '2'
      }
      const data = await cancelFocusAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      this.currentPage = 1
      // 重新刷新列表
      this.getBlackLists()
    }, 500),
    // 3 获得黑名单列表
    async getBlackLists () {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const data = await getBlackListsAJAX(param)
      if (!data) return false
      // 数据返回后的逻辑
      // 数据赋值
      this.blackList = getNestedData(data, 'data.list')
      // 总页数赋值
      this.totalPages = getNestedData(data, 'data.pages') - 0
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  }
  // watch: {},
  // destroyed () {}
}
</script>
<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .black-box
    .inner-box
      width 1105px
      .tab-two
        padding 0 30px
        .operation-text
          height 24px
          color S_main_color
      /deep/
        .el-table
          font-size 12px
          .el-table__empty-text
            line-height 600px
          td
            padding 8px 0
          .el-table__header
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
        .tab-two
          .el-table
            .el-table__body
              td
                border-bottom 0
    &.night
      /deep/
        .el-table
          color S_night_main_text_color
          background-color S_night_main_bg
          .el-table__header
            th.is-leaf
              border-bottom 1px solid S_color1
            thead
              color S_night_main_text_color
          tr,th
            background-color S_night_main_bg
          .el-table__body
            tr:hover
              td
                background-color S_night_main_bg !important
    &.day
      /deep/
        .el-table
          color S_day_main_text_color
          background-color S_day_bg
          .el-table__header
            th.is-leaf
              border-bottom 1px solid rgba(57, 66, 77, .1)
            thead
              color S_color2
          tr,th
            background-color S_day_bg
          .el-table__body
            tr:hover
              td
                background-color S_day_bg !important
</style>
