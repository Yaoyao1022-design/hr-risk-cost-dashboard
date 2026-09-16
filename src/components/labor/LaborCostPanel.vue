<template>
  <div class="labor-panel">
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

    <labor-detail-panel />
  </div>
</template>

<script>
import { store, actions } from '@/store'
import { laborMatrix } from '@/mock/data'
import { dateLabels, demoSeed, periodLabels, withSeed } from '@/mock/simulate'
import LaborDetailPanel from '@/components/labor/LaborDetailPanel.vue'

export default {
  name: 'LaborCostPanel',
  components: { LaborDetailPanel },
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
    },
  },
  methods: {
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
}
@media (max-width: 1100px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
