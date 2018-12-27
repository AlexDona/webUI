<template>
  <div
    class="rate-box"
    :class="{'day':theme == 'day','night':theme == 'night' }"
  >
    <div class="content">
      <div class="content">
        <div class="inner-box">
          <div
            class="content"
          >
            <el-table
              :data="rateList"

            >
              <el-table-column
                label="交易对"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="买 单"
                align="center"

              >
                <template slot-scope = "s">
                  <div>{{ s.row.buyFee*100 }}%</div>
                </template>
              </el-table-column>
              <el-table-column
                label="卖 单"
                align="right"
              >
                <template slot-scope = "s">
                  <div>{{ s.row.sellFee*100 }}%</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--请严格按照如下书写书序-->
<script>
import {mapState} from 'vuex'
import {getSymbolRate} from '../../utils/api/header'
import {
  returnAjaxMsg,
  getNestedData
} from '../../utils/commonFunc'
export default {
  components: {
  },
  // props,
  data () {
    return {
      rateList: []
    }
  },
  async created () {
    await this.getSymbolRateData()
  },
  mounted () {},
  activated () {},
  updated () {},
  beforeRouteUpdate () {},
  methods: {
    async getSymbolRateData () {
      const data = await getSymbolRate()
      if (!returnAjaxMsg(data, this)) {
        return false
      } else {
        this.rateList = getNestedData(data, 'data.data')
        console.log(this.rateList)
      }
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
<style scoped lang="scss" type="text/scss">
  .rate-box {
    width: 100%;
    height: 100%;

    > .content {
      width: 100%;

      > .content {
        overflow: hidden;

        > .inner-box {
          width: 1100px;
          height: 1100px;
          padding: 20px 50px;
          margin: 0 auto;
          overflow: auto;

          > h2 {
            line-height: 70px;
            text-align: center;
          }
        }
      }
    }

    /deep/ {
      .el-table {
        background-color: transparent;

        td,
        th,
        tr {
          height: 40px;
          padding: 0;
          font-size: 12px;
          line-height: 40px;
        }

        td,
        th.is-leaf {
          padding: 0 20px;
        }

        th {
          background-color: #33425f;
        }
      }
    }

    &.night {
      > .content {
        > .content {
          background-color: #1e2636;

          > .inner-box {
            color: #8ba0ca;
            background-color: #1e2636;
          }
        }
      }

      /deep/ {
        .el-table {
          background-color: transparent;

          td,
          th,
          tr {
            color: #f9fafc;
            background-color: transparent;
          }

          td,
          th.is-leaf {
            border: none;
            border-bottom: 1px solid #283143;
          }

          th {
            background-color: #33425f;
          }
        }
      }
    }

    &.day {
      > .content {
        > .content {
          background-color: #fff;

          > .inner-box {
            border: 1px solid rgba(234, 235, 236, 1);
            color: #666;
            background-color: #fff;
          }
        }
      }

      /deep/ {
        th {
          color: #fff;
          background-color: #33425f;
        }
      }
    }
  }
</style>
