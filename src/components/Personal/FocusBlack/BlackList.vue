<!--
  author: renfuwei
  create: 20190721
  description: 当前页面为 拉黑 组件
-->
<template>
  <div
    class="black-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <div class="tab-two">
        <el-table
          :data="blackList"
          style="width: 100%;"
          :empty-text="$t('M.comm_no_data')"
        >
          <!--UID-->
          <el-table-column
            label="用户UID"
            prop="uid"
          >
          </el-table-column>
          <!--昵称-->
          <el-table-column
            label="昵称"
            prop="name"
          >
          </el-table-column>
          <!--单数/成交率-->
          <el-table-column
            label="单数/成交率"
            width="240"
          >
            <template slot-scope = "s">
              <div>{{ s.row.times }}</div>
            </template>
          </el-table-column>
          <!--拉黑时间-->
          <el-table-column
            label="拉黑时间"
            prop="time"
          >
          </el-table-column>
          <!--操作-->
          <el-table-column
            :label="$t('M.otc_index_operate')"
            align="right"
            width="150"
          >
            <template slot-scope = "s">
              <div class="operation-text cursor-pointer" @click="confirmUnBlackList(s.row.id)">解除</div>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <div class="page">
          <el-pagination
            background
            v-show="blackList.length"
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
  getBlackListsAJAX,
  unBlackAJAX
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
      // 黑名单列表
      blackList: [
        {
          uid: '95555',
          name: '昵称',
          times: '5565/98.36%',
          time: '2019/06/25',
          id: 1
        },
        {
          uid: '95555',
          name: '昵称',
          times: '5565/98.36%',
          time: '2019/06/25',
          id: 2
        },
        {
          uid: '95555',
          name: '昵称',
          times: '5565/98.36%',
          time: '2019/06/25',
          id: 3
        },
        {
          uid: '95555',
          name: '昵称',
          times: '5565/98.36%',
          time: '2019/06/25',
          id: 4
        }
      ]
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
    // 翻页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.currentPage = pageNum
      // 重新刷新列表
      this.getBlackLists()
    },
    // 确认解除黑名单接口
    async confirmUnBlackList (id) {
      let param = {
        id: id
      }
      const data = await unBlackAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      this.getBlackLists()
    },
    // 获得黑名单列表
    async getBlackLists () {
      let param = {
        pageNum: this.currentPage
      }
      const data = await getBlackListsAJAX(param)
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

  .black-box {
    > .inner-box {
      width: 1105px;

      .tab-two {
        padding: 0 30px;

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

        .tab-two {
          .el-table {
            .el-table__body {
              td {
                border-bottom: 0;
              }
            }
          }
        }
      }
    }

    &.night {
      /deep/ {
        .inner-box {
          .el-table {
            color: $mainNightTitleColor;
            background-color: $mainContentNightBgColor;

            .el-table__header {
              th.is-leaf {
                border-bottom: 1px solid $nightInputBg;
              }

              thead {
                color: $mainNightTitleColor;
              }
            }

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
            }
          }
        }
      }
    }

    &.day {
      /deep/ {
        .inner-box {
          .el-table {
            color: $dayMainTitleColor;
            background-color: $mainColorOfWhite;

            .el-table__header {
              th.is-leaf {
                border-bottom: 1px solid rgba(57, 66, 77, .1);
              }

              thead {
                color: $fontColorSecondaryOfDay;
              }
            }

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
            }
          }
        }
      }
    }
  }
</style>
