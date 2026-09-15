<template>
  <div class="kpi">
    <span class="num">{{ value }}</span>
    <span v-if="unit" class="unit">{{ unit }}</span>
  </div>
</template>

<script>
export default {
  name: 'KpiNumber',
  props: {
    value: [String, Number],
    unit: String
  }
}
</script>

<style scoped>
.kpi {
  display: flex;
  align-items: flex-end;
  gap: 2px;
}
.num {
  font-size: 28px;
  line-height: 28px;
  color: var(--blue-06);
  font-weight: 400;
  font-family: Arial, "PingFang SC", sans-serif;
}
.unit {
  color: var(--grey-03);
  font-size: 14px;
  line-height: 12px;
  padding-bottom: 3px;
}
</style>
