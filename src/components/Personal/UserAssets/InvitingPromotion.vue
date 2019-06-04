<template>
  <div
    class="invitation-promotion personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="invitation-promotion-header personal-height40 line-height40 padding-left20 font-size16 background-color border-radius2">
      <span class="padding-left23 header-content">
        <!--邀请推广-->
        {{ $t('M.comm_user_invite_generalize') }}
      </span>
    </header>
    <div class="invitation-promotion-main min-height500 margin-top9">
      <!---邀请推广-->
      <div class="extension-info">
        <header class="extension-info-header line-height56 padding-lr20 border-radius2">
          <span class="font-size16 header-color">
            <!---邀请推广-->
            {{ $t('M.comm_user_invite_generalize') }}
          </span>
        </header>
        <div class="extension-info-content padding-top0">
          <div class="info-record border-radius2">
            <div class="extension-code">
              <div class="code-left font-size14">
                <!--推广码-->
                {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_yard') }}
              </div>
              <div class="code-right text-align-r">
                <span
                  class="code-right-rendering text-align-r"
                  id="text"
                >
                  {{ innerUserInfo.showId }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  v-clipboard:copy="innerUserInfo.showId"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-fuzhi"
                  />
                  <!--复制-->
                  {{ $t('M.comm_copy') }}
                </span>
              </div>
            </div>
            <div class="extension-link">
              <div class="link-left">
                <!--推广链接-->
                {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_link') }}
              </div>
              <div class="link-right text-align-r">
                <span
                  class="code-right-rendering"
                  id="link"
                >
                  {{ promoteLink + innerUserInfo.showId }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  @mouseenter="showStatusCode(1)"
                  @mouseleave="showStatusCode(2)"
                >
                  <IconFontCommon
                    class="font-size12 erweima1-code"
                    iconName="icon-erweima2"
                  />
                  <!--二维码-->
                  {{ $t('M.comm_qr_code') }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  v-clipboard:copy="promoteLink + innerUserInfo.showId"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-fuzhi"
                  />
                  <!--复制-->
                   {{ $t('M.comm_copy') }}
                  <Qrcode
                    class="ercode"
                    :value="String(promoteLink + innerUserInfo.showId)"
                    v-show="ercodeIsShowId"
                  >
                  </Qrcode>
                </span>
              </div>
            </div>
          </div>
          <div class="promotion-box">
            <div class="promotion-number">
              <div class="promotion-info">
                <p class="info-left">
                  <span
                    v-if="totalPageMyNumber !== ''"
                    class="info-left-color font-size30"
                  >
                    {{ totalPageMyNumber }}
                  </span>
                  <span
                    v-else
                    class="info-left-color font-size30"
                  >
                    0
                  </span>
                  <span class="font-size12">
                    <!--人-->
                    {{ $t('M.user_invite_people') }}
                  </span>
                </p>
                <span class="color-text font-size12 display-inline-block margin-top30">
                  <!--成功邀请-->
                  {{ $t('M.user_invite_succeed') }}{{ $t('M.comm_user_invite') }}
                </span>
              </div>
            </div>
            <div class="promotion-number">
              <div class="promotion-info">
                <div class="info-right">
                  <!--首先判断汇率名称是否为CNY 不是则不展示-->
                  <p
                    class="info-left-color font-size30"
                    v-if="activeConvertCurrencyObj.shortName !== 'CNY'"
                  >
                    <!--二次判断后台btc大于0展示cny * 当前汇率+法币单位 如果btc小于0则显示0.0000-->
                    {{this.totalSumCNY > 0? $scientificToNumber(keep4Num(this.totalSumCNY * CNYRate)) : '0.0000'}}<span class="font-size12">{{ activeConvertCurrencyObj.shortName }}</span>
                  </p>
                  <!--如果等于cny 则直接显示后台返回cny折算-->
                  <p
                    class="info-left-color font-size30"
                    v-else
                  >
                    <!--二次判断后台btc大于0展示cny * 当前汇率 如果btc小于0则显示0.0000-->
                    {{this.totalSumCNY > 0? $scientificToNumber(keep4Num(this.totalSumCNY)) : '0.0000'}}<span class="font-size12">CNY</span>
                  </p>
                </div>
                <span class="color-text font-size12 display-inline-block margin-top30">
                  <!--已获得的佣金预估-->
                  {{ $t('M.user_invite_have_obtained') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--推广统计-->
      <div class="extension-statistics margin-top9 padding-top0">
        <header class="extension-statistics-header line-height56">
          <span class="font-size16 header-color header-right">
            <!--推广统计-->
            {{ $t('M.comm_user_generalize') }}{{ $t('M.user_invite_statistics') }}
          </span>
          <div class="header-right header-select">
            <!--请选择-->
            <el-select
              v-model="generalizeValue"
              :no-data-text="$t('M.comm_no_data')"
              :placeholder="$t('M.comm_please_choose')"
              @change="changeId"
            >
              <el-option
                v-for="item in generalizeOptionsList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </header>
        <div class="extension-statistics-content">
          <!--暂无数据-->
          <el-table
            :data="extensionList"
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <!--用户UID 登录名 注册时间 姓名 高级认证 直接推荐人UID-->
            <!-- 用户UID -->
            <el-table-column
              :label="$t('M.user_invite_user_uid')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.showId }}</div>
              </template>
            </el-table-column>
            <!-- 登录名 -->
            <el-table-column
              :label="$t('M.user_invite_login_name')"
            >
              <template slot-scope = "s">
                <div>
                  {{ s.row.userName }}
                </div>
              </template>
            </el-table-column>
            <!-- 注册时间 -->
            <el-table-column
              :label="$t('M.comm_register_time') + $t('M.comm_time')"
              width="180"
            >
              <template slot-scope = "s">
                <div>{{ s.row.regTime }}</div>
              </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column
              :label="$t('M.comm_name')"
              width="90"
            >
              <template slot-scope = "s">
                <div>
                  {{ s.row.realname }}
                </div>
              </template>
            </el-table-column>
            <!-- 高级认证 -->
            <el-table-column
              :label="$t('M.user_senior_certification')"
              width="150"
            >
              <template slot-scope = "s">
                <div v-if="s.row.advancedAuth == 'waitVeritfy'">
                  {{ $t(waitVeritfy) }}
                </div>
                <div v-if="s.row.advancedAuth == 'pass'">
                  {{ $t(pass) }}
                </div>
                <div v-if="s.row.advancedAuth == 'notPass'">
                  {{ $t(notPass) }}
                </div>
              </template>
            </el-table-column>
            <!--当奖励类型为first时显示直接推荐UID 否则显示间接推荐UID -->
            <el-table-column
              :label="generalizeValue === 'first'? $t('M.user_invite_direct_referrer') + 'UID' : $t('M.actionCenter_Indirect_recommend') + 'UID'"
            >
              <template slot-scope = "s">
                <div>{{ s.row.inviter }}</div>
              </template>
            </el-table-column>
            <!--&lt;!&ndash; 状态 &ndash;&gt;-->
            <el-table-column
              :label="$t('M.comm_state')"
            >
              <template slot-scope = "s">
                <div>
                  <!--已发放-->
                  <!--giveStatus 为PUBLISH则显示已发放为空则显示未发放 帅飞定义-->
                  {{ s.row.giveStatus === 'PUBLISH' ? $t('M.user_invite_issued'): $t('M.user_invite_noIssued')}}
                  <!--未发放-->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'current-entrust' && extensionList.length"
            layout="prev, pager, next"
            :current-page="currentPageForMyEntrust"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage"
          >
          </el-pagination>
        </div>
      </div>
      <!--奖励记录-->
      <div class="award-record margin-top9 padding-top0 margin-bottom10">
        <header class="award-record-header line-height56">
          <span class="font-size16 header-color">
            <!--奖励记录-->
            {{ $t('M.user_invite_award') }}{{ $t('M.comm_record') }}
          </span>
        </header>
        <div class="award-record-content">
          <el-table
            :data="awardList"
            style="width: 100%;"
            :empty-text="$t('M.comm_no_data')"
            v-loading="partLoading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <!--奖励类型 邀请奖励 币种 数量 时间-->
            <el-table-column
              :label="$t('M.user_invite_award') + $t('M.comm_type')"
            >
              <template slot-scope = "s">
                <div>
                  <!-- 直接奖励 间接奖励 注册奖励-->
                  {{ s.row.type === 'first'? $t('M.user_direct_reward'): (s.row.type === 'second'? $t('M.user_indirect_reward'): $t('M.user_invite_registration')) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_currency')"
            >
              <template slot-scope = "s">
                <div>{{ source }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_count')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.content-0 }}</div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_time')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.operateTime }}</div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="activeAwardList === 'current-awardList' && awardList.length"
            layout="prev, pager, next"
            :current-page="currentPageMyEntrust"
            :page-count="totalPageMyEntrust"
            @current-change="changeCurrentPageAward"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import IconFontCommon from '../../Common/IconFontCommon'
import Qrcode from '../../Common/Qrcode'
import VueClipboard from 'vue-clipboard2'
import {
  userPromotionList,
  getRecommendUserPromotionList,
  currencyTransform
} from '../../../utils/api/personal'
import {domain} from '../../../utils/env'
import {
  // returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils/index'
import Vue from 'vue'
Vue.use(VueClipboard)
export default {
  components: {
    IconFontCommon, // 字体图标
    Qrcode
  },
  data () {
    return {
      generalizeValue: 'first', // 默认显示第一个
      // 直接推广 间接推广
      generalizeOptionsList: [{
        value: 'first',
        label: 'M.user_invite_direct'
      }, {
        value: 'second',
        label: 'M.user_invite_indirect'
      }],
      waitVeritfy: 'M.user_invite_audit', // 待审核
      pass: 'M.user_invite_already_passed', // 已通过
      notPass: 'M.user_invite_not_pass', // 未通过
      activeName: 'current-entrust',
      currentPageForMyEntrust: 1, // 当前委托页码
      totalPageForMyEntrust: 1, // 当前委托总页数
      totalPageMyNumber: '', // 条数
      pageSize: 10, // 每页显示条数
      promoteLink: `${domain}/register?showId=`, // 推广链接
      ercodeIsShowId: false, // 二维码显示状态
      // 推广统计
      extensionList: [],
      activeAwardList: 'current-awardList',
      currentPageMyEntrust: 1, // 当前委托页码
      totalPageMyEntrust: 1, // 当前委托总页数
      // 奖励记录
      awardList: [],
      totalSumCNY: '', // cny资产
      CNYRate: '', // 转换汇率
      coinName: '', // 币种名称
      partLoading: false // 局部列表loading
    }
  },
  async created () {
    if (this.currencyRateList.BTC) {
      // 汇率转换
      this.currencyTransform()
    }
  },
  mounted () {
    console.log(domain)
    this.getInverData()
  },
  activated () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 1.0 汇率折算以及根据header切换显示对应资产换算
    async currencyTransform () {
      const { shortName } = this.activeConvertCurrencyObj
      if (!shortName) return
      const params = {
        coinName: 'FBT',
        shortName: shortName
      }
      const data = await currencyTransform(params)
      if (!data) return false
      // 获取汇率
      this.CNYRate = getNestedData(data, 'data.coinPrice')
      // console.log(this.totalSumCNY * this.CNYRate)
    },
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 类型筛选（直接 间接）
    changeId (e) {
      this.currentPageForMyEntrust = 1
      this.currentPageMyEntrust = 1
      console.log(e)
      this.generalizeOptionsList.forEach(item => {
        if (e === item.value) {
          this.generalizeValue = e
          // this.loading = true
          this.getUserPromotionList()
          console.log(this.generalizeValue)
        }
      })
    },
    // 直接推广 间接推广列表
    async getUserPromotionList () {
      let data = await userPromotionList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentPageForMyEntrust, // 当前页码
        type: this.generalizeValue // 筛选类型
      })
      console.log(data)
      // 接口返回清除局部loading
      this.partLoading = false
      if (!data) return false
      // 返回展示
      this.extensionList = getNestedData(data, 'data.page.list')
      this.totalPageForMyEntrust = getNestedData(data, 'data.page.pages') - 0
      this.totalPageMyNumber = getNestedData(data, 'data.page.total') - 0
      // 已获得的佣金折合
      this.totalSumCNY = getNestedData(data, 'data.btc')
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getUserPromotionList()
    },
    // 推荐用户币种列表
    async getRecommendUserPromotion () {
      let data = await getRecommendUserPromotionList({
        pageSize: this.pageSize, // 每页显示条数
        pageNumber: this.currentPageMyEntrust // 当前页码
      })
      // 接口返回清除局部loading
      this.partLoading = false
      if (!data) return false
      let responseData = getNestedData(data, 'data')
      // 返回展示
      this.awardList = getNestedData(responseData, 'data.list')
      this.coinName = getNestedData(responseData, 'coinName')
      this.totalPageMyEntrust = getNestedData(responseData, 'data.pages') - 0
    },
    // 分页
    async changeCurrentPageAward (pageNum) {
      this.currentPageMyEntrust = pageNum
      await this.getRecommendUserPromotion()
    },
    //  点击复制
    onCopy (e) {
      // 已拷贝
      // let msg = '已拷贝'
      let msg = this.$t('M.comm_have_been_copied')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError (e) {
      // 拷贝失败，请稍后重试
      // let msg = '拷贝失败，请稍后重试'
      let msg = this.$t('M.comm_copies_failure')
      this.$message({
        type: 'success',
        message: msg
      })
    },
    showStatusCode (val) {
      if (val == 1) {
        // 显示二维码
        this.ercodeIsShowId = true
      } else {
        // 隐藏二维码
        this.ercodeIsShowId = false
      }
    },
    async getInverData () {
      this.partLoading = true
      console.log('invitation-promote')
      await this.getUserPromotionList()
      await this.getRecommendUserPromotion()
    }
  },
  filter: {},
  computed: {
    ...mapState({
      language: state => state.common.language, // 当前选中语言
      theme: state => state.common.theme,
      userInfo: state => state.user.loginStep1Info, // 用户详细信息
      innerUserInfo: state => state.user.loginStep1Info.userInfo, // 内层用户详细信息
      activeConvertCurrencyObj: state => state.common.activeConvertCurrencyObj, // 目标货币
      currencyRateList: state => state.common.currencyRateList // 折算货币列表
    })
  },
  watch: {
    async activeConvertCurrencyObj () {
      if (this.currencyRateList.BTC) {
        // 汇率转换
        this.currencyTransform()
      }
    }
  }
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";

  .invitation-promotion {
    > .invitation-promotion-main {
      .code-copy {
        color: #338ff5;
      }

      /* 推广信息 */
      > .extension-info {
        min-height: 200px;

        > .extension-info-header {
          height: 56px;
        }

        > .extension-info-content {
          min-height: 130px;

          > .info-record {
            width: 100%;
            height: 120px;
            padding: 0 17px;
            margin-top: 19px;

            > .extension-code,
            > .extension-link {
              display: flex;
              width: 100%;
              height: 60px;

              > .code-left,
              > .code-right,
              > .link-left,
              > .link-right {
                flex: 1;
                line-height: 60px;
              }

              > .code-right,
              > .link-right {
                flex: 2;

                > .code-right-rendering,
                > .code-right-rendering {
                  margin-right: 10px;
                }

                > .code-copy {
                  position: relative;
                  display: inline-block;
                  width: 80px;
                  height: 26px;
                  line-height: 26px;
                  text-align: center;

                  > .erweima1-code {
                    color: #338ff5;
                  }

                  > .ercode {
                    position: absolute;
                    bottom: 35px;
                    right: 180px;
                    width: 100px !important;
                    height: 100px !important;
                    border-radius: 5px;
                  }
                }
              }
            }
          }

          > .promotion-box {
            display: flex;
            height: 160px;

            > .promotion-number {
              flex: 1;

              > .promotion-info {
                width: 200px;
                margin: 45px auto;
                text-align: center;
              }
            }
          }
        }
      }

      /* 推广统计 */
      > .extension-statistics {
        min-height: 280px;

        > .extension-statistics-header {
          display: flex;
          height: 56px;

          > .header-right {
            flex: 1;
          }

          > .header-select {
            text-align: right;
          }
        }

        > .extension-statistics-content {
          min-height: 130px;
        }
      }

      /* 奖励记录 */
      > .award-record {
        min-height: 280px;

        > .award-record-header {
          height: 56px;
        }

        > .award-record-content {
          min-height: 130px;
        }
      }
    }

    /deep/ {
      /* 覆盖element样式 */
      .el-input__inner {
        width: 160px;
        height: 30px;
      }

      .el-select-dropdown__item {
        width: 120px !important;
        height: 30px;
      }

      .el-scrollbar {
        width: 120px;
      }

      .cell {
        font-size: 12px;
      }

      .cell,
      .el-table th div {
        padding-left: 18px;
      }

      .el-table__empty-block {
        min-height: 140px;
      }

      .el-table__empty-text {
        font-size: 12px;
      }
    }

    &.night {
      color: $nightFontColor;
      background-color: $nightBgColor;

      > .background-color {
        background-color: $nightMainBgColor;
      }

      .invitation-promotion-main {
        > .extension-info {
          background-color: $nightMainBgColor;

          > .extension-info-header {
            border-bottom: 1px solid #39424d;

            > .header-color {
              color: #fff;
            }
          }

          > .extension-info-content {
            > .info-record {
              background: #283049;

              > .extension-code {
                border-bottom: 1px solid #364654;
              }

              > .extension-code,
              > .extension-link {
                > .code-left,
                > .link-left {
                  color: #9da5b3;
                }

                > .code-right,
                > .link-right {
                  > .code-right-rendering {
                    color: #9da5b3;
                  }

                  > .code-copy {
                    color: #338ff5;
                    background-color: #45535e;
                  }
                }
              }
            }

            > .promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #9da5b3;
                }
              }

              .info-left,
              .info-right {
                color: #338ff5;
              }
            }
          }
        }

        > .extension-statistics {
          background-color: $nightMainBgColor;

          > .extension-statistics-header {
            border-bottom: 1px solid #39424d;

            > .header-color {
              color: #fff;
            }
          }
        }

        > .award-record {
          background-color: $nightMainBgColor;

          > .award-record-header {
            border-bottom: 1px solid #39424d;

            > .header-color {
              color: #fff;
            }
          }
        }
      }

      .invitation-promotion-header {
        .header-content {
          color: #338ff5;
        }
      }

      /deep/ {
        /* 个人中心（黑色主题） */
        th,
        tr {
          background-color: #1c1f32;
        }

        thead {
          color: #617499;
        }

        th.is-leaf {
          border-bottom: 0;
        }

        tr {
          &:hover td {
            background-color: #1c1f32;
          }
        }

        td {
          border-bottom: 0;
          color: #ccc;
        }

        .cell {
          color: #a9bed4;
        }

        .el-table {
          color: #fff;
        }

        .cell.highlight {
          color: #617499;
        }

        .el-input__inner {
          border: 0;
          color: #fff;
          background-color: #333a41;

          &:focus {
            border: 0;
          }
        }

        .el-table__empty-block {
          background-color: #1c1f32;
        }
      }
    }

    &.day {
      color: $dayFontColor;
      background-color: $dayBgColor;

      > .background-color {
        background-color: #ccc;
      }

      .invitation-promotion-main {
        > .extension-info {
          border: 1px solid rgba(236, 241, 248, 1);
          background: rgba(255, 255, 255, 1);

          > .extension-info-header {
            border-bottom: 1px solid rgba(236, 241, 248, 1);

            > .header-color {
              color: #333;
            }
          }

          > .extension-info-content {
            > .info-record {
              background: #f3f8ff;

              > .extension-code {
                border-bottom: 1px solid #ecf1f8;

                > .extension-code,
                > .extension-link {
                  > .code-left,
                  > .link-left {
                    color: #333;
                  }

                  > .code-right,
                  > .link-right {
                    > .code-right-rendering {
                      color: #333;
                    }

                    > .code-copy {
                      border: 1px solid rgba(125, 144, 172, 1);
                      color: #d45858;
                      background: rgb(255, 255, 255);
                    }
                  }
                }
              }
            }

            > .promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #ccc;
                }

                .color-text {
                  color: #333;
                }
              }

              .info-left,
              .info-right {
                > .info-left-color {
                  color: #338ff5;
                }
              }
            }
          }
        }

        > .extension-statistics {
          border: 1px solid rgba(38, 47, 56, .1);
          background: rgba(255, 255, 255, 1);

          > .extension-statistics-header {
            border-bottom: 1px solid rgba(236, 241, 248, 1);

            > .header-color {
              color: #333;
            }
          }
        }

        > .award-record {
          border: 1px solid rgba(38, 47, 56, .1);
          background: rgba(255, 255, 255, 1);

          > .award-record-header {
            border-bottom: 1px solid rgba(236, 241, 248, 1);

            > .header-color {
              color: #333;
            }
          }
        }
      }

      .invitation-promotion-header {
        border: 1px solid rgba(236, 241, 248, 1);
        background: rgba(255, 255, 255, 1);

        .header-content {
          color: #338ff5;
        }
      }

      /deep/ {
        /* 个人中心（白色主题） */
        th,
        tr {
          color: #333;
          background-color: #fff;
        }

        thead {
          color: #fff;
        }

        th.is-leaf {
          border-bottom: 0;
        }

        td {
          border-bottom: 0;
          color: #333;
        }

        .el-table {
          color: #fff;

          .cell {
            color: #333;
          }
        }

        .cell.highlight {
          color: #b1b1b1;
        }

        .el-input__inner {
          border: 0;
          color: #333;
          background: rgba(236, 244, 254, 1);
        }

        .el-input__inner:focus {
          border: 0;
        }

        .el-form-item__label {
          color: #7d90ac;
        }
      }
    }
  }
</style>
