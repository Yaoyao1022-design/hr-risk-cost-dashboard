<template>
  <div class="dashboard">
    <div class="dashboard__filter" :class="{ 'is-stuck': filterStuck }">
      <query-bar />
    </div>
    <div class="dashboard__body">
    <switch-card-panel
      v-if="isCockpit"
      plain
      :class="{ 'is-guide-spotlight': store.guideActive }"
      :items="themeItems"
      :selected-index="selectedIndex"
      :auto-menu-download="false"
      @select="onSelectTheme"
      @action-view="onAiReportView"
      @action-download="onAiReportDownload"
    >
      <labor-cost-panel v-if="store.guideActive || store.theme === 'labor'" />
      <leakage-panel v-else />
    </switch-card-panel>
    <div v-else class="standalone-screen">
      <labor-cost-panel v-if="mode === 'labor-roi'" />
      <leakage-panel v-else />
    </div>
    </div>
  </div>
</template>

<script>
import { store, actions } from '@/store'
import { themeCards, downloadAiReportFile } from '@/mock/data'
import { periodLabels, withSeed } from '@/mock/simulate'
import QueryBar from '@/components/query/QueryBar.vue'
import LaborCostPanel from '@/components/labor/LaborCostPanel.vue'
import LeakagePanel from '@/components/leak/LeakagePanel.vue'

function toMetrics(block) {
  return {
    title: block.label,
    value: block.value,
    unit: block.unit,
    trends: block.indicators
  }
}

export default {
  name: 'Dashboard',
  components: { QueryBar, LaborCostPanel, LeakagePanel },
  props: {
    mode: { type: String, default: 'cockpit' }
  },
  data() {
    return {
      store,
      filterStuck: false
    }
  },
  mounted() {
    this.syncThemeByMode()
    this.$el.addEventListener('scroll', this.onDashboardScroll, { passive: true })
  },
  watch: {
    mode() {
      this.syncThemeByMode()
    }
  },
  beforeDestroy() {
    this.$el.removeEventListener('scroll', this.onDashboardScroll)
  },
  computed: {
    isCockpit() {
      return this.mode === 'cockpit'
    },
    selectedIndex() {
      if (this.store.guideActive) {
        return this.store.guideCardIndex
      }
      return this.store.theme === 'leak' ? 1 : 0
    },
    themeItems() {
      const cards = withSeed(themeCards, this.store)
      const labels = periodLabels(this.store)
      cards.labor.ytd.label = labels.ytd
      cards.labor.month.label = labels.month
      cards.leak.ytd.label = labels.ytd
      cards.leak.month.label = labels.month
      if (this.store.province) {
        cards.labor.summary = cards.labor.summary.replace(/江苏/g, this.store.province)
        cards.leak.summary = cards.leak.summary.replace(/江苏/g, this.store.province)
      }
      return [
        {
          key: 'labor',
          title: cards.labor.title,
          selectedTitle: cards.labor.title,
          unselectedTitle: cards.labor.title,
          headerActionText: 'AI报告',
          summary: cards.labor.summary,
          metrics: [toMetrics(cards.labor.ytd), toMetrics(cards.labor.month)]
        },
        {
          key: 'leak',
          title: cards.leak.title,
          selectedTitle: cards.leak.title,
          unselectedTitle: cards.leak.title,
          headerActionText: 'AI报告',
          summary: cards.leak.summary,
          metrics: [toMetrics(cards.leak.ytd), toMetrics(cards.leak.month)]
        }
      ]
    }
  },
  methods: {
    onDashboardScroll() {
      if (this.store.guideActive) {
        this.$el.scrollTop = 0
        this.filterStuck = false
        return
      }
      this.filterStuck = this.$el.scrollTop > 0
    },
    syncThemeByMode() {
      if (this.mode === 'labor-roi') actions.setTheme('labor')
      if (this.mode === 'leak-screen') actions.setTheme('leak')
    },
    onSelectTheme(index) {
      if (this.store.guideActive) return
      actions.setTheme(index === 1 ? 'leak' : 'labor')
    },
    resolveReportPayload(item, index) {
      const themeFromCard = this.themeItems[index] && this.themeItems[index].key
      return {
        ...item,
        theme: themeFromCard || this.store.theme
      }
    },
    onAiReportView(item, index) {
      actions.openAiReport(this.resolveReportPayload(item, index))
    },
    onAiReportDownload(item, index) {
      downloadAiReportFile(this.resolveReportPayload(item, index))
    }
  }
}
</script>

<style scoped>
.dashboard {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: auto;
  border-radius: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.dashboard::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}
.dashboard__filter {
  position: sticky;
  top: 0;
  z-index: 40;
  flex-shrink: 0;
  margin-bottom: 12px;
  background: #f5f5f5;
}
.dashboard__filter.is-stuck ::v-deep .query-bar {
  box-shadow: 0 2px 12px rgba(35, 37, 43, 0.1);
}
.dashboard__body {
  position: relative;
  z-index: 0;
  flex: 0 0 auto;
}
.standalone-screen {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
}
::v-deep .switch-card-panel.is-guide-spotlight .switch-card.is-large.active {
  background: #ffffff;
  box-shadow: none;
}
::v-deep .switch-card-panel.is-guide-spotlight .switch-card.is-large.active .ai-summary {
  background: #ffffff;
}
::v-deep .switch-card-panel.is-guide-spotlight .switch-card.is-large.active .metric-board {
  background: #f8faff;
}
</style>
