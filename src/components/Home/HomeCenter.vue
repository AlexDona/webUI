<template>
  <!--首页盒子-->
  <div class="home-box home">

    <!--公告-->
    <NoticeHome/>

    <!--导航-->
    <NavCommon/>

    <!--banner-->
    <BannerHome/>

    <!--交易区-->
    <MarketListHome/>

    <!--底部-->
    <FooterCommon/>
  </div>
</template>
<script>
import NoticeHome from './NoticeHome'
import NavCommon from '../Common/HeaderCommon'
import BannerHome from './BannerHome'
import FooterCommon from '../Common/FooterCommon'
import MarketListHome from './MarketListHome'
export default {
  components: {
    NoticeHome,
    NavCommon,
    BannerHome,
    FooterCommon,
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
    >.fixed{
      position: fixed;
      z-index: 2009;
    }
  }
</style>
