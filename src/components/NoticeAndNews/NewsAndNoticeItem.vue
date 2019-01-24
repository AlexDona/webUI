<template>
  <div
    class="news-and-notice-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
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
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/NewsAndNoticeCenter' }">{{$t('M.comm_news_and_notice')}}</el-breadcrumb-item>
            <el-breadcrumb-item>{{newDetail.newsTypeName}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div
            class="news-detail"
          >
            <div
              class="left"
              v-if="newDetail"
            >
              <h2>{{newDetail.newsTypeName}}</h2>
              <div class="detail-content">
                <h3 class="title">{{newDetail.title}}</h3>
                <p class="time">{{newDetail.createTime}}</p>
                <div
                  class="content"
                  v-html="newDetail.content"
                ></div>
              </div>
            </div>
            <div class="right">
              <div
                class="news-type-list"
                v-for="(outerItem,outIndex) in newsTypeList"
                :key="outIndex"
              >
                <h2 class="news-type-title">{{outerItem.name}}
                  <span
                    class="view-more"
                    @click="backToParent(outerItem)"
                  >
                    更多 》
                  </span></h2>
                <ul
                  class="news-type-content"
                >
                  <li
                    class="news-type-item cursor-pointer"
                    v-for="(item,index) in detailAllNewsList[outIndex]"
                    :key="index"
                    @click="getDetailInfo(item.id)"
                  >
                    <span class="title">{{item.title}}</span>
                    <span class="time">{{item.createTime.split(' ')[0]}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState, createNamespacedHelpers} from 'vuex'

import {
  getNewsNoticeList,
  getNewsDetail,
  getAllNewsTypeList
} from '../../utils/api/home'
import {changeNewDetailByLanguage} from '../../utils/api/news'
import {
  setStore,
  getStore,
  removeStore
} from '../../utils'
import {
  getNestedData
} from '../../utils/commonFunc'

const {mapMutations} = createNamespacedHelpers('footerInfo')

// import {returnAjaxMsg} from '../../utils/commonFunc'
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
      templateId: ''
    }
  },
  async created () {
    this.templateId = getStore('templateId')
    if (this.templateId) {
      await this.changeNewDetailByLanguage()
    } else {
      await this.getDetailInfo(this.detailId)
    }
    await this.getAllNewsTypeList()
    this.getAllTypeListNewsList()
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_NEWS_TYPE_ACTIVE_NAME'
    ]),
    backToParent (item) {
      console.log(item.id)
      this.CHANGE_NEWS_TYPE_ACTIVE_NAME({
        activeName: item.id
      })
      this.$goToPage('/NewsAndNoticeCenter')
    },
    async changeNewDetailByLanguage () {
      let params = {
        templateId: this.templateId,
        language: this.language
      }
      const data = await changeNewDetailByLanguage(params)
      let newContent = getNestedData(data, 'data.content')
      if (newContent) {
        this.newDetail = getNestedData(data, 'data')
      }
    },
    // 获取所有新闻类型
    async getAllNewsTypeList () {
      const params = {
        language: this.language
      }
      const data = await getAllNewsTypeList(params)
      this.newsTypeList = getNestedData(data, 'data') || []
    },
    // 获取详情信息
    async getDetailInfo (id) {
      const data = await getNewsDetail(id)
      this.newDetail = getNestedData(data, 'data')
      this.templateId = getNestedData(data, 'data.templateId')
      setStore('templateId', this.templateId)
    },
    // 获取全部type类型的前5条数据
    async getAllTypeListNewsList () {
      let params = {
        pageNum: 1,
        pageSize: 5,
        language: this.language
      }
      for (let i = 0; i < this.newsTypeList.length; i++) {
        const item = this.newsTypeList[i]
        params.newsTypeId = item.id - 0
        const data = await getNewsNoticeList(params)
        const targetData = getNestedData(data, 'data.list')
        this.detailAllNewsList.push(targetData)
      }
    }
  },
  beforeDestroy () {
    removeStore('templateId')
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme,
      newsTypeActiveName: state => state.footerInfo.newsTypeActiveName
    })
  },
  watch: {
    newsTypeActiveName (newVal) {
      console.log(newVal)
    },
    async language () {
      await this.getAllNewsTypeList()
      await this.getAllTypeListNewsList()
      await this.changeNewDetailByLanguage()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
@import '../../../static/css/scss/index.scss';

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
      height: 1215px;

      > .inner-box {
        width: 1100px;
        height: 1100px;
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
          padding: 50px;
          overflow-y: auto;

          > .left {
            /* flex:2; */
            width: 70%;

            /* border:1px solid #fff; */
            > h2 {
              padding: 0 10px;
              border-left: 2px solid #338ff5;
              font-weight: 700;
              font-size: 18px;
              color: #338ff5;
            }

            > .detail-content {
              margin: 50px 170px 50px 50px;

              > .title {
                line-height: 40px;
                text-align: center;
              }

              > .time {
                margin-bottom: 40px;
                text-align: center;
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
          background-color: #1e2636;

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
      > .content-box {
        background-color: #fff;

        > .inner-box {
          border: 1px solid #ecf1f8;

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
              > h2 {
                color: #338ff5;
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
