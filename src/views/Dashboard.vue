<template>
  <div class="dashboard">
    <div class="dashboard__filter" :class="{ 'is-stuck': filterStuck }">
      <query-bar />
    </div>
    <div class="dashboard__body">
      <!-- 原版：大切换卡（成本诊断） -->
      <switch-card-panel
        v-if="isCockpit && useClassicLayout"
        plain
        :class="{ 'is-guide-spotlight': store.guideActive }"
        :items="themeItems"
        :selected-index="selectedIndex"
        :auto-menu-download="false"
        @select="onSelectTheme"
        @action-view="onAiReportView"
        @action-download="onAiReportDownload"
      >
        <labor-cost-panel variant="v1" v-if="store.guideActive || store.theme === 'labor'" />
        <leakage-panel variant="v1" v-else />
      </switch-card-panel>

      <!-- 新版：LUI bg-card Tab + AI 摘要（成本诊断新） -->
      <div v-else-if="isCockpit" class="dashboard-v2">
        <el-tabs
          class="theme-tabs"
          type="bg-card"
          :value="store.theme"
          @input="onThemeTab"
        >
          <el-tab-pane label="人力成本分析" name="labor" lazy>
            <div class="v2-pane">
              <div class="ai-bar">
                <ai-summary class="ai-bar__summary" :text="activeSummary" highlight-numbers />
                <board-title
                  class="ai-report-action"
                  variant="card"
                  text=""
                  :show-icon="false"
                  show-action
                  action-text="AI报告"
                  :auto-menu-download="false"
                  @action-view="onAiReportMenuView"
                  @action-download="onAiReportMenuDownload"
                />
              </div>
              <labor-cost-panel variant="v2" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="跑冒滴漏" name="leak" lazy>
            <div class="v2-pane">
              <div class="ai-bar">
                <ai-summary class="ai-bar__summary" :text="activeSummary" highlight-numbers />
                <board-title
                  class="ai-report-action"
                  variant="card"
                  text=""
                  :show-icon="false"
                  show-action
                  action-text="AI报告"
                  :auto-menu-download="false"
                  @action-view="onAiReportMenuView"
                  @action-download="onAiReportMenuDownload"
                />
              </div>
              <leakage-panel variant="v2" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div v-else class="standalone-screen">
        <labor-cost-panel v-if="isLaborStandalone" :variant="panelVariant" />
        <leakage-panel v-else :variant="panelVariant" />
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
      actions,
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
      return this.mode === 'cockpit' || this.mode === 'cockpit-v2'
    },
    useClassicLayout() {
      if (this.store.guideActive) return true
      if (this.mode === 'cockpit-v2') return false
      if (this.mode === 'cockpit') return true
      return this.store.layoutVersion === 'v1'
    },
    panelVariant() {
      return this.store.layoutVersion === 'v2' || String(this.mode).indexOf('-v2') !== -1 ? 'v2' : 'v1'
    },
    isLaborStandalone() {
      return this.mode === 'labor-roi' || this.mode === 'labor-roi-v2'
    },
    selectedIndex() {
      if (this.store.guideActive) {
        return this.store.guideCardIndex
      }
      return this.store.theme === 'leak' ? 1 : 0
    },
    liveThemeCards() {
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
      return cards
    },
    activeSummary() {
      const cards = this.liveThemeCards
      return this.store.theme === 'leak' ? cards.leak.summary : cards.labor.summary
    },
    themeItems() {
      const cards = this.liveThemeCards
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
      if (this.mode === 'labor-roi' || this.mode === 'labor-roi-v2') actions.setTheme('labor')
      if (this.mode === 'leak-screen' || this.mode === 'leak-screen-v2') actions.setTheme('leak')
    },
    onSelectTheme(index) {
      if (this.store.guideActive) return
      actions.setTheme(index === 1 ? 'leak' : 'labor')
    },
    onThemeTab(key) {
      actions.setTheme(key === 'leak' ? 'leak' : 'labor')
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
    },
    resolveAiReportItem(item) {
      const cards = this.liveThemeCards
      const themeCard = this.store.theme === 'leak' ? cards.leak : cards.labor
      return {
        ...themeCard,
        ...item,
        theme: this.store.theme,
        title: (item && item.label) || themeCard.title
      }
    },
    onAiReportMenuView(item) {
      actions.openAiReport(this.resolveAiReportItem(item))
    },
    onAiReportMenuDownload(item) {
      downloadAiReportFile(this.resolveAiReportItem(item))
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dashboard__filter.is-stuck ::v-deep .query-bar {
  box-shadow: 0 2px 12px rgba(35, 37, 43, 0.1);
}
.dashboard__body {
  position: relative;
  z-index: 0;
  flex: 0 0 auto;
}
.dashboard-v2 {
  min-width: 0;
}
.theme-tabs >>> .el-tabs__header,
.theme-tabs >>> .el-tabs__header.is-top {
  /* 组件库默认 header 有下边距，bg-card 需贴合内容区 */
  margin: 0 !important;
  /*
   * 页面祖先有 isolation/z-index 时，item::after（z-index:-1/-10）会穿出
   * header 背景透出页面灰底，描边发透、发灰。隔离在 header 内即可。
   * 不要给 item 设 z-index（会改变 hover 半透明 PNG 的合成，出现多余透明度）。
   */
  isolation: isolate;
}
/*
 * 末项选中：设计稿为左右对称翼形白描边（与中间态一致），不要用 closed-ending 收口图。
 * 去掉此前强制的 padding-right:20px / closed-ending，恢复 LUI 默认 is-active padding:0 50px
 * 与 border-width:2px 50px 0 的双侧翼切片；描边图用本地中间态不透明资源。
 */
.theme-tabs.el-tabs--bg-card >>> .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item:last-child.is-active {
  padding: 0 50px;
  border-top-right-radius: 0;
}
.theme-tabs.el-tabs--bg-card >>> .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item:last-child::after {
  left: auto;
  right: 0;
  width: 100%;
  border-image-source: url('../assets/tabs/bg-card-middle-active.png');
}
/*
 * 首项选中 LUI 默认用半透明描边图（a2acfc6c），叠在 header 蓝灰底上会发灰发蓝。
 * 改为不透明白底版，与中间/末项选中态一致。
 */
.theme-tabs.el-tabs--bg-card >>> .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item:first-child.is-active::after {
  border-image-source: url('../assets/tabs/bg-card-first-active.png');
}
/*
 * LUI hover 描边图自带 50% 透明填充；叠在选中态侧翼上还会加粗交界描边。
 * 业务要求 hover 不出现透明层，直接关掉未选中项的 hover ::after。
 */
.theme-tabs.el-tabs--bg-card >>> .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav .el-tabs__item:hover:not(.is-active)::after {
  display: none !important;
}
.theme-tabs >>> .el-tabs__content {
  background: #fff;
  /* 通栏 header 已带顶圆角，内容区只保留底圆角 */
  border-radius: 0 0 12px 12px;
  padding: 12px;
  box-sizing: border-box;
}
.v2-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ai-bar {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.ai-bar__summary {
  flex: 1;
  min-width: 0;
}
.ai-report-action {
  flex-shrink: 0;
  width: auto !important;
  justify-content: flex-end;
}
.ai-report-action >>> .main {
  display: none;
}
.ai-report-action >>> .card-action-wrap {
  z-index: 40;
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
