<template>
  <div class="leak-panel" :class="'is-' + variant">
    <div v-if="variant === 'v1'" class="task-link-row">
      <board-title class="section-title" text="跑冒滴漏巡检概览" :level="1" />
      <board-action kind="more" text="查看跑冒滴漏任务" @click="goTaskCenter" />
    </div>

    <div v-if="variant === 'v1'" class="top-split">
      <div class="inspect-card">
        <board-title text="本月巡检识别风险及处置情况" :level="1" />
        <div class="inspect-kpis">
          <metric-block
            v-for="item in inspectKpis"
            :key="item.title"
            variant="l2"
            :title="item.title"
            :value="item.value"
            :unit="item.unit"
            :tone="item.tone"
          />
        </div>
        <div class="handle-row">
          <div class="handle-box">
            <board-title text="自动拦截" :level="1" bar />
            <metric-group variant="l3" layout="horizontal" nowrap :items="inspectAuto" />
          </div>
          <div class="handle-box">
            <board-title text="人工处理" :level="1" bar />
            <metric-group variant="l3" layout="horizontal" nowrap :items="inspectManual" />
          </div>
        </div>
      </div>
      <div class="chart-card">
        <chart-board variant="bar-multi" plot-size="sm" fill :seed="chartSeed" :labels="chartLabels" />
      </div>
    </div>

    <!-- 新版图4：全宽巡检识别，无右侧图表 -->
    <div v-else class="inspect-card is-v2">
      <board-title text="本月巡检识别风险及处置情况" :level="1" />
      <div class="inspect-kpis">
        <metric-block
          v-for="item in inspectKpis"
          :key="item.title"
          variant="l2"
          :title="item.title"
          :value="item.value"
          :unit="item.unit"
          :tone="item.tone"
        />
      </div>
      <div class="handle-row">
        <div class="handle-box">
          <board-title text="自动拦截" :level="1" bar />
          <metric-group variant="l3" layout="horizontal" nowrap :items="inspectAuto" />
        </div>
        <div class="handle-box">
          <board-title text="人工处理" :level="1" bar />
          <metric-group variant="l3" layout="horizontal" nowrap :items="inspectManual" />
        </div>
      </div>
    </div>

    <div class="drill">
      <capsule-tabs
        :options="drillTabs"
        :value="store.drillTab"
        @input="actions.setDrillTab($event)"
      />

      <div v-if="store.drillTab === 'org'" class="org-block">
        <div class="drill-chart-panel">
          <board-title :text="orgTrendTitle" :level="1" />
          <div class="chart-box">
            <chart-board
              variant="multi-line"
              plot-size="lg"
              fill
              :seed="orgTrendSeed"
              :labels="chartLabels"
            />
          </div>
        </div>
        <rank-card-list
          variant="multi"
          :items="orgRanks"
          :expanded-index="expandedOrg"
          @toggle="toggleOrg"
          @export="onOrgExport"
        />
        <div v-if="hasMoreOrgs" class="org-more">
          <board-action
            kind="expand"
            text="查看更多组织"
            @click="loadMoreOrgs"
          />
        </div>
      </div>

      <template v-else-if="store.drillTab === 'scene'">
        <div class="scene-block">
          <div class="scene-row">
            <switch-card
              v-for="card in sceneCardItems"
              :key="card.id"
              size="small"
              :title="card.title"
              :value="card.count"
              :selected="store.scene === card.id"
              :impact="card.impact"
              @select="actions.setScene(card.id)"
            />
          </div>
          <div class="drill-chart-panel">
            <board-title :text="sceneTrendTitle" :level="1" />
            <div class="chart-box">
              <chart-board
                :key="'scene-trend-' + store.scene"
                variant="multi-line"
                plot-size="lg"
                fill
                :seed="sceneTrendSeed"
                :labels="chartLabels"
              />
            </div>
          </div>
          <rank-card-list
            variant="single"
            :scrollable="false"
            :items="sceneRanks"
            :expanded-index="expandedScene"
            :detail-columns="4"
            :show-detail-export="false"
            @toggle="toggleScene"
            @export="onSceneExport"
            @detail-export="onSceneDetailExport"
          />
        </div>
      </template>

      <div v-else class="person-block">
        <rank-grid-list
          class="person-grid"
          :columns="2"
          :responsive="false"
          clickable
          :items="personCards"
          @select="onPersonSelect"
        />
        <div class="person-more">
          <board-action
            kind="more"
            text="查看全部人员明细（100条）"
            @click="actions.openPersonDetail()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store, actions } from '@/store'
import {
  leakInspect,
  sceneCards,
  drillTabs,
  orgRankItems,
  orgLevels,
  riskPersons,
  buildSceneRankItems,
  sceneTables
} from '@/mock/data'
import { dateLabels, demoSeed, withSeed } from '@/mock/simulate'

function downloadCsv(fileName, header, rows) {
  const lines = [header.join(',')]
  rows.forEach((row) => {
    lines.push(row.map((cell) => `"${String(cell == null ? '' : cell).replace(/"/g, '""')}"`).join(','))
  })
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default {
  name: 'LeakagePanel',
  props: {
    variant: {
      type: String,
      default: 'v1',
      validator(v) {
        return v === 'v1' || v === 'v2'
      }
    }
  },
  data() {
    return {
      store,
      actions,
      drillTabs,
      expandedOrg: [0],
      expandedScene: [0],
      orgPageSize: 5,
      orgVisibleCount: 5
    }
  },
  computed: {
    liveInspect() {
      return withSeed(leakInspect, store)
    },
    inspectKpis() {
      return this.liveInspect.kpis.map((item) => ({
        title: item.name,
        value: item.value,
        unit: item.unit,
        tone: item.danger ? 'danger' : item.name.indexOf('闭环') > -1 ? 'success' : 'default'
      }))
    },
    inspectAuto() {
      return this.liveInspect.auto
    },
    inspectManual() {
      return this.liveInspect.manual
    },
    chartSeed() {
      return demoSeed(store)
    },
    chartLabels() {
      return dateLabels(store)
    },
    orgTrendSeed() {
      return demoSeed(store, { compare: 'leak-org-trend' })
    },
    orgTrendTitle() {
      const level = this.store.orgLevel
      let scope = (orgLevels.find((item) => item.id === level) || {}).label || '物流总部'
      if (level === 'province' && this.store.province) scope = this.store.province + '省区'
      else if (level === 'line' && this.store.line) scope = this.store.line
      else if (level === 'c1' && this.store.c1Dept) scope = this.store.c1Dept
      return scope + '异常人数与影响金额趋势'
    },
    sceneTrendSeed() {
      return demoSeed(store, { scene: this.store.scene, compare: 'leak-scene-trend' })
    },
    sceneTrendTitle() {
      const hit = this.sceneCardItems.find((item) => item.id === this.store.scene)
      const name = (hit && hit.title) || '在岗异常'
      return name + '月度风险趋势'
    },
    orgAllRanks() {
      return withSeed(orgRankItems, store)
    },
    orgRanks() {
      return this.orgAllRanks.slice(0, this.orgVisibleCount).map((item) => ({
        ...item,
        children: (item.children || []).map((child) => ({
          ...child,
          label: '',
          labelTone: undefined
        }))
      }))
    },
    hasMoreOrgs() {
      return this.orgVisibleCount < this.orgAllRanks.length
    },
    sceneCardItems() {
      return withSeed(sceneCards, store)
    },
    personCards() {
      return withSeed(riskPersons, store)
        .slice(0, 10)
        .map((item, index) => ({
          ...item,
          index: index + 1,
          desc: '京东物流-产品研发部-综合提升部-体验设计组-体验设计组-体验设计组'
        }))
    },
    sceneRanks() {
      return withSeed(buildSceneRankItems(this.store.scene), store, {
        scene: this.store.scene
      })
    }
  },
  watch: {
    'store.scene'() {
      this.expandedScene = [0]
    },
    'store.drillTab'(tab) {
      if (tab === 'org') this.resetOrgPaging()
    },
    'store.queryNonce'() {
      this.resetOrgPaging()
    },
    'store.orgLevel'() {
      this.resetOrgPaging()
    }
  },
  methods: {
    goTaskCenter() {
      if (typeof location !== 'undefined') location.hash = '/task-center'
    },
    resetOrgPaging() {
      this.orgVisibleCount = this.orgPageSize
      this.expandedOrg = [0]
    },
    loadMoreOrgs() {
      if (!this.hasMoreOrgs) return
      const prevCount = this.orgVisibleCount
      this.orgVisibleCount = Math.min(
        this.orgVisibleCount + this.orgPageSize,
        this.orgAllRanks.length
      )
      this.$nextTick(() => {
        const wraps = this.$el.querySelectorAll('.org-block .rank-card-wrap')
        const target = wraps[prevCount]
        if (target && typeof target.scrollIntoView === 'function') {
          target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    },
    toggleOrg(index) {
      const next = this.expandedOrg.slice()
      const pos = next.indexOf(index)
      if (pos >= 0) next.splice(pos, 1)
      else next.push(index)
      this.expandedOrg = next
    },
    toggleScene(index) {
      const next = this.expandedScene.slice()
      const pos = next.indexOf(index)
      if (pos >= 0) next.splice(pos, 1)
      else next.push(index)
      this.expandedScene = next
    },
    onOrgExport(item) {
      actions.openOrgFullDetail(item)
    },
    onSceneExport(item) {
      const rows = withSeed(sceneTables[this.store.scene] || sceneTables.onjob, store, {
        scene: this.store.scene
      })
      downloadCsv(
        `${(item && item.title) || '场景'}-明细.csv`,
        ['异常编号', '组织', '岗位', '涉及人数', '预计影响', '状态'],
        rows.map((row) => [row.no, row.org, row.post, row.people, row.impact, row.status])
      )
    },
    onSceneDetailExport(payload) {
      const child = (payload && payload.child) || {}
      const parent = (payload && payload.item) || {}
      const source = withSeed(sceneTables[this.store.scene] || sceneTables.onjob, store, {
        scene: this.store.scene
      })
      const post = child.title || ''
      const rows = source.filter((row) => !post || row.post === post)
      const exportRows = rows.length
        ? rows
        : source.map((row, index) => ({
            ...row,
            post: post || row.post,
            no: `${row.no}-${(child.index || index) + 1}`
          }))
      downloadCsv(
        `${parent.title || '场景'}-${post || '子项'}-明细.csv`,
        ['异常编号', '组织', '岗位', '涉及人数', '预计影响', '状态'],
        exportRows.map((row) => [row.no, row.org, row.post, row.people, row.impact, row.status])
      )
    },
    onPersonSelect(item) {
      actions.openPersonException(item)
    }
  }
}
</script>

<style scoped>
.leak-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.task-link-row {
  display: flex;
  justify-content: space-between;
  height: 32px;
  align-items: center;
}
.task-link-row >>> .section-title .text {
  font-size: 16px;
  line-height: 24px;
}
.top-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.inspect-card,
.chart-card {
  border-radius: 8px;
  min-height: 210px;
}
.inspect-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fd;
  box-sizing: border-box;
}
.chart-card {
  background: #fff;
}
.inspect-card.is-v2 {
  background: #f8faff;
  border: 0;
  padding: 12px 24px;
}
.inspect-kpis {
  display: flex;
  gap: 8px;
  min-width: 0;
}
.inspect-kpis >>> .metric-block {
  flex: 1 1 0;
  min-width: 0;
}
.handle-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
/* 相对卡片边缘左右 12px（卡片左右 padding 24px，本行回拉 12px） */
.inspect-card.is-v2 .handle-row {
  margin: 0 -12px;
}
.handle-box {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.inspect-card.is-v2 .handle-box {
  background: #fff;
}
.chart-card {
  padding: 12px;
  min-height: 210px;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
}
.drill {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.drill-chart-panel {
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
}
.drill-chart-panel >>> .board-title.lv-1 .text {
  font-family: 'PingFang SC', 'PingFang SC Regular', 'Microsoft YaHei', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 22px;
  color: var(--grey-02, #525765);
}
.drill-chart-panel .chart-box {
  flex: 0 0 auto;
  height: 300px;
  min-height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 0 0;
  box-sizing: border-box;
}
.drill-chart-panel .chart-box >>> .chart-board {
  flex: 1 1 auto;
  align-self: stretch;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.scene-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.scene-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  align-items: stretch;
  width: 100%;
}
.scene-row >>> .switch-card {
  width: 100%;
  min-width: 0;
}
.person-grid {
  width: 100%;
}
.person-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.person-more {
  display: flex;
  justify-content: center;
}
.org-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.org-more {
  display: flex;
  justify-content: center;
}
@media (max-width: 1280px) {
  .top-split {
    grid-template-columns: 1fr;
  }
}
</style>
