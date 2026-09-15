export const navMenuData = [
  { key: 'home', label: '首页' },
  {
    key: 'labor-mgmt',
    label: '用工管理',
    children: [{ key: 'labor-mgmt-home', label: '用工概览' }]
  },
  {
    key: 'attend',
    label: '考勤管理',
    children: [{ key: 'attend-home', label: '考勤概览' }]
  },
  {
    key: 'pay',
    label: '薪酬管理',
    children: [{ key: 'pay-home', label: '薪酬概览' }]
  },
  {
    key: 'cost',
    label: '成本诊断',
    children: [
      {
        key: 'cockpit',
        label: '人力经营驾驶舱',
        path: '/cockpit'
      },
      {
        key: 'board',
        label: '数据看板',
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
      },
      {
        key: 'cost-other-1',
        label: '二级菜单',
        children: [
          { key: 'cost-other-1-1', label: '三级菜单' },
          { key: 'cost-other-1-2', label: '三级菜单' },
          { key: 'cost-other-1-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-2',
        label: '二级菜单',
        children: [
          { key: 'cost-other-2-1', label: '三级菜单' },
          { key: 'cost-other-2-2', label: '三级菜单' },
          { key: 'cost-other-2-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-3',
        label: '二级菜单',
        children: [
          {
            key: 'cost-other-3-1',
            label: '三级菜单',
            children: [
              { key: 'cost-other-3-1-1', label: '四级菜单' },
              { key: 'cost-other-3-1-2', label: '四级菜单' },
              { key: 'cost-other-3-1-3', label: '四级菜单' }
            ]
          },
          {
            key: 'cost-other-3-2',
            label: '三级菜单',
            children: [
              { key: 'cost-other-3-2-1', label: '四级菜单' },
              { key: 'cost-other-3-2-2', label: '四级菜单' }
            ]
          },
          {
            key: 'cost-other-3-3',
            label: '三级菜单',
            children: [
              { key: 'cost-other-3-3-1', label: '四级菜单' },
              { key: 'cost-other-3-3-2', label: '四级菜单' }
            ]
          }
        ]
      },
      {
        key: 'cost-other-4',
        label: '二级菜单',
        children: [
          {
            key: 'cost-other-4-1',
            label: '三级菜单',
            children: [
              { key: 'cost-other-4-1-1', label: '四级菜单' },
              { key: 'cost-other-4-1-2', label: '四级菜单' },
              { key: 'cost-other-4-1-3', label: '四级菜单' }
            ]
          },
          {
            key: 'cost-other-4-2',
            label: '三级菜单',
            children: [
              { key: 'cost-other-4-2-1', label: '四级菜单' },
              { key: 'cost-other-4-2-2', label: '四级菜单' }
            ]
          },
          {
            key: 'cost-other-4-3',
            label: '三级菜单',
            children: [
              { key: 'cost-other-4-3-1', label: '四级菜单' },
              { key: 'cost-other-4-3-2', label: '四级菜单' }
            ]
          }
        ]
      },
      {
        key: 'cost-other-5',
        label: '二级菜单',
        children: [
          { key: 'cost-other-5-1', label: '三级菜单' },
          { key: 'cost-other-5-2', label: '三级菜单' },
          { key: 'cost-other-5-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-6',
        label: '二级菜单',
        children: [
          { key: 'cost-other-6-1', label: '三级菜单' },
          { key: 'cost-other-6-2', label: '三级菜单' },
          { key: 'cost-other-6-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-7',
        label: '二级菜单',
        children: [
          { key: 'cost-other-7-1', label: '三级菜单' },
          { key: 'cost-other-7-2', label: '三级菜单' },
          { key: 'cost-other-7-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-8',
        label: '二级菜单',
        children: [
          { key: 'cost-other-8-1', label: '三级菜单' },
          { key: 'cost-other-8-2', label: '三级菜单' },
          { key: 'cost-other-8-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-9',
        label: '二级菜单',
        children: [
          { key: 'cost-other-9-1', label: '三级菜单' },
          { key: 'cost-other-9-2', label: '三级菜单' },
          { key: 'cost-other-9-3', label: '三级菜单' }
        ]
      },
      {
        key: 'cost-other-10',
        label: '二级菜单',
        children: [
          { key: 'cost-other-10-1', label: '三级菜单' },
          { key: 'cost-other-10-2', label: '三级菜单' },
          { key: 'cost-other-10-3', label: '三级菜单' }
        ]
      }
    ]
  },
  {
    key: 'task',
    label: '任务中心',
    children: [{ key: 'task-home', label: '任务列表' }]
  },
  {
    key: 'org',
    label: '组织与基础数据',
    children: [{ key: 'org-home', label: '组织管理' }]
  }
]

export function findFirstLeaf(menu) {
  if (!menu) return null
  if ((!menu.children || !menu.children.length) && menu.key) return menu
  if (menu.children && menu.children.length) {
    for (let i = 0; i < menu.children.length; i++) {
      const leaf = findFirstLeaf(menu.children[i])
      if (leaf) return leaf
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
