<template>
  <data-detail-drawer
    inline
    class="labor-cost-shell"
    :visible="store.laborCostOpen"
    title="综合人工成本"
    width="1280px"
    @close="actions.closeLaborCost()"
  >
    <template #content>
      <div class="labor-cost-drawer">
        <capsule-tabs
          :options="scopeOptions"
          :value="scope"
          @input="scope = $event"
        />

        <div class="labor-cost-table-wrap">
          <board-table
            class="labor-cost-table"
            expandable
            name-title="科目"
            :column-groups="columnGroups"
            :columns="columns"
            :rows="tableRows"
          />
        </div>

        <div class="labor-cost-trend">
          <div class="labor-cost-trend__head">
            <label class="subject-field">
              <span>选择科目</span>
              <el-select
                v-model="subject"
                size="small"
                class="subject-select"
                popper-class="labor-cost-subject-dropdown"
              >
                <el-option
                  v-for="item in laborCostSubjectOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </label>
            <div class="trend-legend" aria-hidden="true">
              <span><i class="dot is-current" />26年</span>
              <span><i class="dot is-last" />25年</span>
            </div>
          </div>
          <chart-board
            variant="multi-line"
            plot-size="lg"
            fill
            :seed="chartSeed"
            :labels="monthLabels"
            :y-axis-ticks="yAxisTicks"
            :legend-items="chartLegend"
          />
        </div>
      </div>
    </template>
  </data-detail-drawer>
</template>

<script>
import { store, actions } from '@/store'
import { laborCostBreakdownRows, laborCostSubjectOptions } from '@/mock/data'
import { demoSeed, periodLabels } from '@/mock/simulate'

export default {
  name: 'LaborCostBreakdownDrawer',
  data() {
    return {
      store,
      actions,
      laborCostSubjectOptions,
      scope: 'month',
      subject: laborCostSubjectOptions[0]
    }
  },
  computed: {
    labels() {
      return periodLabels(store)
    },
    scopeOptions() {
      return [
        { label: this.labels.ytd + '指标', value: 'ytd' },
        { label: this.labels.month + '指标', value: 'month' },
        { label: 'MTD预测', value: 'mtd' }
      ]
    },
    columnGroups() {
      return [
        { title: '人工成本（万元）', span: 3 },
        { title: '人均人工成本', span: 3 },
        { title: '人数（万）', span: 3 }
      ]
    },
    columns() {
      const month = this.labels.month
      return [
        { key: 'costMonth', title: month },
        { key: 'costDelta', title: '同比变化额', sortable: true },
        { key: 'costRate', title: '同比变化比例', sortable: true, tone: true },
        { key: 'unitMonth', title: month },
        { key: 'unitDelta', title: '同比变化额', sortable: true },
        { key: 'unitRate', title: '同比变化比例', sortable: true, tone: true },
        { key: 'headMonth', title: month },
        { key: 'headDelta', title: '同比变化额', sortable: true },
        { key: 'headRate', title: '同比变化比例', sortable: true, tone: true }
      ]
    },
    tableRows() {
      return laborCostBreakdownRows.map((row, index) => ({
        ...row,
        key: row.key || 'labor-cost-' + index
      }))
    },
    monthLabels() {
      return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxisTicks() {
      return ['250000万', '200000万', '150000万', '100000万', '50000万', '0']
    },
    chartLegend() {
      return [
        { label: '26年', color: '#3c6ef0' },
        { label: '25年', color: '#3ad3d9' }
      ]
    },
    chartSeed() {
      return demoSeed(store, { subject: this.subject, scope: this.scope })
    }
  },
  watch: {
    'store.laborCostOpen'(open) {
      if (open) {
        this.scope = 'month'
        this.subject = laborCostSubjectOptions[0]
      }
    }
  }
}
</script>

<style scoped>
.labor-cost-shell {
  --board-drawer-max-width: min(1280px, calc(100vw - 48px));
}
.labor-cost-shell >>> .data-detail-drawer__body {
  overflow: hidden;
}
.labor-cost-shell >>> .data-detail-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.labor-cost-drawer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}
.labor-cost-drawer >>> .capsule-tabs {
  flex-shrink: 0;
}
.labor-cost-table-wrap {
  flex: 1 1 auto;
  min-height: 160px;
  min-width: 0;
  overflow-x: auto;
  overflow-y: auto;
  scrollbar-gutter: stable;
  box-sizing: border-box;
}
.labor-cost-table {
  --board-name-col: 152px;
  --board-metric-min: 102px;
  --board-row-gap: 10px;
  --board-row-padding-x: 12px;
  --board-table-min: 1184px;
  width: max-content;
  max-width: none;
  min-width: 100%;
}
.labor-cost-table >>> .board-table__scroll {
  max-width: none;
  overflow: visible;
}
.labor-cost-table >>> .board-table__inner {
  box-sizing: border-box;
  width: max-content;
  min-width: var(--board-table-min);
  padding-right: 8px;
}
.labor-cost-table >>> .row-main {
  padding-right: 12px;
}
.labor-cost-table >>> .row.head {
  min-height: 36px;
}
.labor-cost-table >>> .row.head .row-main,
.labor-cost-table >>> .row.head .name {
  min-height: 36px;
}
.labor-cost-table >>> .row.head .name-text,
.labor-cost-table >>> .row.head .cell,
.labor-cost-table >>> .row.head .action-title {
  font-size: 13px;
  line-height: 18px;
}
.labor-cost-trend {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  flex: 0 0 auto;
  height: 280px;
  --chart-y-axis-width: 72px;
  --chart-board-plot-height: 220px;
}
.labor-cost-trend >>> .chart-board {
  flex: 1 1 auto;
  min-height: 0;
}
.labor-cost-trend__head {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex-shrink: 0;
}
.subject-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--grey-03);
  font-size: 13px;
  line-height: 18px;
}
.subject-select {
  width: 200px;
}
.trend-legend {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  line-height: 16px;
  color: var(--grey-02);
}
.trend-legend span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
}
.dot.is-current {
  background: #3c6ef0;
}
.dot.is-last {
  background: #3ad3d9;
}
.labor-cost-trend >>> .chart-board__legend {
  display: none;
}
.labor-cost-trend >>> .chart-board__y-axis {
  width: 72px;
  flex: 0 0 72px;
}
.labor-cost-trend >>> .chart-board__y-axis span {
  white-space: nowrap;
}
</style>
