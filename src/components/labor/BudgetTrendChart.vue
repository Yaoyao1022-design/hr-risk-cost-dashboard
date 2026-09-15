<template>
  <div class="budget-trend-chart" :class="{ 'is-fill': fill }">
    <div class="budget-trend-chart__body">
      <div class="budget-trend-chart__y-axis is-left">
        <span v-for="tick in leftTicks" :key="'L' + tick">{{ tick }}{{ valueUnit }}</span>
      </div>

      <div class="budget-trend-chart__plot" @mouseleave="hoverIndex = -1">
        <div class="budget-trend-chart__grid">
          <span v-for="n in leftTicks.length" :key="'g' + n" />
        </div>
        <div class="budget-trend-chart__zero" />

        <div class="budget-trend-chart__bars">
          <div
            v-for="(point, index) in points"
            :key="'bar' + index"
            class="budget-trend-chart__bar-slot"
            :class="{ 'is-highlight': hoverIndex === index }"
          >
            <div
              class="budget-trend-chart__bar"
              :class="point.deviation >= 0 ? 'is-up' : 'is-down'"
              :style="barStyle(point.deviation)"
            />
          </div>
        </div>

        <svg
          class="budget-trend-chart__svg"
          :viewBox="'0 0 ' + VIEW_W + ' ' + VIEW_H"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient :id="fillId" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--chart-cyan-06)" stop-opacity="0.18" />
              <stop offset="100%" stop-color="var(--chart-cyan-06)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="budgetAreaPath" :fill="'url(#' + fillId + ')'" />
          <path
            :d="budgetLinePath"
            fill="none"
            stroke="var(--chart-cyan-06)"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            :d="actualLinePath"
            fill="none"
            stroke="var(--blue-06)"
            stroke-width="2"
            vector-effect="non-scaling-stroke"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <div class="budget-trend-chart__markers">
          <div
            v-for="(point, index) in points"
            :key="'mk' + index"
            class="budget-trend-chart__marker-col"
          >
            <span
              class="budget-trend-chart__label is-budget"
              :style="{ top: valueTop(point.budget) }"
            >{{ formatValue(point.budget) }}</span>
            <span
              class="budget-trend-chart__label is-actual"
              :style="{ top: valueTop(point.actual) }"
            >{{ formatValue(point.actual) }}</span>
            <i
              class="budget-trend-chart__dot is-budget"
              :style="{ top: valueTop(point.budget) }"
            />
            <i
              class="budget-trend-chart__dot is-actual"
              :style="{ top: valueTop(point.actual) }"
            />
          </div>
        </div>

        <div class="budget-trend-chart__hover-layer">
          <div
            v-for="(label, index) in labels"
            :key="label"
            class="budget-trend-chart__hover-zone"
            @mouseenter="hoverIndex = index"
          />
        </div>

        <div
          v-if="hoverIndex >= 0"
          class="budget-trend-chart__guide"
          :style="guideStyle"
        />
        <div
          v-if="hoverIndex >= 0"
          class="budget-trend-chart__tooltip-wrap"
          :style="tooltipStyle"
        >
          <chart-tooltip :title="labels[hoverIndex]" :items="tooltipItems" />
        </div>
      </div>

      <div class="budget-trend-chart__y-axis is-right">
        <span v-for="tick in rightTicks" :key="'R' + tick">{{ tick }}</span>
      </div>
    </div>

    <div class="budget-trend-chart__x-axis">
      <span v-for="label in labels" :key="label">{{ label }}</span>
    </div>

    <div class="budget-trend-chart__legend">
      <span
        v-for="(item, index) in legend"
        :key="item.label + index"
        class="budget-trend-chart__legend-item"
      >
        <i :style="{ background: item.color }" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<script>
import ChartTooltip from 'jdl-board-kit/src/components/charts/ChartTooltip.vue'

const VIEW_W = 280
const VIEW_H = 160
const LEFT_MAX = 6
const RIGHT_MAX = 30

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function seeded(seed, index, salt) {
  const x = Math.sin((seed + 1) * 12.9898 + (index + 1) * 78.233 + salt * 37.719) * 43758.5453
  return x - Math.floor(x)
}

export default {
  name: 'BudgetTrendChart',
  components: { ChartTooltip },
  props: {
    labels: {
      type: Array,
      default: () => []
    },
    seed: { type: Number, default: 0 },
    fill: { type: Boolean, default: true },
    mode: {
      type: String,
      default: 'cost',
      validator(value) {
        return ['cost', 'hc'].includes(value)
      }
    }
  },
  data() {
    return {
      VIEW_W,
      VIEW_H,
      hoverIndex: -1
    }
  },
  computed: {
    fillId() {
      return `budget-trend-fill-${this._uid}`
    },
    valueUnit() {
      return this.mode === 'hc' ? '人' : '百万'
    },
    leftTicks() {
      return this.mode === 'hc'
        ? ['30', '24', '18', '12', '6', '0']
        : ['6', '4.8', '3.6', '2.4', '1.2', '0']
    },
    leftMax() {
      return this.mode === 'hc' ? 30 : LEFT_MAX
    },
    rightTicks() {
      return ['30%', '20%', '10%', '0%', '-10%', '-20%', '-30%']
    },
    legend() {
      if (this.mode === 'hc') {
        return [
          { label: '编制预算', color: 'var(--chart-cyan-06)' },
          { label: '当日在职', color: 'var(--blue-06)' },
          { label: '预实偏差度', color: 'var(--chart-circular-color-7)' }
        ]
      }
      return [
        { label: '预算金额', color: 'var(--chart-cyan-06)' },
        { label: '实际已用', color: 'var(--blue-06)' },
        { label: '预实偏差度', color: 'var(--chart-circular-color-7)' }
      ]
    },
    points() {
      const count = Math.max(this.labels.length, 1)
      const max = this.leftMax
      const base = this.mode === 'hc' ? 13 : 1.45
      return Array.from({ length: count }, (_, index) => {
        const wave = Math.sin((index / Math.max(count - 1, 1)) * Math.PI * 1.2)
        const drop = index === count - 1 ? (this.mode === 'hc' ? 0.55 : 0.42) : 1
        const budget =
          (base + wave * (this.mode === 'hc' ? 3.2 : 0.28) + seeded(this.seed, index, 1) * 0.2) * drop
        const actual =
          budget *
          (0.92 + seeded(this.seed, index, 2) * 0.22) *
          (index === count - 1 ? 0.9 : 1)
        const deviation = clamp(((actual - budget) / Math.max(budget, 0.01)) * 100, -28, 28)
        return {
          budget: clamp(Number(budget.toFixed(1)), 0, max),
          actual: clamp(Number(actual.toFixed(1)), 0, max),
          deviation: Number(deviation.toFixed(1))
        }
      })
    },
    budgetLinePath() {
      return this.buildLinePath((p) => p.budget)
    },
    actualLinePath() {
      return this.buildLinePath((p) => p.actual)
    },
    budgetAreaPath() {
      if (!this.points.length) return ''
      const line = this.buildLinePath((p) => p.budget)
      const lastX = this.xAt(this.points.length - 1)
      return `${line} L${lastX} ${VIEW_H} L${this.xAt(0)} ${VIEW_H} Z`
    },
    guideStyle() {
      const count = this.labels.length || 1
      const left = ((this.hoverIndex + 0.5) / count) * 100
      return { left: `${left}%` }
    },
    tooltipStyle() {
      const count = this.labels.length || 1
      const left = ((this.hoverIndex + 0.5) / count) * 100
      const align =
        this.hoverIndex <= 1 ? 'start' : this.hoverIndex >= count - 2 ? 'end' : 'center'
      const transformMap = {
        start: 'translateX(4px)',
        center: 'translateX(-50%)',
        end: 'translateX(calc(-100% - 4px))'
      }
      return {
        left: `${left}%`,
        top: '8px',
        transform: transformMap[align]
      }
    },
    tooltipItems() {
      if (this.hoverIndex < 0) return []
      const point = this.points[this.hoverIndex]
      if (!point) return []
      return [
        { color: this.legend[0].color, value: this.formatValue(point.budget) },
        { color: this.legend[1].color, value: this.formatValue(point.actual) },
        {
          color: this.legend[2].color,
          value: `${point.deviation > 0 ? '+' : ''}${point.deviation}%`
        }
      ]
    }
  },
  methods: {
    xAt(index) {
      const count = Math.max(this.points.length, 1)
      if (count === 1) return VIEW_W / 2
      return (index / (count - 1)) * VIEW_W
    },
    yAt(value) {
      return VIEW_H - (clamp(value, 0, this.leftMax) / this.leftMax) * VIEW_H
    },
    buildLinePath(getter) {
      return this.points
        .map((point, index) => {
          const x = this.xAt(index)
          const y = this.yAt(getter(point))
          return `${index === 0 ? 'M' : 'L'}${x} ${y}`
        })
        .join(' ')
    },
    valueTop(value) {
      return `${(1 - clamp(value, 0, this.leftMax) / this.leftMax) * 100}%`
    },
    formatValue(value) {
      return `${value}${this.valueUnit}`
    },
    barStyle(deviation) {
      const ratio = Math.abs(deviation) / RIGHT_MAX
      const height = `${clamp(ratio * 50, 2, 48)}%`
      return {
        height,
        background: `linear-gradient(${deviation >= 0 ? '180deg' : '0deg'}, #3c6ef0 0%, #9bbcff 100%)`
      }
    }
  }
}
</script>

<style scoped>
.budget-trend-chart {
  display: flex;
  flex-direction: column;
  gap: var(--chart-axis-gap);
  width: 100%;
  min-width: 0;
}
.budget-trend-chart.is-fill {
  height: 100%;
  min-height: 0;
}
.budget-trend-chart.is-fill .budget-trend-chart__body {
  flex: 1 1 auto;
  min-height: 0;
}
.budget-trend-chart.is-fill .budget-trend-chart__plot {
  flex: 1 1 auto;
  min-height: 0;
}
.budget-trend-chart__body {
  display: flex;
  gap: var(--chart-bar-gap);
  min-height: var(--chart-plot-height);
}
.budget-trend-chart__y-axis {
  width: 42px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  font-size: 12px;
  line-height: 16px;
  color: var(--grey-03);
}
.budget-trend-chart__y-axis.is-left {
  text-align: right;
}
.budget-trend-chart__y-axis.is-right {
  text-align: left;
  width: 40px;
}
.budget-trend-chart__plot {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: var(--chart-plot-height);
  border-radius: 4px;
  overflow: hidden;
}
.budget-trend-chart__grid {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}
.budget-trend-chart__grid span {
  border-top: 0.5px dashed var(--grey-05);
}
.budget-trend-chart__grid span:last-child {
  border-top: 0.5px solid var(--grey-04);
}
.budget-trend-chart__zero {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1px dashed var(--grey-04);
  pointer-events: none;
  z-index: 1;
}
.budget-trend-chart__bars {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  z-index: 1;
}
.budget-trend-chart__bar-slot {
  flex: 1;
  position: relative;
  min-width: 0;
  height: 100%;
  transition: background 0.15s ease;
}
.budget-trend-chart__bar-slot.is-highlight {
  background: rgba(60, 110, 240, 0.06);
}
.budget-trend-chart__bar {
  position: absolute;
  left: 50%;
  width: 10px;
  transform: translateX(-50%);
  border-radius: 1px;
  opacity: 0.9;
}
.budget-trend-chart__bar.is-up {
  bottom: 50%;
  border-radius: 1px 1px 0 0;
}
.budget-trend-chart__bar.is-down {
  top: 50%;
  border-radius: 0 0 1px 1px;
}
.budget-trend-chart__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
.budget-trend-chart__markers {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  z-index: 3;
}
.budget-trend-chart__marker-col {
  flex: 1;
  position: relative;
  min-width: 0;
}
.budget-trend-chart__dot {
  position: absolute;
  left: 50%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
  transform: translate(-50%, -50%);
}
.budget-trend-chart__dot.is-budget {
  background: var(--chart-cyan-06);
}
.budget-trend-chart__dot.is-actual {
  background: var(--blue-06);
}
.budget-trend-chart__label {
  position: absolute;
  left: 50%;
  transform: translate(-50%, calc(-100% - 6px));
  font-size: 10px;
  line-height: 12px;
  white-space: nowrap;
  color: var(--grey-02);
  pointer-events: none;
}
.budget-trend-chart__label.is-budget {
  color: var(--chart-cyan-06);
}
.budget-trend-chart__label.is-actual {
  color: var(--blue-06);
  transform: translate(-50%, 8px);
}
.budget-trend-chart__hover-layer {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 4;
}
.budget-trend-chart__hover-zone {
  flex: 1;
  min-width: 0;
  cursor: crosshair;
}
.budget-trend-chart__guide {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  margin-left: -0.5px;
  border-left: 1px dashed var(--grey-04);
  pointer-events: none;
  z-index: 5;
}
.budget-trend-chart__tooltip-wrap {
  position: absolute;
  z-index: 6;
  pointer-events: none;
  max-width: calc(100% - 8px);
}
.budget-trend-chart__x-axis {
  display: flex;
  padding-left: 46px;
  padding-right: 44px;
}
.budget-trend-chart__x-axis span {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  color: var(--grey-03);
}
.budget-trend-chart__legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px var(--chart-legend-gap);
  min-height: var(--chart-legend-height);
}
.budget-trend-chart__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  line-height: 16px;
  color: var(--grey-02);
  white-space: nowrap;
}
.budget-trend-chart__legend-item i {
  width: var(--chart-legend-dot);
  height: var(--chart-legend-dot);
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}
</style>
