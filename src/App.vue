<template>
  <div class="app-shell use-page-layout">
    <el-page-layout
      layout-mode="complex"
      :menu-data="navMenuData"
      :sider-collapsed="siderCollapsed"
      :active-menu-key="activeMenuKey"
      :user-theme-value="userThemeValue"
      :user-name="userName"
      :user-avatar="userAvatar"
      :user-menu-items="userMenuItems"
      :logo="logo"
      :content-padded="false"
      @action="onAction"
    >
      <div class="app-content-host">
        <main class="app-main">
          <task-center v-if="currentScreen === 'task-center'" />
          <dashboard v-else-if="currentScreen !== 'blank'" :mode="currentScreen" />
          <div v-else class="demo-blank" aria-hidden="true" />
        </main>
        <app-detail-drawers />
      </div>
    </el-page-layout>
    <novice-guide
      v-if="currentScreen === 'cockpit'"
      :active="currentScreen === 'cockpit'"
      :get-targets="getGuideTargets"
      @show="onGuideShow"
      @hide="onGuideHide"
      @dismiss="onGuideDismiss"
      @highlight="onGuideHighlight"
    />
  </div>
</template>

<script>
import { navMenuData, findMenuByKey } from '@/config/nav-menu'
import { actions } from '@/store'
import Dashboard from '@/views/Dashboard.vue'
import TaskCenter from '@/views/TaskCenter.vue'
import AppDetailDrawers from '@/components/detail/AppDetailDrawers.vue'
import NoviceGuide from '@/components/guide/NoviceGuide.vue'
import logo from '@/assets/images/logo.png'
import userAvatar from '@/assets/icons/icon-user.svg'

const LAYOUT_THEME_KEY = 'jdwl-layout-theme'

/** 演示用一级：点后切换左侧模块，内容区留空 */
const DEMO_TOP_KEYS = ['labor-mgmt', 'attend', 'pay', 'org-culture']

const SCREEN_MAP = {
  cockpit: { key: 'cockpit', label: '人力经营驾驶舱' },
  'labor-roi': { key: 'labor-roi', label: '人力成本ROI大屏' },
  'leak-screen': { key: 'leak-screen', label: '跑冒滴漏大屏' },
  'task-center': { key: 'task-mgmt', label: '成本诊断任务管理' }
}

function screenFromLocation() {
  const hash = (typeof location !== 'undefined' && location.hash) || ''
  const path = hash.replace(/^#/, '') || '/cockpit'
  if (path.indexOf('labor-roi') !== -1) return { screen: 'labor-roi', menuKey: null }
  if (path.indexOf('leak-screen') !== -1) return { screen: 'leak-screen', menuKey: null }
  if (path.indexOf('task-center') !== -1) return { screen: 'task-center', menuKey: null }
  for (let i = 0; i < DEMO_TOP_KEYS.length; i++) {
    const key = DEMO_TOP_KEYS[i]
    if (path.indexOf(key) !== -1) {
      const menu = findMenuByKey(navMenuData, key)
      const firstModule = menu && menu.children && menu.children[0]
      return {
        screen: 'blank',
        menuKey: (firstModule && firstModule.key) || key
      }
    }
  }
  return { screen: 'cockpit', menuKey: null }
}

export default {
  name: 'App',
  components: { Dashboard, TaskCenter, AppDetailDrawers, NoviceGuide },
  data() {
    const loc = screenFromLocation()
    return {
      navMenuData,
      logo,
      userAvatar,
      userName: '郝铭梓',
      siderCollapsed: false,
      userThemeValue: localStorage.getItem(LAYOUT_THEME_KEY) || 'white',
      userMenuItems: [
        { key: 'theme', label: '换肤', hasSubmenu: true },
        { key: 'center', label: '个人中心' },
        { key: 'logout', label: '退出登录' }
      ],
      currentScreen: loc.screen,
      menuKeyOverride: loc.menuKey
    }
  },
  computed: {
    activeMenuKey() {
      if (this.menuKeyOverride) return this.menuKeyOverride
      const screen = SCREEN_MAP[this.currentScreen]
      return (screen && screen.key) || 'cockpit'
    }
  },
  mounted() {
    window.addEventListener('hashchange', this.syncScreenFromHash)
  },
  beforeDestroy() {
    window.removeEventListener('hashchange', this.syncScreenFromHash)
  },
  methods: {
    syncScreenFromHash() {
      const loc = screenFromLocation()
      this.currentScreen = loc.screen
      this.menuKeyOverride = loc.menuKey
    },
    goScreen(screen) {
      const next = SCREEN_MAP[screen] ? screen : 'cockpit'
      this.menuKeyOverride = null
      this.currentScreen = next
      if (typeof location !== 'undefined') location.hash = '/' + next
    },
    /** 顶栏演示分类：切换左侧二级菜单，内容区为空 */
    goDemoSection(topKey) {
      const menu = findMenuByKey(navMenuData, topKey)
      const firstModule = menu && menu.children && menu.children[0]
      this.menuKeyOverride = (firstModule && firstModule.key) || topKey
      this.currentScreen = 'blank'
      if (typeof location !== 'undefined') location.hash = '/' + topKey
    },
    getGuideTargets() {
      const cards = document.querySelectorAll('.dashboard .switch-card.is-large')
      return Array.from(cards).map((el) => {
        const rect = el.getBoundingClientRect()
        return {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          right: rect.right,
          bottom: rect.bottom
        }
      })
    },
    onGuideShow() {
      actions.setGuideActive(true)
      actions.setTheme('labor')
    },
    onGuideHide() {
      actions.setGuideActive(false)
    },
    onGuideHighlight(index) {
      actions.setGuideCardIndex(index)
    },
    onGuideDismiss() {
      actions.setGuideActive(false)
      actions.setTheme('labor')
    },
    onAction(type, payload) {
      if (type === 'menu-select' && payload && payload.item) {
        const item = payload.item
        if (item.key === 'cost') {
          this.goScreen('cockpit')
          return
        }
        if (item.key === 'task') {
          this.goScreen('task-center')
          return
        }
        if (DEMO_TOP_KEYS.indexOf(item.key) !== -1) {
          this.goDemoSection(item.key)
          return
        }
        if (item.screen) {
          this.goScreen(item.screen)
          return
        }
        // 演示模块：切换高亮，内容区留空（有子级仍由布局展开）
        this.menuKeyOverride = item.key
        this.currentScreen = 'blank'
        return
      }

      if (type === 'theme-change') {
        this.userThemeValue = payload || 'white'
        localStorage.setItem(LAYOUT_THEME_KEY, this.userThemeValue)
        return
      }

      if (type === 'update:siderCollapsed') {
        this.siderCollapsed = !!payload
      }
    }
  }
}
</script>

<style>
.use-page-layout {
  height: 100%;
}
.use-page-layout .lui-page-layout,
.use-page-layout .lui-page-layout__body,
.use-page-layout .lui-page-layout__main,
.use-page-layout .lui-app-content {
  height: 100%;
  min-height: 0;
}
.use-page-layout .lui-app-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
}
.app-content-host {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.app-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.demo-blank {
  flex: 1;
  min-height: 0;
  background: transparent;
}
.use-page-layout .lui-app-header__logo {
  width: 151px;
  height: 32px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
}
</style>
