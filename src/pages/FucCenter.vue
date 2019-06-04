<template>
  <div v-if="language === 'zh_CN' || language ==='zh_TW'" class="container">
    <div class="banner">
        <div class="banner-content">
          <img class="fuc_center_bg" src="../assets/fuc/banner.png" />
          <div class="fuc_coin">
            <div class="fuc_header">FUCoin</div>
            <div class="fuc_intro">简称FUC，是FUBT平台token的简称</div>
            <button @click="handleFuc" class="fuc_btn"><span class="fuc_btn_text">即刻拥有FUC ></span></button>
          </div>
        </div>
    </div>

    <div class="sub-container">
      <div class="sub_fuc_intro">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC介绍</span>
          <span class="sub_line"></span>
        </div>
        <div class="sub_fuc_content">
          <p class="sub_fuc_content_text">FUCoin（富链，简称FUC）是FUBT平台token的简称。FUC恒定发行总量1亿，流通时间始于2017年6月。</p>
          <p class="sub_fuc_content_text">FUC依托于FUBT全球生态，是基于以太坊的去中心化数字资产，致力于构建行业产业发展及资源管理服务为一体的生态空间。</p>
          <p class="sub_fuc_content_text">为适应FUBT交易平台国际化发展要求，推动FUBT全球生态价值流通与提升，同时进一步回馈平台广大忠实用户，FUBT决定启动FUC年度回购销毁行动。</p>
          <p class="sub_fuc_content_text"> 2019年度预计回购销毁FUC的数量为{{total}}，销毁完成后FUC的流通总量缩减为4900万，占原有发行规模的49%。</p>
        </div>
      </div>

      <!--FUC回购计划-->
      <div class="sub_fuc_intro">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC回购计划</span>
          <span class="sub_line sub_line_center"></span>
        </div>
        <div class="sub_fuc_content_1">
          <div class="sub_fuc_content_row1">
            <div class="sub_fuc_content_col1">回购周期</div>
            <div class="sub_fuc_content_col2 text-align-l">{{this.dateStart}} —{{this.dateEnd}}（GMT+8）</div>
          </div>

          <div class="sub_fuc_content_row1 sub_fuc_content_row2">
            <div class="sub_fuc_content_col1 sub_fuc_content_center1">回购计划</div>
            <div class="sub_fuc_content_col2 sub_fuc_content_center2">
              <div class="sub_fuc_bars">
                <div class="bars_box" :style="barStyle">
                  <div class="bar">
                    <div class="bar_tooltip">
                      <div>{{this.percentage}}%</div>
                      <div class="jiantou2">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-jiantou2"></use>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!--尾部tooltip-->
                <div class="bar_bottom_tooltip">
                  <!-- <div>{{this.total}}</div>
                  <div class="bar_bottom_jiantou2">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-jiantou2"></use>
                    </svg>
                  </div> -->
                </div>
              </div>

              <div class="bar-text">
                <div class="bar_text_left">{{this.count}} FUC</div>
                <div class="bar_text_right">{{this.total}} FUC</div>
              </div>

              <p class="bar-p">FUBT平台每日交易手续费收入的30%用于定期回购FUC，回购完成后将对其进行销毁，预计年底回购销毁总量为5100万FUC。</p>
            </div>
          </div>

          <div class="sub_fuc_content_row1">
            <div class="sub_fuc_content_col1 sub_fuc_content_center1">公示说明</div>
            <div class="sub_fuc_content_col2">
              <div class="text-l">每日回购，分期公示。每月2次公示，当月16日公示1-15日 00:00—23:59（GMT+8）的回购销毁情况，</div>
              <div class="text-l">次月首个工作日公示上月16日至月末最后一天 00:00—23:59（GMT+8）的回购销毁情况。</div>
            </div>
          </div>
        </div>
      </div>

      <!--FUC价值-->
      <div class="fuc-price-content">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC价值</span>
          <span class="sub_line"></span>
        </div>

        <div class="sub-price-content">
          <div class="sub-price-content-col1">
            <div class="sub-price-content-list">
              <img class="currency" src="../assets/fuc/currency.png">
              <h2 class="sub-price-text-head">流通介质</h2>
              <p class="sub-price-p">FUC是FUBT全球生态基于区块链发行和管理的平台通证，可在FUBT内部以及FUBT全球生态体系的多场景中使用。</p>
            </div>
            <div class="sub-price-center">
              <img class="currency" src="../assets/fuc/price_carrier.png">
              <h2 class="sub-price-text-head">价值载体</h2>
              <p class="sub-price-p">FUBT全球生态赋予了FUC与生俱来的价值存储与传递功能，通过价值提升回馈平台用户，并反哺FUBT平台与全球生态，具备持续成长性与无限的成长空间。</p>
            </div>
            <div>
              <img class="currency" src="../assets/fuc/rights&interests.png">
              <h2 class="sub-price-text-head">尊享权益</h2>
              <p class="sub-price-p">FUC持有者是FUBT全球生态组织的最小单元和细胞，拥有该生态体系的对应权益，可获取FUBT全球生态的有关通证奖励，同时享受FUC持续回购销毁带来的稀缺性增值。</p>
            </div>
          </div>
        </div>
      </div>

      <!--FUC生态-->
      <div ref="fuc" class="fuc-center-container">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC生态</span>
          <span class="sub_line"></span>
        </div>

        <div class="fuc-center-content">
          <div ref="line2" class="fuc-center-left">
            <h2 :key="line2" class="fuc-center-left-head">生态场景</h2>
            <div :key="line2" class="fuc-center-left-content">
              <ul class="fuc-center-left-l text-l">
                <li>云交易所商户服务费</li>
                <li>创新区投票上币</li>
                <li>项目方保证金</li>
                <li>OTC商家保证金</li>
              </ul>
              <ul class="fuc-center-left-r text-l">
                <li>存币收益资格</li>
                <li>手续费抵扣与返佣</li>
                <li>线上支付&线下购物</li>
              </ul>
            </div>
          </div>

          <div class="fuc-center-center">
            <div ref="line1" class="fuc-center-center-content">
              <h2 class="fuc-center-left-head " >功能权益</h2>
              <div class="fuc-center-left-content">
                <ul class="fuc-center-left-l text-l">
                  <li>用户拉新奖励</li>
                  <li>邀请返佣权</li>
                  <li>拥有投票特权</li>
                  <li>兑换平台VIP特权</li>
                </ul>
                <ul class="fuc-center-left-r text-l">
                  <li>FUBT资本权益</li>
                  <li>参与专享活动</li>
                  <li>获得生态通证糖果奖励&线下购物</li>
                </ul>
              </div>
            </div>

            <div class="pallet">
              <div class="logo"></div>
              <div class="dot"></div>
              <div class="lines">
                <transition name="bounce">
                  <div v-show= "line1" class="line1"></div>
                </transition>
                <transition name="bounce">
                  <div v-show= "line2" class="line2"></div>
                </transition>
                <transition name="bounce">
                  <div v-show= "line3" class="line3"></div>
                </transition>
              </div>
            </div>
          </div>

          <div ref="line3" class="fuc-center-left">
            <h2 class="fuc-center-left-head">应用延展</h2>
            <div class="fuc-center-left-content">
              <ul class="fuc-center-left-l text-l">
                <li>区块链专业媒体服务</li>
                <li>行业社群推广支付</li>
                <li>量化等技术研发指导</li>
                <li>会务、出访、商学院抵扣</li>
              </ul>
              <ul class="fuc-center-left-r text-l">
                <li>矿机、硬件钱包支付</li>
                <li>猎头、人才招募支付</li>
                <li>项目初级测评服务费&线下购物</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
<!-- 英文翻译 -->
  <div v-else class="container">
    <div class="banner">
      <div class="banner-content">
        <img class="fuc_center_bg" src="../assets/fuc/banner.png" />
        <div class="fuc_coin">
          <div class="fuc_header">FUCoin</div>
          <div class="fuc_intro">FUCoin (FUC), is the FUBT platform token</div>
          <button @click="handleFuc" class="fuc_btn"><span class="fuc_btn_text">Get FUC</span></button>
        </div>
      </div>
    </div>

    <div class="sub-container">
      <div class="sub_fuc_intro">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC introduction</span>
          <span class="sub_line"></span>
        </div>
        <div class="sub_fuc_content">
          <p class="sub_fuc_content_text">FUCoin (FUC) is the FUBT platform token. FUC relies on FUBT's global ecology. It is based on Ethereum's decentralized digital assets and is committed to building an industry space for industry development and resource management services.
            FUC has a constant circulation of 100 million, and circulation began in June 2017.</p>
          <p class="sub_fuc_content_text">In order to adapt to the international development requirements of FUBT trading platform, promote the global ecological value circulation and promotion of FUBT, and further feedback the users of the platform, FUBT decided to initiate the annual repurchase and destruction operation of FUC.</p>
          <p class="sub_fuc_content_text">The amount of FUC expected to be repurchased during the year was 51 million.</p>
          <p class="sub_fuc_content_text"> After the completion of the destruction, the total volume of FUC was reduced to 49 million, accounting for 49% of the original issuance</p>
        </div>
      </div>

      <!--FUC回购计划-->
      <div class="sub_fuc_intro">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC Repurchase Plan</span>
          <span class="sub_line sub_line_center"></span>
        </div>
        <div class="sub_fuc_content_1">
          <div class="sub_fuc_content_row1">
            <div class="sub_fuc_content_col1">Repurchase cycle</div>
            <div class="sub_fuc_content_col2 text-align-l">{{this.dateStart}} 00:00—{{this.dateEnd}}  23:59（GMT+8）</div>
          </div>

          <div class="sub_fuc_content_row1 sub_fuc_content_row2">
            <div class="sub_fuc_content_col1 sub_fuc_content_center1">Repurchase plan</div>
            <div class="sub_fuc_content_col2 sub_fuc_content_center2">
              <div class="sub_fuc_bars">
                <div class="bars_box" :style="barStyle">
                  <div class="bar">
                    <div class="bar_tooltip">
                      <div>{{this.percentage}}%</div>
                      <div class="jiantou2">
                        <svg class="icon" aria-hidden="true">
                          <use xlink:href="#icon-jiantou2"></use>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!--尾部tooltip-->
                <div class="bar_bottom_tooltip">
                  <!-- <div>{{this.total}}</div>
                  <div class="bar_bottom_jiantou2">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-jiantou2"></use>
                    </svg>
                  </div> -->
                </div>
              </div>

              <div class="bar-text">
                <div class="bar_text_left">{{this.count}} FUC</div>
                <div class="bar_text_right">{{this.total}} FUC</div>
              </div>

              <p class="bar-p">30% of the daily transaction fee income of the FUBT platform is used for regular repurchase of the FUC. After the repurchase is completed, it will be destroyed. It is estimated that the total amount of repurchase at the end of the year will be 51 million FUC.</p>
            </div>
          </div>

          <div class="sub_fuc_content_row1">
            <div class="sub_fuc_content_col1 sub_fuc_content_center1">Public notice</div>
            <div class="sub_fuc_content_col2">
              <div class="text-l">daily repurchase, public notice. It will be announced twice a month, and the repurchase destruction of 00:00-23:59 (GMT+8) will be announced on the 16th of the month. </div>
              <div class="text-l">The first working day of the next month will be announced from the 16th of the last month to the last day of the end of the month, 00:00 - 23:59 (GMT+8) repurchase destruction.</div>
            </div>
          </div>
        </div>
      </div>

      <!--FUC价值-->
      <div class="fuc-price-content">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC Value</span>
          <span class="sub_line"></span>
        </div>

        <div class="sub-price-content">
          <div class="sub-price-content-col1">
            <div class="sub-price-content-list">
              <img class="currency" src="../assets/fuc/currency.png">
              <h2 class="sub-price-text-head">FUC Value</h2>
              <p class="sub-price-p">FUC is a platform passport for FUBT's global ecosystem based on blockchain issuance and management, and can be used in FUBT and in multiple scenarios of the FUBT global ecosystem.</p>
            </div>
            <div class="sub-price-center">
              <img class="currency" src="../assets/fuc/price_carrier.png">
              <h2 class="sub-price-text-head">Value carrier</h2>
              <p class="sub-price-p">FUBT Global Ecology gives FUC the innate value storage and delivery function, rewards platform users through value enhancement, and feeds on FUBT platform and global ecology, with continuous growth and unlimited growth space.</p>
            </div>
            <div>
              <img class="currency" src="../assets/fuc/rights&interests.png">
              <h2 class="sub-price-text-head">Privilege</h2>
              <p class="sub-price-p">The FUC holder is the smallest unit and cell of the FUBT global ecological organization. It has the corresponding rights and interests of the ecosystem, and can obtain the relevant certificate of the FUBT global ecology, and enjoy the scarcity value added by the FUC continuous repurchase and destruction.</p>
            </div>
          </div>
        </div>
      </div>

      <!--FUC生态-->
      <div ref="fuc" class="fuc-center-container">
        <div class="sub_fuc_intro_header">
          <span class="sub_fuc_intro_text">FUC Ecology</span>
          <span class="sub_line"></span>
        </div>

        <div class="fuc-center-content">
          <div ref="line2" class="fuc-center-left">
            <h2 :key="line2" class="fuc-center-left-head">Ecological Scene</h2>
            <div :key="line2" class="fuc-center-left-content">
              <ul class="fuc-center-left-l text-l">
                <li>Cloud Exchange Merchant Service Fee</li>
                <li>Innovation Zone voting list</li>
                <li>Project deposit</li>
                <li>OTC merchant deposit</li>
              </ul>
              <ul class="fuc-center-left-r text-l">
                <li>Eligibility for deposit income</li>
                <li>Fee deduction and rebate</li>
                <li>Online Payment & Offline Shopping</li>
              </ul>
            </div>
          </div>

          <div class="fuc-center-center">
            <div ref="line1" class="fuc-center-center-content">
              <h2 class="fuc-center-left-head " >Functional privilege</h2>
              <div class="fuc-center-left-content">
                <ul class="fuc-center-left-l text-l">
                  <li>Functional privilege</li>
                  <li>User pulls new reward</li>
                  <li>Invite rebate</li>
                  <li>Have voting privileges</li>
                </ul>
                <ul class="fuc-center-left-r text-l">
                  <li>Get the Eco-Certificate Candy Award</li>
                  <li>Exchange platform VIP privilege</li>
                  <li>Participate in exclusive events</li>
                </ul>
              </div>
            </div>

            <div class="pallet">
              <div class="logo"></div>
              <div class="dot"></div>
              <div class="lines">
                <transition name="bounce">
                  <div v-show= "line1" class="line1"></div>
                </transition>
                <transition name="bounce">
                  <div v-show= "line2" class="line2"></div>
                </transition>
                <transition name="bounce">
                  <div v-show= "line3" class="line3"></div>
                </transition>
              </div>
            </div>
          </div>

          <div ref="line3" class="fuc-center-left">
            <h2 class="fuc-center-left-head">Application extension</h2>
            <div class="fuc-center-left-content">
              <ul class="fuc-center-left-l text-l">
                <li>Blockchain Professional Media Service</li>
                <li>Industry community promotion payment</li>
                <li>Quantitative and other technical research and development guidance</li>
                <li>Conference, visit, business school deduction</li>
              </ul>
              <ul class="fuc-center-left-r text-l">
                <li>Mining machine, hardware wallet payment</li>
                <li>Headhunting, talent recruitment payment</li>
                <li>Project primary evaluation service fee
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import {getSchedule} from '../utils/api/common'
export default {
  name: 'FucCenter',
  data () {
    return {
      line1: 0,
      line2: 0,
      line3: 0,
      scheduleData: [],
      dateStart: '',
      dateEnd: '',
      percentage: 0,
      count: 0,
      total: 0
    }
  },

  async created () {
    await this.getSchedule()
  },
  watch: {
    language (newVal) {
      this.errPWD = '' // 切换语言清空交易密码框错误提示
    }
  },
  methods: {
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (this.$refs['fuc'].offsetTop && scrollTop >= this.$refs['fuc'].offsetTop - 800) {
        setTimeout(() => {
          this.line1 = 1
          this.$refs['line1'].style.visibility = 'visible'
          this.$refs['line1'].className = 'animated bounceIn delay-500ms'
        }, 300)
        setTimeout(() => {
          this.line2 = 1
          this.$refs['line2'].style.visibility = 'visible'
          this.$refs['line2'].className = 'animated bounceIn delay-500ms'
          this.$refs['line2'].style.alignSelf = 'flex-end'
        }, 800)

        setTimeout(() => {
          this.line3 = 1
          this.$refs['line3'].style.visibility = 'visible'
          this.$refs['line3'].className = 'animated bounceIn delay-500ms'
          this.$refs['line3'].style.alignSelf = 'flex-end'
        }, 1600)
      } else if (scrollTop <= this.$refs['fuc'].offsetTop - 1200) {
        this.line2 = 0
        this.line3 = 0
        this.line1 = 0
        this.$refs['line1'].className = 'fuc-center-center-content'
        this.$refs['line1'].style.visibility = 'hidden'
        this.$refs['line3'].className = 'fuc-center-left'
        this.$refs['line3'].style.visibility = 'hidden'
        this.$refs['line2'].className = 'fuc-center-left'
        this.$refs['line2'].style.visibility = 'hidden'
      }
    },

    handleFuc () {
      this.$router.push({
        path: '/TradeCenter/fucfbt'
      })
    },

    async getSchedule () {
      const DATA = await getSchedule()
      let dateStart = DATA.data.coinReleaseBeginDate
      let dateEnd = DATA.data.coinReleaseEndDate

      if (!DATA) return false
      this.dateStart = this.language === 'zh_CN' ? dateStart.split('-')[0] + '年' + dateStart.split('-')[1] + '月' + dateStart.split('-')[2].replace(/\s/, '日') : dateStart
      this.dateEnd = this.language === 'zh_CN' ? dateEnd.split('-')[0] + '年' + dateEnd.split('-')[1] + '月' + dateStart.split('-')[2].replace(/\s/, '日') : dateEnd
      this.percentage = ((DATA.data.count / DATA.data.coinTotalNumber) * 100).toFixed(1)
      this.count = DATA.data.count
      this.total = DATA.data.coinTotalNumber
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    barStyle () {
      const style = {}
      style.width = this.percentage < 1 ? '20px' : this.percentage + '%'
      if (this.percentage === 0) {
        style.borderRadius = 0
        style.paddingRight = 0
      }
      return style
    },
    card () {
      const style = {}
      return style
    },
    ...mapState({
      language: state => state.common.language // 当前选中语言
    }),
    ...mapGetters({
      '$isNeelLimitExchange_G_X': 'isNeedLimitExchange_G'
    })
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }

}
</script>

<style scoped lang="scss" type="text/scss">
$color: rgba(255, 255, 255, 1);
$fontSize: 14px;
$fontHead: 24px;

.text-l {
  line-height: 30px;
  text-align: left;
}

ul {
  list-style: circle outside url('../assets/fuc/list-style.png');
  margin-left: 14px;
}

.bounce-enter-active {
  animation: bounce-in .5s infinite;
}

.bounce-leave-active {
  animation: bounce-in .5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(.3);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.container {
  min-width: 1366px;
  padding-top: 50px;
  font-family: Bahnschrift-Regular;
  background: #272b41;

  .banner {
    width: 100%;
    min-width: 1366px;
    padding-top: 40px;
    padding-right: 16%;
    padding-left: 16%;
    margin: 0 auto;
    background: #11112b;

    .banner-content {
      display: flex;
      width: 1300px;
      margin: 0 auto;

      .fuc_coin {
        flex: 1;
        padding-left: 96px;

        .fuc_header {
          padding-top: 126px;
          font-weight: 400;
          font-size: 53px;
          text-shadow: -2px -2px 1px rgba(195, 178, 237, 1);
          color: rgb(62, 19, 188);
          background: linear-gradient(0deg, rgb(62, 19, 188) 0%, rgba(243, 240, 243, 1) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .fuc_intro {
          padding-top: 30px;
          padding-bottom: 30px;
          font-size: 18px;
          color: $color;
        }

        .fuc_btn {
          padding: 15px 42px;
          border: 1px solid rgba(133, 114, 244, 1);
          border-radius: 5px;
          cursor: pointer;

          .fuc_btn_text {
            font-weight: 400;
            font-size: $fontSize;
            color: rgba(133, 114, 244, 1);
          }
        }
      }
    }
  }

  .sub-container {
    width: 100%;
    margin: 0 auto;
    text-align: center;
    color: $color;
    background: rgb(39, 43, 65);

    .sub_fuc_intro_header {
      position: relative;
      font-size: $fontHead;

      .sub_fuc_intro_text {
        position: relative;
        z-index: 10;
      }

      .sub_line {
        position: absolute;
        top: 20px;
        bottom: 0;
        left: 0;
        right: 0;
        display: block;
        width: 108px;
        height: 10px;
        margin: 0 auto;
        background: linear-gradient(90deg, rgba(133, 114, 244, 1), rgba(11, 5, 182, 0));
      }

      .sub_line_center {
        width: 156px;
      }
    }

    /* fuc介绍 */
    .sub_fuc_intro {
      max-width: 1300px;
      padding: 0 100px;
      margin: 52px auto;

      .sub_fuc_content {
        padding: 54px 77px;
        margin-top: 29px;
        border-radius: 5px;
        background: url("../assets/fuc/fuc_introduce.png") center no-repeat;
        background-size: cover;

        .sub_fuc_content_text {
          font-size: $fontSize;
          line-height: 36px;
        }
      }

      /* fuc回购计划 */
      .sub_fuc_content_1 {
        max-width: 1300px;
        margin: 29px auto;
        border: 1px solid rgba(67, 89, 124, 1);
        border-radius: 5px;
        background: rgba(28, 33, 53, 1);

        .sub_fuc_content_row1 {
          display: flex;
          white-space: nowrap;

          .sub_fuc_content_col1 {
            min-width: 176px;
            padding: 30px;
            border-right: 1px solid rgba(67, 89, 124, 1);
          }

          .sub_fuc_content_center1 {
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 176px;
          }

          .sub_fuc_content_col2 {
            width: 100%;
            padding: 30px;
            white-space: normal;

            .sub_fuc_bars {
              position: relative;
              height: 13px;
              border-radius: 7px;
              background: rgba(124, 207, 228, 1);

              .bars_box {
                width: 46px;
                max-width: 100%;
                height: 100%;
                border-radius: 7px;
                background: rgba(28, 33, 53, 1);

                .bar {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  border-radius: 7px;
                  background: rgba(81, 117, 227, 1);

                  .bar_tooltip {
                    position: absolute;
                    top: -48px;
                    right: -10px;

                    .jiantou2 {
                      font-size: $fontSize;
                      color: rgba(81, 117, 227, 1);
                    }
                  }
                }
              }

              /* 尾部tooltip */
              .bar_bottom_tooltip {
                position: absolute;
                top: -48px;
                right: -18px;

                /* .bar_bottom_jiantou2 {
                  font-size: $fontSize;
                  color: rgba(124, 207, 228, 1);
                } */
              }
            }

            .bar-text {
              margin-top: 14px;
              color: rgba(81, 117, 227, 1);

              .bar_text_left {
                float: left;
              }

              .bar_text_right {
                float: right;
              }
            }

            .bar-p {
              position: relative;
              top: 38px;
              width: 100%;
              margin-top: 22px;
              line-height: 30px;
              text-align: left;
              text-indent: -40px;
            }
          }

          .sub_fuc_content_center2 {
            padding: 60px 30px;
          }
        }

        .sub_fuc_content_row2 {
          border-top: 1px solid rgba(67, 89, 124, 1);
          border-bottom: 1px solid rgba(67, 89, 124, 1);
        }
      }
    }

    /* fuc价值 */
    .fuc-price-content {
      margin-top: 50px;

      .sub-price-content {
        position: relative;
        display: flex;
        width: 100%;
        margin-top: 57px;
        background: url("../assets/fuc/fuc_price_bg.jpg") center no-repeat;
        background-size: 100% 100%;

        .sub-price-content-col1 {
          z-index: 2;
          display: flex;
          width: 1575px;
          padding: 3% 10% 3% 20%;

          .sub-price-center {
            padding: 0 130px;
          }

          .sub-price-text-head {
            margin-top: 18px;
          }

          .sub-price-p {
            width: 231px;
            margin-top: 32px;
            font-size: $fontSize;
            line-height: 30px;
            text-align: left;
          }
        }

        .sub-price-content-col2 {
          position: absolute;
          z-index: 1;
          top: 106px;
          right: 0;
          width: 40%;
          height: 80%;
          background: linear-gradient(250deg, rgba(45, 50, 78, 1) 80%, transparent 60%);
        }
      }
    }

    /* fuc生态 */
    .fuc-center-container {
      padding-bottom: 90px;
      margin-top: 66px;
      background: url("../assets/fuc/fuc_center_bg.png") center no-repeat;

      .fuc-center-content {
        display: flex;
        justify-content: center;
        padding: 0 177px;
        margin-top: 88px;
        color: $color;

        /* 卡片内容 */
        .fuc-center-left-head {
          width: 337px;
          text-align: left;
        }

        .fuc-center-left-r {
          padding-left: 24px;
        }

        .fuc-center-left-content {
          display: flex;
          align-items: end;
          width: 396px;
          padding: 20px 14px;
          margin-top: 9px;
          border-radius: 10px;
          background: rgba(106, 89, 193, .14);
        }

        .fuc-center-left {
          align-self: flex-end;
          visibility: hidden;
        }

        .fuc-center-center {
          .fuc-center-center-content {
            display: block;
            width: 396px;
            margin: 0 auto;
            visibility: hidden;
          }

          .pallet {
            position: relative;
            width: 598px;
            height: 336px;
            margin-top: 72px;
            margin-bottom: -15px;
            background: url("../assets/fuc/pallet.png") center no-repeat;

            .logo {
              width: 145px;
              height: 141px;
              margin: 0 auto;
              background: url("../assets/fuc/logo.png") center no-repeat;
              animation: shaking 2s infinite;
            }

            .dot {
              position: absolute;
              top: 0;
              left: 235px;
              width: 123px;
              height: 123px;
              margin: 0 auto;
              line-height: 141px;
              background: url("../assets/fuc/dot.png") center no-repeat;
            }

            @keyframes shaking {
              0% {
                transform: translate(0, 0);
              }

              50% {
                transform: translate(0, -10px);
              }

              100% {
                transform: translate(0, 0);
              }
            }

            .lines {
              position: relative;
              width: 1px;
              margin: 0 auto;

              .line1 {
                position: absolute;
                top: -200px;
                left: -74px;
                width: 70px;
                height: 156px;
                background: url("../assets/fuc/1.png") center no-repeat;
                transform: rotate(-28deg);
                transform-origin: 0% 80%;
              }

              .line2 {
                position: absolute;
                top: -143px;
                left: -439px;
                width: 441px;
                height: 165px;
                background: url("../assets/fuc/2.png") center no-repeat;
                transform: rotate(2deg);
                transform-origin: 80% 0%;
              }

              .line3 {
                position: absolute;
                top: -119px;
                width: 345px;
                height: 114px;
                background: url("../assets/fuc/3.png") center no-repeat;
                transform: rotate(-2deg);
                transform-origin: 0% 20%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
