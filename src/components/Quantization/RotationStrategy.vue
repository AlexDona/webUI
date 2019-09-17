<!--
  author: wt
  create: 20190902
  description: 当前页面为 轮动策略 组件
-->
<template lang="pug">
  .container(:class="{'day':$isDayTheme_G_X,'night':!$isDayTheme_G_X}")
    .inner-box
      .banner-box
        .banner
      .content.text-center
        .content-box
          .navs
            // 我的策略
            a.nav-list1(@click.prevent="handleToQuantization") {{languages.quantization_nav_2}} &nbsp;>&nbsp;
            span.nav-list2 {{strategyData.strategyName}}
          .navs-detail
            el-form.form1
              // 时间
              el-form-item(:label="languages.rotation_form_time" label-width="80px")
                el-date-picker(
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="startTime"
                  type="datetimerange"
                  align="right"
                  range-separator="~"
                  :start-placeholder="$t('M.otc_no1')"
                  :end-placeholder="$t('M.otc_no2')"
                  :default-time="['00:00:00', '00:59:59']"
                  :picker-options="pickerOptionsTime"
                  @change="handleWidth"
                  :clearable="false"
                )
              // 网格策略
              // 参数
              el-form-item.grid-strategy(:label="languages.rotation_form_params" label-width="80px" v-if=" searchData.strategyType === 'RESEAU_STRATEGY' ")
                .params-header
                  // 添加交易对
                  button.addCurrency(@click.prevent="handleAddParams") {{languages.rotation_form_add_params}}
                .params-content(v-for="(item, index) in paramsContent")
                  .params-content-header
                    .header-text {{item.paramsForm.value}}
                    .header-icons
                      IconFont.params-delete(iconName="icon-shanchu-tianchong" v-if="paramsContent.length > 1" @click.native="handleDelete(index)" :key="index")
                      IconFont.params-spread(@click.native="handleSpread(item)" iconName="icon-iconfewer" :class="!item.visibleStatus? iconNormal: iconRoate")
                  .params-content-content
                    el-collapse-transition
                      div(v-show="index === 0 ? !item.visibleStatus : item.visibleStatus")
                        el-form(label-position="top" v-model="item.paramsForm")
                          // 交易对
                          el-form-item(:label="languages.rotation_form_coinPairs")
                            el-select(:placeholder="$t('M.comm_please_choose')"
                              v-model="item.paramsForm.value"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="handleCoinList"
                              :disabled="isOpen"
                              value="")
                              el-option(v-for="opt in changedCoinList"
                                :key="opt.tradeName"
                                :label="opt.tradeName"
                                :value="opt.tradeName")
                          .flex-items
                            // 网格方向
                            el-form-item(:label="languages.rotation_form_gridDirection")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_directionTip}}
                                el-input(
                                  @input="formatSymbolInput(item.paramsForm, 'params1')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params1')"
                                  placeholder="" v-model="item.paramsForm.params1"
                                  :disabled="isOpen"
                                  slot="reference")
                            // 网格节点数量
                            el-form-item(:label="languages.rotation_form_gridAmounts")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_amountsTip}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params2')"
                                  @keyup="formatInput(item.paramsForm, 'params2')"
                                  placeholder=""
                                  v-model="item.paramsForm.params2"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 下单量
                            el-form-item(:label="languages.rotation_form_orderAmounts")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_orderTips}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params3')"
                                  @keyup="formatInput(item.paramsForm, 'params3')"
                                  placeholder=""
                                  v-model="item.paramsForm.params3"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 差价间距
                            el-form-item(:label="languages.rotation_form_spacingPrice")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_spacingTip}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params4')"
                                  @keyup="formatInput(item.paramsForm, 'params4')"
                                  placeholder=""
                                  v-model="item.paramsForm.params4"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 换行
                            // 平仓利润差价
                            el-form-item(:label="languages.rotation_form_concretSpreading")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_concretTip}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params5')"
                                  @keyup="formatInput(item.paramsForm, 'params5')"
                                  placeholder=""
                                  v-model="item.paramsForm.params5"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 交易滑价
                            el-form-item(:label="languages.rotation_form_transactionPrice")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color 交易时的滑价百分比，可设为0表示盘口挂单
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params6')"
                                  @keyup="formatInput(item.paramsForm, 'params6')"
                                  placeholder=""
                                  v-model="item.paramsForm.params6"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 最大单笔下单量
                            el-form-item(:label="languages.rotation_form_maxOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_maxTip}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params7')"
                                  @keyup="formatInput(item.paramsForm, 'params7')"
                                  placeholder=""
                                  v-model="item.paramsForm.params7"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            el-form-item(:label="languages.rotation_form_minOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_minTip}}
                                el-input(
                                  @input="formatInput(item.paramsForm, 'params8')"
                                  @keyup="formatInput(item.paramsForm, 'params8')"
                                  placeholder=""
                                  v-model="item.paramsForm.params8"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
              // 趋势策略
              el-form-item.grid-strategy.trend-strategy(:label="languages.rotation_form_params" label-width="80px" v-if=" searchData.strategyType === 'TREND_STRATEGY' ")
                .params-header
                  button.addCurrency(@click="handleAddParams") {{languages.rotation_form_add_params}}
                .params-content(v-for="(item, index) in paramsContent")
                  .params-content-header
                    .header-text {{item.paramsForm.value}}
                    .header-icons
                      IconFont.params-delete(iconName="icon-shanchu-tianchong" v-if="paramsContent.length > 1" @click.native="handleDelete(index)" :key="index")
                      IconFont.params-spread(@click.native="handleSpread(item)" iconName="icon-iconfewer" :class="!item.visibleStatus? iconNormal: iconRoate")
                  .params-content-content
                    el-collapse-transition
                      div(v-show="index === 0 ? !item.visibleStatus : item.visibleStatus")
                        el-form(label-position="top" v-model="item.paramsForm")
                          el-form-item(:label="languages.rotation_form_coinPairs")
                            el-select(:placeholder="$t('M.comm_please_choose')"
                              v-model="item.paramsForm.value"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="handleCoinList"
                              :disabled="isOpen"
                              value="")
                              el-option(v-for="opt in changedCoinList"
                                :key="opt.tradeName"
                                :label="opt.tradeName"
                                :value="opt.tradeName")
                          .flex-items
                            // 计价占比
                            el-form-item(:label="languages.rotation_form_valuationPercent")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_valuationTip}}
                                el-input(
                                  @input="formatSymbolInput(item.paramsForm, 'params1')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params1')"
                                  placeholder="" v-model="item.paramsForm.params1"
                                  :disabled="isOpen"
                                  slot="reference")
                                  template(slot="append") %
                            // 加仓阈值
                            el-form-item(:label="languages.rotation_form_addPercent")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_addTip}}
                                el-input(
                                  @input="formatSymbolInput(item.paramsForm, 'params2')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params2')"
                                  placeholder="" v-model="item.paramsForm.params2"
                                  :disabled="isOpen"
                                  slot="reference")
                                  template(slot="append") %
                            // 交易滑价
                            el-form-item(:label="languages.rotation_form_transactionPrice")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_transactionTip}}
                                el-input(
                                  @input="formatSymbolInput(item.paramsForm, 'params3')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params3')"
                                  placeholder="" v-model="item.paramsForm.params3"
                                  :disabled="isOpen"
                                  slot="reference")
                                  template(slot="append") %
                            // 最大笔下单量
                            el-form-item(:label="languages.rotation_form_maxOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_maxTip}}
                                el-input.trend-input(
                                  @input="formatInput(item.paramsForm, 'params4')"
                                  @keyup="formatInput(item.paramsForm, 'params4')"
                                  placeholder=""
                                  v-model="item.paramsForm.params4"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 最小下单量
                            el-form-item(:label="languages.rotation_form_minOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_minTip}}
                                el-input.trend-input(
                                  @input="formatInput(item.paramsForm, 'params5')"
                                  @keyup="formatInput(item.paramsForm, 'params5')"
                                  placeholder=""
                                  v-model="item.paramsForm.params5"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
              // 定投策略
              el-form-item.grid-strategy.trend-strategy.fixed-investment(:label="languages.rotation_form_params" label-width="80px" v-if=" searchData.strategyType === 'INVESTMENT_STRATEGY' ")
                .params-header
                  button.addCurrency(@click="handleAddParams") {{languages.rotation_form_add_params}}
                .params-content(v-for="(item, index) in paramsContent")
                  .params-content-header
                    .header-text {{item.paramsForm.value}}
                    .header-icons
                      IconFont.params-delete(iconName="icon-shanchu-tianchong" v-if="paramsContent.length > 1" @click.native="handleDelete(index)" :key="index")
                      IconFont.params-spread(@click.native="handleSpread(item)" iconName="icon-iconfewer" :class="!item.visibleStatus? iconNormal: iconRoate")
                  .params-content-content
                    el-collapse-transition
                      div(v-show="index === 0 ? !item.visibleStatus : item.visibleStatus")
                        el-form(label-position="top" v-model="item.paramsForm")
                          el-form-item(:label="languages.rotation_form_coinPairs")
                            el-select(:placeholder="$t('M.comm_please_choose')"
                              v-model="item.paramsForm.value"
                              :no-data-text="$t('M.comm_no_data')"
                              @change="handleCoinList"
                              :disabled="isOpen"
                              value="")
                              el-option(v-for="opt in changedCoinList"
                                :key="opt.tradeName"
                                :label="opt.tradeName"
                                :value="opt.tradeName")
                          .flex-items
                            // 定投买入量
                            el-form-item(:label="languages.rotation_form_buyAmounts")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_buyTip}}
                                el-input.investment(
                                  @input="formatSymbolInput(item.paramsForm, 'params1')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params1')"
                                  placeholder="" v-model="item.paramsForm.params1"
                                  :disabled="isOpen"
                                  slot="reference")
                            // 间隔时长
                            el-form-item(:label="languages.rotation_form_intervalLength")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_intervalTip}}
                                el-input(
                                  @input="formatSymbolInput(item.paramsForm, 'params2')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params2')"
                                  placeholder="" v-model="item.paramsForm.params2"
                                  :disabled="isOpen"
                                  slot="reference")
                                  template(slot="append") {{languages.minutes}}
                            // 交易滑价
                            el-form-item(:label="languages.rotation_form_transactionPrice")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_transactionTip}}
                                el-input.investment(
                                  @input="formatSymbolInput(item.paramsForm, 'params3')"
                                  @keyup="formatSymbolInput(item.paramsForm, 'params3')"
                                  placeholder="" v-model="item.paramsForm.params3"
                                  :disabled="isOpen"
                                  slot="reference")
                            // 最大单笔下单量
                            el-form-item(:label="languages.rotation_form_maxOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_maxTip}}
                                el-input.trend-input(
                                  @input="formatInput(item.paramsForm, 'params4')"
                                  @keyup="formatInput(item.paramsForm, 'params4')"
                                  placeholder=""
                                  v-model="item.paramsForm.params4"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
                            // 最小下单量
                            el-form-item(:label="languages.rotation_form_minOrders")
                              el-popover(
                                :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                                effect="dark"
                                placement="top"
                                trigger="hover"
                                width="200"
                                :open-delay="500"
                              )
                                p.popover-color {{languages.rotation_form_minTip}}
                                el-input.trend-input(
                                  @input="formatInput(item.paramsForm, 'params5')"
                                  @keyup="formatInput(item.paramsForm, 'params5')"
                                  placeholder=""
                                  v-model="item.paramsForm.params5"
                                  :disabled="isOpen"
                                  auto-complete="off"
                                  slot="reference")
              el-form-item.annotation
                .annotation-content(v-if=" searchData.strategyType === 'RESEAU_STRATEGY' ")
                  p {{languages.rotation_form_annotation}}
                  p {{languages.rotation_form_gridAnnotation1}}
                  p {{languages.rotation_form_gridAnnotation2}}
                .annotation-content(v-if=" searchData.strategyType === 'TREND_STRATEGY' ")
                  p {{languages.rotation_form_annotation}}
                  p {{languages.rotation_form_trendAnnotation1}}
                  p(style="padding-top:10px") {{languages.rotation_form_trendAnnotation2}}
                  p(style="padding:10px 0") {{languages.rotation_form_trendAnnotation3}}
                  p {{languages.rotation_form_trendAnnotation4}}
                .annotation-content(v-if=" searchData.strategyType === 'INVESTMENT_STRATEGY' ")
                  p {{languages.rotation_form_annotation}}
                  p {{languages.rotation_form_investmentAnnotation1}}
              .footer-btns
                // 开启
                button.started(v-if="!isOpen" @click="handleActivition") {{languages.rotation_button_activation}}
                  IconFont.active(icon-name="icon-kaiqi")
                // 暂停
                button.paused(v-else @click="handleActivition") {{languages.rotation_button_deactivation}}
                  IconFont.active(icon-name="icon-zanting")
                // 保存
                button.saved(@click="handleStorage" :disabled="isOpen" :class="{'savedPaused': isOpen}")  {{languages.rotation_button_storage}}
                  IconFont.active(icon-name="icon-baocun")
              transition(name="el-fade-in")
                .bottom-hints(v-show="isOpen")
                  p {{languages.rotation_bottom_hints1 + startTime[0].replace(/-/g,'/') + languages.rotation_bottom_hints2 + startTime[1].replace(/-/g,'/') + languages.rotation_bottom_hints3}}
              el-form.form2(v-model="accountInfo")
                // 账户信息
                el-form-item(:label="languages.rotation_form_accountInfo" label-width="80px")
                  table.accounts-info-content(border="1")
                    tr.accounts-info-header
                      // 平台
                      td.header-cell {{languages.rotation_table_th1}}
                      td.header-cell {{languages.rotation_table_th2}}
                      td.header-cell {{languages.rotation_table_th3}}
                      td.header-cell {{languages.rotation_table_th4}}
                      td.header-cell {{languages.rotation_table_th5}}
                      td.header-cell {{languages.rotation_table_th6}}
                        el-popover(
                          :popper-class="`remark ${$isDayTheme_G_X ? 'day':'night'}`"
                          effect="dark"
                          placement="top"
                          trigger="hover"
                          width="153"
                          :open-delay="500"
                        )
                          p.popover-color {{languages.rotation_table_th6Tip}}
                          IconFont.warn(icon-name="icon-jinggao" slot="reference")
                    tr.accounts-info-body(v-for="item in accountInfo")
                      td.body-cell FUBT
                      td.body-cell {{item.buyCoinName}}
                      td.body-cell {{item.sellCoinName}}
                      td.body-cell {{item.buyFee}}
                      td.body-cell {{item.sellFee}}
                      td.body-cell {{item.historyYield}}
              el-collapse-transition
                el-form.form3(v-show="chartVisible")
                  // 浮动盈亏
                  el-form-item(:label="languages.rotation_table_floatingProfit" label-width="80px")
                    .floating-panel
                      div(v-for="(item, index) in savedCoinList")
                        input(:id="'panel' + index" type="radio" name="panel" :checked="index===0")
                        label.panel-item(:for="'panel' + index" @click="handleChartView(item)") {{item}}
                  .echarts-title
                    h5 {{languages.rotation_chart_floatingTitle}}
                    .echarts-title-des
                      span.des {{languages.rotation_chart_titleTip1}}
                        span.des-details 5000BTC
                      span.des {{languages.rotation_chart_titleTip2}}
                        span.des-details {{totalProfit}}
                      span.des {{languages.rotation_chart_titleTip3}}
                        span.des-details 1.253FBT
                  div(id="echarts-content")

</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import IconFont from '../Common/IconFontCommon'
import { routesVariable } from '../../router/routesVariable'
import { coinList, checkStrategy, updateStrategy, activeStrategy, viewAccountInfo, getProfitAndLoss } from '../../utils/api/quantizationCenter'
import { formatSymbolNumber, amendPrecision } from '../../utils'
import languages from '../../mixins/quantizationLanguage'
// import {mapState} from 'vuex'
// import { getLanguagesAJAX } from '../utils/API/common'
export default {
  // name 为必填项
  name: 'rotation-strategy',
  components: {
    IconFont
  },
  mixins: [languages],
  // components: {},
  // props,
  data () {
    // const strategyData =
    // const searchData =
    return {
      coinList: [], // 交易对列表
      changedCoinList: [],
      startTime: [], // 开始时间
      strategyData: JSON.parse(sessionStorage.getItem('MY_STRATEGY_DATA')),
      searchData: JSON.parse(sessionStorage.getItem('SEARCH_STRATEGY_DATA')),
      iconRoate: 'icon-roate',
      iconNormal: 'icon-normal',
      paramsContent: [{
        visibleStatus: false,
        paramsForm: {
          params1: '',
          params2: '',
          params3: '',
          params4: '',
          params5: '',
          params6: '',
          params7: '',
          params8: '',
          value: '',
          label: ''
        }
      }],
      params1: 'params1',
      isEmpty: false,
      coinInfo: {},
      isOpen: false,
      isSaved: false,
      accountInfo: [{
        buyCoinName: '--',
        sellCoinName: '--',
        buyFee: '--',
        sellFee: '--',
        historyYield: '--'
      }],
      pickerOptionsTime: {
        disabledDate: (time) => {
          // let curDate = new Date(strategyData.startTime).getTime()
          let endTime = new Date(strategyData.endTime).getTime()
          // let timeFrame = three - curDate
          return time.getTime() > endTime
        }
      },
      paramsFormVisible: true,
      savedCoinList: [], // 已保存的交易对
      chartVisible: false,
      totalProfit: '--',
      chartData: [], // 图表数据
      chartOptions: {
        backgroundColor: '',
        title: {},
        textStyle: {
          color: '#b2b7d0'
        },
        dataZoom: [
          {
            type: 'inside',
            filterMode: 'filter',
            minSpan: 12,
            startValue: 0
          },
          {
            type: 'inside',
            filterMode: 'filter'
          }
        ],
        grid: {
          left: '8%',
          top: '8%',
          right: '3%'
          // bottom: '6%'
        },
        tooltip: {
          trigger: 'item',
          backgroundColor: '#262A42',
          borderColor: '#262A42',
          borderRadius: 3,
          padding: 10,
          // hideDelay: 8000,
          confine: true,
          snap: true,
          position: 'top',
          textStyle: {
            fontSize: 12
          },
          formatter: (params) => {
            // 浮动盈亏
            return `<span>${params.name}</span><br/>
                      <span style="color: #338ff5">浮动盈亏：${params.value}</span>
                      `
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#3B4967'
            }
          }
        },
        yAxis: {
          type: 'value',
          nameGap: 15,
          axisLine: {
            lineStyle: {
              color: '#3B4967'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(59,73,103,.2)'
            }
          },
          axisLabel: {
            margin: 10,
            formatter: newNum => {
              if (newNum > 1000000) {
                newNum = `${this.$keep2Num(newNum / 1000000)}M`
              } else if (newNum > 1000) {
                newNum = `${this.$keep2Num(newNum / 1000)}cK`
              }
              return newNum
            }
          }
        },
        series: [{
          type: 'line',
          // smooth: true, //是否平滑曲线显示
          // symbol:'circle',  // 默认是空心圆（中间是白色的），改成实心圆
          showAllSymbol: true,
          // symbol: 'image://./static/images/guang-circle.png',
          symbolSize: 8,
          lineStyle: {
            normal: {
              color: '#338ff5' // 线条颜色
            }
            // borderColor: '#f0f'
          },
          // 图标
          // label: {
          //   // show: true,
          //   position: 'top',
          //   textStyle: {
          //     color: 'red'
          //   }
          // },
          itemStyle: {
            normal: {
              color: '#338ff5'
            }
          },
          areaStyle: { // 区域填充样式
            normal: {
              color: 'rgba(51,143,245,.1)'
            }
          },
          data: []
        }],
        animation: false
      },
      charts: null
    }
  },
  async created () {
    if (!this.strategyData && !this.searchData) {
      this.$goToPage(`/${routesVariable.quantization}`)
    }
    await this.getCoinList()
    await this.checkStrategyDetails()
    await this.viewAccountInfo()
  },
  // mounted () {}
  // updated () {},
  // beforeRouteUpdate () {},
  // beforeDestroy () {},
  // destroyed () {},
  methods: {
    formatSymbolInput (obj, params) {
      let inputValue = obj[params]
      this.$set(obj, params, formatSymbolNumber(inputValue, 16))
    },
    formatInput (obj, params) {
      let inputValue = obj[params] + ''
      this.$set(obj, params, formatSymbolNumber(inputValue, 16, true))
    },
    handleToQuantization () {
      console.log(this.searchData)
      this.$router.replace({
        name: routesVariable.quantization,
        params: {
          tab: 1
        }
      })
    },
    handleWidth (date) {
      if (date) {
        this.$el.querySelector('.el-date-editor--datetimerange').style.cssText = 'width: 308px;transition: width .6s ease'
      } else {
        this.$el.querySelector('.el-date-editor--datetimerange').style.cssText = 'width: 192px;transition: width .6s ease'
      }
    },
    handleAddParams () {
      let contentObj = {}
      if (this.searchData.strategyType === 'RESEAU_STRATEGY') { // 网格策略
        contentObj = {
          visibleStatus: false,
          paramsForm: {
            params1: '',
            params2: '',
            params3: '',
            params4: '',
            params5: '',
            params6: '',
            params7: '',
            params8: '',
            value: ''
          }
        }
      } else {
        contentObj = {
          visibleStatus: false,
          paramsForm: {
            params1: '',
            params2: '',
            params3: '',
            params4: '',
            params5: '',
            value: ''
          }
        }
      }
      this.paramsContent.unshift(contentObj)
    },
    // 筛选交易对方法
    filterCoinList () {
      let paramsCoinList = []
      let setCoinList = []
      this.paramsContent.map(item => {
        paramsCoinList.push(item.paramsForm.value)
      })
      setCoinList = paramsCoinList
      this.changedCoinList = this.coinList.filter(item => !setCoinList.includes(item.tradeName))
    },
    handleCoinList ($event) { // 过滤已添加的交易对
      this.filterCoinList()
      // console.log(this.changedCoinList)
    },
    handleDelete (index) {
      // 删除参数
      this.paramsContent.splice(index, 1)
      this.filterCoinList()
    },
    handleSpread (item, index) { // 点击展开收缩
      item.visibleStatus = !item.visibleStatus
    },
    handleActivition: _.throttle(function () {
      if (!this.isOpen) {
        this.activeStrategy(1)
      } else {
        this.activeStrategy(0)
      }
      // this.renderChart()
    }, 500),
    // 获取交易对
    async getCoinList () {
      const data = await coinList()
      if (!data) return false
      this.coinList = _.get(data, 'data')
    },
    async checkStrategyDetails () {
      const data = await checkStrategy({
        strategyUserId: this.strategyData.id
      })
      if (!data) return false
      const res = _.get(data, 'data')
      if (res.coinInfo) {
        this.coinInfo = JSON.parse(res.coinInfo)
        let symbols = this.coinInfo.symbols
        let newParamsContent = []
        symbols.map(item => {
          if (this.searchData.strategyType === 'TREND_STRATEGY') { // 趋势策略
            newParamsContent.push({
              visibleStatus: false,
              paramsForm: {
                params1: amendPrecision(item.balanceRatio, 100, '*'),
                params2: amendPrecision(item.addRatio, 100, '*'),
                params3: amendPrecision(item.libParams.SlidePrice, 100, '*'),
                params4: item.libParams.MaxAmount,
                params5: item.libParams.MinStock,
                value: item.symbol.replace('_', '/')
              }
            })
          } else if (this.searchData.strategyType === 'RESEAU_STRATEGY') { // 网格策略
            newParamsContent.push({
              visibleStatus: false,
              paramsForm: {
                params1: item.direction,
                params2: item.gridCoverDistance,
                params3: item.gridNum,
                params4: item.gridPointAmount,
                params5: item.gridPointDistance,
                params6: item.libParams.MaxAmount,
                params7: item.libParams.MinStock,
                params8: item.libParams.SlidePrice,
                value: item.symbol.replace('_', '/')
              }
            })
          } else { // 定投策略
            newParamsContent.push({
              visibleStatus: false,
              paramsForm: {
                params1: item.playAmount,
                params2: item.intervalTradeTime,
                params3: item.libParams.SlidePrice,
                params4: item.libParams.MaxAmount,
                params5: item.libParams.MinStock,
                value: item.symbol.replace('_', '/')
              }
            })
          }
          this.savedCoinList.push(item.symbol.replace('_', '/')) // 获取已保存的交易对
        })
        this.paramsContent = newParamsContent
        this.isOpen = !!res.isOpen
        this.isSaved = true
        this.startTime = [res.startTime, res.overTime]
        this.$el.querySelector('.el-date-editor--datetimerange').style.cssText = 'width: 308px;transition: width .6s ease'
        // 默认筛选已保存的交易对
        this.filterCoinList()
        await this.profitAndLoss(this.savedCoinList[0])// 浮动盈亏
        this.chartVisible = true
      } else {
        this.chartVisible = false
        if (this.searchData.strategyType === 'TREND_STRATEGY') { // 趋势策略
          this.paramsContent = [{
            visibleStatus: false,
            paramsForm: {
              params1: '',
              params2: '',
              params3: '',
              params4: '',
              params5: '',
              value: ''
            }
          }]
        } else if (this.searchData.strategyType === 'RESEAU_STRATEGY') {
          this.paramsContent = [{ // 网格策略
            visibleStatus: false,
            paramsForm: {
              params1: '',
              params2: '',
              params3: '',
              params4: '',
              params5: '',
              params6: '',
              params7: '',
              params8: '',
              value: ''
            }
          }]
        } else {
          this.paramsContent = [{ // 定投策略
            visibleStatus: false,
            paramsForm: {
              params1: '',
              params2: '',
              params3: '',
              params4: '',
              params5: '',
              value: ''
            }
          }]
        }
        this.changedCoinList = this.coinList
        this.isSaved = false
      }
    },
    async updateStrategyDetails (coinInfo, unSavedCoinList) {
      // console.log(typeof this.strategyData.id)
      let formData = new FormData()
      formData.append('strategySettingId', this.searchData.id)
      formData.append('coinInfo', JSON.stringify(coinInfo))
      formData.append('startTime', this.startTime[0])
      formData.append('endTime', this.startTime[1])
      const data = await updateStrategy(formData)
      if (!data) return false
      this.savedCoinList = unSavedCoinList // 保存成功实时更新已保存交易对
      this.isSaved = true // 是否保存过策略
      this.profitAndLoss(this.savedCoinList[0])// 保存获取浮动盈亏
      // console.log(data)
    },
    async activeStrategy (type) {
      if (this.isSaved) {
        let formData = new FormData()
        formData.append('strategySettingId', this.searchData.id)
        formData.append('coinInfo', JSON.stringify(this.coinInfo))
        formData.append('startTime', this.startTime[0])
        formData.append('endTime', this.startTime[1])
        formData.append('isOpen', type)
        const data = await activeStrategy(formData)
        if (!data) return false
        this.isOpen = !this.isOpen // 改变按钮样式
        console.log(data)
      } else {
        this.$message({
          showClose: true,
          message: this.languages.rotation_check_saved,
          type: 'warning'
        })
      }
    },
    async viewAccountInfo () { // 账户信息
      const data = await viewAccountInfo()
      if (!data) return false
      if (_.get(data, 'data').length) {
        this.accountInfo = _.get(data, 'data')
      }
    },
    async profitAndLoss (coinPair) {
      const data = await getProfitAndLoss({
        userStrategySettingId: this.searchData.id,
        userId: this.searchData.userId,
        tradeName: coinPair || this.savedCoinList[0]
      })
      if (!data) {
        return false
      } else if (data.length) {
        const totalProfitData = _.get(data, 'data').slice(-1)[0]
        this.totalProfit = totalProfitData.historyYield + totalProfitData.tradeName // 累计盈亏
        this.chartData = _.get(data, 'data')
        this.tendData()
      } else {
        this.renderChart()
      }
    },
    handleStorage: _.throttle(function () {
      let symbolsArray = []
      let unSavedCoinList = []
      this.paramsContent.map(item => {
        for (let key in item.paramsForm) {
          if (!item.paramsForm[key]) { // 判断参数配置是否为空
            this.isEmpty = true
          }
        }
        if (this.searchData.strategyType === 'TREND_STRATEGY') { // 趋势策略
          symbolsArray.push({
            symbol: item.paramsForm.value.replace('/', '_'),
            balanceRatio: amendPrecision(item.paramsForm.params1, 100, '/'),
            addRatio: amendPrecision(item.paramsForm.params2, 100, '/'),
            libParams: {
              SlidePrice: amendPrecision(item.paramsForm.params3, 100, '/'),
              MaxAmount: item.paramsForm.params4,
              MinStock: item.paramsForm.params5
            }
          })
        } else if (this.searchData.strategyType === 'RESEAU_STRATEGY') { // 网格策略
          symbolsArray.push({
            symbol: item.paramsForm.value.replace('/', '_'),
            direction: item.paramsForm.params1,
            gridNum: item.paramsForm.params2,
            gridPointAmount: item.paramsForm.params3,
            gridPointDistance: item.paramsForm.params4,
            gridCoverDistance: item.paramsForm.params5,
            libParams: {
              SlidePrice: item.paramsForm.params6,
              MaxAmount: item.paramsForm.params7,
              MinStock: item.paramsForm.params8
            }
          })
        } else { // 定投策略
          symbolsArray.push({
            symbol: item.paramsForm.value.replace('/', '_'),
            playAmount: item.paramsForm.params1,
            intervalTradeTime: item.paramsForm.params2,
            libParams: {
              SlidePrice: item.paramsForm.params3,
              MaxAmount: item.paramsForm.params4,
              MinStock: item.paramsForm.params5
            }
          })
        }
        unSavedCoinList.push(item.paramsForm.value.replace('_', '/'))// 获取已添加的交易对
      })
      if (!this.isEmpty && this.startTime.length === 2) {
        this.coinInfo = {
          symbols: symbolsArray
        }
        this.updateStrategyDetails(this.coinInfo, unSavedCoinList)
      } else {
        this.$message({
          showClose: true,
          message: this.languages.rotation_check_empty,
          type: 'warning'
        })
        this.isEmpty = true
      }
      this.isEmpty = false// 重置参数判断
    }, 1000),
    handleChartView ($item) {
      this.profitAndLoss($item)
      this.renderChart()
    },
    // 走势图数据处理
    tendData () {
      const data = this.chartData
      let xs = []
      let ys = []
      let targetList = []
      if (data) {
        _.forEach(data, dataItem => {
          const [historyYield, dayTime] = [dataItem.historyYield, dataItem.dealTime.substr(0, 10)]
          xs.push(dayTime)
          ys.push(historyYield)
        })
      }
      targetList[0] = xs
      targetList[1] = ys
      this.chartData = targetList
      this.renderChart()
    },
    // 绘制图表
    renderChart () {
      this.resetOptions()
      this.charts = echarts.init(document.getElementById('echarts-content'))
      this.charts.setOption(this.chartOptions)
      window.addEventListener('resize', _.debounce(this.charts.resize, 100))
    },
    // 重置图表
    resetOptions () {
      if (this.$isDayTheme_G_X == 'day') {
        this.chartOptions.tooltip.backgroundColor = '#fff'
        this.chartOptions.tooltip.borderColor = '#fff'
        this.chartOptions.tooltip.textStyle.color = '#7D90AC'
        this.chartOptions.tooltip.extraCssText = 'box-shadow: 0px 2px 3px 0px rgba(198,212,228,1);'
        this.chartOptions.xAxis.axisLine.lineStyle.color = '#7D90AC'
        this.chartOptions.yAxis.axisLine.lineStyle.color = '#7D90AC'
      } else {
        this.chartOptions.tooltip.backgroundColor = '#262A42'
        this.chartOptions.tooltip.borderColor = '#262A42'
        this.chartOptions.tooltip.textStyle.color = '#fff'
        this.chartOptions.xAxis.axisLine.lineStyle.color = '#3B4967'
        this.chartOptions.yAxis.axisLine.lineStyle.color = '#3B4967'
        this.chartOptions.tooltip.extraCssText = 'box-shadow: 0px 2px 4px 0px rgba(29,37,55,1);'
      }
      // 默认显示 最新7条数据
      const xAxisLength = this.chartOptions.xAxis.data.length
      this.chartOptions.dataZoom[0].startValue = xAxisLength >= 7 ? xAxisLength - 7 : 0
    }
  },
  // filters: {},
  // computed: {
  // }
  watch: {
    $isDayTheme_G_X () {
      this.renderChart()
    },
    paramsContent: {
      handler (newVal, oldVal) {
        if (oldVal[0].paramsForm.value) {
          this.isSaved = false
        }
      },
      deep: true
    },
    chartData (New) {
      const [xs, ys] = New
      this.chartOptions.xAxis.data = xs
      this.chartOptions.series[0].data = ys
      this.renderChart()
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '../../assets/CSS/index.styl'
  .container
    >.inner-box
      >.banner-box
        background #110c38
        >.banner
          background url('../../assets/quantization/banner.png') center no-repeat
          height 229px
      >.content
        margin-top 31px
        margin-bottom 200px
        >.content-box
          width 1300px
          margin 0 auto
          .navs
            padding 0 26px
            height 40px
            line-height 40px
            font-size 14px
            >.nav-list1
              cursor pointer
              color S_night_main_text_color
            >.nav-list2
              cursor pointer
              color S_main_color
          .navs-detail
            padding 36px 60px 60px 66px
            .el-form.form1
              // 网格策略
              .grid-strategy
                .params-header
                  padding 20px
                  .addCurrency
                    min-width 90px
                    height 28px
                    border 1px solid S_main_color
                    color S_main_color
                    cursor pointer
                .params-content
                  font-size 12px
                  padding 0 20px
                  .params-content-header
                    display flex
                    .header-text
                      flex 1
                    .header-icons
                      .icon-roate
                        transform rotate(180deg)
                        transition .6s ease all
                      .icon-normal
                        transform rotate(0deg)
                        transition .6s ease all
                      .params-delete
                        color #e8554f
                        font-size 12px
                        padding-right 20px
                        cursor pointer
                      .params-spread
                        cursor pointer
                        font-size 12px
                        color S_main_color
                  .params-content-content
                    padding 20px 0 17px 0
                    .flex-items
                      display flex
                      flex-wrap wrap
                      .el-form-item
                        margin-top 18px
                        margin-right 49px
                    /deep/
                      .el-select-dropdown__item
                        font-size 12px
                      .el-input__inner
                       font-size 12px
                      .el-form-item__label
                        font-size 12px
                        padding 0
                      .el-form-item__content
                        font-size 12px !important
                        padding 0 !important
                        border none !important
                        margin-left 0 !important
              .annotation
                .annotation-content
                  padding 22px 29px
                  font-size 12px
                  line-height 22px
              .footer-btns
                margin 39px 0 50px 0
                text-align center
                font-size 14px
                footStyles()
                  width 146px
                  height 38px
                  line-height 38px
                  border-radius 4px
                  margin-right 40px
                  color S_day_bg
                  cursor pointer
                  .active
                    position absolute
                    margin 0 auto
                    left 28px
                    top 9px
                .started
                  footStyles()
                  position relative
                  background #30C296
                .paused
                  footStyles()
                  position relative
                  background S_otc_red_color
                .saved
                  footStyles()
                  position relative
                  background S_main_color
              .bottom-hints
                margin-bottom 33px
                text-align center
            .el-form.form2
              padding 30px 0
              .el-form-item
                .accounts-info-content
                  width 100%
                  font-size 12px
                  .header-cell
                    padding 10px 60px
                    white-space nowrap
                    .warn
                      margin-top -5px
                      margin-left 5px
                      color S_main_color
                      cursor pointer
                  .body-cell
                    padding 11px
                    text-align center
            .el-form.form3
              margin-top 28px
              .el-form-item
                .floating-panel
                  display flex
                  flex-wrap wrap
                  checkedStyle()
                    border 1px solid S_main_color
                    color S_main_color
                  input
                    display none
                    &:checked+.panel-item
                      checkedStyle()
                  .panel-item
                    display inline-block
                    width 111px
                    height 24px
                    line-height 24px
                    font-size 12px
                    text-align center
                    border-radius 2px
                    cursor pointer
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
                    margin 10px 32px 8px 0
              .echarts-title
                margin-top 51px
                text-align center
                .echarts-title-des
                  font-size 12px
                  margin-top 15px
                  .des
                    padding-right 30px
              #echarts-content
                margin-top 38px
                width 1160px
                height 355px
  /deep/
    .el-input__inner
      width 192px
      height 32px
      border none
      .el-range__icon
        line-height 27px
    .el-form-item__content
      margin-left 99px !important
    .trend-strategy
      .flex-items
        .el-input__inner
          width 139px
        .trend-input
          .el-input__inner
            width 192px
    .fixed-investment
      .flex-items
        .investment
          .el-input__inner
            width 192px
  &.night
    .content-box
      box-shadow 0 2px 2px 0 rgba(20, 23, 37, 1)
      .navs
        background S_night_main_bg
        border-bottom 1px solid #141725
      .navs-detail
        background S_night_main_bg
      .el-form.form1
        // 网格策略
        .grid-strategy
          /deep/
            .el-input.is-disabled
              .el-input__inner
                background S_color1
            .el-form-item__content
              border 1px solid #272b41 !important
              .params-header
                border-bottom 1px solid #212b3f
              .params-content
                color S_night_main_text_color
                .params-content-header
                  border-bottom 1px solid #212b3f
                .params-content-content
                  .el-form
                    .el-input__inner
                      color S_night_main_text_color
                    .el-form-item__label
                      color S_night_main_text_color
        .trend-strategy
          /deep/
            .el-input-group
              .el-input-group__append
                border none
                background #303f59
                color S_main_color
        .annotation
          .annotation-content
            background #2c314b
            color #737db7
        .footer-btns
          .savedPaused
            footStyles()
            background #28304b !important
            color #b8b6b6 !important
            cursor not-allowed !important
        .bottom-hints
          p
            color S_color5
        .el-form.form2
          border-top 1px solid #272b41
          border-bottom  1px solid #272b41
        .el-form-item
          .accounts-info-content
            border 1px solid #272b41
            .header-cell
              color S_night_main_text_color
            .body-cell
              color S_day_bg
        .el-form-item
          .floating-panel
            input
              &:unchecked+.panel-item
                border 1px solid S_color5
                color S_color5
            .panel-item
              border 1px solid S_color5
              color S_color5
        .echarts-title
          h5
            color S_day_bg
          .echarts-title-des
            color S_color5
            >.des
              >.des-details
                color S_night_main_text_color
  /deep/
    .el-range-input
      color S_night_main_text_color
    .el-form-item__label
      color #fff
    .el-input__inner
      background S_color1
      .el-range-separator
        color S_night_main_text_color
  .popover-color
    font-size 12px
    color S_main_color
</style>
<!--<style scoped lang="scss" type="text/scss">-->
<!--.demo-box {-->
<!--background-color: $mainBG;-->
<!--}-->
<!--</style>-->
