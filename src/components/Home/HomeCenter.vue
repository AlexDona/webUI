<template>
  <!--首页盒子-->
  <div class="home-box home">

    <!--banner-->
    <keep-alive>
      <BannerHome/>
    </keep-alive>

    <!--交易区-->
    <MarketListHome class="margin-1"/>

    <!--底部-->
  </div>
</template>
<script>
import NoticeHome from './NoticeHome'
import BannerHome from './BannerHome'
import MarketListHome from './MarketListHome'
export default {
  components: {
    NoticeHome,
    BannerHome,
    MarketListHome
  },
  data () {
    return {

    }
  }
}
</script>
<style scoped lang="scss">
  .home-box{
    min-width: 1130px;
    overflow: hidden;
    .margin-1{
      margin-top:-1px;
    }
    >.fixed{
      position: fixed;
      z-index: 2009;
    }
  }
</style>
