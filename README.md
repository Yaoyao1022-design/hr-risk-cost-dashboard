# 人资风险成本诊断

人力经营驾驶舱 / 人力成本 ROI / 跑冒滴漏 演示看板（Vue 2 + Vite）。

## 在线预览

GitHub Pages：https://Yaoyao1022-design.github.io/hr-risk-cost-dashboard/

## 本地开发

```bash
npm install
npm run dev
```

依赖京东内网 npm（`@lui/*`）以及本地包 `jdl-board-kit`（`../看板组件库`）。

## 部署到 GitHub Pages

因 `@lui` 为内网包，需在能访问内网 registry 的环境本地构建后提交 `docs/`：

```bash
npm run build:pages
```

然后将 `docs/` 推送到 `main`，仓库 Settings → Pages 选择 Deploy from branch → `main` / `/docs`。
