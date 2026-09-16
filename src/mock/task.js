export const taskSummaryCards = [
  { key: 'processing', label: '处理中', value: 4, tone: 'primary' },
  { key: 'done', label: '已处理', value: 3, tone: 'success' },
  { key: 'overdue', label: '已逾期', value: 1, tone: 'danger' },
  { key: 'mine', label: '本人任务', value: 2, tone: 'purple' }
]

export const taskRecoverSummary = {
  label: '挽损金额',
  value: '3,420',
  unit: '万',
  prefix: '¥'
}

export const taskSceneOptions = [
  { label: '全部', value: 'all' },
  { label: '薪酬竞争力', value: 'salary' },
  { label: '人员配置', value: 'staffing' },
  { label: '跑冒滴漏', value: 'leak' },
  { label: '考核分析', value: 'assess' }
]

export const taskOverdueOptions = [
  { label: '全部', value: 'all' },
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' }
]

export const taskSceneToneMap = {
  薪酬竞争力: 'info',
  人员配置: 'success',
  跑冒滴漏: 'error',
  考核分析: 'purple'
}

export const taskStatusToneMap = {
  处理中: 'warning',
  已处理: 'success'
}

export const taskListRows = [
  {
    id: 'T-81001',
    name: '完成江苏省区末端单价调整审批',
    dept: '江苏省区',
    scene: '薪酬竞争力',
    module: '单价测算中心',
    measureType: '审批确认',
    handler: '王伟(wangwei01)',
    createdAt: '2026-03-01',
    dueAt: '2026-03-08',
    overdue: false,
    recover: '¥760万',
    status: '处理中'
  },
  {
    id: 'T-81002',
    name: '优化末端编制与排班匹配方案',
    dept: '广东省区',
    scene: '人员配置',
    module: '编制管理',
    measureType: '执行',
    handler: '李娜(lina02)',
    createdAt: '2026-03-02',
    dueAt: '2026-03-10',
    overdue: false,
    recover: '¥520万',
    status: '已处理'
  },
  {
    id: 'T-81003',
    name: '闭环苏南补贴核验异常清单',
    dept: '江苏省区',
    scene: '跑冒滴漏',
    module: '任务中心执行',
    measureType: '执行',
    handler: '赵敏(zhaomin03)',
    createdAt: '2026-02-26',
    dueAt: '2026-03-05',
    overdue: true,
    recover: '¥380万',
    status: '处理中'
  },
  {
    id: 'T-81004',
    name: '复核华北考核指标达成偏差',
    dept: '华北区域',
    scene: '考核分析',
    module: '考核看板',
    measureType: '通知',
    handler: '陈晨(chenchen04)',
    createdAt: '2026-03-03',
    dueAt: '2026-03-12',
    overdue: false,
    recover: '¥210万',
    status: '已处理'
  },
  {
    id: 'T-81005',
    name: '推进华南单价测算结果确认',
    dept: '广东省区',
    scene: '薪酬竞争力',
    module: '单价测算中心',
    measureType: '审批确认',
    handler: '王伟(wangwei01)',
    createdAt: '2026-03-04',
    dueAt: '2026-03-11',
    overdue: false,
    recover: '¥640万',
    status: '处理中'
  },
  {
    id: 'T-81006',
    name: '排查临时工工时申报异常',
    dept: '浙沪省区',
    scene: '跑冒滴漏',
    module: '任务中心执行',
    measureType: '执行',
    handler: '周杰(zhoujie05)',
    createdAt: '2026-03-01',
    dueAt: '2026-03-09',
    overdue: false,
    recover: '¥290万',
    status: '处理中'
  },
  {
    id: 'T-81007',
    name: '完成仓储编制优化复盘通知',
    dept: '仓储事业部',
    scene: '人员配置',
    module: '编制管理',
    measureType: '通知',
    handler: '李娜(lina02)',
    createdAt: '2026-02-28',
    dueAt: '2026-03-06',
    overdue: false,
    recover: '¥180万',
    status: '已处理'
  },
  {
    id: 'T-81008',
    name: '跟踪考核分析改善项落地进度',
    dept: '鲁东省区',
    scene: '考核分析',
    module: '考核看板',
    measureType: '执行',
    handler: '陈晨(chenchen04)',
    createdAt: '2026-03-05',
    dueAt: '2026-03-15',
    overdue: false,
    recover: '¥440万',
    status: '处理中'
  }
]
