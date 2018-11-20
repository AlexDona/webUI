<template>
  <div
    class="news-and-notice-box"
  >
    <div class="inner-box">
      <div
        class="news-detail"
      >
        <div class="left">
          <h2>{{newDetail.newsTypeName}}</h2>
          <div class="detail-content">
            <h3 class="title">{{newDetail.title}}</h3>
            <p class="time">{{newDetail.createTime}}</p>
            <div
              class="content"
              v-html="newDetail.content"
            ></div>
          </div>
        </div>
        <div class="right">
          <div
            class="news-type-list"
            v-for="(outerItem,outIndex) in newsTypeList"
            :key="outIndex"
          >
            <h2 class="news-type-title">{{outerItem.name}}</h2>
            <ul
              class="news-type-content"
            >
              <li
                class="news-type-item cursor-pointer"
                v-for="(item,index) in detailAllNewsList[outIndex]"
                :key="index"
                @click="jumpToDetail(item)"
              >
                <span class="title">{{item.title}}</span>
                <span class="time">{{item.createTime.split(' ')[0]}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {getNewsNoticeList} from '../../utils/api/home'
import {returnAjaxMsg} from '../../utils/commonFunc'
// import {returnAjaxMsg} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {
    console.log(this.$route.query)
    this.getDetailInfo(this.$route.query.id)
    this.getAllTypeListNewsList()
  },
  mounted () {},
  activited () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {

    // 获取详情信息
    async getDetailInfo (id) {
      const data = await getNewsDetail(id)
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.showNewsList = false
        this.newDetail = data.data.data
        console.log(this.newDetail)
      }
    },
    // 获取全部type类型的前5条数据
    async getAllTypeListNewsList () {
      let params = {
        pageNum: 1,
        pageSize: 5,
        language: this.language
      }
      for (let i = 0; i < this.newsTypeList.length; i++) {
        const item = this.newsTypeList[i]
        params.newsTypeId = item.id - 0
        console.log(params)
        const data = await getNewsNoticeList(params)
        console.log(data)
        if (!returnAjaxMsg(data, this)) {
          return false
        } else {
          console.log(data)
          const targetData = data.data.data.list
          this.detailAllNewsList.push(targetData)
        }
      }
      console.log(this.detailAllNewsList)
    }
  },
  filter: {},
  computed: {
    ...mapState([
    ]),
    language: state => state.common.language
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">

</style>
