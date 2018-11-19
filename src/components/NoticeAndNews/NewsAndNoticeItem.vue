<template>
  <div
    class="demo-box"
  >
    <div class="inner-box">
      newItem
      <!--<div-->
        <!--class="news-detail"-->
        <!--v-show="!showNewsList"-->
      <!--&gt;-->
        <!--<div class="left">-->
          <!--<h2>{{newDetail.newsTypeName}}</h2>-->
          <!--<div class="detail-content">-->
            <!--<h3 class="title">{{newDetail.title}}</h3>-->
            <!--<p class="time">{{newDetail.createTime}}</p>-->
            <!--<div-->
              <!--class="content"-->
              <!--v-html="newDetail.content"-->
            <!--&gt;</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="right">-->
          <!--<div-->
            <!--class="news-type-list"-->
            <!--v-for="(outerItem,outIndex) in newsTypeList"-->
            <!--:key="outIndex"-->
          <!--&gt;-->
            <!--<h2 class="news-type-title">{{outerItem.name}}</h2>-->
            <!--<ul-->
              <!--class="news-type-content"-->
            <!--&gt;-->
              <!--<li-->
                <!--class="news-type-item cursor-pointer"-->
                <!--v-for="(item,index) in detailAllNewsList[outIndex]"-->
                <!--:key="index"-->
                <!--@click="jumpToDetail(item)"-->
              <!--&gt;-->
                <!--<span class="title">{{item.title}}</span>-->
                <!--<span class="time">{{item.createTime.split(' ')[0]}}</span>-->
              <!--</li>-->
            <!--</ul>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState([
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">

</style>
