<template>
  <div
    class="add-western western"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <HeaderCommon />
    <div class="add-western-main margin25">
      <header class="add-western-header personal-height60 line-height60 line-height70 margin25">
        <span class="header-content-left header-content font-size16 font-weight600">
          修改西联汇款
        </span>
        <span
          class="header-content-right font-size12 cursor-pointer"
          @click="returnSuperior"
        >
          <IconFontCommon
            class="font-size22"
            iconName="icon-fanhui2"
          />
          返回我的账户
        </span>
      </header>
      <div class="add-western-content">
        <!--<header class="western-content-title">-->
          <!--*西联汇款l上传二维码方法：打开西联汇款首页>收钱>保存图片，将存在手机相册的收款码上传即可。-->
        <!--</header>-->
        <div class="western-content-from">
          <el-form
            :label-position="labelPosition"
            label-width="120px"
          >
            <el-form-item label="名 称：">
              <span class="western-content-name">杨</span>
            </el-form-item>
            <el-form-item label="电汇地址：">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 2}"
                placeholder="请输入内容"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="资金账号：">
              <input class="western-input border-radius2"/>
            </el-form-item>
            <button class="western-button border-radius4">
              确认修改
            </button>
          </el-form>
        </div>
      </div>
    </div>
    <FooterCommon />
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
// 头部
import HeaderCommon from '../../Common/HeaderCommon'
import IconFontCommon from '../../Common/IconFontCommon'
// 底部
import FooterCommon from '../../Common/FooterCommon'
import { createNamespacedHelpers, mapState } from 'vuex'
const { mapMutations } = createNamespacedHelpers('personal')
export default {
  components: {
    HeaderCommon, // 头部
    IconFontCommon, // 字体图标
    FooterCommon // 底部
  },
  data () {
    return {}
  },
  created () {
    // 覆盖Element样式
    require('../../../../static/css/list/Personal/AccountReceivableAccount/AddWesternUnion.css')
    // 白色主题样式
    require('../../../../static/css/theme/day/Personal/AccountReceivableAccount/AddWesternUnionDay.css')
    // 黑色主题样式
    require('../../../../static/css/theme/night/Personal/AccountReceivableAccount/AddWesternUnionNight.css')
  },
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {
    ...mapMutations([
      'CHANGE_USER_CENTER_ACTIVE_NAME'
    ]),
    // 点击返回上个页面
    returnSuperior () {
      this.CHANGE_USER_CENTER_ACTIVE_NAME('fifth')
      this.$router.go(-1)
    }
  },
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss">
  @import "../../../../static/css/scss/Personal/AccountReceivableAccount/AddWesternUnion";
  .add-western {
    >.add-western-main {
      width: 1100px;
      margin: 60px auto 100px;
      >.add-western-header {
        display: flex;
        >.header-content-right,
        .header-content-left {
          flex: 1;
        }
        >.header-content-right {
          text-align: right;
        }
        >.header-content-left {
          text-align: left;
          font-weight: 600;
        }
      }
      >.add-western-content {
        min-height: 300px;
        margin: 16px 25px;
        >.western-content-title {
          height: 32px;
          line-height: 32px;
          margin-bottom: 30px;
        }
        >.western-content-from {
          width: 500px;
          margin-left: 55px;
          .western-input {
            width: 220px;
            height: 34px;
            padding-left: 15px;
          }
          .western-upload {
            width: 118px;
            height: 106px;
            text-align: center;
            line-height: 100px;
          }
          .western-button {
            padding: 9px 33px;
            margin: 30px 0 50px 25px;
          }
        }
      }
    }
    &.night{
      background-color: $nightBgColor;
      color:$nightFontColor;
      .add-western-main {
        background-color: #1E2636;
        >.add-western-header {
          border-bottom: 1px solid #39424D;
          >.header-content-left {
            color: #fff;
          }
          >.header-content-right {
            color: #A9BED4;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,0.08);
            color: #3E79D6;
          }
          >.western-content-from {
            .western-input {
              border: 1px solid #485776;
              color: #fff;
            }
            .western-content-name {
              color: #fff;
            }
            .western-upload {
              background-color: #323E48;
              .icon-plus {
                color: #828EA6;
              }
            }
            .western-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #fff;
            }
          }
        }
      }
    }
    &.day{
      background-color: $dayBgColor;
      color:$dayFontColor;
      .add-western-main {
        background-color: #ccc;
        > .add-western-header {
          border-bottom: 1px solid #ccc;
          >.header-content-left {
            color: #555;
          }
        }
        >.add-western-content {
          >.western-content-title {
            background:rgba(62,121,214,1);
            color: #ccc;
          }
          >.western-content-from {
            .western-input {
              border: 1px solid #000;
              color: #000;
            }
            .western-upload {
              background-color: #fff;
              .icon-plus {
                color: #555;
              }
            }
            .western-button {
              padding: 10px 33px;
              background:linear-gradient(0deg,rgba(43,57,110,1),rgba(42,80,130,1));
              color: #ccc;
            }
          }
        }
      }
    }
  }
</style>
