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
                <h2 class="news-type-title">{{outerItem.name}}</h2>
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
import {mapState} from 'vuex'
import {
  getNewsNoticeList,
  getNewsDetail,
  getAllNewsTypeList
} from '../../utils/api/home'
import {changeNewDetialByLanguage} from '../../utils/api/news'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      newDetail: {},
      // 新闻类型列表
      newsTypeList: [],
      // 详情页面新闻列表
      detailAllNewsList: [],
      // 当前项 templateId:
      templateId: ''
    }
  },
  async created () {
    await this.getDetailInfo(this.$route.params.id)
    await this.getAllNewsTypeList()
    this.getAllTypeListNewsList()
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {
    async changeNewDetialByLanguage () {
      let params = {
        templateId: this.templateId,
        language: this.language
      }
      const data = await changeNewDetialByLanguage(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        console.log(data)
      }
    },
    // 获取所有新闻类型
    async getAllNewsTypeList () {
      const params = {
        language: this.language
      }
      const data = await getAllNewsTypeList(params)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.newsTypeList = getNestedData(data, 'data.data') || []
      }
    },
    // 获取详情信息
    async getDetailInfo (id) {
      const data = await getNewsDetail(id)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.newDetail = getNestedData(data, 'data.data')
        console.log(this.newDetail)
      }
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
        if (!returnAjaxMsg(data, this)) {
          return false
        } else {
          const targetData = getNestedData(data, 'data.data.list')
          this.detailAllNewsList.push(targetData)
        }
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language
    })
  },
  watch: {
    async language () {
      await this.getAllNewsTypeList()
      await this.getAllTypeListNewsList()
      await this.changeNewDetialByLanguage()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
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
        margin: 0 auto;
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
          margin-top: 50px;
          overflow-y: auto;

          > .left {
            /* flex:2; */
            width: 70%;

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
            /* flex:1; */
            width: 40%;

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
                    flex: 3;
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
  }

  &.day {
    > .inner-box {
      > .content-box {
        background-color: #fff;

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

                    > .bottom {
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
  }
}
</style>
