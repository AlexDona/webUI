<template>
  <div
    class="invitation-promotion personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="invitation-promotion-header personal-height padding-left20 font-size16 line-height70 padding-left20">邀请推广</header>
    <div class="invitation-promotion-main min-height500 padding-left20 margin-top5">
      <!--推广信息-->
      <div class="extension-info">
        <header class="extension-info-header line-height50">推广信息</header>
        <div class="extension-info-content">
          推广信息内容
        </div>
      </div>
      <!--推广统计-->
      <div class="extension-statistics">
        <header class="extension-statistics-header line-height50">推广统计</header>
        <div class="extension-statistics-content">
          <el-table
            :data="extensionList"
            style="width: 100%"
          >
            <el-table-column
              prop="userUID"
              label="用户UID"
            >
            </el-table-column>
            <el-table-column
              prop="loginName"
              label="登录名"
            >
            </el-table-column>
            <el-table-column
              prop="registerTime"
              label="注册时间"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="certification"
              label="高级认证"
            >
            </el-table-column>
            <el-table-column
              prop="refereeUID"
              label="直接推荐人UID"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--奖励记录-->
      <div class="award-record">
        <header class="award-record-header line-height50">奖励记录</header>
        <div class="award-record-content">
          <el-table
            :data="awardList"
            style="width: 100%"
          >
            <el-table-column
              prop="type"
              label="奖励类型"
            >
            </el-table-column>
            <el-table-column
              prop="currency"
              label="币种"
            >
            </el-table-column>
            <el-table-column
              prop="count"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      // 推广统计
      extensionList: [
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        }
      ],
      // 奖励记录
      awardList: [
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        }
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/InvitingPromotion.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/InvitingPromotionDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/InvitingPromotionNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/InvitingPromotion.scss";
  .invitation-promotion{
    >.invitation-promotion-main{
      /*推广信息*/
      >.extension-info{
        min-height: 200px;
        >.extension-info-header{
          height: 50px;
        }
        >.extension-info-content{
          min-height: 130px;
        }
      }
      /*推广统计*/
      >.extension-statistics{
        min-height: 200px;
        >.extension-statistics-header{
          height: 50px
        }
        >.extension-statistics-content{
          min-height: 130px;
        }
      }
      /*奖励记录*/
      >.award-record{
        min-height: 200px;
        >.award-record-header{
          height: 50px
        }
        >.award-record-content{
          min-height: 130px;
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .invitation-promotion-header,
      .invitation-promotion-main{
        background-color: rgba(37, 46, 63, 1);
        .extension-info-header,
        extension-info-content {
          background-color: rgba(37, 46, 63, 1);
        }
        .extension-statistics-header,
        extension-statistics-content {
          background-color: rgba(37, 46, 63, 1);
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .invitation-promotion-header,
      .invitation-promotion-main {
        background-color: #CCCCCC;
        .extension-info-header,
        extension-info-content {
          background-color: #ccc;
        }
        .extension-statistics-header,
        extension-statistics-content {
          background-color: #ccc;
        }
      }
    }
  }
</style>
