<template>
  <div
    class="rate-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          香港FUBT交易所，致力于打造全球领先的区块链资产交易服务平台。
          FUBT前中国大陆站（即币兴网）于2017年6月搭建完成并开放注册，7月10日正式开启交易。上线伊始迅速发展壮大，用户激增、交易火爆，首发
          平台币BXB一度暴涨25倍领跑市场。后币兴网主动响应”中国9.4政策”而自主关停，并于同年底开启全新国际站香港富比特——www.fubt.top。
          2018年上半年，FUBT陆续启动中国台湾、柬埔寨金边、日本东京、韩国首尔、美国纽约等全球各地分站。

          作为香港乃至全亚洲地区首屈一指的区块链资产综合服务平台，FUBT始终倡导理性投资，坚持前瞻性布局、国际化拓展、市场化运作，以发掘提升
          优质数字资产价值为导向，以增强技术、资本、产业融合为纽带，以促进区块链科技应用转化为目标，紧密依托专业技术运营和国际金融顾问团队，
          深度服务全球数字资产开发者与用户，全面构建诚信公正、合规高效、与时俱进的新型产业体系。

          香港FUBT面向全球用户、多语种支持、多平台覆盖，同时提供C2C充值提现以及币币兑换服务，总体交易顺畅、响应及时，采用金融级安全防控，
          严格保障用户资产安全。截至2018年5月，FUBT交易所注册用户突破56万，上线优质数字资产近百种。目前已开通BTC（比特币）、ETH（以太坊）、
          FBT三大交易区，平台交易对数量累计超过两百，日均成交额2500万美元。全新版本APP移动端也已上线，全面支持安卓与苹果系统。

          香港FUBT核心团队成员，均具有深厚的区块链基因与丰富的投行经验，具备领先的技术开发与实践创新能力。历经近一年的发展，FUBT现已初步
          形成以交易所开发建设为主体，以行业产品应用研发和项目传播推广为两翼，综合服务于区块链资产开发、投资、运营的全产业链业务架构体系。
          同时聚合国内外科技、金融、传媒等各界领袖精英资源，大力促进国际优质项目交流与合作，将逐步构建跨国、跨领域、跨行业的新型生态空间，
          赋能数字资产，助推通证经济。

          香港FUBT视用户为永远伙伴，以满足客户需求为企业发展源动力。自创办起就极其重视用户反馈与社群运营，持续保持社区活力与热度，先后与国
          内外业界知名大咖、机构、传媒等建立了深度战略合作关系，并长期共同组织举办区块链专场活动，努力实现品牌效益、市场效益与社会效益的有
          机统合，亦获得区块链产学研经各界广泛关注与一致赞誉。

          展望未来，香港FUBT将进一步深耕市场加速发展，同时持续增强技术研发优势，以新时期区块链积极政策为契机，锐意进取勇立潮头，为推动全球
          科技进步与社会经济发展做出更杰出贡献。

        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
export default {
  components: {
  },
  // props,
  data () {
    return {}
  },
  created () {},
  mounted () {},
  activited () {},
  update () {},
  beforeRouteUpdate () {},
  methods: {},
  filter: {},
  computed: {
    ...mapState({
      theme: state => state.common.theme
    })
  },
  watch: {}
}
</script>
<style scoped lang="scss" type="text/scss">
  .rate-box{
    width:100%;
    height:100%;
    >.content{
      width:100%;
      >.content{
        overflow: hidden;
        >.inner-box{
          margin:50px auto;
          height:1100px;
          width:1100px;
          padding:50px;
        }
      }
    }
    &.night{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #121824;
          >.inner-box{
            background-color: #1e2636;
            color:#8BA0CA
          }
        }
      }
    }
    &.day{
      >.content{
        >.top{
          >h1{
          }
          >p{
          }
        }
        >.content{
          background-color: #fff;
          >.inner-box{
            border:1px solid rgba(234,235,236,1);
            background-color: #fff;
            color:#666666;
          }
        }
      }
    }
  }
</style>
