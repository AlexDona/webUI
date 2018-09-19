<template>
  <div
    class="help-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon/>
    <div class="inner-box">
      <div class="search-box">
        <input
          type="text"
          class="search-input"
          v-model="searchKeyWord"
          placeholder="请输入关键字"
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
                +
              </span>
                  <span
                    class="icon-box cursor-pointer"
                    v-show="helpShowStatusList[index]"
                    @click="toggleShowHelpItem(index,0)"
                  >
                -
              </span>
                  <span class="title-content">{{item.title}}</span>
                </div>
                <el-collapse-transition>
                  <div
                    class="content"
                    v-show="helpShowStatusList[index]"
                  >
                    {{item.content}}
                  </div>
                </el-collapse-transition>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <FooterCommon/>
  </div>
</template>
<script>
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
import {mapState} from 'vuex'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
  data () {
    return {
      searchKeyWord: '', // 搜索关键字
      helpFilterList: [
        {
          title: '帮助title',
          subTitle: '子帮助主题',
          content: '帮助内容'
        }
      ],
      helpShowStatusList: []
    }
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    toggleShowHelpItem (index, status) {
      this.$set(this.helpShowStatusList, index, status)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      partnerId: state => state.common.partnerId,
      language: state => state.common.language,
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
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
        background-color: #121824;
        >.inner-box{
          width:1100px;
          margin: 50px auto;
          background-color: #1e2636;
          height:1100px;
          padding: 45px 90px;
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
    &.night{
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
    &.day{
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
</style>
