<template>
  <div class="footer-box common">
    <div class="inner-box">
      <!--顶部-->
      <div class="top">
        <div class="left">
          <!--logo-->
          <div class="logo">
            <img src="../../assets/develop/logo.png">
          </div>
          <!--简介-->
          <div class="introduction font-size12">
            专注于数字资产交易所领域的新一代服务平台
          </div>
          <!--分享-->
          <ul class="share-box">
            <li
              class="share-item"
              v-for="(item,index) in shareList"
              :key="index"
            >
              <div class="hidden-box">
                <img
                  :src="item.ercodeSrc"
                >
              </div>
              <div class="mini-icon">
                <Iconfont
                  :icon-name="item.iconName"
                  class-name="icon-text"
                />
              </div>
            </li>
          </ul>
        </div>
        <div class="right">
          <dl class="right-dl">
            <dt class="title">下载</dt>
            <dd class="dd-item">客户端下载</dd>
            <dd class="dd-item">帮助中心</dd>
            <dd class="dd-item" >API文档</dd>
            <dd class="dd-item">币种资料</dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">关于</dt>
            <dd class="dd-item">关于我们</dd>
            <dd class="dd-item">加入我们</dd>
            <dd class="dd-item">新闻公告</dd>
          </dl>
          <dl class="right-dl">
            <dt class="title">说明</dt>
            <dd class="dd-item">条款说明</dd>
            <dd class="dd-item">用户协议</dd>
            <dd class="dd-item">隐私条款</dd>
            <dd class="dd-item">法律声明</dd>
            <dd class="dd-item">费率</dd>
          </dl>
        </div>
      </div>
      <!--底部友情链接-->
      <div class="bottom">
        <span>友情链接</span>
        <ul class="links-list">
          <li classs="links-item">
            <span class="logo"></span>
            <span>金色财经</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Iconfont from '../Common/IconFontCommon'
export default {
  components: {
    Iconfont
  },
  // props,
  data () {
    return {
      ercodeImgSrc: 'https://old.fubt.top/front/images/index/wechat.jpg',
      shareList: [
        {
          iconName: 'icon-twitter',
          ercodeSrc: 'https://old.fubt.top/front/images/index/wechat.jpg'
        },
        {
          iconName: 'icon-twitter',
          ercodeSrc: 'https://old.fubt.top/front/images/index/wechat.jpg'
        },
        {
          iconName: 'icon-twitter',
          ercodeSrc: 'https://old.fubt.top/front/images/index/wechat.jpg'
        },
        {
          iconName: 'icon-twitter',
          ercodeSrc: 'https://old.fubt.top/front/images/index/wechat.jpg'
        },
        {
          iconName: 'icon-twitter',
          ercodeSrc: 'https://old.fubt.top/front/images/index/wechat.jpg'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="scss">
  .footer-box{
    width:100%;
    height:410px;
    background-color: #1c2237;
    color:#838dae;
    >.inner-box{
      width:1130px;
      height:300px;
      margin:0 auto;
      padding:50px 0;
      >.top{
        display:flex;
        >div{
          height:200px;
        }
        >.left{
          flex:1;
          >.logo{
            >img{
              width:100px;
            }
          }
          .introduction{
            margin-top:20px;
          }
          /**/
          >.share-box{
            margin-top:20px;
            >.share-item{
              position: relative;
              width:20px;
              height:20px;
              display:inline-block;
              margin-right:10px;
              >.mini-icon{
                width:20px;
                height:20px;
                line-height:16px;
                background-color: #CFCFCF;
                border-radius: 50%;
                text-align: center;
                .icon{
                  font-size: 16px;
                  color:#1e2636;
                }
              }
              >.hidden-box{
                width:110px;
                height:110px;
                background-color: green;
                position: absolute;
                top:-120px;
                left:50%;
                transform: translate(-50%,0);
                >img{
                  width:110px;
                }
              }
            }
          }
        }
        >.right{
          flex:1;
          justify-content: center;
          display:flex;
          >.right-dl{
            flex:1;
            margin-left:5%;
            >.title{
              height:50px;
              line-height:50px;
            }
            >.dd-item{
              line-height: 25px;
            }
          }
        }
      }
    }
  }
</style>
