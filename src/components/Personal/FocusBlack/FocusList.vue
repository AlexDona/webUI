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
                  src="../../../assets/develop/shangjia.png"
                  class="merchant-icon"
                  :title="$t('M.otc_merchant')"
                >
                <!--v-show="s.row.userType === 'MERCHANT'"-->
                {{ (s.row.name) }}
              </div>
            </template>
          </el-table-column>
          <!--是否高级认证-->
          <el-table-column
            label=""
            prop="renzheng"
          >
          </el-table-column>
          <!--注册时间-->
          <el-table-column
            label=""
            prop="time"
          >
          </el-table-column>
          <!--操作-->
          <el-table-column
            label=""
            align="right"
            width="200"
          >
            <template slot-scope = "s">
              <div class="operation-text cursor-pointer" @click="confirmCancelFocus(s.row.id)">取消关注</div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="focusList.length"
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
} from '../../../utils/api/personal'
export default {
  components: {},
  // props,
  data () {
    return {
      // 当前页码
      currentPage: 1,
      // 总页数
      totalPages: 1,
      // 关注列表
      focusList: [
        {
          name: '二狗',
          renzheng: '高级认证',
          time: '注册时间：2019/06/04',
          id: 1
        },
        {
          name: '二狗',
          renzheng: '高级认证',
          time: '注册时间：2019/06/04',
          id: 2
        },
        {
          name: '二狗',
          renzheng: '高级认证',
          time: '注册时间：2019/06/04',
          id: 3
        },
        {
          name: '二狗',
          renzheng: '高级认证',
          time: '注册时间：2019/06/04',
          id: 4
        }
      ]
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
    // 翻页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      // 重新刷新列表
      this.getFocusLists()
    },
    // 确认取消关注接口
    async confirmCancelFocus (id) {
      let param = {
        id: id
      }
      const data = await cancelFocusAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      this.getFocusLists()
    },
    // 获得关注列表
    async getFocusLists () {
      let param = {
        pageNum: this.currentPage
      }
      const data = await getFocusListsAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 数据赋值页码赋值
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
