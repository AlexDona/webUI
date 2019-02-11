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
            v-show="isChinese"
          ></iframe>
          <iframe
            :src="enSrc"
            width="1200px"
            height="1000px"
            frameborder="0"
            v-show="!isChinese"
          ></iframe>
        </div>
    </div>
  </div>
  </div>
</template>
<script>
import IconFont from '../Common/IconFontCommon'
import {
  mapState,
  mapGetters
} from 'vuex'

export default {
  components: {
    IconFont
  },
  // props,
  data () {
    return {
      searchKeyWord: '', // 搜索关键字
      enSrc: 'https://doc.bzu.com/web/#/6?page_id=111',
      chSrc: 'https://doc.bzu.com/web/#/8?page_id=142'
    }
  },
  created () {
  },
  mounted () {

  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
  },
  filter: {},
  computed: {
    ...mapGetters({
      'isNeedApp': 'isNeedApp',
      'isChinese': 'isChineseLanguage'
    }),
    ...mapState({
      language: state => state.common.language,
      theme: state => state.common.theme
    })
  },
  watch: {
    isNeedApp (newVal) {
      console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../../static/css/scss/index.scss';

  .help-box {
    > .inner-box {
      padding-top: 50px;

      > .search-box {
        height: 250px;
        padding-top: 30px;
        line-height: 80px;
        text-align: center;
        background: url(../../assets/develop/helpbanner.png) no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;

        > .title {
          font-weight: 500;
          font-size: 36px;
          text-align: center;
          color: #8ba0ca;
        }

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

      > .item-content {
        width: 100%;
        overflow: hidden;

        > .inner-box {
          position: relative;
          width: 1100px;
          height: 1100px;
          padding: 45px 90px;
          margin: 50px auto;

          > .content-list {
            > .content-item {
              margin: 10px 0;

              > .content-item-link {
                width: 100%;

                /* height:40px; */
                > .title {
                  height: 40px;
                  text-align: left;

                  > .icon-box {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    font-size: 40px;
                    line-height: 33px;
                    text-align: center;
                    vertical-align: top;
                    background-color: $mainColor;

                    > .icon-font {
                      font-size: 20px;
                      line-height: 40px;
                      color: $mainDayBgColor;
                    }
                  }

                  > .title-content {
                    display: inline-block;
                    height: 40px;
                    margin-left: 10px;
                    line-height: 40px;
                  }
                }

                > .content {
                  max-height: 600px;
                  padding: 10px 50px;
                  overflow-y: auto;
                  text-align: left;
                }
              }
            }
          }

          /* 分页 */
          > .page {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translate(-50%, 0);
          }
        }

        > .iframe-box {
          width: 1200px;
          height: 100%;
          margin: 30px auto;
        }
      }
    }

    &.night {
      > .inner-box {
        > .item-content {
          background-color: $mainNightBgColor;

          > .inner-box {
            background-color: $mainContentNightBgColor;

            > .content-list {
              > .content-item {
                > .content-item-link {
                  > .title {
                    background-color: #262a41;

                    > .icon-box {
                      background-color: $mainColor;

                      > .icon-font {
                        color: $mainDayBgColor;
                      }
                    }

                    > .title-content {
                      color: $mainDayBgColor;
                    }
                  }

                  > .content {
                    color: $nightFontColor;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      > .inner-box {
        > .item-content {
          background-color: $mainDayBgColor;

          > .inner-box {
            border: 1px solid rgba(234, 235, 236, 1);
            background-color: $mainDayBgColor;

            > .content-list {
              > .content-item {
                > .content-item-link {
                  > .title {
                    color: $mainColor;
                    background: rgba(239, 245, 252, 1);

                    > .icon-box {
                      color: $mainColor;

                      > .icon-font {
                        color: $mainDayBgColor;
                      }
                    }

                    > .title-content {
                      color: $mainColor;
                    }
                  }

                  > .content {
                    color: #666;
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
