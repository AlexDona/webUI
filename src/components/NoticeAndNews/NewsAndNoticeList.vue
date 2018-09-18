<template>
  <div
    class="news-and-notice-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <!--搜索区-->
      <div class="search-box">
        <input
          type="text"
          class="search-input"
          v-model="searchKeyWord"
          placeholder="请输入关键字"
        />
      </div>
      <!--列表区-->
      <div class="content-box">
        <div class="inner-box">
          <el-tabs
            v-model="activeName"
            @tab-click="changeTab"
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
                    class="content-item"
                    v-for="(item,index) in noticeFilterList"
                    :key="index"
                  >
                    <router-link
                      class="content-item-link"
                      to="/"
                    >
                      <div class="left">
                        <div class="top">{{item.createTime.split('-')[0]+' 年'}}</div>
                        <div class="bottom">{{item.createTime.split('-')[1]-0+' 月'}}</div>
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
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :current-page="pageNum"
                  :page-count="totalPages"
                  @current-change="changeCurrentPage"
                >
                </el-pagination>
              </div>
            </el-tab-pane>
            <!--<el-tab-pane-->
              <!--label="行业资讯"-->
              <!--name="2"-->
            <!--&gt;-->
              <!--<div-->
                <!--class="item-content"-->
                <!--v-if="newsFilterList.length"-->
              <!--&gt;-->
                <!--<ul class="content-list">-->
                  <!--<li-->
                    <!--class="content-item"-->
                    <!--v-for="(item,index) in newsFilterList"-->
                    <!--:key="index"-->
                  <!--&gt;-->
                    <!--<router-link-->
                      <!--class="content-item-link"-->
                      <!--to="/"-->
                    <!--&gt;-->
                      <!--<div class="left">-->
                        <!--<div class="top">{{item.createTime.split('-')[0]+' 年'}}</div>-->
                        <!--<div class="bottom">{{item.createTime.split('-')[1]-0+' 月'}}</div>-->
                      <!--</div>-->
                      <!--<div class="right">-->
                        <!--<p class="top">-->
                          <!--{{item.title}}-->
                        <!--</p>-->
                        <!--<p class="middle">-->
                          <!--{{item.keyword}}-->
                        <!--</p>-->
                        <!--<p class="bottom">-->
                          <!--<span class="author">{{item.creator}}</span>-->
                          <!--<span class="date">{{item.createTime}}</span>-->
                        <!--</p>-->
                      <!--</div>-->
                    <!--</router-link>-->
                  <!--</li>-->
                <!--</ul>-->
              <!--</div>-->
            <!--</el-tab-pane>-->
            <!--后台动态添加的-->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import HeaderCommon from '../Common/HeaderCommon'
import {
  getNewsNoticeList,
  getAllNewsTypeList
} from '../../utils/api/home'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon
  },
  // props,
  data () {
    return {
      activeName: '1',
      // 新闻公告列表
      noticeList: [
        // {
        //   time: '2018-09-14 20:27',
        //   title: '表头表头表头表头表头表头表头表表头表头表头表头表头表头表头表头表头表头表头表头表头表头表头表头头',
        //   briefIntroduction: '简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介简介',
        //   author: '今日财经'
        // },
        // {
        //   time: '2018-09-14 20:27',
        //   title: '表头',
        //   briefIntroduction: '简介',
        //   author: '今日财经'
        // },
        // {
        //   time: '2018-09-14 20:27',
        //   title: '表头',
        //   briefIntroduction: '简介',
        //   author: '今日财经'
        // }
      ], // 公告列表
      newList: [], // 新闻列表
      helpList: [
        // {
        //   title: '帮助title',
        //   subTitle: '子帮助主题',
        //   content: '帮助内容'
        // }
      ],
      searchKeyWord: '',
      helpShowStatusList: [],
      totalPages: 0, // 公告总条数
      pageSize: 1,
      pageNum: 1, // 当前页
      newsTypeList: [], // 新闻类型列表
      newsTypeId: 1, // 当前新闻类型id
      end: ''
    }
  },
  async created () {
    require('../../../static/css/list/NewsAndNotice/NewsAndNotice.css')
    require('../../../static/css/theme/day/NewsAndNotice/NewsAndNoticeDay.css')
    require('../../../static/css/theme/night/NewsAndNotice/NewsAndNoticeNight.css')
    await this.getAllNewsTypeList()
    console.log(this.newsTypeList)
    this.newsTypeId = this.newsTypeList[0].id
    await this.getNewsNoticeList()
    this.helpList.forEach(() => {
      this.helpShowStatusList.push(false)
    })
  },
  mounted () {},
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

        // switch (this.newsTypeId) {
        //   // 官方公告
        //   case 1:
        //     console.log(this.noticeList)
        //     break
        //   // 行业资讯
        //   case 2:
        //     break
        //   // 帮助中心
        //   case 3:
        //     break
        // }
        // console.log(this.noticeList)
      }
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      language: state => state.common.language,
      theme: state => state.common.theme
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
  watch: {}
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
          .item-content{
            >.content-list{
              >.content-item{
                text-align: left;
                padding: 50px 144px;
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
                      margin-bottom:10px;
                      overflow:hidden;
                      text-overflow:ellipsis;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 3;
                      line-height: 20px;
                      height:60px;
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
