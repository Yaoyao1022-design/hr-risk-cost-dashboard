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
        :expanded-card-width="310"
        :gap="12"
        child-select-mode="radio"
        :selected-child-key="selectedChild"
        @select="onSelectSingleIndex"
        @select-child="onSelectChild"
      />
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
          <div class="multi-card__main">
            <span class="multi-card__label">{{ pair.label }}</span>
            <span v-if="pair.tag" class="multi-card__tag">{{ pair.tag }}</span>
            <el-tooltip
              v-if="pair.helpText"
              :content="pair.helpText"
              placement="top"
              effect="dark"
            >
              <button
                type="button"
                class="multi-card__help"
                aria-label="指标说明"
                @click.stop
              >
                <span class="multi-card__help-icon" :style="helpIconStyle" aria-hidden="true" />
              </button>
            </el-tooltip>
          </div>
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
      <div
        v-if="multiConclusion"
        class="multi-conclusion"
        :class="'is-' + multiConclusion.status"
      >
        <img
          class="multi-conclusion__icon"
          :src="conclusionIcon(multiConclusion.status)"
          alt=""
        />
        <p class="multi-conclusion__text">{{ multiConclusion.text }}</p>
      </div>
    </template>

    <div class="chart-block">
      <div class="chart-ctrl">
        <board-title
          class="chart-ctrl__title"
          :text="mode === 'single' ? activeMetricTitle : multiChartTitle"
          :level="1"
        />
        <capsule-tabs
          v-if="mode === 'single'"
          :options="periodOptions"
          :value="chartPeriod"
          @input="chartPeriod = $event"
        />
        <capsule-tabs
          v-else
          :options="compareMetricOptions"
          :value="compareMetric"
          @input="compareMetric = $event"
        />
      </div>
      <div class="chart-box">
        <chart-board
          :key="chartKey"
          variant="multi-line"
          plot-size="md"
          fill
          :seed="activeChartSeed"
          :labels="chartLabels"
          :legend-items="activeChartLegend"
          :y-axis-ticks="activeChartTicks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { store, actions } from '@/store'
import { indicatorSingleCards, indicatorMultiPairs } from '@/mock/data'
import { dateLabels, demoSeed, withSeed } from '@/mock/simulate'
import questionIcon from 'jdl-board-kit/src/assets/icons/board/icon-question.svg'
import signalGreen from '@/assets/icons/icon-signal-green.png'
import signalOrange from '@/assets/icons/icon-signal-orange.png'
import signalRed from '@/assets/icons/icon-signal-red.png'

const CHART_COLORS = ['#3c6ef0', '#3ad3d9', '#435889', '#3ec986', '#ffd83d']
const SIGNAL_ICONS = {
  green: signalGreen,
  orange: signalOrange,
  red: signalRed
}

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
      selectedChild: null,
      selectedPair: 'income-cost',
      chartPeriod: 'month',
      compareMetric: 'value',
      helpIconStyle: {
        WebkitMaskImage: `url("${questionIcon}")`,
        maskImage: `url("${questionIcon}")`
      },
      modeOptions: [
        { label: '单指标分析', value: 'single' },
        { label: '多指标交叉分析', value: 'multi' }
      ],
      periodOptions: [
        { label: '年', value: 'year' },
        { label: '月', value: 'month' }
      ],
      compareMetricOptions: [
        { label: '当月值', value: 'value' },
        { label: '同比', value: 'yoy' },
        { label: '环比', value: 'mom' }
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
    selectedChildMeta() {
      const card = this.selectedSingleCard
      if (!card || !this.selectedChild || !card.children) return null
      return card.children.find((c) => c.key === this.selectedChild) || null
    },
    activeMetricKey() {
      return this.selectedChild || this.selectedSingle
    },
    activeMetricTitle() {
      if (this.selectedChildMeta) return this.selectedChildMeta.title
      return (this.selectedSingleCard && this.selectedSingleCard.title) || '指标'
    },
    multiPairs() {
      return indicatorMultiPairs
    },
    selectedMultiPair() {
      return (
        this.multiPairs.find((item) => item.key === this.selectedPair) || this.multiPairs[0] || null
      )
    },
    multiConclusion() {
      const pair = this.selectedMultiPair
      return (pair && pair.conclusion) || null
    },
    multiChartTitle() {
      const pair = this.selectedMultiPair
      if (!pair || !pair.label) return '综合人工成本'
      const left = pair.label.split(/\s*VS\s*/i)[0]
      return (left && left.trim()) || '综合人工成本'
    },
    chartKey() {
      const id = this.mode === 'single' ? this.activeMetricKey : this.selectedPair
      const dim = this.mode === 'single' ? this.chartPeriod : this.compareMetric
      return `${this.mode}-${id}-${dim}`
    },
    chartLabels() {
      return dateLabels({
        period: this.mode === 'single' ? this.chartPeriod : 'month',
        timeRange: this.store.timeRange
      })
    },
    activeChartSeed() {
      return demoSeed(this.store, {
        compare: this.mode === 'single' ? this.activeMetricKey : this.selectedPair || 'none',
        mode: this.mode,
        period: this.mode === 'single' ? this.chartPeriod : this.compareMetric
      })
    },
    activeChartLegend() {
      if (this.mode === 'single') {
        const title = this.activeMetricTitle
        return [
          { label: title, color: CHART_COLORS[0] },
          { label: '预测', color: CHART_COLORS[1] },
          { label: '达成率', color: CHART_COLORS[2] }
        ]
      }
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
    activeChartTicks() {
      const key = this.mode === 'single' ? this.activeMetricKey : this.selectedPair
      const base = this.tickBaseForKey(key)
      const scale = this.mode === 'multi' && this.compareMetric !== 'value' ? 0.35 : 1
      return buildTicks(this.activeChartSeed, Math.max(40, Math.round(base * scale)))
    }
  },
  watch: {
    mode(next) {
      if (next !== 'single') this.selectedChild = null
    }
  },
  methods: {
    onSelectSingleIndex(index) {
      const card = this.singleCards[index]
      if (!card) return
      this.selectedSingle = card.key
      this.selectedChild = null
    },
    onSelectChild(payload) {
      if (!payload) return
      if (payload.cardKey) this.selectedSingle = payload.cardKey
      else if (payload.index != null) {
        const card = this.singleCards[payload.index]
        if (card) this.selectedSingle = card.key
      }
      this.selectedChild = payload.key != null ? payload.key : null
    },
    selectPair(key) {
      if (key) this.selectedPair = key
    },
    conclusionIcon(status) {
      return SIGNAL_ICONS[status] || SIGNAL_ICONS.green
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
        'fixed-cost': 200,
        'var-cost': 240,
        'ops-income': 250,
        'other-income': 120,
        'income-cost': 260,
        'fixed-people': 210,
        'var-volume': 240,
        'avg-cost': 160,
        'avg-eff': 180,
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
.chart-block {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 0;
}
.chart-ctrl {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  min-height: 32px;
  flex-shrink: 0;
  gap: 12px;
  box-sizing: border-box;
}
.chart-ctrl__title {
  flex: 0 1 auto;
  min-width: 0;
}
.chart-ctrl__title >>> .text {
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
  color: var(--grey-02, #525765);
}
.chart-ctrl >>> .capsule-tabs {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}
.multi-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  flex-shrink: 0;
  width: 100%;
}
.multi-card {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  padding: 16px;
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
.multi-card__main {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  flex: 1 1 auto;
  padding-right: 4px;
  box-sizing: border-box;
}
.multi-card__label {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--grey-01, #23252b);
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.multi-card__tag {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  border: 1px solid var(--grey-05, #e4e5e9);
  border-radius: 6px;
  box-sizing: border-box;
  color: var(--grey-03, #868d9f);
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  white-space: nowrap;
}
.multi-card__help {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--grey-03, #868d9f);
}
.multi-card__help-icon {
  display: block;
  width: 14px;
  height: 14px;
  background: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}
.multi-card__check {
  flex-shrink: 0;
  height: 16px;
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
.multi-conclusion {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  padding: 8px;
  border-radius: 8px;
  background: #f8f9fd;
  box-sizing: border-box;
  flex-shrink: 0;
}
.multi-conclusion__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  object-fit: contain;
}
.multi-conclusion__text {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
}
/* 设计稿：红/橙整句着色；绿为中性灰 */
.multi-conclusion.is-red .multi-conclusion__text {
  color: #fc3737;
}
.multi-conclusion.is-green .multi-conclusion__text {
  color: #868d9f;
}
.multi-conclusion.is-orange .multi-conclusion__text {
  color: #ff7700;
}
.chart-box {
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
.chart-box >>> .chart-board {
  flex: 1 1 auto;
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
}
@media (max-width: 1100px) {
  .multi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 720px) {
  .multi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
