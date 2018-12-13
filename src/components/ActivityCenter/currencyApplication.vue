<template>
  <div
    class="currency-application-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 上币申请 -->
    <div class="inner-box">
      <div class="top">
        <img
          src="../../assets/develop/applyfor.png"
        >
        <!-- 上币申请 -->
        <h1 class="title">{{ $t('M.actionCenter_coin_apply') }}</h1>
      </div>
      <div class="bottom">
        <div
          class="content"
        >
          <!-- <div
            class="top"
            v-html="contentHTML"
          > -->
          <div
            class="top"
          >
            <div class="item">
              <p class="title">
                <!-- 申请 -->
                {{$t('M.actionCenter_Token_step1')}}
              </p>
              <p class="content">
                <!-- 提交申请资料到平台 -->
                {{$t('M.actionCenter_Token_step2')}}
              </p>
              <span class="index">1</span>
            </div>
            <div class="arrow"></div>
            <div class="item">
              <p class="title">
                <!-- 审核 -->
                {{$t('M.actionCenter_Token_step3')}}
              </p>
              <p class="content">
                <!-- 平台审核资料信息 -->
                {{$t('M.actionCenter_Token_step4')}}
              </p>
              <span class="index">2</span>
            </div>
            <div class="arrow reverse"></div>
            <div class="item">
              <p class="title">
                <!-- 投票 -->
                {{$t('M.actionCenter_Token_step5')}}
              </p>
              <p class="content">
                <!-- 新币登录投票 -->
                {{$t('M.actionCenter_Token_step6')}}
              </p>
              <span class="index">3</span>
            </div>
            <div class="arrow"></div>
            <div class="item">
              <p class="title">
                <!-- 上线 -->
                {{$t('M.actionCenter_Token_step7')}}
              </p>
              <p class="content">
                <!-- 上线交易区 -->
                {{$t('M.actionCenter_Token_step8')}}
              </p>
              <span class="index">4</span>
            </div>
          </div>
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
  returnAjaxMsg,
  getServiceProtocolData,
  getNestedData
} from '../../utils/commonFunc'
import {
  // createNamespacedHelpers,
  mapState
} from 'vuex'

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
  activited () {},
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
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        let detailData = getNestedData(data, 'data.data')
        this.downloadUrl = detailData.url
        this.fileName = detailData.name
      }
    },
    // 下载资产预览表
    downloadPreviewTable () {
      fetch(this.downloadUrl).then(res => res.blob().then(blob => {
        let link = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        let filename = this.coin_apply
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
      }))
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
  .currency-application-box {
    margin-top: 66px;

    > .inner-box {
      > .top {
        position: relative;
        height: 344px;
        overflow: hidden;
        font-weight: bold;
        font-size: 30px;
        line-height: 250px;
        text-align: center;
        color: rgba(255, 255, 255, 1);

        > .title {
          position: absolute;
          top: 0;
          left: 50%;
          font-weight: 500;
          font-size: 36px;
          transform: translate(-50%, 0);
        }
      }

      > .bottom {
        position: relative;
        width: 100%;
        height: 1310px;

        > .content {
          position: absolute;
          top: -164px;
          left: 50%;
          width: 1100px;
          height: 1310px;
          transform: translate(-50%, 0);

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
            padding-left: 50px;
          }

          > .bottom {
            padding: 50px 40px;

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
              text-align: center;

              > .download-btn {
                display: inline-block;
                width: 300px;
                height: 50px;
                margin: 150px auto;
                border-radius: 4px;
                font-size: 16px;
                line-height: 50px;
                color: #fff;
                background: linear-gradient(90deg, rgba(43, 57, 110, 1) 0%, rgba(42, 80, 130, 1) 100%);
              }
            }
          }
        }
      }
    }

    &.night {
      color: #a9bed4;

      > .inner-box {
        > .bottom {
          background-color: #121824;

          > .content {
            background-color: #1e2636;

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
              padding: 50px 40px;

              > .email-download {
                .target-email {
                  color: #338ff5;
                }
              }

              > .download-box {
                text-align: center;
              }
            }
          }
        }
      }
    }

    &.day {
      color: #000;

      > .inner-box {
        > .bottom {
          > .content {
            background-color: #fff;

            > .top {
              > .item {
                background-color: #338ff5;
              }
            }

            > .bottom {
              padding: 50px 40px;

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
