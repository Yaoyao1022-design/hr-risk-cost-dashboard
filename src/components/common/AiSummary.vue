<template>
  <div class="ai-summary" :class="size">
    <img class="star" :src="star" alt="" />
    <p><slot>{{ text }}</slot></p>
  </div>
</template>

<script>
import star from '@/assets/icons/ai-star.svg'

export default {
  name: 'AiSummary',
  props: {
    text: String,
    size: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return { star }
  }
}
</script>

<style scoped>
.ai-summary {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  background: #f9f7ff;
  border-radius: 8px;
  padding: 8px;
  color: var(--purple-06);
  font-size: 12px;
  line-height: 18px;
}
.star {
  width: 12px;
  height: 12px;
  margin-top: 3px;
  flex-shrink: 0;
  object-fit: contain;
}
.ai-summary.line {
  align-items: center;
}
.ai-summary.line .star {
  margin-top: 0;
}
.ai-summary.line p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
