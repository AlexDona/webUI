<template>
  <div
    class="currency-application-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 上币申请 -->
    <div class="inner-box">
      <div class="bottom">
        <div
          class="content"
        >
          <h1 class="title">{{ $t('M.actionCenter_coin_apply') }}</h1>

          <div
            v-html="contentHTML"
            class="return_content"
          >
          </div>
          <div class="bottom">
            <div class="download-box">
              <button
                class="download-btn cursor-pointer"
                @click="downloadPreviewTable"
              >
                <!-- 预览下载 -->
                {{$t('M.actionCenter_download')}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getCurrencyApplicationDownloadUrl
  // downloadFile
} from '../../utils/api/activityCenter'
import {
  getServiceProtocolData,
  getNestedData
} from '../../utils/commonFunc'
import {
  mapState
} from 'vuex'
import { downloadFileWithUserDefined } from '../../utils'
export default {
  components: {},
  // props,
  data () {
    return {
      contentHTML: '', // 上币申请内容
      termsTypeIds: 6, // 上币申请类型id
      downloadUrl: '', // 下载地址
      fileName: ''
    }
  },
  async created () {
    await this.getDownUrl()
    // 上币申请动态文案
    await this.getServiceProtocolData()
  },
  mounted () {},
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    async getServiceProtocolData () {
      const params = {
        termsTypeIds: this.termsTypeIds, // 用户协议代号
        language: this.language
      }
      await getServiceProtocolData(this, params, data => {
        this.contentHTML = data.data.data.length ? getNestedData(data, 'data.data[0].content') : ''
      })
    },
    // 获取资产列表下载地址
    async getDownUrl () {
      let params = {
        key: 'COIN_APPLY'
      }
      const data = await getCurrencyApplicationDownloadUrl(params)
      let detailData = getNestedData(data, 'data')
      this.downloadUrl = detailData.url
      this.fileName = detailData.name
    },
    // 下载资产预览表
    downloadPreviewTable () {
      let filename = 'Coin application form'
      downloadFileWithUserDefined(this.downloadUrl, filename)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language
    })
  },
  watch: {
    async language () {
      await this.getDownUrl()
      // 上币申请动态文案
      await this.getServiceProtocolData()
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../static/css/scss/index.scss";

  .currency-application-box {
    padding: 184px 0 0;
    background-size: 100% 100%;

    > .inner-box {
      > .bottom {
        position: relative;
        width: 100%;
        height: 1100px;

        > .content {
          position: absolute;
          left: 50%;
          width: 1100px;
          height: 1000px;
          background: url(../../assets/develop/applaction-inner-night-bg.png) no-repeat center center;
          background-size: 100% 100%;
          transform: translate(-50%, 0);

          > .title {
            font-size: 36px;
            font-family: HYk2gj;
            line-height: 140px;
            text-align: center;
          }

          > .top {
            padding: 56px;
            text-align: center;

            > div {
              display: inline-block;
            }

            > .item {
              position: relative;
              width: 136px;
              height: 100px;
              border-radius: 10px;
              vertical-align: top;
              color: #fff;

              > .title {
                font-weight: 700;
                font-size: 14px;
                line-height: 50px;
              }

              > .content {
                font-size: 12px;
              }

              > .index {
                position: absolute;
                bottom: -17px;
                left: 50%;
                width: 34px;
                height: 34px;
                border: 1px solid rgba(51, 143, 245, 1);
                border-radius: 50%;
                font-size: 20px;
                line-height: 34px;
                color: #338ff5;
                background: rgba(255, 255, 255, 1);
                transform: translate(-50%, 0);
              }
            }

            /* 箭头 */
            > .arrow {
              width: 46px;
              height: 100px;
            }
          }

          > .return_content {
            max-height: 1000px;
            padding: 0 170px;
            overflow: auto;
          }

          > .bottom {
            > .item {
              margin-bottom: 50px;

              .title {
                font-weight: 700;
                font-size: 20px;
                line-height: 60px;
                color: #338ff5;
              }

              .content {
                font-size: 16px;
                line-height: 30px;
              }
            }

            > .email-download {
              .target-email {
                color: #338ff5;
              }
            }

            > .download-box {
              width: 100%;
              padding: 0 125px;
              text-align: left;

              > .download-btn {
                display: inline-block;
                width: 200px;
                height: 50px;
                margin: 150px auto;
                border-radius: 4px;
                font-size: 16px;
                line-height: 50px;
                color: #fff;
                background-color: $mainColor;
              }
            }
          }
        }
      }
    }

    &.night {
      color: #a9bed4;
      background: url(../../assets/develop/applaction-bg.png) no-repeat center center;

      > .inner-box {
        > .bottom {
          > .content {
            background-color: rgba(19, 43, 96, .3);

            > .top {
              > .item {
                background: linear-gradient(180deg, rgba(31, 144, 234, 1), rgba(0, 0, 0, 0));
              }

              /* 箭头 */
              > .arrow {
                background: url(../../assets/develop/arrow.png) no-repeat center center;

                &.reverse {
                  transform: rotateX(180deg);
                }
              }
            }

            > .bottom {
              > .email-download {
                .target-email {
                  color: #338ff5;
                }
              }
            }
          }
        }
      }
    }

    &.day {
      color: #000;
      background-color: #f5f5f5;

      > .inner-box {
        > .bottom {
          > .content {
            background-color: rgba(255, 255, 255, .3);

            > .title {
              color: $mainColor;
            }

            > .top {
              > .item {
                background-color: #338ff5;
              }
            }

            > .bottom {
              > .item {
                margin-bottom: 50px;

                .title {
                  font-weight: 700;
                  font-size: 20px;
                  line-height: 60px;
                  color: #338ff5;
                }

                .content {
                  font-size: 16px;
                  line-height: 30px;
                }
              }

              > .email-download {
                .target-email {
                  color: #338ff5;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
