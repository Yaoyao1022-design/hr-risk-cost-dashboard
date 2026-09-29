<template>
  <div class="indicator-compare">
    <div class="indicator-compare__head">
      <capsule-tabs
        :options="modeOptions"
        :value="mode"
        @input="mode = $event"
      />
      <div class="indicator-compare__actions">
        <board-action kind="more" text="查看综合人工成本" @click="actions.openLaborCost()" />
        <board-action kind="more" text="查看指标详情" @click="actions.openMetricDetail()" />
      </div>
    </div>

    <template v-if="mode === 'single'">
      <switch-card-group
        class="single-carousel"
        carousel
        :items="singleCards"
        :selected-index="selectedSingleIndex"
        :show-trends="true"
        :show-impact="false"
        :card-width="216"
        :expanded-card-width="360"
        :gap="12"
        @select="onSelectSingleIndex"
      />
      <div class="chart-box">
        <chart-board
          :key="'single-' + selectedSingle"
          variant="multi-line"
          plot-size="md"
          fill
          :seed="singleChartSeed"
          :labels="chartLabels"
          :legend-items="singleChartLegend"
          :y-axis-ticks="singleChartTicks"
        />
      </div>
    </template>

    <template v-else>
      <div class="multi-grid" role="radiogroup" aria-label="指标组合">
        <div
          v-for="pair in multiPairs"
          :key="pair.key"
          class="multi-card"
          :class="{ 'is-active': selectedPair === pair.key }"
          role="radio"
          tabindex="0"
          :aria-checked="selectedPair === pair.key ? 'true' : 'false'"
          @click="selectPair(pair.key)"
          @keydown.enter.prevent="selectPair(pair.key)"
          @keydown.space.prevent="selectPair(pair.key)"
        >
          <span class="multi-card__text">
            <span class="multi-card__label">{{ pair.label }}</span>
            <span v-if="pair.desc" class="multi-card__desc">{{ pair.desc }}</span>
          </span>
          <el-radio
            class="multi-card__check"
            v-model="selectedPair"
            :label="pair.key"
            @click.native.stop
          >
            &nbsp;
          </el-radio>
        </div>
      </div>
      <div class="chart-box">
        <chart-board
          :key="'multi-' + selectedPair"
          variant="multi-line"
          plot-size="md"
          fill
          :seed="multiChartSeed"
          :labels="chartLabels"
          :legend-items="multiChartLegend"
          :y-axis-ticks="multiChartTicks"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { store, actions } from '@/store'
import { indicatorSingleCards, indicatorMultiPairs } from '@/mock/data'
import { dateLabels, demoSeed, withSeed } from '@/mock/simulate'

const CHART_COLORS = ['#3c6ef0', '#3ad3d9', '#435889', '#3ec986', '#ffd83d']

function buildTicks(seed, maxBase) {
  const max = Math.max(40, Math.round(maxBase + ((seed % 7) - 3) * (maxBase / 20)))
  const step = max / 5
  return [0, 1, 2, 3, 4, 5].map((i) => String(Math.round(max - step * i)))
}

export default {
  name: 'IndicatorComparePanel',
  data() {
    return {
      store,
      actions,
      mode: 'single',
      selectedSingle: 'cost',
      selectedPair: 'income-cost',
      modeOptions: [
        { label: '单指标分析', value: 'single' },
        { label: '多指标交叉分析', value: 'multi' }
      ]
    }
  },
  computed: {
    singleCards() {
      return withSeed(indicatorSingleCards, this.store)
    },
    selectedSingleIndex() {
      const index = this.singleCards.findIndex((item) => item.key === this.selectedSingle)
      return index >= 0 ? index : 0
    },
    selectedSingleCard() {
      return this.singleCards[this.selectedSingleIndex] || this.singleCards[0] || null
    },
    multiPairs() {
      return indicatorMultiPairs
    },
    selectedMultiPair() {
      return (
        this.multiPairs.find((item) => item.key === this.selectedPair) || this.multiPairs[0] || null
      )
    },
    chartLabels() {
      return dateLabels({
        period: 'month',
        timeRange: this.store.timeRange
      })
    },
    singleChartSeed() {
      return demoSeed(this.store, { compare: this.selectedSingle, mode: 'single' })
    },
    multiChartSeed() {
      return demoSeed(this.store, {
        compare: this.selectedPair || 'none',
        mode: 'multi'
      })
    },
    singleChartLegend() {
      const title = (this.selectedSingleCard && this.selectedSingleCard.title) || '指标'
      return [
        { label: title, color: CHART_COLORS[0] },
        { label: '预测', color: CHART_COLORS[1] },
        { label: '达成率', color: CHART_COLORS[2] }
      ]
    },
    multiChartLegend() {
      const pair = this.selectedMultiPair
      const parts = pair && pair.label ? pair.label.split(/\s*VS\s*/i) : []
      const left = (parts[0] || '指标A').trim()
      const right = (parts[1] || '指标B').trim()
      return [
        { label: left, color: CHART_COLORS[0] },
        { label: right, color: CHART_COLORS[1] },
        { label: '匹配度', color: CHART_COLORS[2] }
      ]
    },
    singleChartTicks() {
      return buildTicks(this.singleChartSeed, this.tickBaseForKey(this.selectedSingle))
    },
    multiChartTicks() {
      return buildTicks(this.multiChartSeed, this.tickBaseForKey(this.selectedPair))
    }
  },
  methods: {
    onSelectSingleIndex(index) {
      const card = this.singleCards[index]
      if (card) this.selectedSingle = card.key
    },
    selectPair(key) {
      if (key) this.selectedPair = key
    },
    tickBaseForKey(key) {
      const map = {
        cost: 250,
        income: 280,
        people: 220,
        efficiency: 180,
        volume: 300,
        'daily-volume': 260,
        'capita-cost': 200,
        'unit-cost': 160,
        'capita-fixed': 140,
        'unit-fixed': 120,
        'capita-var': 190,
        'unit-var': 150,
        'income-cost': 260,
        'avg-income-cost': 180,
        'capita-avg': 170,
        'fixed-people': 210,
        'var-volume': 240,
        'avg-cost': 160,
        'var-eff': 200
      }
      return map[key] || 220
    }
  }
}
</script>

<style scoped>
.indicator-compare {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px;
  border-radius: 8px;
  background: var(--white, #fff);
  box-sizing: border-box;
}
.indicator-compare__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  flex-shrink: 0;
  min-height: 32px;
}
.indicator-compare__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: auto;
}
.single-carousel {
  flex-shrink: 0;
  width: 100%;
  min-width: 0;
}
.multi-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;
}
.multi-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  width: 269px;
  flex: 1 1 269px;
  max-width: 100%;
  background: #f8f9fd;
  border: 1px solid #e7eeff;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.15s ease;
}
.multi-card:hover {
  border-color: var(--blue-06, #3c6ef0);
}
.multi-card.is-active {
  border-color: var(--blue-06, #3c6ef0);
  background: #f8f9fd;
}
.multi-card:focus {
  outline: none;
}
.multi-card:focus-visible {
  outline: 2px solid var(--blue-06, #3c6ef0);
  outline-offset: 2px;
}
.multi-card__check {
  position: absolute;
  top: 12px;
  right: 12px;
  height: 14px;
  line-height: 1;
  margin: 0;
}
.multi-card__check >>> .el-radio__label {
  display: none;
}
.multi-card__check >>> .el-radio__input {
  line-height: 1;
}
.multi-card__check >>> .el-radio__inner {
  width: 14px;
  height: 14px;
}
.multi-card__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
  width: 100%;
  padding-right: 22px;
  box-sizing: border-box;
}
.multi-card__label {
  color: var(--grey-01, #23252b);
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.multi-card__desc {
  color: var(--grey-03, #868d9f);
  font-size: 12px;
  line-height: 18px;
}
.chart-box {
  flex: 0 0 auto;
  height: 300px;
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 12px 0;
  box-sizing: border-box;
}
.chart-box >>> .chart-board {
  flex: 1 1 auto;
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
}
@media (max-width: 1100px) {
  .multi-card {
    flex-basis: calc(50% - 4px);
  }
}
</style>
