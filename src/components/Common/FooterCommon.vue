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
          <div class="introduction">
            专注于数字资产交易所领域的新一代服务平台
          </div>
          <!--分享-->
          <div class="share-box">
          </div>
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
export default {
  components: {},
  // props,
  data () {
    return {}
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
      background-color: pink;
      margin:0 auto;
      padding:50px 0;
      >.top{
        display:flex;
        >div{
          height:200px;
        }
        >.left{
          flex:1;
          background-color: green;
          >.logo{
            >img{
              width:100px;
            }
          }
        }
        >.right{
          flex:1;
          background-color: yellow;
          justify-content: center;
          display:flex;
          >.right-dl{
            flex:1;
            border:1px solid red;
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
