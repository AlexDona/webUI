<template>
  <!--首页公告-->
  <div class="notice-box home">
    <div class="inner-box">
      <div
        class="item"
        v-for="(item,index) in noticeList"
        :key="index"
      >
        <router-link to="/">
          <span class="type">【{{item.typeName}}】</span>
          <span>{{item.title}}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
export default {
  components: {},
  // props,
  data () {
    return {
      noticeList: [] // 新闻（公告）列表
    }
  },
  created () {
    this.noticeList = [
      {
        id: 0, // 跳转id
        type: 0, // 0:新闻 1:公告
        typeName: '新闻资讯', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线' // 标题
      },
      {
        id: 1, // 跳转id
        type: 1, // 0:新闻 1:公告
        typeName: '活动公告', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线1' // 标题
      },
      {
        id: 2, // 跳转id
        type: 0, // 0:新闻 1:公告
        typeName: '新闻资讯', // type=0:'新闻资讯' type=1:'活动公告'
        title: 'fuc火热上线2' // 标题
      }
    ]
  },
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
  @import '../../../static/css/scss/index';
  .notice-box{
    height:30px;
    width:100%;
    background-color: #0a1b2f;
    color:#8b8e92;
    line-height: 30px;
    /*position: fixed;*/
    top:0;
    .inner-box{
      padding:0 30px;
      >.item{
        >a{
          >.type {
            color:$mainColor;
          }
          color:#fff;
        }
      }
    }
  }
</style>
