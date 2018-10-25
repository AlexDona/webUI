<template>
  <div
    class="help-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!--<keep-aline><HeaderCommon/></keep-aline>-->
    <div class="inner-box">
      <div class="search-box">
        <!--请输入关键字-->
        <input
          type="text"
          class="search-input"
          v-model="searchKeyWord"
          :placeholder="$t('M.comm_please_enter') + $t('M.news_keyword')"
        />
      </div>
      <div class="item-content help">
        <div class="inner-box">
          <ul class="content-list">
            <li
              class="content-item"
              v-for="(item,index) in helpFilterList"
              :key="index"
            >
              <div
                class="content-item-link"
              >
                <div class="title">
              <span
                class="icon-box cursor-pointer"
                v-show="!helpShowStatusList[index]"
                @click="toggleShowHelpItem(index,1)"
              >
                <IconFont
                  icon-name="icon-jia1"
                  class="icon-font"
                />
              </span>
                  <span
                    class="icon-box cursor-pointer"
                    v-show="helpShowStatusList[index]"
                    @click="toggleShowHelpItem(index,0)"
                  >
                <IconFont
                  icon-name="icon-jian"
                  class="icon-font"
                />
              </span>
                  <span class="title-content">
                    {{item.keyword}}
                  </span>
                </div>
                <el-collapse-transition>
                  <div
                    class="content"
                    v-show="helpShowStatusList[index]"
                    v-html="item.content"
                  >
                  </div>
                </el-collapse-transition>
              </div>
            </li>
          </ul>
          <!--分页-->
          <div class="page">
            <el-pagination
              background
              v-show="helpFilterList.length"
              layout="prev, pager, next"
              :page-count="totalPages"
              @current-change="changeCurrentPage"
            >
            </el-pagination>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import IconFont from '../Common/IconFontCommon'
import {mapState} from 'vuex'
import {getServiceProtocoDataAjaxByPageNum} from '../../utils/api/header'
import {returnAjaxMessage} from '../../utils/commonFunc'

export default {
  components: {
    HeaderCommon,
    FooterCommon,
    IconFont
  },
  // props,
  data () {
    return {
      searchKeyWord: '', // 搜索关键字
      helpList: [],
      // helpFilterList: [],
      helpShowStatusList: [],
      pageNum: 1,
      pageSize: 10,
      totalPages: 0 // 总页数
    }
  },
  created () {
    this.getHelpList()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 分页
    changeCurrentPage (pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.getHelpList()
    },
    async getHelpList () {
      const params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        language: this.language,
        termsTypeIds: 10
      }
      const data = await getServiceProtocoDataAjaxByPageNum(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.helpList = data.data.data.list
        this.pageNum = data.data.data.pageNum
        this.totalPages = data.data.data.pages
        this.helpList.forEach(() => {
          this.helpShowStatusList.push(false)
        })
      }
    },
    // 切换显示状态
    toggleShowHelpItem (index, status) {
      _.forEach(this.helpShowStatusList, (helpItem, helpIndex) => {
        this.$set(this.helpShowStatusList, helpIndex, false)
      })
      this.$set(this.helpShowStatusList, index, status)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme
    }),
    helpFilterList () {
      return this.helpList.filter((item) => {
        return (
          item['keyword'].indexOf(this.searchKeyWord) !== -1 ||
          item['content'].indexOf(this.searchKeyWord) !== -1
        )
      })
    }
  },
  watch: {
    language () {
      console.log(this.language)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
 @import '../../../static/css/scss/index.scss';
  .help-box{
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
      >.item-content{
        width:100%;
        height:1200px;
        overflow: hidden;
        >.inner-box{
          width:1100px;
          margin: 50px auto;
          height:1100px;
          padding: 45px 90px;
          position: relative;
          >.content-list{
            >.content-item{
              margin:10px 0;
              >.content-item-link{
                width:100%;
                /*height:40px;*/
                >.title{
                  text-align: left;
                  height:40px;
                  >.icon-box{
                    display:inline-block;
                    height:40px;
                    width:40px;
                    font-size: 40px;
                    line-height: 33px;
                    text-align: center;
                    vertical-align: top;
                    background-color: $mainColor;
                    >.icon-font{
                      font-size: 20px;
                      line-height: 40px;
                      color:$mainDayBgColor;
                    }
                  }
                  >.title-content{
                    height:40px;
                    display:inline-block;
                    line-height: 40px;
                    margin-left:10px;
                  }
                }
                >.content{
                  text-align: left;
                  padding:10px 50px;
                  max-height:600px;
                  overflow-y:auto;
                }
              }
            }
          }
          /*分页*/
          >.page{
            position: absolute;
            bottom:10px;
            left:50%;
            transform: translate(-50%,0);
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
        >.item-content{
          background-color: $mainNightBgColor;
          >.inner-box{
            background-color: $mainContentNightBgColor;
            >.content-list{
              >.content-item{
                >.content-item-link{
                  >.title{
                    background-color: #262A41;
                    >.icon-box{
                      background-color: $mainColor;
                      >.icon-font{
                        color:$mainDayBgColor;
                      }
                    }
                    >.title-content{
                      color:$mainDayBgColor;
                    }
                  }
                  >.content{
                    color:$nightFontColor;
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
        >.item-content{
          background-color: $mainDayBgColor;
          >.inner-box{
            background-color: $mainDayBgColor;
            border:1px solid rgba(234,235,236,1);
            >.content-list{
              >.content-item{
                >.content-item-link{
                  >.title{
                    background:rgba(239,245,252,1);
                    color:$mainColor;
                    >.icon-box{
                      color:$mainColor;
                      >.icon-font{
                        color:$mainDayBgColor;
                      }
                    }
                    >.title-content{
                      color:$mainColor;
                    }
                  }
                  >.content{
                    color:#666;
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
