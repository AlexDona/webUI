// import {mapGetters} from 'vuex'

/**
 * author: wt
 * create: 20190917
 * description: quantization相关 mixins
 */
let mixins = {
  data () {
    return {}
  },
  methods: {},
  computed: {
    // ...mapGetters({}),
    languages () {
      return {
        'month': this.$isChineseLanguage_G_X ? '月' : '',
        'minutes': this.$isChineseLanguage_G_X ? '分' : '',
        'quantization_nav_1': this.$isChineseLanguage_G_X ? '量化市场' : '',
        'quantization_nav_2': this.$isChineseLanguage_G_X ? '我的策略' : '',
        'quantization_price_info': this.$isChineseLanguage_G_X ? '包含策略使用费,平台使用费,托管者费用' : '',
        'quantization_pane_info1': this.$isChineseLanguage_G_X ? '主流币种随意选择' : '',
        'quantization_pane_info2': this.$isChineseLanguage_G_X ? '自定义所选币种权重' : '',
        'quantization_pane_info3': this.$isChineseLanguage_G_X ? '实时计算币种折合比特币均值' : '',
        'quantization_pane_info4': this.$isChineseLanguage_G_X ? '全自动持仓减仓' : '',
        'quantization_pane_info5': this.$isChineseLanguage_G_X ? '自定义精度, 交易粒度, 交易频率' : '',
        'quantization_pane_info6': this.$isChineseLanguage_G_X ? '锁定利润, 平衡资金' : '',
        'quantization_pane_buy': this.$isChineseLanguage_G_X ? '立即购买' : '',
        'quantization_no_strategies': this.$isChineseLanguage_G_X ? '暂无策略' : '',
        'quantization_table_nodata': this.$isChineseLanguage_G_X ? '暂无数据' : '',
        'quantization_table_name': this.$isChineseLanguage_G_X ? '名称' : '',
        'quantization_table_deadline': this.$isChineseLanguage_G_X ? '到期时间' : '',
        'quantization_table_remains': this.$isChineseLanguage_G_X ? '剩余' : '',
        'quantization_table_day': this.$isChineseLanguage_G_X ? '天' : '',
        'quantization_table_status': this.$isChineseLanguage_G_X ? '状态' : '',
        'quantization_table_expire': this.$isChineseLanguage_G_X ? '已过期' : '',
        'quantization_table_unexpired': this.$isChineseLanguage_G_X ? '使用中' : '',
        'quantization_table_operation': this.$isChineseLanguage_G_X ? '操作' : '',
        'quantization_table_check': this.$isChineseLanguage_G_X ? '查看' : '',
        'quantization_table_fee': this.$isChineseLanguage_G_X ? '续费' : '',
        'quantization_dialog_title': this.$isChineseLanguage_G_X ? '开通' : '',
        'quantization_dialog_strategy': this.$isChineseLanguage_G_X ? '策略' : '',
        'quantization_dialog_duration': this.$isChineseLanguage_G_X ? '时长' : '',
        'quantization_dialog_per_month': this.$isChineseLanguage_G_X ? '个月' : '',
        'quantization_dialog_recommendation': this.$isChineseLanguage_G_X ? '推荐' : '',
        'quantization_dialog_payment': this.$isChineseLanguage_G_X ? '支付' : '',
        'quantization_dialog_origin_price': this.$isChineseLanguage_G_X ? '原价' : '',
        'quantization_dialog_remain_price': this.$isChineseLanguage_G_X ? '可用：' : '',
        'quantization_dialog_charge': this.$isChineseLanguage_G_X ? '立即充值' : '',
        'quantization_button_confirm': this.$isChineseLanguage_G_X ? '确认' : '',
        'quantization_prompt_title': this.$isChineseLanguage_G_X ? '量化市场风险提示' : '',
        'quantization_prompt_p1': this.$isChineseLanguage_G_X ? '1.量化市场就各项服务、安全、无误、及不中断不负担任何明示或默示的保证责任。您同意承担使用本网站该项服务的所有风险及因该风险可能造成的任何损害。' : '',
        'quantization_prompt_p2': this.$isChineseLanguage_G_X ? '2.任何在本网站出现的信息包括但不限于评论、预测、图表、指标、理论、直接的或暗示的指示均只作为参考，您须对任何自主决定的行为负责。' : '',
        'quantization_prompt_p3': this.$isChineseLanguage_G_X ? '3.量化提供或展示的有关策略，只保证其历史信号及历史产生的收益真实有效，但未来收益情况，不能按照历史简单统计，所有直接或间接使用策略用于真实交易的用户需要谨慎选择，合理运用。量化市场不承担任何因策略产生的资金损失及相关责任，凡使用策略的用户，量化市场依据相关法律法规及平台服务协议，默认用户已同意此条款。' : '',
        'quantization_prompt_p4': this.$isChineseLanguage_G_X ? '4.量化市场对于您所使用的各项服务、或无法使用各项服务所导致的任何直接、间接、衍生或特别损害，不负任何赔偿责任。' : '',
        'quantization_prompt_p5': this.$isChineseLanguage_G_X ? '5.量化市场不对因本网站资料全部或部分内容产生的或因依赖该资料而引致的任何损失承担任何责任。' : '',
        'quantization_prompt_p6': this.$isChineseLanguage_G_X ? '6.您了解并同意，本网站可能因平台、其他合作方或相关电信部门的互联网软硬件设备故障或失灵、或人为操作疏忽而全部或部分中断、延迟、遗漏、误导或造成资料传输或储存上的错误、或遭第三人侵入系统篡改或伪造变造资料等，本网站不承担任何责任。' : '',
        'quantization_prompt_p7': this.$isChineseLanguage_G_X ? '7.凡通过本网站与其他网站的链接，而获得其所提供的网上资料及内容，您应该自己进行辨别及判断，并应当由该等网站对其提供内容承担相应责任，本网站对此不承担任何责任。本网站提供超级链接至其它网站，并不视为同意、推荐、认可、保证或推介任何第三方或在其网站所提供的服务、产品，亦不可视为与该等第三方及网站有任何形式的合作。' : '',
        'quantization_prompt_p8': this.$isChineseLanguage_G_X ? '8.量化市场所载商标、徽号和服务标志及其他任何数据的所有版权、专利权、知识产权及其它产权均属本网站或其关联公司所有。未经本网站事前以书面同意，不得将此等材料的任何部分修改、翻版、储存于检索系统、传送、复制、分发或以任何其它方式作商业或公共用途。' : '',
        'quantization_prompt_p9': this.$isChineseLanguage_G_X ? '9.量化市场所提供的信息、软件、产品、模型、策略、搜索结果、接往第三方网站的超级链接及第三方所提供的商品、服务、权利等一切内容，其完整性、正确性、适时性、妥当性、及时性、信赖性、和目的性、有用性、商品性、知识产权的不受侵害性及第三方债务的履行及有无瑕疵等方面，不做任何保证，不负任何相关担保责任。' : '',
        'quantization_prompt_p10': this.$isChineseLanguage_G_X ? '10.量化市场所有策略均属知识产权类产品，一经售出，概不退换。任何因策略产生的纠纷，请及时咨询官方客服协商解决。' : '',
        'quantization_prompt_p11': this.$isChineseLanguage_G_X ? '11.本网站保留随时变更、中断或终止部分或全部量化市场服务的权利。网站有权随时修改量化市场包含但不限于产品、策略、支付条件及政策等，并通过本网站展示，而无需另行单独通知用户。' : '',
        'quantization_prompt_p12': this.$isChineseLanguage_G_X ? '12. 本风险揭示书的揭示事项仅为列举性质，未能详尽列明用户购买及使用量化服务所面临的全部风险和可能导致损失的所有因素。用户在购买及使用量化服务前，应认真阅读并理解相关业务规则、服务协议及本风险揭示书的全部内容。接受量化服务的用户，自行承担投资及操作风险，平台不以任何方式向用户作出不受损失或者取得最低收益的承诺。' : '',
        'quantization_prompt_agreement': this.$isChineseLanguage_G_X ? '我已阅读并知晓风险' : '',
        // 参数界面
        'rotation_form_time': this.$isChineseLanguage_G_X ? '时间' : '',
        'rotation_form_params': this.$isChineseLanguage_G_X ? '参数' : '',
        'rotation_form_add_params': this.$isChineseLanguage_G_X ? '添加交易对' : '',
        'rotation_form_coinPairs': this.$isChineseLanguage_G_X ? '交易对' : '',
        'rotation_form_gridDirection': this.$isChineseLanguage_G_X ? '网格方向' : '',
        'rotation_form_directionTip': this.$isChineseLanguage_G_X ? '-1为向下网格，即价格越低越买入，等待价格反弹卖出。' : '',
        'rotation_form_gridAmounts': this.$isChineseLanguage_G_X ? '网格节点数量' : '',
        'rotation_form_amountsTip': this.$isChineseLanguage_G_X ? '100就是设置100个节点' : '',
        'rotation_form_orderAmounts': this.$isChineseLanguage_G_X ? '下单量' : '',
        'rotation_form_orderTips': this.$isChineseLanguage_G_X ? '每个节点的下单量' : '',
        'rotation_form_spacingPrice': this.$isChineseLanguage_G_X ? '差价间距' : '',
        'rotation_form_spacingTip': this.$isChineseLanguage_G_X ? '每个节点的差价间距' : '',
        'rotation_form_concretSpreading': this.$isChineseLanguage_G_X ? '平仓利润差价' : '',
        'rotation_form_concretTip': this.$isChineseLanguage_G_X ? '每个节点计划的平仓利润差价' : '',
        'rotation_form_transactionPrice': this.$isChineseLanguage_G_X ? '交易滑价' : '',
        'rotation_form_transactionTip': this.$isChineseLanguage_G_X ? '交易时的滑价百分比，可设为0表示盘口挂单' : '',
        'rotation_form_maxOrders': this.$isChineseLanguage_G_X ? '最大单笔下单量' : '',
        'rotation_form_maxTip': this.$isChineseLanguage_G_X ? '如设置为1，则超过1的下单量会拆分' : '',
        'rotation_form_minOrders': this.$isChineseLanguage_G_X ? '最小下单量' : '',
        'rotation_form_minTip': this.$isChineseLanguage_G_X ? '若设置为1，则低于1时不下单' : '',
        'rotation_form_valuationPercent': this.$isChineseLanguage_G_X ? '计价占比' : '',
        'rotation_form_valuationTip': this.$isChineseLanguage_G_X ? '计价币使用比例' : '',
        'rotation_form_addPercent': this.$isChineseLanguage_G_X ? '加仓阈值' : '',
        'rotation_form_addTip': this.$isChineseLanguage_G_X ? '控制加仓触发价格，加仓数量' : '',
        'rotation_form_buyAmounts': this.$isChineseLanguage_G_X ? '定投买入量' : '',
        'rotation_form_buyTip': this.$isChineseLanguage_G_X ? '定投计划买入的数量' : '',
        'rotation_form_intervalLength': this.$isChineseLanguage_G_X ? '间隔时长' : '',
        'rotation_form_intervalTip': this.$isChineseLanguage_G_X ? '每次定投间隔时间，若设置为60则为60分钟' : '',
        'rotation_form_annotation': this.$isChineseLanguage_G_X ? '注释：' : '',
        'rotation_form_gridAnnotation1': this.$isChineseLanguage_G_X ? '网格策略根据参数生成一个有若干节点的网络，网络分为向上网格和向下网格，向上网格即价格升高卖出一定数量的标的物，价格继续升高继续卖出标的物，在每个节点价格的基础上减去一定价差，作为节点的平仓触发价格。' : '',
        'rotation_form_gridAnnotation2': this.$isChineseLanguage_G_X ? '向下网格相反，即价格下跌买入一定数量的标的物，价格继续下跌继续买入标的物，在每个节点价格的基础上加上一定的价差，作为节点的持仓触发价格。在超出网格后，对距离当前价格最远的节点仓位止损（平仓）。' : '',
        'rotation_form_trendAnnotation1': this.$isChineseLanguage_G_X ? '加仓阈值： 设置 0.02 ，即为 2%  。' : '',
        'rotation_form_trendAnnotation2': this.$isChineseLanguage_G_X ? '计价币使用比例：  设置 0.2 ，即 该交易对 使用 计价币 时，只使用当前的 20%' : '',
        'rotation_form_trendAnnotation3': this.$isChineseLanguage_G_X ? '策略思路' : '',
        'rotation_form_trendAnnotation4': this.$isChineseLanguage_G_X ? '根据策略初始运行时价格最为基础价格，每上涨  加仓阈值 * 100 % ，使用当前账户可用于买的资产（当前账户计价币 * 计价币使用比例 * 100 %）中的加仓阈值 * 100 % 买入。然后更新基础价格为 当前价格。如果是下跌  加仓阈值 * 100%，用当前账户的资产中的  加仓阈值 * 100 %卖出。然后更新基础价格为 当前价格。对于策略看多，看空，可以根据账户配置的币和钱比例调整，平衡状态是 计价币价值 和 交易币价值为  1：1' : '',
        'rotation_form_investmentAnnotation1': this.$isChineseLanguage_G_X ? '初始资产全为计价币，定时买入一定量的币数，等待时间间隔到达参数设置后的数值后，继续买入。' : '',
        'rotation_button_activation': this.$isChineseLanguage_G_X ? '开启' : '',
        'rotation_button_deactivation': this.$isChineseLanguage_G_X ? '暂停' : '',
        'rotation_button_storage': this.$isChineseLanguage_G_X ? '保存' : '',
        'rotation_bottom_hints1': this.$isChineseLanguage_G_X ? '策略将在' : '',
        'rotation_bottom_hints2': this.$isChineseLanguage_G_X ? '开始执行' : '',
        'rotation_bottom_hints3': this.$isChineseLanguage_G_X ? '停止执行！' : '',
        'rotation_form_accountInfo': this.$isChineseLanguage_G_X ? '账户信息' : '',
        'rotation_table_th1': this.$isChineseLanguage_G_X ? '平台' : '',
        'rotation_table_th2': this.$isChineseLanguage_G_X ? '基础货币' : '',
        'rotation_table_th3': this.$isChineseLanguage_G_X ? '计价货币' : '',
        'rotation_table_th4': this.$isChineseLanguage_G_X ? '买手续费' : '',
        'rotation_table_th5': this.$isChineseLanguage_G_X ? '卖手续费' : '',
        'rotation_table_th6': this.$isChineseLanguage_G_X ? '累计盈亏' : '',
        'rotation_table_th6Tip': this.$isChineseLanguage_G_X ? '累计盈亏是指在量化市场里买卖出现的实际盈亏。' : '',
        'rotation_chart_floatingProfit': this.$isChineseLanguage_G_X ? '浮动盈亏' : '',
        'rotation_chart_floatingTitle': this.$isChineseLanguage_G_X ? '历史盈亏走势图' : '',
        'rotation_chart_titleTip1': this.$isChineseLanguage_G_X ? '初始净值：' : '',
        'rotation_chart_titleTip2': this.$isChineseLanguage_G_X ? '累计盈亏：' : '',
        'rotation_chart_titleTip3': this.$isChineseLanguage_G_X ? '当前持仓均价：' : '',
        'rotation_check_empty': this.$isChineseLanguage_G_X ? '请检查每个策略参数配置正确再保存！' : '',
        'rotation_check_saved': this.$isChineseLanguage_G_X ? '请先保存策略再进行开启！' : ''
      }
    }
  }
}
export default mixins
