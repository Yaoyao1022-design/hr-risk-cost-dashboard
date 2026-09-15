<template>
  <aside class="sidebar" :class="{ collapsed: store.sidebarCollapsed }">
    <div class="menu-wrap">
      <div class="menu-group">
        <button class="menu-item level-1 active" type="button" @click="toggleGroup('cockpit')">
          <span class="item-main">
            <img class="icon" :src="menuIcon" alt="" />
            <span v-if="!store.sidebarCollapsed">人力经营驾驶舱</span>
          </span>
          <img v-if="!store.sidebarCollapsed" class="caret" :class="{ open: groups.cockpit }" :src="arrow" alt="" />
        </button>
        <div v-show="groups.cockpit && !store.sidebarCollapsed" class="sub-group">
          <button class="menu-item level-2" type="button" @click="toggleGroup('board')">
            <span>数据看板</span>
            <img class="caret" :class="{ open: groups.board }" :src="arrow" alt="" />
          </button>
          <div v-show="groups.board" class="leaf-group">
            <button
              class="menu-item level-3"
              :class="{ current: store.theme === 'labor' }"
              type="button"
              @click="goTheme('labor')"
            >人力成本ROI大屏</button>
            <button
              class="menu-item level-3"
              :class="{ current: store.theme === 'leak' }"
              type="button"
              @click="goTheme('leak')"
            >跑冒滴漏大屏</button>
          </div>
        </div>
      </div>
      <div
        v-for="item in sideMenus"
        :key="item.key"
        class="menu-group"
      >
        <button
          class="menu-item level-1"
          type="button"
          @click="item.children ? toggleGroup(item.key) : null"
        >
          <span class="item-main">
            <img class="icon muted" :src="menuIcon" alt="" />
            <span v-if="!store.sidebarCollapsed">{{ item.label }}</span>
          </span>
          <img
            v-if="!store.sidebarCollapsed && item.children"
            class="caret"
            :class="{ open: groups[item.key] }"
            :src="arrow"
            alt=""
          />
          <img
            v-else-if="!store.sidebarCollapsed"
            class="caret"
            :src="arrow"
            alt=""
          />
        </button>
        <div
          v-if="item.children && groups[item.key] && !store.sidebarCollapsed"
          class="sub-group"
        >
          <button
            v-for="child in item.children"
            :key="child.key"
            class="menu-item level-2"
            type="button"
          >
            <span>{{ child.label }}</span>
          </button>
        </div>
      </div>
    </div>
    <button class="collapse-tab" type="button" @click="toggleCollapse">
      <img class="caret" :class="{ flipped: store.sidebarCollapsed }" :src="arrow" alt="" />
    </button>
  </aside>
</template>

<script>
import { store, actions } from '@/store'
import menuIcon from '@/assets/icons/icon-menu.svg'
import arrow from '@/assets/icons/icon-arrow-menu.svg'

const SIDE_MENUS = [
  { key: 'cost-other-1', label: '二级菜单' },
  { key: 'cost-other-2', label: '二级菜单' },
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
  { key: 'cost-other-5', label: '二级菜单' },
  { key: 'cost-other-6', label: '二级菜单' },
  { key: 'cost-other-7', label: '二级菜单' },
  { key: 'cost-other-8', label: '二级菜单' },
  { key: 'cost-other-9', label: '二级菜单' },
  { key: 'cost-other-10', label: '二级菜单' }
]

export default {
  name: 'AppSidebar',
  data() {
    return {
      store,
      menuIcon,
      arrow,
      sideMenus: SIDE_MENUS,
      groups: {
        cockpit: true,
        board: true,
        'cost-other-3': false,
        'cost-other-4': false
      }
    }
  },
  methods: {
    toggleGroup(key) {
      this.$set(this.groups, key, !this.groups[key])
    },
    goTheme(theme) {
      actions.setTheme(theme)
    },
    toggleCollapse() {
      store.sidebarCollapsed = !store.sidebarCollapsed
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-w);
  background: #fff;
  border-right: 1px solid var(--grey-05);
  position: relative;
  flex-shrink: 0;
  padding: 8px;
  transition: width 0.2s ease;
}
.sidebar.collapsed {
  width: 56px;
}
.menu-wrap {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.menu-item {
  width: 100%;
  min-height: 40px;
  padding: 0 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--grey-01);
  text-align: left;
}
.item-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.item-main span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.menu-item.level-1.active {
  color: var(--blue-06);
  font-weight: 500;
}
.menu-item.level-2 {
  padding-left: 32px;
  color: var(--grey-02);
}
.menu-item.level-3 {
  padding-left: 44px;
  color: var(--grey-02);
  font-size: 13px;
}
.menu-item.current {
  color: var(--blue-06);
  background: #f3f7ff;
}
.caret {
  width: 12px;
  height: 12px;
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}
.caret.open {
  transform: rotate(0deg);
}
.caret.flipped {
  transform: rotate(-90deg);
}
.icon.muted {
  opacity: 0.55;
}
.collapse-tab {
  position: absolute;
  top: 50%;
  right: -10px;
  width: 10px;
  height: 56px;
  background: #fff;
  border: 1px solid var(--grey-05);
  border-left: 0;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
}
</style>
