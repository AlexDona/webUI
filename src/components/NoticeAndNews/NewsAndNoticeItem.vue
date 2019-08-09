<!--
  author: zhaoxinlei
  update: 20190619
  description: 当前页面为 新闻详情页面
-->
<template>
  <div
    class="news-and-notice-box"
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  >
    <div class="inner-box">
      <!--列表区-->
      <div class="content-box">
        <div class="inner-box">
          <div class="nav-list">
            <div class="nav-content">
              <a class="nav-list1" @click="goToNotice">{{newDetail.newsTypeName}}</a>&nbsp;>&nbsp; <span class="nav-list2">{{$t('M.common_details')}}</span>
            </div>
          </div>
          <div
            class="news-detail"
          >
            <div
              class="left"
              v-if="newDetail"
            >
              <!--<h2>{{newDetail.newsTypeName}}</h2>-->
              <div class="news-detail-title">
                <h3 class="title">{{newDetail.title}}</h3>
                <p class="time">{{newDetail.createTime}}</p>
              </div>
              <div class="detail-content">
                <div
                  class="content"
                  v-html="newDetail.content"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from 'vuex'

import {
  getNewsNoticeList,
  getNewsDetail,
  getAllNewsTypeList
} from '../../utils/api/home'
import {changeNewDetailByLanguage} from '../../utils/api/news'
import {
  getNestedData
} from '../../utils/commonFunc'

export default {
  components: {
  },
  props: ['detailId'],
  data () {
    return {
      newDetail: {},
      // 新闻类型列表
      newsTypeList: [],
      // 详情页面新闻列表
      detailAllNewsList: [],
      // 最新 templateId
      templateId: '',
      searchKeyWord: ''
    }
  },
  async created () {
    await this.getDetailInfo(this.detailId)
  },
  // mounted () {},
  // activated () {},
  // updated () {},
  // beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_NEWS_TYPE_ACTIVE_NAME'
    ]),
    backToParent (item) {
      // console.log(item.id)
      this.CHANGE_NEWS_TYPE_ACTIVE_NAME({
        activeName: item.id
      })
      this.$goToPage(`/${this.$routes_X.news}`)
    },
    goToNotice () {
      this.$goToPage(`/${this.$routes_X.news}/`)
    },
    async changeNewDetailByLanguage () {
      let params = {
        templateId: this.templateId,
        language: this.$language_S_X
      }
      const data = await changeNewDetailByLanguage(params)
      if (!data) return false
      let newContent = getNestedData(data, 'data.content')
      if (newContent) {
        this.newDetail = getNestedData(data, 'data')
      }
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
    // 获取详情信息
    getDetailInfo: _.debounce(async function (id) {
      if (this.templateId == id) return
      const data = await getNewsDetail(id)
      if (!data) return false
      this.$setStore('newsTypeId', _.get(data, 'data.newsTypeId'))
      this.newDetail = getNestedData(data, 'data')
      this.templateId = getNestedData(data, 'data.templateId')
      let {href} = window.location
      let tempArr = href.split('/')
      tempArr.pop()

      // console.log(tempArr.join('/'))
      window.location.href = `${tempArr.join('/')}/${this.templateId}`
    }, 500),
    // 获取全部type类型的前5条数据
    async getAllTypeListNewsList () {
      // console.log(this.newsTypeList)
      this.detailAllNewsList = []
      let params = {
        pageNum: 1,
        pageSize: 5,
        language: this.$language_S_X
      }
      for (let i = 0; i < this.newsTypeList.length; i++) {
        const item = this.newsTypeList[i]
        params.newsTypeId = item.id
        const data = await getNewsNoticeList(params)
        if (!data) break
        const targetData = getNestedData(data, 'data.list')
        this.detailAllNewsList.push(targetData)
      }
    }
  },
  // beforeDestroy () {
  // },
  // filter: {},
  computed: {
    ...mapState({
      newsItemId: state => state.common.newsItemId
    }),
    languageAndTemplateId () {
      return `${this.$language_S_X}${this.templateId}`
    }
  },
  watch: {
    async languageAndTemplateId () {
      await this.getAllNewsTypeList()
      await this.changeNewDetailByLanguage()
    },
    newsItemId (newVal) {
      if (newVal) {
        this.getDetailInfo(newVal)
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../assets/CSS/index';

.news-and-notice-box {
  > .inner-box {
    > .search-box {
      height: 60px;
      line-height: 250px;
      text-align: center;
      // background: url(../../assets/develop/helpbanner.png) no-repeat center center;
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
      margin-top: 120px;

      > .inner-box {
        width: 1300px;
        min-height: 900px;
        margin: 50px auto;
        overflow: hidden;

        .item-content {
          height: 950px;

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
                  width: 85px;
                  height: 60px;
                  margin-right: 20px;
                  text-align: center;
                  vertical-align: top;

                  > .top {
                    height: 25px;
                    line-height: 25px;
                    color: #fff;
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
                  width: 700px;

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
          padding: 0 40px 40px;
          overflow-y: auto;

          > .left {
            /* flex:2; */
            width: 100%;

            /* border:1px solid #fff; */

           /* > h2 {
              padding: 0 10px;
              border-left: 2px solid #338ff5;
              font-weight: 700;
              font-size: 18px;
              color: #338ff5;
            } */

            > .news-detail-title {
              padding: 0 40px 31px;
              border-bottom: 1px solid #292d47;

              > h3 {
                color: #c1d2f3;
              }

              > p {
                padding-top: 41px;
                color: #8ba0ca;
              }
            }

            > .detail-content {
              padding: 31px 38px;

              > .title {
                line-height: 40px;
                text-align: center;
              }

              > .time {
                margin-bottom: 40px;
                text-align: center;
              }

              > .content {
                text-align: justify;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
            }
          }

          > .right {
            /* flex:1; */
            width: 30%;

            /* border:1px solid #fff; */
            > .news-type-list {
              margin-bottom: 30px;

              > h2 {
                padding: 0 10px;
                margin-bottom: 20px;
                border-left: 2px solid #338ff5;
                font-weight: 400;
                font-size: 16px;
                color: #338ff5;

                > .view-more {
                  float: right;
                  font-size: 14px;
                  cursor: pointer;

                  &:hover {
                    color: $mainColor;
                  }
                }
              }

              > .news-type-content {
                > .news-type-item {
                  display: flex;
                  line-height: 30px;

                  > .title {
                    flex: 3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }

                  > .time {
                    flex: 1;
                    text-align: right;
                  }
                }
              }
            }
          }
        }

        /deep/ {
          .el-breadcrumb {
            margin: 50px 50px 0;

            span {
              font-weight: 400;

              &.is-link {
                &:hover {
                  color: $mainColor;
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
      > .content-box {
        > .inner-box {
          background-color: #1c1f32;

          .nav-list {
            padding: 22px 40px;
            margin-bottom: 17px;
            overflow: auto;

            .nav-content {
              height: 46px;
              padding: 0 40px;
              line-height: 46px;
              background: #292d47;

              .nav-list1 {
                color: rgba(139, 160, 202, 1);
                cursor: pointer;

                &:hover {
                  color: #338ff5
                }
              }

              .nav-list2 {
                color: rgba(139, 160, 202, 1);
              }
            }
          }

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
            background-color: #1c1f32;

            > .left {
              > h2 {
                color: #338ff5;
              }

              > .detail-content {
                > .title {
                  color: #fff;
                }

                > .time {
                  color: #8ba0ca;
                }

                > .content {
                  color: #8ba0ca;
                }
              }
            }

            > .right {
              > .news-type-list {
                > h2 {
                  border-left: 2px solid #338ff5;
                  color: #338ff5;

                  .view-more {
                    color: #8ba0ca;
                  }
                }

                > .news-type-content {
                  > .news-type-item {
                    > .title {
                      color: #fff;
                    }

                    > .time {
                      color: #8ba0ca;
                    }
                  }
                }
              }
            }
          }
        }

        /deep/ {
          .el-breadcrumb {
            span {
              color: #8ba0ca;
            }
          }
        }
      }
    }
  }

  &.day {
    > .inner-box {
      background-color: $newDayBg;

      > .content-box {
        background-color: $newDayBg;

        > .inner-box {
          background-color: #fff;
          box-shadow: 0 0 6px #cfd5df;

          .nav-list {
            padding: 22px 40px;
            margin-bottom: 17px;
            overflow: auto;

            .nav-content {
              height: 46px;
              padding: 0 40px;
              line-height: 46px;
              background: #b8cbe1;

              .nav-list1 {
                cursor: pointer;

                &:hover {
                  color: #338ff5
                }
              }
            }
          }

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

                    > .bottom {
                      color: #666;
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
            background-color: #fff;

            > .left {
            /* > h2 {
                  color: #338ff5;
            } */

              > .news-detail-title {
                border-bottom: 1px solid $borderColorOfDay;

                > h3 {
                  color: $mainColor;
                }

                > p {
                  padding-top: 41px;
                  color: #7d90ac;
                }
              }

              > .detail-content {
                > .title {
                  color: #666;
                }

                > .time {
                  color: #666;
                }

                > .content {
                  color: #666;
                }
              }
            }

            > .right {
              > .news-type-list {
                > h2 {
                  > .view-more {
                    color: #666;

                    &:hover {
                      color: $mainColor;
                    }
                  }
                }

                > .news-type-content {
                  > .news-type-item {
                    > .title {
                      color: #666;
                    }

                    > .time {
                      color: #666;
                    }
                  }
                }
              }
            }
          }
        }

        /deep/ {
          .el-breadcrumb {
            span {
              color: #666;
            }
          }
        }
      }
    }
  }
}
</style>
