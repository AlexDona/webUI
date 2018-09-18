<template>
  <div class="help-box">
    <HeaderCommon/>
    <div class="item-content help">
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
    <FooterCommon/>
  </div>
</template>
<script>
import HeaderCommon from '../Common/HeaderCommon'
import FooterCommon from '../Common/FooterCommon'
export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
  data () {
    return {
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
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .help-box{
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
