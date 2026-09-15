const ORG_SCALE = {
  hq: 1,
  province: 0.86,
  line: 0.92,
  c1: 0.74
}

const PROVINCE_SCALE = {
  江苏: 1.08,
  浙江: 0.96,
  广东: 1.12,
  北京: 0.89,
  上海: 1.05,
  四川: 0.84,
  湖北: 0.93
}

const VALUE_KEYS = new Set([
  'value',
  'rate',
  'yoy',
  'mom',
  'cost',
  'people',
  'impact',
  'count',
  'ytd',
  'month',
  'ytdRate',
  'monthRate',
  'ytdYoy',
  'monthYoy',
  'monthMom',
  'extraLabel'
])

export function hashSeed(parts) {
  const str = parts.map((item) => (item == null || item === '' ? '-' : String(item))).join('|')
  let hash = 2166136261
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash) >>> 0
}

export function demoSeed(store, extra = {}) {
  return hashSeed([
    store.orgLevel,
    store.province,
    store.line,
    store.c1Dept,
    store.timeRange,
    store.metricScope,
    store.chartMetric,
    store.queryNonce || 0,
    extra.mapMetric,
    extra.slice,
    extra.c1Slice,
    extra.budgetPeriod,
    extra.budgetType,
    extra.period,
    // 场景下探仅驱动下方列表，不参与全局种子
    extra.scene
  ])
}

export function scaleOf(store) {
  const org = ORG_SCALE[store.orgLevel] || 1
  const province = PROVINCE_SCALE[store.province] || 1
  const line = store.line ? 0.94 + ((String(store.line).length % 5) * 0.02) : 1
  const c1Dept = store.c1Dept ? 0.9 + ((String(store.c1Dept).length % 4) * 0.025) : 1
  const scope = store.metricScope === 'month' ? 0.82 : 1
  return org * province * line * c1Dept * scope
}

export function dateLabels(store) {
  if (store.period === 'year') {
    return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
  }
  const source = store.timeRange ? new Date(String(store.timeRange).replace(/-/g, '/')) : null
  if (source && !Number.isNaN(source.getTime())) {
    return Array.from({ length: 8 }, (_, index) => {
      const next = new Date(source)
      next.setDate(source.getDate() - 4 + index)
      return `${next.getMonth() + 1}.${next.getDate()}`
    })
  }
  return ['8.29', '8.30', '8.31', '9.1', '9.2', '9.3', '9.4', '9.5']
}

export function periodLabels(store) {
  const source = store.timeRange ? new Date(String(store.timeRange).replace(/-/g, '/')) : null
  if (source && !Number.isNaN(source.getTime())) {
    const year = String(source.getFullYear()).slice(2)
    const month = String(source.getMonth() + 1).padStart(2, '0')
    return {
      ytd: `${year}年${month}月YTD`,
      month: `${year}年${month}月`
    }
  }
  return {
    ytd: '26年08月YTD',
    month: '26年08月'
  }
}

function parseNumeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { prefix: '', num: value, suffix: '', decimals: 0, hasComma: false }
  }
  if (typeof value !== 'string') return null
  const match = value.match(/^([^0-9\-–]*)(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  const raw = match[2]
  return {
    prefix: match[1],
    num: parseFloat(raw.replace(/,/g, '')),
    suffix: match[3],
    decimals: (raw.split('.')[1] || '').length,
    hasComma: raw.includes(',')
  }
}

function formatNumber(num, decimals, hasComma) {
  const abs = Math.abs(num)
  const fixed = decimals > 0 ? abs.toFixed(decimals) : String(Math.round(abs))
  const [intPart, decPart] = fixed.split('.')
  const grouped = hasComma ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : intPart
  const body = decPart != null ? `${grouped}.${decPart}` : grouped
  return (num < 0 ? '-' : '') + body
}

export function shiftAmount(value, seed, index, scale = 1) {
  const parsed = parseNumeric(value)
  if (!parsed || Number.isNaN(parsed.num)) return value
  const wave = ((seed + index * 97) % 21) / 100 - 0.1
  let next = parsed.num * scale * (1 + wave)
  if (/%|pp/.test(parsed.suffix)) {
    next = parsed.num + (((seed + index * 13) % 19) / 10 - 0.9)
  }
  const min = Math.abs(parsed.num) >= 10 ? 1 : 0.1
  if (next >= 0) next = Math.max(min, next)
  else next = Math.min(-min, next)
  return parsed.prefix + formatNumber(next, parsed.decimals, parsed.hasComma) + parsed.suffix
}

export function shiftTree(node, seed, scale = 1, indexRef = { i: 0 }) {
  if (Array.isArray(node)) {
    return node.map((item) => shiftTree(item, seed, scale, indexRef))
  }
  if (!node || typeof node !== 'object') return node
  const out = {}
  Object.keys(node).forEach((key) => {
    const val = node[key]
    if (VALUE_KEYS.has(key) && (typeof val === 'string' || typeof val === 'number')) {
      indexRef.i += 1
      out[key] = shiftAmount(val, seed, indexRef.i, scale)
      return
    }
    if (key === 'trend' && (val === 'up' || val === 'down')) {
      out[key] = (seed + indexRef.i) % 3 === 0 ? (val === 'up' ? 'down' : 'up') : val
      return
    }
    out[key] = shiftTree(val, seed, scale, indexRef)
  })
  return out
}

export function withSeed(data, store, extra) {
  return shiftTree(data, demoSeed(store, extra), scaleOf(store))
}
