<template>
  <button
    class="theme-card"
    :class="{ active: active, inactive: !active }"
    type="button"
    @click="$emit('select')"
  >
    <div class="title-bar">
      <div class="title">
        <img class="icon-22" :src="opsIcon" alt="" />
        <span>{{ card.title }}</span>
      </div>
      <span class="ai-btn" @click.stop>
        AI报告
        <img class="icon" :src="arrowDown" alt="" />
      </span>
    </div>
    <ai-summary :text="card.summary" />
    <div class="board">
      <div class="metric">
        <div class="label">{{ card.ytd.label }}</div>
        <kpi-number :value="card.ytd.value" :unit="card.ytd.unit" />
        <div class="inds">
          <trend-item
            v-for="item in card.ytd.indicators"
            :key="item.name"
            :name="item.name"
            :value="item.value"
            :trend="item.trend"
          />
        </div>
      </div>
      <div class="metric">
        <div class="label">{{ card.month.label }}</div>
        <kpi-number :value="card.month.value" :unit="card.month.unit" />
        <div class="inds">
          <trend-item
            v-for="item in card.month.indicators"
            :key="item.name"
            :name="item.name"
            :value="item.value"
            :trend="item.trend"
          />
        </div>
      </div>
    </div>
  </button>
</template>

<script>
import AiSummary from '@/components/common/AiSummary.vue'
import KpiNumber from '@/components/common/KpiNumber.vue'
import TrendItem from '@/components/common/TrendItem.vue'
import opsIcon from '@/assets/icons/icon-ops.svg'
import arrowDown from '@/assets/icons/arrow-down.svg'

export default {
  name: 'ThemeCard',
  components: { AiSummary, KpiNumber, TrendItem },
  props: {
    card: Object,
    active: Boolean
  },
  data() {
    return { opsIcon, arrowDown }
  }
}
</script>

<style scoped>
.theme-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  text-align: left;
  width: 100%;
  min-height: 254px;
  position: relative;
}
.theme-card.active {
  background: linear-gradient(172deg, #dae4ff 10.5%, #ffffff 24.6%, #ffffff 100%);
  border-radius: 8px 8px 0 0;
  box-shadow: none;
}
.theme-card.inactive {
  background: #fff;
  border-radius: 8px;
  box-shadow: none;
}
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}
.ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-width: 85px;
  height: 32px;
  padding: 0 16px;
  border-radius: 8px;
  background: rgba(137, 88, 247, 0.1);
  color: #8958f7;
  font-size: 14px;
}
.ai-btn .icon {
  width: 16px;
  height: 16px;
}
.board {
  background: #f8faff;
  border-radius: 8px;
  padding: 12px 24px;
  display: flex;
  gap: 40px;
}
.metric {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.metric + .metric {
  padding-left: 0;
}
.metric:first-child {
  border-right: 1px solid #dee7fe;
  padding-right: 16px;
}
.label {
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
.inds {
  display: flex;
  gap: 16px;
  margin-top: 6px;
}
</style>
