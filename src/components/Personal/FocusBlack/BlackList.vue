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
            label="操作"
            align="right"
            width="150"
          >
            <template slot-scope = "s">
              <div class="operation-text cursor-pointer" @click="unBlackList(s.row.id)">解除</div>
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
      <!--解除黑名单弹窗-->
      <div class="un-black-list-dialog">
        <el-dialog
          :title="$t('M.otc_prompt')"
          :visible.sync="dialogVisible"
          top="25vh"
        >
          <div class="content">
            解除黑名单
          </div>
          <span slot="footer">
            <div class="button-group">
              <button class="cancel item" @click="dialogVisible = false">
                {{$t('M.comm_cancel')}}
              </button>
              <button class="confirm item" @click="confirmUnBlackList">
                {{$t('M.comm_confirm')}}
              </button>
            </div>
          </span>
        </el-dialog>
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
      ],
      // 解除黑名单弹窗显示状态
      dialogVisible: false,
      // 解除的黑名单id
      unBlackId: ''
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
    },
    // 解除黑名单弹窗
    unBlackList (id) {
      this.unBlackId = id
      this.dialogVisible = true
    },
    // 确认解除黑名单接口
    async confirmUnBlackList () {
      let param = {
        id: this.unBlackId
      }
      const data = await unBlackAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      // 关闭弹窗
      this.dialogVisible = false
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
          color: $mainNightTitleColor;
          background-color: $mainContentNightBgColor;

          .el-table__empty-text {
            line-height: 600px;
          }

          tr,
          th {
            background-color: $mainContentNightBgColor;
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
              &:hover {
                td {
                  background-color: $mainContentNightBgColor !important;
                }
              }

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
            .el-table__header {
              th.is-leaf {
                border-bottom: 1px solid $nightInputBg;
              }

              thead {
                color: $mainNightTitleColor;
              }
            }

            .el-table__body {
              td {
                border-bottom: 0;
              }
            }
          }
        }

        .un-black-list-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              width: 350px;
              height: 180px;
              border-radius: 4px;

              .el-dialog__header {
                padding: 6px 18px;
                border-radius: 4px 4px 0 0;

                .el-dialog__title {
                  font-size: 14px;
                }

                .el-dialog__headerbtn {
                  top: 10px;
                  right: 10px;
                }
              }

              .el-dialog__body {
                height: 84px;
                padding: 35px 18px;
                font-size: 14px;
                text-align: center;
              }

              .el-dialog__footer {
                padding: 0 18px;

                .button-group {
                  .item {
                    height: 30px;
                    padding: 0 28px;
                    border-radius: 2px;
                    font-size: 12px;
                    line-height: 30px;
                    cursor: pointer;
                  }

                  .confirm {
                    margin-left: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.night {
      > .inner-box {
        /* 1 */
      }

      /deep/ {
        .un-black-list-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              background-color: $dialogColor1;

              .el-dialog__header {
                background-color: $dialogColor2;

                .el-dialog__title {
                  color: $dialogColor4;
                }
              }

              .el-dialog__body {
                color: $dialogColor5;
              }

              .el-dialog__footer {
                .button-group {
                  .cancel {
                    border: 1px solid $mainColor;
                    color: $mainColorOfWhite;
                    background-color: $dialogColor1;
                  }

                  .confirm {
                    color: $mainColorOfWhite;
                    background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      > .inner-box {
        /* 1 */
      }

      /deep/ {
        .un-black-list-dialog {
          .el-dialog__wrapper {
            .el-dialog {
              background-color: $mainColorOfWhite;

              .el-dialog__header {
                background-color: $dialogColor7;

                .el-dialog__title {
                  color: $dayMainTitleColor;
                }
              }

              .el-dialog__body {
                color: $dayMainTitleColor;
              }

              .el-dialog__footer {
                .button-group {
                  .cancel {
                    border: 1px solid $mainColor;
                    color: $mainColor;
                    background-color: $mainColorOfWhite;
                  }

                  .confirm {
                    color: $mainColorOfWhite;
                    background: linear-gradient(81deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
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
