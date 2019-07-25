<!--
  author: zhaoxinlei
  create: 20190710
  description: 当前组件为 OTC 订单页面 的 OTC即时通讯组件
-->
<template lang="pug">
  .otc-im-box(
    :class="{'day':$theme_S_X == 'day','night':$theme_S_X == 'night' }"
  )
    button.toggle-button.cursor-pointer(
     :class="{'has-new-msg': hasUnReadMessage}"
      @click="toggleShowIMContent('')"
    )
      Iconfont.iconfont(icon-name="icon-xiaoxi1")
    .content-box(
      :style="{ 'top': isShowContent ? top: '40px', 'opacity': isShowContent ? '1': '0', 'z-index': isShowContent ? '2': -1}"
    )
      // 头部基础信息（头像、 名称、近30天交易）
      .header
        // 头像、
        .h-left
          // 头像
          .avatar {{oppositeShortNickName}}
          //  昵称
          span.nick-name {{oppositeNickName}}
        .h-right
          button.close-button(
            @click="toggleShowIMContent('close')"
          )
            Iconfont.iconfont(icon-name="icon-cha-")
      // 聊天内容
      .bottom
        // 聊天内容
        .chat-box
          .inner-box(
            v-show="messages.length"
            :id="`chat${orderId}`"
          )
            .message(
              v-for="(message, msgIndex) in messages"
              :style="{'margin-top': isShowDate(msgIndex, message.createTime,messages) && msgIndex > 0 ? '50px': '20px' }"
            )
              // 系统消息
              .system-msg(v-if="message.messageType == 'sysMsg'")
                .avatar
                  Iconfont.iconfont(icon-name="icon-kefu1")
                TheOTCIMContent(
                  :isShowDate="msgIndex|isShowDate(message.createTime, messages)"
                  :message="message"
                  @previewImage="previewImage"
                )
              // 对方的消息
              .opposite-msg(v-else-if="message.userId !== $userInfo_X.id")
                .avatar {{oppositeShortNickName}}
                TheOTCIMContent(
                  :isShowDate="msgIndex|isShowDate(message.createTime, messages)"
                  :message="message"
                  @previewImage="previewImage"
                )
              //  自己的消息
              .self-msg(v-else)
                .avatar {{selfShortNickName}}
                TheOTCIMContent(
                  :isShowDate="msgIndex|isShowDate(message.createTime, messages)"
                  :message="message"
                  @previewImage="previewImage"
                )
        //  发送聊天内容
        .send-chat-box
          .inner-box(:class="{disabled: IsOver24Hours}")
            textarea.edit-box(
              :placeholder="$t(editPlaceholder)"
              :class="{'has-content': editText}"
              :ref="`${orderId}textarea`"
              :disabled="IsOver24Hours"
              @keydown="sendMessageByEnter"
              @input="handleChangeWatch"
            )
            el-button.send-button(
              v-if="editText"
              @click="sendMessage"
              :disabled="IsOver24Hours"
            ) {{$t('M.login_send')}}
            // 上传图片
            UploadImage.image-button(
              v-else
              :isNeedSuccessTips="false"
              @uploadSuccess="uploadSuccess"
              :disabled="IsOver24Hours"
            )
              Iconfont.iconfont(icon-name="icon-tupian")
    .shadow-box(
      v-show="isShowShadow"
      @click.stop="toggleShowShadow(false)"
    )
      .inner-box(v-show="isShowShadow")
        img(
          :src="shadowImage"
          :style="{transform:`translate(-50%, -50%)  rotate(${targetDeg}deg)`}"
          )
      button.rotate-button(@click.stop="rotateShadow")
        Iconfont.iconfont(icon-name="icon-xuanzhuan")
</template>
<script>
import {mapState, mapMutations} from 'vuex'
import {getIMHistoryRecordAJAX, updateIMStatusAJAX} from '../../utils/api/OTC_IM'
import mixins from '../../mixins/user'
import UploadImage from '../Common/UploadImage'
import TheOTCIMContent from './TheOTCIMContent'
export default {
  name: 'OTC_IM',
  mixins: [mixins],
  components: {
    UploadImage,
    TheOTCIMContent
  },
  props: {
    activeName: {
      type: String
    },
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
      isShowSelf: false,
      editPlaceholder: 'M.otc_im_edit_placeholder',
      imageInputRef: 'image-input',
      editText: '',
      messages: [],
      shadowImage: '',
      isShowShadow: false,
      targetDeg: 0,
      // 当前消息是否超时
      currentIsOver24Hours: false
    }
  },
  // created () {},
  mounted () {
    this.receiveMessage()
  },
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'UPDATE_IM_BOX_SHOW_STATUS_M',
      'SET_LEGAL_TENDER_REFLASH_STATUS',
      'UPDATE_IM_HAS_NEW_MESSAGE_MAP_M'
    ]),
    handleChangeWatch (e) {
      this.editText = e.target.value
    },
    sendMessageByEnter (e) {
      if (e.keyCode == 13) {
        this.sendMessage()
        e.preventDefault()
        return false
      }
    },
    // 发送图片成功回调
    uploadSuccess ({type, index, url}) {
      console.log(type, index, url)
      this.sendImage(url)
    },
    previewImage (url) {
      this.shadowImage = url
      this.toggleShowShadow(true)
    },
    toggleShowShadow (status) {
      this.isShowShadow = status
      if (!status) this.targetDeg = 0
    },
    rotateShadow () {
      this.targetDeg += 90
    },
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
        'messageType': 'text',
        'orderId': this.orderId,
        'action': 'sendMessage'
      })
      this.editText = ''
      this.$refs[`${this.orderId}textarea`].value = ''
      this.receiveMessage()
    },
    sendImage (url) {
      const {id} = this.$userInfo_X
      this.IMSocket_S.send({
        'messageContent': url,
        'userId': id,
        'messageType': 'img',
        'orderId': this.orderId,
        'action': 'sendMessage'
      })
      this.receiveMessage()
    },
    async toggleShowIMContent (status) {
      this.receiveMessage()
      // this.isShowSelf = !this.isShowSelf
      this.messages = []
      // 开启聊天
      if (!this.IMBoxShowStatusMap_S[this.orderId]) {
        const data = await getIMHistoryRecordAJAX({orderId: this.orderId})
        // console.log(data)
        this.messages = _.get(data, 'data')
        this.UPDATE_IM_HAS_NEW_MESSAGE_MAP_M({orderId: this.orderId, status: false})
      }

      // 关闭聊天
      if (this.IMBoxShowStatusMap_S[this.orderId]) {
        await this.updateIMStatus()
        this.SET_LEGAL_TENDER_REFLASH_STATUS({
          type: this.activeName,
          status: true
        })
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
      this.resetDOMScroll(this.chatDOM.scrollHeight)
    },
    resetDOMScroll (height) {
      this.chatDOM.scrollTop = height
    },
    // 回调消息
    receiveMessage () {
      this.IMSocket_S.on('message', (e) => {
        const {isOppositeMsg, orderId, isOver24Hours} = e
        this.currentIsOver24Hours = isOver24Hours
        console.log(orderId, this.orderId, e)
        this.UPDATE_IM_HAS_NEW_MESSAGE_MAP_M({
          orderId,
          status: isOppositeMsg
        })

        this.messages.push(e)
        console.log(this.messages)
        this.$nextTick(() => {
          this.resetDOMScroll(this.chatDOM.scrollHeight)
        })
      })
    },
    isShowDate (index, createTime, messages) {
      let currentDate = new Date(createTime - 0).getDay()
      let lastDate = new Date((messages[(index > 0 ? index - 1 : index) ].createTime - 0)).getDay()
      return index > 0 && currentDate == lastDate ? false : true
    },
    // 更新当前订单已读未读状态
    async updateIMStatus () {
      const {id} = this.$userInfo_X

      let params = {
        orderId: this.orderId,
        userId: id
      }

      await updateIMStatusAJAX(params)
      // if (!data) return
      // console.log(data)
    }
  },
  filters: {
    isShowDate: function (index, createTime, messages) {
      let currentDate = new Date(createTime - 0).getDay()
      let lastDate = new Date((messages[(index > 0 ? index - 1 : index) ].createTime - 0)).getDay()
      return index > 0 && currentDate == lastDate ? false : true
    }
  },
  computed: {
    ...mapState({
      IMBoxShowStatusMap_S: state => state.OTC.IMBoxShowStatusMap_S,
      IMHasNewMessageMap_S: state => state.OTC.IMHasNewMessageMap_S,
      IMSocket_S: state => state.OTC.OTCIMSocket_S
    }),
    chatDOM () {
      return document.getElementById(`chat${this.orderId}`)
    },
    orderId () {
      return _.get(this.orderInfo, 'id')
    },
    hasUnReadMessage () {
      // 有新消息：
      // 1、 后台返回有新消息 且 聊天窗口 处于 关闭状态
      // 2、 有socket 推送且处于 关闭状态
      return (!this.isShowContent && this.IMHasNewMessageMap_S[this.orderId]) || (_.get(this.orderInfo, 'hasUnReadMessage') && !this.isShowContent)
    },
    IsOver24Hours () {
      return _.get(this.orderInfo, 'isOver24Hours') || this.currentIsOver24Hours
    },
    currencyId () {
      return _.get(this.orderInfo, 'currencyId')
    },
    coinId () {
      return _.get(this.orderInfo, 'coinId')
    },
    buyId () {
      return _.get(this.orderInfo, 'buyId')
    },
    sellNickName () {
      return _.get(this.orderInfo, 'sellNickName')
    },
    buyNickName () {
      return _.get(this.orderInfo, 'buyNickName')
    },
    // 当前聊天用户 昵称
    selfNickName () {
      const {id} = this.$userInfo_X
      return id == this.buyId ? this.buyNickName : this.sellNickName
    },
    // 当前聊天对方用户 昵称
    oppositeNickName () {
      return this.selfNickName == this.buyNickName ? this.sellNickName : this.buyNickName
    },
    selfShortNickName () {
      return this.selfNickName.length ? this.selfNickName.substring(0, 1) : ''
    },
    oppositeShortNickName () {
      return this.oppositeNickName.length ? this.oppositeNickName.substring(0, 1) : ''
    },
    isShowContent () {
      return this.IMBoxShowStatusMap_S[this.orderId]
    }
  },
  watch: {
    isShowContent (New) {
      if (New) {
        this.$nextTick(() => {
          this.resetDOMScroll(this.chatDOM.scrollHeight)
        })
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .otc-im-box
    vertical-align middle
    width 20px
    height 20px
    position relative
    .shadow-box
      width 100%
      height 100%
      background-color rgba(0, 0, 0, .6)
      position fixed
      left 0
      top 0
      z-index 1000000
      text-align center
      >.inner-box
        height 800px
        width 800px
        margin 50px auto 50px
        line-height 600px
        position relative
        >img
          position absolute
          top 50%
          left 50%
          max-width 800px
          max-height 800px
          transition all .4s
      >.rotate-button
        padding 10px
        cursor pointer
        >.iconfont
          font-size 40px
          color #fff
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
          height 300px
          margin 5px 0
          overflow hidden
          >.inner-box
            height 300px
            overflow-y auto
            /*background-color green*/
            padding 25px 15px
            box-sizing border-box
            >.message
              margin-bottom -25px
              border 1px solid transparent
              /* 客服信息 */
              >.system-msg,
              >.opposite-msg,
              >.self-msg
                display flex
                margin-bottom 20px
                >.avatar
                  min-width 30px
                  margin-right 10px
                  position relative
                  >.iconfont
                    font-size 30px
              >.opposite-msg,
              >.self-msg
                >.avatar
                  border-radius 50%
                  height 30px
                  line-height 30px
                  text-align center
                  font-size 14px
                  // background linear-gradient(0deg,rgba(43,58,110,1),rgba(42,80,129,1))
                  background pink
                /deep/
                  .content
                    p
                      &.msg-content
                        color #fff
                        position relative
                        &:after
                          content ''
                          width 0
                          height 0
                          position absolute
                          top 15px
                          transform translateY(-50%)
              >.opposite-msg
                >.avatar
                  /*margin-top 35px*/
                /deep/
                  .content
                    >.msg-content
                      background-color #5675a3
                      border-radius 15px
                      padding 6px 17px
                      &:after
                        left -6px
                        border-right 8px solid #5675a3
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
              >.self-msg
                text-align right
                flex-direction row-reverse
                /deep/
                  .content
                    >.date
                      right 0
                    >.msg-content
                      background-color S_main_color
                      border-radius 15px
                      padding 6px 17px
                      text-align left
                      &:after
                        right -6px
                        border-left 8px solid S_main_color
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
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
            &.disabled
              .edit-box
                background-color #e5e5e5
            /deep/
              /* 编辑框 */
              .edit-box
                flex 1
                border none
                outline none
                height 40px
                box-sizing border-box
                background-color #fff
                font-size 12px
                padding 0 10px
                line-height 16px
                border-radius 0
                padding-top 12px
                &:disabled
                  cursor not-allowed
                &.has-content
                  background-color transparent
              .send-button
                background-color S_main_color !important
                padding 5px 10px
                height 25px
                margin 7px 10px
                border none
                color #fff
                font-size 12px
            >.image-button
              margin 8px 15px
              width 22px
              height 22px
              padding 0
              .iconfont
                vertical-align top
                font-size 25px
                color #2b4477
    &.night
      // 聊天主窗口
      >.content-box
        background-color #242d41
        box-shadow 0 7px 10px rgba(0,0,0,0.4)
        >.header
          background-color #1d2535

          >.h-left
            >.avatar
              background linear-gradient(0deg,rgba(43,58,110,1), rgba(42,80,129,1))
              color #7D90AC
            >.nick-name
              color #fff
            >.resent-deal
              color #fff
          >.h-right
            .close-button
              background-color #9da5b3
              &:hover
                >.iconfont
                  color S_main_color
              >.iconfont
                color #fff
        >.bottom
          background-color #242d41
          >.chat-box
            >.inner-box
              >.message
                /* 客服信息 */
                >.opposite-msg,
                >.self-msg
                  >.avatar
                    background linear-gradient(0deg,rgba(43,58,110,1),rgba(42,80,129,1))
                  /deep/
                  .content
                    p
                      &.msg-content
                        color #fff
                >.opposite-msg
                  >.avatar
                  /deep/
                  .content
                    >.msg-content
                      background-color #5675a3
                      &:after
                        border-right 8px solid #5675a3
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
                >.self-msg
                  >.avatar
                    background S_main_color
                    color #fff
                  /deep/
                  .content
                    >.date
                      right 0
                    >.msg-content
                      background-color S_main_color
                      &:after
                        right -6px
                        border-left 8px solid S_main_color
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
          /* 发送消息框 */
          >.send-chat-box
            background-color #242d41
            >.inner-box
              background-color #fff
              &.disabled
                .edit-box
                  background-color #e5e5e5
                .upload-image
                  &:hover
                    cursor not-allowed
              /deep/
                /* 编辑框 */
              .edit-box
                > textarea
                  border none
                  outline none
                  background-color #fff
              >.image-button
                .iconfont
                  color #2b4477
              &.disabled
                background-color #e5e5e5
                /deep/
                  /* 编辑框 */
                  .edit-box
                    > textarea
                      background-color #e5e5e5
                  >.image-button
                    .iconfont
                      color #ccc
    &.day
      // 聊天主窗口
      >.content-box
        background-color #fff
        border 1px solid  rgba(72, 87, 118, 0.1)
        box-shadow 0 8px 6px #cfd5df
        >.header
          background-color #fff
          border-bottom 1px solid #f2f3f3
          >.h-left
            >.avatar
              color #fff
            >.nick-name
              color #7D90AC
            >.resent-deal
              color #7D90AC
          >.h-right
            .close-button
              background-color: #9da5b3
              &:hover
                >.iconfont
                  color S_main_color
              >.iconfont
                color #fff
        >.bottom
          background-color #fff
          >.chat-box
            >.inner-box
              >.message
                /* 客服信息 */
                >.system-msg,
                >.opposite-msg,
                >.self-msg
                  /deep/
                    .date,.time
                      color #7D90AC
                >.system-msg
                  >.avatar
                    >.iconfont
                      color #7D90AC
                >.opposite-msg,
                >.self-msg
                  >.avatar
                    color #fff
                    background linear-gradient(0deg,rgba(43,58,110,1),rgba(42,80,129,1))
                  /deep/
                  .content
                    p
                      &.msg-content
                        color #fff
                >.opposite-msg
                  >.avatar
                  /deep/
                  .content
                    >.msg-content
                      background-color #5675a3
                      &:after
                        border-right 8px solid #5675a3
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
                >.self-msg
                  >.avatar
                    background S_main_color
                  /deep/
                  .content
                    >.date
                      right 0
                    >.msg-content
                      background-color S_main_color
                      &:after
                        right -6px
                        border-left 8px solid S_main_color
                        border-top 7px solid transparent
                        border-bottom 7px solid transparent
          /* 发送消息框 */
          >.send-chat-box
            background-color #fff
            >.inner-box
              background-color #EAF4FE
              /deep/
                /* 编辑框 */
                .edit-box
                  > textarea
                    border none
                    outline none
                    background-color #EAF4FE
                >.image-button
                  .iconfont
                    color S_main_color
              &.disabled
                background-color #e5e5e5
                /deep/
                  /* 编辑框 */
                  .edit-box
                    > textarea
                      background-color #e5e5e5
                  >.image-button
                    .iconfont
                      color #ccc
</style>
