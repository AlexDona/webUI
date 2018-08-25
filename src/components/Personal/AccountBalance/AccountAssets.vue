<template>
  <div
    class="account-assets personal"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="account-assets-main">
      <UserInfo />
      <div class="account-assets-box margin-top16 min-height500">
        <div class="account-assets-box">
          <header class="account-assets-header display-flex personal-height40 line-height40">
            <div class="header-flex header-left flex1 padding-left23 font-size16 font-weight600">
              我的资产
            </div>
            <div class="header-flex header-right flex1 padding-right23 display-flex">
              <p class="header-right-left float-left flex1">
                <span class="header-right-text text-align-r display-inline-block">
                  显示有资金币种
                </span>
                <span>
                  <el-switch
                  v-model="hideStatusButton"
                  active-color="#2A7AD3"
                  inactive-color="#38424C"
                  >
                  </el-switch>
                </span>
              </p>
              <p class="header-right-right float-left flex1 text-align-r">
                <IconFontCommon
                  class="font-size16 icon-color"
                  iconName="icon-sousuo-copy"
                />
                <input
                  type="text"
                  class="header-right-search border-radius2 padding-left23 font-size12"
                >
              </p>
            </div>
          </header>
        </div>
        <div class="account-assets-content">
          <!--账户资产币种列表-->
          <div class="content-list min-height500">
            <div class="table-body text-align-l line-height50">
              <!-- 表头 -->
              <div class="table-title-th display-flex margin20">
                <!--币种  总数量  冻结数量  可用数量  资产估值(BTC)  操作-->
                <div
                  class="flex1"
                >
                  币种
                </div>
                <div
                  class="flex1"
                >
                  总数量
                </div>
                <div

                  class="flex1"
                >
                  冻结数量
                </div>
                <div
                  class="flex1"
                >
                  可用数量
                </div>
                <div
                  class="flex1"
                >
                  资产估值(BTC)
                </div>
                <div
                  class="flex1 text-align-c"
                >
                  操作
                </div>
              </div>
              <div
                class="table-tr display-flex margin20"
                v-for="(item, index) in withdrawDepositIsShowList"
                :key="index"
              >
                <div class="table-td flex1">
                  {{ item.currencyName }}
                </div>
                <div class="table-td flex1">
                  {{ item.totalQuantity }}
                </div>
                <div class="table-td flex1">
                  {{ item.numberFrozen }}
                </div>
                <div class="table-td flex1">
                  {{ item.availableQuantity }}
                </div>
                <div class="table-td flex1">
                  {{ item.assetValuation }}
                </div>
                <div class="table-td flex1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
// 我的资产
import UserInfo from '../AccountBalance/UserInfo'
// 字体图标
import IconFontCommon from '../../Common/IconFontCommon'
export default {
  components: {
    UserInfo, // 我的资产
    IconFontCommon // 字体图标
  },
  // props,
  data () {
    return {
      showStatusButton: true, // 显示币种
      hideStatusButton: true, // 隐藏币种
      withdrawDepositIsShowList: [
        {
          currencyName: 'BTC', // 币种名称
          totalQuantity: '3695421', // 总数量
          numberFrozen: '23.021', // 冻结数量
          availableQuantity: '45610.231', // 可用数量
          assetValuation: '123.02354' // 资产估值
        },
        {
          currencyName: 'BTC', // 币种名称
          totalQuantity: '3695421', // 总数量
          numberFrozen: '23.021', // 冻结数量
          availableQuantity: '45610.231', // 可用数量
          assetValuation: '123.02354' // 资产估值
        },
        {
          currencyName: 'BTC', // 币种名称
          totalQuantity: '3695421', // 总数量
          numberFrozen: '23.021', // 冻结数量
          availableQuantity: '45610.231', // 可用数量
          assetValuation: '123.02354' // 资产估值
        },
        {
          currencyName: 'BTC', // 币种名称
          totalQuantity: '3695421', // 总数量
          numberFrozen: '23.021', // 冻结数量
          availableQuantity: '45610.231', // 可用数量
          assetValuation: '123.02354' // 资产估值
        },
        {
          currencyName: 'BTC', // 币种名称
          totalQuantity: '3695421', // 总数量
          numberFrozen: '23.021', // 冻结数量
          availableQuantity: '45610.231', // 可用数量
          assetValuation: '123.02354' // 资产估值
        }
      ]
    }
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountBalance/AccountAssets.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountBalance/AccountAssetsDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountBalance/AccountAssetsNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
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
  @import "../../../../static/css/scss/Personal/AccountBalance/AccountAssets";
  .account-assets{
    >.account-assets-main {
      min-height: 500px;
      > .account-assets-box {
        > .account-assets-box {
          > .account-assets-header {
            > .header-flex {
              height: 100%;
              > .header-right-left {
                > .header-right-text {
                  width: 180px;
                }
              }
              > .header-right-right {
                position: relative;
                > .header-right-search {
                  width: 140px;
                  height: 26px;
                  box-sizing: border-box;
                }
                > .icon-color {
                  position: absolute;
                  left: 85px;
                  top: 12px;
                }
              }
            }
          }
        }
      }
      > .account-assets-content {
        >.content-list {
          >.table-body {
            width: 100%;
            height: 50px;
            /*>.table-td {*/
              /**/
            /*}*/
            >.table-tr {

            }
          }
        }
      }
    }
    &.night {
      background-color: $nightBgColor;
      color:$nightFontColor;
      .account-assets-box {
        background-color: #1E2636;
        >.account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #333F4A;
                color: #fff;
              }
            }
          }
        }
      }
      .table-body {
        >.table-title-th {
          border-bottom: 1px solid #39424D;
          color: #A9BED4;
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .account-assets-box {
        background-color: #1E2636;
        >.account-assets-header {
          box-shadow: 0px 2px 13px rgba(24,30,42,1);
          >.header-left {
            color: #338FF5;
          }
          >.header-right {
            >.header-right-right {
              >.header-right-search {
                background-color: #333F4A;
                color: #fff;
              }
            }
          }
        }
      }
      .table-body {
        >.table-title-th {
          border-bottom: 1px solid #39424D;
          color: #A9BED4;
        }
      }
    }
  }
</style>
