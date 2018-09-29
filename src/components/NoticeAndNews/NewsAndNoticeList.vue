<template>
  <div
    class="news-and-notice-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <!--搜索区-->
      <div class="search-box">
        <!--请输入关键字-->
        <input
          type="text"
          class="search-input"
          v-model="searchKeyWord"
          :placeholder="$t('M.comm_please_enter') + $t('M.news_keyword')"
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
            <!--定死-->
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
                    @click="jumpToDetail(item)"
                  >
                    <div
                      class="content-item-link"
                    >
                      <div class="left">
                        <div class="top">
                          <!--年-->
                          {{item.createTime.split('-')[0]+ $t('M.news_year')}}
                        </div>
                        <div class="bottom">
                          <!--月-->
                          {{item.createTime.split('-')[1]-0+ $t('M.news_month')}}
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
                    </div>
                  </li>
                </ul>
              </div>
              <el-pagination
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :page-count="totalPages"
                @current-change="changeCurrentPage"
              >
              </el-pagination>
            </el-tab-pane>
          </el-tabs>
          <div
            class="news-detail"
            v-show="!showNewsList"
          >
            <div class="left">
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
                    @click="jumpToDetail(item)"
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
    <keep-aline><FooterCommon/></keep-aline>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import {
  getNewsNoticeList,
  getAllNewsTypeList,
  getNewsDetail
} from '../../utils/api/home'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
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
      newDetail: {
      },
      detailAllNewsList: [], // 详情页面新闻列表
      end: ''
    }
  },
  async created () {
    require('../../../static/css/list/NewsAndNotice/NewsAndNotice.css')
    require('../../../static/css/theme/day/NewsAndNotice/NewsAndNoticeDay.css')
    require('../../../static/css/theme/night/NewsAndNotice/NewsAndNoticeNight.css')
    await this.getAllNewsTypeList()
    this.newsTypeId = this.newsTypeList[0].id
    await this.getNewsNoticeList()
    this.helpList.forEach(() => {
      this.helpShowStatusList.push(false)
    })
    console.log(this.newsTypeList)
    this.getAllTypeListNewsList()
  },
  mounted () {
    console.log(this.newsDetailJumpId)
    if (this.newsDetailJumpId) {
      this.getDetailInfo(this.newsDetailJumpId)
    }
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    changeTab (e) {
      console.log(e.name)
      this.newsTypeId = e.name
      this.pageNum = 1
      this.getNewsNoticeList()
    },
    changeCurrentPage (e) {
      this.pageNum = e
      this.getNewsNoticeList()
    },
    // 获取全部type类型的前5条数据
    async getAllTypeListNewsList () {
      let params = {
        partnerId: this.partnerId,
        pageNum: 1,
        pageSize: 5,
        language: this.language
      }
      for (let i = 0; i < this.newsTypeList.length; i++) {
        const item = this.newsTypeList[i]
        params.newsTypeId = item.id - 0
        console.log(params)
        const data = await getNewsNoticeList(params)
        console.log(data)
        if (!returnAjaxMessage(data, this)) {
          return false
        } else {
          console.log(data)
          const targetData = data.data.data.list
          this.detailAllNewsList.push(targetData)
        }
      }
      console.log(this.detailAllNewsList)
    },
    // 详情跳转
    jumpToDetail (item) {
      this.getDetailInfo(item.id)
    },
    // 获取详情信息
    async getDetailInfo (id) {
      const data = await getNewsDetail(id)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        this.showNewsList = false
        this.newDetail = data.data.data
        console.log(this.newDetail)
      }
    },
    // 获取所有新闻类型
    async getAllNewsTypeList () {
      const params = {
        partnerId: this.partnerId
      }
      const data = await getAllNewsTypeList(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.newsTypeList = data.data.data
        console.log(this.newsTypeList)
      }
    },
    // 获取新闻公告列表
    async getNewsNoticeList () {
      const params = {
        partnerId: this.partnerId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        language: this.language,
        newsTypeId: this.newsTypeId
      }
      const data = await getNewsNoticeList(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        const targetData = data.data.data
        this.noticeList = targetData.list
        this.pageNum = targetData.pageNum
        this.totalPages = targetData.pages
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      language: state => state.common.language,
      theme: state => state.common.theme,
      newsDetailJumpId: state => state.footerInfo.newsDetailJumpId
      // newsAndNoticeActiveName: state => state.footerInfo.newsAndNoticeActiveName
    }),
    noticeFilterList () {
      return this.noticeList.filter((item) => {
        return (item['title'].indexOf(this.searchKeyWord) != -1 ||
               item['keyword'].indexOf(this.searchKeyWord) != -1)
        // item['type'] == 0
      })
    },
    newsFilterList () {
      return this.noticeList.filter((item) => {
        return (item['title'].indexOf(this.searchKeyWord) != -1 ||
          item['keyword'].indexOf(this.searchKeyWord) != -1)
        // item['type'] == 1
      })
    },
    helpFilterList () {
      return this.helpList.filter((item) => {
        return (item['title'].indexOf(this.searchKeyWord) != -1 ||
          item['content'].indexOf(this.searchKeyWord) != -1)
      })
    }
  },
  watch: {
    newsDetailJumpId (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  .news-and-notice-box{
    >.inner-box{
      >.search-box{
        height:250px;
        line-height:250px;
        text-align: center;
        background: url(../../assets/develop/helpbanner.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
        >.search-input{
          width:571px;
          height:50px;
          padding:0 20px;
          box-sizing: border-box;
          background:rgba(30,38,54,1);
          border:1px solid rgba(42,130,200,1);
          border-radius:6px;
          box-shadow:1px 1px 24px 0px rgba(50,83,122,1);
          color:#fff;
        }
      }
      >.content-box{
        height:1215px;
        >.inner-box{
          width:1100px;
          height:1100px;
          margin:0 auto;
          overflow: hidden;
          .item-content{
            height:950px;
            >.content-list{
              >.content-item{
                text-align: left;
                padding: 30px 144px 15px;
                >.content-item-link{
                  display:inline-block;
                  >.left,>.right{
                    display:inline-block;
                  }
                  >.left{
                    width: 85px;
                    height:60px;
                    vertical-align: top;
                    margin-right:20px;
                    text-align: center;
                    >.top{
                      height:25px;
                      line-height:25px;
                      color:#fff;
                      background:rgba(149,160,184,1);
                    }
                    >.bottom{
                      height:60px;
                      line-height: 60px;
                      font-size: 26px;
                      background:rgba(31,144,234,1);
                      color:#fff;
                    }
                  }
                  >.right{
                    /*background-color: green;*/
                    width:700px;
                    >.top{
                      width:100%;
                      font-size:14px;
                      font-weight:bold;
                      color:rgba(255,255,255,1);
                      margin-bottom:10px;
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space: nowrap;
                    }
                    >.middle{
                      font-size:12px;
                      font-weight:400;
                      color:rgba(139,160,202,1);
                      margin-bottom:5px;
                      overflow:hidden;
                      text-overflow:ellipsis;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 3;
                      line-height: 20px;
                      height:40px;
                    }
                    >.bottom{
                      font-size:12px;
                      font-weight:400;
                      color:rgba(68,81,107,1);
                      >.author{
                        margin-right:20px;
                      }
                    }
                  }
                }
              }
            }
            &.help{
              >.content-list{
                >.content-item{
                  >.content-item-link{
                    width:100%;
                    height:40px;
                    >.title{
                      text-align: left;
                      height:40px;
                      >.icon-box{
                        display:inline-block;
                        height:40px;
                        width:40px;
                        font-size: 40px;
                        line-height: 40px;
                        text-align: center;
                        vertical-align: top;
                      }
                      >.title-content{
                        height:40px;
                        display:inline-block;
                        line-height: 40px;
                        margin-left:10px;
                        color:#fff;
                      }
                    }
                    >.content{
                      text-align: left;
                      padding:10px 50px;
                    }
                  }
                }
              }
            }
          }
          >.news-detail{
            width:100%;
            height:100%;
            margin-top:50px;
            display:flex;
            padding:50px;
            overflow-y:auto;
            >.left{
              flex:2;
              /*border:1px solid #fff;*/
              >h2{
                color:#338FF5;
                font-size: 18px;
                font-weight: 400;
                border-left: 2px solid #338FF5;
                padding: 0 10px;
              }
              >.detail-content{
                margin:50px;
                >.title{
                  text-align: center;
                  color:#fff;
                  line-height: 40px;
                }
                >.time{
                  text-align: center;
                  margin-bottom:40px;
                  color:#8BA0CA;
                }
                >.content{
                  color:#8BA0CA;
                }
              }
            }
            >.right{
              flex:1;
              /*border:1px solid #fff;*/
              >.news-type-list{
                margin-bottom: 30px;
                >h2{
                  font-size: 18px;
                  font-weight: 400;
                  color:#338FF5;
                  border-left: 2px solid #338FF5;
                  padding: 0 10px;
                  margin-bottom:20px;
                }
                >.news-type-content{
                  >.news-type-item{
                    display:flex;
                    line-height: 30px;
                    >.title{
                      flex:2;
                      overflow: hidden;
                      text-overflow:ellipsis;
                      white-space: nowrap;
                      color:#fff;
                    }
                    >.time{
                      flex:1;
                      text-align: right;
                      color:#8BA0CA;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    &.night{
     >.inner-box{
       >.search-box{
         >.search-input{
         }
       }
       >.content-box{
         background-color: #121824;
         >.inner-box{
           .item-content{
             >.content-list{
               >.content-item{
                 >.content-item-link{
                   >.left,>.right{
                   }
                   >.left{
                     >.top{
                     }
                     >.bottom{
                     }
                   }
                   >.right{
                     >.top{
                       color:#fff;
                     }
                     >.middle{
                     }
                     >.bottom{
                     }
                   }
                 }
               }
             }
             &.help{
               >.content-list{
                 >.content-item{
                   >.content-item-link{
                     background-color: #293140;
                     >.title{
                       >.icon-box{
                         background-color: #338FF5;
                         color:#1E2636;
                       }
                       >.title-content{
                       }
                     }
                     >.content{
                     }
                   }
                 }
               }
             }
           }
           >.news-detail{
             background-color: #1e2636;
           }
         }
       }
     }
    }
    &.day{
      >.inner-box{
        >.search-box{
          >.search-input{
          }
        }
        >.content-box{
          background-color: #fff;
          >.inner-box{
            .item-content{
              >.content-list{
                >.content-item{
                  >.content-item-link{
                    >.left,>.right{
                    }
                    >.left{
                      >.top{
                      }
                      >.bottom{
                      }
                    }
                    >.right{
                      >.top{
                        color:#338FF5;
                      }
                      >.middle{
                        color:#666;
                      }
                      >.bottom{
                        color:#666;
                      }
                    }
                  }
                }
              }
              >.news-detail{
                background-color: #fff;
              }
              &.help{
                >.content-list{
                  >.content-item{
                    >.content-item-link{
                      background-color: #293140;
                      >.title{
                        >.icon-box{
                          background-color: #338FF5;
                          color:#1E2636;
                        }
                        >.title-content{
                        }
                      }
                      >.content{
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
