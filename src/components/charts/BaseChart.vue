<template>
  <div ref="el" class="chart"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'BaseChart',
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  watch: {
    option: {
      deep: true,
      handler() {
        this.render()
      }
    }
  },
  mounted() {
    this.chart = echarts.init(this.$refs.el)
    this.render()
    this.onResize = () => this.chart && this.chart.resize()
    window.addEventListener('resize', this.onResize)
    this.$nextTick(() => this.chart && this.chart.resize())
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    if (this.chart) this.chart.dispose()
  },
  methods: {
    render() {
      if (this.chart) this.chart.setOption(this.option, true)
    }
  }
}
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
