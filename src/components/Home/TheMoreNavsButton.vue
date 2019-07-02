<!--
  author: zhaoxinlei
  createTime: 2019-05-27
  description: 当前组件为 公共头部 自定义导航 更多导航按钮
-->
<template>
  <div
    class="more-button"
    :class="{active: isActive}"
  >
    <div class="top"></div>
    <div class="middle"></div>
    <div class="bottom"></div>
  </div>
</template>
<script>
export default {
  props: {
    isActive: {
      type: Boolean
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import '../../assets/CSS/index';

  .more-button {
    width: 30px;
    height: 30px;
    padding-top: 10px;
    transition: all 1s;

    > div {
      height: 4px;
      margin-top: 3px;
      border: 1px solid $mainColor;
      border-radius: 10px;
      background-color: $mainColor;
      transition: all .5s;
    }

    > .top {
      width: 21px;
    }

    > .middle {
      width: 14px;
      background-color: rgba(51, 143, 245, .2);
    }

    > .bottom {
      width: 10px;
      background-color: rgba(51, 143, 245, .2);
    }

    &.active {
      > .middle,
      > .bottom {
        width: 21px;
        background-color: rgba(51, 143, 245, 1);
      }
    }
  }

</style>
