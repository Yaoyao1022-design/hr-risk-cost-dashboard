/**
 * 演示阶段 true：
 * - 浏览器刷新 / 关闭后再进入 → 再次出现新手引导
 * - 应用内切换菜单再回到驾驶舱 → 不再出现（同一次页面生命周期内）
 *
 * 正式上线改为 false：点「知道了」后写入 localStorage，仅用户第一次打开出现。
 * 仍可用 ?guide=1 强制再次演示。
 */
export const DEMO_ALWAYS_SHOW_GUIDE = true
