<!--
  author: zhaoxinlei
  create: 20190710
  description: 当前组件为 OTC 订单页面 的 OTC即时通讯组件
-->
<template lang="pug">
  .otc-im-box
    button.toggle-button.cursor-pointer(
     :class="{'has-new-msg': hasUnReadMessage}"
      @click="toggleShowIMContent('')"
    )
      Iconfont.iconfont(icon-name="icon-xiaoxi1")
    transition()
    .content-box(
      :style="{ 'top': isShowContent ? top: '40px', 'opacity': isShowContent ? '1': '0', 'z-index': isShowContent ? '2': -1}"
    )
      // 头部基础信息（头像、 名称、近30天交易）
      .header
        // 头像、
        .h-left
          // 头像
          .avatar 城
          //  昵称
          span.nick-name {{nickName}}
          // 最近成交
          .resent-deal
            span.label {{recentDealLabel}}
            span.value {{recentDealCount}}笔
        .h-right
          button.close-button(
            @click="toggleShowIMContent('close')"
          )
            Iconfont.iconfont(icon-name="icon-cha-")
      // 聊天内容
      .bottom
        // 聊天内容
        .chat-box
          .inner-box(v-if="messages.length")
            .message(v-for="(message, index) in messages")
              // 系统消息
              .system-msg(v-if="message.messageType == 'sysMsg'")
                .avatar
                  Iconfont.iconfont(icon-name="icon-kefu1")
                .content
                  p.date 2019/03/12
                  p.msg-content {{message.messageContent}}
                  p.time 15:03:50
              // 对方的消息
              .opposite-msg(v-else-if="message.userId !== $userInfo_X.id")
                .avatar 成
                .content
                  p.date 2019/03/12n
                  p.msg-content {{message.messageContent}}
                  p.time 15:03:50
              //  自己的消息
              .self-msg(v-else)
                .avatar 成
                .content
                  p.date 2019/03/12
                  p.msg-content {{message.messageContent}}
                  p.time 15:03:50
        //  发送聊天内容
        .send-chat-box
          .inner-box
            el-input.edit-box(
              type="textarea"
              :placeholder="editPlaceholder"
              :class="{'has-content': editText}"
              v-model="editText"
              :disabled="IsOver24Hours"
              @keyup.native.enter="sendMessage"
            )
            el-upload.image-button(
              :action="uploadUrl"
              :headers="{'token':token,'x-domain':xDomain}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :on-error="imgUploadError"
              :before-upload="beforeAvatarUpload"
              :on-exceed="handleExceed"
            )
              Iconfont.iconfont(icon-name="icon-tupian")
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import {getIMHistoryRecordAJAX} from '../../utils/api/OTC_IM'
import mixins from '../../mixins/user'
import {apiCommonUrl, xDomain} from '../../utils/env'
import {getCookie} from '../../utils'
export default {
  name: 'OTC_IM',
  mixins: [mixins],
  // components: {},
  props: {
    // 当前订单信息
    orderInfo: {
      type: Object
    },
    top: {
      type: String
    }
  },
  data () {
    return {
      xDomain: xDomain,
      token: getCookie('token'),
      uploadUrl: `${apiCommonUrl}uploadfile`, // 上传图片地址
      nickName: '诚信商贸',
      recentDealLabel: '近30天成交',
      // 最近30天成交笔数
      recentDealCount: 30,
      isShowSelf: false,
      editPlaceholder: '下单24H后不能聊天',
      imageInputRef: 'image-input',
      editText: '',
      messages: []
    }
  },
  // created () {},
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_IM_BOX_SHOW_STATUS_M'
    ]),
    sendMessage () {
      // {
      //   "messageContent":"你好，哈哈哈哈哈哈",  //消息内容，为普通文字或者图片url
      //   "userId":"329190053282578432",      //当前用户id
      //   "sellId":"329190053282578434",      //订单对方id
      //   "messageType":"text",               //消息类型，目前取值：text（发送的是文字）,img（发送的是图片）
      //   "orderId":"329566371228680192",     //订单id
      //   "action":"sendMessage"   //请求的动作:“updateState”修改消息状态为已读;“sendMessage”发送聊天内容
      // }
      if (!this.editText) return
      const {id} = this.$userInfo_X
      this.IMSocket_S.send({
        'messageContent': this.editText,
        'userId': id,
        'sellId': this.sellId,
        'messageType': 'text',
        'orderId': this.orderId,
        'action': 'sendMessage'
      })
      this.editText = ''
      this.receiveMessage()
    },
    sendImage () {
      const {id} = this.$userInfo_X
      this.IMSocket_S.send({
        'messageContent': this.editText,
        'userId': id,
        'sellId': this.sellId,
        'messageType': 'img',
        'orderId': this.orderId,
        'action': 'sendMessage'
      })
    },
    async toggleShowIMContent (status) {
      // this.isShowSelf = !this.isShowSelf
      this.messages = []
      if (!this.IMBoxShowStatusMap_S[this.orderId]) {
        const data = await getIMHistoryRecordAJAX({orderId: this.orderId})
        console.log(data)
        this.messages = _.get(data, 'data')
      }

      if (status) {
        this.UPDATE_IM_BOX_SHOW_STATUS_M({
          orderId: this.orderId,
          status: status == 'close' ? false : true
        })
      } else {
        this.UPDATE_IM_BOX_SHOW_STATUS_M({
          orderId: this.orderId,
          status: !this.IMBoxShowStatusMap_S[this.orderId]
        })
      }
    },
    // 回调消息
    receiveMessage () {
      this.IMSocket_S.on('message', (e) => {
        console.log(e)
        this.messages.push(e)
      })
    }
  },
  // filters: {},
  computed: {
    ...mapState({
      IMBoxShowStatusMap_S: state => state.OTC.IMBoxShowStatusMap_S,
      IMSocket_S: state => state.OTC.OTCIMSocket_S
    }),
    sellId () {
      return _.get(this.orderInfo, 'sellId')
    },
    orderId () {
      return _.get(this.orderInfo, 'id')
    },
    hasUnReadMessage () {
      return _.get(this.orderInfo, 'hasUnReadMessage')
    },
    IsOver24Hours () {
      return _.get(this.orderInfo, 'IsOver24Hours')
    },
    isShowContent () {
      return this.IMBoxShowStatusMap_S[this.orderId]
    }
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .otc-im-box
    vertical-align middle
    width 20px
    height 20px
    position relative
    /* 聊天框显示隐藏状态 */
    > .toggle-button
      width 35px
      height 35px
      position relative
      vertical-align middle
      padding 0
      >.iconfont
        font-size 20px
      /* 新消息提醒 */
      &.has-new-msg
        &:after
          content ''
          width 5px
          height 5px
          border-radius 50%
          background-color S_error_color
          position absolute
          top 8px
          right 8px
          transform translate(50%, -25%)
    // 聊天主窗口
    >.content-box
      overflow hidden
      position absolute
      width 320px
      height 410px
      right -25px
      background-color S_night_main_bg
      transition all .4s
      z-index 2
      box-shadow 0 7px 10px rgba(0,0,0,0.4)
      >.header
        height 49px
        line-height 49px
        border-radius 5px 5px 0 0
        background-color #1d2535
        display flex
        justify-items center
        justify-content space-between
        /*padding-top 10px*/
        box-sizing border-box
        align-items center
        padding 0 10px

        >.h-left
          display flex
          align-items center
          >.avatar
            width 30px
            height 30px
            line-height 30px
            border-radius 50%
            vertical-align middle
            background linear-gradient(0deg,rgba(43,58,110,1), rgba(42,80,129,1))
            font-size 14px
            text-align center
            color #7D90AC
            margin-right 16px
          >.nick-name
            vertical-align middle
            display inline-block
            color #fff
            font-size 14px
          >.resent-deal
            font-size 12px
            color #fff
            margin 0 12px
        >.h-right
          .close-button
            width 16px
            height 16px
            border-radius 50%
            background-color #9da5b3
            cursor pointer
            padding 0
            &:hover
              >.iconfont
                color S_main_color
            >.iconfont
              font-size 14px
              color #fff
      >.bottom
        background-color #242d41
        >.chat-box
          height 309px
          /*background-color pink*/
          overflow-y auto
          >.inner-box
            /*min-height 350px*/
            /*background-color green*/
            padding 15px
            box-sizing border-box
            >.message
              /* 客服信息 */
              >.system-msg,
              >.opposite-msg,
              >.self-msg
                display flex
                margin-bottom 20px
                >.avatar
                  min-width 30px
                  margin-right 10px
                  >.iconfont
                    font-size 30px
                >.content
                  p
                    line-height 18px
                    &.msg-content
                      color #8BA0CA
                      max-width 160px
              >.opposite-msg,
              >.self-msg
                >.avatar
                  border-radius 50%
                  height 30px
                  line-height 30px
                  background-color pink
                  text-align center
                  font-size 14px
                  background linear-gradient(0deg,rgba(43,58,110,1),rgba(42,80,129,1))
                  position relative
                  top 20px
                >.content
                  p
                    &.msg-content
                      color #fff
              >.opposite-msg
                >.avatar
                  /*margin-top 35px*/
                >.content
                  >.msg-content
                    background-color #5675a3
                    border-radius 15px
                    padding 6px 18px
              >.self-msg
                text-align right
                flex-direction row-reverse
                >.content
                  >.msg-content
                    background-color S_main_color
                    border-radius 15px
                    padding 6px 18px
                    text-align left
                    margin-right 10px
        /* 发送消息框 */
        >.send-chat-box
          height 52px
          box-sizing border-box
          background-color #242d41
          >.inner-box
            display flex
            margin 0 15px
            border-radius 5px
            background-color #fff
            overflow hidden
            /deep/
              /* 编辑框 */
              .edit-box
                > textarea
                  flex 1
                  border none
                  outline none
                  height 40px
                  box-sizing border-box
                  background-color #fff
                  font-size 12px
                  padding 0 10px
                  line-height 40px
                &.has-content
                  >textarea
                    line-height 16px
            >.image-button
                margin 8px 15px
                width 22px
                height 22px
                padding 0
                cursor pointer
                .iconfont
                  font-size 25px
                  color #2b4477
</style>
