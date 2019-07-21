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
              <div class="operation-text cursor-pointer" @click="cancelFocus(s.row.id)">取消关注</div>
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
      <!--取消关注弹窗-->
      <div class="cancel-focus-dialog">
        <el-dialog
          :title="$t('M.otc_prompt')"
          :visible.sync="dialogVisible"
          top="25vh"
        >
          <div class="content">
            取消关注
          </div>
          <span slot="footer">
            <div class="button-group">
              <button class="cancel item" @click="dialogVisible = false">
                {{$t('M.comm_cancel')}}
              </button>
              <button class="confirm item" @click="confirmCancelFocus">
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
      ],
      // 取消关注弹窗显示状态
      dialogVisible: false,
      // 取消关注的id
      cancelId: ''
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
    },
    // 取消关注弹出窗
    cancelFocus (id) {
      console.log(id)
      this.cancelId = id
      this.dialogVisible = true
    },
    // 确认取消关注接口
    async confirmCancelFocus () {
      let param = {
        id: this.cancelId
      }
      const data = await cancelFocusAJAX(param)
      console.log(data)
      if (!data) return false
      // 数据返回后的逻辑
      // 重新刷新列表
      // 关闭弹窗
      this.dialogVisible = false
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
    background-color: $mainContentNightBgColor;

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

        .tab-one {
          .el-table {
            .el-table__header {
              display: none;
            }

            .el-table__body {
              td {
                border-bottom: 1px solid $nightInputBg;
              }
            }
          }
        }

        .cancel-focus-dialog {
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
        .cancel-focus-dialog {
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
        .cancel-focus-dialog {
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
