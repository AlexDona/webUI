<template>
  <div
    class="otc-business-apply-box otc"
    :class="{'day':theme == 'day','night':theme == 'night','black':statusBlack == 'successOrApplying' }"
  >
    <!-- 2.1商家 申请 页面 -->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      class="business-apply-content"
      v-show="applyStatus === 1"
    >
      <!-- 2.1 商家特权 -->
      <div class="privilege">
        <div class="title font-weight700 font-size24">
          <!-- 商家特权 -->
          {{$t('M.otc_merchant')}}{{$t('M.otc_privilege')}}
        </div>
        <div class="content">
          <div class="common publish-AD">
            <img
              src="../../assets/develop/fabu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 发布广告 -->
          {{$t('M.otc_merchant_publishAD')}}
            </span>
            <p class="text font-size14">
              <!-- 自由发布定价、浮价广告 </br>买卖更灵活、额度更大 -->
              {{$t('M.otc_merchant_pubshorder')}}<br />
              {{$t('M.otc_merchant_bigmount')}}
            </p>
          </div>
          <div class="common mark">
            <img
              src="../../assets/develop/biaozhi.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 独享标志 -->
              {{$t('M.otc_merchant_singleFag')}}
            </span>
            <p class="text font-size14">
              <!-- 商家发布的广告会带有<br />专属“商”标志<br />增加交易信任 -->
              {{$t('M.otc_merchant_tipsLine')}}<br />
              {{$t('M.otc_merchant_Smark')}}<br />
              {{$t('M.otc_merchant_plusTrust')}}
            </p>
          </div>
          <div class="common service">
            <img
              src="../../assets/develop/kefu.png"
              class="location-picture"
            >
            <span class="title display-inline-block font-size18">
              <!-- 专属客服 -->
              {{$t('M.otc_merchant_singleSerice')}}
            </span>
            <p class="text font-size14">
              <!-- 我们向商家提供7*24小时<br />专属客服服务 -->
              {{$t('M.otc_merchant_we')}}<br />
              {{$t('M.otc_merchant_singleSeriviceserver')}}
            </p>
          </div>
        </div>
      </div>
      <!-- 2.2 商家认证 -->
      <div class="approve">
        <!-- 2.2.1 商家认证 -->
        <div class="title font-weight700 font-size24">
          {{$t('M.otc_merchant')}}{{$t('M.otc_approve')}}
        </div>
        <!-- 2.2.2 1234序号部分 -->
        <div class="number">
          <!-- 商家申请 -->
          <span class="common apply">
            <!-- {{$t('M.otc_merchant')}}{{$t('M.otc_apply')}} -->
            {{$t('M.otc_merchant_apply')}}
          </span>
          <!-- 发送邮件 -->
          <span class="common send-email">
            {{$t('M.otc_merchant_sendemail')}}
          </span>
          <!-- 提交申请 -->
          <span class="common submit-apply">
            {{$t('M.otc_submit')}}{{$t('M.otc_apply')}}
          </span>
          <!-- 审核通过 -->
          <span class="common pass">
            {{$t('M.otc_merchant_verified')}}
          </span>
        </div>
        <!-- 2.2.3 具体步骤部分 -->
        <div class="step">
          <div class="content">
            <h4 class="title">{{$t('M.otc_merchant_step1')}}</h4>
            <!-- 商家申请资料模板下载 -->
            <p>
              {{$t('M.otc_merchant_pleaseDowload')}}
              <span
                class="businessApplyModel"
                @click="downloadApplicationForm"
              >
                《{{$t('M.otc_merchant_applyMaterial')}}》
              </span>
              ，{{$t('M.otc_merchant_content_one')}}。
            </p>
            <!-- <p>{{$t('M.otc_merchant_pleaseDowload')}}<a :href= 'downLoadUrl' download="商家认证申请表 Merchant certification application form" class="businessApplyModel">《{{$t('M.otc_merchant_applyMaterial')}}》</a>，{{$t('M.otc_merchant_content_one')}}。</p> -->
            <p>{{$t('M. otc_merchant_videoKode')}}：</p>
            <p>{{$t('M.otc_merchant_detailOne')}}</p>
            <p>{{$t('M.otc_merchant_detailTwo')}}</p>
            <p>{{$t('M.otc_merchant_applyLimit')}}<spn>{{successTimes}}</spn>{{$t('M.otc_ci')}}。②{{$t('M.otc_merchant_account')}}<span>{{coinName}}</span>{{$t('M.comm_count')}}{{$t('M.otc_xu')}}≥<span>{{count}}</span></p>
            <h4 class="title">{{$t('M.otc_merchant_step2')}}</h4>
            <p>{{$t('M.otc_merchant_datailThree')}}otc@{{mainWebsite}}，{{$t('M.otc_merchant_datailFour')}}OTC{{$t('M.otc_merchant')}}”。</p>
            <h4 class="title">{{$t('M.otc_merchant_step3')}}</h4>
            <p>{{$t('M.otc_merchant_datailFive')}}{{count}} {{coinName}}{{$t('M.otc_merchant_datailSix')}}。</p>
            <h4 class="title">{{$t('M.otc_merchant_step4')}}</h4>
            <p>{{$t('M.otc_merchant_datailSeven')}}</p>
            <h4 class="title tips">
              {{$t('M.otc_merchant_loveTips')}}
              <el-button
                type="text"
                @click="businessArgument"
                class="agree font-size14"
              >
                《{{$t('M.otc_merchant_authentication')}}》
              </el-button>
            </h4>
          </div>
        </div>
        <!-- 2.2.4 同意协议部分 -->
        <div class="agree font-size12">
          <span>
            <el-checkbox
              v-model="checked"
              @change="changeVal"
            >
            </el-checkbox>
          </span>
          <span>{{$t('M.otc_merchant_readAndSure')}}</span>
          <el-button
            type="text"
            @click="businessArgument"
            class="agreement"
          >
            《{{$t('M.otc_merchant_authentication')}}》
          </el-button>
          <el-dialog
            :title="$t('M.otc_merchant_authentication')"
            :visible.sync="dialogVisible"
            width="50%"
            height="500px"
            :before-close="handleClose"
          >
            <div v-html = "argumentContent"></div>
          </el-dialog>
        </div>
        <!-- 2.2.5 申请为商家按钮部分 -->
        <div class="submit">
          <button
            class="button font-size16 cursor-pointer"
            @click="submit"
          >
            {{$t('M.otc_apply')}}{{$t('M.otc_sure')}}{{$t('M.otc_merchant')}}
          </button>
        </div>
      </div>
    </div>
    <!-- 2.2商家 申请中 页面 -->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      :style="{'min-height':(height-616)+'px'}"
      class="business-applying-content"
      v-show="applyStatus === 2"
    >
      <div class="picture">
        <img src="../../assets/develop/business-applying.png" alt="">
      </div>
      <div class="text">
        <p class="tip">{{$t('M.otc_merchant_audit')}}</p>
        <p class="tip">{{$t('M.otc_merchant_wait')}}...</p>
      </div>
    </div>
    <!-- 2.3商家 申请成功 页面 -->
    <div
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
      :style="{'min-height':(height-616)+'px'}"
      class="business-apply-success-content"
      v-show="applyStatus === 3"
    >
      <div class="picture">
        <img src="../../assets/develop/business-apply-success.png">
      </div>
      <div class="text">
        <p class="tip">{{$t('M.otc_merchant_success')}}</p>
      </div>
    </div>
    <!-- 2.4切换导航时候数据返回之前显示的缓冲界面 -->
    <div
      class="business-apply-blank"
      v-show="applyStatus === 4"
      v-loading.fullscreen.lock="fullscreenLoading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
    </div>
  </div>
</template>
<script>
import IconFontCommon from '../Common/IconFontCommon'
import {businessApply, firstEnterBusinessApply, argumentBusinessApply} from '../../utils/api/OTC'
import {returnAjaxMessage} from '../../utils/commonFunc'
import {
  // createNamespacedHelpers,
  mapState
} from 'vuex'
// const {mapMutations} = createNamespacedHelpers('OTC')
export default {
  components: {
    IconFontCommon //  字体图标
  },
  data () {
    return {
      fullscreenLoading: true, // 整页loading
      statusBlack: '', // 当为申请中和申请成功的页面时候，只有黑色主题颜色
      height: '', // 申请中 申请成功 内容的高度
      applyStatus: 1, // 商家申请状态
      checked: false, // 同意协议按钮:默认不勾选
      successTimes: '0',
      coinName: 'FUC',
      count: '0',
      dialogVisible: false, // 弹出框状态
      argumentContent: '', // 协议文件
      fileName: '商家认证申请表 Merchant certification application form', // 下载文件名字
      downLoadUrl: '' // 商家申请资料地址
    }
  },
  created () {
    // 动态获取申请中 申请成功内容的高度
    // console.log(document.documentElement.clientHeight)
    this.height = document.documentElement.clientHeight
    // console.log(this.height)
    require('../../../static/css/list/OTC/OTCBusinessApply.css')
    require('../../../static/css/theme/day/OTC/OTCBusinessApplyDay.css')
    require('../../../static/css/theme/night/OTC/OTCBusinessApplyNight.css')
    this.determineUser()
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // ...mapMutations([]),
    // 下载商家申请资料模板
    downloadApplicationForm () {
      console.log(this.downLoadUrl)
      console.log(this.fileName)
      fetch(this.downLoadUrl).then(res => res.blob().then(blob => {
        let a = document.createElement('a')
        let url = window.URL.createObjectURL(blob)
        let filename = this.fileName
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      }))
    },
    // 点击申请商家用户按钮发送请求
    submit () {
      // 点击按钮时判断商家是否登录
      if (this.isLogin) {
        if (!this.checked) {
          this.$message({
            message: this.$t('M.otc_firstSure') + this.$t('M.otc_merchant_authentication'),
            type: 'error'
          })
          return false
        }
        this.getOTCBusinessApply()
      } else {
        this.$message({showClose: true, message: this.$t('M.otc_login_pi') + '!'})
      }
    },
    // 请求申请状态
    async getOTCBusinessApply () {
      this.fullscreenLoading = true
      const data = await businessApply()
      // 提示信息
      if (!(returnAjaxMessage(data, this))) {
        this.fullscreenLoading = false
        return false
      } else {
        // 返回数据正确的逻辑
        this.fullscreenLoading = false
        if (data.data.meta.success == true) {
          this.applyStatus = 2
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
        } else {
          // 如果失败提示返回的数据
          this.$message({showClose: true, message: data.data.meta.message})
          this.applyStatus = 1
        }
      }
    },
    changeVal (e) {
      this.checked = e
    },
    // 首次点击商家申请决定进入哪个界面
    async determineUser () {
      this.fullscreenLoading = true
      // 刚进页面接口请求回来之前先展示缓冲界面
      this.applyStatus = 4
      const data = await firstEnterBusinessApply()
      console.log(' 首次点击商家申请请求数据')
      console.log(data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        // 刚进页面接口请求错误时候显示申请界面
        this.applyStatus = 1
        this.fullscreenLoading = false
        return false
      } else {
        this.fullscreenLoading = false
        // this.loadingCircle.close()
        let getData = data.data.data
        // 返回数据正确的逻辑
        this.successTimes = getData.successTimes
        this.coinName = getData.coinName
        this.count = getData.count
        this.downLoadUrl = getData.downLoadUrl
        // 返回数据的状态 1 表示展示初次进入
        if (getData.status == 1) {
          this.applyStatus = 1
        // 状态 2 表示审核正在进行中
        } else if (getData.status == 2) {
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
          this.applyStatus = 2
        // 状态 3 表示审核通过
        } else {
          this.statusBlack = 'successOrApplying' // 当为申请中和申请成功的页面时候，只有黑色主题颜色
          this.applyStatus = 3
        }
        // // 返回数据的状态 1 表示展示初次进入
        // if (getData.status == 1) {
        //   this.applyStatus = 1
        // // 状态 2 表示审核正在进行中
        // } else if (getData.status == 2) {
        //   this.applyStatus = 2
        // // 状态 3 表示审核通过
        // } else if (getData.status == 3) {
        //   this.applyStatus = 3
        // } else {
        //   this.applyStatus = 4
        // }
      }
    },
    // 商家申请界面用户协议
    async argumentBusinessApplyRequest () {
      const data = await argumentBusinessApply({
        termsTypeids: 9,
        language: this.language
      })
      console.log(data.data.data)
      // 提示信息
      if (!(returnAjaxMessage(data, this, 0))) {
        return false
      } else {
        // 返回数据地逻辑
        data.data.data.forEach(item => {
          if (item.keyword === 'OTC' + this.$t('M.comm_agreement')) {
            this.argumentContent = item.content
          }
        })
      }
    },
    businessArgument () {
      this.dialogVisible = true
      this.argumentBusinessApplyRequest()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      userInfo: state => state.user.loginStep1Info.userInfo, // 用户详细信息
      isLogin: state => state.user.isLogin, // 用户登录状态 false 未登录； true 登录
      language: state => state.common.language,
      theme: state => state.common.theme,
      mainWebsite: state => state.common.mainWebsite // 网站主网址
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
@import url(../../../static/css/scss/OTC/OTCCenter.scss);
@import "../../../static/css/scss/index";
.otc-business-apply-box{
  overflow: hidden;
  // background-color: $mainNightBgColor;
  >.business-apply-content{
    padding-top: 20px;
    >.privilege{
    width: 1150px;
    margin: 70px auto 0px;
    margin-top:107px;
      >.title{
        color: #fff;
        text-align: center;
      }
      >.content{
        display: flex;
        justify-content: space-around;
        >.common{
          margin-top: 120px;
          width: 210px;
          height: 250px;
          // background: #202740;
          position: relative;
          text-align: center;
          &::before{
            content: "";
            position: absolute;
            top: -25px;
            left: 0;
            width: 0;
            height: 0;
            border-left: 105px solid transparent;
            border-right: 105px solid transparent;
            // border-bottom: 25px solid #202740;
          }
          &::after{
            content: "";
            position: absolute;
            bottom: -25px;
            left: 0;
            width: 0;
            height: 0;
            border-left: 105px solid transparent;
            border-right: 105px solid transparent;
            // border-top: 25px solid #202740;
          }
          >.title{
            width: 83px;
            color: #338FF5;
            padding-bottom: 10px;
            font-weight: 700;
            // border-bottom: 1px dashed rgba(51, 143, 245,.3);
          }
          >.text{
            // color: #fff;
            line-height: 25px;
            margin-top: 60px;
          }
          >.location-picture{
            position: absolute;
            top: -67px;
            left: 75px;
          }
        }
      }
    }
    >.approve{
      width: 1150px;
      margin: 70px auto;
      margin-top:107px;
      >.title{
        // color: #fff;
        text-align: center;
        margin-top: 100px;
      }
      >.number{
        width: 1150px;
        height: 52px;
        line-height: 58px;
        background: url(../../assets/develop/step.png) no-repeat center;
        margin-top: 70px;
        position: relative;
        >.common{
          // color: #fff;
          font-size: 16px;
        }
        >.apply{
          // padding-left: 195px;
          position: absolute;
          left: 185px;
          top: 0;
        }
        >.send-email{
          // padding-left: 170px;
          position: absolute;
          left: 430px;
          top: 0;
        }
        >.submit-apply{
          // padding-left: 170px;
          position: absolute;
          left: 680px;
          top: 0;
        }
        >.pass{
          // padding-left: 172px;
          position: absolute;
          left: 930px;
          top: 0;
        }
      }
      >.step{
        width: 1150px;
        height: 650px;
        margin-top: 70px;
        background: url(../../assets/develop/business-apply-bgm.png) no-repeat center;
        padding-left: 238px;
        padding-top: 40px;
        // color: #8F9CA6;
        font-size: 14px;
        >.content{
          width: 620px;
          >p{
            line-height: 28px;
          }
          >.title{
            // color: #fff;
            margin-top: 30px;
            &:first-child{
              margin-top: 20px;
            }
          }
          >.tips{
            // color: #4B5D6E;
            >.agree{
              // color: #D45858;
            }
          }
        }
      }
      >.agree{
        text-align: center;
        // color: #fff;
        margin-top: 70px;
        .agreement{
          // color: #D45858;
        }
      }
      >.submit{
        text-align: center;
        margin-top: 20px;
        >.button{
          width: 300px;
          height: 50px;
          // color: #fff;
          // background: linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
          border-radius: 5px;
        }
      }
    }
  }
  >.business-applying-content,.business-apply-success-content{
    width: 1150px;
    // height: 718px;
    // height: 600px;
    margin: 70px auto;
    padding-top: 20px;
    text-align: center;
    background-color: $mainNightBgColor;
    >.picture{

    }
    >.text{
      color: #fff;
      font-size: 18px;
      margin-top: 40px;
      >.tip{
        line-height: 30px;
      }
    }
  }
  >.business-apply-success-content{
    >.picture{
      margin-top: 20px;
    }
    >.text{
      margin-top: 10px;
    }
  }
  >.business-apply-blank{
    width: 100%;
    height: 918px;
    // background-color: #272B41;
    background-color: $mainNightBgColor;
  }
  &.night{
    background-color: $mainNightBgColor;
    >.business-apply-content{
      overflow: hidden;
      >.privilege{
        >.title{
          color: #fff;
        }
        >.content{
          >.common{
            background: #202740;
            &::before{
              border-bottom: 25px solid #202740;
            }
            &::after{
              border-top: 25px solid #202740;
            }
            >.title{
              color: #338FF5;
              font-weight: 700;
              border-bottom: 1px dashed rgba(51, 143, 245,.3);
            }
            >.text{
              color: #fff;
            }
            >.location-picture{
            }
          }
        }
      }
      >.approve{
        >.title{
          color: #fff;
        }
        >.number{
          >.common{
            color: #fff;
          }
          >.apply{
          }
          >.send-email{
          }
          >.submit-apply{
          }
          >.pass{
          }
        }
        >.step{
          color: #8F9CA6;
          >.content{
            >p{
            }
            >.title{
              color: #fff;
              &:first-child{
              }
            }
            >.tips{
              color: #4B5D6E;
              >.agree{
                color: #D45858;
              }
            }
          }
        }
        >.agree{
          color: #fff;
          .agreement{
            color: #D45858;
          }
        }
        >.submit{
          >.button{
            color: #fff;
            background: linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
          }
        }
      }
    }
  }
  &.day{
    background-color: $mainDayBgColor;
    // background-color: $mainNightBgColor;
    >.business-apply-content{
      >.privilege{
        >.title{
          color: #333333;
        }
        >.content{
          >.common{
            background: #202740;
            &::before{
              border-bottom: 25px solid #202740;
            }
            &::after{
              border-top: 25px solid #202740;
            }
            >.title{
              color: #338FF5;
              font-weight: 700;
              border-bottom: 1px dashed rgba(51, 143, 245,.3);
            }
            >.text{
              color: #fff;
            }
            >.location-picture{
            }
          }
        }
      }
      >.approve{
        >.title{
          color: #333;
        }
        >.number{
          >.common{
            color: #333;
          }
          >.apply{
          }
          >.send-email{
          }
          >.submit-apply{
          }
          >.pass{
          }
        }
        >.step{
          color: #8F9CA6;
          >.content{
            >p{
            }
            >.title{
              color: #fff;
              &:first-child{
              }
            }
            >.tips{
              color: #4B5D6E;
              >.agree{
                color: #D45858;
              }
            }
          }
        }
        >.agree{
          color: #333;
          .agreement{
            color: #D45858;
          }
        }
        >.submit{
          >.button{
            color: #fff;
            background: linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
          }
        }
      }
    }
    // >.business-applying-content,.business-apply-success-content{
    //   background-color: $mainDayBgColor;
    // }
  }
  .businessApplyModel{
    color: #D45858;
    cursor: pointer;
  }
  // .footer{
  //   position: absolute;
  //   bottom:0;
  // }
}
.black.otc-business-apply-box.day{
  // 当为申请中和申请成功的页面时候，只有黑色主题颜色
  background-color: $mainNightBgColor;
}
</style>
