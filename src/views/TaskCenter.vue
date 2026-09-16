<template>
  <div class="task-center">
    <div class="task-summary">
      <div
        v-for="card in summaryCards"
        :key="card.key"
        class="summary-card"
      >
        <metric-block
          variant="l2"
          show-icon
          :title="card.label"
          :value="card.value"
          :show-unit="false"
          tone="default"
        />
      </div>
      <div class="summary-card is-recover">
        <metric-block
          variant="l2"
          show-icon
          :title="recoverSummary.label"
          :value="recoverSummary.prefix + recoverSummary.value"
          :unit="recoverSummary.unit"
          tone="danger"
        />
      </div>
    </div>

    <div class="task-panel">
      <div class="task-filter">
        <label class="filter-item">
          <span class="filter-label">诊断场景</span>
          <el-select
            v-model="filters.scene"
            class="filter-control is-select"
            placeholder="全部"
            clearable
          >
            <el-option
              v-for="item in sceneOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </label>

        <label class="filter-item">
          <span class="filter-label">是否逾期</span>
          <el-select
            v-model="filters.overdue"
            class="filter-control is-select"
            placeholder="全部"
            clearable
          >
            <el-option
              v-for="item in overdueOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </label>

        <label class="filter-item">
          <span class="filter-label">任务处理人</span>
          <el-input
            v-model="filters.handler"
            class="filter-control is-input"
            placeholder="请输入"
            clearable
          />
        </label>

        <label class="filter-item">
          <span class="filter-label">创建时间</span>
          <el-date-picker
            v-model="filters.dateRange"
            class="filter-control is-date"
            type="daterange"
            range-separator="至"
            start-placeholder="年 / 月 / 日"
            end-placeholder="年 / 月 / 日"
            value-format="yyyy-MM-dd"
            clearable
          />
        </label>

        <el-button type="primary" class="filter-query" @click="onQuery">查询</el-button>
      </div>

      <div class="task-table-wrap">
        <el-table
          class="task-table"
          :data="pagedRows"
          border
          style="width: 100%"
        >
          <el-table-column label="任务名称" min-width="220">
            <template slot-scope="{ row }">
              <div class="task-name-cell">
                <span class="task-id">{{ row.id }}</span>
                <span class="task-title">{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="dept" label="归属部门" min-width="100" />
          <el-table-column label="诊断场景" min-width="110">
            <template slot-scope="{ row }">
              <span class="scene-tag" :class="'tone-' + sceneTone(row.scene)">{{ row.scene }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="module" label="关联模块" min-width="120" />
          <el-table-column prop="measureType" label="举措类型" min-width="100" />
          <el-table-column prop="handler" label="任务处理人" min-width="140" />
          <el-table-column prop="createdAt" label="任务创建时间" min-width="120" />
          <el-table-column prop="dueAt" label="预期完成时间" min-width="120" />
          <el-table-column label="是否逾期" width="90" align="center">
            <template slot-scope="{ row }">
              <span class="overdue-tag" :class="{ 'is-yes': row.overdue }">
                {{ row.overdue ? '是' : '否' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="recover" label="预计挽损" min-width="100" />
          <el-table-column label="状态" width="96">
            <template slot-scope="{ row }">
              <status-label
                :text="row.status"
                :tone="statusTone(row.status)"
                variant="solid"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="{ row }">
              <board-text-link
                text="查看详情"
                :show-action="false"
                @click="onViewDetail(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="task-pagination">
        <el-button
          size="small"
          :disabled="page <= 1"
          @click="page -= 1"
        >上一页</el-button>
        <span class="page-indicator">{{ page }}/{{ totalPages }}</span>
        <el-button
          size="small"
          :disabled="page >= totalPages"
          @click="page += 1"
        >下一页</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  taskSummaryCards,
  taskRecoverSummary,
  taskSceneOptions,
  taskOverdueOptions,
  taskSceneToneMap,
  taskStatusToneMap,
  taskListRows
} from '@/mock/task'

const PAGE_SIZE = 5

export default {
  name: 'TaskCenter',
  data() {
    return {
      summaryCards: taskSummaryCards,
      recoverSummary: taskRecoverSummary,
      sceneOptions: taskSceneOptions,
      overdueOptions: taskOverdueOptions,
      allRows: taskListRows,
      filters: {
        scene: 'all',
        overdue: 'all',
        handler: '',
        dateRange: null
      },
      querySnapshot: {
        scene: 'all',
        overdue: 'all',
        handler: '',
        dateRange: null
      },
      page: 1
    }
  },
  computed: {
    filteredRows() {
      const q = this.querySnapshot
      return this.allRows.filter((row) => {
        if (q.scene && q.scene !== 'all') {
          const sceneLabel = (this.sceneOptions.find((item) => item.value === q.scene) || {}).label
          if (sceneLabel && row.scene !== sceneLabel) return false
        }
        if (q.overdue === 'yes' && !row.overdue) return false
        if (q.overdue === 'no' && row.overdue) return false
        if (q.handler && String(row.handler).indexOf(q.handler.trim()) === -1) return false
        if (q.dateRange && q.dateRange.length === 2) {
          const [start, end] = q.dateRange
          if (row.createdAt < start || row.createdAt > end) return false
        }
        return true
      })
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRows.length / PAGE_SIZE))
    },
    pagedRows() {
      const start = (this.page - 1) * PAGE_SIZE
      return this.filteredRows.slice(start, start + PAGE_SIZE)
    }
  },
  methods: {
    sceneTone(scene) {
      return taskSceneToneMap[scene] || 'normal'
    },
    statusTone(status) {
      return taskStatusToneMap[status] || 'normal'
    },
    onQuery() {
      this.querySnapshot = {
        scene: this.filters.scene || 'all',
        overdue: this.filters.overdue || 'all',
        handler: this.filters.handler || '',
        dateRange: this.filters.dateRange ? this.filters.dateRange.slice() : null
      }
      this.page = 1
    },
    onViewDetail(row) {
      this.$message && this.$message.info('查看任务：' + row.id)
    }
  }
}
</script>

<style scoped>
.task-center {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  height: 100%;
  overflow: auto;
}
.task-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(220px, 1.4fr);
  gap: 12px;
}
.summary-card {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
}
.summary-card >>> .metric-block {
  width: 100%;
  padding: 0;
}
.summary-card.is-recover >>> .num {
  color: var(--red-06);
}
.summary-card.is-recover >>> .unit {
  color: var(--red-06);
}
.task-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1 1 auto;
  min-height: 0;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
}
.task-filter {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 20px;
}
.filter-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.filter-label {
  flex-shrink: 0;
  color: var(--grey-02);
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}
.filter-control.is-select {
  width: 160px;
}
.filter-control.is-input {
  width: 160px;
}
.filter-control.is-date {
  width: 280px;
}
.filter-query {
  margin-left: auto;
}
.task-table-wrap {
  min-width: 0;
  overflow: auto;
}
.task-name-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.task-id {
  font-size: 12px;
  line-height: 18px;
  color: var(--grey-03);
}
.task-title {
  font-size: 14px;
  line-height: 22px;
  color: var(--grey-01);
  font-weight: 500;
}
.scene-tag {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
}
.scene-tag.tone-info {
  color: var(--blue-06);
  background: rgba(60, 110, 240, 0.1);
}
.scene-tag.tone-success {
  color: var(--green-06);
  background: rgba(18, 179, 93, 0.1);
}
.scene-tag.tone-error {
  color: var(--red-06);
  background: rgba(252, 55, 55, 0.1);
}
.scene-tag.tone-purple {
  color: var(--purple-06);
  background: rgba(137, 88, 247, 0.1);
}
.overdue-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 22px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  color: var(--grey-03);
  background: var(--grey-07);
  box-sizing: border-box;
}
.overdue-tag.is-yes {
  color: var(--red-06);
  background: rgba(252, 55, 55, 0.1);
}
.task-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}
.page-indicator {
  color: var(--grey-02);
  font-size: 14px;
  line-height: 22px;
}
.task-table >>> .el-table__header th {
  background: var(--grey-07);
  color: var(--grey-03);
  font-weight: 500;
}
@media (max-width: 1280px) {
  .task-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .summary-card.is-recover {
    grid-column: 1 / -1;
  }
  .filter-query {
    margin-left: 0;
  }
}
</style>
