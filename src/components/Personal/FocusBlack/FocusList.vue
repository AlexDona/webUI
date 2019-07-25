<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 关注 组件
-->
<template>
  <div
    class="focus-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="tab-one">
        <el-table
          :data="focusList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
        >
          <!--名字-->
          <el-table-column
            label=""
          >
            <template slot-scope = "s">
              <div class="name">
                <img
                  v-show="s.row.type === 'MERCHANT'"
                  src="../../../assets/develop/shangjia.png"
                  class="merchant-icon"
                  :title="$t('M.otc_merchant')"
                >
                <span
                  @click="jumpMerchantInfoPage(s.row.toId)"
                  class="cursor-pointer"
                >
                  {{s.row.nickName}}
                </span>
              </div>
            </template>
          </el-table-column>
          <!--是否高级认证-->
          <el-table-column
            label=""
          >
            <template slot-scope = "s">
              <div v-show="s.row.advancedAuth === 'pass'">
                <!--已高级认证-->
                {{$t('M.focus_black_identity4')}}
              </div>
              <div v-show="s.row.advancedAuth === 'waitVeritfy'">
                <!--待审核-->
                {{$t('M.user_invite_audit')}}
              </div>
              <div v-show="s.row.advancedAuth === 'notPass'">
                <!--未高级认证-->
                {{$t('M.user_advanced_authentication_tips1')}}
              </div>
            </template>
          </el-table-column>
          <!--注册时间-->
          <el-table-column
            label=""
          >
            <template slot-scope = "s">
              <div>
                {{$t('M.focus_black_time1')}}:{{s.row.regTime}}
              </div>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column
            label=""
            align="right"
            width="200"
          >
            <template slot-scope = "s">
              <div
                class="operation-text cursor-pointer"
                @click="confirmCancelFocus(s.row.toId)"
              >
                <!--取消关注-->
                {{$t('M.focus_black_title3')}}
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="focusList.length - 15 > 0"
            layout="prev, pager, next"
            :current-page="currentPage"
            :page-count="totalPages"
            @current-change="changeCurrentPage"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
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
      console.log(pageNum)
      this.currentPage = pageNum
      // 重新刷新列表
      this.getFocusLists()
    },
    // 2 确认取消关注接口
    async confirmCancelFocus (id) {
      console.log(id)
      let param = {
        toId: id,
        // 此操作进行时的关系：“1”关注，“2”拉黑
        relation: '1'
      }
      const data = await cancelFocusAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      this.currentPage = 1
      // 重新刷新列表
      this.getFocusLists()
    },
    // 3 获得关注列表
    async getFocusLists () {
      let param = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      const data = await getFocusListsAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 数据赋值
      this.focusList = getNestedData(data, 'data.list')
      console.log(this.focusList)
      // 总页数赋值
      this.totalPages = getNestedData(data, 'data.pages') - 0
    },
    // 4 昵称跳转
    jumpMerchantInfoPage (userId) {
      this.$goToPage(`/${this.$routes_X.OTCViewMerchantInfo}`, {userId: userId})
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
<style scoped lang="scss" type="text/scss">
  @import "../../../assets/CSS/index";

  .focus-box {
    > .inner-box {
      .tab-one {
        padding: 0 30px;

        .name {
          color: $mainColor;

          .merchant-icon {
            display: inline-block;
            width: 14px;
            height: 19px;
            vertical-align: top;
            cursor: pointer;
          }
        }

        .operation-text {
          color: $mainColor;
        }
      }
    }

    /deep/ {
      .inner-box {
        .el-table {
          font-size: 12px;

          .el-table__empty-text {
            line-height: 600px;
          }

          td {
            padding: 8px 0;
          }

          .el-table__header {
            display: none;

            tr {
              th {
                .cell {
                  padding-right: 0;
                  padding-left: 0;
                }
              }
            }
          }

          .el-table__body {
            tr {
              td {
                .cell {
                  padding-right: 0;
                  padding-left: 0;
                }
              }
            }
          }
        }
      }
    }

    &.night {
      background-color: $mainContentNightBgColor;

      /deep/ {
        > .inner-box {
          .el-table {
            color: $mainNightTitleColor;
            background-color: $mainContentNightBgColor;

            tr,
            th {
              background-color: $mainContentNightBgColor;
            }

            .el-table__body {
              tr {
                &:hover {
                  td {
                    background-color: $mainContentNightBgColor !important;
                  }
                }
              }

              td {
                border-bottom: 1px solid $nightInputBg;
              }
            }
          }
        }
      }
    }

    &.day {
      background-color: $mainColorOfWhite;

      /deep/ {
        > .inner-box {
          .el-table {
            color: $dayMainTitleColor;
            background-color: $mainColorOfWhite;

            tr,
            th {
              background-color: $mainColorOfWhite;
            }

            .el-table__body {
              tr {
                &:hover {
                  td {
                    background-color: $mainColorOfWhite !important;
                  }
                }
              }

              td {
                border-bottom: 1px solid rgba(45, 54, 81, .1);
              }
            }
          }
        }
      }
    }
  }
</style>
