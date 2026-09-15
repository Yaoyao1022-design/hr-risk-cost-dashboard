<template>
  <div class="trend" :class="trend">
    <span class="name">{{ name }}</span>
    <span class="value">{{ value }}</span>
    <img class="arrow" :src="icon" alt="" />
  </div>
</template>

<script>
import arrowUp from '@/assets/icons/arrow-up.svg'
import arrowDown from '@/assets/icons/arrow-down-red.svg'

export default {
  name: 'TrendItem',
  props: {
    name: String,
    value: String,
    trend: {
      type: String,
      default: 'up'
    }
  },
  computed: {
    icon() {
      return this.trend === 'up' ? arrowUp : arrowDown
    }
  }
}
</script>

<style scoped>
.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}
.name {
  color: var(--grey-03);
}
.value {
  font-weight: 500;
}
.trend.up .value {
  color: var(--green-06);
}
.trend.down .value {
  color: var(--red-06);
}
.arrow {
  width: 7px;
  height: 6px;
  object-fit: contain;
}
</style>
