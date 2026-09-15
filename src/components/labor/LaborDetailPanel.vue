<template>
  <div class="labor-detail">
    <section v-if="isMapPerspective" class="block">
      <div class="detail-head">
        <board-title :text="detailTitle" :level="1" />
        <capsule-tabs
          v-if="store.orgLevel !== 'line'"
          :options="mapSliceOptions"
          :value="slice"
          @input="slice = $event"
        />
      </div>

      <div v-if="slice === 'province'" class="map-split">
        <div class="map-box">
          <chart-map plot-size="lg" fit="slice" :regions="mapRegions" />
        </div>
        <div class="map-side">
          <ai-summary :text="summaryText" />
          <div class="map-metric-row">
            <capsule-tabs
              :options="mapScopeOptions"
              :value="mapScope"
              @input="mapScope = $event"
            />
            <board-radio-group
              class="map-metric-radios"
              :options="laborMapMetricOptions"
              :value="mapMetric"
              @input="mapMetric = $event"
            />
          </div>
          <rank-list
            :columns="cityRankColumns"
            :rows="cityRankRows"
            sort-key="rank"
            sort-order="asc"
          />
        </div>
      </div>

      <div v-else class="dept-split">
        <div class="dept-col">
          <board-title text="费率情况" :level="1" bar />
          <rank-list
            :columns="deptRankColumns"
            :rows="deptRateRows"
            sort-key="rate"
            sort-order="desc"
          />
        </div>
        <div class="dept-col">
          <board-title text="效率情况" :level="1" bar />
          <rank-list
            :columns="efficiencyRankColumns"
            :rows="deptEfficiencyRows"
            sort-key="rate"
            sort-order="desc"
          />
        </div>
      </div>
    </section>

    <section v-else-if="store.orgLevel === 'province'" class="block">
      <div class="detail-head">
        <board-title text="部门及条线详情（省区视角）" :level="1" />
      </div>
      <ai-summary :text="provinceSummary" />
      <board-table
        name-title="条线"
        :columns="laborRateColumns"
        :rows="lineTableRows"
      />
    </section>

    <template v-else>
      <section class="block">
        <div class="detail-head">
          <board-title text="部门及条线详情（C1视角-费率管控部分）" :level="1" />
          <capsule-tabs
            :options="laborDetailSliceOptions"
            :value="c1Slice"
            @input="c1Slice = $event"
          />
        </div>
        <div class="map-split">
          <div class="map-box">
            <chart-map plot-size="lg" fit="slice" :regions="mapRegions" />
          </div>
          <div class="map-side">
            <ai-summary :text="c1Summary" />
            <board-table
              class="c1-rate-table"
              :scrollable="false"
              :sticky-name="false"
              :name-title="c1Slice === 'dept' ? '二级部门' : '条线'"
              :columns="laborRateColumns"
              :rows="c1TableRows"
            />
          </div>
        </div>
      </section>

      <section class="block">
        <div class="detail-head">
          <board-title text="部门及条线详情（C1视角-费率管控部分 非运营）" :level="1" />
          <capsule-tabs
            :options="laborDetailSliceOptions"
            :value="c1NonOpsSlice"
            @input="c1NonOpsSlice = $event"
          />
        </div>
        <div class="c1-table-only">
          <ai-summary :text="c1Summary" />
          <board-table
            class="c1-rate-table"
            :scrollable="false"
            :sticky-name="false"
            :name-title="c1NonOpsSlice === 'dept' ? '二级部门' : '条线'"
            :columns="laborRateColumns"
            :rows="c1NonOpsTableRows"
          />
        </div>
      </section>

      <section class="block">
        <div class="detail-head">
          <div class="detail-head__left">
            <board-title text="部门及条线详情（C1视角-预算管控部分）" :level="1" />
            <capsule-tabs
              :options="budgetPeriodOptions"
              :value="budgetPeriod"
              @input="budgetPeriod = $event"
            />
          </div>
          <capsule-tabs
            :options="budgetTypeOptions"
            :value="budgetType"
            @input="budgetType = $event"
          />
        </div>
        <div class="budget-split">
          <div class="budget-cards">
            <board-card
              v-for="card in budgetCards"
              :key="card.title"
              class="budget-card"
              variant="emphasis"
              fluid
              :title="card.title"
            >
              <div class="budget-card__groups">
                <div
                  v-for="group in card.groups"
                  :key="group.title"
                  class="budget-group"
                >
                  <board-title :text="group.title" :level="1" bar />
                  <metric-group
                    layout="vertical"
                    variant="l3-t"
                    :items="group.items"
                    :show-divider="false"
                  />
                </div>
              </div>
            </board-card>
          </div>
          <div class="budget-chart">
            <chart-board
              variant="multi-line"
              plot-size="md"
              fill
              :seed="budgetChartSeed"
              :labels="chartLabels"
            />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { store } from '@/store'
import {
  laborDetailSliceOptions,
  laborMapMetricOptions,
  laborCityRankRows,
  laborDeptRateRows,
  laborDeptEfficiencyRows,
  laborLineTableRows,
  laborRateColumns,
  laborDetailSummaries,
  laborBudgetCards
} from '@/mock/data'
import { dateLabels, demoSeed, periodLabels, shiftAmount, withSeed } from '@/mock/simulate'
import { defaultChartMapRegions } from 'jdl-board-kit/src/components/charts/chartMapRegions.js'

export default {
  name: 'LaborDetailPanel',
  data() {
    return {
      store,
      laborDetailSliceOptions,
      laborMapMetricOptions,
      laborRateColumns,
      slice: 'province',
      mapScope: 'ytd',
      mapMetric: 'l1l2',
      c1Slice: 'province',
      c1NonOpsSlice: 'province',
      budgetPeriod: 'year',
      budgetType: 'cost',
      budgetPeriodOptions: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' }
      ],
      budgetTypeOptions: [
        { label: '成本预实对比', value: 'cost' },
        { label: 'HC预实对比', value: 'hc' }
      ]
    }
  },
  computed: {
    extraSeed() {
      return {
        mapMetric: this.mapMetric,
        slice: this.slice,
        c1Slice: this.c1Slice,
        metricScope: this.mapScope,
        scope: this.mapScope
      }
    },
    budgetSeed() {
      return {
        ...this.extraSeed,
        budgetPeriod: this.budgetPeriod,
        budgetType: this.budgetType
      }
    },
    mapScopeOptions() {
      const labels = periodLabels(store)
      return [
        { label: labels.ytd + '指标', value: 'ytd' },
        { label: labels.month + '指标', value: 'month' }
      ]
    },
    chartSeed() {
      return demoSeed(store, this.extraSeed)
    },
    budgetChartSeed() {
      return demoSeed(store, this.budgetSeed)
    },
    chartLabels() {
      return dateLabels(store)
    },
    isMapPerspective() {
      return store.orgLevel === 'hq' || store.orgLevel === 'line'
    },
    deptSliceLabel() {
      return store.orgLevel === 'hq' ? '一级部门' : '二级部门'
    },
    mapSliceOptions() {
      return laborDetailSliceOptions.map((item) => (
        item.value === 'dept' ? { ...item, label: this.deptSliceLabel } : item
      ))
    },
    detailTitle() {
      return store.orgLevel === 'line'
        ? '部门及条线详情（条线视角）'
        : '部门及条线详情（总部视角）'
    },
    summaryText() {
      const text = store.orgLevel === 'line'
        ? laborDetailSummaries.line
        : laborDetailSummaries.hq
      return store.province ? text.replace(/江苏|运营/g, store.province) : text
    },
    provinceSummary() {
      const text = laborDetailSummaries.province
      return store.province ? text.replace(/运营/g, store.province) : text
    },
    c1Summary() {
      return laborDetailSummaries.c1
    },
    cityRankColumns() {
      const isLine = store.orgLevel === 'line'
      return [
        { key: 'rank', title: '排序' },
        { key: 'rate', title: isLine ? '当月费率' : '综合费率' },
        { key: 'yoy', title: isLine ? '当月同比' : '同比', trend: true }
      ]
    },
    cityRankRows() {
      return withSeed(laborCityRankRows, store, this.extraSeed)
    },
    deptRateRows() {
      return withSeed(laborDeptRateRows, store, this.extraSeed)
    },
    deptEfficiencyRows() {
      return withSeed(laborDeptEfficiencyRows, store, this.extraSeed)
    },
    lineTableRows() {
      return withSeed(laborLineTableRows, store, this.extraSeed)
    },
    budgetCards() {
      const cards = withSeed(laborBudgetCards, store, this.budgetSeed)
      const labels = periodLabels(store)
      return cards.map((card) => {
        const groups = card.groups.map((group) => {
          const title = group.title.includes('YTD')
            ? labels.ytd
            : group.title.includes('MTD')
              ? `${labels.month}MTD`
              : labels.month
          const items = group.items.map((item) => {
            if (this.budgetType !== 'hc') return { ...item, title: item.title }
            const unit = item.unit === '百万' ? '人' : item.unit
            const titleText = item.title.replace('成本预算', '编制预算').replace('实际已用', '当日在职')
            return { ...item, title: titleText, unit }
          })
          return { ...group, title, items }
        })
        return {
          ...card,
          title: this.budgetType === 'hc' && card.title === '成本监控' ? '编制监控' : card.title,
          groups
        }
      })
    },
    mapRegions() {
      const seed = this.chartSeed
      return defaultChartMapRegions.map((region, index) => {
        const base = region.tooltip || []
        const shifted = base.map((row, rowIndex) => ({
          ...row,
          value: shiftAmount(row.value, seed, index * 4 + rowIndex)
        }))
        return { ...region, tooltip: shifted }
      })
    },
    deptRankColumns() {
      return [
        { key: 'name', title: this.deptSliceLabel },
        { key: 'rate', title: '综合费率' },
        { key: 'yoy', title: '同比', trend: true }
      ]
    },
    efficiencyRankColumns() {
      return [
        { key: 'name', title: this.deptSliceLabel },
        { key: 'rate', title: '效率值' },
        { key: 'yoy', title: '同比', trend: true }
      ]
    },
    c1TableRows() {
      return this.buildC1TableRows(this.c1Slice)
    },
    c1NonOpsTableRows() {
      return this.buildC1TableRows(this.c1NonOpsSlice)
    }
  },
  watch: {
    'store.orgLevel'() {
      this.slice = 'province'
      this.c1Slice = 'province'
      this.c1NonOpsSlice = 'province'
    }
  },
  methods: {
    buildC1TableRows(slice) {
      const rows = this.lineTableRows
      if (slice !== 'dept') return rows
      return rows.map((row) => ({
        ...row,
        name: row.name.replace(/^\[.*?\]/, '').replace('运配', '运营部') || row.name
      }))
    }
  }
}
</script>

<style scoped>
.labor-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.detail-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 32px;
}
.detail-head__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1 1 auto;
}
.detail-head__left >>> .board-title {
  flex: 0 1 auto;
  min-width: 0;
}
.detail-head >>> .board-title {
  flex: 1 1 auto;
  min-width: 0;
}
.detail-head >>> .board-title .main {
  width: 100%;
}
.head-tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.labor-detail >>> .ai-summary__content {
  white-space: normal;
  word-break: break-word;
}
.map-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
}
.map-box {
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: visible;
  display: flex;
  align-items: stretch;
}
.map-box >>> .chart-map {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.map-box >>> .chart-map__stage {
  background: transparent;
  max-width: none;
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  overflow: visible;
}
.map-box >>> .chart-map__viewport,
.map-box >>> .chart-map__svg {
  width: 100%;
  height: 100%;
}
.map-side {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.c1-table-only {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.c1-rate-table {
  --board-table-min: 0;
  --board-name-col: 88px;
  --board-metric-min: 0;
  --board-row-gap: 8px;
  --board-row-padding-x: 8px;
  width: 100%;
  min-width: 0;
}
.c1-rate-table >>> .board-table__inner {
  min-width: 0;
  width: 100%;
}
.c1-rate-table >>> .cell {
  flex: 1 1 0;
  min-width: 0;
}
.c1-rate-table >>> .name-text,
.c1-rate-table >>> .cell {
  overflow: hidden;
  text-overflow: ellipsis;
}
.map-metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}
.map-metric-radios {
  justify-content: flex-end;
  flex-shrink: 0;
}
.dept-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}
.dept-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.budget-split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: stretch;
  min-width: 0;
}
.budget-cards {
  display: flex;
  align-items: stretch;
  gap: 12px;
  min-width: 0;
  width: 100%;
  height: 100%;
}
.labor-detail >>> .board-card.budget-card {
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  height: 100%;
}
.labor-detail >>> .board-card.budget-card:first-child {
  flex: 3 1 0;
}
.budget-card__groups {
  display: flex;
  gap: 8px;
  width: 100%;
  min-width: 0;
}
.budget-group {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: visible;
}
.budget-group >>> .metric-group,
.budget-group >>> .metric-block {
  overflow: visible;
}
.budget-group >>> .board-title .text {
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
}
.budget-chart {
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  background: #fff;
}
@media (max-width: 1100px) {
  .map-split,
  .dept-split,
  .budget-split {
    grid-template-columns: 1fr;
  }
}
</style>
