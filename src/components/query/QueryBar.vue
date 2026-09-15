<template>
  <div class="query-bar">
    <div class="seg">
      <button
        v-for="item in orgLevels"
        :key="item.id"
        type="button"
        class="seg-item"
        :class="{ active: store.orgLevel === item.id }"
        @click="setOrgLevel(item.id)"
      >{{ item.label }}</button>
    </div>
    <div class="fields">
      <label v-if="showLine" class="field">
        <span>条线</span>
        <el-select
          v-model="store.line"
          class="field-select"
          placeholder="请选择"
          clearable
          popper-class="query-bar-select-dropdown"
        >
          <el-option
            v-for="item in businessLines"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </label>
      <label v-if="showProvince" class="field">
        <span>省区</span>
        <el-select
          v-model="store.province"
          class="field-select"
          placeholder="请选择"
          clearable
          popper-class="query-bar-select-dropdown"
        >
          <el-option
            v-for="item in provinces"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </label>
      <label v-if="showC1Dept" class="field">
        <span>一级部门</span>
        <el-select
          v-model="store.c1Dept"
          class="field-select"
          placeholder="请选择"
          clearable
          popper-class="query-bar-select-dropdown"
        >
          <el-option
            v-for="item in c1Departments"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </label>
      <label class="field">
        <span>月</span>
        <el-date-picker
          v-model="store.timeRange"
          class="field-select"
          type="month"
          placeholder="请选择"
          format="yyyy年MM月"
          value-format="yyyy-MM-01"
          clearable
          popper-class="query-bar-date-dropdown"
        />
      </label>
    </div>
    <div class="actions">
      <button class="btn ghost" type="button" @click="reset">重置</button>
      <button class="btn primary" type="button" @click="query">查询</button>
    </div>
  </div>
</template>

<script>
import { store } from '@/store'
import { orgLevels, provinces, businessLines, c1Departments } from '@/mock/data'

export default {
  name: 'QueryBar',
  data() {
    return {
      store,
      orgLevels,
      provinces,
      businessLines,
      c1Departments
    }
  },
  computed: {
    showProvince() {
      return this.store.orgLevel === 'province' || this.store.orgLevel === 'line'
    },
    showLine() {
      return this.store.orgLevel === 'line'
    },
    showC1Dept() {
      return this.store.orgLevel === 'c1'
    }
  },
  methods: {
    clearScopedFilters() {
      store.province = ''
      store.line = ''
      store.c1Dept = ''
    },
    setOrgLevel(level) {
      if (store.orgLevel === level) return
      store.orgLevel = level
      this.clearScopedFilters()
    },
    reset() {
      store.orgLevel = 'hq'
      this.clearScopedFilters()
      store.timeRange = ''
      store.queryNonce = 0
    },
    query() {
      store.queryNonce += 1
      this.$emit('query')
    }
  }
}
</script>

<style scoped>
.query-bar {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.seg {
  display: flex;
  background: var(--grey-07);
  border-radius: 8px;
  padding: 4px;
  flex-shrink: 0;
}
.seg-item {
  min-width: 80px;
  height: 24px;
  padding: 0 12px;
  border-radius: 6px;
  color: var(--grey-02);
}
.seg-item.active {
  background: #fff;
  color: var(--blue-06);
  font-weight: 500;
}
.fields {
  flex: 1;
  display: flex;
  gap: 16px;
  min-width: 0;
}
.field {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.field > span {
  color: var(--grey-02);
  flex-shrink: 0;
}
.field-select {
  width: 180px;
}
.field-select >>> .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.field-select.el-date-editor {
  width: 180px;
}
.actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}
.btn {
  min-width: 72px;
  height: 32px;
  border-radius: 8px;
  padding: 0 16px;
}
.btn.ghost {
  background: var(--grey-06);
  color: var(--grey-01);
}
.btn.primary {
  background: var(--blue-06);
  color: #fff;
}
</style>
