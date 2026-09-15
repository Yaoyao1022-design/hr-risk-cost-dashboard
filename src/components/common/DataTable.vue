<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key">{{ col.title }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in rows" :key="index">
          <td v-for="col in columns" :key="col.key">
            <span :class="toneClass(col, row)">{{ display(col, row, index) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    columns: Array,
    rows: Array
  },
  methods: {
    display(col, row, index) {
      if (col.key === 'index') return index + 1
      return row[col.key]
    },
    toneClass(col, row) {
      const value = String(row[col.key] || '')
      if (col.trend && value.indexOf('+') === 0) return 'down'
      if (col.trend && value.indexOf('-') === 0) return 'up'
      if (col.key === 'status' && (value === '已闭环')) return 'up'
      if (col.key === 'status') return 'warn'
      return ''
    }
  }
}
</script>

<style scoped>
.table-wrap {
  width: 100%;
  overflow: auto;
  border: 1px solid #edf0f5;
  border-radius: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  height: 40px;
  padding: 0 16px;
  text-align: left;
  font-size: 14px;
  white-space: nowrap;
}
th {
  background: #f7f8fa;
  color: var(--grey-02);
  font-weight: 500;
}
td {
  color: var(--grey-01);
  border-top: 1px solid #edf0f5;
}
tbody tr:nth-child(even) {
  background: #fafbfe;
}
.up { color: var(--green-06); }
.down { color: var(--red-06); }
.warn { color: #d69e2e; }
</style>
