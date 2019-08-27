<template lang="pug">
  li.the-billings.li-item
    dl.billings-box(
      @mouseenter="toggleBox(true)"
      @mouseleave="toggleBox(false)"
    )
      dt.billings-selected(:style="{color: (billingsSelecting ? '#338FF5' : '')}")
        span.billings-text {{$t('M.comm_order')}}
          Iconfont.iconfont.font-size20(icon-name="icon-xiala")
      el-collapse-transition
        dd.billings-list(
          v-show="billingsSelecting"
        )
          button.billings-item(
            class="billings-item"
            @click="jumpBillings(item)"
            v-for="(item,index) in billings"
            :key="index"
          ) {{$t(item.label)}}
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
export default {
  name: 'the-languages',
  // mixins: [],
  // components: {},
  // props,
  data () {
    return {
      billings: [
        {
          label: 'M.user_coin_order7',
          name: 'coin-orders'
        },
        {
          label: 'M.user_asset_title11',
          name: 'fiat-orders'
        }
      ],
      billingsSelecting: false
    }
  },
  // async created () {
  // },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 订单跳转
    jumpBillings (item) {
      this.$goToPage('/PersonalCenter')
      if (item.name === 'coin-orders') {
        this.CHANGE_USER_CENTER_ACTIVE_NAME(item.name)
      } else if (item.name === 'fiat-orders') {
        this.CHANGE_USER_CENTER_ACTIVE_NAME(item.name)
      }
    },
    toggleBox (status) {
      this.billingsSelecting = status
    }
  },
  // filters: {},
  computed: {
    ...mapState(
      {
        activeLanguage: state => state.common.activeLanguage,
        languages: state => state.common.languages_S
      }
    )
  }
  // watch: {}
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .the-billings.li-item
    > .billings-box
      position relative
      text-align left
      transition all 1s
      cursor pointer

      /* 当前语言 dt */
      > .billings-selected
        position relative
        top 1px
        display inline-block
        box-sizing border-box
        width 100%
        height 30px
        line-height 0
        color S_font_color
        padding 0 4px

        > .icon
          margin-right 5px

        > .billings-text
          display inline-block

          > .iconfont
            margin-top -1px
            margin-left -2px
            transition all .2s
      &:hover
        .iconfont
          transform rotate(180deg)
      > .billings-list
        position absolute
        z-index 2
        top 50px
        left 44%
        min-width 90px
        width max-content
        transform translateX(-50%)
        border-radius 2px
        background-color #2c314d
        box-shadow 0 3px 6px 0 rgba(32, 35, 54, 1)

        > .billings-item
          display block
          width 100%
          height 30px
          padding 0 12px
          line-height 30px
          text-align left
          color S_font_color
          cursor pointer

          &:hover
            color S_main_color
            background-color #21243a

          > .icon
            margin-right 5px
</style>
