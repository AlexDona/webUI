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
        <header class="extension-info-header line-height56 paddinglr20 border-radius2">
          <span class="font-size16 header-color">
            <!---邀请推广-->
            {{ $t('M.comm_user_invite_generalize') }}
          </span>
        </header>
        <div class="extension-info-content padding-top0">
          <div class="info-record border-radius2">
            <div class="extension-code">
              <div class="code-left font-size12">
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
                    class="font-size12"
                    iconName="icon-erweima1"
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
                  <VueQrcode
                    class="ercode"
                    :value="String(promoteLink + innerUserInfo.showId)"
                    :options="{ size: 100 }"
                    v-show="ercodeIsShowId"
                  >
                  </VueQrcode>
                </span>
              </div>
            </div>
          </div>
          <div class="promotion-box">
            <div class="promotion-number">
              <div class="promotion-info">
                <p class="info-left">
                  <span
                    class="info-left-color font-size30"
                  >
                    {{ totalPageMyNumber }}
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
                <p class="info-right">
                  <span class="info-left-color font-size30">
                    <!--0.00000-->
                    {{ BTCAssets }}
                  </span>
                  <span>BTC</span>
                </p>
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
            style="width: 100%"
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
                <div>{{ s.row.userName }}</div>
              </template>
            </el-table-column>
            <!-- 注册时间 -->
            <el-table-column
              :label="$t('M.comm_register_time') + $t('M.comm_time')"
              width="180"
            >
              <template slot-scope = "s">
                <div>{{ timeFormatting(s.row.regTime) }}</div>
              </template>
            </el-table-column>
            <!-- 姓名 -->
            <el-table-column
              :label="$t('M.comm_name')"
              width="100"
            >
              <template slot-scope = "s">
                <div>{{ s.row.realname }}</div>
              </template>
            </el-table-column>
            <!-- 高级认证 -->
            <el-table-column
              :label="$t('M.user_senior_certification')"
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
            <!-- 直接推荐人UID -->
            <el-table-column
              :label="$t('M.user_invite_direct_referrer')"
            >
              <template slot-scope = "s">
                <div>{{ s.row.inviter }}</div>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <el-pagination
            background
            v-show="activeName === 'current-entrust' && extensionList.length"
            layout="prev, pager, next"
            :page-count="totalPageForMyEntrust"
            @current-change="changeCurrentPage"
          >
          </el-pagination>
        </div>
      </div>
      <!--奖励记录-->
      <div class="award-record margin-top9 padding-top0">
        <header class="award-record-header line-height56">
          <span class="font-size16 header-color">
            <!--奖励记录-->
            {{ $t('M.user_invite_award') }}{{ $t('M.comm_record') }}
          </span>
        </header>
        <div class="award-record-content">
          <el-table
            :data="awardList"
            style="width: 100%"
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
                  <!--邀请奖励-->
                  {{ $t('M.comm_user_invite') }}{{ $t('M.user_invite_award') }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('M.comm_currency')"
            >
              <template slot-scope = "s">
                <div>{{ coinName }}</div>
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
import VueClipboard from 'vue-clipboard2'
import {
  userPromotionList,
  getRecommendUserPromotionList,
  currencyTransform
} from '../../../utils/api/personal'
import {domain} from '../../../utils/env'
import {
  returnAjaxMsg,
  getNestedData
} from '../../../utils/commonFunc'
import {timeFilter} from '../../../utils/index'
Vue.use(VueClipboard)
export default {
  components: {
    IconFontCommon, // 字体图标
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
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
      promoteLink: `${domain}/register?showId=`, // 推广链接
      ercodeIsShowId: false, // 二维码显示状态
      // 推广统计
      extensionList: [],
      activeAwardList: 'current-awardList',
      currentPageMyEntrust: 1, // 当前委托页码
      totalPageMyEntrust: 1, // 当前委托总页数
      // 奖励记录
      awardList: [],
      totalSumBTC: '', // btc资产
      BTC2CNYRate: '', // 转换汇率
      coinName: '', // 币种名称
      partLoading: false // 局部列表loading
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/UserAssets/InvitingPromotion.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/UserAssets/InvitingPromotionDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/UserAssets/InvitingPromotionNight.css')
  },
  mounted () {
    console.log(domain)
    this.getInverData()
  },
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    // 时间格式化
    timeFormatting (date) {
      return timeFilter(date, 'normal')
    },
    // 汇率转换 已获得的佣金预估
    async currencyTransform () {
      console.log(1)
      const params = {
        coinName: 'HF',
        shortName: 'CNY'
      }
      const data = await currencyTransform(params)
      console.log(2)
      if (!returnAjaxMsg(data, this)) {
        console.log(3)
        return false
      } else {
        console.log(data)
        if (data.data.data.coinPrice) {
          // this.BTC2CNYRate = data.data.data.coinPrice
          this.BTC2CNYRate = getNestedData(data, 'data.data.coinPrice')
        }
      }
    },
    // 类型筛选（直接 间接）
    changeId (e) {
      console.log(e)
      this.generalizeOptionsList.forEach(item => {
        if (e === item.value) {
          this.generalizeValue = e
          // this.loading = true
          // this.loading = true
          this.getUserPromotionList()
          console.log(this.generalizeValue)
        }
      })
    },
    // 直接推广 间接推广列表
    async getUserPromotionList () {
      // this.loading = true
      let data = await userPromotionList({
        type: this.generalizeValue, // 筛选类型
        currentPage: this.currentPageForMyEntrust, // 分页
        pageSize: this.pageSize // 页码
      })
      console.log(data)
      if (!(returnAjaxMsg(data, this, 0))) {
        // 接口失败清除局部loading
        this.partLoading = false
        return false
      } else {
        // 接口成功清除局部loading
        this.partLoading = false
        // 返回展示
        // this.extensionList = data.data.data.page.list
        this.extensionList = getNestedData(data, 'data.data.page.list')
        console.log(this.extensionList)
        // this.totalPageForMyEntrust = data.data.data.page.pages - 0
        this.totalPageForMyEntrust = getNestedData(data, 'data.data.page.pages') - 0
        // this.totalPageMyNumber = data.data.data.page.total - 0
        this.totalPageMyNumber = getNestedData(data, 'data.data.page.total') - 0
        // 已获得的佣金预估
        // this.totalSumBTC = data.data.data.account
        this.totalSumBTC = getNestedData(data, 'data.data.account')
        console.log(this.totalSumBTC)
      }
    },
    // 分页
    changeCurrentPage (pageNum) {
      this.currentPageForMyEntrust = pageNum
      this.getUserPromotionList()
    },
    // 推荐用户币种列表
    async getRecommendUserPromotion () {
      // this.loading = true
      let data = await getRecommendUserPromotionList({
        pageNumber: this.currentPageMyEntrust, // 页码
        pageSize: this.pageSize // 条数
      })
      console.log(data)
      if (!returnAjaxMsg(data, this)) {
        // 接口失败清除局部loading
        this.partLoading = false
        return false
      } else {
        // 接口失败清除局部loading
        this.partLoading = false
        // let responseData = data.data.data
        let responseData = getNestedData(data, 'data.data')
        // 返回展示
        // this.awardList = responseData.data.list
        this.awardList = getNestedData(responseData, 'data.list')
        // this.coinName = responseData.coinName
        this.coinName = getNestedData(responseData, 'coinName')
        // this.totalPageMyEntrust = responseData.data.pages - 0
        this.totalPageMyEntrust = getNestedData(responseData, 'data.pages') - 0
      }
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
      userCenterActiveName: state => state.personal.userCenterActiveName
    }),
    // BTC 已获得的佣金预估
    BTCAssets () {
      return (this.BTC2CNYRate - 0) * (this.totalSumBTC - 0)
    }
  },
  watch: {
    loading (newVal) {
      // console.log(newVal)
    },
    ercodeIsShowId (newVal) {
      // console.log(newVal)
    },
    userCenterActiveName (newVal) {
      // console.log(newVal)
      // console.log('invitation-promote')
      if (newVal === 'invitation-promote') {
        this.getInverData()
      }
    },
    language (newVal) {
      // console.log('当前选中语言')
      // console.log(newVal)
    }
  }
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/IndexPersonal";
  .invitation-promotion{
    >.invitation-promotion-main{
      .code-copy {
        color: #338FF5;
      }
      /*推广信息*/
      >.extension-info{
        min-height: 200px;
        >.extension-info-header{
          height: 56px;
        }
        >.extension-info-content{
          min-height: 130px;
          >.info-record {
            width: 100%;
            height: 120px;
            padding: 0 17px;
            margin-top: 19px;
            >.extension-code,
            >.extension-link{
              width: 100%;
              height: 60px;
              display: flex;
              >.code-left,
              >.code-right,
              >.link-left,
              >.link-right {
                flex: 1;
                line-height: 60px;
              }
              >.code-right,
              >.link-right{
                flex: 2;
                >.code-right-rendering,
                >.code-right-rendering {
                  margin-right: 10px;
                }
                >.code-copy {
                  text-align: center;
                  display: inline-block;
                  width: 80px;
                  height: 26px;
                  line-height: 26px;
                  position: relative;
                  >.ercode {
                    position: absolute;
                    bottom: 35px;
                    right: 180px;
                    border-radius: 5px;
                  }
                }
              }
            }
          }
          >.promotion-box {
            display: flex;
            height: 160px;
            >.promotion-number {
              flex: 1;
              >.promotion-info {
                text-align: center;
                width: 200px;
                margin: 45px auto;
              }
            }
          }
        }
      }
      /*推广统计*/
      >.extension-statistics{
        min-height: 200px;
        >.extension-statistics-header{
          height: 56px;
          display: flex;
          >.header-right {
            flex: 1;
          }
          >.header-select {
            text-align: right;
          }
        }
        >.extension-statistics-content{
          min-height: 130px;
        }
      }
      /*奖励记录*/
      >.award-record{
        min-height: 200px;
        >.award-record-header{
          height: 56px
        }
        >.award-record-content{
          min-height: 130px;
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      >.background-color {
        background-color: $nightMainBgColor;
      }
      .invitation-promotion-main{
        >.extension-info{
          background-color: $nightMainBgColor;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          >.extension-info-content{
            >.info-record {
              background: #283049;
              >.extension-code {
                border-bottom: 1px solid #364654;
              }
              >.extension-code,
              >.extension-link{
                >.code-left,
                >.link-left {
                  color: #9DA5B3;
                }
                >.code-right,
                >.link-right{
                  >.code-right-rendering {
                    color: #9DA5B3;
                  }
                  >.code-copy {
                    color: #338FF5;
                    background-color: #45535E;
                  }
                }
              }
            }
            >.promotion-box {
              .promotion-info {
                .info-left-text {
                  color: #9DA5B3;
                }
              }
              .info-left,
              .info-right {
                color: #338FF5;
              }
            }
          }
        }
        >.extension-statistics {
          background-color: $nightMainBgColor;
          >.extension-statistics-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
        }
        >.award-record {
          background-color: $nightMainBgColor;
          >.award-record-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
        }
      }
      .invitation-promotion-header {
        .header-content {
          color: #338FF5;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      >.background-color {
        background-color: #ccc;
      }
      .invitation-promotion-main {
        >.extension-info{
          background:rgba(255,255,255,1);
          border:1px solid rgba(236,241,248,1);
          >.extension-info-header{
            border-bottom:1px solid rgba(236,241,248,1);
            >.header-color {
              color: #333;
            }
          }
          >.extension-info-content{
            >.info-record {
              background: #F3F8FF;
              >.extension-code {
                border-bottom: 1px solid #ecf1f8;
                >.extension-code,
                >.extension-link{
                  >.code-left,
                  >.link-left {
                    color: #333;
                  }
                  >.code-right,
                  >.link-right {
                    >.code-right-rendering {
                      color: #333;
                    }
                    >.code-copy {
                      color: red;
                      background: rgb(255,255,255);
                      border:1px solid rgba(125,144,172,1);
                    }
                  }
                }
              }
            }
            >.promotion-box {
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
                >.info-left-color {
                  color: #338FF5;
                }
              }
            }
          }
        }
        >.extension-statistics {
          background:rgba(255,255,255,1);
          border:1px solid rgba(38,47,56,0.1);
          >.extension-statistics-header {
            border-bottom: 1px solid rgba(236,241,248,1);
            >.header-color {
              color: #333;
            }
          }
        }
        >.award-record {
          background:rgba(255,255,255,1);
          border:1px solid rgba(38,47,56,0.1);
          >.award-record-header {
            border-bottom: 1px solid rgba(236,241,248,1);
            >.header-color {
              color: #333;
            }
          }
        }
      }
      .invitation-promotion-header {
        background:rgba(255,255,255,1);
        border:1px solid rgba(236,241,248,1);
        .header-content {
          color: #338FF5;
        }
      }
    }
  }
</style>
