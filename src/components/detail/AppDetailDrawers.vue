<template>
  <div class="app-detail-drawers">
    <data-detail-drawer
      inline
      :visible="store.metricDetailOpen"
      title="全量指标明细"
      width="800px"
      @close="actions.closeMetricDetail()"
    >
      <template #content>
        <board-table
          expandable
          name-title="指标名称"
          :columns="metricColumns"
          :rows="metricRows"
        />
      </template>
    </data-detail-drawer>

    <labor-cost-breakdown-drawer />

    <data-detail-drawer
      inline
      :visible="store.personExceptionOpen"
      title="异常明细"
      width="1000px"
      @close="actions.closePersonException()"
    >
      <template #content>
        <board-table
          class="person-detail-table"
          flat
          name-title="员工姓名"
          :columns="leakPersonExceptionColumns"
          :rows="personExceptionRows"
        />
      </template>
    </data-detail-drawer>

    <data-detail-drawer
      inline
      :visible="store.orgFullDetailOpen"
      :breadcrumb-items="orgFullBreadcrumbItems"
      :breadcrumb-index="orgFullBreadcrumbIndex"
      show-footer
      confirm-text="导出全量明细"
      width="1000px"
      @breadcrumb-select="onOrgFullBreadcrumbSelect"
      @confirm="exportOrgFullDetail"
      @close="closeOrgFullDetail"
    >
      <template #content>
        <div class="org-full-detail">
          <div v-if="orgFullDrillIndex === 0" class="org-full-summary">
            <metric-block
              v-for="card in orgFullSummaryCards"
              :key="card.title"
              class="org-full-summary__card"
              variant="l1-v"
              :title="card.title"
              :value="card.value"
              :unit="card.unit"
              :tone="card.tone || 'primary'"
            />
          </div>

          <div class="org-full-section">
            <board-table
              class="org-full-table"
              flat
              :show-action="!orgFullIsPersonLevel"
              :action-show-icon="false"
              action-text="下探"
              action-title="操作"
              :name-title="orgFullNameTitle"
              :columns="orgFullTableColumns"
              :rows="orgFullTableRows"
              @action="onOrgFullTableAction"
            />
          </div>
        </div>
      </template>
    </data-detail-drawer>

    <data-detail-drawer
      inline
      :visible="store.aiReportOpen"
      :title="aiReportDetail.title"
      width="720px"
      confirm-text="下载报告"
      @confirm="downloadAiReport"
      @close="actions.closeAiReport()"
    >
      <template #content>
        <div class="ai-report-detail">
          <div class="ai-report-detail__placeholder" aria-hidden="true" />
        </div>
      </template>
    </data-detail-drawer>

    <data-detail-drawer
      inline
      :visible="store.personDetailOpen"
      title="全部人员明细"
      width="1000px"
      @close="actions.closePersonDetail()"
    >
      <template #content>
        <board-table
          class="person-detail-table"
          flat
          name-title="排序"
          :columns="personDetailColumns"
          :rows="personTableRows"
        />
      </template>
    </data-detail-drawer>
  </div>
</template>

<script>
import { store, actions } from '@/store'
import {
  laborMetricDetailColumns,
  laborMetricDetailRows,
  leakPersonDetailColumns,
  leakPersonDetailRows,
  leakPersonExceptionColumns,
  leakPersonExceptionRows,
  buildOrgFullDetail,
  buildAiReportDetail,
  downloadAiReportFile
} from '@/mock/data'
import { periodLabels, withSeed } from '@/mock/simulate'
import LaborCostBreakdownDrawer from '@/components/detail/LaborCostBreakdownDrawer.vue'

export default {
  name: 'AppDetailDrawers',
  components: { LaborCostBreakdownDrawer },
  data() {
    return {
      store,
      actions,
      leakPersonExceptionColumns,
      orgFullDrillIndex: 0,
      orgFullPath: []
    }
  },
  computed: {
    metricColumns() {
      const labels = periodLabels(store)
      return laborMetricDetailColumns.map((col) => {
        if (col.key === 'ytd') return { ...col, title: labels.ytd }
        if (col.key === 'month') return { ...col, title: labels.month + '当月' }
        return col
      })
    },
    metricRows() {
      return withSeed(laborMetricDetailRows, store)
    },
    personExceptionRows() {
      return leakPersonExceptionRows(store.selectedPerson)
    },
    orgFullDetail() {
      return buildOrgFullDetail(store.selectedOrgItem)
    },
    orgFullLevels() {
      return this.orgFullDetail.levels || []
    },
    orgFullCurrentLevel() {
      return this.orgFullLevels[this.orgFullDrillIndex] || this.orgFullLevels[0] || {}
    },
    orgFullIsPersonLevel() {
      return this.orgFullCurrentLevel.key === 'person'
    },
    orgFullNameTitle() {
      return this.orgFullCurrentLevel.nameTitle || '名称'
    },
    orgFullTableColumns() {
      return this.orgFullCurrentLevel.columns || []
    },
    orgFullTableRows() {
      const rows = this.orgFullCurrentLevel.rows || []
      const parent = this.orgFullPath[this.orgFullDrillIndex - 1]
      return rows.map((row, index) => {
        const next = {
          ...row,
          name: String(index + 1),
          showAction: !this.orgFullIsPersonLevel
        }
        if (parent && this.orgFullIsPersonLevel) {
          next.org = `${this.orgFullDetail.dept}-${parent.name}`
        }
        return next
      })
    },
    orgFullSummaryCards() {
      const detail = this.orgFullDetail
      return [
        { title: '异常明细数', value: detail.exceptionCount, unit: detail.exceptionUnit || '条', tone: 'primary' },
        { title: '预计挽损金额', value: '¥' + detail.recoverAmount, unit: detail.recoverUnit || '万', tone: 'danger' }
      ]
    },
    orgFullBreadcrumbItems() {
      const root = { label: this.orgFullDetail.dept }
      const path = this.orgFullPath.slice(0, this.orgFullDrillIndex).map((item) => ({
        label: item.name
      }))
      return [root, ...path]
    },
    orgFullBreadcrumbIndex() {
      return this.orgFullBreadcrumbItems.length - 1
    },
    personDetailColumns() {
      return [{ key: 'personName', title: '员工姓名' }].concat(leakPersonDetailColumns)
    },
    personTableRows() {
      return withSeed(leakPersonDetailRows, store).map((row, index) => ({
        ...row,
        personName: row.name,
        name: String(index + 1)
      }))
    },
    aiReportDetail() {
      return buildAiReportDetail(store.selectedAiReport || {})
    }
  },
  watch: {
    'store.orgFullDetailOpen'(open) {
      if (open) {
        this.orgFullDrillIndex = 0
        this.orgFullPath = []
      }
    }
  },
  methods: {
    onOrgFullTableAction(row) {
      if (this.orgFullIsPersonLevel) return
      const nextIndex = this.orgFullDrillIndex + 1
      if (nextIndex >= this.orgFullLevels.length) return
      this.orgFullPath = this.orgFullPath.slice(0, this.orgFullDrillIndex).concat([
        { name: row.orgName || row.personName || row.name, key: row.orgName || row.name }
      ])
      this.orgFullDrillIndex = nextIndex
    },
    onOrgFullBreadcrumbSelect(index) {
      const next = Math.max(0, Math.min(index, this.orgFullLevels.length - 1))
      this.orgFullDrillIndex = next
      this.orgFullPath = this.orgFullPath.slice(0, next)
    },
    closeOrgFullDetail() {
      this.orgFullDrillIndex = 0
      this.orgFullPath = []
      this.actions.closeOrgFullDetail()
    },
    exportOrgFullDetail() {
      const rows = this.orgFullTableRows
      const header = this.orgFullIsPersonLevel
        ? ['排序', '员工姓名', 'ERP', '员工岗位', '员工职级', '所在机构', '员工HRBP', '异常指标（二级）']
        : ['排序', this.orgFullCurrentLevel.columns[0] && this.orgFullCurrentLevel.columns[0].title || '组织', '异常明细数', '拦截人数', '挽损金额', '占比']
      const lines = [header.join(',')]
      rows.forEach((row) => {
        const cells = this.orgFullIsPersonLevel
          ? [row.name, row.personName, row.erp, row.role, row.level, row.org, row.hrbp, row.metric]
          : [row.name, row.orgName, row.exceptionCount, row.interceptPeople, row.recoverAmount, row.ratio]
        lines.push(cells.map((cell) => `"${String(cell == null ? '' : cell).replace(/"/g, '""')}"`).join(','))
      })
      const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      const levelLabel = this.orgFullCurrentLevel.label || '明细'
      link.download = `${this.orgFullDetail.dept}-${levelLabel}-全量明细.csv`
      link.rel = 'noopener'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },
    downloadAiReport() {
      downloadAiReportFile(store.selectedAiReport || {})
    }
  }
}
</script>

<style scoped>
.app-detail-drawers {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  --board-drawer-offset-top: 0px;
  --board-drawer-offset-right: 0px;
  --board-drawer-offset-bottom: 0px;
  --board-drawer-offset-left: 0px;
}
.app-detail-drawers >>> .data-detail-drawer {
  pointer-events: auto;
}
.person-detail-table,
.org-full-table {
  --board-name-col: 72px;
  --board-name-col-flat: 72px;
  width: 100%;
  min-width: 0;
  max-width: 100%;
}
.person-detail-table >>> .cell,
.person-detail-table >>> .row.head .cell {
  text-align: left;
}
.person-detail-table >>> .name,
.person-detail-table >>> .name-text {
  justify-content: flex-start;
  text-align: left;
}
.person-detail-table >>> .cell .trend-value {
  justify-content: flex-start;
}
.org-full-table >>> .action {
  width: max-content;
  min-width: max-content;
}
.org-full-detail {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}
.org-full-summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.org-full-summary__card {
  padding: 12px 16px;
  border-radius: 8px;
  background: #eef3ff;
  box-sizing: border-box;
  min-width: 0;
}
.org-full-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.ai-report-detail {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  min-height: 100%;
  height: 100%;
}
.ai-report-detail__placeholder {
  flex: 1 0 auto;
  width: 100%;
  min-height: 100%;
  border-radius: 8px;
  background: #f5f6fa;
}
</style>
