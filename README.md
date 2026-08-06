# WisePenView-Portal

WisePen 门户前端仓库，基于 React、Vite、TypeScript、HeroUI 与 Less CSS Modules。

当前入口只保留外部门户页面：

- `/`

## 快速开始

```bash
pnpm install
cp .env.example .env.production
pnpm build
```

构建产物位于 `dist/`，可作为纯静态资源部署。

## 常用命令

- `pnpm build`：构建产物
- `pnpm lint`：执行 ESLint
- `pnpm typecheck`：执行 TypeScript 检查
- `pnpm preview`：预览构建产物
