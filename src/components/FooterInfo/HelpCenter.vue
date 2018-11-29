<template>
  <div
    class="help-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div
      class="inner-box"
      ref="helpIframe"
    >
      <div class="item-content help">
        <div class="iframe-box">
          <iframe
            :src="chSrc"
            width="1200px"
            height="1000px"
            frameborder="0"
            v-if="language === 'zh_CN' || language === 'zh_TW'"
          ></iframe>
          <iframe
            :src="enSrc"
            v-else
            width="1200px"
            height="1000px"
            frameborder="0"
          ></iframe>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {mapState} from 'vuex'

export default {
  components: {
    IconFont
  },
  // props,
  data () {
    return {
      searchKeyWord: '', // 搜索关键字
      enSrc: 'https://doc.bzu.com/web/#/2?page_id=23',
      chSrc: 'https://doc.bzu.com/web/#/4?page_id=67'
    }
  },
  created () {
  },
  mounted () {
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme
    })
  },
  watch: {
    language () {
      window.location.reload()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
 @import '../../../static/css/scss/index.scss';
  .help-box{
    >.inner-box{
      padding-top:66px;
      >.search-box{
        >.title{
          text-align: center;
          font-weight: 500;
          color:#8BA0CA;
          font-size: 36px;
        }
        padding-top:30px;
        height:250px;
        line-height:80px;
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
        >.iframe-box{
          margin:30px auto;
          width:1200px;
          height:100%;
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
