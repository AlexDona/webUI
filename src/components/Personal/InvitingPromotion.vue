<template>
  <div
    class="invitation-promotion personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <header class="invitation-promotion-header personal-height40 line-height40 padding-left20 font-size16 background-color">
      <span class="padding-left23 header-content">邀请推广</span>
    </header>
    <div class="invitation-promotion-main min-height500 margin-top9">
      <!--推广信息-->
      <div class="extension-info padding-top0">
        <header class="extension-info-header line-height56">
          <span class="font-size16 header-color">推广信息</span>
        </header>
        <div class="extension-info-content">
          <div class="info-record border-radius2">
            <div class="extension-code">
              <div class="code-left font-size12 code-color">推广码</div>
              <div class="code-right text-align-r">
                <span
                  class="code-right-rendering"
                  id="text"
                >
                  {{ this.text }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  v-clipboard:copy="this.text"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-fuzhi"
                  />
                  复制
                </span>
              </div>
            </div>
            <div class="extension-link">
              <div class="link-left">推广链接</div>
              <div class="link-right text-align-r">
                <span
                  class="code-right-rendering"
                  id="text"
                >
                  {{ this.link }}
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  @mouseenter="showErcode"
                  @mouseleave="hiddenErcode"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-erweima1"
                  />
                  二维码
                </span>
                <span
                  class="code-copy border-radius5 cursor-pointer"
                  v-clipboard:copy="this.link"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError"
                >
                  <IconFontCommon
                    class="font-size12"
                    iconName="icon-fuzhi"
                  />
                  复制
                  <VueQrcode
                    class="ercode"
                    :value="String(this.qrcode)"
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
                  <span class="info-left-color font-size30">
                    0
                  </span>
                  <span class="font-size12">
                    人
                  </span>
                </p>
                <span class="font-size12 display-inline-block margin-top30">
                  成功邀请
                </span>
              </div>
            </div>
            <div class="promotion-number">
              <div class="promotion-info">
                <p class="info-right">
                  <span class="info-left-color font-size30">
                    0.00000
                  </span>
                  <span>BTC</span>
                </p>
                <span class="font-size12 display-inline-block margin-top30">
                  已获得的佣金预估
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--推广统计-->
      <div class="extension-statistics margin-top9 padding-top0">
        <header class="extension-statistics-header line-height56">
          <span class="font-size16 header-color header-right">推广统计</span>
          <div class="header-right header-select">
            <el-select
              v-model="value"
              placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </header>
        <div class="extension-statistics-content">
          <el-table
            :data="extensionList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column
              prop="userUID"
              label="用户UID"
            >
            </el-table-column>
            <el-table-column
              prop="loginName"
              label="登录名"
            >
            </el-table-column>
            <el-table-column
              prop="registerTime"
              label="注册时间"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="certification"
              label="高级认证"
            >
            </el-table-column>
            <el-table-column
              prop="refereeUID"
              label="直接推荐人UID"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--奖励记录-->
      <div class="award-record margin-top9 padding-top0">
        <header class="award-record-header line-height56">
          <span class="font-size16 header-color">奖励记录</span>
        </header>
        <div class="award-record-content">
          <el-table
            :data="awardList"
            style="width: 100%"
            empty-text="暂无数据"
          >
            <el-table-column
              prop="type"
              label="奖励类型"
            >
            </el-table-column>
            <el-table-column
              prop="currency"
              label="币种"
            >
            </el-table-column>
            <el-table-column
              prop="count"
              label="数量"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import IconFontCommon from '../Common/IconFontCommon'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  components: {
    IconFontCommon, // 字体图标
    // 二维码组件
    VueQrcode: resolve => {
      require([('@xkeshi/vue-qrcode')], resolve)
    }
  },
  // props,
  data () {
    return {
      value: '直接推广',
      options: [{
        value: '1',
        label: '直接推广'
      }, {
        value: '2',
        label: '间接推广'
      }],
      text: 'SADFASD',
      link: 'https://www.kucoin.com/#/?r=',
      ercodeIsShowId: false, // 二维码显示状态
      qrcode: '123456',
      // 推广统计
      extensionList: [
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        },
        {
          userUID: '3355446',
          loginName: '18033****',
          registerTime: '2018-08-04 10:30:41',
          name: '二麻子',
          certification: '未认证',
          refereeUID: '5566887'
        }
      ],
      // 奖励记录
      awardList: [
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        },
        {
          type: '推荐奖励',
          currency: 'FUC',
          count: '200.00',
          time: '2018-08-04 10:30:41'
        }
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../static/css/list/Personal/InvitingPromotion.css')
    // 白色主题样式
    require('../../../static/css/theme/day/Personal/InvitingPromotionDay.css')
    // 黑色主题样式
    require('../../../static/css/theme/night/Personal/InvitingPromotionNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    //  点击复制
    onCopy (e) {
      // 已拷贝
      let msg = '已拷贝'
      this.$message({
        type: 'success',
        message: msg
      })
    },
    onError: function (e) {
      // 拷贝失败，请稍后重试
      let msg = '拷贝失败，请稍后重试'
      this.$message({
        type: 'success',
        message: msg
      })
    },
    // 显示二维码
    showErcode () {
      console.log(1)
      this.ercodeIsShowId = true
    },
    // 隐藏二维码
    hiddenErcode () {
      this.ercodeIsShowId = false
    }
  },
  filter: {},
  computed: {
    ...mapState([
      'theme'
    ])
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../static/css/scss/Personal/InvitingPromotion.scss";
  .invitation-promotion{
    >.invitation-promotion-main{
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
                >.code-right-rendering,
                >.code-right-rendering {
                  margin-right: 10px;
                }
                >.code-copy {
                  text-align: center;
                  display: inline-block;
                  width: 70px;
                  height: 26px;
                  line-height: 26px;
                  position: relative;
                  >.ercode {
                    position: absolute;
                    bottom: 35px;
                    right: 180px;
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
        background-color: #212C36;
      }
      .invitation-promotion-main{
        >.extension-info{
          background-color: #202A33;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
          >.extension-info-content{
            >.info-record {
              background:rgba(248,249,252,0.05);
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
          background-color: #202A33;
          >.extension-statistics-header {
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #fff;
            }
          }
        }
        >.award-record {
          background-color: #202A33;
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
          background-color: #ccc;
          >.extension-info-header{
            border-bottom: 1px solid #39424D;
            >.header-color {
              color: #ccc;
            }
          }
          >.extension-info-content{
            >.info-record {
              background:rgba(248,249,252,1);
              >.extension-code {
                border-bottom: 1px solid #364654;
                >.extension-code,
                >.extension-link{
                  >.code-left,
                  >.link-left {
                    color: #9DA5B3;
                  }
                  >.code-right,
                  >.link-right {
                    >.code-right-rendering {
                      color: #9DA5B3;
                    }
                    >.code-copy {
                      color: #338FF5;
                      background-color: #ccc;
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
              }
              .info-left,
              info-right {
                color: #ccc;
              }
            }
          }
        }
        >.extension-statistics {
          background-color: #ccc;
          >.extension-statistics-header {
            border-bottom: 1px solid #333;
            >.header-color {
              color: #ccc;
            }
          }
        }
        >award-record {
          background-color: #ccc;
          >.award-record-header {
            border-bottom: 1px solid #333;
            >.header-color {
              color: #ccc;
            }
          }
        }
      }
      .invitation-promotion-header {
        .header-content {
          color: #555;
        }
      }
    }
  }
</style>
