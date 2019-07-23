<!--
  author: renfuwei
  create: 20190723
  description: 当前页面为 商家信息 组件
-->
<template>
  <div
    class="merchant-info-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="inner-box">
      <!--1 左侧信息-->
      <div class="left-info">
        <!--1.1 头像-->
        <div class="one-avatar">
          <div class="names-box">
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-gerenzhongxin"
            />
            <span class="merchant-name font-size16">
              王二狗
            </span>
          </div>
          <div class="time-box">
            <p class="bar font-size12">注册时间：2019/06/20</p>
            <p class="bar font-size12">最近登录时间：2019/06/27</p>
          </div>
        </div>
        <!--1.2 认证-->
        <div class="two-identity">
          <div class="first-item items">
            <span>邮箱认证</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <div class="second-item items">
            <span>手机认证</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <div class="third-item items">
            <span>实名认证</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <div class="fourth-item items">
            <span>高级认证</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
          <div class="fifth-item items">
            <span>商家认证</span>
            <IconFontCommon
              class="font-size40 icon-user"
              iconName="icon-tongguo_huaban"
            />
          </div>
        </div>
        <!--1.3 交易信息-->
        <div class="trade-infos">
          <div class="first-bar bars">
            <div class="bar-top">商家保证金</div>
            <div class="bar-bottom">10000FUC</div>
          </div>
          <div class="second-bar bars">
            <div class="bar-top">交易总单数</div>
            <div class="bar-bottom">5646</div>
          </div>
          <div class="third-bar bars">
            <div class="bar-top">30日成交单</div>
            <div class="bar-bottom">453</div>
          </div>
          <div class="fourth-bar bars">
            <div class="bar-top">30日成交率</div>
            <div class="bar-bottom">99.66%</div>
          </div>
          <div class="fifth-bar bars">
            <div class="bar-top">30日冻结次数</div>
            <div class="bar-bottom">56</div>
          </div>
          <div class="sixth-bar bars">
            <div class="bar-top">平均放行</div>
            <div class="bar-bottom">05/06</div>
          </div>
        </div>
        <!--1.4 按钮组-->
        <div class="button-group">
          <div class="focus-button-box">
            <button class="button">关注</button>
            <!--<button class="button">取消关注</button>-->
          </div>
          <div class="black-button-box">
            <button class="button">拉黑</button>
            <!--<button class="button">解除</button>-->
          </div>
        </div>
      </div>
      <!--2 右侧列表-->
      <div class="right-lists">
        <div class="buy-list buy-sell-list">
          <div class="header-title buy-title">
            购买广告
          </div>
          <div class="body-content">
            <el-table
              :data="buyTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 币种 -->
              <el-table-column
                :label="$t('M.comm_currency')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.coinName}}/{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <div class="buy-price">
                    {{s.row.price}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.remainCount}}{{s.row.coinName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>
                    {{s.row.minCount}}-{{s.row.maxCount}}{{s.row.currencyName}}
                  </div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!-- 5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="right"
              >
                <template slot-scope="s">
                  <div>
                    <button class="sell-buy-button buy-button border-radius2 cursor-pointer">购买</button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="sell-list buy-sell-list">
          <div class="header-title sell-title">
            出售广告
          </div>
          <div class="body-content">
            <el-table
              :data="sellTableList"
              style="width: 100%;"
              :empty-text="$t('M.comm_no_data')"
            >
              <!-- 币种 -->
              <el-table-column
                :label="$t('M.comm_currency')"
              >
                <template slot-scope = "s">
                  <div>
                    BTC/CNY
                  </div>
                </template>
              </el-table-column>
              <!-- 价格 -->
              <el-table-column
                :label="$t('M.otc_index_price')"
              >
                <template slot-scope = "s">
                  <div class="sell-price">
                    456CNY
                  </div>
                </template>
              </el-table-column>
              <!-- 数量 -->
              <el-table-column
                :label="$t('M.comm_count')"
              >
                <template slot-scope = "s">
                  <div>
                    100BTC
                  </div>
                </template>
              </el-table-column>
              <!-- 限额 -->
              <el-table-column
                :label="$t('M.otc_index_priceLimit')"
              >
                <template slot-scope = "s">
                  <div>
                    100-2000CNY
                  </div>
                </template>
              </el-table-column>
              <!-- 支付方式 -->
              <el-table-column
                :label="$t('M.otc_index_Payment_method')"
              >
                <template slot-scope="s">
                  <div>
                    <!-- 1支付宝 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-zhifubao1"
                      v-if="s.row.payTypes[0] === '1'"
                    />
                    <!-- 2微信 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-weixin1"
                      v-if="s.row.payTypes[1] === '1'"
                    />
                    <!-- 3银行卡 -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-yinhangqia"
                      v-if="s.row.payTypes[2] === '1'"
                    />
                    <!-- 4西联汇款 -->
                    <span v-show="s.row.payTypes[3] === '1'">
                      <img
                        src="../../assets/user/xilian.png"
                        class="xilian"
                      >
                    </span>
                    <!-- 5PAYPAL -->
                    <IconFontCommon
                      class="font-size16"
                      iconName="icon-paypal"
                      v-if="s.row.payTypes[4] === '1'"
                    />
                  </div>
                </template>
              </el-table-column>
              <!-- 操作 -->
              <el-table-column
                :label="$t('M.otc_index_operate')"
                align="right"
              >
                <template slot-scope="s">
                  <div>
                    <button class="sell-buy-button sell-button border-radius2 cursor-pointer">出售</button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
import IconFontCommon from '../../components/Common/IconFontCommon'
export default {
  components: {
    IconFontCommon
  },
  // props,
  data () {
    return {
      // 购买列表
      buyTableList: [
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'BUY'
        },
        {
          'id': '002',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'BUY'
        },
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'BUY'
        },
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'BUY'
        },
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'BUY'
        }
      ],
      // 出售列表
      sellTableList: [
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'SELL'
        },
        {
          'id': '002',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'SELL'
        },
        {
          'id': '001',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'SELL'
        },
        {
          'id': '002',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'SELL'
        },
        {
          'id': '002',
          'coinName': 'USDT',
          'currencyName': 'CNY',
          'price': '7.066',
          'remainCount': '15842.1',
          'maxCount': '134000',
          'minCount': '500',
          'payTypes': ['1', '1', '1', '1', '1'],
          'entrustType': 'SELL'
        }
      ]
    }
  },
  created () {},
  // mounted () {},
  // activated () {},
  // update () {},
  // beforeRouteUpdate () {},
  methods: {},
  // filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  }
  // watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  @import "../../assets/CSS/index";

  .merchant-info-box {
    width: 1300px;
    padding-top: 70px;
    margin: 60px auto 200px;

    > .inner-box {
      display: flex;
      justify-content: space-between;

      > .left-info {
        width: 300px;
        min-height: 927px;

        > .one-avatar {
          box-sizing: border-box;
          height: 150px;
          padding: 25px 0 0 30px;

          > .names-box {
            height: 40px;
            margin-bottom: 20px;
            line-height: 40px;

            .icon {
              margin-right: 20px;
            }
          }

          > .time-box {
            > .bar {
              line-height: 20px;
            }
          }
        }

        > .two-identity {
          position: relative;
          display: flex;
          flex-wrap: wrap;
          height: 180px;
          padding: 30px 30px 0;

          .icon {
            width: 24px;
            height: 24px;
          }

          > .items {
            width: 49%;
            font-size: 12px;
          }

          > .second-item,
          .fourth-item {
            text-align: right;
          }

          &::after {
            position: absolute;
            bottom: 0;
            right: 30px;
            width: 240px;
            height: 1px;
            content: '';
          }
        }

        > .trade-infos {
          display: flex;
          flex-wrap: wrap;
          padding: 30px 10px 0;

          > .bars {
            width: 49%;

            > .bar-top {
              margin-bottom: 6px;
              font-size: 12px;
              text-align: center;
            }

            > .bar-bottom {
              font-size: 14px;
              text-align: center;
            }
          }

          > .first-bar,
          .second-bar,
          .third-bar,
          .fourth-bar {
            margin-bottom: 30px;
          }
        }

        > .button-group {
          display: flex;
          justify-content: space-between;
          padding: 80px 30px 0;

          > .focus-button-box {
            width: 50%;
          }

          > .black-button-box {
            width: 50%;
            text-align: right;
          }

          .button {
            height: 30px;
            padding: 5px 25px;
            border-radius: 2px;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }

      > .right-lists {
        width: 985px;

        > .buy-sell-list {
          > .header-title {
            height: 58px;
            padding-left: 20px;
            font-weight: 700;
            font-size: 18px;
            line-height: 58px;
          }

          > .body-content {
            .buy-price {
              color: $upColor;
            }

            .sell-price {
              color: $otcGreen;
            }

            .xilian {
              vertical-align: middle;
            }

            .sell-buy-button {
              height: 24px;
              padding: 0 10px;
              line-height: 24px;
              color: $mainColorOfWhite;
            }

            .buy-button {
              background-color: $upColor;
            }

            .sell-button {
              background-color: $otcGreen;
            }
          }
        }

        > .buy-list {
          min-height: 440px;
          margin-bottom: 18px;

          > .buy-title {
            color: $upColor;
          }
        }

        > .sell-list {
          min-height: 469px;

          > .sell-title {
            color: $otcGreen;
          }
        }
      }
    }

    /deep/ {
      .inner-box {
        > .right-lists {
          > .buy-sell-list {
            > .body-content {
              .el-table {
                font-size: 12px;

                .el-table__header {
                  thead {
                    tr {
                      th {
                        padding: 14px 0;

                        &:first-child {
                          .cell {
                            padding-left: 20px;
                          }
                        }

                        &:nth-last-child(2) {
                          .cell {
                            padding-right: 20px;
                          }
                        }
                      }
                    }
                  }
                }

                .el-table__body {
                  tr {
                    td {
                      padding: 18px 0;

                      &:first-child {
                        .cell {
                          padding-left: 20px;
                        }
                      }

                      &:last-child {
                        .cell {
                          padding-right: 20px;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    &.night {
      .inner-box {
        > .left-info {
          background-color: $mainContentNightBgColor;
          box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

          > .one-avatar {
            border-bottom: 1px solid $dialogColor10;

            > .names-box {
              > .merchant-name {
                color: $mainColorOfWhite;
              }
            }

            > .time-box {
              color: $dialogColor9;
            }
          }

          > .two-identity {
            .icon {
              color: $mainColor;
            }

            > .items {
              color: $mainColorOfWhite;
            }

            &::after {
              border-bottom: 1px dashed $dialogColor10;
            }
          }

          > .trade-infos {
            > .bars {
              > .bar-top {
                color: $dialogColor9;
              }

              > .bar-bottom {
                color: $mainColorOfWhite;
              }
            }
          }

          > .button-group {
            > .focus-button-box {
              > .button {
                color: $mainColorOfWhite;
                background-color: $mainColor;
              }
            }

            > .black-button-box {
              > .button {
                border: 1px solid $mainColor;
                color: $mainColor;
                background-color: $mainContentNightBgColor;
              }
            }
          }
        }

        > .right-lists {
          .buy-sell-list {
            background-color: $mainContentNightBgColor;
            box-shadow: 0 3px 4px 0 rgba(25, 30, 40, 1);

            > .header-title {
              border-bottom: 1px solid $dialogColor10;
            }
          }
        }
      }

      /deep/ {
        .inner-box {
          > .right-lists {
            > .buy-sell-list {
              > .body-content {
                .el-table {
                  color: $mainColorOfWhite;
                  background-color: $mainContentNightBgColor;

                  .el-table__header {
                    thead {
                      color: $mainNightTitleColor;

                      tr {
                        th {
                          background-color: $mainContentNightBgColor;

                          &.is-leaf {
                            border-bottom: 1px solid $dialogColor10;
                          }
                        }
                      }
                    }
                  }

                  .el-table__body {
                    tr {
                      background-color: $mainContentNightBgColor;

                      td {
                        border-bottom: 0 solid transparent;
                      }

                      &:hover {
                        td {
                          background-color: #181b2b;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    &.day {
      .inner-box {
        > .left-info {
          background-color: $mainColorOfWhite;
          box-shadow: 0 0 6px #cfd5df;

          > .one-avatar {
            border-bottom: 1px solid rgba(97, 116, 153, .2);

            > .names-box {
              > .merchant-name {
                color: $dayMainTitleColor;
              }
            }

            > .time-box {
              color: $dialogColor9;
            }
          }

          > .two-identity {
            .icon {
              color: $mainColor;
            }

            > .items {
              color: $mainColor;
            }

            &::after {
              border-bottom: 1px dashed rgba(97, 116, 153, .2);
            }
          }

          > .trade-infos {
            > .bars {
              > .bar-top {
                color: $dialogColor9;
              }

              > .bar-bottom {
                color: $dayMainTitleColor;
              }
            }
          }

          > .button-group {
            > .focus-button-box {
              > .button {
                color: $mainColorOfWhite;
                background-color: $mainColor;
              }
            }

            > .black-button-box {
              > .button {
                border: 1px solid $mainColor;
                color: $mainColor;
                background-color: $mainColorOfWhite;
              }
            }
          }
        }

        > .right-lists {
          .buy-sell-list {
            background-color: $mainColorOfWhite;
            box-shadow: 0 0 6px #cfd5df;

            > .header-title {
              border-bottom: 1px solid rgba(97, 116, 153, .2);
            }
          }
        }
      }

      /deep/ {
        .inner-box {
          > .right-lists {
            > .buy-sell-list {
              > .body-content {
                .el-table {
                  color: $dayMainTitleColor;
                  background-color: $mainColorOfWhite;

                  .el-table__header {
                    thead {
                      color: $fontColorSecondaryOfDay;

                      tr {
                        th {
                          background-color: $mainColorOfWhite;

                          &.is-leaf {
                            border-bottom: 1px solid rgba(97, 116, 153, .2);
                          }
                        }
                      }
                    }
                  }

                  .el-table__body {
                    tr {
                      background-color: $mainColorOfWhite;

                      td {
                        border-bottom: 0 solid transparent;
                      }

                      &:hover {
                        td {
                          background-color: rgba(97, 116, 153, .05);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
