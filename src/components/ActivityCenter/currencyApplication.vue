<template>
  <div
    class="currency-application-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <!-- 上币申请 -->
    <HeaderCommon/>
    <div class="inner-box">
      <div class="top">
        <h1 class="title">上币申请</h1>
      </div>
      <div class="bottom">
        <div
          class="content"
        >
          <div
            class="top"
            v-html="contentHTML"
          >
            <div class="item">
              <p class="title">申请</p>
              <p class="content">提交申请资料到平台</p>
              <span class="index">1</span>
            </div>
            <div class="arrow"></div>
            <div class="item">
              <p class="title">审核</p>
              <p class="content">平台审核资料信息</p>
              <span class="index">2</span>
            </div>
            <div class="arrow reverse"></div>
            <div class="item">
              <p class="title">投票</p>
              <p class="content">新币登录投票</p>
              <span class="index">3</span>
            </div>
            <div class="arrow"></div>
            <div class="item">
              <p class="title">上线</p>
              <p class="content">上线交易区</p>
              <span class="index">4</span>
            </div>
          </div>
          <div class="bottom">
            <div class="download-box">
              <button
                class="download-btn cursor-pointer"
                @click="downloadPreviewTable"
              >预览下载</button>
              <!--<a-->
                <!--class="download-btn cursor-pointer"-->
                <!--:href="downloadUrl"-->
                <!--v-if="downloadUrl"-->
              <!--&gt;预览下载</a>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <keep-alive><FooterCommon/></keep-alive>
  </div>
</template>
<script>
import {
  getCurrencyApplicationDownloadUrl
  // downloadFile
} from '../../utils/api/activityCenter'
import {
  returnAjaxMessage,
  getServiceProtocolData
} from '../../utils/commonFunc'
import HeaderCommon from '../Common/HeaderCommonForPC'
import FooterCommon from '../Common/FooterCommon'
import {
  // createNamespacedHelpers,
  mapState
} from 'vuex'

export default {
  components: {
    HeaderCommon,
    FooterCommon
  },
  // props,
  data () {
    return {
      contentHTML: '', // 上币申请内容
      termsTypeIds: 6, // 上币申请类型id
      downloadUrl: '', // 下载地址
      fileName: ''
    }
  },
  created () {
    this.getDownUrl()
    // 上币申请动态文案
    this.getServiceProtocolData()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    getServiceProtocolData () {
      const params = {
        partnerId: this.partnerId,
        termsTypeIds: this.termsTypeIds, // 用户协议代号
        language: this.language
      }
      getServiceProtocolData(this, params, (data) => {
        console.log(data)
        this.contentHTML = data.data.data[0].content
      })
    },
    // 获取资产列表下载地址
    async getDownUrl () {
      console.log(1)
      let params = {
        key: 'COIN_APPLY'
      }
      const data = await getCurrencyApplicationDownloadUrl(params)
      if (!returnAjaxMessage(data, this)) {
        return false
      } else {
        console.log(data)
        this.downloadUrl = data.data.data.url
        this.fileName = data.data.data.name
      }
    },
    // 下载资产预览表
    downloadPreviewTable () {
      fetch(this.downloadUrl).then(res => res.blob().then(blob => {
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        let filename = this.fileName
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      }))
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme,
      language: state => state.common.language,
      partnerId: state => state.common.partnerId
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .currency-application-box{
    >.inner-box{
      >.top{
        height:344px;
        line-height:250px;
        text-align: center;
        font-size:30px;
        font-weight:bold;
        color:rgba(255,255,255,1);
        background: url('../../assets/develop/applyfor.png') no-repeat center center;
        -webkit-background-size: 100% 100%;
        background-size: 100% 100%;
      }
      >.bottom{
        position: relative;
        height:1310px;
        width:100%;
        >.content{
          position: absolute;
          height:1310px;
          width:1100px;
          left:50%;
          top:-164px;
          transform: translate(-50%,0);
          >.top{
            padding:56px;
            /*text-align: center;*/
            >div{
              display:inline-block;
            }
            >.item{
              width:136px;
              height:100px;
              border-radius:10px;
              vertical-align: top;
              color:#fff;
              position: relative;
              >.title{
                font-weight: 700;
                line-height: 50px;
                font-size: 14px;
              }
              >.content{
                font-size: 12px;
              }
              >.index{
                position: absolute;
                bottom:-17px;
                left:50%;
                transform: translate(-50%,0);
                width:34px;
                height:34px;
                line-height:34px;
                background:rgba(255,255,255,1);
                border:1px solid rgba(51,143,245,1);
                border-radius:50%;
                color:#338FF5;
                font-size: 20px;
              }
            }
            /*箭头*/
            >.arrow{
              width:46px;
              height:100px;
            }
          }
          >.bottom{
            padding:50px 40px;
            >.item{
              margin-bottom:50px;
              .title{
                font-size: 20px;
                color:#338FF5;
                font-weight: 700;
                line-height: 60px;
              }
              .content{
                font-size: 16px;
                line-height: 30px;
              }
            }
            >.email-download{
              .target-email{
                color:#338FF5;
              }
            }
            >.download-box{
              width:100%;
              text-align: center;
              >.download-btn{
                display:inline-block;
                width:300px;
                height:50px;
                line-height:50px;
                background:linear-gradient(90deg,rgba(43,57,110,1) 0%,rgba(42,80,130,1) 100%);
                border-radius:4px;
                color:#fff;
                font-size: 16px;
                margin:150px auto;
              }
            }
          }
        }
      }
    }
    &.night {
      color:#A9BED4;
      > .inner-box {
        > .top {
        }
        > .bottom {
          background-color: #121824;
          > .content {
            background-color: #1e2636;
            >.top{
              >div{
              }
              >.item{
                background:linear-gradient(180deg,rgba(31,144,234,1),rgba(0,0,0,0));
              }
              /*箭头*/
              >.arrow{
                background: url(../../assets/develop/arrow.png) no-repeat center center;
                &.reverse{
                  transform: rotateX(180deg);
                }
              }
            }
            >.bottom{
              padding:50px 40px;
              >.item{
                .title{
                }
                .content{
                }
              }
              >.email-download{
                .target-email{
                  color:#338FF5;
                }
              }
              >.download-box{
                text-align: center;
                >.download-btn{
                }
              }
            }
          }
        }
      }
    }
    &.day {
      color:#000;
      > .inner-box {
        > .top {
        }
        > .bottom {
          /*background-color: #121824;*/
          > .content {
            background-color: #fff;
            >.top{
              >div{
              }
              >.item{
                background-color: #338FF5;
              }
              /*箭头*/
              >.arrow{
                &.reverse{
                }
              }
            }
            >.bottom{
              padding:50px 40px;
              >.item{
                margin-bottom:50px;
                .title{
                  font-size: 20px;
                  color:#338FF5;
                  font-weight: 700;
                  line-height: 60px;
                }
                .content{
                  font-size: 16px;
                  line-height: 30px;
                }
              }
              >.email-download{
                .target-email{
                  color:#338FF5;
                }
              }
              >.download-box{
                >.download-btn{
                }
              }
            }
          }
        }
      }
    }
  }
</style>
