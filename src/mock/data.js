export const orgLevels = [
  { id: 'hq', label: '物流总部' },
  { id: 'province', label: '省区' },
  { id: 'line', label: '条线' },
  { id: 'c1', label: 'C1' }
]

export const provinces = ['江苏', '浙江', '广东', '北京', '上海', '四川', '湖北']

export const businessLines = ['末端', '转运', '仓储', '城配', '冷链', '国际', '供应链']

export const c1Departments = ['运营', '科技', '财务', '人力资源', '综合', '省区职能']

export function buildAiReportDetail(item = {}) {
  const title = item.label || item.title || 'AI报告'
  const theme = item.theme || 'labor'
  const themeLabel = theme === 'leak' ? '跑冒滴漏' : '人力成本'
  return {
    title,
    fileName: item.fileName || `${title}.txt`,
    summary: `基于当前筛选条件生成的「${title}」报告摘要，覆盖${themeLabel}核心指标、异常归因与行动建议。`,
    sections: [
      {
        title: '核心结论',
        paragraphs: [
          `${title}显示本周期综合表现整体可控，但仍有局部指标偏离目标，需要按组织与条线分层跟进。`,
          '报告已自动汇总同比、环比及目标差信号，建议优先处理高影响、可快速闭环的事项。'
        ]
      },
      {
        title: '风险与机会',
        paragraphs: [
          '高风险点集中在费率波动较大、预算偏离度偏高的组织单元，建议结合巡检闭环与预算纠偏同步推进。',
          '机会点在于已识别的改善项具备可复制性，可沉淀为标准动作并向同类组织推广。'
        ]
      },
      {
        title: '行动建议',
        paragraphs: [
          '1. 对异常 Top 组织开展专项复盘，明确责任人与完成时间。',
          '2. 将本报告关键指标纳入周会跟踪，形成周闭环。',
          '3. 对可自动拦截事项提升规则覆盖，减少人工重复处理成本。'
        ]
      }
    ]
  }
}

export function downloadAiReportFile(item = {}) {
  const detail = buildAiReportDetail(item)
  const lines = [detail.title, '', detail.summary, '']
  detail.sections.forEach((section) => {
    lines.push(section.title)
    section.paragraphs.forEach((paragraph) => lines.push(paragraph))
    lines.push('')
  })
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = detail.fileName || `${detail.title}.txt`
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const timeOptions = [
  { value: '2026-08', label: '2026年08月' },
  { value: '2026-07', label: '2026年07月' },
  { value: '2026-YTD', label: '2026年YTD' }
]

export const headerMenus = [
  { id: 'home', label: '首页' },
  { id: 'labor', label: '用工管理' },
  { id: 'attend', label: '考勤管理' },
  { id: 'pay', label: '薪酬管理' },
  { id: 'cost', label: '成本诊断', active: true },
  { id: 'task', label: '任务中心', dropdown: true },
  { id: 'org', label: '组织与基础数据', dropdown: true }
]

export const themeCards = {
  labor: {
    id: 'labor',
    title: '人力成本分析',
    summary:
      '本月综合人工成本费率 6.42%（环比 +6.32% / 同比 -5.85%），较目标偏离+0.57pp，江苏末端（+0.92pp）为最大偏差来源；YTD 综合费率6.15%（同比 -0.2%），成本趋势连续数月上行，需重点关注。',
    ytd: {
      label: '26年08月YTD',
      value: '63.8%',
      indicators: [
        { name: '同比', value: '6.33%', trend: 'up' },
        { name: '目标差', value: '0.57pp', trend: 'down' }
      ]
    },
    month: {
      label: '26年08月',
      value: '63.8%',
      indicators: [
        { name: '同比', value: '6.33%', trend: 'up' },
        { name: '环比', value: '6.33%', trend: 'down' }
      ]
    }
  },
  leak: {
    id: 'leak',
    title: '跑冒滴漏分析',
    summary:
      '本月累计触发异常 128 条（其中线上监控异常识别到 100 条，系统拦截异常 28 条），预计挽损金额 ¥3,420万，整体处理闭环率 82.1%。当前高优异常中，江苏单价审批与苏南补贴核验为本周必须闭环事项。',
    ytd: {
      label: '26年08月YTD',
      value: '1,425',
      unit: '条',
      indicators: [
        { name: '挽损', value: '6.33%', trend: 'up' },
        { name: '闭环率', value: '6.33%', trend: 'down' }
      ]
    },
    month: {
      label: '26年08月',
      value: '128',
      unit: '条',
      indicators: [
        { name: '挽损', value: '6.33%', trend: 'up' },
        { name: '闭环率', value: '6.33%', trend: 'down' }
      ]
    }
  }
}

export const laborMatrix = [
  {
    items: [
      {
        name: '26年08月YTD',
        value: '63.8%',
        primary: true,
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' }
        ]
      },
      {
        name: '固定费率',
        value: '63.8%',
        indicators: [{ name: '同比', value: '6.33%', trend: 'up' }]
      },
      {
        name: '变动费率',
        value: '63.8%',
        indicators: [{ name: '同比', value: '6.33%', trend: 'up' }]
      }
    ]
  },
  {
    items: [
      {
        name: '综合人工成本',
        value: '12,123',
        unit: '亿元',
        primary: true,
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '固定人工成本',
        value: '1,119',
        unit: '元',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '变动人工成本',
        value: '12,222',
        unit: '元',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      }
    ]
  },
  {
    items: [
      {
        name: '收入',
        value: '56.8',
        unit: '亿元',
        primary: true,
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '单位收入',
        value: '30,000',
        unit: '元',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '人数',
        value: '12,300',
        unit: '人',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      }
    ]
  },
  {
    items: [
      {
        name: '人数',
        value: '223,344',
        unit: '人',
        primary: true,
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '人均综合人工成本',
        value: '30,000',
        unit: '元',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      },
      {
        name: '人均收入',
        value: '54,600',
        unit: '元',
        indicators: [
          { name: '同比', value: '6.33%', trend: 'up' },
          { name: '环比', value: '6.33%', trend: 'down' }
        ]
      }
    ]
  }
]

export const chartDates = ['8.29', '8.30', '8.31', '9.1', '9.2', '9.3', '9.4', '9.5']

export const laborDeptRows = [
  { dept: '运营-到仓交仓', line: '末端', rate: '5.12%', yoy: '-40.3%', mom: '-12.1%', cost: '1,280', people: '12,430' },
  { dept: '运营-大件分拣装卸', line: '转运', rate: '7.86%', yoy: '+22.5%', mom: '+8.4%', cost: '2,041', people: '8,920' },
  { dept: '运营-江苏末端', line: '末端', rate: '6.99%', yoy: '+9.2%', mom: '+3.1%', cost: '1,662', people: '9,340' },
  { dept: '运营-苏南补贴', line: '省区', rate: '6.21%', yoy: '-1.8%', mom: '+0.6%', cost: '980', people: '4,110' }
]

export const laborDetailSliceOptions = [
  { label: '省区', value: 'province' },
  { label: '二级部门', value: 'dept' }
]

export const laborMapMetricOptions = [
  { label: 'L1-L2省区', value: 'l1l2' },
  { label: 'L3-L4省区', value: 'l3l4' },
  { label: 'L5省区', value: 'l5' }
]

export const laborMapStats = [
  { label: '全国均值', value: '1629' },
  { label: '全国历史', value: '2284' },
  { label: '全国中位数', value: '784' },
  { label: '全国峰值', value: '2285' }
]

export const laborCityRankRows = [
  { rank: 1, name: '上海', rate: '6.42%', yoy: '+0.57%' },
  { rank: 2, name: '江苏', rate: '6.31%', yoy: '+0.42%' },
  { rank: 3, name: '浙江', rate: '6.18%', yoy: '-0.21%' },
  { rank: 4, name: '广东', rate: '5.96%', yoy: '+0.18%' },
  { rank: 5, name: '北京', rate: '5.88%', yoy: '-0.36%' },
  { rank: 6, name: '四川', rate: '5.72%', yoy: '+0.09%' }
]

export const laborDeptRateRows = [
  { rank: 1, name: '运营', tag: 'TOP1', rate: '6.86%', yoy: '+1.20%' },
  { rank: 2, name: '省区职能', tag: 'TOP2', rate: '6.42%', yoy: '+0.57%' },
  { rank: 3, name: '科技', tag: 'TOP3', rate: '5.91%', yoy: '-0.18%' },
  { rank: 4, name: '财务', rate: '5.66%', yoy: '-0.32%' },
  { rank: 5, name: '人力资源', rate: '5.41%', yoy: '+0.11%' },
  { rank: 6, name: '综合', rate: '5.28%', yoy: '-0.08%' }
]

export const laborDeptEfficiencyRows = [
  { rank: 1, name: '运营', tag: 'TOP1', rate: '112', yoy: '+6.2%' },
  { rank: 2, name: '科技', tag: 'TOP2', rate: '108', yoy: '+3.1%' },
  { rank: 3, name: '省区职能', tag: 'TOP3', rate: '96', yoy: '-1.4%' },
  { rank: 4, name: '财务', rate: '91', yoy: '-0.6%' },
  { rank: 5, name: '人力资源', rate: '88', yoy: '+0.8%' },
  { rank: 6, name: '综合', rate: '84', yoy: '-2.1%' }
]

const lineChild = {
  ytdRate: '48.2%',
  ytdYoy: '-1.1%',
  monthRate: '47.6%',
  monthYoy: '-2.4%',
  monthMom: '+12.6%'
}

export const laborLineTableRows = [
  {
    name: '[运营]运配',
    ytdRate: '52.9%',
    ytdYoy: '-0.3%',
    monthRate: '51.3%',
    monthYoy: '-1.4%',
    monthMom: '+230.8%',
    children: [
      { name: '到仓交仓', ...lineChild },
      { name: '大件分拣装卸', ytdRate: '61.2%', ytdYoy: '+2.8%', monthRate: '59.4%', monthYoy: '+1.1%', monthMom: '+18.3%' }
    ]
  },
  {
    name: '[运营]接货仓',
    ytdRate: '44.1%',
    ytdYoy: '-30.6%',
    monthRate: '42.8%',
    monthYoy: '-18.2%',
    monthMom: '-6.4%',
    children: [{ name: 'B2C仓', ytdRate: '49.6%', ytdYoy: '+8.4%', monthRate: '51.2%', monthYoy: '+78.3%', monthMom: '+9.1%' }]
  },
  {
    name: '省区职能',
    ytdRate: '38.6%',
    ytdYoy: '+608.7%',
    monthRate: '40.2%',
    monthYoy: '+12.5%',
    monthMom: '+4.8%'
  },
  {
    name: '[科技]系统运维',
    ytdRate: '29.4%',
    ytdYoy: '-2.1%',
    monthRate: '28.8%',
    monthYoy: '-0.9%',
    monthMom: '+1.2%'
  },
  {
    name: '[财务]结算',
    ytdRate: '33.7%',
    ytdYoy: '+1.6%',
    monthRate: '34.1%',
    monthYoy: '+0.4%',
    monthMom: '-0.7%'
  },
  {
    name: '[人力]共享服务',
    ytdRate: '27.8%',
    ytdYoy: '-0.8%',
    monthRate: '27.2%',
    monthYoy: '-1.1%',
    monthMom: '+0.3%'
  }
]

export const laborRateColumns = [
  { key: 'ytdRate', title: 'YTD费率' },
  { key: 'ytdYoy', title: 'YTD费用同比', trend: true },
  { key: 'monthRate', title: '当月费率' },
  { key: 'monthYoy', title: '当月费率同比', trend: true },
  { key: 'monthMom', title: '当月费率环比', trend: true }
]

export const laborMetricDetailColumns = [
  { key: 'ytd', title: '26年07月YTD' },
  { key: 'ytdYoy', title: 'YTD同比' },
  { key: 'month', title: '26年07月当月' },
  { key: 'monthYoy', title: '当月同比', tone: true },
  { key: 'monthMom', title: '当月环比', tone: true }
]

const laborMetricDetailYoyMom = {
  ytdYoy: '-0.3%',
  monthYoy: '-1.4%',
  monthMom: '230.8%'
}

export const laborMetricDetailRows = [
  {
    key: 'rate',
    name: '综合人工成本费率',
    ytd: '52.9%',
    month: '51.3%',
    ...laborMetricDetailYoyMom,
    children: [
      { name: '固定人工成本费率', ytd: '52.9%', month: '51.3%', ...laborMetricDetailYoyMom },
      { name: '变动人工成本费率', ytd: '52.9%', month: '51.3%', ...laborMetricDetailYoyMom }
    ]
  },
  {
    key: 'cost',
    name: '综合人工成本',
    ytd: '52.9%',
    month: '61.9亿元',
    ...laborMetricDetailYoyMom,
    children: [
      { name: '固定人工成本', ytd: '52.9%', month: '27.4亿元', ...laborMetricDetailYoyMom },
      { name: '变动人工成本', ytd: '52.9%', month: '34.5亿元', ...laborMetricDetailYoyMom }
    ]
  },
  {
    key: 'income',
    name: '收入',
    ytd: '52.9%',
    month: '120.7亿元',
    ...laborMetricDetailYoyMom
  },
  {
    key: 'unitIncome',
    name: '单位收入',
    ytd: '52.9%',
    month: '11.9元',
    ...laborMetricDetailYoyMom
  },
  {
    key: 'efficiency',
    name: '人效',
    ytd: '52.9%',
    month: '70.2单/人/天',
    ...laborMetricDetailYoyMom
  }
]

export const laborDetailSummaries = {
  hq: '当月费率环比：改善最多的是[运营]到仓交仓（-40.3%），恶化最多的是[运营]大件分拣装卸（+22.5%）。',
  province: 'YTD费率同比：改善最多的是[运营]接货仓-30.6%，恶化最多的是省区职能+608.7%；当月费率同比：改善最多的是[运营]大件分拣装卸-98.3%，恶化最多的是[运营]B2C仓+78.3%。',
  line: '条线费率同比：改善最多的是接货仓（-30.6%），恶化最多的是省区职能（+608.7%）。',
  c1: 'YTD费率同比：改善最多的是[运营]接货仓-30.6%，恶化最多的是省区职能+608.7%；当月费率同比：改善最多的是[运营]大件分拣装卸-98.3%，恶化最多的是[运营]B2C仓+78.3%。'
}

export const laborBudgetCards = [
  {
    title: '成本监控',
    groups: [
      {
        title: '26年09月YTD',
        items: [
          { title: '成本预算', value: '10.9', unit: '百万', help: true, helpText: '当期核定的成本预算金额' },
          { title: '实际已用', value: '10.3', unit: '百万' },
          { title: '预算使用率', value: '56.2%', trends: [{ name: '同比', value: '6.2%', trend: 'up' }] },
          { title: '预实偏离度', value: '-3.2%', trends: [{ name: '同比', value: '1.1%', trend: 'down' }] }
        ]
      },
      {
        title: '26年09月',
        items: [
          { title: '成本预算', value: '0.4', unit: '百万', help: true, helpText: '当期核定的成本预算金额' },
          { title: '实际已用', value: '0.6', unit: '百万' },
          { title: '预算使用率', value: '6.6%', trends: [{ name: '同比', value: '1.2%', trend: 'up' }] },
          { title: '预实偏离度', value: '-5.2%', trends: [{ name: '同比', value: '0.8%', trend: 'down' }] }
        ]
      },
      {
        title: '26年09月MTD',
        items: [
          { title: '成本预算', value: '0.3', unit: '百万', help: true, helpText: '当期核定的成本预算金额' },
          { title: '实际已用', value: '0.9', unit: '百万' },
          { title: '预算使用率', value: '6.2%', trends: [{ name: '同比', value: '0.9%', trend: 'up' }] },
          { title: '预实偏离度', value: '-6.2%', trends: [{ name: '同比', value: '1.4%', trend: 'down' }] }
        ]
      }
    ]
  },
  {
    title: '编制预算',
    groups: [
      {
        title: '26年09月',
        items: [
          { title: '编制预算', value: '19', unit: '人', help: true, helpText: '当期核定的编制预算人数' },
          { title: '当日在职正式工', value: '30', unit: '人' },
          { title: '预算使用率', value: '56.2%', trends: [{ name: '同比', value: '3.2%', trend: 'up' }] },
          { title: '预实偏离度', value: '-3.2%', trends: [{ name: '同比', value: '0.6%', trend: 'down' }] }
        ]
      }
    ]
  }
]

export const leakInspect = {
  kpis: [
    { name: '识别异常', value: '34,222', unit: '条' },
    { name: '异常人数', value: '128', unit: '人' },
    { name: '命中异常', value: '128', unit: '条' },
    { name: '处置闭环率', value: '74.2%', unit: '' },
    { name: '挽损金额', value: '9,888', unit: '万元', danger: true }
  ],
  auto: [
    { title: '异常任务数', value: '86', unit: '条' },
    { title: '异常人数', value: '620', unit: '人' }
  ],
  manual: [
    { title: '异常任务数', value: '42', unit: '条' },
    { title: '异常人数', value: '30', unit: '人' }
  ]
}

export const sceneCards = [
  { id: 'onjob', title: '在岗异常', count: 26, impact: '412' },
  { id: 'efficiency', title: '效率异常', count: 34, impact: '432' },
  { id: 'input', title: '投入异常', count: 15, impact: '52' },
  { id: 'leave', title: '离职风险', count: 29, impact: '123' },
  { id: 'bonus', title: '奖金套取风险', count: 10, impact: '230' }
]

const sceneRankMetrics = [
  { label: '异常任务数', value: '86,666', unit: '人' },
  { label: '异常任务数', value: '90,000', unit: '人' },
  { label: '异常任务数', value: '-50.98%', tone: 'success' },
  { label: '异常任务数', value: '128,990', unit: '万' },
  { label: '异常任务数', value: '-50.98%', tone: 'success' }
]

const sceneChildMetric = [{ title: '异常任务数', value: '1,234', unit: '万元', tone: 'danger' }]

function sceneChildren(posts) {
  return posts.map((title, index) => ({
    index: index + 1,
    title,
    extraLabel: '64条异常',
    extraTone: 'error',
    extraShowIcon: true,
    metrics: sceneChildMetric
  }))
}

const SCENE_RANK_TITLES = [
  // 首条超长标题：超出容器宽度省略，hover 展示全文
  '临时工工时异常巡检核验高风险场景专项排查',
  '人脸识别异常',
  '同一台设备多 ERP 打卡'
]

const SCENE_RANK_POSTS = {
  // 首条超长标题：超出容器省略，hover 展示全文
  onjob: ['大件干线专职司机岗位工时异常专项核验', '服务（安装工程师）', '仓内操作', '配送员'],
  efficiency: ['分拣', '装卸', '调度', '质控'],
  input: ['外包', '临时工', '编制外', '加班投入'],
  leave: ['骨干司机', '班组长', '客服', '质控'],
  bonus: ['分拣', '销售支持', '司机', '仓内']
}

export function buildSceneRankItems(scene) {
  const posts = SCENE_RANK_POSTS[scene] || SCENE_RANK_POSTS.onjob
  return SCENE_RANK_TITLES.map((title, index) => ({
    rank: index + 1,
    title,
    metrics: sceneRankMetrics,
    // 人脸识别 / 同设备打卡：演示「仅一组数据」横排样式
    children: sceneChildren(index === 0 ? posts : posts.slice(0, 1))
  }))
}

export const sceneTables = {
  onjob: [
    { no: 'YG-260801', org: '江苏末端', post: '配送员', people: 8, impact: '￥126万', status: '处理中' },
    { no: 'YG-260802', org: '苏南网点', post: '仓内操作', people: 6, impact: '￥98万', status: '待闭环' },
    { no: 'YG-260803', org: '浙江转运', post: '分拣', people: 7, impact: '￥112万', status: '已闭环' },
    { no: 'YG-260804', org: '广东C1', post: '司机', people: 5, impact: '￥76万', status: '处理中' },
    { no: 'YG-260805', org: '上海仓', post: '仓内操作', people: 9, impact: '￥134万', status: '待闭环' },
    { no: 'YG-260806', org: '北京转运', post: '分拣', people: 4, impact: '￥61万', status: '已闭环' },
    { no: 'YG-260807', org: '四川末端', post: '配送员', people: 6, impact: '￥88万', status: '处理中' },
    { no: 'YG-260808', org: '湖北省区', post: '调度', people: 5, impact: '￥72万', status: '跟进中' },
    { no: 'YG-260809', org: '浙江网点', post: '司机', people: 7, impact: '￥103万', status: '待闭环' },
    { no: 'YG-260810', org: '广东转运', post: '装卸', people: 8, impact: '￥119万', status: '处理中' }
  ],
  efficiency: [
    { no: 'XL-260821', org: '上海转运', post: '分拣', people: 11, impact: '￥148万', status: '处理中' },
    { no: 'XL-260822', org: '江苏到仓', post: '装卸', people: 9, impact: '￥121万', status: '待闭环' },
    { no: 'XL-260823', org: '湖北省区', post: '调度', people: 8, impact: '￥96万', status: '已闭环' },
    { no: 'XL-260824', org: '四川末端', post: '配送员', people: 6, impact: '￥67万', status: '处理中' },
    { no: 'XL-260825', org: '广东C1', post: '司机', people: 10, impact: '￥132万', status: '跟进中' },
    { no: 'XL-260826', org: '浙江转运', post: '分拣', people: 7, impact: '￥89万', status: '待闭环' },
    { no: 'XL-260827', org: '北京仓', post: '仓内操作', people: 5, impact: '￥58万', status: '已闭环' },
    { no: 'XL-260828', org: '苏南网点', post: '配送员', people: 8, impact: '￥101万', status: '处理中' },
    { no: 'XL-260829', org: '上海仓', post: '装卸', people: 6, impact: '￥74万', status: '待闭环' },
    { no: 'XL-260830', org: '广东省区', post: '调度', people: 9, impact: '￥118万', status: '处理中' }
  ],
  input: [
    { no: 'TR-260811', org: '北京转运', post: '编制外', people: 4, impact: '￥18万', status: '待闭环' },
    { no: 'TR-260812', org: '广东省区', post: '外包', people: 5, impact: '￥16万', status: '处理中' },
    { no: 'TR-260813', org: '浙江C1', post: '临时工', people: 3, impact: '￥9万', status: '已闭环' },
    { no: 'TR-260814', org: '江苏补贴', post: '加班投入', people: 3, impact: '￥9万', status: '处理中' },
    { no: 'TR-260815', org: '上海仓', post: '外包', people: 6, impact: '￥21万', status: '跟进中' },
    { no: 'TR-260816', org: '湖北转运', post: '编制外', people: 4, impact: '￥14万', status: '待闭环' },
    { no: 'TR-260817', org: '四川末端', post: '临时工', people: 5, impact: '￥12万', status: '处理中' },
    { no: 'TR-260818', org: '苏南网点', post: '加班投入', people: 2, impact: '￥8万', status: '已闭环' },
    { no: 'TR-260819', org: '广东C1', post: '外包', people: 7, impact: '￥23万', status: '处理中' },
    { no: 'TR-260820', org: '浙江网点', post: '编制外', people: 3, impact: '￥11万', status: '待闭环' }
  ],
  leave: [
    { no: 'LZ-260831', org: '苏南末端', post: '骨干司机', people: 9, impact: '￥42万', status: '跟进中' },
    { no: 'LZ-260832', org: '上海仓', post: '班组长', people: 7, impact: '￥31万', status: '待闭环' },
    { no: 'LZ-260833', org: '广东转运', post: '质控', people: 8, impact: '￥28万', status: '已闭环' },
    { no: 'LZ-260834', org: '浙江网点', post: '客服', people: 5, impact: '￥22万', status: '跟进中' },
    { no: 'LZ-260835', org: '江苏末端', post: '配送员', people: 6, impact: '￥26万', status: '处理中' },
    { no: 'LZ-260836', org: '北京仓', post: '仓内操作', people: 4, impact: '￥18万', status: '待闭环' },
    { no: 'LZ-260837', org: '湖北省区', post: '调度', people: 7, impact: '￥29万', status: '跟进中' },
    { no: 'LZ-260838', org: '四川转运', post: '分拣', people: 5, impact: '￥20万', status: '已闭环' },
    { no: 'LZ-260839', org: '广东C1', post: '司机', people: 8, impact: '￥35万', status: '处理中' },
    { no: 'LZ-260840', org: '浙江仓', post: '班组长', people: 3, impact: '￥16万', status: '待闭环' }
  ],
  bonus: [
    { no: 'JJ-260841', org: '江苏计件', post: '分拣', people: 3, impact: '￥86万', status: '核查中' },
    { no: 'JJ-260842', org: '广东提成', post: '销售支持', people: 2, impact: '￥54万', status: '待闭环' },
    { no: 'JJ-260843', org: '浙江补贴', post: '司机', people: 3, impact: '￥48万', status: '已闭环' },
    { no: 'JJ-260844', org: '湖北绩效', post: '仓内', people: 2, impact: '￥42万', status: '核查中' },
    { no: 'JJ-260845', org: '上海计件', post: '装卸', people: 4, impact: '￥61万', status: '处理中' },
    { no: 'JJ-260846', org: '北京提成', post: '销售支持', people: 2, impact: '￥37万', status: '待闭环' },
    { no: 'JJ-260847', org: '四川补贴', post: '司机', people: 3, impact: '￥45万', status: '核查中' },
    { no: 'JJ-260848', org: '苏南绩效', post: '分拣', people: 5, impact: '￥72万', status: '处理中' },
    { no: 'JJ-260849', org: '广东计件', post: '仓内', people: 2, impact: '￥33万', status: '已闭环' },
    { no: 'JJ-260850', org: '浙江提成', post: '配送员', people: 4, impact: '￥58万', status: '待闭环' }
  ]
}

export const drillTabs = [
  { value: 'org', label: '组织下探' },
  { value: 'scene', label: '场景下探' },
  { value: 'person', label: '高风险人员' }
]

const orgChildMetrics = [
  { title: '异常任务数', value: '1,234', unit: '条' },
  { title: '异常人数', value: '86', unit: '人' },
  { title: '挽损金额', value: '86', unit: '万' }
]

export const orgRankItems = [
  {
    rank: 1,
    title: '江苏大件分拣装卸运营中心',
    value: '18',
    unit: '条',
    splits: [
      { title: '临时工工时异常', label: '在岗异常', impact: '432', value: '12,345', unit: '条' },
      { title: '单价审批异常', label: '投入异常', impact: '216', value: '8,210', unit: '条' },
      { title: '补贴核验异常', label: '效率异常', impact: '98', value: '3,421', unit: '条' }
    ],
    children: [
      { index: 1, title: '大件运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 2, title: '中小件运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 3, title: '冷链运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 4, title: '城配运营组', label: '投入异常', metrics: orgChildMetrics },
      { index: 5, title: '转运运营组', label: '在岗异常', metrics: orgChildMetrics }
    ]
  },
  {
    rank: 2,
    title: '浙江',
    value: '15',
    unit: '条',
    splits: [
      { title: '加班投入异常', label: '投入异常', impact: '188', value: '7,650', unit: '条' },
      { title: '工时申报异常', label: '在岗异常', impact: '142', value: '5,210', unit: '条' },
      { title: '计件波动异常', label: '效率异常', impact: '76', value: '2,980', unit: '条' }
    ],
    children: [
      { index: 1, title: '转运运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 2, title: '末端运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 3, title: '仓储运营组', label: '投入异常', metrics: orgChildMetrics },
      { index: 4, title: '城配运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 5, title: '快运运营组', label: '效率异常', metrics: orgChildMetrics }
    ]
  },
  {
    rank: 3,
    title: '广东',
    value: '14',
    unit: '条',
    splits: [
      { title: '补贴核验异常', label: '效率异常', impact: '166', value: '6,880', unit: '条' },
      { title: '临时工工时异常', label: '在岗异常', impact: '129', value: '4,760', unit: '条' },
      { title: '单价审批异常', label: '投入异常', impact: '84', value: '3,150', unit: '条' }
    ],
    children: [
      { index: 1, title: '华南运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 2, title: '城配运营组', label: '投入异常', metrics: orgChildMetrics },
      { index: 3, title: '末端运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 4, title: '冷链运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 5, title: '转运运营组', label: '投入异常', metrics: orgChildMetrics }
    ]
  },
  {
    rank: 4,
    title: '北京',
    value: '12',
    unit: '条',
    splits: [
      { title: '工时申报异常', label: '在岗异常', impact: '154', value: '5,430', unit: '条' },
      { title: '加班投入异常', label: '投入异常', impact: '101', value: '3,920', unit: '条' },
      { title: '计件波动异常', label: '效率异常', impact: '67', value: '2,210', unit: '条' }
    ],
    children: [
      { index: 1, title: '华北运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 2, title: '职能支持组', label: '投入异常', metrics: orgChildMetrics },
      { index: 3, title: '城配运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 4, title: '仓储运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 5, title: '末端运营组', label: '投入异常', metrics: orgChildMetrics }
    ]
  },
  {
    rank: 5,
    title: '上海',
    value: '11',
    unit: '条',
    splits: [
      { title: '单价审批异常', label: '投入异常', impact: '138', value: '4,980', unit: '条' },
      { title: '临时工工时异常', label: '在岗异常', impact: '92', value: '3,360', unit: '条' },
      { title: '补贴核验异常', label: '效率异常', impact: '58', value: '1,870', unit: '条' }
    ],
    children: [
      { index: 1, title: '华东运营组', label: '投入异常', metrics: orgChildMetrics },
      { index: 2, title: '末端运营组', label: '在岗异常', metrics: orgChildMetrics },
      { index: 3, title: '城配运营组', label: '效率异常', metrics: orgChildMetrics },
      { index: 4, title: '转运运营组', label: '投入异常', metrics: orgChildMetrics },
      { index: 5, title: '仓储运营组', label: '在岗异常', metrics: orgChildMetrics }
    ]
  }
]

const riskPersonOrg = '京东物流-产品研发部-综合提升部-体验设计组-体验设计组-体验设计组'

export const riskPersons = [
  {
    index: 1,
    title: '张**',
    label: '在岗异常',
    extraLabel: '10条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '42', unit: '万', tone: 'danger' }]
  },
  {
    index: 2,
    title: '李**',
    label: '效率异常',
    extraLabel: '8条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '28', unit: '万', tone: 'danger' }]
  },
  {
    index: 3,
    title: '王**',
    label: '投入异常',
    extraLabel: '6条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '19', unit: '万', tone: 'danger' }]
  },
  {
    index: 4,
    title: '赵**',
    label: '在岗异常',
    extraLabel: '12条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '36', unit: '万', tone: 'danger' }]
  },
  {
    index: 5,
    title: '陈**',
    label: '效率异常',
    extraLabel: '9条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '24', unit: '万', tone: 'danger' }]
  },
  {
    index: 6,
    title: '刘**',
    label: '投入异常',
    extraLabel: '5条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '17', unit: '万', tone: 'danger' }]
  },
  {
    index: 7,
    title: '周**',
    label: '离职风险',
    extraLabel: '11条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '31', unit: '万', tone: 'danger' }]
  },
  {
    index: 8,
    title: '吴**',
    label: '奖金套取风险',
    extraLabel: '7条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '22', unit: '万', tone: 'danger' }]
  },
  {
    index: 9,
    title: '孙**',
    label: '在岗异常',
    extraLabel: '4条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '15', unit: '万', tone: 'danger' }]
  },
  {
    index: 10,
    title: '郑**',
    label: '效率异常',
    extraLabel: '6条异常',
    desc: riskPersonOrg,
    metrics: [{ title: '预计影响', value: '13', unit: '万', tone: 'danger' }]
  }
]

export const leakPersonExceptionColumns = [
  { key: 'erp', title: 'ERP' },
  { key: 'role', title: '员工岗位' },
  { key: 'level', title: '员工职级' },
  { key: 'org', title: '所在机构' },
  { key: 'hrbp', title: '员工HRBP' },
  { key: 'metric', title: '异常指标（二级）' }
]

export const leakPersonDetailColumns = leakPersonExceptionColumns.map((col) => (
  col.key === 'metric' ? { ...col, title: '异常指标' } : col
))

const PERSON_ERP_BY_SURNAME = {
  张: 'zhangsan1',
  李: 'lisi2',
  王: 'wangwu3',
  赵: 'zhaoliu4',
  陈: 'chenqi5',
  刘: 'liuba6',
  周: 'zhoujiu7',
  吴: 'wushi8',
  孙: 'sunyi9',
  郑: 'zhengshi10'
}

const PERSON_EXCEPTION_METRICS = [
  '低收入',
  '持续低效',
  '工时异常',
  '补贴核验异常',
  '在岗时长不足',
  '排班冲突',
  '考勤异常',
  '绩效偏低',
  '加班费异常',
  '津贴重复领取',
  '岗位匹配异常',
  '编制占用异常'
]

function parseExceptionCount(person) {
  const label = (person && person.extraLabel) || ''
  const matched = label.match(/(\d+)\s*条/)
  if (matched) return Math.max(1, Number(matched[1]))
  if (person && person.exceptionCount != null) return Math.max(1, Number(person.exceptionCount))
  return 2
}

export function leakPersonExceptionRows(person) {
  const name = (person && person.title) || '张**'
  const surname = name.charAt(0)
  const erp = PERSON_ERP_BY_SURNAME[surname] || 'zhangsan1'
  const org = (person && person.desc) || riskPersonOrg
  const count = parseExceptionCount(person)
  return Array.from({ length: count }, (_, index) => ({
    name,
    erp,
    role: '快递员岗',
    level: 'O3',
    org,
    hrbp: '李**',
    metric: PERSON_EXCEPTION_METRICS[index % PERSON_EXCEPTION_METRICS.length]
  }))
}

export const leakPersonDrillLevels = [
  { label: '全量指标明细', org: '京东物流' },
  { label: '产品研发部', org: '京东物流-产品研发部' },
  { label: '综合提升部', org: '京东物流-产品研发部-综合提升部' },
  { label: '体验设计组', org: '京东物流-产品研发部-综合提升部-体验设计组' }
]

const leakPersonDetailSurnames = ['张', '李', '王', '赵', '陈', '刘', '周', '吴', '孙']

export const leakPersonDetailRows = Array.from({ length: 100 }, (_, index) => ({
  name: leakPersonDetailSurnames[index % leakPersonDetailSurnames.length] + '**',
  erp: 'zhelishierp123',
  role: '快递员岗',
  level: 'O3',
  org: leakPersonDrillLevels[0].org,
  hrbp: '李**',
  metric: '低收入'
}))

/** 组织下探「查看全量明细」：四级下钻，末级为人员明细 */
export const orgFullDetailColumns = [
  { key: 'orgName', title: '二级组织' },
  { key: 'exceptionCount', title: '异常明细数', tone: true },
  { key: 'interceptPeople', title: '拦截人数' },
  { key: 'recoverAmount', title: '挽损金额', tone: true },
  { key: 'ratio', title: '占比' }
]

export const orgFullPersonColumns = [
  { key: 'personName', title: '员工姓名' },
  { key: 'erp', title: 'ERP' },
  { key: 'role', title: '员工岗位' },
  { key: 'level', title: '员工职级' },
  { key: 'org', title: '所在机构' },
  { key: 'hrbp', title: '员工HRBP' },
  { key: 'metric', title: '异常指标（二级）', tone: true }
]

const ORG_FULL_L2_NAMES = [
  '大件运营组',
  '中小件运营组',
  '冷链运营组',
  '城配运营组',
  '转运运营组',
  '仓储运营组',
  '末端运营组',
  '国际运营组',
  '生鲜运营组',
  '医药运营组',
  '汽配运营组',
  '家电运营组',
  '服饰运营组',
  '快运运营组',
  '快递运营组',
  '供应链运营组',
  '跨境运营组',
  '逆向运营组',
  '增值运营组',
  '综合运营组'
]

const ORG_FULL_L3_NAMES = [
  '一班组',
  '二班组',
  '三班组',
  '四班组',
  '五班组',
  '六班组',
  '夜班组',
  '早班组',
  '机动班组',
  '临时支援组',
  '高峰支援组',
  '质控班组',
  '装卸班组',
  '分拣班组',
  '调度班组',
  '客服班组',
  '巡检班组',
  '应急班组',
  '培训班组',
  '后备班组'
]

const ORG_FULL_L4_NAMES = [
  '线路A',
  '线路B',
  '线路C',
  '线路D',
  '线路E',
  '线路F',
  '网点1',
  '网点2',
  '网点3',
  '网点4',
  '网点5',
  '网点6',
  '站点甲',
  '站点乙',
  '站点丙',
  '站点丁',
  '仓区1',
  '仓区2',
  '仓区3',
  '仓区4'
]

function scaleMetric(base, factor, unit) {
  const num = parseFloat(String(base).replace(/[^\d.]/g, '')) || 0
  const next = Math.max(1, Math.round(num * factor * 10) / 10)
  if (unit === '万') return `¥${next}万`
  if (unit === '人') return `${Math.round(next)}人`
  if (unit === '条') return `${Math.round(next)}条`
  if (unit === '%') return `${next}%`
  return String(next)
}

function buildOrgMetricRows(names) {
  return names.map((name, index) => {
    const factor = 1 - index * 0.035
    return {
      name: String(index + 1),
      orgName: name,
      exceptionCount: scaleMetric('8条', Math.max(0.25, factor), '条'),
      interceptPeople: scaleMetric('16人', Math.max(0.25, factor), '人'),
      recoverAmount: scaleMetric('4.4万', Math.max(0.25, factor), '万'),
      ratio: `${Math.max(2, Math.round((44.4 - index * 1.8) * 10) / 10)}%`
    }
  })
}

function orgColumns(orgTitle) {
  return orgFullDetailColumns.map((col) => (
    col.key === 'orgName' ? { ...col, title: orgTitle } : col
  ))
}

export function buildOrgFullDetail(orgItem) {
  const children = (orgItem && orgItem.children) || []
  const l2Rows = buildOrgMetricRows(ORG_FULL_L2_NAMES).map((row, index) => ({
    ...row,
    orgName: (children[index] && children[index].title) || row.orgName
  }))

  const exceptionTotal = l2Rows.reduce((sum, row) => {
    return sum + (parseInt(String(row.exceptionCount).replace(/\D/g, ''), 10) || 0)
  }, 0)
  const recoverTotal = l2Rows.reduce((sum, row) => {
    return sum + (parseFloat(String(row.recoverAmount).replace(/[^\d.]/g, '')) || 0)
  }, 0)

  return {
    dept: '运营部',
    region: (orgItem && orgItem.title) || '江苏',
    exceptionCount: `${exceptionTotal || 18}`,
    exceptionUnit: '条',
    recoverAmount: `${(recoverTotal || 21.9).toFixed(1)}`,
    recoverUnit: '万',
    levels: [
      {
        key: 'l2',
        label: '二级组织',
        nameTitle: '排序',
        columns: orgColumns('二级组织'),
        rows: l2Rows
      },
      {
        key: 'l3',
        label: '三级组织',
        nameTitle: '排序',
        columns: orgColumns('三级组织'),
        rows: buildOrgMetricRows(ORG_FULL_L3_NAMES)
      },
      {
        key: 'l4',
        label: '四级组织',
        nameTitle: '排序',
        columns: orgColumns('四级组织'),
        rows: buildOrgMetricRows(ORG_FULL_L4_NAMES)
      },
      {
        key: 'person',
        label: '人员明细',
        nameTitle: '排序',
        columns: orgFullPersonColumns,
        rows: Array.from({ length: 20 }, (_, index) => ({
          name: String(index + 1),
          personName: leakPersonDetailSurnames[index % leakPersonDetailSurnames.length] + '**',
          erp: `erp${1000 + index}`,
          role: '快递员岗',
          level: 'O3',
          org: '京东物流-运营部',
          hrbp: '李**',
          metric: index % 2 === 0 ? '低收入' : '持续低效'
        }))
      }
    ]
  }
}

