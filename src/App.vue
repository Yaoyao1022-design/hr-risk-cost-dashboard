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
          <dashboard :mode="currentScreen" />
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
import { navMenuData } from '@/config/nav-menu'
import { actions } from '@/store'
import Dashboard from '@/views/Dashboard.vue'
import AppDetailDrawers from '@/components/detail/AppDetailDrawers.vue'
import NoviceGuide from '@/components/guide/NoviceGuide.vue'
import logo from '@/assets/images/logo.png'
import userAvatar from '@/assets/icons/icon-user.svg'

const LAYOUT_THEME_KEY = 'jdwl-layout-theme'

const SCREEN_MAP = {
  cockpit: { key: 'cockpit', label: '人力经营驾驶舱' },
  'labor-roi': { key: 'labor-roi', label: '人力成本ROI大屏' },
  'leak-screen': { key: 'leak-screen', label: '跑冒滴漏大屏' }
}

function screenFromLocation() {
  const hash = (typeof location !== 'undefined' && location.hash) || ''
  const path = hash.replace(/^#/, '') || '/cockpit'
  if (path.indexOf('labor-roi') !== -1) return 'labor-roi'
  if (path.indexOf('leak-screen') !== -1) return 'leak-screen'
  return 'cockpit'
}

export default {
  name: 'App',
  components: { Dashboard, AppDetailDrawers, NoviceGuide },
  data() {
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
      currentScreen: screenFromLocation()
    }
  },
  computed: {
    activeMenuKey() {
      return SCREEN_MAP[this.currentScreen].key
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
      this.currentScreen = screenFromLocation()
    },
    goScreen(screen) {
      const next = SCREEN_MAP[screen] ? screen : 'cockpit'
      this.currentScreen = next
      if (typeof location !== 'undefined') location.hash = '/' + next
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
        if (item.children && item.children.length) return
        if (item.screen || item.key === 'cockpit') {
          this.goScreen(item.screen || 'cockpit')
        }
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
.use-page-layout .lui-app-header__logo {
  width: 151px;
  height: 32px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
}
</style>
