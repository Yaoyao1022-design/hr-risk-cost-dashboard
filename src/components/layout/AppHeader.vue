<template>
  <header class="header">
    <div class="header-left">
      <img class="logo" :src="logo" alt="JDL 人资管理平台" />
      <nav class="top-menu">
        <button
          v-for="item in menus"
          :key="item.id"
          class="top-menu-item"
          :class="{ active: item.active }"
          type="button"
        >
          <span>{{ item.label }}</span>
          <img v-if="item.dropdown" class="icon menu-caret" :src="arrowDown" alt="" />
        </button>
      </nav>
    </div>
    <div class="header-right">
      <div class="org-select" @click.stop="toggleOrg">
        <span :class="['placeholder', { filled: orgLabel }]">{{ orgLabel || '请选择' }}</span>
        <img class="icon" :src="dropdown" alt="" />
        <div v-if="orgOpen" class="dropdown-panel">
          <button
            v-for="item in orgOptions"
            :key="item"
            type="button"
            @click.stop="pickOrg(item)"
          >{{ item }}</button>
        </div>
      </div>
      <button class="tool-btn" type="button"><img class="icon" :src="notice" alt="通知" /></button>
      <button class="tool-btn" type="button"><img class="icon" :src="help" alt="帮助" /></button>
      <button class="user" type="button">
        <img class="avatar" :src="user" alt="" />
        <span>郝铭梓</span>
        <img class="icon" :src="arrowDown" alt="" />
      </button>
    </div>
  </header>
</template>

<script>
import { headerMenus } from '@/mock/data'
import logo from '@/assets/images/logo.png'
import arrowDown from '@/assets/icons/arrow-down.svg'
import dropdown from '@/assets/icons/icon-dropdown.svg'
import notice from '@/assets/icons/icon-notice.svg'
import help from '@/assets/icons/icon-help.svg'
import user from '@/assets/icons/icon-user.svg'

export default {
  name: 'AppHeader',
  data() {
    return {
      menus: headerMenus,
      logo,
      arrowDown,
      dropdown,
      notice,
      help,
      user,
      orgOpen: false,
      orgLabel: '',
      orgOptions: ['京东物流总部', '江苏分公司', '浙江分公司', '广东分公司']
    }
  },
  mounted() {
    document.addEventListener('click', this.closeOrg)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeOrg)
  },
  methods: {
    toggleOrg() {
      this.orgOpen = !this.orgOpen
    },
    closeOrg() {
      this.orgOpen = false
    },
    pickOrg(item) {
      this.orgLabel = item
      this.orgOpen = false
    }
  }
}
</script>

<style scoped>
.header {
  height: var(--header-h);
  background: #fff;
  border-bottom: 1px solid var(--grey-05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
  flex-shrink: 0;
  z-index: 20;
}
.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
}
.logo {
  width: 151px;
  height: 32px;
  object-fit: contain;
  image-rendering: -webkit-optimize-contrast;
  margin: 0 16px;
}
.top-menu {
  display: flex;
  align-items: stretch;
  height: 64px;
}
.top-menu-item {
  height: 64px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--grey-01);
  font-size: 14px;
  position: relative;
  white-space: nowrap;
}
.top-menu-item.active {
  color: var(--blue-06);
  font-weight: 500;
}
.top-menu-item.active::after {
  content: "";
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 0;
  height: 3px;
  background: var(--blue-06);
  border-radius: 2px 2px 0 0;
}
.menu-caret {
  width: 12px;
  height: 12px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.org-select {
  width: 255px;
  height: 32px;
  border: 1px solid var(--grey-05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  position: relative;
  cursor: pointer;
  background: #fff;
}
.placeholder {
  color: var(--grey-04);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.placeholder.filled {
  color: var(--grey-01);
}
.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.user {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 4px 0 8px;
  color: var(--grey-01);
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}
.dropdown-panel {
  position: absolute;
  top: 36px;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid var(--grey-05);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(35, 37, 43, 0.08);
  z-index: 30;
  padding: 4px;
}
.dropdown-panel button {
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--grey-01);
}
.dropdown-panel button:hover {
  background: #f5f8ff;
  color: var(--blue-06);
}
</style>
