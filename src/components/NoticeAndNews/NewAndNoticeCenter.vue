<!--
  author: zhaoxinlei
  update: 20190619
  description: 当前页面为 新闻列表页面
-->
<template>
  <div
    class="news-and-notice-box"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div class="inner-box">
      <!--搜索区-->
      <div class="search-box">
        <!--请输入关键字-->
        <input
          type="text"
          class="search-input"
          v-model="searchKeyWord"
          :placeholder="$t('M.about_footer_info_keyWords')"
        />
      </div>
      <!--列表区-->
      <div class="content-box">
        <div class="inner-box">
          <el-tabs
            v-model="activeName"
            @tab-click="changeTab"
            v-show="showNewsList"
          >
            <el-tab-pane
              :label="outerItem.name"
              :name="outerItem.id"
              v-for="(outerItem,index) in newsTypeList"
              :key="index"
            >
              <div class="item-content">
                <ul class="content-list">
                  <li
                    class="content-item cursor-pointer"
                    v-for="(item,index) in noticeFilterList"
                    :key="index"
                  >
                    <router-link
                      :to="`/${$routes_X.newsItem}/${item.id}`"
                      class="content-item-link"
                    >
                      <div
                        class="left"
                        v-if="isChineseLanguage"
                      >
                          <div class="top">
                            <!--年-->
                            {{item.createTime.split('-')[0]+ $t('M.news_year')}}
                          </div>
                          <div class="bottom">
                            <!--月-->
                            {{item.createTime.split('-')[1]-0+ $t('M.news_month')}}
                          </div>
                      </div>
                      <div
                        class="left"
                        v-else
                      >
                        <div class="top">
                          <!--年-->
                          {{item.createTime.split('-')[0]}}
                        </div>
                        <div class="bottom">
                          <!--月-->
                          {{item.createTime.split('-')[1]-0+  monthList[(item.createTime.split('-')[1]-1)].label}}
                        </div>
                      </div>
                      <div class="right">
                        <p class="top">
                          {{item.title}}
                        </p>
                        <p class="middle">
                          {{item.keyword}}
                        </p>
                        <p class="bottom">
                          <span class="author">{{item.creator}}</span>
                          <span class="date">{{item.createTime}}</span>
                        </p>
                      </div>
                    </router-link>
                  </li>
                </ul>
              </div>
              <el-pagination
                v-show="noticeFilterList.length"
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :page-count="totalPages"
                @current-change="changeCurrentPage"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getNewsNoticeList,
  getAllNewsTypeList
  // getNewsDetail
} from '../../utils/api/home'
import {
  getNestedData
} from '../../utils/commonFunc'
import {
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
export default {
  components: {},
  // props,
  data () {
    return {
      activeName: '1',
      // 新闻公告列表
      noticeList: [], // 公告列表
      newList: [], // 新闻列表
      helpList: [],
      searchKeyWord: '',
      helpShowStatusList: [],
      totalPages: 0, // 公告总条数
      pageSize: 7,
      pageNum: 1, // 当前页
      newsTypeList: [], // 新闻类型列表
      newsTypeId: 1, // 当前新闻类型id
      // showNewsList: false, // 显示列表、详情状态
      showNewsList: true, // 显示列表、详情状态
      monthList: [
        {
          value: 1,
          label: 'Jan'
        },
        {
          value: 2,
          label: 'Feb'
        },
        {
          value: 3,
          label: 'Mar'
        },
        {
          value: 4,
          label: 'Apr'
        },
        {
          value: 5,
          label: 'May'
        },
        {
          value: 6,
          label: 'June'
        },
        {
          value: 7,
          label: 'July'
        },
        {
          value: 8,
          label: 'Aug'
        },
        {
          value: 9,
          label: 'Step'
        },
        {
          value: 10,
          label: 'Oct'
        },
        {
          value: 11,
          label: 'Nov'
        },
        {
          value: 12,
          label: 'Dec'
        }
      ],
      end: ''
    }
  },
  async created () {
    this.$SET_ACTIVE_LINK_NAME_M_X(-1)
    await this.resetNewTypeList()
    await this.getNewsNoticeList()
    this.helpList.forEach(() => {
      this.helpShowStatusList.push(false)
    })
  },
  mounted () {
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
    ]),
    async resetNewTypeList () {
      await this.getAllNewsTypeList()
      // console.log(this.newsTypeList)
      if (this.newsTypeActiveName) {
        this.activeName = this.newsTypeActiveName
        this.changeTab({name: this.activeName})
      } else {
        this.newsTypeId = getNestedData(this.newsTypeList, '[0].id')
        this.activeName = this.newsTypeId
      }
    },
    changeTab (e) {
      // console.log(e.name)
      this.newsTypeId = e.name
      this.pageNum = 1
      this.getNewsNoticeList()
    },
    changeCurrentPage (e) {
      this.pageNum = e
      this.getNewsNoticeList()
    },
    // 获取所有新闻类型
    async getAllNewsTypeList () {
      const params = {
        language: this.$language_S_X
      }
      const data = await getAllNewsTypeList(params)
      if (!data) return false
      this.newsTypeList = getNestedData(data, 'data') || []
    },
    // 获取新闻公告列表
    getNewsNoticeList: _.debounce(async function () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        language: this.$language_S_X,
        newsTypeId: this.newsTypeId
      }
      const data = await getNewsNoticeList(params)
      if (!data) return false
      const targetData = getNestedData(data, 'data')
      this.noticeList = getNestedData(targetData, 'list') || []
      this.pageNum = getNestedData(targetData, 'pageNum')
      this.totalPages = getNestedData(targetData, 'pages')
    }, 500)
  },
  filter: {},
  computed: {
    ...mapGetters({
      'isChineseLanguage': 'isChineseLanguage'
    }),
    ...mapState({
      newsTypeActiveName: state => state.footerInfo.newsTypeActiveName
    }),
    noticeFilterList () {
      return this.noticeList.filter((item) => {
        return (item['title'].indexOf(this.searchKeyWord) != -1 ||
          item['keyword'].indexOf(this.searchKeyWord) != -1)
        // item['type'] == 0
      })
    }
  },
  watch: {
    newsTypeActiveName (newVal) {
      // console.log(newVal)
      this.activeName = newVal
    },
    async $language_S_X () {
      await this.resetNewTypeList()
      this.getNewsNoticeList()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .news-and-notice-box {
  > .inner-box {
    > .search-box {
      height: 250px;
      line-height: 250px;
      text-align: center;
      background: url(../../assets/develop/helpbanner.png) no-repeat center center;
      -webkit-background-size: 100% 100%;
      background-size: 100% 100%;

      > .search-input {
        box-sizing: border-box;
        width: 571px;
        height: 50px;
        padding: 0 20px;
        border: 1px solid rgba(42, 130, 200, 1);
        border-radius: 6px;
        color: #fff;
        background: rgba(30, 38, 54, 1);
        box-shadow: 1px 1px 24px 0 rgba(50, 83, 122, 1);
      }
    }

    > .content-box {
      min-height: 1215px;

      > .inner-box {
        width: 1100px;
        min-height: 1100px;
        padding-bottom: 116px;
        margin: 0 auto;

        .item-content {
          min-height: 950px;

          > .content-list {
            > .content-item {
              padding: 30px 144px 15px;
              text-align: left;

              > .content-item-link {
                display: inline-block;

                > .left,
                > .right {
                  display: inline-block;
                }

                > .left {
                  width: 110px;
                  height: 60px;
                  margin-right: 20px;
                  text-align: center;
                  vertical-align: top;

                  > .top {
                    height: 25px;
                    line-height: 25px;
                    color: #fff !important;
                    background: rgba(149, 160, 184, 1);
                  }

                  > .bottom {
                    height: 60px;
                    font-size: 26px;
                    line-height: 60px;
                    color: #fff;
                    background: rgba(31, 144, 234, 1);
                  }
                }

                > .right {
                  /* background-color: green; */
                  width: 668px;

                  > .top {
                    width: 100%;
                    margin-bottom: 10px;
                    overflow: hidden;
                    font-weight: bold;
                    font-size: 14px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: rgba(255, 255, 255, 1);
                  }

                  > .middle {
                    display: -webkit-box;
                    height: 40px;
                    margin-bottom: 5px;
                    overflow: hidden;
                    font-weight: 400;
                    font-size: 12px;
                    line-height: 20px;
                    text-overflow: ellipsis;
                    color: rgba(139, 160, 202, 1);
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 3;
                  }

                  > .bottom {
                    font-weight: 400;
                    font-size: 12px;
                    color: rgba(68, 81, 107, 1);

                    > .author {
                      margin-right: 20px;
                    }
                  }
                }
              }
            }
          }

          &.help {
            > .content-list {
              > .content-item {
                > .content-item-link {
                  width: 100%;
                  height: 40px;

                  > .title {
                    height: 40px;
                    text-align: left;

                    > .icon-box {
                      display: inline-block;
                      width: 40px;
                      height: 40px;
                      font-size: 40px;
                      line-height: 40px;
                      text-align: center;
                      vertical-align: top;
                    }

                    > .title-content {
                      display: inline-block;
                      height: 40px;
                      margin-left: 10px;
                      line-height: 40px;
                      color: #fff;
                    }
                  }

                  > .content {
                    padding: 10px 50px;
                    text-align: left;
                  }
                }
              }
            }
          }
        }

        > .news-detail {
          display: flex;
          width: 100%;
          height: 100%;
          padding: 50px;
          margin-top: 50px;
          overflow-y: auto;

          > .left {
            flex: 2;

            /* border:1px solid #fff; */
            > h2 {
              padding: 0 10px;
              border-left: 2px solid #338ff5;
              font-weight: 400;
              font-size: 18px;
              color: #338ff5;
            }

            > .detail-content {
              margin: 50px;

              > .title {
                line-height: 40px;
                text-align: center;
                color: #fff;
              }

              > .time {
                margin-bottom: 40px;
                text-align: center;
                color: #8ba0ca;
              }

              > .content {
                color: #8ba0ca;
              }
            }
          }

          > .right {
            flex: 1;

            /* border:1px solid #fff; */
            > .news-type-list {
              margin-bottom: 30px;

              > h2 {
                padding: 0 10px;
                margin-bottom: 20px;
                border-left: 2px solid #338ff5;
                font-weight: 400;
                font-size: 18px;
                color: #338ff5;
              }

              > .news-type-content {
                > .news-type-item {
                  display: flex;
                  line-height: 30px;

                  > .title {
                    flex: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: #fff;
                  }

                  > .time {
                    flex: 1;
                    text-align: right;
                    color: #8ba0ca;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  /deep/ {
    .el-tabs__nav {
      width: 100%;
      height: 60px;
      margin-top: 30px;
      line-height: 60px;
      text-align: center;
    }

    .el-tabs__nav-wrap {
      &::after {
        width: 0;
      }
    }

    .el-tabs__active-bar {
      height: 0;
    }

    .el-tabs__content {
      min-height: 1100px;
    }

    .el-pagination {
      text-align: center;
    }
  }

  &.night {
    > .inner-box {
      > .content-box {
        background-color: #121824;

        > .inner-box {
          .item-content {
            > .content-list {
              > .content-item {
                > .content-item-link {
                  > .left,
                  > .right {
                    > .top {
                      color: #fff;
                    }
                  }
                }
              }
            }

            &.help {
              > .content-list {
                > .content-item {
                  > .content-item-link {
                    background-color: #293140;

                    > .title {
                      > .icon-box {
                        color: #1e2636;
                        background-color: #338ff5;
                      }
                    }
                  }
                }
              }
            }
          }

          > .news-detail {
            background-color: #1e2636;
          }
        }
      }
    }

    /deep/ {
      .el-tabs__nav {
        background-color: #1e2636;
        box-shadow: 0 0 2px rgba(11, 14, 22, 1);
      }

      .el-tabs__item {
        color: #42506b;

        &.is-active {
          font-weight: 700;
          color: #338ff5;
        }
      }

      .el-tabs__content {
        background: rgba(30, 38, 54, 1);
      }
    }
  }

  &.day {
    > .inner-box {
      > .content-box {
        background-color: $newDayBg;

        > .inner-box {
          .item-content {
            > .content-list {
              > .content-item {
                > .content-item-link {
                  > .left,
                  > .right {
                    > .top {
                      color: #338ff5;
                    }

                    > .middle {
                      color: #666;
                    }
                  }
                }
              }
            }

            > .news-detail {
              background-color: #fff;
            }

            &.help {
              > .content-list {
                > .content-item {
                  > .content-item-link {
                    background-color: #293140;

                    > .title {
                      > .icon-box {
                        color: #1e2636;
                        background-color: #338ff5;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    /deep/ {
      .el-tabs__nav {
        background: #fff;
        box-shadow: 0 0 6px #cfd5df;
      }

      .el-tabs__content {
        background: #fff;
        box-shadow: 0 0 6px #cfd5df;
      }
    }
  }
}
</style>
