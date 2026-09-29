<template>
  <div class="labor-panel" :class="'is-' + variant">
    <!-- 原版：经营概览矩阵 + 趋势 -->
    <template v-if="variant === 'v1'">
      <div class="toolbar">
        <board-title class="toolbar-title" text="人力成本经营概览" :level="1" />
        <board-action kind="more" text="查看成本改善任务" @click="goTaskCenter" />
      </div>

      <div class="split">
        <div class="matrix-side">
          <div class="ctrl-row">
            <capsule-tabs
              :options="scopeOptions"
              :value="matrixScope"
              @input="matrixScope = $event"
            />
            <div class="ctrl-links">
              <board-action kind="more" text="查看综合人工成本" @click="actions.openLaborCost()" />
              <board-action kind="more" text="查看指标详情" @click="actions.openMetricDetail()" />
            </div>
          </div>
          <div class="matrix">
            <div
              v-for="(col, cIndex) in liveMatrix"
              :key="cIndex"
              class="col"
            >
              <div
                v-for="(item, i) in col.items"
                :key="item.name"
                class="cell"
                :class="{ 'is-head': i === 0 }"
              >
                <metric-block
                  :variant="i === 0 ? 'l2-t' : 'l3-t'"
                  :title="item.name"
                  :value="item.value"
                  :unit="item.unit"
                  :trends="item.indicators"
                  :divider="cIndex < 2 && i === 0"
                  divider-direction="vertical"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="chart-side">
          <div class="ctrl-row chart-ctrl">
            <capsule-tabs
              :options="periodOptions"
              :value="chartPeriod"
              @input="chartPeriod = $event"
            />
            <board-radio-group
              :options="chartOptions"
              :value="chartMetric"
              @input="chartMetric = $event"
            />
          </div>
          <div class="chart-box">
            <chart-board
              variant="multi-line"
              plot-size="lg"
              fill
              :seed="chartSeed"
              :labels="chartLabels"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- 新版：费率卡 + 综合费率趋势 + 指标对比 -->
    <template v-else>
      <div class="rate-row">
        <div
          v-for="card in rateCardList"
          :key="card.key"
          class="rate-group"
        >
          <metric-block
            class="rate-group__primary"
            variant="l1-h"
            show-icon
            icon-name="安全"
            help
            tone="primary"
            :title="card.label"
            :value="card.value"
            :trends="card.trends"
            trends-layout="horizontal"
          />
          <metric-group
            class="rate-group__secondary"
            layout="horizontal"
            variant="l3-t-h"
            nowrap
            :show-divider="false"
            :items="rateSubItems(card)"
          />
        </div>
      </div>

      <div class="rate-chart-panel">
        <div class="ctrl-row chart-ctrl">
          <board-radio-group
            :options="chartOptions"
            :value="chartMetric"
            @input="chartMetric = $event"
          />
          <capsule-tabs
            :options="periodOptions"
            :value="chartPeriod"
            @input="chartPeriod = $event"
          />
        </div>
        <div class="chart-box">
          <chart-board
            variant="multi-line"
            plot-size="lg"
            fill
            :seed="chartSeed"
            :labels="chartLabels"
          />
        </div>
      </div>

      <indicator-compare-panel />
    </template>

    <labor-detail-panel />
  </div>
</template>

<script>
import { store, actions } from '@/store'
import { laborMatrix, laborRateCards } from '@/mock/data'
import { dateLabels, demoSeed, periodLabels, withSeed } from '@/mock/simulate'
import LaborDetailPanel from '@/components/labor/LaborDetailPanel.vue'
import IndicatorComparePanel from '@/components/labor/IndicatorComparePanel.vue'

export default {
  name: 'LaborCostPanel',
  components: { LaborDetailPanel, IndicatorComparePanel },
  props: {
    variant: {
      type: String,
      default: 'v1',
      validator(v) {
        return v === 'v1' || v === 'v2'
      }
    }
  },
  data() {
    return {
      store,
      actions,
      matrixScope: 'ytd',
      chartPeriod: 'month',
      chartMetric: 'rate',
      periodOptions: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' }
      ],
      scopeOptions: [
        { label: 'YTD指标', value: 'ytd' },
        { label: '月指标', value: 'month' }
      ],
      chartOptions: [
        { label: '综合人工成本费率', value: 'rate' },
        { label: '综合人工成本', value: 'cost' },
        { label: '收入', value: 'income' }
      ]
    }
  },
  computed: {
    liveMatrix() {
      const matrix = withSeed(laborMatrix, this.store, { metricScope: this.matrixScope })
      const labels = periodLabels(this.store)
      const head = matrix[0] && matrix[0].items && matrix[0].items[0]
      if (head) head.name = this.matrixScope === 'month' ? labels.month : labels.ytd
      return matrix
    },
    rateCardList() {
      const cards = withSeed(laborRateCards, this.store)
      const labels = periodLabels(this.store)
      return [
        { key: 'ytd', ...cards.ytd, label: labels.ytd },
        { key: 'month', ...cards.month, label: labels.month }
      ]
    },
    chartSeed() {
      return demoSeed(this.store, {
        period: this.chartPeriod,
        chartMetric: this.chartMetric
      })
    },
    chartLabels() {
      return dateLabels({
        period: this.chartPeriod,
        timeRange: this.store.timeRange
      })
    }
  },
  methods: {
    rateSubItems(card) {
      return [
        {
          title: card.fixed.title,
          value: card.fixed.value,
          trends: card.fixed.trends || []
        },
        {
          title: card.variable.title,
          value: card.variable.value,
          trends: card.variable.trends || []
        }
      ]
    },
    goTaskCenter() {
      if (typeof location !== 'undefined') location.hash = '/task-center'
    }
  }
}
</script>

<style scoped>
.labor-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.labor-panel.is-v2 {
  gap: 12px;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 32px;
}
.toolbar >>> .board-action {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.toolbar-title {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}
.toolbar-title >>> .text {
  font-size: 16px;
  line-height: 24px;
}
.split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  min-width: 0;
}
.matrix-side,
.chart-side {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.ctrl-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  min-height: 32px;
  margin-bottom: 8px;
  box-sizing: border-box;
}
.ctrl-row >>> .board-radio-group,
.ctrl-row >>> .board-action,
.ctrl-row >>> .capsule-tabs {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.ctrl-links {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.ctrl-row.chart-ctrl {
  gap: 12px;
}
.ctrl-row.chart-ctrl >>> .board-radio-group {
  min-width: 0;
  flex: 1 1 auto;
  justify-content: flex-end;
  flex-wrap: nowrap;
}
.matrix {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  column-gap: 12px;
  width: 100%;
  flex: 1 1 auto;
  background: #fff;
  min-height: 333px;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  height: 100%;
  background: #f8f9fd;
  border-radius: 8px;
  padding: 12px;
}
.cell {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 0;
  flex: 1 1 auto;
}
.cell >>> .metric-block {
  --board-metric-divider: #e4e5e9;
  flex: 1 1 auto;
  height: 100%;
  padding: 0;
}
.cell.is-head >>> .board-title.lv-2 .text,
.col:nth-child(n + 3) .cell:not(.is-head) >>> .board-title.lv-3 .text {
  font-weight: 500;
  color: var(--grey-01);
}
.col:nth-child(-n + 2) .cell.is-head >>> .metric-value.lv-2 .num {
  font-size: 22px;
}
.col:nth-child(n + 3) .cell.is-head >>> .metric-value.lv-2 .num {
  font-size: 18px;
}
.col:nth-child(-n + 2) .cell:not(.is-head) >>> .board-title.lv-3 .text {
  font-family: 'PingFang SC', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: var(--grey-02);
}
.chart-box {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  background: #fff;
  padding: 12px;
  box-sizing: border-box;
}
.rate-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  box-sizing: border-box;
}
.rate-group {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
  padding: 12px;
  border-radius: 8px;
  background: #f8faff;
  box-sizing: border-box;
}
.rate-group__primary {
  flex: 1 1 0;
  min-width: 0;
  padding-right: 12px;
  border-right: 1px solid #e7eeff;
  box-sizing: border-box;
}
.rate-group__secondary {
  flex: 1 1 0;
  min-width: 0;
}
.rate-group__secondary >>> .metric-group.horizontal {
  width: 100%;
  gap: 12px;
}
.rate-group__secondary >>> .metric-block {
  padding-left: 4px;
  padding-right: 4px;
}
.rate-chart-panel {
  display: flex;
  flex-direction: column;
  padding: 0 12px;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
}
.rate-chart-panel .ctrl-row {
  flex-shrink: 0;
  margin-bottom: 0;
}
.rate-chart-panel .ctrl-row.chart-ctrl >>> .board-radio-group {
  flex: 0 1 auto;
  min-width: 0;
  justify-content: flex-start;
}
.rate-chart-panel .chart-box {
  flex: 0 0 auto;
  height: 300px;
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 0 0;
  box-sizing: border-box;
}
.rate-chart-panel .chart-box >>> .chart-board {
  flex: 1 1 auto;
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
}
@media (max-width: 1100px) {
  .split,
  .rate-row {
    grid-template-columns: 1fr;
  }
}
</style>
