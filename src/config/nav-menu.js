function leaf(key, label) {
  return { key, label }
}

export const navMenuData = [
  {
    key: 'labor-mgmt',
    label: '用工管理',
    children: [
      {
        key: 'plan',
        label: '用工计划管理',
        icon: 'Date',
        children: [leaf('plan-home', '用工计划概览')]
      },
      {
        key: 'demand',
        label: '用工需求工单管理',
        icon: 'Form',
        children: [leaf('demand-home', '需求工单概览')]
      },
      {
        key: 'supplier',
        label: '供应商运营管理平台（国内+国际）',
        icon: 'Configure',
        children: [leaf('supplier-home', '供应商运营概览')]
      },
      {
        key: 'ai-recruit',
        label: '智能自招工作台',
        icon: 'Ai',
        children: [leaf('ai-recruit-home', '智能自招概览')]
      },
      {
        key: 'logistics-recruit',
        label: '物流一线招聘管理',
        icon: 'AddUser',
        children: [leaf('logistics-recruit-home', '招聘管理概览')]
      },
      {
        key: 'recruit-fee',
        label: '综合招聘费管理',
        icon: 'Red2',
        children: [leaf('recruit-fee-home', '招聘费概览')]
      }
    ]
  },
  {
    key: 'attend',
    label: '考勤管理',
    children: [
      {
        key: 'attend-logistics',
        label: '物流考勤核算',
        icon: 'Amount',
        children: [leaf('attend-logistics-home', '考勤核算概览')]
      },
      {
        key: 'attend-domestic',
        label: '考勤管理（国内）',
        icon: 'Schedule',
        children: [leaf('attend-domestic-home', '国内考勤概览')]
      },
      {
        key: 'attend-intl',
        label: '考勤管理（国际）',
        icon: 'Earth',
        children: [leaf('attend-intl-home', '国际考勤概览')]
      }
    ]
  },
  {
    key: 'pay',
    label: '薪酬管理',
    children: [
      {
        key: 'perf',
        label: '物流一线绩效',
        icon: 'Red',
        children: [leaf('perf-home', '绩效概览')]
      },
      {
        key: 'welfare',
        label: '物流一线福利',
        icon: 'Giftbox',
        children: [leaf('welfare-home', '福利概览')]
      },
      {
        key: 'cost-t1',
        label: '人力成本T+1',
        icon: 'Group',
        children: [leaf('cost-t1-home', '成本T+1概览')]
      },
      {
        key: 'pay-roi',
        label: '薪酬ROI诊断',
        icon: 'Cardbag',
        children: [leaf('pay-roi-home', '薪酬ROI概览')]
      }
    ]
  },
  {
    key: 'cost',
    label: '成本诊断',
    children: [
      {
        key: 'cockpit',
        label: '人力经营驾驶舱',
        icon: 'Data4',
        path: '/cockpit',
        screen: 'cockpit'
      },
      {
        key: 'board',
        label: '数据看板',
        icon: 'Data2',
        children: [
          {
            key: 'labor-roi',
            label: '人力成本ROI大屏',
            path: '/labor-roi',
            screen: 'labor-roi'
          },
          {
            key: 'leak-screen',
            label: '跑冒滴漏大屏',
            path: '/leak-screen',
            screen: 'leak-screen'
          }
        ]
      }
    ]
  },
  {
    key: 'task',
    label: '任务中心',
    children: [
      {
        key: 'task-mgmt',
        label: '成本诊断任务管理',
        icon: 'Feedback',
        path: '/task-center',
        screen: 'task-center'
      }
    ]
  },
  {
    key: 'org-culture',
    label: '组织与文化',
    children: [
      {
        key: 'org',
        label: '组织主数据',
        icon: 'Distribute',
        children: [leaf('org-home', '组织主数据概览')]
      },
      {
        key: 'innovation',
        label: '创新评优',
        icon: 'LightbulbAward',
        children: [leaf('innovation-home', '创新评优概览')]
      }
    ]
  }
]

export function findFirstLeaf(menu) {
  if (!menu) return null
  if ((!menu.children || !menu.children.length) && menu.key) return menu
  if (menu.children && menu.children.length) {
    for (let i = 0; i < menu.children.length; i++) {
      const leafItem = findFirstLeaf(menu.children[i])
      if (leafItem) return leafItem
    }
  }
  return null
}

export function findMenuByKey(menus, key) {
  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    if (menu.key === key) return menu
    if (menu.children && menu.children.length) {
      const found = findMenuByKey(menu.children, key)
      if (found) return found
    }
  }
  return null
}
