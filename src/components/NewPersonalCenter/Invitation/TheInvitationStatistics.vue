<!--
  author: zhaoxinlei
  create: 20190626
  description: 当前组件为 个人中心 邀请推广 组件 内的 推广统计 组件
-->
<template lang="pug">
  .the-invitation-statistics(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    .header
      // 推广统计
      .left {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_statistics') }}
      .right
        el-select(
          v-model="activeName"
          :no-data-text="$t('M.comm_no_data')"
          :placeholder="$t('M.comm_please_choose')"
          @change="updateGeneralize"
          popper-class="invitation-statistics-select"
        )
          el-option(
            v-for="item in generalizeOptions"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          )
    .content
      el-table.statistics(
        :data="statistics"
        :empty-text="$t('M.comm_no_data')"
      )
        // 用户UID
        el-table-column(
          :label="$t('M.user_invite_user_uid')"
          width="90"
        )
          template(slot-scope="s")
            div {{s.row.showId}}
        // 登录名
        el-table-column(
          :label="$t('M.user_invite_login_name')"
        )
          template(slot-scope="s")
            div {{s.row.userName}}
        // 注册时间
        el-table-column(
          :label="`${$t('M.comm_register_time')}${$t('M.comm_time')}`"
          width="140"
        )
          template(slot-scope="s")
            div {{s.row.regTime}}
        // 姓名
        el-table-column(
          :label="`${$t('M.comm_name')}`"
          width="90"
        )
          template(slot-scope="s")
            div {{s.row.realname}}
        // 高级认证
        el-table-column(
          :label="`${$t('M.user_senior_certification')}`"
        )
          template(slot-scope="s")
            div(v-if="s.row.advancedAuth == 'waitVeritfy'") {{$t('M.user_invite_audit')}}
            div(v-if="s.row.advancedAuth == 'pass'") {{$t('M.user_invite_already_passed')}}
            div(v-if="s.row.advancedAuth == 'notPass'") {{$t('M.user_invite_not_pass')}}
        // 当奖励类型为first时显示直接推荐UID 否则显示间接推荐UID
        el-table-column(
          :label="inviterLabelText"
        )
          template(slot-scope="s")
            div {{s.row.inviter}}
        el-table-column(
          :label="$t('M.comm_state')"
          align="right"
          width="90"
        )
          template(slot-scope="s")
            div {{s.row.giveStatus === 'PUBLISH' ? $t('M.user_invite_issued'):$t('M.user_invite_noIssued')}}
      el-pagination(
        background
        v-show="statistics.length"
        layout="prev, pager, next"
        :current-page="currentNum"
        :page-count="total"
        @current-change="changeCurrentPage"
      )
</template>
<script>
import {mapState} from 'vuex'
export default {
  name: 'the-invitation-statistics',
  // mixins: [],
  // components: {},
  props: {},
  data () {
    return {
      // 默认显示第一个
      activeName: 'first',
      generalizeOptions: [
        {
          value: 'first',
          label: 'M.user_invite_direct'
        },
        {
          value: 'second',
          label: 'M.user_invite_indirect'
        }
      ],
      currentNum: 1,
      total: 0
    }
  },
  // async created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    updateGeneralize (e) {
      console.log(e, this.activeName)
      this.$emit('getUserPromotionList', {
        currentNum: this.currentNum,
        type: this.activeName
      })
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentNum = pageNum
      this.updateGeneralize()
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      invitation_S: state => state.user.invitation_S
    }),
    statistics () {
      return _.get(this.invitation_S, 'page.list') || []
    },
    inviterLabelText () {
      return this.activeName === 'first' ? `${this.$t('M.user_invite_direct_referrer')}UID` : `${this.$t('M.actionCenter_Indirect_recommend')}UID`
    }
  },
  watch: {
    statistics (New) {
      console.log(New)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../../assets/CSS/index.styl'
  .the-invitation-statistics
    background-color #1c1f32
    margin-top 10px
    .header
      height 40px
      line-height 40px
      padding 0 29px
      display flex
      justify-content space-between
      >.left
        color S_main_color
        font-size 16px
      >.right
        /deep/
          .el-select
            height 26px
            min-width 120px
            max-width 170px
            .el-input__inner
              height 26px
              background-color transparent
              border-color S_main_color
              color #fff
              border-radius 2px
    .content
      padding 10px 29px 30px
      /deep/
        .statistics
          &.el-table
            background-color #1c1f32
            th
              background-color #1c1f32
              color #A9BED4
              &.is-leaf
                border-bottom 1px solid #2D3651
            tr
              background-color transparent
              &:hover
                td
                  background-color transparent
              td
                border-bottom none
                color #A9BED4
                font-size 12px
    &.night
      .header
        >.left
          color S_main_color
        >.right
          /deep/
          .el-select
            .el-input__inner
              background-color transparent
              border-color S_main_color
              color #fff
        .content
          /deep/
          .statistics
            &.el-table
              background-color #1c1f32
              th
                background-color #1c1f32
                color #A9BED4
                &.is-leaf
                  border-bottom 1px solid #2D3651
              tr
                background-color transparent
                &:hover
                  td
                    background-color transparent
                td
                  border-bottom none
                  color #A9BED4
    &.day
      background-color #fff
      box-shadow 0 0 6px #cfd5df
      .header
        >.right
          /deep/
            .el-select
              .el-input__inner
                background-color transparent
                border-color S_main_color
                color #333
      >.content
        /deep/
          .statistics
            &.el-table
              background-color #fff
              th
                background-color #fff
                color #6F798A
                &.is-leaf
                  border-bottom 1px solid #CFD5DF
              tr
                background-color transparent
                &:hover
                  td
                    background-color transparent
                td
                  border-bottom none
                  color #333
</style>
