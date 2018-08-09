<!--
  echarts折线图封装
-->
<template>
  <div class="line-box common" :id="id" :style="{width: '120px', height: '50px'}">
  <!--<div class="line-box common" :id="id" :style="{width: '100px', height: '50px'}">-->
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'

require('echarts/lib/chart/line')
export default {
  components: {},
  props: ['options', 'id'],
  data () {
    return {}
  },
  created () {
  },
  mounted () {
    let myChart = echarts.init(document.getElementById(this.id))
    myChart.setOption(this.options)
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {},
  watch: {}
}
</script>
<style scoped lang="less">

</style>
