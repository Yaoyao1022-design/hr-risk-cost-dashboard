import Vue from 'vue'

const params = typeof location !== 'undefined' ? new URLSearchParams(location.search) : null

export const store = Vue.observable({
  theme: params && params.get('theme') === 'leak' ? 'leak' : 'labor',
  scene: (params && params.get('scene')) || 'onjob',
  drillTab: 'org',
  orgLevel: 'hq',
  province: '',
  line: '',
  c1Dept: '',
  timeRange: '',
  period: 'month',
  metricScope: 'ytd',
  chartMetric: 'rate',
  queryNonce: 0,
  sidebarCollapsed: false,
  metricDetailOpen: false,
  laborCostOpen: false,
  personDetailOpen: false,
  personExceptionOpen: false,
  orgFullDetailOpen: false,
  aiReportOpen: false,
  guideActive: false,
  guideCardIndex: 0,
  selectedPerson: null,
  selectedOrgItem: null,
  selectedAiReport: null
})

export const actions = {
  setTheme(theme) {
    store.theme = theme
    store.metricDetailOpen = false
    store.laborCostOpen = false
    store.personDetailOpen = false
    store.personExceptionOpen = false
    store.orgFullDetailOpen = false
    store.aiReportOpen = false
    store.selectedPerson = null
    store.selectedOrgItem = null
    store.selectedAiReport = null
  },
  setScene(scene) {
    store.scene = scene
  },
  setDrillTab(tab) {
    store.drillTab = tab
  },
  openMetricDetail() {
    store.laborCostOpen = false
    store.personDetailOpen = false
    store.personExceptionOpen = false
    store.orgFullDetailOpen = false
    store.aiReportOpen = false
    store.metricDetailOpen = true
  },
  closeMetricDetail() {
    store.metricDetailOpen = false
  },
  openLaborCost() {
    store.metricDetailOpen = false
    store.personDetailOpen = false
    store.personExceptionOpen = false
    store.orgFullDetailOpen = false
    store.aiReportOpen = false
    store.laborCostOpen = true
  },
  closeLaborCost() {
    store.laborCostOpen = false
  },
  openPersonDetail() {
    store.laborCostOpen = false
    store.personExceptionOpen = false
    store.orgFullDetailOpen = false
    store.aiReportOpen = false
    store.selectedPerson = null
    store.selectedAiReport = null
    store.personDetailOpen = true
  },
  closePersonDetail() {
    store.personDetailOpen = false
  },
  openPersonException(person) {
    store.laborCostOpen = false
    store.personDetailOpen = false
    store.orgFullDetailOpen = false
    store.aiReportOpen = false
    store.selectedAiReport = null
    store.selectedPerson = person || null
    store.personExceptionOpen = true
  },
  closePersonException() {
    store.personExceptionOpen = false
    store.selectedPerson = null
  },
  openOrgFullDetail(orgItem) {
    store.laborCostOpen = false
    store.personDetailOpen = false
    store.personExceptionOpen = false
    store.aiReportOpen = false
    store.selectedAiReport = null
    store.selectedOrgItem = orgItem || null
    store.orgFullDetailOpen = true
  },
  closeOrgFullDetail() {
    store.orgFullDetailOpen = false
    store.selectedOrgItem = null
  },
  openAiReport(report) {
    store.laborCostOpen = false
    store.personDetailOpen = false
    store.personExceptionOpen = false
    store.orgFullDetailOpen = false
    store.selectedPerson = null
    store.selectedOrgItem = null
    store.selectedAiReport = report || null
    store.aiReportOpen = true
  },
  closeAiReport() {
    store.aiReportOpen = false
    store.selectedAiReport = null
  },
  setGuideActive(active) {
    store.guideActive = !!active
    if (store.guideActive) {
      store.guideCardIndex = 0
    }
  },
  setGuideCardIndex(index) {
    if (!store.guideActive) return
    store.guideCardIndex = index === 1 ? 1 : 0
  }
}
