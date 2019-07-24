<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 关注拉黑 组件
-->
<template>
  <div
    class="focus-black-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的关注" name="first">
          <FocusList/>
        </el-tab-pane>
        <el-tab-pane label="我的黑名单" name="second">
          <BlackList/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import FocusList from './FocusList'
import BlackList from './BlackList'
export default {
  components: {
    FocusList,
    BlackList
  },
  // props,
  data () {
    return {
      activeName: 'first'
    }
  },
  created () {
    console.log(this.blackTabsStatus)
    if (this.blackTabsStatus) {
      this.activeName = 'second'
      // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
      // this.CHANGE_BLACK_TABS_STATUS_M(false)
    } else {
      // this.activeName = 'first'
    }
  },
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_BLACK_TABS_STATUS_M'
    ]),
    handleClick (tab, event) {
      console.log(tab, event)
    }
  },
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      // 商家信息页面拉黑成功后调转到个人中心拉黑tab栏状态
      blackTabsStatus: state => state.OTC.blackTabsStatus
    })
  },
  watch: {
    // blackTabsStatus (newValue) {
    //   console.log(newValue)
    //   if (!newValue) {
    //     this.activeName = 'first'
    //   }
    // }
  }
  // destroyed () {
  //   this.CHANGE_BLACK_TABS_STATUS_M(false)
  //   this.activeName = 'first'
  // }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../assets/CSS/index";

  .focus-black-box {
    width: 1105px;
    height: 758px;

    > .inner-box {
      width: 1105px;
    }

    /deep/ {
      .inner-box {
        .el-tabs {
          .el-tabs__header {
            padding-left: 30px !important;

            .el-tabs__item {
              padding: 0;
              margin: 2px 0 !important;
            }

            .el-tabs__item.is-top {
              &:last-child {
                margin-left: 30px !important;
              }
            }
          }
        }
      }
    }

    &.night {
      background-color: $mainContentNightBgColor;

      /deep/ {
        .inner-box {
          .el-tabs {
            .el-tabs__header {
              box-shadow: 0 2px 2px 0 rgba(20, 23, 37, 1);

              .el-tabs__item {
                border-left: 0 solid transparent;
              }

              .el-tabs__item.is-active {
                border-bottom: 2px solid $mainColor;
                border-left: 0 solid transparent;
                color: $mainColor;
                background-color: $mainContentNightBgColor;
              }

              .el-tabs__item:hover {
                border-left: 0 solid transparent;
                color: $mainColor;
                background-color: $mainContentNightBgColor;
              }
            }
          }
        }
      }
    }

    &.day {
      background-color: $mainColorOfWhite;

      /deep/ {
        .inner-box {
          .el-tabs {
            .el-tabs__header {
              border-bottom: 1px solid rgba(57, 66, 77, .1);

              .el-tabs__nav {
                background-color: transparent;
              }

              .el-tabs__item {
                border-left: 0 solid transparent;
              }

              .el-tabs__item.is-active {
                border-bottom: 2px solid $mainColor;
                border-left: 0 solid transparent;
                color: $mainColor;
                background-color: $mainColorOfWhite;
              }

              .el-tabs__item:hover {
                border-left: 0 solid transparent;
                color: $mainColor;
                background-color: $mainColorOfWhite;
              }
            }
          }
        }
      }
    }
  }
</style>
