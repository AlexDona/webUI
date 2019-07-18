<!--
  author: zhaoxinlei
  create: 20190715
  description: 当前组件为 OTC 及时通讯页面的 消息详情组件
-->
<template lang="pug">
  .content
    p.date(v-show="isShowDate")
      span {{date}}
    p.msg-content(v-if="messageType !=='img'") {{messageContent}}
    img.image.cursor-pointer(
      v-else
      @click="previewImage(messageContent)"
      :src="messageContent"
    )
    p.time {{time}}
</template>
<script>
// import { getLanguagesAJAX } from '../utils/API/common'
import {timeFilter} from '../../utils'
export default {
  name: 'the-otc-im-content',
  // mixins: [],
  // components: {},
  props: {
    message: {
      type: Object
    },
    // 是否显示 日期
    isShowDate: {
      type: Boolean,
      default: true
    }
  },
  // data () {
  //   return {}
  // }
  // created () {
  // },
  // mounted () {}
  // deactivated () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    previewImage (messageContent) {
      this.$emit('previewImage', messageContent)
    }
  },
  // filters: {},
  computed: {
    messageType () {
      return _.get(this.message, 'messageType')
    },
    messageContent () {
      return _.get(this.message, 'messageContent')
    },
    dateTime () {
      return _.get(this.message, 'createTime') - 0
    },
    date () {
      return timeFilter(this.dateTime, 'date', '/')
    },
    time () {
      return timeFilter(this.dateTime, 'time')
    }
  },
  watch: {
    message (New) {
      console.log(New)
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .content
    margin 0 10px 0 0
    position relative
    .date
      text-align center
      height 15px
      position absolute
      top -25px
      width 212px
    .time
      margin-top 10px
    p
      line-height 18px
      &.msg-content
        color #8BA0CA
        max-width 190px
        word-break break-word
        box-sizing border-box
    .image
      height 68px
      max-width 190px
      border 2px solid S_main_color
      border-radius 15px
</style>
